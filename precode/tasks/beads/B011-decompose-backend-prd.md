---
bead_id: B011
status: done
execution_mode: builder
bead_kind: planning
primary_authority: tasks/reference/DECOMPOSITION-PROTOCOL.md
depends_on: []
parent_prd: PRD-002
requirement_ids: []
files_in_play:
  - tasks/prds/PRD-002-backend.md
  - tasks/beads/B011-decompose-backend-prd.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check
verification_type:
  - static
delegation_mode: human_in_loop
test_strategy: not_applicable
review_context: same_session_ok
complexity: narrow
required_planning_depth: brief
autonomy_level: supervised
---
# B011 — Decompose PRD-002 Into Candidate Beads
<!-- ANCHOR: b011-decompose-backend-prd -->

> AUTHORITY: Decomposition of `PRD-002` into candidate beads against the architecture fixed by `B010`.
> NOT_AUTHORITY: Activating beads, creating `backend/`, writing code, adding dependencies, or deploying.
> LOAD_WHEN: Turning the approved and shaped `PRD-002` into candidate beads.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B011`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/reference/DECOMPOSITION-PROTOCOL.md`

## Depends On

- none

`B010` fixed the architecture, which is what makes `files_in_play` boundable. Not
declared formally because the transition checker requires a dependency to be `done`,
and the current bead only reaches `done` during the transition that activates this
one.

## Parent PRD

- `PRD-002` — approved 2026-08-04, Architecture Shaping completed 2026-08-04.

## Requirement IDs

- none. Decomposition proposes candidate beads; it does not implement requirements.

## Objective

Replace `PRD-002`'s provisional pre-architecture bead proposals with real ones, each
passing the Bead Decomposition Test and bound to actual paths under `backend/` and
`frontend/`.

## Done When

- Every one of `PRD-002`'s 16 requirements maps to at least one candidate bead.
- Each candidate names one observable outcome, one primary authority, one main
  verification strategy, bounded files in play, dependencies, delegation mode, test
  strategy, review context, complexity, planning depth, autonomy level, and stop
  conditions.
- The smallest first bead is identified and justified.
- Proposals are written into `PRD-002`'s Bead Proposals section, replacing the
  provisional ones.
- No bead file is created and no bead is activated.
- Both checks below are run and recorded.

## Explicitly Not In Scope

- Creating any bead file, or activating one.
- Creating `backend/`, writing code, or adding a dependency.
- Deployment.
- Amending `PRD-002` requirements. Decomposition slices what is there.

## Files In Play

- `tasks/prds/PRD-002-backend.md`
- `tasks/beads/B011-decompose-backend-prd.md`
- `tasks/todo.md`

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run from `precode/`.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — the builder reviews the slicing before any bead is created.

## Test Strategy

`not_applicable`

## Review Context

`same_session_ok`

## Stop If

- A candidate would mix planning with implementation.
- A candidate's files in play cannot be bounded, which would mean the architecture
  did not settle enough.
- Isolation work is split such that `SEC01` is provable only after several beads —
  the scoped store must land whole.
- A candidate assumes a package that has not been selected and approved.
- Scope reaches bead creation or activation.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:05:21.341436+00:00; log `logs/check-output/20260804T170521Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-08-04T17:05:21.770603+00:00; log `logs/check-output/20260804T170521Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-04. What was checked: all 16 `PRD-002` requirements map to a candidate bead, verified against the coverage table; each candidate names one observable outcome, one primary authority, bounded files in play under real paths, dependencies, delegation mode, test strategy, review context, complexity, planning depth, autonomy level and stop conditions; the smallest first bead is identified and its alternative rejected with a reason; proposals replaced the provisional pre-architecture ones in `PRD-002`; no bead file was created and none activated. Environment: local macOS checkout, run from `precode/`. Result: pass. Remaining uncertainty: `files_in_play` for beads 1 and 2 name directories that do not exist yet, so their precision is only as good as the architecture decisions behind them; package selection remains unverified and is a precondition of bead 1.
- Files changed: 4 changed path(s) at last evidence update
- Next bead: `tasks/beads/B012-adapt-owner-files-for-backend.md`
- Review decision: accepted by Caron Ng on 2026-08-04. Both checks pass and are recorded; all 16 requirements map to a candidate bead, verified programmatically; each candidate passes the Bead Decomposition Test. Accepted with two items noted: `files_in_play` for beads 1 and 2 name directories that do not exist yet, and package selection remains unverified as a precondition of bead 1.
- Drift observed: none. Changed files were `tasks/prds/PRD-002-backend.md`, this bead file and `tasks/todo.md` — all declared in `files_in_play`. No bead created, no code, no `backend/` directory, no dependency. Checked by hand.
- Lesson to promote: the ordering constraint came from an architecture decision, not from convenience. The scoped store is the core requirement and the obvious candidate to build first, but the space id comes from the session by decision, so a store built first would have nothing to scope to. Decomposition order follows the data dependencies the architecture creates, and reading them off the brief is faster than discovering them mid-bead.
- Follow-up bead needed: yes — bead 1 `backend-auth-boundary`, once `backend/` creation and the three packages are approved. Also outstanding from `B010`: a bead to update `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md` and `PROJECT-CONTEXT.md`, whose impacts the Architecture Brief names but does not make.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the candidate beads, the requirement-coverage table, and
the smallest first bead. Do not create or activate any bead.