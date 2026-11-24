// SessionHandover — runs a room's day with no-one present.
//
// A day plan is an optional first start time plus a list of steps: "at 15:00
// switch to lesson X", ending with an optional "at 16:00 end the day". It is
// made on /day (or edited from the Host's ⏭ pill). Two minutes before each step
// the Host and both touch screens show an "ending in 2:00" banner. At the time
// the Host shows "Next session" with a short countdown (and a Play now button),
// then the same session moves to the next lesson's first slide. The touch
// screens follow the session row, so nobody re-enters codes.
//
// The plan lives in this browser (localStorage, keyed by session id) because the
// Host PC is the one clock that drives the change; a reload keeps it.

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { sounds } from "@/lib/audio";
import { Button } from "@/components/ui/button";

export type DayStep =
  | { at: string /* "HH:MM" */; lessonId: string; lessonTitle: string; end?: false }
  | { at: string; end: true };
export type DayPlan = {
  /** When the first lesson launches by itself from the lobby. */
  startAt?: string;
  firstTitle?: string;
  /** Changes still to come, earliest first. */
  steps: DayStep[];
};

const WARN_SECS = 120;
const GO_COUNTDOWN_SECS = 15;
const key = (sessionId: string) => `handover:${sessionId}`;

export function readDayPlan(sessionId: string | undefined): DayPlan | null {
  if (!sessionId) return null;
  try {
    const raw = localStorage.getItem(key(sessionId));
    if (!raw) return null;
    const v = JSON.parse(raw);
    // Older single-handover shape: { lessonId, lessonTitle, at }.
    if (v && !Array.isArray(v.steps) && v.lessonId) return { steps: [v as DayStep] };
    return v as DayPlan;
  } catch {
    return null;
  }
}

export function writeDayPlan(sessionId: string, plan: DayPlan | null) {
  try {
    if (plan && (plan.steps.length || plan.startAt))
      localStorage.setItem(key(sessionId), JSON.stringify(plan));
    else localStorage.removeItem(key(sessionId));
  } catch {
    /* private window: the plan just won't survive a reload */
  }
}

/** Today's date at HH:MM, as epoch ms. */
export function atToday(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
}

function fmtClock(secs: number): string {
  const s = Math.max(0, Math.ceil(secs));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function fmtTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const stepTitle = (s: DayStep) => (s.end ? "End of the day" : s.lessonTitle);

/** Banner shown on every screen in the last two minutes. */
export function HandoverWarningBanner({
  endsAt,
  nextTitle,
}: {
  endsAt: number;
  nextTitle?: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);
  const left = (endsAt - now) / 1000;
  if (left <= 0 || left > WARN_SECS + 10) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[90] flex justify-center pointer-events-none animate-slot-in">
      <div className="mt-3 rounded-full bg-[color:var(--orange)] text-black px-8 py-3 shadow-2xl flex items-center gap-4 font-extrabold">
        <span className="uppercase tracking-widest text-sm">This session ends in</span>
        <span className="font-mono text-3xl tabular-nums">{fmtClock(left)}</span>
        {nextTitle && (
          <span className="text-sm font-bold opacity-80 max-w-[30vw] truncate">
            · Next: {nextTitle}
          </span>
        )}
      </div>
    </div>
  );
}

/** Host-side schedule runner. Shows only a small pill until a change is near. */
export function SessionHandover({
  sessionId,
  channel,
  currentLessonId,
  onSwitch,
  onEnd,
  hidden,
}: {
  sessionId: string;
  channel: RealtimeChannel | null | undefined;
  currentLessonId: string | null;
  /** Move this session onto the given lesson's first slide. Resolves false if it failed. */
  onSwitch: (lessonId: string) => Promise<boolean>;
  /** End the session (last step of the day). */
  onEnd: () => Promise<void>;
  hidden?: boolean;
}) {
  const [plan, setPlanState] = useState<DayPlan | null>(() => readDayPlan(sessionId));
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [goLeft, setGoLeft] = useState<number | null>(null);
  const [switching, setSwitching] = useState(false);
  const [failed, setFailed] = useState(false);

  const setPlan = (p: DayPlan | null) => {
    writeDayPlan(sessionId, p);
    setPlanState(p && (p.steps.length || p.startAt) ? p : null);
  };

  useEffect(() => {
    const reread = () => setPlanState(readDayPlan(sessionId));
    reread();
    window.addEventListener("day-plan-changed", reread);
    return () => window.removeEventListener("day-plan-changed", reread);
  }, [sessionId]);

  const next = plan?.steps[0] ?? null;

  useEffect(() => {
    if (!next) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [next]);

  const endsAt = next ? atToday(next.at) : null;
  const secsLeft = endsAt ? (endsAt - now) / 1000 : null;
  const warning = secsLeft !== null && secsLeft > 0 && secsLeft <= WARN_SECS;
  const due = secsLeft !== null && secsLeft <= 0;

  // Chime once as the warning starts.
  const chimedFor = useRef<number | null>(null);
  useEffect(() => {
    if (warning && endsAt && chimedFor.current !== endsAt) {
      chimedFor.current = endsAt;
      sounds.timerAlarm();
    }
  }, [warning, endsAt]);

  // Tell the touch screens, repeatedly so a screen that missed one still hears.
  useEffect(() => {
    if (!warning || !channel || !endsAt || !next) return;
    const send = () =>
      channel.send({
        type: "broadcast",
        event: "handover_warning",
        payload: { endsAt, nextTitle: stepTitle(next) },
      });
    send();
    const id = window.setInterval(send, 5000);
    return () => window.clearInterval(id);
  }, [warning, channel, endsAt, next]);

  // At the time: start the countdown (straight away for the end of the day).
  useEffect(() => {
    if (due && goLeft === null && !switching && !failed)
      setGoLeft(next?.end ? 0 : GO_COUNTDOWN_SECS);
  }, [due, goLeft, switching, failed, next]);

  const goNow = async () => {
    if (!plan || !next || switching) return;
    setSwitching(true);
    setFailed(false);
    const rest = { ...plan, steps: plan.steps.slice(1) };
    if (next.end) {
      setPlan(rest);
      setGoLeft(null);
      setSwitching(false);
      await onEnd();
      return;
    }
    sounds.launch();
    const ok = await onSwitch(next.lessonId);
    setSwitching(false);
    setGoLeft(null);
    if (ok) setPlan(rest);
    else setFailed(true);
  };
  const goNowRef = useRef(goNow);
  goNowRef.current = goNow;

  useEffect(() => {
    if (goLeft === null) return;
    if (goLeft <= 0) {
      goNowRef.current();
      return;
    }
    const id = window.setTimeout(() => setGoLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [goLeft]);

  const snooze = () => {
    if (!plan || !next) return;
    const d = new Date(Date.now() + 5 * 60_000);
    const at = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    setGoLeft(null);
    setFailed(false);
    setPlan({ ...plan, steps: [{ ...next, at }, ...plan.steps.slice(1)] });
  };

  const showOverlay = (goLeft !== null || switching || failed) && next && !next.end;

  return (
    <>
      {!hidden && !warning && !showOverlay && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-[60] rounded-full bg-card/80 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity max-w-[40vw] truncate"
          title="Plan the rest of the day"
        >
          {next
            ? `⏭ ${fmtTime(next.at)} ${stepTitle(next)}${plan!.steps.length > 1 ? ` (+${plan!.steps.length - 1})` : ""}`
            : "⏭ Plan the day"}
        </button>
      )}

      {warning && endsAt && next && (
        <HandoverWarningBanner endsAt={endsAt} nextTitle={stepTitle(next)} />
      )}

      {showOverlay && (
        <div className="fixed inset-0 z-[120] bg-immersive bg-grid flex flex-col items-center justify-center p-10 text-center animate-slot-in">
          <div className="text-xs uppercase tracking-[0.5em] text-[color:var(--orange)] mb-6">
            {failed ? "Could not start the next session" : "Time's up · Next session"}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-glow mb-10 max-w-5xl">
            {stepTitle(next)}
          </h1>
          {!failed && (
            <div className="text-2xl text-muted-foreground mb-10">
              {switching ? "Starting…" : `Starting in ${goLeft}s`}
            </div>
          )}
          <div className="flex gap-4">
            <Button
              onClick={goNow}
              disabled={switching}
              className="h-20 px-14 text-2xl uppercase tracking-widest font-extrabold"
            >
              {failed ? "Try again" : "▶ Play next session"}
            </Button>
            <Button
              variant="outline"
              onClick={snooze}
              disabled={switching}
              className="h-20 px-8 text-lg uppercase tracking-widest"
            >
              Not yet (+5 min)
            </Button>
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[130] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card border-2 border-[color:var(--cyan)]/60 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)]">
                Rest of the day
              </div>
              <h2 className="text-2xl font-extrabold mt-1">When should the screens turn over?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Two minutes before each time, every screen shows a warning. At the time, all three
                screens move to the start of that lesson. Keep this page open on the Host.
              </p>
            </div>
            <DayEditor
              initial={plan?.steps ?? []}
              onCancel={() => setOpen(false)}
              onSave={(steps) => {
                setPlan({ ...(plan ?? {}), steps });
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ── Day editor (used on /day and in the Host dialog) ──────────────────────

type Lesson = { id: string; title: string };
type Row = { at: string; lessonId: string /* "__end__" = end the day */ };
export const END_ID = "__end__";

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lessons").select("id, title").order("title");
      setLessons((data ?? []) as Lesson[]);
    })();
  }, []);
  return lessons;
}

/** Checks rows and turns them into steps, or returns an error message. */
export function rowsToSteps(
  rows: Row[],
  lessons: Lesson[],
  requireFuture = true,
): DayStep[] | string {
  const filled = rows.filter((r) => r.at || r.lessonId);
  const steps: DayStep[] = [];
  for (const [i, r] of filled.entries()) {
    if (!/^\d{2}:\d{2}$/.test(r.at)) return `Row ${i + 1}: choose a time.`;
    if (requireFuture && atToday(r.at) <= Date.now())
      return `Row ${i + 1}: ${fmtTime(r.at)} has already passed today.`;
    if (r.lessonId === END_ID) {
      steps.push({ at: r.at, end: true });
      continue;
    }
    const l = lessons.find((x) => x.id === r.lessonId);
    if (!l) return `Row ${i + 1}: choose a lesson.`;
    steps.push({ at: r.at, lessonId: l.id, lessonTitle: l.title });
  }
  steps.sort((a, b) => a.at.localeCompare(b.at));
  for (let i = 1; i < steps.length; i++)
    if (steps[i].at === steps[i - 1].at) return `Two changes are set for ${fmtTime(steps[i].at)}.`;
  const endIdx = steps.findIndex((s) => s.end);
  if (endIdx !== -1 && endIdx !== steps.length - 1) return "“End the day” must be the last time.";
  return steps;
}

export function DayRows({
  rows,
  setRows,
  lessons,
  allowEnd = true,
}: {
  rows: Row[];
  setRows: (r: Row[]) => void;
  lessons: Lesson[];
  allowEnd?: boolean;
}) {
  const update = (i: number, patch: Partial<Row>) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="time"
            value={r.at}
            onChange={(e) => update(i, { at: e.target.value })}
            className="h-12 w-36 shrink-0 rounded-xl bg-background border border-border px-3 font-mono text-lg"
            aria-label={`Time ${i + 1}`}
          />
          <select
            value={r.lessonId}
            onChange={(e) => update(i, { lessonId: e.target.value })}
            className="h-12 flex-1 min-w-0 rounded-xl bg-background border border-border px-3"
            aria-label={`Lesson ${i + 1}`}
          >
            <option value="">Choose a lesson…</option>
            {allowEnd && <option value={END_ID}>■ End the day (screens go home)</option>}
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
            className="h-12 px-3 shrink-0"
            aria-label={`Remove row ${i + 1}`}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => setRows([...rows, { at: "", lessonId: "" }])}
        className="w-full h-11"
      >
        + Add a turnover time
      </Button>
    </div>
  );
}

export const stepsToRows = (steps: DayStep[]): Row[] =>
  steps.map((s) => ({ at: s.at, lessonId: s.end ? END_ID : s.lessonId }));

function DayEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: DayStep[];
  onCancel: () => void;
  onSave: (steps: DayStep[]) => void;
}) {
  const lessons = useLessons();
  const [rows, setRows] = useState<Row[]>(() =>
    initial.length ? stepsToRows(initial) : [{ at: "15:00", lessonId: "" }],
  );
  const [error, setError] = useState<string | null>(null);
  const save = () => {
    const res = rowsToSteps(rows, lessons);
    if (typeof res === "string") return setError(res);
    onSave(res);
  };
  return (
    <div className="space-y-4">
      <DayRows rows={rows} setRows={setRows} lessons={lessons} />
      {error && <div className="text-sm text-[color:var(--orange)]">{error}</div>}
      <div className="flex gap-3 justify-end pt-2">
        {initial.length > 0 && (
          <Button variant="ghost" onClick={() => onSave([])} className="mr-auto">
            Clear the plan
          </Button>
        )}
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
        <Button onClick={save} className="font-extrabold">
          Save
        </Button>
      </div>
    </div>
  );
}
