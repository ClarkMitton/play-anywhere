// Stage Designer — Step 8
// Route: /admin/designer/$lessonId
// Three-screen mockup preview, horizontal slot timeline, per-slot editor panel.
// All slot mutations auto-save after 1.5 s idle, plus an explicit Save button.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SlotStackThumbnail, SlotThumbnail } from "@/components/SlotThumbnail";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const PX_PER_MIN = 12; // timeline pixels per minute
const MIN_SLOT_PX = 80; // minimum rendered slot width
const SNAP_MINS = [5, 10, 15, 20, 30]; // duration snap points
const SNAP_THRESHOLD = 1.5; // snap if within this many minutes of a point
const AUTOSAVE_DELAY = 1500; // ms idle before auto-save triggers

const END_BEHAVIOURS = [
  { value: "timed", label: "Timed auto-advance" },
  { value: "screen2_submit", label: "Touch Screen 2 submission" },
  { value: "screen1_continue", label: "Touch Screen 1 presses continue" },
] as const;

const LEAD_PHASES = ["Launch", "Establish", "Apply", "Demonstrate"] as const;

const LEAD_COLOURS: Record<string, string> = {
  Launch: "var(--cyan)",
  Establish: "var(--success)",
  Apply: "var(--orange)",
  Demonstrate: "oklch(0.72 0.18 300)", // violet
};

// Content types available per screen. host_timer is host (teacher screen) only.
const CONTENT_TYPES_HOST = [
  { value: "waiting", label: "Waiting (standby)" },
  { value: "text_slide", label: "Text Slide" },
  { value: "image", label: "Image" },
  { value: "youtube", label: "YouTube" },
  { value: "embed", label: "Embed (iframe)" },
  { value: "confidence_checker", label: "Confidence Checker" },
  { value: "voting", label: "Voting" },
  { value: "quiz_buzzer", label: "Quiz Buzzer" },
  { value: "wheel_spinner", label: "Wheel Spinner" },
  { value: "countdown_timer", label: "Countdown Timer (all screens)" },
  { value: "host_timer", label: "Host Timer (Host only)" },
];
const CONTENT_TYPES_SCREEN1 = [
  { value: "waiting", label: "Waiting (standby)" },
  { value: "text_slide", label: "Text Slide" },
  { value: "image", label: "Image" },
  { value: "youtube", label: "YouTube" },
  { value: "embed", label: "Embed (iframe)" },
  { value: "confidence_checker", label: "Confidence Checker" },
  { value: "voting", label: "Voting" },
  { value: "quiz_buzzer", label: "Quiz Buzzer" },
  { value: "wheel_spinner", label: "Wheel Spinner" },
  { value: "countdown_timer", label: "Countdown Timer" },
];
// Interactive question types. Authored via the question modal; on insert they
// populate Host (live results, with a Reveal button) + TS2 (student answering).
// Poll and Likert are intentionally excluded — Voting and the Confidence Checker
// cover those. So these belong in the Host/TS2 dropdowns.
const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Question: Multiple Choice" },
  { value: "true_or_false", label: "Question: True / False" },
];
CONTENT_TYPES_HOST.push(...QUESTION_TYPES);
const CONTENT_TYPES_SCREEN2 = [...CONTENT_TYPES_SCREEN1, ...QUESTION_TYPES];
// Lookup map for display labels
const ALL_TYPE_LABELS = Object.fromEntries(
  [...CONTENT_TYPES_HOST, ...CONTENT_TYPES_SCREEN2].map((t) => [t.value, t.label]),
);

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ContentDef = { type: string; [k: string]: unknown };

type QuestionDef = {
  id: string;
  type: "multiple_choice" | "true_or_false";
  text: string;
  options?: string[];
  correct?: number;
  correct_tf?: boolean;
};

type SlotDef = {
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

type LessonRow = { id: string; title: string };

type ActiveScreen = "host" | "screen1" | "screen2";

type CtxMenuState = {
  x: number;
  y: number;
  slotId: string;
  sub: "end_behaviour" | "screen_delay" | null;
} | null;

type SaveStatus = "saved" | "saving" | "unsaved";

// ─────────────────────────────────────────────
// Route
// ─────────────────────────────────────────────

export const Route = createFileRoute("/admin/designer/$lessonId")({
  head: () => ({ meta: [{ title: "Stage Designer · Immersive Learning" }] }),
  component: DesignerPage,
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Timings are disabled: slots render at a fixed width.
function slotPx(_mins: number): number {
  return 140;
}

function makeSlot(lessonId: string, orderIndex: number): SlotDef {
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

function makeFeedbackSlot(lessonId: string, orderIndex: number): SlotDef {
  return {
    ...makeSlot(lessonId, orderIndex),
    end_behaviour: "screen2_submit",
    screen1_content: { type: "waiting" },
    screen2_content: { type: "confidence_checker", prompt: "How confident are you?" },
  };
}

async function uploadToStorage(
  file: File,
  lessonId: string,
): Promise<{ url: string; file_name: string } | null> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `lessons/${lessonId}/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from("lesson-media").upload(path, file);
  if (error) {
    console.error("Storage upload error:", error);
    return null;
  }
  const { data } = supabase.storage.from("lesson-media").getPublicUrl(path);
  return { url: data.publicUrl, file_name: file.name };
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

function DesignerPage() {
  const { lessonId } = Route.useParams();

  const [lesson, setLesson] = useState<LessonRow | null>(null);
  const [slots, setSlots] = useState<SlotDef[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("host");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [ctxMenu, setCtxMenu] = useState<CtxMenuState>(null);
  const [showMissingEndBehaviour, setShowMissingEndBehaviour] = useState(false);

  // Refs let the stable saveAll callback always see latest state
  const slotsRef = useRef<SlotDef[]>([]);
  const deletedIdsRef = useRef<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autoSaveTimer = useRef<any>(undefined);

  useEffect(() => { slotsRef.current = slots; }, [slots]);
  useEffect(() => { deletedIdsRef.current = deletedIds; }, [deletedIds]);
  useEffect(() => () => clearTimeout(autoSaveTimer.current), []);

  // Load lesson + design-time slots (session_id is null for designer slots)
  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: s }] = await Promise.all([
        supabase.from("lessons").select("id, title").eq("id", lessonId).single(),
        supabase
          .from("slots")
          .select("*")
          .eq("lesson_id", lessonId)
          .is("session_id", null)
          .order("order_index"),
      ]);
      if (l) setLesson(l as LessonRow);
      if (s) setSlots(s as unknown as SlotDef[]);
    })();
  }, [lessonId]);

  // ── Persistence ─────────────────────────────

  const saveAll = useCallback(async () => {
    setSaveStatus("saving");
    try {
      // Delete removed slots
      for (const id of deletedIdsRef.current) {
        const { error } = await supabase.from("slots").delete().eq("id", id);
        if (error) throw error;
      }
      // Batch upsert surviving slots
      if (slotsRef.current.length > 0) {
        const { error } = await supabase.from("slots").upsert(
          slotsRef.current.map((s) => ({
            id: s.id,
            lesson_id: s.lesson_id,
            session_id: null,
            order_index: s.order_index,
            duration_mins: s.duration_mins,
            end_behaviour: s.end_behaviour,
            pause_before_advance: s.pause_before_advance,
            lead_phase: s.lead_phase,
            name: s.name,
            screen_delay_secs: s.screen_delay_secs,
            host_content: s.host_content as never,
            screen1_content: s.screen1_content as never,
            screen2_content: s.screen2_content as never,
          })),
        );
        if (error) throw error;
      }
      setDeletedIds([]);
      setSaveStatus("saved");
    } catch (err) {
      console.error("[Designer] Save failed:", err);
      setSaveStatus("unsaved");
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? String(err);
      alert(`Save failed: ${msg}\n\nCheck the browser console for details.`);
    }
  }, []);

  const markDirty = useCallback(() => {
    setSaveStatus("unsaved");
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(saveAll, AUTOSAVE_DELAY);
  }, [saveAll]);

  const handleSave = () => {
    saveAll();
  };

  // ── Sync to active session ───────────────────

  const handleSync = async () => {
    if (slotsRef.current.length === 0) return;
    const { data: active } = await supabase
      .from("sessions")
      .select("id, current_slot_index")
      .eq("lesson_id", lessonId)
      .eq("status", "active");

    if (!active || active.length === 0) {
      alert("No active sessions found for this lesson.");
      return;
    }

    for (const sess of active as { id: string; current_slot_index: number }[]) {
      const slot = slotsRef.current[sess.current_slot_index] ?? slotsRef.current[0];
      if (!slot) continue;
      await supabase
        .from("sessions")
        .update({
          state: {
            slot: {
              host: slot.host_content,
              screen1: slot.screen1_content,
              screen2: slot.screen2_content,
            },
          } as never,
        })
        .eq("id", sess.id);
    }

    alert(`Synced to ${active.length} active session${active.length !== 1 ? "s" : ""}.`);
  };

  // ── Slot mutations ───────────────────────────

  const updateSlot = useCallback(
    (id: string, patch: Partial<SlotDef>) => {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      markDirty();
    },
    [markDirty],
  );

  const addSlot = useCallback(() => {
    setSlots((prev) => {
      const s = makeSlot(lessonId, prev.length);
      setSelectedId(s.id);
      return [...prev, s];
    });
    markDirty();
  }, [lessonId, markDirty]);

  const duplicateSlot = useCallback(
    (id: string) => {
      setSlots((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        if (idx === -1) return prev;
        const dup: SlotDef = { ...prev[idx], id: crypto.randomUUID() };
        const next = [...prev];
        next.splice(idx + 1, 0, dup);
        return next.map((s, i) => ({ ...s, order_index: i }));
      });
      markDirty();
    },
    [markDirty],
  );

  const deleteSlot = useCallback(
    (id: string) => {
      setDeletedIds((prev) => [...prev, id]);
      setSlots((prev) =>
        prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order_index: i })),
      );
      if (selectedId === id) setSelectedId(null);
      markDirty();
    },
    [selectedId, markDirty],
  );

  const insertFeedback = useCallback(
    (nearId: string, position: "before" | "after") => {
      setSlots((prev) => {
        const idx = prev.findIndex((s) => s.id === nearId);
        const at = position === "before" ? idx : idx + 1;
        const fb = makeFeedbackSlot(lessonId, at);
        const next = [...prev];
        next.splice(at, 0, fb);
        return next.map((s, i) => ({ ...s, order_index: i }));
      });
      markDirty();
    },
    [lessonId, markDirty],
  );

  const reorderSlots = useCallback(
    (fromId: string, toIndex: number) => {
      setSlots((prev) => {
        const fromIdx = prev.findIndex((s) => s.id === fromId);
        if (fromIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        const clampedTo = Math.max(0, Math.min(toIndex, next.length));
        next.splice(clampedTo, 0, moved);
        return next.map((s, i) => ({ ...s, order_index: i }));
      });
      markDirty();
    },
    [markDirty],
  );

  // ── File drop onto timeline ──────────────────

  const handleTimelineDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;

      setSlots((prev) => {
        // Placeholder — async video detection happens below
        return prev;
      });

      for (const file of files) {
        let durationMins = 10;
        const contentType = "image";

        if (file.type.startsWith("image/")) {
          durationMins = 10 / 60; // 10 seconds
        } else {
          continue; // ignore non-image files (video upload removed)
        }

        const s = makeSlot(lessonId, slotsRef.current.length);
        s.duration_mins = durationMins;
        s.host_content = { type: contentType, file_name: file.name };
        s.screen1_content = { type: contentType, file_name: file.name };
        s.screen2_content = { type: contentType, file_name: file.name };
        setSlots((prev) => [...prev, { ...s, order_index: prev.length }]);
      }
      markDirty();
    },
    [lessonId, markDirty],
  );

  // ── Context menu actions ─────────────────────

  const closeCtx = useCallback(() => setCtxMenu(null), []);

  useEffect(() => {
    document.addEventListener("click", closeCtx);
    return () => document.removeEventListener("click", closeCtx);
  }, [closeCtx]);

  const selectedSlot = slots.find((s) => s.id === selectedId) ?? null;

  return (
    <div
      className="h-screen flex flex-col bg-immersive overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <DesignerHeader
        lesson={lesson}
        saveStatus={saveStatus}
        showMissing={showMissingEndBehaviour}
        onSave={handleSave}
        onSync={handleSync}
      />

      {/* Screen mockups */}
      <ScreenMockupsRow
        activeScreen={activeScreen}
        selectedSlot={selectedSlot}
        onSelectScreen={setActiveScreen}
      />

      {/* Timeline + Editor (fills remaining height) */}
      <div className="flex flex-1 overflow-hidden border-t border-border/60">
        <Timeline
          slots={slots}
          selectedId={selectedId}
          showMissing={showMissingEndBehaviour}
          onSelect={setSelectedId}
          onAdd={addSlot}
          onDelete={deleteSlot}
          onReorder={reorderSlots}
          onDrop={handleTimelineDrop}
          onContextMenu={(e, id) => {
            e.preventDefault();
            setCtxMenu({ x: e.clientX, y: e.clientY, slotId: id, sub: null });
          }}
          updateSlot={updateSlot}
          markDirty={markDirty}
        />

        {/* Right panel — only shown when a slot is selected */}
        {selectedSlot && (
          <SlotEditorPanel
            slot={selectedSlot}
            lessonId={lessonId}
            activeScreen={activeScreen}
            showEndBehaviourError={showMissingEndBehaviour && !selectedSlot.end_behaviour}
            onActiveScreen={setActiveScreen}
            onUpdate={(patch) => updateSlot(selectedSlot.id, patch)}
          />
        )}
      </div>

      {/* Context menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          sub={ctxMenu.sub}
          currentSlot={slots.find((s) => s.id === ctxMenu.slotId)}
          onSetSub={(sub) => setCtxMenu((c) => (c ? { ...c, sub } : null))}
          onDuplicate={() => { duplicateSlot(ctxMenu.slotId); closeCtx(); }}
          onDelete={() => { deleteSlot(ctxMenu.slotId); closeCtx(); }}
          onInsertFeedbackBefore={() => { insertFeedback(ctxMenu.slotId, "before"); closeCtx(); }}
          onInsertFeedbackAfter={() => { insertFeedback(ctxMenu.slotId, "after"); closeCtx(); }}
          onSetEndBehaviour={(v) => { updateSlot(ctxMenu.slotId, { end_behaviour: v }); closeCtx(); }}
          onSetScreenDelay={(v) => { updateSlot(ctxMenu.slotId, { screen_delay_secs: v }); closeCtx(); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

function DesignerHeader({
  lesson,
  saveStatus,
  showMissing,
  onSave,
  onSync,
}: {
  lesson: LessonRow | null;
  saveStatus: SaveStatus;
  showMissing: boolean;
  onSave: () => void;
  onSync: () => void;
}) {
  const statusLabel =
    saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Unsaved";
  const statusColour =
    saveStatus === "saved"
      ? "text-[color:var(--success)]"
      : saveStatus === "saving"
        ? "text-[color:var(--cyan)]"
        : "text-[color:var(--orange)]";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-background/80 backdrop-blur shrink-0">
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="text-sm text-muted-foreground hover:text-[color:var(--cyan)] transition-colors uppercase tracking-widest"
        >
          ← Admin
        </Link>
        <div className="h-4 w-px bg-border" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--cyan)]">
            Stage Designer
          </div>
          <h1 className="text-lg font-extrabold leading-tight">
            {lesson?.title ?? "Loading…"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showMissing && (
          <span className="text-xs text-destructive uppercase tracking-widest animate-pulse">
            End behaviour missing
          </span>
        )}
        <span className={`text-xs uppercase tracking-widest ${statusColour}`}>
          {statusLabel}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onSync}
          className="h-9 px-4 uppercase tracking-widest text-xs"
        >
          Sync
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          className="h-9 px-5 uppercase tracking-widest text-xs"
        >
          Save
        </Button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// SCREEN MOCKUPS ROW
// ─────────────────────────────────────────────

function ScreenMockupsRow({
  activeScreen,
  selectedSlot,
  onSelectScreen,
}: {
  activeScreen: ActiveScreen;
  selectedSlot: SlotDef | null;
  onSelectScreen: (s: ActiveScreen) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-5 px-8 py-4 bg-background/40 border-b border-border/60 shrink-0">
      <ScreenMockup
        label="Student Screen 1"
        screen="screen1"
        role="screen"
        tag="1"
        isActive={activeScreen === "screen1"}
        content={selectedSlot?.screen1_content ?? null}
        size="side"
        onClick={() => onSelectScreen("screen1")}
      />
      <ScreenMockup
        label="Host · Teacher"
        screen="host"
        role="host"
        tag="H"
        isActive={activeScreen === "host"}
        content={selectedSlot?.host_content ?? null}
        size="host"
        onClick={() => onSelectScreen("host")}
      />
      <ScreenMockup
        label="Student Screen 2"
        screen="screen2"
        role="screen"
        tag="2"
        isActive={activeScreen === "screen2"}
        content={selectedSlot?.screen2_content ?? null}
        size="side"
        onClick={() => onSelectScreen("screen2")}
      />
    </div>
  );
}

function ScreenMockup({
  label,
  isActive,
  content,
  size,
  role,
  tag,
  onClick,
}: {
  label: string;
  screen: ActiveScreen;
  role: "host" | "screen";
  tag: "H" | "1" | "2";
  isActive: boolean;
  content: ContentDef | null;
  size: "host" | "side";
  onClick: () => void;
}) {
  // Host emphasised (larger), side screens slightly smaller. 16:9 aspect.
  const dims =
    size === "host"
      ? "w-[340px] h-[192px]"
      : "w-[220px] h-[124px]";

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 transition-all duration-200 shrink-0 overflow-hidden group
        ${dims}
        ${
          isActive
            ? "border-[color:var(--cyan)]"
            : "border-border/40 opacity-70 hover:opacity-100"
        }
        cursor-pointer
      `}
      style={
        isActive
          ? { boxShadow: "0 0 28px color-mix(in oklab, var(--cyan) 30%, transparent)" }
          : undefined
      }
    >
      <SlotThumbnail content={content} tag={tag} size="lg" role={role} showTag={false} />
      {/* Label chip overlay */}
      <span
        className={`absolute top-1.5 left-1.5 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm backdrop-blur z-10 ${
          isActive
            ? "bg-[color:var(--cyan)] text-background"
            : "bg-background/80 text-foreground/80"
        }`}
      >
        {label}
      </span>
      {/* Edit hint on hover */}
      <span className="absolute bottom-1.5 right-1.5 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm bg-background/70 text-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        Click to edit
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────────

function Timeline({
  slots,
  selectedId,
  showMissing,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
  onDrop,
  onContextMenu,
  updateSlot,
  markDirty,
}: {
  slots: SlotDef[];
  selectedId: string | null;
  showMissing: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReorder: (fromId: string, toIndex: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  updateSlot: (id: string, patch: Partial<SlotDef>) => void;
  markDirty: () => void;
}) {
  // Drag-to-reorder state (HTML5 DnD)
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // Resize disabled — timings removed
  const resizingId: string | null = null;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // File drop passes files; slot drag passes nothing in files
    if (e.dataTransfer.files.length > 0) {
      onDrop(e);
    } else if (dragId !== null && dropIndex !== null) {
      onReorder(dragId, dropIndex);
    }
    setDragId(null);
    setDropIndex(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background/20">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b border-border/40">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Timeline · {slots.length} slot{slots.length !== 1 ? "s" : ""}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onAdd}
          className="h-8 px-4 uppercase tracking-widest text-[10px]"
        >
          + Add Slot
        </Button>
      </div>

      {/* Scrollable track */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ cursor: resizingId ? "ew-resize" : "default" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-3 px-5 py-5 min-h-full min-w-max">
          {slots.length === 0 ? (
            <div className="flex items-center justify-center min-w-[480px] h-24 border-2 border-dashed border-border/40 rounded-2xl text-muted-foreground text-sm uppercase tracking-widest">
              Drop images / videos here, or click + Add Slot
            </div>
          ) : (
            <>
              {slots.map((slot, idx) => (
                <div key={slot.id} className="relative flex items-center">
                  {/* Insertion indicator before this slot */}
                  {dropIndex === idx && dragId && dragId !== slot.id && (
                    <InsertLine />
                  )}

                  <SlotBlock
                    slot={slot}
                    isSelected={slot.id === selectedId}
                    isResizing={slot.id === resizingId}
                    missingEnd={showMissing && !slot.end_behaviour}
                    onClick={() => onSelect(slot.id)}
                    onContextMenu={(e) => onContextMenu(e, slot.id)}
                    onDelete={() => onDelete(slot.id)}
                    onResizeStart={() => {}}
                    onNameChange={(name) => updateSlot(slot.id, { name })}
                    onDragStart={(e) => {
                      setDragId(slot.id);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", slot.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setDropIndex(e.clientX < rect.left + rect.width / 2 ? idx : idx + 1);
                    }}
                    onDragLeave={() => setDropIndex(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragId) onReorder(dragId, dropIndex ?? idx);
                      setDragId(null);
                      setDropIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setDropIndex(null);
                    }}
                  />
                </div>
              ))}

              {/* Insertion indicator at end */}
              {dropIndex === slots.length && dragId && <InsertLine />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InsertLine() {
  return (
    <div className="w-0.5 h-20 rounded-full bg-[color:var(--cyan)] mx-1 animate-pulse shrink-0" />
  );
}

// ── Individual slot block ─────────────────────

function SlotBlock({
  slot,
  isSelected,
  isResizing,
  missingEnd,
  onClick,
  onContextMenu,
  onDelete,
  onResizeStart,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onNameChange,
}: {
  slot: SlotDef;
  isSelected: boolean;
  isResizing: boolean;
  missingEnd: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  onDragStart: React.DragEventHandler;
  onDragOver: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onDragEnd: React.DragEventHandler;
  onNameChange: (name: string | null) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(slot.name ?? "");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Fixed thumbnail card width — independent of duration so the timeline
  // looks like a slide sorter rather than a Gantt chart.
  const width = 168;

  const commitName = () => {
    setEditingName(false);
    onNameChange(nameInput.trim() || null);
  };

  return (
    <div
      draggable={!editingName}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group relative rounded-xl border-2 transition-all duration-150 select-none overflow-hidden cursor-pointer
        ${
          isSelected
            ? "border-[color:var(--cyan)] shadow-[0_0_18px_color-mix(in_oklab,var(--cyan)_35%,transparent)]"
            : missingEnd
              ? "border-destructive"
              : "border-border hover:border-[color:var(--cyan)]/60 hover:shadow-[0_0_14px_color-mix(in_oklab,var(--cyan)_20%,transparent)]"
        }
        ${isResizing ? "opacity-80" : ""}
        bg-card/80 backdrop-blur shrink-0
      `}
      style={{ width: `${width}px` }}
    >
      {/* Delete button — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Delete slot"
        className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>

      <div className="px-2 pt-2 pb-2 flex flex-col gap-1.5">
        {/* Slot index */}
        <div className="text-[8px] uppercase tracking-widest text-muted-foreground/70 font-bold leading-none pl-0.5">
          Slot {slot.order_index + 1}
        </div>

        {/* Stacked screen previews: host on top, S1 + S2 below */}
        <SlotStackThumbnail
          host={slot.host_content}
          s1={slot.screen1_content}
          s2={slot.screen2_content}
        />

        {/* Inline slot name — click to edit */}
        {editingName ? (
          <input
            ref={nameInputRef}
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitName(); }
              if (e.key === "Escape") { setEditingName(false); setNameInput(slot.name ?? ""); }
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Name…"
            className="w-full text-[10px] bg-background/80 border border-[color:var(--cyan)] rounded px-1 py-0.5 outline-none text-foreground"
          />
        ) : (
          <div
            className="text-[10px] text-muted-foreground truncate leading-tight cursor-text hover:text-foreground transition-colors px-0.5"
            title="Click to name slot"
            onClick={(e) => { e.stopPropagation(); setNameInput(slot.name ?? ""); setEditingName(true); }}
          >
            {slot.name || <span className="opacity-40 italic">name…</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentPip({ type, label }: { type: string; label: string }) {
  const active = type && type !== "waiting";
  return (
    <div
      className={`text-[8px] font-bold rounded px-1 leading-[14px] uppercase ${
        active
          ? "bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]"
          : "bg-border/30 text-muted-foreground"
      }`}
    >
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTEXT MENU
// ─────────────────────────────────────────────

function ContextMenu({
  x,
  y,
  sub,
  currentSlot,
  onSetSub,
  onDuplicate,
  onDelete,
  onInsertFeedbackBefore,
  onInsertFeedbackAfter,
  onSetEndBehaviour,
  onSetScreenDelay,
}: {
  x: number;
  y: number;
  sub: "end_behaviour" | "screen_delay" | null;
  currentSlot?: SlotDef;
  onSetSub: (s: "end_behaviour" | "screen_delay" | null) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onInsertFeedbackBefore: () => void;
  onInsertFeedbackAfter: () => void;
  onSetEndBehaviour: (v: string) => void;
  onSetScreenDelay: (v: number) => void;
}) {
  const left = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 800) - 228);
  const top = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 600) - 320);

  return (
    <div
      className="fixed z-50 w-56 bg-card border border-border rounded-xl shadow-2xl py-1 text-sm"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <CtxItem onClick={onDuplicate}>Duplicate</CtxItem>
      <CtxItem onClick={onInsertFeedbackBefore}>Insert feedback before</CtxItem>
      <CtxItem onClick={onInsertFeedbackAfter}>Insert feedback after</CtxItem>

      <div className="my-1 border-t border-border/50" />

      {/* Side screen delay submenu */}
      <div className="relative">
        <CtxItem
          onClick={() => onSetSub(sub === "screen_delay" ? null : "screen_delay")}
          arrow
          active={sub === "screen_delay"}
        >
          Side screen delay
        </CtxItem>
        {sub === "screen_delay" && (
          <div className="absolute left-full top-0 w-40 bg-card border border-border rounded-xl shadow-2xl py-1 ml-1">
            {[0, 5, 10, 15].map((secs) => (
              <CtxItem
                key={secs}
                onClick={() => onSetScreenDelay(secs)}
                checked={(currentSlot?.screen_delay_secs ?? 0) === secs}
              >
                {secs === 0 ? "No delay" : `${secs} seconds`}
              </CtxItem>
            ))}
          </div>
        )}
      </div>

      <div className="my-1 border-t border-border/50" />
      <CtxItem onClick={onDelete} danger>
        Delete slot
      </CtxItem>
    </div>
  );
}

function CtxItem({
  children,
  onClick,
  danger,
  active,
  checked,
  arrow,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
  checked?: boolean;
  arrow?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between gap-2
        ${danger ? "text-destructive hover:bg-destructive/10" : "hover:bg-accent text-foreground"}
        ${active ? "bg-accent" : ""}
      `}
    >
      <span className={checked ? "font-bold" : ""}>{children}</span>
      <span className="text-muted-foreground shrink-0">
        {checked ? "✓" : arrow ? "›" : ""}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// QUESTION MODAL
// Full question editor: create / edit questions, save to resource bucket or
// insert directly into the active slot (sets all three screen contents at once).
// ─────────────────────────────────────────────

function blankQuestion(type: QuestionDef["type"]): QuestionDef {
  return {
    id: crypto.randomUUID(),
    type,
    text: "",
    options: type === "multiple_choice" ? ["", ""] : undefined,
    correct: type === "multiple_choice" ? 0 : undefined,
    correct_tf: type === "true_or_false" ? true : undefined,
  };
}

// Merge a (possibly partial or legacy) question / slot-content into a complete
// QuestionDef so the editor never reads undefined fields (the cause of the
// "Configure" crash). Legacy poll/likert collapse to multiple_choice.
function normalizeQuestion(initial: QuestionDef | null): QuestionDef {
  const type: QuestionDef["type"] =
    initial?.type === "true_or_false" ? "true_or_false" : "multiple_choice";
  return { ...blankQuestion(type), ...(initial ?? {}), type, text: initial?.text ?? "" };
}

// Turn incoming slot content into a list of questions (a "round").
// Accepts a question_round, a single legacy question, or nothing.
function normalizeRound(initial: ContentDef | null): QuestionDef[] {
  const anyInit = initial as { type?: string; questions?: QuestionDef[] } | null;
  if (anyInit && Array.isArray(anyInit.questions) && anyInit.questions.length > 0) {
    return anyInit.questions.map((qq) => normalizeQuestion(qq));
  }
  if (anyInit && (anyInit.type === "multiple_choice" || anyInit.type === "true_or_false")) {
    return [normalizeQuestion(anyInit as unknown as QuestionDef)];
  }
  return [blankQuestion("multiple_choice")];
}

function QuestionModal({
  open,
  initial,
  onClose,
  onInsert,
  onSave,
}: {
  open: boolean;
  initial: ContentDef | null;
  onClose: () => void;
  onInsert: (questions: QuestionDef[]) => void;
  onSave: (questions: QuestionDef[]) => Promise<void>;
}) {
  const [questions, setQuestions] = useState<QuestionDef[]>(() => normalizeRound(initial));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setQuestions(normalizeRound(initial));
  }, [open, initial]);

  const updateQ = (i: number, patch: Partial<QuestionDef>) =>
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const setType = (i: number, type: QuestionDef["type"]) =>
    setQuestions((qs) => qs.map((q, j) => (j === i ? blankQuestion(type) : q)));
  const setOption = (i: number, oi: number, val: string) =>
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, options: (q.options ?? []).map((o, k) => (k === oi ? val : o)) } : q)));
  const addOption = (i: number) =>
    setQuestions((qs) => qs.map((q, j) => (j === i && (q.options?.length ?? 0) < 6 ? { ...q, options: [...(q.options ?? []), ""] } : q)));
  const removeOption = (i: number, oi: number) =>
    setQuestions((qs) =>
      qs.map((q, j) => {
        if (j !== i) return q;
        const options = (q.options ?? []).filter((_, k) => k !== oi);
        return { ...q, options, correct: Math.min(q.correct ?? 0, Math.max(0, options.length - 1)) };
      }),
    );
  const addQuestion = () => setQuestions((qs) => [...qs, blankQuestion("multiple_choice")]);
  const removeQuestion = (i: number) => setQuestions((qs) => (qs.length > 1 ? qs.filter((_, j) => j !== i) : qs));

  const qValid = (q: QuestionDef) =>
    (q.text ?? "").trim().length > 0 &&
    (q.type === "multiple_choice"
      ? (q.options?.length ?? 0) >= 2 && (q.options ?? []).every((o) => o.trim().length > 0)
      : true);
  const isValid = questions.length > 0 && questions.every(qValid);

  const handleSave = async () => {
    setSaving(true);
    await onSave(questions);
    setSaving(false);
  };

  const TYPES: { value: QuestionDef["type"]; label: string }[] = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_or_false", label: "True / False" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--cyan)] uppercase tracking-[0.4em] text-sm font-extrabold">
            Question Round
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <p className="text-[10px] text-muted-foreground">
            Add one or more questions. In the session the Host reveals each question's
            results, then taps Next to move everyone to the next one.
          </p>

          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border bg-background/40 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] font-bold">
                  Question {i + 1}
                </Label>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(i)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setType(i, value)}
                    className={`px-3 py-2 rounded-lg border text-[10px] uppercase tracking-widest font-bold transition-colors
                      ${q.type === value
                        ? "border-[color:var(--cyan)] text-[color:var(--cyan)] bg-[color:var(--cyan)]/10"
                        : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Question text */}
              <Textarea
                value={q.text}
                onChange={(e) => updateQ(i, { text: e.target.value })}
                placeholder="Enter your question…"
                rows={2}
                className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)] resize-none"
              />

              {/* multiple_choice options */}
              {q.type === "multiple_choice" && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Options — click circle to mark correct
                  </Label>
                  {(q.options ?? []).map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => updateQ(i, { correct: oi })}
                        title="Mark as correct"
                        className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors
                          ${q.correct === oi
                            ? "border-[color:var(--success)] bg-[color:var(--success)]"
                            : "border-border hover:border-[color:var(--success)]/60"
                          }`}
                      />
                      <span className="text-[10px] font-bold text-muted-foreground w-4 shrink-0 text-center">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <Input
                        value={opt}
                        onChange={(e) => setOption(i, oi, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oi)}…`}
                        className="flex-1 h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
                      />
                      {(q.options?.length ?? 0) > 2 && (
                        <button
                          onClick={() => removeOption(i, oi)}
                          className="text-muted-foreground hover:text-destructive transition-colors text-lg leading-none shrink-0 px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {(q.options?.length ?? 0) < 6 && (
                    <button
                      onClick={() => addOption(i)}
                      className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] hover:opacity-70 transition-opacity"
                    >
                      + Add option
                    </button>
                  )}
                </div>
              )}

              {/* true_or_false */}
              {q.type === "true_or_false" && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Correct answer</Label>
                  <div className="flex gap-3">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => updateQ(i, { correct_tf: v })}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-extrabold uppercase tracking-widest transition-colors
                          ${q.correct_tf === v
                            ? v
                              ? "border-[color:var(--success)] text-[color:var(--success)] bg-[color:var(--success)]/10"
                              : "border-destructive text-destructive bg-destructive/10"
                            : "border-border text-muted-foreground hover:border-border/80"
                          }`}
                      >
                        {v ? "True" : "False"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-border text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:border-[color:var(--cyan)]/50 hover:text-[color:var(--cyan)] transition-colors"
          >
            + Add another question
          </button>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 uppercase tracking-widest text-[10px]"
              disabled={!isValid || saving}
              onClick={handleSave}
            >
              {saving ? "Saving…" : "Save to bucket"}
            </Button>
            <Button
              size="sm"
              className="flex-1 h-10 uppercase tracking-widest text-[10px]"
              disabled={!isValid}
              onClick={() => onInsert(questions)}
            >
              {questions.length > 1 ? `Insert ${questions.length} questions` : "Insert into slot"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// SLOT EDITOR PANEL
// ─────────────────────────────────────────────

function SlotEditorPanel({
  slot,
  lessonId,
  activeScreen,
  showEndBehaviourError,
  onActiveScreen,
  onUpdate,
}: {
  slot: SlotDef;
  lessonId: string;
  activeScreen: ActiveScreen;
  showEndBehaviourError: boolean;
  onActiveScreen: (s: ActiveScreen) => void;
  onUpdate: (patch: Partial<SlotDef>) => void;
}) {
  // Question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ContentDef | null>(null);

  const handleInsertQuestion = (questions: QuestionDef[]) => {
    // A question round drives all three screens: Host shows live results + controls,
    // both touch screens collect answers. Use separate objects per screen.
    onUpdate({
      host_content: { type: "question_round", questions } as ContentDef,
      screen1_content: { type: "question_round", questions } as ContentDef,
      screen2_content: { type: "question_round", questions } as ContentDef,
      end_behaviour: "screen2_submit",
    });
    setQuestionModalOpen(false);
  };

  const handleSaveToResourceBucket = async (questions: QuestionDef[]) => {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("resource_bucket")
      .eq("id", lessonId)
      .single();
    let updated = (lesson?.resource_bucket as QuestionDef[] | null) ?? [];
    for (const q of questions) {
      updated = updated.some((r) => r.id === q.id)
        ? updated.map((r) => (r.id === q.id ? q : r))
        : [...updated, q];
    }
    await supabase
      .from("lessons")
      .update({ resource_bucket: updated as never })
      .eq("id", lessonId);
  };

  // Timings removed — duration controls disabled.


  // The content object + updater for the active screen
  const screenContent =
    activeScreen === "host"
      ? slot.host_content
      : activeScreen === "screen1"
        ? slot.screen1_content
        : slot.screen2_content;

  const setContentType = (type: string) => {
    if (activeScreen === "host") onUpdate({ host_content: { ...screenContent, type } });
    else if (activeScreen === "screen1")
      onUpdate({ screen1_content: { ...screenContent, type } });
    else onUpdate({ screen2_content: { ...screenContent, type } });
  };

  const onContentUpdate = (patch: Record<string, unknown>) => {
    if (activeScreen === "host")
      onUpdate({ host_content: { ...screenContent, ...patch } });
    else if (activeScreen === "screen1")
      onUpdate({ screen1_content: { ...screenContent, ...patch } });
    else onUpdate({ screen2_content: { ...screenContent, ...patch } });
  };

  const typeOptions =
    activeScreen === "host"
      ? CONTENT_TYPES_HOST
      : activeScreen === "screen1"
        ? CONTENT_TYPES_SCREEN1
        : CONTENT_TYPES_SCREEN2;

  const SCREENS: { key: ActiveScreen; label: string }[] = [
    { key: "host", label: "Host" },
    { key: "screen1", label: "TS1" },
    { key: "screen2", label: "TS2" },
  ];

  return (
    <div className="w-80 shrink-0 border-l border-border/60 bg-background/60 backdrop-blur flex flex-col overflow-hidden">
      {/* Screen selector tabs */}
      <div className="grid grid-cols-3 border-b border-border/60 shrink-0">
        {SCREENS.map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => onActiveScreen(key)}
            className={`py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-b-2
              ${activeScreen === key ? "border-[color:var(--cyan)] text-[color:var(--cyan)]" : "border-transparent text-muted-foreground hover:text-foreground"}
              ${i < 2 ? "border-r border-r-border/40" : ""}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content type selector (changes per active screen) */}
      <div className="px-5 py-4 border-b border-border/60 space-y-2 shrink-0">
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Content type
        </Label>
        <Select value={screenContent.type} onValueChange={setContentType}>
          <SelectTrigger className="bg-background/60 border-border focus:border-[color:var(--cyan)] focus:ring-[color:var(--cyan)]">
            <SelectValue placeholder="Select type…" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {typeOptions.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question modal — portal-rendered outside the panel scroll */}
      <QuestionModal
        open={questionModalOpen}
        initial={editingQuestion}
        onClose={() => setQuestionModalOpen(false)}
        onInsert={handleInsertQuestion}
        onSave={handleSaveToResourceBucket}
      />

      {/* Shared slot settings (scrollable) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Mirror TS2 content from TS1 */}
        {activeScreen === "screen2" && (
          <div className="flex items-center justify-between py-2 px-3 bg-[color:var(--cyan)]/5 border border-[color:var(--cyan)]/20 rounded-xl">
            <Label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] cursor-pointer">
              Mirror TS1 → TS2
            </Label>
            <Switch
              checked={
                JSON.stringify(slot.screen2_content) === JSON.stringify(slot.screen1_content)
              }
              onCheckedChange={(v) => {
                if (v) onUpdate({ screen2_content: { ...slot.screen1_content } });
              }}
            />
          </div>
        )}

        {/* Content type configuration form */}
        <ContentTypeForm
          content={screenContent}
          screen={activeScreen}
          lessonId={lessonId}
          onChange={onContentUpdate}
          onOpenQuestionModal={(existing) => {
            setEditingQuestion(existing ?? null);
            setQuestionModalOpen(true);
          }}
        />

        {/* Mirror Host content to all 3 screens */}
        {activeScreen === "host" && (
          <div className="flex items-center justify-between py-2 px-3 bg-[color:var(--cyan)]/5 border border-[color:var(--cyan)]/20 rounded-xl">
            <Label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] cursor-pointer">
              Mirror on all 3 screens
            </Label>
            <Switch
              checked={
                JSON.stringify(slot.screen1_content) === JSON.stringify(slot.host_content) &&
                JSON.stringify(slot.screen2_content) === JSON.stringify(slot.host_content)
              }
              onCheckedChange={(v) => {
                if (v) {
                  onUpdate({
                    screen1_content: { ...slot.host_content },
                    screen2_content: { ...slot.host_content },
                  });
                }
              }}
            />
          </div>
        )}

        <div className="border-t border-border/40" />


        <p className="text-[10px] text-muted-foreground">
          Click a slot in the timeline to rename it. Right-click to set side screen delay.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTENT TYPE FORM
// Renders the appropriate editor fields for the active screen's content type.
// ─────────────────────────────────────────────

function ContentTypeForm({
  content,
  screen,
  lessonId,
  onChange,
  onOpenQuestionModal,
}: {
  content: ContentDef;
  screen: ActiveScreen;
  lessonId: string;
  onChange: (patch: Record<string, unknown>) => void;
  onOpenQuestionModal?: (existing?: ContentDef) => void;
}) {
  switch (content.type) {
    case "waiting":
      return (
        <div className="py-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          No configuration needed
        </div>
      );

    case "text_slide":
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Text
            </Label>
            <Input
              value={String(content.text ?? "")}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Main text…"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Subtitle (optional)
            </Label>
            <Textarea
              value={String(content.subtitle ?? "")}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Subtitle… (multiple lines allowed)"
              rows={4}
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)] min-h-[100px] resize-y"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Size
            </Label>
            <Select
              value={String(content.size ?? "xl")}
              onValueChange={(v) => onChange({ size: v })}
            >
              <SelectTrigger className="bg-background/60 border-border focus:border-[color:var(--cyan)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {(["sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Colour
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={String(content.color ?? "#e2f4ff")}
                onChange={(e) => onChange({ color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-muted-foreground">
                {String(content.color ?? "default")}
              </span>
              <button
                onClick={() => onChange({ color: undefined })}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      );

    case "youtube":
      return (
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            YouTube URL
          </Label>
          <Input
            value={String(content.url ?? "")}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
            className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
          />
          <p className="text-[10px] text-muted-foreground">
            Host plays with audio. Other screens auto-muted.
          </p>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Title (optional)
            </Label>
            <Input
              value={String(content.title ?? "")}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Activity 1 — Sort the cards"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <FileUploadField
            label="Image file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            currentFileName={content.file_name ? String(content.file_name) : undefined}
            lessonId={lessonId}
            maxSizeMb={50}
            onUpload={(url, file_name) => onChange({ url, file_name })}
          />
        </div>
      );

    case "embed": {
      const extractUrl = (raw: string): string => {
        const trimmed = raw.trim();
        const match = trimmed.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i);
        if (match) return match[1];
        return trimmed;
      };
      return (
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            URL or embed code
          </Label>
          <Input
            value={String(content.url ?? "")}
            onChange={(e) => onChange({ url: extractUrl(e.target.value) })}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              const extracted = extractUrl(pasted);
              if (extracted !== pasted) {
                e.preventDefault();
                onChange({ url: extracted });
              }
            }}
            placeholder="https://… or paste full <iframe> snippet"
            className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
          />
          <p className="text-[10px] text-muted-foreground">
            Paste a URL or the full embed code — we extract the src automatically.
          </p>
        </div>
      );
    }

    case "webpage":
      return (
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Webpage URL
          </Label>
          <Input
            value={String(content.url ?? "")}
            onChange={(e) => onChange({ url: e.target.value.trim() })}
            placeholder="https://example.com"
            className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
          />
          <p className="text-[10px] text-muted-foreground">
            Loaded through a server proxy so sites that block iframes still render.
            Logins, OAuth, and anti-bot pages won't work.
          </p>
        </div>
      );

    case "html_upload":
      return (
        <FileUploadField
          label="HTML file"
          accept=".html,.htm"
          currentFileName={content.file_name ? String(content.file_name) : undefined}
          lessonId={lessonId}
          maxSizeMb={10}
          onUpload={(url, file_name) => onChange({ url, file_name })}
        />
      );

    case "confidence_checker": {
      const ccMode =
        content.scale_mode === "emoji" ? "emoji" :
        content.scale_mode === "likert" ? "likert" : "numbers";
      const ccMax = Math.min(10, Math.max(2, Math.round(Number(content.max ?? 5))));
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Prompt
            </Label>
            <Input
              value={String(content.prompt ?? "")}
              onChange={(e) => onChange({ prompt: e.target.value })}
              placeholder="How confident are you?"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Scale type
            </Label>
            <Select
              value={ccMode}
              onValueChange={(v) => onChange({ scale_mode: v })}
            >
              <SelectTrigger className="bg-background/60 border-border focus:border-[color:var(--cyan)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numbers">Numbers (1 → N)</SelectItem>
                <SelectItem value="emoji">Emoji faces (😡 → 😄)</SelectItem>
                <SelectItem value="likert">Likert (Strongly disagree → Strongly agree)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {ccMode === "numbers" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Highest number (2–10)
              </Label>
              <Input
                type="number"
                min={2}
                max={10}
                value={ccMax}
                onChange={(e) =>
                  onChange({ max: Math.max(2, Math.min(10, Number(e.target.value) || 5)) })
                }
                className="w-24 bg-background/60 border-border focus-visible:border-[color:var(--cyan)] text-center"
              />
              <p className="text-[10px] text-muted-foreground">
                Students pick from 1 to {ccMax}.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer">
              Optional qualitative input
            </Label>
            <Switch
              checked={Boolean(content.optional_qualitative)}
              onCheckedChange={(v) => onChange({ optional_qualitative: v })}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Each touch screen labels responders “Person 1, 2, 3…” — submit, take the next
            person, then tap “That's everyone” to finish. Host shows a live bar chart.
          </p>
        </div>
      );
    }

    case "voting": {
      const opts = (content.options as string[] | undefined) ?? ["", ""];
      const setOpt = (i: number, v: string) => {
        const next = [...opts];
        next[i] = v;
        onChange({ options: next });
      };
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Question</Label>
            <Input
              value={String(content.question ?? "")}
              onChange={(e) => onChange({ question: e.target.value })}
              placeholder="What should we do next?"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Options (2–4)</Label>
            <div className="space-y-1.5">
              {opts.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={o}
                    onChange={(e) => setOpt(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
                  />
                  {opts.length > 2 && (
                    <button
                      onClick={() => onChange({ options: opts.filter((_, j) => j !== i) })}
                      className="text-muted-foreground hover:text-destructive text-lg px-1"
                    >×</button>
                  )}
                </div>
              ))}
            </div>
            {opts.length < 4 && (
              <Button size="sm" variant="outline" className="h-8 text-[10px] uppercase tracking-widest w-full"
                onClick={() => onChange({ options: [...opts, ""] })}>
                + Add option
              </Button>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px]"
                onClick={() => onChange({ options: ["Yes", "No"] })}>Yes / No</Button>
              <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px]"
                onClick={() => onChange({ options: ["A", "B", "C", "D"] })}>A / B / C / D</Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Place on all 3 screens (use Mirror) — Host shows live bars, touch screens show vote buttons.
          </p>
        </div>
      );
    }

    case "quiz_buzzer":
      return (
        <div className="space-y-3">
          <QuizQuestionsEditor
            questions={
              Array.isArray(content.questions)
                ? (content.questions as string[])
                : content.question
                  ? [String(content.question)]
                  : []
            }
            answers={Array.isArray(content.answers) ? (content.answers as string[]) : []}
            onChange={(questions, answers) =>
              onChange({ questions, answers, question: questions[0] ?? "" })
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Team 1 name</Label>
              <Input
                value={String(content.team1_name ?? "")}
                onChange={(e) => onChange({ team1_name: e.target.value })}
                placeholder="Team 1"
                className="h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Team 2 name</Label>
              <Input
                value={String(content.team2_name ?? "")}
                onChange={(e) => onChange({ team2_name: e.target.value })}
                placeholder="Team 2"
                className="h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Place on all 3 screens (use Mirror). TS1 = Team 1 buzzer, TS2 = Team 2 buzzer. Host shows scores + controls and a "Next Question" button.
          </p>
        </div>
      );

    case "wheel_spinner":
      return (
        <WheelItemsEditor
          items={(content.items as string[] | undefined) ?? []}
          onChange={(items) => onChange({ items })}
        />
      );

    case "countdown_timer": {
      const durationSecs = Number(content.duration_secs ?? 60);
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;
      return (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Label (optional)
            </Label>
            <Input
              value={String(content.label ?? "")}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="e.g. You have 2 minutes to complete this task…"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Duration
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={mins}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(99, Number(e.target.value) || 0));
                    onChange({ duration_secs: m * 60 + secs });
                  }}
                  className="w-16 bg-background/60 border-border focus-visible:border-[color:var(--cyan)] text-center"
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={secs}
                  onChange={(e) => {
                    const s = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                    onChange({ duration_secs: mins * 60 + s });
                  }}
                  className="w-16 bg-background/60 border-border focus-visible:border-[color:var(--cyan)] text-center"
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">sec</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Host controls Start / Pause / Reset. Timer syncs to all screens.
            </p>
          </div>
        </div>
      );
    }

    case "host_timer": {
      if (screen !== "host") {
        return (
          <div className="py-3 text-center text-[10px] uppercase tracking-widest text-[color:var(--orange)]">
            Host Timer only renders on the Host display
          </div>
        );
      }
      const durationSecs = Number(content.duration_secs ?? 60);
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;
      return (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Text above timer (optional)
            </Label>
            <Input
              value={String(content.label ?? "")}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="e.g. Complete the task in…"
              className="bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Duration
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={mins}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(99, Number(e.target.value) || 0));
                    onChange({ duration_secs: m * 60 + secs });
                  }}
                  className="w-16 bg-background/60 border-border focus-visible:border-[color:var(--cyan)] text-center"
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={secs}
                  onChange={(e) => {
                    const s = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                    onChange({ duration_secs: mins * 60 + s });
                  }}
                  className="w-16 bg-background/60 border-border focus-visible:border-[color:var(--cyan)] text-center"
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">sec</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Timer is local to the Host display only — side screens are not affected.
            </p>
          </div>
        </div>
      );
    }

    case "multiple_choice":
    case "true_or_false":
    case "question_round": {
      const roundQs = Array.isArray((content as Record<string, unknown>).questions)
        ? ((content as Record<string, unknown>).questions as unknown[])
        : null;
      const summary = roundQs
        ? `Round of ${roundQs.length} question${roundQs.length !== 1 ? "s" : ""}`
        : content.text
          ? String(content.text)
          : null;
      return (
        <div className="py-2 space-y-2">
          {summary ? (
            <div className="text-xs text-foreground bg-card/60 rounded-lg px-3 py-2 truncate">
              {summary}
            </div>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            className="w-full h-9 uppercase tracking-widest text-[10px]"
            onClick={() => onOpenQuestionModal?.(content)}
          >
            {summary ? "Edit questions ›" : "Configure questions ›"}
          </Button>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// FILE UPLOAD FIELD
// Handles Supabase Storage uploads for video, image, and HTML files.
// ─────────────────────────────────────────────

function FileUploadField({
  label,
  accept,
  currentFileName,
  lessonId,
  maxSizeMb,
  onUpload,
}: {
  label: string;
  accept: string;
  currentFileName?: string;
  lessonId: string;
  maxSizeMb: number;
  onUpload: (url: string, file_name: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setUploadError(`File too large (max ${maxSizeMb} MB)`);
      return;
    }
    setUploadError(null);
    setUploading(true);
    const result = await uploadToStorage(file, lessonId);
    setUploading(false);
    if (!result) {
      setUploadError("Upload failed — try again");
      return;
    }
    onUpload(result.url, result.file_name);
  };

  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {currentFileName && (
        <div className="flex items-center gap-2 text-xs text-[color:var(--success)] bg-[color:var(--success)]/10 rounded-lg px-3 py-2">
          <span className="shrink-0">✓</span>
          <span className="truncate">{currentFileName}</span>
        </div>
      )}
      <label
        className={`flex items-center justify-center h-10 px-4 rounded-lg border border-dashed cursor-pointer text-[10px] uppercase tracking-widest transition-colors
          ${uploading
            ? "border-[color:var(--cyan)] text-[color:var(--cyan)] animate-pulse"
            : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"
          }`}
      >
        {uploading ? "Uploading…" : currentFileName ? "Replace file" : "Choose file"}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      {uploadError && (
        <p className="text-[10px] text-destructive">{uploadError}</p>
      )}
      <p className="text-[10px] text-muted-foreground">Max {maxSizeMb} MB</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// WHEEL ITEMS EDITOR
// Add / edit / remove items for the wheel spinner content type.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// WHEEL ITEMS EDITOR
function WheelItemsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
        Items ({items.length})
      </Label>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
            />
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-muted-foreground hover:text-destructive transition-colors text-lg leading-none shrink-0 px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add item and press Enter…"
          className="flex-1 h-8 text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
        />
        <button
          onClick={addItem}
          className="px-3 h-8 border border-border rounded-md text-sm hover:border-[color:var(--cyan)] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Multi-question editor for Quiz Buzzer. Stores questions + parallel answers.
function QuizQuestionsEditor({
  questions,
  answers,
  onChange,
}: {
  questions: string[];
  answers: string[];
  onChange: (questions: string[], answers: string[]) => void;
}) {
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const normAnswers = (qs: string[], as: string[]) => {
    const out = qs.map((_, i) => as[i] ?? "");
    return out;
  };
  const addQ = () => {
    const t = newQ.trim();
    if (!t) return;
    const nextQs = [...questions, t];
    const nextAs = [...normAnswers(questions, answers), newA.trim()];
    onChange(nextQs, nextAs);
    setNewQ("");
    setNewA("");
  };
  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
        Questions ({questions.length}) — answers shown only on host's phone remote
      </Label>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-2 rounded-md border border-border/60 p-1.5 bg-background/30">
            <span className="text-[10px] font-bold text-muted-foreground mt-2 w-5 text-right shrink-0">{i + 1}.</span>
            <div className="flex-1 space-y-1">
              <Textarea
                value={q}
                onChange={(e) => {
                  const next = [...questions];
                  next[i] = e.target.value;
                  onChange(next, normAnswers(next, answers));
                }}
                rows={2}
                placeholder="Question"
                className="text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
              />
              <Input
                value={answers[i] ?? ""}
                onChange={(e) => {
                  const next = normAnswers(questions, answers);
                  next[i] = e.target.value;
                  onChange(questions, next);
                }}
                placeholder="✓ Correct answer (private — phone only)"
                className="h-8 text-xs bg-[color:var(--success)]/5 border-[color:var(--success)]/30 focus-visible:border-[color:var(--success)]"
              />
            </div>
            <button
              onClick={() => {
                const nextQs = questions.filter((_, j) => j !== i);
                const nextAs = normAnswers(questions, answers).filter((_, j) => j !== i);
                onChange(nextQs, nextAs);
              }}
              className="text-muted-foreground hover:text-destructive transition-colors text-lg leading-none shrink-0 px-1 mt-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-1 rounded-md border border-dashed border-border p-1.5">
        <Textarea
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              addQ();
            }
          }}
          rows={2}
          placeholder="Add a question… (⌘/Ctrl+Enter to add)"
          className="text-xs bg-background/60 border-border focus-visible:border-[color:var(--cyan)]"
        />
        <div className="flex gap-2">
          <Input
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            placeholder="Correct answer (optional)"
            className="h-8 text-xs bg-[color:var(--success)]/5 border-[color:var(--success)]/30 focus-visible:border-[color:var(--success)]"
          />
          <button
            onClick={addQ}
            className="px-3 h-8 border border-border rounded-md text-sm hover:border-[color:var(--cyan)] transition-colors shrink-0"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

