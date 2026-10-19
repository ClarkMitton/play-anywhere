import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChatCompletion, streamJsonResponse } from './streaming.ts';

function response(chunks) {
  return new Response(new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 1));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  }));
}

test('consumes separately arriving metadata, keepalives, split text and usage', async () => {
  const result = await readChatCompletion(response([
    ': ping\n\n', 'data: {"choices":[{"delta":{}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"hel', 'lo"}}]}\n\n',
    'data: {"choices":[],"usage":{"prompt_tokens":12,"completion_tokens":3}}\n\n',
    'data: [DONE]\n\n',
  ]));
  assert.deepEqual(result, { text: 'hello', usage: { prompt_tokens: 12, completion_tokens: 3 } });
});
test('does not accept a truncated generation as a completed lesson', async () => {
  await assert.rejects(readChatCompletion(response(['data: {"choices":[{"delta":{"content":"partial"}}]}\n\n'])), /before the lesson was complete/);
});
test('heartbeat arrives before work finishes and final response remains ordinary JSON', async () => {
  let finish;
  const work = new Promise(resolve => { finish = resolve; });
  const result = streamJsonResponse(() => work, {});
  const reader = result.body.getReader();
  assert.equal(new TextDecoder().decode((await reader.read()).value), '\n');
  finish(Response.json({ ok: true, data: { slots: [1, 2, 3] } }));
  let remaining = '';
  while (true) { const chunk = await reader.read(); if (chunk.done) break; remaining += new TextDecoder().decode(chunk.value); }
  assert.deepEqual(JSON.parse(remaining), { ok: true, data: { slots: [1, 2, 3] } });
});
test('provider refusals are terminal', async () => {
  await assert.rejects(readChatCompletion(response(['data: {"choices":[{"delta":{"refusal":"no"}}]}\n\n'])), /declined/);
});