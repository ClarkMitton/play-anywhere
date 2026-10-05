export type CCResponse = { session_id: string | null; response_type: string; response_data: unknown; created_at: string };
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

export function buildConfidenceReport(sessions: CCSession[], responses: CCResponse[]): ConfidenceReportRow[] {
  const bySession = new Map<string, { start: number[]; final: number[] }>();
  for (const r of responses) {
    if (r.response_type !== "confidence_checker" || !r.session_id) continue;
    const d = r.response_data as { score?: unknown; checkpoint?: unknown };
    if (typeof d?.score !== "number") continue;
    const g = bySession.get(r.session_id) ?? { start: [], final: [] };
    (d.checkpoint === "final" ? g.final : g.start).push(d.score);
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
  const f = (n: number | null) => (n === null ? "" : n.toFixed(2));
  const lines = [
    ["Date", "Class / lesson", "Students participated", "Before responses", "After responses", "Before avg (/5)", "After avg (/5)", "Change"].join(","),
    ...rows.map(r => [esc(r.date), esc(r.lessonTitle), r.participants, r.startCount, r.finalCount, f(r.startAvg), f(r.finalAvg), r.change === null ? "" : (r.change > 0 ? "+" : "") + r.change.toFixed(2)].join(",")),
  ];
  return lines.join("\n");
}
