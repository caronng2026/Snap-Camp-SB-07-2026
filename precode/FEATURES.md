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
| Isolated Logins With Server-Side Storage | `tasks/prds/PRD-002-backend.md` | approved | A login is the isolation boundary: a username and passcode grant access to exactly one data space, stored server-side, with no path from one space to another. Lets Snap Camp serve more than one business from a single deployment. |
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

## Functional Requirements — `PRD-002`

Compiled from `PRD-002`, approved 2026-08-04. UX, security, and non-functional
requirements stay in the shard beside their acceptance oracles, matching how
`PRD-001` was compiled.

| ID | Requirement | Priority | Scope |
|---|---|---|---|
| `PRD-002-FR01` | A username and passcode grant access to exactly one data space | P0 | v2 |
| `PRD-002-FR02` | Entries recorded during a session are stored in that session's space and no other | P0 | v2 |
| `PRD-002-FR03` | The daily log, consolidated totals, and export show only the signed-in space's data | P0 | v2 |
| `PRD-002-FR04` | Signing out ends the session and returns to the sign-in screen | P0 | v2 |
| `PRD-002-FR05` | Recording, consolidation, daily rollover, and `.xlsx` export behave exactly as `PRD-001` defines | P0 | v2 |
| `PRD-002-FR06` | A data space persists server-side across sessions, browser resets, and redeployments | P0 | v2 |

**v2 MVP slice:** the isolation loop — sign in, record, sign out, and a second login
sees nothing of the first.

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
| Multi-user | Still out of scope. **Accounts and authentication moved into scope** under `PRD-002` (approved 2026-08-04) — but as a bare login, not user management |
| A specific database, e.g. MongoDB | **Server-side storage is now in scope** under `PRD-002`, but no database has been chosen. That is an Architecture Shaping question |

## Compilation Status

| PRD | Status | Compiled | Notes |
|---|---|---|---|
| `PRD-001` | approved | 2026-07-30 | Functional requirements `FR01`–`FR06` compiled above |
| `PRD-002` | approved | 2026-08-04 | Functional requirements `FR01`–`FR06` compiled above. Architecture Shaping outstanding before decomposition |

`PRD-001` is complete: Architecture Shaping was run, decomposition produced beads
`B002`–`B008`, and all 17 requirements are delivered and accepted.

`PRD-002` is approved but not yet shaped. Architecture Shaping runs next, then
decomposition. Nothing in this file authorizes either.
