# Pilot dashboard: queries and manual rubric

Analytics Engine dataset: `ift_events` (binding `EVENTS`, see `wrangler.jsonc`). Every row is one `env.EVENTS.writeDataPoint()` call from `worker/events.ts`:

- `blob1` — event name (one of `src/lib/event-names.ts`'s `EVENT_NAMES`)
- `blob2`, `blob3`, `blob4` — up to three `key=value` props, in the order the call site passed them, each truncated to 40 characters
- `double1` — always `1` (so `sum(double1)` and `count()` are interchangeable)
- `index1` — the event name again, for Analytics Engine's own sampling/indexing

Run these against the Cloudflare Analytics Engine SQL API. All examples use a trailing 14-day window; adjust `INTERVAL '14' DAY` to the pilot's actual duration.

## Trail starts vs completions, per trail

`trail_started` and `trail_completed` both carry `blob2 = "trail=<slug>"`, so this is a direct per-trail breakdown:

```sql
SELECT
  substring(blob2, 7) AS trail,
  countIf(blob1 = 'trail_started') AS starts,
  countIf(blob1 = 'trail_completed') AS completions,
  round(100.0 * countIf(blob1 = 'trail_completed') / nullif(countIf(blob1 = 'trail_started'), 0), 1) AS completion_pct
FROM ift_events
WHERE timestamp > NOW() - INTERVAL '14' DAY
  AND blob1 IN ('trail_started', 'trail_completed')
GROUP BY trail
ORDER BY starts DESC
```

## Source opens per 100 stop views

`source_opened` is tracked without a `trail` prop (see `src/components/reading.tsx`) — it fires from any reading text, not only trail stops — so this is a site-wide rate, not a per-trail one. Treat it as a proxy: "for every 100 times a reader reached a trail stop, how many times did they open a source?"

```sql
SELECT
  round(100.0 * countIf(blob1 = 'source_opened') / nullif(countIf(blob1 = 'trail_stop_viewed'), 0), 1) AS source_opens_per_100_stop_views
FROM ift_events
WHERE timestamp > NOW() - INTERVAL '14' DAY
  AND blob1 IN ('source_opened', 'trail_stop_viewed')
```

If the pilot needs this broken down per trail, `source_opened` will need a `trail` prop added at its call site first — it doesn't carry one today.

## Glossary opens per route

Same limitation as above: `glossary_opened` (`src/components/reading.tsx`) carries no `trail` prop, so "per route" is reported here as a rate against stop views rather than a true per-trail breakdown:

```sql
SELECT
  round(100.0 * countIf(blob1 = 'glossary_opened') / nullif(countIf(blob1 = 'trail_stop_viewed'), 0), 1) AS glossary_opens_per_100_stop_views
FROM ift_events
WHERE timestamp > NOW() - INTERVAL '14' DAY
  AND blob1 IN ('glossary_opened', 'trail_stop_viewed')
```

## Quiz reviews

`quiz_reviewed` carries `blob2 = "of=<question count>"` (`src/pages/LearnPage.tsx`):

```sql
SELECT
  count() AS reviews,
  substring(blob2, 4) AS question_count
FROM ift_events
WHERE timestamp > NOW() - INTERVAL '14' DAY
  AND blob1 = 'quiz_reviewed'
GROUP BY question_count
ORDER BY question_count
```

## Corrections submitted (context, not a pilot target metric)

```sql
SELECT count() AS corrections
FROM ift_events
WHERE timestamp > NOW() - INTERVAL '14' DAY
  AND blob1 = 'correction_submitted'
```

---

## Manual rubric: understanding and evidence tasks

From the roadmap's Validation checklist (`docs/superpowers/plans/2026-09-08-improvement-roadmap.md`), two of the five acceptance measures need a human observer, not a query. Score each participant on both after they complete one trail, uncoached.

### Understanding: "can explain one contribution and one contextual constraint"

Ask: *"In your own words, what did [the trail's central person or event] do, and what made it hard for them?"*

| Score | Criteria |
|---|---|
| **Met** | Names a specific action or decision from the trail (not a vague "they fought for freedom") **and** names a specific constraint the trail mentioned (a law, a risk, a resource, a relationship) that shaped it. |
| **Partial** | Gets one of the two — the action but not the constraint, or vice versa — or gives a generally correct but non-specific answer. |
| **Not met** | Cannot recall a specific action, invents a detail not in the trail, or cannot attempt an answer. |

### Evidence: "can locate a source and tell an uncertain claim from an established one"

Two sub-tasks, scored separately:

1. *"Show me where this page tells you where a claim came from."* — **Met** if the participant finds the Sources & references section or an inline citation marker unprompted or with one hint; **Not met** if they cannot locate it after a hint.
2. *"Find something on this page the site says historians aren't sure about, or that rests on memory rather than a document."* — **Met** if the participant identifies a "Historians note" box, an `uncertainty` line, or an oral-tradition note; **Partial** if they find it but can't say why it's marked uncertain; **Not met** if they cannot locate one or mistake a sourced claim for an uncertain one.

Record both the score and a one-line note on where the participant hesitated — the roadmap's Validation step 3 ("record where they hesitate and what they expected") applies here as much as to the timed tasks.
