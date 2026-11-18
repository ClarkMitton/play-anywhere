import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clock, formatTranscript, isoDurationSeconds, videosForModel } from './videos.ts';

test('YouTube lengths become seconds and clock times', () => {
  assert.equal(isoDurationSeconds('PT4M13S'), 253);
  assert.equal(isoDurationSeconds('PT1H2M'), 3720);
  assert.equal(isoDurationSeconds('nonsense'), 0);
  assert.equal(clock(253), '4:13');
  assert.equal(clock(3725), '1:02:05');
});

test('captions are grouped into timed lines of about 20 seconds', () => {
  const text = formatTranscript([
    { text: 'Fire extinguishers come', offset: 0 },
    { text: 'in five types.', offset: 4000 },
    { text: '[Music]', offset: 9000 },
    { text: 'Water is red.', offset: 21000 },
    { text: 'Foam is cream.', offset: 26000 },
  ]);
  assert.equal(text, '[0:00] Fire extinguishers come in five types.\n[0:21] Water is red. Foam is cream.');
});

test('a long transcript is cut and says so', () => {
  const segments = Array.from({ length: 200 }, (_, i) => ({ text: 'word '.repeat(20), offset: i * 20000 }));
  const text = formatTranscript(segments, 500);
  assert.ok(text.length < 600);
  assert.match(text, /only the first part is shown/);
});

test('a search with nothing readable tells the model not to suggest a clip', () => {
  assert.match(videosForModel({ videos: [], note: 'Searched YouTube for "x": read 0 transcripts' }), /No clips to suggest/);
});
