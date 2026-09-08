# Stage 4 — Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read `2026-09-08-improvement-roadmap.md` first. Stages 1–3 must be complete, and the pilot (roadmap, "Validation") should have run: the proposal's exit criterion for this stage is "user testing shows a clear benefit", so re-read the pilot findings before widening any feature past its first example.

**Goal:** One of each extension the proposal asks for, built small and reviewed: places as first-class records; one narrated route (the Dandi March); one archival document you can inspect with its transcription; one trail you can listen to and read in Tamil or Hindi; a printable teacher pack; a private exploration passport; and saving a trail for offline reading.

**Architecture:** Each extension is a typed collection with a validator and a page, following the Stage 2 pattern (`editorial` status, draft stamps, sources on every record). Media (audio, document scans) are static files under `public/` with provenance recorded in data. Translations are versioned against the English trail they were made from. Nothing here needs a backend.

**Tech Stack:** Existing stack plus `@fontsource/noto-sans-tamil` and `@fontsource/noto-serif-devanagari` (loaded only on translated-trail routes).

## Global Constraints

See the roadmap. Specific to this stage:

- **Content inputs gate publication, not construction.** Every task builds and tests its feature against the draft data specified here. Anything with `editorial.status: 'draft'` renders with the draft stamp; the owner supplies or approves the content listed in the roadmap's "Inputs required".
- **Never draw an apparently precise route or boundary that is not.** Every route stop carries `approximate: boolean`; every map states its geographical frame.
- **Recorded narration is labelled as newly recorded**, never presented as a historical recording. Audio starts only on request; text remains independently readable.
- **UI chrome stays Latin-first.** Tamil and Hindi appear only in the translated reading content of a trail, with `lang` attributes and fonts loaded only there.
- **No rankings, streaks, or points tied to deaths or imprisonment** in the passport.
- **Travel information is out of scope** for place pages (the proposal says it must be maintained separately if ever added).

## File structure

| File | Responsibility |
|---|---|
| `src/types/index.ts` | `Place`, `PlaceKind`, `FreedomFighter.locations`, `Route`, `RouteStop`, `ArchiveDocument`, `TrailNarration`, `TrailTranslation`, `Trail.narration/translations` |
| `src/data/places.ts`, `src/data/routes/dandi-march.ts`, `src/data/documents/queens-proclamation-1858.ts` (new) | Content (draft) |
| `scripts/validate-content.ts` | Schemas, refs, translation staleness, narration cue sanity |
| `src/lib/translations.ts` (+ test) | `resolveTrailText`, stale detection |
| `src/lib/offline-trail.ts` (+ test) | URL list and size estimate for a trail; SW messaging |
| `src/components/places.tsx`, `src/components/route-map.tsx`, `src/components/document-viewer.tsx`, `src/components/audio-player.tsx` (new) | Feature components |
| `src/pages/PlacesPage.tsx`, `RoutePage.tsx`, `DocumentPage.tsx`, `PassportPage.tsx`, `TrailTeachPage.tsx` (new); `src/pages/TrailPages.tsx`, `FighterProfilePage.tsx`, `MapPage.tsx` | Pages |
| `src/sw.ts` | `CACHE_TRAIL` / `DROP_TRAIL` messages |
| `scripts/lib/routes.mjs`, `src/lib/routes.tsx` | New routes |
| `public/audio/trails/…`, `public/documents/…` | Media (owner-supplied) |

---

### Task 1: Places as records

**Files:**
- Modify: `src/types/index.ts`, `scripts/validate-content.ts`, `src/lib/content.ts`, `src/lib/routes.tsx`, `scripts/lib/routes.mjs`
- Create: `src/data/places.ts`, `src/components/places.tsx`, `src/pages/PlacesPage.tsx`
- Modify: `src/pages/FighterProfilePage.tsx` (Places ledger), `src/pages/EventPage.tsx` (place link), `src/pages/MapPage.tsx` (places for a state)
- Modify: three fighter records with `locations` (Velu Nachiyar, Kattabomman, Marudhu brothers)
- Create: `tests/places.spec.ts`

**Interfaces:**
```ts
export type PlaceKind = 'fort' | 'prison' | 'meeting-ground' | 'port' | 'protest-site' | 'town' | 'region' | 'coast';
export interface Place {
  id: string; slug: string; name: string;
  /** Names used in the period, with dates where known: "Tuticorin (Thoothukudi)". */
  historicalNames?: string[];
  state: string;                 // must match src/data/regions.ts names
  kind: PlaceKind;
  summary: string;
  description: string[];         // [^n] markers into sources
  /** Years the place matters for in this archive, e.g. "1799, 1801". */
  dates?: string;
  people: string[];              // fighter ids
  events: string[];              // event ids
  sources: SourceRef[];
  images?: { src: string; caption: string; credit: string; created?: string }[];
  editorial: Editorial;
}
export type LocationKind = 'birth' | 'activity' | 'imprisonment' | 'exile' | 'death';
// FreedomFighter +: locations?: { placeId: string; kind: LocationKind; note?: string }[]
// src/lib/content.ts: places, placeById, placeBySlug, placesForState(stateName), placesForFighter(fighter), placesForEvent(eventId)
```
Routes: `/places`, `/places/:slug`.

- [ ] **Step 1: Failing spec**

Create `tests/places.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a place page states its geography frame, its kind, its dates, and links the people and events that happened there', async ({ page }) => {
  await page.goto('/places/panchalankurichi');
  await expect(page.getByRole('heading', { level: 1, name: 'Panchalankurichi' })).toBeVisible();
  await expect(page.getByText('Fort')).toBeVisible();
  await expect(page.getByText(/present-day Tamil Nadu/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Veerapandiya Kattabomman/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Fall of Panchalankurichi/ })).toBeVisible();
});

test('a profile separates birthplace from places of activity, imprisonment, exile and death', async ({ page }) => {
  await page.goto('/fighters/veerapandiya-kattabomman');
  const places = page.getByRole('region', { name: 'Places in this life' });
  await expect(places.getByText('Born')).toBeVisible();
  await expect(places.getByText('Died')).toBeVisible();
  await expect(places.getByRole('link', { name: 'Kayathar' })).toBeVisible();
});

test('the map offers a state’s places', async ({ page }) => {
  await page.goto('/map?state=tamil-nadu');
  await expect(page.getByRole('region', { name: 'Places in Tamil Nadu' }).getByRole('link')).not.toHaveCount(0);
});
```

- [ ] **Step 2: Types, data, validation**

Add the types above to `src/types/index.ts` and `locations?` to `FreedomFighter` (and to the fighter zod schema: `locations: z.array(z.object({ placeId: z.string().min(1), kind: z.enum(['birth', 'activity', 'imprisonment', 'exile', 'death']), note: z.string().optional() })).optional()`).

Create `src/data/places.ts` with six places drafted from the event and fighter records already in the archive (every claim below is in those records' text):
```ts
import type { Place } from '@/types';

const draft = { status: 'draft' as const };

export const places: Place[] = [
  {
    id: 'panchalankurichi', slug: 'panchalankurichi', name: 'Panchalankurichi',
    state: 'Tamil Nadu', kind: 'fort', dates: '1799, 1801',
    summary: 'The mud fort of Veerapandiya Kattabomman in the Tirunelveli country, stormed by Major Bannerman’s Company army in September 1799 and levelled after his execution; taken again in 1801 during the South Indian Rebellion.',
    description: [
      'Panchalankurichi was the seat of a small palaiyam whose chief refused the East India Company’s demand for tribute. After Kattabomman’s violent confrontation with the Collector in 1798, the Company resolved on his destruction; Major Bannerman marched on the fort in September 1799 and breached it on 5 September after costly fighting.[^1]',
      'The fort was levelled after Kattabomman was hanged at Kayathar, and fell again in May 1801 when Oomaithurai’s escape reignited the southern rising. The reconstructed fort and memorial at the site, built by the state in 1974, remain a place of pilgrimage.[^2]',
    ],
    people: ['veerapandiya-kattabomman', 'ondiveeran'],
    events: ['fall-of-panchalankurichi', 'south-indian-rebellion-1801'],
    sources: [
      { title: 'Poligar Rebellion records, 1799–1801', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' },
      { title: 'Kattabomman memorial records, Panchalankurichi', publisher: 'Government of Tamil Nadu, Department of Archaeology', type: 'government', evidence: 'reference' },
    ],
    editorial: draft,
  },
  {
    id: 'kayathar', slug: 'kayathar', name: 'Kayathar',
    state: 'Tamil Nadu', kind: 'town', dates: '16 October 1799',
    summary: 'Where Kattabomman was tried summarily and hanged from a tamarind tree before the assembled chiefs of the south on 16 October 1799.',
    description: ['Kattabomman was tried at Kayathar on 16 October 1799 in the presence of the region’s palaiyakkarars, as a warning to them, and hanged the same day. The intended lesson misfired: within two years the whole south was in revolt.[^1]'],
    people: ['veerapandiya-kattabomman'],
    events: ['fall-of-panchalankurichi'],
    sources: [{ title: 'Tirunelveli District Gazetteer', url: 'https://archive.org/details/in.ernet.dli.2015.161915', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' }],
    editorial: draft,
  },
  {
    id: 'kalayar-kovil', slug: 'kalayar-kovil', name: 'Kalayar Kovil',
    state: 'Tamil Nadu', kind: 'fort', dates: '1772, October 1801',
    summary: 'The forest stronghold of Sivaganga: where Velu Nachiyar’s husband fell to Company and Arcot forces in 1772, and where the Marudhu brothers’ rising ended in October 1801.',
    description: ['In 1772 Company forces with the Nawab of Arcot’s army killed the ruler of Sivaganga at the Kalaiyar Koil battle; his widow Velu Nachiyar escaped to spend eight years building the alliance that retook the kingdom around 1780.[^1]', 'Three decades later Kalayar Kovil was the Marudhu brothers’ stronghold in the South Indian Rebellion. It fell in October 1801; the brothers were captured and hanged at Tiruppathur on 24 October.[^2]'],
    people: ['velu-nachiyar', 'marudhu-brothers'],
    events: ['south-indian-rebellion-1801'],
    sources: [
      { title: 'Sivaganga District Gazetteer', publisher: 'Government of Tamil Nadu', type: 'archive', evidence: 'scholarship' },
      { title: 'Marudhu Pandiyar memorial records, Kalayar Kovil', publisher: 'Government of Tamil Nadu', type: 'government', evidence: 'reference' },
    ],
    editorial: draft,
  },
  {
    id: 'jhansi', slug: 'jhansi', name: 'Jhansi',
    historicalNames: ['Jhansi State (annexed 1854)'],
    state: 'Uttar Pradesh', kind: 'fort', dates: 'March–April 1858',
    summary: 'The walled city and fort Rani Lakshmibai defended for two weeks against Sir Hugh Rose’s Central India Field Force in 1858, and escaped from by night when it fell.',
    description: ['In March 1858 the Central India Field Force besieged Jhansi. The Rani directed the defence from the walls; when the city fell after bombardment and street fighting she escaped through the lines by night and rode to join Tatya Tope. Jhalkari Bai, of the women’s guard, is remembered for impersonating her to cover the escape.[^1]'],
    people: ['rani-lakshmibai', 'jhalkari-bai', 'tatya-tope'],
    events: ['siege-of-jhansi'],
    sources: [{ title: 'The Rani of Jhansi: A Study in Female Heroism in India', author: 'Joyce Lebra-Chapman', publisher: 'University of Hawaii Press', year: 1986, type: 'book', evidence: 'scholarship' }],
    editorial: draft,
  },
  {
    id: 'vedaranyam', slug: 'vedaranyam', name: 'Vedaranyam',
    state: 'Tamil Nadu', kind: 'coast', dates: '30 April 1930',
    summary: 'The salt coast at the end of C. Rajagopalachari’s 240-kilometre march from Tiruchirappalli, where salt was lifted in defiance of the law on 30 April 1930.',
    description: ['Sardar Vedaratnam Pillai organised the coast for the marchers’ arrival. On 30 April 1930 Rajaji lifted salt on the shore and was arrested; mass arrests followed, including Rukmini Lakshmipathi — the first woman in the Madras Presidency jailed in the movement — and the young K. Kamaraj.[^1]'],
    people: ['c-rajagopalachari', 'rukmini-lakshmipathi', 'k-kamaraj'],
    events: ['vedaranyam-salt-march'],
    sources: [{ title: 'Vedaranyam salt satyagraha records, 1930', publisher: 'Tamil Nadu State Archives', type: 'archive', evidence: 'contemporary' }],
    editorial: draft,
  },
  {
    id: 'dandi', slug: 'dandi', name: 'Dandi',
    state: 'Gujarat', kind: 'coast', dates: '6 April 1930',
    summary: 'The beach where, on the morning of 6 April 1930 after twenty-four days’ walking from Sabarmati, Gandhi picked up a lump of natural salt and the Salt Satyagraha began.',
    description: ['Gandhi left Sabarmati Ashram on 12 March 1930 with seventy-eight volunteers and walked village to village for twenty-four days as the world’s press followed. At Dandi beach on 6 April he lifted a lump of natural salt; Sarojini Naidu, beside him, cried "Hail, Deliverer!"[^1]'],
    people: ['mahatma-gandhi', 'sarojini-naidu'],
    events: ['dandi-march'],
    sources: [{ title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' }],
    editorial: draft,
  },
];

export const placeById = new Map(places.map((p) => [p.id, p]));
export const placeBySlug = new Map(places.map((p) => [p.slug, p]));
```
Fighter `locations` (drafted from the records): Kattabomman — `[{ placeId: 'panchalankurichi', kind: 'birth' }, { placeId: 'panchalankurichi', kind: 'activity', note: 'His seat, stormed in 1799' }, { placeId: 'kayathar', kind: 'death', note: 'Hanged 16 October 1799' }]`; Velu Nachiyar — `[{ placeId: 'kalayar-kovil', kind: 'activity', note: 'Her husband was killed here in 1772; she retook Sivaganga around 1780' }]`; Marudhu brothers — `[{ placeId: 'kalayar-kovil', kind: 'activity', note: 'Their stronghold, fallen October 1801' }]`.

Validator: `placeSchema` (fields above; `state` must be a known state name — error; `people`/`events` resolve; citations; unique; draft warns); fighter `locations[].placeId` resolves.

`src/lib/content.ts`:
```ts
import { places, placeById, placeBySlug } from '@/data/places';
export { places, placeById, placeBySlug };
export function placesForState(stateName: string): Place[] { return places.filter((p) => p.state === stateName); }
export function placesForEvent(eventId: string): Place[] { return places.filter((p) => p.events.includes(eventId)); }
export function placesForFighter(f: FreedomFighter): { place: Place; kind: LocationKind; note?: string }[] {
  const fromRecord = (f.locations ?? []).map((l) => ({ place: placeById.get(l.placeId)!, kind: l.kind, note: l.note })).filter((l) => l.place);
  const mentioned = places.filter((p) => p.people.includes(f.id) && !fromRecord.some((l) => l.place.id === p.id)).map((place) => ({ place, kind: 'activity' as LocationKind }));
  return [...fromRecord, ...mentioned];
}
```

- [ ] **Step 3: Pages and ledgers**

`src/pages/PlacesPage.tsx` exports default `PlacesPage` (index grouped by state, `PageIntro` lede stating: "Places are given by their present-day state; historical names appear where they differ.") and named `PlacePage`: hero pane with `Breadcrumbs`, kind stamp, `historicalNames`, dates, a line "in present-day {state}"; `ReadingText` for description; people (`FighterCard compact`), events (`EventRow`), `SourceList`, `SuggestCorrection`, draft stamp. Routes: `{ path: '/places', ... }`, `{ path: '/places/:slug', ... then((m) => ({ default: m.PlacePage })) }`; `routes.mjs` scans `src/data/places.ts` for slugs and adds `/places`.

Profile: a "Places in this life" `aside` section (`aria-label`) after "At a glance": a `<dl>` with kind labels Born / Active / Imprisoned / Exiled / Died and place links. Event page: "Where" chip linking each `placesForEvent`. Map: under the selected state's results, `section aria-label={`Places in ${selected.name}`}` listing `placesForState(selected.name)` as chips.

- [ ] **Step 4: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/places.spec.ts tests/map.spec.ts tests/profile.spec.ts`
```bash
git add src/types/index.ts scripts/validate-content.ts src/lib/content.ts src/lib/routes.tsx scripts/lib/routes.mjs src/data/places.ts src/data/fighters src/data/generated src/components/places.tsx src/pages/PlacesPage.tsx src/pages/FighterProfilePage.tsx src/pages/EventPage.tsx src/pages/MapPage.tsx tests/places.spec.ts
git commit -m "Places as records: six drafted places, typed life-locations, place pages, map and profile links

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Every historical map states its frame

**Files:**
- Modify: `src/pages/MapPage.tsx`, `src/components/route-map.tsx` (Task 3 uses it), `DESIGN.md`

- [ ] **Step 1: A single `GeographyFrame` note**

Add to `src/components/places.tsx`:
```tsx
export function GeographyFrame({ frame, note, vault = false }: { frame: 'present-day' | 'historical'; note?: string; vault?: boolean }) {
  return (
    <p role="note" className={`font-body text-label ${vault ? 'text-paper-300' : 'text-ink-faint'}`}>
      <span className={`stamp mr-2 ${vault ? 'text-brass-bright' : 'text-sepia'}`}>{frame === 'present-day' ? 'Present-day geography' : 'Historical boundaries'}</span>
      {note ?? (frame === 'present-day' ? 'Tiles and names show today’s states, not the political map of the period. A dated historical-boundary view needs reviewed datasets and is not yet available.' : '')}
    </p>
  );
}
```
Render it under the map sheet in `MapPage` (replacing the existing sentence in the lede about tiles) and on every route map (Task 3). `DESIGN.md` gains a rule: "**The Frame Rule.** Any map, route or boundary states whether it shows present-day or dated historical geography, using `GeographyFrame`. Modern borders are never presented as the political geography of 1857 or 1947."

- [ ] **Step 2: Commit**

```bash
git add src/components/places.tsx src/pages/MapPage.tsx DESIGN.md
git commit -m "Every map states its geographical frame

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: One narrated route — the Dandi March

**Files:**
- Modify: `src/types/index.ts`, `scripts/validate-content.ts`, `src/lib/content.ts`, `src/lib/routes.tsx`, `scripts/lib/routes.mjs`
- Create: `src/data/routes/index.ts`, `src/data/routes/dandi-march.ts`, `src/components/route-map.tsx`, `src/pages/RoutePage.tsx`, `tests/route.spec.ts`

**Interfaces:**
```ts
export interface RouteStop {
  id: string; name: string;
  /** Display date, e.g. "12 March 1930". */
  dateLabel: string;
  note: string;                  // one or two sentences; [^n] into route.sources
  /** Schematic position 0–100 on the route map's own canvas — NOT geographic coordinates. */
  x: number; y: number;
  approximate: boolean;          // true unless the location is documented to the site
  placeId?: string;              // link to a Place record when one exists
}
export interface Route {
  id: string; slug: string; title: string; question: string; summary: string;
  frame: 'present-day' | 'historical'; frameNote: string;
  eventId: string;               // the event this route belongs to
  stops: RouteStop[];            // 3–24
  outcome: string[];             // closing paragraphs, [^n] into sources
  sources: SourceRef[];
  editorial: Editorial;
}
```
Component `RouteMap({ route, current, onSelect })`: an inline SVG on the pane; a schematic polyline through the stops; segment `k` is drawn (stroke-dashoffset → 0 over 400ms) when `current >= k`; stop markers are buttons; a static numbered list and a plain text list are always rendered beside it; under no-motion the polyline up to `current` is simply shown. Route `/routes/:slug`.

- [ ] **Step 1: Failing spec**

Create `tests/route.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the route draws one segment per stop as the reader advances, labels approximate stops, and always has a text list', async ({ page }) => {
  await page.goto('/routes/dandi-march');
  await expect(page.getByText('Present-day geography')).toBeVisible();
  const list = page.getByRole('list', { name: 'Stops in order' });
  await expect(list.getByRole('listitem')).toHaveCount(9);
  await expect(page.getByText(/Approximate/).first()).toBeVisible();
  const drawn = () => page.locator('[data-route-segment][data-drawn="true"]').count();
  expect(await drawn()).toBe(0);
  await page.getByRole('button', { name: 'Next stop' }).click();
  expect(await drawn()).toBe(1);
  await expect(page.getByText('12 March 1930').first()).toBeVisible();
  await page.getByRole('button', { name: 'Next stop' }).click();
  expect(await drawn()).toBe(2);
  await page.getByRole('button', { name: 'Previous stop' }).click();
  expect(await drawn()).toBe(1);
});
```

- [ ] **Step 2: Data**

Create `src/data/routes/dandi-march.ts`. Dates and the town list below are the standard published itinerary and **must be verified against the National Gandhi Museum's Dandi March records before review** (see `editorial.notes`); every stop is `approximate: true` because the schematic canvas is not geographic:
```ts
import type { Route } from '@/types';

export const dandiMarch: Route = {
  id: 'dandi-march', slug: 'dandi-march',
  title: 'The Salt March, Sabarmati to Dandi',
  question: 'What did twenty-four days of walking do that a speech could not?',
  summary: 'Gandhi and seventy-eight volunteers walked about 240 miles from Sabarmati Ashram to the sea at Dandi, 12 March to 6 April 1930, to break the salt law in public.',
  frame: 'present-day', frameNote: 'A schematic of the route through present-day Gujarat. Positions are indicative, not surveyed; the coast and towns are drawn for orientation only.',
  eventId: 'dandi-march',
  stops: [
    { id: 'sabarmati', name: 'Sabarmati Ashram, Ahmedabad', dateLabel: '12 March 1930', note: 'Gandhi left the ashram at dawn with seventy-eight chosen volunteers, having announced the plan to the Viceroy in advance.[^1]', x: 22, y: 12, approximate: true },
    { id: 'aslali', name: 'Aslali', dateLabel: '12 March 1930', note: 'The first night’s halt, a few hours south of the ashram; villagers gathered to hear the marchers.', x: 26, y: 20, approximate: true },
    { id: 'nadiad', name: 'Nadiad', dateLabel: '15 March 1930', note: 'Into the Kheda district, where Gandhi had led a peasant satyagraha over land revenue in 1918.', x: 32, y: 30, approximate: true },
    { id: 'anand', name: 'Anand', dateLabel: '17 March 1930', note: 'Public meetings each evening; village headmen along the route began resigning their posts.', x: 36, y: 37, approximate: true },
    { id: 'borsad', name: 'Borsad', dateLabel: '18 March 1930', note: 'The marchers were welcomed by the villages of the 1923 Borsad satyagraha.', x: 38, y: 43, approximate: true },
    { id: 'bharuch', name: 'Bharuch (Broach)', dateLabel: '26 March 1930', note: 'Crossing the Narmada; the world’s press was now following the march village to village.[^1]', x: 44, y: 56, approximate: true },
    { id: 'surat', name: 'Surat', dateLabel: '1 April 1930', note: 'The largest reception of the march; the party rested before the final stretch to the coast.', x: 52, y: 70, approximate: true },
    { id: 'navsari', name: 'Navsari', dateLabel: '4 April 1930', note: 'The last town before the sea; crowds walked the final miles with the volunteers.', x: 58, y: 80, approximate: true },
    { id: 'dandi', name: 'Dandi', dateLabel: '5–6 April 1930', note: 'On the morning of 6 April Gandhi picked up a lump of natural salt on the beach; Sarojini Naidu, beside him, cried "Hail, Deliverer!"[^1]', x: 64, y: 90, approximate: true, placeId: 'dandi' },
  ],
  outcome: [
    'Salt was made and sold illegally across the coasts; C. Rajagopalachari marched to Vedaranyam in the south. In May, volunteers marching on the Dharasana salt works stood rank after rank under police lathis without raising a hand, reported worldwide by Webb Miller.[^1]',
    'Around 90,000 Indians, women in unprecedented numbers, filled the jails before the campaign paused with the Gandhi–Irwin Pact in March 1931. The march turned mass law-breaking into moral spectacle and made the movement truly popular.[^2]',
  ],
  sources: [
    { title: 'Gandhi: The Years That Changed the World', author: 'Ramachandra Guha', publisher: 'Penguin Allen Lane', year: 2018, type: 'book', evidence: 'scholarship' },
    { title: 'Dandi March records and photographs', publisher: 'National Gandhi Museum', type: 'museum', evidence: 'reference' },
  ],
  editorial: { status: 'draft', notes: 'Stop list and dates follow the commonly published itinerary and MUST be verified against National Gandhi Museum / Collected Works records before review. Intermediate-stop notes are context, not sourced claims; add [^n] markers or cut them.' },
};
```
`src/data/routes/index.ts` exports `routes = [dandiMarch]`, `routeBySlug`. Validator: schema (stops 3–24, x/y 0–100, `eventId` resolves, `placeId` resolves, citations in `note` and `outcome`, dates non-empty), unique, draft warns. `content.ts` exports.

- [ ] **Step 3: Component and page**

`src/components/route-map.tsx`:
```tsx
import type { Route } from '@/types';
import { useMotionAllowed } from '@/lib/motion';

export function RouteMap({ route, current, onSelect }: { route: Route; current: number; onSelect: (i: number) => void }) {
  const motion = useMotionAllowed();
  const pts = route.stops.map((s) => ({ x: s.x, y: s.y }));
  return (
    <svg viewBox="0 0 100 100" className="h-auto w-full max-w-xl" role="img" aria-label={`Schematic route with ${route.stops.length} stops; ${current} of ${route.stops.length - 1} segments shown`}>
      {/* the coast, for orientation only */}
      <path d="M 70 0 C 75 30 70 60 66 100" fill="none" stroke="rgba(143,122,69,0.5)" strokeDasharray="1 2" strokeWidth="0.6" />
      {pts.slice(1).map((p, i) => {
        const a = pts[i];
        const len = Math.round(Math.hypot(p.x - a.x, p.y - a.y) * 100) / 100;
        const drawn = current > i;
        return (
          <line
            key={route.stops[i + 1].id}
            data-route-segment
            data-drawn={drawn ? 'true' : 'false'}
            x1={a.x} y1={a.y} x2={p.x} y2={p.y}
            stroke="#c4611f" strokeWidth="1.2" strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={drawn ? 0 : len}
            style={{ transition: motion ? 'stroke-dashoffset 0.4s cubic-bezier(0.22,0.61,0.36,1)' : 'none' }}
          />
        );
      })}
      {pts.map((p, i) => (
        <g key={route.stops[i].id}>
          <circle cx={p.x} cy={p.y} r={i <= current ? 2.2 : 1.6} fill={i <= current ? '#c4611f' : '#f2ede2'} stroke="#17201c" strokeWidth="0.5" onClick={() => onSelect(i)} className="cursor-pointer" />
          <text x={p.x + 3} y={p.y + 1} fontSize="3" fill="#17201c" fontFamily="Archivo Narrow Variable, sans-serif">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
```
`src/pages/RoutePage.tsx`: `useUrlState({ stop: oneOfDefault(<'0'..'8'>, '0') })` is awkward; use local `useState(0)` for `current` (position is not shareable state) and render: hero pane (title, question, `GeographyFrame`), two-column body: `RouteMap` + Previous/Next stop buttons + the current stop's card (name, date, `Approximate location` stamp when `approximate`, `ReadingText` note, place link); beside it `<ol aria-label="Stops in order">` numbered list with date and name (always visible; clicking selects); below, "Outcome" `ReadingText`, `SourceList`, draft stamp, link to the event page. Add route `/routes/:slug` and `routes.mjs` scanning `src/data/routes`. Link the route from `EventPage` when `routes.some(r => r.eventId === summary.id)` ("Follow the route").

- [ ] **Step 4: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/route.spec.ts tests/a11y.spec.ts`
```bash
git add src/types/index.ts scripts/validate-content.ts src/lib/content.ts src/lib/routes.tsx scripts/lib/routes.mjs src/data/routes src/components/route-map.tsx src/pages/RoutePage.tsx src/pages/EventPage.tsx tests/route.spec.ts
git commit -m "One narrated route: the Salt March, drawn stop by stop on a schematic that states its frame

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** verify the stop list and dates; add citations to intermediate stops or trim them; set `reviewed`.

---

### Task 4: One document you can inspect

**Files:**
- Modify: `src/types/index.ts`, `scripts/validate-content.ts`, `src/lib/content.ts`, `src/lib/routes.tsx`, `scripts/lib/routes.mjs`
- Create: `src/data/documents/index.ts`, `src/data/documents/queens-proclamation-1858.ts`, `src/components/document-viewer.tsx`, `src/pages/DocumentPage.tsx`, `tests/document.spec.ts`

**Interfaces:**
```ts
export interface DocumentPassage { id: string; text: string; /** % box on the image, when a scan exists */ box?: { x: number; y: number; w: number; h: number }; guide?: { author?: string; audience?: string; claim?: string; limitation?: string } }
export interface ArchiveDocument {
  id: string; slug: string; title: string; dateLabel: string;
  kind: 'proclamation' | 'letter' | 'newspaper' | 'leaflet' | 'photograph' | 'other';
  /** The scan. Absent until a licensed image is supplied; the page is then text-first. */
  image?: { src: string; width: number; height: number; credit: string; licence: string; created?: string };
  context: string[];             // [^n] into sources
  passages: DocumentPassage[];   // the transcription, in reading order
  transcriptionNote: string;     // where the text comes from and how it was checked
  eventId?: string;
  sources: SourceRef[];
  editorial: Editorial;
}
```
`DocumentViewer({ doc, selected, onSelect })`: when `doc.image` exists, an image in a pan/zoom stage (zoom in / zoom out / reset buttons, arrow-key panning, `transform: translate/scale`), with the selected passage's box highlighted; always beside it the transcription list where selecting a passage highlights its box. No handwriting animation; the text is never delayed.

- [ ] **Step 1: Failing spec**

Create `tests/document.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a document page gives the transcription first, explains author, audience, claim and limitation, and never hides text behind an image', async ({ page }) => {
  await page.goto('/documents/queens-proclamation-1858');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Proclamation');
  const passages = page.getByRole('list', { name: 'Transcription' }).getByRole('listitem');
  await expect(passages).not.toHaveCount(0);
  await passages.first().getByRole('button').click();
  const guide = page.getByRole('region', { name: 'Reading this passage' });
  await expect(guide.getByText('Author')).toBeVisible();
  await expect(guide.getByText('Audience')).toBeVisible();
  await expect(guide.getByText('Limitation')).toBeVisible();
  await expect(page.getByText(/Transcription note/)).toBeVisible();
});
```

- [ ] **Step 2: Data**

Create `src/data/documents/queens-proclamation-1858.ts`. The text of the Proclamation of 1 November 1858 is a Crown publication in the public domain; the wording below must be **checked word for word against a scan or the Parliamentary Papers before review** (`editorial.notes`). No `image` until the owner supplies a licensed scan:
```ts
import type { ArchiveDocument } from '@/types';

export const queensProclamation1858: ArchiveDocument = {
  id: 'queens-proclamation-1858', slug: 'queens-proclamation-1858',
  title: 'Proclamation by the Queen in Council to the Princes, Chiefs and People of India',
  dateLabel: '1 November 1858', kind: 'proclamation', eventId: 'queens-proclamation',
  context: [
    'Read out across India on 1 November 1858, the Proclamation announced that the British Crown had taken over the government of India from the East India Company after the revolt of 1857. It promised to respect treaties with Indian rulers, to refrain from interfering in religion, and to admit Indians to office — promises later nationalists would hold the government to.[^1]',
  ],
  passages: [
    { id: 'transfer', text: 'We have resolved… to take upon Ourselves the Government of the Territories in India heretofore administered in trust for Us by the Honourable East India Company.', guide: { author: 'Queen Victoria, through her Council — in practice the British government.', audience: 'The princes, chiefs and people of India, read aloud in towns and cantonments.', claim: 'Rule has passed from a company to the Crown.', limitation: 'It does not say why: the revolt of 1857 that ended Company rule is never named.' } },
    { id: 'treaties', text: 'We shall respect the Rights, Dignity and Honour of Native Princes as Our own; and We desire that they, as well as Our own Subjects, should enjoy that Prosperity and that social Advancement which can only be secured by internal Peace and good Government.', guide: { author: 'The Crown.', audience: 'Rulers of the princely states, many of whom had stayed loyal in 1857.', claim: 'Annexations of the kind that took Jhansi and Awadh are over.', limitation: 'A promise of respect is not a promise of independence; the states remained under British control.' } },
    { id: 'religion', text: 'Firmly relying Ourselves on the truth of Christianity… We disclaim alike the Right and the Desire to impose Our Convictions on any of Our Subjects… and We do strictly charge and enjoin all those who may be in authority under Us, that they abstain from all interference with the Religious Belief or Worship of any of Our Subjects.', guide: { author: 'The Crown.', audience: 'Soldiers and civilians whose fear for religion and custom had fuelled the revolt.', claim: 'Government will not interfere with religion.', limitation: 'Later laws and practice did not always match; readers should compare the promise with what happened.' } },
    { id: 'office', text: 'It is Our further Will that, so far as may be, Our Subjects, of whatever Race or Creed, be freely and impartially admitted to Offices in Our Service, the Duties of which they may be qualified by their Education, Ability and Integrity duly to discharge.', guide: { author: 'The Crown.', audience: 'Educated Indians.', claim: 'Public office is open to Indians on merit.', limitation: 'Dadabhai Naoroji and the early Congress would spend decades arguing this promise was not kept.' } },
  ],
  transcriptionNote: 'Transcribed from the published text of the Proclamation; spelling and capitalisation follow the original. Ellipses mark omitted passages. To be checked word for word against a scan before review.',
  sources: [
    { title: 'Proclamation by the Queen in Council, 1 November 1858', publisher: 'Parliamentary Papers / India Office Records', type: 'archive', evidence: 'contemporary' },
    { title: 'From Plassey to Partition and After', author: 'Sekhar Bandyopadhyay', publisher: 'Orient BlackSwan', year: 2015, type: 'book', evidence: 'scholarship' },
  ],
  editorial: { status: 'draft', notes: 'Public-domain Crown text. Wording to be verified against a scan; a licensed image (e.g. a Wikimedia Commons scan with its licence recorded) to be added as `image` with credit and licence.' },
};
```
`src/data/documents/index.ts` exports `documents`, `documentBySlug`. Validator: schema, `eventId` resolves, passages ≥ 1 with unique ids, `box` only when `image` present (warn), citations, draft warns. Content export; routes `/documents/:slug`; `routes.mjs` scans `src/data/documents`.

- [ ] **Step 3: Viewer and page**

`src/components/document-viewer.tsx`:
```tsx
import { useState } from 'react';
import type { ArchiveDocument } from '@/types';

export function DocumentViewer({ doc, selected, onSelect }: { doc: ArchiveDocument; selected: string | null; onSelect: (id: string) => void }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const sel = doc.passages.find((p) => p.id === selected);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {doc.image && (
        <figure className="doc p-3">
          <div
            className="relative overflow-hidden bg-paper-200"
            style={{ aspectRatio: `${doc.image.width} / ${doc.image.height}` }}
            tabIndex={0}
            role="group"
            aria-label="Document image. Use the buttons to zoom; arrow keys pan."
            onKeyDown={(e) => {
              const step = 20;
              if (e.key === 'ArrowLeft') setPan((p) => ({ ...p, x: p.x + step }));
              if (e.key === 'ArrowRight') setPan((p) => ({ ...p, x: p.x - step }));
              if (e.key === 'ArrowUp') setPan((p) => ({ ...p, y: p.y + step }));
              if (e.key === 'ArrowDown') setPan((p) => ({ ...p, y: p.y - step }));
            }}
          >
            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center', transition: 'transform 160ms cubic-bezier(0.22,0.61,0.36,1)' }} className="relative h-full w-full">
              <img src={doc.image.src} width={doc.image.width} height={doc.image.height} alt={`Scan of ${doc.title}`} className="h-full w-full object-contain" decoding="async" />
              {sel?.box && <span aria-hidden="true" className="absolute border-2 border-oxide bg-oxide/10" style={{ left: `${sel.box.x}%`, top: `${sel.box.y}%`, width: `${sel.box.w}%`, height: `${sel.box.h}%` }} />}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-ghost !min-h-11" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} aria-label="Zoom in">+</button>
            <button type="button" className="btn-ghost !min-h-11" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} aria-label="Zoom out">−</button>
            <button type="button" className="btn-ghost !min-h-11" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset view</button>
          </div>
          <figcaption className="mt-2 font-body text-label text-ink-faint">{doc.image.credit} · {doc.image.licence}{doc.image.created ? ` · ${doc.image.created}` : ''}</figcaption>
        </figure>
      )}
      <ol className="space-y-2" aria-label="Transcription">
        {doc.passages.map((p, i) => (
          <li key={p.id} className={`doc p-4 ${selected === p.id ? 'border-ink' : ''}`}>
            <button type="button" className="w-full text-left" aria-pressed={selected === p.id} onClick={() => onSelect(p.id)}>
              <span className="num mr-2 font-display text-sm font-bold text-brass-deep">{i + 1}</span>
              <span className="prose-reading">{p.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
```
`src/pages/DocumentPage.tsx`: hero (breadcrumbs, title, date, kind stamp, draft stamp), `ReadingText` context, the viewer, a `section aria-label="Reading this passage"` beneath showing the selected passage's `guide` as a four-row `<dl>` (Author / Audience / Claim / Limitation) with Previous/Next passage buttons, a `Transcription note` paragraph, `SourceList`, link to the event. Selecting a passage never scrolls the page.

- [ ] **Step 4: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/document.spec.ts tests/a11y.spec.ts`
```bash
git add src/types/index.ts scripts/validate-content.ts src/lib/content.ts src/lib/routes.tsx scripts/lib/routes.mjs src/data/documents src/components/document-viewer.tsx src/pages/DocumentPage.tsx tests/document.spec.ts
git commit -m "Document explorer: transcription-first viewer with author/audience/claim/limitation guides

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** verify the wording; supply a licensed scan with credit and licence; then add `image` and passage `box`es.

---

### Task 5: Listening — one narrated trail

**Files:**
- Modify: `src/types/index.ts` (`TrailNarration`, `Trail.narration?`), `scripts/validate-content.ts`
- Create: `src/components/audio-player.tsx`, `tests/audio.spec.ts`
- Modify: `src/pages/TrailPages.tsx` (Listen control on stops), `src/components/reading.tsx` (toolbar "Listen" appears only when narration exists)

**Interfaces:**
```ts
export interface TrailNarration {
  lang: 'en' | 'ta' | 'hi';
  src: string;                 // /audio/trails/<slug>/<lang>.mp3
  narrator: string;
  recordedOn: string;          // ISO date
  reviewedBy?: string;         // pronunciation/date/tone check
  /** Cue per stop paragraph: seconds into the file. */
  cues: { stopId: string; paragraph: number; start: number; end: number }[];
}
// Trail +: narration?: TrailNarration[]
```
`AudioPlayer({ src, cues, stopId, onCue })`: native `<audio>`, play/pause, seek slider, speed (0.8×/1×/1.25×/1.5×), current time; fires `onCue(paragraph)` as playback crosses cue boundaries so the stop page highlights the paragraph; a visible label "Recorded narration by {narrator}, {year} — not a historical recording"; never autoplays.

- [ ] **Step 1: Failing spec (against a fixture)**

Create `tests/audio.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('a stop with narration offers a player that does not autoplay and labels the recording', async ({ page }) => {
  await page.goto('/trails/women-who-led/stop/1');
  const player = page.getByRole('region', { name: 'Listen to this stop' });
  test.skip((await player.count()) === 0, 'no narration recorded yet');
  await expect(player.getByText(/Recorded narration/)).toBeVisible();
  const paused = await player.locator('audio').evaluate((a: HTMLAudioElement) => a.paused);
  expect(paused).toBe(true);
  await expect(player.getByRole('button', { name: 'Play' })).toBeVisible();
  await expect(player.getByRole('slider', { name: 'Seek' })).toBeVisible();
  await expect(player.getByRole('group', { name: 'Speed' })).toBeVisible();
});

test('without narration, no Listen control is shown', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed/stop/1');
  await expect(page.getByRole('button', { name: 'Listen' })).toHaveCount(0);
});
```

- [ ] **Step 2: Component**

`src/components/audio-player.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react';
import { Segmented } from '@/components/ui';

export interface Cue { stopId: string; paragraph: number; start: number; end: number }

export function AudioPlayer({ src, cues, stopId, narrator, recordedOn, onCue }: { src: string; cues: Cue[]; stopId: string; narrator: string; recordedOn: string; onCue: (paragraph: number | null) => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<'0.8' | '1' | '1.25' | '1.5'>('1');
  const stopCues = cues.filter((c) => c.stopId === stopId);
  const first = stopCues[0]?.start ?? 0;
  const last = stopCues[stopCues.length - 1]?.end ?? duration;

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.playbackRate = Number(rate);
  }, [rate]);

  useEffect(() => {
    const current = stopCues.find((c) => time >= c.start && time < c.end);
    onCue(current ? current.paragraph : null);
  }, [time, stopCues, onCue]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      if (a.currentTime < first || a.currentTime >= last) a.currentTime = first;
      void a.play();
    } else a.pause();
  };

  return (
    <section aria-label="Listen to this stop" className="doc p-4">
      <p className="font-body text-label text-ink-faint">
        <span className="stamp mr-2 text-sepia">Recorded narration</span>
        by {narrator}, {recordedOn.slice(0, 4)} — a new recording made for this site, not a historical one. The text below is complete on its own.
      </p>
      <audio ref={ref} src={src} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-seal !min-h-11" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? 'Pause' : 'Play'}</button>
        <input type="range" aria-label="Seek" min={first} max={last || 0} step={0.5} value={Math.min(Math.max(time, first), last || 0)} onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value); }} className="min-w-0 flex-1 accent-oxide" />
        <span className="num font-body text-label text-ink-faint">{Math.floor(Math.max(0, time - first))}s / {Math.floor(Math.max(0, last - first))}s</span>
        <Segmented label="Speed" value={rate} onChange={setRate} options={[{ value: '0.8', label: '0.8×' }, { value: '1', label: '1×' }, { value: '1.25', label: '1.25×' }, { value: '1.5', label: '1.5×' }]} />
      </div>
    </section>
  );
}
```
In `TrailStopPage`, when `trail.narration?.find((n) => n.lang === lang)` exists (lang from Task 6, default `'en'`), render a `Listen` chip in the header that toggles the player; the player sits above the reading text; `onCue` sets `highlightParagraph`, which `ReadingText` receives as a new optional prop `highlight?: number | null` (adds `bg-oxide-wash/60` to that `<p>`). Validator: `src` starts with `/audio/`, `recordedOn` ISO, cues reference real stop ids and paragraph indices, `start < end`, non-overlapping ascending.

- [ ] **Step 3: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/audio.spec.ts tests/trails.spec.ts`
```bash
git add src/types/index.ts scripts/validate-content.ts src/components/audio-player.tsx src/components/reading.tsx src/pages/TrailPages.tsx tests/audio.spec.ts
git commit -m "Listening: a labelled, opt-in narration player with transcript cues for trail stops

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** record one trail (English first), have pronunciation, dates and tone reviewed, add the file under `public/audio/trails/<slug>/en.mp3` and the `narration` entry with cues.

---

### Task 6: One trail in Tamil and Hindi

**Files:**
- Modify: `src/types/index.ts` (`TrailTranslation`, `Trail.translations?`), `scripts/validate-content.ts`, `package.json` (fonts), `src/index.css`
- Create: `src/lib/translations.ts`, `src/lib/translations.test.ts`
- Modify: `src/pages/TrailPages.tsx`, `tests/trails.spec.ts`

**Interfaces:**
```ts
export type TrailLang = 'en' | 'ta' | 'hi';
export interface TrailTranslation {
  lang: Exclude<TrailLang, 'en'>;
  /** The English `version` this translation was made from. */
  sourceVersion: number;
  translator: string;
  title: string; question: string; intro: string;
  stops: { title: string; question?: string; text: string[]; bridge: string; uncertainty?: string; contentNote?: string }[];
  reflection: string;
  activity: { prompt: string; options?: string[]; items?: string[]; explanation: string };
  editorial: Editorial;
}
// Trail +: translations?: TrailTranslation[]
// src/lib/translations.ts
export interface ResolvedTrailText { lang: TrailLang; stale: boolean; title: string; question: string; intro: string; stops: TrailTranslation['stops']; reflection: string; activityPrompt: string; activityExplanation: string; activityOptions?: string[]; activityItems?: string[] }
export function resolveTrailText(trail: Trail, lang: TrailLang): ResolvedTrailText; // falls back to English when missing; stale = sourceVersion < trail.version
export const fontImportFor: Record<Exclude<TrailLang, 'en'>, () => Promise<unknown>>; // dynamic CSS imports
```
URL: `/trails/:slug/...?lang=ta`. `lang` attribute on the reading container. UI chrome stays English. The language switch shows only for languages present in `translations`.

- [ ] **Step 1: Failing unit test**

Create `src/lib/translations.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { resolveTrailText } from './translations';
import type { Trail } from '@/types';

const base = {
  id: 't', slug: 't', version: 2, title: 'T', question: 'Q', theme: 'x', minutes: 5, learningGoal: 'g', intro: 'I', accent: 'indigo',
  stops: [{ id: 's1', title: 'S1', text: ['a'], focus: { kind: 'fighter', id: 'x' }, sources: [{ title: 's', type: 'book' }], bridge: '' }],
  reflection: 'R', activity: { kind: 'choice', prompt: 'P', options: ['1', '2', '3'], answerIndex: 0, explanation: 'E' }, followOn: { label: 'l', to: '/' }, editorial: { status: 'draft' },
} as unknown as Trail;

describe('resolveTrailText', () => {
  it('returns English when no translation exists', () => {
    const out = resolveTrailText(base, 'ta');
    expect(out.lang).toBe('en');
    expect(out.title).toBe('T');
  });
  it('returns the translation and flags staleness against the English version', () => {
    const trail = { ...base, translations: [{ lang: 'ta', sourceVersion: 1, translator: 'x', title: 'த', question: 'கே', intro: 'அ', stops: [{ title: 'ச', text: ['அ'], bridge: '' }], reflection: 'ர', activity: { prompt: 'ப', options: ['௧', '௨', '௩'], explanation: 'வ' }, editorial: { status: 'reviewed' } }] } as unknown as Trail;
    const out = resolveTrailText(trail, 'ta');
    expect(out.lang).toBe('ta');
    expect(out.title).toBe('த');
    expect(out.stale).toBe(true);
  });
});
```

- [ ] **Step 2: Implement**

`src/lib/translations.ts`:
```ts
import type { Trail, TrailLang, TrailTranslation } from '@/types';

export interface ResolvedTrailText {
  lang: TrailLang; stale: boolean; title: string; question: string; intro: string;
  stops: TrailTranslation['stops']; reflection: string; activityPrompt: string; activityExplanation: string; activityOptions?: string[]; activityItems?: string[];
}

export function resolveTrailText(trail: Trail, lang: TrailLang): ResolvedTrailText {
  const t = lang === 'en' ? undefined : trail.translations?.find((x) => x.lang === lang);
  if (!t) {
    return {
      lang: 'en', stale: false, title: trail.title, question: trail.question, intro: trail.intro,
      stops: trail.stops.map((s) => ({ title: s.title, question: s.question, text: s.text, bridge: s.bridge, uncertainty: s.uncertainty, contentNote: s.contentNote })),
      reflection: trail.reflection, activityPrompt: trail.activity.prompt, activityExplanation: trail.activity.explanation,
      activityOptions: trail.activity.kind === 'choice' ? trail.activity.options : undefined,
      activityItems: trail.activity.kind === 'order' ? trail.activity.items.map((i) => i.label) : undefined,
    };
  }
  return {
    lang: t.lang, stale: t.sourceVersion < trail.version, title: t.title, question: t.question, intro: t.intro, stops: t.stops, reflection: t.reflection,
    activityPrompt: t.activity.prompt, activityExplanation: t.activity.explanation, activityOptions: t.activity.options, activityItems: t.activity.items,
  };
}

/** Fonts for the two scripts, loaded only when a translated trail is read. */
export const fontImportFor: Record<Exclude<TrailLang, 'en'>, () => Promise<unknown>> = {
  ta: () => import('@fontsource/noto-sans-tamil/400.css'),
  hi: () => import('@fontsource/noto-serif-devanagari/400.css'),
};
```
Install: `npm install @fontsource/noto-sans-tamil @fontsource/noto-serif-devanagari`. CSS in `src/index.css` components: `[lang='ta'] .prose-reading, [lang='ta'] .text-h1, [lang='ta'] .text-h3 { font-family: 'Noto Sans Tamil', 'Faustina Variable', serif; } [lang='hi'] .prose-reading, [lang='hi'] .text-h1, [lang='hi'] .text-h3 { font-family: 'Noto Serif Devanagari', 'Faustina Variable', serif; }`.

`TrailPages.tsx`: add `lang: oneOfDefault(['en', 'ta', 'hi'] as const, 'en')` to the stop/overview/finish URL schema; `const text = resolveTrailText(trail, lang)`; `useEffect(() => { if (text.lang !== 'en') void fontImportFor[text.lang](); }, [text.lang])`; wrap the translated content in `<div lang={text.lang}>`; a language switch (`Segmented` "Language" with only `en` plus present translations) in the overview and stop headers; a note when `text.stale`: "This translation was made from an earlier English version; wording may differ until it is updated." (Stage 2's `ReadingText` receives the translated paragraphs; citation markers are kept in translations by convention — validator checks `[^n]` in translated text too.) The activity uses translated `prompt/options/items/explanation` but the English `answerIndex`/years.

Validator: `translations[].lang` in `ta|hi`, unique per trail; `stops.length === trail.stops.length` (error); each translated stop `text.length === english.text.length` (warn); `sourceVersion <= trail.version`; `sourceVersion < trail.version` → warn "stale translation"; citations within the stop's `sources`; draft warns.

- [ ] **Step 3: Spec addition**

Append to `tests/trails.spec.ts`:
```ts
test('asking for a language that has no translation falls back to English without a switch', async ({ page }) => {
  await page.goto('/trails/how-resistance-changed/stop/1?lang=ta');
  await expect(page.locator('[data-reading-text]').first()).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('group', { name: 'Language' })).toHaveCount(0);
});
```
(`ReadingText`'s root gets `lang` passed through; when a translation exists the same locator reads `ta` and the group appears — extend this test once the owner supplies a translation.)

- [ ] **Step 4: Run and commit**

Run: `npm run test:unit && npm run validate && npm run typecheck && npm run build && npx playwright test tests/trails.spec.ts`
```bash
git add package.json package-lock.json src/types/index.ts scripts/validate-content.ts src/lib/translations.ts src/lib/translations.test.ts src/index.css src/pages/TrailPages.tsx tests/trails.spec.ts
git commit -m "Trail translations (Tamil, Hindi) versioned against the English source, fonts loaded only there

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** reviewed Tamil and Hindi translations of one trail (recommend `women-who-led` once its English is `reviewed`), added as `translations` entries with `sourceVersion` equal to the trail's `version`.

---

### Task 7: A teacher pack that prints

**Files:**
- Create: `src/pages/TrailTeachPage.tsx`, `tests/teach.spec.ts`
- Modify: `src/lib/routes.tsx`, `src/index.css` (`@media print`), `src/pages/TrailPages.tsx` (link from overview), `src/types/index.ts` (`Trail.teaching?`)

**Interfaces:**
```ts
// Trail +: teaching?: { alignment: string /* labelled "proposed" until an educator reviews */; shortVersion: string[] /* stop ids for a 15-minute version */; prompts: string[]; facilitatorNotes: string[]; editorial: Editorial }
```
Route `/trails/:slug/teach`: overview, learning goal, "Proposed curriculum alignment — pending educator review" (or the reviewed label), the 15-minute version (stops listed), the full lesson (all stops with text and sources), discussion prompts (stop questions + reflection + `teaching.prompts`), a printable timeline (years from each stop's focus event or person), facilitator answers (the activity's answer and explanation), print stylesheet hiding header/footer/nav/buttons.

- [ ] **Step 1: Spec**

Create `tests/teach.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the teacher pack has a 15-minute version, prompts, a timeline and facilitator answers, and prints without the site chrome', async ({ page }) => {
  await page.goto('/trails/women-who-led/teach');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Teach');
  await expect(page.getByText(/proposed curriculum alignment/i)).toBeVisible();
  await expect(page.getByRole('region', { name: '15-minute version' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Discussion prompts' }).getByRole('listitem')).not.toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Printable timeline' }).getByRole('listitem')).not.toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Facilitator answers' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('contentinfo')).toBeHidden();
});
```

- [ ] **Step 2: Implement**

Add `teaching` to the three trails' data with `alignment: 'Proposed: upper-primary and secondary history — resistance to colonial rule; evidence and interpretation. To be reviewed by a qualified educator.'`, `shortVersion` of three stop ids, three prompts, three facilitator notes each, `editorial: { status: 'draft' }`. Print CSS in `src/index.css`:
```css
@media print {
  header, footer, nav, .btn-seal, .btn-ghost, .chip, [role='toolbar'], .postmark { display: none !important; }
  .sheet { padding: 0; }
  body { background: #fff; color: #000; }
  a[href]::after { content: ' (' attr(href) ')'; font-size: 0.8em; }
}
```
`TrailTeachPage` composes: `PageIntro` ("Teach: {title}"), alignment note with `DraftStamp` when draft, `section aria-label="15-minute version"` (the `shortVersion` stops as a numbered list with their questions), `section aria-label="Full lesson"` (every stop: title, question, `ReadingText`, sources compact), `section aria-label="Discussion prompts"` (`<ol>`), `section aria-label="Printable timeline"` (`<ol>` of `{year} — {label}` from each stop's focus: event `date.year`/fighter `birthYear`–`deathYear`), `section aria-label="Facilitator answers"` (activity answer + explanation + `facilitatorNotes`). Route `/trails/:slug/teach` (client-rendered). Link "For teachers and families" from `TrailPage`.

- [ ] **Step 3: Run and commit**

Run: `npm run validate && npm run typecheck && npm run build && npx playwright test tests/teach.spec.ts`
```bash
git add src/types/index.ts scripts/validate-content.ts src/data/trails src/pages/TrailTeachPage.tsx src/lib/routes.tsx src/index.css src/pages/TrailPages.tsx tests/teach.spec.ts
git commit -m "Teacher pack per trail: 15-minute version, prompts, printable timeline, facilitator answers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: A private exploration passport

**Files:**
- Create: `src/pages/PassportPage.tsx`, `tests/passport.spec.ts`
- Modify: `src/lib/routes.tsx`, `scripts/lib/routes.mjs`, `src/components/layout.tsx` (Explore sheet + footer link), `src/pages/TrailPages.tsx` (finish → "Your passport")

- [ ] **Step 1: Spec**

Create `tests/passport.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the passport shows completed trails as stamps, trails in progress, and saved stories — privately, with no ranking', async ({ page }) => {
  await page.goto('/passport');
  await expect(page.getByText(/kept on this device/i)).toBeVisible();
  await expect(page.getByText('Nothing stamped yet')).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem('ift-trails-v1', JSON.stringify({ 'women-who-led': { stop: 5, completed: true, updatedAt: '2026-09-08T10:00:00.000Z' }, 'tamil-nadu-close-to-home': { stop: 2, completed: false, updatedAt: '2026-09-08T11:00:00.000Z' } }));
    localStorage.setItem('ift-bookmarks-v1', JSON.stringify(['usha-mehta']));
  });
  await page.reload();
  const stamps = page.getByRole('region', { name: 'Completed trails' });
  await expect(stamps.getByText('Women who led resistance')).toBeVisible();
  await expect(page.getByRole('region', { name: 'In progress' }).getByRole('link', { name: /Resume at stop 2/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Saved stories' }).getByRole('link', { name: /Usha Mehta/ })).toBeVisible();
  await expect(page.getByText(/streak|rank|points/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Forget this trail' }).first().click();
  await expect(stamps.getByText('Women who led resistance')).toHaveCount(0);
});
```

- [ ] **Step 2: Implement**

`src/pages/PassportPage.tsx`: `usePageMeta('Your passport', …)`; `useTrailProgress()`, `useBookmarks()`; three sections (`Completed trails` — each a pane with a `Postmark lines={['Trail', 'complete']}` and the completion date; `In progress` — `TrailCard`s with resume; `Saved stories` — `FighterCard compact`), each with a "Forget this trail" / "Unsave" button (`clearProgress`, `toggle`), lede: "Everything here is kept on this device only. There is nothing to compete for: a stamp means you reached the end of a trail." Empty states: "Nothing stamped yet", "No saved stories yet". Route `/passport`; add to Explore sheet and footer; `TrailFinishPage` "Where next?" gains "Your passport".

- [ ] **Step 3: Run and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/passport.spec.ts`
```bash
git add src/pages/PassportPage.tsx src/lib/routes.tsx scripts/lib/routes.mjs src/components/layout.tsx src/pages/TrailPages.tsx tests/passport.spec.ts
git commit -m "Exploration passport: private stamps for completed trails, resume list, saved stories

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Save a trail for offline reading

**Files:**
- Create: `src/lib/offline-trail.ts`, `src/lib/offline-trail.test.ts`
- Modify: `src/sw.ts`, `src/lib/pwa.ts`, `src/pages/TrailPages.tsx`, `tests/pwa-offline.spec.ts`

**Interfaces:**
```ts
// src/lib/offline-trail.ts (import-free except types)
export interface TrailUrlResolver { fighterSlug(id: string): string | undefined; eventSlug(id: string): string | undefined; portrait(id: string): string | undefined }
export function trailUrls(trail: Trail, resolve: TrailUrlResolver): string[]; // overview, every stop, finish, focus/also fighter+event pages, their portraits — each once
export function estimateBytes(urls: string[]): number;   // ~60 KB per HTML page, ~45 KB per portrait image; label "about"
export function formatBytes(n: number): string;          // "about 1.2 MB"
// src/lib/pwa.ts
export function cacheTrail(slug: string, urls: string[]): Promise<void>;  // postMessage {type:'CACHE_TRAIL', slug, urls}, resolves on {type:'TRAIL_CACHED', slug}
export function dropTrail(slug: string): Promise<void>;
export function isTrailCached(slug: string): Promise<boolean>;            // caches.has(`trail-${slug}`)
```
`src/sw.ts` handles `CACHE_TRAIL` (opens cache `trail-<slug>`, `addAll(urls)`, posts `TRAIL_CACHED`), `DROP_TRAIL` (`caches.delete`). The navigation handler falls back to any `trail-*` cache match before the offline page.

- [ ] **Step 1: Failing unit test**

Create `src/lib/offline-trail.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { estimateBytes, formatBytes, trailUrls } from './offline-trail';
import type { Trail } from '@/types';

const trail = { slug: 't', stops: [{ id: 'a', focus: { kind: 'fighter', id: 'f1' }, also: [{ kind: 'event', id: 'e1' }] }, { id: 'b', focus: { kind: 'event', id: 'e2' } }] } as unknown as Trail;

describe('trailUrls', () => {
  it('lists every page and portrait a trail needs, once', () => {
    const urls = trailUrls(trail, { fighterSlug: (id) => id, eventSlug: (id) => id, portrait: (id) => (id === 'f1' ? '/images/fighters/f1.jpg' : undefined) });
    expect(urls).toEqual(['/trails/t', '/trails/t/stop/1', '/trails/t/stop/2', '/trails/t/finish', '/fighters/f1', '/images/fighters/f1.jpg', '/events/e1', '/events/e2']);
  });
});
describe('estimate', () => {
  it('is a rough, labelled figure', () => {
    expect(formatBytes(estimateBytes(['/a', '/b', '/images/fighters/x.jpg']))).toBe('about 165 KB');
  });
});
```
In the page, pass `{ fighterSlug: (id) => fighterById.get(id)?.slug, eventSlug: (id) => eventById.get(id)?.slug, portrait: (id) => fighterById.get(id)?.portrait }`.

- [ ] **Step 2: Implement library, SW, page**

`src/sw.ts` additions:
```ts
self.addEventListener('message', (event) => {
  const data = event.data as { type?: string; slug?: string; urls?: string[] } | undefined;
  if (data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (data?.type === 'CACHE_TRAIL' && data.slug && data.urls) {
    event.waitUntil(
      caches.open(`trail-${data.slug}`).then((c) => c.addAll(data.urls!)).then(() => event.source?.postMessage({ type: 'TRAIL_CACHED', slug: data.slug })),
    );
  }
  if (data?.type === 'DROP_TRAIL' && data.slug) event.waitUntil(caches.delete(`trail-${data.slug}`));
});
```
and in the navigation route's catch: `return (await caches.match(request)) ?? (await caches.match(OFFLINE_URL)) ?? Response.error();` (a `caches.match` across all caches finds `trail-*` entries). Note `/trails/<slug>/stop/n` is client-rendered: caching those URLs stores the SPA shell response, which works offline because the JS chunks are precached and the trail data is in the bundle — verify in the spec.

`TrailPage` (overview) gets an "Offline" block: `Save this trail for offline reading (about N KB)` / `Saved for offline · Remove`, using `isTrailCached` on mount, `cacheTrail`, `dropTrail`; disabled with a note when `!('serviceWorker' in navigator)`.

- [ ] **Step 3: Spec**

Append to `tests/pwa-offline.spec.ts`:
```ts
test('saving a trail for offline puts its pages in a trail cache, and removing it empties them', async ({ page }) => {
  await page.goto('/trails/women-who-led');
  await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => true));
  await page.getByRole('button', { name: /Save this trail for offline/ }).click();
  await expect(page.getByText(/Saved for offline/)).toBeVisible();
  const cached = await page.evaluate(async () => (await caches.has('trail-women-who-led')) && (await (await caches.open('trail-women-who-led')).match('/trails/women-who-led/stop/1')) !== undefined);
  expect(cached).toBe(true);
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect.poll(() => page.evaluate(() => caches.has('trail-women-who-led'))).toBe(false);
});
```

- [ ] **Step 4: Run and commit**

Run: `npm run test:unit && npm run typecheck && npm run build && npx playwright test tests/pwa-offline.spec.ts tests/trails.spec.ts`
```bash
git add src/lib/offline-trail.ts src/lib/offline-trail.test.ts src/sw.ts src/lib/pwa.ts src/pages/TrailPages.tsx tests/pwa-offline.spec.ts
git commit -m "Save a trail for offline reading, with a size estimate and a remove control

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Close the stage — deferred items, README, and the pilot dashboard

**Files:**
- Modify: `README.md`, `PRODUCT.md`, `docs/superpowers/plans/2026-09-08-improvement-roadmap.md`

- [ ] **Step 1: README and PRODUCT**

README Highlights: add Places, Routes, Documents, Trails (with listening and translations), Teacher packs, Passport, offline trails. PRODUCT.md: update the language constraint to the 8 September decision (reviewed Tamil/Hindi trail translations allowed; UI Latin-first), and "Operating Context" counts.

- [ ] **Step 2: Deferred items, recorded**

In the roadmap's "Deferred" section, confirm what remains after the pilot and why: parallel histories ("Meanwhile elsewhere"), exhibition mode, community contributions, conversational guide, portrait-to-biography transition, boundary toggle. Each with its precondition from §15/§16.

- [ ] **Step 3: Pilot dashboard queries**

Add `docs/pilot-queries.md` with the Analytics Engine SQL for the pilot questions (trail starts vs completions per trail; source opens per 100 stop views; glossary opens per route; quiz reviews), and the manual rubric for understanding and evidence tasks.

- [ ] **Step 4: Full gate and commit**

Run: `npm run typecheck && npm run validate && npm run search:check && npm run test:unit && npm run build && npm test && npm run lighthouse`
```bash
git add README.md PRODUCT.md docs/superpowers/plans/2026-09-08-improvement-roadmap.md docs/pilot-queries.md
git commit -m "Stage 4 close: document the extensions, the deferred list and the pilot queries

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Stage 4 exit checklist

- [ ] Places: six drafted records, typed life-locations, pages, map and profile links; every map states its frame.
- [ ] Dandi route draws stop by stop, labels approximate positions, always has a text list; owner has verified stops.
- [ ] Document explorer is transcription-first with author/audience/claim/limitation guides; scan added when licensed.
- [ ] Listening: player never autoplays, is labelled as a new recording, syncs to paragraphs; one trail recorded.
- [ ] Translations versioned against English; fonts only on translated routes; UI stays English; one trail translated and reviewed.
- [ ] Teacher pack prints; alignment labelled "proposed" until an educator reviews.
- [ ] Passport is private and non-competitive.
- [ ] Trails can be saved for offline with an estimate and removed.
- [ ] Every new record type validates; drafts stamped; full gate green.
