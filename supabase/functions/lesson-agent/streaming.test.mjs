import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChatCompletion, streamEventsResponse, streamJsonResponse } from './streaming.ts';

function response(frames) {
  const encoder = new TextEncoder();
  return new Response(new ReadableStream({ start(c) { for (const f of frames) c.enqueue(encoder.encode(f)); c.close(); } }));
}
test('split SSE assembles complete text and token usage', async () => {
  const result = await readChatCompletion(response([
    'data: {"choices":[{"delta":{"content":"he',
    'llo"},"finish_reason":null}]}\n\n',
    'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\n',
    'data: {"choices":[],"usage":{"prompt_tokens":12,"completion_tokens":4}}\n\ndata: [DONE]\n\n',
  ]));
  assert.deepEqual(result, { text: 'hello', usage: { prompt_tokens: 12, completion_tokens: 4 } });
});
test('truncated JSON is never accepted as a complete build', async () => {
  await assert.rejects(readChatCompletion(response(['data: {"choices":[{"delta":{"content":"{\\\"lesson\\\":"}}]}\n\n'])), /before the lesson was complete/);
});
test('output limit ends the build without accepting partial text', async () => {
  await assert.rejects(readChatCompletion(response(['data: {"choices":[{"delta":{"content":"partial"},"finish_reason":"length"}]}\n\n'])), /incomplete/);
});
test('provider refusal is terminal', async () => {
  await assert.rejects(readChatCompletion(response(['data: {"choices":[{"delta":{"refusal":"No"},"finish_reason":"stop"}]}\n\n'])), /declined/);
});
test('waiting response emits heartbeat and finishes with parseable JSON', async () => {
  const res = streamJsonResponse(async () => { await new Promise(r => setTimeout(r, 30)); return Response.json({ ok: true, data: { slots: [1] } }); }, {}, 5);
  const text = await res.text();
  assert.ok(text.startsWith('\n\n'));
  assert.deepEqual(JSON.parse(text), { ok: true, data: { slots: [1] } });
});
test('failed work returns a readable error rather than broken JSON', async () => {
  const res = streamJsonResponse(async () => { throw new Error('Connection interrupted'); }, {});
  assert.deepEqual(await res.json(), { ok: false, error: 'Connection interrupted' });
});
test('each piece of text is passed on as it arrives', async () => {
  const pieces = [];
  await readChatCompletion(response([
    'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"lo"},"finish_reason":"stop"}]}\n\n',
  ]), (p) => pieces.push(p));
  assert.deepEqual(pieces, ['Hel', 'lo']);
});
test('live reply sends events then exactly one result line', async () => {
  const res = streamEventsResponse(async (emit) => { emit({ type: 'delta', text: 'Hi' }); emit({ type: 'progress', steps: 2 }); return Response.json({ ok: true, reply: 'Hi' }); }, {});
  assert.equal(res.headers.get('content-type'), 'application/x-ndjson');
  const lines = (await res.text()).trim().split('\n').map((l) => JSON.parse(l)).filter((e) => e.type !== 'ping');
  assert.deepEqual(lines, [{ type: 'delta', text: 'Hi' }, { type: 'progress', steps: 2 }, { type: 'result', ok: true, reply: 'Hi' }]);
});
test('a failed live reply still ends with a readable result', async () => {
  const res = streamEventsResponse(async () => { throw new Error('Connection interrupted'); }, {});
  const last = JSON.parse((await res.text()).trim().split('\n').pop());
  assert.deepEqual(last, { type: 'result', ok: false, error: 'Connection interrupted' });
});