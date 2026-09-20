import { supabase } from "@/integrations/supabase/client";
import { makeSlot } from "./slotDefaults";
import { deriveEndBehaviour } from "./sessionRepair";
import type { Brief, GeneratedSession } from "./sessionSchema";

/**
 * Creates a brand-new lesson plus its design-time slots, then hands back the
 * id so the caller can open the Stage Designer.
 *
 * Always a NEW lesson, never an append. The designer's saveAll() upserts its
 * whole in-memory slot array, so slots inserted underneath an open designer
 * would be clobbered or stranded with colliding order_index values. Generating
 * fresh sidesteps that entirely.
 */
export async function writeGeneratedSession(
  session: GeneratedSession,
  brief: Brief,
): Promise<{ lessonId: string }> {
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      title: session.lesson.title,
      description: session.lesson.description,
      estimated_duration_mins: brief.durationMins,
      ms_form_url: brief.msFormUrl.trim() || null,
      featured: false,
      // Dead column, written as [] to match the hand-built path in admin.tsx.
      // The slots table is the single source of truth.
      slots: [],
      resource_bucket: [],
      ai_generated: true,
      generated_at: new Date().toISOString(),
      ai_notes: {
        ...session.teaching_notes,
        media_requests: session.media_requests,
        brief: {
          topic: brief.topic,
          level: brief.level,
          department: brief.department,
          group_size: brief.groupSize,
          three_screens: brief.threeScreens,
        },
      },
    } as never)
    .select("id")
    .single();

  if (lessonError || !lesson) {
    throw new Error(lessonError?.message ?? "Could not create the lesson.");
  }

  const rows = session.slots.map((slot, index) => ({
    ...makeSlot(lesson.id, index),
    name: slot.name,
    lead_phase: slot.lead_phase,
    duration_mins: slot.duration_mins,
    // Derived, never taken from the model. `recipe` is generation-time metadata
    // with no column of its own, so it is intentionally dropped here.
    end_behaviour: deriveEndBehaviour(slot),
    host_content: slot.host,
    screen1_content: slot.screen1,
    screen2_content: slot.screen2,
  }));

  const { error: slotsError } = await supabase.from("slots").insert(rows as never);

  if (slotsError) {
    // Don't leave a lesson with no slots sitting in the launcher.
    await supabase.from("lessons").delete().eq("id", lesson.id);
    throw new Error(`Could not create the slots: ${slotsError.message}`);
  }

  return { lessonId: lesson.id };
}
