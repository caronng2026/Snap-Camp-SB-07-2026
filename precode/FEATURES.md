# Snap Camp — Feature Inventory
<!-- ANCHOR: features -->

> AUTHORITY: Compiled feature inventory, functional requirements, priorities, and MVP slices for Snap Camp.
> NOT_AUTHORITY: Route structure, module placement, schema field names, pricing policy, or deep PRD narrative.
> LOAD_WHEN: Compiling approved PRD shards into a feature inventory or checking requirement IDs during planning.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `FEATURES.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-30

## How To Read This File

This is the **compiled** inventory: feature summary, functional requirements, and
MVP status only. Deep requirement definition, acceptance oracles, risk model, and
bead proposals stay in the PRD shard.

UX, security, and non-functional requirements are **not** compiled here. They live
with their acceptance oracles in the shard, where the proof expectation sits next to
the requirement.

## Features

| Feature | Source PRD | Status | Summary |
|---|---|---|---|
| Daily Inventory Recorder | `tasks/prds/PRD-001-daily-inventory-recorder.md` | approved | Record item SKUs and quantities during the working day, consolidate repeated SKUs automatically, and produce an Excel-ready daily summary in one action — replacing manual end-of-day spreadsheet consolidation. |

## Functional Requirements

Compiled from `PRD-001`, approved 2026-07-30. IDs are stable and owned by the shard.

| ID | Requirement | Priority | Scope |
|---|---|---|---|
| `PRD-001-FR01` | The user can record an item SKU as free text | P0 | MVP |
| `PRD-001-FR02` | The user can record a quantity for that SKU | P0 | MVP |
| `PRD-001-FR03` | The user can see today's inventory log with all entries recorded so far | P0 | MVP |
| `PRD-001-FR04` | Repeated entries for the same SKU are consolidated into a single total automatically | P0 | MVP |
| `PRD-001-FR05` | The user can generate an Excel-ready daily summary in one action | P0 | MVP |
| `PRD-001-FR06` | A new empty daily log is available on the next business day | P1 | MVP |

Requirement definition, acceptance oracles, and "what this does not prove" for each
of these live in the shard's Acceptance Oracle Matrix. All 17 `PRD-001` requirements
carry an oracle.

## MVP Slice

The MVP is one complete value loop: **record → consolidate → export → return the
next day**. A user completes it without barcode scanning, purchase orders, product
transformations, reporting, or integrations.

Delivery shape is a browser-based, mobile-responsive web app persisting to browser
`localStorage`, exporting `.xlsx`. See `DECISIONS.md` for OQ-2, OQ-3, OQ-5, OQ-10,
and OQ-11.

Definition of done for the MVP: the anchor partner records one real business day
end to end and accepts the exported summary as correct.

## Later Scope

Not compiled as requirements. Recorded so they are not mistaken for MVP work, and
not to be pulled forward without a new or amended PRD.

| Deferred | Note |
|---|---|
| SKU transformation | Named as the leading v2 wedge — see `DECISIONS.md` |
| Combo / bundle (kit) items | Parked with transformation for v2 |
| Self-printed QR or bin labels | Strong v2 candidate |
| Barcode scanning, inventory valuation, purchase orders, multi-location, low-stock flags | Out of scope for v1 |
| Analytics, dashboards, reporting beyond the daily summary | Out of scope for v1 |
| QuickBooks, Shopify, or POS integrations | Out of scope for v1 |
| Multi-user, accounts, authentication | Out of scope for v1; v1 has no auth by decision |
| MongoDB or any backend database | Forward-looking note only — see `DECISIONS.md`. Not a v1 requirement and not approval to activate `backend/` |

## Compilation Status

| PRD | Status | Compiled | Notes |
|---|---|---|---|
| `PRD-001` | approved | 2026-07-30 | Functional requirements `FR01`–`FR06` compiled above |

Outstanding for `PRD-001` after this compilation: Architecture Shaping, decomposition
against the chosen framework, and promotion of the acceptance oracles and behavioural
success signals into `ACCEPTANCE.md`. None of those is authorized by this file.
