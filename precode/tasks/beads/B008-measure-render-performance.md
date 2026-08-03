---
bead_id: B008
status: done
execution_mode: builder
bead_kind: review
primary_authority: tasks/prds/PRD-001-daily-inventory-recorder.md
depends_on: []
parent_prd: PRD-001
requirement_ids:
  - PRD-001-NFR03
files_in_play:
  - frontend/tests/
  - tasks/beads/B008-measure-render-performance.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh --cwd ../frontend -- npm test
verification_type:
  - integration
delegation_mode: human_in_loop
test_strategy: characterization
review_context: same_session_ok
complexity: narrow
required_planning_depth: brief
autonomy_level: supervised
---
# B008 — Measure The Render Bar At 200 Entries
<!-- ANCHOR: b008-measure-render-performance -->

> AUTHORITY: Review bead for `PRD-001-NFR03`: measure how the log actually renders at scale and either confirm or revise the provisional 500ms bar.
> NOT_AUTHORITY: Product scope, architecture changes, or optimisation work.
> LOAD_WHEN: Settling the provisional `NFR03` figure.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-03

## State

- ID: `B008`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Depends On

- none

`B005` and `B007` are predecessors in sequence; the log this measures is the
consolidated one they produce.

## Parent PRD

- `PRD-001` — approved 2026-07-30, amended twice on 2026-07-31.

## Requirement IDs

- `PRD-001-NFR03` — the log stays usable at roughly 200 entries in one day

## Objective

Measure how long the log actually takes to render at ~200 entries, then either
confirm the 500ms bar or revise it to a figure with evidence behind it.

The 500ms was invented before a framework was chosen and before anything was
measured. It is recorded as **provisional** in `ACCEPTANCE.md` and in the PRD, and
this bead exists so it does not harden into a requirement no one ever checked.

## Done When

- Render time at ~200 entries is measured and the actual figure recorded.
- Render time at ~1,000 entries is also measured, because the anchor partner has
  1,000+ SKUs and 200 was always a conservative stand-in.
- A regression test pins a bar based on the measurement, not on the invented figure.
- `NFR03` in the PRD and `ACCEPTANCE.md` is updated: either confirmed at 500ms with
  the measurement behind it, or revised with the reason.
- The provisional wording is removed once the figure has evidence.
- All checks below are run and recorded.

## Explicitly Not In Scope

- **Optimisation.** If the measurement is comfortably inside the bar, there is
  nothing to do. If it is not, that is a finding to report, not licence to start
  tuning — optimisation would be its own bead against a stated problem.

## Files In Play

- `frontend/tests/` — the measurement and its regression test
- `tasks/beads/B008-measure-render-performance.md`
- `tasks/todo.md`

Amending `NFR03` in `tasks/prds/PRD-001-daily-inventory-recorder.md` and
`ACCEPTANCE.md` is a PRD amendment and will be recorded as deliberate boundary
crossing in Closeout Evidence, as with earlier amendments.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

Run from `precode/`.

Test coverage expected:

- integration: render 200 entries and record the elapsed time
- integration: render 1,000 entries and record the elapsed time
- integration: a regression bar set from the measurement, with headroom so it does
  not fail on a slower machine

## Verification Type

- `integration`

## Delegation Mode

`human_in_loop` — the outcome is a decision about a requirement, not code.

## Test Strategy

`characterization` — the point is to discover the current behaviour, not to drive a
design.

## Review Context

`same_session_ok`

## Stop If

- The measurement is worse than the bar and optimisation starts. Report it instead.
- A measured figure is treated as a guarantee. It is one machine, under jsdom, on
  one day — it bounds nothing about a shop tablet.
- Scope reaches the browser-versus-jsdom difference. jsdom timings are indicative
  only, and that limit belongs in the record rather than in more work.

## Closeout Evidence

- Checks run: `npm test` -> pass (exit 0) at 2026-08-03T19:16:18.568929+00:00; log `logs/check-output/20260803T191615Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-03T19:16:18.969292+00:00; log `logs/check-output/20260803T191618Z-bash-scripts-validate-memory.sh.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-03. What was checked: warm render cost at 200 entries / 60 SKUs, at 1,000 entries / 300 SKUs, and the cost of adding one entry to a 200-entry day, each as a median of seven passes; then `NFR03` wording updated in the PRD and `ACCEPTANCE.md` and the provisional marking removed. Environment: Vitest under jsdom on macOS, node v25.2.1. Result: pass — 2.2ms, 11.3ms and 3.3ms respectively; the 500ms bar holds with roughly 227x headroom and cost scales linearly with entry count. Remaining uncertainty: jsdom performs no layout, paint or compositing, so these figures bound the application's own work and say nothing definite about a shop tablet; no measurement has been taken in a real browser or on target hardware; a first run reported 36ms of module and JIT warm-up as if it were render cost, so all recorded figures are warm medians.
- Files changed: 9 changed path(s) at last evidence update
- Next bead: `tasks/beads/B009-shape-backend-prd.md`
- Review decision: accepted by Caron Ng on 2026-08-03. 119 automated tests pass and are recorded. `NFR03` is measured, the 500ms bar is confirmed with roughly 227x headroom, regression bars are set from the measurement rather than the invented figure, and the provisional marking has been removed from both the PRD and `ACCEPTANCE.md`. Accepted with the jsdom limitation stated in the record: no measurement exists from a real browser or from target hardware.
- Drift observed: yes, anticipated and declared. Updating `NFR03` required editing `tasks/prds/PRD-001-daily-inventory-recorder.md` and `ACCEPTANCE.md`, which are outside this bead's `files_in_play`. The bead's Files In Play section named this in advance as a PRD amendment, so it was declared before it happened rather than discovered afterwards. All other changed files were in scope. Checked by hand.
- Lesson to promote: an unmeasured number in a requirement is a liability, and measuring it badly is worse. The first run reported 1,000 entries rendering faster than 200 — impossible for linear work, and a clear signal the figure was module and JIT warm-up rather than render cost. A measurement that does not scale sensibly with its input is measuring something else. Warm up, take a median, and check the shape of the result before writing a number into an authority file.
- Follow-up bead needed: no. Optimisation was explicitly out of scope and is not needed — the bar holds with two orders of magnitude of headroom. Carried forward: the `UX01` timing comparison, real Tab-key navigation, browser re-check of consolidation since the case amendment, and observing a real midnight roll.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the measured figures and a recommendation to confirm or
revise `NFR03`. State plainly that jsdom timings are indicative, not a promise about
real hardware.