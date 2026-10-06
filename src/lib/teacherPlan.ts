// ─────────────────────────────────────────────────────────────
// TEACHER-FRIENDLY LESSON PLAN
//
// planExport.ts describes a lesson for the people who build it: tool names,
// screen jargon, raw payloads. This file describes the same lesson for a
// visiting teacher deciding whether it suits their class. It answers three
// questions per step: what do learners see, what do they do, what do I do.
//
// Covers all 17 content types, mirroring describeContent(). If a new type is
// added there, add it here too or it degrades to a generic line.
// ─────────────────────────────────────────────────────────────

import type { ContentDef } from "@/types/slot";
import { groupScreens, type PlanSlot } from "@/lib/planExport";

export const PHASE_FRIENDLY: Record<string, { label: string; hint: string }> = {
  Launch: { label: "Starter", hint: "Hooks attention and finds out where learners are" },
  Establish: { label: "Teach", hint: "Introduces the key ideas" },
  Apply: { label: "Practise", hint: "Learners use what they have just learned" },
  Demonstrate: { label: "Show it", hint: "Learners show what they now know" },
};

export function friendlyPhase(phase: string | null): { label: string; hint: string } | null {
  return phase ? (PHASE_FRIENDLY[phase] ?? { label: phase, hint: "" }) : null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

function duration(total: unknown): string {
  const n = Number(total);
  if (!Number.isFinite(n) || n <= 0) return "a short time";
  const m = Math.floor(n / 60);
  const s = n % 60;
  if (m === 0) return `${s} seconds`;
  return s === 0 ? `${m} minute${m === 1 ? "" : "s"}` : `${m} min ${s} sec`;
}

export type TeacherBlock = {
  /** Short plain-English name for the activity, e.g. "Class vote". */
  title: string;
  /** One or two sentences: what learners see and do. */
  summary: string;
  /** The actual questions, options or text, if any. */
  items: string[];
  /** True when this is only a holding screen, so it can be left out. */
  holding?: boolean;
};

export function describeForTeacher(content: ContentDef | null | undefined): TeacherBlock {
  if (!content || !content.type) {
    return { title: "Nothing yet", summary: "", items: [], holding: true };
  }
  const c = content as Record<string, unknown>;

  switch (content.type) {
    case "waiting":
      return {
        title: "Holding screen",
        summary: "A calm screen while you talk.",
        items: [],
        holding: true,
      };

    case "text_slide":
      return {
        title: "Message on screen",
        summary: "Learners read this on screen.",
        items: [str(c.text), str(c.subtitle)].filter(Boolean),
      };

    case "image":
      return {
        title: "Picture",
        summary: str(c.title)
          ? `A picture to look at and discuss: ${str(c.title)}.`
          : "A picture to look at and discuss.",
        items: [],
      };

    case "youtube":
      return {
        title: "Video clip",
        summary: "A short video plays for the whole class.",
        items: [],
      };

    case "embed":
      return {
        title: "Web page",
        summary: "A web page is shown for the class to explore.",
        items: [],
      };

    case "confidence_checker": {
      const when =
        c.checkpoint === "start"
          ? " This is asked at the start so we can see how confident learners are beforehand."
          : c.checkpoint === "final"
            ? " This is asked again at the end so learners can see how far they have come."
            : "";
      return {
        title: "Confidence check",
        summary: `Learners tap how confident they feel. The big screen shows the class average.${when}`,
        items: [str(c.prompt)].filter(Boolean),
      };
    }

    case "voting":
      return {
        title: "Class vote",
        summary: "Learners vote on the touch screens and the results appear on the big screen.",
        items: [str(c.question), ...arr(c.options).map((o) => `• ${o}`)].filter(Boolean),
      };

    case "quiz_buzzer": {
      const questions = arr(c.questions).length
        ? arr(c.questions)
        : [str(c.question)].filter(Boolean);
      const answers = arr(c.answers);
      return {
        title: "Team buzzer quiz",
        summary: `Two teams (${str(c.team1_name) || "Team 1"} and ${str(c.team2_name) || "Team 2"}) race to buzz in. Answers are shown only to you, never to learners.`,
        items: questions.map(
          (q, i) => `${i + 1}. ${q}${answers[i] ? `  (Answer: ${answers[i]})` : ""}`,
        ),
      };
    }

    case "wheel_spinner": {
      const items = arr(c.items);
      return {
        title: "Wheel spinner",
        summary: str(c.prompt)
          ? `${str(c.prompt)} A wheel picks at random.`
          : "A wheel picks at random.",
        items: items.length ? [`Wheel contains: ${items.join(", ")}`] : [],
      };
    }

    case "countdown_timer":
    case "host_timer":
      return {
        title: "Timer",
        summary: `${duration(c.duration_secs)} on the clock${str(c.label) ? ` for: ${str(c.label)}` : ""}.`,
        items: [],
      };

    case "multiple_choice": {
      const options = arr(c.options);
      const correct = Number(c.correct);
      return {
        title: "Multiple choice question",
        summary: "Learners choose an answer on the touch screens.",
        items: [
          str(c.text),
          ...options.map(
            (o, i) => `${String.fromCharCode(65 + i)}. ${o}${i === correct ? "  ✓ correct" : ""}`,
          ),
        ].filter(Boolean),
      };
    }

    case "true_or_false":
      return {
        title: "True or false",
        summary: "Learners decide whether the statement is true or false.",
        items: [
          str(c.text),
          c.correct_tf === true ? "✓ True" : c.correct_tf === false ? "✓ False" : "",
        ].filter(Boolean),
      };

    case "question_round": {
      const questions = Array.isArray(c.questions)
        ? (c.questions as Record<string, unknown>[])
        : [];
      const items = questions.map((q, i) => {
        if (q.type === "true_or_false") {
          const ans = q.correct_tf === true ? "True" : q.correct_tf === false ? "False" : "";
          return `${i + 1}. ${str(q.text)} (True or false${ans ? `: ${ans}` : ""})`;
        }
        const options = arr(q.options);
        const correct = Number(q.correct);
        const ans = options[correct] !== undefined ? `  ✓ ${options[correct]}` : "";
        return `${i + 1}. ${str(q.text)}${ans}`;
      });
      return {
        title: "Quick-fire questions",
        summary: `${questions.length} question${questions.length === 1 ? "" : "s"}, at your pace. Learners answer on the touch screens.`,
        items,
      };
    }

    case "word_cloud":
      return {
        title: "Word cloud",
        summary: `Learners type short words and the most common ones grow on the big screen${Number(c.max_words) ? ` (up to ${Number(c.max_words)} each)` : ""}.`,
        items: [str(c.prompt)].filter(Boolean),
      };

    case "padlet":
      return {
        title: "Shared board",
        summary: "Learners post ideas to a shared board that everyone can see.",
        items: [str(c.question)].filter(Boolean),
      };

    case "rotation_timer":
      return {
        title: "Rotating stations",
        summary: `${Number(c.rounds ?? 4)} rounds of ${duration(c.round_secs)}, with ${duration(c.move_secs ?? 15)} to move between stations. The timer is on every screen.`,
        items: str(c.details) ? str(c.details).split("\n").filter(Boolean) : [],
      };

    case "hazard_hotspots": {
      const spots = (Array.isArray(c.hotspots) ? c.hotspots : [])
        .map((h) => str((h as { label?: unknown }).label))
        .filter(Boolean);
      return {
        title: "Spot the hazard",
        summary: "Learners tap the hazards they can find in a picture.",
        items: spots.length ? [`Hazards to find: ${spots.join(", ")}`] : [],
      };
    }

    case "whiteboard":
      return {
        title: "Whiteboard",
        summary: "A drawing space for sketching ideas.",
        items: [str(c.title)].filter(Boolean),
      };

    default:
      return { title: "Activity", summary: "", items: [] };
  }
}

/** Where learners are looking, in words a visitor will understand. */
export function teacherScreenGroups(slot: PlanSlot): { where: string; block: TeacherBlock }[] {
  const groups = groupScreens(slot).map((g) => {
    const where =
      g.label === "All three screens"
        ? "On every screen"
        : g.label.startsWith("Host")
          ? "Big screen"
          : g.label === "Both touch screens"
            ? "Table touch screens"
            : g.label.replace("Touch Screen", "Table touch screen");
    return { where, block: describeForTeacher(g.content) };
  });
  // A holding screen next to real content is noise. Keep it only if it is all there is.
  const real = groups.filter((g) => !g.block.holding);
  return real.length > 0 ? real : groups.slice(0, 1);
}

export function endingForTeacher(slot: PlanSlot): string {
  switch (slot.end_behaviour) {
    case "timed":
      return `Moves on by itself after ${slot.duration_mins} min.`;
    case "screen2_submit":
      return "Moves on once learners have answered.";
    case "screen1_continue":
      return "Waits for you. Tap Continue when ready.";
    default:
      return "";
  }
}

/** Minutes into the lesson at which each slot starts. */
export function startTimes(slots: PlanSlot[]): number[] {
  let t = 0;
  return slots.map((s) => {
    const start = t;
    t += Number(s.duration_mins) || 0;
    return start;
  });
}
