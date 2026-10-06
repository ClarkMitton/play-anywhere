// Floating countdown pill shown on the Host display (top-right).
// When it reaches zero it turns red, pulses and sounds an alarm once.
// Subscribes to `timer_set` and `timer_add` broadcasts on the session channel.
// Resets whenever the host slide index changes.

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { sounds } from "@/lib/audio";

type Props = {
  channel: RealtimeChannel | null | undefined;
  slotIndex: number;
};

function fmt(secs: number): string {
  const s = Math.max(0, Math.ceil(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function HostTimerOverlay({ channel, slotIndex }: Props) {
  // null = no active timer. Otherwise epoch ms when it ends.
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const endsAtRef = useRef<number | null>(null);
  endsAtRef.current = endsAt;

  // Clear when slide changes
  useEffect(() => {
    setEndsAt(null);
  }, [slotIndex]);

  // Tick
  useEffect(() => {
    if (endsAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  // Realtime listeners
  useEffect(() => {
    if (!channel) return;
    const onSet = (msg: { payload: { seconds: number } }) => {
      const secs = Math.max(0, Math.floor(msg.payload?.seconds ?? 0));
      if (secs <= 0) {
        setEndsAt(null);
        return;
      }
      setEndsAt(Date.now() + secs * 1000);
    };
    const onAdd = (msg: { payload: { seconds: number } }) => {
      const add = Math.max(0, Math.floor(msg.payload?.seconds ?? 0));
      if (add <= 0) return;
      const base =
        endsAtRef.current && endsAtRef.current > Date.now() ? endsAtRef.current : Date.now();
      setEndsAt(base + add * 1000);
    };
    const onClear = () => setEndsAt(null);
    channel.on("broadcast", { event: "timer_set" }, onSet);
    channel.on("broadcast", { event: "timer_add" }, onAdd);
    channel.on("broadcast", { event: "timer_clear" }, onClear);
    // No cleanup API for individual listeners; channel teardown handles it.
  }, [channel]);

  const finished = endsAt !== null && endsAt - now <= 0;

  // Sound the alarm once per timer, at the moment it runs out. Keyed on endsAt
  // so adding a minute to a finished timer re-arms it.
  const alarmedFor = useRef<number | null>(null);
  useEffect(() => {
    if (finished && endsAt !== null && alarmedFor.current !== endsAt) {
      alarmedFor.current = endsAt;
      sounds.timerAlarm();
    }
  }, [finished, endsAt]);

  if (endsAt === null) return null;
  const remainingSecs = (endsAt - now) / 1000;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slot-in">
      <div
        className={`rounded-full shadow-2xl flex flex-col items-center justify-center px-8 py-4 border-4 ${finished ? "animate-pulse" : ""}`}
        style={{
          background: finished ? "#dc2626" : "#ffffff",
          borderColor: finished ? "#fecaca" : "var(--cyan)",
          boxShadow: finished ? "0 0 50px rgba(220,38,38,0.9)" : undefined,
          minWidth: 180,
        }}
      >
        <div
          className="font-mono font-extrabold tabular-nums leading-none"
          style={{
            fontSize: 56,
            color: finished ? "#ffffff" : "#0b0b0b",
          }}
        >
          {fmt(remainingSecs)}
        </div>
        {finished && (
          <div className="text-xs uppercase tracking-[0.3em] font-extrabold text-white mt-1">
            Time's up
          </div>
        )}
      </div>
    </div>
  );
}
