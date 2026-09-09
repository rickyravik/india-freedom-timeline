import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { eventsForState, fightersForState, movements } from '@/lib/content';
import { regionNames, states, stateById } from '@/data/regions';
import type { RegionId } from '@/types';
import { usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf, oneOfDefault } from '@/lib/url-state';
import { EmptyState, Icon, PageIntro, Reveal, Segmented, icons } from '@/components/ui';
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

const mapParams = {
  state: oneOf(states.map((s) => s.id)),
  view: oneOfDefault(['map', 'list'] as const, 'map'),
};
const peopleCount = new Map(states.map((s) => [s.id, fightersForState(s.name).length]));
const eventCount = new Map(states.map((s) => [s.id, eventsForState(s.name).length]));

export default function MapPage() {
  usePageMeta('Explore by Region', 'A stylised map of India — select a state to discover its freedom fighters, movements and events.');
  const [params, setParams] = useUrlState(mapParams);
  const selected = params.state ? stateById.get(params.state) ?? null : null;
  const select = (id: string | null) => setParams({ state: id });
  const [hoverRegion, setHoverRegion] = useState<RegionId | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const counts = peopleCount;
  const viewStories = () => {
    resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    resultsRef.current?.focus({ preventScroll: true });
  };

  const stateFighters = selected ? fightersForState(selected.name) : [];
  const stateEvents = selected ? eventsForState(selected.name) : [];
  const stateMovements = (() => {
    if (!selected) return [];
    const ids = new Set(stateFighters.flatMap((f) => f.movements));
    return movements.filter((m) => ids.has(m.id));
  })();

  return (
    <div className="pb-20">
      <PageIntro
        title="Explore by State & Region"
        lede="Choose a state to meet its freedom fighters and the battles, marches and uprisings that happened there. The tiles are a schematic of present-day states, not a boundary map — see the note below the sheet."
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="block min-w-0 flex-1 sm:max-w-sm">
            <span className="label mb-1.5 block">Choose a state</span>
            <select
              className="min-h-12 w-full rounded-sm border border-paper-400 bg-paper-50 px-4 font-body text-meta font-medium text-ink focus:border-ink"
              value={params.state ?? ''}
              onChange={(e) => select(e.target.value || null)}
            >
              <option value="">All of India</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({peopleCount.get(s.id)} people, {eventCount.get(s.id)} events)
                </option>
              ))}
            </select>
          </label>
          <Segmented
            label="View"
            value={params.view}
            onChange={(v) => setParams({ view: v })}
            options={[
              { value: 'map', label: 'Map' },
              { value: 'list', label: 'List' },
            ]}
          />
        </div>
      </PageIntro>

      <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-12">
        {/* A sheet of stamps — every state is one perforated pane */}
        {params.view === 'map' ? (
        <Reveal className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <div className="vault px-4 py-5 sm:px-5 sm:py-6">
            {/* The mount: the panes' teeth are cut from this ground */}
            <div className="bg-vault p-1.5 sm:p-2">
              {/* The 8-column grid encodes the map, so it cannot reflow: below the
                  width where a tile would fall under 44px the plate scrolls. */}
              <div className="overflow-x-auto scrollbar-thin-archival">
                {/* `0px`, not `0`: a browser adds the unit itself inside minmax()
                    the instant this is set, so the literal already matches what
                    a hydrating page would otherwise mismatch against. */}
                <div role="group" aria-label="Stylised map of India — states" className="grid min-w-[460px] gap-1.5 sm:gap-2" style={{ gridTemplateColumns: 'repeat(8, minmax(0px, 1fr))', gridTemplateRows: 'repeat(8, minmax(0px, 1fr))' }}>
                  {states.map((s) => {
                    const isSel = selected?.id === s.id;
                    const dim = hoverRegion && hoverRegion !== s.region && !isSel;
                    const n = counts.get(s.id) ?? 0;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => select(isSel ? null : s.id)}
                        onMouseEnter={() => setHoverRegion(s.region)}
                        onMouseLeave={() => setHoverRegion(null)}
                        onFocus={() => setHoverRegion(s.region)}
                        onBlur={() => setHoverRegion(null)}
                        aria-pressed={isSel}
                        aria-label={`${s.name}, ${n} freedom fighter${n === 1 ? '' : 's'}`}
                        title={s.name}
                        className={`perf-all map-tile-fill relative flex aspect-square min-h-0 flex-col items-center justify-center text-center transition-[opacity,background-color] duration-400 ease-cinematic ${
                          isSel ? 'z-10' : 'hover:opacity-90'
                        } ${dim ? 'opacity-60' : 'opacity-100'}`}
                        style={
                          {
                            gridColumn: s.col,
                            gridRow: s.row,
                            '--map-tile-bg': isSel ? '#f7f3ea' : s.region === 'abroad' ? `${regionHex.abroad}cc` : regionHex[s.region],
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
                  <span aria-hidden="true" className="map-tile-fill inline-block h-2.5 w-2.5 ring-1 ring-paper-100/50" style={{ '--map-tile-bg': regionHex[r] } as CSSProperties} />
                  {regionNames[r]}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-body text-xs text-paper-300">Marks in the corner show states with records. “Abroad” covers the struggle beyond India’s shores — London, Paris, San Francisco, Tokyo, Singapore.</p>
          </div>
          {selected && (
            <button type="button" className="btn-seal mt-4 w-full lg:hidden" onClick={viewStories}>
              View stories from {selected.name}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </button>
          )}
        </Reveal>
        ) : (
          <ul className="min-w-0 space-y-2" aria-label="States and territories">
            {(Object.keys(regionNames) as RegionId[]).flatMap((r) =>
              states
                .filter((s) => s.region === r)
                .map((s) => (
                  <li key={s.id} className="doc flex items-center justify-between gap-3 p-3.5">
                    <button
                      type="button"
                      onClick={() => select(s.id)}
                      aria-pressed={selected?.id === s.id}
                      className="min-w-0 flex-1 text-left font-body text-meta text-ink hover:text-oxide-deep"
                    >
                      <span className="font-semibold">{s.name}</span>
                      <span className="num text-ink-faint"> · {peopleCount.get(s.id)} people · {eventCount.get(s.id)} events</span>
                    </button>
                    <span className="label shrink-0">{regionNames[r]}</span>
                  </li>
                )),
            )}
          </ul>
        )}

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
                  <h2 ref={resultsRef} id="state-results" tabIndex={-1} className="scroll-mt-28 text-h2 text-ink outline-none">
                    {selected.name}
                  </h2>
                  <p className="label num mt-1">
                    {regionNames[selected.region]} · {stateFighters.length} people · {stateEvents.length} events
                  </p>
                </div>
                <Link to={`/fighters?region=${selected.region}`} className="btn-ghost !min-h-10 !px-4">
                  All from {regionNames[selected.region]}
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </Link>
              </div>

              {stateFighters.length === 0 && stateEvents.length === 0 ? (
                <EmptyState
                  title={`Coverage for ${selected.name} is still growing`}
                  hint="Records are added region by region. In the meantime, nearby states in the same region already have stories:"
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      {states
                        .filter((s) => s.region === selected.region && s.id !== selected.id && (peopleCount.get(s.id) ?? 0) > 0)
                        .map((s) => (
                          <Link key={s.id} to={`/map?state=${s.id}`} className="chip min-h-10">
                            {s.name} · {peopleCount.get(s.id)}
                          </Link>
                        ))}
                    </div>
                  }
                />
              ) : (
                <div className="space-y-10">
                  {stateFighters.length > 0 && (
                    <section aria-label={`Freedom fighters of ${selected.name}`}>
                      <p className="label num mb-3">Freedom fighters · {stateFighters.length}</p>
                      {/* One column: this panel is narrower than a fighters grid can
                         assume, and full names ("Shyamji Krishna Varma") were breaking
                         mid-word once split into two columns here. */}
                      <div className="grid grid-cols-1 gap-3">
                        {stateFighters.map((f, i) => (
                          <FighterCard key={f.id} fighter={f} compact delay={(i % 6) * 50} />
                        ))}
                      </div>
                    </section>
                  )}
                  {stateEvents.length > 0 && (
                    <section aria-label={`Events in ${selected.name}`}>
                      <p className="label num mb-3">Events · {stateEvents.length}</p>
                      {/* One column: this panel is narrower than the fighters grid can
                         assume, and event titles run long ("Panchalankurichi", "Tiruchirappalli"). */}
                      <div className="grid grid-cols-1 gap-3">
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
