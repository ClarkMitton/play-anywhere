import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sounds } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// CONFETTI — celebratory burst (wheel result, confidence improvement)
// ─────────────────────────────────────────────

const CONFETTI_COLORS = ["var(--cyan)", "var(--orange)", "var(--success)", "oklch(0.82 0.18 80)", "oklch(0.72 0.18 300)"];

function Confetti({ count = 44 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 140 + Math.random() * 320;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist + 240, // gravity bias
          rot: Math.random() * 900 - 450,
          dur: 1.3 + Math.random() * 1.4,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          left: 50 + (Math.random() * 24 - 12),
          delay: Math.random() * 0.18,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "42%",
            background: p.color,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            ["--rot" as string]: `${p.rot}deg`,
            ["--dur" as string]: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type SlotContent =
  | { type: "waiting" }
  | { type: "text_slide"; text: string; subtitle?: string; size?: "sm" | "md" | "lg" | "xl" | "2xl"; color?: string }
  | { type: "youtube"; url: string }
  | { type: "image"; url: string; file_name?: string; title?: string }
  | { type: "embed"; url: string }
  | { type: "confidence_checker"; prompt: string; optional_qualitative?: boolean; scale_mode?: "numbers" | "emoji" | "likert"; max?: number }
  | { type: "wheel_spinner"; items: string[] }
  | { type: "countdown_timer"; label?: string; duration_secs: number }
  | { type: "host_timer"; label?: string; duration_secs: number }
  | { type: "multiple_choice"; id?: string; text: string; options: string[]; correct?: number }
  | { type: "true_or_false"; id?: string; text: string; correct_tf?: boolean }
  | { type: "voting"; question: string; options: string[] }
  | { type: "quiz_buzzer"; question?: string; questions?: string[]; answers?: string[]; team1_name?: string; team2_name?: string }
  | { type: string; [k: string]: unknown };

type QuestionContent = Extract<SlotContent,
  | { type: "multiple_choice" }
  | { type: "true_or_false" }
>;

// ─────────────────────────────────────────────
// MAIN RENDERER
// ─────────────────────────────────────────────

export function SlotRenderer({
  content,
  screen,
  muted = true,
  sessionId,
  slotId,
}: {
  content: SlotContent | null | undefined;
  screen: "host" | "screen1" | "screen2";
  muted?: boolean;
  sessionId?: string;
  slotId?: string;
  channel?: RealtimeChannel;
}) {
  if (!content || !content.type) return <Waiting screen={screen} />;

  switch (content.type) {
    case "waiting":
      return <Waiting screen={screen} />;

    case "text_slide": {
      const c = content as Extract<SlotContent, { type: "text_slide" }>;
      const text = c.text || "";
      // Smart shrink: longer text gets smaller so it always fits the viewport without scrolling.
      const baseVw =
        c.size === "2xl" ? 13 :
        c.size === "xl"  ? 10 :
        c.size === "lg"  ? 7  :
        c.size === "md"  ? 5  :
        c.size === "sm"  ? 3.5 : 10;
      const len = text.length;
      const shrink =
        len > 400 ? 0.32 :
        len > 250 ? 0.42 :
        len > 150 ? 0.55 :
        len > 80  ? 0.7  :
        len > 40  ? 0.85 : 1;
      const fontSize = `clamp(1.25rem, ${(baseVw * shrink).toFixed(2)}vw, 14rem)`;
      return (
        <div
          key={String(c.text) + String(c.subtitle ?? "")}
          className="h-screen w-full bg-immersive bg-grid flex items-center justify-center p-8 overflow-hidden animate-slot-in"
        >
          <div className="text-center max-w-[92vw] max-h-full overflow-hidden">
            <div
              className="leading-[1.05] font-extrabold text-glow whitespace-pre-line break-words"
              style={{ color: c.color ?? undefined, fontSize }}
            >
              {text}
            </div>
            {c.subtitle && (
              <div className="mt-4 text-[2.4vw] text-muted-foreground font-semibold leading-snug whitespace-pre-line">
                {c.subtitle}
              </div>
            )}
          </div>
        </div>
      );
    }

    case "youtube": {
      const c = content as Extract<SlotContent, { type: "youtube" }>;
      if (!c.url) return <Waiting screen={screen} />;
      const videoId = extractYouTubeId(c.url);
      if (!videoId) return <Waiting screen={screen} />;
      const params = screen === "host"
        ? "autoplay=1&rel=0&modestbranding=1"
        : "autoplay=1&mute=1&rel=0&modestbranding=1";
      return (
        <div className="min-h-screen w-full bg-black animate-slot-in">
          <iframe key={videoId + screen}
            src={`https://www.youtube.com/embed/${videoId}?${params}`}
            className="w-full h-screen border-0"
            allow="autoplay; fullscreen" allowFullScreen title="YouTube video" />
        </div>
      );
    }

    case "image": {
      const c = content as Extract<SlotContent, { type: "image" }>;
      if (!c.url) return <Waiting screen={screen} />;
      const title = (c.title ?? "").trim();
      const titleLen = title.length;
      const titleVw = titleLen > 60 ? 2.6 : titleLen > 40 ? 3.4 : titleLen > 20 ? 4.4 : 5.5;
      const titleFontSize = `clamp(1.25rem, ${titleVw}vw, 5rem)`;
      return (
        <div className="h-screen w-full bg-black animate-slot-in flex flex-col items-center justify-center p-4 gap-3 overflow-hidden">
          {title && (
            <h2
              className="font-extrabold text-glow text-center leading-tight max-w-[94vw] shrink-0 whitespace-pre-line"
              style={{ fontSize: titleFontSize, color: "var(--cyan)" }}
            >
              {title}
            </h2>
          )}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <img
              src={c.url}
              alt={title || ""}
              className="max-h-full max-w-full w-auto h-auto object-contain"
            />
          </div>
        </div>
      );
    }

    case "embed": {
      const c = content as Extract<SlotContent, { type: "embed" }>;
      if (!c.url) return <Waiting screen={screen} />;
      return (
        <div className="min-h-screen w-full bg-background animate-slot-in">
          <iframe
            key={c.url}
            src={c.url}
            className="w-full h-screen border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; microphone; camera; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Embedded content"
          />
        </div>
      );
    }

    // (html_upload, webpage, host_webcam removed)


    case "confidence_checker": {
      const c = content as Extract<SlotContent, { type: "confidence_checker" }>;
      if (screen === "screen1" || screen === "screen2")
        return <ConfidenceCheckerInput content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
      if (screen === "host")
        return <ConfidenceCheckerHost content={c} sessionId={sessionId} slotId={slotId} />;
      return <Waiting screen={screen} />;
    }

    case "wheel_spinner": {
      const c = content as Extract<SlotContent, { type: "wheel_spinner" }>;
      return <WheelSpinnerRenderer content={c} screen={screen} sessionId={sessionId} />;
    }

    case "countdown_timer": {
      const c = content as Extract<SlotContent, { type: "countdown_timer" }>;
      return <CountdownTimerRenderer content={c} screen={screen} sessionId={sessionId} />;
    }

    case "host_timer": {
      if (screen !== "host") return <Waiting screen={screen} />;
      const c = content as Extract<SlotContent, { type: "host_timer" }>;
      return <HostTimerRenderer content={c} />;
    }

    case "multiple_choice":
    case "true_or_false": {
      const c = content as QuestionContent;
      if (screen === "screen2")
        return <QuestionRendererTS2 content={c} sessionId={sessionId} slotId={slotId} />;
      if (screen === "host")
        return <QuestionRendererHost content={c} sessionId={sessionId} />;
      return <Waiting screen={screen} />;
    }

    case "voting": {
      const c = content as Extract<SlotContent, { type: "voting" }>;
      return <VotingRenderer content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
    }

    case "quiz_buzzer": {
      const c = content as Extract<SlotContent, { type: "quiz_buzzer" }>;
      return <QuizBuzzerRenderer content={c} screen={screen} sessionId={sessionId} />;
    }

    default:
      return <Waiting screen={screen} />;
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    return null;
  } catch { return null; }
}

// ─────────────────────────────────────────────
// WAITING STATE
// ─────────────────────────────────────────────

function Waiting({ screen }: { screen: "host" | "screen1" | "screen2" }) {
  const label = screen === "host" ? "Host" : screen === "screen1" ? "Touch Screen 1" : "Touch Screen 2";
  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)] mb-6 animate-float-glow">{label}</div>
      <div className="text-5xl md:text-7xl font-extrabold text-glow text-center max-w-3xl">Standing by</div>
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}

// (Host webcam removed)


// ─────────────────────────────────────────────
// SUBMITTED STATE (shared)
// ─────────────────────────────────────────────

function SubmittedState() {
  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)] mb-6">Response received</div>
      <div className="text-5xl md:text-7xl font-extrabold text-glow text-center">Waiting for next activity…</div>
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFIDENCE CHECKER — TS1 / TS2 input (multi-student)
// ─────────────────────────────────────────────

// Emoji scale (low → high). Stored as 1–5.
const EMOJI_LABELS = ["Really angry", "Slightly angry", "Neutral", "Happy", "Really happy"];
const EMOJI_FACES = ["😡", "😠", "😐", "🙂", "😄"];

// Likert scale (low → high). Stored as 1–5.
const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

// Normalise the configured scale into a list of option values.
// numbers → 1..max (max clamped 2–10). emoji / likert → fixed 1..5.
function resolveScale(content: { scale_mode?: "numbers" | "emoji" | "likert"; max?: number }) {
  const mode =
    content.scale_mode === "emoji" ? "emoji" :
    content.scale_mode === "likert" ? "likert" : "numbers";
  const max = mode === "numbers" ? Math.min(10, Math.max(2, Math.round(content.max ?? 5))) : 5;
  return { mode, max, options: Array.from({ length: max }, (_, i) => i + 1) };
}

function ConfidenceCheckerInput({ content, screen, sessionId, slotId }: {
  content: { prompt: string; optional_qualitative?: boolean; scale_mode?: "numbers" | "emoji" | "likert"; max?: number };
  screen: "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const { mode, options } = resolveScale(content);

  const [score, setScore] = useState<number | null>(null);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [newThought, setNewThought] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [personNum, setPersonNum] = useState(1);   // person currently answering
  const [recorded, setRecorded] = useState(0);     // people submitted so far
  const [phase, setPhase] = useState<"input" | "confirm" | "done">("input");

  const resetForm = () => { setScore(null); setThoughts([]); setNewThought(""); };

  const addThought = () => {
    const t = newThought.trim();
    if (!t || thoughts.length >= 5) return;
    setThoughts(p => [...p, t]);
    setNewThought("");
  };

  const handleSubmit = async () => {
    if (!score || !sessionId || submitting) return;
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: screen,
      response_type: "confidence_checker", response_data: { score, thoughts } as never,
    });
    setSubmitting(false);
    setRecorded(c => c + 1);
    setPhase("confirm");
  };

  const handleNextPerson = () => {
    resetForm();
    setPersonNum(n => n + 1);
    setPhase("input");
  };

  // After everyone on this screen has answered — final confirmation.
  if (phase === "done") {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 animate-slot-in gap-6">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)]">All responses in</div>
        <div className="text-5xl md:text-6xl font-extrabold text-glow text-center">That's everyone!</div>
        <div className="text-xl text-muted-foreground">
          {recorded} {recorded === 1 ? "person" : "people"} recorded
        </div>
      </div>
    );
  }

  // Just submitted — choose to take the next person or finish the round.
  if (phase === "confirm") {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 animate-slot-in gap-8">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)]">Person {personNum} recorded</div>
        <div className="text-4xl md:text-5xl font-extrabold text-glow text-center">Thank you!</div>
        <div className="text-sm text-muted-foreground uppercase tracking-widest">
          {recorded} {recorded === 1 ? "person" : "people"} so far
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleNextPerson}
            className="h-16 px-10 text-xl uppercase tracking-widest font-extrabold"
          >
            Next Person →
          </Button>
          <Button
            onClick={() => setPhase("done")}
            variant="outline"
            className="h-16 px-10 text-xl uppercase tracking-widest font-extrabold border-2"
          >
            That's Everyone ✓
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-8 gap-7 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)]">Person {personNum}</div>
      <div className="text-2xl md:text-3xl font-bold text-center max-w-lg leading-snug">
        {content.prompt || "How confident are you?"}
      </div>

      {mode === "emoji" ? (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl">
          {options.map(n => (
            <button key={n} onClick={() => setScore(n)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all duration-150
                ${score === n ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20"
                  : "border-border hover:border-[color:var(--cyan)]/50 active:scale-95"}`}>
              <span className="text-5xl md:text-6xl leading-none">{EMOJI_FACES[n - 1]}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{EMOJI_LABELS[n - 1]}</span>
            </button>
          ))}
        </div>
      ) : mode === "likert" ? (
        <div className="flex flex-col gap-3 w-full max-w-lg">
          {options.map(n => (
            <button key={n} onClick={() => setScore(n)}
              className={`w-full px-6 py-4 rounded-2xl text-left text-lg font-semibold border-2 transition-all duration-150
                ${score === n ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]"
                  : "border-border text-foreground hover:border-[color:var(--cyan)]/50 active:scale-[0.99]"}`}>
              {LIKERT_LABELS[n - 1]}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl">
            {options.map(n => (
              <button key={n} onClick={() => setScore(n)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl text-3xl md:text-4xl font-extrabold border-2 transition-all duration-150 select-none
                  ${score === n ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] scale-110 shadow-[0_0_24px_color-mix(in_oklab,var(--cyan)_40%,transparent)]"
                    : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50 active:scale-95"}`}>
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between w-full max-w-xs text-xs text-muted-foreground uppercase tracking-widest">
            <span>Not at all</span><span>Very confident</span>
          </div>
        </>
      )}

      {content.optional_qualitative && (
        <div className="w-full max-w-lg space-y-3">
          <div className="text-sm text-muted-foreground uppercase tracking-widest">Add a thought (optional, up to 5)</div>
          {thoughts.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--cyan)] shrink-0" /><span>{t}</span>
            </div>
          ))}
          {thoughts.length < 5 && (
            <div className="flex gap-2">
              <input value={newThought} onChange={e => setNewThought(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addThought(); } }}
                placeholder="Type a thought and press Enter…"
                className="flex-1 bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--cyan)]" />
              <button onClick={addThought} className="px-4 py-3 border border-border rounded-xl text-sm hover:border-[color:var(--cyan)]">+</button>
            </div>
          )}
        </div>
      )}
      <Button onClick={handleSubmit} disabled={!score || submitting}
        className="h-14 px-12 text-lg uppercase tracking-widest font-extrabold disabled:opacity-30">
        {submitting ? "Submitting…" : "Submit"}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFIDENCE CHECKER — Host (live aggregate)
// ─────────────────────────────────────────────

function ConfidenceCheckerHost({ content, sessionId, slotId }: {
  content: { scale_mode?: "numbers" | "emoji" | "likert"; max?: number };
  sessionId?: string; slotId?: string;
}) {
  const { mode, options } = resolveScale(content);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      let q = supabase.from("responses").select("response_data")
        .eq("session_id", sessionId).eq("response_type", "confidence_checker");
      if (slotId) q = q.eq("slot_id", slotId);
      const { data } = await q;
      if (data) setScores(data.map(r => ((r.response_data as { score?: number }) ?? {}).score).filter((s): s is number => typeof s === "number"));
    })();
    const ch = supabase.channel(`cc:${sessionId}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const row = payload.new as { response_type: string; response_data: { score: number } };
        if (row.response_type === "confidence_checker" && row.response_data?.score)
          setScores(p => [...p, row.response_data.score]);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sessionId, slotId]);

  const counts = options.map(n => scores.filter(s => s === n).length);
  const maxCount = Math.max(...counts, 1);
  const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
  // Hue ramp red → green across however many options the scale has.
  const barColor = (i: number) => {
    const t = options.length <= 1 ? 1 : i / (options.length - 1);
    return `oklch(0.75 0.17 ${Math.round(25 + t * 120)})`;
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-12 gap-10 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Confidence Checker · Live</div>
      <div className="flex items-end gap-4 md:gap-8 h-48">
        {options.map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-2">
            <span className="text-2xl font-extrabold">{counts[i]}</span>
            <div className="w-12 md:w-16 rounded-t-xl transition-all duration-700"
              style={{ height: `${counts[i] === 0 ? 4 : Math.max(12, (counts[i] / maxCount) * 176)}px`, background: barColor(i) }} />
            <span className="text-xl font-bold" style={{ color: barColor(i) }}>{n}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-md text-xs text-muted-foreground uppercase tracking-widest">
        <span>{mode === "emoji" ? `${EMOJI_FACES[0]} ${EMOJI_LABELS[0]}` : mode === "likert" ? LIKERT_LABELS[0] : "Not at all"}</span>
        <span>{mode === "emoji" ? `${EMOJI_FACES[EMOJI_FACES.length - 1]} ${EMOJI_LABELS[EMOJI_LABELS.length - 1]}` : mode === "likert" ? LIKERT_LABELS[LIKERT_LABELS.length - 1] : "Very confident"}</span>
      </div>
      <div className="flex gap-16 text-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Responses</div>
          <div className="text-6xl font-extrabold text-glow">{scores.length}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Average</div>
          <div className="text-6xl font-extrabold text-[color:var(--cyan)]">{avg}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WHEEL SPINNER
// ─────────────────────────────────────────────

const WHEEL_COLORS = ["var(--cyan)", "var(--orange)", "var(--success)", "oklch(0.72 0.18 300)", "oklch(0.82 0.18 80)"];

function WheelSpinnerRenderer({ content, screen, sessionId }: {
  content: { items: string[] }; screen: "host" | "screen1" | "screen2"; sessionId?: string;
}) {
  const items = (content.items ?? []).filter(Boolean);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const spinningRef = useRef(false);
  const baseRotationRef = useRef(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const triggerSpin = useCallback((spinItems: string[], winner: string) => {
    if (spinningRef.current || spinItems.length === 0) return;
    spinningRef.current = true;
    setResult(null);

    const sectorDeg = 360 / spinItems.length;
    const winIdx = Math.max(0, spinItems.indexOf(winner));
    const winnerCenter = winIdx * sectorDeg + sectorDeg / 2;
    const targetMod = (360 - winnerCenter + 360) % 360;
    const currentMod = baseRotationRef.current % 360;
    const delta = ((targetMod - currentMod) + 360) % 360;
    baseRotationRef.current = baseRotationRef.current + 360 * 5 + delta;
    const newRotation = baseRotationRef.current;

    // Set spinning first so the CSS transition activates, then update rotation in the
    // next two animation frames so the browser actually animates the transform change.
    setSpinning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(newRotation);
      });
    });

    setTimeout(() => {
      spinningRef.current = false;
      setSpinning(false);
      setResult(winner);
      sounds.questionReveal();
      setTimeout(() => setResult(null), 3000);
    }, 4000);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase.channel(`whl:${sessionId}`, { config: { broadcast: { self: true } } });
    channelRef.current = ch;
    ch.on("broadcast", { event: "wheel_spin" },
      ({ payload }: { payload: { items: string[]; result: string } }) => {
        triggerSpin(payload.items, payload.result);
      }).subscribe();
    return () => { supabase.removeChannel(ch); channelRef.current = null; };
  }, [sessionId, triggerSpin]);

  const handleSpin = () => {
    if (spinning || items.length === 0 || !channelRef.current) return;
    const winner = items[Math.floor(Math.random() * items.length)];
    channelRef.current.send({ type: "broadcast", event: "wheel_spin", payload: { items, result: winner } });
  };

  const sectorDeg = items.length > 0 ? 360 / items.length : 360;
  const conicParts = items.length > 0
    ? items.map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * sectorDeg}deg ${(i + 1) * sectorDeg}deg`).join(", ")
    : "var(--muted) 0deg 360deg";

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 animate-slot-in">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 z-10 text-4xl leading-none select-none"
          style={{ top: "-28px", filter: "drop-shadow(0 2px 10px color-mix(in oklab, var(--cyan) 60%, transparent))" }}>▼</div>
        <div className={`w-72 h-72 md:w-[400px] md:h-[400px] rounded-full relative ${spinning ? "animate-wheel-flash" : ""}`}
          style={{
            background: `conic-gradient(${conicParts})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            boxShadow: "0 0 60px color-mix(in oklab, var(--cyan) 30%, transparent), 0 0 120px color-mix(in oklab, var(--cyan) 15%, transparent)",
          }}>
          {items.map((item, i) => {
            const angle = i * sectorDeg + sectorDeg / 2;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = 50 + 35 * Math.cos(rad);
            const y = 50 + 35 * Math.sin(rad);
            return (
              <span key={i} className="absolute text-[10px] md:text-xs font-extrabold text-white leading-none text-center pointer-events-none"
                style={{ left: `${x}%`, top: `${y}%`, maxWidth: "60px", transform: `translate(-50%, -50%) rotate(${angle}deg)`, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                {item.length > 10 ? item.slice(0, 10) + "…" : item}
              </span>
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-[3px] border-[color:var(--cyan)]" />
          </div>
        </div>
      </div>
      {result && (
        <>
          <Confetti />
          <div className="animate-slot-in text-center">
            <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--orange)] mb-2">Winner</div>
            <div className="text-5xl md:text-7xl font-extrabold text-glow">{result}</div>
          </div>
        </>
      )}
      {items.length > 0 && (
        <Button onClick={handleSpin} disabled={spinning}
          className={`h-16 px-14 text-xl uppercase tracking-widest font-extrabold disabled:opacity-50 ${spinning ? "animate-pulse" : ""}`}>
          {spinning ? "Spinning…" : "Spin!"}
        </Button>
      )}
      {items.length === 0 && <div className="text-sm text-muted-foreground uppercase tracking-widest">No items configured</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// QUESTION — Touch Screen 2
// ─────────────────────────────────────────────

function QuestionRendererTS2({ content, sessionId, slotId }: {
  content: QuestionContent; sessionId?: string; slotId?: string;
}) {
  const [answer, setAnswer] = useState<number | string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (answer === null || !sessionId || submitting) return;
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: "screen2",
      response_type: "question",
      response_data: { type: content.type, answer, questionId: content.id ?? "unknown" } as never,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <SubmittedState />;

  // True / False
  if (content.type === "true_or_false") {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-8 gap-8 animate-slot-in">
        <div className="text-2xl md:text-3xl font-bold text-center max-w-lg">{(content as { text: string }).text || "True or False?"}</div>
        <div className="flex gap-6">
          {(["true", "false"] as const).map(v => (
            <button key={v} onClick={() => setAnswer(v)}
              className={`w-36 h-20 rounded-2xl text-2xl font-extrabold border-2 uppercase tracking-widest transition-all duration-150
                ${answer === v ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] scale-105" : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"}`}>
              {v}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={answer === null || submitting}
          className="h-14 px-12 text-lg uppercase tracking-widest font-extrabold disabled:opacity-30">
          {submitting ? "Submitting…" : "Submit"}
        </Button>
      </div>
    );
  }

  // Multiple choice
  const opts = (content as { options?: string[] }).options ?? [];
  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-8 gap-6 animate-slot-in">
      <div className="text-2xl md:text-3xl font-bold text-center max-w-lg">{(content as { text: string }).text || "Question"}</div>
      <div className="flex flex-col gap-3 w-full max-w-lg">
        {opts.map((opt, i) => (
          <button key={i} onClick={() => setAnswer(i)}
            className={`w-full px-6 py-4 rounded-2xl text-left text-lg font-semibold border-2 transition-all duration-150
              ${answer === i ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]" : "border-border text-foreground hover:border-[color:var(--cyan)]/50"}`}>
            <span className="mr-3 text-muted-foreground font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={answer === null || submitting}
        className="h-14 px-12 text-lg uppercase tracking-widest font-extrabold disabled:opacity-30">
        {submitting ? "Submitting…" : "Submit"}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUESTION — Host (live count → animated results)
// ─────────────────────────────────────────────

type ResponseRow = { response_data: { answer: number | string; thoughts?: string[] } };

function QuestionRendererHost({ content, sessionId }: { content: QuestionContent; sessionId?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [responses, setResponses] = useState<ResponseRow[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      const { count } = await supabase.from("responses").select("id", { count: "exact" })
        .eq("session_id", sessionId).eq("response_type", "question");
      if (count !== null) setResponseCount(count);
    })();

    const respCh = supabase.channel(`qh-resp:${sessionId}`);
    respCh.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        if ((payload.new as { response_type: string }).response_type === "question")
          setResponseCount(c => c + 1);
      }).subscribe();

    return () => { supabase.removeChannel(respCh); };
  }, [sessionId]);

  // Reveal is controlled here on the Host screen.
  const handleReveal = async () => {
    if (!sessionId) return;
    const { data } = await supabase.from("responses").select("response_data")
      .eq("session_id", sessionId).eq("response_type", "question");
    setResponses((data ?? []) as ResponseRow[]);
    sounds.questionReveal();
    setRevealed(true);
  };

  if (!revealed) {
    const text = (content as { text?: string }).text;
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Question Live</div>
        {text && <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl">{text}</div>}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 text-center">Responses</div>
          <div className="text-8xl font-extrabold text-glow">{responseCount}</div>
        </div>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-[color:var(--cyan)] animate-pulse [animation-delay:400ms]" />
        </div>
        <Button onClick={handleReveal} disabled={responseCount === 0}
          className="h-16 px-12 text-xl uppercase tracking-widest font-extrabold disabled:opacity-30">
          Reveal Results
        </Button>
      </div>
    );
  }

  return <QuestionResults content={content} responses={responses} />;
}

function QuestionResults({ content, responses }: { content: QuestionContent; responses: ResponseRow[] }) {
  const [animating, setAnimating] = useState(true);
  useEffect(() => { const t = setTimeout(() => setAnimating(false), 150); return () => clearTimeout(t); }, []);

  const total = responses.length;

  if (content.type === "true_or_false") {
    const trueCount = responses.filter(r => r.response_data.answer === "true").length;
    const falseCount = responses.filter(r => r.response_data.answer === "false").length;
    const correct = content.correct_tf ? "true" : "false";
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-12 gap-8 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Results</div>
        <div className="text-2xl font-bold text-center max-w-2xl">{content.text}</div>
        <div className="flex gap-16 justify-center">
          {(["true", "false"] as const).map(v => {
            const count = v === "true" ? trueCount : falseCount;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isCorrect = v === correct;
            return (
              <div key={v} className={`text-center transition-all duration-500 ${isCorrect ? "scale-110" : "opacity-50"}`}>
                <div className={`text-6xl font-extrabold uppercase tracking-widest ${isCorrect ? "text-[color:var(--success)]" : "text-muted-foreground"}`}>{v}</div>
                <div className="text-4xl font-bold mt-2">{count}</div>
                <div className="text-lg text-muted-foreground">{pct}%</div>
                {isCorrect && <div className="text-xs uppercase tracking-widest text-[color:var(--success)] mt-1">Correct ✓</div>}
              </div>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">{total} response{total !== 1 ? "s" : ""}</div>
      </div>
    );
  }

  // Multiple choice
  const opts = (content as { options?: string[] }).options ?? [];
  const counts = opts.map((_, i) => responses.filter(r => r.response_data.answer === i).length);
  const maxCount = Math.max(...counts, 1);

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-12 gap-6 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Results</div>
      <div className="text-2xl font-bold text-center max-w-2xl">{(content as { text?: string }).text}</div>
      <div className="w-full max-w-3xl space-y-4">
        {opts.map((opt, i) => {
          const count = counts[i];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const barW = animating ? 0 : (counts[i] / maxCount) * 100;
          const isCorrect = content.type === "multiple_choice" && content.correct === i;
          return (
            <div key={i} className="animate-slot-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-semibold ${isCorrect ? "text-[color:var(--cyan)]" : "text-foreground"}`}>
                  {String.fromCharCode(65 + i)}. {opt} {isCorrect && "✓"}
                </span>
                <span className="text-muted-foreground text-sm">{count} ({pct}%)</span>
              </div>
              <div className="h-5 bg-card/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${barW}%`, background: isCorrect ? "var(--cyan)" : "var(--orange)", transitionDelay: `${i * 80}ms` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">{total} response{total !== 1 ? "s" : ""}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COUNTDOWN TIMER
// Auto-starts on all screens. Host has Pause/Reset controls.
// Uses baseSecsRef (fixed, never synced from state) to avoid compound-decrement speed bug.
// Side screens request a sync from host when they subscribe late.
// ─────────────────────────────────────────────

function CountdownTimerRenderer({ content, screen, sessionId }: {
  content: { label?: string; duration_secs: number };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string;
}) {
  const [secsLeft, setSecsLeft] = useState(content.duration_secs);
  const [running, setRunning] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  // baseSecsRef holds remaining seconds at the moment timer was last started/resumed.
  // It is NEVER synced from secsLeft — that was the compound-decrement speed bug.
  const baseSecsRef = useRef(content.duration_secs);
  const startedAtRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const doneRef = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => { runningRef.current = running; }, [running]);

  // Tick — only runs while running
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (startedAtRef.current === null) return;
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const remaining = Math.max(0, baseSecsRef.current - elapsed);
      setSecsLeft(remaining);
      if (remaining === 0 && !doneRef.current) {
        doneRef.current = true;
        setRunning(false);
        sounds.countdownEnd();
        setFlashRed(true);
        setTimeout(() => setFlashRed(false), 2500);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [running]);

  // Channel + auto-start
  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase.channel(`timer:${sessionId}`, { config: { broadcast: { self: true } } });
    channelRef.current = ch;

    ch.on("broadcast", { event: "timer_start" }, ({ payload }: { payload: { startedAt: number; baseSecs: number } }) => {
      doneRef.current = false;
      startedAtRef.current = payload.startedAt;
      baseSecsRef.current = payload.baseSecs;
      setSecsLeft(payload.baseSecs);
      setRunning(true);
    });

    ch.on("broadcast", { event: "timer_pause" }, ({ payload }: { payload: { secsLeft: number } }) => {
      startedAtRef.current = null;
      baseSecsRef.current = payload.secsLeft;
      setSecsLeft(payload.secsLeft);
      setRunning(false);
    });

    ch.on("broadcast", { event: "timer_reset" }, () => {
      const startedAt = Date.now();
      doneRef.current = false;
      startedAtRef.current = startedAt;
      baseSecsRef.current = content.duration_secs;
      setSecsLeft(content.duration_secs);
      setRunning(true);
    });

    if (screen === "host") {
      // Respond to sync requests from side screens that subscribed late
      ch.on("broadcast", { event: "timer_sync_request" }, () => {
        if (!runningRef.current || !startedAtRef.current) return;
        channelRef.current?.send({
          type: "broadcast", event: "timer_sync",
          payload: { startedAt: startedAtRef.current, baseSecs: baseSecsRef.current },
        });
      });
    } else {
      // Receive sync from host and start from correct position
      ch.on("broadcast", { event: "timer_sync" }, ({ payload }: { payload: { startedAt: number; baseSecs: number } }) => {
        if (!payload.startedAt || !payload.baseSecs) return;
        doneRef.current = false;
        startedAtRef.current = payload.startedAt;
        baseSecsRef.current = payload.baseSecs;
        const elapsed = Math.floor((Date.now() - payload.startedAt) / 1000);
        const remaining = Math.max(0, payload.baseSecs - elapsed);
        setSecsLeft(remaining > 0 ? remaining : 0);
        if (remaining > 0) setRunning(true);
      });
    }

    ch.subscribe(() => {
      if (screen === "host") {
        // Auto-start immediately
        const startedAt = Date.now();
        doneRef.current = false;
        startedAtRef.current = startedAt;
        baseSecsRef.current = content.duration_secs;
        setRunning(true);
        ch.send({ type: "broadcast", event: "timer_start", payload: { startedAt, baseSecs: content.duration_secs } });
      } else {
        // Request current state from host (it may already be running)
        setTimeout(() => {
          ch.send({ type: "broadcast", event: "timer_sync_request", payload: {} });
        }, 300);
      }
    });

    return () => { supabase.removeChannel(ch); channelRef.current = null; };
  }, [sessionId, content.duration_secs, screen]);

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const urgent = secsLeft > 0 && secsLeft <= 10;
  const done = secsLeft === 0 && doneRef.current;

  const handlePause = () => {
    if (!startedAtRef.current) return;
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
    const remaining = Math.max(0, baseSecsRef.current - elapsed);
    channelRef.current?.send({ type: "broadcast", event: "timer_pause", payload: { secsLeft: remaining } });
  };

  const handleResume = () => {
    const startedAt = Date.now();
    channelRef.current?.send({ type: "broadcast", event: "timer_start", payload: { startedAt, baseSecs: baseSecsRef.current } });
  };

  const handleReset = () => {
    channelRef.current?.send({ type: "broadcast", event: "timer_reset", payload: {} });
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 animate-slot-in">
      {content.label && (
        <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl px-8">{content.label}</div>
      )}
      <div
        className={`text-[22vw] font-extrabold font-mono leading-none tabular-nums transition-colors duration-500
          ${done ? "text-destructive text-glow" : urgent ? "text-[color:var(--orange)] text-glow" : "text-foreground"}`}
      >
        {timeStr}
      </div>
      {screen === "host" && (
        <div className="flex gap-4">
          {running ? (
            <Button onClick={handlePause} variant="outline" className="h-14 px-10 text-lg uppercase tracking-widest">
              Pause
            </Button>
          ) : !done ? (
            <Button onClick={handleResume} className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold">
              Resume
            </Button>
          ) : null}
          <Button onClick={handleReset} variant="outline" className="h-14 px-10 text-lg uppercase tracking-widest">
            Reset
          </Button>
        </div>
      )}
      {done && (
        <div className="text-xl uppercase tracking-[0.3em] text-destructive animate-pulse font-bold">Time's up!</div>
      )}
      {flashRed && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-destructive/50 animate-pulse" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HOST TIMER — host-only local timer (no broadcast to side screens)
// Auto-starts when the slide loads.
// ─────────────────────────────────────────────

function HostTimerRenderer({ content }: {
  content: { label?: string; duration_secs: number };
}) {
  const [secsLeft, setSecsLeft] = useState(content.duration_secs);
  const [running, setRunning] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const baseSecsRef = useRef(content.duration_secs);
  const startedAtRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  // Auto-start on mount
  useEffect(() => {
    const startedAt = Date.now();
    startedAtRef.current = startedAt;
    baseSecsRef.current = content.duration_secs;
    setRunning(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (startedAtRef.current === null) return;
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const remaining = Math.max(0, baseSecsRef.current - elapsed);
      setSecsLeft(remaining);
      if (remaining === 0 && !doneRef.current) {
        doneRef.current = true;
        setRunning(false);
        sounds.countdownEnd();
        setFlashRed(true);
        setTimeout(() => setFlashRed(false), 2500);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [running]);

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const urgent = secsLeft > 0 && secsLeft <= 10;
  const done = secsLeft === 0 && doneRef.current;

  const handlePause = () => {
    if (!startedAtRef.current) return;
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
    baseSecsRef.current = Math.max(0, baseSecsRef.current - elapsed);
    startedAtRef.current = null;
    setRunning(false);
  };

  const handleResume = () => {
    startedAtRef.current = Date.now();
    setRunning(true);
  };

  const handleReset = () => {
    doneRef.current = false;
    const startedAt = Date.now();
    startedAtRef.current = startedAt;
    baseSecsRef.current = content.duration_secs;
    setSecsLeft(content.duration_secs);
    setRunning(true);
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 animate-slot-in">
      {content.label && (
        <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl px-8">{content.label}</div>
      )}
      <div
        className={`text-[22vw] font-extrabold font-mono leading-none tabular-nums transition-colors duration-500
          ${done ? "text-destructive text-glow" : urgent ? "text-[color:var(--orange)] text-glow" : "text-foreground"}`}
      >
        {timeStr}
      </div>
      <div className="flex gap-4">
        {running ? (
          <Button onClick={handlePause} variant="outline" className="h-14 px-10 text-lg uppercase tracking-widest">
            Pause
          </Button>
        ) : !done ? (
          <Button onClick={handleResume} className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold">
            Resume
          </Button>
        ) : null}
        <Button onClick={handleReset} variant="outline" className="h-14 px-10 text-lg uppercase tracking-widest">
          Reset
        </Button>
      </div>
      {done && (
        <div className="text-xl uppercase tracking-[0.3em] text-destructive animate-pulse font-bold">Time's up!</div>
      )}
      {flashRed && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-destructive/50 animate-pulse" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// VOTING MODE — host shows live bar chart; TS1/TS2 show option buttons
// Stored in `responses` with response_type="voting", response_data={option:number}
// ─────────────────────────────────────────────

const VOTE_PALETTE = ["var(--cyan)", "var(--orange)", "var(--success)", "oklch(0.72 0.18 300)"];

function VotingRenderer({ content, screen, sessionId, slotId }: {
  content: { question: string; options: string[] };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const options = (content.options ?? []).filter((o) => typeof o === "string");
  if (screen === "host") return <VotingHost question={content.question} options={options} sessionId={sessionId} slotId={slotId} />;
  return <VotingInput question={content.question} options={options} screen={screen} sessionId={sessionId} slotId={slotId} />;
}

function VotingInput({ question, options, screen, sessionId, slotId }: {
  question: string; options: string[]; screen: "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [personNum, setPersonNum] = useState(1);
  const [recorded, setRecorded] = useState(0);
  const [phase, setPhase] = useState<"input" | "confirm" | "done">("input");

  const submit = async (i: number) => {
    if (!sessionId || submitting || phase !== "input") return;
    setPicked(i);
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: screen,
      response_type: "voting", response_data: { option: i } as never,
    });
    setSubmitting(false);
    setRecorded(c => c + 1);
    setPhase("confirm");
  };

  const nextPerson = () => { setPicked(null); setPersonNum(n => n + 1); setPhase("input"); };

  if (phase === "done") {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-6 p-10 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)]">All votes in</div>
        <div className="text-5xl md:text-7xl font-extrabold text-glow text-center">That's everyone!</div>
        <div className="text-xl text-muted-foreground">{recorded} {recorded === 1 ? "vote" : "votes"} recorded</div>
      </div>
    );
  }

  if (phase === "confirm") {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 p-10 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)]">Person {personNum} recorded</div>
        <div className="text-4xl md:text-5xl font-extrabold text-glow text-center">Thanks!</div>
        {picked !== null && (
          <div className="text-2xl text-muted-foreground">Voted: <span className="font-bold text-foreground">{options[picked]}</span></div>
        )}
        <div className="text-sm text-muted-foreground uppercase tracking-widest">{recorded} so far</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={nextPerson} className="h-16 px-10 text-xl uppercase tracking-widest font-extrabold">Next Person →</Button>
          <Button onClick={() => setPhase("done")} variant="outline" className="h-16 px-10 text-xl uppercase tracking-widest font-extrabold border-2">That's Everyone ✓</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-8 gap-8 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)]">Person {personNum}</div>
      <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl">{question || "Cast your vote"}</div>
      <div className={`grid gap-4 w-full max-w-3xl ${options.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"}`}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => submit(i)} disabled={submitting}
            className="h-32 md:h-40 rounded-3xl border-4 text-3xl md:text-4xl font-extrabold uppercase tracking-wide transition-all active:scale-[0.97] disabled:opacity-40"
            style={{ borderColor: VOTE_PALETTE[i % VOTE_PALETTE.length], background: `color-mix(in oklab, ${VOTE_PALETTE[i % VOTE_PALETTE.length]} 18%, transparent)`, color: VOTE_PALETTE[i % VOTE_PALETTE.length] }}>
            {opt || `Option ${String.fromCharCode(65 + i)}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function VotingHost({ question, options, sessionId, slotId }: {
  question: string; options: string[]; sessionId?: string; slotId?: string;
}) {
  const [votes, setVotes] = useState<number[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      let q = supabase.from("responses").select("response_data").eq("session_id", sessionId).eq("response_type", "voting");
      if (slotId) q = q.eq("slot_id", slotId);
      const { data } = await q;
      if (!cancelled && data) setVotes(data.map(r => (r.response_data as { option?: number })?.option).filter((n): n is number => typeof n === "number"));
    })();
    const ch = supabase.channel(`vote:${sessionId}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const r = payload.new as { response_type: string; response_data: { option?: number }; slot_id: string | null };
        if (r.response_type !== "voting") return;
        if (slotId && r.slot_id !== slotId) return;
        if (typeof r.response_data?.option === "number") setVotes(p => [...p, r.response_data.option!]);
      }).subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [sessionId, slotId]);

  const counts = options.map((_, i) => votes.filter(v => v === i).length);
  const total = votes.length;
  const maxCount = Math.max(...counts, 1);

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-12 gap-8 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Voting · Live</div>
      <div className="text-3xl md:text-5xl font-bold text-center max-w-3xl">{question || "Voting"}</div>
      <div className="w-full max-w-4xl space-y-5">
        {options.map((opt, i) => {
          const c = counts[i];
          const pct = total > 0 ? Math.round((c / total) * 100) : 0;
          const w = (c / maxCount) * 100;
          const color = VOTE_PALETTE[i % VOTE_PALETTE.length];
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl md:text-2xl font-bold" style={{ color }}>{opt || `Option ${String.fromCharCode(65 + i)}`}</span>
                <span className="text-lg text-muted-foreground tabular-nums">{c} · {pct}%</span>
              </div>
              <div className="h-8 rounded-xl bg-card/60 overflow-hidden">
                <div className="h-full rounded-xl transition-all duration-700 ease-out" style={{ width: `${w}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest">{total} vote{total === 1 ? "" : "s"}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUIZ BUZZER MODE — TS1 = Team 1, TS2 = Team 2, Host shows scores + controls
// State synced via realtime broadcast on channel quiz:${sessionId}
// ─────────────────────────────────────────────

type QuizState = {
  buzzed: "team1" | "team2" | null;
  scores: { team1: number; team2: number };
  currentQuestion: number;
};

function QuizBuzzerRenderer({ content, screen, sessionId }: {
  content: { question?: string; questions?: string[]; team1_name?: string; team2_name?: string };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string;
}) {
  const team1Name = content.team1_name?.trim() || "Team 1";
  const team2Name = content.team2_name?.trim() || "Team 2";
  // Build question list — prefer `questions` array, else fall back to single `question`.
  const questions = (content.questions && content.questions.length > 0)
    ? content.questions
    : (content.question ? [content.question] : []);
  const [state, setState] = useState<QuizState>({ buzzed: null, scores: { team1: 0, team2: 0 }, currentQuestion: 0 });
  const stateRef = useRef(state);
  const channelRef = useRef<RealtimeChannel | null>(null);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase.channel(`quiz:${sessionId}`, { config: { broadcast: { self: true } } });
    channelRef.current = ch;
    ch.on("broadcast", { event: "quiz_state" }, ({ payload }: { payload: QuizState }) => {
      setState({ ...payload, buzzed: payload.buzzed ?? null, scores: payload.scores ?? { team1: 0, team2: 0 }, currentQuestion: payload.currentQuestion ?? 0 });
    });
    if (screen === "host") {
      ch.on("broadcast", { event: "quiz_sync_request" }, () => {
        ch.send({ type: "broadcast", event: "quiz_state", payload: stateRef.current });
      });
    }
    ch.subscribe(() => {
      if (screen !== "host") {
        setTimeout(() => ch.send({ type: "broadcast", event: "quiz_sync_request", payload: {} }), 200);
      }
    });
    return () => { supabase.removeChannel(ch); channelRef.current = null; };
  }, [sessionId, screen]);

  const broadcast = (next: QuizState) => {
    setState(next);
    channelRef.current?.send({ type: "broadcast", event: "quiz_state", payload: next });
  };

  const buzz = (team: "team1" | "team2") => {
    if (state.buzzed) return;
    const next = { ...state, buzzed: team };
    broadcast(next);
    sounds.questionReveal();
  };

  const currentQ = questions[state.currentQuestion] ?? "";
  const qLabel = questions.length > 1 ? `Question ${state.currentQuestion + 1} / ${questions.length}` : "Quiz";

  // ── TS1 / TS2: massive buzz button
  if (screen === "screen1" || screen === "screen2") {
    const team = screen === "screen1" ? "team1" : "team2";
    const name = team === "team1" ? team1Name : team2Name;
    const color = team === "team1" ? "var(--cyan)" : "var(--orange)";
    const isMe = state.buzzed === team;
    const other = state.buzzed && !isMe;
    return (
      <div className="min-h-screen w-full bg-immersive flex flex-col p-6 gap-4 animate-slot-in">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{qLabel}</div>
          <div className="text-3xl md:text-5xl font-extrabold mt-1" style={{ color }}>{name}</div>
        </div>
        {currentQ && (
          <div className="text-xl md:text-2xl font-bold text-center px-4">{currentQ}</div>
        )}
        <button
          onClick={() => buzz(team)}
          disabled={Boolean(state.buzzed)}
          className="flex-1 rounded-[3rem] border-[6px] font-black uppercase tracking-[0.4em] text-6xl md:text-8xl transition-all active:scale-[0.97] disabled:opacity-30"
          style={{
            borderColor: color,
            background: isMe ? color : `color-mix(in oklab, ${color} 15%, transparent)`,
            color: isMe ? "#000" : color,
          }}
        >
          {isMe ? "✓ Buzzed!" : other ? "Locked" : "BUZZ"}
        </button>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border-2 border-[color:var(--cyan)]/40 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{team1Name}</div>
            <div className="text-3xl font-extrabold text-[color:var(--cyan)] tabular-nums">{state.scores.team1}</div>
          </div>
          <div className="rounded-xl border-2 border-[color:var(--orange)]/40 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{team2Name}</div>
            <div className="text-3xl font-extrabold text-[color:var(--orange)] tabular-nums">{state.scores.team2}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Host view: question, scores, controls
  const resetBuzz = () => broadcast({ ...state, buzzed: null });
  const award = (team: "team1" | "team2", n: number) => {
    const scores = { ...state.scores, [team]: Math.max(0, state.scores[team] + n) };
    broadcast({ ...state, scores, buzzed: null });
  };
  const resetScores = () => broadcast({ ...state, buzzed: null, scores: { team1: 0, team2: 0 } });
  const goQuestion = (delta: number) => {
    const next = Math.max(0, Math.min(questions.length - 1, state.currentQuestion + delta));
    broadcast({ ...state, currentQuestion: next, buzzed: null });
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 gap-8 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">{qLabel}</div>
      {currentQ && (
        <div className="text-3xl md:text-5xl font-bold text-center max-w-4xl">{currentQ}</div>
      )}
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        {(["team1", "team2"] as const).map((t) => {
          const isBuzzed = state.buzzed === t;
          const color = t === "team1" ? "var(--cyan)" : "var(--orange)";
          const name = t === "team1" ? team1Name : team2Name;
          return (
            <div key={t}
              className={`rounded-3xl border-4 p-6 flex flex-col items-center gap-3 transition-all ${isBuzzed ? "scale-105 shadow-[0_0_60px_color-mix(in_oklab,var(--cyan)_40%,transparent)]" : ""}`}
              style={{ borderColor: color, background: isBuzzed ? `color-mix(in oklab, ${color} 25%, transparent)` : "transparent" }}>
              <div className="text-sm uppercase tracking-[0.3em]" style={{ color }}>{name}</div>
              <div className="text-8xl font-black tabular-nums" style={{ color }}>{state.scores[t]}</div>
              {isBuzzed && <div className="text-2xl font-extrabold uppercase tracking-widest animate-pulse" style={{ color }}>BUZZED IN!</div>}
              <div className="flex gap-2 mt-2">
                <Button onClick={() => award(t, 1)} className="h-10 px-4 text-sm font-bold">+1</Button>
                <Button onClick={() => award(t, 5)} variant="outline" className="h-10 px-4 text-sm font-bold">+5</Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={resetBuzz} disabled={!state.buzzed} variant="outline"
          className="h-12 px-6 text-sm uppercase tracking-widest font-bold">
          Reset Buzzers
        </Button>
        {questions.length > 1 && (
          <>
            <Button onClick={() => goQuestion(-1)} disabled={state.currentQuestion === 0} variant="outline"
              className="h-12 px-6 text-sm uppercase tracking-widest font-bold">
              ← Prev Question
            </Button>
            <Button onClick={() => goQuestion(1)} disabled={state.currentQuestion >= questions.length - 1}
              className="h-12 px-6 text-sm uppercase tracking-widest font-bold">
              Next Question →
            </Button>
          </>
        )}
        <Button onClick={resetScores} variant="outline"
          className="h-12 px-6 text-sm uppercase tracking-widest font-bold border-destructive/40 text-destructive hover:bg-destructive/10">
          Reset Scores
        </Button>
      </div>
    </div>
  );
}
