// Tutor preview — /preview/$lessonId
//
// What a tutor opens before teaching a lesson: the big screen and both touch
// screens, live, with this step's notes alongside (what to say, what to press,
// the answers). It replaces reading a long plan: the detail arrives one step at
// a time, next to the thing it describes.
//
// Public on purpose (no PIN), so the link on a lesson card just works. It runs
// a private throwaway session, exactly as Admin Test Mode does, so nothing here
// can touch a real class.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/codes";
import { Button } from "@/components/ui/button";
import type { PlanLesson, PlanSlot } from "@/lib/planExport";
import {
  activityFor,
  endingForTeacher,
  friendlyPhase,
  teacherScreenGroups,
} from "@/lib/teacherPlan";

export const Route = createFileRoute("/preview/$lessonId")({
  head: () => ({ meta: [{ title: "Lesson preview · Immersive Learning" }] }),
  component: PreviewPage,
});

type PreviewSession = { id: string; screen1_code: string; screen2_code: string };

function stateFor(slot: PlanSlot, index: number) {
  return {
    slot: { host: slot.host_content, screen1: slot.screen1_content, screen2: slot.screen2_content },
    indices: { host: index, screen1: index, screen2: index },
  };
}

function PreviewPage() {
  const { lessonId } = Route.useParams();
  const [lesson, setLesson] = useState<PlanLesson | null>(null);
  const [slots, setSlots] = useState<PlanSlot[]>([]);
  const [session, setSession] = useState<PreviewSession | null>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "failed">("loading");
  const started = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  // Load the lesson, then start a throwaway session straight away: a tutor
  // following a link should land on the lesson, not on a Start button.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const [{ data: l }, { data: s }] = await Promise.all([
        supabase
          .from("lessons")
          .select(
            "id, title, description, estimated_duration_mins, ms_form_url, ms_form_title, ai_notes",
          )
          .eq("id", lessonId)
          .maybeSingle(),
        supabase
          .from("slots")
          .select("*")
          .eq("lesson_id", lessonId)
          .is("session_id", null)
          .order("order_index"),
      ]);
      const all = (s ?? []) as unknown as PlanSlot[];
      if (!l || all.length === 0) {
        setStatus("missing");
        return;
      }
      setLesson(l as unknown as PlanLesson);
      setSlots(all);

      const { data, error } = await supabase
        .from("sessions")
        .insert({
          lesson_id: lessonId,
          host_code: generateCode(),
          screen1_code: generateCode(),
          screen2_code: generateCode(),
          status: "active",
          current_slot_index: 0,
          screen1_connected: true,
          screen2_connected: true,
          state: stateFor(all[0], 0) as never,
        })
        .select("id, screen1_code, screen2_code")
        .single();
      if (error || !data) {
        console.error("Could not start the preview session:", error);
        setStatus("failed");
        return;
      }
      sessionIdRef.current = data.id;
      setSession(data as PreviewSession);
      setStatus("ready");
    })();
  }, [lessonId]);

  // Close the throwaway session when the tutor leaves, so it does not sit open.
  useEffect(() => {
    const end = () => {
      const id = sessionIdRef.current;
      if (!id) return;
      void supabase
        .from("sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", id);
    };
    window.addEventListener("pagehide", end);
    return () => {
      window.removeEventListener("pagehide", end);
      end();
    };
  }, []);

  const goTo = useCallback(
    async (next: number) => {
      if (!session || slots.length === 0) return;
      const clamped = Math.max(0, Math.min(slots.length - 1, next));
      if (clamped === index) return;
      setIndex(clamped);
      await supabase
        .from("sessions")
        .update({ current_slot_index: clamped, state: stateFor(slots[clamped], clamped) as never })
        .eq("id", session.id);
    },
    [session, slots, index],
  );

  // The Host can move the lesson on by itself (a video finishing does), so
  // follow the session instead of trusting our own count, or the notes would
  // fall a step behind the screens.
  useEffect(() => {
    if (!session) return;
    const ch = supabase.channel(`preview:${session.id}`);
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${session.id}` },
      (payload) => {
        const i = (payload.new as { current_slot_index?: number }).current_slot_index;
        if (typeof i === "number") setIndex(i);
      },
    ).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session]);

  // Arrow keys step through, like a slide deck.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") void goTo(index + 1);
      if (e.key === "ArrowLeft") void goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (status === "loading") return <Message text="Getting the lesson ready…" />;
  if (status === "missing")
    return <Message text="That lesson could not be found, or it has no steps yet." />;
  if (status === "failed" || !session || !lesson) {
    return <Message text="The preview could not start. Please refresh the page to try again." />;
  }

  const slot = slots[index];
  const run = lesson.ai_notes?.run_sheet?.find((r) => r.slot_index === index);
  const phase = friendlyPhase(slot.lead_phase);
  const groups = teacherScreenGroups(slot);
  const doing = activityFor(slot).doing;
  const ending = endingForTeacher(slot);
  const isLast = index >= slots.length - 1;

  return (
    <div className="h-screen bg-immersive bg-grid flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center gap-4 px-4 py-2 border-b border-border/60">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--cyan)]">
            Lesson preview
          </div>
          <div className="text-lg font-extrabold truncate">{lesson.title}</div>
        </div>
        <Button
          variant="outline"
          onClick={() => goTo(index - 1)}
          disabled={index <= 0}
          className="h-11 px-5 font-bold rounded-full disabled:opacity-30"
        >
          ← Back
        </Button>
        <span className="font-mono font-bold tabular-nums text-sm whitespace-nowrap">
          Step {index + 1} of {slots.length}
        </span>
        <Button
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="h-11 px-8 font-extrabold uppercase tracking-widest rounded-full disabled:opacity-30"
        >
          Next →
        </Button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 p-3">
        {/* The three screens */}
        <div className="flex-1 min-h-0 min-w-0 grid grid-cols-2 lg:grid-cols-[minmax(0,3.16fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 content-center items-start overflow-y-auto [&>*:first-child]:col-span-2 lg:[&>*:first-child]:col-span-1">
          <Frame
            title="Big screen"
            width={1280}
            height={720}
            src={`/host?session=${session.id}&preview=1`}
            accent="var(--cyan)"
          />
          <Frame
            title="Touch screen 1"
            width={540}
            height={960}
            src={`/screen/1?code=${session.screen1_code}`}
            accent="var(--orange)"
          />
          <Frame
            title="Touch screen 2"
            width={540}
            height={960}
            src={`/screen/2?code=${session.screen2_code}`}
            accent="var(--success)"
          />
        </div>

        {/* This step's notes */}
        <aside className="shrink-0 lg:w-[340px] max-h-[40vh] lg:max-h-none overflow-y-auto rounded-xl border-2 border-border bg-card/70 p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>Step {index + 1}</span>
              {phase && (
                <span className="rounded-full bg-[color:var(--cyan)]/15 text-[color:var(--cyan)] px-2 py-0.5 tracking-widest">
                  {phase.label}
                </span>
              )}
              <span className="ml-auto normal-case tracking-normal">{slot.duration_mins} min</span>
            </div>
            <div className="text-xl font-extrabold leading-tight mt-1">
              {slot.name || activityFor(slot).title}
            </div>
          </div>

          {run?.teacher_says && (
            <Note label="Say">
              <p className="rounded-lg border-l-4 border-[color:var(--success)] bg-[color:var(--success)]/10 px-3 py-2">
                {run.teacher_says}
              </p>
            </Note>
          )}

          {doing.length > 0 && (
            <Note label="What you do">
              <ol className="list-decimal pl-5 space-y-1">
                {doing.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ol>
            </Note>
          )}

          {groups.some((g) => g.block.questions?.length) && (
            <Note label="Answers">
              <ol className="list-decimal pl-5 space-y-2">
                {groups
                  .flatMap((g) => g.block.questions ?? [])
                  .map((q, i) => (
                    <li key={i}>
                      <div className="font-semibold">{q.text}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {q.options.map((o, k) => (
                          <span
                            key={k}
                            className={`rounded border px-1.5 text-xs ${
                              o.correct
                                ? "border-[color:var(--success)] bg-[color:var(--success)]/15 text-[color:var(--success)] font-bold"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {o.correct ? "✓ " : ""}
                            {o.label}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
              </ol>
            </Note>
          )}

          {run?.watch_for && (
            <Note label="Look out for">
              <p>{run.watch_for}</p>
            </Note>
          )}

          {ending && <p className="text-xs text-muted-foreground">{ending}</p>}

          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            <Link
              to="/card/$lessonId"
              params={{ lessonId }}
              className="text-xs uppercase tracking-widest text-[color:var(--cyan)] hover:underline"
            >
              Lesson card
            </Link>
            {isLast && (
              <span className="text-xs uppercase tracking-widest text-[color:var(--success)]">
                That is the whole lesson ✓
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Note({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[color:var(--cyan)] mb-1">
        {label}
      </div>
      <div className="text-sm leading-snug">{children}</div>
    </div>
  );
}

/**
 * One of the room's screens, shrunk to fit. The page inside is laid out at the
 * screen's real size and then scaled down as a whole, so text and buttons keep
 * the proportions they have in the room instead of reflowing into a tiny box.
 */
function Frame({
  title,
  src,
  accent,
  width,
  height,
}: {
  title: string;
  src: string;
  accent: string;
  width: number;
  height: number;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const read = () => setScale(el.clientWidth / width);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      className="min-w-0 rounded-xl border-2 overflow-hidden bg-card/40"
      style={{ borderColor: `color-mix(in oklab, ${accent} 50%, transparent)` }}
    >
      <div
        className="px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] font-bold"
        style={{ color: accent, background: `color-mix(in oklab, ${accent} 8%, transparent)` }}
      >
        {title}
      </div>
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-background"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {scale > 0 && (
          <iframe
            src={src}
            title={title}
            className="absolute top-0 left-0 border-0"
            style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}
            allow="autoplay; fullscreen; clipboard-write"
          />
        )}
      </div>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-immersive bg-grid flex items-center justify-center p-8">
      <div className="text-xl font-bold text-center max-w-md">{text}</div>
    </div>
  );
}
