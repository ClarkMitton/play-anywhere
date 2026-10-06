// Tutor lesson plan, rendered inside the print page in
// routes/admin.plan.$lessonId.tsx (?view=teacher). A step-by-step running order
// for the tutor teaching the session: what is on each screen, what to say, what
// to press. It leaves out what only matters to the people who built the lesson:
// raw payloads, AI-draft warnings, media to source and screen jargon.

import { useEffect, useState } from "react";
import type { PlanLesson, PlanSlot } from "@/lib/planExport";
import { totalMinutes } from "@/lib/planExport";
import { normalizeEmbedUrl } from "@/components/SlotRenderer";
import {
  activityFor,
  beforeYouStart,
  endingForTeacher,
  friendlyPhase,
  startTimes,
  teacherScreenGroups,
  type TeacherBlock,
  type TeacherPreview,
} from "@/lib/teacherPlan";

/**
 * Video titles, looked up from YouTube so the plan can name each clip. Purely a
 * nicety: if the lookup fails the plan still shows the thumbnail and the link.
 */
function useVideoTitles(slots: PlanSlot[]): Record<string, string> {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const urls = Array.from(
    new Set(
      slots
        .flatMap((s) => teacherScreenGroups(s))
        .map((g) => g.block.preview)
        .filter((p): p is Extract<TeacherPreview, { kind: "video" }> => p?.kind === "video")
        .filter((p) => p.videoId)
        .map((p) => p.videoId),
    ),
  );
  const key = urls.join(",");

  useEffect(() => {
    let cancelled = false;
    for (const id of key ? key.split(",") : []) {
      const watch = `https://www.youtube.com/watch?v=${id}`;
      fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watch)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { title?: string } | null) => {
          if (!cancelled && d?.title) setTitles((t) => ({ ...t, [id]: d.title as string }));
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [key]);

  return titles;
}

function Preview({ preview, titles }: { preview: TeacherPreview; titles: Record<string, string> }) {
  switch (preview.kind) {
    case "slide":
      return (
        <div className="tp-slide">
          <div className="tp-slide-text">{preview.text || "(no text)"}</div>
          {preview.subtitle && <div className="tp-slide-sub">{preview.subtitle}</div>}
        </div>
      );

    case "image":
      return (
        <div className="tp-picture">
          {preview.caption && <div className="tp-picture-caption">{preview.caption}</div>}
          {preview.url ? (
            <img src={preview.url} alt={preview.caption} />
          ) : (
            <div className="tp-missing">No picture added yet.</div>
          )}
        </div>
      );

    case "video":
      return (
        <div className="tp-media">
          {preview.videoId && (
            <img
              className="tp-media-thumb"
              src={`https://i.ytimg.com/vi/${preview.videoId}/mqdefault.jpg`}
              alt=""
            />
          )}
          <div className="tp-media-body">
            <div className="tp-media-name">{titles[preview.videoId] || "YouTube video"}</div>
            {preview.clip && <div className="tp-media-clip">{preview.clip}</div>}
            <div className="tp-link">{preview.url || "No link set"}</div>
          </div>
        </div>
      );

    case "link":
      return (
        <div className="tp-media">
          {/* A live, shrunk copy of the page as the room loads it. The plan cannot
              read a Canva or Wordwall, but it can at least show its first screen. */}
          {preview.url && (
            <div className="tp-frame">
              <iframe
                src={normalizeEmbedUrl(preview.url)}
                title={`${preview.provider} preview`}
                loading="eager"
                tabIndex={-1}
              />
            </div>
          )}
          <div className="tp-media-body">
            {preview.description ? (
              <div className="tp-media-desc">{preview.description}</div>
            ) : (
              <div className="tp-missing">
                No description written yet. The picture shows the first screen of this{" "}
                {preview.provider} page. Open the link to see the rest.
              </div>
            )}
            <div className="tp-link">{preview.url || "No link set"}</div>
          </div>
        </div>
      );
  }
}

function Block({
  where,
  block,
  titles,
}: {
  where: string;
  block: TeacherBlock;
  titles: Record<string, string>;
}) {
  return (
    <div className="tp-block">
      <div className="tp-where">
        {where} · <span className="tp-kind">{block.title}</span>
      </div>
      {block.preview && <Preview preview={block.preview} titles={titles} />}
      {block.items.map((item, j) => (
        <div key={j} className="tp-prompt">
          {item}
        </div>
      ))}
      {block.questions && block.questions.length > 0 && (
        <ol className="tp-questions-list">
          {block.questions.map((q, j) => (
            <li key={j}>
              <div className="tp-q">{q.text || "(no question text)"}</div>
              {q.options.length > 0 && (
                <div className="tp-options">
                  {q.options.map((o, k) => (
                    <span key={k} className={o.correct ? "tp-option tp-correct" : "tp-option"}>
                      {o.correct ? "✓ " : ""}
                      {o.label}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
      {block.summary && <p className="tp-summary">{block.summary}</p>}
    </div>
  );
}

export function TeacherPlan({ lesson, slots }: { lesson: PlanLesson; slots: PlanSlot[] }) {
  const notes = lesson.ai_notes ?? null;
  const starts = startTimes(slots);
  const minutes = lesson.estimated_duration_mins || totalMinutes(slots);
  const titles = useVideoTitles(slots);
  const checks = [...beforeYouStart(slots), ...(notes?.verify_before_teaching ?? [])];

  // Absolute, so the link still works from a saved PDF. Set after mount because
  // the server render has no address to read.
  const [testUrl, setTestUrl] = useState("");
  useEffect(() => {
    setTestUrl(`${window.location.origin}/preview/${encodeURIComponent(lesson.id)}`);
  }, [lesson.id]);

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
        </dl>
      </header>

      <section className="plan-section">
        <h2>How this lesson works</h2>
        <p>
          The room has one very large screen at the front and two touch screens that learners walk
          up to. The lesson is a set of steps. Each step puts something on the screens, and you move
          the lesson on when the class is ready. For every step this plan shows what is on the
          screens, what to say, and what to press.
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

      {checks.length > 0 && (
        <section className="plan-section plan-callout">
          <h2>Before you start</h2>
          <ul className="plan-check">
            {checks.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {testUrl && (
        <section className="plan-section tp-try">
          <h2>Try it yourself first</h2>
          <p>
            You can click through every step before you teach it. This link opens the big screen and
            both touch screens side by side in your browser:
          </p>
          <p>
            <a href={testUrl} className="tp-try-link">
              {testUrl}
            </a>
          </p>
          <p className="plan-small">
            No sign-in needed. Use Next and Back to move through the steps. Nothing you do there
            affects a real class.
          </p>
        </section>
      )}

      <section className="plan-section">
        <h2>The session at a glance</h2>
        <table className="tp-table">
          <thead>
            <tr>
              <th>Starts</th>
              <th>Step</th>
              <th>What it is</th>
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
                    {i + 1}. {slot.name || "Untitled step"}
                    {phase && <span className="tp-tag">{phase.label}</span>}
                  </td>
                  <td>{activityFor(slot).title}</td>
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
          const doing = activityFor(slot).doing;
          return (
            <article key={slot.id} className="plan-slot">
              <div className="plan-slot-head">
                <span className="plan-slot-num">{i + 1}</span>
                <span className="plan-slot-name">{slot.name || "Untitled step"}</span>
                {phase && <span className="tp-tag">{phase.label}</span>}
                <span className="plan-slot-mins">
                  starts at {starts[i]} min · {slot.duration_mins} min
                </span>
              </div>

              <div className="tp-heading">On the screens</div>
              {teacherScreenGroups(slot).map(({ where, block }) => (
                <Block key={where} where={where} block={block} titles={titles} />
              ))}

              {(run?.teacher_says || doing.length > 0 || run?.watch_for || ending) && (
                <div className="tp-heading">What you do</div>
              )}
              {run?.teacher_says && (
                <p className="tp-say">
                  <strong>Say:</strong> {run.teacher_says}
                </p>
              )}
              {doing.length > 0 && (
                <ol className="tp-doing">
                  {doing.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ol>
              )}
              {run?.watch_for && (
                <p className="plan-run">
                  <strong>Look out for:</strong> {run.watch_for}
                </p>
              )}
              {ending && <p className="plan-slot-flow">{ending}</p>}
            </article>
          );
        })}
      </section>

      <section className="plan-section tp-feedback">
        <h2>After the lesson</h2>
        <p>Tell us how it went, so the next version is better.</p>
        <ul className="tp-feedback-list">
          <li>What went well?</li>
          <li>Was the length and pace right for your class?</li>
          <li>Was anything unclear, too hard or too easy?</li>
          <li>Is there anything you would add, change or take out?</li>
        </ul>
      </section>
    </>
  );
}

const TEACHER_CSS = `
.tp-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
.tp-table th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; border-bottom: 1px solid #cbd5e1; padding: 4px 6px; }
.tp-table td { padding: 4px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
.tp-table td:first-child, .tp-table td:last-child { white-space: nowrap; color: #4b5563; width: 1%; }
.tp-table td:nth-child(3) { color: #4b5563; white-space: nowrap; }
.tp-tag { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 999px; background: #ecfeff; color: #0e7490; font-size: 8pt; font-weight: 700; letter-spacing: .04em; }

.tp-heading { margin: 10px 0 4px; font-size: 8pt; text-transform: uppercase; letter-spacing: .14em; font-weight: 800; color: #0891b2; }
.tp-block { margin-bottom: 8px; }
.tp-where { font-size: 9pt; font-weight: 700; color: #1b1f24; margin-bottom: 3px; }
.tp-kind { font-weight: 600; color: #4b5563; }
.tp-summary { margin: 4px 0 0; font-size: 9.5pt; color: #4b5563; }
.tp-prompt { font-size: 10.5pt; font-weight: 700; margin: 2px 0; }

.tp-slide { border: 1.5px solid #1b1f24; border-radius: 6px; padding: 10px 14px; text-align: center; background: #f8fafc; }
.tp-slide-text { font-size: 11.5pt; font-weight: 800; line-height: 1.35; white-space: pre-line; }
.tp-slide-sub { margin-top: 5px; font-size: 9.5pt; color: #4b5563; white-space: pre-line; }

.tp-picture { border: 1.5px solid #1b1f24; border-radius: 6px; padding: 8px 10px; text-align: center; background: #0b1220; }
.tp-picture-caption { color: #67e8f9; font-size: 10.5pt; font-weight: 800; margin-bottom: 6px; white-space: pre-line; }
.tp-picture img { max-width: 100%; max-height: 38mm; object-fit: contain; }

.tp-media { display: flex; gap: 10px; align-items: flex-start; border: 1.5px solid #1b1f24; border-radius: 6px; padding: 8px 10px; background: #f8fafc; }
.tp-media-thumb { width: 38mm; border-radius: 4px; flex: none; }
.tp-frame { width: 240px; height: 135px; flex: none; overflow: hidden; border-radius: 4px; border: 1px solid #cbd5e1; background: #e5e7eb; }
.tp-frame iframe { width: 960px; height: 540px; border: 0; transform: scale(.25); transform-origin: 0 0; pointer-events: none; }
.tp-media-body { min-width: 0; }
.tp-media-name { font-size: 10.5pt; font-weight: 800; }
.tp-media-clip { font-size: 9.5pt; font-weight: 700; color: #c2410c; margin-top: 2px; }
.tp-media-desc { font-size: 10.5pt; white-space: pre-line; }
.tp-link { font-size: 8.5pt; color: #4b5563; word-break: break-all; margin-top: 3px; }
.tp-missing { font-size: 9.5pt; color: #c2410c; font-weight: 600; }
.tp-picture .tp-missing { color: #fdba74; }

.tp-questions-list { margin: 2px 0 0; padding-left: 20px; font-size: 10pt; }
.tp-questions-list li { margin-bottom: 5px; }
.tp-q { font-weight: 700; }
.tp-options { display: flex; flex-wrap: wrap; gap: 4px 6px; margin-top: 2px; }
.tp-option { border: 1px solid #cbd5e1; border-radius: 4px; padding: 0 6px; font-size: 9.5pt; }
.tp-correct { border-color: #059669; background: #ecfdf5; font-weight: 800; color: #065f46; }

.tp-say { margin: 0 0 6px; padding: 6px 10px; background: #f0fdf4; border-left: 3px solid #059669; font-size: 10pt; }
.tp-doing { margin: 0 0 6px; padding-left: 20px; font-size: 10pt; }
.tp-doing li { margin-bottom: 2px; }
.tp-feedback { break-inside: avoid; page-break-inside: avoid; }
.tp-try { break-inside: avoid; page-break-inside: avoid; }
.tp-try-link { color: #0e7490; font-weight: 700; word-break: break-all; text-decoration: underline; }
/* The app's base styles strip list markers. A plan needs its numbers back. */
.plan-page ol.plan-list, .plan-page ol.tp-doing, .plan-page ol.tp-questions-list { list-style: decimal; }
.plan-page ul.tp-feedback-list { list-style: disc; }
.tp-feedback-list { margin: 6px 0 0; padding-left: 20px; }
.tp-feedback-list li { margin-bottom: 14px; }

@media print {
  .tp-picture, .tp-correct, .tp-say, .tp-slide, .tp-media, .tp-tag { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
