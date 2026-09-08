import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { TrailRef } from '@/types';
import { eventById, fighterById, movementById, trailBySlug, trails } from '@/lib/content';
import { usePageMeta, useTrailProgress, useUrlState } from '@/lib/hooks';
import { flag } from '@/lib/url-state';
import { markComplete, setStop } from '@/lib/trails-progress';
import { track } from '@/lib/analytics';
import { Breadcrumbs, Icon, PageIntro, Postmark, SectionHeading, SourceList, eraAccent, icons } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { ChoiceActivity, OrderActivity, TrailCard, TrailProgress } from '@/components/trails';
import { EventCard, FighterCard, MovementCard } from '@/components/cards';

const stopParams = { text: flag() };

/* `target`, not `ref`: React reserves the `ref` prop on function components. */
function RefCard({ target: r, compact = false }: { target: TrailRef; compact?: boolean }) {
  if (r.kind === 'fighter') {
    const f = fighterById.get(r.id);
    return f ? <FighterCard fighter={f} compact={compact} /> : null;
  }
  if (r.kind === 'event') {
    const e = eventById.get(r.id);
    return e ? <EventCard event={e} /> : null;
  }
  const m = movementById.get(r.id);
  return m ? <MovementCard movement={m} /> : null;
}

/* ------------------------------------------------------------------ */
export default function TrailsPage() {
  usePageMeta('Trails', 'Short guided journeys through the archive — a question, a handful of stops, and the evidence behind each one.');
  const progress = useTrailProgress();
  return (
    <div className="pb-20">
      <PageIntro title="Trails" lede="A trail is a short editorial journey: it starts with a question, moves through a few people, events and places with their sources beside them, and ends with something to think about. Stop and leave whenever you like — your place is kept on this device." />
      <div className="container-page">
        <SectionHeading title="All trails" />
      </div>
      <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trails.map((t) => (
          <TrailCard key={t.id} trail={t} progress={progress[t.slug]} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function TrailPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail?.title ?? 'Trail', trail?.question);
  const progress = useTrailProgress();
  if (!trail) return <Navigate to="/trails" replace />;
  const p = progress[trail.slug];
  const resume = p && !p.completed && p.stop > 0 ? p.stop : 1;
  return (
    <article>
      <header className="container-page pt-2">
        <div className={`perf-all on-sheet relative animate-fade-up px-5 py-7 sm:px-9 sm:py-10 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]} on-vault`}>
          <Postmark lines={['Trail', String(trail.stops.length), 'stops']} className="absolute right-4 top-5 hidden sm:grid" />
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title }]} />
          <p className={`stamp mt-5 w-fit ${eraAccent.onInkMuted[trail.accent]}`}>{trail.theme}</p>
          <h1 className="mt-3 max-w-3xl text-h1 sm:pr-28 sm:text-hero">{trail.title}</h1>
          <p className={`mt-4 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
          <p className={`num mt-5 font-body text-label ${eraAccent.onInkMuted[trail.accent]}`}>
            {trail.stops.length} stops · about {trail.minutes} minutes · a text-only version is available on every stop
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`/trails/${trail.slug}/stop/${resume}`} className="btn-seal" onClick={() => track('trail_started', { trail: trail.slug })}>
              {resume > 1 ? `Resume at stop ${resume}` : 'Start the trail'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
            {trail.editorial.status !== 'reviewed' && <DraftStamp vault />}
          </div>
        </div>
      </header>
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_320px]">
        <div className="max-w-prose space-y-6">
          <p className="prose-reading dropcap">{trail.intro}</p>
          <div className="doc p-5">
            <p className="label mb-1">What you will be able to do</p>
            <p className="font-body text-meta text-ink">{trail.learningGoal}</p>
          </div>
        </div>
        <aside>
          <p className="label mb-3">The stops</p>
          <ol className="space-y-2">
            {trail.stops.map((s, i) => (
              <li key={s.id}>
                <Link to={`/trails/${trail.slug}/stop/${i + 1}`} className="doc-interactive flex items-baseline gap-3 p-3 font-body text-meta">
                  <span className="num font-display font-bold text-brass-deep">{i + 1}</span>
                  <span className="text-ink">{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailStopPage() {
  const { slug, n } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  const index = Number(n) - 1;
  const stop = trail && Number.isInteger(index) && index >= 0 && index < trail.stops.length ? trail.stops[index] : undefined;
  const [{ text: textOnly }, setParams] = useUrlState(stopParams);
  usePageMeta(stop && trail ? `${stop.title} — ${trail.title}` : 'Trail', stop?.question ?? trail?.question);

  useEffect(() => {
    if (!trail || !stop) return;
    setStop(trail.slug, index + 1);
    track('trail_stop_viewed', { trail: trail.slug, stop: index + 1 });
  }, [trail, stop, index]);

  const focusEraAccent = useMemo(() => trail?.accent ?? 'brass', [trail]);
  if (!trail) return <Navigate to="/trails" replace />;
  if (!stop) return <Navigate to={`/trails/${trail.slug}`} replace />;

  const total = trail.stops.length;
  const prev = index > 0 ? `/trails/${trail.slug}/stop/${index}` : `/trails/${trail.slug}`;
  const next = index + 1 < total ? `/trails/${trail.slug}/stop/${index + 2}` : `/trails/${trail.slug}/finish`;

  return (
    <article>
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: `Stop ${index + 1}` }]} />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <TrailProgress current={index + 1} total={total} />
          <button type="button" className={`chip min-h-10 ${textOnly ? 'chip-active' : ''}`} aria-pressed={textOnly} onClick={() => setParams({ text: !textOnly })}>
            Text only
          </button>
        </div>
        <div className={`perf-all on-sheet relative mt-5 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[focusEraAccent]} ${eraAccent.onInk[focusEraAccent]}`}>
          <p className={`stamp w-fit ${eraAccent.onInkMuted[focusEraAccent]}`}>{trail.title}</p>
          <h1 className="mt-3 text-h1">{stop.title}</h1>
          {stop.question && <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[focusEraAccent]}`}>{stop.question}</p>}
        </div>
      </header>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          {stop.contentNote && (
            <p role="note" className="rounded-sm border border-paper-400 bg-paper-200/60 p-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-sepia">Content note</span>
              {stop.contentNote}
            </p>
          )}
          <ReadingText paragraphs={stop.text} sources={stop.sources} className="max-w-prose" />
          {stop.uncertainty && (
            <p role="note" aria-label="Uncertainty" className="max-w-prose border-l-2 border-oxide pl-4 font-body text-meta text-ink-soft">
              <span className="stamp mr-2 text-oxide-deep">Uncertain</span>
              {stop.uncertainty}
            </p>
          )}
          {stop.bridge && <p className="max-w-prose font-reading text-reading italic text-ink-soft">{stop.bridge}</p>}
          <SourceList sources={stop.sources} />
          <nav aria-label="Trail navigation" className="flex items-center justify-between gap-3 border-t border-paper-300 pt-6">
            <Link to={prev} className="btn-ghost !min-h-12">
              <Icon d={icons.arrowLeft} className="h-4 w-4" />
              {index > 0 ? 'Previous stop' : 'Overview'}
            </Link>
            <Link to={next} className="btn-seal !min-h-12">
              {index + 1 < total ? 'Next stop' : 'Finish'}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
          </nav>
        </div>
        {!textOnly && (
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <p className="label">Open the full story</p>
            <RefCard target={stop.focus} />
            {stop.also?.map((r) => (
              <RefCard key={`${r.kind}-${r.id}`} target={r} compact />
            ))}
          </aside>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
export function TrailFinishPage() {
  const { slug } = useParams();
  const trail = slug ? trailBySlug.get(slug) : undefined;
  usePageMeta(trail ? `Finish — ${trail.title}` : 'Trail');
  const progress = useTrailProgress();
  if (!trail) return <Navigate to="/trails" replace />;
  const done = progress[trail.slug]?.completed ?? false;
  const finish = () => {
    if (!done) {
      markComplete(trail.slug);
      track('trail_completed', { trail: trail.slug });
    }
  };
  return (
    <article className="pb-20">
      <header className="container-page pt-2">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Trails', to: '/trails' }, { label: trail.title, to: `/trails/${trail.slug}` }, { label: 'Finish' }]} />
        <div className={`perf-all on-sheet relative mt-4 px-5 py-7 sm:px-9 sm:py-9 ${eraAccent.bg[trail.accent]} ${eraAccent.onInk[trail.accent]}`}>
          {done && <Postmark lines={['Trail', 'complete']} className="absolute right-4 top-5 hidden sm:grid" />}
          <h1 className="text-h1 sm:pr-28">{done ? 'Trail complete' : 'The end of the trail'}</h1>
          <p className={`mt-3 max-w-2xl font-reading text-h4 italic ${eraAccent.onInkMuted[trail.accent]}`}>{trail.question}</p>
        </div>
      </header>
      <div className="container-page max-w-3xl space-y-10 py-10">
        <section aria-label="Reflection" className="doc p-6">
          <p className="label mb-2">Something to think about</p>
          <p className="prose-reading">{trail.reflection}</p>
          <p className="mt-3 font-body text-label text-ink-faint">Talk it over, or keep it to yourself — nothing you think here is collected.</p>
        </section>
        <section aria-label="Knowledge check">
          <p className="label mb-3">One question, no score</p>
          {trail.activity.kind === 'choice' ? <ChoiceActivity activity={trail.activity} onDone={finish} /> : <OrderActivity activity={trail.activity} onDone={finish} />}
        </section>
        {done && (
          <section aria-label="Next" className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-indigo-mid/25 bg-indigo-wash/60 p-6">
            <p className="font-display text-h3 text-indigo-deep">Completed. Where next?</p>
            <div className="flex flex-wrap gap-2">
              <Link to={trail.followOn.to} className="btn-seal">
                {trail.followOn.label}
              </Link>
              <Link to={`/trails/${trail.slug}/stop/1`} className="btn-ghost">
                Read again
              </Link>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
