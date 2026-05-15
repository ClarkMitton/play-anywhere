// Host screen — /host
// Always-on 300" main display.
// Waiting: shows connection codes + 60s countdown (Step 13 adaptive).
// Active: full-screen slot content; one_screen_mode splits host/screen2 60/40.
// Ended: SessionEndScreen with QR feedback code (Step 12).

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/codes";
import { sessionChannel } from "@/lib/realtime";
import { sounds } from "@/lib/audio";
import { StatusDot } from "@/components/StatusDot";
import { SlotRenderer, type SlotContent } from "@/components/SlotRenderer";
import { SessionEndScreen } from "@/components/SessionEndScreen";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host · Immersive Learning" },
      { name: "description", content: "Host display for Bradford College Immersive Learning." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session: typeof search.session === "string" ? search.session : undefined,
  }),
  component: HostScreen,
});

type SessionRow = {
  id: string;
  lesson_id: string | null;
  host_code: string;
  screen1_code: string;
  screen2_code: string;
  status: "waiting" | "active" | "ended";
  current_slot_index: number;
  screen1_connected: boolean;
  screen2_connected: boolean;
  one_screen_mode: boolean;
  created_at: string;
  ended_at: string | null;
  state: { slot?: { host?: SlotContent; screen1?: SlotContent; screen2?: SlotContent } };
};

type LessonMeta = {
  title: string;
  ms_form_url: string | null;
  slot_count: number;
};

const SCREEN2_WAIT_SECS = 60;

function HostScreen() {
  const { session: sessionParam } = Route.useSearch();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionRow | null>(null);
  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Step 13: 60-second countdown before one-screen mode prompt
  const [countdownSecs, setCountdownSecs] = useState(SCREEN2_WAIT_SECS);
  const [countdownDone, setCountdownDone] = useState(false);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load or create session ─────────────────────

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (sessionParam) {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", sessionParam)
          .single();
        if (cancelled) return;
        if (error) { console.error(error); return; }
        setSession(data as SessionRow);
      } else {
        const { data, error } = await supabase
          .from("sessions")
          .insert({
            host_code: generateCode(),
            screen1_code: generateCode(),
            screen2_code: generateCode(),
            status: "waiting",
            state: {},
          })
          .select()
          .single();
        if (cancelled) return;
        if (error) { console.error(error); return; }
        setSession(data as SessionRow);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionParam]);

  // ── Load lesson metadata when session has lesson_id ─

  useEffect(() => {
    if (!session?.lesson_id) return;
    let cancelled = false;
    (async () => {
      const [{ data: lesson }, { count }] = await Promise.all([
        supabase
          .from("lessons")
          .select("title, ms_form_url")
          .eq("id", session.lesson_id!)
          .single(),
        supabase
          .from("slots")
          .select("id", { count: "exact", head: true })
          .eq("lesson_id", session.lesson_id!)
          .is("session_id", null),
      ]);
      if (cancelled) return;
      if (lesson) {
        setLessonMeta({
          title: (lesson as { title: string; ms_form_url: string | null }).title,
          ms_form_url: (lesson as { title: string; ms_form_url: string | null }).ms_form_url,
          slot_count: count ?? 0,
        });
      }
    })();
    return () => { cancelled = true; };
  }, [session?.lesson_id]);

  // ── Realtime subscription ───────────────────────

  useEffect(() => {
    if (!session) return;
    const ch = sessionChannel(session.id);
    channelRef.current = ch;

    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${session.id}` },
      (payload) => {
        const next = payload.new as SessionRow;
        setSession((prev) => {
          if (prev && !prev.screen1_connected && next.screen1_connected) sounds.connect();
          if (prev && !prev.screen2_connected && next.screen2_connected) sounds.connect();
          return next;
        });
      },
    );
    ch.subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [session?.id]);

  // ── Step 13: 60s countdown ─────────────────────

  useEffect(() => {
    if (!session || session.status !== "waiting" || session.screen2_connected) return;

    // Reset and start countdown
    setCountdownSecs(SCREEN2_WAIT_SECS);
    setCountdownDone(false);

    const startTime = Date.now();
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, SCREEN2_WAIT_SECS - elapsed);
      setCountdownSecs(remaining);
      if (remaining === 0) {
        clearInterval(countdownIntervalRef.current!);
        setCountdownDone(true);
      }
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  // Restart only when session id changes or screen2 connects (to cancel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  // Cancel countdown when screen2 connects
  useEffect(() => {
    if (session?.screen2_connected) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setCountdownDone(false);
    }
  }, [session?.screen2_connected]);

  // ── Session actions ─────────────────────────────

  const launch = async () => {
    if (!session) return;
    sounds.launch();
    await supabase
      .from("sessions")
      .update({
        status: "active",
        current_slot_index: 0,
        state: {
          slot: {
            host: { type: "text_slide", text: "Welcome", size: "xl" },
            screen1: { type: "teacher_note", text: "Sync test live ✓\nUse the buttons below to push different slides." },
            screen2: { type: "text_slide", text: "Tap to begin", size: "lg" },
          },
        } as never,
      })
      .eq("id", session.id);
  };

  const startOneScreen = async () => {
    if (!session) return;
    sounds.launch();
    await supabase
      .from("sessions")
      .update({
        one_screen_mode: true,
        status: "active",
        current_slot_index: 0,
        state: {
          slot: {
            host: { type: "text_slide", text: "Welcome", size: "xl" },
            screen1: { type: "teacher_note", text: "Running in one-screen mode." },
            screen2: { type: "text_slide", text: "Tap to begin", size: "lg" },
          },
        } as never,
      })
      .eq("id", session.id);
  };

  const keepWaiting = () => {
    setCountdownDone(false);
    setCountdownSecs(SCREEN2_WAIT_SECS);
    const startTime = Date.now();
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, SCREEN2_WAIT_SECS - elapsed);
      setCountdownSecs(remaining);
      if (remaining === 0) {
        clearInterval(countdownIntervalRef.current!);
        setCountdownDone(true);
      }
    }, 1000);
  };

  const endSession = async () => {
    if (!session) return;
    await supabase
      .from("sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", session.id);
  };

  // Sync-test content push (temporary until real slot timeline is wired)
  const pushTest = async (label: string) => {
    if (!session) return;
    sounds.slotAdvance();
    await supabase
      .from("sessions")
      .update({
        state: {
          slot: {
            host: { type: "text_slide", text: label.toUpperCase(), size: "xl" },
            screen1: { type: "teacher_note", text: `Now showing: ${label}` },
            screen2: { type: "text_slide", text: label, size: "lg", color: "var(--orange)" },
          },
        } as never,
      })
      .eq("id", session.id);
  };

  // Resolve origin AFTER hydration to avoid SSR/CSR mismatch
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const screen1Url = `${origin}/screen/1`;
  const screen2Url = `${origin}/screen/2`;
  const bothConnected = !!session?.screen1_connected && !!session?.screen2_connected;

  // ── Ended ──────────────────────────────────────

  if (session?.status === "ended") {
    return (
      <SessionEndScreen
        screen="host"
        lessonTitle={lessonMeta?.title ?? null}
        slotsCompleted={session.current_slot_index}
        slotsTotal={lessonMeta?.slot_count ?? 0}
        createdAt={session.created_at}
        endedAt={session.ended_at}
        msFeedbackUrl={lessonMeta?.ms_form_url ?? null}
        channel={channelRef.current ?? undefined}
        onDismiss={() => navigate({ to: "/" })}
      />
    );
  }

  // ── Active (one_screen_mode split) ─────────────

  if (session?.status === "active" && session.one_screen_mode) {
    const hostContent = session.state?.slot?.host ?? { type: "waiting" };
    const screen2Content = session.state?.slot?.screen2 ?? { type: "waiting" };
    return (
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* One-screen mode banner */}
        <div className="shrink-0 bg-[color:var(--orange)]/20 border-b border-[color:var(--orange)]/40 px-6 py-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[color:var(--orange)] font-bold">
            One-screen mode
          </span>
          <Button size="sm" variant="destructive" onClick={endSession}>End session</Button>
        </div>
        {/* Top 60% — host content */}
        <div className="relative" style={{ flex: "0 0 60%" }}>
          <SlotRenderer
            content={hostContent}
            screen="host"
            muted={false}
            sessionId={session.id}
            channel={channelRef.current ?? undefined}
          />
        </div>
        {/* Bottom 40% — screen2 content */}
        <div className="relative border-t-2 border-[color:var(--cyan)]/30" style={{ flex: "0 0 40%" }}>
          <div className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-[color:var(--cyan)] opacity-60 z-10">
            Touch Screen 2 view
          </div>
          <SlotRenderer
            content={screen2Content}
            screen="screen2"
            muted={true}
            sessionId={session.id}
            channel={channelRef.current ?? undefined}
          />
        </div>
      </div>
    );
  }

  // ── Active (normal full-screen) ─────────────────

  if (session?.status === "active") {
    const content = session.state?.slot?.host ?? { type: "waiting" };
    return (
      <div className="relative">
        <SlotRenderer
          content={content}
          screen="host"
          muted={false}
          sessionId={session.id}
          channel={channelRef.current ?? undefined}
        />
        {/* Floating control bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 opacity-20 hover:opacity-100 transition-opacity z-50">
          <div className="mx-auto max-w-4xl bg-card/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 flex items-center justify-between gap-4">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Sync test</div>
            <div className="flex gap-2">
              {["Welcome", "Question 1", "Discuss", "Reveal"].map((l) => (
                <Button key={l} size="sm" variant="outline" onClick={() => pushTest(l)}>{l}</Button>
              ))}
            </div>
            <Button size="sm" variant="destructive" onClick={endSession}>End</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Waiting ────────────────────────────────────

  return (
    <div className="min-h-screen bg-immersive bg-grid p-8">
      <header className="flex items-center justify-between mb-12">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Bradford College · Host</div>
          <h1 className="text-4xl font-extrabold mt-1 text-glow">Immersive Learning</h1>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Session</div>
          <div className="text-sm font-mono text-muted-foreground">{session?.id?.slice(0, 8) ?? "…"}</div>
        </div>
      </header>

      <main className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <CodeCard
          label="Touch Screen 1"
          code={session?.screen1_code}
          url={screen1Url}
          connected={!!session?.screen1_connected}
        />
        <CodeCard
          label="Touch Screen 2"
          code={session?.screen2_code}
          url={screen2Url}
          connected={!!session?.screen2_connected}
        />
      </main>

      {/* Step 13: timeout banner or normal launch button */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        {countdownDone && !session?.screen2_connected ? (
          // ── Screen 2 timeout banner ──
          <div className="animate-slot-in space-y-6">
            <div className="text-[color:var(--orange)] text-xl font-bold uppercase tracking-widest">
              Touch Screen 2 hasn't connected
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={keepWaiting}
                variant="outline"
                className="h-14 px-8 text-lg uppercase tracking-widest"
              >
                Keep waiting
              </Button>
              <Button
                onClick={startOneScreen}
                disabled={!session?.screen1_connected}
                className="h-14 px-8 text-lg uppercase tracking-widest font-extrabold disabled:opacity-30"
              >
                Start with one screen
              </Button>
            </div>
          </div>
        ) : (
          // ── Normal launch button ──
          <div className="space-y-4">
            <Button
              onClick={launch}
              disabled={!bothConnected}
              className="h-20 px-16 text-2xl uppercase tracking-widest font-extrabold disabled:opacity-30"
            >
              {bothConnected ? "Launch Session" : "Waiting for both screens…"}
            </Button>
            {/* Countdown shown when screen2 hasn't connected */}
            {!session?.screen2_connected && !countdownDone && session?.status === "waiting" && (
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                One-screen mode available in {countdownSecs}s
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CodeCard({ label, code, url, connected }: { label: string; code?: string; url: string; connected: boolean }) {
  return (
    <div className="bg-card/60 backdrop-blur border-2 border-border rounded-3xl p-10 text-center animate-slot-in">
      <StatusDot connected={connected} label={label} />
      <div className="my-8">
        <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Enter this code</div>
        <div className="code-display text-7xl text-[color:var(--cyan)] text-glow">{code ?? "······"}</div>
      </div>
      <div className="text-sm text-muted-foreground break-all">{url}</div>
    </div>
  );
}
