// ─────────────────────────────────────────────────────────────
// CANONICAL CONTRACT for AI-generated sessions.
//
// This file is the source of truth and the ONLY place these rules are enforced
// in full. The edge function deliberately does not duplicate it (Deno cannot
// import from src/, and a second copy of a 300-line schema would drift within a
// release); it does a shallow type check just to decide whether to retry. If
// you add a content type, add it here and to LEGAL_TYPES in
// supabase/functions/generate-session/index.ts.
//
// Why this matters: SlotRenderer falls through to a blank "Standing by"
// screen on an unknown content type, so invalid content does not throw. It
// looks fine in the designer and dies in front of a class. Nothing reaches
// the database without passing through here.
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

// ─── Vocabularies, ported from the sibling Lesson Weaver app so both tools
// ─── describe learners the same way (src/types/lesson.ts).
export const LEVELS = [
  "Pre-Entry",
  "Entry 1",
  "Entry 2",
  "Entry 3",
  "Level 1",
  "Level 2",
  "Level 3",
  "HE/Foundation",
  "GCSE",
  "Functional Skills",
  "Other",
] as const;

export const DEPARTMENTS = [
  "Adult Skills",
  "Construction",
  "Early Years, Education and Social Care",
  "Engineering",
  "Science and Digital",
  "Professional and Creative",
  "14-16",
  "Apprenticeships",
  "PLW",
] as const;

export const LEAD_PHASES = ["Launch", "Establish", "Apply", "Demonstrate"] as const;

const ENTRY_LEVELS = ["Pre-Entry", "Entry 1", "Entry 2", "Entry 3"];
export function isEntryLevel(level: string): boolean {
  return ENTRY_LEVELS.includes(level);
}

// ─────────────────────────────────────────────
// The 14 legal content types. Anything outside this union is rejected, which
// is what keeps the phantom teacher_note / html_upload / webpage / host_webcam
// types out of generated lessons.
// ─────────────────────────────────────────────

const waiting = z.object({ type: z.literal("waiting") });

const textSlide = z.object({
  type: z.literal("text_slide"),
  text: z.string().min(1),
  subtitle: z.string().optional(),
  size: z.enum(["sm", "md", "lg", "xl", "2xl"]).optional(),
  color: z.string().optional(),
});

const image = z.object({
  type: z.literal("image"),
  url: z.string().min(1),
  title: z.string().optional(),
  file_name: z.string().optional(),
});

const youtube = z.object({
  type: z.literal("youtube"),
  url: z.string().min(1),
});

const embed = z.object({
  type: z.literal("embed"),
  url: z.string().min(1),
});

const confidenceChecker = z.object({
  type: z.literal("confidence_checker"),
  prompt: z.string().min(1),
  scale_mode: z.enum(["numbers", "emoji", "likert"]).optional(),
  max: z.number().int().min(2).max(10).optional(),
  optional_qualitative: z.boolean().optional(),
  checkpoint: z.enum(["start", "final"]).optional(),
});

const voting = z.object({
  type: z.literal("voting"),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
});

const quizBuzzer = z.object({
  type: z.literal("quiz_buzzer"),
  question: z.string().optional(),
  questions: z.array(z.string().min(1)).optional(),
  answers: z.array(z.string()).optional(),
  team1_name: z.string().optional(),
  team2_name: z.string().optional(),
});

const wheelSpinner = z.object({
  type: z.literal("wheel_spinner"),
  items: z.array(z.string().min(1)).min(2).max(12),
});

const countdownTimer = z.object({
  type: z.literal("countdown_timer"),
  label: z.string().optional(),
  duration_secs: z.number().int().positive(),
});

const hostTimer = z.object({
  type: z.literal("host_timer"),
  label: z.string().optional(),
  duration_secs: z.number().int().positive(),
});

const multipleChoice = z.object({
  type: z.literal("multiple_choice"),
  id: z.string().optional(),
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correct: z.number().int().min(0).optional(),
});

const trueOrFalse = z.object({
  type: z.literal("true_or_false"),
  id: z.string().optional(),
  text: z.string().min(1),
  correct_tf: z.boolean().optional(),
});

const roundQuestion = z.union([
  z.object({
    type: z.literal("multiple_choice"),
    id: z.string().optional(),
    text: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(6),
    correct: z.number().int().min(0).optional(),
  }),
  z.object({
    type: z.literal("true_or_false"),
    id: z.string().optional(),
    text: z.string().min(1),
    correct_tf: z.boolean().optional(),
  }),
]);

const questionRound = z.object({
  type: z.literal("question_round"),
  questions: z.array(roundQuestion).min(1).max(10),
});

export const contentSchema = z.discriminatedUnion("type", [
  waiting,
  textSlide,
  image,
  youtube,
  embed,
  confidenceChecker,
  voting,
  quizBuzzer,
  wheelSpinner,
  countdownTimer,
  hostTimer,
  multipleChoice,
  trueOrFalse,
  questionRound,
]);

export type Content = z.infer<typeof contentSchema>;

// ─────────────────────────────────────────────
// Slots
// ─────────────────────────────────────────────

const ANSWER_COLLECTING = [
  "multiple_choice",
  "true_or_false",
  "question_round",
  "confidence_checker",
  "voting",
] as const;

export function isAnswerCollecting(type: string): boolean {
  return (ANSWER_COLLECTING as readonly string[]).includes(type);
}

export const generatedSlotSchema = z
  .object({
    name: z.string().min(1),
    lead_phase: z.enum(LEAD_PHASES),
    duration_mins: z.number().min(1).max(60),
    recipe: z.string().min(1),
    host: contentSchema,
    screen1: contentSchema,
    screen2: contentSchema,
  })
  .superRefine((slot, ctx) => {
    // host_timer is invisible to the touch screens, so putting it there leaves
    // a blank screen with no way to recover.
    for (const screen of ["screen1", "screen2"] as const) {
      if (slot[screen].type === "host_timer") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [screen],
          message:
            "host_timer is host-only; use countdown_timer to show a timer on the touch screens",
        });
      }
    }

    // A single question is answered on screen2 only. If it lands on screen1 the
    // teacher surface becomes a duplicate answer pad and the script is lost.
    if (slot.screen1.type === "multiple_choice" || slot.screen1.type === "true_or_false") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["screen1"],
        message:
          "single multiple_choice/true_or_false is answered on screen2 only; screen1 should carry the teacher script (use question_round if both touch screens should answer)",
      });
    }
  });

export type GeneratedSlot = z.infer<typeof generatedSlotSchema>;

// ─────────────────────────────────────────────
// Whole payload
// ─────────────────────────────────────────────

export const mediaRequestSchema = z.object({
  slot_index: z.number().int().min(0),
  screen: z.enum(["host", "screen1", "screen2"]),
  kind: z.enum(["image", "youtube"]),
  search_phrase: z.string().min(1),
  why: z.string().default(""),
});

export const generatedSessionSchema = z
  .object({
    lesson: z.object({
      title: z.string().min(1),
      description: z.string().default(""),
      estimated_duration_mins: z.number().int().positive(),
    }),
    teaching_notes: z.object({
      rationale: z.string().default(""),
      objectives: z.array(z.string()).default([]),
      run_sheet: z
        .array(
          z.object({
            slot_index: z.number().int().min(0),
            teacher_says: z.string().default(""),
            watch_for: z.string().default(""),
          }),
        )
        .default([]),
      verify_before_teaching: z.array(z.string()).default([]),
      safety_note: z.string().nullable().default(null),
    }),
    media_requests: z.array(mediaRequestSchema).default([]),
    slots: z.array(generatedSlotSchema).min(3).max(24),
  })
  .superRefine((session, ctx) => {
    // A "final" confidence check renders a start-versus-now comparison. Without
    // an earlier "start" it shows a comparison against nothing.
    const checkpoints: { index: number; checkpoint: string }[] = [];
    session.slots.forEach((slot, i) => {
      for (const screen of ["host", "screen1", "screen2"] as const) {
        const c = slot[screen];
        if (c.type === "confidence_checker" && c.checkpoint) {
          checkpoints.push({ index: i, checkpoint: c.checkpoint });
        }
      }
    });
    const firstStart = checkpoints.find((c) => c.checkpoint === "start");
    const firstFinal = checkpoints.find((c) => c.checkpoint === "final");
    if (firstFinal && (!firstStart || firstStart.index >= firstFinal.index)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["slots", firstFinal.index],
        message:
          'a confidence_checker with checkpoint "final" needs an earlier slot with checkpoint "start" to compare against',
      });
    }

    // LEAD runs in order. Going backwards means the lesson jumps phases.
    const order = LEAD_PHASES as readonly string[];
    let highest = 0;
    session.slots.forEach((slot, i) => {
      const rank = order.indexOf(slot.lead_phase);
      if (rank < highest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["slots", i, "lead_phase"],
          message: `lead_phase went backwards to ${slot.lead_phase}; phases must run Launch to Demonstrate in order`,
        });
      }
      highest = Math.max(highest, rank);
    });
  });

export type GeneratedSession = z.infer<typeof generatedSessionSchema>;

// ─────────────────────────────────────────────
// The brief the form collects and the function consumes.
// ─────────────────────────────────────────────

export const briefSchema = z.object({
  topic: z.string().min(3),
  level: z.enum(LEVELS),
  department: z.enum(DEPARTMENTS),
  vocationalContext: z.string().default(""),
  durationMins: z.number().int().min(15).max(180),
  groupSize: z.number().int().min(1).max(60),
  threeScreens: z.boolean().default(true),
  shape: z.enum(["quiz-heavy", "discussion-heavy", "balanced"]).default("balanced"),
  includeConfidenceArc: z.boolean().default(true),
  objectives: z.array(z.string()).default([]),
  notes: z.string().default(""),
  msFormUrl: z.string().default(""),
  documents: z
    .array(z.object({ name: z.string(), text: z.string() }))
    .max(3)
    .default([]),
});

export type Brief = z.infer<typeof briefSchema>;

/** Mirrors the app's own YouTube parser (SlotRenderer.tsx extractYouTubeId). */
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    return null;
  } catch {
    return null;
  }
}
