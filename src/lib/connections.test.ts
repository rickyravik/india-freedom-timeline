import { describe, expect, it } from 'vitest';
import { resolveConnections } from './connections';

const records = [
  { id: 'a', connections: [{ id: 'b', type: 'mentor' as const, note: 'A taught B at the national school from 1906.' }] },
  { id: 'b', connections: [{ id: 'c', type: 'ally' as const, note: 'B and C planned the 1908 strike together.' }] },
  { id: 'c' },
];

describe('resolveConnections', () => {
  it('keeps declared connections and adds the reverse of the other side’s declarations', () => {
    const out = resolveConnections(records);
    expect(out.a).toEqual([{ id: 'b', type: 'mentor', note: 'A taught B at the national school from 1906.', inferred: false }]);
    expect(out.b).toEqual([
      { id: 'c', type: 'ally', note: 'B and C planned the 1908 strike together.', inferred: false },
      { id: 'a', type: 'successor', note: 'A taught B at the national school from 1906.', inferred: true },
    ]);
    expect(out.c).toEqual([{ id: 'b', type: 'ally', note: 'B and C planned the 1908 strike together.', inferred: true }]);
  });
  it('does not duplicate a connection both sides declared', () => {
    const out = resolveConnections([
      { id: 'a', connections: [{ id: 'b', type: 'ally' as const, note: 'Fought together at Kalayar Kovil in 1801.' }] },
      { id: 'b', connections: [{ id: 'a', type: 'ally' as const, note: 'Fought together at Kalayar Kovil in 1801.' }] },
    ]);
    expect(out.a).toHaveLength(1);
    expect(out.b).toHaveLength(1);
  });
});
