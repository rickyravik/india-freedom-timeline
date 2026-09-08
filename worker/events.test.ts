import { describe, expect, it } from 'vitest';
import { handleEvent } from './events';

function req(body: unknown) {
  return new Request('https://example.test/api/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

describe('handleEvent', () => {
  it('writes an allow-listed event as one data point and returns 204', async () => {
    const points: unknown[] = [];
    const env = { EVENTS: { writeDataPoint: (p: unknown) => points.push(p) } } as never;
    const res = await handleEvent(req({ name: 'trail_started', props: { trail: 'women-who-led' } }), env);
    expect(res.status).toBe(204);
    expect(points).toEqual([{ blobs: ['trail_started', 'trail=women-who-led'], doubles: [1], indexes: ['trail_started'] }]);
  });
  it('rejects unknown names and bad bodies', async () => {
    expect((await handleEvent(req({ name: 'search_query', props: { q: 'secret' } }), {})).status).toBe(400);
    expect((await handleEvent(new Request('https://example.test/api/event', { method: 'POST', body: 'nope' }), {})).status).toBe(400);
  });
  it('returns 204 without a binding so a missing dataset never breaks the page', async () => {
    expect((await handleEvent(req({ name: 'glossary_opened' }), {})).status).toBe(204);
  });
});
