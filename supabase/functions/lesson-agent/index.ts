// ─────────────────────────────────────────────────────────────
// lesson-agent
//
// The "build with an agent" page talks to this. Three modes:
//   describe  pictures in, a short description and their words out. Run once
//             per picture, so later turns send text, not images (cheaper).
//   chat      the planning conversation. Plain text back, with a screen map.
//   build     the agreed plan in, lesson JSON out. Validated in full on the
//             client by sessionSchema.ts, like generate-session.
//
// Every call records its token usage in usage_events (event_type
// "lesson_agent"), and the reply carries today's running totals so the page
// can show what the agent is costing.
// ─────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { preflight, json } from "../_shared/cors.ts";
import {
  getClientIp,
  isAllowedOrigin,
  isOverDailyCap,
  isRateLimited,
  recordUsage,
} from "../_shared/rateLimit.ts";
import {
  buildSystemPrompt,
  chatSystemPrompt,
  DESCRIBE_PROMPT,
  type ChatMessage,
  type Resource,
} from "./prompt.ts";

const EVENT = "lesson_agent";
const DAILY_CALLS = 400;
// The planning and building model can be changed without a code change.
const MODEL = Deno.env.get("LESSON_AGENT_MODEL") ?? "google/gemini-2.5-pro";
const DESCRIBE_MODEL = Deno.env.get("LESSON_AGENT_DESCRIBE_MODEL") ?? "google/gemini-2.5-flash";
const MAX_IMAGES_PER_DESCRIBE = 8;
const MAX_DOC_CHARS = 40_000;
const MAX_MESSAGES = 40;

type Usage = { prompt_tokens: number; completion_tokens: number };

// deno-lint-ignore no-explicit-any
async function callModel(apiKey: string, body: Record<string, any>): Promise<{ text: string; usage: Usage }> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    if (res.status === 402) throw new Error("The AI credits for this project have run out.");
    if (res.status === 429) throw new Error("The AI service is busy. Wait a moment and try again.");
    throw new Error(`AI gateway returned ${res.status}: ${detail.slice(0, 400)}`);
  }
  const payload = await res.json();
  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("The AI returned an empty reply.");
  return {
    text,
    usage: {
      prompt_tokens: Number(payload?.usage?.prompt_tokens) || 0,
      completion_tokens: Number(payload?.usage?.completion_tokens) || 0,
    },
  };
}

function parseLoosely(text: string): unknown | null {
  const stripped = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  for (const attempt of [stripped, start >= 0 && end > start ? stripped.slice(start, end + 1) : ""]) {
    if (!attempt) continue;
    try {
      return JSON.parse(attempt);
    } catch {
      // try the next
    }
  }
  return null;
}

function shapeIssues(data: unknown): string[] {
  // deno-lint-ignore no-explicit-any
  const d = data as any;
  if (!d || typeof d !== "object") return ["the reply was not a JSON object"];
  const issues: string[] = [];
  if (!d.lesson?.title) issues.push("lesson.title is missing");
  if (!Array.isArray(d.slots) || d.slots.length === 0) return [...issues, "slots is missing or empty"];
  d.slots.forEach((s: Record<string, unknown>, i: number) => {
    for (const screen of ["host", "screen1", "screen2"]) {
      const c = s?.[screen] as { type?: string } | undefined;
      if (!c?.type) issues.push(`slots[${i}].${screen} has no type`);
    }
  });
  return issues;
}

// deno-lint-ignore no-explicit-any
function cleanResources(raw: any): Resource[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 80).map((r) => ({
    id: String(r?.id ?? ""),
    name: String(r?.name ?? "resource").slice(0, 200),
    kind: (["image", "audio", "video", "document", "link"].includes(r?.kind) ? r.kind : "link") as Resource["kind"],
    url: typeof r?.url === "string" ? r.url.slice(0, 1000) : undefined,
    description: typeof r?.description === "string" ? r.description.slice(0, 1200) : undefined,
    text: typeof r?.text === "string" ? r.text.slice(0, MAX_DOC_CHARS) : undefined,
  }));
}

// deno-lint-ignore no-explicit-any
function cleanMessages(raw: any): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 20_000) }));
}

// deno-lint-ignore no-explicit-any
async function todayTotals(supabase: any) {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("usage_events")
    .select("meta")
    .eq("event_type", EVENT)
    .gte("created_at", `${today}T00:00:00.000Z`)
    .limit(1000);
  const totals = { calls: 0, prompt_tokens: 0, completion_tokens: 0 };
  for (const row of data ?? []) {
    totals.calls++;
    totals.prompt_tokens += Number(row?.meta?.prompt_tokens) || 0;
    totals.completion_tokens += Number(row?.meta?.completion_tokens) || 0;
  }
  return totals;
}

serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    if (!isAllowedOrigin(req)) return json({ ok: false, error: "This origin is not allowed." }, 403);
    const ip = getClientIp(req);
    if (isRateLimited(ip)) return json({ ok: false, error: "Too many requests in a row. Wait a minute." }, 429);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ ok: false, error: "LOVABLE_API_KEY is not set on this project." }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    if (await isOverDailyCap(supabase, EVENT, DAILY_CALLS)) {
      return json({ ok: false, error: "The daily limit for the lesson agent has been reached." }, 429);
    }

    const body = await req.json();
    const mode = String(body?.mode ?? "");
    const started = Date.now();
    // deno-lint-ignore no-explicit-any
    let result: Record<string, any>;
    let usage: Usage;
    let model = MODEL;

    if (mode === "describe") {
      model = DESCRIBE_MODEL;
      const images = (Array.isArray(body?.images) ? body.images : [])
        .slice(0, MAX_IMAGES_PER_DESCRIBE)
        // deno-lint-ignore no-explicit-any
        .filter((i: any) => typeof i?.dataUrl === "string" && i.dataUrl.startsWith("data:image/"));
      if (images.length === 0) return json({ ok: false, error: "No pictures to describe." }, 400);
      // deno-lint-ignore no-explicit-any
      const content: any[] = [{ type: "text", text: DESCRIBE_PROMPT }];
      for (const img of images) {
        content.push({ type: "text", text: `id: ${String(img.id)} (file ${String(img.name ?? "")})` });
        content.push({ type: "image_url", image_url: { url: img.dataUrl } });
      }
      const reply = await callModel(apiKey, {
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content }],
      });
      usage = reply.usage;
      // deno-lint-ignore no-explicit-any
      const parsed = parseLoosely(reply.text) as any;
      result = { items: Array.isArray(parsed?.items) ? parsed.items : [] };
    } else if (mode === "chat") {
      const messages = cleanMessages(body?.messages);
      if (messages.length === 0) return json({ ok: false, error: "Say what you want first." }, 400);
      const system = chatSystemPrompt(cleanResources(body?.resources), body?.current ?? null);
      const reply = await callModel(apiKey, {
        model,
        temperature: 0.5,
        messages: [{ role: "system", content: system }, ...messages],
      });
      usage = reply.usage;
      result = { reply: reply.text };
    } else if (mode === "build") {
      const messages = cleanMessages(body?.messages);
      const system = buildSystemPrompt(cleanResources(body?.resources), body?.current ?? null);
      const fixes = Array.isArray(body?.fix_issues) ? body.fix_issues.map(String).slice(0, 20) : [];
      const transcript = messages.map((m) => `${m.role === "user" ? "TEACHER" : "ASSISTANT"}: ${m.content}`).join("\n\n");
      let user = `THE CONVERSATION:\n\n${transcript || "(no conversation; build from the resources)"}\n\nBuild the lesson now. Return only the JSON.`;
      if (fixes.length) {
        user += `\n\nA previous build was rejected. Fix exactly these problems:\n${fixes.map((f: string) => `- ${f}`).join("\n")}`;
      }
      let reply = await callModel(apiKey, {
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      });
      usage = { ...reply.usage };
      let data = parseLoosely(reply.text);
      let issues = data ? shapeIssues(data) : ["the reply could not be read as JSON"];
      if (issues.length) {
        reply = await callModel(apiKey, {
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: `${user}\n\nYour previous answer was rejected:\n${issues.map((i) => `- ${i}`).join("\n")}\nReturn the complete JSON again.` },
          ],
        });
        usage.prompt_tokens += reply.usage.prompt_tokens;
        usage.completion_tokens += reply.usage.completion_tokens;
        data = parseLoosely(reply.text);
        issues = data ? shapeIssues(data) : ["the reply could not be read as JSON"];
      }
      if (!data || issues.length) {
        await recordUsage(supabase, ip, { mode, model, outcome: "failed", ...usage, ms: Date.now() - started }, EVENT);
        return json({ ok: false, error: "The build was not usable. Try Build again.", issues }, 422);
      }
      result = { data };
    } else {
      return json({ ok: false, error: `Unknown mode "${mode}".` }, 400);
    }

    await recordUsage(supabase, ip, { mode, model, outcome: "ok", ...usage, ms: Date.now() - started }, EVENT);
    const today = await todayTotals(supabase);
    return json({ ok: true, ...result, usage: { ...usage, model }, today });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("lesson-agent failed:", message);
    return json({ ok: false, error: message }, 500);
  }
});
