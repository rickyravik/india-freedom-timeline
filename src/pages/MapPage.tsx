import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { eventsForState, fightersForState, movements } from '@/lib/content';
import { regionNames, states } from '@/data/regions';
import type { RegionId, StateInfo } from '@/types';
import { usePageMeta } from '@/lib/hooks';
import { EmptyState, Icon, PageIntro, Reveal, icons } from '@/components/ui';
import { EventCard, FighterCard } from '@/components/cards';

/* One stamp ink per region — the sheet is printed in seven inks. Ochre and
   gauge gold use their deep cuts: the mid cuts only reached 4.0:1 against
   ink, and a 52px tile carries a 12px label. */
const regionHex: Record<RegionId, string> = {
  north: '#23406b',
  south: '#14453d',
  east: '#8e2f2a',
  west: '#a34e12',
  central: '#7c6428',
  northeast: '#5b2e4a',
  abroad: '#3b2e6e',
};

/* Every ink above is a deep cut, so tile lettering is always the paper. */
const regionText: Record<RegionId, string> = {
  north: 'text-paper-50',
  south: 'text-paper-50',
  east: 'text-paper-50',
  west: 'text-paper-50',
  central: 'text-paper-50',
  northeast: 'text-paper-50',
  abroad: 'text-paper-50',
};

/* The mount the panes are gummed to — the teeth are cut from it. */
const MOUNT = '#10312b';

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
  abroad: 'Abroad',
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
        title="Explore by State & Region"
        lede="Select a state to meet its freedom fighters and relive its battles, marches and uprisings. A stylised, schematic map — tiles show modern states, not exact boundaries."
      />

      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-12">
        {/* A sheet of stamps — every state is one perforated pane */}
        <Reveal className="lg:sticky lg:top-20 lg:self-start">
          <div className="vault px-4 py-5 sm:px-5 sm:py-6">
            {/* The mount: the panes' teeth are cut from this ground */}
            <div className="bg-vault p-1.5 sm:p-2">
              {/* The 8-column grid encodes the map, so it cannot reflow: below the
                  width where a tile would fall under 44px the plate scrolls. */}
              <div className="overflow-x-auto scrollbar-thin-archival">
                <div role="group" aria-label="Stylised map of India — states" className="grid min-w-[460px] gap-1.5 sm:gap-2" style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gridTemplateRows: 'repeat(8, minmax(0, 1fr))' }}>
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
                        title={s.name}
                        className={`perf-all relative flex aspect-square min-h-0 flex-col items-center justify-center text-center transition-[opacity,background-color] duration-400 ease-cinematic ${
                          isSel ? 'z-10' : 'hover:opacity-90'
                        } ${dim ? 'opacity-60' : 'opacity-100'}`}
                        style={
                          {
                            gridColumn: s.col,
                            gridRow: s.row,
                            backgroundColor: isSel ? '#f7f3ea' : s.region === 'abroad' ? `${regionHex.abroad}cc` : regionHex[s.region],
                            '--tooth': MOUNT,
                          } as CSSProperties
                        }
                      >
                        <span aria-hidden="true" className={`pointer-events-none px-1.5 font-body text-xs font-medium leading-none ${s.region === 'abroad' ? '' : 'sm:text-meta'} ${isSel ? 'text-ink' : regionText[s.region]}`}>
                          {stateCodes[s.id] ?? s.name}
                        </span>
                        {n > 0 && (
                          <span aria-hidden="true" className={`pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 ${isSel ? 'bg-oxide' : 'bg-brass-bright'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="label-vault mt-3 sm:hidden">Scroll the map sideways for the full sheet.</p>
            <div className="rule-vault mt-5" />
            <ul className="label-vault mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Region legend">
              {(Object.keys(regionNames) as RegionId[]).map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  {/* hairline so stamp green stays visible against the green pane */}
                  <span aria-hidden="true" className="inline-block h-2.5 w-2.5 ring-1 ring-paper-100/50" style={{ backgroundColor: regionHex[r] }} />
                  {regionNames[r]}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-body text-xs text-paper-300">Marks in the corner show states with records. “Abroad” covers the struggle beyond India’s shores — London, Paris, San Francisco, Tokyo, Singapore.</p>
          </div>
        </Reveal>

        {/* Detail panel */}
        <div aria-live="polite" className="min-w-0">
          {!selected ? (
            <Reveal>
              {/* An empty album mount — perforated paper waiting for its pane */}
              <div className="perf-all on-sheet bg-paper-200 p-2">
                <div className="border border-brass/45 px-6 py-12 text-center sm:px-10">
                  <div className="rule-double mx-auto mb-5 max-w-[6rem]" aria-hidden="true" />
                  <p className="font-display text-h3 text-ink">Select a state to begin</p>
                  <p className="mx-auto mt-1 max-w-sm font-body text-meta text-ink-faint">
                    Freedom fighters, movements, uprisings, prisons and protest sites — region by region.
                  </p>
                </div>
              </div>
            </Reveal>
          ) : (
            <div key={selected.id} className="animate-fade-up">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-h2 text-ink">{selected.name}</h2>
                  <p className="label mt-1">{regionNames[selected.region]}</p>
                </div>
                <Link to={`/fighters?region=${selected.region}`} className="btn-ghost !min-h-10 !px-4">
                  All from {regionNames[selected.region]}
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </Link>
              </div>

              {stateFighters.length === 0 && stateEvents.length === 0 ? (
                <EmptyState title={`No records for ${selected.name} yet`} hint="The collection grows continually — every state has its heroes, and their records are being added." />
              ) : (
                <div className="space-y-10">
                  {stateFighters.length > 0 && (
                    <section aria-label={`Freedom fighters of ${selected.name}`}>
                      <p className="label num mb-3">Freedom fighters · {stateFighters.length}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {stateFighters.map((f, i) => (
                          <FighterCard key={f.id} fighter={f} compact delay={(i % 6) * 50} />
                        ))}
                      </div>
                    </section>
                  )}
                  {stateEvents.length > 0 && (
                    <section aria-label={`Events in ${selected.name}`}>
                      <p className="label num mb-3">Events · {stateEvents.length}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {stateEvents.map((e, i) => (
                          <EventCard key={e.id} event={e} delay={(i % 6) * 50} />
                        ))}
                      </div>
                    </section>
                  )}
                  {stateMovements.length > 0 && (
                    <section aria-label="Related movements">
                      <p className="label mb-3">Movements</p>
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
