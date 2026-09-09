# India's Freedom Timeline

[![CI](https://github.com/rickyravik/india-freedom-timeline/actions/workflows/ci.yml/badge.svg)](https://github.com/rickyravik/india-freedom-timeline/actions/workflows/ci.yml)

**Millions resisted. Thousands sacrificed.** An immersive, interactive, mobile-first web experience exploring the people, movements, events and sacrifices of India's struggle against British colonial rule — from the earliest organized resistance (1757) to independence in 1947.

Built like a premium historical product, not an encyclopedia: an interactive era-by-era timeline, immersive freedom fighter profiles with a child-friendly **Story Mode** and an adult **Detailed History** mode, a stylised explorable map of India, global search, quizzes and discovery trails where every profile leads somewhere else.

## Highlights

- **88 seeded biographical records** spanning every region — national leaders, revolutionaries, Adivasi and tribal leaders, women of the movement, poets, princely-state satyagrahis and forgotten heroes — plus **47 events**, **13 movements**, **20 organizations** and **9 eras**. The architecture is designed to scale to thousands of records.
- **Historical integrity**: every biography and event carries a visible *Sources & references* section; claims historians dispute are shown in clearly labelled *"Historians note"* boxes; uncertain quote attributions are marked. Nothing is fabricated.
- **Interactive timeline** with era navigator, overview/detail zoom, and filters by region, event type and movement (bottom sheets on mobile).
- **Discovery everywhere**: related people, "What happened next?", "Today in freedom history", daily featured lives, random discovery, Did You Know cards.
- **Learn & Play**: history quiz (shuffled), "Guess the freedom fighter", and side-by-side comparison of any two lives.
- **Mobile-first**: thumb-friendly bottom navigation, touch-sized targets, bottom-sheet filters, smooth vertical timeline, works from ~320 px wide upward.
- **Accessibility**: semantic HTML, keyboard operable, visible focus rings, ARIA labels, `prefers-reduced-motion` support, strong contrast on an archival palette.
- **Performance**: route-based code splitting, self-hosted fonts, a small dependency surface, long-cache immutable assets, and a generated sitemap.
- **Installable, partly offline**: the app shell is cached on install, and any page you have already opened stays readable without a connection. Pages you have not visited need a connection the first time (an offline page says so). Saving a whole trail for offline reading is Stage 4.

## Design

The interface follows the **"Commemorative Sheet"** system documented in [`DESIGN.md`](./DESIGN.md), drawn from India Post's martyr commemoratives. Album ink is the field; every route is a gummed-paper sheet mounted on it; a *pane* is one stamp — an era ink at full strength, perforated on all four sides, its teeth cut from whatever it sits on. Franking ochre is the single accent ink, years are set as denominations, and a postmark cancels the principal pane. One cinematic easing and three durations govern all motion. Highlights:

- Chapter-based timeline with a scroll-linked spine, each chapter a pane in its own era ink with the year set as its denomination
- Profile heroes with a **lifespan bar** placing each life against 1757–1947, a Story Mode **stepper** on phones, and related people drawn as a **constellation**
- Command-palette search (⌘K / Ctrl+K / `/`) available on every page, with keyboard navigation
- A **trail** of recently viewed lives so discovery journeys are visible and reversible
- Scroll reveals, mask reveals, page transitions and micro-interactions — all CSS-driven, all disabled under `prefers-reduced-motion`

## Tech stack

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (strict)
- [Vite 7](https://vite.dev)
- [Tailwind CSS 3](https://tailwindcss.com) with a custom philatelic design system (album ink, gummed paper, and six stamp inks — prussian, stamp green, carmine, plum, gauge gold and franking ochre)
- [react-router-dom 6](https://reactrouter.com) with lazy-loaded routes
- [GSAP 3](https://gsap.com) installed as an application dependency for animation work (rather than loaded from a deferred third-party script)
- Self-hosted fonts via Fontsource: Bodoni Moda Variable (engraved display), Archivo Narrow Variable (denominations, labels, UI), Faustina Variable (long-form reading)
- **No backend** — fully static, deployed as a Cloudflare Workers Assets project

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # strict TypeScript check
npm run build      # typecheck + production build + sitemap → dist/
npm run preview    # preview the production build
npm run test:unit  # vitest: pure logic (url-state, search, corrections…)
npm test           # playwright: end-to-end against the production build
```

## Configuration

Build-time settings live in the committed `.env` file and are read through `import.meta.env.VITE_*` in the app and `scripts/lib/site.mjs` in the build scripts:

- `VITE_SITE_URL` — the public origin, no trailing slash. Drives every canonical, Open Graph, JSON-LD, sitemap and robots URL. Change this one line when a custom domain is attached.
- `VITE_CORRECTIONS_EMAIL` — inbox for the correction form's email fallback. Empty means the fallback offers a pre-filled GitHub issue instead.
- `VITE_EVENTS` — `on` enables the pilot's coarse event beacons (see Analytics).

A process environment variable of the same name overrides the file, which is how CI can build for a different domain without editing the repo.

## Deploying to Cloudflare

The project deploys as a **static-assets Worker**, configured by [`wrangler.jsonc`](./wrangler.jsonc):

- `assets.directory` is `./dist`
- `assets.not_found_handling` is `single-page-application`, so every unmatched path serves `index.html` and react-router takes over
- There is deliberately no `build.command`: GitHub Actions builds and tests `dist/` and then deploys that exact artifact. Deploying by hand means `npm run build && npx wrangler deploy`.
- `.node-version` pins Node 22, which Vite 7 requires (`^20.19.0 || >=22.12.0`)

### Via the dashboard

Cloudflare's own Git-connected build does not run this project's build (see the CI comment above); the deploy happens from GitHub Actions instead, on every push to `main`. **Workers & Pages -> Create application -> import a repository** is only relevant if you want to point Cloudflare's dashboard at the repo for visibility — the actual deploy command is `npx wrangler deploy`, run in CI after `npm run build`.

### Via Wrangler CLI

```bash
npx wrangler login
npx wrangler deploy
```

`public/_headers` ships with the build and supplies cache-control and security headers. There is deliberately **no `_redirects` file**: `/* /index.html 200` is the Cloudflare *Pages* SPA idiom, and Workers Assets rejects it as an infinite loop because it already strips `.html` and `/index`. SPA routing is handled by `not_found_handling` instead.

## Privacy and analytics

Two opt-in, off-by-default mechanisms:

- **Page views** — set `VITE_CF_BEACON_TOKEN` at build time to enable Cloudflare Web Analytics (cookieless, no fingerprinting). Unset, a build carries no trace of it.
- **Pilot events** — set `VITE_EVENTS=on` in `.env` to have `track()` send the seven allow-listed events in `src/lib/event-names.ts` (trail start/stop/complete, source opened, glossary opened, quiz reviewed, correction submitted) to `POST /api/event`, which counts them in a Cloudflare Analytics Engine dataset (`ift_events`). Props are at most three short `key=value` blobs, cut to 40 characters; no free text, names or search queries are ever sent. Query it with the Analytics Engine SQL API, e.g. `SELECT blob1 AS event, SUM(_sample_interval) AS n FROM ift_events WHERE timestamp > NOW() - INTERVAL '7' DAY GROUP BY event`.

## Project structure

```
src/
  types/            # Type-safe content models (FreedomFighter, HistoricalEvent, …)
  data/             # ALL historical content lives here — never in UI components
    fighters/       # Biographical records, grouped by era (9 files, 88 records)
    events/         # Event records, grouped by period (47 records)
    movements.ts    # 13 movements with descriptions and sources
    organizations.ts, eras.ts, regions.ts, facts.ts, quizzes.ts
  lib/              # Content access layer, search index, hooks (bookmarks, share, meta)
  components/       # Reusable UI: layout, cards, bottom sheet, sources, quotes, medallions
  pages/            # Route components (lazy-loaded)
scripts/
  generate-sitemap.mjs  # Builds dist/sitemap.xml from the content slugs
public/
  _headers              # cache-control + security headers
```

## Adding historical records

Content is data, not code. To add a freedom fighter:

1. Add a record to the appropriate file in `src/data/fighters/` (or a new file, exported through `src/data/fighters/index.ts`). TypeScript enforces the full schema — id, slug, dates, region, story chapters, biography paragraphs, movements, related people, **sources**, and optional `disputed` notes.
2. Link it: reference event ids in `timelineEvents`, movement ids in `movements`, fighter ids in `relatedPeople`. Relations declared on either side are resolved automatically.
3. `npm run build` — the record appears in the timeline, browse, search, map and sitemap with no UI changes.

**House rules for content:** cite at least one reputable source per record; never invent dates, quotes or facts; label disputed claims with a `disputed` note; mark uncertain quote attributions `disputed: true`; keep Story Mode chapters accurate and age-appropriate.

### Portraits

Records support a `portrait` image path. The project deliberately ships without portrait images rather than using unverified or AI-generated likenesses — the UI renders an archival monogram medallion as a dignified fallback. To add real, properly licensed portraits (e.g. public-domain photographs from archives), place files under `public/portraits/` and set `portrait: '/portraits/<file>.jpg'`.

## Historical method

- Sources are cited on every biography, event and movement page, favouring government archives (National Archives of India / Abhilekh Patal), the Prime Ministers' Museum & Library, state archives, museums, and published academic research.
- Where the historical record is contested — casualty figures, attributions, circumstances of deaths — the UI displays a labelled **"Historians note — disputed or uncertain"** box instead of presenting legend as fact.
- The archive deliberately represents the movement's plurality: regions, communities, languages, ideologies and strategies — nonviolence and armed struggle, moderates and revolutionaries, mass movements and princely-state struggles — without endorsing any single line.

## License

Code: MIT. Historical text was written for this project from the cited sources; verify citations before scholarly reuse.
