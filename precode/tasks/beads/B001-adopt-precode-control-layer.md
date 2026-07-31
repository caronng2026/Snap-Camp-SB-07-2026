---
bead_id: B001
status: done
execution_mode: builder
bead_kind: setup
primary_authority: PROJECT-CONTEXT.md
depends_on: []
parent_prd: null
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
required_planning_depth: null
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

- ID: `B001`
- Status: `done`
- Execution mode: `builder`

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

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-07-27T18:08:40.003562+00:00; log `logs/check-output/20260727T180839Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-07-27T18:08:49.254244+00:00; log `logs/check-output/20260727T180849Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: checked by Claude (agent) on 2026-07-27 in the local macOS
  checkout at `precode/`. Verified that `CODEBASE-GUIDE.md` and
  `PROJECT-CONTEXT.md` state the installed Precode root is `precode/`, that app
  code belongs in sibling folders at the repository root, and that validation runs
  from `precode/`. Result: pass. Remaining uncertainty: the wording has not been
  confirmed by the human builder, and `delegation_mode: human_in_loop` requires
  that confirmation before this is treated as durable state.
- Files changed: 6 changed path(s) at last evidence update
- Next bead: `tasks/beads/B002-record-entry-to-daily-log.md` — first implementation
  slice of `PRD-001`, proposed by the 2026-07-30 decomposition and created as
  `ready`. It depends on no other bead.
- Review decision: **accepted** by Caron Ng on 2026-07-30. All Done When items were
  verified complete on 2026-07-28; both checks are recorded as `pass`; the drift
  record was corrected rather than left as written. The `accepted-hold` condition
  that previously held this bead is cleared now that `B002` exists as a successor.
- Drift observed: **yes — corrected record.** An earlier version of this line said
  "none"; that was wrong. While this bead was active, work touched
  `PRODUCT.md`, `DECISIONS.md`, `tasks/prds/PRD-001-daily-inventory-recorder.md`
  (new), and the repository-root `.gitignore` — all outside the four declared
  `files_in_play`. That work was individually approved by the builder each time, so
  it was authorized, but it was product-definition work carried out under a setup
  bead rather than under its own bead. The scope boundary was real and was crossed.
- Drift detection gap: `scripts/files-in-play-check.py` did **not** catch the above.
  It reports `status: warning`, `changed_paths: []`, and
  `"git status unavailable: workspace root is not a git checkout"`, because it
  treats `precode/` as the workspace root while `.git` lives one level up. In this
  subfolder topology the automated drift check is blind, and empty output must not
  be read as "no drift". Recorded as a known limitation of the `precode/` topology.
- Lesson to promote: two lessons. (1) `BEAD-SCHEMA.md` lists required bead sections
  but not the ten Closeout Evidence markers, which live only in
  `scripts/validate-memory.sh`; a hand-authored bead can pass section checks and
  still fail on a missing marker. (2) `files-in-play-check.py` is blind when Precode
  is installed in a subfolder, so files-in-play discipline in this repository is
  manual until that is addressed. Both belong in `OPERATING-CONSTRAINTS.md` or a
  validator follow-up.
- Follow-up bead needed: yes, two. (a) `PROJECT-CONTEXT.md` sections other than
  Repository Topology and Project Shape still hold inherited PrecodeOS content and
  need adaptation. (b) The `files-in-play-check.py` blindness above needs either a
  documented manual compensating practice or a fix.
- Blocked escape: not needed; the bead completed without blockers
- Reference follow-through: not applicable — no public package or maintainer
  reference surfaces were changed by this bead.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Accepted by the builder on 2026-07-30. The recorded check results and the
`PROJECT-CONTEXT.md` topology wording were reviewed and approved.

Next bead: `tasks/beads/B002-record-entry-to-daily-log.md`. Activation still
requires an approved transition through `scripts/bead-transition.py --approve`.