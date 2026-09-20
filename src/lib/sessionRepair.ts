/* eslint-disable @typescript-eslint/no-explicit-any */
// ─────────────────────────────────────────────────────────────
// REPAIR LAYER
//
// Sits IN FRONT of zod. Anything the model gets wrong that we can fix
// deterministically is fixed here first, so a recoverable mistake never
// becomes a failed generation. Three tiers:
//
//   Tier 1  silent   derived columns, order_index, duration arithmetic
//   Tier 2  warned   a payload was moved, mirrored, clamped or replaced
//   Tier 3  fatal    still invalid after repair, so zod rejects and the edge
//                    function retries once with the issue list
//
// Input is untrusted JSON from a language model, so this file works in loose
// types on purpose.
// ─────────────────────────────────────────────────────────────

import {
  generatedSessionSchema,
  isAnswerCollecting,
  isEntryLevel,
  extractYouTubeId,
  type Brief,
  type GeneratedSession,
} from "./sessionSchema";

export type RepairWarning = { slotIndex: number | null; message: string };

export type RepairResult =
  | { ok: true; session: GeneratedSession; warnings: RepairWarning[] }
  | { ok: false; issues: string[]; warnings: RepairWarning[] };

const SCREENS = ["host", "screen1", "screen2"] as const;
const MIRROR_TYPES = [
  "confidence_checker",
  "voting",
  "question_round",
  "quiz_buzzer",
  "wheel_spinner",
  "countdown_timer",
  "word_cloud",
  "whiteboard",
];

const ENTRY_TEXT_MAX = 120;
const ENTRY_OPTION_MAX = 40;
const ENTRY_OPTION_COUNT = 3;
const WHEEL_ITEM_MAX = 10;

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function placeholder(brief: string): Record<string, any> {
  return {
    type: "text_slide",
    text: "[ADD IMAGE]",
    subtitle: brief,
    size: "md",
  };
}

/** Only the app's own storage bucket is a trusted source of image urls. */
function isAllowedImageUrl(url: unknown): boolean {
  return typeof url === "string" && url.includes("/storage/v1/object/public/lesson-media/");
}

// ─────────────────────────────────────────────
// Pre-repair, operating on raw model output
// ─────────────────────────────────────────────

function repairSlot(
  slot: Record<string, any>,
  index: number,
  brief: Brief,
  warn: (m: string) => void,
): void {
  const entry = isEntryLevel(brief.level);

  // ── host_timer is invisible on the touch screens ──
  for (const screen of ["screen1", "screen2"] as const) {
    const c = slot[screen];
    if (isObj(c) && c.type === "host_timer") {
      slot[screen] = {
        type: "countdown_timer",
        label: c.label,
        duration_secs: c.duration_secs,
      };
      warn(`turned the host-only timer on ${screen} into a synced countdown timer`);
    }
  }

  // ── a single question belongs on screen2, with the script on screen1 ──
  const s1 = slot.screen1;
  if (isObj(s1) && (s1.type === "multiple_choice" || s1.type === "true_or_false")) {
    const s2 = slot.screen2;
    if (!isObj(s2) || s2.type === "waiting") {
      slot.screen2 = s1;
      warn("moved the question from Touch Screen 1 to Touch Screen 2, where answers are collected");
    } else {
      warn(
        "removed a duplicate question from Touch Screen 1; answers are collected on Touch Screen 2",
      );
    }
    slot.screen1 = {
      type: "text_slide",
      text: "Question on the big screen",
      subtitle:
        "Learners answer on Touch Screen 2. Press Reveal Results on the Host screen when everyone has answered.",
      size: "md",
    };
  }

  // ── mirror whole-room tools the model only put on the host ──
  const host = slot.host;
  if (isObj(host) && MIRROR_TYPES.includes(host.type)) {
    for (const screen of ["screen1", "screen2"] as const) {
      const c = slot[screen];
      if (!isObj(c) || c.type === "waiting") {
        slot[screen] = JSON.parse(JSON.stringify(host));
        warn(
          `mirrored the ${String(host.type).replace(/_/g, " ")} onto ${screen} so learners can take part`,
        );
      }
    }
  }

  // ── quiz_buzzer needs team names and both touch screens ──
  if (isObj(host) && host.type === "quiz_buzzer") {
    if (!brief.threeScreens) {
      slot.host = placeholder("Quiz buzzer needs both touch screens. Replace this slot.");
      slot.screen1 = { type: "waiting" };
      slot.screen2 = { type: "waiting" };
      warn(
        "dropped a quiz buzzer round: it needs both touch screens and the room is in two-screen mode",
      );
    } else {
      host.team1_name = host.team1_name || "Team 1";
      host.team2_name = host.team2_name || "Team 2";
    }
  }

  // ── per-screen content clean-up ──
  for (const screen of SCREENS) {
    const c = slot[screen];
    if (!isObj(c)) {
      slot[screen] = { type: "waiting" };
      continue;
    }

    // Invented image urls are the classic failure: a bad url renders blank.
    if (c.type === "image" && !isAllowedImageUrl(c.url)) {
      slot[screen] = placeholder(
        typeof c.title === "string" && c.title.trim()
          ? c.title
          : "Describe the image needed for this slot",
      );
      warn(`replaced an image on ${screen} with a placeholder describing what to source`);
      continue;
    }

    // A malformed YouTube url cannot be played. (Real existence is checked
    // server-side via oEmbed before this runs.)
    if (c.type === "youtube" && !extractYouTubeId(String(c.url ?? ""))) {
      slot[screen] = placeholder("Find a short clip for this slot");
      warn(`replaced an unusable video url on ${screen} with a placeholder`);
      continue;
    }

    // Only the teacher may supply an embed.
    if (c.type === "embed") {
      slot[screen] = placeholder("Replace with the website or tool you want to show");
      warn(`removed an embedded website on ${screen}; add it yourself if you want one`);
      continue;
    }

    // A timer that disagrees with its own slot length is a live failure: the
    // room runs the timer, the plan says something else, and the teacher script
    // often says a third number. The slot length is the source of truth.
    if (c.type === "countdown_timer" || c.type === "host_timer") {
      const expected = Math.round(Number(slot.duration_mins) || 0) * 60;
      if (expected > 0 && Number(c.duration_secs) !== expected) {
        const was = Number(c.duration_secs);
        c.duration_secs = expected;
        if (screen === "host") {
          warn(
            `set the timer to ${expected / 60} minutes to match the slot length (it said ${Math.round((was || 0) / 60)})`,
          );
        }
      }
    }

    if (c.type === "wheel_spinner" && Array.isArray(c.items)) {
      const before = c.items.join("|");
      c.items = c.items
        .filter((i: unknown) => typeof i === "string" && i.trim())
        .slice(0, 12)
        .map((i: string) => i.trim().slice(0, WHEEL_ITEM_MAX));
      if (c.items.join("|") !== before) {
        warn("shortened the wheel labels so they fit without being cut off");
      }
    }

    if (entry) {
      if (c.type === "confidence_checker" && c.scale_mode !== "emoji") {
        c.scale_mode = "emoji";
        delete c.max;
        warn(
          `switched the confidence scale on ${screen} to faces, which reads better at ${brief.level}`,
        );
      }
      if (c.type === "text_slide" && typeof c.text === "string" && c.text.length > ENTRY_TEXT_MAX) {
        const full = c.text;
        c.text = full.slice(0, ENTRY_TEXT_MAX).replace(/\s+\S*$/, "");
        c.subtitle = c.subtitle
          ? `${c.subtitle} ${full.slice(c.text.length).trim()}`
          : full.slice(c.text.length).trim();
        warn(`shortened the slide text on ${screen} for ${brief.level} reading level`);
      }
      if (Array.isArray(c.options)) {
        if (c.options.length > ENTRY_OPTION_COUNT) {
          c.options = c.options.slice(0, ENTRY_OPTION_COUNT);
          if (typeof c.correct === "number" && c.correct >= ENTRY_OPTION_COUNT) c.correct = 0;
          warn(`cut the answer options on ${screen} to three for ${brief.level}`);
        }
        c.options = c.options.map((o: unknown) => String(o).slice(0, ENTRY_OPTION_MAX));
      }
    }

    // A correct index past the end of the options list marks the wrong answer.
    if (Array.isArray(c.options) && typeof c.correct === "number") {
      if (c.correct < 0 || c.correct >= c.options.length) {
        c.correct = 0;
        warn(
          `reset the correct answer on ${screen}; the model pointed past the end of the options`,
        );
      }
    }
  }

  // ── never leave the room with nothing to do ──
  const waitingCount = SCREENS.filter((s) => isObj(slot[s]) && slot[s].type === "waiting").length;
  if (waitingCount >= 2 && isObj(slot.host) && slot.host.type !== "waiting") {
    slot.screen1 = JSON.parse(JSON.stringify(slot.host));
    warn("mirrored the host content onto Touch Screen 1, which had nothing to show");
  }

  if (typeof slot.name !== "string" || !slot.name.trim()) slot.name = `Slot ${index + 1}`;

  // Recipe ids are internal vocabulary. They leak into slot names, and the name
  // is printed on the lesson plan a tutor and an observer read.
  if (typeof slot.name === "string") {
    const cleaned = slot.name.replace(/^\s*[A-Z][A-Z_]{3,}\s*[:\-–]\s*/, "").trim();
    if (cleaned && cleaned !== slot.name) {
      slot.name = cleaned;
      warn(`removed the recipe id from the slot name, leaving "${cleaned}"`);
    }
  }
}

// ─────────────────────────────────────────────
// Derived columns
// ─────────────────────────────────────────────

/**
 * The model never emits end_behaviour. Answer-collecting slots must wait for a
 * submission or the room advances past learners mid-answer; timers run to their
 * own clock; everything else waits for the teacher.
 */
export function deriveEndBehaviour(slot: {
  host: { type: string };
  screen2: { type: string };
}): string {
  if (isAnswerCollecting(slot.host.type) || isAnswerCollecting(slot.screen2.type)) {
    return "screen2_submit";
  }
  if (slot.host.type === "countdown_timer" || slot.host.type === "host_timer") return "timed";
  return "screen1_continue";
}

/**
 * Slot durations must add up to the requested lesson length, or the timeline in
 * the designer lies to the tutor. Scale proportionally, keep a 1 minute floor,
 * then put any rounding remainder on the longest Apply slot (the phase with the
 * most give in it).
 */
export function reconcileDurations(
  slots: { duration_mins: number; lead_phase: string }[],
  targetMins: number,
): boolean {
  const current = slots.reduce((sum, s) => sum + s.duration_mins, 0);
  if (current === targetMins) return false;

  const factor = targetMins / current;
  for (const slot of slots) {
    slot.duration_mins = Math.max(1, Math.round(slot.duration_mins * factor));
  }

  let drift = targetMins - slots.reduce((sum, s) => sum + s.duration_mins, 0);
  if (drift !== 0) {
    const applySlots = slots.filter((s) => s.lead_phase === "Apply");
    const pool = (applySlots.length > 0 ? applySlots : slots)
      .slice()
      .sort((a, b) => b.duration_mins - a.duration_mins);
    // Walk the pool so a large drift never drives one slot below the floor.
    let i = 0;
    while (drift !== 0 && i < pool.length * 60) {
      const slot = pool[i % pool.length];
      if (drift > 0) {
        slot.duration_mins += 1;
        drift -= 1;
      } else if (slot.duration_mins > 1) {
        slot.duration_mins -= 1;
        drift += 1;
      }
      i++;
    }
  }
  return true;
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────

export function repairAndValidate(raw: unknown, brief: Brief): RepairResult {
  const warnings: RepairWarning[] = [];

  if (!isObj(raw)) {
    return { ok: false, issues: ["the model did not return a JSON object"], warnings };
  }

  // Work on a copy so a failed repair never mutates the caller's data.
  const draft: Record<string, any> = JSON.parse(JSON.stringify(raw));

  if (!Array.isArray(draft.slots)) {
    return { ok: false, issues: ["the model returned no slots array"], warnings };
  }

  draft.slots.forEach((slot: any, i: number) => {
    if (!isObj(slot)) return;
    repairSlot(slot, i, brief, (message) => warnings.push({ slotIndex: i, message }));
  });

  // Drop anything still unsalvageable rather than failing the whole lesson.
  const before = draft.slots.length;
  draft.slots = draft.slots.filter((s: any) => isObj(s) && isObj(s.host));
  if (draft.slots.length < before) {
    warnings.push({
      slotIndex: null,
      message: `removed ${before - draft.slots.length} slot(s) that could not be repaired`,
    });
  }

  const parsed = generatedSessionSchema.safeParse(draft);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      warnings,
    };
  }

  const session = parsed.data;

  // Tier 1, silent: make the timeline honest.
  if (reconcileDurations(session.slots, brief.durationMins)) {
    warnings.push({
      slotIndex: null,
      message: `adjusted slot timings to add up to ${brief.durationMins} minutes`,
    });
  }
  session.lesson.estimated_duration_mins = brief.durationMins;

  // Re-sync timers LAST. reconcileDurations rescales duration_mins, which would
  // otherwise leave a countdown showing the pre-rescale length: exactly the
  // mismatch this is meant to prevent.
  for (const slot of session.slots) {
    const expected = slot.duration_mins * 60;
    for (const screen of SCREENS) {
      const content = slot[screen];
      if (
        (content.type === "countdown_timer" || content.type === "host_timer") &&
        content.duration_secs !== expected
      ) {
        content.duration_secs = expected;
      }
    }
  }

  return { ok: true, session, warnings };
}
