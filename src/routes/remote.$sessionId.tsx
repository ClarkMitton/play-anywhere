// Host Remote Control — /remote/$sessionId
// Mobile-friendly control surface the host scans via QR from the Host display.
// Allows independent Prev/Next on each of the three screens (Host, TS1, TS2),
// plus an "All together" row that advances every screen at once.
//
// State model (stored in sessions.state JSONB):
//   state.slot    = { host, screen1, screen2 }     // current content per screen
//   state.indices = { host, screen1, screen2 }     // current slot index per screen
// Each Prev/Next mutates ONE screen's index + content, leaving the others alone.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sessionChannel } from "@/lib/realtime";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";


export const Route = createFileRoute("/remote/$sessionId")({
  head: () => ({ meta: [{ title: "Host Remote · Immersive Learning" }] }),
  component: RemotePage,
});

type ContentDef = { type: string; [k: string]: unknown };
type ScreenKey = "host" | "screen1" | "screen2";

type SlotRow = {
  id: string;
  order_index: number;
  screen_delay_secs: number;
  host_content: ContentDef;
  screen1_content: ContentDef;
  screen2_content: ContentDef;
};

type SessionRow = {
  id: string;
  lesson_id: string | null;
  status: "waiting" | "active" | "ended";
  current_slot_index: number;
  state: {
    slot?: { host?: ContentDef; screen1?: ContentDef; screen2?: ContentDef };
    indices?: { host?: number; screen1?: number; screen2?: number };
  };
};

const SCREEN_LABELS: Record<ScreenKey, string> = {
  host: "Host Display",
  screen1: "Touch Screen 1",
  screen2: "Touch Screen 2",
};

const SCREEN_ACCENTS: Record<ScreenKey, string> = {
  host: "var(--cyan)",
  screen1: "var(--success)",
  screen2: "var(--orange)",
};

function contentLabel(c: ContentDef | undefined): string {
  if (!c || !c.type || c.type === "waiting") return "Waiting";
  return c.type.replace(/_/g, " ");
}

function RemotePage() {
  const { sessionId } = Route.useParams();
  const [session, setSession] = useState<SessionRow | null>(null);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Timer composer state
  const [tMin, setTMin] = useState(1);
  const [tSec, setTSec] = useState(0);
  const [timerSetFlash, setTimerSetFlash] = useState(false);

  // Load session + slots
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: s } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      if (cancelled || !s) return;
      setSession(s as SessionRow);

      if (s.lesson_id) {
        const { data: sl } = await supabase
          .from("slots")
          .select("id, order_index, screen_delay_secs, host_content, screen1_content, screen2_content")
          .eq("lesson_id", s.lesson_id)
          .is("session_id", null)
          .order("order_index");
        if (!cancelled && sl) setSlots(sl as unknown as SlotRow[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Realtime: stay in sync with the session row
  useEffect(() => {
    const ch = sessionChannel(sessionId);
    channelRef.current = ch;
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
      (payload) => setSession(payload.new as SessionRow),
    );
    ch.subscribe();
    return () => {
      channelRef.current = null;
      supabase.removeChannel(ch);
    };
  }, [sessionId]);

  // Timer broadcast helpers
  const sendTimer = useCallback(async (seconds: number) => {
    const ch = channelRef.current;
    if (!ch) return;
    await ch.send({ type: "broadcast", event: "timer_set", payload: { seconds } });
    setTimerSetFlash(true);
    window.setTimeout(() => setTimerSetFlash(false), 900);
  }, []);
  const addMinute = useCallback(async () => {
    const ch = channelRef.current;
    if (!ch) return;
    await ch.send({ type: "broadcast", event: "timer_add", payload: { seconds: 60 } });
  }, []);
  const clearTimer = useCallback(async () => {
    const ch = channelRef.current;
    if (!ch) return;
    await ch.send({ type: "broadcast", event: "timer_clear", payload: {} });
  }, []);

  const bumpSec = (delta: number) => {
    let total = tMin * 60 + tSec + delta;
    if (total < 0) total = 0;
    if (total > 99 * 60 + 45) total = 99 * 60 + 45;
    setTMin(Math.floor(total / 60));
    setTSec(total % 60);
  };
  const bumpMin = (delta: number) => {
    let m = tMin + delta;
    if (m < 0) m = 0;
    if (m > 99) m = 99;
    setTMin(m);
  };

  const indices = session?.state?.indices ?? {};
  const currentIndex = (k: ScreenKey): number => {
    const v = indices[k];
    if (typeof v === "number") return v;
    return session?.current_slot_index ?? 0;
  };

  const move = useCallback(
    async (screen: ScreenKey, delta: number) => {
      if (!session || slots.length === 0 || busy) return;
      const cur = currentIndex(screen);
      const next = Math.max(0, Math.min(slots.length - 1, cur + delta));
      if (next === cur) return;
      const slot = slots[next];
      const contentKey =
        screen === "host"
          ? "host_content"
          : screen === "screen1"
            ? "screen1_content"
            : "screen2_content";
      const newContent = slot[contentKey];

      const prevSlot = session.state?.slot ?? {};
      const prevIdx = session.state?.indices ?? {};
      setBusy(true);
      await supabase
        .from("sessions")
        .update({
          state: {
            ...session.state,
            slot: { ...prevSlot, [screen]: newContent },
            indices: { ...prevIdx, [screen]: next },
            screen_delay_secs: slot.screen_delay_secs ?? 0,
          } as never,
        })
        .eq("id", session.id);
      setBusy(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, slots, busy],
  );

  const moveAll = useCallback(
    async (delta: number) => {
      if (!session || slots.length === 0 || busy) return;
      const cur = Math.max(currentIndex("host"), currentIndex("screen1"), currentIndex("screen2"));
      const next = Math.max(0, Math.min(slots.length - 1, cur + delta));
      const slot = slots[next];
      setBusy(true);
      await supabase
        .from("sessions")
        .update({
          current_slot_index: next,
          state: {
            slot: {
              host: slot.host_content,
              screen1: slot.screen1_content,
              screen2: slot.screen2_content,
            },
            indices: { host: next, screen1: next, screen2: next },
            screen_delay_secs: slot.screen_delay_secs ?? 0,
          } as never,
        })
        .eq("id", session.id);
      setBusy(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, slots, busy],
  );

  const endSession = useCallback(async () => {
    if (!session) return;
    setBusy(true);
    await supabase
      .from("sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", session.id);
    setBusy(false);
    setEndConfirm(false);
  }, [session]);

  const launchSession = useCallback(async () => {
    if (!session || slots.length === 0 || busy) return;
    const slot = slots[0];
    setBusy(true);
    await supabase
      .from("sessions")
      .update({
        status: "active",
        current_slot_index: 0,
        state: {
          slot: {
            host: slot.host_content,
            screen1: slot.screen1_content,
            screen2: slot.screen2_content,
          },
          indices: { host: 0, screen1: 0, screen2: 0 },
          screen_delay_secs: slot.screen_delay_secs ?? 0,
        } as never,
      })
      .eq("id", session.id);
    setBusy(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, slots, busy]);

  // ── Render ─────────────────────────────────────

  if (!session) {
    return (
      <div className="min-h-screen bg-immersive flex items-center justify-center text-muted-foreground">
        Loading session…
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <div className="min-h-screen bg-immersive flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--orange)]">
          Session ended
        </div>
        <h1 className="text-3xl font-extrabold">Remote disconnected</h1>
        <Link to="/" className="text-sm text-[color:var(--cyan)] hover:underline">
          ← Home
        </Link>
      </div>
    );
  }

  if (session.status === "waiting") {
    return (
      <div className="min-h-screen bg-immersive flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">
          Host Remote
        </div>
        <h1 className="text-3xl font-extrabold">Ready to launch</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Launch the session from here or from the host screen.
        </p>
        <Button
          className="h-16 px-14 text-xl uppercase tracking-widest font-extrabold"
          onClick={launchSession}
          disabled={busy || slots.length === 0}
        >
          {busy ? "Launching…" : "Launch Session"}
        </Button>
        {slots.length === 0 && (
          <p className="text-xs text-muted-foreground">Loading slots…</p>
        )}
      </div>
    );
  }

  const curAll = Math.max(currentIndex("host"), currentIndex("screen1"), currentIndex("screen2"));
  const total = slots.length;

  return (
    <div className="min-h-screen bg-immersive flex flex-col p-4 gap-3">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)]">
            Host Remote
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-0.5 tabular-nums">
            Slot {total === 0 ? "—" : `${curAll + 1}/${total}`}
          </div>
        </div>
        {!endConfirm ? (
          <button
            onClick={() => setEndConfirm(true)}
            className="px-3 py-2 rounded-lg border border-destructive/50 text-destructive text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-destructive/10 transition-colors"
          >
            End
          </button>
        ) : (
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] uppercase tracking-widest"
              onClick={() => setEndConfirm(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-[10px] uppercase tracking-widest font-extrabold"
              onClick={endSession}
              disabled={busy}
            >
              {busy ? "…" : "End?"}
            </Button>
          </div>
        )}
      </header>

      {/* Timer composer */}
      <div className="shrink-0 rounded-2xl border-2 border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/5 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold">
            Timer
          </div>
          <button
            onClick={clearTimer}
            className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
          >
            Hide
          </button>
        </div>
        <div className="flex items-stretch justify-center gap-2 mb-2">
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => bumpMin(1)}
              className="w-12 h-7 rounded-t-lg bg-card border border-border text-lg font-bold active:scale-95"
            >+</button>
            <input
              type="number"
              min={0}
              max={99}
              value={tMin}
              onChange={(e) => setTMin(Math.max(0, Math.min(99, parseInt(e.target.value || "0", 10))))}
              className="w-12 h-12 text-center bg-card border-x border-border font-mono text-2xl font-bold tabular-nums focus:outline-none focus:bg-[color:var(--cyan)]/10"
            />
            <button
              onClick={() => bumpMin(-1)}
              className="w-12 h-7 rounded-b-lg bg-card border border-border text-lg font-bold active:scale-95"
            >−</button>
          </div>
          <div className="flex items-center text-3xl font-mono font-bold text-muted-foreground">:</div>
          {/* Seconds (steps of 15) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => bumpSec(15)}
              className="w-12 h-7 rounded-t-lg bg-card border border-border text-lg font-bold active:scale-95"
            >+</button>
            <input
              type="number"
              min={0}
              max={59}
              value={tSec}
              onChange={(e) => setTSec(Math.max(0, Math.min(59, parseInt(e.target.value || "0", 10))))}
              className="w-12 h-12 text-center bg-card border-x border-border font-mono text-2xl font-bold tabular-nums focus:outline-none focus:bg-[color:var(--cyan)]/10"
            />
            <button
              onClick={() => bumpSec(-15)}
              className="w-12 h-7 rounded-b-lg bg-card border border-border text-lg font-bold active:scale-95"
            >−</button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => sendTimer(tMin * 60 + tSec)}
            disabled={tMin * 60 + tSec === 0}
            className="flex-1 h-11 rounded-xl font-extrabold uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-30"
            style={{
              background: timerSetFlash
                ? "var(--success)"
                : "color-mix(in oklab, var(--cyan) 25%, transparent)",
              color: timerSetFlash ? "#fff" : "var(--cyan)",
              border: "2px solid var(--cyan)",
            }}
          >
            {timerSetFlash ? "Sent ✓" : "Add Timer"}
          </button>
          <button
            onClick={addMinute}
            className="h-11 px-4 rounded-xl font-bold uppercase tracking-widest text-xs border-2 border-border bg-card active:scale-[0.98]"
          >
            +1 min
          </button>
        </div>
      </div>

      {/* Quiz Buzzer controls — only when the host's current slot is a quiz_buzzer */}
      {(() => {
        const idx = currentIndex("host");
        const hostContent = slots[idx]?.host_content as
          | { type?: string; team1_name?: string; team2_name?: string; question?: string; questions?: string[] }
          | undefined;
        if (!hostContent || hostContent.type !== "quiz_buzzer") return null;
        const questions = (hostContent.questions && hostContent.questions.length > 0)
          ? hostContent.questions
          : (hostContent.question ? [hostContent.question] : []);
        return (
          <QuizRemoteControls
            sessionId={sessionId}
            team1Name={hostContent.team1_name?.trim() || "Team 1"}
            team2Name={hostContent.team2_name?.trim() || "Team 2"}
            totalQuestions={questions.length}
          />
        );
      })()}

      {/* Big Previous / Next buttons that fill the screen */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <button
          onClick={() => moveAll(-1)}
          disabled={busy || curAll <= 0 || total === 0}
          className="flex-1 rounded-3xl border-4 font-black uppercase tracking-[0.3em] text-4xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "color-mix(in oklab, var(--orange) 20%, transparent)",
            borderColor: "var(--orange)",
            color: "var(--orange)",
          }}
        >
          ↑ Previous
        </button>
        <button
          onClick={() => moveAll(1)}
          disabled={busy || curAll >= total - 1 || total === 0}
          className="flex-1 rounded-3xl border-4 font-black uppercase tracking-[0.3em] text-4xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "color-mix(in oklab, var(--success) 20%, transparent)",
            borderColor: "var(--success)",
            color: "var(--success)",
          }}
        >
          Next ↓
        </button>
      </div>


    </div>
  );
}

