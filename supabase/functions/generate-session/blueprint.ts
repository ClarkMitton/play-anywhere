// ─────────────────────────────────────────────────────────────
// LESSON BLUEPRINT
//
// The shape of a lesson is computed here, not asked for. Every time the phase
// balance was left to the model it satisfied whichever rule was added last and
// broke an adjacent one: fixing teach-before-test starved Apply, fixing Apply
// starved Demonstrate. Structure is arithmetic, so it belongs in code.
//
// The model receives the finished skeleton and fills in content only. The
// caller then forces phase, recipe and duration back on by index, so a lesson
// cannot come back mis-shaped however the model behaves.
// ─────────────────────────────────────────────────────────────

export type BlueprintSlot = {
  phase: "Launch" | "Establish" | "Apply" | "Demonstrate";
  recipe: string;
  minutes: number;
  /** What this slot is for. Goes to the model as the brief for that slot. */
  purpose: string;
};

export type BlueprintOpts = {
  durationMins: number;
  shape: "quiz-heavy" | "discussion-heavy" | "balanced";
  threeScreens: boolean;
  groupSize: number;
  includeConfidenceArc: boolean;
};

/** Apply-phase activities, in preference order per lesson style. */
const ACTIVITY_POOLS: Record<BlueprintOpts["shape"], string[]> = {
  "quiz-heavy": ["QUESTION_CAROUSEL", "TEAM_BUZZER", "SPIN_AND_ANSWER", "SPOT_THE_HAZARD"],
  "discussion-heavy": ["SPOT_THE_HAZARD", "VOTE_AND_DISCUSS", "WORD_STORM", "SKETCH_IT"],
  balanced: ["SPOT_THE_HAZARD", "TEAM_BUZZER", "VOTE_AND_DISCUSS", "QUESTION_CAROUSEL"],
};

const PURPOSE: Record<string, string> = {
  TITLE_MIRROR: "Open the lesson. Title on the Host; give each touch screen something additive such as the outcomes or a short ready prompt.",
  CONFIDENCE_BASELINE: "Capture how confident learners feel before any teaching, to compare against at the end.",
  HOOK_CLIP: "Provoke a reaction before any teaching. Ask for a VIDEO here: emit a \"[ADD VIDEO]\" placeholder on the Host plus a media_requests entry of kind \"youtube\" with a short search phrase. The discussion question goes on both touch screens.",
  TEACH: "Introduce ONE idea. The substance goes on the Host, big enough to read from the back. Not a question.",
  CHECK: "Check the idea taught in the slot immediately before this one. Nothing new.",
  SHOW_WHAT_YOU_KNOW: "Assess the stated outcomes. Harder than the Establish checks, and it must cover every outcome, including any taught late in the lesson.",
  CONFIDENCE_FINAL: "Close the confidence arc so the Host can show the before and after comparison.",
  EXIT_FORM: "Close the session positively and briefly.",
  SHAREBACK: "Capture what the groups produced in the task before it, so the work is seen rather than lost.",
};

function purposeFor(recipe: string): string {
  return PURPOSE[recipe] ?? `Run the ${recipe.replace(/_/g, " ").toLowerCase()} activity, applying what has been taught.`;
}

/**
 * Builds the running order. Durations here are indicative: reconcileDurations
 * trues them up to the requested total afterwards.
 */
/** Relative share of the lesson each kind of slot gets. */
const WEIGHT: Record<string, number> = {
  TITLE_MIRROR: 1,
  CONFIDENCE_BASELINE: 1.5,
  HOOK_CLIP: 2,
  TEACH: 2,
  CHECK: 1.5,
  SHOW_WHAT_YOU_KNOW: 2.5,
  CONFIDENCE_FINAL: 1.5,
  EXIT_FORM: 0.8,
  SHAREBACK: 1.5,
};
const ACTIVITY_WEIGHT = 3;

export function buildBlueprint(opts: BlueprintOpts): BlueprintSlot[] {
  const { durationMins, shape, threeScreens, groupSize, includeConfidenceArc } = opts;

  // 1. Decide WHICH slots exist. How long each runs is worked out afterwards,
  //    so the total always lands exactly on the requested length.
  const plan: { phase: BlueprintSlot["phase"]; recipe: string }[] = [];

  plan.push({ phase: "Launch", recipe: "TITLE_MIRROR" });
  if (includeConfidenceArc) plan.push({ phase: "Launch", recipe: "CONFIDENCE_BASELINE" });
  // A hook is a luxury in a short session, where the time is better spent teaching.
  if (durationMins >= 40) plan.push({ phase: "Launch", recipe: "HOOK_CLIP" });

  // Capped at 3 so Establish never out-weighs Apply: practice is the point.
  const pairs = Math.min(3, Math.max(1, Math.round(durationMins / 30)));
  for (let i = 0; i < pairs; i++) {
    plan.push({ phase: "Establish", recipe: "TEACH" });
    plan.push({ phase: "Establish", recipe: "CHECK" });
  }

  const pool = ACTIVITY_POOLS[shape].filter((r) => {
    if (!threeScreens && r === "TEAM_BUZZER") return false;
    if (groupSize > 16 && r === "VOTE_AND_DISCUSS") return false;
    return true;
  });
  const activities = Math.min(pool.length, Math.min(4, Math.max(2, Math.ceil(durationMins / 20))));
  for (let i = 0; i < activities; i++) {
    const recipe = pool[i % pool.length];
    plan.push({ phase: "Apply", recipe });
    // A timed task nobody shares back loses the work the groups did.
    if (recipe === "TIMED_TASK") plan.push({ phase: "Apply", recipe: "SHAREBACK" });
  }

  plan.push({ phase: "Demonstrate", recipe: "SHOW_WHAT_YOU_KNOW" });
  if (includeConfidenceArc) plan.push({ phase: "Demonstrate", recipe: "CONFIDENCE_FINAL" });
  plan.push({ phase: "Demonstrate", recipe: "EXIT_FORM" });

  // 1b. Every slot needs at least 2 minutes to be worth showing, so a short
  //     lesson must have fewer slots rather than impossibly short ones. Drop
  //     the least essential first; never go below two Apply activities, the
  //     assessment, or one teach-and-check pair.
  const dropOrder = ["HOOK_CLIP", "CONFIDENCE_BASELINE", "CONFIDENCE_FINAL"];
  while (plan.length * 2 > durationMins) {
    let removed = false;
    for (const recipe of dropOrder) {
      const i = plan.findIndex((p) => p.recipe === recipe);
      if (i >= 0) {
        plan.splice(i, 1);
        removed = true;
        break;
      }
    }
    if (!removed) {
      // Then trim teach-and-check pairs from the end, keeping one.
      const lastCheck = plan.map((p) => p.recipe).lastIndexOf("CHECK");
      const teachCount = plan.filter((p) => p.recipe === "TEACH").length;
      if (lastCheck >= 0 && teachCount > 1) {
        plan.splice(lastCheck, 1);
        const lastTeach = plan.map((p) => p.recipe).lastIndexOf("TEACH");
        if (lastTeach >= 0) plan.splice(lastTeach, 1);
        removed = true;
      }
    }
    if (!removed) {
      const applyCount = plan.filter((p) => p.phase === "Apply").length;
      if (applyCount > 2) {
        const i = plan.map((p) => p.phase).lastIndexOf("Apply");
        plan.splice(i, 1);
        removed = true;
      }
    }
    // Nothing left that can responsibly go: accept the overrun.
    if (!removed) break;
  }

  // 2. Share the minutes out by weight, with a 2 minute floor, then put any
  //    rounding drift on the longest Apply slot.
  const weights = plan.map((p) => WEIGHT[p.recipe] ?? ACTIVITY_WEIGHT);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const minutes = weights.map((w) => Math.max(2, Math.round((durationMins * w) / totalWeight)));

  // Spare minutes go TO Apply; minutes that need removing come from anywhere
  // else first. Taking them from Apply is what let Establish overtake it.
  let drift = durationMins - minutes.reduce((a, b) => a + b, 0);
  const applyIdx = plan.map((p, i) => (p.phase === "Apply" ? i : -1)).filter((i) => i >= 0);
  const otherIdx = plan.map((p, i) => (p.phase === "Apply" ? -1 : i)).filter((i) => i >= 0);

  let guard = 0;
  while (drift > 0 && guard < 500) {
    const pool = applyIdx.length > 0 ? applyIdx : otherIdx;
    minutes[pool[guard % pool.length]] += 1;
    drift -= 1;
    guard++;
  }
  while (drift < 0 && guard < 1000) {
    // Always shave the current longest eligible slot, so nothing collapses.
    const eligible = (otherIdx.length > 0 ? otherIdx : applyIdx).filter((i) => minutes[i] > 2);
    const target = eligible.length > 0
      ? eligible.reduce((a, b) => (minutes[a] >= minutes[b] ? a : b))
      : applyIdx.filter((i) => minutes[i] > 2)[0];
    if (target === undefined) break;
    minutes[target] -= 1;
    drift += 1;
    guard++;
  }

  return plan.map((p, i) => ({
    phase: p.phase,
    recipe: p.recipe,
    minutes: minutes[i],
    purpose: purposeFor(p.recipe),
  }));
}

export function renderBlueprint(slots: BlueprintSlot[]): string {
  return slots
    .map(
      (s, i) =>
        `${i + 1}. [${s.phase}] recipe ${s.recipe} — about ${s.minutes} min\n   Purpose: ${s.purpose}`,
    )
    .join("\n");
}
