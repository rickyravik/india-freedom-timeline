# What earns a biographical record

The Dictionary of Martyrs (Ministry of Culture) lists roughly 13,500 names.
This archive will never hold all of them, and completeness was never the
goal — the About page already commits to growing "to thousands of records"
over time, not to a finished, closed set. What was missing was a rule for
deciding what goes in *next*, so this question doesn't have to be re-argued
from scratch every time someone asks "did we miss anyone."

## The test

A person earns a record when at least **two** of the following are true:

1. **Sustained role.** They led, organized, or were a central actor in an
   identifiable episode of anti-colonial action (an uprising, a satyagraha,
   a conspiracy, a movement chapter) — not a passing participant.
2. **Citable in two source types.** Findable in at least two of the
   collections already listed in [About & Sources](../src/pages/AboutPage.tsx)
   (National Archives / Abhilekh Patal, PMML, a state archive, a gazetteer,
   Ministry of Culture AKAM records, or the published scholarship already
   cited elsewhere in the archive).
3. **Load-bearing in a story we already tell.** They are named in an
   existing event, trail, movement, or quiz entry, so a reader who follows
   the site's own narrative currently hits a dead end.
4. **Fills a stated gap.** They represent a region, community, gender, or
   era the roster currently under-represents — see the state-coverage table
   below, refreshed at each addition.

A name that fails both a role test and a source test doesn't qualify no
matter how often it appears in popular retellings — that's what the
`disputed` field and oral-tradition sourcing exist for, not a lower bar for
inclusion.

## Standing decisions on contested figures

Written down once so they don't get re-litigated per-session:

- **Tipu Sultan / Hyder Ali.** In scope for the pre-1857 resistance era on
  the strength of their wars against Company expansion; any record must
  carry a `disputed` note on the religious-persecution historiography
  rather than presenting either the "secular anti-colonial ruler" or
  "tyrant" framing as settled.
- **Malabar 1921 leaders** (Variyankunnath Kunjahammed Haji, Ali Musliyar).
  In scope as anti-colonial rebels; the record must note the 2021 removal
  from the government's Dictionary of Martyrs and the communal-violence
  controversy as a `disputed` note, not omit it.
- **Periyar (E. V. Ramasamy).** In scope for the pre-1925 Congress and
  Vaikom Satyagraha period; his post-1925 break with the national movement
  belongs in the biography, not as a reason to exclude him.
- **Anti-Nizam Telangana struggle (1946–51).** In scope as anti-colonial
  once Partition-era conflicts are read as continuous with the freedom
  struggle in princely states; record entries should distinguish the
  anti-Nizam phase from the later Communist-led agrarian struggle rather
  than conflating them.
- **Sheikh Abdullah / Kashmir's own movement.** Deferred — the record would
  need to handle 1947 accession and Article 370 with the same care the
  archive gives other disputed material, and that draft hasn't been
  written yet. Not a decision that they're out of scope, only that no
  record exists yet.

## State/territory coverage (refresh this table when adding records)

As of the 2026-09-15 addition round (88 → 122 records), counts by state:

| State | Records | State | Records |
|---|---|---|---|
| Uttar Pradesh | 22 | Kerala | 5 |
| Tamil Nadu | 21 | Jharkhand | 4 |
| West Bengal | 20 | Karnataka | 4 |
| Abroad | 20 | Telangana | 4 |
| Delhi | 18 | Andhra Pradesh | 4 |
| Punjab | 18 | Assam | 4 |
| Maharashtra | 16 | Rajasthan | 2 |
| Gujarat | 9 | Manipur | 2 |
| Bihar | 8 | Meghalaya | 1 |
| Madhya Pradesh | 6 | Chhattisgarh | 1 |
| Odisha | 6 | Nagaland | 1 |

States or territories with zero or one record are the standing priority
list, ahead of adding more depth to states that already have many.
Chhattisgarh, Meghalaya and Nagaland are the thinnest now.

| Not in `regions.ts` at all | Haryana, Himachal Pradesh, Uttarakhand, Goa, Tripura, Mizoram, Arunachal Pradesh, Sikkim, Puducherry, Andaman & Nicobar |
|---|---|

Adding anyone from those needs a new entry in `regions.ts` first (see the
mechanical checklist below).

**Known gap from this round:** the 34 new records added only 2 women
(gender split moved from 67M/21F to 99M/23F) — the reference-completion
and regional-gap priorities this round happened to surface mostly male
military/political figures. The next addition round should deliberately
target women under-represented across every era: Rajkumari Amrit Kaur,
Vijaya Lakshmi Pandit, Bina Das, Suniti Choudhury, Shanti Ghosh, Durgabai
Deshmukh, Basanti Devi, Sarala Devi Chaudhurani, and Janaki Thevar of the
Rani of Jhansi Regiment are the strongest-evidenced candidates already
identified.

Adding a person from a territory not yet in `regions.ts` requires adding
that territory to the state list first (with a `col`/`row` grid position)
— see the comment in [regions.ts](../src/data/regions.ts) about the tile
map being schematic, not geographic.

## Mechanical checklist for a new record

1. Confirm the person passes the two-of-four test above.
2. Pick (or create) the `src/data/fighters/*.ts` file for their region/era.
3. Write the full `FreedomFighter` record — every field the type requires,
   citing at least one real source, `disputed` notes for contested claims,
   and a Story Mode chapter carrying `uncertainty` if there is a `disputed`
   note (the validator warns if that pairing is missing).
4. Link `relatedPeople`, `movements`, `organizations`, `timelineEvents` by
   existing ids only — relations are resolved automatically from either
   side, so existing event/movement/fighter files never need editing back.
5. Export the new array through `src/data/fighters/index.ts`.
6. `npm run build` (runs `validate`, `search:check`, `typecheck`, then
   builds) — zero errors required; warnings are advisory.
