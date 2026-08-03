---
bead_id: B007
status: done
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-001-daily-inventory-recorder.md
depends_on: []
parent_prd: PRD-001
requirement_ids:
  - PRD-001-FR06
files_in_play:
  - frontend/src/
  - frontend/tests/
  - tasks/beads/B007-daily-rollover.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh --cwd ../frontend -- npm test
verification_type:
  - integration
delegation_mode: human_in_loop
test_strategy: failing_first
review_context: same_session_ok
complexity: narrow
required_planning_depth: brief
autonomy_level: supervised
---
# B007 — Roll The Daily Log Over At Midnight
<!-- ANCHOR: b007-daily-rollover -->

> AUTHORITY: Fifth implementation slice of the Daily Inventory Recorder: start a new empty log on the next business day without destroying the previous one.
> NOT_AUTHORITY: Product scope, a browsing UI for past days, retention policy, or the rollover timing already settled as OQ-6.
> LOAD_WHEN: Building or reviewing the day-rollover slice.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-03

## State

- ID: `B007`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Depends On

- none

`B004` and `B005` are predecessors in sequence. They are not declared as formal
dependencies because the transition checker requires a declared dependency to be
`done`, and the current bead only reaches `done` as part of the transition that
activates this one.

## Parent PRD

- `PRD-001` — approved 2026-07-30, amended twice on 2026-07-31.

## Requirement IDs

- `PRD-001-FR06` — a new empty daily log is available on the next business day

## Objective

When the local calendar date changes, the screen shows a new empty log for the new
day, and the previous day's entries are still stored and unmodified.

## Done When

- Opening the app on a later day shows an empty log for that day.
- The previous day's entries remain in storage, unchanged and complete.
- The app rolls over **while it is open**, without needing a reload — a shop may
  leave the tab open overnight.
- The day label updates to the new date when the roll happens.
- Recording after a roll writes to the new day's key, never the old one.
- Rollover deletes, prunes, or rewrites nothing.
- All checks below are run and recorded.

## Explicitly Not In Scope

- **A UI for browsing or exporting past days.** No requirement asks for one. Past
  days are a safety net; the exported `.xlsx` is the durable record. Adding a day
  picker would be new product scope and needs its own PRD amendment.
- Retention or pruning policy. `OQ-6` is retain-indefinitely.
- Any change to rollover timing. `OQ-6` settled it as local midnight.

## Files In Play

- `frontend/src/` — daily-log and screen wiring
- `frontend/tests/`
- `tasks/beads/B007-daily-rollover.md`
- `tasks/todo.md`

Paths under `precode/` are relative to the installed Precode root. `backend/` is out
of scope and must not be created.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

Run from `precode/`.

Test coverage expected:

- integration: entries recorded yesterday do not appear in today's log
- integration: yesterday's entries are still present in storage after today is used
- integration: the log empties and the day label updates when the date rolls while
  the app is open
- integration: an entry recorded after the roll is stored under the new day's key
- integration: the previous day's stored entries are byte-identical after a roll
- integration: the export reflects the current day only

## Verification Type

- `integration`

## Delegation Mode

`human_in_loop` — the failure mode is data loss across a day boundary, which is the
one thing worse than the paper process this product replaces.

## Test Strategy

`failing_first`

## Review Context

`same_session_ok`

## Stop If

- Rollover would delete, prune, overwrite, or reorder a prior day's entries.
- A browsing or day-picker UI starts to appear — that is out of scope above.
- Rollover timing would change from local midnight.
- The roll depends on a timer that could drift or fire twice; prefer deriving the
  current day from the clock at render time.
- Scope reaches the `NFR03` render measurement, which is its own bead.

## Closeout Evidence

- Checks run: `npm test` -> pass (exit 0) at 2026-08-03T19:06:33.421680+00:00; log `logs/check-output/20260803T190631Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-03T19:06:33.808301+00:00; log `logs/check-output/20260803T190633Z-bash-scripts-validate-memory.sh.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-03. What was checked: eight integration tests covering a new day starting empty, the day label updating, entries written under the new day's key, yesterday's stored entries byte-identical after a roll, and no day key ever deleted; five were already green before implementation and three were red, isolating the roll-while-open behaviour. Environment: Vitest under jsdom with fake timers and an injected in-memory store. Result: pass, 116 of 116 green. Remaining uncertainty: no human has observed a real midnight roll — a genuine midnight cannot be staged, so the clock is driven by fake timers and the evidence covers the logic rather than live behaviour; the 30-second watcher has not been observed against a real clock; carried forward, `UX01` has no timed comparison and Tab navigation is unexercised.
- Files changed: 5 changed path(s) at last evidence update
- Next bead: `tasks/beads/B008-measure-render-performance.md`
- Review decision: accepted by Caron Ng on 2026-08-03. Acceptance was given as a `push straight on` instruction to continue to the `NFR03` bead rather than as a separate considered review pass; the one-active-bead rule required closing this bead to start the next. 116 automated tests pass and are recorded. Accepted with no human observation of a real midnight roll.
- Drift observed: none. Changed files were `frontend/src/main.js`, `frontend/tests/rollover.test.js` (new), this bead file and `tasks/todo.md` — all within the declared `files_in_play`. No day-picker UI was added, per the explicit out-of-scope section. Checked by hand.
- Lesson to promote: deriving state from the clock at render time, rather than caching it at mount, made the timer a convenience instead of a correctness dependency. A missed or late tick shows a stale label; it can never write to the wrong day. The bead's stop condition asked for exactly this, which is a case of a constraint written before implementation shaping the design rather than judging it afterwards.
- Follow-up bead needed: no new follow-up. Carried forward: the `UX01` timing comparison, real Tab-key navigation, browser re-check of consolidation since the case amendment, and observing a real midnight roll if that ever becomes practical.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results. Manual verification of a real
midnight roll is impractical to stage; the tests drive the clock instead, and that
limitation should be stated rather than glossed.

Carried forward and still open, none in this bead's scope: `UX01` has no timed
comparison against handwriting, real Tab-key navigation has not been exercised, and
consolidation has not been re-checked in the browser since the case amendment.