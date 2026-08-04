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

- **Alignment method:** builder interrogation across 2026-08-03 and 2026-08-04. The
  builder is also the client, so answers were direct rather than relayed.
- **Shared design concept:** a login is the isolation boundary; everything else is
  the machinery required to make that boundary trustworthy.
- **Key decisions reached:** shared deployment confirmed · `SEC02` and `SEC03`
  reopened for this scope only · BQ-5 narrowed from account-per-business to a bare
  login · no recovery accepted · stays one PRD.
- **Recommended answers accepted:** keeping this as its own PRD rather than a bead;
  renaming from "Multi-Tenant Backend"; recording the no-recovery consequence.
- **Recommended answers rejected or changed:** the agent estimated the BQ-5 narrowing
  would cut requirements to 10–12; it did not, and the reason is recorded under
  `Requirements`.
- **Remaining implementation-changing questions:** none at PRD level. Framework, data
  store, session mechanism, and how `frontend/` and `backend/` connect are all
  Architecture Shaping questions and are listed there.
- **Stale or discarded assumptions:** the original account-per-business framing, and
  the agent's earlier bet that `localStorage` data loss would be the driver.

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

- **Press-release claim:** Snap Camp now serves more than one business at a time, and
  no business can see another's inventory.
- **Customer problem:** a second business cannot use Snap Camp without seeing the
  first one's data.
- **Customer FAQ:** *Do I need an account?* A username and passcode. *What if I lose
  it?* There is no reset — keep your daily exports. *Can my assistant use it?* Yes,
  on the same login. *Does it work offline?* No.
- **Internal FAQ:** the hard part is isolation, not the login screen. The login is
  deliberately minimal so the isolation work is not diluted by account management.
- **Appetite:** larger than all of v1 combined. It introduces a server, a data store,
  credentials, sessions, and hosting where v1 has none.
- **Kill or pause criteria:** pause if `NFR01` shows the round trip costs the
  recording experience — a slower recorder defeats the product it is being added to.

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

- **Destination statement:** two businesses can use Snap Camp at the same time from
  one deployment, each signing in to its own data space, with neither able to reach
  the other's inventory.
- **Definition of done:** two logins exist; each records a full day independently;
  neither can read, write, or infer the other's data through any exercised path; and
  the `PRD-001` recording experience is unchanged.
- **First useful vertical slice:** sign in, record one entry, sign out, sign in as a
  second login, and see an empty log. That single loop demonstrates the isolation
  boundary end to end.

## Product Constitution Fit

- `PRODUCT.md` loaded: `yes`
- **Product promise fit:** neutral-to-supporting. The promise is *"record it once
  during the day, and the end-of-day spreadsheet is already done."* Isolation does
  not advance that promise, but it is what allows the promise to be offered to more
  than one business at a time.
- **User and job fit:** unchanged. The same person doing the same job, now signing in
  first.
- **Strategy and non-goal fit:** consistent. `PRODUCT.md`'s explicit non-bets are
  *"becoming a full inventory management system"* and competing on breadth. Isolated
  logins add no inventory features. The BQ-5 narrowing keeps it that way.
- **Current bet or success signal affected:** none directly. The v1 bet is `approved`
  and its behavioural success signals are unchanged — but they now depend on the
  recording experience surviving a network round trip (`NFR01`).
- **Product constitution update needed:** **yes, on approval.** `PRODUCT.md` currently
  describes a browser-local single-business product. Its Current Bets table needs a
  row for this work, and Strategy needs to record that Snap Camp serves multiple
  businesses from one deployment.

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

One row per requirement, 16 of 16. Nothing here is proof until run through
`bash scripts/record-check.sh -- <command>` and recorded in bead Closeout Evidence.

| Requirement | Expected behavior | Lane | Automated check | Manual check | Fixture | Does not prove |
|---|---|---|---|---|---|---|
| `FR01` | WHEN a valid username and passcode are submitted THE SYSTEM SHALL start a session bound to exactly one data space | `integration` | sign-in returns a session scoped to one space id; wrong passcode returns no session | sign in as two different logins in turn | two seeded logins | that credentials are hard to guess |
| `FR02` | WHEN a signed-in user records an entry THE SYSTEM SHALL store it in that session's space and no other | `integration` | record in space A; assert the entry exists in A and space B is unchanged | record in one login, sign in as the other, confirm absence | two logins, one entry | correctness under concurrent writes |
| `FR03` | WHEN a signed-in user views the log THE SYSTEM SHALL return only that space's entries, totals, and export data | `integration` | seed both spaces; assert each read returns only its own rows | eyeball both logins side by side | two logins, distinct entries | that no unexercised read path leaks |
| `FR04` | WHEN the user signs out THE SYSTEM SHALL end the session and return to sign-in | `integration` | after sign-out, a protected request is refused and the sign-in screen renders | sign out, press Back, confirm no data | one login with entries | that the browser retains no cached view |
| `FR05` | Recording, consolidation, daily rollover, and `.xlsx` export behave exactly as `PRD-001` defines | `integration` | the `PRD-001` suite passes against server-backed storage | record a day and export it | a full dummy day | that behaviour matches under network failure |
| `FR06` | WHEN a session ends, the browser is reset, or the server restarts THE SYSTEM SHALL still return the space's data | `integration` | write, restart the server process, read back | sign out, clear the browser, sign in again | one login with entries | durability against data-store loss or corruption |
| `UX01` | Signing in happens once per session, never per entry | `integration` | record ten entries in one session; assert exactly one authentication | record several entries and confirm no re-prompt | one login | that session length suits a working day |
| `UX02` | THE SYSTEM SHALL display the signed-in identity at all times while signed in | `integration` | the identity element is present and correct on every screen state | glance at the screen mid-entry | two logins | that a user notices it |
| `UX03` | WHEN a request fails mid-entry THE SYSTEM SHALL show a plain message and preserve the typed entry | `integration` | simulate a failed write; assert an error is shown and the field values remain | disconnect the network and save | one login | recovery from every kind of failure |
| `SEC01` | No request can read, write, or infer another space's contents — including through logs, error messages, or response differences | `integration` | a cross-space attempt suite: substituting another space's id, enumerating ids, reusing another session's token, and requesting a non-existent id — each denied, and denial responses identical for "not yours" and "does not exist" | review server logs after a cross-space attempt for leaked identifiers or data | two logins with distinct data | **absence of leaks in paths the suite does not exercise.** This is a negative claim over an unbounded set of requests; the suite bounds the known cases only |
| `SEC02` | Authorization is decided server-side on every request | `integration` | a request crafted without the UI, carrying a valid session for space A and a space B id, is refused | — | two logins | that every future endpoint will be covered |
| `SEC03` | Credentials are never stored, transmitted, or logged in recoverable form | `static` + `integration` | stored credential is not the plaintext and is not reversible; grep request and server logs for the plaintext after sign-in | inspect the store after creating a login | one login with a known passcode | resistance to offline cracking |
| `SEC04` | Sessions expire, and sign-out invalidates them server-side | `integration` | a session token replayed after sign-out is refused; an expired token is refused | sign out, replay the request from a second tab | one login | that expiry length is appropriate |
| `SEC05` | No real design-partner identities, customer names, or supplier pricing enter the repository, fixtures, or logs | `static` | grep fixtures, seeds, and committed files for the redaction list | review fixtures before commit | — | that external copies are clean |
| `NFR01` | Recording an entry completes fast enough that the interaction stays comparable to `PRD-001` | `integration` | measure round-trip save time; regression bar set from the first measurement | record ten entries and judge whether it still feels immediate | one login | **that it beats paper.** `PRD-001-UX01`'s comparison was deliberately not measured, so no baseline exists |
| `NFR02` | The daily log renders within the `PRD-001-NFR03` bar, allowing for data arriving over the network | `integration` | render 200 server-loaded entries; assert against a bar set from measurement | — | 200 seeded entries | real browser paint on shop hardware |

### On Testing `SEC01`

`SEC01` is the only requirement here stated as a negative over an unbounded set, and
it is the one that matters most. A passing suite means *the attempts we thought of
were refused* — not that no path leaks.

Two things follow, both deliberate. The denial responses for "not yours" and "does
not exist" must be identical, or the difference itself becomes an enumeration
oracle. And the "does not prove" column says plainly that unexercised paths are
uncovered, so a green suite is never read as proof of isolation.

**Recommendation, to settle at Architecture Shaping:** enforce scoping in one place
that every data access passes through, so isolation is structural rather than
repeated per endpoint. That is an architecture decision and is not made here.

## Risk And Permission Model

### Sensitive Surfaces

Every surface v1 closed reopens here. This is why `risk_level` is `high`.

| Surface | Status in this PRD |
|---|---|
| Auth | **Introduced.** Username and passcode; no reset, no recovery (BQ-5) |
| User data | **Leaves the machine for the first time.** Inventory data moves to a server |
| Secrets | **Introduced.** Credential hashes, session secrets, and a data-store connection |
| External services | **Introduced.** The app now makes network calls (`SEC03` of v1 reopened) |
| Destructive actions | Server-side data loss, redeployment, and **permanent lockout on a lost passcode** |
| Payments | None. Not in scope |
| Uploads | None. The export remains download-only |

### Human Approval Gates

- **Approval required before:** approving this PRD; choosing a framework, data store,
  or host; adding any dependency; creating `backend/`; any deployment; activating any
  bead.
- **Stop if:** a requirement is written without a problem behind it · isolation is
  enforced anywhere other than server-side · a recovery or admin path starts to
  appear, which BQ-5 ruled out · real partner data would be used in a fixture or a
  deployed environment.
- **Escalate when:** a cross-space leak is found at any point, including in
  development. That is not an ordinary bug — it is the failure this PRD exists to
  prevent.

### Tool And Environment Boundaries

- **Allowed tools:** local development only until a deployment decision is made and
  approved.
- **Network needs:** the app makes calls to its own backend. No third-party service
  is approved.
- **Dependency changes:** every one is an approval gate. v1 currently carries three
  (Vite, Vitest, `write-excel-file`) plus jsdom.
- **Dashboard/manual steps:** none approved. Hosting, DNS, and certificates are
  deliberately out of scope until backend beads are built.

### Product Risks

| Risk | Why it matters | Early signal |
|---|---|---|
| A silent cross-space leak | The failure this PRD exists to prevent, and the one least likely to be noticed | any response differing between "not yours" and "does not exist" |
| Network latency costs the speed bar | `PRD-001`'s premise is beating paper, and there is no baseline to compare against | entry feels hesitant; users pause between items |
| Permanent lockout | No reset and no admin, by decision | a business asks for help getting back in |
| Scope creep toward an account system | Roles, resets, and admin are each individually reasonable and collectively a different product | any requirement mentioning a user rather than a login |
| Deploying before it is ready | Hosting makes a leak reachable by strangers rather than by a test | deployment discussed before backend beads exist |

## Architecture / Project Context Impact

- **Project context impact:** `material`. This activates `backend/`, changes the
  storage boundary, and introduces a network boundary where `PRD-001` has none.
- `PROJECT-CONTEXT.md` loaded: `yes`
- **Architecture Shaping: needed, not yet run.** Its load condition is an approved
  PRD, so it runs after approval and before decomposition. It triggers on auth, data
  models, APIs, external services, dependencies, and deployment — all six.
- Architecture Brief evidence: none yet, correctly.
- **Owner-file updates expected after Architecture Shaping:** `ARCHITECTURE.md`
  (backend shape, how `frontend/` and `backend/` connect), `API.md` (currently records
  that no server boundary exists — that becomes false), `DATA-MODELS.md` (space,
  login, session; how `DailyLog` is scoped), `SECURITY.md` (auth, secrets,
  authorization model), `PROJECT-CONTEXT.md` (stack, integration boundaries,
  deployment target), `DECISIONS.md`.
- **Questions Architecture Shaping must answer**, listed so they are not mistaken for
  PRD-level gaps: backend framework and language · where isolation is enforced ·
  data store · session mechanism · how `frontend/` talks to `backend/` in development
  and in production · what runs locally versus deployed.

## Module / Interface Candidates

Provisional. Boundaries follow Architecture Shaping; these are the shapes the
requirements imply, recorded so the PRD is reviewable rather than to fix a design.

| Candidate | Responsibility | Contract |
|---|---|---|
| `Login` | Credentials and the space they map to | Verifying credentials yields exactly one space id, or nothing |
| `Session` | The signed-in period | Issued on sign-in; invalid after sign-out or expiry; carries a space id that the client cannot influence |
| `SpaceScopedStore` | Every read and write of daily-log data | **Cannot be called without a space id.** Isolation should be structural, not repeated per endpoint |
| `AuthBoundary` | Server-side authorization on every request | Rejects before any handler runs |

The `SpaceScopedStore` shape is the one worth arguing about at Architecture Shaping:
if scoping can be forgotten at a call site, `SEC01` depends on discipline rather than
structure.

## Agent Context Contract

- **Primary authority file:** this PRD, once approved.
- **Secondary reference files:** `DECISIONS.md`, `SECURITY.md`, `ARCHITECTURE.md`,
  `DATA-MODELS.md`, and `PRD-001` for the behaviour being preserved.
- **Files or folders likely in play:** `backend/` (does not exist yet), `frontend/`
  where it calls the backend, `frontend/package.json`. Exact paths follow
  Architecture Shaping.
- **Files or folders out of scope:** everything under `precode/` except the active
  bead and `tasks/todo.md`; `PRD-001`; the v1 modules whose behaviour is preserved
  rather than redesigned.
- **Required checks:** `record-check.sh -- validate-memory.sh`, plus
  `record-check.sh --cwd ../frontend -- npm test` and the backend equivalent once it
  exists.
- **Forbidden assumptions:** do not assume a framework, data store, or host · do not
  add roles, resets, admin, or multi-user — BQ-5 ruled them out · do not reopen
  `OQ-11` (single-device stands) · do not add offline support · do not build a
  migration path · do not deploy · do not use real partner data anywhere · do not
  treat a passing isolation suite as proof that no path leaks.

## Anti-Shallow Checks

- User problem named: **yes** — one shared deployment cannot serve a second business without isolation.
- Non-goals named: **yes** — five ruled out by BQ-5, four by the other answers, plus inherited closures.
- Before/after user moment clear: **yes**.
- Requirements observable: **yes** — 16 requirements, each with an acceptance oracle.
- Sensitive surfaces identified: **yes** — every surface v1 closed reopens, listed with status.
- Authority files identified: **yes**, including which change after Architecture Shaping.
- First bead can be one logical unit: **yes** — sign in, record, sign out, see an empty log as a second login.
- Generated text reviewed by user: **pending** — this is the read being asked for.

## Bead Proposals

**Provisional and pre-architecture.** Decomposition runs properly after Architecture
Shaping, when `files_in_play` can be bound to real paths. These exist so the PRD can
be judged on whether it decomposes sensibly, per approval criterion 14.

| Proposed bead | Requirements | Done when |
|---|---|---|
| `B###-backend-scaffold-and-auth-boundary` | `FR01`, `FR04`, `SEC02`, `SEC03`, `SEC04` | A login signs in, gets a session, and signs out; every protected request is refused without one |
| `B###-space-scoped-storage` | `FR02`, `FR03`, `FR06`, `SEC01` | Entries read and write through a store that cannot be called without a space id; the cross-space attempt suite is refused |
| `B###-connect-frontend-to-backend` | `FR05`, `UX01`, `UX02`, `UX03`, `NFR01` | The v1 recording experience works against the backend, with the identity shown and no silent loss on failure |
| `B###-measure-network-cost` | `NFR01`, `NFR02` | Round-trip save and 200-entry render measured; bars set from the measurement |

**Smallest first bead:** `backend-scaffold-and-auth-boundary`. It is the vertical
slice that makes everything after it testable, and it is where `SEC02` — server-side
enforcement — is established rather than retrofitted.

`SEC05` is cross-cutting: every bead checks fixtures for partner identities.

## Compilation Notes

On approval, add to `FEATURES.md`:

- Feature entry: **Isolated logins with server-side storage**, source `PRD-002`.
- Functional requirements `FR01`–`FR06`. UX, security, and non-functional
  requirements stay in the shard beside their oracles, matching how `PRD-001` was
  compiled.
- MVP slice note: the isolation loop — sign in, record, sign out, second login sees
  nothing of the first.
- `PRODUCT.md` also needs a Current Bets row and a Strategy line recording that Snap
  Camp serves multiple businesses from one deployment.

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
- Approval notes: **Ready for the builder's read.** All eight open questions are
  resolved, 16 requirements each carry an acceptance oracle, the risk model and
  approval gates are explicit, and provisional bead proposals show the work
  decomposes sensibly.

  Approval means the product destination is stable enough to compile and shape. It is
  **not** architecture permission and **not** permission to code. Architecture Shaping
  runs next and answers framework, data store, session mechanism, and how `frontend/`
  and `backend/` connect. Deployment comes after backend beads exist and are built.

  Two things to weigh before approving. **`SEC01` is a negative claim over an
  unbounded set** — a passing suite means the attempts we thought of were refused, not
  that nothing leaks; that limit is stated in its oracle rather than papered over.
  And **`NFR01` has no baseline**, because `PRD-001-UX01`'s paper comparison was
  deliberately not measured (2026-08-04); the first measurement will include the
  network and the local figure is unrecoverable.

  Shaped under bead `B009`. `PRD-001` and v1 are untouched.
