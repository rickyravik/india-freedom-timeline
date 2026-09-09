import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { eventById, placeById, routeBySlug } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { Breadcrumbs, Icon, SectionHeading, SourceList, SuggestCorrection, icons } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { GeographyFrame } from '@/components/places';
import { RouteMap } from '@/components/route-map';

export default function RoutePage() {
  const { slug } = useParams();
  const route = slug ? routeBySlug.get(slug) : undefined;
  const [current, setCurrent] = useState(0);
  usePageMeta(route?.title ?? 'Route', route?.summary, { type: 'article' });

  if (!route) return <Navigate to="/" replace />;

  const stop = route.stops[current];
  const place = stop.placeId ? placeById.get(stop.placeId) : undefined;
  const event = eventById.get(route.eventId);

  return (
    <article>
      <header className="container-page pt-2">
        <div className="vault animate-fade-up px-5 py-7 sm:px-9 sm:py-10">
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: route.title }]} />
          <h1 className="mt-3 max-w-3xl break-words text-h1 text-paper-50">{route.title}</h1>
          <p className="mt-3 max-w-2xl font-reading text-h4 italic text-paper-200">{route.question}</p>
          <p className="prose-reading-vault mt-4 max-w-prose">{route.summary}</p>
          <div className="mt-5">
            <GeographyFrame frame={route.frame} note={route.frameNote} vault />
          </div>
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <RouteMap route={route} current={current} onSelect={setCurrent} />
          <div className="flex items-center justify-between gap-3">
            <button type="button" className="btn-ghost !min-h-12 !px-5" onClick={() => setCurrent((i) => Math.max(0, i - 1))} disabled={current === 0}>
              <Icon d={icons.arrowLeft} className="h-4 w-4" />
              Previous stop
            </button>
            <button
              type="button"
              className="btn-seal !min-h-12 !px-5"
              onClick={() => setCurrent((i) => Math.min(route.stops.length - 1, i + 1))}
              disabled={current === route.stops.length - 1}
            >
              Next stop
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </button>
          </div>
          <div key={stop.id} className="doc p-6">
            <p className="label num mb-1">{stop.dateLabel}</p>
            <h2 className="text-h3 text-ink">{stop.name}</h2>
            {stop.approximate && <p className="stamp mt-2 w-fit text-oxide-deep">Approximate location</p>}
            <ReadingText paragraphs={[stop.note]} sources={route.sources} className="mt-4" />
            {place && (
              <Link to={`/places/${place.slug}`} className="mt-3 inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
                Open {place.name}
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <aside>
          <p className="label mb-3">The stops</p>
          <ol aria-label="Stops in order" className="space-y-2">
            {route.stops.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-current={i === current ? 'step' : undefined}
                  className="doc-interactive flex w-full items-baseline gap-3 p-3 text-left font-body text-meta"
                >
                  <span className="num font-display font-bold text-brass-deep">{i + 1}</span>
                  <span className="text-ink">{s.name}</span>
                  <span className="num ml-auto shrink-0 text-label text-ink-faint">{s.dateLabel}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="container-page space-y-8 pb-16">
        <section aria-label="Outcome">
          <SectionHeading title="Outcome" />
          <ReadingText paragraphs={route.outcome} sources={route.sources} className="max-w-prose" />
        </section>
        <div className="space-y-5">
          <SourceList sources={route.sources} />
          {route.editorial.status !== 'reviewed' && <DraftStamp />}
          <SuggestCorrection path={`/routes/${route.slug}`} recordTitle={route.title} />
          {event && (
            <Link to={`/events/${event.slug}`} className="inline-flex items-center gap-2 font-body text-meta font-medium text-oxide-deep">
              See the event: {event.title}
              <Icon d={icons.arrowRight} className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
