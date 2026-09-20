// ─────────────────────────────────────────────────────────────
// generate-session
//
// Takes a lesson brief (and any document text the browser already extracted),
// asks the Lovable AI Gateway for a three-screen session, and returns the raw
// JSON. It deliberately does NOT write to the database: the client validates
// with src/lib/sessionSchema.ts, repairs with src/lib/sessionRepair.ts, shows
// the tutor a review screen, and only then writes.
//
// Full zod validation is NOT duplicated here. Keeping a second copy of a
// 300-line schema in Deno would drift from the canonical one within a release.
// Instead this does a shallow structural check, which is all it needs to decide
// whether to retry, plus the YouTube existence check, which can only happen
// server-side.
// ─────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, preflight, json } from "../_shared/cors.ts";
import {
  getClientIp,
  isAllowedOrigin,
  isOverDailyCap,
  isRateLimited,
  recordUsage,
} from "../_shared/rateLimit.ts";
import { blueprintFor, buildSystemPrompt, buildUserPrompt, type Brief } from "./prompt.ts";
import type { BlueprintSlot } from "./blueprint.ts";

// Generous because gemini-2.5-flash has a very large context window and a whole
// staff PowerPoint plus speaker notes routinely runs past 50k characters. The
// previous 20k cut a normal deck roughly in half, silently and mid-sentence.
// Whenever these do bite, the caller is told which document was shortened.
const MAX_DOC_CHARS = 120_000;
const MAX_TOTAL_INPUT_CHARS = 300_000;
const MODEL = "google/gemini-2.5-flash";

const LEGAL_TYPES = new Set([
  "waiting",
  "text_slide",
  "image",
  "youtube",
  "embed",
  "confidence_checker",
  "voting",
  "quiz_buzzer",
  "wheel_spinner",
  "countdown_timer",
  "host_timer",
  "multiple_choice",
  "true_or_false",
  "question_round",
  "word_cloud",
  "whiteboard",
]);

// ─── JSON recovery ──────────────────────────────────────────
// Models wrap JSON in fences, leak raw control characters inside strings, and
// occasionally leave an unescaped quote. Try progressively harder to parse
// rather than failing a whole generation over punctuation.

function stripFences(text: string): string {
  return text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

function sanitiseControlChars(text: string): string {
  let out = "";
  let inString = false;
  let escaped = false;
  for (const ch of text) {
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') inString = !inString;
    if (inString && ch === "\n") { out += "\\n"; continue; }
    if (inString && ch === "\r") { continue; }
    if (inString && ch === "\t") { out += "\\t"; continue; }
    out += ch;
  }
  return out;
}

/** Last resort: slice from the first { to the last }, dropping any prose. */
function outermostObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

function parseLoosely(text: string): unknown | null {
  const attempts = [
    text,
    stripFences(text),
    sanitiseControlChars(stripFences(text)),
    outermostObject(sanitiseControlChars(stripFences(text))),
  ];
  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // try the next, harder repair
    }
  }
  return null;
}

// ─── Blueprint enforcement ──────────────────────────────────
// The skeleton is decided in code, so the model's phase, recipe and duration
// are overwritten by index rather than trusted. This is what stops the balance
// drifting: whatever the model returns, the shape is the one we asked for.
// deno-lint-ignore no-explicit-any
function enforceBlueprint(data: any, blueprint: BlueprintSlot[]): void {
  if (!Array.isArray(data?.slots)) return;
  data.slots.forEach((slot: Record<string, unknown>, i: number) => {
    const planned = blueprint[i];
    if (!planned || !slot || typeof slot !== "object") return;
    slot.lead_phase = planned.phase;
    slot.duration_mins = planned.minutes;
    // "ACTIVITY" is a placeholder the model fills, so keep its choice there and
    // only fall back if it returned nothing usable.
    if (planned.recipe === "ACTIVITY") {
      if (typeof slot.recipe !== "string" || !slot.recipe.trim() || slot.recipe === "ACTIVITY") {
        slot.recipe = planned.choices?.[0] ?? "QUESTION_CAROUSEL";
      }
    } else {
      slot.recipe = planned.recipe;
    }
  });
  // Anything past the blueprint was not asked for.
  if (data.slots.length > blueprint.length) data.slots.length = blueprint.length;
}

// ─── Shallow shape check, enough to decide on a retry ───────
function shapeIssues(data: unknown, expectedSlots: number): string[] {
  const issues: string[] = [];
  // deno-lint-ignore no-explicit-any
  const d = data as any;
  if (!d || typeof d !== "object") return ["response was not a JSON object"];
  if (!d.lesson?.title) issues.push("lesson.title is missing");
  if (!Array.isArray(d.slots)) return [...issues, "slots is not an array"];
  if (d.slots.length !== expectedSlots) {
    issues.push(
      `${d.slots.length} slots were returned but the running order has exactly ${expectedSlots}; return one slot per line of the running order, in the same order`,
    );
  }

  d.slots.forEach((slot: Record<string, unknown>, i: number) => {
    for (const screen of ["host", "screen1", "screen2"]) {
      const content = slot?.[screen] as { type?: string } | undefined;
      if (!content || typeof content !== "object") {
        issues.push(`slots[${i}].${screen} is missing`);
        continue;
      }
      if (!content.type || !LEGAL_TYPES.has(content.type)) {
        issues.push(
          `slots[${i}].${screen}.type "${content.type}" is not one of the legal content types`,
        );
      }
    }
    if (!slot?.recipe) issues.push(`slots[${i}].recipe is missing`);
  });
  return issues;
}

// ─── YouTube existence check ────────────────────────────────
// A syntactically valid video id can still be invented. oEmbed 404s for videos
// that do not exist, so anything unresolvable gets its url blanked and the
// client turns it into a described placeholder.

function youTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    return null;
  } catch {
    return null;
  }
}

async function videoExists(url: string): Promise<boolean> {
  const id = youTubeId(url);
  if (!id) return false;
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { method: "GET" },
    );
    return res.ok;
  } catch {
    return false; // network trouble: fail safe to a placeholder
  }
}

// deno-lint-ignore no-explicit-any
async function validateVideos(data: any): Promise<number> {
  if (!Array.isArray(data?.slots)) return 0;
  let dropped = 0;
  const checked = new Map<string, boolean>();

  for (const slot of data.slots) {
    for (const screen of ["host", "screen1", "screen2"]) {
      const content = slot?.[screen];
      if (!content || content.type !== "youtube" || typeof content.url !== "string") continue;
      if (!checked.has(content.url)) {
        checked.set(content.url, await videoExists(content.url));
      }
      if (!checked.get(content.url)) {
        content.url = ""; // client repair converts this into a placeholder
        dropped++;
      }
    }
  }
  return dropped;
}

// ─── Model call ─────────────────────────────────────────────

async function callModel(
  apiKey: string,
  system: string,
  user: string,
  temperature: number,
): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`AI gateway returned ${res.status}: ${detail.slice(0, 500)}`);
  }

  const payload = await res.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI gateway returned an empty completion");
  }
  return content;
}

/**
 * Cuts to a sensible boundary rather than mid-word. Prefers a slide break so
 * the model never sees half a slide, then a paragraph break, then a hard cut.
 */
function truncateAtBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const lastSlide = head.lastIndexOf("\n--- Slide ");
  if (lastSlide > max * 0.5) return head.slice(0, lastSlide);
  const lastPara = head.lastIndexOf("\n\n");
  if (lastPara > max * 0.5) return head.slice(0, lastPara);
  return head;
}

export type TruncatedDoc = { name: string; originalChars: number; usedChars: number };

function normaliseBrief(
  body: Record<string, unknown>,
  truncated: TruncatedDoc[],
): Brief {
  const docs = Array.isArray(body.documents) ? body.documents : [];
  return {
    topic: String(body.topic ?? "").slice(0, 2000),
    level: String(body.level ?? "Level 1"),
    department: String(body.department ?? "Adult Skills"),
    vocationalContext: String(body.vocationalContext ?? "").slice(0, 500),
    durationMins: Math.min(180, Math.max(15, Number(body.durationMins) || 60)),
    groupSize: Math.min(60, Math.max(1, Number(body.groupSize) || 12)),
    threeScreens: body.threeScreens !== false,
    shape: (["quiz-heavy", "discussion-heavy", "balanced"].includes(String(body.shape))
      ? String(body.shape)
      : "balanced") as Brief["shape"],
    includeConfidenceArc: body.includeConfidenceArc !== false,
    objectives: Array.isArray(body.objectives)
      ? body.objectives.map((o) => String(o)).filter((o) => o.trim()).slice(0, 4)
      : [],
    notes: String(body.notes ?? "").slice(0, 4000),
    documents: docs
      .slice(0, 3)
      // deno-lint-ignore no-explicit-any
      .map((d: any) => {
        const name = String(d?.name ?? "document");
        const full = String(d?.text ?? "");
        const text = truncateAtBoundary(full, MAX_DOC_CHARS);
        if (text.length < full.length) {
          truncated.push({ name, originalChars: full.length, usedChars: text.length });
        }
        return { name, text };
      })
      .filter((d) => d.text.trim().length > 0),
  };
}

serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    if (!isAllowedOrigin(req)) {
      return json({ ok: false, error: "This origin is not allowed to generate sessions." }, 403);
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return json(
        { ok: false, error: "Too many generations in a row. Wait a minute and try again." },
        429,
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return json(
        { ok: false, error: "LOVABLE_API_KEY is not set on this project, so generation is unavailable." },
        500,
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (await isOverDailyCap(supabase)) {
      return json(
        { ok: false, error: "The daily generation limit for this site has been reached. Try again tomorrow." },
        429,
      );
    }

    const body = await req.json();
    const truncatedDocs: TruncatedDoc[] = [];
    const brief = normaliseBrief(body ?? {}, truncatedDocs);
    if (brief.topic.trim().length < 3) {
      return json({ ok: false, error: "Describe the topic before generating." }, 400);
    }

    const blueprint = blueprintFor(brief);
    const system = buildSystemPrompt(brief, blueprint);
    let user = buildUserPrompt(brief);
    if (user.length > MAX_TOTAL_INPUT_CHARS) {
      const originalChars = user.length;
      user = `${truncateAtBoundary(user, MAX_TOTAL_INPUT_CHARS)}\n\n[source material truncated to fit]`;
      truncatedDocs.push({
        name: "all documents combined",
        originalChars,
        usedChars: MAX_TOTAL_INPUT_CHARS,
      });
    }

    // Lower temperature when there is source material to stay faithful to it.
    const temperature = brief.documents.length > 0 ? 0.4 : 0.6;

    const started = Date.now();
    let text = await callModel(apiKey, system, user, temperature);
    let data = parseLoosely(text);
    let issues = data ? shapeIssues(data, blueprint.length) : ["the response could not be parsed as JSON"];
    let retried = false;

    // One repair turn. Handing the model its own errors is far more effective
    // than raising the temperature and hoping.
    if (issues.length > 0) {
      retried = true;
      console.warn("First attempt failed shape check:", issues.slice(0, 10));
      text = await callModel(
        apiKey,
        system,
        `${user}

Your previous answer was rejected. Fix exactly these problems and return the complete JSON again:
${issues.map((i) => `- ${i}`).join("\n")}

Return ONLY the JSON object.`,
        0.3,
      );
      data = parseLoosely(text);
      issues = data ? shapeIssues(data, blueprint.length) : ["the response could not be parsed as JSON"];
    }

    if (!data || issues.length > 0) {
      await recordUsage(supabase, ip, {
        outcome: "failed",
        retried,
        topic: brief.topic.slice(0, 120),
        issues: issues.slice(0, 10),
      });
      return json(
        {
          ok: false,
          error: "The generated session was not usable. Try again, or adjust the brief.",
          issues: issues.slice(0, 10),
          raw: typeof text === "string" ? text.slice(0, 4000) : null,
        },
        422,
      );
    }

    // Force the agreed skeleton on before anything else looks at the slots.
    enforceBlueprint(data, blueprint);

    const droppedVideos = await validateVideos(data);

    await recordUsage(supabase, ip, {
      outcome: "ok",
      retried,
      dropped_videos: droppedVideos,
      ms: Date.now() - started,
      level: brief.level,
      department: brief.department,
      duration_mins: brief.durationMins,
      had_documents: brief.documents.length > 0,
      truncated_docs: truncatedDocs.length,
      topic: brief.topic.slice(0, 120),
    });

    return new Response(
      JSON.stringify({ ok: true, data, meta: { retried, droppedVideos, truncatedDocs } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("generate-session failed:", message);
    return json({ ok: false, error: message }, 500);
  }
});
