// Canonical shape of a design-time slot row.
//
// Lifted out of admin.designer.$lessonId.tsx so the AI session writer builds
// rows with exactly the defaults the designer expects. One definition, two
// callers: if the slots table gains a column, it gets its default here.

import type { ContentDef } from "@/types/slot";

export type SlotRow = {
  id: string;
  lesson_id: string;
  session_id: null;
  order_index: number;
  duration_mins: number;
  end_behaviour: string;
  pause_before_advance: boolean;
  lead_phase: string | null;
  name: string | null;
  screen_delay_secs: number;
  host_content: ContentDef;
  screen1_content: ContentDef;
  screen2_content: ContentDef;
};

export function makeSlot(lessonId: string, orderIndex: number): SlotRow {
  return {
    id: crypto.randomUUID(),
    lesson_id: lessonId,
    session_id: null,
    order_index: orderIndex,
    duration_mins: 10,
    end_behaviour: "",
    pause_before_advance: false,
    lead_phase: null,
    name: null,
    screen_delay_secs: 0,
    host_content: { type: "waiting" },
    screen1_content: { type: "waiting" },
    screen2_content: { type: "waiting" },
  };
}

export function makeFeedbackSlot(lessonId: string, orderIndex: number): SlotRow {
  return {
    ...makeSlot(lessonId, orderIndex),
    end_behaviour: "screen2_submit",
    screen1_content: { type: "waiting" },
    screen2_content: { type: "confidence_checker", prompt: "How confident are you?" },
  };
}
