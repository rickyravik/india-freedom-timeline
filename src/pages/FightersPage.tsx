import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Gender, RegionId, Role } from '@/types';
import { fighters, roleLabels } from '@/lib/content';
import { eras } from '@/data/eras';
import { regionIds, regionNames } from '@/data/regions';
import { useBookmarks, usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf, oneOfDefault, text } from '@/lib/url-state';
import { buildIndex, searchIndex } from '@/lib/search-core';
import { ActiveFilters, BottomSheet, ChipGroup, EmptyState, Icon, PageIntro, icons } from '@/components/ui';
import { FighterCard } from '@/components/cards';

type Collection = 'all' | 'featured' | 'forgotten' | 'women' | 'saved';
type Sort = 'chronological' | 'name';

const collections: { value: Collection; label: string }[] = [
  { value: 'all', label: 'Everyone' },
  { value: 'featured', label: 'Featured' },
  { value: 'forgotten', label: 'Forgotten heroes' },
  { value: 'women', label: 'Women of the movement' },
  { value: 'saved', label: 'Saved' },
];

/* People-only index, built once. Same four-tier matcher as global search, so
   a spelling that works in the palette works here too. */
const peopleIndex = buildIndex(fighters, [], []);

const peopleParams = {
  q: text(),
  collection: oneOfDefault(collections.map((c) => c.value), 'all' as Collection),
  region: oneOf(regionIds),
  era: oneOf(eras.map((e) => e.id)),
  role: oneOf(Object.keys(roleLabels) as Role[]),
  gender: oneOf(['female', 'male'] as Gender[]),
  sort: oneOfDefault(['chronological', 'name'] as Sort[], 'chronological' as Sort),
};

export default function FightersPage() {
  usePageMeta('Freedom Fighters', 'Browse the people of India’s freedom struggle — revolutionaries, satyagrahis, queens, poets and tribal leaders from every region.');
  const [filters, setFilters] = useUrlState(peopleParams);
  const { q: query, collection, region, era: eraId, role, gender, sort } = filters;
  const [sheetOpen, setSheetOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const q = query.trim();
  const matched = useMemo(() => (q.length >= 2 ? searchIndex(peopleIndex, q, fighters.length) : null), [q]);
  const fuzzyHint = matched && matched[0] && !matched[0].exact ? matched[0].title : null;

  const results = useMemo(() => {
    const rank = matched ? new Map(matched.map((r, i) => [r.to.replace('/fighters/', ''), i])) : null;
    const list = fighters.filter((f) => {
      if (collection === 'featured' && !f.featured) return false;
      if (collection === 'forgotten' && !f.forgotten) return false;
      if (collection === 'women' && f.gender !== 'female') return false;
      if (collection === 'saved' && !bookmarks.includes(f.slug)) return false;
      if (region && f.region !== region) return false;
      if (eraId && f.era !== eraId) return false;
      if (role && !f.roles.includes(role)) return false;
      if (gender && f.gender !== gender) return false;
      if (rank && !rank.has(f.slug)) return false;
      return true;
    });
    /* With a query, relevance order; otherwise the chosen sort. */
    if (rank) return list.sort((a, b) => rank.get(a.slug)! - rank.get(b.slug)!);
    return sort === 'name' ? list.sort((a, b) => a.name.localeCompare(b.name)) : list.sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
  }, [matched, collection, region, eraId, role, gender, sort, bookmarks]);

  const activeCount = [region, eraId, role, gender].filter(Boolean).length;
  const activeChips = [
    region && { key: 'region', label: regionNames[region], onRemove: () => setFilters({ region: null }) },
    eraId && { key: 'era', label: eras.find((e) => e.id === eraId)?.name ?? eraId, onRemove: () => setFilters({ era: null }) },
    role && { key: 'role', label: roleLabels[role], onRemove: () => setFilters({ role: null }) },
    gender && { key: 'gender', label: gender === 'female' ? 'Women' : 'Men', onRemove: () => setFilters({ gender: null }) },
  ].filter((c): c is { key: string; label: string; onRemove: () => void } => Boolean(c));

  const filterControls = (
    <>
      <ChipGroup label="Region" options={(Object.keys(regionNames) as RegionId[]).map((r) => ({ value: r, label: regionNames[r] }))} value={region} onChange={(v) => setFilters({ region: v })} />
      <ChipGroup label="Era" options={eras.map((e) => ({ value: e.id, label: `${e.startYear} · ${e.name}` }))} value={eraId} onChange={(v) => setFilters({ era: v })} />
      <ChipGroup label="Role" options={(Object.keys(roleLabels) as Role[]).map((r) => ({ value: r, label: roleLabels[r] }))} value={role} onChange={(v) => setFilters({ role: v })} />
      <ChipGroup
        label="Gender"
        options={[
          { value: 'female' as Gender, label: 'Women' },
          { value: 'male' as Gender, label: 'Men' },
        ]}
        value={gender}
        onChange={(v) => setFilters({ gender: v })}
      />
      <ChipGroup
        label="Order"
        allLabel="By birth year"
        options={[{ value: 'name' as Sort, label: 'By name' }]}
        value={sort === 'name' ? 'name' : null}
        onChange={(v) => setFilters({ sort: v ?? 'chronological' })}
      />
    </>
  );

  return (
    <div className="pb-20">
      <PageIntro title="Freedom Fighters" lede="Queens and schoolteachers, poets and generals, satyagrahis and revolutionaries — from every region, community and creed.">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 sm:max-w-sm">
            <span className="sr-only">Search by name, place or tag</span>
            <Icon d={icons.search} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setFilters({ q: e.target.value })}
              placeholder="Name, place, tag…"
              className="min-h-12 w-full rounded-sm border border-paper-400 bg-paper-50 pl-11 pr-4 font-body text-meta text-ink placeholder:text-ink-faint focus:border-ink"
            />
          </label>
          <button type="button" className={`chip min-h-12 !px-5 text-meta ${activeCount ? 'chip-active' : ''}`} onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
            Filters{activeCount > 0 && ` · ${activeCount}`}
          </button>
        </div>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Collections">
          {collections.map((c) => (
            <button key={c.value} type="button" aria-pressed={collection === c.value} onClick={() => setFilters({ collection: c.value })} className={`chip shrink-0 whitespace-nowrap ${collection === c.value ? 'chip-active' : ''}`}>
              {c.label}
            </button>
          ))}
        </div>
        <ActiveFilters chips={activeChips} onClear={() => setFilters({ region: null, era: null, role: null, gender: null })} className="mt-3" />
      </PageIntro>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter people">
        {filterControls}
        <button type="button" className="btn-seal mt-4 w-full" onClick={() => setSheetOpen(false)}>
          Show {results.length} people
        </button>
      </BottomSheet>

      <div className="container-page">
        <p className="num mb-4 font-body text-label text-ink-faint" role="status">
          Showing {results.length} of {fighters.length}
        </p>
        {fuzzyHint && (
          <p className="label mb-3">
            Did you mean <span className="font-semibold text-sepia">{fuzzyHint}</span>?
          </p>
        )}
        {results.length === 0 ? (
          <EmptyState
            title={collection === 'saved' ? 'No saved stories yet' : 'No one matches these filters'}
            hint={collection === 'saved' ? 'Tap "Save this story" on any profile to keep it here.' : 'Try clearing a filter or two.'}
            action={
              q.length >= 2 && (
                <Link to={`/search?q=${encodeURIComponent(q)}`} className="btn-ghost">
                  Search the whole archive
                </Link>
              )
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((f, i) => (
              <FighterCard key={f.id} fighter={f} delay={(i % 6) * 50} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
