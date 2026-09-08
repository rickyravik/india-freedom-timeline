# Contributing content

Content is data, not code — every fighter, event and movement lives in `src/data`, typed against `src/types/index.ts`, and is checked by an automated validator before anything can build. This guide covers adding or editing a record; see the [README](./README.md#adding-historical-records) for the underlying house rules (cite sources, never invent facts, label disputed claims, keep Story Mode age-appropriate) and [`DESIGN.md`](./DESIGN.md) for the visual system, which you shouldn't need to touch for a content contribution.

## Adding a fighter or event

1. Copy the relevant template — [`docs/templates/fighter.template.ts`](./docs/templates/fighter.template.ts) or [`docs/templates/event.template.ts`](./docs/templates/event.template.ts) — into the right file under `src/data/fighters/` or `src/data/events/` (grouped by era; add to an existing file unless you're introducing a whole new period, in which case create a file and export it through that folder's `index.ts`).
2. Fill in every field the template comments call for. TypeScript's strict mode will flag missing required fields immediately. Use `shortName` for the form of the name a heading should use; the UI never guesses one from the last word.
3. Link it both ways: reference event ids in `timelineEvents`, movement ids in `movements`, organization ids in `organizations`, and fighter ids in `relatedPeople` — the validator checks every one of these resolves to a real record.
4. Run `npm run validate` (also runs automatically as the first step of `npm run build`).

## Citing sources

Every fighter, event and movement needs at least one entry in `sources`, with a `title` and a `type` (`book`, `archive`, `government`, `journal`, `museum` or `website`). Prefer government archives (National Archives of India / Abhilekh Patal), state archives, museums, and published academic research over general web pages. The validator fails the build if a record has none.

## Citing a claim, not just a record

Write `[^n]` straight after a sentence to cite the n-th entry of that record's `sources` (1-based): `She retook Sivaganga around 1780.[^2]`. The reader sees a small marker that previews the source; the validator fails the build if `n` points past the end of `sources`. Give each source an `evidence` kind (`contemporary`, `scholarship`, `oral-tradition`, `reference`) and, where you can, `pages` or an `archiveId` — "Search at Abhilekh Patal" is not a citation, a file number is.

## Connections vs similar stories

`connections` is for documented relationships only (`ally`, `opponent`, `family`, `mentor`, `inspired`, `successor`), each with a `note` saying what the connection was. `relatedPeople` remains for people connected by theme; the UI shows those as "Similar stories" and never draws a line between them.

## Editorial status

New or rewritten records carry `editorial: { status: 'draft' }` until a reviewer sets `reviewed`. Drafts are visible on the site with a "Draft — under editorial review" stamp so nothing reads as settled fact before it is.

## Marking disputed or uncertain claims

Don't state a contested detail — casualty figures, attribution of an act, the exact circumstances of a death — as settled fact. Add a `disputed` entry (`{ claim, note }`) describing what's uncertain and why; the UI renders it as a labelled "Historians note" box instead of presenting legend as history. A quote whose exact wording or attribution is uncertain should carry `disputed: true` on the `Quote` itself.

## Running validation

```bash
npm run validate
```

Checks every collection against its schema, then cross-collection references (every id you point at must exist), date consistency (`birthYear <= deathYear`, an event's year must fall inside its era's range), state/region agreement, Story Mode length (3–6 chapters, each under 600 characters, plus a soft tone check), and quiz answer validity. Errors fail the build; warnings (like the tone check) are printed but don't block it — use judgement on whether a flagged word actually needs softening, since some historical facts are inherently hard.

## Review checklist

Before opening a PR:

- [ ] At least one source per new fighter/event/movement record
- [ ] Every referenced id (`relatedPeople`, `timelineEvents`, `movements`, `organizations`, `people`, `keyPeople`, `keyEvents`, `era`) resolves — `npm run validate` will catch this
- [ ] Disputed or uncertain claims are marked, not stated as fact
- [ ] Story Mode chapters are accurate and age-appropriate for the "children and casual readers" audience they're written for
- [ ] `npm run validate`, `npm run typecheck` and `npm run build` all pass locally
