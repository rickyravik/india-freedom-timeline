import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { anniversariesOnDay, dailyPick, eras, events, eventsOnDay, fighterBySlug, fighters, movements, randomPick } from '@/lib/content';
import { didYouKnowFacts } from '@/data/facts';
import { regionNames } from '@/data/regions';
import type { RegionId } from '@/types';
import { usePageMeta, useTrail } from '@/lib/hooks';
import { FactCard, Icon, Postmark, Reveal, SectionHeading, eraAccent, icons } from '@/components/ui';
import { EventCard, FighterCard, FighterFeature, MovementCard } from '@/components/cards';

/* ------------------------------------------------------------------ */
function Hero() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const discoverRandom = () => {
    setBusy(true);
    setTimeout(() => navigate(`/fighters/${randomPick(fighters).slug}`), 120);
  };

  return (
    <section className="container-page pt-2" aria-label="India's Freedom Timeline">
      {/* First-day pane */}
      <div className="vault animate-fade-up px-5 py-7 sm:px-9 sm:py-10">
        {/* The cancellation falls across the dateline rule, as it would on a cover */}
        <Postmark lines={['India', 'Post', '15 · 08 · 47']} className="absolute right-4 top-5 hidden sm:grid" />

        <div className="num border-b border-paper-100/35 pb-2.5 pr-0 font-body text-label text-paper-200 sm:pr-32">
          First day of issue · an archive of India’s freedom struggle ·{' '}
          <span className="font-display text-base font-bold text-brass-bright">1757 — 1947</span>
        </div>

        <h1 className="mt-8 max-w-3xl text-hero-sm font-medium text-paper-50 sm:mt-10 sm:text-hero">
          Millions resisted.
          <span className="mt-1 block text-brass-bright">Thousands sacrificed.</span>
        </h1>
        <p className="mt-6 max-w-xl font-reading text-reading text-paper-200 sm:text-h4">
          Explore the people who fought for India’s freedom — from the first risings against the East India Company to the midnight of 15 August 1947.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/timeline" className="btn-seal">
            Enter the timeline <Icon d={icons.arrowRight} className="h-4 w-4" />
          </Link>
          <button type="button" onClick={discoverRandom} disabled={busy} className="btn-ghost-vault">
            <Icon d={icons.shuffle} className="h-4 w-4" /> Discover someone new
          </button>
        </div>
        <p className="num mt-7 border-t border-paper-100/25 pt-3 font-body text-label text-paper-300">
          {fighters.length} lives · {events.length} events · {eras.length} chapters
        </p>
      </div>

      {/* Denomination strip — one ink per chapter, with paper selvedge between */}
      <div className="mt-3 animate-fade-up sm:mt-4" style={{ animationDelay: '120ms' }}>
        <h2 className="sr-only">The nine chapters</h2>
        <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-9" aria-label="Eras of the freedom struggle">
          {eras.map((era) => (
            <li key={era.id}>
              <Link
                to={`/timeline#era-${era.id}`}
                className={`perf-x on-sheet block h-full px-3 py-3.5 transition-opacity duration-160 ease-cinematic hover:opacity-90 ${eraAccent.bg[era.accent]} ${eraAccent.onInk[era.accent]}`}
              >
                <span className="denom block">{era.startYear}</span>
                <span className="mt-1.5 block font-body text-label font-semibold leading-tight">{era.name}</span>
                <span className={`mt-1 block font-reading text-label italic leading-snug lg:hidden ${eraAccent.onInkMuted[era.accent]}`}>{era.tagline}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function TodayLedger() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todaysEvents = eventsOnDay(month, day);
  const anniversaries = anniversariesOnDay(month, day);
  const hasContent = todaysEvents.length > 0 || anniversaries.length > 0;
  const fallback = dailyPick(fighters, 7);
  const dayLabel = today.toLocaleDateString('en-IN', { day: 'numeric' });
  const monthLabel = today.toLocaleDateString('en-IN', { month: 'long' });

  return (
    <Reveal as="section" aria-label="Today in freedom history" className="doc overflow-hidden">
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col justify-between border-b border-paper-400 bg-paper-200/60 p-5 sm:border-b-0 sm:border-r">
          <p className="label">Today in freedom history</p>
          <p className="num mt-3 font-display text-h1 font-bold leading-none text-oxide">{dayLabel}</p>
          <p className="font-display text-lg font-bold text-ink">{monthLabel}</p>
        </div>
        <div className="p-5 sm:p-6">
          {hasContent ? (
            <ul className="space-y-4">
              {todaysEvents.map((e) => (
                <li key={e.id}>
                  <Link to={`/events/${e.slug}`} className="group">
                    <span className="num font-display text-base font-bold text-oxide">{e.date.year}</span>
                    <span className="ml-2 font-display text-lg font-bold text-ink group-hover:text-oxide">{e.title}</span>
                  </Link>
                  <p className="mt-1 font-body text-meta text-ink-soft">{e.summary}</p>
                </li>
              ))}
              {anniversaries.map(({ fighter, kind }) => (
                <li key={`${fighter.id}-${kind}`}>
                  <Link to={`/fighters/${fighter.slug}`} className="group">
                    <span className="font-display text-lg font-bold text-ink group-hover:text-oxide">{fighter.name}</span>
                    <span className="num ml-2 font-body text-meta text-ink-soft">
                      {kind === 'born' ? 'was born' : 'died'} on this day{kind === 'born' ? (fighter.birthYear ? ` in ${fighter.birthYear}` : '') : fighter.deathYear ? ` in ${fighter.deathYear}` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="font-body text-meta text-ink-faint">No dated record for today. Meet today’s featured life instead:</p>
              <Link to={`/fighters/${fallback.slug}`} className="group mt-2 block">
                <span className="inline-flex items-center gap-2 font-display text-h3 font-bold text-ink group-hover:text-oxide">
                  {fallback.name}
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </span>
                <span className="mt-1 block font-body text-meta text-ink-soft">{fallback.summary}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
export default function HomePage() {
  usePageMeta('', "Millions resisted. Thousands sacrificed. Explore the people who fought for India's freedom — an immersive interactive timeline from 1757 to 1947.");

  const trail = useTrail();
  const featured = useMemo(() => fighters.filter((f) => f.featured).sort(() => 0.5 - Math.random()).slice(0, 5), []);
  const forgotten = useMemo(() => fighters.filter((f) => f.forgotten).sort(() => 0.5 - Math.random()).slice(0, 4), []);
  const women = useMemo(() => fighters.filter((f) => f.gender === 'female').sort(() => 0.5 - Math.random()).slice(0, 4), []);
  const keyEvents = useMemo(() => events.filter((e) => e.featured).slice(0, 6), []);
  const facts = useMemo(() => [dailyPick(didYouKnowFacts), dailyPick(didYouKnowFacts, 5)], []);
  const featuredMovements = useMemo(() => movements.filter((m) => ['revolutionary-movement', 'tribal-resistance', 'azad-hind', 'early-uprisings'].includes(m.id)), []);
  const trailFighters = trail.map((s) => fighterBySlug.get(s)).filter(Boolean).slice(0, 4);

  return (
    <div>
      <Hero />

      {/* Ledger + featured */}
      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        <TodayLedger />

        {trailFighters.length > 0 && (
          <Reveal as="section" aria-label="Continue your journey" className="rounded-sm border border-indigo-mid/30 bg-indigo-wash/60 p-5">
            <p className="label mb-3">Continue your journey</p>
            <div className="flex flex-wrap gap-2">
              {trailFighters.map((f) => (
                <Link key={f!.id} to={`/fighters/${f!.slug}`} className="chip min-h-10">
                  {f!.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <section aria-label="Featured freedom fighters">
          <SectionHeading
            title="Featured freedom fighters"
            lede="Each life opens on to others — comrades, rivals, inheritors. Start anywhere."
            action={
              <Link to="/fighters" className="btn-ghost">
                All {fighters.length} people
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            {featured[0] && <FighterFeature fighter={featured[0]} />}
            <div className="grid gap-3">
              {featured.slice(1, 5).map((f, i) => (
                <FighterCard key={f.id} fighter={f} compact delay={i * 70} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Forgotten heroes — dark band */}
      <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Forgotten heroes">
        <div className="container-page">
          <SectionHeading
            vault
            title="Forgotten heroes"
            lede="Schoolteachers, weavers, hill chiefs and queens who held the line long before the famous names — and whose stories deserve to be told."
            action={
              <Link to="/fighters?collection=forgotten" className="btn-ghost-vault">
                More forgotten heroes
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {forgotten.map((f, i) => (
              <FighterCard key={f.id} fighter={f} compact vault delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        {/* Women */}
        <section aria-label="Women of the freedom movement">
          <SectionHeading
            title="Women of the movement"
            lede="From Velu Nachiyar’s army in the 1780s to the Rani of Jhansi Regiment of 1943."
            action={
              <Link to="/fighters?collection=women" className="btn-ghost">
                All women
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {women.map((f, i) => (
              <FighterCard key={f.id} fighter={f} compact delay={i * 70} />
            ))}
          </div>
        </section>

        {/* Key events — filmstrip */}
        <section aria-label="Key historical events">
          <SectionHeading
            title="Key historical events"
            action={
              <Link to="/events" className="btn-ghost">
                All events
              </Link>
            }
          />
          <div className="-mx-4 flex snap-x-mandatory gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {keyEvents.map((e, i) => (
              <div key={e.id} className="w-[84vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none">
                <EventCard event={e} delay={i * 60} />
              </div>
            ))}
          </div>
        </section>

        {/* Facts */}
        <section aria-label="Did you know" className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact, i) => (
            <FactCard
              key={fact.id}
              index={i}
              text={fact.text}
              action={
                fact.relatedLink && (
                  <Link to={fact.relatedLink.to} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide underline decoration-oxide/40 underline-offset-4 hover:decoration-oxide">
                    {fact.relatedLink.label}
                    <Icon d={icons.arrowRight} className="h-4 w-4" />
                  </Link>
                )
              }
            />
          ))}
        </section>
      </div>

      {/* Movements — dark band */}
      <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Movements and regional resistance">
        <div className="container-page">
          <SectionHeading
            vault
            title="Movements & regional resistance"
            lede="Petition and boycott, satyagraha and armed revolt, Adivasi risings and soldiers’ armies — arguing with, and strengthening, one another."
            action={
              <Link to="/movements" className="btn-ghost-vault">
                All movements
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMovements.map((m, i) => (
              <MovementCard key={m.id} movement={m} vault delay={i * 70} />
            ))}
          </div>

          <div className="rule-double-vault my-14" />

          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-h2 text-paper-50">Explore by state & region</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(regionNames) as RegionId[]).map((r) => (
                <Link key={r} to={`/fighters?region=${r}`} className="chip-vault min-h-10">
                  {regionNames[r]}
                </Link>
              ))}
              <Link to="/map" className="btn-seal !min-h-10 !px-4 text-label">
                Open the map
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
