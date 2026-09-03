import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, type SearchResult } from '@/lib/search';
import { dailyPick, fighters } from '@/lib/content';
import { Icon, icons, PortraitMedallion } from '@/components/ui';

const kindLabel: Record<SearchResult['kind'], string> = { fighter: 'People', event: 'Events', movement: 'Movements' };
const kindStamp: Record<SearchResult['kind'], string> = { fighter: 'Person', event: 'Event', movement: 'Movement' };
const suggestions = ['Bhagat Singh', 'Kattabomman', '1942', 'Salt', 'Assam', 'Women', 'Adivasi', 'INA'];

/**
 * Command-palette search, available from every page (⌘K / Ctrl+K / "/").
 * Focus is trapped inside; Escape closes; arrow keys move; Enter opens.
 */
export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const results = useMemo(() => search(query, 14), [query]);
  const discover = useMemo(() => dailyPick(fighters, 11), []);

  const grouped = useMemo(() => {
    const groups: { kind: SearchResult['kind']; items: SearchResult[] }[] = [];
    for (const kind of ['fighter', 'event', 'movement'] as const) {
      const items = results.filter((r) => r.kind === kind);
      if (items.length) groups.push({ kind, items });
    }
    return groups;
  }, [results]);
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  const go = useCallback(
    (to: string) => {
      onClose();
      navigate(to);
    },
    [navigate, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[8vh] sm:pt-[12vh]" role="presentation">
      <button type="button" aria-label="Close search" tabIndex={-1} className="absolute inset-0 cursor-default bg-vault/70 animate-fade-in" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the archive"
        className="relative w-full max-w-xl overflow-hidden rounded-sm border border-paper-300 bg-paper-100 animate-fade-up"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (flat.length) setCursor((c) => Math.min(c + 1, flat.length - 1));
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          }
          if (e.key === 'Enter' && flat[cursor]) {
            e.preventDefault();
            go(flat[cursor].to);
          }
          if (e.key === 'Tab') {
            const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-paper-300 px-4">
          <Icon d={icons.search} className="h-[18px] w-[18px] shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={listId}
            aria-activedescendant={flat[cursor] ? `${listId}-${cursor}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, places, years, movements…"
            className="min-h-14 w-full border-b-2 border-transparent bg-transparent font-body text-meta text-ink placeholder:text-ink-faint focus-visible:border-oxide focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd className="hidden rounded-sm border border-ink/30 px-1.5 font-body text-xs text-ink-faint sm:block">Esc</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin-archival" id={listId} role="listbox">
          {query.trim().length < 2 ? (
            <div className="p-3">
              <p className="label mb-2">Try</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="label mb-2 mt-5">Discover someone today</p>
              <button type="button" onClick={() => go(`/fighters/${discover.slug}`)} className="flex w-full items-center gap-3 rounded-sm p-2 text-left hover:bg-paper-200/70">
                <PortraitMedallion name={discover.name} portrait={discover.portrait} size="sm" />
                <span>
                  <span className="block font-display text-base font-bold text-ink">{discover.name}</span>
                  <span className="block font-body text-label text-ink-faint line-clamp-1">{discover.summary}</span>
                </span>
              </button>
            </div>
          ) : flat.length === 0 ? (
            <p className="p-6 text-center font-body text-meta text-ink-faint">Nothing found for “{query}”. Try a name, a state, a year or a movement.</p>
          ) : (
            grouped.map((g) => (
              <div key={g.kind} className="mb-1">
                <p className="label px-3 pb-1 pt-3">{kindLabel[g.kind]}</p>
                {g.items.map((r) => {
                  const idx = flat.indexOf(r);
                  const active = idx === cursor;
                  return (
                    <button
                      key={r.to}
                      id={`${listId}-${idx}`}
                      role="option"
                      aria-selected={active}
                      type="button"
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => go(r.to)}
                      className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left font-body text-meta transition-colors duration-160 ${active ? 'bg-ink text-paper-50' : 'hover:bg-paper-200/70'}`}
                    >
                      {r.kind === 'fighter' ? (
                        <PortraitMedallion name={r.title} size="xs" />
                      ) : (
                        <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${active ? 'bg-paper-100/15' : 'bg-paper-200'}`}>
                          <Icon d={r.kind === 'event' ? icons.clock : icons.flag} className="h-4 w-4" />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{r.title}</span>
                        <span className={`block truncate text-label ${active ? 'text-paper-300' : 'text-ink-faint'}`}>{r.subtitle}</span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-2">
                        <span className={`stamp hidden sm:inline-block ${active ? 'text-paper-300' : 'text-sepia'}`}>{kindStamp[r.kind]}</span>
                        {active && <kbd className="hidden rounded-sm border border-paper-50/30 px-1.5 font-body text-xs text-paper-300 sm:block">Enter</kbd>}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
