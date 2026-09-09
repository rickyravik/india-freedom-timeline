import { Link } from 'react-router-dom';
import type { Place } from '@/types';
import { placeKindLabels } from '@/lib/content';
import { Icon, icons } from '@/components/ui';

/* ------------------------------------------------------------------ */
/* Place chip — a compact link, used wherever a place is one of several */
export function PlaceChip({ place }: { place: Place }) {
  return (
    <Link to={`/places/${place.slug}`} className="chip">
      {place.name}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Place card — the index's own record                                 */
export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link to={`/places/${place.slug}`} className="doc-interactive group flex h-full flex-col rounded-sm border p-5 transition-colors duration-160 ease-cinematic">
      <span className="stamp w-fit text-sepia">{placeKindLabels[place.kind]}</span>
      <p className="mt-2 font-display text-h3 font-bold leading-tight text-ink transition-colors duration-160 group-hover:text-oxide-deep">{place.name}</p>
      {place.dates && <p className="num mt-1.5 label">{place.dates}</p>}
      <p className="mt-3 line-clamp-3 font-body text-meta text-ink-soft">{place.summary}</p>
      <Icon d={icons.arrowRight} className="mt-auto h-4 w-4 shrink-0 text-brass-deep" />
    </Link>
  );
}
