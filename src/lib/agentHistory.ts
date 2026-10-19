import type { AgentDraft, AgentMessage, AgentResource } from "./lessonAgent";

export type AgentConversation = {
  id: string;
  updatedAt: string;
  title: string;
  folder: string;
  messages: AgentMessage[];
  resources: AgentResource[];
  draft: AgentDraft | null;
  input: string;
  sourceLessonId?: string;
  createdLessonIds: string[];
};

export const AGENT_HISTORY_KEY = "lesson-agent:history:v1";

export function readAgentHistory(storage: Pick<Storage, "getItem">): AgentConversation[] {
  try {
    const value = JSON.parse(storage.getItem(AGENT_HISTORY_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((c) => c && typeof c.id === "string" && Array.isArray(c.messages) && Array.isArray(c.resources)) : [];
  } catch {
    return [];
  }
}

export function upsertConversation(history: AgentConversation[], conversation: AgentConversation): AgentConversation[] {
  return [conversation, ...history.filter((c) => c.id !== conversation.id)];
}

export function writeAgentConversation(storage: Pick<Storage, "getItem" | "setItem">, conversation: AgentConversation) {
  const next = upsertConversation(readAgentHistory(storage), conversation);
  storage.setItem(AGENT_HISTORY_KEY, JSON.stringify(next));
  return next;
}