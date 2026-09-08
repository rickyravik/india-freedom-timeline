# Stage 3 — Motion and Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read `2026-09-08-improvement-roadmap.md` first; Stages 1 and 2 must be complete (this plan uses `usePreferences`, `data-motion`, `useUrlState`, trails and the reading components).

**Goal:** Make the five first-release animations purposeful and safe (timeline progress bound to the timeline, a once-only chapter introduction, a saved-story postmark, filter rearrangement, a reading-mode transition), make "Reduce motion" a first-class setting, and audit the whole site for accessibility, small screens and low data.

**Architecture:** Motion policy lives in one module, `src/lib/motion.ts`: one `motionAllowed()` answer combining the OS preference and the site setting, and a lazily loaded GSAP `Flip` helper used only for filter rearrangement. Everything else is CSS: `animation-timeline: view()` for the spine, keyframes for the postmark and the mode swap, `--reveal-duration` for the chapter intro. Every effect has a no-motion branch that shows the same information immediately. Accessibility is verified by axe inside Playwright; small screens by a viewport matrix spec; low data by lazy, sized images and a preference that swaps portraits for monograms.

**Tech Stack:** Existing stack plus `@axe-core/playwright` (dev dependency). GSAP `Flip` from the already-installed `gsap` package, loaded on demand.

## Global Constraints

See the roadmap. Specific to this stage:

- One easing (`cubic-bezier(0.22, 0.61, 0.36, 1)`), durations from the proposal: chapter intro 350–500ms once; postmark 180–250ms; filter rearrangement 180–250ms; reading-mode 120–180ms. No bounce, no spin, no parallax, no scroll hijacking, no autoplaying sound, no flashing.
- `prefers-reduced-motion: reduce` **or** `<html data-motion="reduce">` disables every effect; the content is identical either way.
- Primary text is visible promptly even if an animation never initialises: reveals fall back to visible after a timeout.
- Motion never delays a link, a button or the reading text; it only accompanies a change the reader made.
- Touch targets ≥ 44×44 CSS px for primary controls.
- No new dependency for an effect the current stack can produce.

## File structure

| File | Responsibility |
|---|---|
| `src/lib/motion.ts` (new), `src/lib/motion.test.ts` | `motionAllowed`, `useMotionAllowed`, `useFlipList` (GSAP Flip, lazy) |
| `src/lib/hooks.ts` | `useReveal` fallback timer; `useReducedMotion` delegates to motion.ts |
| `src/index.css`, `tailwind.config.js` | `view()` timeline on the spine; `--reveal-duration`; `stampIn`, `modeSwap` keyframes; phone `scroll-padding-bottom` |
| `src/pages/TimelinePage.tsx` | Spine container binding; chapter intro split |
| `src/pages/FighterProfilePage.tsx` | Saved postmark + live status + undo; mode swap |
| `src/pages/FightersPage.tsx`, `src/pages/EventsPage.tsx` | FLIP on filter change |
| `src/components/ui.tsx` | `PortraitMedallion` lazy/sized/low-data; Story Mode dots 44px |
| `tests/a11y.spec.ts`, `tests/viewports.spec.ts`, `tests/motion.spec.ts` (new) | Audits |
| `DESIGN.md`, `README.md` | Motion vocabulary and offline statement updated |

---

### Task 1: One answer to "may this move?"

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/motion.test.ts`
- Modify: `src/lib/hooks.ts`

**Interfaces:**
```ts
// src/lib/motion.ts
export function motionAllowed(input: { osReduced: boolean; setting: 'system' | 'reduce' }): boolean; // pure
export function useMotionAllowed(): boolean;                 // OS media query + preferences store
export interface FlipHandle { capture(): void }
/** FLIP a list's children between renders. Call capture() before the state change; the hook animates after commit. No-op when motion is not allowed. */
export function useFlipList(container: React.RefObject<HTMLElement>, itemSelector: string, key: string): FlipHandle;
```

- [ ] **Step 1: Failing unit test**

Create `src/lib/motion.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { motionAllowed } from './motion';

describe('motionAllowed', () => {
  it('is false if either the OS or the site setting asks for reduced motion', () => {
    expect(motionAllowed({ osReduced: true, setting: 'system' })).toBe(false);
    expect(motionAllowed({ osReduced: false, setting: 'reduce' })).toBe(false);
    expect(motionAllowed({ osReduced: true, setting: 'reduce' })).toBe(false);
  });
  it('is true only when neither does', () => {
    expect(motionAllowed({ osReduced: false, setting: 'system' })).toBe(true);
  });
});
```
Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 2: Create `src/lib/motion.ts`**

```ts
/**
 * Motion policy. One function decides whether anything may move; every
 * animated feature asks it. GSAP is used for exactly one thing — FLIP
 * rearrangement of a filtered list — and is loaded on demand so a reader who
 * never filters never downloads it.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react';
import { readPreferences, subscribePreferences, DEFAULT_PREFERENCES } from '@/lib/preferences';

export function motionAllowed({ osReduced, setting }: { osReduced: boolean; setting: 'system' | 'reduce' }): boolean {
  return !osReduced && setting !== 'reduce';
}

const REDUCE = '(prefers-reduced-motion: reduce)';

function subscribeMedia(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

export function useMotionAllowed(): boolean {
  const osReduced = useSyncExternalStore(subscribeMedia, () => window.matchMedia(REDUCE).matches, () => false);
  const prefs = useSyncExternalStore(subscribePreferences, readPreferences, () => DEFAULT_PREFERENCES);
  return motionAllowed({ osReduced, setting: prefs.motion });
}

export interface FlipHandle {
  capture(): void;
}

type Gsap = (typeof import('gsap'))['gsap'];
type FlipPlugin = (typeof import('gsap/Flip'))['Flip'];
interface FlipLib {
  gsap: Gsap;
  Flip: FlipPlugin;
}
let flipLib: Promise<FlipLib> | null = null;
function loadFlip(): Promise<FlipLib> {
  flipLib ??= Promise.all([import('gsap'), import('gsap/Flip')]).then(([{ gsap }, { Flip }]) => {
    gsap.registerPlugin(Flip);
    return { gsap, Flip };
  });
  return flipLib;
}

/**
 * Filter rearrangement: existing items slide to their new place over 220ms,
 * entering items fade in, leaving items are simply gone (they're already out
 * of the DOM by the time we animate — no ghost cards). Call `capture()` in the
 * same event handler that changes the filter; the hook animates from that
 * snapshot after React commits the new list. With motion not allowed, capture
 * is a no-op and the list just updates.
 */
export function useFlipList(container: RefObject<HTMLElement>, itemSelector: string, key: string): FlipHandle {
  const allowed = useMotionAllowed();
  const snapshot = useRef<ReturnType<FlipPlugin['getState']> | null>(null);
  const flip = useRef<FlipLib | null>(null);

  useEffect(() => {
    if (!allowed || flip.current) return;
    let live = true;
    loadFlip().then((m) => {
      if (live) flip.current = m;
    });
    return () => {
      live = false;
    };
  }, [allowed]);

  const capture = useCallback(() => {
    const m = flip.current;
    const el = container.current;
    if (!allowed || !m || !el) return;
    snapshot.current = m.Flip.getState(el.querySelectorAll(itemSelector));
  }, [allowed, container, itemSelector]);

  useLayoutEffect(() => {
    const m = flip.current;
    const state = snapshot.current;
    const el = container.current;
    snapshot.current = null;
    if (!m || !state || !el) return;
    const tween = m.Flip.from(state, {
      targets: el.querySelectorAll(itemSelector),
      duration: 0.22,
      ease: 'power2.out',
      onEnter: (els) => m.gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.22 }),
    });
    return () => {
      tween.kill();
    };
  }, [key, container, itemSelector]);

  return { capture };
}
```
In `src/lib/hooks.ts`, replace the body of `useReducedMotion` with `return !useMotionAllowed();` (import from `@/lib/motion`). Delete the now-unused `usePreferences` call inside it if any.

Run: `npm run test:unit && npm run typecheck` — Expected: PASS.

- [ ] **Step 3: Reveals never hide content for good**

In `src/lib/hooks.ts` `useReveal`, after `observer.observe(el);` add a safety timer so a stalled observer (or a route restored mid-page) still shows the content:
```ts
    const fallback = window.setTimeout(() => el.classList.add('in-view'), 1500);
    return () => {
      window.clearTimeout(fallback);
      observer.unobserve(el);
    };
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.test.ts src/lib/hooks.ts
git commit -m "Motion policy in one place; lazy GSAP Flip helper; reveals fall back to visible

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Timeline progress bound to the timeline, not the page

**Files:**
- Modify: `src/index.css` (`.spine-progress` → `view()` timeline on its container)
- Modify: `src/pages/TimelinePage.tsx` (container class; current-chapter text marker)
- Create: `tests/motion.spec.ts`

- [ ] **Step 1: Failing spec**

Create `tests/motion.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('the spine progress tracks the timeline container, reaching full only at its end, and is static under reduced motion', async ({ page }) => {
  await page.goto('/timeline');
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  test.skip(!supported, 'scroll-driven animations unsupported in this browser build');
  const scale = () =>
    page.evaluate(() => {
      const el = document.querySelector('.spine-progress') as HTMLElement;
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.d; // scaleY
    });
  await page.evaluate(() => window.scrollTo(0, 0));
  const atTop = await scale();
  const container = page.locator('[data-timeline-spine]');
  const box = await container.boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), box!.y + box!.height / 2);
  await page.waitForTimeout(100);
  const midway = await scale();
  expect(midway).toBeGreaterThan(atTop);
  expect(midway).toBeLessThan(0.95);
  // At the bottom of the timeline container (footer still below), progress is complete.
  await page.evaluate((y) => window.scrollTo(0, y), box!.y + box!.height - window.innerHeight + 10);
  await page.waitForTimeout(100);
  expect(await scale()).toBeGreaterThan(0.9);
});

test('with reduced motion the spine is a static line and the current chapter is still named in text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/timeline#era-non-cooperation');
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.spine-progress')!).animationName);
  expect(anim).toBe('none');
  await expect(page.getByRole('navigation', { name: 'Jump to era' }).locator('[aria-current="true"]')).toContainText('Non-Cooperation');
  await expect(page.getByRole('navigation', { name: 'Jump to era' }).locator('[aria-current="true"] .sr-only')).toHaveText('Current chapter:');
});
```

- [ ] **Step 2: CSS**

In `src/index.css` `@layer utilities`, replace the scroll-driven block:
```css
  /* Scroll-driven spine, bound to the timeline container itself — not the
     document — so the footer never counts and a filter that shortens the
     timeline recalculates for free. Progressive: static where unsupported. */
  @supports (animation-timeline: view()) {
    [data-timeline-spine] {
      view-timeline-name: --timeline;
      view-timeline-axis: block;
    }
    .spine-progress {
      transform-origin: top;
      animation: grow linear both;
      animation-timeline: --timeline;
      /* From the container's top reaching the viewport's middle to its bottom leaving it. */
      animation-range: contain 0% exit 100%;
    }
  }
  @supports not (animation-timeline: view()) {
    .spine-progress {
      transform: scaleY(1);
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spine-progress {
      animation: none !important;
      transform: none !important;
      opacity: 0.35;
    }
  }
  :root[data-motion='reduce'] .spine-progress {
    animation: none !important;
    transform: none !important;
    opacity: 0.35;
  }
```
If `animation-range: contain 0% exit 100%` leaves the line short of full at the container's end in Chromium, use `animation-range: entry 100% exit 100%`; verify with the spec above rather than by eye.

- [ ] **Step 3: Container and text marker**

In `TimelinePage.tsx`, on the `relative mt-8` wrapper that holds the spine add `data-timeline-spine`. In `EraRail`, inside the active anchor, add before the denomination: `{active && <span className="sr-only">Current chapter: </span>}`. This is the "mark the current chapter in text as well as colour" requirement.

- [ ] **Step 4: Run and commit**

Run: `npm run build && npx playwright test tests/motion.spec.ts tests/navigation.spec.ts`
```bash
git add src/index.css src/pages/TimelinePage.tsx tests/motion.spec.ts
git commit -m "Bind the timeline spine to the timeline container; name the current chapter in text

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Chapter introduction — a heading and one visual, once, 450ms

**Files:**
- Modify: `src/index.css` (`--reveal-duration`)
- Modify: `src/pages/TimelinePage.tsx` (split the chapter header)
- Modify: `tests/motion.spec.ts`

- [ ] **Step 1: Spec**

Append to `tests/motion.spec.ts`:
```ts
test('a chapter pane never appears as an empty rectangle: description text is visible before the heading reveal completes', async ({ page }) => {
  await page.goto('/timeline');
  const chapter = page.locator('#era-revolt-1857');
  await chapter.scrollIntoViewIfNeeded();
  // The description paragraph is not masked; it is visible immediately.
  const desc = chapter.locator('[data-chapter-body] p').first();
  await expect(desc).toHaveCSS('opacity', '1');
  // The heading group reveals over ~450ms (not 900ms).
  const dur = await chapter.locator('.reveal-mask').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(dur.split(',')[0].trim()).toBe('0.45s');
});
```

- [ ] **Step 2: CSS variable**

In `src/index.css`, change `.reveal` and `.reveal-mask` (and `.reveal-mask > *`) transition durations to `var(--reveal-duration, 0.7s)` for `.reveal` and `var(--reveal-duration, 0.9s)` for the mask rules. Add to `Reveal` in `ui.tsx` an optional `duration?: number` prop (ms) that sets `'--reveal-duration': `${duration}ms`` in `merged`.

- [ ] **Step 3: Split the header**

In `TimelinePage.tsx`, replace the chapter `header` block:
```tsx
                    <div className="relative ml-8 sm:ml-12">
                      <span aria-hidden="true" className={`absolute -left-8 top-8 h-4 w-4 outline outline-4 outline-paper-100 sm:-left-12 ${eraAccent.bg[era.accent]}`} style={{ transform: 'translateX(4px)' }} />
                      <header className={`perf-all on-sheet relative px-5 py-7 sm:px-8 sm:py-9 ${eraAccent.bg[era.accent]} ${eraAccent.onInk[era.accent]}`}>
                        {position === 0 && <Postmark lines={['India', 'Post', '1757 — 1947']} className="absolute right-4 top-5 hidden sm:grid" />}
                        {/* The introduction: denomination, title and chapter line reveal together, once, in 450ms. */}
                        <Reveal mask duration={450}>
                          <div>
                            <p className="denom block text-h1 leading-[1.12] sm:text-hero sm:leading-[1.08]">{era.startYear}</p>
                            <h2 className={`mt-4 max-w-2xl text-h2 ${position === 0 ? 'sm:pr-28' : ''}`}>{era.name}</h2>
                            <p className={`num mt-2 font-body text-label ${eraAccent.onInkMuted[era.accent]}`}>
                              Chapter {index + 1} · {era.startYear}–{era.endYear}
                            </p>
                          </div>
                        </Reveal>
                        {/* The body is never masked: a chapter must not read as an empty pane. */}
                        <div data-chapter-body>
                          <p className={`mt-4 max-w-xl font-reading text-reading italic ${eraAccent.onInkMuted[era.accent]}`}>{era.tagline}</p>
                          <p className="mt-4 max-w-prose font-reading text-reading">{era.description}</p>
                        </div>
                      </header>
                    </div>
```
(The outer `Reveal mask` that wrapped the whole pane is removed.) Each chapter also gains a text lead-in and lead-out per the proposal's "What was changing? / What changed next?": add `<p className="label mt-6">What was changing</p>` above the description, and after the events list a `<p className="ml-8 mt-6 font-reading text-reading italic text-ink-soft sm:ml-12">Next chapter: {eras[index + 1]?.name ?? 'Independence — and the archive’s end'}</p>` with a `Link` to the next chapter anchor.

- [ ] **Step 4: Run and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/motion.spec.ts tests/accessibility.spec.ts`
```bash
git add src/index.css src/components/ui.tsx src/pages/TimelinePage.tsx tests/motion.spec.ts
git commit -m "Chapter intro: heading group reveals once in 450ms; body text is never masked

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: The saved-story postmark

**Files:**
- Modify: `tailwind.config.js` (`stampIn` keyframes), `src/index.css`
- Modify: `src/pages/FighterProfilePage.tsx`
- Modify: `tests/bookmarks.spec.ts`

- [ ] **Step 1: Spec**

Replace `tests/bookmarks.spec.ts` with:
```ts
import { test, expect } from '@playwright/test';

test('saving a story confirms with a postmark, announces the state, offers undo, and never replays on load', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const save = page.getByRole('button', { name: 'Save this story' });
  await save.click();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Saved to your stories');
  await expect(page.locator('.postmark-stamp')).toHaveCount(1);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('button', { name: 'Save this story' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Removed from your stories');

  await page.getByRole('button', { name: 'Save this story' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible();
  await expect(page.locator('.postmark-stamp')).toHaveCount(0); // no replay on load
  await page.goto('/fighters?collection=saved');
  await expect(page.getByRole('link', { name: /Bhagat Singh/ })).toBeVisible();
});

test('under reduced motion the postmark is not animated but the state still changes and is announced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fighters/velu-nachiyar');
  await page.getByRole('button', { name: 'Save this story' }).click();
  await expect(page.getByRole('status')).toContainText('Saved to your stories');
  const anim = await page.locator('.postmark-stamp').evaluate((el) => getComputedStyle(el).animationDuration);
  expect(anim).toBe('0.01ms');
});
```

- [ ] **Step 2: Keyframes**

`tailwind.config.js` keyframes: add
```js
        stampIn: {
          from: { opacity: '0', transform: 'rotate(-22deg) scale(1.25)' },
          '60%': { opacity: '0.8', transform: 'rotate(-13deg) scale(0.98)' },
          to: { opacity: '0.7', transform: 'rotate(-13deg) scale(1)' },
        },
```
and animation `'stamp-in': 'stampIn 0.22s cubic-bezier(0.22,0.61,0.36,1) both'`. In `src/index.css` components layer (the type ramp is closed, so the ring uses `text-xs` at a 64px size rather than a custom step):
```css
  .postmark-stamp {
    @apply postmark animate-stamp-in pointer-events-none absolute -right-3 -top-3 h-16 w-16 text-xs;
  }
```

- [ ] **Step 3: Profile**

In `FighterProfilePage.tsx`:
```ts
  const [justToggled, setJustToggled] = useState<'saved' | 'removed' | null>(null);
  const toggleSave = () => {
    const wasSaved = bookmarks.includes(summary.slug);
    toggle(summary.slug);
    setJustToggled(wasSaved ? 'removed' : 'saved');
  };
  useEffect(() => {
    if (!justToggled) return;
    const t = window.setTimeout(() => setJustToggled(null), 5000);
    return () => window.clearTimeout(t);
  }, [justToggled]);
```
Button:
```tsx
            <span className="relative inline-flex">
              <button type="button" onClick={toggleSave} aria-pressed={bookmarked} className={`${heroChip} min-h-11 ${bookmarked ? '!bg-paper-50 !text-ink' : ''}`}>
                <Icon d={icons.bookmark} className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved' : 'Save this story'}
              </button>
              {justToggled === 'saved' && (
                <span aria-hidden="true" className="postmark-stamp">
                  <span><span className="block">Saved</span></span>
                </span>
              )}
            </span>
            <p role="status" aria-live="polite" className="sr-only">{justToggled === 'saved' ? 'Saved to your stories' : justToggled === 'removed' ? 'Removed from your stories' : ''}</p>
```
Undo toast (rendered near the bottom of the hero pane, only while `justToggled` is set):
```tsx
          {justToggled && (
            <div className="mt-4 flex items-center gap-3 font-body text-meta">
              <span className={eraAccent.onInkMuted[accent]}>{justToggled === 'saved' ? 'Saved to your stories.' : 'Removed from your stories.'}</span>
              <button type="button" className="chip-vault min-h-9" onClick={toggleSave}>Undo</button>
            </div>
          )}
```
The `sr-only` status must render with empty text in the prerendered snapshot (it does: `justToggled` is null at build).

- [ ] **Step 4: Run and commit**

Run: `npm run build && npx playwright test tests/bookmarks.spec.ts`
```bash
git add tailwind.config.js src/index.css src/pages/FighterProfilePage.tsx tests/bookmarks.spec.ts
git commit -m "Saved-story postmark: 220ms confirmation, announced, undoable, never replayed on load

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Filter rearrangement (FLIP) on People and Events

**Files:**
- Modify: `src/pages/FightersPage.tsx`, `src/pages/EventsPage.tsx`
- Modify: `tests/motion.spec.ts`

- [ ] **Step 1: Spec**

Append to `tests/motion.spec.ts`:
```ts
test('changing a People filter keeps existing cards and moves them (FLIP), and does nothing extra under reduced motion', async ({ page }) => {
  await page.goto('/fighters');
  const grid = page.locator('[data-flip-list]');
  await expect(grid.locator('[data-flip-id]').first()).toBeVisible();
  await page.getByRole('button', { name: 'Women of the movement' }).click();
  await expect(page.getByRole('status')).toHaveText(/Showing \d+ of 88/);
  // GSAP was loaded lazily: a script chunk with "Flip" is present only after a filter change.
  const flipLoaded = await page.evaluate(() => performance.getEntriesByType('resource').some((r) => /Flip|gsap/i.test(r.name)));
  expect(flipLoaded).toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.getByRole('button', { name: 'Featured' }).click();
  const gsapAfter = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => /Flip/i.test(r.name)).length);
  expect(gsapAfter).toBe(0);
});
```

- [ ] **Step 2: People**

In `FightersPage.tsx`: `const listRef = useRef<HTMLDivElement>(null); const flip = useFlipList(listRef, '[data-flip-id]', results.map((f) => f.slug).join('|'));` and wrap every filter setter used by chips/collections in `const change = (patch: Partial<typeof filters>) => { flip.capture(); setFilters(patch); };` (query typing excluded — keystrokes should not animate). The grid: `<div ref={listRef} data-flip-list className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">` and each card wrapped `<div key={f.id} data-flip-id={f.slug}><FighterCard .../></div>`.

- [ ] **Step 3: Events**

Same in `EventsPage.tsx` on the `<ol aria-label="Events in date order">` (`ref`, `data-flip-list`, `data-flip-id={e.id}` on each `<li>`), with `change` used by the sheet's `ChipGroup`s and `ActiveFilters`.

- [ ] **Step 4: Run and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/motion.spec.ts tests/url-state.spec.ts tests/events-list.spec.ts`
```bash
git add src/pages/FightersPage.tsx src/pages/EventsPage.tsx tests/motion.spec.ts
git commit -m "FLIP rearrangement when filters change, GSAP loaded only when motion is allowed

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Reading-mode transition that keeps the heading still and the focus where it was

**Files:**
- Modify: `tailwind.config.js`, `src/pages/FighterProfilePage.tsx`, `tests/preferences.spec.ts`

- [ ] **Step 1: Spec**

Append to `tests/preferences.spec.ts`:
```ts
test('switching reading mode keeps focus on the control and the heading in place', async ({ page }) => {
  await page.goto('/fighters/bhagat-singh');
  const heading = page.getByRole('heading', { name: 'Quick story' });
  const before = await heading.boundingBox();
  const detail = page.getByRole('button', { name: 'Detailed history' });
  await detail.focus();
  await page.keyboard.press('Enter');
  await expect(detail).toBeFocused();
  const after = await page.getByRole('heading', { name: 'Detailed history' }).boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  const dur = await page.locator('[data-mode-swap]').evaluate((el) => getComputedStyle(el).animationDuration);
  expect(dur).toBe('0.16s');
});
```

- [ ] **Step 2: Implement**

`tailwind.config.js` animation: `'mode-swap': 'fadeIn 0.16s cubic-bezier(0.22,0.61,0.36,1) both'`. In `FighterProfilePage.tsx` wrap the story/detail content: `<div key={mode} data-mode-swap className="animate-mode-swap">…</div>`. The heading row stays outside the keyed element, so it does not remount, and the toolbar's `Segmented` keeps focus.

- [ ] **Step 3: Run and commit**

Run: `npm run build && npx playwright test tests/preferences.spec.ts tests/story-mode.spec.ts`
```bash
git add tailwind.config.js src/pages/FighterProfilePage.tsx tests/preferences.spec.ts
git commit -m "Reading-mode switch: 160ms crossfade, heading stable, focus preserved

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Accessibility audit with axe, and the fixes it demands

**Files:**
- Modify: `package.json` (add `@axe-core/playwright`)
- Create: `tests/a11y.spec.ts`
- Modify: `src/components/ui.tsx`, `src/pages/FighterProfilePage.tsx` (Story Mode dots), `src/index.css` (phone `scroll-padding-bottom`), plus whatever axe reports

- [ ] **Step 1: Install and write the audit**

```bash
npm install --save-dev @axe-core/playwright
```
Create `tests/a11y.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/start', '/timeline', '/fighters', '/fighters/velu-nachiyar', '/events', '/events/dandi-march', '/movements/civil-disobedience-movement', '/map', '/map?view=list', '/learn', '/trails', '/trails/women-who-led', '/trails/women-who-led/stop/1', '/trails/women-who-led/finish', '/glossary', '/about', '/search?q=salt'];

for (const route of routes) {
  for (const width of [375, 1280]) {
    test(`axe: no WCAG 2.2 AA violations on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).disableRules(['region']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}

test('primary touch targets are at least 44px on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/fighters/bhagat-singh');
  for (const name of ['Next chapter', 'Previous chapter', 'Save this story', 'Share']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box!.height, name).toBeGreaterThanOrEqual(44);
    expect(box!.width, name).toBeGreaterThanOrEqual(44);
  }
  const dot = page.getByRole('button', { name: /^Chapter 2:/ });
  const dotBox = await dot.boundingBox();
  expect(dotBox!.height).toBeGreaterThanOrEqual(44);
  expect(dotBox!.width).toBeGreaterThanOrEqual(44);
});

test('the focused control is never hidden under the sticky header or the phone bar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/glossary');
  for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
  const rect = await page.evaluate(() => document.activeElement!.getBoundingClientRect().toJSON());
  const barTop = await page.evaluate(() => document.querySelector('nav[aria-label="Primary"].fixed')!.getBoundingClientRect().top);
  expect(rect.top).toBeGreaterThanOrEqual(64);
  expect(rect.bottom).toBeLessThanOrEqual(barTop);
});
```

- [ ] **Step 2: Known fixes**

- Story Mode dots: wrap each dot in a 44px hit area — `className="flex h-11 w-11 items-center justify-center"` on the button, with the 10px `<span>` dot inside; keep `aria-label`.
- Phone: `html { scroll-padding-bottom: 5rem; }` inside `@media (max-width: 767px)` in `src/index.css`, and focus styles must not be clipped by `overflow-x-auto` rails (add `p-0.5` inside scrollers that hold focusable chips).
- Every `<img>` in `PortraitMedallion` already has `alt=""`; `Icon` has `aria-hidden`.
- The `Segmented` group has `role="group"`; if axe flags `aria-pressed` on a segmented control, switch to `role="radiogroup"` / `role="radio"` + `aria-checked`.
- Map tiles: `aria-label` present; ensure `title` duplication isn't flagged (remove `title` if it is).

Run: `npm run build && npx playwright test tests/a11y.spec.ts` — fix each reported violation at its source component (not by disabling rules) until the suite is green. Record anything deliberately left (with the rule id and the reason) in a comment above `disableRules`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json tests/a11y.spec.ts src/components/ui.tsx src/pages/FighterProfilePage.tsx src/index.css
git commit -m "Accessibility audit with axe in Playwright; 44px chapter dots; focus never under the bars

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Small screens and enlarged text

**Files:**
- Create: `tests/viewports.spec.ts`
- Modify: any component that overflows (fix at source)

- [ ] **Step 1: The matrix**

Create `tests/viewports.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

const routes = ['/', '/timeline', '/fighters', '/fighters/veerapandiya-kattabomman', '/events', '/map', '/learn', '/trails/tamil-nadu-close-to-home/stop/2', '/glossary'];
const sizes = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 812, height: 375 }, // phone landscape
];

for (const size of sizes) {
  for (const route of routes) {
    test(`no horizontal page overflow on ${route} at ${size.width}×${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto(route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(1);
      await expect(page.locator('main h1').first()).toBeVisible();
    });
  }
}

test('with browser text at 150% the profile still reads without sideways scrolling and the primary action is reachable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/fighters/rani-gaidinliu');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '150%';
  });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Save this story' })).toBeVisible();
});

test('the map keeps its intentional sideways scroll inside the sheet, not on the page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/map');
  const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(pageOverflow).toBeLessThanOrEqual(1);
  const sheetScrolls = await page.locator('.scrollbar-thin-archival').first().evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(sheetScrolls).toBe(true);
});
```

- [ ] **Step 2: Fix at the source**

Run: `npm run build && npx playwright test tests/viewports.spec.ts`. Typical culprits and their fixes: long names in `FighterChip` rows (`min-w-0`, `break-words`), the `EventRow` date column at 320px (`sm:` prefix already; check `grid-cols-[7.5rem_1fr]` only applies at `sm`), the timeline's `-mx-4` rail (`overflow-x-auto` is on the rail, fine), the hero `sm:pr-28` (only ≥ sm), `Segmented` groups wrapping (`flex-wrap`), the trail stop header chips. Fix each; do not raise the tolerance.

- [ ] **Step 3: Commit**

```bash
git add tests/viewports.spec.ts src
git commit -m "Viewport matrix: 320–768 plus landscape and 150% text, no sideways page scroll

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Owner input:** repeat the matrix on real Android and iOS devices; record what differed.

---

### Task 9: Images that respect data and never shift the layout

**Files:**
- Modify: `src/components/ui.tsx` (`PortraitMedallion`)
- Modify: `tests/viewports.spec.ts` (CLS + low-data checks)

- [ ] **Step 1: Spec**

Append to `tests/viewports.spec.ts`:
```ts
test('portraits are lazy, sized, and replaced by monograms under the low-data preference', async ({ page }) => {
  await page.goto('/fighters');
  const img = page.locator('img[src*="/images/fighters/"]').first();
  await expect(img).toHaveAttribute('loading', 'lazy');
  await expect(img).toHaveAttribute('decoding', 'async');
  await expect(img).toHaveAttribute('width', /\d+/);
  await expect(img).toHaveAttribute('height', /\d+/);
  await page.evaluate(() => localStorage.setItem('ift-prefs-v1', JSON.stringify({ lowData: true })));
  await page.reload();
  await expect(page.locator('img[src*="/images/fighters/"]')).toHaveCount(0);
  await expect(page.locator('.medallion-plate').first()).toBeVisible();
});
```

- [ ] **Step 2: Implement**

In `PortraitMedallion`: import `usePreferences`; `const [{ lowData }] = usePreferences();` and treat `portrait && !imgFailed && !lowData` as the image branch. Sizes in px for intrinsic dimensions: `{ xs: 28, sm: 40, md: 56, lg: 80, xl: 112, hero: 160 }`; add to the `<img>`: `loading={size === 'hero' ? 'eager' : 'lazy'} decoding="async" width={px[size]} height={px[size]}` and `fetchPriority={size === 'hero' ? 'high' : undefined}` (React 18.3 supports `fetchPriority`; if the type is missing, spread `{ ...{ fetchpriority: 'high' } as Record<string, string> }`). Hydration: the prerendered snapshot has `lowData: false` (server snapshot); a client with `lowData: true` re-renders after hydration — no mismatch, by design of `useSyncExternalStore`.

- [ ] **Step 3: Run and commit**

Run: `npm run build && npx playwright test tests/viewports.spec.ts tests/console-errors.spec.ts`
```bash
git add src/components/ui.tsx tests/viewports.spec.ts
git commit -m "Portraits: lazy, intrinsically sized, hero prioritised, monogram under low-data

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Say exactly what works offline, and document the motion vocabulary

**Files:**
- Modify: `README.md`, `DESIGN.md`, `src/pages/OfflinePage.tsx`, `src/pages/AboutPage.tsx`

- [ ] **Step 1: Honest offline statement**

`README.md` — in Highlights, replace any "offline-capable" phrasing with: "**Installable, partly offline**: the app shell is cached on install, and any page you have already opened stays readable without a connection. Pages you have not visited need a connection the first time (an offline page says so). Saving a whole trail for offline reading is Stage 4." `OfflinePage.tsx` lede already says this; make the `AboutPage` add one sentence under "Our approach to accuracy": "The site can be installed on a phone; pages you have opened stay readable offline, and only those."

- [ ] **Step 2: DESIGN.md motion section**

Under **Motion** add the vocabulary this stage introduced, each with its duration and its no-motion behaviour:
```markdown
- **Chapter introduction** — a chapter pane's denomination, title and chapter line reveal together once over 450ms (`Reveal mask duration={450}`); tagline and description are never masked. No motion: everything is simply there.
- **Timeline progress** — the spine's `scaleY` is bound to the timeline container with `animation-timeline: view()` (`[data-timeline-spine]`), not to the document. Unsupported or no motion: a static line at 35% opacity; the era rail names the current chapter in text.
- **Saved-story postmark** — a 64px `.postmark-stamp` stamps in over 220ms after a deliberate save; a polite live region announces "Saved to your stories" / "Removed…"; Undo is offered for five seconds; nothing replays on load.
- **Filter rearrangement** — surviving cards slide to their new positions over 220ms with GSAP `Flip`, loaded only when motion is allowed and only on first filter change; entering cards fade in. No motion: the list updates in place.
- **Reading-mode swap** — a 160ms crossfade of the content only; the heading row and the toolbar do not remount, so focus stays on the control.
```
Also state the rule: "**The One Question Rule.** Every animation asks `motionAllowed()` (src/lib/motion.ts). There is no second opinion — not a component-local media query, not an inline check of `prefers-reduced-motion`."

- [ ] **Step 3: Full gate and commit**

Run: `npm run typecheck && npm run validate && npm run test:unit && npm run build && npm test && npm run lighthouse`
Expected: green; Lighthouse accessibility 1.0 on the three audited URLs.
```bash
git add README.md DESIGN.md src/pages/OfflinePage.tsx src/pages/AboutPage.tsx
git commit -m "Document the motion vocabulary and state exactly what works offline

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Stage 3 exit checklist

- [ ] `motionAllowed()` is the single motion decision; `Reduce motion` in Reading settings disables every effect.
- [ ] Spine progress bound to the timeline container; static fallback; current chapter named in text.
- [ ] Chapter intro 450ms once; body text never masked.
- [ ] Saved postmark 220ms, announced, undoable, no replay on load.
- [ ] FLIP on People and Events filters; GSAP not loaded under reduced motion.
- [ ] Reading-mode swap 160ms, heading still, focus kept.
- [ ] axe: zero WCAG 2.2 AA violations on the 18 audited routes at 375 and 1280.
- [ ] Viewport matrix (320/360/390/768/landscape, 150% text): no sideways page scroll.
- [ ] Portraits lazy and sized; low-data swaps to monograms.
- [ ] README and DESIGN.md updated; Lighthouse accessibility 1.0.
