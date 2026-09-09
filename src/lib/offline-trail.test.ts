import { describe, expect, it } from 'vitest';
import { estimateBytes, formatBytes, trailUrls } from './offline-trail';
import type { Trail } from '@/types';

const trail = { slug: 't', stops: [{ id: 'a', focus: { kind: 'fighter', id: 'f1' }, also: [{ kind: 'event', id: 'e1' }] }, { id: 'b', focus: { kind: 'event', id: 'e2' } }] } as unknown as Trail;

describe('trailUrls', () => {
  it('lists every page and portrait a trail needs, once', () => {
    const urls = trailUrls(trail, { fighterSlug: (id) => id, eventSlug: (id) => id, portrait: (id) => (id === 'f1' ? '/images/fighters/f1.jpg' : undefined) });
    expect(urls).toEqual(['/trails/t', '/trails/t/stop/1', '/trails/t/stop/2', '/trails/t/finish', '/fighters/f1', '/images/fighters/f1.jpg', '/events/e1', '/events/e2']);
  });
});
describe('estimate', () => {
  it('is a rough, labelled figure', () => {
    expect(formatBytes(estimateBytes(['/a', '/b', '/images/fighters/x.jpg']))).toBe('about 165 KB');
  });
});
