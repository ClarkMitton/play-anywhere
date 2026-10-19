import { test, expect } from "bun:test";
import { readAgentHistory, writeAgentConversation, type AgentConversation } from "./agentHistory";

test("saving another chat preserves the previous conversation and draft after lesson creation", () => {
  const data = new Map<string, string>();
  const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); } };
  const first: AgentConversation = { id: "first", updatedAt: "2026-10-19", title: "Safety", folder: "one", messages: [{ role: "user", content: "Build a safety lesson" }], resources: [], draft: null, input: "Add another activity", createdLessonIds: ["created-lesson"] };
  writeAgentConversation(storage, first);
  writeAgentConversation(storage, { ...first, id: "second", title: "English" });
  expect(readAgentHistory(storage).find((c) => c.id === "first")).toEqual(first);
});

test("editing a saved chat updates that chat without overwriting another", () => {
  const data = new Map<string, string>();
  const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); } };
  const chat: AgentConversation = { id: "a", updatedAt: "2026-10-19", title: "A", folder: "one", messages: [], resources: [], draft: null, input: "", createdLessonIds: [] };
  writeAgentConversation(storage, chat);
  writeAgentConversation(storage, { ...chat, id: "b" });
  writeAgentConversation(storage, { ...chat, input: "Rebuild this" });
  expect(readAgentHistory(storage)).toHaveLength(2);
  expect(readAgentHistory(storage).find((c) => c.id === "a")?.input).toBe("Rebuild this");
  expect(readAgentHistory(storage).find((c) => c.id === "b")?.input).toBe("");
});