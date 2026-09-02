import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsForState, fightersForState, movements } from '@/lib/content';
import { regionNames, states } from '@/data/regions';
import type { RegionId, StateInfo } from '@/types';
import { usePageMeta } from '@/lib/hooks';
import { EmptyState, PageIntro, Reveal } from '@/components/ui';
import { EventCard, FighterCard } from '@/components/cards';

const regionHex: Record<RegionId, string> = {
  north: '#33456e',
  south: '#3d5a3c',
  east: '#993527',
  west: '#c07a2c',
  central: '#8a6f52',
  northeast: '#9c7f3a',
  abroad: '#4a4036',
};

const stateCodes: Record<string, string> = {
  'jammu-kashmir': 'J&K',
  punjab: 'PB',
  delhi: 'DL',
  rajasthan: 'RJ',
  'uttar-pradesh': 'UP',
  bihar: 'BR',
  assam: 'AS',
  nagaland: 'NL',
  meghalaya: 'ML',
  manipur: 'MN',
  gujarat: 'GJ',
  'madhya-pradesh': 'MP',
  jharkhand: 'JH',
  'west-bengal': 'WB',
  maharashtra: 'MH',
  chhattisgarh: 'CG',
  odisha: 'OD',
  telangana: 'TS',
  'andhra-pradesh': 'AP',
  karnataka: 'KA',
  kerala: 'KL',
  'tamil-nadu': 'TN',
  abroad: '✈',
};

export default function MapPage() {
  usePageMeta('Explore by Region', 'A stylised map of India — select a state to discover its freedom fighters, movements and events.');
  const [selected, setSelected] = useState<StateInfo | null>(null);
  const [hoverRegion, setHoverRegion] = useState<RegionId | null>(null);

  const stateFighters = useMemo(() => (selected ? fightersForState(selected.name) : []), [selected]);
  const stateEvents = useMemo(() => (selected ? eventsForState(selected.name) : []), [selected]);
  const stateMovements = useMemo(() => {
    if (!selected) return [];
    const ids = new Set(stateFighters.flatMap((f) => f.movements));
    return movements.filter((m) => ids.has(m.id));
  }, [selected, stateFighters]);
  const counts = useMemo(() => new Map(states.map((s) => [s.id, fightersForState(s.name).length])), []);

  return (
    <div className="pb-20">
      <PageIntro
        eyebrow="Every region resisted"
        title="Explore by State & Region"
        lede="Select a state to meet its freedom fighters and relive its battles, marches and uprisings. A stylised, schematic map — tiles show modern states, not exact boundaries."
      />

      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-12">
        {/* Tile map on a vault plate */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <div className="vault rounded-xl p-4 shadow-vault sm:p-5">
            <div role="group" aria-label="Stylised map of India — states" className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gridTemplateRows: 'repeat(8, minmax(0, 1fr))' }}>
              {states.map((s) => {
                const isSel = selected?.id === s.id;
                const dim = hoverRegion && hoverRegion !== s.region && !isSel;
                const n = counts.get(s.id) ?? 0;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(isSel ? null : s)}
                    onMouseEnter={() => setHoverRegion(s.region)}
                    onMouseLeave={() => setHoverRegion(null)}
                    onFocus={() => setHoverRegion(s.region)}
                    onBlur={() => setHoverRegion(null)}
                    aria-pressed={isSel}
                    aria-label={`${s.name}, ${n} freedom fighter${n === 1 ? '' : 's'}`}
                    className={`relative flex aspect-square min-h-0 flex-col items-center justify-center rounded-md border text-center transition-[transform,opacity,background-color,border-color] duration-400 ease-cinematic active:scale-95 ${
                      isSel ? 'z-10 scale-[1.08] border-paper-50 shadow-lifted' : 'border-paper-100/15 hover:border-paper-100/50 hover:-translate-y-0.5'
                    } ${dim ? 'opacity-60' : 'opacity-100'} ${s.region === 'abroad' ? 'border-dashed' : ''}`}
                    style={{ gridColumn: s.col, gridRow: s.row, backgroundColor: isSel ? '#f5efe0' : `${regionHex[s.region]}${s.region === 'abroad' ? '55' : 'aa'}` }}
                  >
                    <span aria-hidden="true" className={`pointer-events-none font-display text-sm font-bold sm:text-base ${isSel ? 'text-ink' : 'text-paper-50'}`}>
                      {stateCodes[s.id] ?? s.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span aria-hidden="true" className={`pointer-events-none hidden w-full truncate px-0.5 text-[8px] font-semibold uppercase tracking-tight sm:block ${isSel ? 'text-ink-faint' : 'text-paper-200/80'}`}>
                      {s.name}
                    </span>
                    {n > 0 && (
                      <span aria-hidden="true" className={`pointer-events-none absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${isSel ? 'bg-oxide' : 'bg-brass-bright'}`} />
                    )}
                  </button>
                );
              })}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-semibold text-paper-300" aria-label="Region legend">
              {(Object.keys(regionNames) as RegionId[]).map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: regionHex[r] }} />
                  {regionNames[r]}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-paper-400">Dots mark states with records. “Abroad” covers the struggle beyond India’s shores — London, Paris, San Francisco, Tokyo, Singapore.</p>
          </div>
        </Reveal>

        {/* Detail panel */}
        <div aria-live="polite" className="min-w-0">
          {!selected ? (
            <Reveal className="rounded-lg border border-dashed border-paper-400 bg-paper-50/50 p-10 text-center">
              <p aria-hidden="true" className="mb-3 font-display text-4xl text-brass">✦</p>
              <p className="font-display text-xl font-semibold text-ink">Select a state to begin</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ink-faint">Freedom fighters, movements, uprisings, prisons and protest sites — region by region.</p>
            </Reveal>
          ) : (
            <div key={selected.id} className="animate-fade-up">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">{regionNames[selected.region]}</p>
                  <h2 className="font-display text-[2.2rem] font-bold leading-none tracking-tight text-ink">{selected.name}</h2>
                </div>
                <Link to={`/fighters?region=${selected.region}`} className="btn-ghost !min-h-10 !px-4 text-xs">
                  All from {regionNames[selected.region]} →
                </Link>
              </div>

              {stateFighters.length === 0 && stateEvents.length === 0 ? (
                <EmptyState title={`No records for ${selected.name} yet`} hint="The collection grows continually — every state has its heroes, and their records are being added." />
              ) : (
                <div className="space-y-10">
                  {stateFighters.length > 0 && (
                    <section aria-label={`Freedom fighters of ${selected.name}`}>
                      <p className="eyebrow mb-3">Freedom fighters · {stateFighters.length}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {stateFighters.map((f, i) => (
                          <FighterCard key={f.id} fighter={f} compact delay={(i % 6) * 50} />
                        ))}
                      </div>
                    </section>
                  )}
                  {stateEvents.length > 0 && (
                    <section aria-label={`Events in ${selected.name}`}>
                      <p className="eyebrow mb-3">Events · {stateEvents.length}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {stateEvents.map((e, i) => (
                          <EventCard key={e.id} event={e} delay={(i % 6) * 50} />
                        ))}
                      </div>
                    </section>
                  )}
                  {stateMovements.length > 0 && (
                    <section aria-label="Related movements">
                      <p className="eyebrow mb-3">Movements</p>
                      <div className="flex flex-wrap gap-2">
                        {stateMovements.map((m) => (
                          <Link key={m.id} to={`/movements/${m.slug}`} className="chip min-h-10">
                            {m.name}
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
