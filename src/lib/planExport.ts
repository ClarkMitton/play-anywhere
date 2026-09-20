// ─────────────────────────────────────────────────────────────
// LESSON PLAN EXPORT
//
// Turns a lesson plus its design-time slots into something a human can read:
// a printable teaching plan, and a markdown digest that can be pasted into a
// chat for review. Both come from the same describeContent() so the printed
// page and the digest never disagree.
//
// Covers all 17 content types. If a new one is added to SlotRenderer, add it
// here too or it degrades to a bare type name in exported plans.
// ─────────────────────────────────────────────────────────────

import type { ContentDef } from "@/types/slot";

export type PlanLesson = {
  id: string;
  title: string;
  description: string | null;
  estimated_duration_mins: number;
  ms_form_url: string | null;
  ms_form_title: string | null;
  ai_generated?: boolean | null;
  generated_at?: string | null;
  ai_notes?: PlanAiNotes | null;
};

export type PlanAiNotes = {
  rationale?: string;
  objectives?: string[];
  run_sheet?: { slot_index: number; teacher_says?: string; watch_for?: string }[];
  verify_before_teaching?: string[];
  media_requests?: {
    slot_index: number;
    screen: string;
    kind?: string;
    search_phrase: string;
    why?: string;
  }[];
  safety_note?: string | null;
  brief?: Record<string, unknown>;
};

export type PlanSlot = {
  id: string;
  order_index: number;
  name: string | null;
  lead_phase: string | null;
  duration_mins: number;
  end_behaviour: string;
  pause_before_advance: boolean;
  screen_delay_secs: number;
  host_content: ContentDef;
  screen1_content: ContentDef;
  screen2_content: ContentDef;
};

export const SCREEN_LABELS = {
  host: "Host (300 inch)",
  screen1: "Touch Screen 1",
  screen2: "Touch Screen 2",
} as const;

export const END_BEHAVIOUR_LABELS: Record<string, string> = {
  timed: "advances on the timer",
  screen2_submit: "waits for answers on Touch Screen 2",
  screen1_continue: "waits for the teacher to continue",
  "": "not set",
};

function secs(total: unknown): string {
  const n = Number(total);
  if (!Number.isFinite(n) || n <= 0) return "no duration set";
  const m = Math.floor(n / 60);
  const s = n % 60;
  if (m === 0) return `${s} seconds`;
  return s === 0 ? `${m} minute${m === 1 ? "" : "s"}` : `${m}m ${s}s`;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

/**
 * Plain-English description of one screen's content.
 * `label` names the tool; `detail` is zero or more lines beneath it.
 */
export function describeContent(content: ContentDef | null | undefined): {
  label: string;
  detail: string[];
} {
  if (!content || !content.type) return { label: "Nothing set", detail: [] };
  const c = content as Record<string, unknown>;

  switch (content.type) {
    case "waiting":
      return { label: "Standing by", detail: ["Holding screen while the teacher talks."] };

    case "text_slide": {
      const detail = [`“${str(c.text) || "(no text)"}”`];
      if (str(c.subtitle)) detail.push(`Subtitle: “${str(c.subtitle)}”`);
      const placeholder = str(c.text).startsWith("[ADD IMAGE]");
      return {
        label: placeholder ? "Text slide (image placeholder)" : "Text slide",
        detail,
      };
    }

    case "image": {
      const detail: string[] = [];
      if (str(c.title)) detail.push(`Caption: “${str(c.title)}”`);
      detail.push(str(c.url) ? `File: ${str(c.file_name) || str(c.url)}` : "No image attached yet");
      return { label: "Image", detail };
    }

    case "youtube":
      return {
        label: "YouTube video",
        detail: [str(c.url) || "No video link set"],
      };

    case "embed":
      return {
        label: "Embedded website",
        detail: [str(c.url) || "No address set"],
      };

    case "confidence_checker": {
      const checkpoint =
        c.checkpoint === "start"
          ? " (baseline, at the start)"
          : c.checkpoint === "final"
            ? " (final, compared against the baseline)"
            : "";
      const scale =
        c.scale_mode === "emoji"
          ? "faces"
          : c.scale_mode === "likert"
            ? "agree to disagree"
            : `1 to ${Number(c.max) || 5}`;
      const detail = [`Asks: “${str(c.prompt) || "(no prompt)"}”`, `Scale: ${scale}`];
      if (c.optional_qualitative) detail.push("Learners may add a comment (up to 5).");
      detail.push("Learners answer one at a time; the Host shows the live average.");
      return { label: `Confidence check${checkpoint}`, detail };
    }

    case "voting": {
      const options = arr(c.options);
      return {
        label: "Vote",
        detail: [
          `Question: “${str(c.question) || "(no question)"}”`,
          `Options: ${options.length ? options.join(" · ") : "none set"}`,
        ],
      };
    }

    case "quiz_buzzer": {
      const questions = arr(c.questions).length
        ? arr(c.questions)
        : [str(c.question)].filter(Boolean);
      const answers = arr(c.answers);
      const detail = [
        `Teams: ${str(c.team1_name) || "Team 1"} (Touch Screen 1) vs ${str(c.team2_name) || "Team 2"} (Touch Screen 2)`,
      ];
      if (questions.length === 0) detail.push("No questions set.");
      questions.forEach((q, i) => {
        detail.push(`Q${i + 1}: ${q}${answers[i] ? `  → ${answers[i]}` : ""}`);
      });
      if (answers.length > 0) {
        detail.push("Answers show only on the teacher's phone remote, never on the screens.");
      }
      return { label: "Quiz buzzer", detail };
    }

    case "wheel_spinner": {
      const items = arr(c.items);
      return {
        label: "Wheel spinner",
        detail: [items.length ? `Segments: ${items.join(" · ")}` : "No segments set"],
      };
    }

    case "countdown_timer":
      return {
        label: "Countdown timer (all three screens)",
        detail: [str(c.label) ? `“${str(c.label)}”` : "No label", secs(c.duration_secs)],
      };

    case "host_timer":
      return {
        label: "Timer (Host only, learners cannot see it)",
        detail: [str(c.label) ? `“${str(c.label)}”` : "No label", secs(c.duration_secs)],
      };

    case "multiple_choice": {
      const options = arr(c.options);
      const correct = Number(c.correct);
      const detail = [`Question: “${str(c.text) || "(no question)"}”`];
      options.forEach((o, i) => {
        const marker = String.fromCharCode(65 + i);
        detail.push(`${marker}. ${o}${i === correct ? "   ✓ correct" : ""}`);
      });
      if (options.length === 0) detail.push("No options set.");
      return { label: "Multiple choice", detail };
    }

    case "true_or_false":
      return {
        label: "True or false",
        detail: [
          `Statement: “${str(c.text) || "(no statement)"}”`,
          `Answer: ${c.correct_tf === true ? "True" : c.correct_tf === false ? "False" : "not set"}`,
        ],
      };

    case "question_round": {
      const questions = Array.isArray(c.questions)
        ? (c.questions as Record<string, unknown>[])
        : [];
      const detail: string[] = [
        `${questions.length} question${questions.length === 1 ? "" : "s"}, teacher-paced. Both touch screens can answer.`,
      ];
      questions.forEach((q, i) => {
        if (q.type === "true_or_false") {
          detail.push(
            `Q${i + 1} (true/false): “${str(q.text)}” → ${q.correct_tf === true ? "True" : q.correct_tf === false ? "False" : "not set"}`,
          );
        } else {
          const options = arr(q.options);
          const correct = Number(q.correct);
          detail.push(
            `Q${i + 1}: “${str(q.text)}” → ${options[correct] !== undefined ? `${String.fromCharCode(65 + correct)}. ${options[correct]}` : "answer not set"}`,
          );
          if (options.length) detail.push(`   Options: ${options.join(" · ")}`);
        }
      });
      return { label: "Question round", detail };
    }

    case "word_cloud": {
      const detail = [`Prompt: “${str(c.prompt) || "(no prompt)"}”`];
      if (str(c.title)) detail.push(`Title: “${str(c.title)}”`);
      if (Number(c.max_words)) detail.push(`Up to ${Number(c.max_words)} words each.`);
      return { label: "Word cloud", detail };
    }

    case "padlet": {
      const detail = [`Question: “${str(c.question) || "(no question)"}”`];
      if (str(c.title)) detail.push(`Title: “${str(c.title)}”`);
      return { label: "Padlet board", detail };
    }

    case "whiteboard":
      return {
        label: "Whiteboard",
        detail: [str(c.title) ? `Title: “${str(c.title)}”` : "Free drawing space"],
      };

    default:
      return {
        label: `Unrecognised content type “${content.type}”`,
        detail: ["This will show as a blank Standing by screen. Change it before teaching."],
      };
  }
}

export function phaseOf(slot: PlanSlot): string {
  return slot.lead_phase ?? "Unphased";
}

/**
 * Groups screens that show identical content.
 *
 * Most slots mirror the same payload across all three screens, and a quiz
 * buzzer round printed out three times over eats most of a page for no gain.
 * Collapsing to "All three screens" keeps the plan readable while still making
 * genuine per-screen splits obvious.
 */
export function groupScreens(slot: PlanSlot): { label: string; content: ContentDef }[] {
  const host = slot.host_content;
  const s1 = slot.screen1_content;
  const s2 = slot.screen2_content;
  const same = (a: ContentDef, b: ContentDef) => JSON.stringify(a) === JSON.stringify(b);

  if (same(host, s1) && same(host, s2)) {
    return [{ label: "All three screens", content: host }];
  }
  if (same(s1, s2)) {
    return [
      { label: SCREEN_LABELS.host, content: host },
      { label: "Both touch screens", content: s1 },
    ];
  }
  return [
    { label: SCREEN_LABELS.host, content: host },
    { label: SCREEN_LABELS.screen1, content: s1 },
    { label: SCREEN_LABELS.screen2, content: s2 },
  ];
}

export function totalMinutes(slots: PlanSlot[]): number {
  return slots.reduce((sum, s) => sum + (Number(s.duration_mins) || 0), 0);
}

// ─────────────────────────────────────────────
// Markdown digest, for pasting into a chat for review
// ─────────────────────────────────────────────

export function buildPlanMarkdown(lesson: PlanLesson, slots: PlanSlot[]): string {
  const notes = lesson.ai_notes ?? null;
  const out: string[] = [];

  out.push(`# ${lesson.title}`);
  out.push("");
  out.push("Bradford College · immersive learning room (Host + 2 touch screens)");
  out.push("");
  if (lesson.description) out.push(lesson.description, "");

  const total = totalMinutes(slots);
  out.push(`- Planned length: ${lesson.estimated_duration_mins} minutes`);
  out.push(
    `- Slots: ${slots.length}, totalling ${total} minutes${total !== lesson.estimated_duration_mins ? "  ⚠ does not match the planned length" : ""}`,
  );
  out.push(
    `- Origin: ${lesson.ai_generated ? `AI draft${lesson.generated_at ? ` generated ${lesson.generated_at.slice(0, 10)}` : ""}, reviewed by a tutor` : "Built by hand"}`,
  );
  out.push(
    `- Feedback form: ${lesson.ms_form_url ? lesson.ms_form_title || lesson.ms_form_url : "none linked"}`,
  );
  out.push("");

  if (notes?.objectives?.length) {
    out.push("## Learning outcomes", "");
    notes.objectives.forEach((o, i) => out.push(`${i + 1}. ${o}`));
    out.push("");
  }

  if (notes?.rationale) {
    out.push("## Why the lesson is shaped this way", "", notes.rationale, "");
  }

  if (notes?.verify_before_teaching?.length) {
    out.push("## Check before teaching", "");
    out.push(
      "Written from general knowledge without access to the scheme of work or site rules. Confirm each against a real source.",
      "",
    );
    notes.verify_before_teaching.forEach((v) => out.push(`- [ ] ${v}`));
    out.push("");
  }

  if (notes?.safety_note) {
    out.push("## Safety note", "", notes.safety_note, "");
  }

  if (notes?.media_requests?.length) {
    out.push("## Media still to source", "");
    notes.media_requests.forEach((m) =>
      out.push(
        `- Slot ${m.slot_index + 1} (${m.screen}${m.kind ? `, ${m.kind}` : ""}): ${m.search_phrase}${m.why ? ` — ${m.why}` : ""}`,
      ),
    );
    out.push("");
  }

  out.push("## Running order", "");

  slots.forEach((slot, i) => {
    const run = notes?.run_sheet?.find((r) => r.slot_index === i);
    out.push(
      `### ${i + 1}. ${slot.name || "Untitled slot"}  ·  ${phaseOf(slot)}  ·  ${slot.duration_mins} min`,
    );
    out.push("");
    out.push(
      `Then ${END_BEHAVIOUR_LABELS[slot.end_behaviour] ?? slot.end_behaviour}.${slot.pause_before_advance ? " Pauses before advancing." : ""}${slot.screen_delay_secs > 0 ? ` Touch screens follow ${slot.screen_delay_secs}s later.` : ""}`,
    );
    out.push("");
    if (run?.teacher_says) out.push(`**Say:** ${run.teacher_says}`, "");
    if (run?.watch_for) out.push(`**Watch for:** ${run.watch_for}`, "");

    groupScreens(slot).forEach((group) => {
      const { label, detail } = describeContent(group.content);
      out.push(`**${group.label}** — ${label}`);
      detail.forEach((d) => out.push(`  - ${d}`));
      out.push("");
    });
  });

  out.push("## Appendix: raw slot payloads", "");
  out.push(
    "Exact JSON as stored, so the content can be checked field by field.",
    "",
    "```json",
    JSON.stringify(
      slots.map((s, i) => ({
        slot: i + 1,
        name: s.name,
        lead_phase: s.lead_phase,
        duration_mins: s.duration_mins,
        end_behaviour: s.end_behaviour,
        pause_before_advance: s.pause_before_advance,
        screen_delay_secs: s.screen_delay_secs,
        host: s.host_content,
        screen1: s.screen1_content,
        screen2: s.screen2_content,
      })),
      null,
      2,
    ),
    "```",
    "",
  );

  return out.join("\n");
}
