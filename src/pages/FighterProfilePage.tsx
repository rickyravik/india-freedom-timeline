import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { connectionsFor, eventsForFighter, fighterBySlug, fighters, lifespan, movementById, organizationById, similarFor, roleLabels, hashPick } from '@/lib/content';
import { loadFighter, peekFighter } from '@/lib/loadContent';
import { eraById } from '@/data/eras';
import { regionNames } from '@/data/regions';
import { pushTrail, useBookmarks, useIsDesktop, usePageMeta, usePreferences, useShare, useTrail } from '@/lib/hooks';
import { track } from '@/lib/analytics';
import { readingMinutes, readingTimeLabel, wordCount } from '@/lib/reading';
import { Breadcrumbs, DisputedNotes, Icon, LifespanBar, Postmark, PortraitMedallion, QuoteCard, Reveal, SourceList, SuggestCorrection, eraAccent, icons } from '@/components/ui';
import { DraftStamp, ReadingText, ReadingToolbar } from '@/components/reading';
import { RouteFallback } from '@/components/layout';
import { EventCard, FighterChip } from '@/components/cards';
import { Constellation, SimilarStories } from '@/components/constellation';
import type { DisputedNote, FighterSummary, FreedomFighter, SourceRef, StoryChapter } from '@/types';

/* ------------------------------------------------------------------ */
/* Story Mode — stepper on phones, full chapter list on desktop         */
function StoryMode({ chapters, accent, sources }: { chapters: StoryChapter[]; accent: keyof typeof eraAccent.bg; sources: SourceRef[] }) {
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
            <ReadingText paragraphs={[chapter.text]} sources={sources} className="mt-2" />
            {chapter.uncertainty && (
              <p className="mt-3 font-body text-label text-ink-soft">
                <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
                {chapter.uncertainty}
              </p>
            )}
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
        <ReadingText paragraphs={[chapter.text]} sources={sources} className="mt-4" />
        {chapter.uncertainty && (
          <p className="mt-3 font-body text-label text-ink-soft">
            <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
            {chapter.uncertainty}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-ghost !min-h-12 !px-5" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous chapter">
          <Icon d={icons.arrowLeft} className="h-4 w-4" />
        </button>
        {/* Each dot's tap target grew to 44px for touch accessibility, which
           can outgrow the row on a narrow phone; giving the group its own
           full-width line keeps it from ever pushing Next off-screen. */}
        <div className="order-first flex w-full items-center justify-center gap-1.5 sm:order-none sm:w-auto" role="group" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              aria-current={i === index ? 'step' : undefined}
              aria-label={`Chapter ${i + 1}: ${c.title}`}
              onClick={() => setIndex(i)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span aria-hidden="true" className={`block h-2.5 w-2.5 rounded-none transition-colors duration-400 ease-cinematic ${i === index ? eraAccent.bg[accent] : 'bg-paper-400'}`} />
            </button>
          ))}
        </div>
        {index < chapters.length - 1 ? (
          <button
            type="button"
            className="btn-seal !min-h-12 !px-5"
            onClick={() => {
              track('story_chapter_completed', { chapter: index + 1, of: chapters.length });
              setIndex((i) => Math.min(chapters.length - 1, i + 1));
            }}
            aria-label="Next chapter"
          >
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

function notesByParagraph(notes: DisputedNote[] | undefined): Record<number, DisputedNote[]> {
  const out: Record<number, DisputedNote[]> = {};
  for (const n of notes ?? []) if (n.paragraph !== undefined) (out[n.paragraph] ??= []).push(n);
  return out;
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
  /* The summary is already in hand synchronously (it's in the initial
     bundle) — the hero paints immediately from it. The full record
     (biography, quotes, sources, Story Mode...) loads lazily; everything
     below the hero waits on it. */
  const summary: FighterSummary | undefined = slug ? fighterBySlug.get(slug) : undefined;
  /* A lazy initializer, not `undefined`: the initial route's record is
     prefetched before hydration even starts (src/lib/routes.tsx), so the
     very first render — the one hydration checks against the prerendered
     snapshot — must already reflect it instead of waiting on the effect
     below, or that first render would mismatch the full body React captured
     into the static HTML. */
  const [fighter, setFighter] = useState<FreedomFighter | undefined>(() => (slug ? peekFighter(slug) : undefined));
  const [{ readingMode: mode }] = usePreferences();
  const { bookmarks, toggle } = useBookmarks();
  const { share, copied } = useShare();
  const trail = useTrail();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const backTo = from && from.startsWith('/fighters?') ? from : '/fighters';
  const [justToggled, setJustToggled] = useState<'saved' | 'removed' | null>(null);
  useEffect(() => {
    if (!justToggled) return;
    const t = window.setTimeout(() => setJustToggled(null), 5000);
    return () => window.clearTimeout(t);
  }, [justToggled]);

  useEffect(() => {
    const cached = slug ? peekFighter(slug) : undefined;
    if (cached) {
      setFighter(cached);
      return;
    }
    setFighter(undefined);
    if (!slug) return;
    let live = true;
    loadFighter(slug).then((f) => {
      if (live) setFighter(f);
    });
    return () => {
      live = false;
    };
  }, [slug]);

  usePageMeta(summary?.name ?? 'Freedom fighter', summary?.summary, {
    type: 'article',
    image: summary && `/og/fighters/${summary.slug}.jpg`,
    deferReady: true,
  });
  useEffect(() => {
    if (fighter) document.documentElement.dataset.prerenderReady = 'true';
  }, [fighter]);
  useEffect(() => {
    if (fighter) pushTrail(fighter.slug);
  }, [fighter]);

  const connections = useMemo(() => (fighter ? connectionsFor(fighter.id) : []), [fighter]);
  const related = useMemo(() => (fighter ? similarFor(fighter, connections) : []), [fighter, connections]);
  const timeline = useMemo(() => (fighter ? eventsForFighter(fighter) : []), [fighter]);
  const discoverNext = useMemo(() => {
    if (!fighter) return null;
    /* Deterministic (not truly random): a prerendered snapshot and the
       browser hydrating it must agree on the pick. */
    return hashPick(fighters.filter((f) => f.id !== fighter.id && !fighter.relatedPeople.includes(f.id) && f.region !== fighter.region), fighter.id);
  }, [fighter]);

  if (!summary) return <Navigate to="/fighters" replace />;

  const era = eraById.get(summary.era);
  const accent = era?.accent ?? 'brass';
  const bookmarked = bookmarks.includes(summary.slug);
  const previous = trail.filter((s) => s !== summary.slug).map((s) => fighterBySlug.get(s)).filter(Boolean).slice(0, 3);
  /* Every era pane is now a deep cut carrying paper lettering (ui.tsx). */
  const heroChip = 'chip-vault';
  const toggleSave = () => {
    const wasSaved = bookmarks.includes(summary.slug);
    toggle(summary.slug);
    setJustToggled(wasSaved ? 'removed' : 'saved');
  };
  const postmarkLines = ['India', 'Post', String(summary.deathYear ?? summary.birthYear ?? era?.startYear ?? '')].filter(Boolean);

  return (
    <article>
      {/* Hero — a life issued as a commemorative */}
      <header className="container-page pt-2">
        <div
          className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[accent]} ${eraAccent.onInk[accent]} ${
            'on-vault'
          }`}
        >
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'People', to: backTo }, { label: summary.name }]} />
          <Postmark lines={postmarkLines} className="absolute right-4 top-5 hidden sm:grid" />

          <div className="mt-5 grid grid-cols-1 gap-7 md:grid-cols-[auto_1fr] md:items-end">
            <figure className="flex flex-col items-center gap-2">
              <PortraitMedallion name={summary.name} era={era} portrait={summary.portrait} size="hero" onPane />
              {fighter?.portraitNote && (
                <figcaption className={`max-w-[10rem] text-center font-body text-xs ${eraAccent.onInkMuted[accent]}`}>
                  <span className="stamp mr-1">{fighter.portraitNote.kind}</span>
                  {fighter.portraitNote.caption}
                </figcaption>
              )}
            </figure>
            <div className="min-w-0">
              <h1 className="break-words pr-0 text-h1 animate-fade-up sm:pr-28 sm:text-hero" style={{ animationDelay: '80ms' }}>
                {summary.name}
              </h1>
              {summary.pronunciation && (
                <p className={`mt-1 font-body text-label ${eraAccent.onInkMuted[accent]}`}>Say it: {summary.pronunciation}</p>
              )}
              {summary.alternateNames && summary.alternateNames.length > 0 && (
                <p className={`mt-2 font-reading text-reading italic animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '140ms' }}>
                  {summary.alternateNames.join(' · ')}
                </p>
              )}
              <p className={`num mt-3 font-body text-label animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '180ms' }}>
                {lifespan(summary)}
                {era && <> · {era.name}</>}
                {' · '}
                {summary.states[0]}
              </p>
              <div className="mt-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
                <LifespanBar birth={summary.birthYear} death={summary.deathYear} vault />
              </div>
            </div>
          </div>

          <p className={`mt-8 max-w-prose font-reading text-reading animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '300ms' }}>
            {summary.summary}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {summary.roles.map((r) => (
              <span key={r} className={`stamp ${eraAccent.onInkMuted[accent]}`}>
                {roleLabels[r]}
              </span>
            ))}
            <span className={`mx-1 hidden h-5 w-px sm:block bg-paper-100/20`} aria-hidden="true" />
            <span className="relative inline-flex">
              <button
                type="button"
                onClick={toggleSave}
                aria-pressed={bookmarked}
                className={`${heroChip} min-h-11 ${bookmarked ? '!bg-paper-50 !text-ink' : ''}`}
              >
                <Icon d={icons.bookmark} className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved' : 'Save this story'}
              </button>
              {justToggled === 'saved' && (
                <span aria-hidden="true" className="postmark-stamp">
                  <span>
                    <span className="block">Saved</span>
                  </span>
                </span>
              )}
            </span>
            <p role="status" aria-live="polite" className="sr-only">
              {justToggled === 'saved' ? 'Saved to your stories' : justToggled === 'removed' ? 'Removed from your stories' : ''}
            </p>
            <button type="button" onClick={() => share(summary.name, summary.summary, `/fighters/${summary.slug}`)} className={`${heroChip} min-h-11`}>
              <Icon d={icons.share} className="h-4 w-4" />
              {copied ? 'Link copied' : 'Share'}
            </button>
          </div>
          {justToggled && (
            <div className="mt-4 flex items-center gap-3 font-body text-meta">
              <span className={eraAccent.onInkMuted[accent]}>{justToggled === 'saved' ? 'Saved to your stories.' : 'Removed from your stories.'}</span>
              <button type="button" className="chip-vault min-h-9" onClick={toggleSave}>
                Undo
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Body — waits on the full record (Story Mode, quotes, sources...) */}
      {!fighter ? (
        <RouteFallback />
      ) : (
        <>
          <div className="container-page grid grid-cols-1 gap-12 pb-12 pt-14 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div className="min-w-0 space-y-12">
              {fighter.editorial?.status === 'draft' && <DraftStamp />}

              {fighter.contentNote && (
                <p role="note" className="rounded-sm border border-paper-400 bg-paper-200/60 p-4 font-body text-meta text-ink-soft">
                  <span className="stamp mr-2 text-sepia">Content note</span>
                  {fighter.contentNote}
                </p>
              )}

              {fighter.inAMinute && (
                <section id="in-a-minute" aria-label="In a minute" className="doc scroll-mt-28 p-5 sm:p-6">
                  <p className="label mb-3">In a minute</p>
                  <ol className="space-y-2.5">
                    {fighter.inAMinute.map((line, i) => (
                      <li key={i} className="flex gap-3 font-body text-meta text-ink">
                        <span className="num shrink-0 font-display text-sm font-bold text-brass-deep">{i + 1}</span>
                        {line}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <nav aria-label="On this page" className="flex flex-wrap gap-2">
                {[
                  ['#story', 'Story'],
                  ['#dates', 'Dates'],
                  fighter.sacrifices?.length ? ['#cost', 'Cost of resistance'] : null,
                  fighter.legacy ? ['#legacy', 'Legacy'] : null,
                  related.length || connections.length ? ['#connections', 'Connections'] : null,
                  ['#sources', 'Sources'],
                ]
                  .filter((x): x is [string, string] => Boolean(x))
                  .map(([href, label]) => (
                    <a key={href} href={href} className="chip min-h-9">
                      {label}
                    </a>
                  ))}
              </nav>

              <section id="story" aria-label="Life story" className="scroll-mt-28">
                <div className="rule-double mb-5" />
                <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-h2 text-ink">{mode === 'story' ? 'Quick story' : 'Detailed history'}</h2>
                  <ReadingToolbar />
                </div>
                <p className="label num mb-6">{readingTimeLabel(mode === 'story' ? readingMinutes(wordCount(fighter.shortStory.map((c) => c.text).join(' '))) : summary.readingMinutes)}</p>
                <div key={mode} data-mode-swap className="animate-mode-swap">
                  {mode === 'story' ? (
                    <StoryMode chapters={fighter.shortStory} accent={accent} sources={fighter.sources} />
                  ) : (
                    <ReadingText
                      paragraphs={fighter.fullBiography}
                      sources={fighter.sources}
                      dropcap
                      className="max-w-prose"
                      notesByParagraph={notesByParagraph(fighter.disputed)}
                    />
                  )}
                </div>
              </section>

              {mode === 'detail' && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
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
                </div>
              )}

              {fighter.quotes && fighter.quotes.length > 0 && (
                <section aria-label="In their words" className="space-y-8">
                  {fighter.quotes.map((q) => (
                    <QuoteCard key={q.text} quote={q} author={fighter.name} />
                  ))}
                </section>
              )}

              {timeline.length > 0 && (
                <section id="dates" aria-label="A life in dates" className="scroll-mt-28">
                  <h2 className="mb-5 text-h2 text-ink">A life in dates</h2>
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

              {fighter.sacrifices && fighter.sacrifices.length > 0 && (
                <section id="cost" aria-label="The cost of resistance" className="doc scroll-mt-28 p-6">
                  <div className="rule mb-4" />
                  <h2 className="text-h3 text-ink">The cost of resistance</h2>
                  <ul className="mt-3 space-y-2">
                    {fighter.sacrifices.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 bg-brass" />
                        <ReadingText paragraphs={[item]} sources={fighter.sources} glossary={false} className="font-body text-meta text-ink-soft [&_p]:font-body [&_p]:text-meta" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {fighter.legacy && (
                <Reveal as="section" id="legacy" className="doc scroll-mt-28 p-6">
                  <div className="rule mb-4" />
                  <h3 className="text-h3 text-ink">Legacy</h3>
                  <ReadingText paragraphs={[fighter.legacy]} sources={fighter.sources} className="mt-3" />
                </Reveal>
              )}

              {fighter.disputed && fighter.disputed.filter((d) => d.paragraph === undefined).length > 0 && (
                <DisputedNotes notes={fighter.disputed.filter((d) => d.paragraph === undefined)} />
              )}

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
          {connections.length > 0 && (
            <section id="connections" className="vault mt-14 scroll-mt-28 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Documented connections">
              <div className="container-page">
                <Reveal className="mb-8 max-w-2xl">
                  <div className="rule-double-vault mb-5" />
                  <h2 className="text-h2 text-paper-50">People connected to {summary.shortName ?? summary.name}</h2>
                  <p className="mt-2 font-body text-meta text-paper-300">Only relationships the record documents are drawn here — an ally, an opponent, a teacher, a family member — each with what the connection was.</p>
                </Reveal>
                <Constellation subject={summary} connections={connections} />
              </div>
            </section>
          )}
          <SimilarStories people={related} id={connections.length ? undefined : 'connections'} />

          {/* Continue the thread */}
          <div className="container-page pt-14">
            <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
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
          <div className="container-page space-y-5 py-14">
            <SourceList sources={fighter.sources} />
            <SuggestCorrection path={`/fighters/${summary.slug}`} recordTitle={summary.name} />
          </div>
        </>
      )}
    </article>
  );
}
