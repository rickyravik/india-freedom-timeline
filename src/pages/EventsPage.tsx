import { useMemo, useState } from 'react';
import type { EventCategory } from '@/types';
import { categoryLabels, events } from '@/lib/content';
import { eraById } from '@/data/eras';
import { usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf } from '@/lib/url-state';
import { ActiveFilters, BottomSheet, ChipGroup, EmptyState, PageIntro, eraAccent } from '@/components/ui';
import { EventRow } from '@/components/cards';

const decades = [...new Set(events.map((e) => Math.floor(e.date.year / 10) * 10))].sort((a, b) => a - b).map((d) => `${d}s`);

const eventParams = {
  type: oneOf(Object.keys(categoryLabels) as EventCategory[]),
  decade: oneOf(decades),
};

export default function EventsPage() {
  usePageMeta('Historical Events', 'Uprisings, marches, trials and turning points of India’s freedom struggle, 1757–1947.');
  const [filters, setFilters] = useUrlState(eventParams);
  const { type: category, decade } = filters;
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () => events.filter((e) => (!category || e.category === category) && (!decade || Math.floor(e.date.year / 10) * 10 === Number(decade.slice(0, -1)))),
    [category, decade],
  );

  // Group by decade for a ledger-like rhythm
  const groups = useMemo(() => {
    const map = new Map<number, typeof events>();
    for (const e of filtered) {
      const d = Math.floor(e.date.year / 10) * 10;
      map.set(d, [...(map.get(d) ?? []), e]);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  const activeCount = [category, decade].filter(Boolean).length;
  const activeChips = [
    category && { key: 'type', label: categoryLabels[category], onRemove: () => setFilters({ type: null }) },
    decade && { key: 'decade', label: decade, onRemove: () => setFilters({ decade: null }) },
  ].filter((c): c is { key: string; label: string; onRemove: () => void } => Boolean(c));
  const controls = (
    <>
      <ChipGroup label="Decade" allLabel="All years" options={decades.map((d) => ({ value: d, label: d }))} value={decade} onChange={(v) => setFilters({ decade: v })} />
      <ChipGroup label="Type" options={(Object.keys(categoryLabels) as EventCategory[]).map((c) => ({ value: c, label: categoryLabels[c] }))} value={category} onChange={(v) => setFilters({ type: v })} />
    </>
  );

  return (
    <div className="pb-20">
      <PageIntro title="Key Historical Events" lede="From Plassey to the midnight of freedom — the uprisings, marches, trials and turning points that made a nation.">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={`chip min-h-12 !px-5 text-meta ${activeCount ? 'chip-active' : ''}`} onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
            Filters{activeCount > 0 && ` · ${activeCount}`}
          </button>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Jump to decade">
            {decades
              .filter((d) => groups.some(([dec]) => `${dec}s` === d))
              .map((d) => (
                <a key={d} href={`#decade-${d}`} className="chip num shrink-0">
                  {d}
                </a>
              ))}
          </div>
        </div>
        <ActiveFilters chips={activeChips} onClear={() => setFilters({ type: null, decade: null })} className="mt-3" />
      </PageIntro>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter events">
        {controls}
        <button type="button" className="btn-seal mt-4 w-full" onClick={() => setSheetOpen(false)}>
          Show {filtered.length} events
        </button>
      </BottomSheet>

      <div className="container-page">
        <p className="num mb-4 font-body text-label text-ink-faint" role="status">
          Showing {filtered.length} of {events.length}
        </p>
        {filtered.length === 0 ? (
          <EmptyState
            title="No events match"
            hint="Try another decade or type, or clear the filters."
            action={
              <button type="button" className="btn-ghost" onClick={() => setFilters({ type: null, decade: null })}>
                Clear filters
              </button>
            }
          />
        ) : (
          /* One continuous ledger, oldest first. Decade heads are markers in
             the flow, not separate grids — a decade with a single record gets
             a full-width row like every other. */
          <ol className="space-y-3" aria-label="Events in date order">
            {groups.map(([dec, list]) =>
              list.map((e, i) => {
                const era = eraById.get(e.era);
                return (
                  <li key={e.id} className={i === 0 && dec !== groups[0][0] ? 'pt-8' : undefined}>
                    {i === 0 && (
                      <div id={`decade-${dec}s`} className="mb-3 flex scroll-mt-28 items-baseline gap-4">
                        <h2 className={`denom ${era ? eraAccent.text[era.accent] : 'text-oxide'}`}>{dec}s</h2>
                        <span className="rule flex-1" aria-hidden="true" />
                        <span className="num shrink-0 font-body text-label text-ink-faint">
                          {list.length} moment{list.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    )}
                    <EventRow event={e} />
                  </li>
                );
              }),
            )}
          </ol>
        )}
      </div>
    </div>
  );
}
