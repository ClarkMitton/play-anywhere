import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sounds } from "@/lib/audio";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// HAZARD HOTSPOTS — tap-to-find on an image.
// Touch screens: learners tap where they think a hazard is. A tap inside a
// hotspot finds it (shared across both touch screens); a miss shows a brief X.
// Host: the same image with found hazards appearing live, a counter, and
// Reveal all / Reset controls.
//
// State is broadcast-only and monotonic (found ids only grow, reveal only goes
// true), so screens merge by union and a late joiner simply asks for it.
// Coordinates are percentages of the image, so any display size works.
// ─────────────────────────────────────────────

export type Hotspot = { id: string; x: number; y: number; r?: number; label: string };

export type HazardHotspotsContent = {
  type: "hazard_hotspots";
  url: string;
  title?: string;
  hotspots: Hotspot[];
};

type State = { found: string[]; revealed: boolean };
type Miss = { id: number; x: number; y: number };

const DEFAULT_R = 7; // % of image width

export function hitTest(
  hotspots: Hotspot[],
  xPct: number,
  yPct: number,
  aspect: number,
): Hotspot | null {
  // Compare in width-percent units so circles stay round on non-square images.
  let best: Hotspot | null = null;
  let bestD = Infinity;
  for (const h of hotspots) {
    const dx = xPct - h.x;
    const dy = (yPct - h.y) * aspect;
    const d = Math.hypot(dx, dy);
    if (d <= (h.r ?? DEFAULT_R) && d < bestD) {
      best = h;
      bestD = d;
    }
  }
  return best;
}

export function HazardHotspotsRenderer({
  content,
  screen,
  sessionId,
}: {
  content: HazardHotspotsContent;
  screen: "host" | "screen1" | "screen2";
  sessionId?: string;
}) {
  const hotspots = Array.isArray(content.hotspots) ? content.hotspots : [];
  const [state, setState] = useState<State>({ found: [], revealed: false });
  const [misses, setMisses] = useState<Miss[]>([]);
  const stateRef = useRef(state);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const merge = (incoming: Partial<State> & { reset?: boolean }) => {
    setState((prev) => {
      if (incoming.reset) return { found: [], revealed: false };
      const newly = (incoming.found ?? []).filter((id) => !prev.found.includes(id));
      if (newly.length === 0 && (!incoming.revealed || prev.revealed)) return prev;
      return {
        found: [...prev.found, ...newly],
        revealed: prev.revealed || !!incoming.revealed,
      };
    });
  };

  useEffect(() => {
    setState({ found: [], revealed: false });
    if (!sessionId) return;
    const ch = supabase.channel(`hotspots:${sessionId}`, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = ch;

    // Payloads carry the image url so a stale message from another hotspot
    // slot is ignored.
    ch.on(
      "broadcast",
      { event: "hs_state" },
      ({ payload }: { payload: State & { url: string; reset?: boolean } }) => {
        if (payload.url !== content.url) return;
        if (!payload.reset && payload.found.some((id) => !stateRef.current.found.includes(id)))
          sounds.connect();
        merge(payload);
      },
    );
    ch.on(
      "broadcast",
      { event: "hs_sync_request" },
      ({ payload }: { payload: { url: string } }) => {
        if (payload.url !== content.url) return;
        const s = stateRef.current;
        if (s.found.length === 0 && !s.revealed) return;
        ch.send({ type: "broadcast", event: "hs_state", payload: { ...s, url: content.url } });
      },
    );
    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        ch.send({ type: "broadcast", event: "hs_sync_request", payload: { url: content.url } });
      }
    });
    return () => {
      supabase.removeChannel(ch);
      channelRef.current = null;
    };
  }, [sessionId, content.url]);

  const publish = (next: Partial<State> & { reset?: boolean }) => {
    merge(next);
    const s = next.reset ? { found: [], revealed: false } : stateRef.current;
    channelRef.current?.send({
      type: "broadcast",
      event: "hs_state",
      payload: {
        found: next.reset ? [] : Array.from(new Set([...s.found, ...(next.found ?? [])])),
        revealed: next.reset ? false : s.revealed || !!next.revealed,
        reset: !!next.reset,
        url: content.url,
      },
    });
  };

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (screen === "host" || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return;
    const hit = hitTest(hotspots, xPct, yPct, rect.height / rect.width);
    if (hit && !state.found.includes(hit.id)) {
      sounds.questionReveal();
      publish({ found: [hit.id] });
    } else if (!hit) {
      const miss = { id: Date.now() + Math.random(), x: xPct, y: yPct };
      setMisses((m) => [...m, miss]);
      setTimeout(() => setMisses((m) => m.filter((x) => x.id !== miss.id)), 900);
    }
  };

  if (!content.url) {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex items-center justify-center text-3xl font-bold text-muted-foreground">
        No image set
      </div>
    );
  }

  const total = hotspots.length;
  const foundCount = hotspots.filter((h) => state.found.includes(h.id)).length;
  const allFound = total > 0 && foundCount === total;
  const title =
    content.title?.trim() ||
    (screen === "host" ? "Spot the hazards" : "Tap on every hazard you can see");

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center p-4 gap-3 overflow-hidden animate-slot-in select-none">
      <div className="flex items-center w-full max-w-[96vw] gap-6 shrink-0">
        <h2
          className="font-extrabold text-glow leading-tight text-[clamp(1.25rem,3.4vw,4rem)]"
          style={{ color: "var(--cyan)" }}
        >
          {title}
        </h2>
        <div
          className={`shrink-0 rounded-2xl px-5 py-2 font-extrabold tabular-nums text-[clamp(1.25rem,3vw,3.5rem)]
            ${allFound ? "bg-[color:var(--success)] text-background" : "bg-foreground/10 text-foreground"}`}
        >
          {foundCount} / {total}
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full flex items-center justify-center gap-4">
        {/* Sized against the viewport, not the parent: a percentage max-width
            on an image inside a shrink-to-fit wrapper resolves circularly and
            lets the image push the host sidebar off screen. */}
        <div className="relative shrink-0" onPointerDown={handleTap}>
          <img
            ref={imgRef}
            src={content.url}
            alt={title}
            draggable={false}
            className={`block w-auto h-auto max-h-[calc(100vh-7rem)] ${
              screen === "host"
                ? "max-w-[calc(100vw-max(18vw,200px)-3rem)]"
                : "max-w-[calc(100vw-2rem)] cursor-crosshair"
            }`}
          />
          {hotspots.map((h) => {
            const found = state.found.includes(h.id);
            if (!found && !state.revealed) return null;
            const r = h.r ?? DEFAULT_R;
            return (
              // The centring transform lives on the outer element because the
              // entry animation animates `transform` on the inner one.
              <div
                key={h.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${r * 2}%`,
                  aspectRatio: "1",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="absolute inset-0 animate-slot-in">
                  <div
                    className={`absolute inset-0 rounded-full border-4 ${found ? "border-[color:var(--success)] bg-[color:var(--success)]/15" : "border-[color:var(--orange)] bg-[color:var(--orange)]/15 animate-pulse"}`}
                  />
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap rounded-lg px-2 py-0.5 font-bold text-[clamp(0.7rem,1.3vw,1.6rem)]
                      ${found ? "bg-[color:var(--success)] text-background" : "bg-[color:var(--orange)] text-background"}`}
                  >
                    {h.label}
                  </div>
                </div>
              </div>
            );
          })}
          {misses.map((m) => (
            <div
              key={m.id}
              className="absolute pointer-events-none"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className="text-destructive font-extrabold text-5xl animate-ping">✕</div>
            </div>
          ))}
        </div>

        {screen === "host" && (
          <div className="shrink-0 w-[18vw] min-w-[200px] flex flex-col gap-3 self-stretch justify-center">
            <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Found so far
            </div>
            <ul className="space-y-1.5 text-[clamp(0.9rem,1.4vw,1.6rem)] font-semibold">
              {hotspots
                .filter((h) => state.found.includes(h.id))
                .map((h) => (
                  <li key={h.id} className="text-[color:var(--success)]">
                    ✓ {h.label}
                  </li>
                ))}
              {foundCount === 0 && <li className="text-muted-foreground">Nothing yet…</li>}
            </ul>
            <div className="flex flex-col gap-2 pt-2">
              {!state.revealed && (
                <Button
                  onClick={() => publish({ revealed: true })}
                  className="h-12 uppercase tracking-widest font-extrabold"
                >
                  Reveal all
                </Button>
              )}
              <Button
                onClick={() => publish({ reset: true })}
                variant="outline"
                className="h-12 uppercase tracking-widest"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
