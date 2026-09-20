// Abuse and cost controls for the generation endpoint.
//
// Honest note on what this does and does not achieve. This app has no user
// accounts and the Supabase anon key is published in the client bundle, so
// the endpoint is inherently callable by anyone who reads the page source. A
// "shared secret" header would have to ship in that same bundle, so it would
// add nothing. What genuinely limits exposure is therefore:
//   1. a per-IP burst limit (below, best-effort),
//   2. a hard daily cap counted in the database (the real backstop),
//   3. an Origin allowlist (stops casual cross-site use, trivially spoofed).
// Closing the hole properly needs real auth plus verify_jwt, which is the
// deferred "proper" option in the plan.

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6; // generations are expensive; this is a burst guard
const DAILY_CAP = 150;

// Per-isolate only. Edge isolates recycle and there may be several at once,
// so this stops hammering but is not a real quota. The daily cap is.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Comma-separated list, e.g. "https://myroom.lovable.app,http://localhost:5173".
// Unset means allow all, so local development and preview URLs keep working.
export function isAllowedOrigin(req: Request): boolean {
  const allowed = Deno.env.get("ALLOWED_ORIGINS");
  if (!allowed) return true;
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser callers; the daily cap still applies
  return allowed.split(",").map((o) => o.trim()).includes(origin);
}

// deno-lint-ignore no-explicit-any
export async function isOverDailyCap(supabase: any): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "generate_session")
    .gte("created_at", `${today}T00:00:00.000Z`);
  return (count ?? 0) >= DAILY_CAP;
}

// deno-lint-ignore no-explicit-any
export async function recordUsage(
  supabase: any,
  ip: string,
  meta: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from("usage_events")
    .insert({ event_type: "generate_session", ip, meta });
  if (error) console.error("usage_events insert failed:", error.message);
}
