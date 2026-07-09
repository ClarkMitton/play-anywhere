// Simple profanity filter shared across all user-text-entry slot types
// (word_cloud, padlet, team names, etc.). Behaviour: block submission.
// Not exhaustive — designed to catch the obvious cases in a classroom.

const BLOCKLIST = [
  "fuck", "fucker", "fucking", "shit", "shite", "bitch", "bastard", "bollocks",
  "cunt", "twat", "wanker", "prick", "dick", "cock", "arse", "ass", "asshole",
  "piss", "damn", "crap", "slut", "whore", "faggot", "fag", "nigger", "nigga",
  "retard", "retarded", "gay",
];

// Normalize common leet substitutions so "f4ck" / "sh1t" still catch.
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[!1|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[3]/g, "e")
    .replace(/[$5]/g, "s")
    .replace(/[7]/g, "t");
}

export type ProfanityResult = { ok: true } | { ok: false; word: string };

export function checkProfanity(text: string): ProfanityResult {
  const norm = normalize(text ?? "");
  // Split on non-letters so "you-are-a-fuck" still matches.
  const tokens = norm.split(/[^a-z]+/).filter(Boolean);
  for (const t of tokens) {
    if (BLOCKLIST.includes(t)) return { ok: false, word: t };
  }
  // Also catch words embedded without separators ("iamafucker").
  for (const w of BLOCKLIST) {
    if (w.length >= 4 && norm.includes(w)) return { ok: false, word: w };
  }
  return { ok: true };
}

export const PROFANITY_MESSAGE = "That word isn't allowed. Try something else.";
