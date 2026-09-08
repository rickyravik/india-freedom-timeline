import { describe, expect, it } from 'vitest';
import { buildIndex, normalizeTranslit, searchIndex } from './search-core';

describe('normalizeTranslit', () => {
  it('collapses the laxmi / lakshmi spelling variants to one string', () => {
    expect(normalizeTranslit('Laxmibai')).toBe(normalizeTranslit('Lakshmibai'));
  });

  it('collapses doubled consonants', () => {
    expect(normalizeTranslit('Katabomman')).toBe(normalizeTranslit('Kattabomman'));
  });
});

describe('searchIndex on a people-only index', () => {
  const index = buildIndex(
    [
      { slug: 'rani-lakshmibai', name: 'Rani Lakshmibai of Jhansi', states: ['Uttar Pradesh'], summary: 'Queen of Jhansi', roles: ['ruler'], movements: ['great-revolt'], birthYear: 1828, deathYear: 1858 },
      { slug: 'bhagat-singh', name: 'Bhagat Singh', states: ['Punjab'], summary: 'Revolutionary', roles: ['revolutionary'], movements: ['revolutionary-movement'], birthYear: 1907, deathYear: 1931 },
    ],
    [],
    [],
  );

  it('finds Lakshmibai from the colloquial spelling, flagged as a fuzzy hit', () => {
    const [top] = searchIndex(index, 'laxmibai');
    expect(top?.to).toBe('/fighters/rani-lakshmibai');
    expect(top?.exact).toBe(false);
  });

  it('returns nothing for a query under two characters', () => {
    expect(searchIndex(index, 'b')).toEqual([]);
  });
});
