---
name: India's Freedom Timeline
description: A philatelic archive — album ink as the field, gummed paper as the only reading surface, and every life issued as a perforated commemorative.
colors:
  vault: "#10312b"
  paper-50: "#f7f3ea"
  paper-100: "#f2ede2"
  paper-200: "#e6dfcf"
  paper-300: "#d3c9b4"
  paper-400: "#b9ac91"
  ink: "#17201c"
  ink-soft: "#3d4a44"
  ink-faint: "#5a6861"
  oxide: "#c4611f"
  oxide-deep: "#a34e12"
  oxide-bright: "#eda15f"
  oxide-wash: "#f7e6d6"
  indigo-mid: "#23406b"
  indigo-deep: "#1a3154"
  indigo-soft: "#a8b8cd"
  indigo-wash: "#e6eaf1"
  forest: "#14453d"
  forest-deep: "#0e332d"
  forest-bright: "#a8c7bd"
  saffron: "#8e2f2a"
  saffron-deep: "#6f2420"
  saffron-bright: "#d98a80"
  sepia: "#5b2e4a"
  sepia-deep: "#452038"
  sepia-bright: "#c5a8b7"
  brass: "#8f7a45"
  brass-deep: "#7c6428"
  brass-bright: "#dcc17f"
  violet: "#3b2e6e"
  violet-deep: "#2b2151"
typography:
  display:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "4rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  display-phone:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  headline:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  title:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  subtitle:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  record-title:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
    fontVariation: "'opsz' 16"
  denomination:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
    fontFeature: "tabular-nums lining-nums"
  reading:
    fontFamily: "Faustina Variable, Faustina, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  body:
    fontFamily: "Archivo Narrow Variable, Archivo Narrow, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo Narrow Variable, Archivo Narrow, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  stamp:
    fontFamily: "Archivo Narrow Variable, Archivo Narrow, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.06em"
rounded:
  sm: "2px"
  sheet-lip: "6px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-lg: "32px"
  card: "20px"
  pane: "28px"
  band: "48px"
  section: "56px"
  section-lg: "80px"
components:
  sheet:
    backgroundColor: "{colors.paper-100}"
    textColor: "{colors.ink}"
    rounded: "0px"
    padding: "24px 12px"
  pane:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper-100}"
    rounded: "0px"
    padding: "{spacing.pane} 20px"
  doc:
    backgroundColor: "{colors.paper-50}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "{spacing.card}"
  button-seal:
    backgroundColor: "{colors.oxide}"
    textColor: "{colors.paper-50}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-seal-hover:
    backgroundColor: "{colors.oxide-deep}"
    textColor: "{colors.paper-50}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-ghost-vault:
    backgroundColor: "transparent"
    textColor: "{colors.paper-100}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  chip:
    backgroundColor: "{colors.paper-50}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
    height: "36px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-50}"
  chip-vault:
    backgroundColor: "transparent"
    textColor: "{colors.paper-200}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
    height: "36px"
  stamp-tag:
    typography: "{typography.stamp}"
    rounded: "0px"
    padding: "1px 6px"
  postmark:
    rounded: "{rounded.full}"
    size: "96px"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "0px"
    height: "56px"
  bottom-sheet:
    backgroundColor: "{colors.paper-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet-lip}"
    padding: "8px 20px"
---

# Design System: India's Freedom Timeline

## Overview

**Creative North Star: "The Commemorative Sheet"**

The system is built from India Post's martyr commemoratives. A dark album page is the field the whole product sits on; a sheet of gummed paper is mounted on it and is the only place reading happens; and a **pane** — one stamp — is a block of a single era ink at full strength, perforated on all four sides, its teeth cut from whatever it happens to sit on. Years are not dates but **denominations**, struck in the display face with tabular figures. A **postmark** cancels the principal pane of a page. The result is quiet, dense and materially specific: philatelic rather than "heritage", archival rather than antiqued.

Two things make it hold together, and both are cheap to break. First, the surface discipline: album ink and gummed paper are the only two grounds, era inks are pigments printed onto that structure, and franking ochre is the one ink that ever means *act*. Second, the perforation: teeth are drawn from radial-gradients tinted by a `--tooth` custom property, so a pane's edge only reads as a perforation when `--tooth` matches the colour behind it. Get that wrong and the signature device turns into a row of coloured dots.

The direction contract named this world; the build is where it landed, and **where the two disagree the build is authoritative**. Two divergences are worth stating. The contract lists violet among the era inks; in the shipped `eraAccent` there are exactly six era inks (prussian, stamp green, carmine, plum, gauge gold, franking ochre) and violet survives only as the region ink for "abroad" and as one of six fallback monogram plates. And franking ochre does double duty: it is the single action ink *and* the era ink of two chapters — on a pane it is a ground and a label colour, never a call to act.

One further inheritance the build carries and future work must not misread: **the Tailwind token names predate this world.** `vault` is album ink, `paper` is the gummed sheet, `oxide` is franking ochre, `saffron` is carmine, `brass` is perforation-gauge gold and `sepia` is plum. The names are wrong about the colours; the values are right. The mapping is documented in the header comment of `tailwind.config.js` and repeated under Colors below.

**Key Characteristics:**

- Two surfaces only: album ink as the field, gummed paper as the only reading ground.
- Perforation as the signature edge — 12px gauge (`.perf-all`, `.perf-x`), 8px fine gauge (`.perf-fine`) for small stamps.
- Six era inks colour-code nine chapters; one ochre accent carries every action.
- Three faces, three jobs: Bodoni Moda engraved display, Archivo Narrow for denominations/labels/UI, Faustina for long-form reading.
- Square corners (2px), hairline gauge-gold rules, one elevation.
- One easing (`cubic-bezier(0.22, 0.61, 0.36, 1)`), three durations (160 / 400 / 700 ms), no bounce and no spin.
- Every reveal, every scroll-linked effect and the whole layout survive with JavaScript, hover and images all absent.
- No photographic imagery at all: the product deliberately ships no portraits.

## Colors

A two-surface structure — dark album ink against warm gummed paper — printed with six saturated stamp inks and franked in a single ochre.

### Primary

- **Franking Ochre** (`oxide` #c4611f): the one action ink. Primary buttons (`.btn-seal`), inline links and "read on" affordances, the timeline spine's scroll progress, the franked span on a lifespan bar, the focus ring, the mobile-nav active state, the drop cap. Its **deep cut** (#a34e12) is the hover state and the pane ground when ochre is used as an era ink; its **bright cut** (#eda15f) is the same ink for use on album ink or a pane; its **wash** (#f7e6d6) backs a historians' note.

### Secondary

Six **era inks**, one per accent key in `eraAccent`, assigned to nine chapters (two inks serve two chapters each). Each has a mid cut for lettering and lines and a **deep cut** for a plate that must carry paper text.

- **Prussian** (`indigo` mid #23406b / deep #1a3154): Non-Cooperation and Freedom at Midnight; also the source-link ink.
- **Stamp Green** (`forest` #14453d / deep #0e332d): War & Home Rule; the default pane ink for `.vault`.
- **Carmine** (`saffron` #8e2f2a / deep #6f2420): Swadeshi & Revolution, Civil Disobedience.
- **Plum** (`sepia` #5b2e4a / deep #452038): Early Resistance; also the metadata ink for `.label` and most `.stamp` tags on paper.
- **Gauge Gold** (`brass` #8f7a45 / deep #7c6428): Rise of Nationalism; and, as **brass-bright** #dcc17f, every rule and ornament seen against album ink.
- **Franking Ochre** as above: The Revolt of 1857, Quit India & the INA.

### Tertiary

- **Stamp Violet** (`violet` #3b2e6e / deep #2b2151): not an era ink. It appears as the region ink for "abroad" on the map sheet and as one of six fallback monogram plates for a life with no era on record.

### Neutral

- **Album Ink** (`vault` #10312b): the page field — behind every sheet, and the ground of the header, footer, mobile nav, scrim and full-bleed bands. Never a reading surface.
- **Gummed Sheet** (`paper-100` #f2ede2): the mounted sheet; the default reading ground and the default tooth colour on a sheet.
- **Selvedge / Card** (`paper-50` #f7f3ea): the slightly lighter ground of a `.doc` card and of paper lettering on any ink; **paper-200** #e6dfcf for an inset panel or empty mount, **paper-300** #d3c9b4 for a card border, **paper-400** #b9ac91 for a chip border, divider or inactive dot.
- **Ink** (`ink` #17201c): body and heading text on paper; **ink-soft** #3d4a44 for secondary prose, **ink-faint** #5a6861 for the faintest metadata. Ink at full strength is also the active-chip and active-rail ground.

### Named Rules

**The Two Surfaces Rule.** There are exactly two grounds: album ink and gummed paper. Era inks are pigments printed onto that structure, never a third surface. Long-form reading only ever happens on paper.

**The One Franking Ink Rule.** Franking ochre is the only ink that means *act* — primary buttons, links, progress, focus. Era inks classify; they never invite a click. A screen whose call to action is any colour but ochre is wrong.

**The onInk Rule.** Anything mounted on an era-ink ground takes its lettering from `eraAccent.onInk` / `eraAccent.onInkMuted` — never a hardcoded `text-paper-*` class, never an era's own mid cut. `eraAccent` in `src/components/ui.tsx` is the single authority for era colour (`bg`, `text`, `textVault`, `border`, `ring`, `onInk`, `onInkMuted`, `hex`, `hexPlate`); read a colour from it rather than re-deriving one.

**The Deep-Cut Rule.** A pane ground must clear AA against paper lettering at 13px. Ochre and gauge gold reach only ~4.0:1 at their mid cuts, so `eraAccent.bg` uses their deep cuts (#a34e12, #7c6428) while the other four use their mid cuts. Any new pane ink must be verified the same way, not eyeballed.

**The Inherited Name Rule.** Token names are older than this palette: `vault` = album ink, `paper` = gummed sheet, `oxide` = franking ochre, `saffron` = carmine, `brass` = gauge gold, `sepia` = plum. Trust the value, not the name, and do not rename them — the whole build references them.

## Typography

**Display Font:** Bodoni Moda Variable (with Bodoni Moda, Georgia, serif)
**Body / Label / UI Font:** Archivo Narrow Variable (with Archivo Narrow, system-ui, sans-serif)
**Reading Font:** Faustina Variable (with Faustina, Georgia, serif)

**Character:** An engraved Didone for heads and denominations, the way a stamp legend is cut; a condensed gothic for values, labels and every piece of UI text; and a warm, slightly narrow serif for anything anyone actually reads at length. All three are self-hosted variable faces. The ramp is fixed-step — eight named roles, adjusted at one or two breakpoints — with no fluid `clamp()` anywhere.

### Hierarchy

- **Display / hero** (600, 4rem, 1.02): the hero headline of a first-day pane and a profile hero name.
- **Display / phone** (`text-hero-sm`, 500, 2.25rem, 1.06): the same headline on phones — 4rem breaks it over four lines at 390px.
- **Headline / h1** (600, 2.75rem, 1.05): the page head inside `PageIntro`; also the chapter denomination on a timeline pane.
- **Title / h2** (600, 1.875rem, 1.12): section heads under a double rule; chapter names.
- **Subtitle / h3** (600, 1.375rem, 1.2): movement titles, sidebar and dialog heads, pull-quotes above `sm`.
- **Record title / h4** (`text-h4`, 600, 1.1875rem, 1.3): the step between reading and h3 — a person's name on a card, an event title, a pull-quote on phones.
- **Denomination** (700, 1.375rem, leading-none, tabular): `.denom` — a year set as a stamp's value. Scales up to h1/hero size on a chapter pane.
- **Reading** (400, 1.0625rem, 1.62): Faustina, for biographies, chapter text, era descriptions, ledes and taglines (taglines italic). Capped at `max-w-prose` (66ch).
- **Body / meta** (400, 0.9375rem, 1.45): Archivo Narrow, for summaries, card copy, buttons and all UI strings.
- **Label** (500, 0.8125rem / 13px, 1.25rem): `.label` (plum on paper) and `.label-vault` (paper-300 on ink) — metadata, list heads, legends, counts. 13px is the floor for any label on a coloured pane.
- **Stamp tag** (600, 0.75rem / 12px, 0.06em, uppercase): `.stamp` — a boxed classification tag in a `currentColor` border.

### Named Rules

**The Pinned Optical Size Rule.** `font-optical-sizing: none` and `font-variation-settings: 'opsz' 16` are set once, globally, on `body` — not per heading. Left on `auto`, Bodoni's optical axis raises stroke contrast with size until the hairlines — commas, the tails of *y* and *g* — vanish at any large size, monograms and denominations included, not only in an `h1`; faces without the axis ignore the pin. Headings then add only the display face, `font-weight: 600` (700 reads chunky at display sizes), `letter-spacing: 0` and `text-wrap: balance`. Do not re-enable optical sizing anywhere, and do not re-declare the pin locally.

**The Denomination Rule.** Every year, chapter number and figure is a denomination: display face, bold, `leading-none`, and `.num` for `tabular-nums lining-nums` so columns of years align. Years are never set in the body face. The slot is always struck — an undated life shows an em dash, so a missing value reads as an unknown denomination rather than a card that failed to render. A denomination at hero size needs explicit leading (~1.08) so its digits are not shaved by a reveal mask.

**The One Uppercase Rule.** `.stamp` (12px, 0.06em, boxed) is the **only** uppercase in the system, and `.postmark` the only other tracked type. Everything else — labels, buttons, section heads, nav — is sentence case with `letter-spacing: 0`. This is a single sanctioned exception for a philatelic classification tag, not a licence for tracked-caps eyebrows, kickers or label styling anywhere else.

## Layout

Every route renders inside one gummed sheet. `Layout` wraps the router outlet in `.sheet.perf-x` (paper ground, perforated top and bottom) inside `container-page`, so album ink shows as a margin down both sides and reading always lands on paper. `container-page` is `max-w-6xl` (72rem) with 16px gutters, 24px at `sm` (640px) and 32px at `lg` (1024px); the three breakpoints in use are Tailwind's defaults — `sm` 640, `md` 768 (nav and constellation switch), `lg` 1024.

Vertical rhythm is coarse and consistent: 56px between sections on phones, 80px from `sm` up; a full-bleed `.vault` band is `py-12` / `sm:py-16`; a pane is `py-7 px-5` / `sm:py-10 px-9`; a `.doc` card is 16–24px inside. The sticky header is 64px tall and `scroll-padding-top` is 7rem so anchored chapters clear both it and the era rail.

Composition is single-column and narrow by default, widening at `lg` into two asymmetric columns — a profile is `1fr 300px` with a sticky sidebar; a featured pair is `1.25fr 1fr`. Ledger patterns (an event card, a timeline entry) use a fixed date gutter of 4.5–7.5rem with a hairline right border, so denominations form a true column.

Responsive behaviour is a change of mechanism, not just of width: primary nav becomes a fixed bottom bar under `md` with `pb-safe` and 56px targets; filters move from inline controls to a drag-dismissible bottom sheet; horizontal card rails become grids at `sm`; a constellation becomes a swipeable row of cards; Story Mode becomes a one-chapter-at-a-time stepper with thumb-height prev/next. All interactive targets are at least 36px (`chip`) or 44px (buttons) tall.

### Named Rules

**The Sheet Rule.** Every route is one mounted sheet. Do not nest a sheet inside a sheet, and do not set body copy directly on album ink — a full-bleed dark band is a *pane*, and what it contains follows The onInk Rule.

**The Thumb Rule.** On a 375px screen the primary action of any view sits in the bottom 40% or in the fixed bottom bar. Buttons are `min-h-11` (44px), chips `min-h-9` (36px), nav targets 56px.

## Elevation & Depth

The system is flat by conviction: there is exactly one `box-shadow` in the entire build (`shadow-sheet`, `0 -12px 40px rgba(8,24,20,0.45)`), and it exists only to lift the mobile bottom sheet off the page it slides over. Depth everywhere else is material, not optical — album ink behind gummed paper behind an era-ink pane; a hairline `paper-300` frame around a card; a 1px gauge-gold rule; and above all the perforated edge, which reads as a physical cut rather than a lift. Hover never raises anything: it darkens an ink, firms a border to `ink`, or drops opacity to 0.9.

### Shadow Vocabulary

- **Sheet lift** (`box-shadow: 0 -12px 40px rgba(8,24,20,0.45)`): the bottom sheet only. Nothing else in the system casts a shadow.

### Named Rules

**The One Elevation Rule.** Surfaces do not lift. Rank comes from ground colour, a hairline frame, and perforation. If a new component seems to need a shadow, it needs a pane or a rule instead.

## Shapes

Corners are square: `rounded-sm` (2px) is effectively the only radius in the build — buttons, chips, cards, panels, segmented controls, dialogs. Two deliberate exceptions: the mobile bottom sheet's top lip (`rounded-t-md`, 6px) and the postmark ring (`rounded-full`). Stepper dots are explicitly `rounded-none`.

The form language is print furniture. Frames are hairlines: `paper-300` around a card, `paper-400` on a chip, `paper-100/25–45` for the same job on a pane. Rules come in four cuts: `.rule` (1px gauge gold at 60%) and `.rule-vault` (gold-bright at 40%) for a section divider; `.rule-double` / `.rule-double-vault` (a 5px band bordered top and bottom) as the masthead device above a section head. List bullets are 4px gauge-gold dashes, not dots.

The silhouette that carries the world is the perforated edge. `.perf-all` cuts teeth on four sides at a 12px gauge, `.perf-x` on top and bottom only, `.perf-fine` on four sides at an 8px gauge for a stamp small enough that 12px teeth would read crude. All three tint their teeth from a `--tooth` custom property.

### Named Rules

**The Perforation Rule.** A pane's teeth must be the colour of what the pane sits on. `--tooth` defaults to album ink (#10312b); add `.on-sheet` when the pane is mounted on paper (#f2ede2), or set `--tooth` inline to the exact colour behind it. `.vault` already bundles `perf-all on-sheet`. A tooth colour that does not match its background is a visible defect, not a variant.

**The Square Corner Rule.** 2px or nothing. The postmark's circle is the system's only round form, and it is a cancellation — not a decorative badge, avatar or pill.

## Components

### Buttons

- **Shape:** near-square (2px radius), 44px minimum height, 20px horizontal padding, Archivo Narrow at 15px semibold, 160ms colour transition on the one easing.
- **Franking action** (`.btn-seal`): ochre ground (#c4611f), paper-50 lettering; hover deepens to #a34e12. One per view — the value the record is paid with.
- **Ghost, on paper** (`.btn-ghost`): transparent with a 40%-ink hairline and ink text; hover firms the border and washes `paper-200/70`.
- **Ghost, on ink** (`.btn-ghost-vault`): transparent with a `paper-100/45` hairline and paper-100 text; hover firms to solid paper and washes `paper-100/10`.
- **Focus:** a 2px ochre ring with a 2px paper offset; inside a `.vault` or `.on-vault` context it switches to the bright ochre cut with an album-ink offset.

### Chips

- **Style** (`.chip`): 36px tall, 2px radius, `paper-400` hairline on `paper-50`, `ink-soft` 13px label; hover firms border and text to ink.
- **State** (`.chip-active`): inverts to solid ink with paper-50 lettering — the same inversion the era rail and search results use for a selected row.
- **On a pane** (`.chip-vault`): transparent with a `paper-100/30` hairline and paper-200 text. This is also the button style inside a profile hero.
- Filter chips always render an "All" chip first, carry `aria-pressed`, and expose an active count on the control that opens them.

### Cards / Containers

- **Corner Style:** 2px radius.
- **Background:** `paper-50` on the sheet (`.doc`); on a pane, no fill at all — a `paper-100/25` hairline only.
- **Border:** 1px `paper-300`; `.doc-interactive` firms it to ink on hover (colour only, 160ms — no lift, no scale).
- **Shadow Strategy:** none. See Elevation & Depth.
- **Internal Padding:** 16px, 20px or 24px depending on density; a ledger card splits into a bordered date gutter plus content.

### Inputs / Fields

- **Style:** the search palette's field is a 56px transparent input on `paper-100`, framed only by the container's `paper-300` hairline and a transparent 2px bottom border; placeholder in `ink-faint`.
- **Focus:** the bottom border becomes ochre; the default ring is suppressed in favour of that single engraved underline. `Esc` is shown as a `kbd` hairline box.

### Navigation

- **Header:** sticky, 64px, album ink with a `brass-bright/25` bottom border — the album's own margin, never mounted on a sheet. The chakra emblem in gauge-gold-bright plus the wordmark in display bold sit left; desktop links are 15px Archivo Narrow with a 2px bottom border that turns ochre when active; a hairline search button with a `/` `kbd` sits right.
- **Mobile:** a fixed bottom bar on album ink under `md`, five 56px targets, active state in bright ochre with a 32px ochre tick that scales in from the top edge over 400ms.
- **Era rail:** a sticky, horizontally scrollable chapter nav *on the sheet's paper* (`top-16`), each entry pairing a denomination in its era ink with the chapter name; the active entry inverts to solid ink and turns its denomination gauge-gold-bright, and auto-scrolls itself into centre.

### Signature Components

**The pane.** One stamp: an era-ink ground, `.perf-all on-sheet`, paper lettering from `eraAccent.onInk`. `.vault` is the shorthand for a stamp-green pane and is what every full-bleed dark band on the site actually is. A pane carries a denomination, a display-face title, a 13px chapter line, an italic Faustina tagline and body copy — in that order.

**The postmark** (`Postmark`, `.postmark`): a 96px ring rotated −13°, border and 12px tracked lettering both `currentColor` at 70% opacity, `pointer-events-none` and `aria-hidden`. It cancels **one** pane per view — the principal one — and is allowed to hang over the pane's own edge as it would on a cover. It is hidden below `sm`.

**The denomination strip.** A row of perforated panes, one per chapter, each in its own era ink with paper selvedge between: two columns on phones, three at `sm`, all nine at `lg`. The same construction reappears as the map's sheet of state panes.

**The lifespan bar** (`LifespanBar`): a life placed against 1757–1947 on a track of era bands, the life itself franked in ochre. The track is `paper-100/85` so the bands read on any pane ink.

**The monogram medallion** (`PortraitMedallion`): a perforated square carrying two initials in the display face, struck in the era's deep cut — `perf-fine` at `xs`/`sm`, `perf-all` above. `onPane` inverts it to paper with the ink as its monogram and tooth colour, so it reads as a stamp rather than a hole. It is a **documented stand-in** for portraits the project deliberately does not ship (see README, "Portraits") — not the preferred way to represent a person. Real, licensed archival photographs replace it whenever they exist; never generate a likeness.

**The constellation** (`Constellation`): related lives on an ellipse around the subject, connected by 1.2px lines in each life's era ink (`eraAccent.hex`) that draw in over 1.1s at 90ms intervals, on a dashed gauge-gold guide circle. Desktop only; under `md` the same relationships become a swipeable row of cards.

**Motion.** One easing, `cubic-bezier(0.22, 0.61, 0.36, 1)`, and three durations: 160ms for colour and state, 400ms for page entry and control transitions, 700–900ms for reveals. The vocabulary is fixed: `fade-up` (18px, `.reveal`), mask reveal (`clip-path` from the bottom, `.reveal-mask`, applied to children so the observed box is never clipped), line-draw for connections, a scroll-linked spine via `animation-timeline: scroll(root)` with a static fallback, and a 400ms page-enter crossfade keyed on pathname. No bounce, no spin, no parallax. `prefers-reduced-motion` collapses every duration to 0.01ms and forces revealed content visible, and a `.no-js` root does the same.

## Do's and Don'ts

### Do:

- **Do** mount every new route inside the existing `.sheet perf-x` wrapper and let album ink be the margin; reading belongs on paper.
- **Do** read every era colour from `eraAccent` in `src/components/ui.tsx` — `bg` for a pane, `text`/`textVault` for lettering beside one, `hex`/`hexPlate` where raw SVG or inline colour is unavoidable.
- **Do** take text colour on any era-ink ground from `eraAccent.onInk` / `onInkMuted`, and verify a new pane ink at its deep cut against paper lettering at 13px.
- **Do** set `--tooth` (or add `.on-sheet`) to whatever a perforated element sits on, and drop to `.perf-fine` for anything smaller than about 40px.
- **Do** take every font size from a step above. The ramp is closed: there are no `text-[…]` literals in `src/`, and the detector enforces it against this file.
- **Do** set every year as a `.denom` with `.num`, and give a hero-size denomination explicit leading so a reveal mask cannot shave its digits.
- **Do** keep headings at `font-weight: 600` and leave the global `opsz` pin on `body` alone — it protects monograms and denominations as well as headings.
- **Do** spend franking ochre on exactly one primary action per view, and cancel exactly one pane per view with a postmark.
- **Do** cap long-form reading at `max-w-prose` (66ch) in Faustina, and keep labels at 13px or larger on any coloured ground.
- **Do** use the one easing and the three durations, and make every animated state legible with motion, JavaScript, hover and images all unavailable.

### Don't:

- **Don't** rename or "fix" the inherited token names (`vault`, `oxide`, `saffron`, `brass`, `sepia`) — the whole build depends on them; read the mapping instead.
- **Don't** introduce a third ground, a gradient, a texture, a vignette or a grain overlay. Album ink and gummed paper are flat.
- **Don't** add a `box-shadow`; the bottom sheet's lift is the only one, and depth comes from ground, hairline and perforation.
- **Don't** use uppercase or letter-spacing outside `.stamp` and `.postmark` — no tracked-caps eyebrows, kickers or label styles above headings.
- **Don't** give an era ink an action role, or a call to action any colour but franking ochre.
- **Don't** round a corner beyond 2px, or use the postmark's circle for an avatar, badge or pill.
- **Don't** put a portrait-shaped placeholder, silhouette, stock photograph or generated likeness anywhere; the medallion is the shipped stand-in until a licensed archival photograph exists.
- **Don't** add Devanagari or any Indic script without asking — the product is Latin-first by owner decision (see PRODUCT.md).
- **Don't** let a `--tooth` colour drift from the background behind it; mismatched teeth are the fastest way to make the whole world look broken.
