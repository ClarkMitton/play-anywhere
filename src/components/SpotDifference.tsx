import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { hitTest } from "@/components/HazardHotspots";
import { canSubmitDifferences, differenceCount, differenceSetupValid, type SpotDifferenceContent } from "@/lib/spotDifference";
import { sounds } from "@/lib/audio";

type Results = { screen1: string[]; screen2: string[]; done1: boolean; done2: boolean };
const empty = (): Results => ({ screen1: [], screen2: [], done1: false, done2: false });
const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];

export function SpotDifferenceRenderer({ content, screen, sessionId, slotId }: {
  content: SpotDifferenceContent; screen: "host" | "screen1" | "screen2"; sessionId?: string; slotId?: string;
}) {
  const [results, setResults] = useState<Results>(empty);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const current = useRef(results);
  const image = useRef<HTMLImageElement>(null);
  const channel = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const activityKey = JSON.stringify([slotId, content.reference_url, content.comparison_url, content.hotspots]);
  const storageKey = `spot-difference:${sessionId}:${activityKey}:${screen}`;
  const valid = differenceSetupValid(content);
  const total = content.total_differences;
  const mine = screen === "host" ? [] : results[screen];
  const done = screen === "screen1" ? results.done1 : screen === "screen2" ? results.done2 : false;
  const apply = (next: Results) => { current.current = next; setResults(next); };

  useEffect(() => {
    let initial = empty();
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (saved && Array.isArray(saved.screen1) && Array.isArray(saved.screen2)) initial = saved;
    } catch { /* A new activity starts empty. */ }
    apply(initial);
    setMessage(""); setReady(!sessionId);
    if (!sessionId) return;
    const ch = supabase.channel(`differences:${sessionId}:${slotId ?? "preview"}`, { config: { broadcast: { self: false, ack: true } } });
    channel.current = ch;
    const send = () => ch.send({ type: "broadcast", event: "difference_state", payload: { key: activityKey, ...current.current } });
    ch.on("broadcast", { event: "difference_state" }, ({ payload }) => {
      if (payload.key !== activityKey || !Array.isArray(payload.screen1) || !Array.isArray(payload.screen2)) return;
      const prev = current.current;
      apply({ screen1: union(prev.screen1, payload.screen1), screen2: union(prev.screen2, payload.screen2),
        done1: prev.done1 || (payload.done1 && canSubmitDifferences(content, payload.screen1)),
        done2: prev.done2 || (payload.done2 && canSubmitDifferences(content, payload.screen2)) });
    });
    ch.on("broadcast", { event: "difference_sync" }, ({ payload }) => { if (payload.key === activityKey) void send(); });
    ch.subscribe((status) => {
      setReady(status === "SUBSCRIBED");
      if (status === "SUBSCRIBED") {
        void send();
        void ch.send({ type: "broadcast", event: "difference_sync", payload: { key: activityKey } });
      }
    });
    return () => { channel.current = null; void supabase.removeChannel(ch); };
  }, [sessionId, activityKey, screen, storageKey, slotId]);

  useEffect(() => { if (sessionId) sessionStorage.setItem(storageKey, JSON.stringify(results)); }, [results, storageKey, sessionId]);

  const publish = async (next: Results) => {
    apply(next);
    return channel.current ? channel.current.send({ type: "broadcast", event: "difference_state", payload: { key: activityKey, ...next } }) : "ok";
  };
  const tap = (e: React.PointerEvent) => {
    if (screen === "host" || done || !valid || !image.current) return;
    const rect = image.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    const found = hitTest(content.hotspots.filter((h) => !mine.includes(h.id)), x, y, rect.height / rect.width, 0);
    if (!found) return;
    sounds.questionReveal(); setMessage("");
    void publish({ ...current.current, [screen]: union(current.current[screen], [found.id]) });
  };
  const submit = async () => {
    if (screen === "host") return;
    if (!canSubmitDifferences(content, current.current[screen])) {
      setMessage("You still have more differences to find before submitting."); return;
    }
    if (!ready) { setMessage("Connecting to the host screen. Please try again shortly."); return; }
    setSending(true);
    const before = current.current;
    const next = { ...before, [screen === "screen1" ? "done1" : "done2"]: true };
    try {
      const status = await publish(next);
      if (status !== "ok") { apply(before); setMessage("Results could not be sent. Please try again."); }
      else setMessage("Results sent to the host screen.");
    } catch { apply(before); setMessage("Results could not be sent. Please try again."); }
    finally { setSending(false); }
  };

  const picture = (url: string, found: string[], interactive = false) => (
    <div className="relative w-fit max-w-full mx-auto" onPointerDown={interactive ? tap : undefined}>
      <img ref={interactive ? image : undefined} src={url} alt={interactive ? "Comparison image" : "Original reference image"}
        draggable={false} className="block max-w-full max-h-[60vh] object-contain select-none" />
      {content.hotspots.filter((h) => found.includes(h.id)).map((h, i) => (
        <span key={h.id} className="absolute pointer-events-none rounded-full border-4 border-success bg-success/15 text-success font-bold flex items-center justify-center"
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${(h.r ?? 7) * 2}%`, aspectRatio: "1", transform: "translate(-50%, -50%)" }}>
          <span className="bg-background rounded px-1">{i + 1}</span>
        </span>
      ))}
    </div>
  );
  if (!valid) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">Spot the Difference needs both images and exactly {total || "the configured number of"} marked differences.</div>;
  return (
    <section className="min-h-screen bg-background text-foreground p-4 flex flex-col gap-4 select-none">
      <header className="flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan whitespace-pre-line">{content.title || "Spot the Difference"}</h2>
        {screen !== "host" && <p className="text-lg font-bold tabular-nums" aria-live="polite">{differenceCount(content, mine)} of {total} differences found</p>}
      </header>
      {screen === "host" ? <>
        <div className="flex gap-4 flex-wrap">{(["screen1", "screen2"] as const).map((role, i) => <p key={role} className="font-bold" aria-live="polite">Screen {i + 1}: {differenceCount(content, results[role])} of {total}{(i === 0 ? results.done1 : results.done2) ? " · Submitted ✓" : " · Finding differences"}</p>)}</div>
        {picture(content.reference_url, [])}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(["screen1", "screen2"] as const).map((role, i) => (i === 0 ? results.done1 : results.done2) && <div key={role}><h3 className="font-bold mb-2">Screen {i + 1} results</h3>{picture(content.comparison_url, results[role])}</div>)}</div>
      </> : <>
        {picture(content.comparison_url, mine, !done)}
        <div className="flex flex-col items-center gap-2"><Button onClick={submit} disabled={done || sending} className="whitespace-normal h-auto min-h-12 px-6 py-3">{done ? "Sent to Host Screen ✓" : sending ? "Sending…" : "Send to Host Screen"}</Button>
          <p role="status" className="text-center text-lg">{done ? "Results sent to the host screen." : message}</p>
        </div>
      </>}
    </section>
  );
}