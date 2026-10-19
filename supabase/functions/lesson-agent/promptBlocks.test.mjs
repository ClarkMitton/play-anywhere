import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('deployment snapshot preserves every canonical shared teaching block', () => {
  const canonical = readFileSync(new URL('../generate-session/prompt.ts', import.meta.url), 'utf8');
  const shared = readFileSync(new URL('../_shared/lessonPromptBlocks.ts', import.meta.url), 'utf8');
  for (const name of ['ROOM_BLOCK', 'STYLE_BLOCK', 'LEAD_BLOCK', 'SAFETY_BLOCK', 'INCLUSION_BLOCK']) {
    const pattern = new RegExp('export const ' + name + ' = `[\\s\\S]*?`;');
    const original = canonical.match(pattern)?.[0];
    assert.ok(original, name);
    assert.equal(shared.match(pattern)?.[0], original, name);
  }
});