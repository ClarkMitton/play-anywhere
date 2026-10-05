export type CCResponse = { session_id: string | null; slot_id?: string | null; response_type: string; response_data: unknown; created_at: string };
export type CCSession = { id: string; created_at: string; lessonTitle?: string };

export type ConfidenceReportRow = {
  sessionId: string;
  date: string;
  lessonTitle: string;
  startAvg: number | null;
  finalAvg: number | null;
  change: number | null;
  startCount: number;
  finalCount: number;
  participants: number;
};

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

/** Scale size for a confidence slot: numbers mode uses max (2-10, default 5); emoji/likert are always 5. */
export function scaleMaxFromContent(c: unknown): number | null {
  const x = c as { type?: string; scale_mode?: string; max?: number } | null;
  if (!x || x.type !== "confidence_checker") return null;
  const mode = x.scale_mode ?? "numbers";
  return mode === "numbers" ? Math.min(10, Math.max(2, Math.round(x.max ?? 5))) : 5;
}

/** Score as a percentage of its scale (score / max * 100). */
export function toPercent(score: number, max: number): number {
  return Math.min(100, Math.max(0, (score / max) * 100));
}

export function buildConfidenceReport(
  sessions: CCSession[],
  responses: CCResponse[],
  slotMax: Map<string, number> = new Map(),
): ConfidenceReportRow[] {
  const bySession = new Map<string, { start: number[]; final: number[] }>();
  for (const r of responses) {
    if (r.response_type !== "confidence_checker" || !r.session_id) continue;
    const d = r.response_data as { score?: unknown; checkpoint?: unknown; max?: unknown };
    if (typeof d?.score !== "number") continue;
    let max = typeof d.max === "number" ? d.max : (r.slot_id ? slotMax.get(r.slot_id) : undefined) ?? 5;
    if (d.score > max) max = 10;
    const pct = toPercent(d.score, max);
    const g = bySession.get(r.session_id) ?? { start: [], final: [] };
    (d.checkpoint === "final" ? g.final : g.start).push(pct);
    bySession.set(r.session_id, g);
  }
  const rows: ConfidenceReportRow[] = [];
  for (const s of sessions) {
    const g = bySession.get(s.id);
    if (!g) continue;
    const startAvg = avg(g.start);
    const finalAvg = avg(g.final);
    rows.push({
      sessionId: s.id,
      date: new Date(s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      lessonTitle: s.lessonTitle ?? "—",
      startAvg, finalAvg,
      change: startAvg !== null && finalAvg !== null ? finalAvg - startAvg : null,
      startCount: g.start.length,
      finalCount: g.final.length,
      participants: Math.max(g.start.length, g.final.length),
    });
  }
  return rows;
}

export function confidenceReportCsv(rows: ConfidenceReportRow[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const f = (n: number | null) => (n === null ? "" : n.toFixed(0));
  const lines = [
    ["Date", "Class / lesson", "Students participated", "Before responses", "After responses", "Before avg (%)", "After avg (%)", "Change (% points)"].join(","),
    ...rows.map(r => [esc(r.date), esc(r.lessonTitle), r.participants, r.startCount, r.finalCount, f(r.startAvg), f(r.finalAvg), r.change === null ? "" : (r.change > 0 ? "+" : "") + r.change.toFixed(0)].join(",")),
  ];
  return lines.join("\n");
}
