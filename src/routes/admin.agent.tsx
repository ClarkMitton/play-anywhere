// Build a lesson with the agent — /admin/agent (and /admin/agent?lesson=<id>
// to change an existing one).
//
// Renders behind the /admin PIN gate. One conversation, like working with
// Claude Code: drop or paste files and links anywhere, talk the plan through,
// watch the reply and the build arrive live, then create the lesson from the
// draft card. Every step the page takes (reading pictures, building, fixing)
// is shown as a line in the conversation. Changing an existing lesson always
// saves a new copy, so the original is never lost.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Film,
  Hammer,
  History,
  Link2,
  Loader2,
  Music,
  Paperclip,
  Plus,
  Square,
  X,
} from "lucide-react";
import { readAgentHistory, writeAgentConversation, type AgentConversation } from "@/lib/agentHistory";
import { Button } from "@/components/ui/button";
import { extractDocumentRich } from "@/lib/documentParser";
import {
  buildWithAgent,
  chatWithAgent,
  describeImages,
  estimateUsd,
  loadLessonForAgent,
  newFolder,
  prepareImage,
  previewFromUrl,
  saveAgentLesson,
  uploadToLessonMedia,
  validateAgentBuild,
  type AgentDraft,
  type AgentMessage,
  type AgentResource,
  type AgentToday,
  type LiveEvent,
} from "@/lib/lessonAgent";

export const Route = createFileRoute("/admin/agent")({
  validateSearch: (search: Record<string, unknown>): { lesson?: string; chat?: string } => ({
    lesson: typeof search.lesson === "string" ? search.lesson : undefined,
    chat: typeof search.chat === "string" ? search.chat : undefined,
  }),
  head: () => ({ meta: [
    { title: "Lesson agent · Bradford College Immersive Learning" },
    { name: "description", content: "Plan and build Bradford College immersive lessons from your teaching resources." },
    { property: "og:title", content: "Lesson agent · Bradford College Immersive Learning" },
    { property: "og:description", content: "Plan and build immersive lessons from your teaching resources." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AgentPage,
});

type Saved = { folder: string; messages: AgentMessage[]; resources: AgentResource[]; draft: AgentDraft | null };
const MAX_UPLOAD_MB = 50;
const DESCRIBE_BATCH = 8;
const PARALLEL_UPLOADS = 3;
const URL_PATTERN = /https?:\/\/[^\s<>"')]+/gi;

const STARTERS_NEW = [
  "Turn my slides into an interactive lesson for the room",
  "Plan a 60 minute Entry 3 lesson on ",
  "Make an escape room from these worksheets",
];
const STARTERS_CHANGE = [
  "Make it 15 minutes shorter",
  "Add a table task after the video",
  "Swap the quiz for something more active",
];

function storageKey(lessonId?: string) {
  return `lesson-agent:${lessonId ?? "new"}`;
}

function loadSaved(lessonId?: string): Saved | null {
  try {
    const raw = localStorage.getItem(storageKey(lessonId));
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function kindOf(file: File): AgentResource["kind"] | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  if (/\.(pdf|docx?|pptx?|txt|md|csv)$/i.test(file.name)) return "document";
  return null;
}

function linkName(url: string): string {
  if (/youtu\.?be/i.test(url)) return "YouTube clip";
  if (/wordwall\.net/i.test(url)) return "Wordwall";
  if (/canva\.(com|site)/i.test(url)) return "Canva";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Link";
  }
}

/** Run jobs a few at a time, so ten pictures do not queue behind each other. */
async function inBatches<T>(items: T[], size: number, job: (item: T) => Promise<void>) {
  const queue = items.slice();
  await Promise.all(Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) await job(queue.shift()!);
  }));
}

function AgentPage() {
  const { lesson: lessonId, chat: chatId } = Route.useSearch();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(() => newFolder());
  const [resources, setResources] = useState<AgentResource[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [draft, setDraft] = useState<AgentDraft | null>(null);
  const [current, setCurrent] = useState<Awaited<ReturnType<typeof loadLessonForAgent>>>(null);
  const [input, setInput] = useState("");
  // Files added since the last message: shown in the composer, sent with the next message.
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [busy, setBusy] = useState<null | "describing" | "thinking" | "building" | "saving">(null);
  const [live, setLive] = useState<{ text: string; steps: number }>({ text: "", steps: 0 });
  const [session, setSession] = useState({ calls: 0, prompt_tokens: 0, completion_tokens: 0 });
  const [today, setToday] = useState<AgentToday | null>(null);
  const [restored, setRestored] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [history, setHistory] = useState<AgentConversation[]>([]);
  const [panel, setPanel] = useState<null | "history" | "files">(null);
  const [dragging, setDragging] = useState(false);
  const [createdLessonIds, setCreatedLessonIds] = useState<string[]>([]);
  const resourcesRef = useRef(resources);
  resourcesRef.current = resources;
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const stickToBottom = useRef(true);

  // Browser-only history: preserve resources, drafts and the original conversation.
  useEffect(() => {
    const all = readAgentHistory(localStorage);
    setHistory(all);
    const saved = chatId ? all.find((c) => c.id === chatId) : all.find((c) => c.sourceLessonId === lessonId);
    const legacy = !saved && !chatId ? loadSaved(lessonId) : null;
    // A chat id with nothing saved under it is a fresh chat (the New button).
    setConversationId(saved?.id ?? chatId ?? crypto.randomUUID());
    setFolder(saved?.folder ?? legacy?.folder ?? newFolder());
    setMessages(saved?.messages ?? legacy?.messages ?? []);
    setResources((saved?.resources ?? legacy?.resources ?? []).filter((r) => r.status === "ready"));
    setDraft(saved?.draft ?? legacy?.draft ?? null);
    setInput(saved?.input ?? "");
    setPendingIds([]);
    setCreatedLessonIds(saved?.createdLessonIds ?? []);
    setSession({ calls: 0, prompt_tokens: 0, completion_tokens: 0 });
    setRestored(true);
  }, [lessonId, chatId]);

  const conversation = (ids = createdLessonIds): AgentConversation => ({
    id: conversationId, updatedAt: new Date().toISOString(),
    title: draft?.session.lesson.title ?? messages.find((m) => m.role === "user")?.content.slice(0, 80) ?? "New conversation",
    folder, messages, draft, input, sourceLessonId: lessonId, createdLessonIds: ids,
    resources: resources.filter((r) => r.status === "ready").map(({ previewDataUrl: _p, ...r }) => r),
  });

  useEffect(() => {
    if (!restored || !conversationId || (!messages.length && !resources.length && !draft && !input)) return;
    try {
      setHistory(writeAgentConversation(localStorage, conversation()));
    } catch {
      toast.error("Your browser could not save this chat. Keep this page open to avoid losing it.");
    }
  }, [restored, conversationId, folder, messages, resources, draft, input, lessonId, createdLessonIds]);

  useEffect(() => {
    setCurrent(null);
    if (!lessonId) return;
    let cancelled = false;
    loadLessonForAgent(lessonId).then((value) => { if (!cancelled) setCurrent(value); });
    return () => { cancelled = true; };
  }, [lessonId]);

  // Follow the conversation as it grows, unless the teacher has scrolled up to read.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, live, busy, draft]);

  // The composer grows with what is typed, up to a limit.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [input]);

  const track = (u: { prompt_tokens: number; completion_tokens: number }, t?: AgentToday) => {
    setSession((s) => ({
      calls: s.calls + 1,
      prompt_tokens: s.prompt_tokens + u.prompt_tokens,
      completion_tokens: s.completion_tokens + u.completion_tokens,
    }));
    if (t) setToday(t);
  };

  const patch = (id: string, p: Partial<AgentResource>) =>
    setResources((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const say = (line: AgentMessage) => setMessages((m) => [...m, line]);

  // A call that went silent is sent again by itself; say so and clear half-written text.
  const onRetry = (e: LiveEvent) => {
    if (e.type !== "retry") return;
    setLive({ text: "", steps: 0 });
    say({ role: "activity", content: "The agent went quiet, so I asked again…" });
  };

  // ── Adding resources ──────────────────────────
  const addFiles = useCallback(async (files: FileList | File[]) => {
    const accepted: { file: File; id: string; kind: AgentResource["kind"] }[] = [];
    for (const file of Array.from(files)) {
      const kind = kindOf(file);
      if (!kind) {
        toast.error(`${file.name}: not a picture, sound, video or document`);
        continue;
      }
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast.error(`${file.name} is over ${MAX_UPLOAD_MB} MB`);
        continue;
      }
      accepted.push({ file, id: crypto.randomUUID(), kind });
    }
    if (!accepted.length) return;
    setResources((rs) => [...rs, ...accepted.map(({ file, id, kind }) => ({ id, name: file.name, kind, status: "uploading" as const }))]);
    setPendingIds((ids) => [...ids, ...accepted.map((a) => a.id)]);
    await inBatches(accepted, PARALLEL_UPLOADS, async ({ file, id, kind }) => {
      try {
        if (kind === "image") {
          const { blob, previewDataUrl } = await prepareImage(file);
          const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          const url = await uploadToLessonMedia(folder, name, blob, "image/jpeg");
          patch(id, { url, previewDataUrl, status: "ready" });
        } else if (kind === "document") {
          const text = /\.(txt|md|csv)$/i.test(file.name) ? await file.text() : (await extractDocumentRich(file)).text;
          patch(id, { text: text.slice(0, 40_000), status: "ready" });
        } else {
          const url = await uploadToLessonMedia(folder, file.name, file, file.type);
          patch(id, { url, status: "ready" });
        }
      } catch (e) {
        patch(id, { status: "failed", error: e instanceof Error ? e.message : "upload failed" });
      }
    });
  }, [folder]);

  const addLinks = (urls: string[]): string[] => {
    const known = new Set(resourcesRef.current.map((r) => r.url));
    const fresh = [...new Set(urls.map((u) => u.replace(/[.,;:!?]+$/, "")))].filter((u) => !known.has(u));
    const added = fresh.map((url) => ({ id: crypto.randomUUID(), name: linkName(url), kind: "link" as const, url, status: "ready" as const }));
    if (added.length) setResources((rs) => [...rs, ...added]);
    return added.map((r) => r.id);
  };

  // Drop files (or a link dragged from another tab) anywhere on the page.
  useEffect(() => {
    let depth = 0;
    const hasData = (e: DragEvent) => !!e.dataTransfer && [...e.dataTransfer.types].some((t) => t === "Files" || t === "text/uri-list");
    const enter = (e: DragEvent) => { if (hasData(e)) { depth++; setDragging(true); } };
    const leave = () => { depth = Math.max(0, depth - 1); if (!depth) setDragging(false); };
    const over = (e: DragEvent) => { if (hasData(e)) e.preventDefault(); };
    const drop = (e: DragEvent) => {
      if (!hasData(e)) return;
      e.preventDefault();
      depth = 0;
      setDragging(false);
      if (e.dataTransfer!.files.length) {
        void addFiles(e.dataTransfer!.files);
      } else {
        const links = (e.dataTransfer!.getData("text/uri-list") || e.dataTransfer!.getData("text/plain")).match(URL_PATTERN) ?? [];
        const ids = addLinks(links);
        if (ids.length) setPendingIds((p) => [...p, ...ids]);
      }
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", over);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("dragover", over);
      window.removeEventListener("drop", drop);
    };
  }, [addFiles]);

  const removeResource = (id: string) => {
    setResources((rs) => rs.filter((x) => x.id !== id));
    setPendingIds((ids) => ids.filter((x) => x !== id));
  };

  const move = (id: string, dir: -1 | 1) =>
    setResources((rs) => {
      const i = rs.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const next = rs.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Pictures are described once, then only the words travel in later turns.
  // Returns the list with the new descriptions merged in (state updates land
  // after this render, so callers use the return value, not the ref).
  const describePending = async (): Promise<AgentResource[] | null> => {
    let list = resourcesRef.current;
    // Pictures restored from a saved chat have no small copy yet; remake it.
    const missing = list.filter((r) => r.kind === "image" && r.status === "ready" && !r.description && !r.previewDataUrl && r.url);
    if (missing.length) {
      setBusy("describing");
      const made = new Map<string, string>();
      await Promise.all(missing.map(async (r) => {
        try { made.set(r.id, await previewFromUrl(r.url!)); } catch { /* described from its name only */ }
      }));
      list = list.map((r) => (made.has(r.id) ? { ...r, previewDataUrl: made.get(r.id) } : r));
    }
    const pending = list.filter((r) => r.kind === "image" && r.status === "ready" && !r.description && r.previewDataUrl);
    if (!pending.length) return list;
    setBusy("describing");
    for (let i = 0; i < pending.length; i += DESCRIBE_BATCH) {
      const batch = pending.slice(i, i + DESCRIBE_BATCH);
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await describeImages(batch.map((r) => ({ id: r.id, name: r.name, dataUrl: r.previewDataUrl! })), onRetry, controller.signal);
      abortRef.current = null;
      if (!res.ok) {
        say({ role: "activity", tone: "error", content: `Could not look at the pictures: ${res.error}` });
        return null;
      }
      track(res.usage, res.today);
      const found = new Map(res.items.map((item) => {
        const words = item.text_on_image?.trim() ? ` Words on it: "${item.text_on_image.trim()}"` : "";
        return [item.id, `${item.role ? `(${item.role}) ` : ""}${item.description ?? ""}${words}`] as const;
      }));
      list = list.map((r) => (found.has(r.id) ? { ...r, description: found.get(r.id), previewDataUrl: undefined } : r));
      const merged = list;
      setResources((rs) => rs.map((r) => merged.find((m) => m.id === r.id) ?? r));
    }
    say({ role: "activity", tone: "ok", content: `Looked at ${pending.length} picture${pending.length === 1 ? "" : "s"}` });
    return list;
  };

  const uploading = resources.some((r) => r.status === "uploading");
  const working = !!busy;

  // Once a draft exists, changes apply to the draft rather than starting again.
  const draftOrCurrent = () =>
    draft
      ? { title: draft.session.lesson.title, ambient_url: draft.ambientUrl, slots: draft.session.slots }
      : current;

  // ── Chat ──────────────────────────────────────
  const reply = async (history: AgentMessage[]) => {
    stickToBottom.current = true;
    try {
      const list = await describePending();
      if (!list) return;
      setBusy("thinking");
      setLive({ text: "", steps: 0 });
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await chatWithAgent(history, list, draftOrCurrent(), (e) => {
        if (e.type === "delta") setLive((l) => ({ ...l, text: l.text + e.text }));
        else onRetry(e);
      }, controller.signal);
      if (!res.ok) {
        say({ role: "activity", tone: "error", content: res.error });
        return;
      }
      track(res.usage, res.today);
      say({ role: "assistant", content: res.reply });
    } finally {
      abortRef.current = null;
      setLive({ text: "", steps: 0 });
      setBusy(null);
    }
  };

  const send = async (override?: string) => {
    const typed = (override ?? input).trim();
    if (working || uploading) return;
    const linkIds = addLinks(typed.match(URL_PATTERN) ?? []);
    const attachments = [...pendingIds, ...linkIds];
    if (!typed && !attachments.length) return;
    const text = typed || "Here are my resources.";
    const next: AgentMessage[] = [...messages, { role: "user", content: text, ...(attachments.length ? { attachments } : {}) }];
    setMessages(next);
    setInput("");
    setPendingIds([]);
    await reply(next);
  };

  // Try the last request again without repeating the teacher's message.
  const retry = async () => {
    if (working || uploading) return;
    const trimmed = messages.slice();
    while (trimmed.length && trimmed[trimmed.length - 1].role === "activity") trimmed.pop();
    const last = trimmed[trimmed.length - 1];
    if (last?.role === "user") {
      setMessages(trimmed);
      await reply(trimmed);
    } else {
      await build();
    }
  };

  const stop = () => abortRef.current?.abort();

  // ── Build ─────────────────────────────────────
  const build = async () => {
    if (working || uploading) return;
    stickToBottom.current = true;
    try {
      const list = await describePending();
      if (!list) return;
      setBusy("building");
      setLive({ text: "", steps: 0 });
      let issues: string[] = [];
      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        abortRef.current = controller;
        const res = await buildWithAgent(messages, list, draftOrCurrent(), issues, (e) => {
          if (e.type === "progress") setLive((l) => ({ ...l, steps: e.steps }));
          else onRetry(e);
        }, controller.signal);
        if (!res.ok) {
          say({ role: "activity", tone: "error", content: `The build stopped: ${res.error}` });
          return;
        }
        track(res.usage, res.today);
        const checked = validateAgentBuild(res.data);
        if (checked.ok) {
          const s = checked.draft.session;
          const fixes = checked.draft.warnings.length;
          setDraft(checked.draft);
          setMessages((m) => [
            ...m.map((x) => (x.showsDraft ? { ...x, showsDraft: false } : x)),
            {
              role: "activity",
              tone: "ok",
              showsDraft: true,
              content: `Built ${s.slots.length} steps · ${s.lesson.estimated_duration_mins} min${fixes ? ` · checked against the room's rules, ${fixes} automatic fix${fixes === 1 ? "" : "es"}` : " · passed the room's rules"}`,
            },
          ]);
          return;
        }
        issues = checked.issues;
        if (attempt === 0) {
          say({ role: "activity", content: `The first build broke ${issues.length} of the room's rules. Building again with those fixed…` });
          setLive({ text: "", steps: 0 });
        }
      }
      say({
        role: "activity",
        tone: "error",
        content: `The build broke the room's rules twice:\n${issues.slice(0, 6).map((i) => `- ${i}`).join("\n")}\nSay what to change, or try again.`,
      });
    } finally {
      abortRef.current = null;
      setLive({ text: "", steps: 0 });
      setBusy(null);
    }
  };

  const create = async () => {
    if (!draft || working) return;
    setBusy("saving");
    try {
      const id = await saveAgentLesson(draft);
      try {
        setHistory(writeAgentConversation(localStorage, conversation([...createdLessonIds, id])));
        setCreatedLessonIds((ids) => [...ids, id]);
        localStorage.removeItem(storageKey(lessonId));
      } catch {
        toast.error("Lesson created, but this browser could not save its chat.");
      }
      toast.success("Lesson created");
      navigate({ to: "/admin/designer/$lessonId", params: { lessonId: id }, search: { agentChat: conversationId, agentSource: lessonId } });
    } catch (e) {
      say({ role: "activity", tone: "error", content: e instanceof Error ? e.message : "Could not save the lesson" });
    } finally {
      setBusy(null);
    }
  };

  const startOver = () => {
    if (working || uploading) return;
    setPanel(null);
    setRestored(false);
    navigate({ to: "/admin/agent", search: { chat: crypto.randomUUID() } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send();
    } else if (e.key === "Escape" && working) {
      stop();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length) {
      e.preventDefault();
      void addFiles(files);
    }
  };

  const pending = pendingIds.map((id) => resources.find((r) => r.id === id)).filter((r): r is AgentResource => !!r);
  const byId = new Map(resources.map((r) => [r.id, r]));
  const lastAssistant = [...messages].reverse().find((m) => m.role !== "activity");
  const suggestsBuild = !working && lastAssistant?.role === "assistant" && /build lesson/i.test(lastAssistant.content);
  const canBuild = !working && !uploading && (messages.some((m) => m.role === "user") || !!current);
  const empty = messages.length === 0;
  const lastIsError = messages[messages.length - 1]?.tone === "error";
  // A reply lost to a reload or a closed tab: offer to ask again.
  const unanswered = !working && messages[messages.length - 1]?.role === "user";

  return (
    <div className="h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="shrink-0 border-b border-border px-3 md:px-5 py-2 flex items-center gap-3">
        <Link to="/admin" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">← Lessons</Link>
        <h1 className="text-sm font-extrabold uppercase tracking-widest truncate">
          {lessonId ? "Change a lesson" : "Lesson agent"}
        </h1>
        <div className="ml-auto flex items-center gap-1.5">
          <UsageChip session={session} today={today} />
          <Button variant="ghost" size="sm" onClick={() => setPanel((p) => (p === "files" ? null : "files"))}>
            <Paperclip className="size-4" /> <span className="hidden sm:inline">Files</span>{resources.length ? ` ${resources.length}` : ""}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPanel((p) => (p === "history" ? null : "history"))}>
            <History className="size-4" /> <span className="hidden sm:inline">Chats</span>
          </Button>
          <Button variant="outline" size="sm" onClick={startOver} disabled={working || uploading}>
            <Plus className="size-4" /> <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex">
        <main
          ref={scrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
          className="flex-1 min-w-0 overflow-y-auto"
        >
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
            {lessonId && (
              <div className="rounded-lg border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/5 px-4 py-2 text-sm">
                {current ? <>Changing <b>{current.title}</b> ({current.slots.length} steps). It saves as a new copy; the original stays as it is.</> : "Loading the lesson…"}
              </div>
            )}

            {empty && (
              <div className="pt-[8vh] space-y-5">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold">{lessonId ? "What would you like to change?" : "What shall we build?"}</h2>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Tell me the lesson you want and drop in anything you already have: slides, pictures, worksheets,
                    documents, sound, or links to YouTube, Wordwall and Canva. We plan it together here, then I build it.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(lessonId ? STARTERS_CHANGE : STARTERS_NEW).map((s) => (
                    <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-[color:var(--cyan)] transition-colors">
                      {s.trim()}{s.endsWith(" ") ? "…" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <Line key={i} m={m} byId={byId} draft={m.showsDraft ? draft : null}
                onCreate={create} saving={working || uploading} created={createdLessonIds.length > 0}
                onRetry={i === messages.length - 1 && lastIsError ? retry : undefined} />
            ))}

            {unanswered && <Activity text="No reply to this yet." onRetry={retry} />}
            {busy === "describing" && <Activity running text="Looking at the pictures…" />}
            {busy === "thinking" && (live.text
              ? <div className="text-sm leading-relaxed"><Markdownish text={live.text} /><span className="inline-block w-2 h-4 align-middle bg-[color:var(--cyan)] animate-pulse ml-0.5" /></div>
              : <Activity running text="Thinking…" />)}
            {busy === "building" && (
              <Activity running text={live.steps ? `Building the lesson · writing step ${live.steps}…` : "Building the lesson · reading the plan…"} />
            )}
            {busy === "saving" && <Activity running text="Creating the lesson…" />}

            {suggestsBuild && (
              <div className="flex items-center gap-3">
                <Button onClick={build} disabled={!canBuild} className="gap-2"><Hammer className="size-4" /> {draft ? "Build again" : "Build lesson"}</Button>
                <span className="text-xs text-muted-foreground">or keep talking to change the plan</span>
              </div>
            )}
          </div>
        </main>

        {panel && (
          <aside className="w-[min(360px,90vw)] shrink-0 border-l border-border overflow-y-auto bg-background absolute right-0 top-[45px] bottom-0 z-20 md:static md:z-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{panel === "files" ? "Files in this chat" : "Saved chats · this browser"}</h2>
              <button onClick={() => setPanel(null)} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </div>
            {panel === "files" ? (
              <div className="p-3 space-y-2">
                {!resources.length && <p className="text-sm text-muted-foreground">Nothing yet. Drop files anywhere on the page, or paste a link into your message.</p>}
                {resources.map((r, i) => (
                  <div key={r.id} className="flex gap-2 items-start rounded-lg border border-border/60 p-2">
                    <Thumb r={r} className="h-12 w-16" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{i + 1}. {r.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-3">
                        {r.status === "uploading" ? "Uploading…" : r.status === "failed" ? `Failed: ${r.error}` :
                          r.description ?? (r.kind === "image" ? "Looked at with your next message" : r.kind === "document" ? `${(r.text ?? "").length.toLocaleString()} characters read` : r.url)}
                      </div>
                    </div>
                    <div className="flex flex-col text-muted-foreground">
                      <button onClick={() => move(r.id, -1)} aria-label="Move up" className="hover:text-foreground"><ChevronUp className="size-4" /></button>
                      <button onClick={() => move(r.id, 1)} aria-label="Move down" className="hover:text-foreground"><ChevronDown className="size-4" /></button>
                      <button onClick={() => removeResource(r.id)} aria-label="Remove" className="hover:text-destructive"><X className="size-4" /></button>
                    </div>
                  </div>
                ))}
                {resources.length > 1 && <p className="text-[11px] text-muted-foreground">The agent reads them in this order.</p>}
              </div>
            ) : (
              <ul className="p-3 space-y-1">
                {!history.length && <li className="text-sm text-muted-foreground">No saved chats yet.</li>}
                {history.map((c) => (
                  <li key={c.id}>
                    <button disabled={working || uploading}
                      onClick={() => { setRestored(false); setPanel(null); navigate({ to: "/admin/agent", search: { chat: c.id, lesson: c.sourceLessonId } }); }}
                      className={`w-full text-left rounded-lg px-3 py-2 hover:bg-muted/50 ${c.id === conversationId ? "bg-muted/60" : ""}`}>
                      <div className="text-sm truncate">{c.title}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(c.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · {c.messages.filter((x) => x.role !== "activity").length} messages{c.createdLessonIds.length ? " · lesson made" : ""}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="rounded-2xl border border-border bg-muted/20 focus-within:border-[color:var(--cyan)] transition-colors">
            {pending.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 pt-3">
                {pending.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 rounded-lg border border-border bg-background pl-1 pr-2 py-1 max-w-[220px]">
                    <Thumb r={r} className="h-8 w-8" />
                    <span className="text-xs truncate">{r.name}</span>
                    {r.status === "uploading" && <Loader2 className="size-3 animate-spin shrink-0 text-muted-foreground" />}
                    {r.status === "failed" && <AlertTriangle className="size-3 shrink-0 text-destructive" />}
                    <button onClick={() => removeResource(r.id)} aria-label={`Remove ${r.name}`} className="text-muted-foreground hover:text-foreground shrink-0"><X className="size-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              rows={1}
              placeholder={draft ? "Ask for changes, then build again…" : empty ? "Describe the lesson you want…" : "Reply…"}
              className="block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-2 px-2 pb-2">
              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="text-muted-foreground" title="Add files">
                <Paperclip className="size-4" />
              </Button>
              <input ref={fileRef} type="file" multiple className="hidden"
                accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.csv"
                onChange={(e) => { if (e.target.files?.length) void addFiles(e.target.files); e.target.value = ""; }} />
              <span className="hidden md:inline text-[11px] text-muted-foreground truncate">
                {uploading ? "Uploading files…" : "Enter to send · Shift+Enter for a new line · drop files anywhere · paste a link"}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={build} disabled={!canBuild} className="gap-1.5" title="Turn the plan so far into a lesson">
                  <Hammer className="size-4" /> {draft ? "Build again" : "Build lesson"}
                </Button>
                {working && busy !== "saving" ? (
                  <Button size="sm" variant="secondary" onClick={stop} title="Stop (Esc)" className="size-8 p-0 rounded-full"><Square className="size-3.5 fill-current" /></Button>
                ) : (
                  <Button size="sm" onClick={() => void send()} disabled={working || uploading || (!input.trim() && !pending.length)} title="Send (Enter)" className="size-8 p-0 rounded-full">
                    <ArrowUp className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {dragging && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="rounded-2xl border-2 border-dashed border-[color:var(--cyan)] px-10 py-8 text-center">
            <div className="text-lg font-bold">Drop to add to the lesson</div>
            <div className="text-xs text-muted-foreground mt-1">Pictures, slides, documents, sound, video or a link</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Conversation lines ─────────────────────────

function Thumb({ r, className }: { r: AgentResource; className: string }) {
  const icon = r.kind === "audio" ? <Music className="size-4" /> : r.kind === "video" ? <Film className="size-4" /> :
    r.kind === "document" ? <FileText className="size-4" /> : <Link2 className="size-4" />;
  return (
    <div className={`${className} shrink-0 rounded bg-muted overflow-hidden flex items-center justify-center text-muted-foreground`}>
      {r.kind === "image" && r.url ? <img src={r.url} alt="" className="h-full w-full object-cover" /> : icon}
    </div>
  );
}

function Activity({ text, running, tone, onRetry }: { text: string; running?: boolean; tone?: "ok" | "error"; onRetry?: () => void }) {
  return (
    <div className={`flex items-start gap-2 text-xs ${tone === "error" ? "text-destructive" : "text-muted-foreground"}`}>
      <span className="mt-0.5 shrink-0">
        {running ? <Loader2 className="size-3.5 animate-spin text-[color:var(--cyan)]" /> :
          tone === "error" ? <AlertTriangle className="size-3.5" /> :
          tone === "ok" ? <Check className="size-3.5 text-[color:var(--cyan)]" /> :
          <span className="block size-1.5 mt-1 ml-1 rounded-full bg-muted-foreground" />}
      </span>
      <div className="min-w-0 whitespace-pre-wrap">
        {text}
        {onRetry && <button onClick={onRetry} className="ml-2 underline underline-offset-2 text-foreground">Try again</button>}
      </div>
    </div>
  );
}

function Line({ m, byId, draft, onCreate, saving, created, onRetry }: {
  m: AgentMessage;
  byId: Map<string, AgentResource>;
  draft: AgentDraft | null;
  onCreate: () => void;
  saving: boolean;
  created: boolean;
  onRetry?: () => void;
}) {
  if (m.role === "activity") {
    return (
      <div className="space-y-3">
        <Activity text={m.content} tone={m.tone} onRetry={onRetry} />
        {draft && <DraftCard draft={draft} onCreate={onCreate} saving={saving} created={created} />}
      </div>
    );
  }
  if (m.role === "user") {
    const files = (m.attachments ?? []).map((id) => byId.get(id)).filter((r): r is AgentResource => !!r);
    return (
      <div className="flex flex-col items-end gap-2">
        {files.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[85%]">
            {files.map((r) => (
              <div key={r.id} className="flex items-center gap-1.5 rounded-md border border-border px-1 py-0.5 max-w-[180px]">
                <Thumb r={r} className="h-6 w-6" />
                <span className="text-[11px] truncate">{r.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="max-w-[85%] rounded-2xl bg-[color:var(--cyan)]/10 px-4 py-2 text-sm whitespace-pre-wrap">{m.content}</div>
      </div>
    );
  }
  return <div className="text-sm leading-relaxed"><Markdownish text={m.content} /></div>;
}

function UsageChip({ session, today }: { session: { calls: number; prompt_tokens: number; completion_tokens: number }; today: AgentToday | null }) {
  if (!session.calls && !today) return null;
  return (
    <div className="hidden md:block text-[10px] text-muted-foreground text-right leading-tight mr-1"
      title="Rough cost at list prices. Lovable's credit charge may differ.">
      <div>This chat ≈ ${estimateUsd(session).toFixed(2)} · {session.calls} calls</div>
      {today && <div>Today, everyone ≈ ${estimateUsd(today).toFixed(2)}</div>}
    </div>
  );
}

// ── Draft ───────────────────────────────────────

type AnyContent = { type: string; [k: string]: unknown };

function summary(c: AnyContent): { label: string; text: string; img?: string } {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  switch (c.type) {
    case "image": return { label: "Picture", text: s(c.title) || s(c.file_name), img: s(c.url) };
    case "whiteboard": return { label: "Whiteboard", text: s(c.title), img: s(c.image_url) || undefined };
    case "youtube": return { label: "YouTube", text: s(c.url) };
    case "video": return { label: "Video", text: s(c.file_name) || s(c.url) };
    case "audio": return { label: "Audio", text: s(c.title) };
    case "embed": return { label: "Embed", text: s(c.description) || s(c.url) };
    case "text_slide": return { label: "Slide", text: [s(c.title), s(c.text)].filter(Boolean).join(": ") };
    case "question_round": return { label: "Quiz", text: `${Array.isArray(c.questions) ? c.questions.length : 0} questions` };
    case "word_cloud": return { label: "Word cloud", text: s(c.prompt) };
    case "voting": return { label: "Vote", text: s(c.question) };
    case "padlet": return { label: "Shared board", text: s(c.question) };
    case "quiz_buzzer": return { label: "Buzzer quiz", text: `${Array.isArray(c.questions) ? c.questions.length : 0} questions` };
    case "wheel_spinner": return { label: "Wheel", text: s(c.prompt) };
    case "countdown_timer": case "host_timer": return { label: "Timer", text: s(c.label) };
    case "rotation_timer": return { label: "Rotation timer", text: s(c.label) };
    case "confidence_checker": return { label: "Confidence check", text: s(c.prompt) };
    case "waiting": return { label: "Standing by", text: "" };
    default: return { label: c.type.replace(/_/g, " "), text: s(c.prompt) || s(c.question) || s(c.title) || s(c.label) };
  }
}

function Cell({ c }: { c: AnyContent }) {
  const v = summary(c);
  return (
    <div className="flex items-center gap-2 min-w-0">
      {v.img && <img src={v.img} alt="" className="h-9 w-14 rounded object-cover shrink-0" />}
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)]">{v.label}</div>
        <div className="text-xs line-clamp-2">{v.text}</div>
      </div>
    </div>
  );
}

function DraftCard({ draft, onCreate, saving, created }: { draft: AgentDraft; onCreate: () => void; saving: boolean; created: boolean }) {
  const { session } = draft;
  const [open, setOpen] = useState(true);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  return (
    <section className="rounded-xl border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/[0.03] overflow-hidden">
      <div className="p-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold">{session.lesson.title}</h2>
          <p className="text-xs text-muted-foreground max-w-xl">{session.lesson.description}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {session.slots.length} steps · {session.lesson.estimated_duration_mins} min · {draft.level}
            {draft.ambientUrl ? " · background music on" : ""}
          </p>
        </div>
        <Button onClick={onCreate} disabled={saving} className="uppercase tracking-widest">
          {saving ? "Please wait…" : created ? "Create another copy" : "Create lesson"}
        </Button>
      </div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-1 px-4 py-2 border-t border-border/60 text-xs text-muted-foreground hover:text-foreground">
        {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />} {open ? "Hide" : "Show"} the steps
      </button>
      {open && (
        <div className="px-2 pb-3 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="p-2">#</th><th className="p-2">Step</th><th className="p-2">Big screen</th><th className="p-2">Touch screens</th>
                </tr>
              </thead>
              <tbody>
                {session.slots.map((slot, i) => (
                  <tr key={i} className="border-t border-border/60 align-top">
                    <td className="p-2 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="p-2 min-w-[8rem]">
                      <div className="text-xs font-semibold">{slot.name}</div>
                      <div className="text-[10px] text-muted-foreground">{slot.lead_phase} · {slot.duration_mins} min</div>
                    </td>
                    <td className="p-2"><Cell c={slot.host as AnyContent} /></td>
                    <td className="p-2">
                      {same(slot.host, slot.screen1) && same(slot.screen1, slot.screen2)
                        ? <span className="text-[10px] text-muted-foreground">Same as big screen</span>
                        : <Cell c={slot.screen1 as AnyContent} />}
                      {!same(slot.screen1, slot.screen2) && <div className="mt-1"><Cell c={slot.screen2 as AnyContent} /></div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {draft.warnings.length > 0 && (
            <details className="px-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer">{draft.warnings.length} automatic fix{draft.warnings.length === 1 ? "" : "es"}</summary>
              <ul className="list-disc pl-5 mt-1">{draft.warnings.map((w, i) => <li key={i}>{w.slotIndex !== null ? `Step ${w.slotIndex + 1}: ` : ""}{w.message}</li>)}</ul>
            </details>
          )}
          {session.teaching_notes.verify_before_teaching.length > 0 && (
            <div className="px-2 text-xs">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Check before teaching</div>
              <ul className="list-disc pl-5 space-y-0.5">{session.teaching_notes.verify_before_teaching.map((v, i) => <li key={i}>{v}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ── Just enough markdown for the agent's replies: tables, lists, headings, bold, code ──

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <b key={i}>{part.slice(2, -2)}</b> :
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? <code key={i} className="rounded bg-muted px-1 text-[0.9em]">{part.slice(1, -1)}</code> :
    <span key={i}>{part}</span>,
  );
}

function Markdownish({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        <div key={`t${i}`} className="overflow-x-auto my-3 rounded-lg border border-border">
          <table className="w-full text-xs border-collapse">
            <thead><tr>{head?.map((c, j) => <th key={j} className="border-b border-border px-2 py-1.5 text-left bg-muted/40 font-semibold">{inline(c)}</th>)}</tr></thead>
            <tbody>{body.map((r, k) => <tr key={k} className="border-t border-border/60">{r.map((c, j) => <td key={j} className="px-2 py-1.5 align-top">{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*#{1,4}\s/.test(line)) {
      out.push(<div key={i} className="font-bold mt-3 mb-1">{inline(line.replace(/^\s*#+\s*/, ""))}</div>);
    } else if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      out.push(<hr key={i} className="my-3 border-border" />);
    } else if (/^\s*\d+\.\s/.test(line)) {
      const n = line.match(/^\s*(\d+)\./)![1];
      out.push(<div key={i} className="pl-5 -indent-4 my-0.5"><span className="text-muted-foreground">{n}.</span> {inline(line.replace(/^\s*\d+\.\s/, ""))}</div>);
    } else if (/^\s*[-*]\s/.test(line)) {
      out.push(<div key={i} className="pl-5 -indent-3 my-0.5">• {inline(line.replace(/^\s*[-*]\s/, ""))}</div>);
    } else if (line.trim()) {
      out.push(<p key={i} className="my-1.5">{inline(line)}</p>);
    }
    i++;
  }
  return <div>{out}</div>;
}
