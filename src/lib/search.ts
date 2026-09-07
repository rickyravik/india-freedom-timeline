/**
 * Lightweight client-side global search across fighters, events and
 * movements. No external dependencies; fast enough for thousands of
 * records since the index is built once. Index construction and matching
 * both live in search-core.ts (kept free of the `@/` alias and the content
 * layer so scripts/search-check.mjs can exercise them standalone).
 */
import { fighters, events, movements } from '@/lib/content';
import { buildIndex, searchIndex, type IndexEntry, type SearchResult } from '@/lib/search-core';

export type { SearchResult };

let index: IndexEntry[] | null = null;

export function search(query: string, limit = 20): SearchResult[] {
  index ??= buildIndex(fighters, events, movements);
  return searchIndex(index, query, limit);
}
