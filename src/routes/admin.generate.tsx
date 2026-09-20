// AI session generator — /admin/generate
//
// Renders behind the parent /admin PIN gate (this route renders through the
// admin route's Outlet, which returns PinEntry until unlocked).
//
// Flow: brief form -> parse any documents in the browser -> generate-session
// edge function -> repair + validate -> review screen -> write the lesson.
// Nothing touches the database until the tutor presses Create lesson.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeneratedSessionReview } from "@/components/GeneratedSessionReview";
import { extractDocumentRich } from "@/lib/documentParser";
import { applyImageToSession, fetchImage, type ImageSource } from "@/lib/fetchImage";
import { generateSession } from "@/lib/generateSession";
import { repairAndValidate, type RepairWarning } from "@/lib/sessionRepair";
import { writeGeneratedSession } from "@/lib/sessionWriter";
import { DEPARTMENTS, LEVELS, type Brief, type GeneratedSession } from "@/lib/sessionSchema";

export const Route = createFileRoute("/admin/generate")({
  head: () => ({ meta: [{ title: "Generate a session · Immersive Learning" }] }),
  component: GeneratePage,
});

const DURATIONS = [30, 45, 60, 90, 120];
const MAX_DOCS = 3;
const MAX_DOC_BYTES = 25 * 1024 * 1024;
// Must match MAX_DOC_CHARS in supabase/functions/generate-session/index.ts.
// Used only to warn before generating; the server does the actual trimming.
const MAX_DOC_CHARS = 120_000;
const ACCEPT = ".pdf,.docx,.pptx,.txt";

type ParsedDoc = { name: string; text: string; pages: number };

type Stage = "form" | "parsing" | "generating" | "validating" | "review";

const STAGE_PROGRESS: Record<Stage, number> = {
  form: 0,
  parsing: 20,
  generating: 55,
  validating: 85,
  review: 100,
};

const STAGE_LABEL: Record<Stage, string> = {
  form: "",
  parsing: "Reading your documents…",
  generating: "Designing the session across three screens…",
  validating: "Checking every slot is legal…",
  review: "Ready",
};

function GeneratePage() {
  const navigate = useNavigate();

  // ── Brief state ──
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<string>("Level 1");
  const [department, setDepartment] = useState<string>("Adult Skills");
  const [vocationalContext, setVocationalContext] = useState("");
  const [durationMins, setDurationMins] = useState(60);
  const [groupSize, setGroupSize] = useState(12);
  const [threeScreens, setThreeScreens] = useState(true);
  const [shape, setShape] = useState<Brief["shape"]>("balanced");
  const [includeConfidenceArc, setIncludeConfidenceArc] = useState(true);
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [msFormUrl, setMsFormUrl] = useState("");
  const [docs, setDocs] = useState<ParsedDoc[]>([]);

  // ── Flow state ──
  const [stage, setStage] = useState<Stage>("form");
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<GeneratedSession | null>(null);
  const [warnings, setWarnings] = useState<RepairWarning[]>([]);
  const [failure, setFailure] = useState<{ error: string; issues?: string[] } | null>(null);
  const [imageSource, setImageSource] = useState<ImageSource>("stock");
  const [busyImages, setBusyImages] = useState<Set<string>>(new Set());
  const [filledImages, setFilledImages] = useState<Set<string>>(new Set());
  const fileInput = useRef<HTMLInputElement>(null);
  const lastBrief = useRef<Brief | null>(null);

  const busy = stage === "parsing" || stage === "generating" || stage === "validating";

  // ── Documents, parsed in the browser so only text leaves the device ──
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_DOCS - docs.length;
    if (room <= 0) {
      toast.error(`Up to ${MAX_DOCS} documents.`);
      return;
    }

    setStage("parsing");
    const added: ParsedDoc[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      if (file.size > MAX_DOC_BYTES) {
        toast.error(`${file.name} is larger than 25MB.`);
        continue;
      }
      try {
        const { text, pages } = await extractDocumentRich(file);
        if (!text.trim()) {
          toast.error(`No text found in ${file.name}. If it is a scan, it needs typing up first.`);
          continue;
        }
        // A typed header over a scanned grid passes a length check but is nearly
        // empty, so warn on suspiciously low yield per page.
        if (pages > 1 && text.length / pages < 120) {
          toast.warning(`${file.name} looks like a scan. Only some text could be read.`);
        }
        if (text.length > MAX_DOC_CHARS) {
          toast.warning(
            `${file.name} is very long, so only the first part will be used. Consider splitting it.`,
            { duration: 8000 },
          );
        }
        added.push({ name: file.name, text, pages });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Could not read ${file.name}.`);
      }
    }
    setDocs((prev) => [...prev, ...added]);
    setStage("form");
    if (fileInput.current) fileInput.current.value = "";
    if (added.length > 0) toast.success(`Added ${added.length} document(s).`);
  };

  const buildBrief = (): Brief => ({
    topic: topic.trim(),
    level: level as Brief["level"],
    department: department as Brief["department"],
    vocationalContext: vocationalContext.trim(),
    durationMins,
    groupSize,
    threeScreens,
    shape,
    includeConfidenceArc,
    imageSource,
    objectives: objectives.map((o) => o.trim()).filter(Boolean),
    notes: notes.trim(),
    msFormUrl: msFormUrl.trim(),
    documents: docs.map((d) => ({ name: d.name, text: d.text })),
  });

  const run = async (brief: Brief) => {
    setFailure(null);
    setSession(null);
    setWarnings([]);
    lastBrief.current = brief;

    setStage("generating");
    const response = await generateSession(brief);

    if (!response.ok) {
      setStage("form");
      setFailure({ error: response.error, issues: response.issues });
      toast.error(response.error);
      return;
    }

    setStage("validating");
    const result = repairAndValidate(response.data, brief);

    if (!result.ok) {
      setStage("form");
      setFailure({
        error: "The session came back in a shape this room cannot run.",
        issues: result.issues,
      });
      toast.error("Generated session failed validation. Try again.");
      return;
    }

    setSession(result.session);
    setWarnings(result.warnings);
    setStage("review");

    if (response.meta?.droppedVideos > 0) {
      toast.warning(
        `${response.meta.droppedVideos} suggested video(s) did not exist and became placeholders.`,
      );
    }

    // Silent truncation is how a whole deck quietly becomes half a lesson, so
    // say it plainly rather than leaving the tutor to notice content missing.
    for (const doc of response.meta?.truncatedDocs ?? []) {
      const usedPct = Math.round((doc.usedChars / doc.originalChars) * 100);
      toast.warning(
        `"${doc.name}" was too long, so only about ${usedPct}% of it was used. Split it into smaller files if the rest matters.`,
        { duration: 10000 },
      );
    }
  };

  const handleGenerate = () => {
    if (topic.trim().length < 3) {
      toast.error("Describe the topic first.");
      return;
    }
    void run(buildBrief());
  };

  // ── Images, filled one at a time on the review screen ──
  const fetchOne = async (requestIndex: number, current: GeneratedSession) => {
    if (imageSource === "none") return current;
    const request = current.media_requests[requestIndex];
    if (!request) return current;

    const key = `${request.slot_index}:${request.screen}`;
    if (filledImages.has(key)) return current;

    setBusyImages((prev) => new Set(prev).add(key));
    try {
      const result = await fetchImage(
        imageSource,
        request.search_phrase,
        request.why,
        request.kind,
      );
      if (!result.ok) {
        toast.error(`Slot ${request.slot_index + 1}: ${result.error}`);
        return current;
      }
      const next = applyImageToSession(
        current,
        request.slot_index,
        request.screen,
        result.url,
        request.search_phrase,
        request.kind,
      );
      setFilledImages((prev) => new Set(prev).add(key));
      return next;
    } finally {
      setBusyImages((prev) => {
        const copy = new Set(prev);
        copy.delete(key);
        return copy;
      });
    }
  };

  const handleFetchImage = async (requestIndex: number) => {
    if (!session) return;
    const next = await fetchOne(requestIndex, session);
    setSession(next);
  };

  const handleFetchAllImages = async () => {
    if (!session) return;
    // Sequential on purpose: generation is slow and expensive, and a burst of
    // parallel calls would trip the function's own rate limit.
    let working = session;
    for (let i = 0; i < working.media_requests.length; i++) {
      working = await fetchOne(i, working);
      setSession(working);
    }
    toast.success("Images added where they could be found.");
  };

  const handleCreate = async () => {
    if (!session || !lastBrief.current) return;
    setSaving(true);
    try {
      const { lessonId } = await writeGeneratedSession(session, lastBrief.current);
      toast.success("Lesson created. Opening the designer.");
      navigate({ to: "/admin/designer/$lessonId", params: { lessonId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the lesson.");
      setSaving(false);
    }
  };

  // ── Review ──
  if (stage === "review" && session) {
    return (
      <GeneratedSessionReview
        session={session}
        warnings={warnings}
        saving={saving}
        imageSource={imageSource}
        busyImages={busyImages}
        filledImages={filledImages}
        onFetchImage={(i) => void handleFetchImage(i)}
        onFetchAllImages={() => void handleFetchAllImages()}
        onCreate={handleCreate}
        onDiscard={() => {
          setSession(null);
          setStage("form");
        }}
        onRegenerate={() => lastBrief.current && void run(lastBrief.current)}
      />
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-immersive bg-grid">
      <header className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        <Link
          to="/admin"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Admin
        </Link>
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)] mt-4">
          Bradford College
        </div>
        <h1 className="text-4xl font-extrabold text-glow mt-1">Generate a session</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl">
          Describe the lesson and the AI will design it across all three screens using the room's
          tools. You review everything before anything is saved.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
        {busy && (
          <div className="rounded-2xl border-2 border-[color:var(--cyan)]/40 bg-card/70 p-5 space-y-3">
            <div className="text-sm font-semibold">{STAGE_LABEL[stage]}</div>
            <Progress value={STAGE_PROGRESS[stage]} />
            <p className="text-xs text-muted-foreground">
              {stage === "generating"
                ? "This usually takes 20 to 60 seconds. Keep this tab open."
                : "Working locally on this device."}
            </p>
          </div>
        )}

        {failure && !busy && (
          <div className="rounded-2xl border-2 border-destructive/50 bg-destructive/10 p-5 space-y-2">
            <div className="text-sm font-bold text-destructive uppercase tracking-widest">
              Generation failed
            </div>
            <p className="text-sm">{failure.error}</p>
            {failure.issues && failure.issues.length > 0 && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer uppercase tracking-widest">Details</summary>
                <ul className="mt-2 space-y-1 font-mono">
                  {failure.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* ── The lesson ── */}
        <section className="rounded-2xl border border-border bg-card/60 p-6 space-y-5">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold">
            The lesson
          </h2>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Textarea
              id="topic"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Site health and safety: PPE, spotting hazards on a job site, and how to report them"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level *</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Sets the reading level. Entry levels force face-based confidence scales and short
                on-screen text.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vocational">Vocational context</Label>
            <Input
              id="vocational"
              value={vocationalContext}
              onChange={(e) => setVocationalContext(e.target.value)}
              placeholder="construction / job sites"
            />
            <p className="text-[11px] text-muted-foreground">
              Every example and scenario is set in this world so learners recognise it.
            </p>
          </div>
        </section>

        {/* ── The room ── */}
        <section className="rounded-2xl border border-border bg-card/60 p-6 space-y-5">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold">
            The room
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Length</Label>
              <Select
                value={String(durationMins)}
                onValueChange={(v) => setDurationMins(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group size</Label>
              <Input
                id="group"
                type="number"
                min={1}
                max={60}
                value={groupSize}
                onChange={(e) =>
                  setGroupSize(Math.max(1, Math.min(60, Number(e.target.value) || 1)))
                }
              />
              <p className="text-[11px] text-muted-foreground">
                Above 16 the AI avoids pass-the-screen activities.
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
            <div>
              <Label htmlFor="screens">All three screens working</Label>
              <p className="text-[11px] text-muted-foreground mt-1">
                Turn off if Touch Screen 2 is unavailable. The AI will then avoid the quiz buzzer
                and single questions, which both need it.
              </p>
            </div>
            <Switch id="screens" checked={threeScreens} onCheckedChange={setThreeScreens} />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
            <div>
              <Label htmlFor="arc">Confidence check at the start and end</Label>
              <p className="text-[11px] text-muted-foreground mt-1">
                Brackets the lesson so the Host screen can show the before and after comparison.
              </p>
            </div>
            <Switch
              id="arc"
              checked={includeConfidenceArc}
              onCheckedChange={setIncludeConfidenceArc}
            />
          </div>

          <div className="space-y-2">
            <Label>Pictures</Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["stock", "Find photos"],
                  ["ai", "Generate"],
                  ["none", "I'll add them"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setImageSource(value)}
                  className={`h-11 rounded-xl border-2 text-xs uppercase tracking-widest font-bold transition-colors ${
                    imageSource === value
                      ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/15 text-[color:var(--cyan)]"
                      : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {imageSource === "stock"
                ? "Real photographs from a stock library. Best when the picture needs to look like a real workplace."
                : imageSource === "ai"
                  ? "Invented images. Good for staged scenes stock does not have, but check anything showing correct practice."
                  : "Leaves a written description of each picture for you to source yourself."}{" "}
              You choose each one on the next screen; nothing is fetched automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Shape</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["quiz-heavy", "balanced", "discussion-heavy"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`h-11 rounded-xl border-2 text-xs uppercase tracking-widest font-bold transition-colors ${
                    shape === s
                      ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/15 text-[color:var(--cyan)]"
                      : "border-border text-muted-foreground hover:border-[color:var(--cyan)]/50"
                  }`}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Objectives and notes ── */}
        <section className="rounded-2xl border border-border bg-card/60 p-6 space-y-5">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold">
            Objectives and notes
          </h2>

          <div className="space-y-2">
            <Label>Learning objectives</Label>
            <p className="text-[11px] text-muted-foreground">
              Leave blank and the AI will write three for you to approve.
            </p>
            {objectives.map((o, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={o}
                  onChange={(e) =>
                    setObjectives((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  placeholder={
                    i === 0 ? "Identify three hazards on a job site" : "Another objective"
                  }
                />
                {objectives.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setObjectives((prev) => prev.filter((_, j) => j !== i))}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            {objectives.length < 4 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setObjectives((prev) => [...prev, ""])}
                className="text-xs uppercase tracking-widest"
              >
                + Add objective
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anything else</Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What they already know, specific hazards to cover, anything to avoid."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="msform">Feedback form link</Label>
            <Input
              id="msform"
              value={msFormUrl}
              onChange={(e) => setMsFormUrl(e.target.value)}
              placeholder="https://forms.office.com/…"
            />
            <p className="text-[11px] text-muted-foreground">
              Shown as a QR code on the end-of-session screen.
            </p>
          </div>
        </section>

        {/* ── Documents ── */}
        <section className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] font-bold">
            Your existing material
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Optional. PowerPoint, Word, PDF or text, up to {MAX_DOCS} files. Read on this device:
            only the text is sent, never the file.
          </p>

          {docs.length > 0 && (
            <ul className="space-y-2">
              {docs.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-2.5 text-sm"
                >
                  <span className="truncate">
                    {d.name}
                    <span
                      className={`ml-2 text-xs ${
                        d.text.length > MAX_DOC_CHARS
                          ? "text-[color:var(--orange)] font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {(d.text.length / 1000).toFixed(1)}k characters
                      {d.text.length > MAX_DOC_CHARS && " · too long, will be shortened"}
                    </span>
                  </span>
                  <button
                    onClick={() => setDocs((prev) => prev.filter((_, j) => j !== i))}
                    className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive shrink-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {docs.length < MAX_DOCS && (
            <>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => void handleFiles(e.target.files)}
              />
              <Button
                variant="outline"
                onClick={() => fileInput.current?.click()}
                disabled={busy}
                className="uppercase tracking-widest"
              >
                Add documents
              </Button>
            </>
          )}
        </section>

        <Button
          onClick={handleGenerate}
          disabled={busy}
          className="w-full h-16 text-lg uppercase tracking-widest font-extrabold"
        >
          {busy ? "Working…" : "Generate session"}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          AI drafts are a starting point. Check the content, especially anything about safety,
          before you teach it.
        </p>
      </main>
    </div>
  );
}
