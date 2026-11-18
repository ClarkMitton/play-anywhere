// YouTube clips the agent finds for itself, with what is actually said in them.
//
// The rule (from how lessons are built by hand): a clip is only used if its
// transcript can be read, so the agent chooses the part to play, and its
// start and end, from the words rather than from the title. Search uses the
// YouTube Data API (YOUTUBE_API_KEY, already set for fetch-image).
// Transcripts come from Supadata (SUPADATA_API_KEY) in "native" mode: only
// captions that exist on YouTube, never a generated guess. YouTube blocks
// transcript requests from cloud servers, which is why a service is used.

export type FoundVideo = {
  url: string;
  title: string;
  channel: string;
  /** Length in seconds. */
  seconds: number;
  /** Timestamped transcript, trimmed for the model. */
  transcript: string;
};

const SEARCH_RESULTS = 6;
const READ_AT_MOST = 3;
const MIN_SECONDS = 30;
const MAX_SECONDS = 25 * 60;
const MAX_TRANSCRIPT_CHARS = 9_000;

/** "PT1H2M3S" to seconds. */
export function isoDurationSeconds(iso: string): number {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!m) return 0;
  return (Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 60 + Number(m[3] ?? 0);
}

export function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

/**
 * Caption segments joined into lines of about 20 seconds, each starting with
 * its time, so the model can pick a start and an end. Cut at a limit, saying so.
 */
export function formatTranscript(segments: { text: string; offset: number }[], maxChars = MAX_TRANSCRIPT_CHARS): string {
  const lines: string[] = [];
  let start = -1;
  let words: string[] = [];
  const flush = () => {
    if (words.length) lines.push(`[${clock(start / 1000)}] ${words.join(" ").replace(/\s+/g, " ").trim()}`);
    words = [];
  };
  for (const seg of segments) {
    const text = String(seg.text ?? "").replace(/\[(music|applause)\]/gi, "").trim();
    if (!text) continue;
    if (start < 0 || seg.offset - start >= 20_000) {
      flush();
      start = seg.offset;
    }
    words.push(text);
  }
  flush();
  let out = "";
  for (const line of lines) {
    if (out.length + line.length > maxChars) return `${out}[transcript continues; only the first part is shown]`;
    out += line + "\n";
  }
  return out.trim();
}

/**
 * The Supadata key. SUPADATA_API_KEY is the expected name, but secrets added
 * through a chat are easily saved as "SUPADATA_KEY" or "Supadata API Key", so
 * any setting with SUPADATA in its name is accepted.
 */
function supadataKey(): string | null {
  const exact = Deno.env.get("SUPADATA_API_KEY");
  if (exact?.trim()) return exact.trim();
  try {
    for (const [name, value] of Object.entries(Deno.env.toObject())) {
      if (/supadata/i.test(name) && value.trim()) return value.trim();
    }
  } catch {
    // reading all settings is not allowed here; only the exact name works
  }
  return null;
}

async function youtube(path: string, params: Record<string, string>, key: string) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${new URLSearchParams({ ...params, key })}`);
  if (!res.ok) throw new Error(`YouTube search failed (${res.status})`);
  return await res.json();
}

async function readTranscript(url: string, key: string): Promise<string | null> {
  const res = await fetch(
    `https://api.supadata.ai/v1/transcript?${new URLSearchParams({ url, lang: "en", text: "false", mode: "native" })}`,
    { headers: { "x-api-key": key } },
  );
  if (res.status !== 200) return null; // 206: no captions; 202: a long job; 4xx: private or blocked
  const data = await res.json();
  if (!Array.isArray(data?.content) || data.content.length === 0) return null;
  const text = formatTranscript(data.content);
  return text.length > 80 ? text : null;
}

/**
 * Search, then read transcripts until enough clips are found. Videos without
 * a readable transcript are left out, and the note says how many.
 */
export function youTubeId(url: string): string | null {
  return /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(url)?.[1] ?? null;
}

/**
 * A clip the teacher gave: its title, length and transcript, read directly
 * (no search). Null when it has no readable captions.
 */
export async function readGivenVideo(url: string): Promise<FoundVideo | null> {
  const id = youTubeId(url);
  const ytKey = Deno.env.get("YOUTUBE_API_KEY");
  const transcriptKey = supadataKey();
  if (!id || !ytKey || !transcriptKey) return null;
  const watch = `https://www.youtube.com/watch?v=${id}`;
  const [details, transcript] = await Promise.all([
    youtube("videos", { part: "snippet,contentDetails", id }, ytKey).catch(() => null),
    readTranscript(watch, transcriptKey).catch(() => null),
  ]);
  if (!transcript) return null;
  const v = details?.items?.[0];
  return {
    url,
    title: v?.snippet?.title ?? "YouTube clip",
    channel: v?.snippet?.channelTitle ?? "",
    seconds: isoDurationSeconds(v?.contentDetails?.duration ?? ""),
    transcript,
  };
}

export async function findVideos(query: string): Promise<{ videos: FoundVideo[]; note: string }> {
  const ytKey = Deno.env.get("YOUTUBE_API_KEY");
  if (!ytKey) return { videos: [], note: "Video search is not set up (YOUTUBE_API_KEY is missing)." };
  const transcriptKey = supadataKey();
  if (!transcriptKey) {
    return { videos: [], note: "Transcripts are not set up (no Supadata key is saved on the project), so no clip can be checked and none may be suggested." };
  }

  const search = await youtube("search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(SEARCH_RESULTS),
    videoEmbeddable: "true",
    safeSearch: "strict",
    relevanceLanguage: "en",
    regionCode: "GB",
  }, ytKey);
  const ids: string[] = (search.items ?? []).map((i: { id?: { videoId?: string } }) => i.id?.videoId).filter(Boolean);
  if (!ids.length) return { videos: [], note: `Nothing found on YouTube for "${query}".` };

  const details = await youtube("videos", { part: "snippet,contentDetails", id: ids.join(",") }, ytKey);
  const candidates = (details.items ?? [])
    .map((v: { id: string; snippet?: { title?: string; channelTitle?: string }; contentDetails?: { duration?: string } }) => ({
      url: `https://www.youtube.com/watch?v=${v.id}`,
      title: v.snippet?.title ?? "",
      channel: v.snippet?.channelTitle ?? "",
      seconds: isoDurationSeconds(v.contentDetails?.duration ?? ""),
    }))
    .filter((v: { seconds: number }) => v.seconds >= MIN_SECONDS && v.seconds <= MAX_SECONDS);

  const videos: FoundVideo[] = [];
  let unreadable = 0;
  for (const v of candidates) {
    if (videos.length >= READ_AT_MOST) break;
    const transcript = await readTranscript(v.url, transcriptKey).catch(() => null);
    if (transcript) videos.push({ ...v, transcript });
    else unreadable++;
  }
  const note = `Searched YouTube for "${query}": read ${videos.length} transcript${videos.length === 1 ? "" : "s"}` +
    (unreadable ? `, left out ${unreadable} video${unreadable === 1 ? "" : "s"} with no captions` : "");
  return { videos, note };
}

/** What the model sees for each clip. */
export function videosForModel(found: { videos: FoundVideo[]; note: string }): string {
  if (!found.videos.length) return `${found.note}. No clips to suggest from this search.`;
  return `${found.note}.\n\n` + found.videos.map((v, i) =>
    `VIDEO ${i + 1}: ${v.title}\nchannel: ${v.channel} · length ${clock(v.seconds)}\nurl: ${v.url}\ntranscript:\n${v.transcript}`
  ).join("\n\n");
}
