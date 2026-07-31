---
bead_id: B003
status: done
execution_mode: builder
bead_kind: setup
primary_authority: tasks/prds/PRD-001-daily-inventory-recorder.md
depends_on: []
parent_prd: PRD-001
requirement_ids: []
files_in_play:
  - ARCHITECTURE.md
  - API.md
  - DATA-MODELS.md
  - SECURITY.md
  - PROJECT-CONTEXT.md
  - tasks/beads/B003-adapt-technical-owner-files.md
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
# B003 — Adapt The Technical Owner Files For Snap Camp
<!-- ANCHOR: b003-adapt-technical-owner-files -->

> AUTHORITY: Setup bead for replacing inherited PrecodeOS content in the technical owner files with Snap Camp content, using the Architecture Brief as source.
> NOT_AUTHORITY: Product scope, new requirements, application code, or architecture decisions not already made in the Architecture Brief.
> LOAD_WHEN: Adapting the technical owner files before implementation begins.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-07-31

## State

- ID: `B003`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-001-daily-inventory-recorder.md` — specifically its Architecture
  Brief, which already names what each of these files should say.

## Depends On

- none

`B001` established the topology. This bead finishes the control-layer adaptation
that `B001` deliberately left out of its own scope.

## Parent PRD

- `PRD-001` — approved 2026-07-30.

## Requirement IDs

- none. This is setup work, not a requirement slice. It records decisions already
  made rather than creating new ones.

## Objective

Replace inherited PrecodeOS content in `ARCHITECTURE.md`, `API.md`,
`DATA-MODELS.md`, and `SECURITY.md` with Snap Camp content, and finish the
unadapted sections of `PROJECT-CONTEXT.md`.

These files currently describe PrecodeOS. `DATA-MODELS.md` is the sharpest problem:
`B002` implements `Entry` and `DailyLog`, and an agent loading that file today would
be told about PrecodeOS's data shapes instead.

## Done When

- `ARCHITECTURE.md` records the Vite plus vanilla JS shape, the four modules from
  the Architecture Brief, and the pure-function consolidation boundary.
- `API.md` records that there is no server boundary in v1, so its absence is a
  deliberate decision rather than an omission.
- `DATA-MODELS.md` records `Entry` (sku, quantity, timestamp) and `DailyLog`
  (local-date key to entries), including that SKUs are free text and may carry
  leading zeros.
- `SECURITY.md` records no auth, no accounts, no personal data, no network, and the
  partner-identity redaction rule.
- `PROJECT-CONTEXT.md` no longer carries an `Adaptation Status` warning, because the
  sections it warned about have been adapted.
- No file states a decision that is not already recorded in `DECISIONS.md` or the
  Architecture Brief.
- Both checks below are run and recorded.

## Files In Play

- `ARCHITECTURE.md`
- `API.md`
- `DATA-MODELS.md`
- `SECURITY.md`
- `PROJECT-CONTEXT.md`
- `tasks/beads/B003-adapt-technical-owner-files.md`
- `tasks/todo.md`

All paths are relative to the installed Precode root, `precode/`. `frontend/` and
`backend/` are out of scope. No file outside this list may be edited.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run from `precode/`.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — these are authority files. Their wording becomes what future
agents treat as true, so it needs human confirmation.

## Test Strategy

`static_only` — no runtime behaviour is created. Memory validation and file
inventory are the available proof.

## Review Context

`same_session_ok`

## Stop If

- Any file would state a decision not already recorded in `DECISIONS.md` or the
  Architecture Brief. Recording is in scope; deciding is not.
- Application code is about to be written, or `frontend/` or `backend/` created.
- `AGENT.md`, `OPERATING-CONSTRAINTS.md`, or `CANDIDATE-QUEUE.md` would be
  rewritten. Those describe the PrecodeOS operating contract and are deliberately
  out of scope.
- Active memory would grow beyond `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
- A gap appears that needs a product decision — stop and ask rather than inventing
  one.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-07-31T18:20:21.678010+00:00; log `logs/check-output/20260731T182021Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-07-31T18:20:29.701353+00:00; log `logs/check-output/20260731T182029Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-07-31. What was checked: all five adapted files carry Snap Camp headers; `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md` and `SECURITY.md` state only facts already recorded in `DECISIONS.md` or the `PRD-001` Architecture Brief; `PROJECT-CONTEXT.md` no longer carries an `Adaptation Status` warning and contains zero `B000` or `os_compiler` references; changed files match the declared `files_in_play`. Environment: local macOS checkout, run from `precode/`. Result: pass. Remaining uncertainty: the builder has not yet read the adapted wording, and `delegation_mode: human_in_loop` requires that confirmation before these files are treated as durable authority.
- Files changed: 9 changed path(s) at last evidence update
- Next bead: `tasks/beads/B002-record-entry-to-daily-log.md`
- Review decision: accepted by Caron Ng on 2026-07-31. Both declared checks pass and are recorded; all Done When items are verifiable in the files; the recording-not-deciding stop condition held, with every fact traceable to `DECISIONS.md` or the `PRD-001` Architecture Brief; files in play stayed within bounds, confirmed by hand.
- Drift observed: none within this bead, checked by hand since `files-in-play-check.py` is blind here. The two other modified files (`tasks/beads/B001-...md`, new `tasks/beads/B002-...md`) come from the 2026-07-31 reordering that preceded this bead, not from its work.
- Lesson to promote: PrecodeOS parsers read bead fields literally and `update-bead-closeout.py` collapses multi-line values to one line. Prose-prefixed values were misparsed as filenames by `completion-check.py` and as a dependency by `bead-transition.py`. Keep Closeout Evidence values to a single line and put explanation elsewhere. `completion-check.py` additionally requires the literal labels `who checked`, `what was checked`, `environment`, `result`, and `remaining uncertainty` inside Manual verification; none of these format rules appear in `BEAD-SCHEMA.md`.
- Follow-up bead needed: none from this bead's scope. Two `B001` follow-ups remain open and belong to the control layer: `files-in-play-check.py` blindness and the `bead-transition.py --approve` metadata drop. Both are now recorded in `SECURITY.md`.
- Blocked escape: not needed; the bead completed without blockers
- Reference follow-through: not applicable — no public PrecodeOS package surfaces, protocols, or maintainer history were changed; only project-owned owner files.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and the adapted wording of
each file for confirmation. Propose returning to `B002` as the next bead; do not
activate it without an approved transition.