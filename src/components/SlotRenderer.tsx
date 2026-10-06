import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sounds } from "@/lib/audio";
import { checkProfanity, PROFANITY_MESSAGE } from "@/lib/profanity";
import { Button } from "@/components/ui/button";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { RotationTimerRenderer, type RotationTimerContent } from "@/components/RotationTimer";
import { HazardHotspotsRenderer, type HazardHotspotsContent } from "@/components/HazardHotspots";

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
  | { type: "text_slide"; text: string; title?: string; subtitle?: string; size?: "sm" | "md" | "lg" | "xl" | "2xl"; color?: string }
  | { type: "youtube"; url: string }
  | { type: "video"; url: string; file_name?: string; loop?: boolean }
  | { type: "image"; url: string; file_name?: string; title?: string }
  | { type: "embed"; url: string; description?: string }
  | { type: "confidence_checker"; prompt: string; optional_qualitative?: boolean; scale_mode?: "numbers" | "emoji" | "likert"; max?: number; checkpoint?: "start" | "final" }
  | { type: "wheel_spinner"; items: string[]; prompt?: string }
  | { type: "countdown_timer"; label?: string; duration_secs: number }
  | { type: "host_timer"; label?: string; duration_secs: number }
  | { type: "multiple_choice"; id?: string; text: string; options: string[]; correct?: number }
  | { type: "true_or_false"; id?: string; text: string; correct_tf?: boolean }
  | { type: "question_round"; questions: RoundQ[] }
  | { type: "voting"; question: string; options: string[] }
  | { type: "quiz_buzzer"; question?: string; questions?: string[]; answers?: string[]; team1_name?: string; team2_name?: string }
  | { type: "word_cloud"; title?: string; prompt?: string; max_words?: number }
  | { type: "padlet"; question: string; title?: string }
  | { type: "whiteboard"; title?: string; image_url?: string; file_name?: string }
  | RotationTimerContent
  | HazardHotspotsContent
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
      // 0.85: the main text was dominating the screen; tutors asked for it smaller.
      const fontSize = `clamp(1.25rem, ${(baseVw * shrink * 0.85).toFixed(2)}vw, 14rem)`;
      const slideTitle = (c.title ?? "").trim();
      return (
        <div
          key={String(c.text) + String(c.subtitle ?? "") + slideTitle}
          className={`h-screen w-full bg-immersive bg-grid flex flex-col items-center p-8 overflow-hidden animate-slot-in ${slideTitle ? "pt-[7vh]" : ""}`}
        >
          {/* The title is pinned near the top; the text keeps the middle of what is left. */}
          {slideTitle && <TitleBox text={slideTitle} />}
          <div className="flex-1 min-h-0 flex items-center justify-center">
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
            src={`https://www.youtube.com/embed/${videoId}?${params}${youTubeClipParams(c.url)}`}
            className="w-full h-screen border-0"
            allow="autoplay; fullscreen" allowFullScreen title="YouTube video" />
        </div>
      );
    }

    case "video": {
      const c = content as Extract<SlotContent, { type: "video" }>;
      if (!c.url) return <Waiting screen={screen} />;
      return <LoopingVideo url={c.url} loop={c.loop !== false} withSound={screen === "host"} />;
    }

    case "image": {
      const c = content as Extract<SlotContent, { type: "image" }>;
      if (!c.url) return <Waiting screen={screen} />;
      const title = (c.title ?? "").trim();
      return (
        <div className="h-screen w-full bg-black animate-slot-in flex flex-col items-center justify-center px-4 pb-4 pt-[5vh] gap-[3vh] overflow-hidden">
          {title && <TitleBox text={title} />}
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
            src={normalizeEmbedUrl(c.url)}
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
        return c.checkpoint === "final"
          ? <ConfidenceCompareHost content={c} sessionId={sessionId} />
          : <ConfidenceCheckerHost content={c} sessionId={sessionId} slotId={slotId} />;
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

    case "rotation_timer":
      return <RotationTimerRenderer content={content as RotationTimerContent} screen={screen} sessionId={sessionId} />;

    case "hazard_hotspots":
      return <HazardHotspotsRenderer content={content as HazardHotspotsContent} screen={screen} sessionId={sessionId} />;

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

    case "question_round": {
      const c = content as Extract<SlotContent, { type: "question_round" }>;
      return <QuestionRoundRenderer content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
    }

    case "voting": {
      const c = content as Extract<SlotContent, { type: "voting" }>;
      return <VotingRenderer content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
    }

    case "quiz_buzzer": {
      const c = content as Extract<SlotContent, { type: "quiz_buzzer" }>;
      return <QuizBuzzerRenderer content={c} screen={screen} sessionId={sessionId} />;
    }

    case "word_cloud": {
      const c = content as Extract<SlotContent, { type: "word_cloud" }>;
      return <WordCloudRenderer content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
    }

    case "padlet": {
      const c = content as Extract<SlotContent, { type: "padlet" }>;
      return <PadletRenderer content={c} screen={screen} sessionId={sessionId} slotId={slotId} />;
    }

    case "whiteboard": {
      const c = content as Extract<SlotContent, { type: "whiteboard" }>;
      return <WhiteboardRenderer content={c} screen={screen} sessionId={sessionId} />;
    }

    default:
      return <Waiting screen={screen} />;
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

import { extractEmbedUrl, extractYouTubeId, youTubeClipParams } from "@/lib/sessionSchema";

/** Turn ordinary share links (YouTube, Edpuzzle, Jigsaw Planet) into their embeddable form. */
export function normalizeEmbedUrl(url: string): string {
  // Lessons saved before the designer understood share snippets hold raw HTML
  // here, so pull the address out again at render time.
  const clean = extractEmbedUrl(url);
  try {
    const u = new URL(clean);
    const yt = extractYouTubeId(u.href);
    if (yt) return `https://www.youtube.com/embed/${yt}?rel=0`;
    if (u.hostname.endsWith("edpuzzle.com")) {
      const m = u.pathname.match(/^\/(?:embed\/)?media\/([a-z0-9]+)/i);
      if (m) return `https://edpuzzle.com/embed/media/${m[1]}`;
    }
    // Jigsaw Planet refuses to be framed unless asked for its iframe view.
    if (u.hostname.endsWith("jigsawplanet.com") && u.searchParams.get("rc") === "play") {
      u.searchParams.set("view", "iframe");
    }
    return u.href;
  } catch { return clean; }
}

/**
 * An uploaded video that starts by itself and, by default, loops forever.
 * Browsers refuse to autoplay with sound until someone has interacted with the
 * page, so if the first attempt is refused it plays muted rather than not at all.
 */
function LoopingVideo({ url, loop, withSound }: { url: string; loop: boolean; withSound: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !withSound;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [url, withSound]);
  return (
    <div className="h-screen w-full bg-black animate-slot-in">
      <video ref={ref} key={url} src={url} loop={loop} autoPlay playsInline muted={!withSound}
        className="w-full h-full object-contain" />
    </div>
  );
}

/**
 * A heading in an outlined box. Titles sitting bare at the very top of a
 * projected screen were getting lost, so they are boxed and pushed down a
 * little wherever a slide has one. Shrinks as the text gets longer.
 */
function TitleBox({ text, small = false }: { text: string; small?: boolean }) {
  const len = text.length;
  const vw = (len > 60 ? 2.6 : len > 40 ? 3.4 : len > 20 ? 4.4 : 5.5) * (small ? 0.8 : 1);
  return (
    <h2
      className="shrink-0 max-w-[92vw] rounded-2xl border-4 border-[color:var(--cyan)] bg-black/50 px-[2.5vw] py-[1.2vh] text-center font-extrabold leading-tight text-glow whitespace-pre-line"
      style={{ fontSize: `clamp(1.25rem, ${vw}vw, 5rem)`, color: "var(--cyan)" }}
    >
      {text}
    </h2>
  );
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
const EMOJI_LABELS = ["Really sad", "Slightly sad", "Neutral", "Happy", "Really happy"];
const EMOJI_FACES = ["😢", "😟", "😐", "🙂", "😄"];

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
  content: { prompt: string; optional_qualitative?: boolean; scale_mode?: "numbers" | "emoji" | "likert"; max?: number; checkpoint?: "start" | "final" };
  screen: "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const checkpoint = content.checkpoint === "final" ? "final" : "start";
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
      response_type: "confidence_checker", response_data: { score, thoughts, checkpoint, max: options.length } as never,
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
      <div className="text-2xl md:text-3xl font-bold text-center max-w-lg leading-snug whitespace-pre-line">
        {content.prompt || "How confident are you?"}
      </div>

      {mode === "emoji" ? (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl">
          {options.map(n => (
            <button key={n} onClick={() => setScore(n)}
              aria-label={EMOJI_LABELS[n - 1]}
              className={`flex items-center justify-center px-4 py-3 rounded-2xl border-2 transition-all duration-150
                ${score === n ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20"
                  : "border-border hover:border-[color:var(--cyan)]/50 active:scale-95"}`}>
              <span className="text-5xl md:text-6xl leading-none">{EMOJI_FACES[n - 1]}</span>
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
      <div className="flex items-end gap-4 md:gap-8">
        {options.map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-2">
            <span className="text-2xl font-extrabold">{counts[i]}</span>
            <div className="w-12 md:w-16 rounded-t-xl transition-all duration-700"
              style={{ height: `${counts[i] === 0 ? 4 : Math.max(12, (counts[i] / maxCount) * 176)}px`, background: barColor(i) }} />
            {mode === "emoji" ? (
              <span className="text-4xl md:text-5xl leading-none">{EMOJI_FACES[i]}</span>
            ) : (
              <span className="text-xl font-bold" style={{ color: barColor(i) }}>{n}</span>
            )}
          </div>
        ))}
      </div>
      {mode === "likert" && (
        <div className="flex justify-between w-full max-w-md text-xs text-muted-foreground uppercase tracking-widest">
          <span>{LIKERT_LABELS[0]}</span>
          <span>{LIKERT_LABELS[LIKERT_LABELS.length - 1]}</span>
        </div>
      )}
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
// CONFIDENCE CHECKER — Host comparison (start vs final/now)
// ─────────────────────────────────────────────

function confidenceBarColor(i: number, total: number) {
  const t = total <= 1 ? 1 : i / (total - 1);
  return `oklch(0.75 0.17 ${Math.round(25 + t * 120)})`;
}

function ConfidenceMiniBars({ scores, options, dim, emoji }: { scores: number[]; options: number[]; dim: boolean; emoji?: boolean }) {
  const counts = options.map(n => scores.filter(s => s === n).length);
  const maxC = Math.max(...counts, 1);
  return (
    <div className="flex items-end gap-2 md:gap-3">
      {options.map((n, i) => (
        <div key={n} className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold">{counts[i]}</span>
          <div className="w-7 md:w-10 rounded-t-lg transition-all duration-700"
            style={{ height: `${counts[i] === 0 ? 3 : Math.max(8, (counts[i] / maxC) * 96)}px`, background: confidenceBarColor(i, options.length), opacity: dim ? 0.5 : 1 }} />
          {emoji ? (
            <span className="text-2xl leading-none" style={{ opacity: dim ? 0.6 : 1 }}>{EMOJI_FACES[i]}</span>
          ) : (
            <span className="text-xs font-bold" style={{ color: confidenceBarColor(i, options.length) }}>{n}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ConfidenceCompareHost({ content, sessionId }: {
  content: { scale_mode?: "numbers" | "emoji" | "likert"; max?: number };
  sessionId?: string;
}) {
  const { mode, options } = resolveScale(content);
  const [startScores, setStartScores] = useState<number[]>([]);
  const [finalScores, setFinalScores] = useState<number[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      const { data } = await supabase.from("responses").select("response_data")
        .eq("session_id", sessionId).eq("response_type", "confidence_checker");
      const starts: number[] = [], finals: number[] = [];
      for (const r of (data ?? [])) {
        const d = r.response_data as { score?: number; checkpoint?: string };
        if (typeof d?.score !== "number") continue;
        if (d.checkpoint === "final") finals.push(d.score); else starts.push(d.score);
      }
      setStartScores(starts);
      setFinalScores(finals);
    })();
    const ch = supabase.channel(`cccmp:${sessionId}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const row = payload.new as { response_type: string; response_data: { score?: number; checkpoint?: string } };
        if (row.response_type !== "confidence_checker") return;
        const d = row.response_data;
        if (typeof d?.score !== "number") return;
        if (d.checkpoint === "final") setFinalScores(p => [...p, d.score as number]);
        else setStartScores(p => [...p, d.score as number]);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sessionId]);

  const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const startAvg = mean(startScores);
  const finalAvg = mean(finalScores);
  const delta = startAvg !== null && finalAvg !== null ? finalAvg - startAvg : null;
  const improved = delta !== null && delta > 0.05 && finalScores.length > 0;
  const fmt = (v: number | null) => (v === null ? "—" : v.toFixed(1));

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 gap-8 animate-slot-in">
      {improved && <Confetti />}
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Confidence · Start vs Now</div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">At the start</div>
          <ConfidenceMiniBars scores={startScores} options={options} dim emoji={mode === "emoji"} />
          <div className="text-4xl font-extrabold text-muted-foreground">{fmt(startAvg)}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{startScores.length} responses</div>
        </div>

        <div className="text-4xl text-muted-foreground">→</div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">Now · live</div>
          <ConfidenceMiniBars scores={finalScores} options={options} dim={false} emoji={mode === "emoji"} />
          <div className="text-4xl font-extrabold text-[color:var(--cyan)]">{fmt(finalAvg)}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{finalScores.length} responses</div>
        </div>
      </div>

      {delta !== null && finalScores.length > 0 && (
        <div className="text-center">
          {improved ? (
            <>
              <div className="text-5xl md:text-6xl font-extrabold text-[color:var(--success)] text-glow">↑ +{delta.toFixed(1)} 🎉</div>
              <div className="text-lg text-[color:var(--success)] uppercase tracking-widest mt-2 font-bold">Brilliant — confidence is up! Well done.</div>
            </>
          ) : delta < -0.05 ? (
            <div className="text-3xl font-extrabold text-[color:var(--orange)]">↓ {delta.toFixed(1)} — worth revisiting</div>
          ) : (
            <div className="text-3xl font-extrabold text-muted-foreground">≈ Holding steady</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// WHEEL SPINNER
// ─────────────────────────────────────────────

const WHEEL_COLORS = ["var(--cyan)", "var(--orange)", "var(--success)", "oklch(0.72 0.18 300)", "oklch(0.82 0.18 80)"];

function WheelSpinnerRenderer({ content, screen, sessionId }: {
  content: { items: string[]; prompt?: string }; screen: "host" | "screen1" | "screen2"; sessionId?: string;
}) {
  const items = (content.items ?? []).filter(Boolean);
  // With a prompt the wheel is allocating a task, not picking a winner: keep
  // the question up, show the result plainly and leave it until the next spin.
  const prompt = content.prompt?.trim();
  const promptRef = useRef(prompt);
  promptRef.current = prompt;
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
      if (!promptRef.current) setTimeout(() => setResult(null), 3000);
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
      {prompt && (
        <div className="text-3xl md:text-5xl font-extrabold text-glow text-center max-w-[90vw] px-6 whitespace-pre-line">
          {prompt}
        </div>
      )}
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
            const x = 50 + 30 * Math.cos(rad);
            const y = 50 + 30 * Math.sin(rad);
            return (
              <span key={i} className="absolute text-[10px] md:text-xs font-extrabold text-white leading-tight text-center pointer-events-none break-words"
                style={{ left: `${x}%`, top: `${y}%`, width: "34%", transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                {item}
              </span>
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-[3px] border-[color:var(--cyan)]" />
          </div>
        </div>
      </div>
      {result && prompt && (
        <div className="animate-slot-in text-5xl md:text-7xl font-extrabold text-glow text-center">{result}</div>
      )}
      {result && !prompt && (
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

type ResponseRow = {
  id?: string;
  screen_role?: string;
  response_data: { answer: number | string; thoughts?: string[]; qIndex?: number; round?: string };
};

/** Short stable tag for a piece of content, so answers to one activity are not mixed with another's. */
function contentKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function QuestionRendererHost({ content, sessionId }: { content: QuestionContent; sessionId?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const revealedRef = useRef(revealed);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

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

  // Listen for reveal trigger from phone remote.
  useEffect(() => {
    if (!sessionId) return;
    const revCh = supabase.channel(`qh-rev:${sessionId}`, { config: { broadcast: { self: true } } });
    revCh.on("broadcast", { event: "reveal" }, async () => {
      if (revealedRef.current) return;
      const { data } = await supabase.from("responses").select("id,response_data,screen_role")
        .eq("session_id", sessionId).eq("response_type", "question").order("created_at");
      setResponses((data ?? []) as ResponseRow[]);
      sounds.questionReveal();
      setRevealed(true);
    }).subscribe();
    return () => { supabase.removeChannel(revCh); };
  }, [sessionId]);

  // Reveal is controlled here on the Host screen.
  const handleReveal = async () => {
    if (!sessionId) return;
    const { data } = await supabase.from("responses").select("id,response_data,screen_role")
      .eq("session_id", sessionId).eq("response_type", "question").order("created_at");
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

  // A single question is answered on Touch Screen 2 only.
  return <QuestionResults content={content} responses={responses} screens={["screen2"]} />;
}

const SCREEN_NAMES: Record<string, string> = { screen1: "Screen 1", screen2: "Screen 2" };

/**
 * The reveal. One card per touch screen saying whether that screen got it
 * right, rather than a bar chart of percentages: with two screens answering,
 * "50%" told the room nothing that "Screen 1 correct, Screen 2 incorrect" does not.
 */
function QuestionResults({ content, responses, screens = ["screen1", "screen2"] }: {
  content: QuestionContent; responses: ResponseRow[]; screens?: string[];
}) {
  const c = content as { type: string; text?: string; options?: string[]; correct?: number; correct_tf?: boolean };
  const isTf = c.type === "true_or_false";
  const opts = c.options ?? [];
  const correct: number | string | null = isTf
    ? (typeof c.correct_tf === "boolean" ? (c.correct_tf ? "true" : "false") : null)
    : (typeof c.correct === "number" ? c.correct : null);
  const label = (a: number | string) =>
    isTf ? (a === "true" ? "True" : "False") : `${String.fromCharCode(65 + Number(a))}. ${opts[Number(a)] ?? ""}`;

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center px-12 pt-12 pb-44 gap-8 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Results</div>
      {c.text && <div className="text-2xl md:text-4xl font-bold text-center max-w-3xl">{c.text}</div>}
      {correct !== null && (
        <div className="rounded-2xl border-2 border-[color:var(--success)] bg-[color:var(--success)]/10 px-8 py-3 text-xl md:text-3xl font-extrabold text-[color:var(--success)] text-center">
          Correct answer: {label(correct)}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-8">
        {screens.map((s, i) => {
          // The last answer a screen sent is the one that counts.
          const mine = responses.filter(r => r.screen_role === s);
          const given = mine.length ? mine[mine.length - 1].response_data.answer : null;
          const status = given === null ? "none" : correct === null ? "answered" : given === correct ? "right" : "wrong";
          const tone =
            status === "right" ? "var(--success)" :
            status === "wrong" ? "var(--destructive)" :
            status === "answered" ? "var(--cyan)" : "var(--muted-foreground)";
          return (
            <div key={s} className="w-[min(40vw,28rem)] rounded-3xl border-4 p-8 text-center animate-slot-in"
              style={{ borderColor: tone, background: `color-mix(in oklab, ${tone} 12%, transparent)`, animationDelay: `${i * 120}ms` }}>
              <div className="text-lg md:text-2xl uppercase tracking-[0.3em] font-bold text-muted-foreground">{SCREEN_NAMES[s] ?? s}</div>
              <div className="text-4xl md:text-6xl font-extrabold mt-3" style={{ color: tone }}>
                {status === "right" ? "✓ Correct" : status === "wrong" ? "✕ Incorrect" : status === "answered" ? "Answered" : "No answer"}
              </div>
              {given !== null && (
                <div className="text-lg md:text-2xl font-semibold mt-3 text-foreground">{label(given)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUESTION ROUND — several MC / T-F questions on one slot, host-advanced
// ─────────────────────────────────────────────

type RoundQ = {
  id?: string;
  type: "multiple_choice" | "true_or_false";
  text?: string;
  options?: string[];
  correct?: number;
  correct_tf?: boolean;
};

type RoundState = { index: number; revealed: boolean };

// Shared answer input (matches the single-question styling).
function QuestionInputUI({ question, answer, setAnswer }: {
  question: RoundQ; answer: number | string | null; setAnswer: (a: number | string) => void;
}) {
  if (question.type === "true_or_false") {
    return (
      <div className="flex gap-6">
        {(["true", "false"] as const).map(v => (
          <button key={v} onClick={() => setAnswer(v)}
            className={`w-36 h-20 rounded-2xl text-2xl font-extrabold border-2 uppercase tracking-widest transition-all duration-150
              ${answer === v ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] scale-105" : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"}`}>
            {v}
          </button>
        ))}
      </div>
    );
  }
  const opts = question.options ?? [];
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      {opts.map((opt, i) => (
        <button key={i} onClick={() => setAnswer(i)}
          className={`w-full px-6 py-4 rounded-2xl text-left text-lg font-semibold border-2 transition-all duration-150
            ${answer === i ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]" : "border-border text-foreground hover:border-[color:var(--cyan)]/50"}`}>
          <span className="mr-3 text-muted-foreground font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
        </button>
      ))}
    </div>
  );
}

function QuestionRoundRenderer({ content, screen, sessionId, slotId }: {
  content: { questions?: RoundQ[] };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const questions = (content.questions ?? []).filter(q => q && q.type);
  // Two rounds in one lesson both have a "question 1". Without this tag the
  // second round counted the first round's answers.
  const roundKey = contentKey(questions.map(q => q.text ?? "").join("|"));
  const [state, setState] = useState<RoundState>({ index: 0, revealed: false });
  const stateRef = useRef(state);
  const channelRef = useRef<RealtimeChannel | null>(null);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    if (!sessionId) return;
    const ch = supabase.channel(`qround:${sessionId}`, { config: { broadcast: { self: true } } });
    channelRef.current = ch;
    ch.on("broadcast", { event: "qround_state" }, ({ payload }: { payload: RoundState }) => {
      setState({ index: payload.index ?? 0, revealed: Boolean(payload.revealed) });
    });
    if (screen === "host") {
      ch.on("broadcast", { event: "qround_sync_request" }, () => {
        ch.send({ type: "broadcast", event: "qround_state", payload: stateRef.current });
      });
    }
    ch.subscribe(() => {
      if (screen !== "host")
        setTimeout(() => ch.send({ type: "broadcast", event: "qround_sync_request", payload: {} }), 200);
    });
    return () => { supabase.removeChannel(ch); channelRef.current = null; };
  }, [sessionId, screen]);

  const broadcast = (next: RoundState) => {
    setState(next);
    channelRef.current?.send({ type: "broadcast", event: "qround_state", payload: next });
  };

  if (questions.length === 0) return <Waiting screen={screen} />;
  const current = questions[state.index];
  const isLast = state.index >= questions.length - 1;

  if (screen === "screen1" || screen === "screen2")
    return <QuestionRoundTS2 question={current} qIndex={state.index} total={questions.length}
      screen={screen} sessionId={sessionId} slotId={slotId} roundKey={roundKey} />;

  if (screen === "host")
    return <QuestionRoundHost question={current} qIndex={state.index} total={questions.length}
      revealed={state.revealed} isLast={isLast} sessionId={sessionId} roundKey={roundKey}
      onReveal={() => broadcast({ ...state, revealed: true })}
      onNext={() => broadcast({ index: Math.min(questions.length - 1, state.index + 1), revealed: false })} />;

  return <Waiting screen={screen} />;
}

function QuestionRoundTS2({ question, qIndex, total, screen, sessionId, slotId, roundKey }: {
  question: RoundQ; qIndex: number; total: number;
  screen: "screen1" | "screen2"; sessionId?: string; slotId?: string; roundKey: string;
}) {
  const [answer, setAnswer] = useState<number | string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset whenever the host advances to a new question.
  useEffect(() => { setAnswer(null); setSubmitted(false); }, [qIndex]);

  const handleSubmit = async () => {
    if (answer === null || !sessionId || submitting) return;
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: screen,
      response_type: "question",
      response_data: { type: question.type, answer, questionId: question.id ?? `q${qIndex}`, qIndex, round: roundKey } as never,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!question) return <SubmittedState />;

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-10 gap-5 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--success)]">Answer recorded</div>
        <div className="text-4xl md:text-5xl font-extrabold text-glow text-center">Nice!</div>
        <div className="text-sm text-muted-foreground uppercase tracking-widest">Waiting for the next question…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-8 gap-7 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)]">Question {qIndex + 1} of {total}</div>
      <div className="text-2xl md:text-3xl font-bold text-center max-w-lg">{question.text || "Question"}</div>
      <QuestionInputUI question={question} answer={answer} setAnswer={setAnswer} />
      <Button onClick={handleSubmit} disabled={answer === null || submitting}
        className="h-14 px-12 text-lg uppercase tracking-widest font-extrabold disabled:opacity-30">
        {submitting ? "Submitting…" : "Submit"}
      </Button>
    </div>
  );
}

function QuestionRoundHost({ question, qIndex, total, revealed, isLast, sessionId, roundKey, onReveal, onNext }: {
  question: RoundQ; qIndex: number; total: number; revealed: boolean; isLast: boolean;
  sessionId?: string; roundKey: string; onReveal: () => void; onNext: () => void;
}) {
  const [responses, setResponses] = useState<ResponseRow[]>([]);

  // Answers to this question, kept live. They are held here rather than
  // fetched when Reveal is pressed, because the reveal can also come from the
  // tutor's phone, and that path used to show empty results.
  useEffect(() => {
    if (!sessionId) return;
    setResponses([]);
    const forThis = (d: ResponseRow["response_data"] | null | undefined) =>
      d?.qIndex === qIndex && d?.round === roundKey;
    const add = (rows: ResponseRow[]) =>
      setResponses(prev => {
        const seen = new Set(prev.map(r => r.id));
        return [...prev, ...rows.filter(r => !r.id || !seen.has(r.id))];
      });
    (async () => {
      const { data } = await supabase.from("responses").select("id,response_data,screen_role")
        .eq("session_id", sessionId).eq("response_type", "question").order("created_at");
      add(((data ?? []) as unknown as ResponseRow[]).filter(r => forThis(r.response_data)));
    })();
    const ch = supabase.channel(`qround-resp:${sessionId}:${roundKey}:${qIndex}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const row = payload.new as ResponseRow & { response_type: string };
        if (row.response_type === "question" && forThis(row.response_data)) add([row]);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sessionId, qIndex, roundKey]);

  // Chime on reveal wherever it was triggered from.
  const wasRevealed = useRef(revealed);
  useEffect(() => {
    if (revealed && !wasRevealed.current) sounds.questionReveal();
    wasRevealed.current = revealed;
  }, [revealed]);

  if (!question) return <Waiting screen="host" />;
  const count = responses.length;

  if (!revealed) {
    return (
      <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center gap-8 pb-28 animate-slot-in">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Question {qIndex + 1} of {total} · Live</div>
        {question.text && <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl">{question.text}</div>}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 text-center">Responses</div>
          <div className="text-8xl font-extrabold text-glow">{count}</div>
        </div>
        <Button onClick={onReveal} disabled={count === 0}
          className="h-16 px-12 text-xl uppercase tracking-widest font-extrabold disabled:opacity-30">
          Reveal Results
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <QuestionResults content={question as unknown as QuestionContent} responses={responses} />
      {/* Sits above the slide bar at the bottom of the Host. */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2">
        {isLast ? (
          <div className="text-sm uppercase tracking-[0.4em] text-[color:var(--success)]">End of round ✓</div>
        ) : (
          <Button onClick={onNext}
            className="h-16 px-12 text-xl uppercase tracking-widest font-extrabold">
            Next Question ▶
          </Button>
        )}
      </div>
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
        <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl px-8 whitespace-pre-line">{content.label}</div>
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
        <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl px-8 whitespace-pre-line">{content.label}</div>
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
      <div className="text-2xl md:text-4xl font-bold text-center max-w-2xl whitespace-pre-line">{question || "Cast your vote"}</div>
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
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center px-12 pb-12 pt-[10vh] gap-8 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Voting · Live</div>
      <TitleBox text={question || "Voting"} small />
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

// ─────────────────────────────────────────────
// WORD CLOUD — students type words on side screens, host shows the cloud.
// Stored in `responses` with response_type="word_cloud",
// response_data={word:string}.
// ─────────────────────────────────────────────


const CLOUD_COLORS = ["var(--cyan)", "var(--orange)", "var(--success)", "oklch(0.75 0.18 300)", "oklch(0.82 0.18 80)"];

function WordCloudRenderer({ content, screen, sessionId, slotId }: {
  content: { title?: string; prompt?: string; max_words?: number };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  if (screen === "host") return <WordCloudHost content={content} sessionId={sessionId} slotId={slotId} />;
  return <WordCloudInput content={content} screen={screen} sessionId={sessionId} slotId={slotId} />;
}

function WordCloudInput({ content, screen, sessionId, slotId }: {
  content: { title?: string; prompt?: string; max_words?: number };
  screen: "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const [word, setWord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // No limit on how many words a screen can send: a whole table shares one
  // touch screen, so a cap of three meant most learners never got a turn.
  const submit = async () => {
    const w = word.trim();
    if (!w || !sessionId || submitting) return;
    if (w.length > 40) { setError("Too long — 40 characters max."); return; }
    const p = checkProfanity(w);
    if (!p.ok) { setError(PROFANITY_MESSAGE); return; }
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: screen,
      response_type: "word_cloud", response_data: { word: w, key: cloudKey(content) } as never,
    });
    setSubmitted((s) => [...s, w]);
    setWord("");
    setError(null);
    setSubmitting(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-6 gap-6 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)]">Word Cloud</div>
      {content.title && <div className="text-3xl md:text-4xl font-extrabold text-glow text-center max-w-2xl">{content.title}</div>}
      <div className="text-lg md:text-2xl text-center max-w-2xl whitespace-pre-line text-muted-foreground">{content.prompt || "Type a word"}</div>

      <input
        ref={inputRef}
        autoFocus
        value={word}
        onChange={(e) => { setWord(e.target.value); setError(null); }}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        maxLength={40}
        placeholder="Your word…"
        className="w-full max-w-lg h-20 text-3xl text-center bg-card/60 border-2 border-[color:var(--cyan)]/40 focus:border-[color:var(--cyan)] outline-none rounded-2xl px-6"
      />
      {error && <div className="text-destructive uppercase tracking-widest text-sm">{error}</div>}
      <Button onClick={submit} disabled={!word.trim() || submitting}
        className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold">Send</Button>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {submitted.length === 0 ? "Send as many words as you like" : `${submitted.length} sent — keep going!`}
      </div>

      {submitted.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-xl mt-2">
          {submitted.slice(-12).map((w, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] text-sm font-bold">{w}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function cloudKey(content: { title?: string; prompt?: string }): string {
  return contentKey(`cloud|${content.title ?? ""}|${content.prompt ?? ""}`);
}

type CloudWord = { word: string; count: number };
type PlacedWord = CloudWord & { x: number; y: number; size: number; color: string };

/**
 * Packs words into a cloud: the most-sent word largest and in the middle, the
 * rest spiralling outwards into whatever space is free. If they do not all fit
 * the whole cloud is shrunk a step and packed again.
 */
function layoutCloud(words: CloudWord[], w: number, h: number, fontFamily: string): PlacedWord[] {
  if (w < 50 || h < 50 || words.length === 0) return [];
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return [];
  const maxCount = Math.max(...words.map(x => x.count));
  const biggest = Math.min(h * 0.3, w * 0.16);

  for (let shrink = 1; shrink > 0.2; shrink *= 0.85) {
    const boxes: { l: number; t: number; r: number; b: number }[] = [];
    const out: PlacedWord[] = [];
    let failed = false;

    for (let i = 0; i < words.length && !failed; i++) {
      const item = words[i];
      // With every word sent once there is no "biggest", so use a middling size.
      const weight = maxCount === 1 ? 0.45 : 0.22 + 0.78 * (item.count / maxCount);
      let size = Math.max(14, biggest * weight * shrink);
      measure.font = `800 ${size}px ${fontFamily}`;
      let tw = measure.measureText(item.word).width;
      if (tw > w * 0.9) { size *= (w * 0.9) / tw; tw = w * 0.9; }
      const bw = tw + 18, bh = size * 1.08 + 8;
      // Each word starts its spiral at its own angle so the cloud is not lopsided.
      const start = (parseInt(contentKey(item.word), 36) % 360) * (Math.PI / 180);

      let spot: { x: number; y: number } | null = null;
      for (let step = 0; step < 2400; step++) {
        const a = start + step * 0.22;
        const rad = step * 0.55;
        const x = w / 2 + rad * Math.cos(a) * (w / h);
        const y = h / 2 + rad * Math.sin(a);
        const box = { l: x - bw / 2, t: y - bh / 2, r: x + bw / 2, b: y + bh / 2 };
        if (box.l < 0 || box.t < 0 || box.r > w || box.b > h) continue;
        if (boxes.some(o => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t)) continue;
        boxes.push(box);
        spot = { x, y };
        break;
      }
      if (!spot) { failed = true; break; }
      out.push({ ...item, ...spot, size, color: CLOUD_COLORS[parseInt(contentKey(item.word), 36) % CLOUD_COLORS.length] });
    }
    if (!failed) return out;
  }
  return [];
}

function WordCloudHost({ content, sessionId, slotId }: {
  content: { title?: string; prompt?: string };
  sessionId?: string; slotId?: string;
}) {
  const [words, setWords] = useState<string[]>([]);
  const key = cloudKey(content);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setWords([]);
    // Without a slot id, the key keeps two word clouds in one lesson apart.
    const mine = (d: { word?: string; key?: string } | null | undefined, slot: string | null) =>
      slotId ? slot === slotId : d?.key === key;
    (async () => {
      const { data } = await supabase.from("responses").select("response_data,slot_id")
        .eq("session_id", sessionId).eq("response_type", "word_cloud").order("created_at");
      if (cancelled || !data) return;
      setWords(data
        .filter(r => mine(r.response_data as { word?: string; key?: string }, r.slot_id))
        .map(r => String((r.response_data as { word?: string })?.word ?? "").trim())
        .filter(Boolean));
    })();
    const ch = supabase.channel(`cloud:${sessionId}:${key}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const r = payload.new as { response_type: string; response_data: { word?: string; key?: string }; slot_id: string | null };
        if (r.response_type !== "word_cloud" || !mine(r.response_data, r.slot_id)) return;
        const w = String(r.response_data?.word ?? "").trim();
        if (w) setWords(p => [...p, w]);
      }).subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [sessionId, slotId, key]);

  // Count each word, ignoring capitals. Biggest first; ties keep arrival order.
  const freq = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase();
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }, [words]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Word widths are measured in the page font, so pack again once it has
  // loaded: measuring in the fallback font left words overlapping.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => { if (live) setFontsReady(true); });
    return () => { live = false; };
  }, []);

  const placed = useMemo(
    () => layoutCloud(freq, box.w, box.h, typeof window === "undefined" ? "sans-serif" : getComputedStyle(document.body).fontFamily),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [freq, box.w, box.h, fontsReady],
  );

  return (
    <div className="h-screen w-full bg-immersive bg-grid flex flex-col items-center px-10 pt-[5vh] pb-28 gap-4 overflow-hidden animate-slot-in">
      <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)] shrink-0">Word Cloud · Live</div>
      {content.title && <TitleBox text={content.title} small />}
      {content.prompt && <div className="text-lg md:text-2xl text-muted-foreground text-center max-w-3xl whitespace-pre-line shrink-0">{content.prompt}</div>}
      <div ref={boxRef} className="relative flex-1 min-h-0 w-full">
        {freq.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-muted-foreground">Waiting for words…</div>
        )}
        {placed.map((f) => (
          <span key={f.word}
            className="absolute font-extrabold leading-none whitespace-nowrap transition-all duration-700 ease-out"
            style={{ left: f.x, top: f.y, fontSize: f.size, color: f.color, transform: "translate(-50%, -50%)" }}>
            {f.word}
          </span>
        ))}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest shrink-0">
        {words.length} word{words.length === 1 ? "" : "s"} sent
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PADLET — question on the big screen, sticky-note wall of student answers.
// Stored in `responses` with response_type="padlet",
// response_data={text:string}.
// ─────────────────────────────────────────────

const PADLET_COLORS = [
  { bg: "oklch(0.94 0.12 90)", ink: "#3b2b0a" },   // yellow
  { bg: "oklch(0.9 0.14 200)", ink: "#062a3a" },   // cyan
  { bg: "oklch(0.9 0.15 340)", ink: "#3a0a2a" },   // pink
  { bg: "oklch(0.92 0.14 140)", ink: "#0a2a12" },  // green
  { bg: "oklch(0.92 0.14 40)",  ink: "#3a1a06" },  // orange
  { bg: "oklch(0.9 0.14 290)",  ink: "#20083a" },  // purple
];

function PadletRenderer({ content, screen, sessionId, slotId }: {
  content: { question: string; title?: string };
  screen: "host" | "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  if (screen === "host") return <PadletHost content={content} sessionId={sessionId} slotId={slotId} />;
  return <PadletInput content={content} screen={screen} sessionId={sessionId} slotId={slotId} />;
}

function PadletInput({ content, screen, sessionId, slotId }: {
  content: { question: string; title?: string };
  screen: "screen1" | "screen2";
  sessionId?: string; slotId?: string;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const t = text.trim();
    if (!t || !sessionId || submitting) return;
    if (t.length > 240) { setError("Too long — 240 characters max."); return; }
    const p = checkProfanity(t);
    if (!p.ok) { setError(PROFANITY_MESSAGE); return; }
    setSubmitting(true);
    await supabase.from("responses").insert({
      session_id: sessionId, slot_id: slotId ?? null, screen_role: screen,
      response_type: "padlet", response_data: { text: t } as never,
    });
    setText("");
    setError(null);
    setCount(c => c + 1);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col items-center justify-center p-6 gap-5 animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)]">Post Your Answer</div>
      <div className="text-2xl md:text-3xl font-bold text-center max-w-2xl whitespace-pre-line">{content.question || "Answer"}</div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => { setText(e.target.value); setError(null); }}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
        maxLength={240}
        placeholder="Type your answer… (Ctrl/⌘+Enter to send)"
        rows={4}
        className="w-full max-w-lg text-xl bg-card/60 border-2 border-[color:var(--cyan)]/40 focus:border-[color:var(--cyan)] outline-none rounded-2xl p-4 resize-none"
      />
      {error && <div className="text-destructive uppercase tracking-widest text-sm">{error}</div>}
      <div className="flex items-center gap-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{text.length}/240</div>
        <Button onClick={submit} disabled={!text.trim() || submitting}
          className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold">Post</Button>
      </div>
      {count > 0 && <div className="text-sm text-[color:var(--success)] uppercase tracking-widest">✓ {count} posted — send more if you like</div>}
    </div>
  );
}

function PadletHost({ content, sessionId, slotId }: {
  content: { question: string; title?: string };
  sessionId?: string; slotId?: string;
}) {
  const [notes, setNotes] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      let q = supabase.from("responses").select("id,response_data,slot_id,response_type").eq("session_id", sessionId).eq("response_type", "padlet");
      if (slotId) q = q.eq("slot_id", slotId);
      const { data } = await q;
      if (!cancelled && data) setNotes(data.map(r => ({ id: r.id as string, text: String((r.response_data as { text?: string })?.text ?? "") })).filter(n => n.text));
    })();
    const ch = supabase.channel(`padlet:${sessionId}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const r = payload.new as { id: string; response_type: string; response_data: { text?: string }; slot_id: string | null };
        if (r.response_type !== "padlet") return;
        if (slotId && r.slot_id !== slotId) return;
        const t = String(r.response_data?.text ?? "").trim();
        if (t) setNotes(p => [...p, { id: r.id, text: t }]);
      }).subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [sessionId, slotId]);

  return (
    <div className="min-h-screen w-full bg-immersive bg-grid flex flex-col p-8 gap-6 animate-slot-in">
      <div className="text-center shrink-0">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)] mb-2">Padlet · Live</div>
        <div className="text-3xl md:text-5xl font-extrabold text-glow max-w-5xl mx-auto whitespace-pre-line">{content.question || "Answer wall"}</div>
        <div className="text-sm text-muted-foreground uppercase tracking-widest mt-3">{notes.length} response{notes.length === 1 ? "" : "s"}</div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {notes.length === 0 && (
          <div className="h-full flex items-center justify-center text-2xl text-muted-foreground">Waiting for responses…</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {notes.map((n, i) => {
            const c = PADLET_COLORS[i % PADLET_COLORS.length];
            const rot = ((i * 37) % 7) - 3; // -3° … +3°
            return (
              <div key={n.id} className="rounded-2xl p-5 shadow-xl animate-slot-in break-words"
                style={{ background: c.bg, color: c.ink, transform: `rotate(${rot}deg)`, minHeight: 120 }}>
                <div className="text-base md:text-lg font-semibold whitespace-pre-wrap leading-snug">{n.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WHITEBOARD — side-screen free-draw canvas (touch/mouse).
// Each touch screen draws on its own copy, optionally over a picture. "Send to
// big screen" saves the drawing as an image and the Host shows it, labelled
// with the screen it came from. Stored in `responses` with
// response_type="whiteboard", response_data={url,key}.
// ─────────────────────────────────────────────

type WhiteboardContent = { title?: string; image_url?: string };

function boardKey(content: WhiteboardContent): string {
  return contentKey(`board|${content.title ?? ""}|${content.image_url ?? ""}`);
}

function WhiteboardRenderer({ content, screen, sessionId }: {
  content: WhiteboardContent;
  screen: "host" | "screen1" | "screen2";
  sessionId?: string;
}) {
  if (screen === "host") return <WhiteboardHost content={content} sessionId={sessionId} />;
  return <WhiteboardCanvas content={content} screen={screen} sessionId={sessionId} />;
}

type BoardShot = { id: string; url: string; screen: string };

function WhiteboardHost({ content, sessionId }: { content: WhiteboardContent; sessionId?: string }) {
  const [shots, setShots] = useState<BoardShot[]>([]);
  const key = boardKey(content);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setShots([]);
    const toShot = (r: { id: string; screen_role: string; response_data: unknown }): BoardShot | null => {
      const d = r.response_data as { url?: string; key?: string } | null;
      return d?.url && d.key === key ? { id: r.id, url: d.url, screen: r.screen_role } : null;
    };
    const add = (rows: BoardShot[]) =>
      setShots(prev => {
        const seen = new Set(prev.map(x => x.id));
        return [...prev, ...rows.filter(x => !seen.has(x.id))];
      });
    (async () => {
      const { data } = await supabase.from("responses").select("id,screen_role,response_data")
        .eq("session_id", sessionId).eq("response_type", "whiteboard").order("created_at");
      if (!cancelled && data) add(data.map(toShot).filter((x): x is BoardShot => x !== null));
    })();
    const ch = supabase.channel(`board:${sessionId}:${key}`);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "responses", filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const r = payload.new as { id: string; response_type: string; screen_role: string; response_data: unknown };
        if (r.response_type !== "whiteboard") return;
        const shot = toShot(r);
        if (shot) { sounds.connect(); add([shot]); }
      }).subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [sessionId, key]);

  // Newest first. Four is as many as stay readable from the back of the room.
  const shown = shots.slice(-4).reverse();
  const heading = content.title || "Draw on the touch screens";

  return (
    <div className="h-screen w-full bg-immersive bg-grid flex flex-col items-center px-8 pt-[4vh] pb-28 gap-4 overflow-hidden animate-slot-in">
      <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--cyan)] shrink-0">Whiteboard</div>
      <TitleBox text={heading} small />
      {shown.length === 0 ? (
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-4">
          {content.image_url && (
            <img src={content.image_url} alt="" className="min-h-0 max-h-full max-w-full object-contain rounded-2xl bg-white" />
          )}
          <div className="text-lg md:text-2xl text-muted-foreground text-center shrink-0">
            Press “Send to big screen” on a touch screen to show your drawing here.
          </div>
        </div>
      ) : (
        <div className={`flex-1 min-h-0 w-full grid gap-4 ${shown.length === 1 ? "grid-cols-1" : "grid-cols-2"} ${shown.length > 2 ? "grid-rows-2" : "grid-rows-1"}`}>
          {shown.map((shot) => {
            const tone = shot.screen === "screen1" ? "var(--cyan)" : "var(--orange)";
            return (
              <div key={shot.id} className="relative min-h-0 rounded-2xl border-4 bg-white overflow-hidden animate-slot-in" style={{ borderColor: tone }}>
                <img src={shot.url} alt="" className="w-full h-full object-contain" />
                <div className="absolute top-0 left-0 rounded-br-2xl px-5 py-2 text-xl md:text-3xl font-extrabold uppercase tracking-widest text-black"
                  style={{ background: tone }}>
                  {SCREEN_NAMES[shot.screen] ?? shot.screen}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Plain colour values, not theme variables: a canvas cannot read `var(--cyan)`,
// so blue, orange and green silently kept whatever colour was picked before.
const WB_COLORS = [
  { name: "black", value: "#0b0b0b" },
  { name: "blue", value: "#1e9bf0" },
  { name: "orange", value: "#f97316" },
  { name: "green", value: "#16a34a" },
  { name: "red", value: "#dc2626" },
  { name: "purple", value: "#9333ea" },
];

function WhiteboardCanvas({ content, screen, sessionId }: {
  content: WhiteboardContent; screen: "screen1" | "screen2"; sessionId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(WB_COLORS[0].value);
  const [size, setSize] = useState(6);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const { title, image_url: imageUrl } = content;

  // Size the canvas at device resolution. It is transparent, so the white
  // board (and any picture) underneath shows through.
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const prev = document.createElement("canvas");
      prev.width = cvs.width; prev.height = cvs.height;
      const pctx = prev.getContext("2d");
      if (pctx && cvs.width && cvs.height) pctx.drawImage(cvs, 0, 0);
      cvs.width = Math.floor(rect.width * dpr);
      cvs.height = Math.floor(rect.height * dpr);
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      if (prev.width && prev.height) ctx.drawImage(prev, 0, 0, cvs.width, cvs.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current!;
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const draw = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    if (sendState !== "idle" && sendState !== "sending") setSendState("idle");
  };

  const clear = () => {
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    setSendState("idle");
  };

  // Flatten board + picture + drawing into one image, capped in size so it
  // uploads quickly over the room's wifi.
  const snapshot = (withPicture: boolean): Promise<Blob | null> => {
    const cvs = canvasRef.current;
    if (!cvs) return Promise.resolve(null);
    const k = Math.min(1, 1400 / Math.max(cvs.width, cvs.height));
    const out = document.createElement("canvas");
    out.width = Math.round(cvs.width * k);
    out.height = Math.round(cvs.height * k);
    const ctx = out.getContext("2d");
    if (!ctx) return Promise.resolve(null);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    const img = bgRef.current;
    if (withPicture && img && img.complete && img.naturalWidth) {
      // Same fit as the on-screen picture (object-contain, centred).
      const fit = Math.min(out.width / img.naturalWidth, out.height / img.naturalHeight);
      const iw = img.naturalWidth * fit, ih = img.naturalHeight * fit;
      ctx.drawImage(img, (out.width - iw) / 2, (out.height - ih) / 2, iw, ih);
    }
    ctx.drawImage(cvs, 0, 0, out.width, out.height);
    return new Promise((resolve) => {
      try { out.toBlob((b) => resolve(b), "image/jpeg", 0.82); }
      catch { resolve(null); } // picture from a site that forbids copying
    });
  };

  const send = async () => {
    if (!sessionId || sendState === "sending") return;
    setSendState("sending");
    const blob = (await snapshot(true)) ?? (await snapshot(false));
    if (!blob) { setSendState("failed"); return; }
    const path = `whiteboards/${sessionId}/${screen}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("lesson-media").upload(path, blob, { contentType: "image/jpeg" });
    if (error) { console.error("Whiteboard upload failed:", error); setSendState("failed"); return; }
    const { data } = supabase.storage.from("lesson-media").getPublicUrl(path);
    const { error: insertError } = await supabase.from("responses").insert({
      session_id: sessionId, slot_id: null, screen_role: screen,
      response_type: "whiteboard", response_data: { url: data.publicUrl, key: boardKey(content) } as never,
    });
    setSendState(insertError ? "failed" : "sent");
  };

  return (
    <div className="h-screen w-full bg-immersive flex flex-col p-3 gap-3 animate-slot-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)]">Whiteboard</div>
          {title && <div className="text-xl font-bold text-glow">{title}</div>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {WB_COLORS.map(col => (
            <button key={col.name} aria-label={col.name} onClick={() => setColor(col.value)}
              className="w-9 h-9 rounded-full border-4 transition-transform"
              style={{ background: col.value, borderColor: col.value === color ? "#ffffff" : "transparent", transform: col.value === color ? "scale(1.2)" : undefined }} />
          ))}
          <div className="flex items-center gap-2 ml-2">
            {[3, 6, 12, 24].map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${size === s ? "border-[color:var(--cyan)]" : "border-border"}`}
                aria-label={`brush ${s}`}>
                <span className="rounded-full" style={{ width: s, height: s, background: color }} />
              </button>
            ))}
          </div>
          <Button onClick={clear} variant="outline" className="h-9 text-xs uppercase tracking-widest">Clear</Button>
        </div>
      </div>
      <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border-4 border-[color:var(--cyan)]/40 bg-white touch-none">
        {imageUrl && (
          <img ref={bgRef} src={imageUrl} alt="" crossOrigin="anonymous" draggable={false}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" />
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block touch-none cursor-crosshair"
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            drawingRef.current = true;
            lastRef.current = getPos(e);
          }}
          onPointerMove={(e) => {
            if (!drawingRef.current || !lastRef.current) return;
            const p = getPos(e);
            draw(lastRef.current, p);
            lastRef.current = p;
          }}
          onPointerUp={() => { drawingRef.current = false; lastRef.current = null; }}
          onPointerLeave={() => { drawingRef.current = false; lastRef.current = null; }}
        />
      </div>
      <Button onClick={send} disabled={!sessionId || sendState === "sending"}
        className="h-14 shrink-0 text-lg uppercase tracking-widest font-extrabold"
        style={sendState === "sent" ? { background: "var(--success)", color: "#fff" } : sendState === "failed" ? { background: "var(--destructive)", color: "#fff" } : undefined}>
        {sendState === "sending" ? "Sending…" : sendState === "sent" ? "Sent to big screen ✓" : sendState === "failed" ? "Could not send — tap to try again" : "Send to big screen ▲"}
      </Button>
    </div>
  );
}
