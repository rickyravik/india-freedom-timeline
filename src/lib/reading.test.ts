import { describe, expect, it } from 'vitest';
import { readingMinutes, readingTimeLabel, splitCitations, stripCitations, wordCount } from './reading';

describe('wordCount / readingMinutes', () => {
  it('counts words and never reports under one minute', () => {
    expect(wordCount('  one two  three ')).toBe(3);
    expect(wordCount('')).toBe(0);
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(450)).toBe(2);
    expect(readingTimeLabel(2)).toBe('2 min read');
  });
});

describe('splitCitations', () => {
  it('turns [^n] markers into cite segments and leaves the prose intact', () => {
    expect(splitCitations('She retook Sivaganga around 1780.[^2] Kuyili’s attack rests on oral tradition.[^1]')).toEqual([
      { kind: 'text', text: 'She retook Sivaganga around 1780.' },
      { kind: 'cite', index: 2 },
      { kind: 'text', text: ' Kuyili’s attack rests on oral tradition.' },
      { kind: 'cite', index: 1 },
    ]);
  });
  it('returns one text segment when there are no markers', () => {
    expect(splitCitations('Plain.')).toEqual([{ kind: 'text', text: 'Plain.' }]);
  });
  it('strips markers for summaries and meta descriptions', () => {
    expect(stripCitations('A claim.[^3] Another.[^12]')).toBe('A claim. Another.');
  });
});
