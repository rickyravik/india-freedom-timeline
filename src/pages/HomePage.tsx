import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { anniversariesOnDay, dailyPick, eras, events, eventsOnDay, fighterBySlug, fighters, movements, randomPick } from '@/lib/content';
import { didYouKnowFacts } from '@/data/facts';
import { regionNames } from '@/data/regions';
import type { RegionId } from '@/types';
import { usePageMeta, useTrail } from '@/lib/hooks';
import { FactCard, Reveal, SectionHeading, eraAccent } from '@/components/ui';
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
    <section className="vault">
      {/* Ghosted span numerals drift with scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 select-none overflow-hidden">
        <p className="drift-on-scroll whitespace-nowrap text-center font-display font-black italic leading-none text-paper-50/[0.045]" style={{ fontSize: "clamp(3.4rem, 15.5vw, 14rem)", letterSpacing: "-0.04em" }}>1757 — 1947</p>
      </div>

      <div className="container-page relative pb-16 pt-32 sm:pb-24 sm:pt-40">
        <p className="eyebrow-vault mb-5 animate-fade-up">An interactive historical archive · 1757 — 1947</p>
        <h1 className="max-w-4xl text-display font-black text-paper-50 animate-fade-up" style={{ animationDelay: '90ms' }}>
          Millions resisted.
          <br />
          <span className="italic font-medium text-brass-bright" style={{ fontVariationSettings: '"SOFT" 60' }}>
            Thousands sacrificed.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper-300 animate-fade-up sm:text-xl" style={{ animationDelay: '180ms' }}>
          Explore the people who fought for India’s freedom — from the first risings against the East India Company to the midnight of 15 August 1947.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '270ms' }}>
          <Link to="/timeline" className="btn-seal">
            Enter the timeline <span aria-hidden="true">→</span>
          </Link>
          <button type="button" onClick={discoverRandom} disabled={busy} className="btn-ghost-vault">
            <span aria-hidden="true">✦</span> Discover someone new
          </button>
        </div>

        {/* Era rail preview */}
        <div className="mt-16 animate-fade-up sm:mt-20" style={{ animationDelay: '380ms' }}>
          <p className="eyebrow-vault mb-4">Nine chapters</p>
          <div className="-mx-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:px-0">
            <ol className="flex min-w-max items-stretch" aria-label="Eras of the freedom struggle">
              {eras.map((era, i) => (
                <li key={era.id} className="relative w-40 sm:w-48">
                  <div className="flex items-center">
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ring-4 ring-vault ${eraAccent.bg[era.accent]}`} />
                    {i < eras.length - 1 && <span aria-hidden="true" className="h-px flex-1 bg-paper-100/15" />}
                  </div>
                  <Link to={`/timeline#era-${era.id}`} className="group mt-3 block pr-5">
                    <span className={`block font-display text-2xl font-bold leading-none ${eraAccent.textVault[era.accent]}`}>{era.startYear}</span>
                    <span className="mt-1.5 block font-display text-[15px] font-semibold leading-tight text-paper-100 transition-colors group-hover:text-brass-bright">
                      {era.name}
                    </span>
                    <span className="mt-1 block text-xs italic text-paper-400">{era.tagline}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
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
  const dateLabel = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

  return (
    <Reveal as="section" aria-label="Today in freedom history" className="doc overflow-hidden">
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col justify-between border-b border-dotted border-paper-400 bg-paper-200/60 p-5 sm:border-b-0 sm:border-r">
          <p className="eyebrow">Today in freedom history</p>
          <p className="mt-3 font-display text-[2.2rem] font-bold leading-none text-oxide">{dateLabel.split(' ')[0]}</p>
          <p className="font-display text-lg font-semibold text-ink">{dateLabel.split(' ').slice(1).join(' ')}</p>
        </div>
        <div className="p-5 sm:p-6">
          {hasContent ? (
            <ul className="space-y-4">
              {todaysEvents.map((e) => (
                <li key={e.id} className="ledger-row flex-col items-start gap-1 border-0 py-0">
                  <Link to={`/events/${e.slug}`} className="group">
                    <span className="font-display text-base font-bold text-oxide">{e.date.year}</span>
                    <span className="ml-2 font-display text-lg font-semibold text-ink group-hover:text-oxide">{e.title}</span>
                  </Link>
                  <p className="text-sm leading-relaxed text-ink-soft">{e.summary}</p>
                </li>
              ))}
              {anniversaries.map(({ fighter, kind }) => (
                <li key={`${fighter.id}-${kind}`}>
                  <Link to={`/fighters/${fighter.slug}`} className="group">
                    <span className="font-display text-lg font-semibold text-ink group-hover:text-oxide">{fighter.name}</span>
                    <span className="ml-2 text-sm text-ink-soft">
                      {kind === 'born' ? 'was born' : 'died'} on this day{kind === 'born' ? (fighter.birthYear ? ` in ${fighter.birthYear}` : '') : fighter.deathYear ? ` in ${fighter.deathYear}` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="text-sm text-ink-faint">No dated record for today. Meet today’s featured life instead:</p>
              <Link to={`/fighters/${fallback.slug}`} className="group mt-2 block">
                <span className="font-display text-xl font-semibold text-ink group-hover:text-oxide">{fallback.name} →</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{fallback.summary}</span>
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
      <div className="container-page space-y-16 pt-12 sm:space-y-24 sm:pt-16">
        <TodayLedger />

        {trailFighters.length > 0 && (
          <Reveal as="section" aria-label="Continue your journey" className="rounded-lg border border-indigo-mid/25 bg-indigo-wash/60 p-5">
            <p className="eyebrow mb-3">Continue your journey</p>
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
            eyebrow="Begin with a life"
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
      <section className="vault mt-16 py-16 sm:mt-24 sm:py-24" aria-label="Forgotten heroes">
        <div className="container-page">
          <SectionHeading
            vault
            eyebrow="Names history nearly lost"
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

      <div className="container-page space-y-16 pt-16 sm:space-y-24 sm:pt-24">
        {/* Women */}
        <section aria-label="Women of the freedom movement">
          <SectionHeading
            eyebrow="Half the sky, half the struggle"
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
            eyebrow="Moments that turned the tide"
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
                  <Link to={fact.relatedLink.to} className="text-sm font-semibold text-oxide underline decoration-oxide/40 underline-offset-4 hover:decoration-oxide">
                    {fact.relatedLink.label} →
                  </Link>
                )
              }
            />
          ))}
        </section>
      </div>

      {/* Movements — dark band */}
      <section className="vault mt-16 py-16 sm:mt-24 sm:py-24" aria-label="Movements and regional resistance">
        <div className="container-page">
          <SectionHeading
            vault
            eyebrow="Many roads to freedom"
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

          <div className="hairline-vault my-14" />

          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow-vault mb-2">Every region resisted</p>
              <h2 className="font-display text-[1.9rem] font-semibold leading-tight text-paper-50 sm:text-[2.4rem]">Explore by state & region</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(regionNames) as RegionId[]).map((r) => (
                <Link key={r} to={`/fighters?region=${r}`} className="chip-vault min-h-10">
                  {regionNames[r]}
                </Link>
              ))}
              <Link to="/map" className="btn-seal !min-h-10 !px-4 text-xs">
                Open the map →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
