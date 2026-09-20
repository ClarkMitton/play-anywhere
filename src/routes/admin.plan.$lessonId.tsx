// Lesson plan export — /admin/plan/$lessonId
//
// A print-optimised teaching plan staff can save as a PDF and keep, plus a
// "Copy for review" button that puts the full markdown digest (including the
// raw payload appendix) on the clipboard for pasting into a chat.
//
// Renders through the /admin route's Outlet, so it inherits the PIN gate.
//
// Deliberately light-themed with explicit colours rather than the app's dark
// tokens: this page exists to come out of a printer.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  buildPlanMarkdown,
  describeContent,
  END_BEHAVIOUR_LABELS,
  groupScreens,
  phaseOf,
  totalMinutes,
  type PlanLesson,
  type PlanSlot,
} from "@/lib/planExport";

export const Route = createFileRoute("/admin/plan/$lessonId")({
  head: () => ({ meta: [{ title: "Lesson plan · Immersive Learning" }] }),
  component: PlanPage,
});

const PHASE_COLOURS: Record<string, string> = {
  Launch: "#0891b2",
  Establish: "#059669",
  Apply: "#ea580c",
  Demonstrate: "#7c3aed",
  Unphased: "#6b7280",
};

function PlanPage() {
  const { lessonId } = Route.useParams();
  const [lesson, setLesson] = useState<PlanLesson | null>(null);
  const [slots, setSlots] = useState<PlanSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: l }, { data: s }] = await Promise.all([
        supabase
          .from("lessons")
          .select(
            "id, title, description, estimated_duration_mins, ms_form_url, ms_form_title, ai_generated, generated_at, ai_notes",
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
      if (cancelled) return;
      if (l) setLesson(l as unknown as PlanLesson);
      if (s) setSlots(s as unknown as PlanSlot[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const copyForReview = async () => {
    if (!lesson) return;
    const markdown = buildPlanMarkdown(lesson, slots);
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Plan copied. Paste it into the chat to have it checked.");
    } catch {
      toast.error("Could not copy. Use Print and share the PDF instead.");
    }
  };

  if (loading) {
    return <div style={{ padding: 48, fontFamily: "system-ui" }}>Loading plan…</div>;
  }

  if (!lesson) {
    return (
      <div style={{ padding: 48, fontFamily: "system-ui" }}>
        <p>That lesson could not be found.</p>
        <Link to="/admin">← Admin</Link>
      </div>
    );
  }

  const notes = lesson.ai_notes ?? null;
  const total = totalMinutes(slots);
  const mismatch = total !== lesson.estimated_duration_mins;

  return (
    <>
      <style>{PRINT_CSS}</style>

      {/* Toolbar, hidden when printing */}
      <div className="plan-toolbar">
        <Link to="/admin" className="plan-toolbar-link">
          ← Admin
        </Link>
        <div className="plan-toolbar-actions">
          <button onClick={copyForReview} className="plan-btn plan-btn-ghost">
            Copy for review
          </button>
          <button onClick={() => window.print()} className="plan-btn">
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="plan-page">
        {/* ── Header ── */}
        <header className="plan-header">
          <div className="plan-eyebrow">Bradford College · Immersive Learning Room</div>
          <h1>{lesson.title}</h1>
          {lesson.description && <p className="plan-desc">{lesson.description}</p>}

          <dl className="plan-meta">
            <div>
              <dt>Length</dt>
              <dd>{lesson.estimated_duration_mins} min</dd>
            </div>
            <div>
              <dt>Slots</dt>
              <dd>
                {slots.length}
                {mismatch && <span className="plan-warn"> ({total} min of content)</span>}
              </dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>
                {lesson.ai_generated
                  ? `AI draft${lesson.generated_at ? ` · ${lesson.generated_at.slice(0, 10)}` : ""}`
                  : "Built by hand"}
              </dd>
            </div>
            <div>
              <dt>Feedback form</dt>
              <dd>{lesson.ms_form_url ? lesson.ms_form_title || "Linked" : "None"}</dd>
            </div>
          </dl>

          {lesson.ai_generated && (
            <p className="plan-draft-note">
              This plan was drafted by AI. A tutor is responsible for checking the content,
              especially anything relating to safety, before teaching it.
            </p>
          )}
        </header>

        {/* ── Outcomes and rationale ── */}
        {notes?.objectives && notes.objectives.length > 0 && (
          <section className="plan-section">
            <h2>Learning outcomes</h2>
            <ol className="plan-list">
              {notes.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>
          </section>
        )}

        {notes?.rationale && (
          <section className="plan-section">
            <h2>Why the lesson is shaped this way</h2>
            <p>{notes.rationale}</p>
          </section>
        )}

        {/* ── Check before teaching ── */}
        {notes?.verify_before_teaching && notes.verify_before_teaching.length > 0 && (
          <section className="plan-section plan-callout">
            <h2>Check before teaching</h2>
            <p className="plan-small">
              Written from general knowledge, without access to the scheme of work or site rules.
              Confirm each of these against a real source.
            </p>
            <ul className="plan-check">
              {notes.verify_before_teaching.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </section>
        )}

        {notes?.safety_note && (
          <section className="plan-section">
            <h2>Safety note</h2>
            <p>{notes.safety_note}</p>
          </section>
        )}

        {/* ── Media to source ── */}
        {notes?.media_requests && notes.media_requests.length > 0 && (
          <section className="plan-section">
            <h2>Media still to source</h2>
            <ul className="plan-list">
              {notes.media_requests.map((m, i) => (
                <li key={i}>
                  <strong>
                    Slot {m.slot_index + 1} ({m.screen}
                    {m.kind ? `, ${m.kind}` : ""}):
                  </strong>{" "}
                  {m.search_phrase}
                  {m.why ? ` — ${m.why}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Running order ── */}
        <section className="plan-section">
          <h2>Running order</h2>
          {slots.length === 0 && <p className="plan-small">This lesson has no slots yet.</p>}

          {slots.map((slot, i) => {
            const run = notes?.run_sheet?.find((r) => r.slot_index === i);
            const phase = phaseOf(slot);
            return (
              <article key={slot.id} className="plan-slot">
                <div className="plan-slot-head">
                  <span className="plan-slot-num">{i + 1}</span>
                  <span className="plan-slot-name">{slot.name || "Untitled slot"}</span>
                  <span className="plan-slot-phase" style={{ color: PHASE_COLOURS[phase] }}>
                    {phase}
                  </span>
                  <span className="plan-slot-mins">{slot.duration_mins} min</span>
                </div>

                <p className="plan-slot-flow">
                  Then {END_BEHAVIOUR_LABELS[slot.end_behaviour] ?? slot.end_behaviour}.
                  {slot.pause_before_advance && " Pauses before advancing."}
                  {slot.screen_delay_secs > 0 &&
                    ` Touch screens follow ${slot.screen_delay_secs}s later.`}
                </p>

                {run?.teacher_says && (
                  <p className="plan-run">
                    <strong>Say:</strong> {run.teacher_says}
                  </p>
                )}
                {run?.watch_for && (
                  <p className="plan-run">
                    <strong>Watch for:</strong> {run.watch_for}
                  </p>
                )}

                <div className="plan-screens" data-cols={groupScreens(slot).length}>
                  {groupScreens(slot).map((group) => {
                    const described = describeContent(group.content);
                    return (
                      <div key={group.label} className="plan-screen">
                        <div className="plan-screen-label">{group.label}</div>
                        <div className="plan-screen-tool">{described.label}</div>
                        {described.detail.map((d, j) => (
                          <div key={j} className="plan-screen-detail">
                            {d}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        {/* ── Raw payload appendix ── */}
        <section className="plan-section plan-appendix">
          <h2>Appendix: raw slot payloads</h2>
          <p className="plan-small">
            Exact content as stored, so it can be checked field by field.
          </p>
          <pre>
            {JSON.stringify(
              slots.map((s, i) => ({
                slot: i + 1,
                name: s.name,
                lead_phase: s.lead_phase,
                duration_mins: s.duration_mins,
                end_behaviour: s.end_behaviour,
                pause_before_advance: s.pause_before_advance,
                screen_delay_secs: s.screen_delay_secs,
                host: s.host_content,
                screen1: s.screen1_content,
                screen2: s.screen2_content,
              })),
              null,
              2,
            )}
          </pre>
        </section>
      </div>
    </>
  );
}

const PRINT_CSS = `
.plan-toolbar {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 12px 24px;
  background: #111827; border-bottom: 1px solid #374151;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
.plan-toolbar-link { color: #67e8f9; font-size: 12px; text-transform: uppercase; letter-spacing: .15em; text-decoration: none; }
.plan-toolbar-link:hover { text-decoration: underline; }
.plan-toolbar-actions { display: flex; gap: 8px; }
.plan-btn {
  font: inherit; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 9px 18px; border-radius: 8px; border: 2px solid #06b6d4;
  background: #06b6d4; color: #06251f; cursor: pointer;
}
.plan-btn-ghost { background: transparent; color: #67e8f9; }
.plan-btn:hover { filter: brightness(1.1); }

.plan-page {
  background: #fff; color: #1b1f24;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 11pt; line-height: 1.5;
  max-width: 190mm; margin: 24px auto; padding: 16mm 14mm;
  box-shadow: 0 4px 24px rgba(0,0,0,.18);
}
.plan-page h1 { font-size: 24pt; margin: 4px 0 8px; line-height: 1.15; color: #0b1220; }
.plan-page h2 {
  font-size: 12pt; margin: 0 0 8px; color: #0b1220;
  text-transform: uppercase; letter-spacing: .1em;
  border-bottom: 2px solid #06b6d4; padding-bottom: 4px;
}
.plan-eyebrow { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .28em; color: #0891b2; font-weight: 700; }
.plan-desc { color: #4b5563; margin: 0 0 12px; }
.plan-header { border-bottom: 2px solid #1b1f24; padding-bottom: 12px; margin-bottom: 18px; }

.plan-meta { display: flex; flex-wrap: wrap; gap: 24px; margin: 12px 0 0; }
.plan-meta dt { font-size: 8pt; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; font-weight: 700; }
.plan-meta dd { margin: 2px 0 0; font-size: 12pt; font-weight: 700; }
.plan-warn { color: #c2410c; font-size: 9pt; font-weight: 600; }

.plan-draft-note {
  margin: 14px 0 0; padding: 8px 12px;
  background: #fff7ed; border-left: 4px solid #ea580c;
  font-size: 9.5pt; color: #7c2d12;
}

.plan-section { margin-bottom: 20px; }
.plan-section > p { margin: 0 0 8px; }
.plan-small { font-size: 9.5pt; color: #6b7280; }
.plan-list { margin: 0; padding-left: 20px; }
.plan-list li { margin-bottom: 4px; }

.plan-callout { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 12px 14px; }
.plan-check { list-style: none; margin: 8px 0 0; padding: 0; }
.plan-check li { margin-bottom: 6px; padding-left: 26px; position: relative; }
.plan-check li::before {
  content: ""; position: absolute; left: 0; top: 2px;
  width: 13px; height: 13px; border: 1.5px solid #c2410c; border-radius: 2px;
}

.plan-slot { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
.plan-slot-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
.plan-slot-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid #1b1f24; font-size: 9pt; font-weight: 800; flex: none;
}
.plan-slot-name { font-size: 12pt; font-weight: 800; }
.plan-slot-phase { font-size: 8pt; text-transform: uppercase; letter-spacing: .12em; font-weight: 800; }
.plan-slot-mins { font-size: 9.5pt; color: #6b7280; margin-left: auto; font-variant-numeric: tabular-nums; }
.plan-slot-flow { font-size: 9pt; color: #6b7280; margin: 0 0 6px; }
.plan-run { font-size: 10pt; margin: 0 0 4px; }

.plan-screens { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
.plan-screens[data-cols="1"] { grid-template-columns: 1fr; }
.plan-screens[data-cols="2"] { grid-template-columns: 1fr 1fr; }
.plan-screen { border-top: 2px solid #a5f3fc; padding-top: 5px; min-width: 0; }
.plan-screen:first-child { border-top-color: #fed7aa; }
.plan-screen-label { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; font-weight: 700; }
.plan-screen-tool { font-size: 10pt; font-weight: 700; margin: 2px 0 3px; }
.plan-screen-detail { font-size: 9pt; color: #374151; margin-bottom: 2px; word-wrap: break-word; }

.plan-appendix { page-break-before: always; break-before: page; }
.plan-appendix pre {
  font-family: Consolas, "SFMono-Regular", Menlo, monospace;
  font-size: 7.5pt; line-height: 1.4;
  background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 4px;
  padding: 10px; white-space: pre-wrap; word-break: break-word;
}

@media (max-width: 800px) {
  .plan-screens { grid-template-columns: 1fr; }
  .plan-page { margin: 0; padding: 20px 16px; box-shadow: none; }
}

@media print {
  @page { size: A4 portrait; margin: 14mm 12mm; }
  .plan-toolbar { display: none !important; }
  .plan-page { margin: 0; padding: 0; max-width: none; box-shadow: none; }
  .plan-slot { border-color: #cbd5e1; }
}
`;
