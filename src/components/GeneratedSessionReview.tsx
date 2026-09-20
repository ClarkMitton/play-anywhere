// Review screen shown AFTER generation but BEFORE anything is written to the
// database. Lays the session out in the same three-column Host / TS1 / TS2 grid
// as docs/lesson-planner.html (the paper planner), so the on-screen and printed
// contracts match, and reuses SlotThumbnail so each cell previews exactly as it
// does in the Stage Designer.

import { Button } from "@/components/ui/button";
import { SlotThumbnail } from "@/components/SlotThumbnail";
import { deriveEndBehaviour } from "@/lib/sessionRepair";
import type { RepairWarning } from "@/lib/sessionRepair";
import type { GeneratedSession } from "@/lib/sessionSchema";

const PHASE_COLOURS: Record<string, string> = {
  Launch: "var(--cyan)",
  Establish: "var(--success)",
  Apply: "var(--orange)",
  Demonstrate: "oklch(0.72 0.18 300)",
};

const END_BEHAVIOUR_LABEL: Record<string, string> = {
  timed: "auto-advances",
  screen2_submit: "waits for answers",
  screen1_continue: "waits for the teacher",
};

export function GeneratedSessionReview({
  session,
  warnings,
  saving,
  imageSource,
  busyImages,
  filledImages,
  onFetchImage,
  onFetchAllImages,
  onCreate,
  onDiscard,
  onRegenerate,
}: {
  session: GeneratedSession;
  warnings: RepairWarning[];
  saving: boolean;
  imageSource: "none" | "stock" | "ai";
  /** slot_index:screen keys currently being fetched. */
  busyImages: Set<string>;
  /** slot_index:screen keys already filled. */
  filledImages: Set<string>;
  onFetchImage: (index: number) => void;
  onFetchAllImages: () => void;
  onCreate: () => void;
  onDiscard: () => void;
  onRegenerate: () => void;
}) {
  const notes = session.teaching_notes;
  const totalMins = session.slots.reduce((sum, s) => sum + s.duration_mins, 0);

  return (
    <div className="min-h-screen bg-immersive bg-grid">
      {/* ── Sticky action bar ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--orange)]">
              AI draft · nothing saved yet
            </div>
            <h1 className="text-2xl font-extrabold truncate">{session.lesson.title}</h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              {session.slots.length} slots · {totalMins} minutes
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={onDiscard}
              disabled={saving}
              className="uppercase tracking-widest"
            >
              Discard
            </Button>
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={saving}
              className="uppercase tracking-widest"
            >
              Regenerate
            </Button>
            <Button
              onClick={onCreate}
              disabled={saving}
              className="uppercase tracking-widest font-extrabold"
            >
              {saving ? "Creating…" : "Create lesson"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Check before teaching: most important thing on the page ── */}
        {notes.verify_before_teaching.length > 0 && (
          <section className="rounded-2xl border-2 border-[color:var(--orange)] bg-[color:var(--orange)]/10 p-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[color:var(--orange)] font-bold mb-3">
              Check these before you teach it
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              This was written from general knowledge, with no access to your scheme of work or site
              rules. Confirm each of these against a real source.
            </p>
            <ul className="space-y-2">
              {notes.verify_before_teaching.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-[color:var(--orange)] font-bold shrink-0">□</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── What was changed automatically ── */}
        {warnings.length > 0 && (
          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-bold mb-3">
              Adjusted automatically ({warnings.length})
            </h2>
            <ul className="space-y-1.5">
              {warnings.map((w, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  <span className="text-[color:var(--cyan)] font-semibold">
                    {w.slotIndex === null ? "Lesson" : `Slot ${w.slotIndex + 1}`}:
                  </span>{" "}
                  {w.message}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Rationale and objectives ── */}
        <section className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold mb-2">
              Why this shape
            </h2>
            <p className="text-sm leading-relaxed">{notes.rationale || "No rationale returned."}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold mb-2">
              Learning outcomes
            </h2>
            {notes.objectives.length > 0 ? (
              <ul className="space-y-1.5 text-sm">
                {notes.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[color:var(--cyan)] shrink-0">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None returned.</p>
            )}
          </div>
        </section>

        {/* ── Media still to source ── */}
        {session.media_requests.length > 0 && (
          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-bold">
                Media to add ({session.media_requests.length})
              </h2>
              {imageSource !== "none" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onFetchAllImages}
                  disabled={busyImages.size > 0}
                  className="uppercase tracking-widest text-xs"
                >
                  {busyImages.size > 0
                    ? `Working… (${busyImages.size} left)`
                    : imageSource === "ai"
                      ? "Generate all images"
                      : "Find all images"}
                </Button>
              )}
            </div>

            <ul className="space-y-3">
              {session.media_requests.map((m, i) => {
                const key = `${m.slot_index}:${m.screen}`;
                const busy = busyImages.has(key);
                const filled = filledImages.has(key);
                return (
                  <li key={i} className="flex flex-wrap items-start gap-3 text-sm">
                    <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5">
                      Slot {m.slot_index + 1} · {m.screen} · {m.kind}
                    </span>
                    <span className="flex-1 min-w-[12rem]">{m.why || m.search_phrase}</span>

                    {filled ? (
                      <span className="text-xs uppercase tracking-widest text-[color:var(--success)] shrink-0">
                        ✓ added
                      </span>
                    ) : imageSource !== "none" && m.kind === "image" ? (
                      <button
                        onClick={() => onFetchImage(i)}
                        disabled={busy}
                        className="text-xs uppercase tracking-widest text-[color:var(--cyan)] hover:underline shrink-0 disabled:opacity-40"
                      >
                        {busy ? "Working…" : imageSource === "ai" ? "Generate" : "Find photo"}
                      </button>
                    ) : null}

                    <button
                      onClick={() => navigator.clipboard?.writeText(m.search_phrase)}
                      className="text-xs uppercase tracking-widest text-muted-foreground hover:underline shrink-0"
                    >
                      Copy search
                    </button>
                  </li>
                );
              })}
            </ul>

            {imageSource === "ai" && (
              <p className="text-[11px] text-muted-foreground mt-3">
                Generated images are invented, not photographs. Check anything showing correct
                practice before teaching it: a hard hat worn wrongly in a picture teaches the wrong
                thing.
              </p>
            )}
          </section>
        )}

        {/* ── The three-screen grid ── */}
        <section>
          <div className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-3 mb-2 sticky top-[5.5rem] z-10 bg-background/95 backdrop-blur py-2">
            <div />
            <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-[color:var(--cyan)]">
              Host <span className="block opacity-60 font-semibold">300 inch, whole class</span>
            </div>
            <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70">
              Touch Screen 1 <span className="block opacity-60 font-semibold">teacher side</span>
            </div>
            <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70">
              Touch Screen 2 <span className="block opacity-60 font-semibold">learner side</span>
            </div>
          </div>

          <div className="space-y-3">
            {session.slots.map((slot, i) => {
              const runSheet = notes.run_sheet.find((r) => r.slot_index === i);
              const endBehaviour = deriveEndBehaviour(slot);
              return (
                <div key={i} className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-3 items-stretch">
                  {/* Slot tab */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <span className="w-7 h-7 rounded-full border-2 border-foreground/40 flex items-center justify-center text-xs font-extrabold">
                      {i + 1}
                    </span>
                    <span
                      className="text-[8px] uppercase tracking-wider font-bold text-center leading-tight"
                      style={{ color: PHASE_COLOURS[slot.lead_phase] }}
                    >
                      {slot.lead_phase}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {slot.duration_mins}m
                    </span>
                  </div>

                  {/* Three screens */}
                  <div className="h-28">
                    <SlotThumbnail content={slot.host} tag="H" size="lg" role="host" />
                  </div>
                  <div className="h-28">
                    <SlotThumbnail content={slot.screen1} tag="1" size="lg" />
                  </div>
                  <div className="h-28">
                    <SlotThumbnail content={slot.screen2} tag="2" size="lg" />
                  </div>

                  {/* Name, recipe and run sheet, spanning under the row */}
                  <div className="col-span-4 -mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 pl-[3.9rem] pb-2 border-b border-border/40">
                    <span className="text-sm font-bold">{slot.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                      {slot.recipe}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {END_BEHAVIOUR_LABEL[endBehaviour] ?? endBehaviour}
                    </span>
                    {runSheet?.teacher_says && (
                      <span className="text-xs text-muted-foreground basis-full">
                        <span className="font-semibold text-foreground/80">Say:</span>{" "}
                        {runSheet.teacher_says}
                        {runSheet.watch_for && (
                          <>
                            {" "}
                            <span className="font-semibold text-foreground/80">
                              Watch for:
                            </span>{" "}
                            {runSheet.watch_for}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <p className="text-xs text-muted-foreground text-center pb-8">
          Creating the lesson opens it in the Stage Designer, where you can change anything before
          teaching it.
        </p>
      </main>
    </div>
  );
}
