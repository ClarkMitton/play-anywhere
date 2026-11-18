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
  assert.deepEqual(result, { text: 'hello', usage: { prompt_tokens: 12, completion_tokens: 4 }, toolCalls: [] });
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
test('a Claude stream assembles text and usage', async () => {
  const { readAnthropicStream } = await import('./streaming.ts');
  const pieces = [];
  const result = await readAnthropicStream(response([
    'event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":20,"output_tokens":1}}}\n\n',
    'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hel"}}\n\n',
    'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"lo"}}\n\n',
    'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":7}}\n\n',
    'event: message_stop\ndata: {"type":"message_stop"}\n\n',
  ]), (p) => pieces.push(p));
  assert.deepEqual(result, { text: 'Hello', usage: { prompt_tokens: 20, completion_tokens: 7 } });
  assert.deepEqual(pieces, ['Hel', 'lo']);
});
test('a Claude stream that stops early is never accepted', async () => {
  const { readAnthropicStream } = await import('./streaming.ts');
  await assert.rejects(readAnthropicStream(response([
    'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"{\\"lesson\\":"}}\n\n',
  ])), /before the lesson was complete/);
  await assert.rejects(readAnthropicStream(response([
    'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"partial"}}\n\n',
    'data: {"type":"message_delta","delta":{"stop_reason":"max_tokens"}}\n\n',
  ])), /incomplete/);
});
test('a request to use a tool is collected from its pieces', async () => {
  const result = await readChatCompletion(response([
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_1","function":{"name":"find_youtube_videos","arguments":"{\\"query\\":"}}]}}]}\n\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\\"salon fire\\"}"}}]},"finish_reason":"tool_calls"}]}\n\n',
  ]));
  assert.deepEqual(result.toolCalls, [{ id: 'call_1', name: 'find_youtube_videos', arguments: '{"query":"salon fire"}' }]);
  assert.equal(result.text, '');
});
