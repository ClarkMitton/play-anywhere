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

// Each touch screen keeps its own found list so both groups must find every
// hotspot themselves. The Host shows a count per screen, and only shows a
// screen's circles once that screen has pressed Finish.
type State = { s1: string[]; s2: string[]; d1: boolean; d2: boolean; revealed: boolean };
type Miss = { id: number; x: number; y: number };

const EMPTY: State = { s1: [], s2: [], d1: false, d2: false, revealed: false };
const DEFAULT_R = 7; // % of image width

// A fingertip covers roughly this much screen. Small hotspots are widened to it
// on the touch screens so a tap that looks right is not counted as a miss.
const MIN_TAP_RADIUS_PX = 44;

const union = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));

function mergeState(prev: State, inc: Partial<State>): State {
  return {
    s1: union(prev.s1, inc.s1 ?? []),
    s2: union(prev.s2, inc.s2 ?? []),
    d1: prev.d1 || !!inc.d1,
    d2: prev.d2 || !!inc.d2,
    revealed: prev.revealed || !!inc.revealed,
  };
}

export function hitTest(
  hotspots: Hotspot[],
  xPct: number,
  yPct: number,
  aspect: number,
  /** Smallest radius to accept, in % of image width. The nearest hotspot still wins. */
  minR = 0,
): Hotspot | null {
  // Compare in width-percent units so circles stay round on non-square images.
  let best: Hotspot | null = null;
  let bestD = Infinity;
  for (const h of hotspots) {
    const dx = xPct - h.x;
    const dy = (yPct - h.y) * aspect;
    const d = Math.hypot(dx, dy);
    if (d <= Math.max(h.r ?? DEFAULT_R, minR) && d < bestD) {
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
  const [state, setState] = useState<State>(EMPTY);
  const [misses, setMisses] = useState<Miss[]>([]);
  const stateRef = useRef(state);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const myKey: "s1" | "s2" | null = screen === "screen1" ? "s1" : screen === "screen2" ? "s2" : null;

  const apply = (next: State) => {
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    apply(EMPTY);
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
      ({ payload }: { payload: Partial<State> & { url: string; reset?: boolean } }) => {
        if (payload.url !== content.url) return;
        if (payload.reset) return apply(EMPTY);
        const prev = stateRef.current;
        const next = mergeState(prev, payload);
        if (screen === "host" && next.s1.length + next.s2.length > prev.s1.length + prev.s2.length)
          sounds.connect();
        apply(next);
      },
    );
    ch.on(
      "broadcast",
      { event: "hs_sync_request" },
      ({ payload }: { payload: { url: string } }) => {
        if (payload.url !== content.url) return;
        const s = stateRef.current;
        if (s.s1.length === 0 && s.s2.length === 0 && !s.d1 && !s.d2 && !s.revealed) return;
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
  }, [sessionId, content.url, screen]);

  const publish = (inc: Partial<State> & { reset?: boolean }) => {
    const next = inc.reset ? EMPTY : mergeState(stateRef.current, inc);
    apply(next);
    channelRef.current?.send({
      type: "broadcast",
      event: "hs_state",
      payload: { ...next, reset: !!inc.reset, url: content.url },
    });
  };

  const foundIds = myKey ? state[myKey] : union(state.s1, state.s2);

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!myKey || !imgRef.current) return;
    if (myKey === "s1" ? state.d1 : state.d2) return;
    const rect = imgRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return;
    const minR = (MIN_TAP_RADIUS_PX / rect.width) * 100;
    const hit = hitTest(hotspots, xPct, yPct, rect.height / rect.width, minR);
    if (hit && !foundIds.includes(hit.id)) {
      sounds.questionReveal();
      publish({ [myKey]: [hit.id] });
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
  const title =
    content.title?.trim() ||
    (screen === "host" ? "Hotspots" : "Tap on every hotspot you can find");

  const renderPicture = ({
    found,
    showCircles,
    tap,
    maxW,
    maxH,
  }: {
    found: string[];
    showCircles: boolean;
    tap: boolean;
    maxW: string;
    maxH: string;
  }) => (
    <div className="relative shrink-0" onPointerDown={tap ? handleTap : undefined}>
      <img
        ref={tap ? imgRef : undefined}
        src={content.url}
        alt={title}
        draggable={false}
        className={`block w-auto h-auto ${tap ? "cursor-crosshair" : ""}`}
        style={{ maxWidth: maxW, maxHeight: maxH }}
      />
      {hotspots.map((h) => {
        const isFound = found.includes(h.id);
        if (!showCircles && !state.revealed) return null;
        if (!isFound && !state.revealed) return null;
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
                className={`absolute inset-0 rounded-full border-4 ${isFound ? "border-[color:var(--success)] bg-[color:var(--success)]/15" : "border-[color:var(--orange)] bg-[color:var(--orange)]/15 animate-pulse"}`}
              />
              <div
                className={`absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap rounded-lg px-2 py-0.5 font-bold text-[clamp(0.7rem,1.3vw,1.6rem)]
                  ${isFound ? "bg-[color:var(--success)] text-background" : "bg-[color:var(--orange)] text-background"}`}
              >
                {h.label}
              </div>
            </div>
          </div>
        );
      })}
      {tap &&
        misses.map((m) => (
          <div
            key={m.id}
            className="absolute pointer-events-none"
            style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="text-destructive font-extrabold text-5xl animate-ping">✕</div>
          </div>
        ))}
    </div>
  );

  const countPill = (n: number, label?: string, done?: boolean) => (
    <div
      className={`shrink-0 rounded-2xl px-5 py-2 font-extrabold tabular-nums text-[clamp(1rem,2.4vw,3rem)]
        ${total > 0 && n === total ? "bg-[color:var(--success)] text-background" : "bg-foreground/10 text-foreground"}`}
    >
      {label && <span className="mr-2 text-[0.6em] uppercase tracking-widest">{label}</span>}
      {n} / {total}
      {done && <span className="ml-2 text-[0.6em]">✓ finished</span>}
    </div>
  );

  // ── Touch screen ──
  if (myKey) {
    const mine = state[myKey];
    const done = myKey === "s1" ? state.d1 : state.d2;
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center p-4 gap-3 overflow-hidden animate-slot-in select-none">
        <div className="flex items-center w-full max-w-[96vw] gap-4 shrink-0">
          <h2
            className="font-extrabold text-glow leading-tight text-[clamp(1.25rem,3.4vw,4rem)] flex-1"
            style={{ color: "var(--cyan)" }}
          >
            {title}
          </h2>
          {countPill(mine.filter((id) => hotspots.some((h) => h.id === id)).length)}
          <Button
            onClick={() => publish(myKey === "s1" ? { d1: true } : { d2: true })}
            disabled={done}
            className="h-14 px-8 text-xl uppercase tracking-widest font-extrabold"
          >
            {done ? "Finished ✓" : "Finish"}
          </Button>
        </div>
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          {renderPicture({ found: mine, showCircles: true, tap: !done, maxW: "calc(100vw - 2rem)", maxH: "calc(100vh - 7rem)" })}
        </div>
      </div>
    );
  }

  // ── Host ──
  const n1 = state.s1.filter((id) => hotspots.some((h) => h.id === id)).length;
  const n2 = state.s2.filter((id) => hotspots.some((h) => h.id === id)).length;
  const anyDone = state.d1 || state.d2 || state.revealed;
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center p-4 gap-3 overflow-hidden animate-slot-in select-none">
      <div className="flex items-center w-full max-w-[96vw] gap-4 shrink-0 flex-wrap">
        <h2
          className="font-extrabold text-glow leading-tight text-[clamp(1.25rem,3.4vw,4rem)] flex-1"
          style={{ color: "var(--cyan)" }}
        >
          {title}
        </h2>
        {countPill(n1, "Screen 1", state.d1)}
        {countPill(n2, "Screen 2", state.d2)}
        {!state.revealed && (
          <Button onClick={() => publish({ revealed: true })} className="h-12 uppercase tracking-widest font-extrabold">
            Reveal all
          </Button>
        )}
        <Button onClick={() => publish({ reset: true })} variant="outline" className="h-12 uppercase tracking-widest">
          Reset
        </Button>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center gap-4">
        {anyDone ? (
          <>
            {(["s1", "s2"] as const).map((k) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {k === "s1" ? "Screen 1" : "Screen 2"}
                  {!(k === "s1" ? state.d1 : state.d2) && !state.revealed && " · still searching…"}
                </div>
                {renderPicture({
                  found: state[k],
                  showCircles: k === "s1" ? state.d1 : state.d2,
                  tap: false,
                  maxW: "calc(50vw - 2rem)",
                  maxH: "calc(100vh - 9rem)",
                })}
              </div>
            ))}
          </>
        ) : (
          renderPicture({ found: [], showCircles: false, tap: false, maxW: "calc(100vw - 2rem)", maxH: "calc(100vh - 7rem)" })
        )}
      </div>
    </div>
  );
}
