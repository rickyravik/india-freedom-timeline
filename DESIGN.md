# Design direction — "The Archive Room"

This document records the first-principles critique of the v1 interface and the design system that replaced it.

## 1. Critique of v1

| Area | What was wrong | What changed |
| --- | --- | --- |
| **Visual hierarchy** | One warm paper tone everywhere; every section was a grid of same-sized cards, so nothing led the eye. Headlines and body sat at similar visual weights. | A two-surface system: dark **vault** surfaces (the archive) frame and punctuate; warm **paper** surfaces carry reading. Giant display numerals (years, chapter numbers) become anchors. Type scale contrast widened (display 900 vs body 400). |
| **Navigation** | Five equal tabs; search hidden in a header pill; no sense of "where am I in history". No way back along a discovery trail. | Search becomes a command palette (⌘K / tap) available everywhere. Mobile nav keeps 5 thumb targets but with clearer active state. Era navigator tracks scroll position. A **trail** (recently viewed lives) makes the discovery journey visible and reversible. |
| **Timeline usability** | Filter panel pushed content below the fold on desktop; eras read as equal boxes; no feel of progression through time. | Timeline is now **chapters**: each era opens with a dark chapter plate carrying a huge year numeral that drifts with scroll. A scroll-linked spine fills as you descend. Active era is highlighted in the sticky rail. Filters collapse behind a single control on every breakpoint. Events reveal as you reach them. |
| **Profile discovery** | Related people were a grid at the very bottom; nothing showed *where a life sat in the story*. | Hero shows a **lifespan bar** placing the life against 1757–1947 and its eras. Related people are drawn as a **constellation** with lines that draw in — connections you can see. "Continue the thread" surfaces recent trail and a fresh discovery. |
| **Mobile ergonomics** | Story chapters stacked as a long scroll; filter chips wrapped into tall blocks; no gesture affordances. | Story Mode is a **stepper** on phones (one chapter, progress dots, thumb-height prev/next); bottom sheets gain a drag handle and spring easing; primary actions sit in the bottom 40 % of the screen. |
| **Search & filtering** | Separate page only; results as a plain list; filters as visible wall of chips. | Command palette with grouped results and keyboard navigation from any page; the /search route remains for deep links and SEO. Filters live in a single sheet/popover with an active-count badge. |
| **Historical atmosphere** | Parchment texture only — pleasant but flat; nothing evoked archives, seals, ledgers, stamps. | Vault plates with vignette + grain, hairline brass rules, red **seal** accents for interactive states, ledger-style date columns, index-card facts, stamp-like eyebrows, drop caps in long reading. Restraint: no faux-aged photo filters, no flag animations. |
| **Accessibility** | Good baseline (semantics, focus rings). Dark surfaces were absent so contrast was never stressed; some 9 px labels on the map. | All text on vault ≥ 7:1 (paper on ink). Minimum UI text 11 px. Every animation is CSS-driven and switches off under `prefers-reduced-motion`; every reveal is visible without JS/IO. Palette is a real `role="dialog"` with focus management and Escape. |
| **Performance** | Fine (static, code-split), but chunk naming was accidental. | Reveals use one IntersectionObserver and scroll-linked effects use CSS `animation-timeline` with a static fallback. GSAP is installed locally for animation work rather than fetched by a deferred third-party script. Fonts are self-hosted, and variable Fraunces replaces four static cuts. |
| **Emotional storytelling** | Content was strong; presentation was catalogue-like. | Chapter plates, pull-quotes, lifespan bars, "what happened next", the trail — the interface now *narrates* rather than lists. |

## 2. Visual system

**Surfaces.** `vault` (#15120e → #221c15 gradient, indigo tint) for hero, chapter plates, profile heroes, footer. `paper` (#f5efe0 family) for reading. The rhythm of a page alternates them like turning from an archive box to a document.

**Colour.** Ink, paper, deep indigo, muted saffron, forest, oxide red (the "seal" — every primary interactive accent), antique brass (hairlines, ornaments), sepia (metadata). Eras keep their accent for consistent colour-coding across timeline, cards and constellation.

**Type.** *Fraunces* (variable; optical sizing on, weights 300–900, italics for taglines and pull-quotes) for display; *Crimson Pro* for narrative reading with drop caps; *Inter* for UI. Scale: display 3.5–6.5 rem clamp, h2 2–2.5 rem, reading 1.1 rem / 1.75.

**Motion.** One easing — `cubic-bezier(.22,.61,.36,1)` — and three durations (160 / 400 / 700 ms). Vocabulary: fade-up reveal (16 px), mask reveal (clip-path from bottom) for plates, line-draw for connections, drift for numerals (scroll-driven), page-enter crossfade. No bounce, no spin. Everything respects `prefers-reduced-motion`.

**Components.** Chapter plate · Era rail · Spine · Ledger row · Document card · Medallion (era-ringed) · Lifespan bar · Constellation · Stepper · Command palette · Bottom sheet · Index card (fact) · Pull-quote · Seal button · Historians' note · Sources list.

## 3. Principles

1. Content first — motion explains structure, never decorates it.
2. Every screen leads somewhere else.
3. Dignity: martyrdom and suffering are presented with quiet weight, never as spectacle.
4. One hand, one thumb: primary actions reachable on a 375 px phone.
5. Works without JavaScript animation, images or hover.
