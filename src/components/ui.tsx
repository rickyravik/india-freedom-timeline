import { useEffect, useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import type { DisputedNote, Era, Quote, SourceRef } from '@/types';
import { eras } from '@/data/eras';
import { useReveal } from '@/lib/hooks';

/* ------------------------------------------------------------------ */
/* Era accent maps — one source of truth for colour-coding             */
export const eraAccent = {
  text: {
    indigo: 'text-indigo-mid',
    oxide: 'text-oxide',
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
    sepia: 'text-brass-bright',
    brass: 'text-brass-bright',
  },
  bg: {
    indigo: 'bg-indigo-mid',
    oxide: 'bg-oxide',
    saffron: 'bg-saffron',
    forest: 'bg-forest',
    sepia: 'bg-sepia',
    brass: 'bg-brass',
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
  hex: {
    indigo: '#33456e',
    oxide: '#993527',
    saffron: '#c07a2c',
    forest: '#3d5a3c',
    sepia: '#8a6f52',
    brass: '#9c7f3a',
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
/* Section heading — editorial kicker + large title                    */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  vault = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  vault?: boolean;
}) {
  return (
    <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-2xl">
        {eyebrow && <p className={`${vault ? 'eyebrow-vault' : 'eyebrow'} mb-2`}>{eyebrow}</p>}
        <h2 className={`text-[1.9rem] font-semibold leading-[1.05] tracking-tight sm:text-[2.4rem] ${vault ? 'text-paper-50' : 'text-ink'}`}>
          {title}
        </h2>
        {lede && <p className={`mt-2 max-w-xl text-[15px] leading-relaxed ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Portrait medallion — archival monogram, era-ringed                  */
const MEDALLION_PALETTES = [
  ['#22304f', '#e8ebf2'],
  ['#9c5f1d', '#f6e8d3'],
  ['#2c452c', '#e5ece3'],
  ['#7a2a1f', '#f3e2dd'],
  ['#5f4b36', '#ece2cb'],
  ['#7c6428', '#f5efe0'],
];

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
}: {
  name: string;
  era?: Era;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
}) {
  const [fg, bg] = MEDALLION_PALETTES[hashString(name) % MEDALLION_PALETTES.length];
  const sizes = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-lg',
    lg: 'h-20 w-20 text-2xl',
    xl: 'h-28 w-28 text-4xl',
    hero: 'h-32 w-32 text-5xl sm:h-40 sm:w-40 sm:text-6xl',
  };
  const ringColor = era ? eraAccent.hex[era.accent] : 'rgba(0,0,0,0.12)';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold shadow-card ${sizes[size]} ${className}`}
      style={{ backgroundColor: bg, color: fg, boxShadow: `0 0 0 2px ${bg}, 0 0 0 3.5px ${ringColor}, 0 6px 20px -6px rgba(34,28,21,0.3)` }}
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
        {/* Era bands */}
        <div className="absolute inset-x-0 top-2.5 flex h-2 overflow-hidden rounded-full opacity-60">
          {eras.map((e) => (
            <span
              key={e.id}
              className={eraAccent.bg[e.accent]}
              style={{ width: `${pct(e.endYear + 1) - pct(e.startYear)}%`, marginLeft: e === eras[0] ? `${pct(e.startYear)}%` : 0, opacity: 0.5 }}
            />
          ))}
        </div>
        {/* Life */}
        <div
          className={`absolute top-1.5 h-4 rounded-full ${vault ? 'bg-paper-50' : 'bg-ink'} shadow-[0_0_0_2px_rgba(0,0,0,0.25)]`}
          style={{ left: `${pct(b)}%`, width: `${Math.max(pct(d) - pct(b), 1.2)}%` }}
        />
      </div>
      <figcaption className={`relative mt-1 h-4 font-display text-[11px] font-semibold ${vault ? 'text-paper-400' : 'text-ink-faint'}`}>
        <span className="absolute -translate-x-1/2" style={{ left: `${pct(1757)}%` }}>1757</span>
        <span className="absolute left-1/2 -translate-x-1/2 italic opacity-80">a life against the struggle</span>
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
    <Reveal as="aside" className="rounded-lg border border-oxide/30 bg-oxide-wash/70 p-5" aria-label="Disputed or uncertain claims">
      <p className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-oxide-deep">
        <span className="stamp text-oxide">Historians note</span> disputed or uncertain
      </p>
      <ul className="space-y-2.5">
        {notes.map((n) => (
          <li key={n.claim} className="text-[15px] leading-relaxed text-ink-soft">
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

export function SourceList({ sources }: { sources: SourceRef[] }) {
  if (!sources.length) return null;
  return (
    <Reveal as="section" aria-label="Sources and references" className="rounded-lg border border-paper-300 bg-paper-50/60 p-5 sm:p-6">
      <p className="eyebrow mb-1">Provenance</p>
      <h2 className="mb-4 font-display text-xl font-semibold text-ink">Sources & references</h2>
      <ol className="space-y-3">
        {sources.map((s, i) => (
          <li key={`${s.title}-${i}`} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
            <span className="mt-0.5 shrink-0 font-display text-xs font-bold text-brass-deep">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="font-semibold text-ink">{s.title}</span>
              {s.author && <> — {s.author}</>}
              {s.publisher && <>. {s.publisher}</>}
              {s.year && <>, {s.year}</>}
              {s.url && (
                <>
                  {' · '}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-mid underline decoration-indigo-soft underline-offset-2 hover:text-oxide">
                    {new URL(s.url).hostname}
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
    <Reveal as="figure" mask className={`relative border-l-2 pl-6 sm:pl-8 ${vault ? 'border-brass-bright' : 'border-oxide'}`}>
      <blockquote className={`font-display text-[1.45rem] font-medium italic leading-[1.3] tracking-tight sm:text-[1.75rem] ${vault ? 'text-paper-50' : 'text-ink'}`} style={{ fontVariationSettings: '"SOFT" 40' }}>
        {quote.text}
      </blockquote>
      <figcaption className={`mt-3 text-xs ${vault ? 'text-paper-400' : 'text-ink-faint'}`}>
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
    <Reveal
      className="relative overflow-hidden rounded-lg border border-brass/40 bg-[linear-gradient(180deg,#faf6ec_0%,#f6ecd6_100%)] p-5 shadow-card"
      style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 27px, rgba(156,127,58,0.16) 27px 28px), linear-gradient(180deg,#faf6ec 0%,#f6ecd6 100%)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="stamp text-oxide">Did you know</span>
        {index !== undefined && <span className="font-display text-xs font-bold text-brass-deep">No. {String(index + 1).padStart(2, '0')}</span>}
      </div>
      <p className="prose-reading text-[1.05rem]">{text}</p>
      {action && <div className="mt-3">{action}</div>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-paper-400 bg-paper-50/60 p-10 text-center">
      <p aria-hidden="true" className="mb-3 font-display text-4xl text-brass">
        ✦
      </p>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-faint">{hint}</p>}
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default bg-vault/60 animate-fade-in backdrop-blur-[2px]" onClick={onClose} tabIndex={-1} />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-paper-100 px-5 pb-safe pt-2 shadow-sheet outline-none animate-sheet-up sm:rounded-2xl sm:px-6"
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
        <div className="mx-auto mb-3 mt-1 h-1.5 w-12 rounded-full bg-paper-400 sm:hidden" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between pt-1 sm:pt-3">
          <h2 id={titleId} className="font-display text-xl font-semibold text-ink">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="chip" aria-label="Close">
            ✕<span className="ml-1">Close</span>
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
      <legend className="eyebrow mb-2.5">{label}</legend>
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
    <div role="group" aria-label={label} className={`inline-flex rounded-full p-1 ${vault ? 'bg-paper-100/10' : 'border border-paper-300 bg-paper-50 shadow-card'}`}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] duration-160 ease-cinematic active:scale-[0.98] ${
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
/* Page intro — paper page header (accounts for the overlaid header)   */
export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="container-page pb-6 pt-24 sm:pt-28">
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-3 animate-fade-up">{eyebrow}</p>}
        <h1 className="text-[2.4rem] font-bold leading-[1] tracking-tight text-ink animate-fade-up sm:text-[3.4rem]" style={{ animationDelay: '60ms' }}>
          {title}
        </h1>
        {lede && (
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft animate-fade-up" style={{ animationDelay: '120ms' }}>
            {lede}
          </p>
        )}
      </div>
      {children && <div className="mt-6 animate-fade-up" style={{ animationDelay: '180ms' }}>{children}</div>}
    </header>
  );
}
