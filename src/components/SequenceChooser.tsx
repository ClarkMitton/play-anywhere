// Sits between generation and the review screen.
//
// A "sequence" is one moment in the lesson: all three screens together, before
// the room moves on. Where the same learning point could be taught a different
// way, the tutor picks which version to run. Options are whole sequences, never
// per-screen, because both touch screens must always show the same activity.
//
// Sequences with no real alternative are not shown at all: a title slide has
// one sensible version and does not deserve a decision.

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SlotThumbnail } from "@/components/SlotThumbnail";
import { describeContent } from "@/lib/planExport";
import type { GeneratedSession } from "@/lib/sessionSchema";

export type Choice = { slotIndex: number; optionIndex: number };

export function SequenceChooser({
  session,
  onConfirm,
  onBack,
}: {
  session: GeneratedSession;
  /** choices maps slot index -> selected option (0 is the original). */
  onConfirm: (choices: Record<number, number>) => void;
  onBack: () => void;
}) {
  // Only sequences that actually offer a decision.
  const choosable = useMemo(
    () =>
      session.slots
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot }) => (slot.alternatives?.length ?? 0) > 0),
    [session.slots],
  );

  const [choices, setChoices] = useState<Record<number, number>>({});

  if (choosable.length === 0) {
    // Nothing to decide, so do not make the tutor click through an empty step.
    onConfirm({});
    return null;
  }

  return (
    <div className="min-h-screen bg-immersive bg-grid">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)]">
              Step 1 of 2 · choose how to run it
            </div>
            <h1 className="text-2xl font-extrabold truncate">{session.lesson.title}</h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              {choosable.length} moment{choosable.length === 1 ? "" : "s"} offer a choice. The rest
              have one sensible version.
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={onBack} className="uppercase tracking-widest">
              Back
            </Button>
            <Button
              onClick={() => onConfirm(choices)}
              className="uppercase tracking-widest font-extrabold"
            >
              Continue
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {choosable.map(({ slot, index }) => {
          const options = [
            {
              label: "As planned",
              why: slot.recipe.replace(/_/g, " ").toLowerCase(),
              content: slot,
            },
            ...(slot.alternatives ?? []).map((a) => ({
              label: a.label,
              why: a.why,
              content: a,
            })),
          ];
          const selected = choices[index] ?? 0;

          return (
            <section key={index}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="w-7 h-7 rounded-full border-2 border-foreground/40 flex items-center justify-center text-xs font-extrabold shrink-0">
                  {index + 1}
                </span>
                <h2 className="text-lg font-extrabold">{slot.name}</h2>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {slot.lead_phase} · {slot.duration_mins} min
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => setChoices((prev) => ({ ...prev, [index]: optionIndex }))}
                      className={`text-left rounded-2xl border-2 p-4 transition-colors ${
                        isSelected
                          ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/10"
                          : "border-border hover:border-[color:var(--cyan)]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-sm">{option.label}</span>
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold ${
                            isSelected ? "text-[color:var(--cyan)]" : "text-muted-foreground"
                          }`}
                        >
                          {isSelected ? "✓ chosen" : "use this"}
                        </span>
                      </div>

                      {option.why && (
                        <p className="text-xs text-muted-foreground mb-3 leading-snug">
                          {option.why}
                        </p>
                      )}

                      {/* The three screens as they would actually run */}
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        <div className="h-16">
                          <SlotThumbnail content={option.content.host} tag="H" role="host" />
                        </div>
                        <div className="h-16">
                          <SlotThumbnail content={option.content.screen1} tag="1" />
                        </div>
                        <div className="h-16">
                          <SlotThumbnail content={option.content.screen2} tag="2" />
                        </div>
                      </div>

                      <div className="text-[11px] text-muted-foreground leading-snug">
                        {describeContent(option.content.host).label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <p className="text-xs text-muted-foreground text-center pb-8">
          You can still change anything in the Stage Designer afterwards.
        </p>
      </main>
    </div>
  );
}
