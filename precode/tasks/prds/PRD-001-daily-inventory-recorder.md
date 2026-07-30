---
prd_id: PRD-001
status: approved
owner: user
risk_level: low
feature_link: TBD
features_status: not compiled
related_prds: []
---

# PRD-001 — Daily Inventory Recorder
<!-- ANCHOR: prd-001-daily-inventory-recorder -->

> AUTHORITY: Product definition for the Daily Inventory Recorder first slice, including problem, user moment, requirements, acceptance oracles, risks, and bead proposals.
> NOT_AUTHORITY: Active memory, active task selection, stack choice, route structure, schema field definitions, implementation status, or approval to code.
> LOAD_WHEN: Shaping, reviewing, approving, or decomposing the Daily Inventory Recorder first slice.
> CLASS: reference

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-07-28

## State

- ID: `PRD-001`
- Status: `approved`
- Owner: `user`
- Risk level: `low`
- Last updated: `2026-07-30`

**Approved 2026-07-30 by Caron Ng.** Approval means the product destination is
stable enough to compile into `FEATURES.md` and to shape. It is **not** architecture
permission and **not** permission to code. Architecture Shaping is still outstanding
and must run before bead derivation. No bead may be activated without an approved
transition.

## Feature Link

- Feature: `TBD` — no `FEATURES.md` entry exists yet
- `FEATURES.md` status: `not compiled`
- Related PRDs: `none`

## Source Inputs

Raw inputs are evidence, not authority.

- Source type: `Reviewed Conviction Packet / Precode Ingestion Packet` (Product Ideation Workbook)
- Source reference: `SB_PRODUCT-IDEATION-WORKBOOK_ Conviction added.md`, 756 lines, read 2026-07-27, held outside the repository
- Candidate Queue ID: none — this PRD did not come from `CANDIDATE-QUEUE.md`
- Stable facts:
  - Target user is small specialty businesses under ~$1M revenue whose inventory breaks standard software assumptions.
  - Standard tools assume inventory is owned, barcoded, static, and atomic. All four assumptions fail for these users.
  - Users record inventory by hand during the day and consolidate it into a spreadsheet at day's end.
  - Three independent businesses in different industries all pay for the same manual workaround, in wages or owner time.
  - Quantified spend: anchor partner ≈$1,600–2,400/month; witness A comparable; witness B ≈$800–1,200/month.
  - Evidence strength is **strong** (n=3, independent, same costly behavior), held back from strongest only because no one has used a prototype.
  - Build for the anchor partner; the two witnesses confirm it generalizes. One product, one anchor, two witnesses — not three variants.
- Assumptions:
  - That eliminating end-of-day consolidation is the dominant value. Asserted after prototyping; **not yet user-tested**.
  - That one product serves all three partners without variants.
  - That witness B gets real value with combo items deferred.
  - That users will switch away from an entrenched paper or spreadsheet habit.
- Primary hypothesis / learning target: Can a Daily Inventory Recorder replace the manual end-of-day Excel consolidation well enough that these businesses use it instead of their current paper or spreadsheet workflow?
- Hypothesis review status: `untested`
- Learning outcome: none yet — no one has used a working version.
- Stale or untested signals: willingness to pay is inferred from existing spend, not from anyone paying for this product.
- Conflicts or stale inputs:
  - The source file contains **two different products**. The later "Conviction Packet — Flexible Inventory Tracker" section and its handoff prompt are the **superseded** pre-prototype direction. The earlier Product Brief, Visible Iteration, and Core Workflow Spine sections are the **current** Daily Inventory Recorder direction.
  - The superseded version names "tell near-identical items apart" as the core differentiator. The current version names automatic Excel summary generation.
  - Four sibling source files were not provided and are treated as out of scope: a standalone copy of the superseded packet, a backup, and two prototype-era workbook copies.
  - A prototype exists and is treated as **design/source evidence only**. Its code is not reused, not preserved, not implementation authority, and not PRD, bead, review, transition, or acceptance approval.
- Privacy or secrets redactions: the source names three real design partners with industries and labor spend. All identities are redacted here to roles — anchor partner (needlepoint retail), witness A (lock manufacturing), witness B (coffee-paper logistics). No real customer names or supplier pricing appear in this repository. No secrets or credentials were present in the source.
- Candidate requirements: record SKU; record quantity; display today's log; auto-consolidate duplicate SKUs; generate Excel-ready daily summary; start a fresh log the next business day.
- Candidate non-goals: see `Non-Goals`.
- Authority files likely affected: `PRODUCT.md`, `FEATURES.md`, `ACCEPTANCE.md`, `DECISIONS.md`, `CANDIDATE-QUEUE.md`, `SECURITY.md`, `PROJECT-CONTEXT.md`, `ARCHITECTURE.md`, `DATA-MODELS.md`.
- Discarded or stale inputs: the Flexible Inventory Tracker scope and its four must-have capabilities.

## Alignment / Grilling Summary

- Alignment method: `source review` of the reviewed Conviction Packet, plus Local Source Intake.
- Shared design concept: a fast daily log that records what moved today and produces the end-of-day spreadsheet automatically.
- Key decisions reached:
  - Daily Inventory Recorder is canonical; Flexible Inventory Tracker is superseded.
  - The prototype is design evidence only.
  - Build for one anchor partner, not three variants.
- Recommended answers accepted: narrow v1 to the six capabilities below.
- Recommended answers rejected or changed: none recorded.
- Remaining implementation-changing questions: stack, platform, persistence, and export format. See `Open Questions`.
- Stale or discarded assumptions: that v1 must differentiate near-identical items. That belongs to the superseded scope.

## Domain Language

| Term | Status | Plain-English meaning | Aliases | Avoid/confusing terms | UI/code/test examples | Source pointer |
|---|---|---|---|---|---|---|
| Entry | `introduced` | One record of an item and how many moved, added during the day | line, row | transaction, movement record | `Entry`, `addEntry()` | Core Workflow Spine |
| Daily Log | `introduced` | Everything recorded for one business day | today's log | inventory, stock list | `DailyLog`, "Today's Inventory Log" | Product Brief |
| Consolidation | `introduced` | Combining repeated entries for the same SKU into one total | roll-up | reconciliation, valuation | `consolidate()` | Product Brief |
| Daily Summary | `introduced` | The Excel-ready output for one day | Excel summary | report, analytics | "Generate Excel Summary" | Core Workflow Spine |
| SKU | `reused` | The user's own code or name for an item | item code | barcode, UPC | `sku` | Conviction Packet |

- Module/interface names that should match domain language: `DailyLog`, `Entry`, `consolidate`, `DailySummary`.
- Glossary-card candidate needed: `no` — revisit if terms spread beyond this PRD.
- Authority owner if promoted: `PRODUCT.md`.

## PRFAQ-Lite

- Press-release claim: record what moved today in seconds, and get the end-of-day spreadsheet without typing it twice.
- Customer problem: hours are spent every week retyping handwritten inventory notes into a spreadsheet.
- Customer FAQ: *Do I need barcodes?* No. *Do I need to set up a catalogue first?* No — type your own SKU. *Will it replace my accounting system?* No.
- Internal FAQ: the differentiator is the automatic end-of-day summary, not inventory management breadth.
- Appetite: one small bootcamp-scale slice, built for the anchor partner.
- Kill or pause criteria: the anchor partner completes a day's log but does not return the next day, or reports it is not faster than their sheet.

## Problem

Small specialty businesses record inventory by hand all day, then pay someone to retype it into a consolidated spreadsheet each evening. Three independent businesses each spend roughly $800–2,400 per month on that retyping, and no standard inventory tool fits their inventory.

## User Moment

- **Before:** it is the end of the day. The user has a paper list or a messy sheet with the same SKU written five separate times. They or an assistant now spend time merging duplicates and rebuilding a clean spreadsheet, knowing a typo means a wrong count.
- **After:** the user has been typing each item and quantity into the recorder as it happened. Duplicates were merged automatically as they went. They click once, get an Excel-ready daily summary, and go home.
- **Why now:** three reachable design partners are already paying for this exact manual step, and one is available as an anchor.

## Destination

- **Destination statement:** a user can record a full day of inventory movements and produce an Excel-ready daily summary without touching a spreadsheet.
- **Definition of done:** the anchor partner records one real business day end-to-end in the tool and exports a summary they accept as correct.
- **First useful vertical slice:** enter a SKU and quantity, and see it appear in today's log. See `Bead Proposals`.

## Product Constitution Fit

- `PRODUCT.md` loaded: `yes` — adapted for Snap Camp on 2026-07-28 from this PRD's stable facts.
- Product promise fit: **fits.** The promise is "record it once during the day, and the end-of-day spreadsheet is already done." `FR01`–`FR05` are that promise expressed as requirements.
- User and job fit: **fits.** The primary user is the anchor partner (needlepoint retail), whose job is recording near-identical, barcode-free items as they move. `FR01` accepts free-text SKUs with no catalogue or barcode setup.
- Strategy and non-goal fit: **fits.** The product thesis is that the value is automatically producing the daily summary, not tracking inventory broadly. `FR04` and `FR05` carry that; the 17 non-goals match the "explicit non-bets" and the "do not suggest by default" list.
- Current bet or success signal affected: the `Daily Inventory Recorder first slice` bet is at state `drafting_prd` and points at this PRD. The north-star signal — the anchor partner records a full real business day and accepts the export — is this PRD's Definition of Done.
- Design or voice affected: `UX01` and `UX03` implement the recorded design principles of speed over features and visible consolidated totals. `UX05` extends the "never overstate what is stored" principle to `localStorage`.
- Product constitution update needed: **no.** `PRODUCT.md` already reflects this PRD. Revisit if scope changes or the value assumption fails the "watch them use it" test.

## Users

- Primary user: the owner or assistant at the anchor partner (needlepoint retail), recording inventory during the working day.
- Secondary user: witness A (lock manufacturing) and witness B (coffee-paper logistics), who confirm the design generalizes.
- Excluded user: businesses whose inventory already fits standard barcode-driven systems; multi-user teams; accountants needing valuation.

## Goals

- Goal 1: let a user record an item and quantity fast enough to replace a paper or spreadsheet log.
- Goal 2: remove the manual end-of-day consolidation step entirely.
- Goal 3: produce an Excel-ready daily summary in one action.

## Non-Goals

- **Not doing:** product transformations; kits and combo/bundle items; custom orders and customization; variable selling prices for the same SKU; customer and order information; daily sales reconciliation; barcode scanning; inventory valuation; purchase orders and receiving; multi-location inventory; low-stock flags; QR or bin labels; multi-user; unique-canvas cataloguing.
- **Deferred:** SKU transformation and combo/bundle items are the leading v2 candidates. Self-printed QR or bin labels are a strong v2 candidate.
- **Explicitly out of scope:** QuickBooks integration; Shopify or POS integration; analytics and dashboards; reporting beyond the daily summary.

## Alternatives Considered

| Option | Why rejected or deferred | Decision owner |
|---|---|---|
| Do nothing | Three businesses are already paying monthly for the manual step; the cost is ongoing | user |
| Build the Flexible Inventory Tracker (superseded scope) | Prototyping showed the dominant value is the automatic daily summary, not disambiguating near-identical items | user |
| Adopt an off-the-shelf inventory tool | Standard tools assume owned, barcoded, static, atomic inventory; all four assumptions fail here | user |
| Build variants for all three partners | Named in the source as a focus trap; one anchor plus two witnesses is the guardrail | user |

## Requirements

Agent-facing translation of the builder-approved product story.

### Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-001-FR01` | The user can record an item SKU as free text | P0 | No catalogue or barcode setup required |
| `PRD-001-FR02` | The user can record a quantity for that SKU | P0 | Whole numbers for v1 |
| `PRD-001-FR03` | The user can see today's inventory log with all entries recorded so far | P0 | Visible confirmation each entry landed |
| `PRD-001-FR04` | Repeated entries for the same SKU are consolidated into a single total automatically | P0 | Automatic, not a user-triggered step |
| `PRD-001-FR05` | The user can generate an Excel-ready daily summary in one action | P0 | The completion moment |
| `PRD-001-FR06` | A new empty daily log is available on the next business day | P1 | Prior days remain retrievable |

### UX Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-001-UX01` | Recording one entry takes no more setup than writing a line on paper | P0 | The adoption bar |
| `PRD-001-UX02` | After saving, the entry is visibly confirmed in today's log without a page reload | P0 | Builds trust that it was recorded |
| `PRD-001-UX03` | The consolidated total for a SKU is visible, not hidden behind an export | P1 | Users must trust the merge |
| `PRD-001-UX04` | The generate-summary action is reachable in one step from the log | P0 | |
| `PRD-001-UX05` | The app shows which day's log is currently active and when it was last saved | P0 | `localStorage` can be cleared without warning; the user must never believe more is stored than actually is |

### Security And Privacy Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-001-SEC01` | No real customer names, supplier pricing, or partner identities are stored in the repository or in fixtures | P0 | Source rule; use dummy data |
| `PRD-001-SEC02` | No authentication, accounts, or personal data in v1 | P0 | Keeps sensitive surfaces at zero |
| `PRD-001-SEC03` | No external service calls, telemetry, or analytics in v1 | P0 | |

### Non-Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| `PRD-001-NFR01` | Recorded entries survive a page reload or app restart within the same business day | P0 | Losing a day's log would be worse than paper |
| `PRD-001-NFR02` | The exported summary opens cleanly in Excel without repair prompts | P0 | Export format is an open question |
| `PRD-001-NFR03` | The log stays usable at roughly 200 entries in one day | P1 | Anchor partner has 1,000+ SKUs |

## Acceptance Oracle Matrix

| Requirement ID | Expected behavior | Evidence lane | Automated check | Manual check | Fixture or data needed | Recorded source | What this does not prove |
|---|---|---|---|---|---|---|---|
| `PRD-001-FR01` | WHEN a user types a SKU and saves THE SYSTEM SHALL store it exactly as typed | `unit` | entry-creation test | type a SKU, confirm it appears unchanged | dummy SKU list | bead closeout | that the SKU scheme suits real inventory |
| `PRD-001-FR02` | WHEN a quantity is entered THE SYSTEM SHALL store it against that SKU | `unit` | entry-creation test | enter a quantity, confirm it shows | dummy quantities | bead closeout | that entry is fast enough |
| `PRD-001-FR03` | WHEN an entry is saved THE SYSTEM SHALL show it in today's log | `integration` | log-render test | save an entry, see it listed | 3–5 dummy entries | bead closeout | that the layout is readable at scale |
| `PRD-001-FR04` | WHEN the same SKU is entered more than once THE SYSTEM SHALL show one consolidated total | `unit` | consolidation test incl. duplicates | enter one SKU three times, confirm one row with summed total | duplicate-SKU fixture | bead closeout | that users trust the merge |
| `PRD-001-FR05` | WHEN the user generates a summary THE SYSTEM SHALL produce an Excel-readable file of the consolidated log | `manual` | export-shape test | open the export in Excel, confirm no repair prompt | one full dummy day | bead closeout | that the format matches the user's own sheet |
| `PRD-001-FR06` | WHEN a new business day begins THE SYSTEM SHALL present an empty log without destroying the prior day | `integration` | day-rollover test | roll the date, confirm empty log and prior day retrievable | two-day fixture | bead closeout | real multi-day habit |
| `PRD-001-NFR01` | WHEN the app is reloaded THE SYSTEM SHALL still show today's entries | `integration` | persistence test | reload, confirm entries remain | one dummy day | bead closeout | durability across devices |
| `PRD-001-SEC01` | Repository and fixtures contain no real partner identities or supplier pricing | `static` | grep for partner names in fixtures | review fixtures before commit | — | bead closeout | that external copies are clean |
| `PRD-001-UX01` | WHEN the app has focus THE SYSTEM SHALL accept a complete entry (SKU → quantity → save) using the keyboard alone, with no mouse required, returning focus to the SKU field after each save | `integration` | tab-order assertion; post-save focus returns to SKU field | time 10 consecutive entries against 10 handwritten lines | 10 dummy SKUs | bead closeout | that it feels faster in a real shop, under interruption, with hands full |
| `PRD-001-UX02` | WHEN an entry is saved THE SYSTEM SHALL show it in today's log without a page reload | `integration` | assert entry visible after save with no navigation event | save one entry and watch it appear | 1 dummy entry | bead closeout | that the confirmation is noticeable in peripheral vision |
| `PRD-001-UX03` | WHEN a SKU has multiple entries THE SYSTEM SHALL display the consolidated total in the log itself, not only in the export | `integration` | enter one SKU three times; assert a single visible row with the summed total | confirm the total is readable without exporting | duplicate-SKU fixture | bead closeout | that users trust the merge enough to stop re-checking by hand |
| `PRD-001-UX04` | WHEN viewing today's log THE SYSTEM SHALL expose the generate-summary action in one step | `integration` | assert the action is present and a single activation triggers the export | locate and trigger it without instruction | one full dummy day | bead closeout | discoverability for a first-time user |
| `PRD-001-UX05` | THE SYSTEM SHALL display which business day's log is active and when it last saved, updating the timestamp on every write | `integration` | assert the day label is correct and the timestamp advances after a write | add an entry and confirm the timestamp moves | two-day fixture | bead closeout | that the user notices the indicator before losing data |
| `PRD-001-SEC02` | THE SYSTEM SHALL contain no authentication, account, or personal-data collection | `static` | no auth dependency in the manifest; no personal-data fields in the data model | review the data model before closeout | — | bead closeout | that future features will not introduce them |
| `PRD-001-SEC03` | WHEN completing a full record-to-export cycle THE SYSTEM SHALL make no external network request | `integration` | assert zero outbound requests during the cycle | check the browser network panel end to end | one full dummy day | bead closeout | absence of requests in code paths the test does not exercise |
| `PRD-001-NFR02` | WHEN the summary is opened in Excel THE SYSTEM SHALL produce no repair prompt, with the SKU column typed as text | `manual` | assert `.xlsx` structural validity and SKU cells typed as text | open in real Excel; confirm `00734` reads as `00734` | leading-zero SKU fixture | bead closeout | behaviour across other Excel versions or LibreOffice |
| `PRD-001-NFR03` | WHEN today's log holds ~200 entries THE SYSTEM SHALL render the log in under 500ms and keep entry responsive. **Provisional bar — see note below.** | `integration` | render 200 entries and assert the 500ms budget | scroll and add an entry with 200 present | 200 dummy entries | bead closeout | behaviour at the anchor partner's full 1,000+ SKU catalogue |

**`NFR03` is a provisional bar, not a final requirement.** The 500ms figure was set before any framework was chosen and before real render behaviour was measured. It must be revisited during Architecture Shaping and may be revised up or down against the chosen framework. Do not treat it as a fixed requirement that has been validated; it is a starting number recorded so the requirement is testable rather than vague.

**None of the above is proof until run through `bash scripts/record-check.sh -- <command>` and recorded in bead Closeout Evidence.**

## Risk And Permission Model

### Sensitive Surfaces

- Auth: none in v1.
- Payments: none.
- User data: inventory counts only. No PII. Partner identities redacted.
- Uploads: none in v1. Export is download-only.
- External services: none.
- Secrets: none. No API keys in scope.
- Destructive actions: day rollover must not delete prior days; clearing a log needs confirmation.

### Human Approval Gates

- Approval required before: choosing the stack or platform; creating any application directory; adding any dependency; changing `.gitignore`, hooks, or CI; moving this PRD to `approved`; activating any bead.
- Stop if: a requirement needs real partner data; the work widens beyond the six functional requirements; the export format decision blocks progress.
- Escalate when: persistence, multi-device, or multi-user needs appear — all are out of v1 scope.

### Tool And Environment Boundaries

- Allowed tools: local filesystem, local dev server, Precode scripts run from `precode/`.
- Network needs: none for the product; package installation would need approval.
- Dependency changes: none approved. Any dependency needs explicit approval.
- Dashboard/manual steps: none.

### Product Risks

| Risk | Why it matters | Early signal |
|---|---|---|
| The value assumption is untested | "The daily summary is the real value" came from your own prototyping, not user behavior | anchor partner exports once, never returns |
| Entry speed does not beat paper | Speed is the adoption bar; paper is very fast | user reaches for their sheet out of habit |
| Consolidation is not trusted | If users re-check merges by hand, the manual step returns | user exports and then verifies in Excel anyway |
| Export format mismatch | "Excel-ready" is undefined; the wrong shape means re-formatting | user reshapes the file after export |
| Scope creep back to the superseded product | The superseded scope is still in the source file | requirements about disambiguating similar items reappear |
| Willingness to pay is inferred | Existing spend is not the same as paying you | no one asks about price or availability |

## Architecture / Project Context Impact

- Project context impact: `material`
- `PROJECT-CONTEXT.md` loaded: `yes` — Repository Topology and Project Shape are adapted; other sections still hold inherited PrecodeOS content.
- Architecture Shaping: `completed` 2026-07-30.
- Architecture Brief evidence: see the `Architecture Brief` section below.
- Architecture Shaping skip reason: not skipped.
- Architecture authority updates needed: `ARCHITECTURE.md` needs the app shape and where the app directory sits relative to `precode/`.
- Route/API authority updates needed: `API.md` only if a server boundary is introduced. A local-only v1 may need none.
- Schema authority updates needed: `DATA-MODELS.md` needs `Entry` and `DailyLog` shapes.
- Security authority updates needed: `SECURITY.md` needs the no-real-partner-data rule.
- Decision log updates needed: `DECISIONS.md` needs the Recorder-over-Tracker pivot, the prototype disposition, the anchor-partner guardrail, and the v2 deferral of transformation and combos.

## Architecture Brief

- Source PRD: `PRD-001`
- Requirement IDs: all 17
- Brief status: `evidence_only` — this brief does not approve coding, activate a bead, or become architecture authority by itself.
- Completed: 2026-07-30, three questions.

### Triggering Risk Surfaces

- Auth/access: none. No accounts, roles, or permissions (`SEC02`).
- User or private data: none. Inventory counts only; partner identities redacted (`SEC01`).
- Data model or migration: **triggered.** `Entry` and `DailyLog`, day keying, and a rollover that must not destroy prior days.
- API, webhook, or background job: none.
- External service or integration: none. Zero network requests (`SEC03`).
- Dependency, secret, or environment: **triggered.** One `.xlsx` writer; Vite and Vitest as dev tooling; Node and npm as prerequisites. No secrets, no environment variables.
- Multi-step workflow or state: **triggered.** record → consolidate → export → roll over.
- Multi-system coordination: none. Single browser app.

### Boundary Notes

- Data sources and source of truth: browser `localStorage` is the working store. The exported `.xlsx` is the **durable record** — the copy that leaves the browser. If the two disagree, the export is what the user keeps.
- Integration boundaries: none in v1.
- API/server boundaries: none. `backend/` stays unbuilt.
- Auth/access boundary: none.
- State flow: `DailyLog` keyed by local calendar date. A new key appears automatically at midnight; existing keys are never rewritten or removed by the app. Consolidation is a pure read-time transform over a day's entries, not a mutation.
- Manual setup or dashboard steps: none.
- Dependencies or environment needs: Node and npm for development. Runtime dependency is one `.xlsx` writer, selected against criteria and confirmed before use.

### Owner File Impacts

- `ARCHITECTURE.md`: **needs writing.** Currently inherited PrecodeOS content. Should record the Vite/vanilla shape, the four modules, and the pure-function consolidation boundary.
- `API.md`: **no change.** No server boundary in v1; record that explicitly so its absence is deliberate.
- `DATA-MODELS.md`: **needs writing.** `Entry` (sku, quantity, timestamp) and `DailyLog` (date key → entries).
- `SECURITY.md`: **needs writing.** No auth, no PII, no network, plus the partner-redaction rule.
- `PROJECT-CONTEXT.md`: **needs updating.** Stack fields still describe PrecodeOS; app directory is now `frontend/`.
- `CODEBASE-GUIDE.md`: **needs updating.** Framework-level naming conventions were deferred pending this decision.
- PRD amendment: none required. No answer contradicted an existing requirement.
- `DECISIONS.md`: **done.** Three technical decisions recorded 2026-07-30; `OQ-6` resolved.

### Approval Gates And Stop Conditions

- Approval required before: adding the `.xlsx` package once selected; creating `frontend/`; adding any dependency beyond Vite, Vitest, and the `.xlsx` writer; activating any bead.
- Stop if: a requirement needs a server, an account, or a network call · the `.xlsx` package fails any of the five criteria · deleting user data becomes necessary.
- Return to PRD if: multi-device, multi-user, or a database becomes a v1 need — that reopens `OQ-11` and the `backend/` decision.
- Propose an unblocker bead if: the `.xlsx` writer cannot produce text-typed cells, which would put `OQ-10` and `NFR02` at risk.

### Verification Evidence Expected

- Automated checks: Vitest unit tests for `consolidate()` and `Entry`; integration tests for log render, persistence across reload, day rollover, and zero network requests; a round-trip assertion that `00734` survives export as text.
- Manual verification: open the export in real Excel; time ten consecutive entries against ten handwritten lines.
- Sensitive-path proof: none — no sensitive paths in v1.
- Evidence not sufficient: a passing local test run is not acceptance until recorded through `scripts/record-check.sh` and entered in bead Closeout Evidence.

### Bead Implications

- Required planning depth: drops from `PRD+architecture` to `brief` for most beads now that the framework is fixed and `files_in_play` can finally be bounded to real paths under `frontend/`.
- Likely slice type: vertical slices through one screen.
- Run contract needed: no. No sensitive, external, or destructive actions in v1.
- Candidate first bead shape: scaffold `frontend/` with Vite and Vitest, then record an entry and see it in today's log. Scaffolding is folded in because a scaffold-only bead has no observable outcome.
- Unresolved blockers: the `.xlsx` package is not yet selected; `NFR03`'s 500ms bar is still unmeasured.

### Do Not Decide Yet

- Repo facts the coding agent must inspect first: current Node and npm versions; whether the chosen `.xlsx` package is present, licensed permissively, and maintained at the time of use.
- Implementation choices intentionally left to the agent: file and module names inside `frontend/src/`, CSS approach, test file layout, and the internal shape of the `localStorage` serialization — provided the `DailyLog` date-key model and the pure-function consolidation boundary hold.

### Provisional Items Carried Forward

- `NFR03` (200 entries under 500ms) remains **provisional and unmeasured**. Vanilla JS rendering roughly 200 rows would normally sit far inside that budget, but no measurement exists yet. Confirm against the built app during the first rendering bead and revise the number if reality disagrees.

## Module / Interface Candidates

| Candidate module or boundary | Public interface / caller expectation | Behavior contract | Test boundary | Owner file |
|---|---|---|---|---|
| `Entry` | create an entry from a SKU and quantity | stores SKU as typed; rejects empty SKU and non-numeric quantity | unit | `DATA-MODELS.md` |
| `DailyLog` | append an entry; list today's entries | groups by business day; never mutates a prior day | unit | `DATA-MODELS.md` |
| `consolidate()` | given entries, return one row per SKU with summed quantity | pure function; order-independent; total preserved | unit | `ARCHITECTURE.md` |
| `DailySummary` | render a consolidated log to an Excel-readable file | output opens in Excel without repair | manual + shape test | `ARCHITECTURE.md` |

These are candidates. The stack decision may change all of them.

## Agent Context Contract

- Primary authority file: `tasks/prds/PRD-001-daily-inventory-recorder.md`
- Secondary reference files: `PROJECT-CONTEXT.md`, `CODEBASE-GUIDE.md`, `DECISIONS.md`
- Files or folders likely in play: a future application directory that is a sibling of `precode/`. **It does not exist and must not be created without approval.**
- Files or folders out of scope: everything inside `precode/` except this PRD, the active bead, and `tasks/todo.md`; the root `.gitignore`; `.git/`; the external source workbook.
- Required checks: `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`, plus the app-level checks defined when the stack is chosen.
- Manual verification: state who checked, what was checked, environment, result, and remaining uncertainty.
- Forbidden assumptions: do not assume a stack, framework, database, or platform; do not assume the export format; do not reuse prototype code; do not reintroduce the superseded scope; do not use real partner names or supplier pricing.

## Anti-Shallow Checks

- User problem named: **yes** — with quantified spend across three businesses.
- Non-goals named: **yes** — 17 explicit exclusions.
- Before/after user moment clear: **yes**.
- Requirements observable: **yes** — 6 functional, 4 UX, 3 security, 3 non-functional, each with an acceptance row.
- Sensitive surfaces identified: **yes** — all low or none.
- Authority files identified: **yes**.
- First bead can be one logical unit: **yes** — see below.
- Generated text reviewed by user: **yes** — read by Caron Ng on 2026-07-28.

## Bead Proposals

Proposals only. **Do not activate any bead until the PRD is approved and the transition is approved.** `B001` is still `in_progress`.

| Proposed bead | Requirement IDs | Done when | Delegation mode | Test strategy | Review context | Primary authority | Verification |
|---|---|---|---|---|---|---|---|
| `B###-record-entry-to-daily-log` | `PRD-001-FR01`, `FR02`, `FR03` | A user can enter a SKU and quantity and see the entry appear in today's log | `human_in_loop` | `failing_first` | `fresh_context_recommended` | `PRD-001` | `unit` + `integration` |
| `B###-consolidate-duplicate-skus` | `PRD-001-FR04`, `UX03` | Repeated SKUs show as one row with a summed total | `human_in_loop` | `failing_first` | `same_session_ok` | `PRD-001` | `unit` |
| `B###-generate-daily-summary` | `PRD-001-FR05`, `UX04`, `NFR02` | One action produces a file that opens in Excel without repair | `human_in_loop` | `characterization` | `fresh_context_recommended` | `PRD-001` | `manual` |
| `B###-daily-rollover-and-persistence` | `PRD-001-FR06`, `NFR01` | Entries survive reload; a new day starts empty without destroying prior days | `human_in_loop` | `failing_first` | `same_session_ok` | `PRD-001` | `integration` |

### Smallest First Bead

**`B###-record-entry-to-daily-log`** — enter a SKU and a quantity, and see it appear in today's log.

Why this one is smallest and still useful:

- It is a **vertical slice**, not a layer. The user sees a real result, so it produces observable feedback rather than scaffolding.
- It carries **one observable outcome**, one authority file, one verification strategy, and bounded files in play — the Decomposition Review criteria.
- It **excludes** consolidation, export, and rollover, each of which is its own bead.
- If it fails the speed bar, that is learned before any consolidation or export work is built on top.

It cannot be created yet. Three things must happen first: this PRD moves to `approved`; a stack is chosen so "files in play" is real; and `B001` reaches a transition decision, because only one bead may be `in_progress`.

## Compilation Notes

- Feature entry: add "Daily Inventory Recorder" to `FEATURES.md` once this PRD is `approved`.
- Functional requirements to add or amend: `PRD-001-FR01` through `FR06`.
- MVP slice notes: the four bead proposals map to the Core Workflow Spine — record, consolidate, complete, return.
- Acceptance updates needed: promote the Acceptance Oracle Matrix rows and the behavioral success signals into `ACCEPTANCE.md`.

## Open Questions

| Question | Affects | Blocking? |
|---|---|---|
| ~~What stack and platform — web, desktop, or mobile?~~ | — | **Resolved 2026-07-28** (OQ-2): browser-based web app, mobile-responsive |
| ~~What does "Excel-ready" mean — `.xlsx`, `.csv`, or clipboard?~~ | — | **Resolved 2026-07-28** (OQ-3, revised by OQ-10): `.xlsx` for v1 |
| ~~Where does the app directory live and what is it called?~~ | — | **Resolved 2026-07-28** (OQ-4): `frontend/` and `backend/`, siblings to `precode/` |
| ~~How is data persisted — browser storage, local file, or database?~~ | — | **Resolved 2026-07-28** (OQ-5): browser `localStorage`, `.xlsx` export as the durable record |
| ~~Should `PRODUCT.md` be adapted before this PRD is approved?~~ | — | **Resolved 2026-07-28**: `PRODUCT.md` adapted; see Product Constitution Fit |
| ~~What format are the anchor partner's real SKUs?~~ | — | **Resolved 2026-07-28** (OQ-10): numeric with leading zeros. `.csv` ruled out; export uses `.xlsx`. Adds a dependency-approval gate |
| ~~Does the user ever record on more than one device in a day?~~ | — | **Resolved 2026-07-28** (OQ-11): single-device only for v1. `localStorage` sufficient; `backend/` stays out of this PRD |
| Does a "business day" roll at midnight local time, or is it user-controlled? | `FR06` | no |
| Should quantities allow decimals or negatives (returns, corrections)? | `FR02` | no |
| Can an entry be edited or deleted after saving? | `FR03`; destructive-action gate | no |

## Approval

- Approved by: Caron Ng
- Approved on: 2026-07-30
- Approval notes: Approved after a full read by the builder. All 14 approval
  criteria in `tasks/reference/PRD-PROTOCOL.md` section 7 were checked and pass.
  All 17 requirements carry an acceptance oracle. No blocking open questions
  remain: OQ-2, OQ-3, OQ-4, OQ-5, OQ-10, and OQ-11 are resolved and recorded in
  `DECISIONS.md`. Three non-blocking detail questions remain open (business-day
  rollover timing, decimal or negative quantities, entry edit or delete) and may be
  settled during Architecture Shaping or bead work.

  **Scope of this approval.** Per `PRD-PROTOCOL.md:146`, approval means the product
  destination is stable enough to compile and shape. It does not approve
  architecture, dependencies, or implementation.

  **Still required before any bead is derived or activated:**
  - Compile the feature into `FEATURES.md` (`PRD-PROTOCOL.md` section 8).
  - Run Architecture Shaping (`PRD-PROTOCOL.md` section 9). Recorded as `needed`;
    the PRD touches data models and a multi-step workflow, and `files_in_play`
    cannot be bounded for any bead until a framework is chosen.
  - Re-run decomposition against the chosen framework.
  - Approve the `.xlsx` spreadsheet-writing dependency before the export bead.
  - Revisit the provisional 500ms `NFR03` bar against real render behaviour.
  - Transition `B001`, which is `in_progress` with complete closeout evidence.
    Only one bead may be `in_progress`, so the successor must be activated in the
    same transition.
