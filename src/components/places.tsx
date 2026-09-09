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
/* The Frame Rule — every map, route or boundary states whether it shows
   present-day or dated historical geography. Modern borders are never
   presented as the political geography of 1857 or 1947. */
export function GeographyFrame({ frame, note, vault = false }: { frame: 'present-day' | 'historical'; note?: string; vault?: boolean }) {
  return (
    <p role="note" className={`font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
      <span className={`stamp mr-2 ${vault ? 'text-brass-bright' : 'text-sepia'}`}>{frame === 'present-day' ? 'Present-day geography' : 'Historical boundaries'}</span>
      {note ?? (frame === 'present-day' ? 'Tiles and names show today’s states, not the political map of the period. A dated historical-boundary view needs reviewed datasets and is not yet available.' : '')}
    </p>
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
