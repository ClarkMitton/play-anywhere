type Usage = { prompt_tokens: number; completion_tokens: number };

/** Consume provider SSE, keeping usage and rejecting unfinished lessons. */
export async function readChatCompletion(response: Response): Promise<{ text: string; usage: Usage }> {
  if (!response.body) throw new Error("The AI connection ended before a reply arrived.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let text = "";
  let completed = false;
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
      if (typeof choice.delta?.content === "string") text += choice.delta.content;
      if (choice.finish_reason === "stop") completed = true;
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
  if (!text.trim()) throw new Error("The AI returned an empty reply.");
  return { text, usage };
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