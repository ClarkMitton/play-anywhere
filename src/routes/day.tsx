// Day builder — /day
// Set a room's whole day once: the first lesson and when it starts, then each
// time the screens should turn over to the next group's lesson, and optionally
// when the day ends. "Start the day" opens the Host with one session; the
// touch screens join it once and the Host runs every change by itself.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/codes";
import { Button } from "@/components/ui/button";
import {
  DayRows,
  END_ID,
  fmtTime,
  rowsToSteps,
  useLessons,
  writeDayPlan,
} from "@/components/SessionHandover";

export const Route = createFileRoute("/day")({
  head: () => ({
    meta: [
      { title: "Plan the day · Immersive Learning" },
      { name: "description", content: "Set the room's lessons and when the screens turn over." },
    ],
  }),
  component: DayBuilder,
});

type Row = { at: string; lessonId: string };
type Draft = { firstLessonId: string; startAt: string; rows: Row[] };
const DRAFT_KEY = "day-plan-draft";

/**
 * A day can be handed over as a link, so it can be set up for someone:
 * /day?first=<lessonId>&start=14:00&turn=15:00_<lessonId>&turn=16:00_end
 */
function draftFromLink(): Draft | null {
  const q = new URLSearchParams(window.location.search);
  const first = q.get("first");
  if (!first) return null;
  const rows = q.getAll("turn").map((t) => {
    const [at, id] = t.split("_");
    return { at: at ?? "", lessonId: id === "end" ? END_ID : (id ?? "") };
  });
  return {
    firstLessonId: first,
    startAt: q.get("start") ?? "",
    rows: rows.length ? rows : [{ at: "", lessonId: "" }],
  };
}

function loadDraft(): Draft {
  try {
    const linked = draftFromLink();
    if (linked) return linked;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as Draft;
  } catch {
    /* fall through */
  }
  return { firstLessonId: "", startAt: "", rows: [{ at: "", lessonId: "" }] };
}

function DayBuilder() {
  const navigate = useNavigate();
  const lessons = useLessons();
  const [draft, setDraft] = useState<Draft>({ firstLessonId: "", startAt: "", rows: [] });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // Draft is per browser, so the plan is still there if the page is reopened.
  useEffect(() => {
    setDraft(loadDraft());
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft, loaded]);

  const first = lessons.find((l) => l.id === draft.firstLessonId);
  const preview = rowsToSteps(draft.rows, lessons, false);

  const start = async () => {
    setError(null);
    if (!first) return setError("Choose the first lesson.");
    if (draft.startAt && !/^\d{2}:\d{2}$/.test(draft.startAt))
      return setError("Check the start time.");
    const steps = rowsToSteps(draft.rows, lessons);
    if (typeof steps === "string") return setError(steps);
    if (draft.startAt && steps.length && steps[0].at <= draft.startAt)
      return setError(`The first turnover must be after the ${fmtTime(draft.startAt)} start.`);
    setStarting(true);
    const { data, error: err } = await supabase
      .from("sessions")
      .insert({
        lesson_id: first.id,
        host_code: generateCode(),
        screen1_code: generateCode(),
        screen2_code: generateCode(),
        status: "waiting",
        state: {},
      })
      .select("id")
      .single();
    if (err || !data) {
      setStarting(false);
      return setError("Could not create the session. Check the connection and try again.");
    }
    writeDayPlan(data.id, { startAt: draft.startAt || undefined, firstTitle: first.title, steps });
    navigate({ to: "/host", search: { session: data.id } as never });
  };

  return (
    <div className="min-h-screen bg-immersive bg-grid">
      <header className="flex items-center justify-between p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">
            Bradford College
          </div>
          <h1 className="text-4xl font-extrabold mt-1 text-glow">Plan the day</h1>
        </div>
        <Link to="/">
          <Button variant="outline" className="h-12 px-6 uppercase tracking-widest">
            Back
          </Button>
        </Link>
      </header>

      <main className="px-4 md:px-8 pb-16 max-w-3xl mx-auto space-y-6">
        <p className="text-muted-foreground">
          Set this up on the Host PC. Connect the two touch screens once, then leave it. Two minutes
          before each turnover every screen shows a warning, then all three move to the start of the
          next lesson.
        </p>

        <section className="bg-card/60 border border-border rounded-3xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)]">
            First lesson
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="time"
              value={draft.startAt}
              onChange={(e) => setDraft({ ...draft, startAt: e.target.value })}
              className="h-12 w-36 shrink-0 rounded-xl bg-background border border-border px-3 font-mono text-lg"
              aria-label="First lesson start time"
            />
            <select
              value={draft.firstLessonId}
              onChange={(e) => setDraft({ ...draft, firstLessonId: e.target.value })}
              className="h-12 flex-1 min-w-0 rounded-xl bg-background border border-border px-3"
              aria-label="First lesson"
            >
              <option value="">Choose a lesson…</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            With a time, it launches by itself then (once the screens are connected). Leave the time
            empty to press Launch yourself.
          </p>
        </section>

        <section className="bg-card/60 border border-border rounded-3xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)]">
            Then turn over at
          </h2>
          <DayRows
            rows={draft.rows}
            setRows={(rows) => setDraft({ ...draft, rows })}
            lessons={lessons}
          />
          <p className="text-xs text-muted-foreground">
            Add “End the day” as the last time to send the screens home after the last group.
          </p>
        </section>

        {first && Array.isArray(preview) && (
          <section className="rounded-3xl border border-[color:var(--cyan)]/40 p-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] mb-3">
              The day
            </h2>
            <ol className="space-y-1 font-mono text-sm">
              <li>
                {draft.startAt ? fmtTime(draft.startAt) : "On Launch"} · {first.title}
              </li>
              {preview.map((s, i) => (
                <li key={i}>
                  {fmtTime(s.at)} · {s.end ? "End of the day" : s.lessonTitle}
                </li>
              ))}
            </ol>
          </section>
        )}

        {error && <div className="text-[color:var(--orange)]">{error}</div>}

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() =>
              setDraft({ firstLessonId: "", startAt: "", rows: [{ at: "", lessonId: "" }] })
            }
          >
            Clear
          </Button>
          <Button
            onClick={start}
            disabled={starting}
            className="h-14 px-10 text-lg uppercase tracking-widest font-extrabold"
          >
            {starting ? "Starting…" : "Start the day →"}
          </Button>
        </div>
      </main>
    </div>
  );
}
