# Snap Camp — Product Constitution
<!-- ANCHOR: product-constitution -->

> AUTHORITY: Builder-facing product constitution, product promise, users and jobs, strategy and non-goals, current product bets, success signals, and design or voice pointers for Snap Camp.
> NOT_AUTHORITY: Active memory, active task selection, feature approval, detailed feature requirements, route structure, schema field definitions, implementation plans, execution status, pricing decisions, or generated progress state.
> LOAD_WHEN: Starting product planning, shaping or approving a PRD shard, checking whether a new idea fits the product, reviewing product drift, or onboarding a builder to the product's current direction.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `PRODUCT.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-28

## Purpose

`PRODUCT.md` is the living product constitution for Snap Camp.

It helps a non-technical builder and an AI coding agent stay aligned on what the product is, who it serves, what matters now, and what should not drift.

This file is reference only. It is not active memory.

Active memory remains exactly:

- `AGENT.md`
- `DECISIONS.md`
- `tasks/todo.md`

Use this file to orient product planning. Do not use it to approve work, activate beads, or replace feature PRDs.

## How To Use This File

Load this file when:

- a rough idea needs product framing
- a PRD is being created, reviewed, approved, or amended
- an agent needs to check whether a suggestion fits the product direction
- strategy, users, success signals, design direction, or non-goals may have changed

Do not load this file when:

- the active bead is narrow and its primary authority is sufficient
- the question belongs in `PROJECT-CONTEXT.md`, `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md`, or another specific authority file
- the agent is only running checks, recording evidence, or closing an already-scoped bead

## Evidence Basis And Confidence

Everything below is promoted from one reviewed Conviction Packet (Product Ideation Workbook, read 2026-07-27) through Local Source Intake. It is **strong evidence, not validated product truth**.

- Evidence strength: **strong** — three independent businesses in different industries, same costly manual behavior, same root cause.
- Not yet **strongest**: no one has used a working version. Willingness to pay is inferred from existing spend, not from anyone paying for this product.
- The central untested assumption is that eliminating end-of-day consolidation is the dominant value. That came from the builder's own prototyping, not from observed user behavior.

Partner identities are redacted to roles throughout. See `DECISIONS.md`.

## Product Promise

- Product: **Daily Inventory Recorder** — a fast daily log that produces the end-of-day spreadsheet automatically.
- Who it is for: small specialty businesses, roughly under $1M revenue, whose inventory breaks the assumptions of standard inventory software.
- What it helps them do: record what moved today in seconds, and get an Excel-ready daily summary without retyping anything.
- Why this matters: these businesses pay roughly $800–2,400 a month, in wages or owner time, to retype handwritten inventory into a spreadsheet each evening.
- One-sentence promise: **record it once during the day, and the end-of-day spreadsheet is already done.**

## Users And Jobs

| User or role | Job to be done | Pain or constraint | Language they use |
|---|---|---|---|
| Anchor partner — needlepoint retail (primary) | Record 1,000+ near-identical, barcode-free items as they move | Pays ~$20/hr for 20–30 hrs/week of manual entry (≈$1,600–2,400/month) | "SKU", "count", "the sheet" |
| Witness A — lock manufacturing | Track 2,000+ SKUs, some of which transform (blank in, cut key out) | Comparable ongoing manual-entry cost | "blanks", "cut keys" |
| Witness B — coffee-paper logistics | Track ~500 SKUs plus ~100 combo items, much of it inventory she does not own | ≈$800–1,200/month; QuickBooks rejects non-owned inventory | "client's stock", "combos" |
| Excluded user | — | Businesses already served by barcode-driven systems; multi-user teams; accountants needing valuation | — |

The anchor partner drives v1. The two witnesses confirm the design generalizes. See the build-focus decision in `DECISIONS.md`.

## Strategy And Non-Goals

- North star: no one retypes inventory into a spreadsheet again.
- Delivery model: **one shared deployment serving multiple small businesses**, each signing in to its own isolated data space (decided 2026-08-03). Not one installed copy per business.
- Current product thesis: the valuable part is not tracking inventory — it is **automatically producing the daily summary** that today costs hours of manual consolidation.
- Explicit non-bets: becoming a full inventory management system; competing with QuickBooks, Square, or Sortly on breadth; barcode workflows.
- Things agents should not suggest by default: barcode scanning, inventory valuation, purchase orders, multi-location, analytics dashboards, POS or accounting integrations, multi-user, or building separate variants for each of the three partners.
- Product decisions to preserve: Daily Inventory Recorder is the canonical scope; one product, one anchor, two witnesses; SKU transformation and combo/bundle items are deferred to v2. Full decisions live in `DECISIONS.md`.

Product decisions that are hard decisions belong in `DECISIONS.md`. Link them here instead of duplicating the full decision.

## Current Bets

| Bet or theme | State | Source PRD or feature link | Notes |
|---|---|---|---|
| Isolated logins with server-side storage | `approved` | `tasks/prds/PRD-002-backend.md` | Approved 2026-08-04. Lets Snap Camp serve multiple businesses from one deployment. Architecture Shaping outstanding |
| Daily Inventory Recorder first slice | `approved` | `tasks/prds/PRD-001-daily-inventory-recorder.md` | **Built and accepted** — all 17 requirements delivered across beads `B002`–`B008`, 119 tests. **Not yet used by a real business**, so evidence stays at strong rather than strongest |
| SKU transformation | `deferred` | none | Named as the leading v2 wedge |
| Combo / bundle (kit) items | `deferred` | none | Parked with transformation for v2 |
| Self-printed QR or bin labels | `deferred` | none | Strong v2 candidate |

Allowed states:

- `exploring`
- `drafting_prd`
- `approved`
- `building`
- `shipped`
- `paused`
- `deferred`

Active work is controlled by `tasks/todo.md`, not this table.

## Goal Frame

Use this only when a product-level arc needs durable orientation before workflow selection. See `tasks/reference/GOAL-FRAME-PROTOCOL.md`.

Not in use for Snap Camp yet. The product arc is currently carried by `PRD-001` and this file; add a Goal Frame only if durable orientation is needed beyond them.

- Status: `draft`
- Last reaffirmed:
- Owner file: `PRODUCT.md`
- Horizon: `product`
- Workflow guidance:
- Goal:
- Why now:
- Success signal:
- Out of scope:
- Approval gates:
- Reaffirmation trigger:

## Success Signals

- North-star signal: the anchor partner records a full real business day in the tool and exports a summary they accept as correct.
- Supporting signals — behavioral, in the source's own ranking of costly actions:
  - returns the next business day unprompted
  - enters more items than asked
  - asks to move an assistant's workflow onto it
  - offers to pay
- Qualitative evidence: watching a user complete three tasks unaided — add an item, update a count, find one item — without the builder explaining anything.
- Good enough for now: one user, one complete day, one accepted export.
- Signals that would change direction: the user finishes the tasks but never returns; or says it is not faster than their sheet. Either means the value assumption is wrong, not that the UI needs polish.

Feature-level acceptance criteria belong in PRD shards and `ACCEPTANCE.md`.

## Design And Voice Links

- Design principles: speed over features; entry must beat writing a line on paper. Visible confirmation for every entry. The consolidated total must be visible, not hidden behind the export, because trust in the merge is what removes the manual re-check.
- Voice and tone: plain shop-floor language. Use the user's own words — SKU, count, log, summary. Avoid inventory-software jargon such as reconciliation, valuation, or stock adjustment.
- Accessibility or usability expectations: keyboard-first entry; usable one-handed at a counter; readable at roughly 200 entries in a day.
- Design files, screenshots, or references: a prototype exists and is **design/source evidence only** — its code is not reused. Held outside the repository.
- Components, tokens, or patterns: undetermined; no stack has been chosen.
- Things the product should not feel like: an accounting system, an ERP, or a setup wizard that demands a catalogue before the first entry.

Implementation conventions and design-system mechanics belong in `PROJECT-CONTEXT.md`, `CODEBASE-GUIDE.md`, or the target project's design authority file.

## Linked Owner Files

Use links instead of copying deep detail into this file.

- Feature inventory: `FEATURES.md`
- Product decisions: `DECISIONS.md`
- Technical project constitution: `PROJECT-CONTEXT.md`
- Feature PRDs: `tasks/prds/`
- Acceptance criteria: `ACCEPTANCE.md`
- Architecture: `ARCHITECTURE.md`
- API boundaries: `API.md`
- Data models: `DATA-MODELS.md`
- Security and privacy: `SECURITY.md`

## Living Update Check

At session close, PRD approval, or PRD amendment, ask:

- Did the product promise change?
- Did the target user or job change?
- Did a non-goal become a goal, or a goal become a non-goal?
- Did a current bet change state?
- Did success signals change?
- Did design or voice direction change?

If yes, update this file or link to the owner file where the durable fact belongs.

Do not update this file from generated reports, chat summaries, screenshots, or imported notes until the builder has reviewed the conclusion.
