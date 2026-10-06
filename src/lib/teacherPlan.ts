// ─────────────────────────────────────────────────────────────
// TUTOR LESSON PLAN
//
// planExport.ts describes a lesson for the people who build it: tool names,
// screen jargon, raw payloads. This file describes the same lesson for the
// tutor who has to stand up and run it. For every step it answers: what is on
// each screen, what do learners do, and what do I press.
//
// It shows the real content wherever it can (slide text, the picture, every
// question with its answer). An embedded website is the one thing it cannot
// see inside, so it prints the description the lesson's author wrote instead.
//
// Covers all 17 content types, mirroring describeContent(). If a new type is
// added there, add it here too or it degrades to a generic line.
// ─────────────────────────────────────────────────────────────

import type { ContentDef } from "@/types/slot";
import { groupScreens, type PlanSlot } from "@/lib/planExport";
import { extractEmbedUrl, extractYouTubeId } from "@/lib/sessionSchema";

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

/** One question as the tutor needs to see it: every option, with the right one marked. */
export type TeacherQuestion = { text: string; options: { label: string; correct: boolean }[] };

/** The thing actually on the screen, so the plan can show it rather than describe it. */
export type TeacherPreview =
  | { kind: "slide"; text: string; subtitle: string }
  | { kind: "image"; url: string; caption: string }
  | { kind: "video"; videoId: string; url: string; clip: string }
  | { kind: "link"; url: string; provider: string; description: string };

export type TeacherBlock = {
  /** Short plain-English name for the activity, e.g. "Class vote". */
  title: string;
  /** One or two sentences on what the screens show. */
  summary: string;
  /** Prompts, wheel contents and other short lines. */
  items: string[];
  preview?: TeacherPreview;
  questions?: TeacherQuestion[];
  /** What the tutor does, using the wording of the buttons on screen. */
  doing: string[];
  /** True when this is only a holding screen, so it can be left out. */
  holding?: boolean;
};

const PROVIDERS: [RegExp, string][] = [
  [/(^|\.)canva\.com$/, "Canva"],
  [/(^|\.)wordwall\.net$/, "Wordwall"],
  [/(^|\.)edpuzzle\.com$/, "Edpuzzle"],
  [/(^|\.)padlet\.com$/, "Padlet"],
  [/(^|\.)genial\.ly$|(^|\.)genially\.com$/, "Genially"],
  [/(^|\.)kahoot\.(it|com)$/, "Kahoot"],
  [/(^|\.)quizizz\.com$|(^|\.)wayground\.com$/, "Quizizz"],
  [/(^|\.)blooket\.com$/, "Blooket"],
  [/(^|\.)jigsawplanet\.com$/, "Jigsaw Planet"],
  [/(^|\.)webwordsearch\.com$/, "Word search"],
  [/(^|\.)nearpod\.com$/, "Nearpod"],
  [/(^|\.)mentimeter\.com$|(^|\.)menti\.com$/, "Mentimeter"],
  [/forms\.(office|microsoft)\.com$|forms\.cloud\.microsoft$/, "Microsoft Forms"],
  [/(^|\.)sharepoint\.com$|officeapps\.live\.com$|onedrive\.live\.com$/, "Microsoft 365"],
  [/docs\.google\.com$/, "Google Docs"],
  [/(^|\.)youtube\.com$|^youtu\.be$/, "YouTube"],
  [/(^|\.)vimeo\.com$/, "Vimeo"],
];

/** "Canva", "Wordwall"… or the bare site name when it is not one we know. */
export function embedProvider(url: string): string {
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    return PROVIDERS.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

function clock(secs: number): string {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

/** "Plays the first 7:40 only, then stops." for a link that carries start or end times. */
function clipNote(url: string): string {
  try {
    const q = new URL(url).searchParams;
    const n = (v: string | null) => {
      const x = v ? parseInt(v, 10) : NaN;
      return Number.isFinite(x) && x > 0 ? x : 0;
    };
    const start = n(q.get("start") ?? q.get("t"));
    const end = n(q.get("end"));
    if (start && end) return `Plays from ${clock(start)} to ${clock(end)}, then stops.`;
    if (end) return `Plays the first ${clock(end)} only, then stops.`;
    if (start) return `Starts at ${clock(start)}.`;
    return "";
  } catch {
    return "";
  }
}

function toQuestion(q: Record<string, unknown>): TeacherQuestion {
  if (q.type === "true_or_false") {
    return {
      text: str(q.text),
      options: [
        { label: "True", correct: q.correct_tf === true },
        { label: "False", correct: q.correct_tf === false },
      ],
    };
  }
  const correct = Number(q.correct);
  return {
    text: str(q.text),
    options: arr(q.options).map((label, i) => ({ label, correct: i === correct })),
  };
}

const ONE_AT_A_TIME = [
  "Learners come to a touch screen one at a time.",
  "After each person, tap Next Person.",
  "When the last person has answered, tap That's Everyone.",
];

export function describeForTeacher(content: ContentDef | null | undefined): TeacherBlock {
  if (!content || !content.type) {
    return { title: "Nothing yet", summary: "", items: [], doing: [], holding: true };
  }
  const c = content as Record<string, unknown>;

  switch (content.type) {
    case "waiting":
      return {
        title: "Holding screen",
        summary: "A calm screen while you talk.",
        items: [],
        doing: [],
        holding: true,
      };

    case "text_slide":
      return {
        title: "Slide",
        summary: "",
        items: [],
        preview: {
          kind: "slide",
          text: [str(c.title), str(c.text)].filter(Boolean).join("\n"),
          subtitle: str(c.subtitle),
        },
        doing: ["Read it with the class and talk it through."],
      };

    case "image":
      return {
        title: "Picture slide",
        summary: "",
        items: [],
        preview: { kind: "image", url: str(c.url), caption: str(c.title) },
        doing: ["Talk through the picture with the class."],
      };

    case "video":
      return {
        title: "Video",
        summary:
          c.loop === false
            ? "An uploaded video. It plays once."
            : "An uploaded video. It plays on a loop until you move on.",
        items: [str(c.file_name)].filter(Boolean),
        doing: ["The video starts by itself. Sound plays on the big screen only."],
      };

    case "youtube": {
      const url = str(c.url);
      const clip = clipNote(url);
      return {
        title: "Video",
        summary: "",
        items: [],
        preview: { kind: "video", videoId: extractYouTubeId(url) ?? "", url, clip },
        doing: [
          "The video starts by itself on the big screen. Check the sound is on.",
          clip.includes("stops")
            ? "It stops by itself at the end of the clip."
            : "Move on when it finishes.",
        ],
      };
    }

    case "embed": {
      const url = extractEmbedUrl(str(c.url));
      const provider = embedProvider(url);
      return {
        title: `${provider} page`,
        summary: "",
        items: [],
        preview: { kind: "link", url, provider, description: str(c.description) },
        doing: ["Open the link before the lesson to check it loads."],
      };
    }

    case "confidence_checker": {
      const scale =
        c.scale_mode === "emoji"
          ? "a face"
          : c.scale_mode === "likert"
            ? "an answer from agree to disagree"
            : `a number from 1 to ${Number(c.max) || 5}`;
      return {
        title: c.checkpoint === "final" ? "Confidence check (end)" : "Confidence check",
        summary:
          c.checkpoint === "final"
            ? "The big screen compares how the class felt at the start with how they feel now."
            : "The big screen shows the class average as answers come in. There is no right answer.",
        items: [str(c.prompt)].filter(Boolean),
        doing: [`Each learner taps ${scale}.`, ...ONE_AT_A_TIME],
      };
    }

    case "voting":
      return {
        title: "Class vote",
        summary: "The big screen shows the votes as they come in. There is no right answer.",
        items: [],
        questions: [
          {
            text: str(c.question),
            options: arr(c.options).map((label) => ({ label, correct: false })),
          },
        ],
        doing: ["Each learner taps their choice.", ...ONE_AT_A_TIME],
      };

    case "quiz_buzzer": {
      const questions = arr(c.questions).length
        ? arr(c.questions)
        : [str(c.question)].filter(Boolean);
      const answers = arr(c.answers);
      const t1 = str(c.team1_name) || "Team 1";
      const t2 = str(c.team2_name) || "Team 2";
      return {
        title: "Team buzzer quiz",
        summary: `${t1} use Touch Screen 1 and ${t2} use Touch Screen 2. Answers are never shown to learners.`,
        items: [],
        questions: questions.map((text, i) => ({
          text,
          options: answers[i] ? [{ label: answers[i], correct: true }] : [],
        })),
        doing: [
          "Read the question out. The first team to press BUZZ answers and the other team is locked out.",
          "Right answer: give points with +1 or +5 on the big screen.",
          "Wrong answer: reset the buzzers so the other team can try.",
          "Then go to the next question.",
        ],
      };
    }

    case "wheel_spinner": {
      const items = arr(c.items);
      return {
        title: "Wheel spinner",
        summary: str(c.prompt),
        items: items.length ? [`On the wheel: ${items.join(", ")}`] : [],
        doing: ["Press Spin! The wheel picks one at random."],
      };
    }

    case "countdown_timer":
      return {
        title: "Timer",
        summary: `${duration(c.duration_secs)} on the clock, shown on every screen.`,
        items: [str(c.label)].filter(Boolean),
        doing: ["Start the timer on the big screen. You can pause or reset it."],
      };

    case "host_timer":
      return {
        title: "Timer (big screen only)",
        summary: `${duration(c.duration_secs)} on the clock.`,
        items: [str(c.label)].filter(Boolean),
        doing: ["Start the timer on the big screen. You can pause or reset it."],
      };

    case "multiple_choice":
    case "true_or_false":
      return {
        title: "Question",
        summary: "The big screen counts the answers as they come in.",
        items: [],
        questions: [toQuestion(c)],
        doing: [
          "Read the question out. Learners answer on Touch Screen 2.",
          "Press Reveal Results to show the right answer.",
        ],
      };

    case "question_round": {
      const questions = Array.isArray(c.questions)
        ? (c.questions as Record<string, unknown>[]).map(toQuestion)
        : [];
      return {
        title: `Question round (${questions.length} question${questions.length === 1 ? "" : "s"})`,
        summary: "One question at a time, at your pace. The big screen counts the answers.",
        items: [],
        questions,
        doing: [
          "Read the question out. Learners answer on either touch screen.",
          "Press Reveal Results to show the right answer.",
          "Press Next Question for the next one.",
        ],
      };
    }

    case "word_cloud":
      return {
        title: "Word cloud",
        summary:
          "Words gather into a cloud on the big screen as they are sent. The word sent most often is biggest. Every word is shown in small letters.",
        items: [str(c.prompt)].filter(Boolean),
        doing: [
          "Learners type a word on a touch screen and press Send. They can send as many as they like.",
          "Talk about the biggest words.",
        ],
      };

    case "padlet":
      return {
        title: "Shared board",
        summary: "Each answer appears on the big screen as a note, exactly as it was typed.",
        items: [str(c.question)].filter(Boolean),
        doing: [
          "Learners type an answer on a touch screen and press Post.",
          "Pick out a few to talk about.",
        ],
      };

    case "rotation_timer":
      return {
        title: "Rotating stations",
        summary: `${Number(c.rounds ?? 4)} rounds of ${duration(c.round_secs)}, with ${duration(c.move_secs ?? 15)} to move between stations. The timer is on every screen.`,
        items: str(c.details) ? str(c.details).split("\n").filter(Boolean) : [],
        doing: ["Groups work at a station. A chime and a ROTATE screen tell them when to move on."],
      };

    case "hazard_hotspots": {
      const spots = (Array.isArray(c.hotspots) ? c.hotspots : [])
        .map((h) => str((h as { label?: unknown }).label))
        .filter(Boolean);
      return {
        title: "Spot the hazard",
        summary: "",
        items: spots.length ? [`Hazards to find: ${spots.join(", ")}`] : [],
        preview: str(c.url) ? { kind: "image", url: str(c.url), caption: str(c.title) } : undefined,
        doing: ["Learners tap the hazards they can see in the picture."],
      };
    }

    case "whiteboard":
      return {
        title: "Whiteboard",
        summary: "Each touch screen has its own drawing board.",
        items: [str(c.title)].filter(Boolean),
        preview: str(c.image_url)
          ? {
              kind: "image",
              url: str(c.image_url),
              caption: "Learners draw on top of this picture",
            }
          : undefined,
        doing: [
          "Learners draw or write on a touch screen. Clear wipes the board.",
          "They press Send to big screen to show their drawing, labelled Screen 1 or Screen 2.",
        ],
      };

    default:
      return { title: "Activity", summary: "", items: [], doing: [] };
  }
}

/** Which screens, in words a tutor uses. */
export function teacherScreenGroups(slot: PlanSlot): { where: string; block: TeacherBlock }[] {
  const groups = groupScreens(slot).map((g) => {
    const where =
      g.label === "All three screens"
        ? "On every screen"
        : g.label.startsWith("Host")
          ? "Big screen"
          : g.label === "Both touch screens"
            ? "Both touch screens"
            : g.label;
    return { where, block: describeForTeacher(g.content) };
  });
  // A holding screen next to real content is noise. Keep it only if it is all there is.
  const real = groups.filter((g) => !g.block.holding);
  return real.length > 0 ? real : groups.slice(0, 1);
}

export function endingForTeacher(slot: PlanSlot): string {
  switch (slot.end_behaviour) {
    case "timed":
      return `The lesson moves on by itself after ${slot.duration_mins} min.`;
    case "screen2_submit":
      return "The lesson moves on once the answers are in.";
    case "screen1_continue":
      return "The lesson waits for you. Move on when you are ready.";
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

/**
 * Things to sort out before the class arrives, worked out from what the lesson
 * actually contains. Embeds with no description are listed by step so the
 * author can see exactly which ones still need writing up.
 */
export function beforeYouStart(slots: PlanSlot[]): string[] {
  const contents = slots.flatMap((s) => [s.host_content, s.screen1_content, s.screen2_content]);
  const has = (type: string) => contents.some((c) => c?.type === type);
  const out: string[] = [];

  if (has("youtube")) out.push("Check the sound works on the big screen. This lesson has video.");
  if (has("embed")) {
    out.push(
      "Open each web link once to check it loads and that you are signed in if it needs it.",
    );
  }
  if (has("image") || has("hazard_hotspots")) {
    out.push("Flick through the picture slides to check every picture appears.");
  }
  if (has("quiz_buzzer")) out.push("Decide the two teams for the buzzer quiz.");
  if (has("rotation_timer")) out.push("Set out the stations for the rotating activity.");

  const undescribed = slots
    .map((s, i) => ({ s, i }))
    .filter(({ s }) =>
      [s.host_content, s.screen1_content, s.screen2_content].some(
        (c) => c?.type === "embed" && !str((c as Record<string, unknown>).description),
      ),
    )
    .map(({ i }) => i + 1);
  if (undescribed.length > 0) {
    out.push(
      `Step${undescribed.length === 1 ? "" : "s"} ${undescribed.join(", ")}: the web page has no description yet, so this plan only shows its first screen. Open the link to see the rest.`,
    );
  }
  return out;
}
