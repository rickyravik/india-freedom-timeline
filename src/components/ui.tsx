import { useEffect, useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import type { DisputedNote, Era, Quote, SourceRef } from '@/types';
import { eras } from '@/data/eras';
import { useReveal } from '@/lib/hooks';

/* ------------------------------------------------------------------ */
/* Era accent maps — one source of truth for colour-coding             */
export const eraAccent = {
  text: {
    indigo: 'text-indigo-mid',
    oxide: 'text-oxide-deep',
    saffron: 'text-saffron-deep',
    forest: 'text-forest',
    sepia: 'text-sepia-deep',
    brass: 'text-brass-deep',
  },
  textVault: {
    indigo: 'text-indigo-soft',
    oxide: 'text-oxide-bright',
    saffron: 'text-saffron-bright',
    forest: 'text-forest-bright',
    sepia: 'text-sepia-bright',
    brass: 'text-brass-bright',
  },
  /* Pane grounds. All six are dark enough to carry paper text at 13px, so
     ochre and gauge gold use their deep cuts — the mid cuts only reached
     4.0:1 against ink and failed the label and reading roles they carry. */
  bg: {
    indigo: 'bg-indigo-mid',
    oxide: 'bg-oxide-deep',
    saffron: 'bg-saffron',
    forest: 'bg-forest',
    sepia: 'bg-sepia',
    brass: 'bg-brass-deep',
  },
  border: {
    indigo: 'border-indigo-mid',
    oxide: 'border-oxide',
    saffron: 'border-saffron',
    forest: 'border-forest',
    sepia: 'border-sepia',
    brass: 'border-brass',
  },
  ring: {
    indigo: 'ring-indigo-mid',
    oxide: 'ring-oxide',
    saffron: 'ring-saffron',
    forest: 'ring-forest',
    sepia: 'ring-sepia',
    brass: 'ring-brass',
  },
  /* Text that sits ON an era ink pane — every ground above is a deep cut, so
     lettering is always the paper */
  onInk: {
    indigo: 'text-paper-50',
    oxide: 'text-paper-50',
    saffron: 'text-paper-50',
    forest: 'text-paper-50',
    sepia: 'text-paper-50',
    brass: 'text-paper-50',
  },
  onInkMuted: {
    indigo: 'text-paper-100',
    oxide: 'text-paper-100',
    saffron: 'text-paper-100',
    forest: 'text-paper-100',
    sepia: 'text-paper-100',
    brass: 'text-paper-100',
  },
  hex: {
    indigo: '#23406b',
    oxide: '#c4611f',
    saffron: '#8e2f2a',
    forest: '#14453d',
    sepia: '#5b2e4a',
    brass: '#8f7a45',
  },
  /* Deep cuts, for a small plate that must carry paper lettering */
  hexPlate: {
    indigo: '#1a3154',
    oxide: '#a34e12',
    saffron: '#6f2420',
    forest: '#0e332d',
    sepia: '#452038',
    brass: '#7c6428',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Reveal — wraps children in a scroll-revealed element                */
export function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  mask = false,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  delay?: number;
  mask?: boolean;
  style?: CSSProperties;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  const merged = { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties;
  return (
    <Tag ref={ref} className={`${mask ? 'reveal-mask' : 'reveal'} ${className}`} style={merged} {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Icons — one stroke, one weight                                      */
export function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
export const icons = {
  close: 'M6 6l12 12M18 6 6 18',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.5-3.5',
  bookmark: 'M6 4h12v17l-6-4-6 4z',
  share: 'M12 4v12m0-12-4 4m4-4 4 4M5 14v5h14v-5',
  shuffle: 'M4 6h4l8 12h4M4 18h4l2-3M14 6h6m0 0-2-2m2 2-2 2M20 18l-2-2m2 2-2 2',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',
  flag: 'M5 21V4m0 0h12l-2 4 2 4H5',
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14M15 6v14',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
} as const;

/* ------------------------------------------------------------------ */
/* Section heading — ruled, like a gazette section head                */
export function SectionHeading({
  title,
  lede,
  action,
  vault = false,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
  vault?: boolean;
}) {
  return (
    <div className="mb-8">
      <div className={`${vault ? 'rule-double-vault' : 'rule-double'} mb-5`} />
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h2 className={`text-h2 ${vault ? 'text-paper-50' : 'text-ink'}`}>{title}</h2>
          {lede && <p className={`mt-2 max-w-xl font-body text-meta ${vault ? 'text-paper-200' : 'text-ink-soft'}`}>{lede}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Portrait plate — typographic monogram, era-ruled                    */
/* Plate inks for a life with no era on record */
const MEDALLION_PALETTES = ['#14453d', '#1a3154', '#6f2420', '#452038', '#2b2151', '#a34e12'];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initialsOf(name: string): string {
  const stop = new Set(['of', 'the', 'dr', 'u', 'rani', 'babu', 'lala', 'begum', 'maulana', 'khan', 'sardar', 'captain', 'mahatma', 'pandit', 'sri', 'pasumpon', 'kittur', '&']);
  const parts = name
    .replace(/[().']/g, '')
    .split(/[\s-]+/)
    .filter((p) => p && !stop.has(p.toLowerCase()));
  const source = parts.length ? parts : name.split(/\s+/);
  return source
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function PortraitMedallion({
  name,
  era,
  size = 'md',
  className = '',
  onPane = false,
}: {
  name: string;
  era?: Era;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  /* true when the head is mounted on an era-ink pane rather than on paper:
     the plate inverts to paper so it reads as a stamp, not a hole. */
  onPane?: boolean;
}) {
  /* The head is struck in its era's ink, so a life and its chapter match. */
  const plate = era ? eraAccent.hexPlate[era.accent] : MEDALLION_PALETTES[hashString(name) % MEDALLION_PALETTES.length];
  const sizes = {
    xs: 'h-7 w-7 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-lg',
    lg: 'h-20 w-20 text-2xl',
    xl: 'h-28 w-28 text-4xl',
    hero: 'h-32 w-32 text-5xl sm:h-40 sm:w-40 sm:text-6xl',
  };
  return (
    <span
      aria-hidden="true"
      /* One stamp: the plate is the ink, the monogram is cut in the paper, and
         the edge is perforated at the gauge its size can carry. */
      className={`${size === 'xs' || size === 'sm' ? 'perf-fine' : 'perf-all'} inline-flex shrink-0 select-none items-center justify-center font-display font-bold ${sizes[size]} ${className}`}
      style={
        {
          backgroundColor: onPane ? '#f7f3ea' : plate,
          color: onPane ? plate : '#f7f3ea',
          '--tooth': onPane ? plate : '#f2ede2',
        } as CSSProperties
      }
    >
      {initialsOf(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Lifespan bar — where a life falls against 1757–1947                 */
const SPAN_START = 1740;
const SPAN_END = 1950;
const pct = (y: number) => ((Math.min(Math.max(y, SPAN_START), SPAN_END) - SPAN_START) / (SPAN_END - SPAN_START)) * 100;

export function LifespanBar({ birth, death, vault = true }: { birth?: number; death?: number; vault?: boolean }) {
  if (!birth && !death) return null;
  const b = birth ?? (death ?? SPAN_START) - 40;
  const d = death ?? SPAN_END;
  return (
    <figure aria-label={`Lifespan ${birth ?? '?'} to ${death ?? '?'} against the freedom struggle, 1757 to 1947`} className="w-full max-w-md">
      <div className="relative h-7">
        {/* Era bands on a paper track. Each band is positioned from its own
           year rather than laid out in flow, so the gauge is continuous and
           no band can shrink or drift against its neighbour. */}
        <div className="absolute inset-x-0 top-2 h-3 overflow-hidden bg-paper-100 ring-1 ring-inset ring-ink/20">
          {eras.map((e) => (
            <span
              key={e.id}
              className={`absolute inset-y-0 ${eraAccent.bg[e.accent]}`}
              style={{ left: `${pct(e.startYear)}%`, width: `${pct(e.endYear + 1) - pct(e.startYear)}%` }}
            />
          ))}
        </div>
        {/* Life — the franked span, always the accent ink */}
        <div
          className="absolute top-1 h-5 bg-oxide ring-1 ring-ink/30"
          style={{ left: `${pct(b)}%`, width: `${Math.max(pct(d) - pct(b), 1.2)}%` }}
        />
      </div>
      <figcaption className={`num relative mt-1.5 h-4 font-body text-xs font-medium ${vault ? 'text-paper-200' : 'text-ink-faint'}`}>
        <span className="absolute -translate-x-1/2" style={{ left: `${pct(1757)}%` }}>1757</span>
        <span className="absolute left-1/2 -translate-x-1/2">a life against the struggle</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${pct(1947)}%` }}>1947</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Historians' note                                                    */
export function DisputedNotes({ notes }: { notes: DisputedNote[] }) {
  if (!notes.length) return null;
  return (
    <Reveal as="aside" className="rounded-sm border border-oxide/40 bg-oxide-wash/70 p-5" aria-label="Disputed or uncertain claims">
      <p className="mb-3 flex flex-wrap items-center gap-2 font-display text-base font-bold text-oxide-deep">
        <span className="stamp text-oxide">Historians note</span> disputed or uncertain
      </p>
      <ul className="space-y-2.5">
        {notes.map((n) => (
          <li key={n.claim} className="font-body text-meta text-ink-soft">
            <span className="font-semibold text-ink">{n.claim}.</span> {n.note}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Sources                                                             */
const typeLabel: Record<string, string> = {
  book: 'Book',
  archive: 'Archive',
  government: 'Government',
  journal: 'Journal',
  museum: 'Museum',
  website: 'Website',
};

/* The URLs on record are institution portals, not per-record deep links, so
   the link is labelled by where the source is held rather than dressed up as
   the document itself. A bare hostname told the reader nothing. */
const holdings: Record<string, string> = {
  'www.abhilekh-patal.in': 'Abhilekh Patal, National Archives of India',
  'pmml.gov.in': 'Prime Ministers’ Museum & Library',
  'www.gandhiheritageportal.org': 'Gandhi Heritage Portal',
  'www.saada.org': 'South Asian American Digital Archive',
  'amritkaal.nic.in': 'Government of India',
};

function holdingName(url: string): string {
  try {
    const host = new URL(url).hostname;
    return holdings[host] ?? host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function SourceList({ sources }: { sources: SourceRef[] }) {
  if (!sources.length) return null;
  return (
    <Reveal as="section" aria-label="Sources and references" className="doc p-5 sm:p-6">
      <h2 className="mb-1 text-h3 text-ink">Sources & references</h2>
      <div className="rule mb-4" />
      <ol className="space-y-3">
        {sources.map((s, i) => (
          <li key={`${s.title}-${i}`} className="flex gap-3 font-body text-meta text-ink-soft">
            <span className="num mt-px shrink-0 font-display text-sm font-bold text-brass-deep">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="font-semibold text-ink">{s.title}</span>
              {s.author && <> — {s.author}</>}
              {s.publisher && <>. {s.publisher}</>}
              {s.year && <>, {s.year}</>}
              {s.url && (
                <>
                  {' · '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink underline decoration-brass decoration-1 underline-offset-2 transition-colors duration-160 hover:text-oxide-deep hover:decoration-oxide"
                  >
                    Search at {holdingName(s.url)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              )}
              <span className="stamp ml-2 align-middle text-sepia">{typeLabel[s.type] ?? s.type}</span>
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Pull-quote                                                          */
export function QuoteCard({ quote, author, vault = false }: { quote: Quote; author?: string; vault?: boolean }) {
  return (
    <Reveal as="figure" mask className={`relative border-l pl-6 sm:pl-8 ${vault ? 'border-brass-bright' : 'border-oxide'}`}>
      <blockquote className={`font-reading text-h4 italic sm:text-h3 ${vault ? 'text-paper-50' : 'text-ink'}`}>
        {quote.text}
      </blockquote>
      <figcaption className={`mt-3 font-body text-label ${vault ? 'text-paper-400' : 'text-ink-faint'}`}>
        {author && <span className={`font-semibold ${vault ? 'text-brass-bright' : 'text-sepia-deep'}`}>{author}</span>}
        {quote.context && <> · {quote.context}</>}
        {quote.disputed && <span className={`stamp ml-2 ${vault ? 'text-oxide-bright' : 'text-oxide'}`}>attribution uncertain</span>}
      </figcaption>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Index card fact                                                     */
export function FactCard({ text, action, index }: { text: string; action?: ReactNode; index?: number }) {
  return (
    <div className="doc p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="stamp text-oxide">Did you know</span>
        {index !== undefined && <span className="num font-display text-sm font-bold text-brass-deep">No. {String(index + 1).padStart(2, '0')}</span>}
      </div>
      <div className="rule mb-4" />
      <p className="prose-reading">{text}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* An empty album mount: the perforated outline of a stamp that isn't there */
export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="perf-all on-sheet bg-paper-200 p-10 text-center">
      <div className="rule-double mx-auto mb-5 max-w-[6rem]" aria-hidden="true" />
      <p className="font-display text-h3 text-ink">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm font-body text-meta text-ink-soft">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom sheet — accessible, with swipe-to-dismiss                    */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default bg-vault/60 animate-fade-in" onClick={onClose} tabIndex={-1} />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-md border-t border-brass bg-paper-100 px-5 pb-safe pt-2 shadow-sheet outline-none animate-sheet-up sm:rounded-sm sm:border sm:border-paper-300 sm:border-t-brass sm:px-6"
        style={{ transform: dragY ? `translateY(${dragY}px)` : undefined, transition: dragY ? 'none' : undefined }}
        onTouchStart={(e) => {
          startY.current = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          if (startY.current === null) return;
          const dy = e.touches[0].clientY - startY.current;
          if (dy > 0 && sheetRef.current && sheetRef.current.scrollTop <= 0) setDragY(dy);
        }}
        onTouchEnd={() => {
          if (dragY > 90) onClose();
          setDragY(0);
          startY.current = null;
        }}
      >
        <div className="mx-auto mb-3 mt-1 h-1 w-12 bg-paper-400 sm:hidden" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between pt-1 sm:pt-3">
          <h2 id={titleId} className="text-h3 text-ink">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="chip" aria-label="Close">
            <Icon d={icons.close} className="h-3.5 w-3.5" />
            Close
          </button>
        </div>
        <div className="pb-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filter chip group                                                   */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  allLabel = 'All',
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T | null) => void;
  allLabel?: string;
}) {
  return (
    <fieldset className="mb-5 last:mb-0">
      <legend className="label mb-2.5">{label}</legend>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`chip ${value === null ? 'chip-active' : ''}`} aria-pressed={value === null} onClick={() => onChange(null)}>
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`chip ${value === o.value ? 'chip-active' : ''}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(value === o.value ? null : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  vault = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  vault?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className={`inline-flex rounded-sm border p-0.5 ${vault ? 'border-paper-100/30' : 'border-paper-400 bg-paper-50'}`}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`min-h-10 rounded-sm px-4 font-body text-meta font-medium transition-colors duration-160 ease-cinematic ${
              active ? (vault ? 'bg-paper-50 text-ink' : 'bg-ink text-paper-50') : vault ? 'text-paper-300 hover:text-paper-50' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Postmark — the cancellation ring over a pane's corner               */
export function Postmark({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <span aria-hidden="true" className={`postmark h-24 w-24 ${className}`}>
      <span>
        {lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page intro — the sheet's own head                                   */
export function PageIntro({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="container-page pb-6 pt-2 sm:pt-4">
      <div className="rule-double mb-6 animate-fade-up" />
      <div className="max-w-3xl">
        <h1 className="text-h1 text-ink animate-fade-up" style={{ animationDelay: '60ms' }}>
          {title}
        </h1>
        {lede && (
          <p className="mt-4 max-w-2xl font-reading text-reading text-ink-soft animate-fade-up" style={{ animationDelay: '120ms' }}>
            {lede}
          </p>
        )}
      </div>
      {children && <div className="mt-6 animate-fade-up" style={{ animationDelay: '180ms' }}>{children}</div>}
    </header>
  );
}
