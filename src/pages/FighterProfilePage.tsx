import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { eventsForFighter, fighterBySlug, fighters, lifespan, movementById, organizationById, relatedFighters, roleLabels, randomPick } from '@/lib/content';
import { eraById } from '@/data/eras';
import { regionNames } from '@/data/regions';
import { pushTrail, useBookmarks, useIsDesktop, usePageMeta, useShare, useTrail } from '@/lib/hooks';
import { DisputedNotes, Icon, LifespanBar, Postmark, PortraitMedallion, QuoteCard, Reveal, Segmented, SourceList, eraAccent, icons } from '@/components/ui';
import { EventCard, FighterChip } from '@/components/cards';
import { Constellation } from '@/components/constellation';
import type { FreedomFighter, StoryChapter } from '@/types';

/* ------------------------------------------------------------------ */
/* Story Mode — stepper on phones, full chapter list on desktop         */
function StoryMode({ chapters, accent }: { chapters: StoryChapter[]; accent: keyof typeof eraAccent.bg }) {
  const desktop = useIsDesktop();
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const all = desktop || showAll;

  useEffect(() => setIndex(0), [chapters]);

  if (all) {
    return (
      <ol className="space-y-4">
        {chapters.map((chapter, i) => (
          <Reveal as="li" key={chapter.title} delay={i * 80} className="doc relative p-5 pl-16 sm:p-6 sm:pl-20">
            <span aria-hidden="true" className={`num absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-sm font-display text-sm font-bold sm:left-6 sm:top-6 ${eraAccent.bg[accent]} ${eraAccent.onInk[accent]}`}>
              {i + 1}
            </span>
            <h3 className="text-h3 text-ink">{chapter.title}</h3>
            <p className="prose-reading mt-2">{chapter.text}</p>
          </Reveal>
        ))}
        {!desktop && (
          <button type="button" className="btn-ghost w-full" onClick={() => setShowAll(false)}>
            Read one chapter at a time
          </button>
        )}
      </ol>
    );
  }

  const chapter = chapters[index];
  return (
    <div>
      <div key={chapter.title} className="doc p-6 animate-fade-up">
        <p className="denom text-oxide" aria-hidden="true">
          {index + 1}
        </p>
        <div className="rule my-3" />
        <h3 className="text-h3 text-ink">{chapter.title}</h3>
        <p className="label num mt-1">
          Chapter {index + 1} of {chapters.length}
        </p>
        <p className="prose-reading mt-4">{chapter.text}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost !min-h-12 !px-5" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous chapter">
          <Icon d={icons.arrowLeft} className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5" role="group" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              aria-current={i === index ? 'step' : undefined}
              aria-label={`Chapter ${i + 1}: ${c.title}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-none transition-colors duration-400 ease-cinematic ${i === index ? eraAccent.bg[accent] : 'bg-paper-400'}`}
            />
          ))}
        </div>
        {index < chapters.length - 1 ? (
          <button type="button" className="btn-seal !min-h-12 !px-5" onClick={() => setIndex((i) => Math.min(chapters.length - 1, i + 1))} aria-label="Next chapter">
            Next
            <Icon d={icons.arrowRight} className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" className="btn-ghost !min-h-12 !px-5" onClick={() => setShowAll(true)}>
            Read all
          </button>
        )}
      </div>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <Reveal as="section">
      <h3 className="mb-3 text-h3 text-ink">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 font-body text-meta text-ink-soft">
            <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 bg-brass" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Ledger({ fighter }: { fighter: FreedomFighter }) {
  const rows: [string, string | undefined][] = [
    ['Born', fighter.birthDateLabel ?? (fighter.birthYear ? String(fighter.birthYear) : undefined)],
    ['Died', fighter.deathDateLabel ?? (fighter.deathYear ? String(fighter.deathYear) : undefined)],
    ['Birthplace', fighter.birthPlace],
    ['Region', regionNames[fighter.region]],
    ['States', fighter.states.join(', ')],
  ];
  return (
    <dl>
      {rows.map(([k, v]) =>
        v ? (
          <div key={k} className="ledger-row">
            <dt className="label shrink-0">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
export default function FighterProfilePage() {
  const { slug } = useParams();
  const fighter = slug ? fighterBySlug.get(slug) : undefined;
  const [mode, setMode] = useState<'story' | 'detail'>('story');
  const { bookmarks, toggle } = useBookmarks();
  const { share, copied } = useShare();
  const trail = useTrail();

  usePageMeta(fighter?.name ?? 'Freedom fighter', fighter?.summary);
  useEffect(() => {
    if (fighter) pushTrail(fighter.slug);
  }, [fighter]);

  const related = useMemo(() => (fighter ? relatedFighters(fighter) : []), [fighter]);
  const timeline = useMemo(() => (fighter ? eventsForFighter(fighter) : []), [fighter]);
  const discoverNext = useMemo(() => {
    if (!fighter) return null;
    return randomPick(fighters.filter((f) => f.id !== fighter.id && !fighter.relatedPeople.includes(f.id) && f.region !== fighter.region));
  }, [fighter]);

  if (!fighter) return <Navigate to="/fighters" replace />;

  const era = eraById.get(fighter.era);
  const accent = era?.accent ?? 'brass';
  const bookmarked = bookmarks.includes(fighter.slug);
  const previous = trail.filter((s) => s !== fighter.slug).map((s) => fighterBySlug.get(s)).filter(Boolean).slice(0, 3);
  /* Every era pane is now a deep cut carrying paper lettering (ui.tsx). */
  const heroChip = 'chip-vault';
  const postmarkLines = ['India', 'Post', String(fighter.deathYear ?? fighter.birthYear ?? era?.startYear ?? '')].filter(Boolean);

  return (
    <article>
      {/* Hero — a life issued as a commemorative */}
      <header className="container-page pt-2">
        <div
          className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[accent]} ${eraAccent.onInk[accent]} ${
            'on-vault'
          }`}
        >
          <Postmark lines={postmarkLines} className="absolute right-4 top-5 hidden sm:grid" />

          <div className="grid gap-7 md:grid-cols-[auto_1fr] md:items-end">
            <PortraitMedallion name={fighter.name} era={era} portrait={fighter.portrait} size="hero" onPane />
            <div className="min-w-0">
              <h1 className="pr-0 text-h1 animate-fade-up sm:pr-28 sm:text-hero" style={{ animationDelay: '80ms' }}>
                {fighter.name}
              </h1>
              {fighter.alternateNames && fighter.alternateNames.length > 0 && (
                <p className={`mt-2 font-reading text-reading italic animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '140ms' }}>
                  {fighter.alternateNames.join(' · ')}
                </p>
              )}
              <p className={`num mt-3 font-body text-label animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '180ms' }}>
                {lifespan(fighter)}
                {era && <> · {era.name}</>}
                {' · '}
                {fighter.states[0]}
              </p>
              <div className="mt-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
                <LifespanBar birth={fighter.birthYear} death={fighter.deathYear} vault />
              </div>
            </div>
          </div>

          <p className={`mt-8 max-w-prose font-reading text-reading animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '300ms' }}>
            {fighter.summary}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {fighter.roles.map((r) => (
              <span key={r} className={`stamp ${eraAccent.onInkMuted[accent]}`}>
                {roleLabels[r]}
              </span>
            ))}
            <span className={`mx-1 hidden h-5 w-px sm:block bg-paper-100/20`} aria-hidden="true" />
            <button
              type="button"
              onClick={() => toggle(fighter.slug)}
              aria-pressed={bookmarked}
              className={`${heroChip} min-h-10 ${bookmarked ? '!bg-paper-50 !text-ink' : ''}`}
            >
              <Icon d={icons.bookmark} className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Saved' : 'Save this story'}
            </button>
            <button type="button" onClick={() => share(fighter.name, fighter.summary, `/fighters/${fighter.slug}`)} className={`${heroChip} min-h-10`}>
              <Icon d={icons.share} className="h-4 w-4" />
              {copied ? 'Link copied' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-page grid gap-12 pb-12 pt-14 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <section aria-label="Life story">
            <div className="rule-double mb-5" />
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-h2 text-ink">{mode === 'story' ? 'Quick story' : 'Detailed history'}</h2>
              <Segmented
                label="Reading mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'story', label: 'Quick story' },
                  { value: 'detail', label: 'Detailed history' },
                ]}
              />
            </div>

            {mode === 'story' ? (
              <StoryMode chapters={fighter.shortStory} accent={accent} />
            ) : (
              <div className="max-w-prose space-y-5 animate-fade-in">
                {fighter.fullBiography.map((para, i) => (
                  <p key={i} className={`prose-reading ${i === 0 ? 'dropcap' : ''}`}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </section>

          {mode === 'detail' && (
            <div className="grid gap-8 sm:grid-cols-2">
              {fighter.entryIntoStruggle && (
                <Reveal as="section">
                  <h3 className="mb-3 text-h3 text-ink">Entry into the struggle</h3>
                  <p className="font-body text-meta text-ink-soft">{fighter.entryIntoStruggle}</p>
                </Reveal>
              )}
              {fighter.ideology && (
                <Reveal as="section">
                  <h3 className="mb-3 text-h3 text-ink">Ideology & philosophy</h3>
                  <p className="font-body text-meta text-ink-soft">{fighter.ideology}</p>
                </Reveal>
              )}
              <ListBlock title="Key achievements" items={fighter.achievements} />
              <ListBlock title="Personal sacrifices" items={fighter.sacrifices} />
            </div>
          )}

          {fighter.quotes && fighter.quotes.length > 0 && (
            <section aria-label="In their words" className="space-y-8">
              {fighter.quotes.map((q) => (
                <QuoteCard key={q.text} quote={q} author={fighter.name} />
              ))}
            </section>
          )}

          {fighter.legacy && (
            <Reveal as="section" className="doc p-6">
              <div className="rule mb-4" />
              <h3 className="text-h3 text-ink">Legacy</h3>
              <p className="prose-reading mt-3">{fighter.legacy}</p>
            </Reveal>
          )}

          {fighter.disputed && <DisputedNotes notes={fighter.disputed} />}

          {fighter.facts && fighter.facts.length > 0 && (
            <Reveal as="section" className="doc p-6">
              <div className="rule mb-4" />
              <h3 className="text-h3 text-ink">Interesting facts</h3>
              <ul className="mt-3 space-y-2">
                {fighter.facts.map((fact) => (
                  <li key={fact} className="flex gap-3 font-body text-meta text-ink-soft">
                    <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 bg-brass" />
                    {fact}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {timeline.length > 0 && (
            <section aria-label="Events in this life">
              <h2 className="mb-5 text-h2 text-ink">On the timeline</h2>
              <div className="relative">
                <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-paper-400/70" />
                <ol className="space-y-4 pl-8">
                  {timeline.map((event, i) => (
                    <li key={event.id} className="relative">
                      <span aria-hidden="true" className={`absolute -left-8 top-6 h-2.5 w-2.5 ring-4 ring-paper-100 ${eraAccent.bg[accent]}`} />
                      <EventCard event={event} delay={i * 60} />
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal className="doc-mount p-5">
            <p className="label mb-3">At a glance</p>
            <Ledger fighter={fighter} />
          </Reveal>

          {fighter.movements.length > 0 && (
            <Reveal className="doc p-5" delay={60}>
              <p className="label mb-3">Movements</p>
              <ul className="space-y-2.5">
                {fighter.movements.map((mid) => {
                  const m = movementById.get(mid);
                  return m ? (
                    <li key={mid}>
                      <Link to={`/movements/${m.slug}`} className="group flex items-baseline justify-between gap-2 font-body text-meta">
                        <span className="font-semibold text-ink group-hover:text-oxide">{m.name}</span>
                        <span className="num shrink-0 text-label text-sepia">{m.period}</span>
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </Reveal>
          )}

          {fighter.organizations.length > 0 && (
            <Reveal className="doc p-5" delay={120}>
              <p className="label mb-3">Organizations</p>
              <ul className="space-y-3">
                {fighter.organizations.map((oid) => {
                  const o = organizationById.get(oid);
                  return o ? (
                    <li key={oid} className="font-body text-meta">
                      <p className="font-semibold text-ink">{o.name}</p>
                      {o.foundedLabel && <p className="num text-xs text-ink-faint">founded {o.foundedLabel}</p>}
                    </li>
                  ) : null;
                })}
              </ul>
            </Reveal>
          )}
        </aside>
      </div>

      {/* Constellation — dark band */}
      {related.length > 0 && (
        <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Related freedom fighters">
          <div className="container-page">
            <Reveal className="mb-8 max-w-2xl">
              <div className="rule-double-vault mb-5" />
              <h2 className="text-h2 text-paper-50">People connected to {fighter.name.split(' ').slice(-1)[0]}</h2>
              <p className="mt-2 font-body text-meta text-paper-300">Comrades, rivals, mentors and inheritors — every life connects to others. Select anyone to follow the thread.</p>
            </Reveal>
            <Constellation subject={fighter} related={related} />
          </div>
        </section>
      )}

      {/* Continue the thread */}
      <div className="container-page pt-14">
        <Reveal className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="label mb-2">Continue the thread</p>
            {previous.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 font-body text-meta text-ink-soft">
                <span>Your trail:</span>
                {previous.map((f) => (
                  <FighterChip key={f!.id} fighter={f!} />
                ))}
              </div>
            ) : (
              <p className="font-body text-meta text-ink-soft">Every profile leads somewhere. Try a different corner of the struggle.</p>
            )}
          </div>
          {discoverNext && (
            <Link to={`/fighters/${discoverNext.slug}`} className="btn-ghost">
              <Icon d={icons.shuffle} className="h-4 w-4" />
              Next: {discoverNext.name}
            </Link>
          )}
        </Reveal>
      </div>

      {/* Provenance closes the record */}
      <div className="container-page py-14">
        <SourceList sources={fighter.sources} />
      </div>
    </article>
  );
}
