// Lesson card — /card/$lessonId
//
// The one page you send a tutor. Title, length, outcomes, the running order at
// a line per step, and a way into the live preview: a button, a QR code and the
// address in full, so it still works from a printout or a flattened PDF.
//
// Deliberately public (no PIN) and deliberately short. The detail a tutor needs
// lives in the preview, one step at a time, not here.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { totalMinutes, type PlanLesson, type PlanSlot } from "@/lib/planExport";
import { activityFor, startTimes } from "@/lib/teacherPlan";

export const Route = createFileRoute("/card/$lessonId")({
  head: () => ({ meta: [{ title: "Lesson card · Immersive Learning" }] }),
  component: CardPage,
});

function CardPage() {
  const { lessonId } = Route.useParams();
  const [lesson, setLesson] = useState<PlanLesson | null>(null);
  const [slots, setSlots] = useState<PlanSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  useEffect(() => {
    let cancelled = false;
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
      if (cancelled) return;
      if (l) setLesson(l as unknown as PlanLesson);
      if (s) setSlots(s as unknown as PlanSlot[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) return <div style={{ padding: 48, fontFamily: "system-ui" }}>Loading…</div>;
  if (!lesson) {
    return (
      <div style={{ padding: 48, fontFamily: "system-ui" }}>That lesson could not be found.</div>
    );
  }

  const previewUrl = `${origin}/preview/${lessonId}`;
  const cardUrl = `${origin}/card/${lessonId}`;
  const minutes = lesson.estimated_duration_mins || totalMinutes(slots);
  const starts = startTimes(slots);
  const outcomes = lesson.ai_notes?.objectives ?? [];

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${what} copied.`);
    } catch {
      toast.error("Could not copy. Select the address and copy it by hand.");
    }
  };

  return (
    <>
      <style>{CARD_CSS}</style>

      <div className="card-toolbar">
        <span className="card-toolbar-note">Send this page to a tutor</span>
        <div className="card-toolbar-actions">
          <button
            onClick={() => copy(cardUrl, "Link to this card")}
            className="card-btn card-btn-ghost"
          >
            Copy link
          </button>
          <button onClick={() => window.print()} className="card-btn card-btn-ghost">
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="card-page">
        <header>
          <div className="card-eyebrow">Bradford College · Immersive Learning Room</div>
          <h1>{lesson.title}</h1>
          {lesson.description && <p className="card-desc">{lesson.description}</p>}
          <div className="card-meta">
            <span>
              <strong>{minutes}</strong> minutes
            </span>
            <span>
              <strong>{slots.length}</strong> steps
            </span>
          </div>
        </header>

        <section className="card-try">
          <div className="card-try-text">
            <h2>Try the lesson yourself</h2>
            <p>
              Click through every step exactly as your class will see it, with notes on what to say
              and what to press. It takes a few minutes and needs no sign-in.
            </p>
            <Link to="/preview/$lessonId" params={{ lessonId }} className="card-cta">
              Open the preview →
            </Link>
            {origin && <div className="card-url">{previewUrl}</div>}
          </div>
          {origin && (
            <div className="card-qr">
              <QRCodeSVG value={previewUrl} size={132} />
              <span>or scan</span>
            </div>
          )}
        </section>

        {outcomes.length > 0 && (
          <section>
            <h2>By the end, learners will be able to</h2>
            <ol className="card-outcomes">
              {outcomes.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>
          </section>
        )}

        <section>
          <h2>What happens</h2>
          <ol className="card-steps">
            {slots.map((slot, i) => (
              <li key={slot.id}>
                <span className="card-step-time">{starts[i]}′</span>
                <span className="card-step-name">{slot.name || "Untitled step"}</span>
                <span className="card-step-kind">
                  {activityFor(slot).title.replace(/\s*\(.*\)$/, "")}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

const CARD_CSS = `
html, body { background: #e5e7eb; }
.card-toolbar {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 10px 24px; background: #111827; border-bottom: 1px solid #374151;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
.card-toolbar-note { color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: .15em; }
.card-toolbar-actions { display: flex; gap: 8px; }
.card-btn {
  font: inherit; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 8px 16px; border-radius: 8px; border: 2px solid #06b6d4; background: #06b6d4; color: #06251f; cursor: pointer;
}
.card-btn-ghost { background: transparent; color: #67e8f9; }

.card-page {
  background: #fff; color: #1b1f24;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 11pt; line-height: 1.45;
  max-width: 190mm; margin: 24px auto; padding: 14mm;
  box-shadow: 0 4px 24px rgba(0,0,0,.18);
}
.card-page h1 { font-size: 26pt; font-weight: 800; line-height: 1.1; margin: 4px 0 6px; color: #0b1220; }
.card-page h2 { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: #0891b2; margin: 0 0 6px; }
.card-page section { margin-top: 16px; }
.card-eyebrow { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .28em; color: #0891b2; font-weight: 700; }
.card-desc { color: #4b5563; margin: 0 0 8px; }
.card-meta { display: flex; gap: 20px; font-size: 11pt; color: #4b5563; }
.card-meta strong { font-size: 15pt; color: #0b1220; }

.card-try {
  display: flex; align-items: center; gap: 18px;
  border: 2.5px solid #0891b2; border-radius: 12px; padding: 14px 16px; background: #ecfeff;
  break-inside: avoid;
}
.card-try-text { flex: 1; min-width: 0; }
.card-try p { margin: 0 0 10px; }
.card-cta {
  display: inline-block; background: #0891b2; color: #fff; font-weight: 800; font-size: 13pt;
  padding: 9px 20px; border-radius: 999px; text-decoration: none;
}
.card-cta:hover { background: #0e7490; }
.card-url { margin-top: 8px; font-size: 9pt; color: #155e75; word-break: break-all; font-family: Consolas, Menlo, monospace; }
.card-qr { flex: none; display: flex; flex-direction: column; align-items: center; gap: 4px; background: #fff; padding: 8px; border-radius: 8px; }
.card-qr span { font-size: 8pt; text-transform: uppercase; letter-spacing: .15em; color: #6b7280; }

.card-page ol.card-outcomes { list-style: decimal; margin: 0; padding-left: 20px; }
.card-outcomes li { margin-bottom: 2px; }

/* Two columns keeps even a 30-step lesson on the one page. */
.card-page ol.card-steps { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 20px; font-size: 9.5pt; }
.card-steps li { display: flex; align-items: baseline; gap: 6px; padding: 2.5px 0; border-bottom: 1px solid #e5e7eb; break-inside: avoid; }
.card-step-time { flex: none; width: 2.4em; text-align: right; color: #6b7280; font-variant-numeric: tabular-nums; }
.card-step-name { flex: 1; min-width: 0; font-weight: 600; }
.card-step-kind { flex: none; color: #6b7280; font-size: 8.5pt; }

@media (max-width: 700px) {
  .card-page { margin: 0; padding: 18px 16px; box-shadow: none; }
  .card-page ol.card-steps { columns: 1; }
  .card-try { flex-direction: column; align-items: flex-start; }
}
@media print {
  @page { size: A4 portrait; margin: 12mm; }
  html, body { background: #fff; }
  .card-toolbar { display: none !important; }
  .card-page { margin: 0; padding: 0; max-width: none; box-shadow: none; }
  .card-try, .card-cta { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
