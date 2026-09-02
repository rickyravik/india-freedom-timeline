# Product

<!-- impeccable:product-schema 1 -->

_Drafted from README.md, DESIGN.md and the codebase on 2026-09-02 without a product interview; facts marked (inferred) should be confirmed by the owner._

## Platform

web

## Users

- General readers curious about India's struggle for independence, browsing on phones as much as desktops (mobile-first is a stated requirement; works from ~320 px).
- Students and teachers using it for history lessons: Story Mode (child-friendly) vs Detailed History (adult) per profile; quiz, "guess the fighter", and side-by-side comparison of two lives. (inferred from features)
- Descendants and regional communities looking for under-told figures: Adivasi and tribal leaders, women, princely-state satyagrahis, Tamil Nadu figures. (inferred from data emphasis on "forgotten heroes")

## Product Purpose

An interactive, historically grounded archive of the people, movements and events of India's struggle against British colonial rule, 1757–1947. Success is a reader who arrives for one name and leaves having met several more, trusting what they read because every claim is sourced.

## Positioning

"Built like a premium historical product, not an encyclopedia": every biography leads to related lives, events and movements (discovery trails, constellation, "what happened next"), and every record carries visible sources with disputed claims explicitly labelled. Nothing is fabricated — including portraits, which are deliberately absent rather than AI-generated.

## Operating Context

Fully static SPA (React 18, Vite 7, Tailwind 3, react-router 6), deployed to Cloudflare Pages. All historical content lives in `src/data/` as typed records (88 fighters, 47 events, 13 movements, 20 organizations, 9 eras); UI never hard-codes history. Self-hosted fonts via Fontsource. No backend, no analytics.

## Capabilities and Constraints

- Routes: home, chapter-based timeline with filters, people index with filters, fighter profiles (Story Mode stepper on phones, Detailed mode), events, movements, stylised map of India, global search (command palette ⌘K / "/"), Learn (quiz, guess, compare), About.
- Content house rules: at least one reputable source per record; never invent dates, quotes or facts; disputed claims carry a `disputed` note; Story Mode chapters age-appropriate.
- **No Hindi / Devanagari text anywhere in the product** (owner decision, 2026-09-02). Typography is Latin-first; other Indic scripts are not ruled out but must be asked about before use.
- Portraits: records support a `portrait` path; the project ships without images and renders a typographic fallback rather than unverified likenesses.
- Map geography currently uses modern state boundaries with a caveat; a period-accurate (provinces & princely states) view is an open decision.

## Brand Commitments

- Name: "India's Freedom Timeline". Tagline in use: "Millions resisted. Thousands sacrificed."
- Voice: dignified, plain, sourced. Martyrdom and suffering are presented with quiet weight, never as spectacle; the archive represents the movement's plurality (nonviolence and armed struggle, moderates and revolutionaries) without endorsing a single line.
- Emblem: a chakra-derived ring mark (the Ashoka Chakra has 24 spokes).

## Evidence on Hand

- 88 biographies, 47 events, 13 movements, 20 organizations, 9 eras with sources, in `src/data/`.
- Did-you-know facts (`src/data/facts.ts`) and quizzes (`src/data/quizzes.ts`).
- No portrait images, no testimonials, no usage metrics. Future work must not fabricate any of these.

## Product Principles

1. Content first: the interface narrates and connects; it never decorates.
2. Every screen leads somewhere else.
3. Dignity over drama.
4. One hand, one thumb: primary actions reachable on a 375 px phone.
5. Works without JavaScript animation, images or hover.

## Accessibility & Inclusion

Semantic HTML, keyboard operable, visible focus rings, ARIA on dialogs and controls, `prefers-reduced-motion` respected, minimum UI text 12 px and AA contrast on paper surfaces (target restated after the 2026-09 critique found 8–10 px labels and 4.1:1 sepia text).
