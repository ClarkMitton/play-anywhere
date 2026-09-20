import { supabase } from "@/integrations/supabase/client";
import type { GeneratedSession } from "./sessionSchema";

export type ImageSource = "none" | "stock" | "ai";

export type FetchImageResult =
  | { ok: true; url: string; source: string }
  | { ok: false; error: string };

/**
 * Fills one image placeholder. The edge function stores the result in the
 * lesson-media bucket and returns its public URL, which is the only image
 * source sessionRepair trusts.
 */
/**
 * The model writes placeholders as "[ADD IMAGE] <description>" and reuses that
 * whole string as the search phrase, so the marker has to come off before it
 * reaches a stock search. Stock engines also match badly on long prose, so the
 * query is trimmed to its first few content words while the full description
 * still goes through as context for image generation.
 */
function toSearchQuery(raw: string): string {
  const cleaned = raw.replace(/^\s*\[ADD IMAGE\]\s*/i, "").trim();
  const words = cleaned
    .replace(/[.,;:]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(a|an|the|of|and|or|with|but|generally|very)$/i.test(w));
  return words.slice(0, 8).join(" ") || cleaned;
}

export async function fetchImage(
  source: Exclude<ImageSource, "none">,
  query: string,
  context: string,
  kind: "image" | "youtube" = "image",
): Promise<FetchImageResult> {
  // Video always searches the real index: a model-invented id never resolves.
  const useKeywords = kind === "youtube" || source === "stock";
  const { data, error } = await supabase.functions.invoke("fetch-image", {
    body: {
      source,
      kind,
      query: useKeywords ? toSearchQuery(query) : query.replace(/^\s*\[ADD IMAGE\]\s*/i, ""),
      context,
    },
  });

  if (error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = (await ctx.json()) as FetchImageResult;
        if (!body.ok && body.error) return body;
      } catch {
        // fall through
      }
    }
    return { ok: false, error: error.message ?? "Could not fetch the image." };
  }

  return (data ?? { ok: false, error: "No response." }) as FetchImageResult;
}

/**
 * Swaps a described placeholder for a real image slot.
 *
 * The generator emits visual beats as a text_slide whose subtitle carries the
 * brief, because it must never invent a url. Once a real image exists, that
 * slide becomes an actual image slot with the brief kept as the caption.
 */
export function applyImageToSession(
  session: GeneratedSession,
  slotIndex: number,
  screen: "host" | "screen1" | "screen2",
  url: string,
  caption: string,
  kind: "image" | "youtube" = "image",
): GeneratedSession {
  const content =
    kind === "youtube"
      ? { type: "youtube" as const, url }
      : { type: "image" as const, url, title: caption };

  const slots = session.slots.map((slot, i) => {
    if (i !== slotIndex) return slot;
    return { ...slot, [screen]: content };
  });
  return { ...session, slots } as GeneratedSession;
}
