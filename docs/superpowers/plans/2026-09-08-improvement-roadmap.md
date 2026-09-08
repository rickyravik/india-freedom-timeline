# India's Freedom Timeline — Improvement Plan Roadmap

> **For agentic workers:** This is the master document for the four-stage programme described in `India_Freedom_Timeline_Improvement_Plan.docx` (8 September 2026). Each stage has its own executable plan in this folder. Execute the stage plans in order with superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Read this file first; it holds the decisions, constraints and inputs every stage plan assumes.

**Goal:** Turn the existing archive into an accessible historical exhibition with guided learning: a welcoming route in, clearer explanations, evidence attached to claims, three curated trails, purposeful motion, and a measured pilot — without rebuilding what already works.

**Architecture:** Keep the static React 18 + Vite 7 + TypeScript + Tailwind 3 app, the typed content model in `src/data`, the summary/full-record split, browser-snapshot prerendering, the PWA, and the Cloudflare Workers Assets deploy driven from GitHub Actions. New capabilities are added as typed data (trails, glossary, places, routes, documents), pure library functions with unit tests, and page components that follow the Commemorative Sheet design system in `DESIGN.md`. Anything that needs a backend starts as a local preference or saved progress; the only server code is the existing Worker plus one small event-count endpoint for the pilot.

**Tech Stack:** React 18.3, react-router-dom 6.30, Vite 7, TypeScript 5.9 (strict), Tailwind 3.4, zod 4 (content validation), Playwright 1.63 (e2e), Cloudflare Workers/Wrangler 4, GSAP 3.15 (already installed, currently unused). Added by this programme: `vitest` (unit tests for pure logic), `@axe-core/playwright` (accessibility checks in e2e), `@fontsource/noto-sans-tamil` and `@fontsource/noto-serif-devanagari` (Stage 4 translated-trail routes only).

---

## Stage plans

| Stage | Plan file | Deliverable | Exit criterion |
|---|---|---|---|
| 1 Foundation | `2026-09-08-stage-1-foundation.md` | Shared search, URL state, metadata/domain, correction recovery, event layout, copy fixes, map selector, unit-test runner | All existing Playwright specs plus the new regression specs pass in CI; the deploy ships the tested `dist/` |
| 2 Learning pilot | `2026-09-08-stage-2-learning-pilot.md` | Content model additions, glossary, claim-level citations, reading toolbar, profile template, typed connections, three trails, homepage and navigation, quiz flow, pilot event counting | Every published trail traces claims to sources; trails marked `reviewed` by the editor; pilot instrumentation live |
| 3 Motion and access | `2026-09-08-stage-3-motion-and-access.md` | Timeline progress bound to the timeline, chapter intro, saved-story postmark, filter rearrangement, reading-mode transition, persistent Reduce motion, axe checks, mobile viewport tests, low-data image handling | Every animated feature has an equivalent experience with motion disabled; axe reports zero violations on the covered routes |
| 4 Expansion | `2026-09-08-stage-4-expansion.md` | Places, one narrated route (Dandi), one document explorer, one narrated and translated trail (English/Tamil/Hindi), teacher pack, exploration passport, trail offline download | Pilot testing shows a clear benefit before any of these is widened beyond its first example |

Stages 1 to 3 are code-complete plans. Stage 4 is planned to the same task structure, but several of its tasks depend on editorial inputs (a licensed document scan, recorded narration, reviewed translations, verified route stops). Those inputs are listed under "Inputs required from the owner" below and inside Stage 4; the code for each Stage 4 feature is specified so it can be built against placeholder-free, validator-enforced draft data and switched on when the content is reviewed.

---

## Global Constraints

Copied from the proposal and the project's own rules. Every task in every stage plan implicitly includes these.

- **Keep React, TypeScript, Vite and the existing structured content model.** Use stable record ids and reusable templates. No backend for anything that can begin as a local preference or saved progress. Retain route splitting, prerendering, validation and existing tests. (Proposal §16.)
- **Content is data, not code.** All historical content lives in `src/data` as typed records checked by `scripts/validate-content.ts`. Never hard-code history in components. (README, CONTRIBUTING.)
- **Every record needs a responsible editor, review date, source references and uncertainty notes.** Never pass off generated portraits, invented dialogue or synthetic voices as archival evidence. (Proposal §14.) Concretely: new content records carry `editorial: { status, reviewedBy?, reviewedOn? }`; anything with `status: 'draft'` renders a visible "Draft — under editorial review" stamp and is a validator warning, never silently published as fact.
- **Historical text written in this programme is drafted only from statements already present in the sourced records**, and is flagged `draft` until the owner reviews it. Proposed examples and reading durations in the proposal are design concepts, not published historical claims. (Proposal §1, §18.)
- **Design system is `DESIGN.md`.** Two surfaces (album ink, gummed paper), six era inks read only from `eraAccent` in `src/components/ui.tsx`, franking ochre for the single primary action per view, one postmark per view, square corners, no shadows, `.stamp` the only uppercase, all type from the fixed ramp (no `text-[...]` literals), perforation teeth matched to their background via `--tooth`.
- **Typography targets (design targets to validate, not standards):** body text 18px on phones and 18–20px on larger screens; interface text 15–16px; reading line-height 1.55–1.7; paragraphs 55–75 characters. (Proposal §10.) The current `reading` step is 17px/1.62 on a 66ch measure; Stage 2's reading toolbar adds the user-controlled larger steps rather than changing the base.
- **Touch targets:** 44×44 CSS px for primary controls with generous spacing (a usability target, not a WCAG claim). (Proposal §13.)
- **WCAG 2.2 AA is the delivery target**, verified with automated (axe) and manual checks; no conformance certification is claimed. (Proposal §13.)
- **Motion:** honour `prefers-reduced-motion` and offer a persistent Reduce motion setting; core reading and navigation complete with effects disabled; no scroll hijacking, automatic sound, flashing, bouncing text or mandatory animation waits; one easing and the three durations in `DESIGN.md`. Timings from the proposal: timeline progress scroll-linked; chapter intro 350–500ms once; postmark 180–250ms; filter rearrangement 180–250ms; reading-mode 120–180ms. (Proposal §11.)
- **No library or plugin added solely to create an effect achievable with the current stack.** (Proposal §12.) GSAP is already a dependency; Stage 3 uses it only for the FLIP filter rearrangement (GSAP `Flip` plugin, bundled with gsap) where CSS cannot do the job.
- **Prerendering gotchas (from `scripts/prerender.mjs`, `src/lib/hooks.ts`, `src/components/ui.tsx`):** any new dynamic content must render identically at build time and at hydration. Use deterministic picks (`dailyShuffle`, `hashPick`), guard real network calls on `window.__PRERENDERING__`, round inline numeric styles to 2dp, prefer CSS custom properties over `style.color`/`style.backgroundColor`, keep `getServerSnapshot` references stable, and set `data-prerender-ready` only when the page's real content is in the DOM.
- **Language:** UI chrome and typography stay Latin-first. Tamil and Hindi appear only as reviewed translations of trail reading content (Stage 4), each linked to the English source version and flagged when that version changes. Public copy uses "Stories beyond the familiar names" rather than implying communities forgot their own history. (Proposal §14, §15; owner decision 8 September 2026.)
- **Analytics:** only coarse, allow-listed events (trail start, stop viewed, completion, source opened, quiz reviewed, glossary opened, correction submitted). Never children's free text, names or raw search queries. Every call site passes shape, not content. (Proposal §17; `src/lib/analytics.ts`.)
- **Deploy stays on GitHub Actions** (`.github/workflows/ci.yml`): build, validate, test, then `wrangler deploy` on push to `main` only. A manual `workflow_dispatch` runs the checks and does not deploy; that is the intended behaviour (owner decision 8 September 2026). Stage 1 removes Wrangler's own `build.command` so the deploy ships the artifact CI just tested instead of rebuilding it.
- **Commit discipline:** one commit per task, message in the imperative, ending with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Never commit with failing `npm run typecheck`, `npm run validate`, `npm run test:unit` or `npm test`.

---

## Decisions taken in this plan (change here, not in the stage plans)

1. **Public domain.** The live site is served at `https://india-freedom-timeline.ravi-kumar-f73.workers.dev`. All canonical/OG/sitemap/robots/JSON-LD URLs derive from one committed setting, `VITE_SITE_URL` in `.env`, defaulting to that Workers URL. When a custom domain exists, change that one line. (Stage 1, Task 2.)
2. **Correction fallback address.** The mailto fallback needs a recipient. It comes from `VITE_CORRECTIONS_EMAIL` in `.env`. Until the owner supplies one it is empty, and the UI falls back to "Try again" plus a pre-filled GitHub issue link labelled as such. See "Inputs required". (Stage 1, Task 8.)
3. **Unit tests.** Pure logic (URL state, search, glossary matching, reading time, citation parsing, trail progress) is tested with `vitest`, run as `npm run test:unit` locally and in CI before the build. Playwright remains the end-to-end suite (`npm test`). (Stage 1, Task 1.)
4. **URL state and hydration.** Filter and view state live in the query string via one `useUrlState` hook. Because pages are prerendered without a query string, the hook initialises to defaults during the hydration render and applies the URL in an effect, so `/timeline?region=south` never produces a hydration mismatch. (Stage 1, Task 4.)
5. **Navigation.** Following the proposal's primary recommendation: desktop header shows Home · Timeline · People · Map · Trails · Learn plus the persistent Search control; the phone bottom bar shows four destinations — Home · Explore · Trails · Learn — where Explore opens the existing bottom sheet listing Timeline, People, Map, Events, Movements and About & sources. The proposal asks that label changes be tested for task completion; the pilot script covers this. (Stage 2, Task 10.)
6. **Timeline progress.** Bound to the timeline container with CSS `animation-timeline: view()` (static fallback retained), not `scroll(root)`, so the footer no longer counts and layout changes recalculate for free. GSAP is reserved for the FLIP filter rearrangement. (Stage 3, Tasks 2 and 5.)
7. **Claim-level citations.** Inline markers of the form `[^n]` inside biography, chapter, legacy, description and significance text refer to the 1-based index of the record's `sources` array. The renderer turns them into superscript buttons with a citation preview; the validator fails the build on an out-of-range marker. No parallel "claims" table. (Stage 2, Task 2.)
8. **Connections.** A new optional `connections` array with a typed, explained relationship (`ally`, `opponent`, `family`, `mentor`, `inspired`, `successor`) drives the constellation and the "Connections" section. The legacy `relatedPeople` array becomes "Similar stories" until editors migrate it. Lines are drawn only for documented connections. (Stage 2, Task 6.)
9. **Trails.** A trail is typed data referencing existing record ids, with a version number; translations (Stage 4) point at the English version they were made from. Trails render with a visible draft stamp until `editorial.status === 'reviewed'`. Progress is stored on the device (`localStorage`) with no account. (Stage 2, Tasks 7–9.)
10. **Pilot measurement.** `track()` posts allow-listed events with `navigator.sendBeacon` to a new Worker route `POST /api/event`, which writes to a Cloudflare Analytics Engine dataset. Enabled only when `VITE_EVENTS=on` at build time and never during prerendering. (Stage 2, Task 14.)
11. **Rewards.** An optional private exploration passport marks completed trails with a restrained stamp. No public rankings, streaks, or points tied to deaths or imprisonment. (Stage 4, Task 8.)

## Inputs required from the owner

These block a task from being *finished*, not from being *built*. Each stage plan names the task that consumes the input.

| Input | Consumed by | Until supplied |
|---|---|---|
| A correction-inbox email address for `VITE_CORRECTIONS_EMAIL` | Stage 1 Task 8 | Fallback shows Try again + GitHub issue link |
| Custom domain, if any, for `VITE_SITE_URL` | Stage 1 Task 2 | Workers URL is used everywhere |
| Editorial review of the three trail drafts, the glossary definitions, and the typed `connections` entries (flip `editorial.status` to `reviewed`) | Stage 2 Tasks 3, 6, 9 | Content renders with a "Draft — under editorial review" stamp |
| Reviewed `aims/methods/reach/participants/disagreements/outcomes` text for movements | Stage 2 Task 13 | Movement pages render existing description only |
| A qualified historical reviewer for high-impact disputed claims featured in trails | Stage 2 Task 9 | Trails stay `draft` |
| Cloudflare Analytics Engine dataset binding (`wrangler.jsonc`) | Stage 2 Task 14 | Endpoint returns 204 and drops events |
| Real-device test results at 320/360/390/768 (Android + iOS) | Stage 3 Task 8 | Emulated viewport tests only |
| Verified Dandi March stop list with coordinates flagged approximate | Stage 4 Task 3 | Route stays `draft` |
| One licensed archival document scan + rights statement | Stage 4 Task 4 | Explorer built against a public-domain text (Queen's Proclamation 1858) pending scan |
| Recorded narration (human-reviewed pronunciation) for one trail | Stage 4 Task 5 | Listen control hidden |
| Reviewed Tamil and Hindi translations of one trail | Stage 4 Task 6 | Language switch hidden |
| A qualified educator to review curriculum-alignment wording | Stage 4 Task 7 | Teacher pack labelled "proposed alignment" |
| Pilot participants (children with adult involvement, teachers, parents, older adults, accessibility needs) | Validation | — |

---

## Coverage map: proposal section → task

| Proposal section | Where it lands |
|---|---|
| §1 Purpose, first release list | Stages 1–3 in full; pilot in Validation below |
| §2 Search: laxmibai on People | S1 T3 |
| §2 Filters not in URL | S1 T4, T5 |
| §2 Canonical points at pages.dev | S1 T2 |
| §2 Single-event decades in a 3-col grid | S1 T7 |
| §2 Map abbreviations, selector, list view | S1 T10 |
| §2 Velu Nachiyar citations underspecified | S2 T1 (SourceRef precision fields), S2 T2 (claim markers), content input |
| §2 Relationship type unexplained | S2 T6 |
| §2 Correction email fallback has no recipient | S1 T8 |
| §3 Reading preferences, not age gates; toolbar; glossary; content notes | S2 T3, T4, T5 |
| §3 Emotional engagement with care (content notes, no suffering as reward) | S2 T5 (content note field), S4 T8 (passport rules) |
| §4 Homepage sequence, editorial rhythm, "Today's featured story" | S1 T9 (copy), S2 T10 (homepage) |
| §4 Navigation, breadcrumbs, return to filtered list | S2 T10; S1 T6 (scroll/return) |
| §5 Three timeline views, no drag slider, prev/next chapter, text + colour marking | S2 T11 (guided story = trail 3), S1 T11 (chapter landing), S3 T2 (progress) |
| §5 "Next in this collection" vs causal | S1 T9 (wording), S2 T1 (`consequences` field) |
| §5 Continuous event list, chips, counts, URLs, restore position | S1 T5, T6, T7 |
| §5 Movement pages: aims, methods, reach… | S2 T13 |
| §6 Profile structure, evidence in reading, uncertainty near passage | S2 T1, T2, T5 |
| §6 Connections typed; full-name headings; lifespan beyond frame | S2 T6; S1 T9 |
| §6 Reading and listening | S2 T4 (toolbar); S4 T5 (audio) |
| §7 Trails: format, three trails, example stop, rewards | S2 T7, T8, T9; S4 T8 |
| §8 Quiz, guess, compare, new activities, teachers | S2 T11, T12; S4 T7; new activity candidates deferred to after pilot (see Deferred) |
| §9 Map improvements, place model, historical geography, animated route, parallel stories | S1 T10; S4 T1, T2, T3; parallel stories deferred |
| §10 Visual identity, typography tokens, informative images, less decoration | S2 T4 (text sizes), S2 T5 (portrait kind captions), S1 T7 (fewer card grids) |
| §11 Animation first release | S3 T1–T6 |
| §12 Richer storytelling | S4 T3, T4; portrait transition and document inspection deferred until pilot |
| §13 Accessibility, mobile, low-data, offline | S3 T7–T10; S4 T9 |
| §14 Content standards, review workflow, content model additions | S2 T1; CONTRIBUTING update in S2 T1 |
| §15 Extensions | S4 |
| §16 Roadmap, backlog, technical approach, dependencies | This file; S1 T2 (deploy artifact) |
| §17 Validation, measures, functional checks, measurement | Validation below; S2 T14; S3 T7, T8 |
| §18 Evidence notes | No task; retained in the docx |

## Deferred (explicitly, with the reason)

- **New activity candidates** (order three events, match person to place, explore a document, quotation vs paraphrase, cause and consequence, dilemma) — the proposal says to run the pilot before producing a large activity library. Stage 2 ships the trail completion activity in two shapes (`choice`, `order`), which is the seed for these.
- **Portrait-to-biography transition, archive document inspection animation, gentle image movement** — §12 says add only after the core is clear and reliable and testing shows benefit. Stage 4 builds the document viewer without handwriting animation.
- **Parallel histories ("Meanwhile elsewhere"), exhibition mode, community contributions, conversational guide** — after pilot / after classroom testing / capacity-dependent per §15.
- **Boundary toggle for historical geography** — requires reviewed datasets; Stage 4 Task 2 only labels the frame.

---

## Validation (the pilot) — checklist, not code

Run after Stage 2 ships, in parallel with Stage 3.

1. Recruit a small, varied group: the proposed reading ages (with appropriate adult involvement for children), teachers, parents, older adults, mobile users, readers new to the subject, people with accessibility needs. Formative, not statistically representative.
2. Tasks per participant, uncoached: find an unfamiliar person; complete one short trail; explain a contribution in their own words; find the evidence for one claim; save a story and return to it.
3. Record where they hesitate and what they expected.
4. Provisional acceptance measures (targets, not results):
   - Discovery: ≥ 80% start an unfamiliar story without help.
   - Understanding: can explain one contribution and one contextual constraint after a trail (educator-reviewed rubric).
   - Evidence: can locate a source and tell an uncertain claim from an established one.
   - Continuity: back navigation and refresh preserve filters, selected state and reading point (Stage 1 e2e specs are the automated half of this).
   - Access: keyboard, reduced-motion and text-only journeys give equivalent content (Stage 3 specs).
   - Comfort: text size, labels, pacing and media controls reported usable.
5. Functional and technical checks before the pilot: `npm run typecheck && npm run validate && npm run search:check && npm run test:unit && npm run build && npm test && npm run lighthouse`, plus the real-device pass at 320/360/390/768 and a screen-reader pass through one trail.
6. Set device and network performance budgets before the pilot (Lighthouse CI is already wired; flip the performance assertion from `warn` to `error` once two weeks of CI runs hold at 90+).
7. Launch decision: publish when the core tasks work, featured content is `reviewed`, access alternatives are complete and no critical navigation or reading defects remain.

## Sequencing dependencies (from §16)

- Accurate sources and media rights precede animated stories → Stage 2 citations before Stage 4 route/document.
- Relationship modelling precedes labelled connection diagrams → S2 T6 before any constellation motion.
- Historical location data precedes geographic animation → S4 T1 before S4 T3.
- Accessibility and low-data alternatives are part of each feature → every stage plan's tasks include a reduced-motion / text-only step; Stage 3 is the audit, not the first time it is considered.
- Run the pilot before producing narrated or translated content at scale → Stage 4 does one of each.
