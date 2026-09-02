import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { EventCategory, RegionId } from '@/types';
import { categoryLabels, eras, events, fightersForEvent, fighters, movements } from '@/lib/content';
import { regionNames } from '@/data/regions';
import { useActiveSection, usePageMeta } from '@/lib/hooks';
import { BottomSheet, ChipGroup, EmptyState, PageIntro, Reveal, Segmented, eraAccent } from '@/components/ui';
import { FighterChip } from '@/components/cards';

/* ------------------------------------------------------------------ */
/* Era rail — sticky, tracks the active chapter                        */
function EraRail({ activeId }: { activeId: string | null }) {
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeId || !railRef.current) return;
    const el = railRef.current.querySelector<HTMLElement>(`[data-era="${activeId}"]`);
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <nav aria-label="Jump to era" className="sticky top-16 z-30 -mx-4 border-b border-paper-300/80 bg-paper-100/92 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div ref={railRef} className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
        {eras.map((era) => {
          const active = era.id === activeId;
          return (
            <a
              key={era.id}
              data-era={era.id}
              href={`#era-${era.id}`}
              aria-current={active ? 'true' : undefined}
              className={`relative flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-[background-color,color] duration-400 ease-cinematic ${
                active ? 'bg-ink text-paper-50' : 'text-ink-soft hover:bg-paper-200'
              }`}
            >
              <span className={`font-display text-sm font-bold ${active ? 'text-brass-bright' : eraAccent.text[era.accent]}`}>{era.startYear}</span>
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
      <PageIntro eyebrow="1757 — 1947 · nine chapters" title="The Freedom Timeline" lede="Two centuries of resistance, chapter by chapter. Select any moment to meet the people behind it — every story leads to another.">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filters{activeFilters > 0 && ` · ${activeFilters}`}
          </button>
          {activeFilters > 0 && (
            <button type="button" onClick={clearFilters} className="text-sm font-semibold text-oxide underline decoration-oxide/40 underline-offset-4">
              Clear
            </button>
          )}
          <p className="ml-auto text-sm text-ink-faint" role="status">
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
                    className="vault group flex h-full w-full flex-col rounded-lg p-6 text-left shadow-vault transition-transform duration-400 ease-cinematic hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className={`font-display text-5xl font-black leading-none tracking-tight ${eraAccent.textVault[era.accent]}`}>{era.startYear}</span>
                    <span className="mt-1 text-xs font-semibold text-paper-400">to {era.endYear}</span>
                    <span className="mt-4 font-display text-2xl font-semibold leading-tight text-paper-50 group-hover:text-brass-bright">{era.name}</span>
                    <span className="mt-1 text-sm italic text-paper-300">{era.tagline}</span>
                    <span className="mt-4 line-clamp-3 text-sm leading-relaxed text-paper-300/90">{era.description}</span>
                    <span className="mt-5 flex items-center gap-3 text-xs font-semibold text-paper-400">
                      <span>{count} events</span>
                      <span aria-hidden="true">·</span>
                      <span>{people} people</span>
                      <span aria-hidden="true" className="ml-auto text-lg text-brass-bright transition-transform duration-400 ease-cinematic group-hover:translate-x-1">→</span>
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

              <div className="space-y-20">
                {eras.map((era) => {
                  const eraEvents = filtered.filter((e) => e.era === era.id);
                  const eraPeople = fighters.filter((f) => f.era === era.id && (!region || f.region === region));
                  if (eraEvents.length === 0 && eraPeople.length === 0) return null;
                  return (
                    <section key={era.id} id={`era-${era.id}`} aria-label={era.name} className="scroll-mt-36">
                      {/* Chapter plate */}
                      <Reveal mask className="relative ml-8 sm:ml-12">
                        <span aria-hidden="true" className={`absolute -left-8 top-8 h-4 w-4 rounded-full ring-4 ring-paper-100 sm:-left-12 ${eraAccent.bg[era.accent]}`} style={{ transform: 'translateX(4px)' }} />
                        <header className="vault rounded-lg px-6 py-8 shadow-vault sm:px-10 sm:py-12">
                          <p aria-hidden="true" className={`drift-on-scroll pointer-events-none absolute -right-2 -top-6 select-none font-display text-numeral font-black italic leading-none opacity-[0.08] sm:right-4 ${eraAccent.textVault[era.accent]}`}>
                            {era.startYear}
                          </p>
                          <p className={`eyebrow-vault mb-3`}>
                            Chapter {eras.indexOf(era) + 1} · {era.startYear} – {era.endYear}
                          </p>
                          <h2 className="max-w-2xl font-display text-[2rem] font-bold leading-[1.02] tracking-tight text-paper-50 sm:text-[2.8rem]">{era.name}</h2>
                          <p className="mt-2 font-display text-lg italic text-brass-bright" style={{ fontVariationSettings: '"SOFT" 60' }}>
                            {era.tagline}
                          </p>
                          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-paper-300 sm:text-base">{era.description}</p>
                        </header>
                      </Reveal>

                      {eraPeople.length > 0 && (
                        <Reveal className="ml-8 mt-5 sm:ml-12">
                          <p className="eyebrow mb-2">People of this chapter</p>
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
                          return (
                            <Reveal as="li" key={event.id} delay={Math.min(i, 3) * 60} className="relative">
                              <span aria-hidden="true" className="absolute -left-8 top-6 h-2.5 w-2.5 rounded-full bg-paper-100 ring-2 ring-oxide sm:-left-12" style={{ transform: 'translateX(7px)' }} />
                              <article className="doc grid gap-4 p-5 sm:grid-cols-[120px_1fr] sm:gap-6 sm:p-6">
                                <div className="sm:border-r sm:border-dotted sm:border-paper-400/80 sm:pr-5">
                                  <time className={`block font-display text-[2rem] font-bold leading-none ${eraAccent.text[era.accent]}`}>{event.date.year}</time>
                                  <p className="mt-1 text-xs font-semibold text-ink-soft">{event.dateLabel.replace(String(event.date.year), '').replace(/[–-]\s*$/, '').trim()}</p>
                                  <p className="mt-2 stamp text-sepia">{categoryLabels[event.category]}</p>
                                </div>
                                <div className="min-w-0">
                                  {event.location && <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{event.location}</p>}
                                  <h3 className="mt-1 font-display text-[1.35rem] font-semibold leading-snug">
                                    <Link to={`/events/${event.slug}`} className="text-ink transition-colors duration-160 hover:text-oxide">
                                      {event.title}
                                    </Link>
                                  </h3>
                                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{event.summary}</p>
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
                                  <Link to={`/events/${event.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-oxide">
                                    Read the full story <span aria-hidden="true">→</span>
                                  </Link>
                                </div>
                              </article>
                            </Reveal>
                          );
                        })}
                      </ol>
                    </section>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
