import { describe, expect, it } from 'vitest';
import { parseProgress } from './trails-progress';

describe('parseProgress', () => {
  it('drops malformed entries and keeps well-formed ones', () => {
    const raw = JSON.stringify({ good: { stop: 2, completed: false, updatedAt: '2026-09-08T10:00:00.000Z' }, bad: { stop: 'two' }, worse: 7 });
    expect(parseProgress(raw)).toEqual({ good: { stop: 2, completed: false, updatedAt: '2026-09-08T10:00:00.000Z' } });
  });
  it('returns an empty map for nothing or garbage', () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress('nope')).toEqual({});
  });
});
