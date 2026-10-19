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

export type AgentMessage = { role: "user" | "assistant"; content: string };

export type AgentUsage = { prompt_tokens: number; completion_tokens: number; model?: string };
export type AgentToday = { calls: number; prompt_tokens: number; completion_tokens: number };

type AgentReply<T> =
  | ({ ok: true; usage: AgentUsage; today: AgentToday } & T)
  | { ok: false; error: string; issues?: string[] };

async function callAgent<T>(body: Record<string, unknown>): Promise<AgentReply<T>> {
  try {
  const { data, error } = await supabase.functions.invoke("lesson-agent", { body });
  if (error) {
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const b = await context.json();
        if (b?.error) return b;
      } catch {
        // fall through
      }
    }
    return { ok: false, error: "The lesson builder connection stopped before the reply was complete. Your chat is still saved; try Build again." };
  }
  if (!data || typeof data !== "object" || typeof data.ok !== "boolean") {
    return { ok: false, error: "The lesson builder returned an incomplete reply. Your chat is still saved; try Build again." };
  }
  return data as AgentReply<T>;
  } catch {
    return { ok: false, error: "The lesson builder connection stopped before the reply was complete. Your chat is still saved; try Build again." };
  }
}

/** What the server needs to know about each resource. Pictures go as descriptions, not pixels. */
function forServer(resources: AgentResource[]) {
  return resources
    .filter((r) => r.status === "ready")
    .map(({ id, name, kind, url, description, text }) => ({ id, name, kind, url, description, text }));
}

export function describeImages(images: { id: string; name: string; dataUrl: string }[]) {
  return callAgent<{ items: { id: string; description?: string; text_on_image?: string; role?: string }[] }>({
    mode: "describe",
    images,
  });
}

export function chatWithAgent(messages: AgentMessage[], resources: AgentResource[], current: unknown) {
  return callAgent<{ reply: string }>({ mode: "chat", messages, resources: forServer(resources), current });
}

export function buildWithAgent(
  messages: AgentMessage[],
  resources: AgentResource[],
  current: unknown,
  fixIssues: string[] = [],
) {
  return callAgent<{ data: unknown }>({
    mode: "build",
    messages,
    resources: forServer(resources),
    current,
    fix_issues: fixIssues,
  });
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

export function newFolder(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `lessons/agent-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function uploadToLessonMedia(folder: string, name: string, body: Blob, contentType: string): Promise<string> {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now().toString(36)}_${safe}`;
  const { error } = await supabase.storage.from("lesson-media").upload(path, body, { contentType });
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

/** Repair and validate the agent's JSON with the same rules the generator uses. */
export function validateAgentBuild(raw: unknown): { ok: true; draft: AgentDraft } | { ok: false; issues: string[] } {
  // Untrusted model output, so loose types on purpose.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = raw as any;
  if (!d || typeof d !== "object" || !Array.isArray(d.slots)) {
    return { ok: false, issues: ["the build had no steps"] };
  }
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
  return { ok: true, draft: { session: result.session, ambientUrl: ambient, level, warnings: result.warnings } };
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
