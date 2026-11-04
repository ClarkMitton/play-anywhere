// Client side of the lesson agent (/admin/agent). Uploads the teacher's
// resources to lesson-media, talks to the lesson-agent edge function, and
// writes the finished lesson. Validation reuses sessionRepair/sessionSchema,
// so an agent-built lesson meets exactly the rules a generated one does.

import { supabase } from "@/integrations/supabase/client";
import { makeSlot } from "./slotDefaults";
import { deriveEndBehaviour, repairAndValidate, type RepairWarning } from "./sessionRepair";
import { LEVELS, type Brief, type GeneratedSession } from "./sessionSchema";

export type AgentResource = {
  id: string;
  name: string;
  kind: "image" | "audio" | "video" | "document" | "link";
  url?: string;
  description?: string;
  text?: string;
  /** Small copy sent once to be described. Never stored or re-sent after. */
  previewDataUrl?: string;
  status: "uploading" | "ready" | "failed";
  error?: string;
};

/**
 * One line of the conversation. "activity" lines are the page's own record of
 * what happened (pictures read, a build, a failure); they are shown, saved
 * with the chat, and never sent to the model.
 */
export type AgentMessage = {
  role: "user" | "assistant" | "activity";
  content: string;
  /** Resources added with this message, by id. */
  attachments?: string[];
  tone?: "ok" | "error";
  /** This build line owns the draft card shown under it. */
  showsDraft?: boolean;
};

/** Live events while the agent works. */
export type LiveEvent = { type: "delta"; text: string } | { type: "progress"; steps: number } | { type: "retry" };

export type AgentUsage = { prompt_tokens: number; completion_tokens: number; model?: string };
export type AgentToday = { calls: number; prompt_tokens: number; completion_tokens: number };

type AgentReply<T> =
  | ({ ok: true; usage: AgentUsage; today: AgentToday } & T)
  | { ok: false; error: string; issues?: string[] };

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-agent`;
const PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const DROPPED = "The connection dropped before the agent finished. Your chat is saved, so just try again.";
const NO_ANSWER = "The lesson agent did not answer. Your chat is saved, so try again in a moment.";
// The function answers at once and then sends something at least every 5
// seconds, so silence this long means the call is stuck, not slow. Seen in
// testing: an identical call that hung for two minutes answered in three
// seconds when sent again.
const FIRST_ANSWER_MS = 25_000;
const SILENCE_MS = 30_000;

/**
 * Ask for a live reply: text and build progress arrive as they are written,
 * then one result line. A reply that ends without that line was cut off and
 * is a failure, never a partial lesson. If the function deployed is an older
 * one that only sends a single JSON object, that is read instead.
 *
 * A call that goes silent is stopped and sent once more by itself; onEvent
 * hears {type: "retry"} so the page can clear any half-written text.
 */
async function streamAgent<T>(
  body: Record<string, unknown>,
  onEvent?: (event: LiveEvent) => void,
  signal?: AbortSignal,
  attempt = 0,
): Promise<AgentReply<T>> {
  if (signal?.aborted) return { ok: false, error: "Stopped." };
  const controller = new AbortController();
  const stopOnUser = () => controller.abort();
  signal?.addEventListener("abort", stopOnUser);
  let silent = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const watch = (ms: number) => {
    clearTimeout(timer);
    timer = setTimeout(() => { silent = true; controller.abort(); }, ms);
  };
  const outcome = async (): Promise<AgentReply<T> | null> => {
    watch(FIRST_ANSWER_MS);
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { apikey: PUBLIC_KEY, Authorization: `Bearer ${PUBLIC_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, stream: true }),
      signal: controller.signal,
    });
    if (!res.body) return null;
    const live = (res.headers.get("content-type") ?? "").includes("ndjson");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let pending = "";
    let whole = "";
    while (true) {
      watch(SILENCE_MS);
      const { done, value } = await reader.read();
      const text = decoder.decode(value, { stream: !done });
      if (!live) {
        // An older function: one JSON object, with whitespace while it works.
        whole += text;
        if (done) break;
        continue;
      }
      pending += text;
      const lines = pending.split("\n");
      pending = done ? "" : lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        let event: { type?: string; [k: string]: unknown };
        try {
          event = JSON.parse(line);
        } catch {
          continue;
        }
        if (event.type === "result") {
          const { type: _t, ...result } = event;
          return result as AgentReply<T>;
        }
        if (event.type === "delta" || event.type === "progress") onEvent?.(event as LiveEvent);
      }
      if (done) break;
    }
    if (live) return null;
    try {
      const data = JSON.parse(whole.trim());
      if (typeof data?.ok === "boolean") return data as AgentReply<T>;
    } catch {
      // fall through
    }
    return { ok: false, error: `The lesson agent could not answer (error ${res.status}). Try again in a moment.` };
  };

  let reply: AgentReply<T> | null;
  try {
    reply = await outcome();
  } catch {
    reply = null;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", stopOnUser);
  }
  if (reply) return reply;
  if (signal?.aborted) return { ok: false, error: "Stopped." };
  if (silent && attempt === 0) {
    onEvent?.({ type: "retry" });
    return streamAgent<T>(body, onEvent, signal, 1);
  }
  return { ok: false, error: silent ? NO_ANSWER : DROPPED };
}

/** Only the teacher's and the agent's words go to the model, with a note of what was attached. */
function forModel(messages: AgentMessage[], resources: AgentResource[]) {
  const names = new Map(resources.map((r) => [r.id, r.name]));
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      const attached = (m.attachments ?? []).map((id) => names.get(id)).filter(Boolean);
      return {
        role: m.role,
        content: attached.length ? `${m.content}\n\n[Added with this message: ${attached.join(", ")}]` : m.content,
      };
    });
}

/** What the server needs to know about each resource. Pictures go as descriptions, not pixels. */
function forServer(resources: AgentResource[]) {
  return resources
    .filter((r) => r.status === "ready")
    .map(({ id, name, kind, url, description, text }) => ({ id, name, kind, url, description, text }));
}

export function describeImages(
  images: { id: string; name: string; dataUrl: string }[],
  onEvent?: (event: LiveEvent) => void,
  signal?: AbortSignal,
) {
  return streamAgent<{ items: { id: string; description?: string; text_on_image?: string; role?: string }[] }>(
    { mode: "describe", images },
    onEvent,
    signal,
  );
}

export function chatWithAgent(
  messages: AgentMessage[],
  resources: AgentResource[],
  current: unknown,
  onEvent?: (event: LiveEvent) => void,
  signal?: AbortSignal,
) {
  return streamAgent<{ reply: string }>(
    { mode: "chat", messages: forModel(messages, resources), resources: forServer(resources), current },
    onEvent,
    signal,
  );
}

export function buildWithAgent(
  messages: AgentMessage[],
  resources: AgentResource[],
  current: unknown,
  fixIssues: string[] = [],
  onEvent?: (event: LiveEvent) => void,
  signal?: AbortSignal,
) {
  return streamAgent<{ data: unknown }>(
    {
      mode: "build",
      messages: forModel(messages, resources),
      resources: forServer(resources),
      current,
      fix_issues: fixIssues,
    },
    onEvent,
    signal,
  );
}

// ─── Files ──────────────────────────────────────────────────

const IMAGE_MAX = 1920;
const PREVIEW_MAX = 1024;

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // The decoded image keeps its pixels; the object url is no longer needed.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function drawScaled(img: HTMLImageElement, max: number): HTMLCanvasElement {
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(img.naturalWidth * k));
  c.height = Math.max(1, Math.round(img.naturalHeight * k));
  const ctx = c.getContext("2d")!;
  // White under transparent PNGs, or they turn black as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/** Big screen sized JPEG for storage, plus a small one for the describe step. */
export async function prepareImage(file: File): Promise<{ blob: Blob; previewDataUrl: string }> {
  const img = await loadImage(file);
  const blob = await new Promise<Blob>((resolve, reject) =>
    drawScaled(img, IMAGE_MAX).toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read the picture"))), "image/jpeg", 0.88),
  );
  const previewDataUrl = drawScaled(img, PREVIEW_MAX).toDataURL("image/jpeg", 0.7);
  return { blob, previewDataUrl };
}

/** The small copy for the describe step, remade from storage (it is not kept with saved chats). */
export async function previewFromUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  const blob = await fetch(url, { signal: controller.signal }).then((r) => r.blob()).finally(() => clearTimeout(timer));
  return (await prepareImage(new File([blob], "picture", { type: blob.type || "image/jpeg" }))).previewDataUrl;
}

export function newFolder(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `lessons/agent-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function uploadToLessonMedia(folder: string, name: string, body: Blob, contentType: string): Promise<string> {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now().toString(36)}_${safe}`;
  // A stuck connection must not leave the file "uploading" for ever and block sending.
  const { error } = await Promise.race([
    supabase.storage.from("lesson-media").upload(path, body, { contentType }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("the upload took too long; remove it and add it again")), 90_000)),
  ]);
  if (error) throw new Error(error.message);
  return supabase.storage.from("lesson-media").getPublicUrl(path).data.publicUrl;
}

// ─── Validate and save ──────────────────────────────────────

export type AgentDraft = {
  session: GeneratedSession;
  ambientUrl: string | null;
  level: string;
  warnings: RepairWarning[];
};

const PHASES = ["Launch", "Establish", "Apply", "Demonstrate"];
const SINGLE_QUESTION = ["multiple_choice", "true_or_false"];

/**
 * Put right the rule breaks that have one obvious fix, so a good lesson is
 * not thrown away (and a minute of building repeated) over a detail. Each
 * fix is reported, so the teacher sees what changed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fixRoomRules(d: any): RepairWarning[] {
  const warnings: RepairWarning[] = [];
  const slots: Record<string, unknown>[] = d.slots.filter((s: unknown) => s && typeof s === "object");
  const contents = (s: Record<string, unknown>) =>
    (["host", "screen1", "screen2"] as const).map((k) => s[k]).filter((c): c is Record<string, unknown> => !!c && typeof c === "object");

  // A "final" confidence check needs an earlier "start" one to compare with.
  let sawStart = false;
  slots.forEach((s, i) => {
    let changed = false;
    for (const c of contents(s)) {
      if (c.type !== "confidence_checker") continue;
      if (c.checkpoint === "start") sawStart = true;
      else if (c.checkpoint === "final" && !sawStart) {
        delete c.checkpoint;
        changed = true;
      }
    }
    if (changed) warnings.push({ slotIndex: i, message: "the closing confidence check has no opening one to compare with, so it asks on its own" });
  });

  // LEAD phases only move forward.
  let highest = 0;
  slots.forEach((s, i) => {
    const rank = PHASES.indexOf(String(s.lead_phase));
    if (rank < 0) {
      s.lead_phase = PHASES[highest];
    } else if (rank < highest) {
      warnings.push({ slotIndex: i, message: `moved from ${s.lead_phase} to ${PHASES[highest]} so the phases run in order` });
      s.lead_phase = PHASES[highest];
    } else {
      highest = rank;
    }
  });

  slots.forEach((s, i) => {
    // The big-screen-only timer shows nothing on a touch screen.
    for (const k of ["screen1", "screen2"]) {
      const c = s[k] as Record<string, unknown> | undefined;
      if (c?.type === "host_timer") s[k] = { ...c, type: "countdown_timer" };
    }
    // A single question belongs on the right-hand screen only; when the
    // left-hand one has it too, make it a round everyone answers.
    const left = s.screen1 as Record<string, unknown> | undefined;
    if (left && SINGLE_QUESTION.includes(String(left.type))) {
      const { type, text, options, correct, correct_tf } = left;
      const round = { type: "question_round", questions: [{ type, text, options, correct, correct_tf }] };
      s.host = round;
      s.screen1 = round;
      s.screen2 = round;
      warnings.push({ slotIndex: i, message: "made the single question a round both touch screens answer" });
    }
  });
  return warnings;
}

/** Repair and validate the agent's JSON with the same rules the generator uses. */
export function validateAgentBuild(raw: unknown): { ok: true; draft: AgentDraft } | { ok: false; issues: string[] } {
  // Untrusted model output, so loose types on purpose.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = raw as any;
  if (!d || typeof d !== "object" || !Array.isArray(d.slots)) {
    return { ok: false, issues: ["the build had no steps"] };
  }
  const roomFixes = fixRoomRules(d);
  for (const s of d.slots) {
    if (s && typeof s === "object") {
      if (typeof s.recipe !== "string" || !s.recipe) s.recipe = "AGENT";
      if (!Array.isArray(s.alternatives)) s.alternatives = [];
      s.duration_mins = Math.min(60, Math.max(1, Math.round(Number(s.duration_mins) || 2)));
    }
  }
  const level = (LEVELS as readonly string[]).includes(d?.lesson?.level) ? d.lesson.level : "Other";
  const total = d.slots.reduce((n: number, s: { duration_mins?: number }) => n + (s?.duration_mins ?? 0), 0);
  d.lesson = { ...d.lesson, estimated_duration_mins: Math.max(1, total) };
  const brief = {
    topic: String(d?.lesson?.title ?? "Lesson"),
    level,
    department: "Adult Skills",
    vocationalContext: "",
    durationMins: Math.max(1, total),
    groupSize: 16,
    threeScreens: true,
    shape: "balanced",
    imageSource: "none",
    includeConfidenceArc: false,
    objectives: [],
    notes: "",
    msFormUrl: "",
    documents: [],
  } as Brief;
  // The agent works from the teacher's own links, so their embeds are kept.
  const result = repairAndValidate(d, brief, { keepEmbeds: true });
  if (!result.ok) return { ok: false, issues: result.issues };
  const ambient = typeof d.ambient_url === "string" && d.ambient_url.includes("/lesson-media/") ? d.ambient_url : null;
  return { ok: true, draft: { session: result.session, ambientUrl: ambient, level, warnings: [...roomFixes, ...result.warnings] } };
}

export async function saveAgentLesson(draft: AgentDraft): Promise<string> {
  const { session } = draft;
  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({
      title: session.lesson.title,
      description: session.lesson.description,
      estimated_duration_mins: session.lesson.estimated_duration_mins,
      featured: false,
      slots: [],
      resource_bucket: [],
      ai_generated: true,
      generated_at: new Date().toISOString(),
      ai_notes: {
        ...session.teaching_notes,
        media_requests: session.media_requests,
        ...(draft.ambientUrl ? { ambient_url: draft.ambientUrl } : {}),
        built_by: "lesson-agent",
        brief: { topic: session.lesson.title, level: draft.level, three_screens: true },
      },
    } as never)
    .select("id")
    .single();
  if (error || !lesson) throw new Error(error?.message ?? "Could not create the lesson.");

  const rows = session.slots.map((slot, index) => ({
    ...makeSlot(lesson.id, index),
    name: slot.name,
    lead_phase: slot.lead_phase,
    duration_mins: slot.duration_mins,
    end_behaviour: deriveEndBehaviour(slot),
    host_content: slot.host,
    screen1_content: slot.screen1,
    screen2_content: slot.screen2,
  }));
  const { error: slotsError } = await supabase.from("slots").insert(rows as never);
  if (slotsError) {
    await supabase.from("lessons").delete().eq("id", lesson.id);
    throw new Error(`Could not create the steps: ${slotsError.message}`);
  }
  return lesson.id;
}

/** An existing lesson, in the shape the agent reads, for "change this lesson". */
export async function loadLessonForAgent(lessonId: string) {
  const [{ data: lesson }, { data: slots }] = await Promise.all([
    supabase.from("lessons").select("title, description, ai_notes").eq("id", lessonId).single(),
    supabase
      .from("slots")
      .select("order_index, name, lead_phase, duration_mins, host_content, screen1_content, screen2_content")
      .eq("lesson_id", lessonId)
      .is("session_id", null)
      .order("order_index"),
  ]);
  if (!lesson) return null;
  const notes = (lesson as { ai_notes?: Record<string, unknown> | null }).ai_notes ?? null;
  return {
    title: (lesson as { title: string }).title,
    description: (lesson as { description: string | null }).description,
    ambient_url: notes && typeof notes.ambient_url === "string" ? notes.ambient_url : null,
    slots: (slots ?? []).map((s) => ({
      name: s.name,
      lead_phase: s.lead_phase,
      duration_mins: s.duration_mins,
      host: s.host_content,
      screen1: s.screen1_content,
      screen2: s.screen2_content,
    })),
  };
}

/** Rough cost so the page can show one; prices are per million tokens and set in one place. */
export const PRICE_PER_MILLION = { input: 0.75, output: 3.75 };
export function estimateUsd(u: { prompt_tokens: number; completion_tokens: number }): number {
  return (u.prompt_tokens * PRICE_PER_MILLION.input + u.completion_tokens * PRICE_PER_MILLION.output) / 1_000_000;
}
