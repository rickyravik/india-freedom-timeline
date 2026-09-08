/** The only events the pilot counts. Shared by src/lib/analytics.ts and worker/events.ts. */
export const EVENT_NAMES = ['trail_started', 'trail_stop_viewed', 'trail_completed', 'source_opened', 'glossary_opened', 'quiz_reviewed', 'correction_submitted'] as const;
export type EventName = (typeof EVENT_NAMES)[number];
export function isEventName(v: unknown): v is EventName {
  return typeof v === 'string' && (EVENT_NAMES as readonly string[]).includes(v);
}
