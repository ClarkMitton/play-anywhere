// Wordwall refuses to be shown inside another site from its normal pages
// (/resource/..., /play/...): only /embed/<code> works, and that code is not
// in the share link. The lesson-agent function reads Wordwall's public page
// and returns the embed address; it is remembered in this browser so each
// screen asks only once.

import { useEffect, useState } from "react";

const SHARE_LINK = /^https?:\/\/(?:www\.)?wordwall\.net\/(?:[a-z]{2}\/)?(?:resource|play)\//i;
const CACHE_KEY = "wordwall-embeds:v1";

export function isWordwallShareLink(url: string): boolean {
  return SHARE_LINK.test(url);
}

function cached(url: string): string | null {
  try {
    return (JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, string>)[url] ?? null;
  } catch {
    return null;
  }
}

function remember(url: string, embed: string) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, string>;
    all[url] = embed;
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // not saved; it is looked up again next time
  }
}

/** Ask the function for a Wordwall share link's embed address. */
export async function wordwallEmbedUrl(url: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const hit = cached(url);
  if (hit) return { ok: true, url: hit };
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-agent`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "embed", url }),
    });
    const data = JSON.parse((await res.text()).trim());
    if (data?.ok && typeof data.url === "string") {
      remember(url, data.url);
      return { ok: true, url: data.url };
    }
    return { ok: false, error: String(data?.error ?? "Wordwall could not be reached") };
  } catch {
    return { ok: false, error: "Wordwall could not be reached" };
  }
}

/** The address to put in the iframe: share links become embed links; anything else is used as it is. */
export function useEmbedSrc(url: string): { src: string | null; error: string | null } {
  const needsLookup = isWordwallShareLink(url);
  const [state, setState] = useState<{ src: string | null; error: string | null }>(() =>
    needsLookup ? { src: cached(url), error: null } : { src: url, error: null },
  );
  useEffect(() => {
    if (!needsLookup) {
      setState({ src: url, error: null });
      return;
    }
    let live = true;
    void wordwallEmbedUrl(url).then((r) => {
      if (live) setState(r.ok ? { src: r.url, error: null } : { src: null, error: r.error });
    });
    return () => {
      live = false;
    };
  }, [url, needsLookup]);
  return state;
}
