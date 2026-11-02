import type { Hotspot } from "@/components/HazardHotspots";

export type SpotDifferenceContent = {
  type: "spot_difference";
  reference_url: string;
  comparison_url: string;
  total_differences: number;
  hotspots: Hotspot[];
  title?: string;
};

export function differenceCount(content: SpotDifferenceContent, found: string[]): number {
  const valid = new Set(content.hotspots.map((h) => h.id));
  return new Set(found.filter((id) => valid.has(id))).size;
}

export function differenceSetupValid(content: SpotDifferenceContent): boolean {
  return !!content.reference_url && !!content.comparison_url &&
    Number.isInteger(content.total_differences) && content.total_differences > 0 &&
    content.hotspots.length === content.total_differences &&
    new Set(content.hotspots.map((h) => h.id)).size === content.total_differences;
}

export function canSubmitDifferences(content: SpotDifferenceContent, found: string[]): boolean {
  return differenceSetupValid(content) && differenceCount(content, found) === content.total_differences;
}

/** One definition for all roles; the renderer selects reference vs comparison. */
export function differenceScreens(content: { type: string; [key: string]: unknown }) {
  return { host_content: { ...content }, screen1_content: { ...content }, screen2_content: { ...content } };
}