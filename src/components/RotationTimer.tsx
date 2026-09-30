import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sounds } from "@/lib/audio";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// ROTATION TIMER — carousel / table rotation.
// Runs `rounds` work rounds of `round_secs`, each followed by a `move_secs`
// "ROTATE!" break, with a chime on every change.
//
// The whole run is one timeline, so every screen derives its round and phase
// from a single elapsed value. Sync only ever sends { startedAt, elapsedBase }:
// the elapsed time banked before the last start, plus when it (re)started.
// startedAt null means paused. The host is the source of truth.
// ─────────────────────────────────────────────

export type RotationTimerContent = {
  type: "rotation_timer";
  label?: string;
  rounds: number;
  round_secs: number;
  move_secs?: number;
  move_text?: string;
};

type Phase =
  | { kind: "work"; round: number; secsLeft: number }
  | { kind: "move"; round: number; secsLeft: number }
  | { kind: "done" };

export function rotationTotalSecs(c: { rounds?: number; round_secs?: number; move_secs?: number }) {
  const rounds = Math.max(1, Number(c.rounds ?? 4));
  const work = Math.max(5, Number(c.round_secs ?? 90));
  const move = Math.max(0, Number(c.move_secs ?? 15));
  return rounds * work + (rounds - 1) * move;
}

function phaseAt(elapsedMs: number, rounds: number, work: number, move: number): Phase {
  const t = Math.floor(elapsedMs / 1000);
  const cycle = work + move;
  const round = Math.floor(t / cycle);
  if (round >= rounds) return { kind: "done" };
  const into = t - round * cycle;
  if (into < work) return { kind: "work", round: round + 1, secsLeft: work - into };
  // No break after the final round.
  if (round + 1 >= rounds) return { kind: "done" };
  return { kind: "move", round: round + 1, secsLeft: cycle - into };
}

function fmt(secs: number) {
  return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
}

export function RotationTimerRenderer({
  content,
  screen,
  sessionId,
}: {
  content: RotationTimerContent;
  screen: "host" | "screen1" | "screen2";
  sessionId?: string;
}) {
  const rounds = Math.max(1, Number(content.rounds ?? 4));
  const work = Math.max(5, Number(content.round_secs ?? 90));
  const move = Math.max(0, Number(content.move_secs ?? 15));
  const moveText = content.move_text?.trim() || "Move to the next table";

  const startedAtRef = useRef<number | null>(null);
  const elapsedBaseRef = useRef(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastPhaseKeyRef = useRef<string | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>(() => phaseAt(0, rounds, work, move));

  const elapsedNow = () =>
    elapsedBaseRef.current +
    (startedAtRef.current === null ? 0 : Date.now() - startedAtRef.current);

  const applyState = (startedAt: number | null, elapsedBase: number) => {
    startedAtRef.current = startedAt;
    elapsedBaseRef.current = elapsedBase;
    setRunning(startedAt !== null);
    setPhase(phaseAt(elapsedNow(), rounds, work, move));
  };

  // Tick, and chime on each phase change. The first phase seen is recorded
  // silently so a late-joining screen does not chime on arrival.
  useEffect(() => {
    const interval = setInterval(() => {
      const p = phaseAt(elapsedNow(), rounds, work, move);
      setPhase(p);
      const key = p.kind === "done" ? "done" : `${p.kind}-${p.round}`;
      if (lastPhaseKeyRef.current !== null && lastPhaseKeyRef.current !== key) {
        if (p.kind === "move") sounds.rotate();
        else if (p.kind === "work") sounds.slotAdvance();
        else sounds.countdownEnd();
      }
      lastPhaseKeyRef.current = key;
      if (p.kind === "done" && startedAtRef.current !== null) {
        elapsedBaseRef.current = elapsedNow();
        startedAtRef.current = null;
        setRunning(false);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [rounds, work, move]);

  useEffect(() => {
    if (!sessionId) {
      // Designer preview / no session: run locally.
      applyState(Date.now(), 0);
      return;
    }
    const ch = supabase.channel(`rotation:${sessionId}`, { config: { broadcast: { self: true } } });
    channelRef.current = ch;

    ch.on(
      "broadcast",
      { event: "rot_state" },
      ({ payload }: { payload: { startedAt: number | null; elapsedBase: number } }) => {
        applyState(payload.startedAt, payload.elapsedBase);
      },
    );

    if (screen === "host") {
      ch.on("broadcast", { event: "rot_sync_request" }, () => {
        ch.send({
          type: "broadcast",
          event: "rot_state",
          payload: { startedAt: startedAtRef.current, elapsedBase: elapsedBaseRef.current },
        });
      });
    }

    ch.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      if (screen === "host") {
        ch.send({
          type: "broadcast",
          event: "rot_state",
          payload: { startedAt: Date.now(), elapsedBase: 0 },
        });
      } else {
        setTimeout(
          () => ch.send({ type: "broadcast", event: "rot_sync_request", payload: {} }),
          300,
        );
      }
    });

    return () => {
      supabase.removeChannel(ch);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, screen, rounds, work, move]);

  const send = (startedAt: number | null, elapsedBase: number) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "rot_state",
        payload: { startedAt, elapsedBase },
      });
    } else {
      applyState(startedAt, elapsedBase);
    }
  };

  const handlePause = () => send(null, elapsedNow());
  const handleResume = () => send(Date.now(), elapsedBaseRef.current);
  const handleReset = () => send(Date.now(), 0);
  // Jump to the start of the next work round, skipping any break.
  const handleNext = () => {
    const t = Math.floor(elapsedNow() / 1000);
    const cycle = work + move;
    const nextRound = Math.floor(t / cycle) + 1;
    const target = Math.min(nextRound, rounds) * cycle * 1000;
    send(running ? Date.now() : null, target);
  };

  const isMove = phase.kind === "move";
  const done = phase.kind === "done";
  const secsLeft = phase.kind === "done" ? 0 : phase.secsLeft;
  const urgent = phase.kind === "work" && secsLeft <= 10;

  return (
    <div className="relative isolate min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-6 p-8 animate-slot-in">
      {isMove && (
        <div className="absolute inset-0 -z-10 pointer-events-none bg-[color:var(--orange)]/20 animate-pulse" />
      )}
      {content.label && !isMove && (
        <div className="text-2xl md:text-4xl font-bold text-center max-w-3xl whitespace-pre-line">
          {content.label}
        </div>
      )}

      {/* Round pips */}
      <div className="flex items-center gap-2">
        {Array.from({ length: rounds }, (_, i) => {
          const r = i + 1;
          const current = !done && phase.round === r;
          const past = done || (!done && r < phase.round) || (isMove && r === phase.round);
          return (
            <span
              key={i}
              className={`h-3 rounded-full transition-all ${current && !isMove ? "w-10 bg-[color:var(--cyan)]" : past ? "w-3 bg-[color:var(--success)]" : "w-3 bg-foreground/20"}`}
            />
          );
        })}
      </div>

      {done ? (
        <div className="text-[12vw] font-extrabold text-glow leading-none text-center">
          Finished!
        </div>
      ) : isMove ? (
        <>
          <div className="text-[16vw] font-extrabold leading-none text-[color:var(--orange)] text-glow animate-pulse">
            ROTATE!
          </div>
          <div className="text-3xl md:text-5xl font-bold text-center">{moveText}</div>
          <div className="text-2xl uppercase tracking-[0.3em] text-muted-foreground">
            Round {phase.round + 1} starts in {secsLeft}
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl md:text-3xl uppercase tracking-[0.4em] text-[color:var(--cyan)] font-bold">
            Round {phase.round} of {rounds}
          </div>
          <div
            className={`text-[20vw] font-extrabold font-mono leading-none tabular-nums transition-colors
              ${urgent ? "text-[color:var(--orange)] text-glow" : "text-foreground"}`}
          >
            {fmt(secsLeft)}
          </div>
        </>
      )}

      {screen === "host" && (
        <div className="flex gap-4">
          {!done &&
            (running ? (
              <Button
                onClick={handlePause}
                variant="outline"
                className="h-14 px-10 text-lg uppercase tracking-widest"
              >
                Pause
              </Button>
            ) : (
              <Button
                onClick={handleResume}
                className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold"
              >
                Resume
              </Button>
            ))}
          {!done && (
            <Button
              onClick={handleNext}
              variant="outline"
              className="h-14 px-10 text-lg uppercase tracking-widest"
            >
              Next round
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-14 px-10 text-lg uppercase tracking-widest"
          >
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
