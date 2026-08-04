---
bead_id: B010
status: in_progress
execution_mode: builder
bead_kind: planning
primary_authority: tasks/reference/ARCHITECTURE-SHAPING-PROTOCOL.md
depends_on: []
parent_prd: PRD-002
requirement_ids: []
files_in_play:
  - tasks/prds/PRD-002-backend.md
  - DECISIONS.md
  - tasks/beads/B010-architecture-shaping-backend.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check
verification_type:
  - static
delegation_mode: human_in_loop
test_strategy: not_applicable
review_context: same_session_ok
complexity: standard
required_planning_depth: PRD+architecture
autonomy_level: supervised
---
# B010 — Architecture Shaping For The Backend
<!-- ANCHOR: b010-architecture-shaping-backend -->

> AUTHORITY: Architecture Shaping for `PRD-002`: expose the implementation risks and boundary decisions before any backend work is decomposed.
> NOT_AUTHORITY: Approving implementation, creating `backend/`, writing code, deploying, or activating beads.
> LOAD_WHEN: Shaping the backend architecture after `PRD-002` approval and before decomposition.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B010`
- Status: `in_progress`
- Execution mode: `builder`

## Primary Authority

- `tasks/reference/ARCHITECTURE-SHAPING-PROTOCOL.md`

## Depends On

- none

`B009` produced and the builder approved `PRD-002`, which is this bead's trigger.
Not declared as a formal dependency because the transition checker requires a
declared dependency to be `done`, and the current bead only reaches `done` as part
of the transition that activates this one.

## Parent PRD

- `PRD-002` — **approved 2026-08-04**. That approval is the load condition for this
  protocol.

## Requirement IDs

- none. Architecture Shaping produces an evidence-only Architecture Brief, not
  requirements.

## Objective

Answer the six architecture questions `PRD-002` names, and record an Architecture
Brief that makes `files_in_play` boundable so decomposition can follow.

## Done When

- The six questions in `PRD-002`'s Architecture Impact section are answered:
  backend framework and language · where isolation is enforced · data store ·
  session mechanism · how `frontend/` and `backend/` connect in development and in
  production · what runs locally versus deployed.
- An Architecture Brief exists in `PRD-002`, in the format
  `ARCHITECTURE-SHAPING-PROTOCOL.md` defines, marked `evidence_only`.
- Every decision it records also appears in `DECISIONS.md`.
- Owner-file impacts are named, not made — `ARCHITECTURE.md`, `API.md`,
  `DATA-MODELS.md`, `SECURITY.md`, `PROJECT-CONTEXT.md` are updated in a later bead.
- The `SpaceScopedStore` question is settled explicitly: whether isolation is
  structural or depends on remembering to scope each call site.
- Both checks below are run and recorded.

## Explicitly Not In Scope

- Creating `backend/`, writing code, or adding a dependency.
- Deployment, hosting, DNS, or certificates. `PRD-002` places deployment after
  backend beads are built.
- Decomposition or bead proposals. Those follow this brief.
- Updating `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, or `SECURITY.md` — this
  bead names the impacts; a later bead makes the edits.

## Files In Play

- `tasks/prds/PRD-002-backend.md` — the Architecture Brief goes here
- `DECISIONS.md` — every architecture decision recorded
- `tasks/beads/B010-architecture-shaping-backend.md`
- `tasks/todo.md`

Declared deliberately: `DECISIONS.md` is in scope for this bead, unlike earlier ones
where recording decisions had to be logged as boundary crossing.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run from `precode/`.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — every one of the six questions is a decision the builder owns.

## Test Strategy

`not_applicable` — this bead produces evidence, not behaviour.

## Review Context

`same_session_ok`

## Stop If

- A decision would be recorded that the builder has not made.
- `backend/` is created, or any code or dependency is added.
- Deployment is being decided rather than deferred.
- Isolation would rest on remembering to scope each call site rather than on
  structure — that is the `SEC01` risk and it should be surfaced, not accepted
  quietly.
- Any `PRD-002` requirement would change. That is a PRD amendment, not architecture.
- Scope reaches decomposition.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:01:20.611939+00:00; log `logs/check-output/20260804T170120Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-08-04T17:01:21.035962+00:00; log `logs/check-output/20260804T170120Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Caron Ng (builder) approved all six architecture answers on 2026-08-04; Claude (agent) recorded them and verified the structural result. What was checked: the six questions named in `PRD-002`'s Architecture Impact section are each answered; an Architecture Brief in the `ARCHITECTURE-SHAPING-PROTOCOL.md` format exists in `PRD-002` marked `evidence_only`; all six decisions also appear in `DECISIONS.md`; owner-file impacts are named rather than made; and the `SpaceScopedStore` question is settled explicitly as structural isolation. Environment: local macOS checkout, run from `precode/`. Result: pass. Remaining uncertainty: package selection for SQLite bindings and password hashing is deferred to implementation time and unverified here; `SEC01` remains a negative claim that no suite can fully close; deployment is deliberately unanswered.
- Files changed: 7 changed path(s) at last evidence update
- Next bead: none named yet — decomposition is the next step and is out of this bead's scope
- Review decision: pending human acceptance
- Drift observed: none. Changed files were `tasks/prds/PRD-002-backend.md`, `DECISIONS.md`, this bead file and `tasks/todo.md` — all declared in `files_in_play`. `DECISIONS.md` was declared in scope for this bead deliberately, unlike earlier beads where recording decisions had to be logged as boundary crossing. No owner file was edited, no code written, no dependency added, `backend/` not created. Checked by hand.
- Lesson to promote: the architecture question worth arguing about was not the framework or the database — both are reversible in an afternoon — but where isolation lives. Structural isolation, where no unscoped data function exists to call, versus per-endpoint checks that depend on nobody forgetting, is the difference between `SEC01` being guaranteed and being remembered. Naming that one question as the one to push back on, and treating the other five as defaults, kept the shaping short without making it shallow.
- Follow-up bead needed: yes, two. Decomposition of `PRD-002` against the fixed stack; and a later bead to update `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md` and `PROJECT-CONTEXT.md`, whose impacts this brief names but does not make.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the six answers and their trade-offs, the Architecture
Brief, and a recommendation on `SpaceScopedStore`. Do not activate a next bead.

Carried forward from v1 and still open: real Tab-key navigation unexercised,
consolidation not re-checked in the browser since the case amendment, no real
midnight roll observed, and v1 never used for a real business day.
