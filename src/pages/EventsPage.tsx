import { useMemo, useState } from 'react';
import type { EventCategory } from '@/types';
import { categoryLabels, events } from '@/lib/content';
import { eraById } from '@/data/eras';
import { usePageMeta } from '@/lib/hooks';
import { BottomSheet, ChipGroup, EmptyState, PageIntro, Reveal, eraAccent } from '@/components/ui';
import { EventCard } from '@/components/cards';

export default function EventsPage() {
  usePageMeta('Historical Events', 'Uprisings, marches, trials and turning points of India’s freedom struggle, 1757–1947.');
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [decade, setDecade] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const decades = useMemo(() => {
    const set = new Set(events.map((e) => Math.floor(e.date.year / 10) * 10));
    return [...set].sort((a, b) => a - b).map((d) => `${d}s`);
  }, []);

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
  const controls = (
    <>
      <ChipGroup label="Decade" allLabel="All years" options={decades.map((d) => ({ value: d, label: d }))} value={decade} onChange={setDecade} />
      <ChipGroup label="Type" options={(Object.keys(categoryLabels) as EventCategory[]).map((c) => ({ value: c, label: categoryLabels[c] }))} value={category} onChange={setCategory} />
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
            {decades.map((d) => (
              <button key={d} type="button" aria-pressed={decade === d} onClick={() => setDecade(decade === d ? null : d)} className={`chip num shrink-0 ${decade === d ? 'chip-active' : ''}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
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
          <EmptyState title="No events match" hint="Try another decade or type." />
        ) : (
          <div className="space-y-14 sm:space-y-20">
            {groups.map(([dec, list]) => {
              const era = eraById.get(list[0].era);
              return (
                <section key={dec} aria-label={`${dec}s`}>
                  <Reveal className="mb-4 flex items-baseline gap-4">
                    <h2 className={`denom ${era ? eraAccent.text[era.accent] : 'text-oxide'}`}>{dec}s</h2>
                    <span className="rule flex-1" aria-hidden="true" />
                    <span className="num shrink-0 font-body text-label text-ink-faint">{list.length} moment{list.length === 1 ? '' : 's'}</span>
                  </Reveal>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((e, i) => (
                      <EventCard key={e.id} event={e} delay={i * 60} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
