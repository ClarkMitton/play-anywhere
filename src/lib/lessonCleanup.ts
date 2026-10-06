import { supabase } from "@/integrations/supabase/client";

const BUCKET = "lesson-media";
const MARKER = `/storage/v1/object/public/${BUCKET}/`;

/** Storage paths inside lesson-media referenced anywhere in a JSON blob. */
export function referencedPaths(value: unknown): string[] {
  const text = JSON.stringify(value ?? null);
  const out = new Set<string>();
  let i = text.indexOf(MARKER);
  while (i !== -1) {
    const start = i + MARKER.length;
    const end = text.slice(start).search(/["\\?\s]/);
    const p = decodeURIComponent(text.slice(start, end === -1 ? undefined : start + end));
    if (p) out.add(p);
    i = text.indexOf(MARKER, start);
  }
  return [...out];
}

async function listFolder(prefix: string): Promise<string[]> {
  const { data } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  return (data ?? []).filter((f) => f.id).map((f) => `${prefix}/${f.name}`);
}

/**
 * Deletes a lesson and everything that only it uses: its design slots, its
 * uploaded files (lessons/<id>/) and generated pictures it references. Past
 * sessions and their responses are kept for the confidence report, with the
 * lesson title stamped onto each session so it still reads correctly.
 */
export async function deleteLessonCompletely(lessonId: string): Promise<void> {
  const [{ data: lesson }, { data: slots }] = await Promise.all([
    supabase.from("lessons").select("title, resource_bucket").eq("id", lessonId).single(),
    supabase.from("slots").select("host_content, screen1_content, screen2_content")
      .eq("lesson_id", lessonId).is("session_id", null),
  ]);

  // Files to remove: the lesson's own folder + anything in generated/ it uses,
  // unless another lesson still points at the same file.
  const candidates = new Set<string>([
    ...(await listFolder(`lessons/${lessonId}`)),
    ...referencedPaths([slots, lesson?.resource_bucket]).filter(
      (p) => p.startsWith(`lessons/${lessonId}/`) || p.startsWith("generated/"),
    ),
  ]);
  if (candidates.size) {
    const { data: others } = await supabase.from("slots")
      .select("host_content, screen1_content, screen2_content")
      .is("session_id", null).neq("lesson_id", lessonId);
    const stillUsed = new Set(referencedPaths(others));
    const toRemove = [...candidates].filter((p) => !stillUsed.has(p));
    for (let i = 0; i < toRemove.length; i += 100) {
      await supabase.storage.from(BUCKET).remove(toRemove.slice(i, i + 100));
    }
  }

  // Keep the title on past sessions so the SLT report survives the delete.
  const { data: sessions } = await supabase.from("sessions").select("id, state").eq("lesson_id", lessonId);
  for (const s of sessions ?? []) {
    await supabase.from("sessions")
      .update({ state: { ...((s.state as object) ?? {}), lesson_title: lesson?.title ?? "Deleted lesson" } as never })
      .eq("id", s.id);
  }

  await supabase.from("slots").delete().eq("lesson_id", lessonId).is("session_id", null);
  await supabase.from("lessons").delete().eq("id", lessonId);
}
