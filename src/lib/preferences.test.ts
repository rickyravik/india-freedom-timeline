import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFERENCES, parsePreferences } from './preferences';

describe('parsePreferences', () => {
  it('returns defaults for nothing, garbage, or unknown values', () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('{not json')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('{"textSize":"huge","motion":"off","readingMode":3,"lowData":"yes"}')).toEqual(DEFAULT_PREFERENCES);
  });
  it('keeps valid values', () => {
    expect(parsePreferences('{"textSize":"larger","motion":"reduce","readingMode":"detail","lowData":true}')).toEqual({ textSize: 'larger', motion: 'reduce', readingMode: 'detail', lowData: true });
  });
});
