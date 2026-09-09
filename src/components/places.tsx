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
/* India outline: a locator beside the stamp sheet, so the grid reads as a
   map at a glance. Coarse by design (about seventy vertices, standard Indian
   depiction, present-day) and never interactive: it points at nothing, so no
   boundary on it is ever a claim the archive has to defend. */
const INDIA_OUTLINE =
  'M22.2 0.7L34.3 5.8L38.1 9.2L37.8 16.1L39.7 21.2L44.4 24.0L41.6 28.8L54.0 33.6L66.7 34.9L67.0 31.8L69.2 31.5L72.1 35.6L79.4 35.3L79.7 32.2L84.1 29.1L90.2 26.7L96.5 30.8L92.7 33.9L89.5 36.3L87.6 41.1L87.9 45.2L83.5 50.0L81.6 52.4L76.8 48.3L80.3 44.2L72.4 40.8L72.4 38.4L67.9 37.0L69.5 44.2L67.3 48.6L69.8 52.1L63.5 53.8L63.2 57.2L57.1 60.6L54.0 64.4L48.6 69.2L42.2 73.6L41.9 81.5L41.0 86.3L40.6 92.1L39.0 95.9L35.2 96.9L33.3 99.7L30.5 96.9L29.5 93.5L27.9 88.7L25.1 83.2L22.5 75.0L20.0 69.2L18.4 62.3L18.1 57.5L17.5 51.0L16.2 55.1L12.7 56.2L8.2 53.4L6.3 51.0L10.2 49.0L5.7 47.9L4.1 46.2L5.4 44.2L12.7 43.2L9.8 40.1L9.2 34.6L15.5 31.5L20.3 25.0L23.8 19.9L23.5 15.4L21.9 11.6Z';

export function IndiaOutline({ className = 'h-20 w-20' }: { className?: string }) {
  return (
    <svg viewBox="-2 -2 104 104" className={className} role="img" aria-label="Stylised present-day outline of India, for orientation only">
      <path d={INDIA_OUTLINE} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
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
