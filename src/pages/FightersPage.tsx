import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Gender, RegionId, Role } from '@/types';
import { fighters, roleLabels } from '@/lib/content';
import { eras } from '@/data/eras';
import { regionNames } from '@/data/regions';
import { useBookmarks, usePageMeta } from '@/lib/hooks';
import { BottomSheet, ChipGroup, EmptyState, PageIntro } from '@/components/ui';
import { FighterCard } from '@/components/cards';

type Collection = 'all' | 'featured' | 'forgotten' | 'women' | 'saved';
type Sort = 'chronological' | 'name';

const collections: { value: Collection; label: string }[] = [
  { value: 'all', label: 'Everyone' },
  { value: 'featured', label: 'Featured' },
  { value: 'forgotten', label: 'Forgotten heroes' },
  { value: 'women', label: 'Women of the movement' },
  { value: 'saved', label: '★ Saved' },
];

export default function FightersPage() {
  usePageMeta('Freedom Fighters', 'Browse the people of India’s freedom struggle — revolutionaries, satyagrahis, queens, poets and tribal leaders from every region.');
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<Collection>((params.get('collection') as Collection) || 'all');
  const [region, setRegion] = useState<RegionId | null>((params.get('region') as RegionId) || null);
  const [eraId, setEraId] = useState<string | null>(params.get('era'));
  const [role, setRole] = useState<Role | null>((params.get('role') as Role) || null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [sort, setSort] = useState<Sort>('chronological');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = fighters.filter((f) => {
      if (collection === 'featured' && !f.featured) return false;
      if (collection === 'forgotten' && !f.forgotten) return false;
      if (collection === 'women' && f.gender !== 'female') return false;
      if (collection === 'saved' && !bookmarks.includes(f.slug)) return false;
      if (region && f.region !== region) return false;
      if (eraId && f.era !== eraId) return false;
      if (role && !f.roles.includes(role)) return false;
      if (gender && f.gender !== gender) return false;
      if (q) {
        const hay = [f.name, ...(f.alternateNames ?? []), f.birthPlace ?? '', f.states.join(' '), (f.tags ?? []).join(' ')].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return sort === 'name' ? list.sort((a, b) => a.name.localeCompare(b.name)) : list.sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
  }, [query, collection, region, eraId, role, gender, sort, bookmarks]);

  const activeCount = [region, eraId, role, gender].filter(Boolean).length;

  const filterControls = (
    <>
      <ChipGroup label="Region" options={(Object.keys(regionNames) as RegionId[]).map((r) => ({ value: r, label: regionNames[r] }))} value={region} onChange={setRegion} />
      <ChipGroup label="Era" options={eras.map((e) => ({ value: e.id, label: `${e.startYear} · ${e.name}` }))} value={eraId} onChange={setEraId} />
      <ChipGroup label="Role" options={(Object.keys(roleLabels) as Role[]).map((r) => ({ value: r, label: roleLabels[r] }))} value={role} onChange={setRole} />
      <ChipGroup
        label="Gender"
        options={[
          { value: 'female' as Gender, label: 'Women' },
          { value: 'male' as Gender, label: 'Men' },
        ]}
        value={gender}
        onChange={setGender}
      />
      <ChipGroup
        label="Order"
        allLabel="By birth year"
        options={[{ value: 'name' as Sort, label: 'By name' }]}
        value={sort === 'name' ? 'name' : null}
        onChange={(v) => setSort(v ?? 'chronological')}
      />
    </>
  );

  return (
    <div className="pb-20">
      <PageIntro eyebrow={`${fighters.length} lives — and growing`} title="Freedom Fighters" lede="Queens and schoolteachers, poets and generals, satyagrahis and revolutionaries — from every region, community and creed.">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 sm:max-w-sm">
            <span className="sr-only">Search by name, place or tag</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, place, tag…"
              className="min-h-12 w-full rounded-full border border-paper-300 bg-paper-50 pl-11 pr-4 text-sm text-ink shadow-card placeholder:text-ink-faint focus:border-ink"
            />
          </label>
          <button type="button" className={`chip min-h-12 !px-5 ${activeCount ? 'chip-active' : ''}`} onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
            Filters{activeCount > 0 && ` · ${activeCount}`}
          </button>
        </div>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Collections">
          {collections.map((c) => (
            <button key={c.value} type="button" aria-pressed={collection === c.value} onClick={() => setCollection(c.value)} className={`chip shrink-0 whitespace-nowrap ${collection === c.value ? 'chip-active' : ''}`}>
              {c.label}
            </button>
          ))}
        </div>
      </PageIntro>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter people">
        {filterControls}
        <button type="button" className="btn-seal mt-4 w-full" onClick={() => setSheetOpen(false)}>
          Show {results.length} people
        </button>
      </BottomSheet>

      <div className="container-page">
        <p className="mb-4 text-sm text-ink-faint" role="status">
          Showing {results.length} of {fighters.length}
        </p>
        {results.length === 0 ? (
          <EmptyState
            title={collection === 'saved' ? 'No saved stories yet' : 'No one matches these filters'}
            hint={collection === 'saved' ? 'Tap "Save this story" on any profile to keep it here.' : 'Try clearing a filter or two.'}
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
