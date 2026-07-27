---
bead_id: B001
status: in_progress
execution_mode: builder
bead_kind: setup
primary_authority: PROJECT-CONTEXT.md
depends_on: []
parent_prd: none
requirement_ids: []
files_in_play:
  - tasks/todo.md
  - tasks/beads/B001-adopt-precode-control-layer.md
  - PROJECT-CONTEXT.md
  - CODEBASE-GUIDE.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check
verification_type:
  - static
delegation_mode: human_in_loop
test_strategy: static_only
review_context: same_session_ok
complexity: narrow
required_planning_depth: none
autonomy_level: supervised
---

# B001 — Adopt The PrecodeOS Control Layer Under `precode/`
<!-- ANCHOR: b001-adopt-precode-control-layer -->

> AUTHORITY: Setup bead for adopting the PrecodeOS control layer in the Snap Camp project under a `precode/` subfolder.
> NOT_AUTHORITY: Product feature scope, app implementation, route structure, schema definitions, or generated progress.
> LOAD_WHEN: Orienting to the Snap Camp PrecodeOS adoption before any product work begins.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-07-24

## State

`in_progress`

## Primary Authority

- `PROJECT-CONTEXT.md`

## Depends On

- none

## Parent PRD

- none — this is setup/orientation work, not a product feature slice.

## Requirement IDs

- none

## Objective

Adopt the PrecodeOS control layer under `precode/`, ready for the app siblings.

The Snap Camp repository currently contains version control and this control layer
only. This bead establishes the operating layer and records how it is arranged, so
that application code can later be added as siblings of `precode/` without the
topology being ambiguous.

## Done When

- The PrecodeOS control layer is present under `precode/` and validates in place.
- `PROJECT-CONTEXT.md` records the subfolder topology: PrecodeOS lives in
  `precode/`, application code will live in sibling folders at the repository root,
  and validation commands run from `precode/` rather than the repository root.
- `CODEBASE-GUIDE.md` reflects the same arrangement so future readers and agents
  resolve paths correctly.
- Active memory is exactly `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
- Both checks below run and are recorded.
- No application code, product feature, or PRD shard has been created by this bead.

## Files In Play

- `tasks/todo.md`
- `tasks/beads/B001-adopt-precode-control-layer.md`
- `PROJECT-CONTEXT.md`
- `CODEBASE-GUIDE.md`

All paths are relative to the installed Precode root, `precode/`. Application
directories and repository-root files are out of scope for this bead.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run both from `precode/`, not from the repository root.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — owner-file wording describes this specific project and needs
human confirmation before it is treated as durable state.

## Test Strategy

`static_only` — no runtime behavior exists yet; memory validation and file
inventory are the available proof.

## Review Context

`same_session_ok`

## Stop If

- Any application code is about to be written. This bead does not write app code.
- Any product feature is about to be added before a PRD shard exists.
- Owner-file adaptation would require inventing product facts that have not been
  decided for Snap Camp.
- The installed Precode root becomes ambiguous, or a check is run from the
  repository root instead of `precode/`.
- Active memory grows beyond `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
- Hooks, CI, or repository settings would need to change; those are separate work
  requiring explicit approval.

## Closeout Evidence

- Checks run and results: pending
- Evidence source: pending — recorded check output under `logs/` once checks are run
- Result: pending
- Manual verification status: pending
- Files changed: pending
- Next bead safe to activate: pending
- Review decision: pending
- Drift observed: pending
- Lesson to promote: pending
- Follow-up bead needed: pending
- Blocked escape status: not blocked
- Reference follow-through: pending

## Handback

Return to the builder with the recorded check results and the proposed
`PROJECT-CONTEXT.md` topology wording for approval. Do not activate a next bead;
that requires an explicit approved transition.
