import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { categoryLabels, eventBySlug, events, fightersForEvent, movementById } from '@/lib/content';
import { eraById } from '@/data/eras';
import { usePageMeta, useShare } from '@/lib/hooks';
import { DisputedNotes, Reveal, SourceList, eraAccent } from '@/components/ui';
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
  const accent = era?.accent ?? 'oxide';
  const movement = event.movement ? movementById.get(event.movement) : undefined;

  return (
    <article>
      <header className="vault">
        <p aria-hidden="true" className={`drift-on-scroll pointer-events-none absolute right-0 top-6 select-none font-display text-numeral font-black italic leading-none opacity-[0.08] ${eraAccent.textVault[accent]}`}>
          {event.date.year}
        </p>
        <div className="container-page pb-12 pt-28 sm:pb-16 sm:pt-36">
          <p className="eyebrow-vault mb-4 animate-fade-up">
            {era?.name}
            {event.location && <> · {event.location}</>}
          </p>
          <h1 className="max-w-4xl text-display font-black text-paper-50 animate-fade-up" style={{ animationDelay: '80ms', fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            {event.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <time className="font-display text-2xl font-semibold text-brass-bright">{event.dateLabel}</time>
            <span className="stamp text-paper-300">{categoryLabels[event.category]}</span>
          </div>
          <p className="prose-reading-vault mt-6 max-w-3xl text-[1.2rem] animate-fade-up" style={{ animationDelay: '240ms' }}>
            {event.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <button type="button" onClick={() => share(event.title, event.summary, `/events/${event.slug}`)} className="chip-vault min-h-10">
              {copied ? '✓ Link copied' : '⇪ Share'}
            </button>
            {movement && (
              <Link to={`/movements/${movement.slug}`} className="chip-vault min-h-10">
                Part of: {movement.name} →
              </Link>
            )}
            <Link to={`/timeline#era-${event.era}`} className="chip-vault min-h-10">
              ⧗ See on the timeline
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="min-w-0 space-y-10">
          <section className="max-w-prose space-y-5" aria-label="The story">
            {event.description.map((para, i) => (
              <Reveal as="p" key={i} className={`prose-reading ${i === 0 ? 'dropcap' : ''}`} delay={i * 60}>
                {para}
              </Reveal>
            ))}
          </section>

          {event.significance && (
            <Reveal as="section" className={`rounded-lg border-l-4 bg-paper-50 p-6 shadow-card ${eraAccent.border[accent]}`}>
              <p className="eyebrow mb-1">Why it matters</p>
              <p className="prose-reading">{event.significance}</p>
            </Reveal>
          )}

          {event.disputed && <DisputedNotes notes={event.disputed} />}

          <SourceList sources={event.sources} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {people.length > 0 && (
            <section aria-label="People of this event">
              <p className="eyebrow mb-3">The people of this moment</p>
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
        <section className="vault py-16" aria-label="Before and after">
          <div className="container-page">
            <Reveal className="mb-8">
              <p className="eyebrow-vault mb-2">The thread of history</p>
              <h2 className="font-display text-[1.9rem] font-semibold leading-tight text-paper-50 sm:text-[2.4rem]">What happened next?</h2>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {neighbours.prev.map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className="group rounded-lg border border-paper-100/10 bg-paper-100/[0.04] p-5 transition-colors hover:border-paper-100/25 hover:bg-paper-100/[0.07]">
                  <p className="eyebrow-vault">← Before · {e.date.year}</p>
                  <p className="mt-2 font-display text-lg font-semibold text-paper-50 group-hover:text-brass-bright">{e.title}</p>
                </Link>
              ))}
              {neighbours.next.map((e, i) => (
                <Link key={e.id} to={`/events/${e.slug}`} className="group rounded-lg border border-paper-100/10 bg-paper-100/[0.04] p-5 transition-colors hover:border-paper-100/25 hover:bg-paper-100/[0.07]">
                  <p className="eyebrow-vault">
                    {i === 0 ? 'Next' : 'Then'} · {e.date.year} →
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-paper-50 group-hover:text-brass-bright">{e.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-paper-300">{e.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
