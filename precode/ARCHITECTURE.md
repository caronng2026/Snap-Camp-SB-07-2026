# Snap Camp — Architecture
<!-- ANCHOR: architecture -->

> AUTHORITY: Route structure, flow shape, module placement, and auth boundaries for Snap Camp.
> NOT_AUTHORITY: Business scope, pricing policy, feature prioritization, or field-level schema semantics.
> LOAD_WHEN: Planning or reviewing architecture-affecting work.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `ARCHITECTURE.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-31

## Source Of These Decisions

Everything here is recorded from the Architecture Brief in
`tasks/prds/PRD-001-daily-inventory-recorder.md` and the technical decisions in
`DECISIONS.md`. This file introduces no new architecture decisions.

## Shape

Snap Camp v1 is a single browser-based, mobile-responsive web app. There is no
server, no database, and no network call.

```text
<repo root>/
  precode/     control layer
  frontend/    the web app — Vite, vanilla JS modules, Vitest
  backend/     absent until an approved backend bead
```

- Build tooling: **Vite**. Test runner: **Vitest**. **No UI framework** — the app is
  one screen, so a component framework adds dependencies and agent surface area
  without buying structure (OQ-2).
- Runtime dependencies: one spreadsheet writer for the `.xlsx` export, approved in
  principle and selected against fixed criteria (OQ-3, OQ-10).
- Node and npm are development prerequisites.

## Modules

Four boundaries, from the Architecture Brief. File names inside `frontend/src/` are
left to the implementing agent provided the change is recorded.

| Module | Responsibility | Contract |
|---|---|---|
| `Entry` | One record of a SKU and how many moved | Stores the SKU exactly as typed; rejects an empty SKU or a non-numeric quantity |
| `DailyLog` | Everything recorded for one business day | Appends entries; groups by local calendar date; never mutates a prior day |
| `consolidate()` | Combine repeated entries for the same SKU | **Pure function.** Order-independent; total preserved; no side effects |
| `DailySummary` | Render a consolidated log to an `.xlsx` file | Output opens in Excel with no repair prompt; SKU column written as text |

## Data Flow

```text
user types SKU + quantity
        |
   Entry created              rejects empty SKU / non-numeric quantity
        |
   appended to DailyLog       keyed by local calendar date
        |
   consolidate() at read time pure transform, not a mutation
        |
   rendered in today's log    consolidated totals visible in the UI
        |
   DailySummary -> .xlsx      the durable record
```

**Consolidation is a read-time transform, not a stored result.** Entries are kept as
recorded; totals are derived when the log is displayed or exported. That is what
makes `consolidate()` independently testable and safe to delegate.

## Storage Boundary

- Working store: browser `localStorage`, keyed by local calendar date (OQ-5).
- Durable record: the exported `.xlsx`. If the two disagree, the export is what the
  user keeps.
- `localStorage` is per-device and per-browser and can be cleared without warning.
  The app must show which day is active and when it last saved (`UX05`) so it never
  appears to hold more than it does.
- Day rollover is automatic at local midnight. Prior days are retained indefinitely
  and never auto-deleted (OQ-6). Deleting a day is a destructive action requiring
  explicit approval.

## Auth And Network Boundaries

- **No auth boundary.** No accounts, roles, permissions, or personal data (`SEC02`).
- **No network boundary.** No external requests, telemetry, or analytics (`SEC03`).
- **No server boundary.** See `API.md`.

These are v1 decisions, not permanent properties. Reintroducing any of them needs a
PRD amendment, because each was closed deliberately.

## Left To The Implementing Agent

Per the Architecture Brief, these are not architecture decisions and should be
settled in-repo:

- file and module names inside `frontend/src/`
- CSS approach
- test file layout
- the internal shape of the `localStorage` serialization

The date-key model and the pure-function consolidation boundary must hold.
