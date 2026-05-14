// Touch Screen 1 — /screen/1
// Code entry, then teacher control surface during the session.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sessionChannel } from "@/lib/realtime";
import { sounds } from "@/lib/audio";
import { CodeEntry } from "@/components/CodeEntry";
import { SlotRenderer, type SlotContent } from "@/components/SlotRenderer";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const Route = createFileRoute("/screen/1")({
  head: () => ({ meta: [{ title: "Touch Screen 1 · Immersive Learning" }] }),
  component: () => <ScreenJoin role="screen1" />,
});

type SessionRow = {
  id: string;
  status: "waiting" | "active" | "ended";
  state: { slot?: { host?: SlotContent; screen1?: SlotContent; screen2?: SlotContent } };
  screen1_connected: boolean;
  screen2_connected: boolean;
};

export function ScreenJoin({ role }: { role: "screen1" | "screen2" }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<SessionRow | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const codeColumn = role === "screen1" ? "screen1_code" : "screen2_code";
  const connectedColumn = role === "screen1" ? "screen1_connected" : "screen2_connected";
  const label = role === "screen1" ? "Touch Screen 1" : "Touch Screen 2";

  const join = async (code: string) => {
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("sessions")
      .select("id, status")
      .eq(codeColumn, code)
      .neq("status", "ended")
      .maybeSingle();
    if (err || !data) {
      setBusy(false);
      setError("Code not recognised");
      return;
    }
    const { error: upErr } = await supabase
      .from("sessions")
      .update({ [connectedColumn]: true })
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
          else if (prev && JSON.stringify(prev.state) !== JSON.stringify(next.state)) sounds.slotAdvance();
          return next;
        });
      },
    );
    ch.subscribe();

    // Mark disconnected on leave
    const onLeave = () => {
      supabase.from("sessions").update({ [connectedColumn]: false }).eq("id", sessionId);
    };
    window.addEventListener("beforeunload", onLeave);

    return () => {
      cancelled = true;
      window.removeEventListener("beforeunload", onLeave);
      onLeave();
      supabase.removeChannel(ch);
    };
  }, [sessionId, connectedColumn]);

  if (!sessionId) {
    return <CodeEntry screenLabel={label} onSubmit={join} error={error} busy={busy} />;
  }

  if (!session || session.status === "waiting") {
    return (
      <div className="min-h-screen bg-immersive bg-grid flex flex-col items-center justify-center p-10">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)] mb-6">{label} · Connected</div>
        <div className="text-5xl font-extrabold text-glow text-center">Waiting for Host to launch…</div>
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <div className="min-h-screen bg-immersive flex items-center justify-center">
        <div className="text-4xl font-extrabold text-glow">Session ended</div>
      </div>
    );
  }

  const content = (role === "screen1" ? session.state?.slot?.screen1 : session.state?.slot?.screen2) ?? { type: "waiting" };
  return <SlotRenderer content={content} screen={role} />;
}
