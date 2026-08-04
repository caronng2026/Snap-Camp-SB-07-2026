# Snap Camp — Architecture
<!-- ANCHOR: architecture -->

> AUTHORITY: Route structure, flow shape, module placement, and auth boundaries for Snap Camp.
> NOT_AUTHORITY: Business scope, pricing policy, feature prioritization, or field-level schema semantics.
> LOAD_WHEN: Planning or reviewing architecture-affecting work.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `ARCHITECTURE.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.3.0
Last updated: 2026-08-04

## Source Of These Decisions

Everything here is recorded from the Architecture Briefs in
`tasks/prds/PRD-001-daily-inventory-recorder.md` and
`tasks/prds/PRD-002-backend.md`, and from the technical decisions in `DECISIONS.md`.
This file introduces no new architecture decisions.

## What Exists Versus What Is Decided

**`frontend/` exists and is built.** All of `PRD-001` is delivered and accepted.

**`backend/` does not exist.** Everything in the v2 sections below is decided under
`PRD-002` and its Architecture Brief (2026-08-04) but **not built**. Do not read
those sections as describing running code.

## v1 Shape — Built

Snap Camp v1 is a single browser-based, mobile-responsive web app. There is no
server, no database, and no network call.

```text
<repo root>/
  precode/     control layer
  frontend/    the web app — Vite, vanilla JS modules, Vitest   [built]
  backend/     Node + Fastify, MongoDB Atlas, bcrypt             [decided, not built]
```

- Build tooling: **Vite**. Test runner: **Vitest**. **No UI framework** — the app is
  one screen, so a component framework adds dependencies and agent surface area
  without buying structure (OQ-2).
- Runtime dependencies: one spreadsheet writer for the `.xlsx` export, approved in
  principle and selected against fixed criteria (OQ-3, OQ-10).
- Node and npm are development prerequisites.

## v1 Modules

Four boundaries, from the `PRD-001` Architecture Brief. File names inside `frontend/src/` are
left to the implementing agent provided the change is recorded.

| Module | Responsibility | Contract |
|---|---|---|
| `Entry` | One record of a SKU and how many moved | Stores the SKU exactly as typed; rejects an empty SKU or a non-numeric quantity |
| `DailyLog` | Everything recorded for one business day | Appends entries; groups by local calendar date; never mutates a prior day |
| `consolidate()` | Combine repeated entries for the same SKU | **Pure function.** Order-independent; total preserved; no side effects |
| `DailySummary` | Render a consolidated log to an `.xlsx` file | Output opens in Excel with no repair prompt; SKU column written as text |

## v1 Data Flow

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

## v1 Storage Boundary

- Working store: browser `localStorage`, keyed by local calendar date (OQ-5).
- Durable record: the exported `.xlsx`. If the two disagree, the export is what the
  user keeps.
- `localStorage` is per-device and per-browser and can be cleared without warning.
  The app must show which day is active and when it last saved (`UX05`) so it never
  appears to hold more than it does.
- Day rollover is automatic at local midnight. Prior days are retained indefinitely
  and never auto-deleted (OQ-6). Deleting a day is a destructive action requiring
  explicit approval.

## v1 Auth And Network Boundaries

- **No auth boundary.** No accounts, roles, permissions, or personal data (`SEC02`).
- **No network boundary.** No external requests, telemetry, or analytics (`SEC03`).
- **No server boundary.** See `API.md`.

These describe v1 as built. **`PRD-002` reopens all three** for v2 — `SEC02` and
`SEC03` were reopened by recorded decision on 2026-08-03. They were closed
deliberately in v1 and reopened deliberately for v2; neither was an accident.

## v1 — Left To The Implementing Agent

Per the `PRD-001` Architecture Brief, these are not architecture decisions and should
be settled in-repo:

- file and module names inside `frontend/src/`
- CSS approach
- test file layout
- the internal shape of the `localStorage` serialization

The date-key model and the pure-function consolidation boundary must hold.

## v2 — Isolated Logins With Server-Side Storage

Decided under `PRD-002` Architecture Brief, 2026-08-04. **Not built.**

### Shape

- **Backend:** Node with **Fastify**. Same language as the frontend, one toolchain.
- **Data store:** **MongoDB Atlas** via the official `mongodb` driver. Reversed from
  SQLite on 2026-08-04 — the builder already has Atlas set up. The connection string
  is a secret, and the backend does not run without connectivity.
- **Password hashing:** **bcrypt**. One-way by design, which is what `SEC03` requires.
- **Sessions:** signed **HTTP-only cookie** with a **server-side session table**.
  Sign-out and expiry invalidate server-side, which `SEC04` requires and a stateless
  token cannot do.
- **Connection:** **same origin in both environments.** Vite dev proxy in
  development; the backend serves the built frontend in production. No CORS, no
  preflight, no `SameSite` handling, one process in production.

### The Isolation Boundary

The decision this architecture turns on.

**Every data function takes a space id as its first argument, and no unscoped
alternative exists to call.** Isolation is structural, not a rule to remember.

```text
request
   |
 session middleware      rejects before any handler runs
   |
 space id FROM THE SESSION      never from body, query, or headers
   |
 space-scoped store      no function exists that omits the space id
   |
 data
```

Per-endpoint checks would make `PRD-002-SEC01` depend on nobody ever forgetting. Its
failure is silent, cross-company, and unrecoverable once it has happened, so the
guarantee must come from structure.

**What this does not guarantee:** that no path leaks. `SEC01` is a negative claim
over an unbounded set of requests; the test suite bounds the attempts that were
thought of.

### Left To The Implementing Agent

File and module names under `backend/src/`, route paths, table names, test layout,
and the internal shape of the session record — provided the scoped-store boundary
and server-side authorization hold.

