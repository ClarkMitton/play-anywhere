// Host screen — /host
// Always-on 300" main display. Shows connection codes for both Touch Screens
// before launch, then renders Host slot content fullscreen during the session.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/codes";
import { sessionChannel } from "@/lib/realtime";
import { sounds } from "@/lib/audio";
import { StatusDot } from "@/components/StatusDot";
import { SlotRenderer, type SlotContent } from "@/components/SlotRenderer";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host · Immersive Learning" },
      { name: "description", content: "Host display for Bradford College Immersive Learning." },
    ],
  }),
  component: HostScreen,
});

type SessionRow = {
  id: string;
  host_code: string;
  screen1_code: string;
  screen2_code: string;
  status: "waiting" | "active" | "ended";
  current_slot_index: number;
  screen1_connected: boolean;
  screen2_connected: boolean;
  one_screen_mode: boolean;
  state: { slot?: { host?: SlotContent; screen1?: SlotContent; screen2?: SlotContent } };
};

function HostScreen() {
  const [session, setSession] = useState<SessionRow | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Create session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
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
    })();
    return () => { cancelled = true; };
  }, []);

  // Subscribe to row changes + broadcast channel
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

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const screen1Url = `${origin}/screen/1`;
  const screen2Url = `${origin}/screen/2`;

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

  // Sync-test buttons (temporary, will be replaced by real slot timeline)
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

  const endSession = async () => {
    if (!session) return;
    await supabase.from("sessions").update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", session.id);
  };

  const bothConnected = !!session?.screen1_connected && !!session?.screen2_connected;

  // Active session view
  if (session?.status === "active") {
    const content = session.state?.slot?.host ?? { type: "waiting" };
    return (
      <div className="relative">
        <SlotRenderer content={content} screen="host" muted={false} />
        {/* Floating control bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 opacity-20 hover:opacity-100 transition-opacity">
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

  if (session?.status === "ended") {
    return (
      <div className="min-h-screen bg-immersive bg-grid flex items-center justify-center">
        <div className="text-center animate-slot-in">
          <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--orange)] mb-4">Session ended</div>
          <div className="text-7xl font-extrabold text-glow mb-8">Thank you</div>
          <Button onClick={() => window.location.reload()} className="h-14 px-8 text-lg uppercase tracking-widest">New Session</Button>
        </div>
      </div>
    );
  }

  // Waiting / connection view
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

      <div className="max-w-6xl mx-auto mt-16 text-center">
        <Button
          onClick={launch}
          disabled={!bothConnected}
          className="h-20 px-16 text-2xl uppercase tracking-widest font-extrabold disabled:opacity-30"
        >
          {bothConnected ? "Launch Session" : "Waiting for both screens…"}
        </Button>
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
