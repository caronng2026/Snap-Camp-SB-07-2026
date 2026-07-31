---
bead_id: B005
status: in_progress
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-001-daily-inventory-recorder.md
depends_on: []
parent_prd: PRD-001
requirement_ids:
  - PRD-001-FR04
  - PRD-001-UX03
files_in_play:
  - frontend/src/
  - frontend/tests/
  - frontend/index.html
  - tasks/beads/B005-consolidate-duplicate-skus.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh --cwd ../frontend -- npm test
verification_type:
  - unit
  - integration
delegation_mode: afk_candidate
test_strategy: failing_first
review_context: same_session_ok
complexity: narrow
required_planning_depth: brief
autonomy_level: bounded-afk
---
# B005 — Consolidate Duplicate SKUs
<!-- ANCHOR: b005-consolidate-duplicate-skus -->

> AUTHORITY: Third implementation slice of the Daily Inventory Recorder: combine repeated entries for the same SKU into one visible total.
> NOT_AUTHORITY: Product scope, export, day rollover, or the consolidation boundary already fixed in the Architecture Brief.
> LOAD_WHEN: Building or reviewing the consolidation slice.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-07-31

## State

- ID: `B005`
- Status: `in_progress`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Depends On

- none

`B002` and `B004` are predecessors in sequence. They are not declared as formal
dependencies because the transition checker requires a declared dependency to be
`done`, and the current bead only reaches `done` as part of the transition that
activates this one.

## Parent PRD

- `PRD-001` — approved 2026-07-30, amended 2026-07-31.

## Requirement IDs

- `PRD-001-FR04` — repeated entries for the same SKU are consolidated into a single total automatically
- `PRD-001-UX03` — the consolidated total for a SKU is visible, not hidden behind an export

## Objective

The same SKU entered several times during the day shows as one row with a summed
total, visible in the log itself.

This is the step that removes the manual end-of-day merge. It is why the product
exists.

## Done When

- `consolidate()` exists as a pure function over one day's entries.
- Entering the same SKU three times shows one row with the summed quantity.
- The consolidated total is visible in the log, not only in an export.
- Consolidation is derived at read time. Original entries remain stored unchanged
  and inspectable.
- Different SKUs remain separate rows.
- The result is order-independent and total-preserving.
- Consolidation survives a reload, because it is derived from stored entries.
- All checks below are run and recorded.
- Export and day rollover are **not** implemented.

## Files In Play

- `frontend/src/` — consolidation module and log view
- `frontend/tests/`
- `frontend/index.html` — only if the log view needs markup changes
- `tasks/beads/B005-consolidate-duplicate-skus.md`
- `tasks/todo.md`

Paths under `precode/` are relative to the installed Precode root. `backend/` is out
of scope and must not be created.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

Run from `precode/`.

Test coverage expected:

- unit: three entries of one SKU consolidate to one row with the summed total
- unit: order-independence — the same entries in any order give the same result
- unit: total preservation — summed quantities equal the sum of the inputs
- unit: different SKUs stay separate
- unit: an empty day consolidates to an empty result
- unit: `00734` and `734` consolidate together, because both normalise to `734` on entry
- unit: the original entries array is not mutated
- integration: the consolidated total is visible in the rendered log
- integration: consolidation still correct after a reload

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`afk_candidate` — a pure function with a clean test boundary, per the Architecture
Brief. The rendering change is small and bounded.

## Test Strategy

`failing_first` — write the failing consolidation tests before implementing.

## Review Context

`same_session_ok`

## Stop If

- Consolidation needs a rule not defined in `DATA-MODELS.md`. Case sensitivity,
  whitespace handling, and near-match grouping are explicitly **undefined** in v1 —
  stop and ask rather than inventing a rule.
- Scope drifts toward telling near-identical items apart. That belongs to the
  **superseded** Flexible Inventory Tracker scope and is not this product.
- Consolidation is stored rather than derived. The Architecture Brief fixes it as a
  read-time transform, and storing it would make the original entries unrecoverable.
- Any entry is modified or removed to achieve a total.
- Scope reaches export or day rollover.
- A SKU is compared as a number rather than a string.

## Closeout Evidence

- Checks run: `npm test` -> pass (exit 0) at 2026-07-31T19:36:21.718458+00:00; log `logs/check-output/20260731T193620Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-07-31T19:36:22.117035+00:00; log `logs/check-output/20260731T193622Z-bash-scripts-validate-memory.sh.log` | `npm test` -> pass (exit 0) at 2026-07-31T19:42:01.537398+00:00; log `logs/check-output/20260731T194159Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-07-31T19:42:01.935606+00:00; log `logs/check-output/20260731T194201Z-bash-scripts-validate-memory.sh.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Caron Ng (builder) found the case defect in the running app and approved the upper-case and trim decision on 2026-07-31; Claude (agent) covered the automated and visual layers. What was checked: builder entered `ac4-100w` and `AC4-100w` at http://localhost:5173 and observed them consolidating as separate rows, which is what triggered the amendment; agent ran 88 Vitest tests and captured a headless-Chrome screenshot confirming the consolidated table header renders as SKU / Total / Entries / Last recorded. Environment: Vite dev server on macOS Chrome, plus Vitest under jsdom with an injected in-memory store. Result: pass on the automated layer and on the defect that prompted the change. Remaining uncertainty: the builder has **not** confirmed re-testing consolidation in the browser after the case and whitespace amendment, so the post-fix behaviour is proven only by tests; `UX01` still has no timed comparison against handwriting; real Tab-key navigation has still not been exercised.
- Files changed: 15 changed path(s) at last evidence update
- Next bead: none named yet
- Review decision: accepted by Caron Ng on 2026-07-31. 88 automated tests pass and are recorded; `consolidate()` is a pure read-time transform with order-independence, total preservation, and non-mutation each pinned by a test, and the original entries are proven to survive unchanged in storage. Accepted **without** a post-amendment browser re-check: the builder chose to accept on the automated evidence. Three items remain open and carried forward, none in this bead's scope: browser re-verification of consolidation after the case and whitespace amendment, the `UX01` timing comparison, and real Tab-key navigation.
- Drift observed: yes, deliberate and approved. The case and whitespace amendment required editing `DECISIONS.md`, `DATA-MODELS.md`, and `tasks/prds/PRD-001-daily-inventory-recorder.md`, none of which are in this bead's `files_in_play`. `PRD-PROTOCOL.md` prescribes a PRD amendment for a mid-implementation requirement change and the builder directed it, so it was authorised, but it crossed the declared boundary. All other changed files were within scope. Checked by hand; `files-in-play-check.py` is blind in this topology.
- Lesson to promote: the stop condition worked. `DATA-MODELS.md` deliberately left case, whitespace, and near-match grouping undefined, and B005 required the work to stop and ask rather than invent a rule — which is exactly what happened when `ac4-100w` and `AC4-100w` split. Leaving a rule explicitly undefined, rather than silently defaulting, is what turned a would-be silent defect into a decision.
- Follow-up bead needed: no new follow-up from this bead. Carried forward: OQ-12 blocks the export bead; the `UX01` timing comparison is unmeasured; post-amendment browser re-check of consolidation was not performed; near-match grouping remains undefined by design.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces, protocols, or maintainer history were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and a manual check: enter the
same SKU three times, confirm one row with the correct total, then reload and
confirm it still holds.

Carried forward and still open, none in this bead's scope: `UX01` has no timed
comparison against handwriting, real Tab-key navigation has not been exercised, and
OQ-12 (`.xlsx` versus `.csv`) blocks the export bead.
