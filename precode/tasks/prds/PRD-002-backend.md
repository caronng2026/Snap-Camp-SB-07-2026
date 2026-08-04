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

# PRD-002 — Isolated Logins With Server-Side Storage
<!-- ANCHOR: prd-002-backend -->

> AUTHORITY: Product definition for isolated logins and server-side storage in Snap Camp.
> NOT_AUTHORITY: Active memory, task selection, stack choice, architecture, schema design, hosting, implementation status, or approval to code.
> LOAD_WHEN: Shaping, reviewing, or approving the backend product definition.
> CLASS: reference

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-03

## State

- ID: `PRD-002`
- Status: `draft`
- Owner: `user`
- Risk level: `high`
- Last updated: `2026-08-03`

**A problem statement now exists**, following confirmation on 2026-08-03 that Snap
Camp is deployed as one shared product serving multiple businesses. That answered
`BQ-1`.

**This PRD is still a draft and is far from approvable.** It has no requirements, no
acceptance oracles, and no architecture. Several open questions remain, and the
scope is materially larger than all of v1 combined. `PRD-001` and v1 are unaffected
by this file.

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

| Term | Status | Plain-English meaning | Avoid |
|---|---|---|---|
| Login | `introduced` | A username and passcode. The unit of isolation | account, user account — both imply management this product does not have |
| Data space | `introduced` | Everything belonging to one login: its daily logs, entries and exports | tenant, workspace, organisation — all imply structure above the login, which does not exist |
| Session | `introduced` | The period between signing in and signing out | — |

`Entry`, `DailyLog`, `Consolidation`, `DailySummary` and `SKU` carry over from
`PRD-001` unchanged.

**"Tenant" and "business" are deliberately not domain terms here.** A login is not a
business — one business could hold several logins, or none. Using either word would
imply grouping that BQ-5 ruled out.

## PRFAQ-Lite

- Press-release claim: **not written** — there is no claim to make yet
- Customer problem: **not established**
- Customer FAQ: —
- Internal FAQ: —
- Appetite: **unknown.** A backend is materially larger than all of v1 combined
- Kill or pause criteria: if no problem survives `Open Questions`, park this PRD and record why

## Problem

Snap Camp is deployed as one shared product serving multiple small businesses
(decided 2026-08-03), but it has no way to keep one user's inventory separate from
another's. Until it does, the product can serve exactly one business.

### Why v1 does not already solve this

v1's isolation is not a feature — it is a side effect of having no deployment at
all. Data lives in each user's own browser (`OQ-5`), on a single confirmed device
(`OQ-11`), with zero network requests (`SEC03`). One user cannot reach another's data
because there is no path between them.

A shared deployment removes that property. Isolation stops being free and becomes
something that must be built, tested, and kept correct.

### The shape of the answer

A **login is the isolation boundary** (BQ-5, 2026-08-03): a username and passcode
grant access to exactly one data space. Nothing sits above it and nothing is managed
inside it — no profiles, no roles, no admin, no recovery.

That is a deliberately small mechanism. It removes account management from scope
entirely, but it does **not** shrink the isolation problem: whether the boundary is
called a business or a login, every request still has to be checked server-side.

### What makes this different from ordinary auth work

The failure modes are not symmetrical. An authentication bug locks someone out and
is obvious within minutes. **An isolation bug silently shows one shop another shop's
inventory** — and the recorded design partners are small specialty businesses who
may be competitors. It can run undetected for a long time, and the damage is not
recoverable by fixing the code afterwards.

That asymmetry, not the login screen, is what makes this `risk_level: high`. The
narrowing of BQ-5 does not change it.

## User Moment

- **Before:** a second business wants to use Snap Camp. There is no way to give them
  access without them being able to reach the first business's inventory, so the
  answer is either "no" or "here is your own separate copy to install and maintain".
- **After:** each business signs in and sees only its own inventory. One deployment
  serves many businesses, and none of them can see another's data.
- **Why now:** the deployment model was settled on 2026-08-03 as one shared product.
  v1's isolation came from data never leaving the browser, and that property
  disappears the moment the product is hosted. This is not a problem that appears
  later — it appears with the second customer.

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

- **Primary user:** the owner or assistant at a small specialty business recording
  inventory — the same person `PRD-001` serves, now signing in to a hosted product
  rather than using their own browser's storage.
- **Secondary user:** **none.** There is no administrator, no operator role, and no
  support path into a login's data. This follows directly from the BQ-5 narrowing
  and is the reason a lost passcode is unrecoverable.
- **Excluded user:** every other login, with respect to this login's data. That
  exclusion is the requirement, not a footnote.

## Goals

- **Goal 1:** a business's inventory data is reachable only by that business.
- **Goal 2:** more than one business can use Snap Camp at the same time, from one
  deployment.
- **Goal 3:** the recording experience `PRD-001` delivered is preserved — the speed
  bar in `UX01` is not paid for with a login wall on every entry.

Goal 3 is deliberate: the product's whole premise is beating paper. A backend that
makes recording slower defeats the thing it is being added to.

## Non-Goals

### Inherited From `PRD-001` — Closed By Decision, Not By Omission

Each of these was decided, recorded, and in two cases confirmed with the client.
**None may be treated as a silent assumption of this PRD.** Any that this PRD needs
must be **explicitly reopened**, with what changed and why recorded in
`DECISIONS.md`.

| Closed in `PRD-001` | Decision | To use it here |
|---|---|---|
| **Multi-device use** | `OQ-11`, 2026-07-28 — client confirmed single-device only | **Still closed.** A shared deployment does not by itself require multi-device. Reopen only with evidence the answer changed |
| ~~Accounts and authentication~~ | `SEC02` | **REOPENED 2026-08-03** for `PRD-002` scope. Still in force for v1. Authorization is now a requirement, not an option |
| ~~External services and network~~ | `SEC03` | **REOPENED 2026-08-03** for `PRD-002` scope. Still in force for v1 |
| **Any database** | `OQ-5` — browser `localStorage` | Still closed as a *choice*. A shared deployment implies server-side storage, but no database has been selected and none should be before approval |
| **Multi-user** | `PRODUCT.md` later-scope list | **Still closed.** Multi-*tenant* is not multi-*user*. Whether one business has several logins is `BQ-5` |

### Ruled Out By The BQ-5 Narrowing (2026-08-03)

A login is the isolation boundary and nothing more. These are **not** deferred —
they are out of scope by decision, and adding any of them needs a new decision
recorded in `DECISIONS.md`, not an assumption inside a bead.

- User profiles, roles, or permissions
- An admin layer, operator console, or support access into a data space
- Password reset, forgotten-login recovery, or any account restoration path
- More than one user per login
- Any business, team, or organisation grouping above the login

**Consequence, accepted and recorded:** a lost passcode means permanently lost
server data. The `.xlsx` export is a partial mitigation for days already exported.

### Ruled Out By The Other BQ Answers

- Multi-device sync, conflict resolution, device registry (`BQ-2` — `OQ-11` stands)
- Data migration, import paths, v1/v2 dual-running for data reasons (`BQ-3`, `BQ-6`)
- Offline mode, local-first architecture, sync queues (`BQ-7`)
- Splitting this across several PRDs (`BQ-8`)

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

Redrafted 2026-08-03 against the narrowed BQ-5: a login is the isolation boundary,
with no account management of any kind. Single device, no offline requirement, no
data migration, one PRD.

Requirement IDs are stable from here. Acceptance oracles are **not yet written** and
are required before approval.

### Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-002-FR01` | A username and passcode grant access to exactly one data space | P0 | The whole of the access model |
| `PRD-002-FR02` | Entries recorded during a session are stored in that session's data space and no other | P0 | Isolation at write time |
| `PRD-002-FR03` | The daily log, consolidated totals, and export show only the signed-in space's data | P0 | Isolation at read time |
| `PRD-002-FR04` | Signing out ends the session and returns to the sign-in screen | P0 | Shop devices are shared |
| `PRD-002-FR05` | Recording, consolidation, daily rollover, and `.xlsx` export behave exactly as `PRD-001` defines | P0 | v1 behaviour is preserved, not redesigned |
| `PRD-002-FR06` | A data space persists server-side across sessions, browser resets, and redeployments | P0 | Replaces `localStorage` as the working store |

### UX Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-002-UX01` | Signing in happens once per session, never per entry | P0 | Protects the `PRD-001-UX01` speed bar |
| `PRD-002-UX02` | The signed-in identity is visible on screen at all times | P0 | On a shared device, "whose data is this" must never be a guess |
| `PRD-002-UX03` | A connection failure mid-entry surfaces a plain message and does not silently discard the entry | P0 | Offline support is out of scope; **silent data loss is not** |

### Security And Privacy Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-002-SEC01` | No request can read, write, or infer another data space's contents — including through logs, error messages, or response differences | P0 | **The core requirement of this PRD** |
| `PRD-002-SEC02` | Authorization is enforced server-side on every request, never by the client | P0 | A hidden UI element is not access control |
| `PRD-002-SEC03` | Credentials are never stored, transmitted, or logged in recoverable form | P0 | |
| `PRD-002-SEC04` | Sessions expire, and signing out invalidates the session server-side | P0 | Client-side sign-out alone is not sign-out |
| `PRD-002-SEC05` | No real design-partner identities, customer names, or supplier pricing enter the repository, fixtures, or logs | P0 | Carried unchanged from `PRD-001-SEC01` |

### Non-Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-002-NFR01` | Recording an entry stays fast enough that `PRD-001-UX01`'s bar is not lost to network latency | P0 | **`UX01` has never been measured — see below** |
| `PRD-002-NFR02` | The daily log renders within the bar measured for `PRD-001-NFR03`, allowing for data arriving over the network | P1 | Measured locally at 2.2ms for 200 entries; network cost is new and unmeasured |

**16 requirements, down from 19.** That reduction is smaller than the "10–12" I
estimated when recommending the rescope, and the estimate was wrong for an
instructive reason: the earlier draft contained no account-management requirements
to delete. It was already isolation-focused. What the BQ-5 narrowing actually did
was **harden the non-goals** and remove a whole category of *future* requirements,
not existing ones.

### Note On `NFR01` And The Speed Bar

The client's `BQ-7` answer states that *"`UX01`'s speed bar stands as originally
measured"*. **`PRD-001-UX01` was never measured.** `B002`'s Closeout Evidence records
it explicitly:

> *"`UX01` is NOT verified — no timed comparison against handwritten lines was run
> and no measurements exist, so the adoption bar is unproven."*

What was measured is `PRD-001-NFR03` — render performance, 2.2ms at 200 entries. A
different requirement.

This matters because `NFR01` asks that network latency not cost the speed bar, and
there is no baseline to compare against. Once a round trip is added, the first
measurement will include the network and the local figure becomes unrecoverable. If
that baseline is wanted, it has to be taken before this PRD is built.

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

All eight questions were resolved on 2026-08-03. `BQ-1` and `BQ-4` fell to the
deployment-model confirmation; the rest were answered by the client, with `BQ-5`
narrowed in a follow-up.

| # | Question | Answer | Effect |
|---|---|---|---|
| ~~BQ-1~~ | ~~What breaks today without a backend?~~ | Shared deployment cannot serve a second business without isolation | **Resolved.** Became the problem statement |
| ~~BQ-2~~ | ~~Record on more than one device?~~ | **Single device at a time** | **`OQ-11` stands as confirmed and is NOT reopened.** Rules out sync, conflict resolution, and multi-device session handling |
| ~~BQ-3~~ | ~~Is `localStorage` data loss a driver?~~ | **No.** Not a driver | Rules out migration as a motivation. Consistent with `BQ-6` |
| ~~BQ-4~~ | ~~Anchor partner, or selling to other businesses?~~ | Multiple businesses | **Resolved.** Reopened `SEC02` and `SEC03` for this PRD's scope |
| ~~BQ-5~~ | ~~One login per business, or several? Who administers access?~~ | **Narrowed and answered 2026-08-03.** A login is the isolation boundary and nothing more — no profiles, roles, admin, recovery, or grouping above it | **Resolved.** Removes account management from scope. Does not reduce the isolation requirement |
| ~~BQ-6~~ | ~~What happens to existing `localStorage` data?~~ | **No existing local data to migrate** | Rules out any import path, and rules out supporting v1 and v2 side by side for data reasons |
| ~~BQ-7~~ | ~~Does the recorder work offline?~~ | **Solid connectivity confirmed. Offline not required for v2** | Rules out local-first, sync queues, and offline conflict handling. `SEC03` reopens in one direction only — the app now makes network calls |
| ~~BQ-8~~ | ~~What is the appetite? One PRD or several?~~ | **One PRD**, and it stays its own PRD rather than becoming a bead | **Resolved 2026-08-03.** A bead is not structurally available: `PRD-PROTOCOL.md` requires a PRD before coding, and this cannot extend `PRD-001`, which is complete and browser-only by decision |

### What the answers rule out

Recorded so later work does not quietly reintroduce them:

- **No multi-device sync**, no conflict resolution, no device registry (`BQ-2`)
- **No data migration**, no import path, no v1/v2 dual-running for data reasons (`BQ-3`, `BQ-6`)
- **No offline mode**, no local-first architecture, no sync queue (`BQ-7`)
- **No PRD split** — one scope (`BQ-8`)

Each of these would need a new decision recorded in `DECISIONS.md`, not an
assumption inside a bead.

### All eight are now answered

No open question blocks this PRD. What blocks approval is unfinished work, not
unanswered questions: there are no acceptance oracles, no risk-model detail, no
architecture, and no bead proposals. See `Approval`.

## Approval

- Approved by: *not approved*
- Approved on: *not approved*
- Approval notes: **Not approvable yet.** A problem statement exists as of
  2026-08-03 and `BQ-1` and `BQ-4` are resolved, but there are still no requirements,
  no acceptance oracles, and no architecture, and six open questions remain.

  Per `PRD-PROTOCOL.md` section 7, approval requires clear goals and non-goals,
  stable requirement IDs, an acceptance oracle for every requirement, explicit risk
  and permission gates, and bead proposals narrow enough to execute. None of those
  exist yet.

  Shaped under bead `B009`. `PRD-001` and v1 are untouched and continue
  independently.
