# Snap Camp — Data Models
<!-- ANCHOR: data-models -->

> AUTHORITY: Schema field names, entity relationships, data type shapes, and field semantic meaning for Snap Camp.
> NOT_AUTHORITY: UI flow, acceptance behavior, route placement, or pricing business scope.
> LOAD_WHEN: Planning or reviewing schema-affecting work.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `DATA-MODELS.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-31

## Source Of These Definitions

Recorded from the Architecture Brief in
`tasks/prds/PRD-001-daily-inventory-recorder.md` and the technical decisions in
`DECISIONS.md`. There is no database in v1; these are in-memory shapes serialized to
browser `localStorage`.

## `Entry`

One record of an item and how many moved. Created when the user saves.

| Field | Type | Meaning | Rules |
|---|---|---|---|
| `sku` | string | The user's own code or name for an item | **Free text. Stored exactly as typed.** Never coerced to a number, trimmed of leading zeros, case-folded, or normalized |
| `quantity` | number | How many moved | Whole numbers in v1. Decimals and negatives are open — see OQ-7 |
| `timestamp` | ISO 8601 string | When the entry was recorded | Local time; used for ordering within a day |

**The `sku` rule is the most important constraint in the project.** The anchor
partner's SKUs are numeric with leading zeros (OQ-10) — `00734` must survive entry,
storage, consolidation, and export as the string `00734`. Any place that treats a
SKU as a number is a defect, and it is why the export is `.xlsx` rather than `.csv`.

`Entry` rejects an empty `sku` and a non-numeric `quantity`.

## `DailyLog`

Everything recorded for one business day.

| Field | Type | Meaning | Rules |
|---|---|---|---|
| key | local calendar date, `YYYY-MM-DD` | Which business day the entries belong to | Derived from local time. A new key appears automatically at local midnight (OQ-6) |
| `entries` | array of `Entry` | Everything recorded that day, in the order recorded | Append-only during the day. A prior day's entries are never rewritten or removed by the app |

Prior days are retained indefinitely and never auto-deleted. Deleting a day is a
destructive action requiring explicit approval.

## Consolidation Is Derived, Not Stored

There is no stored "consolidated" entity. `consolidate()` is a pure function applied
at read time over one day's entries:

```text
[ {sku: "00734", qty: 3}, {sku: "00734", qty: 2}, {sku: "0091", qty: 1} ]
        |
   consolidate()
        |
[ {sku: "00734", qty: 5}, {sku: "0091", qty: 1} ]
```

- Order-independent: the same entries in any order produce the same result.
- Total-preserving: summed quantities equal the sum of the inputs.
- Grouping is by **exact** `sku` string. Case sensitivity, whitespace handling, and
  near-match grouping are **not** defined in v1 — a bead needing any of those must
  stop and ask rather than inventing a rule.

Because consolidation is derived, the original entries always remain inspectable.

## Persistence Shape

- Store: browser `localStorage`, single-device (OQ-5, OQ-11).
- Serialization internals are left to the implementing agent, provided the
  local-date key model holds.
- The exported `.xlsx` is the durable record; `localStorage` is the working store
  and can be cleared without warning.

## Not In v1

No product transformations, kits or bundles, customer or order records, pricing,
valuation, purchase orders, multi-location, or multi-user. See `FEATURES.md` for the
full later-scope list. No database — the MongoDB note in `DECISIONS.md` is
forward-looking context only and is not approval to design a schema.
