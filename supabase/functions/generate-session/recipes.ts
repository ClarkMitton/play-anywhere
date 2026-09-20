// ─────────────────────────────────────────────────────────────
// ORCHESTRATION RECIPES
//
// Named three-screen structures the model SELECTS and PARAMETERISES rather
// than inventing from nothing. Left to itself a model puts a text slide on
// the Host and "waiting" on both touch screens, which wastes the room. Every
// generated slot must name a recipe; at most two may be FREEFORM.
//
// This mirrors the discipline used in the sibling Lesson Weaver app, where
// support strategies come from a curated bank and are never free-generated.
// ─────────────────────────────────────────────────────────────

export type Recipe = {
  id: string;
  phase: "Launch" | "Establish" | "Apply" | "Demonstrate" | "any";
  label: string;
  /** When this shape is the right choice. */
  use: string;
  host: string;
  screen1: string;
  screen2: string;
  typicalMins: number;
  /** Needs all three screens; excluded when the room is in two-screen mode. */
  requiresThreeScreens?: boolean;
  /** Only sensible with a small enough group to pass a screen around. */
  maxGroupSize?: number;
};

export const RECIPES: Recipe[] = [
  {
    id: "TITLE_MIRROR",
    phase: "Launch",
    label: "Title on every screen",
    use: "Always the first slot. Sets the topic and settles the room.",
    host: 'text_slide with the lesson title, size "xl"',
    screen1: "the same text_slide, mirrored",
    screen2: "the same text_slide, mirrored",
    typicalMins: 2,
  },
  {
    id: "CONFIDENCE_BASELINE",
    phase: "Launch",
    label: "Starting confidence",
    use:
      "Always the second slot unless the brief says otherwise. Captures a baseline to compare against at the end. Pairs with CONFIDENCE_FINAL.",
    host: 'confidence_checker with checkpoint "start" (Host shows the live aggregate)',
    screen1: 'the same confidence_checker, checkpoint "start" (learners tap here)',
    screen2: 'the same confidence_checker, checkpoint "start"',
    typicalMins: 4,
  },
  {
    id: "HOOK_CLIP",
    phase: "Launch",
    label: "Open with something to look at",
    use:
      "A short video or strong image to provoke a reaction before any teaching. Host carries the visual; touch screens carry the question to discuss.",
    host: "youtube or an image placeholder, full bleed",
    screen1: "text_slide holding the discussion question",
    screen2: "text_slide holding the same discussion question",
    typicalMins: 5,
  },
  {
    id: "TEACH_AND_CHECK",
    phase: "Establish",
    label: "Teach, then check immediately",
    use:
      "The workhorse for new content. Host presents, Touch Screen 2 collects an answer, Touch Screen 1 carries the teacher script and the reveal cue.",
    host:
      "the teaching content (text_slide, image placeholder or youtube), or the question itself with its live response count",
    screen1:
      "text_slide scripting what the teacher says and when to press Reveal Results. Never waiting.",
    screen2: "multiple_choice or true_or_false so learners answer",
    typicalMins: 8,
  },
  {
    id: "VOTE_AND_DISCUSS",
    phase: "Establish",
    label: "Take a position",
    use:
      "Opinion, judgement or a would-you-rather. No right answer needed. Host shows the bar chart filling live.",
    host: "voting, showing the live result",
    screen1: "the same voting payload",
    screen2: "the same voting payload",
    typicalMins: 5,
    maxGroupSize: 16,
  },
  {
    id: "WORD_STORM",
    phase: "Establish",
    label: "Build a word cloud together",
    use:
      "Surfacing what learners already know, or collecting vocabulary for the topic. The cloud builds live on the Host as words come in, so the room sees the shared answer forming. Strong at Entry level because one word is a low bar to clear.",
    host: "word_cloud showing the live cloud",
    screen1: "the same word_cloud payload (learners type here)",
    screen2: "the same word_cloud payload",
    typicalMins: 5,
  },
  {
    id: "SKETCH_IT",
    phase: "Apply",
    label: "Draw it on the whiteboard",
    use:
      "Labelling, sketching a layout, or working something out visually where writing a sentence would be the barrier rather than the task. Saves nothing, so never use it to assess.",
    host: "whiteboard with a title naming the task",
    screen1: "the same whiteboard payload (learners draw here)",
    screen2: "the same whiteboard payload",
    typicalMins: 6,
  },
  {
    id: "QUESTION_CAROUSEL",
    phase: "Apply",
    label: "Run a set of questions",
    use:
      "Several questions in one slot, teacher-paced. Both touch screens accept answers, so two learners work at once.",
    host: "question_round, showing the live count then the results per question",
    screen1: "the same question_round payload",
    screen2: "the same question_round payload",
    typicalMins: 10,
  },
  {
    id: "TEAM_BUZZER",
    phase: "Apply",
    label: "Split the room into two teams",
    use:
      "Competitive recall. Touch Screen 1 is Team 1, Touch Screen 2 is Team 2. Put the answers in answers[] so the teacher phone remote can show them privately.",
    host: "quiz_buzzer with the scoreboard and award controls",
    screen1: "the same quiz_buzzer payload (becomes Team 1 buzzer)",
    screen2: "the same quiz_buzzer payload (becomes Team 2 buzzer)",
    typicalMins: 10,
    requiresThreeScreens: true,
  },
  {
    id: "SPIN_AND_ANSWER",
    phase: "Apply",
    label: "Spin to pick",
    use:
      "Cold-calling, allocating roles or choosing a scenario at random. Keep every item to ten characters or fewer or the wheel truncates it.",
    host: "wheel_spinner holding the items",
    screen1: "the same wheel_spinner payload",
    screen2: "the same wheel_spinner payload",
    typicalMins: 5,
  },
  {
    id: "TIMED_TASK",
    phase: "Apply",
    label: "Beat the clock",
    use:
      "A practical or paper task away from the screens. The synced countdown keeps the room together.",
    host: "countdown_timer with a label naming the task",
    screen1: "the same countdown_timer",
    screen2: "the same countdown_timer",
    typicalMins: 8,
  },
  {
    id: "SPOT_THE_HAZARD",
    phase: "Apply",
    label: "Find what is wrong in the picture",
    use:
      "Strong for health and safety and any practical trade. Host holds the scene; learners identify problems and commit to an answer.",
    host: "an image placeholder describing the scene, with the hazards visible",
    screen1: "text_slide prompting learners to find and say the hazards",
    screen2: "multiple_choice or question_round naming candidate hazards",
    typicalMins: 8,
  },
  {
    id: "SHOW_WHAT_YOU_KNOW",
    phase: "Demonstrate",
    label: "Prove the learning",
    use:
      "The assessment beat. Questions tied directly to the stated objectives, harder than the Establish checks.",
    host: "question_round showing live counts and results",
    screen1: "the same question_round payload",
    screen2: "the same question_round payload",
    typicalMins: 10,
  },
  {
    id: "CONFIDENCE_FINAL",
    phase: "Demonstrate",
    label: "Closing confidence, compared to the start",
    use:
      'Always second to last when CONFIDENCE_BASELINE was used. checkpoint "final" makes the Host render a start-versus-now comparison, with confetti if it improved.',
    host: 'confidence_checker with checkpoint "final"',
    screen1: 'the same confidence_checker, checkpoint "final"',
    screen2: 'the same confidence_checker, checkpoint "final"',
    typicalMins: 4,
  },
  {
    id: "EXIT_FORM",
    phase: "Demonstrate",
    label: "Close the session",
    use:
      "The last slot. A closing message; the end-of-session screen shows the feedback QR code automatically once the session is ended.",
    host: 'text_slide such as "Well done", size "2xl"',
    screen1: "the same text_slide, mirrored",
    screen2: "the same text_slide, mirrored",
    typicalMins: 2,
  },
  {
    id: "FREEFORM",
    phase: "any",
    label: "Something the recipes do not cover",
    use:
      "Use sparingly. At most two per lesson, and all three screens must still have a job.",
    host: "any legal content type",
    screen1: "any legal content type except host_timer",
    screen2: "any legal content type except host_timer",
    typicalMins: 5,
  },
];

export function renderRecipeCatalogue(opts: {
  threeScreens: boolean;
  groupSize: number;
}): string {
  const usable = RECIPES.filter((r) => {
    if (r.requiresThreeScreens && !opts.threeScreens) return false;
    if (r.maxGroupSize && opts.groupSize > r.maxGroupSize) return false;
    return true;
  });

  return usable
    .map(
      (r) =>
        `### ${r.id} — ${r.label} (${r.phase}, about ${r.typicalMins} min)\n` +
        `When: ${r.use}\n` +
        `- host: ${r.host}\n` +
        `- screen1: ${r.screen1}\n` +
        `- screen2: ${r.screen2}`,
    )
    .join("\n\n");
}

export const RECIPE_IDS = RECIPES.map((r) => r.id);
