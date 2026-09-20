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
export async function fetchImage(
  source: Exclude<ImageSource, "none">,
  query: string,
  context: string,
): Promise<FetchImageResult> {
  const { data, error } = await supabase.functions.invoke("fetch-image", {
    body: { source, query, context },
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
): GeneratedSession {
  const slots = session.slots.map((slot, i) => {
    if (i !== slotIndex) return slot;
    return {
      ...slot,
      [screen]: { type: "image" as const, url, title: caption },
    };
  });
  return { ...session, slots } as GeneratedSession;
}
