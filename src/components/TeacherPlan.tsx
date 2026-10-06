// Teacher-friendly lesson plan, rendered inside the print page in
// routes/admin.plan.$lessonId.tsx (?view=teacher). Meant for a visiting teacher
// judging whether a session suits their class, so it leaves out everything that
// only matters to the people who built it: raw payloads, AI-draft warnings,
// "check before teaching" lists, media to source, and screen jargon.

import type { PlanLesson, PlanSlot } from "@/lib/planExport";
import { totalMinutes } from "@/lib/planExport";
import {
  endingForTeacher,
  friendlyPhase,
  startTimes,
  teacherScreenGroups,
} from "@/lib/teacherPlan";

export function TeacherPlan({ lesson, slots }: { lesson: PlanLesson; slots: PlanSlot[] }) {
  const notes = lesson.ai_notes ?? null;
  const starts = startTimes(slots);
  const minutes = lesson.estimated_duration_mins || totalMinutes(slots);

  return (
    <>
      <style>{TEACHER_CSS}</style>

      <header className="plan-header">
        <div className="plan-eyebrow">Bradford College · Immersive Learning Room</div>
        <h1>{lesson.title}</h1>
        {lesson.description && <p className="plan-desc">{lesson.description}</p>}
        <dl className="plan-meta">
          <div>
            <dt>Session length</dt>
            <dd>{minutes} minutes</dd>
          </div>
          <div>
            <dt>Steps</dt>
            <dd>{slots.length}</dd>
          </div>
          <div>
            <dt>Your role</dt>
            <dd>Guide the class</dd>
          </div>
        </dl>
      </header>

      <section className="plan-section">
        <h2>What is this?</h2>
        <p>
          An interactive lesson for our Immersive Learning Room. One very large screen at the front
          shows the lesson, and two touch screens let learners vote, answer questions and take part
          as the session goes. You guide the class from your phone and the lesson does the heavy
          lifting. Below is everything that will happen, step by step, so you can judge whether it
          fits your class.
        </p>
      </section>

      {notes?.objectives && notes.objectives.length > 0 && (
        <section className="plan-section">
          <h2>By the end, learners will be able to</h2>
          <ol className="plan-list">
            {notes.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        </section>
      )}

      {notes?.safety_note && (
        <section className="plan-section plan-callout">
          <h2>Safety</h2>
          <p>{notes.safety_note}</p>
        </section>
      )}

      <section className="plan-section">
        <h2>The session at a glance</h2>
        <table className="tp-table">
          <thead>
            <tr>
              <th>Starts</th>
              <th>Step</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => {
              const phase = friendlyPhase(slot.lead_phase);
              return (
                <tr key={slot.id}>
                  <td>{starts[i]} min</td>
                  <td>
                    {slot.name || "Untitled step"}
                    {phase && <span className="tp-tag">{phase.label}</span>}
                  </td>
                  <td>{slot.duration_mins} min</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="plan-section">
        <h2>Step by step</h2>
        {slots.map((slot, i) => {
          const run = notes?.run_sheet?.find((r) => r.slot_index === i);
          const phase = friendlyPhase(slot.lead_phase);
          const ending = endingForTeacher(slot);
          return (
            <article key={slot.id} className="plan-slot">
              <div className="plan-slot-head">
                <span className="plan-slot-num">{i + 1}</span>
                <span className="plan-slot-name">{slot.name || "Untitled step"}</span>
                {phase && <span className="tp-tag">{phase.label}</span>}
                <span className="plan-slot-mins">{slot.duration_mins} min</span>
              </div>

              {run?.teacher_says && (
                <p className="tp-say">
                  <strong>You might say:</strong> {run.teacher_says}
                </p>
              )}
              {run?.watch_for && (
                <p className="plan-run">
                  <strong>Look out for:</strong> {run.watch_for}
                </p>
              )}

              {teacherScreenGroups(slot).map(({ where, block }) => (
                <div key={where} className="tp-block">
                  <div className="tp-where">{where}</div>
                  <div className="tp-title">{block.title}</div>
                  {block.summary && <p className="tp-summary">{block.summary}</p>}
                  {block.items.length > 0 && (
                    <ul className="tp-items">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {ending && <p className="plan-slot-flow">{ending}</p>}
            </article>
          );
        })}
      </section>

      <section className="plan-section tp-feedback">
        <h2>Your thoughts</h2>
        <p>We would love to hear what you think before you decide.</p>
        <ul className="tp-questions">
          <li>Does this fit what you are teaching at the moment?</li>
          <li>Is the length and pace right for your class?</li>
          <li>Is anything unclear, too hard or too easy?</li>
          <li>Is there anything you would add, change or take out?</li>
        </ul>
      </section>
    </>
  );
}

const TEACHER_CSS = `
.tp-table { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
.tp-table th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; border-bottom: 1px solid #cbd5e1; padding: 4px 6px; }
.tp-table td { padding: 5px 6px; border-bottom: 1px solid #e5e7eb; }
.tp-table td:first-child, .tp-table td:last-child { white-space: nowrap; color: #4b5563; width: 1%; }
.tp-tag { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 999px; background: #ecfeff; color: #0e7490; font-size: 8pt; font-weight: 700; letter-spacing: .04em; }
.tp-say { margin: 0 0 6px; padding: 6px 10px; background: #f0fdf4; border-left: 3px solid #059669; font-size: 10pt; }
.tp-block { margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; }
.tp-where { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; font-weight: 700; }
.tp-title { font-size: 10.5pt; font-weight: 700; margin: 1px 0 2px; }
.tp-summary { margin: 0 0 4px; font-size: 10pt; color: #374151; }
.tp-items { margin: 0; padding-left: 18px; font-size: 10pt; }
.tp-items li { margin-bottom: 2px; }
.tp-feedback { break-inside: avoid; page-break-inside: avoid; }
.tp-questions { margin: 6px 0 0; padding-left: 20px; }
.tp-questions li { margin-bottom: 4px; }
`;
