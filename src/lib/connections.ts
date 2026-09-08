/**
 * Resolves documented connections into a symmetric map, so a relationship
 * declared on one record shows on both. Import-free: scripts/generate-summaries.ts
 * runs it at build time and writes src/data/generated/connections.ts.
 */
export type ConnectionType = 'ally' | 'opponent' | 'family' | 'mentor' | 'inspired' | 'successor';

export interface ConnectionLike {
  id: string;
  type: ConnectionType;
  note: string;
}
export interface ResolvedConnectionLike extends ConnectionLike {
  inferred: boolean;
}

/** How the relationship reads from the other side. */
export const inverseType: Record<ConnectionType, ConnectionType> = {
  ally: 'ally',
  opponent: 'opponent',
  family: 'family',
  mentor: 'successor', // B was A's student / heir
  inspired: 'inspired', // A inspired B; from B's side: "inspired by" — same label, note carries direction
  successor: 'mentor',
};

export function resolveConnections(records: { id: string; connections?: ConnectionLike[] }[]): Record<string, ResolvedConnectionLike[]> {
  const out: Record<string, ResolvedConnectionLike[]> = {};
  for (const r of records) out[r.id] = (r.connections ?? []).map((c) => ({ ...c, inferred: false }));
  for (const r of records) {
    for (const c of r.connections ?? []) {
      const target = out[c.id];
      if (!target) continue; // validator already errors on unknown ids
      if (target.some((t) => t.id === r.id)) continue;
      target.push({ id: r.id, type: inverseType[c.type], note: c.note, inferred: true });
    }
  }
  return out;
}
