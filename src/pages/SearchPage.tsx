import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { search } from '@/lib/search';
import { dailyPick, fighters } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { EmptyState, PageIntro, PortraitMedallion, Reveal } from '@/components/ui';

const kindBadge: Record<string, string> = { fighter: 'Person', event: 'Event', movement: 'Movement' };
const suggestions = ['Bhagat Singh', 'Rani Lakshmibai', 'Kattabomman', '1942', 'Salt', 'Kerala', 'Assam', 'INA', 'Women', 'Santhal', 'Kakori'];

export default function SearchPage() {
  usePageMeta('Search', 'Search freedom fighters, events and movements by name, place, year, movement or role.');
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setParams(query ? { q: query } : {}, { replace: true }), 250);
    return () => clearTimeout(t);
  }, [query, setParams]);

  const results = useMemo(() => search(query, 30), [query]);
  const discover = useMemo(() => dailyPick(fighters, 3), []);

  return (
    <div className="pb-20">
      <PageIntro eyebrow="The whole archive, one box" title="Search">
        <label className="relative block max-w-2xl">
          <span className="sr-only">Search the archive</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, birthplace, state, movement, year, event, role…"
            className="min-h-14 w-full rounded-full border border-paper-300 bg-paper-50 pl-13 pr-5 text-base text-ink shadow-card placeholder:text-ink-faint focus:border-ink"
            style={{ paddingLeft: '3.25rem' }}
          />
        </label>
      </PageIntro>

      <div className="container-page max-w-3xl">
        {query.trim().length < 2 ? (
          <div className="space-y-8">
            <Reveal>
              <p className="eyebrow mb-3">Try searching for</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chip min-h-10" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal className="vault rounded-lg p-6 shadow-vault">
              <p className="eyebrow-vault mb-3">Or discover someone new today</p>
              <Link to={`/fighters/${discover.slug}`} className="group flex items-center gap-4">
                <PortraitMedallion name={discover.name} size="lg" />
                <span>
                  <span className="block font-display text-2xl font-semibold text-paper-50 group-hover:text-brass-bright">{discover.name} →</span>
                  <span className="mt-1 block text-sm leading-relaxed text-paper-300">{discover.summary}</span>
                </span>
              </Link>
            </Reveal>
          </div>
        ) : results.length === 0 ? (
          <EmptyState title={`Nothing found for “${query}”`} hint="Try a name, a state, a year like 1930, or a movement like Swadeshi." />
        ) : (
          <>
            <p className="mb-3 text-sm text-ink-faint" role="status">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
            <ol className="space-y-2" aria-label="Search results">
              {results.map((r, i) => (
                <Reveal as="li" key={r.to} delay={Math.min(i, 8) * 40}>
                  <Link to={r.to} className="doc-interactive flex items-center gap-3 p-3.5">
                    {r.kind === 'fighter' ? (
                      <PortraitMedallion name={r.title} size="sm" />
                    ) : (
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-200 font-display text-base">
                        {r.kind === 'event' ? '⧗' : '⚑'}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-xs text-ink-faint">{r.subtitle}</span>
                    </span>
                    <span className="stamp ml-auto shrink-0 text-sepia">{kindBadge[r.kind]}</span>
                  </Link>
                </Reveal>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
