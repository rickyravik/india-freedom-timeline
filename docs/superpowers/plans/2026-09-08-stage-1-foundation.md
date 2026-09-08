# Stage 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read `2026-09-08-improvement-roadmap.md` first — its Global Constraints and Decisions apply to every task here.

**Goal:** Fix the review findings that make the current site hard to trust and share: one search engine everywhere, filters and selections that survive reload and sharing, metadata that points at the real domain, a correction route that actually reaches someone, a readable event directory, an accessible state selector, and a unit-test runner so the pure logic added from here on is tested.

**Architecture:** No new pages. One new pure module (`src/lib/url-state.ts`) and one new hook (`useUrlState`) carry filter state in the query string with a hydration-safe initialiser. The People page reuses `src/lib/search-core.ts`. The events page becomes one chronological list. Public URL and correction inbox come from a committed `.env`. Wrangler stops rebuilding on deploy so CI ships the artifact it tested.

**Tech Stack:** Existing stack plus `vitest` (dev dependency) for unit tests.

## Global Constraints

See the roadmap. Specific to this stage:

- Nothing here may change any hydration behaviour of a prerendered page: every new `useState` initialiser must produce the same output at build time (no query string) and at first hydration render.
- `npm run typecheck`, `npm run validate`, `npm run search:check`, `npm run test:unit`, `npm run build` and `npm test` must all pass before each commit.
- Filter/query state is written with `replace: true` (history is not polluted by every keystroke); back/forward still re-reads the URL.
- Copy rule from the proposal: never describe a missing "today" record as a gap in history, only a gap in the collection.

## File structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` (new) | Unit-test runner config, `@/` alias, node environment |
| `.env` (new, committed) | `VITE_SITE_URL`, `VITE_CORRECTIONS_EMAIL` |
| `scripts/lib/site.mjs` (new) | Reads `VITE_SITE_URL` for node scripts |
| `src/lib/url-state.ts` (new) | Pure codecs + parse/serialize for query-string state |
| `src/lib/corrections.ts` (new) | Pure fallback-link builder for the correction form |
| `src/lib/hooks.ts` | `useUrlState`, `isHydratingFirstRender` |
| `src/components/ui.tsx` | `ActiveFilters`; `SuggestCorrection` retry + recipient; `LifespanBar` beyond-frame caption |
| `src/components/cards.tsx` | `EventRow` (full-width ledger row) |
| `src/components/layout.tsx` | `ScrollManager` replaces `ScrollToTop` |
| `src/pages/*.tsx` | Wire URL state, shared search, copy fixes, map selector |
| `src/types/index.ts`, `scripts/lib/summaries.ts`, `scripts/validate-content.ts`, `docs/templates/fighter.template.ts` | Optional `shortName` |
| `tests/*.spec.ts` | New regression specs |

---

### Task 1: Add the unit-test runner

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/search-core.test.ts`
- Modify: `package.json` (scripts, devDependencies)
- Modify: `tsconfig.json` (include `vitest.config.ts`)
- Modify: `.github/workflows/ci.yml` (add a unit-test step)

**Interfaces:**
- Produces: `npm run test:unit` — runs every `src/**/*.test.ts` and `scripts/**/*.test.ts` under vitest with the `@/` alias resolving to `src/`.

- [ ] **Step 1: Install vitest**

Run:
```bash
npm install --save-dev vitest
```
Expected: `package.json` devDependencies gains `"vitest": "^..."` and `package-lock.json` updates.

- [ ] **Step 2: Create the config**

Create `vitest.config.ts`:
```ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Unit tests for pure logic only (url-state codecs, search scoring, reading
 * time, glossary matching...). Components and pages are covered end-to-end by
 * Playwright (`npm test`), which runs against the real production build.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Add the script and include the config in typecheck**

In `package.json` `scripts`, add after `"search:check"`:
```json
    "test:unit": "vitest run",
```

In `tsconfig.json`, change `"include": ["src", "vite.config.ts"]` to:
```json
  "include": ["src", "vite.config.ts", "vitest.config.ts"],
```

- [ ] **Step 4: Write the first failing-then-passing test**

Create `src/lib/search-core.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildIndex, normalizeTranslit, searchIndex } from './search-core';

describe('normalizeTranslit', () => {
  it('collapses the laxmi / lakshmi spelling variants to one string', () => {
    expect(normalizeTranslit('Laxmibai')).toBe(normalizeTranslit('Lakshmibai'));
  });

  it('collapses doubled consonants', () => {
    expect(normalizeTranslit('Katabomman')).toBe(normalizeTranslit('Kattabomman'));
  });
});

describe('searchIndex on a people-only index', () => {
  const index = buildIndex(
    [
      { slug: 'rani-lakshmibai', name: 'Rani Lakshmibai of Jhansi', states: ['Uttar Pradesh'], summary: 'Queen of Jhansi', roles: ['ruler'], movements: ['great-revolt'], birthYear: 1828, deathYear: 1858 },
      { slug: 'bhagat-singh', name: 'Bhagat Singh', states: ['Punjab'], summary: 'Revolutionary', roles: ['revolutionary'], movements: ['revolutionary-movement'], birthYear: 1907, deathYear: 1931 },
    ],
    [],
    [],
  );

  it('finds Lakshmibai from the colloquial spelling, flagged as a fuzzy hit', () => {
    const [top] = searchIndex(index, 'laxmibai');
    expect(top?.to).toBe('/fighters/rani-lakshmibai');
    expect(top?.exact).toBe(false);
  });

  it('returns nothing for a query under two characters', () => {
    expect(searchIndex(index, 'b')).toEqual([]);
  });
});
```

- [ ] **Step 5: Run it**

Run: `npm run test:unit`
Expected: `Test Files 1 passed`, `Tests 4 passed`.

- [ ] **Step 6: Add the CI step**

In `.github/workflows/ci.yml`, after the `Typecheck` step add:
```yaml
      - name: Unit tests
        run: npm run test:unit
```

- [ ] **Step 7: Typecheck and commit**

Run: `npm run typecheck`
Expected: no output (exit 0).

```bash
git add vitest.config.ts src/lib/search-core.test.ts package.json package-lock.json tsconfig.json .github/workflows/ci.yml
git commit -m "Add vitest for unit-testing pure logic

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: One source of truth for the public URL, and deploy the tested artifact

**Files:**
- Create: `.env`
- Create: `scripts/lib/site.mjs`
- Create: `scripts/lib/site.test.ts`
- Create: `tests/metadata.spec.ts`
- Modify: `index.html` (5 hard-coded URLs)
- Modify: `src/lib/hooks.ts:12`
- Modify: `vite.config.ts` (fail the build when the URL is unset)
- Modify: `scripts/generate-sitemap.mjs` (use `site.mjs`, also write `robots.txt`)
- Delete: `public/robots.txt`
- Modify: `wrangler.jsonc` (remove `build`)
- Modify: `README.md` (Deploying section)

**Interfaces:**
- Produces: `import.meta.env.VITE_SITE_URL` (string, no trailing slash) in app code; `SITE_URL` export from `scripts/lib/site.mjs` for node scripts.

- [ ] **Step 1: Create `.env`**

`.gitignore` ignores only `*.local`, so this file is committed. Create `.env`:
```
# Public origin of the deployed site, no trailing slash. Every canonical, Open
# Graph, sitemap, robots and JSON-LD URL derives from this one line. Change it
# when a custom domain exists.
VITE_SITE_URL=https://india-freedom-timeline.ravi-kumar-f73.workers.dev

# Inbox for the "suggest a correction" email fallback (see src/lib/corrections.ts).
# Leave empty and the fallback offers a pre-filled GitHub issue instead.
VITE_CORRECTIONS_EMAIL=

# Pilot event counting (Stage 2, Task 14). "on" enables POST /api/event beacons.
VITE_EVENTS=off
```

- [ ] **Step 2: Write the failing unit test for the node-side reader**

Create `scripts/lib/site.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { SITE_URL } from './site.mjs';

describe('SITE_URL', () => {
  it('is an absolute https origin with no trailing slash', () => {
    expect(SITE_URL).toMatch(/^https:\/\/[a-z0-9.-]+$/);
  });
});
```

Run: `npm run test:unit`
Expected: FAIL — `Cannot find module './site.mjs'`.

- [ ] **Step 3: Create `scripts/lib/site.mjs`**

```js
/**
 * The deployed site's public origin, for node scripts (sitemap, robots).
 * Read from .env via Vite's own loader so scripts and app agree; a process
 * env var of the same name overrides the file (how CI would swap domains).
 */
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
export const SITE_URL = (env.VITE_SITE_URL ?? '').replace(/\/$/, '');

if (!SITE_URL) {
  throw new Error('VITE_SITE_URL is not set — add it to .env (see README, "Configuration").');
}
```

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 4: Point `index.html` at the env variable**

Vite substitutes `%VITE_*%` in `index.html` at build time. Replace every `https://india-freedom-timeline.pages.dev` in `index.html` with `%VITE_SITE_URL%` — the five occurrences are the canonical `href`, `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url`. After the change these lines read:

```html
    <link rel="canonical" href="%VITE_SITE_URL%/" />
```
```html
    <meta property="og:url" content="%VITE_SITE_URL%/" />
    <meta property="og:image" content="%VITE_SITE_URL%/og/default.jpg" />
```
```html
    <meta name="twitter:image" content="%VITE_SITE_URL%/og/default.jpg" />
```
```json
        "url": "%VITE_SITE_URL%/",
```

- [ ] **Step 5: Drop the fallback in `hooks.ts` and guard the build**

In `src/lib/hooks.ts` replace line 12:
```ts
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://india-freedom-timeline.pages.dev';
```
with:
```ts
/* Set in .env; vite.config.ts fails the build if it's missing, so this is never undefined at runtime. */
const SITE_URL = (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '');
```

In `vite.config.ts`, inside `defineConfig(({ mode }) => {` right after `const env = loadEnv(...)`, add:
```ts
  if (!env.VITE_SITE_URL) {
    throw new Error('VITE_SITE_URL is not set — add it to .env (see README, "Configuration").');
  }
```

- [ ] **Step 6: Generate `robots.txt` alongside the sitemap**

Replace `scripts/generate-sitemap.mjs` with:
```js
/**
 * Generates dist/sitemap.xml and dist/robots.txt after build.
 * Route list comes from scripts/lib/routes.mjs, shared with the prerender
 * script, so the sitemap always matches what actually got prerendered. The
 * origin comes from scripts/lib/site.mjs, shared with the app's own meta tags.
 */
import { writeFileSync } from 'node:fs';
import { getAllRoutes } from './lib/routes.mjs';
import { SITE_URL } from './lib/site.mjs';

const urls = getAllRoutes();
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('dist/sitemap.xml', xml);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync('dist/robots.txt', robots);

console.log(`sitemap.xml written with ${urls.length} URLs; robots.txt points at ${SITE_URL}`);
```

Delete the static copy so it cannot drift:
```bash
git rm public/robots.txt
```

- [ ] **Step 7: Stop Wrangler rebuilding on deploy**

In `wrangler.jsonc`, delete the whole `"build": { ... }` block and its comment (lines 11–22), and replace with this comment in its place:
```jsonc
  // No `build.command`: CI (.github/workflows/ci.yml) builds and tests dist/
  // first and then runs `wrangler deploy`, which must ship exactly that tested
  // artifact rather than rebuilding it. `wrangler deploy` therefore requires
  // an existing dist/ — run `npm run build` first when deploying by hand.
```

- [ ] **Step 8: Write the end-to-end metadata spec**

Create `tests/metadata.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { loadEnv } from 'vite';

const SITE_URL = loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL.replace(/\/$/, '');

test('canonical, Open Graph and robots all point at the configured public origin', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/fighters/bhagat-singh`);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}/fighters/bhagat-singh`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${SITE_URL}/og/fighters/bhagat-singh.jpg`);

  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/`);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld ?? '{}').url).toBe(`${SITE_URL}/`);

  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  const sitemap = await page.request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain(`<loc>${SITE_URL}/timeline</loc>`);
});
```

- [ ] **Step 9: Build and run the spec**

Run: `npm run build && npx playwright test tests/metadata.spec.ts`
Expected: build succeeds (prerender logs no errors); `1 passed`.

- [ ] **Step 10: Update the README**

In `README.md`, replace the paragraph starting `Optionally set `SITE_URL=...`` with a new subsection placed before "Privacy and analytics":

```markdown
## Configuration

Build-time settings live in the committed `.env` file and are read through `import.meta.env.VITE_*` in the app and `scripts/lib/site.mjs` in the build scripts:

- `VITE_SITE_URL` — the public origin, no trailing slash. Drives every canonical, Open Graph, JSON-LD, sitemap and robots URL. Change this one line when a custom domain is attached.
- `VITE_CORRECTIONS_EMAIL` — inbox for the correction form's email fallback. Empty means the fallback offers a pre-filled GitHub issue instead.
- `VITE_EVENTS` — `on` enables the pilot's coarse event beacons (see Analytics).

A process environment variable of the same name overrides the file, which is how CI can build for a different domain without editing the repo.
```

And in the Deploying section, replace the sentence about `build.command` (`` `build.command` runs `npm run build`, so `wrangler deploy` is self-contained... ``) with:

```markdown
- There is deliberately no `build.command`: GitHub Actions builds and tests `dist/` and then deploys that exact artifact. Deploying by hand means `npm run build && npx wrangler deploy`.
```

Also update the dashboard sentence to say the deploy is driven from GitHub Actions, and correct "Cloudflare Pages" in the Tech stack bullet to "Cloudflare Workers Assets".

- [ ] **Step 11: Full check and commit**

Run: `npm run typecheck && npm run test:unit && npm test`
Expected: all green.

```bash
git add .env scripts/lib/site.mjs scripts/lib/site.test.ts tests/metadata.spec.ts index.html src/lib/hooks.ts vite.config.ts scripts/generate-sitemap.mjs wrangler.jsonc README.md
git commit -m "Derive every public URL from VITE_SITE_URL and deploy the tested dist

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: The People page uses the shared search engine

**Files:**
- Modify: `src/pages/FightersPage.tsx`
- Modify: `scripts/search-check.ts` (add a people-only case)
- Create: `tests/people-search.spec.ts`

**Interfaces:**
- Consumes: `buildIndex`, `searchIndex` from `src/lib/search-core.ts`.

- [ ] **Step 1: Add the failing search-check case**

In `scripts/search-check.ts`, after the `const index = buildIndex(...)` line add:
```ts
// The People page filters with a people-only index (no events/movements), so
// the same spelling tolerance must hold there — this was the 7 September
// finding: "laxmibai" worked in global search and found nobody under People.
const peopleIndex = buildIndex(fighterSummaries, [], []);
```
and after the `cases` loop, before the timing summary:
```ts
{
  const top = searchIndex(peopleIndex, 'laxmibai', 5)[0];
  const ok = top?.to.includes('lakshmibai');
  console.log(`${ok ? 'ok  ' : 'FAIL'} people-only "laxmibai" -> ${top?.to ?? '(no results)'}`);
  if (!ok) failed = true;
}
```
Run: `npm run search:check` — Expected: passes already (the engine is fine; the page wasn't using it). This case guards the engine the page is about to adopt.

- [ ] **Step 2: Write the failing e2e spec**

Create `tests/people-search.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the People page search tolerates the same spelling variants as global search', async ({ page }) => {
  await page.goto('/fighters');
  await page.getByLabel('Search by name, place or tag').fill('laxmibai');
  await expect(page.getByRole('link', { name: /Rani Lakshmibai/ })).toBeVisible();
  await expect(page.getByText(/Did you mean/)).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(/Showing 1 of/);
});

test('an empty People result offers the whole-archive search', async ({ page }) => {
  await page.goto('/fighters');
  await page.getByLabel('Search by name, place or tag').fill('zzzzqq');
  await expect(page.getByText('No one matches these filters')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search the whole archive' })).toHaveAttribute('href', '/search?q=zzzzqq');
});
```
Run: `npx playwright test tests/people-search.spec.ts` — Expected: FAIL (no Lakshmibai card, no hint).

- [ ] **Step 3: Rewrite the filter in `FightersPage.tsx`**

Add imports:
```ts
import { Link } from 'react-router-dom';
import { buildIndex, searchIndex } from '@/lib/search-core';
```
Add at module scope, after `const eraValues = ...`:
```ts
/* People-only index, built once. Same four-tier matcher as global search, so
   a spelling that works in the palette works here too. */
const peopleIndex = buildIndex(fighters, [], []);
```
Replace the `results` memo with:
```ts
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
```
Under the `role="status"` count paragraph, add the hint:
```tsx
        {fuzzyHint && (
          <p className="label mb-3">
            Did you mean <span className="font-semibold text-sepia">{fuzzyHint}</span>?
          </p>
        )}
```
Change the empty state so a query offers the archive-wide search:
```tsx
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
```
Note: a one-character query no longer narrows the list (the engine needs two characters). That matches the palette and the Search page.

- [ ] **Step 4: Run the specs**

Run: `npm run typecheck && npm run build && npx playwright test tests/people-search.spec.ts`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/FightersPage.tsx scripts/search-check.ts tests/people-search.spec.ts
git commit -m "Use the shared fuzzy search engine on the People page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: `url-state` codecs and a hydration-safe `useUrlState` hook

**Files:**
- Create: `src/lib/url-state.ts`
- Create: `src/lib/url-state.test.ts`
- Modify: `src/lib/hooks.ts` (add `isHydratingFirstRender`, `useUrlState`)
- Modify: `src/main.tsx` (mark hydration on `#root`, manual scroll restoration)
- Modify: `src/App.tsx` (clear the hydration mark after first commit)

**Interfaces:**
- Produces:
  ```ts
  // src/lib/url-state.ts
  export interface ParamCodec<T> { parse(raw: string | null): T; serialize(value: T): string | null }
  export type Schema = Record<string, ParamCodec<unknown>>;
  export type StateOf<S extends Schema> = { [K in keyof S]: S[K] extends ParamCodec<infer T> ? T : never };
  export function parseParams<S extends Schema>(schema: S, params: URLSearchParams): StateOf<S>;
  export function serializeParams<S extends Schema>(schema: S, state: StateOf<S>, current: URLSearchParams): URLSearchParams;
  export function oneOf<T extends string>(allowed: readonly T[]): ParamCodec<T | null>;
  export function oneOfDefault<T extends string>(allowed: readonly T[], fallback: T): ParamCodec<T>;
  export function text(): ParamCodec<string>;
  export function flag(): ParamCodec<boolean>;      // '1' = on; absent = off
  // src/lib/hooks.ts
  export function isHydratingFirstRender(): boolean;
  export function useUrlState<S extends Schema>(schema: S): [StateOf<S>, (patch: Partial<StateOf<S>>) => void, () => void];
  ```
- Schema objects must be defined at module scope (stable identity).

- [ ] **Step 1: Write the failing unit tests**

Create `src/lib/url-state.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { flag, oneOf, oneOfDefault, parseParams, serializeParams, text } from './url-state';

const schema = {
  region: oneOf(['north', 'south'] as const),
  view: oneOfDefault(['chapters', 'full'] as const, 'full'),
  q: text(),
};

describe('parseParams', () => {
  it('returns defaults for an empty query string', () => {
    expect(parseParams(schema, new URLSearchParams())).toEqual({ region: null, view: 'full', q: '' });
  });
  it('accepts allowed values and rejects unknown ones', () => {
    expect(parseParams(schema, new URLSearchParams('region=south&view=nonsense&q=salt'))).toEqual({ region: 'south', view: 'full', q: 'salt' });
  });
});

describe('serializeParams', () => {
  it('omits keys at their default and keeps unrelated keys', () => {
    const out = serializeParams(schema, { region: null, view: 'full', q: '  ' }, new URLSearchParams('other=1'));
    expect(out.toString()).toBe('other=1');
  });
  it('writes non-default values', () => {
    const out = serializeParams(schema, { region: 'north', view: 'chapters', q: 'salt' }, new URLSearchParams());
    expect(Object.fromEntries(out)).toEqual({ region: 'north', view: 'chapters', q: 'salt' });
  });
  it('round-trips', () => {
    const state = { region: 'south' as const, view: 'chapters' as const, q: 'Dandi march' };
    expect(parseParams(schema, serializeParams(schema, state, new URLSearchParams()))).toEqual(state);
  });
});

describe('flag', () => {
  it('reads "1" as on and omits the key when off', () => {
    const s = { text: flag() };
    expect(parseParams(s, new URLSearchParams('text=1'))).toEqual({ text: true });
    expect(parseParams(s, new URLSearchParams())).toEqual({ text: false });
    expect(serializeParams(s, { text: false }, new URLSearchParams()).toString()).toBe('');
    expect(serializeParams(s, { text: true }, new URLSearchParams()).toString()).toBe('text=1');
  });
});
```
Run: `npm run test:unit` — Expected: FAIL, module not found.

- [ ] **Step 2: Create `src/lib/url-state.ts`**

```ts
/**
 * Pure query-string codecs for filter and view state, so a filtered list,
 * a selected map state or a reading view can be reloaded and shared. The
 * React side is `useUrlState` in src/lib/hooks.ts; this module has no React
 * so it can be unit-tested directly.
 *
 * A codec's `serialize` returns null for the default state, which removes the
 * key from the URL — a clean URL always means "defaults".
 */
export interface ParamCodec<T> {
  parse(raw: string | null): T;
  serialize(value: T): string | null;
}

export type Schema = Record<string, ParamCodec<unknown>>;

export type StateOf<S extends Schema> = {
  [K in keyof S]: S[K] extends ParamCodec<infer T> ? T : never;
};

export function parseParams<S extends Schema>(schema: S, params: URLSearchParams): StateOf<S> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(schema)) out[key] = schema[key].parse(params.get(key));
  return out as StateOf<S>;
}

/** Writes the schema's keys into a copy of `current`, leaving other keys alone. */
export function serializeParams<S extends Schema>(schema: S, state: StateOf<S>, current: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(current);
  for (const key of Object.keys(schema)) {
    const value = (schema[key] as ParamCodec<unknown>).serialize(state[key]);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
  }
  return next;
}

/** One of a fixed set, or null (the "All" state). */
export function oneOf<T extends string>(allowed: readonly T[]): ParamCodec<T | null> {
  return {
    parse: (raw) => (raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : null),
    serialize: (value) => value,
  };
}

/** One of a fixed set with a non-null default that is never written to the URL. */
export function oneOfDefault<T extends string>(allowed: readonly T[], fallback: T): ParamCodec<T> {
  return {
    parse: (raw) => (raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback),
    serialize: (value) => (value === fallback ? null : value),
  };
}

/** Free text; blank is the default. */
export function text(): ParamCodec<string> {
  return {
    parse: (raw) => raw ?? '',
    serialize: (value) => (value.trim() ? value : null),
  };
}

/** A switch; "1" means on, absent means off. */
export function flag(): ParamCodec<boolean> {
  return {
    parse: (raw) => raw === '1',
    serialize: (value) => (value ? '1' : null),
  };
}
```
Run: `npm run test:unit` — Expected: PASS (6 tests in this file).

- [ ] **Step 3: Mark the hydration render**

In `src/main.tsx`, replace the final block:
```ts
  const rootEl = document.getElementById('root')!;
```
…through `bootstrap();` with:
```ts
  const rootEl = document.getElementById('root')!;
  const app = (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
  // Restored by ScrollManager (src/components/layout.tsx), not the browser:
  // lazily loaded routes aren't tall enough yet when the browser would try.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (rootEl.hasChildNodes()) {
    // Tells useUrlState's initialisers this first render must match the
    // prerendered snapshot (which was captured with no query string). App
    // clears it after the first commit.
    rootEl.dataset.hydrating = 'true';
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
}

bootstrap();
```

In `src/App.tsx`, add `useEffect` to the React import and inside `App()` before `return`:
```tsx
  /* The hydration mark set by main.tsx is only meaningful for the very first
     render; every state initialiser that needs it has run by the time this
     effect fires (children's effects run first, but they only read the flag
     during render). */
  useEffect(() => {
    delete document.getElementById('root')?.dataset.hydrating;
  }, []);
```

- [ ] **Step 4: Add the hook to `hooks.ts`**

Add to the imports at the top of `src/lib/hooks.ts`:
```ts
import { useSearchParams } from 'react-router-dom';
import { parseParams, serializeParams, type Schema, type StateOf } from '@/lib/url-state';
```
(Keep the existing `useLocation` import; merge into one `react-router-dom` import line.)

Append a new section before `/* Page meta */`:
```ts
/* ------------------------------------------------------------------ */
/* URL state                                                           */

/** True only during the first render of a prerendered page in a real browser
    (set on #root by main.tsx before hydrateRoot, cleared by App afterwards).
    Prerendered HTML was captured with no query string, so any state that
    normally initialises from the URL must initialise to its defaults during
    this one render or React reports a hydration mismatch. */
export function isHydratingFirstRender(): boolean {
  return typeof document !== 'undefined' && document.getElementById('root')?.dataset.hydrating === 'true';
}

const EMPTY_PARAMS = new URLSearchParams();

/**
 * Filter/view state that lives in the query string. `schema` must be a
 * module-scope constant. Returns [state, update(patch), reset()]. Writes use
 * replace, so typing in a filter never litters history; back/forward still
 * re-read the URL.
 */
export function useUrlState<S extends Schema>(schema: S): [StateOf<S>, (patch: Partial<StateOf<S>>) => void, () => void] {
  const [params, setParams] = useSearchParams();
  const deferred = useRef(isHydratingFirstRender());
  const [state, setState] = useState<StateOf<S>>(() => parseParams(schema, deferred.current ? EMPTY_PARAMS : params));
  const stateRef = useRef(state);
  stateRef.current = state;

  /* After hydration, adopt what the URL actually says. */
  useEffect(() => {
    if (!deferred.current) return;
    deferred.current = false;
    setState(parseParams(schema, new URLSearchParams(window.location.search)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Back/forward (or a Link to the same page with other params). */
  const paramsKey = params.toString();
  useEffect(() => {
    if (deferred.current) return;
    setState(parseParams(schema, params));
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (patch: Partial<StateOf<S>>) => {
      const next = { ...stateRef.current, ...patch };
      setState(next);
      setParams(serializeParams(schema, next, new URLSearchParams(window.location.search)), { replace: true });
    },
    [schema, setParams],
  );
  const reset = useCallback(() => update(parseParams(schema, EMPTY_PARAMS)), [schema, update]);

  return [state, update, reset];
}
```

- [ ] **Step 5: Typecheck and unit tests**

Run: `npm run typecheck && npm run test:unit`
Expected: both pass. (`usePageMeta`'s `useLocation` import is unchanged.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/url-state.ts src/lib/url-state.test.ts src/lib/hooks.ts src/main.tsx src/App.tsx
git commit -m "Add url-state codecs and a hydration-safe useUrlState hook

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Filters and views live in the URL, with visible active-filter chips

**Files:**
- Modify: `src/components/ui.tsx` (add `ActiveFilters`)
- Modify: `src/pages/TimelinePage.tsx`
- Modify: `src/pages/FightersPage.tsx`
- Modify: `src/pages/EventsPage.tsx`
- Create: `tests/url-state.spec.ts`
- Modify: `tests/console-errors.spec.ts` (add parameterised routes)

**Interfaces:**
- Consumes: `useUrlState`, `oneOf`, `oneOfDefault`, `text`.
- Produces: `ActiveFilters({ chips: { key: string; label: string; onRemove: () => void }[]; onClear: () => void; className?: string })` in `ui.tsx`.
- URL contracts (used by Stage 2's homepage links and Stage 4's teacher pack):
  - `/timeline?region=<RegionId>&category=<EventCategory>&movement=<movementId>&view=chapters`
  - `/fighters?q=<text>&collection=featured|forgotten|women|saved&region=&era=&role=&gender=female|male&sort=name`
  - `/events?type=<EventCategory>&decade=1850s`

- [ ] **Step 1: Write the failing e2e spec**

Create `tests/url-state.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test.describe('filters live in the URL', () => {
  test('timeline: a region in the URL narrows the list, survives reload, and Clear all removes it', async ({ page }) => {
    await page.goto('/timeline?region=south');
    const status = page.getByRole('status');
    await expect(status).toHaveText(/^(?!47 of)\d+ of 47 events$/);
    const chips = page.getByRole('list', { name: 'Active filters' });
    await expect(chips.getByRole('button', { name: 'Remove filter: South India' })).toBeVisible();

    await page.reload();
    await expect(status).toHaveText(/^(?!47 of)\d+ of 47 events$/);

    await chips.getByRole('button', { name: 'Clear all' }).click();
    await expect(page).toHaveURL(/\/timeline$/);
    await expect(status).toHaveText('47 of 47 events');
  });

  test('timeline: choosing a filter writes the URL', async ({ page }) => {
    await page.goto('/timeline');
    await page.getByRole('button', { name: /^Filters/ }).click();
    const sheet = page.getByRole('dialog', { name: 'Filter the timeline' });
    await sheet.getByRole('button', { name: 'Massacre' }).click();
    await expect(page).toHaveURL(/category=massacre/);
  });

  test('people: query and collection persist', async ({ page }) => {
    await page.goto('/fighters?collection=women&q=rani');
    await expect(page.getByLabel('Search by name, place or tag')).toHaveValue('rani');
    await expect(page.getByRole('button', { name: 'Women of the movement' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByLabel('Search by name, place or tag').fill('queen');
    await expect(page).toHaveURL(/q=queen/);
  });

  test('events: type in the URL narrows the list', async ({ page }) => {
    await page.goto('/events?type=massacre');
    await expect(page.getByRole('status')).toHaveText(/^Showing [1-9]\d* of 47$/);
    await expect(page.getByRole('status')).not.toHaveText('Showing 47 of 47');
  });
});
```
Run: `npx playwright test tests/url-state.spec.ts` — Expected: FAIL (no Active filters list; events ignore `type`).

- [ ] **Step 2: Add `ActiveFilters` to `ui.tsx`**

After the `ChipGroup` component add:
```tsx
/* ------------------------------------------------------------------ */
/* Active filters — what's narrowing the list, each removable          */
export function ActiveFilters({
  chips,
  onClear,
  className = '',
}: {
  chips: { key: string; label: string; onRemove: () => void }[];
  onClear: () => void;
  className?: string;
}) {
  if (chips.length === 0) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.key}>
          <button type="button" onClick={c.onRemove} className="chip chip-active min-h-10" aria-label={`Remove filter: ${c.label}`}>
            {c.label}
            <Icon d={icons.close} className="h-3 w-3" />
          </button>
        </li>
      ))}
      <li>
        <button type="button" onClick={onClear} className="font-body text-meta font-medium text-oxide-deep underline decoration-oxide-deep/40 underline-offset-4">
          Clear all
        </button>
      </li>
    </ul>
  );
}
```

- [ ] **Step 3: Timeline**

In `src/pages/TimelinePage.tsx`:

Replace the imports of `useSearchParams` and add the new ones:
```ts
import { Link } from 'react-router-dom';
import type { EventCategory, RegionId } from '@/types';
import { categoryLabels, eras, events, fightersForEvent, fighters, movementById, movements } from '@/lib/content';
import { regionIds, regionNames } from '@/data/regions';
import { useActiveSection, usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf, oneOfDefault } from '@/lib/url-state';
import { ActiveFilters, BottomSheet, ChipGroup, EmptyState, Icon, PageIntro, Postmark, Reveal, Segmented, eraAccent, icons } from '@/components/ui';
```
(Keep `useEffect, useMemo, useRef, useState` from React; `EventSummary` stays if `dateSubLine` still uses it.)

Add at module scope after `dateSubLine`:
```ts
const timelineParams = {
  region: oneOf(regionIds),
  category: oneOf(Object.keys(categoryLabels) as EventCategory[]),
  movement: oneOf(movements.map((m) => m.id)),
  view: oneOfDefault(['chapters', 'full'] as const, 'full'),
};
```
Inside the component, replace the five `useState`/`useSearchParams` lines (`params`, `zoom`, `region`, `category`, `movementId`) with:
```ts
  const [filters, setFilters] = useUrlState(timelineParams);
  const { region, category, movement: movementId, view: zoom } = filters;
  const [sheetOpen, setSheetOpen] = useState(false);
```
Replace `clearFilters` with:
```ts
  const clearFilters = () => setFilters({ region: null, category: null, movement: null });
  const activeChips = [
    region && { key: 'region', label: regionNames[region], onRemove: () => setFilters({ region: null }) },
    category && { key: 'category', label: categoryLabels[category], onRemove: () => setFilters({ category: null }) },
    movementId && { key: 'movement', label: movementById.get(movementId)?.name ?? movementId, onRemove: () => setFilters({ movement: null }) },
  ].filter((c): c is { key: string; label: string; onRemove: () => void } => Boolean(c));
```
In `filterControls`, change each `onChange` to write through `setFilters`: `setFilters({ region: v })`, `setFilters({ category: v })`, `setFilters({ movement: v })` (keep the `track` calls).
Change the `Segmented` `onChange={setZoom}` to `onChange={(v) => setFilters({ view: v })}`, and the chapter button's `setZoom('full')` to `setFilters({ view: 'full' })`.
Remove the now-unused `Clear` button next to the Filters chip and instead render, directly under the `flex flex-wrap items-center gap-3` row inside `PageIntro`:
```tsx
        <ActiveFilters chips={activeChips} onClear={clearFilters} className="mt-3" />
```
Type-safety note: `setFilters({ view: v })` requires `Segmented`'s generic to infer `'chapters' | 'full'` — it does from `options`.

- [ ] **Step 4: People**

In `src/pages/FightersPage.tsx`, replace the `useSearchParams` import and the `requested*`/`useState` block. New imports:
```ts
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
```
Replace the `collectionValues`/`regionValues`/`roleValues`/`eraValues` sets with:
```ts
const peopleParams = {
  q: text(),
  collection: oneOfDefault(collections.map((c) => c.value), 'all'),
  region: oneOf(regionIds),
  era: oneOf(eras.map((e) => e.id)),
  role: oneOf(Object.keys(roleLabels) as Role[]),
  gender: oneOf(['female', 'male'] as Gender[]),
  sort: oneOfDefault(['chronological', 'name'] as Sort[], 'chronological'),
};
```
Replace the state block (from `const [params] = useSearchParams();` to `const [sheetOpen, ...]`) with:
```ts
  const [filters, setFilters] = useUrlState(peopleParams);
  const { q: query, collection, region, era: eraId, role, gender, sort } = filters;
  const [sheetOpen, setSheetOpen] = useState(false);
```
Every setter becomes a patch: `setQuery(v)` → `setFilters({ q: v })`, `setCollection(c.value)` → `setFilters({ collection: c.value })`, `onChange={setRegion}` → `onChange={(v) => setFilters({ region: v })}`, and likewise `era`, `role`, `gender`; the Order group's `onChange={(v) => setSort(v ?? 'chronological')}` → `onChange={(v) => setFilters({ sort: v ?? 'chronological' })}`.
Build chips and render them under the collections row:
```ts
  const activeChips = [
    region && { key: 'region', label: regionNames[region], onRemove: () => setFilters({ region: null }) },
    eraId && { key: 'era', label: eras.find((e) => e.id === eraId)?.name ?? eraId, onRemove: () => setFilters({ era: null }) },
    role && { key: 'role', label: roleLabels[role], onRemove: () => setFilters({ role: null }) },
    gender && { key: 'gender', label: gender === 'female' ? 'Women' : 'Men', onRemove: () => setFilters({ gender: null }) },
  ].filter((c): c is { key: string; label: string; onRemove: () => void } => Boolean(c));
```
```tsx
        <ActiveFilters chips={activeChips} onClear={() => setFilters({ region: null, era: null, role: null, gender: null })} className="mt-3" />
```
`activeCount` stays as `activeChips.length`.

- [ ] **Step 5: Events**

In `src/pages/EventsPage.tsx`, compute decades at module scope and add a schema:
```ts
import { useMemo, useState } from 'react';
import type { EventCategory } from '@/types';
import { categoryLabels, events } from '@/lib/content';
import { eraById } from '@/data/eras';
import { usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf } from '@/lib/url-state';
import { ActiveFilters, BottomSheet, ChipGroup, EmptyState, PageIntro, Reveal, eraAccent } from '@/components/ui';
import { EventCard } from '@/components/cards';

const decades = [...new Set(events.map((e) => Math.floor(e.date.year / 10) * 10))].sort((a, b) => a - b).map((d) => `${d}s`);

const eventParams = {
  type: oneOf(Object.keys(categoryLabels) as EventCategory[]),
  decade: oneOf(decades),
};
```
Replace `const [category, setCategory] = ...`, `const [decade, setDecade] = ...` and the `decades` memo with:
```ts
  const [filters, setFilters] = useUrlState(eventParams);
  const { type: category, decade } = filters;
```
Setters: `onChange={setDecade}` → `onChange={(v) => setFilters({ decade: v })}`; `onChange={setCategory}` → `onChange={(v) => setFilters({ type: v })}`; the decade chip `onClick={() => setDecade(decade === d ? null : d)}` → `onClick={() => setFilters({ decade: decade === d ? null : d })}`.
Chips under the intro row:
```ts
  const activeChips = [
    category && { key: 'type', label: categoryLabels[category], onRemove: () => setFilters({ type: null }) },
    decade && { key: 'decade', label: decade, onRemove: () => setFilters({ decade: null }) },
  ].filter((c): c is { key: string; label: string; onRemove: () => void } => Boolean(c));
```
```tsx
        <ActiveFilters chips={activeChips} onClear={() => setFilters({ type: null, decade: null })} className="mt-3" />
```
(Task 7 will restructure the list itself; keep the grid for now.)

- [ ] **Step 6: Add parameterised routes to the console-error sweep**

In `tests/console-errors.spec.ts`, extend `routes`:
```ts
const routes = [
  '/', '/timeline', '/fighters', '/fighters/bhagat-singh', '/events/dandi-march', '/movements/swadeshi-movement', '/map', '/learn',
  // Prerendered without a query string; hydrating with one must not mismatch.
  '/timeline?region=south&view=chapters', '/fighters?q=laxmibai&collection=women', '/events?type=massacre&decade=1910s',
];
```

- [ ] **Step 7: Existing spec still passes, new spec passes**

Run: `npm run typecheck && npm run build && npx playwright test tests/url-state.spec.ts tests/timeline-filters.spec.ts tests/console-errors.spec.ts tests/people-search.spec.ts`
Expected: all pass, and the console-errors spec shows no `Hydration failed` or `did not match` text for the parameterised routes.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui.tsx src/pages/TimelinePage.tsx src/pages/FightersPage.tsx src/pages/EventsPage.tsx tests/url-state.spec.ts tests/console-errors.spec.ts
git commit -m "Persist timeline, people and events filters in the URL with removable chips

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Back returns to where you were; chapter links land on the chapter

**Files:**
- Modify: `src/components/layout.tsx` (`ScrollToTop` → `ScrollManager`)
- Create: `tests/navigation.spec.ts`

**Interfaces:**
- Produces: `ScrollManager()` component rendered once in `Layout`. Behaviour: new navigation → top; `POP` → restore the saved offset for that history entry once content is tall enough; a hash → scroll the target into view (retrying while lazy content mounts).

- [ ] **Step 1: Write the failing spec**

Create `tests/navigation.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('going back to a list restores the scroll position', async ({ page }) => {
  await page.goto('/events');
  await page.mouse.wheel(0, 2400);
  await page.waitForFunction(() => window.scrollY > 1500);
  const before = await page.evaluate(() => window.scrollY);
  // Pick a row that is on screen after the scroll.
  const link = page.getByRole('link', { name: /Quit India/ }).first();
  await link.click();
  await expect(page).toHaveURL(/\/events\//);
  await page.goBack();
  await expect(page).toHaveURL(/\/events$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 200);
});

test('a chapter link from the home page lands with the chapter heading visible below the sticky header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /1905.*Swadeshi/ }).click();
  await expect(page).toHaveURL(/\/timeline#era-swadeshi-era/);
  const heading = page.locator('#era-swadeshi-era h2');
  await expect(heading).toBeVisible();
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThan(64); // below the 64px header
  expect(box!.y).toBeLessThan(400);
});
```
Run: `npx playwright test tests/navigation.spec.ts` — Expected: the first test FAILS (scrollY is 0 after back); the second likely fails too (no in-app hash scrolling).

- [ ] **Step 2: Replace `ScrollToTop`**

In `src/components/layout.tsx`, change the router import to `import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom';` and replace the `ScrollToTop` function with:
```tsx
/* Scroll positions per history entry, kept in memory for this tab. A reload
   forgets them, which is fine: a reload is a fresh PUSH, not a POP. */
const scrollPositions = new Map<string, number>();

function afterLayout(fn: () => boolean, maxFrames = 60) {
  let frames = 0;
  const tick = () => {
    if (fn() || frames++ >= maxFrames) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();

  /* Remember where this entry is, throttled to one write per frame. */
  useEffect(() => {
    const key = location.key;
    let queued = false;
    const save = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scrollPositions.set(key, window.scrollY);
      });
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [location.key]);

  useEffect(() => {
    const instant = { behavior: 'instant' as ScrollBehavior };
    if (location.hash) {
      /* In-app <Link to="/timeline#era-x">: the browser only jumps to a hash
         on a full load, and the chapter may still be mounting. `scroll-mt`
         on the target clears the sticky header and era rail. */
      const id = decodeURIComponent(location.hash.slice(1));
      afterLayout(() => {
        const el = document.getElementById(id);
        if (!el) return false;
        el.scrollIntoView({ block: 'start', ...instant });
        return true;
      });
      return;
    }
    if (navType === 'POP') {
      const y = scrollPositions.get(location.key) ?? 0;
      afterLayout(() => {
        const tallEnough = document.documentElement.scrollHeight >= y + window.innerHeight;
        if (!tallEnough) return false;
        window.scrollTo({ top: y, ...instant });
        return true;
      });
      return;
    }
    window.scrollTo({ top: 0, ...instant });
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
```
In `Layout`, replace `<ScrollToTop />` with `<ScrollManager />`.

- [ ] **Step 3: Run the spec**

Run: `npm run typecheck && npm run build && npx playwright test tests/navigation.spec.ts tests/accessibility.spec.ts`
Expected: all pass. (The skip-link test's `#main` navigation still works: the hash branch scrolls `#main` into view, which is what the skip link intends.)

- [ ] **Step 4: Commit**

```bash
git add src/components/layout.tsx tests/navigation.spec.ts
git commit -m "Restore list scroll position on back and land in-app chapter links on the chapter

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: The event directory is one chronological list

**Files:**
- Modify: `src/components/cards.tsx` (add `EventRow`)
- Modify: `src/pages/EventsPage.tsx`
- Create: `tests/events-list.spec.ts`

**Interfaces:**
- Produces: `EventRow({ event: EventSummary })` — a full-width ledger row: date column (year denomination, day/month sub-line, category stamp) then title, location, summary, people chips (up to 3).

- [ ] **Step 1: Write the failing spec**

Create `tests/events-list.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('events are one continuous chronological list with full-width rows, grouped under decade headings', async ({ page }) => {
  await page.goto('/events');
  const rows = page.locator('ol[aria-label="Events in date order"] > li');
  await expect(rows).toHaveCount(47);
  // Every row spans the list's full width (no multi-column grid).
  const listBox = await page.locator('ol[aria-label="Events in date order"]').boundingBox();
  const firstRow = await rows.first().boundingBox();
  expect(Math.abs(firstRow!.width - listBox!.width)).toBeLessThan(2);
  // Decade headings are present and the sparse 1800s decade still gets a heading, not a one-third-width card.
  await expect(page.getByRole('heading', { name: '1800s' })).toBeVisible();
  // Rows are in date order.
  const years = await rows.locator('time').allTextContents();
  const numeric = years.map((y) => Number(y.trim().slice(0, 4)));
  expect([...numeric].sort((a, b) => a - b)).toEqual(numeric);
});

test('decade chips jump to the decade heading', async ({ page }) => {
  await page.goto('/events');
  await page.getByRole('link', { name: '1930s' }).click();
  const heading = page.getByRole('heading', { name: '1930s' });
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThan(60);
  expect(box!.y).toBeLessThan(300);
});
```
Run: `npx playwright test tests/events-list.spec.ts` — Expected: FAIL.

- [ ] **Step 2: Add `EventRow` to `cards.tsx`**

Imports at the top of `src/components/cards.tsx` need `fightersForEvent` from `@/lib/content`. Add after `EventCard`:
```tsx
/* ------------------------------------------------------------------ */
/* Event row — the directory's full-width ledger line                  */
function dateSubLine(event: EventSummary): string {
  if (event.dateLabel.includes('–')) return event.dateLabel;
  return event.dateLabel.replace(String(event.date.year), '').trim();
}

export function EventRow({ event }: { event: EventSummary }) {
  const era = eraById.get(event.era);
  const people = fightersForEvent(event).slice(0, 3);
  const sub = dateSubLine(event);
  return (
    <article className="doc grid gap-3 p-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6 sm:p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-paper-400/80 pb-3 sm:block sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
        <time className={`denom block ${era ? eraAccent.text[era.accent] : 'text-oxide-deep'}`}>{event.date.year}</time>
        {sub && <p className="num font-body text-xs font-medium text-ink-soft sm:mt-1.5">{sub}</p>}
        <p className="stamp text-sepia sm:mt-2">{categoryLabels[event.category]}</p>
      </div>
      <div className="min-w-0">
        {event.location && <p className="font-body text-label text-ink-faint">{event.location}</p>}
        <h3 className="mt-0.5 text-h4">
          <Link to={`/events/${event.slug}`} className="text-ink transition-colors duration-160 hover:text-oxide-deep">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1.5 font-body text-meta text-ink-soft">{event.summary}</p>
        {people.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {people.map((f) => (
              <FighterChip key={f.id} fighter={f} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
```
(`FighterChip` is defined in the same file; hoisting is fine since it is a function declaration.)

- [ ] **Step 3: Restructure `EventsPage.tsx`**

Replace the `import { EventCard } ...` with `import { EventRow } from '@/components/cards';` and replace everything from `<div className="container-page">` to the end of the component's JSX with:
```tsx
      <div className="container-page">
        <p className="num mb-4 font-body text-label text-ink-faint" role="status">
          Showing {filtered.length} of {events.length}
        </p>
        {filtered.length === 0 ? (
          <EmptyState
            title="No events match"
            hint="Try another decade or type, or clear the filters."
            action={
              <button type="button" className="btn-ghost" onClick={() => setFilters({ type: null, decade: null })}>
                Clear filters
              </button>
            }
          />
        ) : (
          /* One continuous ledger, oldest first. Decade heads are markers in
             the flow, not separate grids — a decade with a single record gets
             a full-width row like every other. */
          <ol className="space-y-3" aria-label="Events in date order">
            {groups.map(([dec, list]) =>
              list.map((e, i) => {
                const era = eraById.get(e.era);
                return (
                  <li key={e.id} className={i === 0 && dec !== groups[0][0] ? 'pt-8' : undefined}>
                    {i === 0 && (
                      <div id={`decade-${dec}s`} className="mb-3 flex scroll-mt-28 items-baseline gap-4">
                        <h2 className={`denom ${era ? eraAccent.text[era.accent] : 'text-oxide'}`}>{dec}s</h2>
                        <span className="rule flex-1" aria-hidden="true" />
                        <span className="num shrink-0 font-body text-label text-ink-faint">
                          {list.length} moment{list.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    )}
                    <EventRow event={e} />
                  </li>
                );
              }),
            )}
          </ol>
        )}
      </div>
```
Remove the now-unused `Reveal` import if nothing else uses it. Change the decade chip row so the chips are anchors that jump (filtering stays in the sheet):
```tsx
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0" role="group" aria-label="Jump to decade">
            {decades
              .filter((d) => groups.some(([dec]) => `${dec}s` === d))
              .map((d) => (
                <a key={d} href={`#decade-${d}`} className="chip num shrink-0">
                  {d}
                </a>
              ))}
          </div>
```
Adjust the `groups` memo's key so `decade-1930s` ids match: `groups` already keys by the numeric decade (`1930`), and the id is `decade-${dec}s` = `decade-1930s`, which is what the chip's `href="#decade-1930s"` targets.

- [ ] **Step 4: Run the specs**

Run: `npm run typecheck && npm run build && npx playwright test tests/events-list.spec.ts tests/url-state.spec.ts`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/cards.tsx src/pages/EventsPage.tsx tests/events-list.spec.ts
git commit -m "Make the event directory one continuous chronological list

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: A correction route that reaches someone

**Files:**
- Create: `src/lib/corrections.ts`
- Create: `src/lib/corrections.test.ts`
- Modify: `src/components/ui.tsx` (`SuggestCorrection`)
- Modify: `src/pages/AboutPage.tsx`
- Modify: `tests/correction-form.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  export const CORRECTIONS_EMAIL: string; // from VITE_CORRECTIONS_EMAIL, trimmed, may be ''
  export const REPO_ISSUES_URL: string;
  export interface CorrectionDraft { path: string; recordTitle: string; claim: string; correction: string; sourceUrl?: string }
  export function correctionBody(draft: CorrectionDraft): string;
  export function fallbackLink(draft: CorrectionDraft, email?: string): { kind: 'email' | 'issue'; href: string; label: string };
  ```

- [ ] **Step 1: Failing unit test**

Create `src/lib/corrections.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { correctionBody, fallbackLink } from './corrections';

const draft = { path: '/fighters/bhagat-singh', recordTitle: 'Bhagat Singh', claim: 'Year is wrong', correction: '1907', sourceUrl: 'https://example.org/doc' };

describe('fallbackLink', () => {
  it('is a mailto with a recipient when an inbox is configured', () => {
    const link = fallbackLink(draft, 'corrections@example.org');
    expect(link.kind).toBe('email');
    expect(link.href.startsWith('mailto:corrections@example.org?subject=Correction%3A%20Bhagat%20Singh&body=')).toBe(true);
    expect(decodeURIComponent(link.href)).toContain('Page: /fighters/bhagat-singh');
  });
  it('is a pre-filled GitHub issue when no inbox is configured', () => {
    const link = fallbackLink(draft, '');
    expect(link.kind).toBe('issue');
    expect(link.href.startsWith('https://github.com/rickyravik/india-freedom-timeline/issues/new?title=Correction%3A%20Bhagat%20Singh&body=')).toBe(true);
  });
});

describe('correctionBody', () => {
  it('includes every field the reviewer needs', () => {
    const body = correctionBody(draft);
    expect(body).toContain("What's wrong:\nYear is wrong");
    expect(body).toContain('Suggested correction:\n1907');
    expect(body).toContain('Source:\nhttps://example.org/doc');
  });
});
```
Run: `npm run test:unit` — Expected: FAIL (module missing).

- [ ] **Step 2: Create `src/lib/corrections.ts`**

```ts
/**
 * Where a correction goes when POST /api/correction (worker/correction.ts)
 * can't be reached. The inbox comes from .env; without one, the best fallback
 * a static site has is a pre-filled GitHub issue, which is labelled as
 * needing an account rather than presented as the normal route.
 */
export const CORRECTIONS_EMAIL = ((import.meta.env.VITE_CORRECTIONS_EMAIL as string | undefined) ?? '').trim();
export const REPO_ISSUES_URL = 'https://github.com/rickyravik/india-freedom-timeline/issues/new';

export interface CorrectionDraft {
  path: string;
  recordTitle: string;
  claim: string;
  correction: string;
  sourceUrl?: string;
}

export function correctionBody(d: CorrectionDraft): string {
  return `Page: ${d.path}\n\nWhat's wrong:\n${d.claim}\n\nSuggested correction:\n${d.correction}${d.sourceUrl ? `\n\nSource:\n${d.sourceUrl}` : ''}`;
}

export function fallbackLink(d: CorrectionDraft, email: string = CORRECTIONS_EMAIL): { kind: 'email' | 'issue'; href: string; label: string } {
  const subject = encodeURIComponent(`Correction: ${d.recordTitle}`);
  const body = encodeURIComponent(correctionBody(d));
  if (email) return { kind: 'email', href: `mailto:${email}?subject=${subject}&body=${body}`, label: `email ${email}` };
  return { kind: 'issue', href: `${REPO_ISSUES_URL}?title=${subject}&body=${body}`, label: 'open a pre-filled issue on GitHub (needs a GitHub account)' };
}
```
Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 3: Rework `SuggestCorrection` in `ui.tsx`**

Add the import: `import { fallbackLink } from '@/lib/corrections';`
Replace the two `mailtoBody`/`mailto` lines with:
```ts
  const fallback = fallbackLink({ path, recordTitle, claim, correction, sourceUrl: sourceUrl || undefined });
```
Replace the `status === 'sent'` branch's paragraph with:
```tsx
            <p className="mx-auto mt-2 max-w-sm font-body text-meta text-ink-soft">
              Your suggestion has been received. An editor reviews every correction against its sources before anything on the site changes — nothing is published automatically.
            </p>
```
Replace the `status === 'error'` branch with:
```tsx
        ) : status === 'error' ? (
          <div className="py-8 text-center" role="alert">
            <p className="font-display text-h3 text-ink">Couldn’t send that just now</p>
            <p className="mx-auto mt-2 max-w-sm font-body text-meta text-ink-soft">
              Nothing you typed was lost. You can try again, or{' '}
              <a className="font-medium text-ink underline decoration-brass decoration-1 underline-offset-2 hover:text-oxide-deep" href={fallback.href} target={fallback.kind === 'issue' ? '_blank' : undefined} rel={fallback.kind === 'issue' ? 'noopener noreferrer' : undefined}>
                {fallback.label}
              </a>
              .
            </p>
            <button type="button" className="btn-ghost mt-5" onClick={() => setStatus('idle')}>
              <Icon d={icons.refresh} className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : (
```
Under the form's submit button add:
```tsx
            <p className="font-body text-label text-ink-faint">Suggestions are reviewed by an editor before publication.</p>
```

- [ ] **Step 4: About page uses the real route**

In `src/pages/AboutPage.tsx`, import `SuggestCorrection` from `@/components/ui` and `CORRECTIONS_EMAIL, REPO_ISSUES_URL` from `@/lib/corrections`. Replace the Corrections section's paragraph with:
```tsx
          <p className="prose-reading max-w-prose">
            History deserves correction. If you find an error of fact, a missing attribution, or a person whose story should be here, send a suggestion from this page or from the record itself. Every suggestion is read by an editor and checked against sources before anything changes.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <SuggestCorrection path="/about" recordTitle="General suggestion" />
            {CORRECTIONS_EMAIL && (
              <a className="font-body text-meta font-medium text-ink underline decoration-brass underline-offset-2 hover:text-oxide-deep" href={`mailto:${CORRECTIONS_EMAIL}`}>
                or email {CORRECTIONS_EMAIL}
              </a>
            )}
          </div>
          <p className="mt-4 font-body text-label text-ink-faint">
            If you use GitHub, each record is also a structured file you can propose changes to:{' '}
            <a className="underline" href={REPO_ISSUES_URL} target="_blank" rel="noopener noreferrer">open an issue<span className="sr-only"> (opens in a new tab)</span></a>.
          </p>
```

- [ ] **Step 5: Update the e2e spec to be inbox-aware**

Replace `tests/correction-form.spec.ts` with:
```ts
import { test, expect } from '@playwright/test';
import { loadEnv } from 'vite';

const INBOX = (loadEnv('production', process.cwd(), 'VITE_').VITE_CORRECTIONS_EMAIL ?? '').trim();

/**
 * Runs against `vite preview`, where there is no Worker, so POST /api/correction
 * fails — exactly the fallback path a visitor hits when the endpoint is down.
 */
test('the correction form is keyboard operable, keeps the draft, and offers a real fallback', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');

  const openButton = page.getByRole('button', { name: 'Suggest a correction' });
  await openButton.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: /Suggest a correction/ });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel('What’s wrong?').fill('The birth year looks off.');
  await dialog.getByLabel('Suggested correction').fill('Should be 1907, per the National Archives record.');
  await dialog.getByRole('button', { name: 'Submit correction' }).click();

  const alert = dialog.getByRole('alert');
  await expect(alert).toBeVisible();
  if (INBOX) {
    await expect(alert.getByRole('link', { name: `email ${INBOX}` })).toHaveAttribute('href', new RegExp(`^mailto:${INBOX.replace('.', '\\.')}\\?subject=Correction%3A`));
  } else {
    await expect(alert.getByRole('link', { name: /open a pre-filled issue on GitHub/ })).toHaveAttribute('href', /^https:\/\/github\.com\/rickyravik\/india-freedom-timeline\/issues\/new\?title=Correction%3A/);
  }

  // Try again returns to the form with the draft intact.
  await alert.getByRole('button', { name: 'Try again' }).click();
  await expect(dialog.getByLabel('What’s wrong?')).toHaveValue('The birth year looks off.');

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('the About page offers the correction form directly', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('button', { name: 'Suggest a correction' }).click();
  await expect(page.getByRole('dialog', { name: /General suggestion/ })).toBeVisible();
});
```

- [ ] **Step 6: Run**

Run: `npm run typecheck && npm run test:unit && npm run build && npx playwright test tests/correction-form.spec.ts`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/corrections.ts src/lib/corrections.test.ts src/components/ui.tsx src/pages/AboutPage.tsx tests/correction-form.spec.ts
git commit -m "Give the correction form a real fallback, a retry, and a route from About

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** set `VITE_CORRECTIONS_EMAIL` in `.env` to the inbox that should receive corrections. The spec adapts automatically.

---

### Task 9: Wording that tells the truth about the collection

**Files:**
- Modify: `src/types/index.ts` (`shortName?` on `FreedomFighter` and `FighterSummary`)
- Modify: `scripts/lib/summaries.ts`, `scripts/validate-content.ts`, `docs/templates/fighter.template.ts`, `CONTRIBUTING.md`
- Modify: `src/pages/HomePage.tsx` (`TodayLedger`)
- Modify: `src/pages/EventPage.tsx` (neighbours wording)
- Modify: `src/pages/FighterProfilePage.tsx` (full-name heading)
- Modify: `src/components/ui.tsx` (`LifespanBar` beyond-frame caption)
- Create: `tests/copy.spec.ts`

- [ ] **Step 1: Failing spec**

Create `tests/copy.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('an event page calls its neighbours what they are: next in the collection', async ({ page }) => {
  await page.goto('/events/battle-of-plassey');
  await expect(page.getByRole('heading', { name: 'Next in this collection' })).toBeVisible();
  await expect(page.getByText(/chronological neighbours in the archive/i)).toBeVisible();
  await expect(page.getByText('What happened next?')).toHaveCount(0);
});

test('the connections heading uses the full name, not the last word', async ({ page }) => {
  await page.goto('/fighters/velu-nachiyar');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('heading', { name: 'People connected to Rani Velu Nachiyar' })).toBeVisible();
});

test('a life that runs past 1947 says so on the lifespan bar', async ({ page }) => {
  await page.goto('/fighters/lakshmi-sahgal');
  await expect(page.getByText('Lived to 2012, beyond the end of this frame.')).toBeVisible();
});

test('the home ledger never calls a missing record a gap in history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('No dated record for today')).toHaveCount(0);
  const ledger = page.getByRole('region', { name: /Today/ });
  await expect(ledger).toBeVisible();
});
```
Run: `npx playwright test tests/copy.spec.ts` — Expected: FAIL.

- [ ] **Step 2: `shortName`**

`src/types/index.ts` — in `FreedomFighter` after `alternateNames?`:
```ts
  /** Editorial short form for headings ("Velu Nachiyar", "Bhagat Singh"). Defaults to `name`; never derived automatically from the last word. */
  shortName?: string;
```
Same line in `FighterSummary` after `alternateNames?`.
`scripts/lib/summaries.ts` — add `shortName: f.shortName,` after `alternateNames`.
`scripts/validate-content.ts` — add `shortName: z.string().min(1).optional(),` to `fighterSchema` after `alternateNames`.
`docs/templates/fighter.template.ts` — after the `alternateNames` line add: `shortName: 'Short form for headings', // optional — used in "People connected to …"; omit to use the full name`.
`CONTRIBUTING.md` — in "Adding a fighter or event" step 2, append: "Use `shortName` for the form of the name a heading should use; the UI never guesses one from the last word."
Regenerate and validate: `npm run generate:summaries && npm run validate` — Expected: summaries unchanged in content (no record sets `shortName` yet) and 0 errors.

- [ ] **Step 3: Full-name heading**

In `src/pages/FighterProfilePage.tsx` change:
```tsx
<h2 className="text-h2 text-paper-50">People connected to {summary.name.split(' ').slice(-1)[0]}</h2>
```
to:
```tsx
<h2 className="text-h2 text-paper-50">People connected to {summary.shortName ?? summary.name}</h2>
```

- [ ] **Step 4: Neighbours wording on `EventPage.tsx`**

Replace the `Before and after` section's header and labels:
```tsx
        <section className="vault mt-14 px-5 py-12 sm:mt-20 sm:px-8 sm:py-16" aria-label="Neighbouring records">
          <div className="container-page">
            <Reveal className="mb-8 max-w-2xl">
              <div className="rule-double-vault mb-5" />
              <h2 className="text-h2 text-paper-50">Next in this collection</h2>
              <p className="mt-2 font-body text-meta text-paper-300">
                These are the chronological neighbours in the archive, not a chain of cause and effect. Much happened between them that this collection does not yet hold.
              </p>
            </Reveal>
```
Change `Before · {e.date.year}` to `Earlier · {e.date.year}` and `{i === 0 ? 'Next' : 'Then'} · {e.date.year}` to `{i === 0 ? 'Next' : 'Later'} · {e.date.year}`.

- [ ] **Step 5: Lifespan beyond the frame**

In `src/components/ui.tsx` `LifespanBar`, after the `<figcaption>` element (still inside `<figure>`), add:
```tsx
      {((birth !== undefined && birth < 1757) || (death !== undefined && death > 1947)) && (
        <p className={`num mt-5 font-body text-xs ${vault ? 'text-paper-200' : 'text-ink-faint'}`}>
          {birth !== undefined && birth < 1757 && `Born ${birth}, before this frame begins. `}
          {death !== undefined && death > 1947 && `Lived to ${death}, beyond the end of this frame.`}
        </p>
      )}
```

- [ ] **Step 6: Today's featured story**

In `src/pages/HomePage.tsx` `TodayLedger`, change the left column label to depend on content and replace the fallback block:
```tsx
          <p className="label">{hasContent ? 'Today in freedom history' : 'Today’s featured story'}</p>
```
```tsx
          ) : (
            <div>
              <Link to={`/fighters/${fallback.slug}`} className="group block">
                <span className="inline-flex items-center gap-2 font-display text-h3 font-bold text-ink group-hover:text-oxide">
                  {fallback.name}
                  <Icon d={icons.arrowRight} className="h-4 w-4" />
                </span>
                <span className="mt-1 block font-body text-meta text-ink-soft">{fallback.summary}</span>
              </Link>
              <p className="mt-3 font-body text-label text-ink-faint">A different life each day. Dated anniversaries appear here when the collection holds one.</p>
            </div>
          )}
```
Change the section's `aria-label` to `aria-label="Today"` so the spec's region query matches both states.

- [ ] **Step 7: Run**

Run: `npm run typecheck && npm run validate && npm run build && npx playwright test tests/copy.spec.ts tests/bookmarks.spec.ts`
Expected: pass.

- [ ] **Step 8: Commit**

```bash
git add src/types/index.ts scripts/lib/summaries.ts scripts/validate-content.ts docs/templates/fighter.template.ts CONTRIBUTING.md src/data/generated src/pages/HomePage.tsx src/pages/EventPage.tsx src/pages/FighterProfilePage.tsx src/components/ui.tsx tests/copy.spec.ts
git commit -m "Say what the archive means: next in collection, full names, lives beyond the frame

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: A state selector anyone can use, and a list view of the map

**Files:**
- Modify: `src/pages/MapPage.tsx`
- Modify: `tests/map.spec.ts`

**Interfaces:**
- URL contract: `/map?state=<StateInfo.id>&view=list`.
- Consumes: `useUrlState`, `oneOf`, `oneOfDefault`, `Segmented`, `EmptyState`.

- [ ] **Step 1: Failing spec**

Replace `tests/map.spec.ts` with:
```ts
import { test, expect } from '@playwright/test';

test('selecting a state on the map shows its detail panel and writes the URL', async ({ page }) => {
  await page.goto('/map');
  const tile = page.getByRole('button', { name: /^Tamil Nadu,/ });
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Tamil Nadu' })).toBeVisible();
  await expect(page).toHaveURL(/state=tamil-nadu/);
  await tile.click();
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(page).not.toHaveURL(/state=/);
});

test('a state in the URL is selected on load, and the full-name selector changes it', async ({ page }) => {
  await page.goto('/map?state=kerala');
  await expect(page.getByRole('heading', { name: 'Kerala' })).toBeVisible();
  await page.getByLabel('Choose a state').selectOption({ label: /^Punjab/ });
  await expect(page).toHaveURL(/state=punjab/);
  await expect(page.getByRole('heading', { name: 'Punjab' })).toBeVisible();
});

test('the list view names every state in full with its record counts', async ({ page }) => {
  await page.goto('/map?view=list');
  const list = page.getByRole('list', { name: 'States and territories' });
  await expect(list.getByRole('button')).toHaveCount(23);
  await expect(list.getByRole('button', { name: /^Tamil Nadu · \d+ people · \d+ events$/ })).toBeVisible();
});

test('a state without records says coverage is growing and offers neighbours', async ({ page }) => {
  await page.goto('/map?state=nagaland');
  await expect(page.getByText(/Coverage for Nagaland is still growing/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Manipur/ })).toBeVisible();
});
```
Run: `npx playwright test tests/map.spec.ts` — Expected: FAIL beyond the first assertions.

- [ ] **Step 2: Rewrite the state and add the selector, results heading, list view**

In `src/pages/MapPage.tsx`:

Imports:
```ts
import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { eventsForState, fightersForState, movements } from '@/lib/content';
import { regionNames, states, stateById } from '@/data/regions';
import type { RegionId } from '@/types';
import { usePageMeta, useUrlState } from '@/lib/hooks';
import { oneOf, oneOfDefault } from '@/lib/url-state';
import { EmptyState, Icon, PageIntro, Reveal, Segmented, icons } from '@/components/ui';
import { EventCard, FighterCard } from '@/components/cards';
```
Module scope, after `stateCodes`:
```ts
const mapParams = {
  state: oneOf(states.map((s) => s.id)),
  view: oneOfDefault(['map', 'list'] as const, 'map'),
};
const peopleCount = new Map(states.map((s) => [s.id, fightersForState(s.name).length]));
const eventCount = new Map(states.map((s) => [s.id, eventsForState(s.name).length]));
```
Inside the component replace `const [selected, setSelected] = useState<StateInfo | null>(null);` and `counts` with:
```ts
  const [params, setParams] = useUrlState(mapParams);
  const selected = params.state ? stateById.get(params.state) ?? null : null;
  const select = (id: string | null) => setParams({ state: id });
  const [hoverRegion, setHoverRegion] = useState<RegionId | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const counts = peopleCount;
  const viewStories = () => {
    resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    resultsRef.current?.focus({ preventScroll: true });
  };
```
(keep `useState` in the React import for `hoverRegion`.)
Tile `onClick={() => setSelected(isSel ? null : s)}` → `onClick={() => select(isSel ? null : s.id)}`.

Replace the `PageIntro` block with one that carries the selector and the view switch:
```tsx
      <PageIntro
        title="Explore by State & Region"
        lede="Choose a state to meet its freedom fighters and the battles, marches and uprisings that happened there. The tiles are a schematic of present-day states, not a boundary map — see the note below the sheet."
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="block min-w-0 flex-1 sm:max-w-sm">
            <span className="label mb-1.5 block">Choose a state</span>
            <select
              className="min-h-12 w-full rounded-sm border border-paper-400 bg-paper-50 px-4 font-body text-meta font-medium text-ink focus:border-ink"
              value={params.state ?? ''}
              onChange={(e) => select(e.target.value || null)}
            >
              <option value="">All of India</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({peopleCount.get(s.id)} people, {eventCount.get(s.id)} events)
                </option>
              ))}
            </select>
          </label>
          <Segmented
            label="View"
            value={params.view}
            onChange={(v) => setParams({ view: v })}
            options={[
              { value: 'map', label: 'Map' },
              { value: 'list', label: 'List' },
            ]}
          />
        </div>
      </PageIntro>
```
Wrap the existing map `Reveal` so it renders only in map view, and add the list view as its sibling. The list is one flat `<ul>` (so the spec can count 23 buttons) ordered by region; each button's accessible name is the state name plus its counts, and the region label sits beside the button, not inside it:
```tsx
        {params.view === 'map' ? (
          <Reveal className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            {/* existing .vault sheet unchanged … */}
            {selected && (
              <button type="button" className="btn-seal mt-4 w-full lg:hidden" onClick={viewStories}>
                View stories from {selected.name}
                <Icon d={icons.arrowRight} className="h-4 w-4" />
              </button>
            )}
          </Reveal>
        ) : (
          <ul className="min-w-0 space-y-2" aria-label="States and territories">
            {(Object.keys(regionNames) as RegionId[]).flatMap((r) =>
              states
                .filter((s) => s.region === r)
                .map((s) => (
                  <li key={s.id} className="doc flex items-center justify-between gap-3 p-3.5">
                    <button
                      type="button"
                      onClick={() => select(s.id)}
                      aria-pressed={selected?.id === s.id}
                      className="min-w-0 flex-1 text-left font-body text-meta text-ink hover:text-oxide-deep"
                    >
                      <span className="font-semibold">{s.name}</span>
                      <span className="num text-ink-faint"> · {peopleCount.get(s.id)} people · {eventCount.get(s.id)} events</span>
                    </button>
                    <span className="label shrink-0">{regionNames[r]}</span>
                  </li>
                )),
            )}
          </ul>
        )}
```
Results panel: change the heading block to:
```tsx
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 ref={resultsRef} id="state-results" tabIndex={-1} className="scroll-mt-28 text-h2 text-ink outline-none">
                    {selected.name}
                  </h2>
                  <p className="label num mt-1">
                    {regionNames[selected.region]} · {stateFighters.length} people · {stateEvents.length} events
                  </p>
                </div>
```
Replace the no-records `EmptyState` with:
```tsx
                <EmptyState
                  title={`Coverage for ${selected.name} is still growing`}
                  hint="Records are added region by region. In the meantime, nearby states in the same region already have stories:"
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      {states
                        .filter((s) => s.region === selected.region && s.id !== selected.id && (peopleCount.get(s.id) ?? 0) > 0)
                        .map((s) => (
                          <Link key={s.id} to={`/map?state=${s.id}`} className="chip min-h-10">
                            {s.name} · {peopleCount.get(s.id)}
                          </Link>
                        ))}
                    </div>
                  }
                />
```
Selecting via URL: because `useUrlState` re-parses on `paramsKey` change, `<Link to="/map?state=manipur">` updates `selected` without extra code.

- [ ] **Step 3: Run**

Run: `npm run typecheck && npm run build && npx playwright test tests/map.spec.ts tests/console-errors.spec.ts`
Expected: pass. Add `'/map?state=tamil-nadu&view=list'` to the console-errors routes while here.

- [ ] **Step 4: Commit**

```bash
git add src/pages/MapPage.tsx tests/map.spec.ts tests/console-errors.spec.ts
git commit -m "Map: full-name state selector, list view, URL-selected state, honest empty state

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Chapter landing from a cold load, and the stage's regression gate

**Files:**
- Modify: `src/pages/TimelinePage.tsx` (chapter `scroll-mt`, rail anchors under the header)
- Modify: `tests/navigation.spec.ts` (cold-load hash case)
- Modify: `README.md` (test commands)

- [ ] **Step 1: Add the cold-load case to `tests/navigation.spec.ts`**

```ts
test('a cold load of /timeline#era-x lands with the heading below the sticky header and era rail', async ({ page }) => {
  await page.goto('/timeline#era-civil-disobedience');
  const heading = page.locator('#era-civil-disobedience h2');
  await expect(heading).toBeVisible();
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThan(100); // 64px header + ~44px rail
  expect(box!.y).toBeLessThan(420);
  // The rail marks the current chapter in text as well as colour.
  await expect(page.getByRole('navigation', { name: 'Jump to era' }).locator('[aria-current="true"]')).toContainText('Civil Disobedience');
});
```
Run it. If the heading `y` is under 100 (the rail overlaps it), raise the chapter section's `scroll-mt-36` to `scroll-mt-40` in `TimelinePage.tsx` and the `html { scroll-padding-top }` in `src/index.css` from `7rem` to `7.5rem`. Re-run until it passes on both 375 and 1440 widths (`page.setViewportSize` both, in a loop like `console-errors.spec.ts`).

- [ ] **Step 2: README test section**

In `README.md` "Getting started", add after `npm run preview`:
```bash
npm run test:unit  # vitest: pure logic (url-state, search, corrections…)
npm test           # playwright: end-to-end against the production build
```

- [ ] **Step 3: Full gate**

Run: `npm run typecheck && npm run validate && npm run search:check && npm run test:unit && npm run build && npm test`
Expected: every suite green. Fix anything that regressed before committing.

- [ ] **Step 4: Commit and push**

```bash
git add src/pages/TimelinePage.tsx src/index.css tests/navigation.spec.ts README.md
git commit -m "Chapter anchors clear the sticky header on cold load; document the test commands

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push origin main
```
Watch the CI run: the `Deploy to Cloudflare` step now runs `wrangler deploy` against the tested `dist/` without rebuilding. Confirm the live site's `<link rel="canonical">` points at the Workers URL.

---

## Stage 1 exit checklist

- [ ] `npm run test:unit` exists and runs in CI before the build.
- [ ] Every canonical, OG, JSON-LD, sitemap and robots URL derives from `VITE_SITE_URL`.
- [ ] `wrangler deploy` ships the CI-tested artifact (no `build.command`).
- [ ] People search finds "laxmibai".
- [ ] Timeline, People, Events and Map state is in the URL; reload and share reproduce it; chips remove single filters; Clear all resets.
- [ ] Back restores list position; hash links land under the header.
- [ ] Events is one chronological list with full-width rows.
- [ ] Correction fallback has a recipient (or a labelled GitHub fallback), a retry, and a route from About.
- [ ] "Next in this collection", full-name headings, lifespan beyond-frame caption, "Today's featured story".
- [ ] Map: full-name selector, list view, URL state, honest empty state.
- [ ] All Playwright specs green at 375 and 1440.
