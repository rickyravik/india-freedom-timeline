import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { anniversariesOnDay, dailyPick, dailyShuffle, eraById, eras, eventsOnDay, fighterBySlug, fighters, lifespan, states, trails } from '@/lib/content';
import { regionNames } from '@/data/regions';
import type { RegionId } from '@/types';
import { readingTimeLabel } from '@/lib/reading';
import { usePageMeta, useTrail, useTrailProgress } from '@/lib/hooks';
import { Icon, PortraitMedallion, Postmark, Reveal, SectionHeading, eraAccent, icons } from '@/components/ui';
import { FighterChip } from '@/components/cards';
import { TrailCard } from '@/components/trails';

/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="container-page pt-2" aria-label="India's Freedom Timeline">
      {/* First-day pane */}
      <div className="vault animate-fade-up px-5 py-5 sm:px-9 sm:py-10">
        {/* The cancellation falls across the dateline rule, as it would on a cover */}
        <Postmark lines={['India', 'Post', '15 · 08 · 47']} className="absolute right-4 top-5 hidden sm:grid" />

        <div className="num border-b border-paper-100/35 pb-2.5 pr-0 font-body text-label text-paper-200 sm:pr-32">
          First day of issue · an archive of India’s freedom struggle ·{' '}
          <span className="font-display text-base font-bold text-brass-bright">1757 — 1947</span>
        </div>

        <h1 className="mt-5 max-w-3xl break-words text-hero-sm font-medium text-paper-50 sm:mt-10 sm:text-hero">
          Millions resisted.
          <span className="mt-1 block text-brass-bright">Thousands sacrificed.</span>
        </h1>
        <p className="mt-4 max-w-xl font-reading text-reading text-paper-200 sm:mt-6 sm:text-h4">
          Discover the people who resisted British rule — from the first risings against the East India Company to the midnight of 15 August 1947 — especially the lives most of us were never taught.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <Link to="/start" className="btn-seal">
            Start exploring <Icon d={icons.arrowRight} className="h-4 w-4" />
          </Link>
          <Link to="/fighters" className="btn-ghost-vault">
            Meet the people
          </Link>
          <Link to="/map" className="btn-ghost-vault">
            Explore by place
          </Link>
        </div>
        <p className="num mt-5 border-t border-paper-100/25 pt-2.5 font-body text-label text-paper-300 sm:mt-7 sm:pt-3">
          {fighters.length} lives · {eras.length} chapters
        </p>
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
    <Reveal as="section" aria-label="Today" className="doc overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col justify-between border-b border-paper-400 bg-paper-200/60 p-5 sm:border-b-0 sm:border-r">
          <p className="label">{hasContent ? 'Today in freedom history' : 'Today’s featured story'}</p>
          <p className="num mt-3 font-display text-h1 font-bold leading-none text-oxide">{dayLabel}</p>
          <p className="font-display text-lg font-bold text-ink">{monthLabel}</p>
        </div>
        <div className="p-5 sm:p-6">
          {hasContent ? (
            <ul className="space-y-4">
              {todaysEvents.map((e) => (
                <li key={e.id}>
                  <Link to={`/events/${e.slug}`} className="group">
                    <span className="num font-display text-base font-bold text-oxide-deep">{e.date.year}</span>
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
              <Link to={`/fighters/${fallback.slug}`} className="group block">
                <span className="inline-flex items-center gap-2 font-display text-h3 font-bold text-ink group-hover:text-oxide">
                  {fallback.name}
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </span>
                <span className="mt-1 block font-body text-meta text-ink-soft">{fallback.summary}</span>
              </Link>
              <p className="mt-3 font-body text-label text-ink-faint">A different life each day. Dated anniversaries appear here when the collection holds one.</p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
function StateSelect() {
  const navigate = useNavigate();
  return (
    <select
      className="min-h-11 w-full rounded-sm border border-paper-100/30 bg-vault-soft px-3 font-body text-meta text-paper-100"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) navigate(`/map?state=${e.target.value}`);
      }}
    >
      <option value="" disabled>
        Choose a state
      </option>
      {states.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------ */
export default function HomePage() {
  usePageMeta('', "Millions resisted. Thousands sacrificed. Discover the people who fought for India's freedom, 1757 to 1947 — with the evidence beside every story.");
  const trail = useTrail();
  const progress = useTrailProgress();
  const featured = useMemo(() => dailyPick(fighters.filter((f) => f.featured), 1), []);
  const beyond = useMemo(() => dailyShuffle(fighters.filter((f) => f.forgotten), 2).slice(0, 6), []);
  const trailFighters = trail.map((s) => fighterBySlug.get(s)).filter(Boolean).slice(0, 4);

  return (
    <div>
      <Hero />
      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        <section aria-label="Featured story">
          <SectionHeading title="Featured story" />
          <Link to={`/fighters/${featured.slug}`} className="doc-interactive group grid grid-cols-1 gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <PortraitMedallion name={featured.name} era={eraById.get(featured.era)} portrait={featured.portrait} size="xl" />
            <div className="min-w-0">
              <p className="font-display text-h2 text-ink group-hover:text-oxide">{featured.name}</p>
              <p className="num mt-1 label">
                {lifespan(featured)} · {featured.states[0]} · {readingTimeLabel(featured.readingMinutes)}
              </p>
              <p className="prose-reading mt-4 max-w-prose">{featured.inAMinute?.[0] ?? featured.summary}</p>
              <p className="mt-4 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
                Open the story <Icon d={icons.arrowRight} className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </section>

        <section aria-label="Guided trails">
          <SectionHeading title="Guided trails" lede="Short journeys with a question at the start and the evidence at every stop." action={<Link to="/trails" className="btn-ghost">All trails</Link>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trails.map((t) => (
              <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
            ))}
          </div>
        </section>

        <section aria-label="Stories beyond the familiar names">
          <SectionHeading title="Stories beyond the familiar names" lede="Weavers, schoolteachers, hill chiefs and queens whose records deserve to be read." action={<Link to="/fighters?collection=forgotten" className="btn-ghost">More</Link>} />
          <div className="flex flex-wrap gap-2">
            {beyond.map((f) => (
              <FighterChip key={f.id} fighter={f} />
            ))}
          </div>
        </section>

        <section aria-label="Browse by chapter">
          <SectionHeading title="Browse by chapter" lede="Nine chapters, 1757–1947. Boundaries are aids to navigation, not hard breaks in history." />
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
        </section>
      </div>

      <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Explore by region">
        <div className="container-page">
          <SectionHeading
            vault
            title="Explore by state and region"
            lede="Choose a place you know. Tiles on the map show present-day states, not historical boundaries."
            action={
              <Link to="/map" className="btn-seal !min-h-10 !px-4 text-label">
                Open the map <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            }
          />
          <div className="flex flex-wrap gap-2">
            {(Object.keys(regionNames) as RegionId[]).map((r) => (
              <Link key={r} to={`/fighters?region=${r}`} className="chip-vault min-h-10">
                {regionNames[r]}
              </Link>
            ))}
          </div>
          <label className="mt-6 block max-w-sm">
            <span className="label-vault mb-1.5 block">Or pick a state</span>
            <StateSelect />
          </label>
        </div>
      </section>

      <div className="container-page space-y-14 pt-14 sm:space-y-20 sm:pt-16">
        <TodayLedger />
        {trailFighters.length > 0 && (
          <Reveal as="section" aria-label="Continue your journey" className="rounded-sm border border-indigo-mid/30 bg-indigo-wash/60 p-5">
            <p className="label mb-3">Continue your journey</p>
            <div className="flex flex-wrap gap-2">
              {trailFighters.map((f) => (
                <FighterChip key={f!.id} fighter={f!} />
              ))}
            </div>
          </Reveal>
        )}
        <section aria-label="Sources and corrections" className="doc p-6">
          <div className="rule mb-4" />
          <h2 className="text-h3 text-ink">Held carefully</h2>
          <p className="prose-reading mt-3 max-w-prose">Every biography and event cites its sources, claim by claim. Where historians dispute something, the page says so. If you find an error, you can suggest a correction from any record, and an editor will check it against the sources.</p>
          <Link to="/about" className="mt-4 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
            How this archive is built <Icon d={icons.arrowRight} className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
