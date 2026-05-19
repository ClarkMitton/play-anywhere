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
import { useWebcamBroadcaster } from "@/hooks/use-webcam-broadcast";

export const Route = createFileRoute("/remote/$sessionId")({
  head: () => ({ meta: [{ title: "Host Remote · Immersive Learning" }] }),
  component: RemotePage,
});

type ContentDef = { type: string; [k: string]: unknown };
type ScreenKey = "host" | "screen1" | "screen2";

type SlotRow = {
  id: string;
  order_index: number;
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
          .select("id, order_index, host_content, screen1_content, screen2_content")
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
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
      (payload) => setSession(payload.new as SessionRow),
    );
    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [sessionId]);

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
          } as never,
        })
        .eq("id", session.id);
      setBusy(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, slots, busy],
  );

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
      <div className="min-h-screen bg-immersive flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">
          Host Remote
        </div>
        <h1 className="text-3xl font-extrabold">Waiting for Host to launch…</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Once the session is live, controls for each screen will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-immersive bg-grid p-5 pb-12">
      {/* Header */}
      <header className="max-w-md mx-auto mb-5">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)] mb-1">
          Host Remote · {slots.length} slot{slots.length !== 1 ? "s" : ""}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight">Slot control</h1>
        <div className="text-[10px] font-mono text-muted-foreground mt-1">
          Session {session.id.slice(0, 8)}
        </div>
      </header>

      {/* All together control */}
      <div className="max-w-md mx-auto mb-6 bg-card/70 backdrop-blur border-2 border-border rounded-2xl p-4">
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3 text-center">
          All screens together
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 h-14 text-base uppercase tracking-widest font-bold"
            onClick={() => moveAll(-1)}
            disabled={busy || slots.length === 0}
          >
            ← Prev
          </Button>
          <Button
            className="flex-1 h-14 text-base uppercase tracking-widest font-extrabold"
            onClick={() => moveAll(1)}
            disabled={busy || slots.length === 0}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Per-screen controls */}
      <div className="max-w-md mx-auto space-y-3">
        {(["host", "screen1", "screen2"] as ScreenKey[]).map((k) => {
          const idx = currentIndex(k);
          const total = slots.length;
          const content = session.state?.slot?.[k];
          return (
            <div
              key={k}
              className="bg-card/70 backdrop-blur border-2 rounded-2xl p-4"
              style={{ borderColor: `color-mix(in oklab, ${SCREEN_ACCENTS[k]} 40%, transparent)` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-[0.3em] font-bold"
                    style={{ color: SCREEN_ACCENTS[k] }}
                  >
                    {SCREEN_LABELS[k]}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {contentLabel(content)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    Slot
                  </div>
                  <div className="text-lg font-mono font-extrabold tabular-nums">
                    {total === 0 ? "—" : `${idx + 1}/${total}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 uppercase tracking-widest text-xs"
                  onClick={() => move(k, -1)}
                  disabled={busy || idx <= 0 || total === 0}
                >
                  ← Prev
                </Button>
                <Button
                  className="flex-1 h-12 uppercase tracking-widest text-xs font-extrabold"
                  onClick={() => move(k, 1)}
                  disabled={busy || idx >= total - 1 || total === 0}
                >
                  Next →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
