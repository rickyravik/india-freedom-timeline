import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { eventsForMovement, fightersForMovement, movementBySlug, movements } from '@/lib/content';
import { regionNames } from '@/data/regions';
import { usePageMeta } from '@/lib/hooks';
import { PageIntro, Reveal, SourceList } from '@/components/ui';
import { EventCard, FighterCard, MovementCard } from '@/components/cards';

export default function MovementsPage() {
  usePageMeta('Movements', 'The movements of India’s freedom struggle — from early uprisings and Swadeshi to Quit India and the INA.');
  return (
    <div className="pb-20">
      <PageIntro
        eyebrow="Many roads to freedom"
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
      <header className="vault">
        <p aria-hidden="true" className="drift-on-scroll pointer-events-none absolute right-0 top-6 select-none font-display text-numeral font-black italic leading-none text-forest-bright opacity-[0.08]">
          {movement.startYear}
        </p>
        <div className="container-page pb-12 pt-28 sm:pb-16 sm:pt-36">
          <p className="eyebrow-vault mb-4 animate-fade-up">
            {movement.period} · {movement.regions.map((r) => regionNames[r]).join(', ')}
          </p>
          <h1 className="max-w-4xl text-display font-black text-paper-50 animate-fade-up" style={{ animationDelay: '80ms', fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            {movement.name}
          </h1>
          <p className="prose-reading-vault mt-6 max-w-3xl text-[1.2rem] animate-fade-up" style={{ animationDelay: '200ms' }}>
            {movement.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <span className="chip-vault !min-h-8">{people.length} people</span>
            <span className="chip-vault !min-h-8">{relatedEvents.length} events</span>
            <Link to={`/timeline?movement=${movement.id}`} className="chip-vault min-h-10">
              ⧗ Filter the timeline by this movement
            </Link>
          </div>
        </div>
      </header>

      <div className="container-page space-y-14 py-12">
        <section className="max-w-prose space-y-5" aria-label="About this movement">
          {movement.description.map((para, i) => (
            <Reveal as="p" key={i} className={`prose-reading ${i === 0 ? 'dropcap' : ''}`} delay={i * 60}>
              {para}
            </Reveal>
          ))}
        </section>

        {relatedEvents.length > 0 && (
          <section aria-label="Events of this movement">
            <Reveal className="mb-5">
              <p className="eyebrow mb-1">Moments</p>
              <h2 className="font-display text-2xl font-semibold text-ink">Events of the movement</h2>
            </Reveal>
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
        <section className="vault py-16" aria-label="People of this movement">
          <div className="container-page">
            <Reveal className="mb-8">
              <p className="eyebrow-vault mb-2">The people</p>
              <h2 className="font-display text-[1.9rem] font-semibold leading-tight text-paper-50 sm:text-[2.4rem]">Who carried this movement</h2>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((f, i) => (
                <FighterCard key={f.id} fighter={f} compact vault delay={(i % 6) * 60} />
              ))}
            </div>
            <Link to="/movements" className="mt-10 inline-block text-sm font-semibold text-brass-bright">
              ← All movements
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
