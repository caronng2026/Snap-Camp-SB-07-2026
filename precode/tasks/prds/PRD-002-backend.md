---
prd_id: PRD-002
status: draft
owner: user
risk_level: high
feature_link: TBD
features_status: not compiled
related_prds:
  - PRD-001
---

# PRD-002 — Backend (Skeleton)
<!-- ANCHOR: prd-002-backend -->

> AUTHORITY: Product definition for a Snap Camp backend, once a problem for it exists.
> NOT_AUTHORITY: Active memory, task selection, stack choice, architecture, schema design, hosting, implementation status, or approval to code.
> LOAD_WHEN: Shaping, reviewing, or approving the backend product definition.
> CLASS: reference

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-03

## State

- ID: `PRD-002`
- Status: `draft` — **skeleton only**
- Owner: `user`
- Risk level: `high`
- Last updated: `2026-08-03`

**This is scaffolding, not a product definition.** It exists so the backend
conversation has somewhere to land. It has **no problem statement**, and one has
deliberately not been written: no user problem, painful moment, or workaround has
been captured for a backend. Writing one from the available material would mean
inventing it.

This PRD cannot be approved, shaped further, or decomposed until `Open Questions`
are answered. `PRD-001` and v1 are unaffected by this file.

## Feature Link

- Feature: `TBD` — nothing to compile
- `FEATURES.md` status: `not compiled`
- Related PRDs: `PRD-001` — complete, all 17 requirements delivered

## Source Inputs

- Source type: a single forward-looking note, not a reviewed packet
- Source reference: `DECISIONS.md`, 2026-07-28 — *"The client has stated an intent to move to **MongoDB** in a future v2 or backend phase."* Recorded explicitly as **not a v1 requirement**
- Stable facts: none about a backend. The note names a technology, not a problem
- Assumptions: none recorded, and none should be invented here
- Primary hypothesis / learning target: **not yet stated**
- Hypothesis review status: `untested`
- Conflicts or stale inputs: the note predates v1 being built. Whether it still reflects the client's thinking is unknown
- Privacy or secrets redactions: partner identities remain redacted to roles, per `SECURITY.md`. That rule carries into this PRD unchanged
- Candidate requirements: **none** — requirements follow a problem
- Authority files likely affected: `PRODUCT.md`, `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md`, `PROJECT-CONTEXT.md`, `DECISIONS.md`
- Discarded or stale inputs: none

**No Local Source Intake has been run for a backend.** `PRD-001` had a reviewed
Conviction Packet behind it. This has one sentence.

## Alignment / Grilling Summary

- Alignment method: `none yet`
- Shared design concept: **not established**
- Key decisions reached: none
- Remaining implementation-changing questions: all of them — see `Open Questions`
- Stale or discarded assumptions: none recorded

## Domain Language

No new terms. Existing terms carry over from `PRD-001` unchanged: `Entry`,
`DailyLog`, `Consolidation`, `DailySummary`, `SKU`. A backend may introduce terms
such as account, device, or sync, but none should be defined before the problem is.

## PRFAQ-Lite

- Press-release claim: **not written** — there is no claim to make yet
- Customer problem: **not established**
- Customer FAQ: —
- Internal FAQ: —
- Appetite: **unknown.** A backend is materially larger than all of v1 combined
- Kill or pause criteria: if no problem survives `Open Questions`, park this PRD and record why

## Problem

**Deliberately left open.**

No user problem has been captured for a backend. `PRD-001` closed the three
candidates a backend would normally address, each as a recorded decision with a
reason — see `Non-Goals`.

The only input is a stated technology preference. Per
`tasks/templates/PRODUCT-IDEATION-WORKBOOK.md`, solution-first framing is a failure
mode to challenge, not a starting point to build on.

This section is filled in only from evidence: a real user, a real moment, and what
they do today instead.

## User Moment

- Before: **not established**
- After: **not established**
- Why now: **not established.** Whether the trigger is present-day pain or
  anticipated growth is itself an open question

## Destination

- Destination statement: **not established**
- Definition of done: **not established**
- First useful vertical slice: **not established**

## Product Constitution Fit

- `PRODUCT.md` loaded: `yes`
- Product promise fit: **cannot be assessed.** The promise is *"record it once during the day, and the end-of-day spreadsheet is already done."* A backend does not obviously serve that promise, which is itself worth noticing
- User and job fit: the recorded users are three specialty businesses using a single device each. No backend need follows from them as recorded
- Strategy and non-goal fit: **tension.** `PRODUCT.md` lists explicit non-bets including *"becoming a full inventory management system"*. A backend is not automatically that, but it moves toward it
- Current bet or success signal affected: none. The v1 bet is `approved` and its success signals are behavioural, none requiring a server
- Product constitution update needed: **unknown until the problem exists**

## Users

- Primary user: **not established.** Possibly the anchor partner, possibly a future customer, possibly Snap Camp itself as an operator. These are different products
- Secondary user: —
- Excluded user: —

## Goals

**Not established.** Goals follow a problem.

## Non-Goals

### Inherited From `PRD-001` — Closed By Decision, Not By Omission

Each of these was decided, recorded, and in two cases confirmed with the client.
**None may be treated as a silent assumption of this PRD.** Any that this PRD needs
must be **explicitly reopened**, with what changed and why recorded in
`DECISIONS.md`.

| Closed in `PRD-001` | Decision | To use it here |
|---|---|---|
| **Multi-device use** | `OQ-11`, 2026-07-28 — client **confirmed single-device only**; `localStorage` sufficient; the `backend/` question stays closed | Reopen `OQ-11` with evidence the answer changed |
| **Accounts and authentication** | `SEC02` — no auth, no accounts, no personal data. A *tested* requirement, not just a decision | Reopen `SEC02`; sensitive-surface review required |
| **External services and network** | `SEC03` — zero external network requests, verified by integration check | Reopen `SEC03`; sensitive-surface review required |
| **Any database** | `OQ-5` — browser `localStorage`; a backend database *"would activate `backend/` and contradict `SEC03`, and is the v2 path"* | Reopen `OQ-5` |
| **Multi-user** | `PRODUCT.md` later-scope list | Reopen as product scope, not as a technical detail |

### Also Not This PRD

- MongoDB, or any database choice. The `DECISIONS.md` note is context, not a requirement
- Hosting, deployment, or an auth provider
- Anything in `PRODUCT.md`'s later-scope list — SKU transformation, combo items, QR labels, valuation, purchase orders, multi-location, POS or accounting integrations, analytics
- Changes to v1 behaviour. `PRD-001` is complete and is not amended by this PRD

## Alternatives Considered

| Option | Why it may be right | Decision owner |
|---|---|---|
| Do nothing; keep v1 as-is | The recorded evidence supports single-device browser-local use. No problem has been shown | user |
| Export discipline instead of a backend | If the risk is losing a day to cleared storage, a reliable export habit or an export reminder may address it far more cheaply | user |
| A backend | **Requires a problem statement first** | user |

Recorded so "build a backend" is compared against alternatives rather than assumed.

## Requirements

**None.** Requirements follow an approved problem. Writing them now would be
inventing scope.

### Functional Requirements

*(empty)*

### UX Requirements

*(empty)*

### Security And Privacy Requirements

*(empty — but note that any backend reopens `SEC02` and `SEC03`, both currently tested requirements)*

### Non-Functional Requirements

*(empty)*

## Acceptance Oracle Matrix

*(empty — no requirements to build oracles for)*

## Risk And Permission Model

### Sensitive Surfaces

Every surface v1 closed would reopen. This is why `risk_level` is `high` while the
PRD is otherwise empty.

- Auth: would be introduced. Currently none
- Payments: unknown; depends on whether this is a commercial product
- User data: would leave the user's own machine for the first time
- Uploads: unknown
- External services: would be introduced. Currently none
- Secrets: would be introduced — connection strings, credentials, keys. Currently none anywhere in the repository
- Destructive actions: server-side data loss, migrations, and multi-device conflict resolution are all new failure modes

### Human Approval Gates

- Approval required before: answering any `Open Question` in a way that reopens a `PRD-001` decision; choosing any technology; creating `backend/`; adding any dependency; approving this PRD
- Stop if: a requirement is written without a problem behind it, or a technology choice starts driving requirements
- Escalate when: partner data would leave the local machine

### Tool And Environment Boundaries

**Not established.** No hosting, runtime, or environment has been chosen, and none
should be before approval.

## Architecture / Project Context Impact

- Project context impact: `material` — activating `backend/` changes the repository topology recorded under `B001`
- `PROJECT-CONTEXT.md` loaded: `yes`
- **Architecture Shaping: not run, and must not be.** Its load condition is an
  **approved** PRD (`ARCHITECTURE-SHAPING-PROTOCOL.md:6`). This PRD is a skeleton
- Architecture Brief evidence: none, correctly
- Owner-file updates needed: unknown until a problem exists

## Module / Interface Candidates

*(empty — module boundaries follow architecture, which follows approval)*

## Agent Context Contract

- Primary authority file: this PRD once approved; until then `tasks/reference/PRD-PROTOCOL.md`
- Secondary reference files: `DECISIONS.md`, `PRODUCT.md`, `SECURITY.md`, `PRD-001`
- Files or folders likely in play: none. Nothing is buildable from this PRD
- Files or folders out of scope: **everything.** `frontend/`, `backend/`, and all v1 files
- Required checks: none yet
- Forbidden assumptions: do not assume a backend is needed; do not assume MongoDB; do not assume `OQ-11`, `SEC02`, `SEC03`, or `OQ-5` are reopened; do not treat this skeleton as approved; do not write a problem statement that is not evidenced

## Anti-Shallow Checks

- User problem named: **no — deliberately open**
- Non-goals named: **yes** — inherited closures listed explicitly above
- Before/after user moment clear: **no**
- Requirements observable: **n/a** — none exist
- Sensitive surfaces identified: **yes** — all would reopen
- Authority files identified: **yes**
- First bead can be one logical unit: **no** — nothing to slice
- Generated text reviewed by user: **pending**

Failing most of these is the correct state for a skeleton. It is recorded so the
gap is visible rather than assumed closed.

## Bead Proposals

**None.** Decomposition requires an approved PRD, and there is nothing to decompose.

## Compilation Notes

Nothing to compile into `FEATURES.md`.

## Open Questions

All four block this PRD. The middle column names what each one would **reopen** if
answered a particular way — so the cost of an answer is visible before it is given.

| # | Question | Would reopen | Blocks |
|---|---|---|---|
| **BQ-1** | What breaks today without a backend? Name something the anchor partner does that browser-local storage cannot support | Nothing by itself — but a real answer here is what makes any of the others legitimate | **The whole PRD.** Without this there is no problem statement and nothing else can be written |
| **BQ-2** | Has the single-device answer changed? A second device, a phone on the shop floor, an assistant working in parallel | **`OQ-11`** (single-device confirmed 2026-07-28) and consequently **`OQ-5`** (`localStorage` sufficient) | Persistence design, sync model, conflict handling |
| **BQ-3** | Is data loss the driver? `localStorage` can be cleared without warning; the `.xlsx` export is the durable record only if they actually export daily | **`OQ-5`** if durability requires a server. May reopen nothing if an export habit or reminder solves it | Whether the answer is a backend at all, or a much smaller change |
| **BQ-4** | Is this for the anchor partner, or for selling Snap Camp to other businesses? | **`SEC02`** (accounts), **`SEC03`** (external services), and `PRODUCT.md` strategy and non-bets | Users, destination, and whether this is a persistence PRD or a commercial one — different products |

**BQ-3 is the most likely to hold up**, because it names a failure mode already
recorded in `DECISIONS.md` and does not require the single-device answer to have
changed. It is also the one most likely to be solved without a backend, which is
worth knowing before building one.

**BQ-1 is the gate.** The other three refine a problem; without BQ-1 there is none.

## Approval

- Approved by: *not approved*
- Approved on: *not approved*
- Approval notes: **Skeleton only.** No problem statement, no requirements, no
  acceptance oracles, no architecture. Cannot be approved in this state and must not
  be used as the source for Architecture Shaping, decomposition, beads, or code.

  Created under bead `B009` on 2026-08-03 so the backend conversation has a home.
  `PRD-001` and v1 are untouched and continue independently.
