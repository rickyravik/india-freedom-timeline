# India's Freedom Timeline

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
- **No backend** — fully static, ideal for Cloudflare Pages

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # strict TypeScript check
npm run build      # typecheck + production build + sitemap → dist/
npm run preview    # preview the production build
```

## Deploying to Cloudflare Pages

### Via the dashboard (recommended)

1. Push this repository to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git** and select the repo.
3. Use these settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. SPA routing (`public/_redirects`) and cache headers (`public/_headers`) ship with the build automatically.

### Via Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name india-freedom-timeline
```

Optionally set `SITE_URL=https://your-domain.example` at build time so the sitemap and robots.txt reference your custom domain (see `scripts/generate-sitemap.mjs`).

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
  _redirects, _headers  # Cloudflare Pages SPA routing + caching
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
