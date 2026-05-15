// Touch Screen 1 — /screen/1
// Code entry, then teacher control surface during the session.
// Step 12: End Session button with confirmation; SessionEndScreen on end.
// Step 13: Blocks joining if session is already in one_screen_mode.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sessionChannel } from "@/lib/realtime";
import { sounds } from "@/lib/audio";
import { CodeEntry } from "@/components/CodeEntry";
import { SlotRenderer, type SlotContent } from "@/components/SlotRenderer";
import { SessionEndScreen } from "@/components/SessionEndScreen";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const Route = createFileRoute("/screen/1")({
  head: () => ({ meta: [{ title: "Touch Screen 1 · Immersive Learning" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  component: () => {
    const { code } = Route.useSearch();
    return <ScreenJoin role="screen1" autoCode={code} />;
  },
});

type SessionRow = {
  id: string;
  lesson_id: string | null;
  status: "waiting" | "active" | "ended";
  one_screen_mode: boolean;
  current_slot_index: number;
  created_at: string;
  ended_at: string | null;
  state: { slot?: { host?: SlotContent; screen1?: SlotContent; screen2?: SlotContent } };
  screen1_connected: boolean;
  screen2_connected: boolean;
};

type LessonMeta = {
  title: string;
  ms_form_url: string | null;
  slot_count: number;
};

export function ScreenJoin({ role, autoCode }: { role: "screen1" | "screen2"; autoCode?: string }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const autoJoinedRef = useRef(false);
  const [session, setSession] = useState<SessionRow | null>(null);
  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const codeColumn = role === "screen1" ? "screen1_code" : "screen2_code";
  const connectedColumn = role === "screen1" ? "screen1_connected" : "screen2_connected";
  const label = role === "screen1" ? "Touch Screen 1" : "Touch Screen 2";

  const markConnected = async (id: string) => {
    await supabase
      .from("sessions")
      .update({ [connectedColumn]: true } as never)
      .eq("id", id);
  };

  const join = async (code: string) => {
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("sessions")
      .select("id, status, one_screen_mode")
      .eq(codeColumn, code)
      .neq("status", "ended")
      .maybeSingle();
    if (err || !data) {
      setBusy(false);
      setError("Code not recognised");
      return;
    }
    // Step 13: block TS2 joining an active one_screen_mode session
    if (role === "screen2" && data.one_screen_mode && data.status === "active") {
      setBusy(false);
      setError("one_screen_mode");
      return;
    }
    const { error: upErr } = await supabase
      .from("sessions")
      .update({ [connectedColumn]: true } as never)
      .eq("id", data.id);
    if (upErr) {
      setBusy(false);
      setError("Could not connect — try again");
      return;
    }
    sounds.connect();
    setSessionId(data.id);
    setBusy(false);
  };

  // Auto-join via ?code= URL param (used by admin Test Mode)
  useEffect(() => {
    if (autoCode && !sessionId && !autoJoinedRef.current) {
      autoJoinedRef.current = true;
      join(autoCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCode]);

  // Subscribe once joined
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("sessions").select("*").eq("id", sessionId).single();
      if (!cancelled && data) setSession(data as SessionRow);
    })();
    const ch = sessionChannel(sessionId);
    channelRef.current = ch;
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
      (payload) => {
        setSession((prev) => {
          const next = payload.new as SessionRow;
          if (prev?.status === "waiting" && next.status === "active") sounds.launch();
          else if (prev && JSON.stringify(prev.state) !== JSON.stringify(next.state))
            sounds.slotAdvance();
          return next;
        });
      },
    );
    ch.subscribe();

    markConnected(sessionId);
    const keepAlive = window.setInterval(() => markConnected(sessionId), 4000);

    return () => {
      cancelled = true;
      window.clearInterval(keepAlive);
      supabase.removeChannel(ch);
    };
  }, [sessionId, connectedColumn]);

  // Load lesson metadata when session has a lesson_id
  useEffect(() => {
    if (!session?.lesson_id) return;
    let cancelled = false;
    (async () => {
      const [{ data: lesson }, { count }] = await Promise.all([
        supabase.from("lessons").select("title, ms_form_url").eq("id", session.lesson_id!).single(),
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
    return () => {
      cancelled = true;
    };
  }, [session?.lesson_id]);

  const handleEndSession = async () => {
    if (!sessionId) return;
    setConfirmEnd(false);
    await supabase
      .from("sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", sessionId);
  };

  // ── Code not recognised — one_screen_mode special case ──
  if (error === "one_screen_mode") {
    return (
      <div className="min-h-screen bg-immersive bg-grid flex flex-col items-center justify-center p-12 text-center">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--orange)] mb-6">
          Session in progress
        </div>
        <div className="text-4xl font-extrabold text-glow mb-6">
          Session already running in one-screen mode
        </div>
        <p className="text-muted-foreground text-lg max-w-lg">
          Ask your teacher to start a new session.
        </p>
      </div>
    );
  }

  if (!sessionId) {
    return <CodeEntry screenLabel={label} onSubmit={join} error={error} busy={busy} />;
  }

  if (!session || session.status === "waiting") {
    return (
      <div className="min-h-screen bg-immersive bg-grid flex flex-col items-center justify-center p-10">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)] mb-6">
          {label} · Connected
        </div>
        <div className="text-5xl font-extrabold text-glow text-center">
          Waiting for Host to launch…
        </div>
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <SessionEndScreen
        screen={role as "screen1" | "screen2"}
        lessonTitle={lessonMeta?.title ?? null}
        slotsCompleted={session.current_slot_index}
        slotsTotal={lessonMeta?.slot_count ?? 0}
        createdAt={session.created_at}
        endedAt={session.ended_at}
        msFeedbackUrl={lessonMeta?.ms_form_url ?? null}
        channel={channelRef.current ?? undefined}
        onDismiss={() => window.location.assign("/")}
      />
    );
  }

  const content = (role === "screen1"
    ? session.state?.slot?.screen1
    : session.state?.slot?.screen2) ?? { type: "waiting" };

  return (
    <div className="relative">
      <SlotRenderer
        content={content}
        screen={role}
        sessionId={sessionId ?? undefined}
        channel={channelRef.current ?? undefined}
      />

      {/* Step 12: End Session button — TS1 only, floating */}
      {role === "screen1" && (
        <>
          <div className="fixed top-4 right-4 z-50 opacity-20 hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setConfirmEnd(true)}
              className="uppercase tracking-widest text-[10px] h-9 px-4"
            >
              End session
            </Button>
          </div>

          {/* Confirmation dialog */}
          {confirmEnd && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-card border-2 border-[color:var(--orange)] rounded-3xl p-10 max-w-md w-full text-center animate-slot-in">
                <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--orange)] mb-4">
                  Confirm
                </div>
                <h2 className="text-3xl font-extrabold mb-4">End this session?</h2>
                <p className="text-muted-foreground mb-8">
                  All screens will show the session summary and the session cannot be resumed.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmEnd(false)}
                    className="h-14 px-8 uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleEndSession}
                    className="h-14 px-8 uppercase tracking-widest font-extrabold"
                  >
                    End session
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
