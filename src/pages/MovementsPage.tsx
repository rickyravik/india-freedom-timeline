import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { eventsForMovement, fightersForMovement, movementBySlug, movements } from '@/lib/content';
import { regionNames } from '@/data/regions';
import { usePageMeta } from '@/lib/hooks';
import { Icon, PageIntro, Postmark, Reveal, SectionHeading, SourceList, icons } from '@/components/ui';
import { EventCard, FighterCard, MovementCard } from '@/components/cards';

export default function MovementsPage() {
  usePageMeta('Movements', 'The movements of India’s freedom struggle — from early uprisings and Swadeshi to Quit India and the INA.');
  return (
    <div className="pb-20">
      <PageIntro
        title="Movements of the Struggle"
        lede="Petition and boycott, satyagraha and armed revolt, Adivasi risings and soldiers’ armies — the freedom struggle was many struggles, arguing with and strengthening one another."
      />
      <div className="container-page">
        {/* Movements as a chronological ledger */}
        <div className="relative">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 hidden w-px bg-paper-400/70 sm:block" />
          <div className="grid gap-3 sm:grid-cols-2 sm:pl-8 lg:grid-cols-3">
            {movements
              .slice()
              .sort((a, b) => a.startYear - b.startYear)
              .map((m, i) => (
                <MovementCard key={m.id} movement={m} delay={(i % 6) * 60} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovementPage() {
  const { slug } = useParams();
  const movement = slug ? movementBySlug.get(slug) : undefined;
  usePageMeta(movement?.name ?? 'Movement', movement?.summary);

  const people = useMemo(() => (movement ? fightersForMovement(movement) : []), [movement]);
  const relatedEvents = useMemo(() => (movement ? eventsForMovement(movement) : []), [movement]);

  if (!movement) return <Navigate to="/movements" replace />;

  return (
    <article>
      {/* The movement's own stamp, mounted on the sheet */}
      <header className="container-page pt-2">
        <div className="vault animate-fade-up px-5 py-7 sm:px-9 sm:py-10">
          <Postmark lines={['India', 'Post', String(movement.startYear)]} className="absolute right-4 top-5 hidden sm:grid" />

          <h1 className="max-w-3xl text-h1 text-paper-50 sm:pr-32">{movement.name}</h1>
          <p className="label-vault num mt-3">
            {movement.period} · {movement.regions.map((r) => regionNames[r]).join(', ')}
          </p>

          <div className="rule-vault my-6" />

          <p className="prose-reading-vault max-w-prose">{movement.summary}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="chip-vault num">{people.length} people</span>
            <span className="chip-vault num">{relatedEvents.length} events</span>
            <Link to={`/timeline?movement=${movement.id}`} className="chip-vault min-h-10">
              <Icon d={icons.clock} className="h-4 w-4" />
              Filter the timeline by this movement
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page space-y-14 py-14 sm:space-y-20 sm:py-16">
        <section className="max-w-prose space-y-5" aria-label="About this movement">
          {movement.description.map((para, i) => (
            <Reveal as="p" key={i} className={`prose-reading ${i === 0 ? 'dropcap' : ''}`} delay={i * 60}>
              {para}
            </Reveal>
          ))}
        </section>

        {relatedEvents.length > 0 && (
          <section aria-label="Events of this movement">
            <SectionHeading title="Events of the movement" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((e, i) => (
                <EventCard key={e.id} event={e} delay={i * 60} />
              ))}
            </div>
          </section>
        )}

        <SourceList sources={movement.sources} />
      </div>

      {people.length > 0 && (
        <section className="vault px-5 py-12 sm:px-8 sm:py-16" aria-label="People of this movement">
          <div className="container-page">
            <SectionHeading title="Who carried this movement" vault />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((f, i) => (
                <FighterCard key={f.id} fighter={f} compact vault delay={(i % 6) * 60} />
              ))}
            </div>
            <Link to="/movements" className="mt-10 inline-flex items-center gap-2 font-body text-meta font-medium text-brass-bright hover:text-paper-50">
              <Icon d={icons.arrowLeft} className="h-4 w-4" />
              All movements
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
