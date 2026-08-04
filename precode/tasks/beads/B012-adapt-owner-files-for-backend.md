---
bead_id: B012
status: done
execution_mode: builder
bead_kind: setup
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids: []
files_in_play:
  - ARCHITECTURE.md
  - API.md
  - DATA-MODELS.md
  - SECURITY.md
  - PROJECT-CONTEXT.md
  - tasks/beads/B012-adapt-owner-files-for-backend.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check
verification_type:
  - static
delegation_mode: human_in_loop
test_strategy: static_only
review_context: same_session_ok
complexity: narrow
required_planning_depth: brief
autonomy_level: supervised
---
# B012 — Adapt The Technical Owner Files For The Backend
<!-- ANCHOR: b012-adapt-owner-files-for-backend -->

> AUTHORITY: Setup bead for updating the technical owner files to match the Architecture Brief, before backend implementation begins.
> NOT_AUTHORITY: Product scope, new requirements, application code, or architecture decisions not already made in `B010`.
> LOAD_WHEN: Bringing the owner files in line with the approved backend architecture.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B012`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md` — specifically its Architecture Brief.

## Depends On

- none

`B010` produced the brief and `B011` the decomposition. Neither is declared formally,
for the usual transition-checker reason.

## Parent PRD

- `PRD-002` — approved 2026-08-04, Architecture Shaping completed the same day.

## Requirement IDs

- none. This records decisions already made; it does not create requirements.

## Objective

Update `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md` and
`PROJECT-CONTEXT.md` so they describe the approved backend architecture rather than
a browser-only product.

`API.md` currently states there is no server boundary in v1 and that its emptiness is
deliberate. That becomes false the moment backend work starts, and an agent building
bead 1 will load it.

## Done When

- `ARCHITECTURE.md` records the backend shape, the scoped-store boundary, and how
  `frontend/` and `backend/` connect in each environment.
- `API.md` records route conventions and that authorization precedes every handler.
- `DATA-MODELS.md` records `Login`, `Space`, `Session`, and how `DailyLog` is scoped.
- `SECURITY.md` records the auth model, credential handling, session handling, secret
  management, and the isolation guarantee **with its limits**.
- `PROJECT-CONTEXT.md` records the v2 stack, integration boundaries, and the
  project-specific checks a backend bead must run.
- **Every file distinguishes what exists from what is decided but unbuilt.** No file
  may imply `backend/` exists.
- No file states a decision absent from `DECISIONS.md` or the Architecture Brief.
- Both checks below are run and recorded.

## Explicitly Not In Scope

- Creating `backend/`, writing code, or adding a dependency.
- Deployment.
- Changing anything about how v1 currently behaves.
- Creating or activating a bead.

## Files In Play

- `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md`, `PROJECT-CONTEXT.md`
- `tasks/beads/B012-adapt-owner-files-for-backend.md`
- `tasks/todo.md`

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run from `precode/`.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — these are authority files, and their wording becomes what a future
agent treats as true.

## Test Strategy

`static_only`

## Review Context

`same_session_ok`

## Stop If

- Any file would state a decision not already recorded. Recording is in scope;
  deciding is not.
- Any file would imply `backend/` exists or that v2 is built.
- `PRD-001` or the v1 behaviour description is changed.
- A gap appears that needs an architecture decision — stop and ask.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:10:11.340385+00:00; log `logs/check-output/20260804T171011Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-08-04T17:10:11.772213+00:00; log `logs/check-output/20260804T171011Z-python3-scripts-file-inventory.py-check.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:20:08.057625+00:00; log `logs/check-output/20260804T172007Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-08-04T17:20:08.474460+00:00; log `logs/check-output/20260804T172008Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-04, with the builder confirming Atlas, bcrypt and the three packages. What was checked: `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md` and `PROJECT-CONTEXT.md` all describe the approved backend architecture; v1 sections were retitled so built and decided content cannot blur; 13 explicit markers state what does not exist; `backend/` confirmed absent on disk; no SQLite reference survives outside recorded supersession context. Environment: local macOS checkout, run from `precode/`. Result: pass. Remaining uncertainty: every v2 section describes something unbuilt, so its accuracy is only as good as the decisions behind it; Atlas reachability has not been tested from this machine and nothing runs without it.
- Files changed: 11 changed path(s) at last evidence update
- Next bead: `tasks/beads/B013-backend-auth-boundary.md`
- Review decision: accepted by Caron Ng on 2026-08-04. Both checks pass and are recorded; all five owner files describe the approved backend architecture, with 13 explicit markers distinguishing what exists from what is decided. Accepted after the store was reversed to MongoDB Atlas and packages settled mid-bead, both recorded as declared drift.
- Drift observed: yes, and declared. The MongoDB reversal and the Atlas and bcrypt decisions required editing `DECISIONS.md` and `tasks/prds/PRD-002-backend.md`, neither of which is in this bead's `files_in_play`. The builder directed the store change mid-bead, and `PRD-PROTOCOL.md` prescribes recording decisions where they belong rather than deferring them. All five owner files were in scope. Checked by hand; `files-in-play-check.py` is blind in this topology.
- Lesson to promote: a recommendation can be right on its stated grounds and still be wrong once a fact arrives. SQLite was recommended to avoid operating a server before there was a user; the builder already had Atlas running, which removed the argument rather than outweighing it. The reversal is recorded that way — as the argument not surviving a fact — rather than as a preference change, so a later reader can tell which kind of reversal it was. Also worth keeping: hosted storage is a materially larger surface than local, and the difference is easy to skip past when both are called "MongoDB".
- Follow-up bead needed: yes — bead 1 `backend-auth-boundary`. Packages and Atlas are now settled, so the remaining precondition is approval to create `backend/`.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and the adapted wording, then
propose bead 1 with the package report.