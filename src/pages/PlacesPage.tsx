import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { eventById, fighterById, placeBySlug, placeKindLabels, places } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { Breadcrumbs, PageIntro, SectionHeading, SourceList, SuggestCorrection } from '@/components/ui';
import { DraftStamp, ReadingText } from '@/components/reading';
import { EventRow, FighterCard } from '@/components/cards';
import { PlaceCard } from '@/components/places';

export default function PlacesPage() {
  usePageMeta('Places', 'Places are given by their present-day state; historical names appear where they differ.');
  const byState = useMemo(() => {
    const groups = new Map<string, typeof places>();
    for (const p of places) groups.set(p.state, [...(groups.get(p.state) ?? []), p]);
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);
  return (
    <div className="pb-20">
      <PageIntro title="Places of the Struggle" lede="Places are given by their present-day state; historical names appear where they differ." />
      <div className="container-page space-y-12">
        {byState.map(([state, statePlaces]) => (
          <section key={state} aria-label={state}>
            <SectionHeading title={state} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {statePlaces.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function PlacePage() {
  const { slug } = useParams();
  const place = slug ? placeBySlug.get(slug) : undefined;
  usePageMeta(place?.name ?? 'Place', place?.summary, { type: 'article' });
  const people = useMemo(() => (place ? place.people.map((id) => fighterById.get(id)).filter((f) => f !== undefined) : []), [place]);
  const relatedEvents = useMemo(() => (place ? place.events.map((id) => eventById.get(id)).filter((e) => e !== undefined) : []), [place]);

  if (!place) return <Navigate to="/places" replace />;

  return (
    <article>
      <header className="container-page pt-2">
        <div className="vault animate-fade-up px-5 py-7 sm:px-9 sm:py-10">
          <Breadcrumbs vault items={[{ label: 'Home', to: '/' }, { label: 'Places', to: '/places' }, { label: place.name }]} />
          <p className="stamp mt-5 w-fit text-brass-bright">{placeKindLabels[place.kind]}</p>
          <h1 className="mt-3 max-w-3xl break-words text-h1 text-paper-50">{place.name}</h1>
          {place.historicalNames && place.historicalNames.length > 0 && <p className="mt-2 font-reading text-reading italic text-paper-200">{place.historicalNames.join(' · ')}</p>}
          <p className="label-vault num mt-3">
            in present-day {place.state}
            {place.dates ? ` · ${place.dates}` : ''}
          </p>
        </div>
      </header>

      <div className="container-page space-y-14 py-14 sm:space-y-20 sm:py-16">
        <section aria-label="About this place">
          <ReadingText paragraphs={place.description} sources={place.sources} dropcap className="max-w-prose" />
        </section>

        {relatedEvents.length > 0 && (
          <section aria-label="Events here">
            <SectionHeading title="Events here" />
            <div className="space-y-3">
              {relatedEvents.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        <div className="space-y-5">
          <SourceList sources={place.sources} />
          {place.editorial.status !== 'reviewed' && <DraftStamp />}
          <SuggestCorrection path={`/places/${place.slug}`} recordTitle={place.name} />
        </div>
      </div>

      {people.length > 0 && (
        <section className="vault px-5 py-12 sm:px-8 sm:py-16" aria-label="People here">
          <div className="container-page">
            <SectionHeading title="People here" vault />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((f, i) => (
                <FighterCard key={f.id} fighter={f} compact vault delay={(i % 6) * 60} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
