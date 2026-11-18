type Usage = { prompt_tokens: number; completion_tokens: number };

/** A tool the model asked to use, with its arguments as the JSON text it wrote. */
export type ToolCall = { id: string; name: string; arguments: string };

/**
 * Consume provider SSE, keeping usage and rejecting unfinished lessons.
 * onDelta sees each piece of text as it arrives, so the page can show it.
 */
export async function readChatCompletion(
  response: Response,
  onDelta?: (piece: string) => void,
): Promise<{ text: string; usage: Usage; toolCalls: ToolCall[] }> {
  if (!response.body) throw new Error("The AI connection ended before a reply arrived.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let text = "";
  let completed = false;
  // Tool requests arrive in pieces, matched by their index.
  const calls: ToolCall[] = [];
  const usage: Usage = { prompt_tokens: 0, completion_tokens: 0 };
  const frame = (line: string) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    const payload = JSON.parse(data);
    if (payload.error) throw new Error(payload.error.message ?? "The AI connection failed.");
    if (payload.usage) {
      usage.prompt_tokens = Number(payload.usage.prompt_tokens) || 0;
      usage.completion_tokens = Number(payload.usage.completion_tokens) || 0;
    }
    for (const choice of payload.choices ?? []) {
      if (choice.delta?.refusal || choice.finish_reason === "content_filter") throw new Error("The AI declined this request.");
      if (typeof choice.delta?.content === "string") {
        text += choice.delta.content;
        if (choice.delta.content) onDelta?.(choice.delta.content);
      }
      for (const t of choice.delta?.tool_calls ?? []) {
        const i = Number(t.index ?? 0);
        calls[i] ??= { id: "", name: "", arguments: "" };
        if (t.id) calls[i].id = t.id;
        if (t.function?.name) calls[i].name += t.function.name;
        if (t.function?.arguments) calls[i].arguments += t.function.arguments;
      }
      if (choice.finish_reason === "stop" || choice.finish_reason === "tool_calls") completed = true;
      if (choice.finish_reason === "length") throw new Error("The AI reply was incomplete. Your chat is still saved; try a smaller lesson.");
    }
  };
  try {
    while (true) {
      const chunk = await reader.read();
      pending += decoder.decode(chunk.value, { stream: !chunk.done });
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) frame(line.trimEnd());
      if (chunk.done) break;
    }
    if (pending.trim()) frame(pending.trimEnd());
  } finally {
    reader.releaseLock();
  }
  if (!completed) throw new Error("The AI connection ended before the lesson was complete. Your chat is still saved; try Build again.");
  const toolCalls = calls.filter((c) => c && c.name);
  if (!text.trim() && !toolCalls.length) throw new Error("The AI returned an empty reply.");
  return { text, usage, toolCalls };
}

/**
 * The same, for Claude models: the gateway serves them only in Anthropic's own
 * message format, whose stream is a different set of events.
 */
export async function readAnthropicStream(
  response: Response,
  onDelta?: (piece: string) => void,
): Promise<{ text: string; usage: Usage }> {
  if (!response.body) throw new Error("The AI connection ended before a reply arrived.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let text = "";
  let stop: string | null = null;
  const usage: Usage = { prompt_tokens: 0, completion_tokens: 0 };
  const frame = (line: string) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data) return;
    const event = JSON.parse(data);
    if (event.type === "error") throw new Error(event.error?.message ?? "The AI connection failed.");
    if (event.type === "message_start") {
      const u = event.message?.usage ?? {};
      usage.prompt_tokens = (Number(u.input_tokens) || 0) + (Number(u.cache_read_input_tokens) || 0) + (Number(u.cache_creation_input_tokens) || 0);
      usage.completion_tokens = Number(u.output_tokens) || 0;
    }
    if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && typeof event.delta.text === "string") {
      text += event.delta.text;
      if (event.delta.text) onDelta?.(event.delta.text);
    }
    if (event.type === "message_delta") {
      if (event.usage?.output_tokens != null) usage.completion_tokens = Number(event.usage.output_tokens) || 0;
      if (event.delta?.stop_reason) stop = event.delta.stop_reason;
    }
  };
  try {
    while (true) {
      const chunk = await reader.read();
      pending += decoder.decode(chunk.value, { stream: !chunk.done });
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) frame(line.trimEnd());
      if (chunk.done) break;
    }
    if (pending.trim()) frame(pending.trimEnd());
  } finally {
    reader.releaseLock();
  }
  if (stop === "refusal") throw new Error("The AI declined this request.");
  if (stop === "max_tokens") throw new Error("The AI reply was incomplete. Your chat is still saved; try a smaller lesson.");
  if (stop !== "end_turn" && stop !== "stop_sequence") throw new Error("The AI connection ended before the lesson was complete. Your chat is still saved; try Build again.");
  if (!text.trim()) throw new Error("The AI returned an empty reply.");
  return { text, usage };
}

export type AgentEvent =
  | { type: "delta"; text: string }
  | { type: "activity"; text: string }
  | { type: "progress"; steps: number }
  | { type: "ping" };

/**
 * The live reply the page asks for with stream: true. One JSON object per
 * line: deltas and progress while the model works, pings to keep the line
 * open, then exactly one {"type":"result", ...} line with the same body the
 * plain JSON reply would have carried. A reply that ends without a result
 * line was cut off, and the page treats it as a failure, never as a lesson.
 */
export function streamEventsResponse(
  work: (emit: (event: AgentEvent) => void) => Promise<Response>,
  headers: HeadersInit,
  heartbeatMs = 5000,
): Response {
  let timer: ReturnType<typeof setInterval> | undefined;
  let cancelled = false;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (value: unknown) => {
        if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify(value) + "\n"));
      };
      timer = setInterval(() => send({ type: "ping" }), heartbeatMs);
      void (async () => {
        try {
          const result = await work(send);
          send({ type: "result", ...(await result.json()) });
        } catch (error) {
          send({ type: "result", ok: false, error: error instanceof Error ? error.message : "The agent stopped unexpectedly." });
        } finally {
          clearInterval(timer);
          if (!cancelled) controller.close();
        }
      })();
    },
    cancel() { cancelled = true; clearInterval(timer); },
  });
  return new Response(stream, { headers: { ...Object.fromEntries(new Headers(headers)), "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache, no-transform" } });
}

/** Whitespace is valid before JSON and keeps a waiting browser connected. */
export function streamJsonResponse(work: () => Promise<Response>, headers: HeadersInit, heartbeatMs = 5000): Response {
  let timer: ReturnType<typeof setInterval> | undefined;
  let cancelled = false;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode("\n"));
      timer = setInterval(() => { if (!cancelled) controller.enqueue(encoder.encode("\n")); }, heartbeatMs);
      void (async () => {
        try {
          const result = await work();
          const body = await result.text();
          if (!cancelled) controller.enqueue(encoder.encode(body));
        } catch (error) {
          if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "The lesson build stopped unexpectedly." })));
        } finally {
          clearInterval(timer);
          if (!cancelled) controller.close();
        }
      })();
    },
    cancel() { cancelled = true; clearInterval(timer); },
  });
  return new Response(stream, { headers: { ...Object.fromEntries(new Headers(headers)), "Content-Type": "application/json", "Cache-Control": "no-cache, no-transform" } });
}