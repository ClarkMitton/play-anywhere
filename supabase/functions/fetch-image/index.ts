// ─────────────────────────────────────────────────────────────
// fetch-image
//
// Fills one image placeholder, either from stock photography or by generating
// one, and stores the result in the lesson-media bucket. Returning a bucket URL
// matters: isAllowedImageUrl() in sessionRepair.ts trusts images only from that
// bucket, so anything arriving this way passes validation while a model-invented
// url still cannot.
//
// Two sources:
//   "stock"  Pexels search. Real photographs. Preferred for anything that must
//            look like a real workplace, because a generated image can quietly
//            depict unsafe practice as correct.
//   "ai"     Image generation through the Lovable AI Gateway. Better for staged
//            scenarios and diagrams stock does not have, and steerable for
//            representation.
// ─────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { preflight, json } from "../_shared/cors.ts";
import { getClientIp, isAllowedOrigin, isRateLimited } from "../_shared/rateLimit.ts";

// Model id for image generation on the Lovable gateway. Overridable by env so a
// rename does not need a code change.
const IMAGE_MODEL = Deno.env.get("LOVABLE_IMAGE_MODEL") ??
  "google/gemini-2.5-flash-image-preview";

const BUCKET = "lesson-media";

function badRequest(message: string) {
  return json({ ok: false, error: message }, 400);
}

/**
 * Finds a real, embeddable YouTube video.
 *
 * Asking a language model for a video url does not work: it produces plausible
 * ids for videos that do not exist, which is why every generated lesson so far
 * has ended up with a placeholder instead of a clip. Searching the actual index
 * is the only way to get a url that resolves.
 */
async function findVideo(query: string): Promise<{ url: string; title: string }> {
  const key = Deno.env.get("YOUTUBE_API_KEY");
  if (!key) {
    throw new Error(
      "Video search is not configured. Add YOUTUBE_API_KEY, or paste a video link into the slot yourself.",
    );
  }

  const params = new URLSearchParams({
    key,
    q: query,
    part: "snippet",
    type: "video",
    maxResults: "1",
    // Only videos that can actually play inside the room's iframe.
    videoEmbeddable: "true",
    safeSearch: "strict",
    relevanceLanguage: "en",
    regionCode: "GB",
  });

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    throw new Error(`YouTube search failed (${res.status}). ${detail}`);
  }

  const data = await res.json();
  const item = data?.items?.[0];
  const id = item?.id?.videoId;
  if (!id) throw new Error(`No embeddable video found for "${query}". Try different wording.`);

  return {
    url: `https://www.youtube.com/watch?v=${id}`,
    title: String(item?.snippet?.title ?? query),
  };
}

async function fromPexels(query: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  const key = Deno.env.get("PEXELS_API_KEY");
  if (!key) {
    throw new Error(
      "Stock photo search is not configured. Add PEXELS_API_KEY, or switch the lesson to generated images.",
    );
  }

  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels search failed (${res.status}).`);

  const data = await res.json();
  const photo = data?.photos?.[0];
  const src = photo?.src?.large2x ?? photo?.src?.large ?? photo?.src?.original;
  if (!src) throw new Error(`No stock photo found for "${query}". Try different wording.`);

  const img = await fetch(src);
  if (!img.ok) throw new Error("Could not download the stock photo.");
  return {
    bytes: new Uint8Array(await img.arrayBuffer()),
    contentType: img.headers.get("content-type") ?? "image/jpeg",
  };
}

async function fromModel(prompt: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not set, so images cannot be generated.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`Image generation failed (${res.status}). ${detail}`);
  }

  const payload = await res.json();
  // Gateways differ on where the image lands, so accept the common shapes
  // rather than failing on a field name.
  const message = payload?.choices?.[0]?.message;
  const candidate: string | undefined =
    message?.images?.[0]?.image_url?.url ??
    message?.images?.[0]?.url ??
    payload?.data?.[0]?.b64_json ??
    payload?.data?.[0]?.url;

  if (typeof candidate !== "string" || !candidate) {
    throw new Error(
      "The image model returned no image. The model id may be wrong for this project; set LOVABLE_IMAGE_MODEL.",
    );
  }

  if (candidate.startsWith("data:")) {
    const [header, b64] = candidate.split(",", 2);
    const contentType = header.match(/data:([^;]+)/)?.[1] ?? "image/png";
    return { bytes: Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), contentType };
  }
  if (candidate.startsWith("http")) {
    const img = await fetch(candidate);
    if (!img.ok) throw new Error("Could not download the generated image.");
    return {
      bytes: new Uint8Array(await img.arrayBuffer()),
      contentType: img.headers.get("content-type") ?? "image/png",
    };
  }
  // Bare base64
  return {
    bytes: Uint8Array.from(atob(candidate), (c) => c.charCodeAt(0)),
    contentType: "image/png",
  };
}

serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  try {
    if (!isAllowedOrigin(req)) return json({ ok: false, error: "Origin not allowed." }, 403);

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return json({ ok: false, error: "Too many image requests. Wait a moment." }, 429);
    }

    const body = await req.json().catch(() => null);
    const source = String(body?.source ?? "stock");
    const query = String(body?.query ?? "").trim();
    const context = String(body?.context ?? "").trim();

    if (!query) return badRequest("A description is required.");

    // Video is a link, not a stored file, so it short-circuits before upload.
    if (String(body?.kind ?? "image") === "youtube") {
      const video = await findVideo(query);
      return json({ ok: true, url: video.url, title: video.title, source: "youtube" });
    }

    if (source !== "stock" && source !== "ai") return badRequest("source must be stock or ai.");

    const prompt = source === "ai"
      ? [
        `A clear, realistic photograph for a UK further education lesson: ${query}.`,
        context ? `It is used to: ${context}` : "",
        "Documentary style, natural lighting, a real workplace rather than a studio.",
        "Show people of varied ethnicities, ages and genders doing skilled work competently.",
        "No text, no logos, no watermarks, no captions in the image.",
      ].filter(Boolean).join(" ")
      : query;

    const { bytes, contentType } =
      source === "ai" ? await fromModel(prompt) : await fromPexels(query);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    // Not under lessons/<id>/ because the lesson does not exist yet at review time.
    const path = `generated/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType, upsert: false });
    if (uploadError) throw new Error(`Could not store the image: ${uploadError.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return json({ ok: true, url: data.publicUrl, source });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("fetch-image failed:", message);
    return json({ ok: false, error: message }, 500);
  }
});
