import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { categoryLabels, eventBySlug, events, fightersForEvent, movementById } from '@/lib/content';
import { eraById } from '@/data/eras';
import { usePageMeta, useShare } from '@/lib/hooks';
import { DisputedNotes, Icon, Postmark, Reveal, SourceList, eraAccent, icons } from '@/components/ui';
import { FighterCard } from '@/components/cards';

export default function EventPage() {
  const { slug } = useParams();
  const event = slug ? eventBySlug.get(slug) : undefined;
  const { share, copied } = useShare();

  usePageMeta(event?.title ?? 'Event', event?.summary);

  const people = useMemo(() => (event ? fightersForEvent(event) : []), [event]);
  const neighbours = useMemo(() => {
    if (!event) return { prev: [], next: [] };
    const idx = events.findIndex((e) => e.id === event.id);
    return { prev: events.slice(Math.max(0, idx - 1), idx), next: events.slice(idx + 1, idx + 3) };
  }, [event]);

  if (!event) return <Navigate to="/events" replace />;

  const era = eraById.get(event.era);
  const movement = event.movement ? movementById.get(event.movement) : undefined;
  const accent = era?.accent ?? 'brass';
  /* Every era pane is now a deep cut carrying paper lettering (ui.tsx). */
  const heroChip = 'chip-vault';

  return (
    <article>
      {/* Hero — the day issued as a commemorative */}
      <header className="container-page pt-2">
        <div
          className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[accent]} ${eraAccent.onInk[accent]} ${
            'on-vault'
          }`}
        >
          <Postmark
            lines={['India', 'Post', String(event.date.year)]}
            className="absolute right-4 top-5 hidden sm:grid"
          />

          <h1 className="max-w-4xl pr-0 text-h1 animate-fade-up sm:pr-28 sm:text-hero">{event.title}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <time className="denom">{event.dateLabel}</time>
            <span className={`stamp ${eraAccent.onInkMuted[accent]}`}>{categoryLabels[event.category]}</span>
          </div>
          {(era || event.location) && (
            <p className={`num mt-2 font-body text-label animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '160ms' }}>
              {era?.name}
              {era && event.location && ' · '}
              {event.location}
            </p>
          )}
          <p className={`mt-6 max-w-prose font-reading text-reading animate-fade-up ${eraAccent.onInkMuted[accent]}`} style={{ animationDelay: '240ms' }}>
            {event.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <button type="button" onClick={() => share(event.title, event.summary, `/events/${event.slug}`)} className={`${heroChip} min-h-10`}>
              <Icon d={icons.share} className="h-4 w-4" />
              {copied ? 'Link copied' : 'Share'}
            </button>
            {movement && (
              <Link to={`/movements/${movement.slug}`} className={`${heroChip} min-h-10`}>
                Part of: {movement.name}
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            )}
            <Link to={`/timeline#era-${event.era}`} className={`${heroChip} min-h-10`}>
              <Icon d={icons.clock} className="h-4 w-4" />
              See on the timeline
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 pb-12 pt-14 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="min-w-0 space-y-10">
          <section className="max-w-prose space-y-5" aria-label="The story">
            {event.description.map((para, i) => (
              <Reveal as="p" key={i} className={`prose-reading ${i === 0 ? 'dropcap' : ''}`} delay={i * 60}>
                {para}
              </Reveal>
            ))}
          </section>

          {event.significance && (
            <Reveal as="section" className="doc p-6">
              <div className="rule mb-4" />
              <h2 className="text-h3 text-ink">Why it matters</h2>
              <p className="prose-reading mt-3">{event.significance}</p>
            </Reveal>
          )}

          {event.disputed && <DisputedNotes notes={event.disputed} />}

          <SourceList sources={event.sources} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {people.length > 0 && (
            <section aria-label="People of this event">
              <p className="label mb-3">The people of this moment</p>
              <div className="space-y-3">
                {people.map((f, i) => (
                  <FighterCard key={f.id} fighter={f} compact delay={i * 60} />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {(neighbours.next.length > 0 || neighbours.prev.length > 0) && (
        <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Before and after">
          <div className="container-page">
            <Reveal className="mb-8">
              <div className="rule-double-vault mb-5" />
              <h2 className="text-h2 text-paper-50">What happened next?</h2>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {neighbours.prev.map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className="group rounded-sm border border-paper-100/15 p-5 transition-colors duration-160 ease-cinematic hover:border-paper-100/60">
                  <p className="font-display text-h3 font-bold text-paper-50 group-hover:text-brass-bright">{e.title}</p>
                  <p className="label-vault num mt-1 inline-flex items-center gap-2"><Icon d={icons.arrowLeft} className="h-4 w-4" />Before · {e.date.year}</p>
                </Link>
              ))}
              {neighbours.next.map((e, i) => (
                <Link key={e.id} to={`/events/${e.slug}`} className="group rounded-sm border border-paper-100/15 p-5 transition-colors duration-160 ease-cinematic hover:border-paper-100/60">
                  <p className="font-display text-h3 font-bold text-paper-50 group-hover:text-brass-bright">{e.title}</p>
                  <p className="label-vault num mt-1 inline-flex items-center gap-2">
                    {i === 0 ? 'Next' : 'Then'} · {e.date.year}
                    <Icon d={icons.arrowRight} className="h-4 w-4" />
                  </p>
                  <p className="mt-1.5 line-clamp-2 font-body text-meta text-paper-300">{e.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
