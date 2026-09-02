import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { eventsForFighter, fighterBySlug, fighters, lifespan, movementById, organizationById, relatedFighters, roleLabels, randomPick } from '@/lib/content';
import { eraById } from '@/data/eras';
import { regionNames } from '@/data/regions';
import { pushTrail, useBookmarks, useIsDesktop, usePageMeta, useShare, useTrail } from '@/lib/hooks';
import { DisputedNotes, LifespanBar, PortraitMedallion, QuoteCard, Reveal, Segmented, SourceList, eraAccent } from '@/components/ui';
import { EventCard } from '@/components/cards';
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
            <span aria-hidden="true" className={`absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold text-paper-50 sm:left-6 sm:top-6 ${eraAccent.bg[accent]}`}>
              {i + 1}
            </span>
            <h3 className="font-display text-xl font-semibold text-ink">{chapter.title}</h3>
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
      <div key={chapter.title} className="doc relative overflow-hidden p-6 animate-fade-up">
        <p aria-hidden="true" className={`absolute -right-3 -top-6 select-none font-display text-[7rem] font-black italic leading-none opacity-[0.08] ${eraAccent.text[accent]}`}>
          {index + 1}
        </p>
        <p className="eyebrow mb-2">
          Chapter {index + 1} of {chapters.length}
        </p>
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{chapter.title}</h3>
        <p className="prose-reading mt-3 text-[1.15rem]">{chapter.text}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost !min-h-12 !px-5" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous chapter">
          ←
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Chapter ${i + 1}: ${c.title}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-[width,background-color] duration-400 ease-cinematic ${i === index ? `w-7 ${eraAccent.bg[accent]}` : 'w-2.5 bg-paper-400'}`}
            />
          ))}
        </div>
        {index < chapters.length - 1 ? (
          <button type="button" className="btn-seal !min-h-12 !px-5" onClick={() => setIndex((i) => Math.min(chapters.length - 1, i + 1))} aria-label="Next chapter">
            Next →
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
      <h3 className="mb-3 font-display text-lg font-semibold text-ink">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
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
            <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-faint">{k}</dt>
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

  return (
    <article>
      {/* Hero */}
      <header className="vault">
        <p aria-hidden="true" className={`drift-on-scroll pointer-events-none absolute right-0 top-8 select-none font-display text-numeral font-black italic leading-none opacity-[0.07] ${eraAccent.textVault[accent]}`}>
          {fighter.birthYear ?? ''}
        </p>
        <div className="container-page pb-12 pt-28 sm:pb-16 sm:pt-36">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-end">
            <div className="animate-fade-up">
              <PortraitMedallion name={fighter.name} era={era} size="hero" />
            </div>
            <div className="min-w-0">
              <p className="eyebrow-vault mb-3 animate-fade-up">
                {era?.name} · {regionNames[fighter.region]} · {fighter.states[0]}
              </p>
              <h1 className="text-display font-black text-paper-50 animate-fade-up" style={{ animationDelay: '80ms', fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>
                {fighter.name}
              </h1>
              {fighter.alternateNames && fighter.alternateNames.length > 0 && (
                <p className="mt-2 font-display text-lg italic text-brass-bright animate-fade-up" style={{ animationDelay: '140ms', fontVariationSettings: '"SOFT" 60' }}>
                  {fighter.alternateNames.join(' · ')}
                </p>
              )}
              <p className="mt-3 font-display text-2xl font-semibold text-paper-200 animate-fade-up" style={{ animationDelay: '180ms' }}>
                {lifespan(fighter)}
              </p>
              <div className="mt-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
                <LifespanBar birth={fighter.birthYear} death={fighter.deathYear} />
              </div>
            </div>
          </div>

          <p className="prose-reading-vault mt-8 max-w-3xl text-[1.2rem] animate-fade-up" style={{ animationDelay: '300ms' }}>
            {fighter.summary}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {fighter.roles.map((r) => (
              <span key={r} className="chip-vault !min-h-8">
                {roleLabels[r]}
              </span>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-paper-100/20 sm:block" aria-hidden="true" />
            <button type="button" onClick={() => toggle(fighter.slug)} aria-pressed={bookmarked} className={`chip-vault min-h-10 ${bookmarked ? '!bg-paper-50 !text-ink' : ''}`}>
              {bookmarked ? '★ Saved' : '☆ Save this story'}
            </button>
            <button type="button" onClick={() => share(fighter.name, fighter.summary, `/fighters/${fighter.slug}`)} className="chip-vault min-h-10">
              {copied ? '✓ Link copied' : '⇪ Share'}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <section aria-label="Life story">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">The story</p>
                <h2 className="font-display text-2xl font-semibold text-ink">{mode === 'story' ? 'Quick story' : 'Detailed history'}</h2>
              </div>
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
                  <h3 className="mb-3 font-display text-lg font-semibold text-ink">Entry into the struggle</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{fighter.entryIntoStruggle}</p>
                </Reveal>
              )}
              {fighter.ideology && (
                <Reveal as="section">
                  <h3 className="mb-3 font-display text-lg font-semibold text-ink">Ideology & philosophy</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{fighter.ideology}</p>
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
            <Reveal as="section" className={`rounded-lg border-l-4 bg-paper-50 p-6 shadow-card ${eraAccent.border[accent]}`}>
              <p className="eyebrow mb-1">Legacy</p>
              <p className="prose-reading">{fighter.legacy}</p>
            </Reveal>
          )}

          {fighter.disputed && <DisputedNotes notes={fighter.disputed} />}

          {fighter.facts && fighter.facts.length > 0 && (
            <Reveal as="section" className="rounded-lg border border-brass/40 bg-saffron-wash/50 p-6">
              <p className="stamp mb-3 text-oxide">Interesting facts</p>
              <ul className="space-y-2">
                {fighter.facts.map((fact) => (
                  <li key={fact} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="text-brass">✦</span> {fact}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {timeline.length > 0 && (
            <section aria-label="Events in this life">
              <p className="eyebrow mb-1">Moments in this life</p>
              <h2 className="mb-5 font-display text-2xl font-semibold text-ink">On the timeline</h2>
              <div className="relative">
                <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-paper-400/70" />
                <ol className="space-y-4 pl-8">
                  {timeline.map((event, i) => (
                    <li key={event.id} className="relative">
                      <span aria-hidden="true" className={`absolute -left-8 top-6 h-3.5 w-3.5 rounded-full ring-4 ring-paper-100 ${eraAccent.bg[accent]}`} />
                      <EventCard event={event} delay={i * 60} />
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          <SourceList sources={fighter.sources} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal className="doc p-5">
            <p className="eyebrow mb-3">At a glance</p>
            <Ledger fighter={fighter} />
          </Reveal>

          {fighter.movements.length > 0 && (
            <Reveal className="doc p-5" delay={60}>
              <p className="eyebrow mb-3">Movements</p>
              <ul className="space-y-2.5">
                {fighter.movements.map((mid) => {
                  const m = movementById.get(mid);
                  return m ? (
                    <li key={mid}>
                      <Link to={`/movements/${m.slug}`} className="group flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold text-ink group-hover:text-oxide">{m.name}</span>
                        <span className="shrink-0 font-display text-xs text-sepia">{m.period}</span>
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </Reveal>
          )}

          {fighter.organizations.length > 0 && (
            <Reveal className="doc p-5" delay={120}>
              <p className="eyebrow mb-3">Organizations</p>
              <ul className="space-y-3">
                {fighter.organizations.map((oid) => {
                  const o = organizationById.get(oid);
                  return o ? (
                    <li key={oid} className="text-sm">
                      <p className="font-semibold text-ink">{o.name}</p>
                      {o.foundedLabel && <p className="text-xs text-ink-faint">founded {o.foundedLabel}</p>}
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
        <section className="vault py-16 sm:py-20" aria-label="Related freedom fighters">
          <div className="container-page">
            <Reveal className="mb-8 max-w-2xl">
              <p className="eyebrow-vault mb-2">Their world</p>
              <h2 className="font-display text-[1.9rem] font-semibold leading-tight text-paper-50 sm:text-[2.4rem]">People connected to {fighter.name.split(' ').slice(-1)[0]}</h2>
              <p className="mt-2 text-[15px] text-paper-300">Comrades, rivals, mentors and inheritors — every life connects to others. Select anyone to follow the thread.</p>
            </Reveal>
            <Constellation subject={fighter} related={related} />
          </div>
        </section>
      )}

      {/* Continue the thread */}
      <div className="container-page py-14">
        <Reveal className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow mb-1">Continue the thread</p>
            {previous.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                <span>Your trail:</span>
                {previous.map((f) => (
                  <Link key={f!.id} to={`/fighters/${f!.slug}`} className="chip">
                    ← {f!.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">Every profile leads somewhere. Try a different corner of the struggle.</p>
            )}
          </div>
          {discoverNext && (
            <Link to={`/fighters/${discoverNext.slug}`} className="btn-seal">
              Meet {discoverNext.name} <span aria-hidden="true">→</span>
            </Link>
          )}
        </Reveal>
      </div>
    </article>
  );
}
