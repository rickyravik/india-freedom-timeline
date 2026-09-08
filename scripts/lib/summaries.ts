/**
 * Pure logic for projecting a full FreedomFighter/HistoricalEvent down to
 * its FighterSummary/EventSummary shape (src/types/index.ts). Shared
 * between scripts/generate-summaries.ts (which writes the generated
 * files) and scripts/validate-content.ts (which fails the build if a
 * generated file has drifted from what regenerating it would produce).
 */
import type { EventSummary, FighterSummary, FreedomFighter, HistoricalEvent } from '../../src/types/index.ts';

export function pickFighterSummary(f: FreedomFighter): FighterSummary {
  return {
    id: f.id,
    slug: f.slug,
    name: f.name,
    alternateNames: f.alternateNames,
    shortName: f.shortName,
    portrait: f.portrait,
    birthYear: f.birthYear,
    deathYear: f.deathYear,
    birthDateLabel: f.birthDateLabel,
    deathDateLabel: f.deathDateLabel,
    birthPlace: f.birthPlace,
    region: f.region,
    states: f.states,
    gender: f.gender,
    summary: f.summary,
    ideology: f.ideology,
    legacy: f.legacy,
    timelineEvents: f.timelineEvents,
    movements: f.movements,
    roles: f.roles,
    tags: f.tags,
    era: f.era,
    featured: f.featured,
    forgotten: f.forgotten,
    searchAliases: f.searchAliases,
  };
}

export function pickEventSummary(e: HistoricalEvent): EventSummary {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    date: e.date,
    dateLabel: e.dateLabel,
    location: e.location,
    region: e.region,
    states: e.states,
    summary: e.summary,
    people: e.people,
    movement: e.movement,
    era: e.era,
    category: e.category,
    featured: e.featured,
    searchAliases: e.searchAliases,
  };
}
