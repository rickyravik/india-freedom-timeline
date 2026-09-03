import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { search } from '@/lib/search';
import { dailyPick, fighters } from '@/lib/content';
import { usePageMeta } from '@/lib/hooks';
import { EmptyState, Icon, PageIntro, PortraitMedallion, Reveal, icons } from '@/components/ui';

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
    setQuery(params.get('q') ?? '');
  }, [params]);
  useEffect(() => {
    const t = setTimeout(() => setParams(query ? { q: query } : {}, { replace: true }), 250);
    return () => clearTimeout(t);
  }, [query, setParams]);

  const results = useMemo(() => search(query, 30), [query]);
  const discover = useMemo(() => dailyPick(fighters, 3), []);

  return (
    <div className="pb-20">
      <PageIntro title="Search">
        <label className="relative block max-w-2xl">
          <span className="sr-only">Search the archive</span>
          <Icon d={icons.search} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, birthplace, state, movement, year, event, role…"
            className="min-h-14 w-full rounded-sm border border-paper-400 bg-paper-50 pl-12 pr-5 font-body text-reading text-ink placeholder:text-ink-faint focus:border-ink"
          />
        </label>
      </PageIntro>

      <div className="container-page max-w-3xl">
        {query.trim().length < 2 ? (
          <div className="space-y-8">
            <Reveal>
              <p className="label mb-3">Try searching for</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chip min-h-10" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal className="vault px-5 py-7 sm:px-8 sm:py-9">
              <p className="label-vault mb-3">Or discover someone new today</p>
              <div className="rule-vault mb-4" />
              <Link to={`/fighters/${discover.slug}`} className="group flex items-center gap-4">
                <PortraitMedallion name={discover.name} portrait={discover.portrait} size="lg" />
                <span>
                  <span className="inline-flex items-center gap-2 font-display text-h3 font-bold text-paper-50 transition-colors duration-160 group-hover:text-brass-bright">{discover.name}<Icon d={icons.arrowRight} className="h-4 w-4" /></span>
                  <span className="mt-1 block font-body text-meta text-paper-300">{discover.summary}</span>
                </span>
              </Link>
            </Reveal>
          </div>
        ) : results.length === 0 ? (
          <EmptyState title={`Nothing found for “${query}”`} hint="Try a name, a state, a year like 1930, or a movement like Swadeshi." />
        ) : (
          <>
            <p className="num mb-3 font-body text-label text-ink-faint" role="status">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
            <ol className="space-y-2" aria-label="Search results">
              {results.map((r, i) => (
                <Reveal as="li" key={r.to} delay={Math.min(i, 8) * 40}>
                  <Link to={r.to} className="doc-interactive group flex items-center gap-3 p-3.5">
                    {r.kind === 'fighter' ? (
                      <PortraitMedallion name={r.title} size="sm" />
                    ) : (
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-paper-200 text-ink-soft">
                        <Icon d={r.kind === 'event' ? icons.clock : icons.flag} className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base font-bold text-ink transition-colors duration-160 group-hover:text-oxide">{r.title}</span>
                      <span className="num block truncate font-body text-label text-ink-faint">{r.subtitle}</span>
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
