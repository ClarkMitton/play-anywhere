// Whitespace keeps a JSON response active without changing its final shape.
export function streamJsonResponse(work: () => Promise<Response>, headers: HeadersInit): Response {
  const encoder = new TextEncoder();
  let active = true;
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode("\n"));
      const heartbeat = setInterval(() => {
        if (active) controller.enqueue(encoder.encode("\n"));
      }, 5_000);
      try {
        const result = await work();
        if (active) controller.enqueue(encoder.encode(await result.text()));
      } catch {
        if (active) controller.enqueue(encoder.encode(JSON.stringify({ ok: false, error: "The connection was interrupted. Your saved chat is still available; try Build again." })));
      } finally {
        clearInterval(heartbeat);
        if (active) controller.close();
        active = false;
      }
    },
    cancel() { active = false; },
  });
  return new Response(body, { headers: { ...Object.fromEntries(new Headers(headers)), "Content-Type": "application/json", "Cache-Control": "no-cache, no-transform" } });
}

export async function readChatCompletion(response: Response) {
  if (!response.body) throw new Error("The AI returned no response stream.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let completed = false;
  let usage = { prompt_tokens: 0, completion_tokens: 0 };
  function consume(frame: string) {
    const data = frame.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
    if (!data) return;
    if (data === "[DONE]") { completed = true; return; }
    const event = JSON.parse(data);
    if (event.error) throw new Error(event.error.message ?? "The AI service interrupted the build.");
    const choice = event.choices?.[0];
    if (choice?.delta?.refusal || choice?.finish_reason === "content_filter") throw new Error("The AI declined this request.");
    if (typeof choice?.delta?.content === "string") text += choice.delta.content;
    if (event.usage) usage = { prompt_tokens: Number(event.usage.prompt_tokens) || 0, completion_tokens: Number(event.usage.completion_tokens) || 0 };
  }
  try {
    while (true) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      buffer = buffer.replace(/\r\n/g, "\n");
      let end: number;
      while ((end = buffer.indexOf("\n\n")) >= 0) {
        consume(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
      }
      if (chunk.done) break;
    }
    if (buffer.trim()) consume(buffer);
    if (!completed) throw new Error("The AI connection ended before the lesson was complete. Your chat is saved; try Build again.");
    if (!text.trim()) throw new Error("The AI returned an empty reply.");
    return { text, usage };
  } finally { reader.releaseLock(); }
}