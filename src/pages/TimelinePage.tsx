import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { EventCategory, HistoricalEvent, RegionId } from '@/types';
import { categoryLabels, eras, events, fightersForEvent, fighters, movements } from '@/lib/content';
import { regionNames } from '@/data/regions';
import { useActiveSection, usePageMeta } from '@/lib/hooks';
import { BottomSheet, ChipGroup, EmptyState, Icon, PageIntro, Postmark, Reveal, Segmented, eraAccent, icons } from '@/components/ui';
import { FighterChip } from '@/components/cards';

/* ------------------------------------------------------------------ */
/* Ledger sub-line under the year: day/month for a single date, the    */
/* full label for a range (so the end date always carries its year).   */
function dateSubLine(event: HistoricalEvent): string {
  if (event.dateLabel.includes('–')) return event.dateLabel;
  return event.dateLabel.replace(String(event.date.year), '').trim();
}

/* ------------------------------------------------------------------ */
/* Era rail — sticky chapter nav, on the sheet's own paper             */
function EraRail({ activeId }: { activeId: string | null }) {
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeId || !railRef.current) return;
    const el = railRef.current.querySelector<HTMLElement>(`[data-era="${activeId}"]`);
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <nav aria-label="Jump to era" className="sticky top-16 z-30 -mx-4 border-b border-paper-300/80 bg-paper-100 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div ref={railRef} className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
        {eras.map((era) => {
          const active = era.id === activeId;
          return (
            <a
              key={era.id}
              data-era={era.id}
              href={`#era-${era.id}`}
              aria-current={active ? 'true' : undefined}
              className={`relative flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-sm px-3.5 py-2 font-body text-meta font-medium transition-colors duration-160 ease-cinematic ${
                active ? 'bg-ink text-paper-50' : 'text-ink-soft hover:bg-paper-200'
              }`}
            >
              <span className={`num font-display font-bold ${active ? 'text-brass-bright' : eraAccent.text[era.accent]}`}>{era.startYear}</span>
              <span>{era.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
export default function TimelinePage() {
  usePageMeta('Interactive Timeline', "Scroll through India's freedom struggle from 1757 to 1947 — nine chapters, their events, and the people who shaped them.");

  const [params, setParams] = useSearchParams();
  const [zoom, setZoom] = useState<'chapters' | 'full'>('full');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [region, setRegion] = useState<RegionId | null>((params.get('region') as RegionId) || null);
  const [category, setCategory] = useState<EventCategory | null>((params.get('category') as EventCategory) || null);
  const [movementId, setMovementId] = useState<string | null>(params.get('movement'));

  const filtered = useMemo(
    () => events.filter((e) => (!region || e.region === region) && (!category || e.category === category) && (!movementId || e.movement === movementId)),
    [region, category, movementId],
  );
  const activeFilters = [region, category, movementId].filter(Boolean).length;
  const eraIds = useMemo(() => eras.map((e) => `era-${e.id}`), []);
  const activeSection = useActiveSection(eraIds);
  const activeEraId = activeSection?.replace('era-', '') ?? null;

  /* Chapters that survive the filters, in order. The first one rendered is
     the pane that carries the page's single postmark.                    */
  const chapters = useMemo(
    () =>
      eras
        .map((era, index) => ({
          era,
          index,
          eraEvents: filtered.filter((e) => e.era === era.id),
          eraPeople: fighters.filter((f) => f.era === era.id && (!region || f.region === region)),
        }))
        .filter((c) => c.eraEvents.length > 0 || c.eraPeople.length > 0),
    [filtered, region],
  );

  const clearFilters = () => {
    setRegion(null);
    setCategory(null);
    setMovementId(null);
    setParams({}, { replace: true });
  };

  const filterControls = (
    <>
      <ChipGroup label="Region" options={(Object.keys(regionNames) as RegionId[]).map((r) => ({ value: r, label: regionNames[r] }))} value={region} onChange={setRegion} />
      <ChipGroup label="Type of event" options={(Object.keys(categoryLabels) as EventCategory[]).map((c) => ({ value: c, label: categoryLabels[c] }))} value={category} onChange={setCategory} />
      <ChipGroup label="Movement" options={movements.map((m) => ({ value: m.id, label: m.name }))} value={movementId} onChange={setMovementId} />
    </>
  );

  return (
    <div className="pb-16">
      <PageIntro title="The Freedom Timeline" lede="Two centuries of resistance, chapter by chapter. Select any moment to meet the people behind it — every story leads to another.">
        <p className="label num mb-4">1757 – 1947 · nine chapters</p>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="View"
            value={zoom}
            onChange={setZoom}
            options={[
              { value: 'chapters', label: 'Chapters' },
              { value: 'full', label: 'Full timeline' },
            ]}
          />
          <button type="button" className={`chip min-h-10 ${activeFilters ? 'chip-active' : ''}`} onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
            <Icon d="M4 6h16M7 12h10M10 18h4" className="h-3.5 w-3.5" />
            Filters{activeFilters > 0 && ` · ${activeFilters}`}
          </button>
          {activeFilters > 0 && (
            <button type="button" onClick={clearFilters} className="font-body text-meta font-medium text-oxide underline decoration-oxide/40 underline-offset-4">
              Clear
            </button>
          )}
          <p className="label num ml-auto" role="status">
            {filtered.length} of {events.length} events
          </p>
        </div>
      </PageIntro>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter the timeline">
        {filterControls}
        <button type="button" className="btn-seal mt-4 w-full" onClick={() => setSheetOpen(false)}>
          Show {filtered.length} events
        </button>
      </BottomSheet>

      <div className="container-page">
        {zoom === 'chapters' ? (
          /* A sheet of nine commemoratives — one ink per chapter */
          <section aria-label="Chapters of the freedom struggle" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eras.map((era, i) => {
              const count = filtered.filter((e) => e.era === era.id).length;
              const people = fighters.filter((f) => f.era === era.id).length;
              return (
                <Reveal key={era.id} delay={i * 60} className="h-full">
                  <button
                    type="button"
                    onClick={() => {
                      setZoom('full');
                      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`era-${era.id}`)?.scrollIntoView({ block: 'start' })));
                    }}
                    className={`perf-all on-sheet flex h-full w-full flex-col px-5 py-7 text-left transition-opacity duration-160 ease-cinematic hover:opacity-90 sm:px-6 ${eraAccent.bg[era.accent]} ${eraAccent.onInk[era.accent]}`}
                  >
                    <span className="denom block text-h1">{era.startYear}</span>
                    <span className="mt-3 font-display text-h3 font-bold">{era.name}</span>
                    <span className={`num mt-2 block font-body text-label ${eraAccent.onInkMuted[era.accent]}`}>
                      Chapter {i + 1} · {era.startYear}–{era.endYear}
                    </span>
                    <span className={`mt-3 font-reading text-reading italic ${eraAccent.onInkMuted[era.accent]}`}>{era.tagline}</span>
                    <span className="mt-3 line-clamp-3 font-body text-meta">{era.description}</span>
                    <span className={`num mt-auto flex items-center gap-3 pt-5 font-body text-label ${eraAccent.onInkMuted[era.accent]}`}>
                      <span>{count} events</span>
                      <span aria-hidden="true">·</span>
                      <span>{people} people</span>
                      <Icon d={icons.arrowRight} className="ml-auto h-4 w-4" />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </section>
        ) : (
          <>
            <EraRail activeId={activeEraId} />
            {filtered.length === 0 && (
              <div className="mt-10">
                <EmptyState title="No events match these filters" hint="Try widening the region or type — or clear the filters." action={<button type="button" className="btn-ghost" onClick={clearFilters}>Clear filters</button>} />
              </div>
            )}

            <div className="relative mt-8">
              {/* Spine with scroll-linked progress */}
              <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-paper-400/60 sm:left-[15px]" />
              <div aria-hidden="true" className="spine-progress absolute bottom-0 left-[11px] top-0 w-px bg-oxide sm:left-[15px]" />

              <div className="space-y-14 sm:space-y-20">
                {chapters.map(({ era, index, eraEvents, eraPeople }, position) => (
                  <section key={era.id} id={`era-${era.id}`} aria-label={era.name} className="scroll-mt-36">
                    {/* Chapter pane — a commemorative in this chapter's own ink */}
                    <Reveal mask className="relative ml-8 sm:ml-12">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-8 top-8 h-4 w-4 outline outline-4 outline-paper-100 sm:-left-12 ${eraAccent.bg[era.accent]}`}
                        style={{ transform: 'translateX(4px)' }}
                      />
                      <header className={`perf-all on-sheet relative px-5 py-7 sm:px-8 sm:py-9 ${eraAccent.bg[era.accent]} ${eraAccent.onInk[era.accent]}`}>
                        {position === 0 && <Postmark lines={['India', 'Post', '1757 — 1947']} className="absolute right-4 top-5 hidden sm:grid" />}
                        {/* The denomination sets `leading-none`; at display sizes the
                            digits then overflow their own line box and the reveal
                            mask shaves their tops. Give the numeral its own room. */}
                        <p className="denom block text-h1 leading-[1.12] sm:text-hero sm:leading-[1.08]">{era.startYear}</p>
                        <h2 className={`mt-4 max-w-2xl text-h2 ${position === 0 ? 'sm:pr-28' : ''}`}>{era.name}</h2>
                        <p className={`num mt-2 font-body text-label ${eraAccent.onInkMuted[era.accent]}`}>
                          Chapter {index + 1} · {era.startYear}–{era.endYear}
                        </p>
                        <p className={`mt-4 max-w-xl font-reading text-reading italic ${eraAccent.onInkMuted[era.accent]}`}>{era.tagline}</p>
                        <p className="mt-4 max-w-prose font-reading text-reading">{era.description}</p>
                      </header>
                    </Reveal>

                    {eraPeople.length > 0 && (
                      <Reveal className="ml-8 mt-5 sm:ml-12">
                        <p className="label mb-2">People of this chapter</p>
                        <div className="-mr-4 flex gap-2 overflow-x-auto pb-2 pr-4 scrollbar-none">
                          {eraPeople.map((f) => (
                            <span key={f.id} className="shrink-0">
                              <FighterChip fighter={f} />
                            </span>
                          ))}
                        </div>
                      </Reveal>
                    )}

                    <ol className="ml-8 mt-8 space-y-6 sm:ml-12">
                      {eraEvents.map((event, i) => {
                        const people = fightersForEvent(event);
                        const subLine = dateSubLine(event);
                        return (
                          <Reveal as="li" key={event.id} delay={Math.min(i, 3) * 60} className="relative">
                            <span aria-hidden="true" className="absolute -left-8 top-6 h-2.5 w-2.5 border-2 border-oxide bg-paper-100 sm:-left-12" style={{ transform: 'translateX(7px)' }} />
                            <article className="doc grid grid-cols-[5.5rem_1fr] gap-4 p-5 sm:grid-cols-[120px_1fr] sm:gap-6 sm:p-6">
                              <div className="border-r border-paper-400/80 pr-4 sm:pr-5">
                                <time className={`denom block ${eraAccent.text[era.accent]}`}>{event.date.year}</time>
                                {subLine && <p className="num mt-1.5 font-body text-xs font-medium text-ink-soft">{subLine}</p>}
                                <p className="stamp mt-2 text-sepia">{categoryLabels[event.category]}</p>
                              </div>
                              <div className="min-w-0">
                                {event.location && <p className="font-body text-label text-ink-faint">{event.location}</p>}
                                <h3 className="mt-1 text-h3">
                                  <Link to={`/events/${event.slug}`} className="text-ink transition-colors duration-160 hover:text-oxide">
                                    {event.title}
                                  </Link>
                                </h3>
                                <p className="mt-2 font-body text-meta text-ink-soft">{event.summary}</p>
                                {people.length > 0 && (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {people.slice(0, 4).map((f) => (
                                      <FighterChip key={f.id} fighter={f} />
                                    ))}
                                    {people.length > 4 && (
                                      <Link to={`/events/${event.slug}`} className="chip">
                                        +{people.length - 4} more
                                      </Link>
                                    )}
                                  </div>
                                )}
                                <Link to={`/events/${event.slug}`} className="mt-4 inline-flex items-center gap-1.5 font-body text-meta font-medium text-oxide">
                                  Read the full story <Icon d={icons.arrowRight} className="h-4 w-4" />
                                </Link>
                              </div>
                            </article>
                          </Reveal>
                        );
                      })}
                    </ol>
                  </section>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
