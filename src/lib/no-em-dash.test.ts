import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * House style: no em dashes anywhere in the app, content or code. The owner
 * asked for this because the character is a tell for machine-written prose.
 * En dashes in numeric ranges ("1757–1947") are fine and are not checked.
 * Generated files and the stylesheet are checked too: the rule is the whole
 * app, comments included, so a grep anywhere under src comes back empty.
 */
const ROOT = join(__dirname, '..');
const SKIP = new Set<string>();
/* Built at runtime so this file passes its own check. */
const EM_DASH = String.fromCharCode(0x2014);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|css|html)$/.test(name) && !name.endsWith('.test.ts')) out.push(p);
  }
  return out;
}

describe('no em dashes in src', () => {
  it('finds none', () => {
    const offenders: string[] = [];
    for (const file of walk(ROOT)) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (line.includes(EM_DASH)) offenders.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
    }
    expect(offenders, `em dashes found:\n${offenders.slice(0, 40).join('\n')}${offenders.length > 40 ? `\n…and ${offenders.length - 40} more` : ''}`).toEqual([]);
  });
});
