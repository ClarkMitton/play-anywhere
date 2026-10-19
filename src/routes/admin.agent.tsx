// Build a lesson with the agent — /admin/agent (and /admin/agent?lesson=<id>
// to change an existing one).
//
// Renders behind the /admin PIN gate. Flow: add resources (uploaded to
// lesson-media straight away) -> chat about the plan -> Build -> check the
// steps -> Create lesson, which opens it in the Stage Designer. Changing an
// existing lesson always saves a new copy, so the original is never lost.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, History, Plus } from "lucide-react";
import { readAgentHistory, writeAgentConversation, type AgentConversation } from "@/lib/agentHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractDocumentRich } from "@/lib/documentParser";
import {
  buildWithAgent,
  chatWithAgent,
  describeImages,
  estimateUsd,
  loadLessonForAgent,
  newFolder,
  prepareImage,
  saveAgentLesson,
  uploadToLessonMedia,
  validateAgentBuild,
  type AgentDraft,
  type AgentMessage,
  type AgentResource,
  type AgentToday,
} from "@/lib/lessonAgent";

export const Route = createFileRoute("/admin/agent")({
  validateSearch: (search: Record<string, unknown>) => ({
    lesson: typeof search.lesson === "string" ? search.lesson : undefined,
    chat: typeof search.chat === "string" ? search.chat : undefined,
  }),
  head: () => ({ meta: [
    { title: "Lesson builder · Bradford College Immersive Learning" },
    { name: "description", content: "Plan and build Bradford College immersive lessons from your teaching resources." },
    { property: "og:title", content: "Lesson builder · Bradford College Immersive Learning" },
    { property: "og:description", content: "Plan and build immersive lessons from your teaching resources." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AgentPage,
});

type Saved = { folder: string; messages: AgentMessage[]; resources: AgentResource[]; draft: AgentDraft | null };
const MAX_UPLOAD_MB = 50;
const DESCRIBE_BATCH = 8;

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
  if (/\.(pdf|docx?|pptx?)$/i.test(file.name)) return "document";
  return null;
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
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState<null | "describing" | "thinking" | "building" | "saving">(null);
  const [session, setSession] = useState({ calls: 0, prompt_tokens: 0, completion_tokens: 0 });
  const [today, setToday] = useState<AgentToday | null>(null);
  const [restored, setRestored] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [history, setHistory] = useState<AgentConversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDraft, setShowDraft] = useState(true);
  const [createdLessonIds, setCreatedLessonIds] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const resourcesRef = useRef(resources);
  resourcesRef.current = resources;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Browser-only history: preserve resources, drafts and the original conversation.
  useEffect(() => {
    const all = readAgentHistory(localStorage);
    setHistory(all);
    const saved = chatId ? all.find((c) => c.id === chatId) : all.find((c) => c.sourceLessonId === lessonId);
    const legacy = !saved && !chatId ? loadSaved(lessonId) : null;
    setConversationId(saved?.id ?? crypto.randomUUID());
    setFolder(saved?.folder ?? legacy?.folder ?? newFolder());
    setMessages(saved?.messages ?? legacy?.messages ?? []);
    setResources((saved?.resources ?? legacy?.resources ?? []).filter((r) => r.status === "ready"));
    setDraft(saved?.draft ?? legacy?.draft ?? null);
    setInput(saved?.input ?? "");
    setCreatedLessonIds(saved?.createdLessonIds ?? []);
    setShowDraft(true);
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

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

  // ── Adding resources ──────────────────────────
  const addFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      const kind = kindOf(file);
      const id = crypto.randomUUID();
      if (!kind) {
        toast.error(`${file.name}: not a picture, sound, video or document`);
        continue;
      }
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast.error(`${file.name} is over ${MAX_UPLOAD_MB} MB`);
        continue;
      }
      setResources((rs) => [...rs, { id, name: file.name, kind, status: "uploading" }]);
      try {
        if (kind === "image") {
          const { blob, previewDataUrl } = await prepareImage(file);
          const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          const url = await uploadToLessonMedia(folder, name, blob, "image/jpeg");
          patch(id, { url, previewDataUrl, status: "ready" });
        } else if (kind === "document") {
          const { text } = await extractDocumentRich(file);
          patch(id, { text: text.slice(0, 40_000), status: "ready" });
        } else {
          const url = await uploadToLessonMedia(folder, file.name, file, file.type);
          patch(id, { url, status: "ready" });
        }
      } catch (e) {
        patch(id, { status: "failed", error: e instanceof Error ? e.message : "upload failed" });
      }
    }
  };

  const addLink = () => {
    const url = link.trim();
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Paste a full link starting with https://");
      return;
    }
    const name = /youtu\.?be/i.test(url) ? "YouTube clip" : new URL(url).hostname.replace(/^www\./, "");
    setResources((rs) => [...rs, { id: crypto.randomUUID(), name, kind: "link", url, status: "ready" }]);
    setLink("");
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
    const pending = list.filter((r) => r.kind === "image" && r.status === "ready" && !r.description && r.previewDataUrl);
    for (let i = 0; i < pending.length; i += DESCRIBE_BATCH) {
      setBusy("describing");
      const batch = pending.slice(i, i + DESCRIBE_BATCH);
      const res = await describeImages(batch.map((r) => ({ id: r.id, name: r.name, dataUrl: r.previewDataUrl! })));
      if (!res.ok) {
        toast.error(`Could not look at the pictures: ${res.error}`);
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
    return list;
  };

  const uploading = resources.some((r) => r.status === "uploading");

  // ── Chat and build ────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || busy || uploading) return;
    const next: AgentMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    try {
      const list = await describePending();
      if (!list) return;
      setBusy("thinking");
      const res = await chatWithAgent(next, list, draftOrCurrent());
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      track(res.usage, res.today);
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } finally {
      setBusy(null);
    }
  };

  // Once a draft exists, changes apply to the draft rather than starting again.
  const draftOrCurrent = () =>
    draft
      ? { title: draft.session.lesson.title, ambient_url: draft.ambientUrl, slots: draft.session.slots }
      : current;

  const build = async () => {
    if (busy || uploading) return;
    try {
      const list = await describePending();
      if (!list) return;
      setBusy("building");
      let issues: string[] = [];
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await buildWithAgent(messages, list, draftOrCurrent(), issues);
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        track(res.usage, res.today);
        const checked = validateAgentBuild(res.data);
        if (checked.ok) {
          setDraft(checked.draft);
          setShowDraft(true);
          toast.success(`Built ${checked.draft.session.slots.length} steps. Check them below.`);
          return;
        }
        issues = checked.issues;
      }
      toast.error("The build broke the room's rules twice. Say what to change and try again.");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `The build did not pass the checks:\n${issues.slice(0, 8).map((i) => `- ${i}`).join("\n")}` },
      ]);
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    if (!draft || busy) return;
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
      toast.error(e instanceof Error ? e.message : "Could not save the lesson");
    } finally {
      setBusy(null);
    }
  };

  const startOver = () => {
    if (busy || uploading) return;
    setConversationId(crypto.randomUUID());
    setCreatedLessonIds([]);
    setInput("");
    setShowDraft(true);
    setMessages([]);
    setResources([]);
    setDraft(null);
    setFolder(newFolder());
    setSession({ calls: 0, prompt_tokens: 0, completion_tokens: 0 });
  };

  const busyLabel =
    busy === "describing" ? "Looking at the pictures…" :
    busy === "thinking" ? "Thinking…" :
    busy === "building" ? "Building the lesson (can take a minute)…" :
    busy === "saving" ? "Saving…" : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-4">
      <header className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Lessons
          </Link>
          <h1 className="text-xl font-extrabold uppercase tracking-widest">
            {lessonId ? "Change a lesson with the agent" : "Build with the agent"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistory((v) => !v)}><History className="size-4" /> Saved chats</Button>
          <Button variant="outline" size="sm" onClick={startOver} disabled={!!busy || uploading}><Plus className="size-4" /> New chat</Button>
          <UsageChip session={session} today={today} />
        </div>
      </header>

      {showHistory && <section className="border-y border-border py-3 space-y-2">
        <h2 className="font-semibold">Saved chats · this browser</h2>
        {!history.length && <p className="text-sm text-muted-foreground">No saved conversations yet.</p>}
        <ul className="max-h-64 overflow-y-auto space-y-2">
          {history.map((c) => <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
            <div className="min-w-0"><p className="text-sm break-words">{c.title}</p><p className="text-xs text-muted-foreground">{new Date(c.updatedAt).toLocaleString()} · {c.messages.length} messages</p></div>
            <Button variant="outline" size="sm" disabled={!!busy || uploading} onClick={() => {
              setRestored(false); setShowHistory(false);
              navigate({ to: "/admin/agent", search: { chat: c.id, lesson: c.sourceLessonId } });
            }}>Open chat</Button>
          </li>)}
        </ul>
      </section>}

      {lessonId && (
        <div className="rounded-lg border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/5 px-4 py-2 text-sm">
          {current ? <>Changing <b>{current.title}</b> ({current.slots.length} steps). It saves as a new copy; the original stays as it is.</> : "Loading the lesson…"}
        </div>
      )}

      <div ref={chatRef} className="grid gap-4 lg:grid-cols-[minmax(280px,380px)_1fr]">
        {/* Resources */}
        <section className="rounded-xl border border-border p-3 space-y-3 h-fit">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Resources</h2>
          <DropZone onFiles={addFiles} />
          <div className="flex gap-2">
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a YouTube or Wordwall link"
              className="h-9 text-xs" onKeyDown={(e) => e.key === "Enter" && addLink()} />
            <Button size="sm" variant="outline" onClick={addLink}>Add</Button>
          </div>
          <ul className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {resources.map((r, i) => (
              <li key={r.id} className="flex gap-2 items-start rounded-lg border border-border/60 p-2">
                <div className="h-12 w-20 shrink-0 rounded bg-muted overflow-hidden flex items-center justify-center text-lg">
                  {r.kind === "image" && r.url ? <img src={r.url} alt="" className="h-full w-full object-cover" /> :
                    r.kind === "audio" ? "🎵" : r.kind === "video" ? "🎬" : r.kind === "document" ? "📄" : "🔗"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate">{i + 1}. {r.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-2">
                    {r.status === "uploading" ? "Uploading…" : r.status === "failed" ? `Failed: ${r.error}` :
                      r.description ?? (r.kind === "image" ? "Looked at when you send a message" : r.kind === "document" ? `${(r.text ?? "").length} characters read` : r.url)}
                  </div>
                </div>
                <div className="flex flex-col text-[10px] text-muted-foreground">
                  <button onClick={() => move(r.id, -1)} aria-label="move up">▲</button>
                  <button onClick={() => move(r.id, 1)} aria-label="move down">▼</button>
                  <button onClick={() => setResources((rs) => rs.filter((x) => x.id !== r.id))} aria-label="remove" className="hover:text-destructive">✕</button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">
            Pictures are resized and stored straight away. Order matters: the agent reads them top to bottom.
            Sound files can be steps or background music; just say which.
          </p>
        </section>

        {/* Chat */}
        <section className="rounded-xl border border-border flex flex-col min-h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Add your pictures, sound, documents and links on the left, then say what you want, for example:</p>
                <p className="italic">“Escape room for Entry 2. Start with the trailer, the sheets with questions are activities on the side screens, the music plays in the background, finish with the chandelier clip.”</p>
                <p>The agent proposes a screen map and asks a few questions. When you're happy, press Build lesson.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-xl bg-[color:var(--cyan)]/10 px-3 py-2 text-sm whitespace-pre-wrap" : "max-w-full text-sm"}>
                {m.role === "user" ? m.content : <Markdownish text={m.content} />}
              </div>
            ))}
            {busyLabel && <div className="text-xs text-[color:var(--cyan)] animate-pulse">{busyLabel}</div>}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border p-3 space-y-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3}
              placeholder={draft ? "Ask for changes to the draft, then Build again" : "What lesson do you want?"}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send(); }} />
            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={send} disabled={!!busy || uploading || !input.trim()}>Send</Button>
              <Button variant="outline" onClick={build} disabled={!!busy || uploading || (messages.length === 0 && !current)}
                className="border-[color:var(--cyan)] text-[color:var(--cyan)]">
                {draft ? "Build again" : "Build lesson"}
              </Button>
              <span className="text-[10px] text-muted-foreground">Ctrl+Enter sends</span>

            </div>
          </div>
        </section>
      </div>

      {draft && showDraft && <DraftView draft={draft} onCreate={create} saving={!!busy || uploading} onBack={() => {
        setShowDraft(false);
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />}
      {draft && !showDraft && <Button variant="outline" onClick={() => setShowDraft(true)}>Review current draft</Button>}
    </div>
  );
}

function DropZone({ onFiles }: { onFiles: (f: FileList) => void }) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); }}
      className={`flex flex-col items-center justify-center gap-1 h-24 rounded-lg border-2 border-dashed cursor-pointer text-xs text-center px-3 transition-colors ${over ? "border-[color:var(--cyan)] bg-[color:var(--cyan)]/5" : "border-border text-muted-foreground"}`}
    >
      <span className="font-semibold">Drop files here or click</span>
      <span className="text-[10px]">Pictures, sound, video, PDF, Word, PowerPoint</span>
      <input type="file" multiple className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
        onChange={(e) => { if (e.target.files?.length) onFiles(e.target.files); e.target.value = ""; }} />
    </label>
  );
}

function UsageChip({ session, today }: { session: { calls: number; prompt_tokens: number; completion_tokens: number }; today: AgentToday | null }) {
  const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
  return (
    <div className="text-[10px] text-muted-foreground text-right leading-relaxed" title="Rough estimate at Gemini 3.8 Flash list prices. Image descriptions use cheaper Flash Lite; historical totals may use older models. Lovable's credit charge may differ.">
      <div>
        This chat: {session.calls} calls · {k(session.prompt_tokens)} in / {k(session.completion_tokens)} out · ≈ ${estimateUsd(session).toFixed(2)}
      </div>
      {today && (
        <div>
          Today (everyone): {today.calls} calls · ≈ ${estimateUsd(today).toFixed(2)}
        </div>
      )}
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
    case "text_slide": return { label: "Text", text: [s(c.title), s(c.text)].filter(Boolean).join(": ") };
    case "question_round": return { label: "Questions", text: `${Array.isArray(c.questions) ? c.questions.length : 0} questions` };
    case "waiting": return { label: "Standing by", text: "" };
    default: return { label: c.type.replace(/_/g, " "), text: s(c.prompt) || s(c.question) || s(c.title) || s(c.label) };
  }
}

function Cell({ c }: { c: AnyContent }) {
  const v = summary(c);
  return (
    <div className="flex items-center gap-2 min-w-0">
      {v.img && <img src={v.img} alt="" className="h-10 w-16 rounded object-cover shrink-0" />}
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)]">{v.label}</div>
        <div className="text-xs truncate max-w-[22rem]">{v.text}</div>
      </div>
    </div>
  );
}

function DraftView({ draft, onCreate, saving, onBack }: { draft: AgentDraft; onCreate: () => void; saving: boolean; onBack: () => void }) {
  const { session } = draft;
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  return (
    <section className="rounded-xl border border-[color:var(--cyan)]/50 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{session.lesson.title}</h2>
          <p className="text-xs text-muted-foreground max-w-3xl">{session.lesson.description}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {session.slots.length} steps · {session.lesson.estimated_duration_mins} min · {draft.level}
            {draft.ambientUrl ? " · background music on" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onBack} disabled={saving}><ArrowLeft className="size-4" /> Back to chat</Button>
        <Button onClick={onCreate} disabled={saving} className="h-11 px-6 uppercase tracking-widest">
          {saving ? "Please wait…" : "Create lesson"}
        </Button>
        </div>
      </div>
      {draft.warnings.length > 0 && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">{draft.warnings.length} automatic fixes</summary>
          <ul className="list-disc pl-5 mt-1">{draft.warnings.map((w, i) => <li key={i}>{w.slotIndex !== null ? `Step ${w.slotIndex + 1}: ` : ""}{w.message}</li>)}</ul>
        </details>
      )}
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
                <td className="p-2">
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
      {session.teaching_notes.verify_before_teaching.length > 0 && (
        <div className="text-xs">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Check before teaching</div>
          <ul className="list-disc pl-5 space-y-0.5">{session.teaching_notes.verify_before_teaching.map((v, i) => <li key={i}>{v}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

// ── Just enough markdown for the agent's replies: tables, bullets, bold ──

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <b key={i}>{part.slice(2, -2)}</b> : <span key={i}>{part}</span>,
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
        <div key={`t${i}`} className="overflow-x-auto my-2">
          <table className="text-xs border-collapse">
            <thead><tr>{head?.map((c, j) => <th key={j} className="border border-border px-2 py-1 text-left bg-muted/40">{inline(c)}</th>)}</tr></thead>
            <tbody>{body.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className="border border-border px-2 py-1 align-top">{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*#{1,4}\s/.test(line)) {
      out.push(<div key={i} className="font-bold mt-2">{inline(line.replace(/^\s*#+\s*/, ""))}</div>);
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      out.push(<div key={i} className="pl-4 -indent-3">• {inline(line.replace(/^\s*([-*]|\d+\.)\s/, ""))}</div>);
    } else if (line.trim()) {
      out.push(<p key={i} className="my-1">{inline(line)}</p>);
    }
    i++;
  }
  return <div>{out}</div>;
}
