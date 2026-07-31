---
current_bead: tasks/beads/B003-adapt-technical-owner-files.md
current_state: in_progress
build_lane: Daily Inventory Recorder
active_feature_window: Control-layer owner-file adaptation
primary_authority: tasks/prds/PRD-001-daily-inventory-recorder.md
---
# PrecodeOS — Active Work File
<!-- ANCHOR: active-work -->
> AUTHORITY: Current task, done-when target, primary authority file, files in play, checks to run, immediate next-up queue, open questions, and noticed execution facts.
> NOT_AUTHORITY: Resolved decisions, feature requirements, generated progress, or long-range roadmap commitments.
> LOAD_WHEN: Start and end of every session and whenever task scope materially changes.
> CLASS: active-memory
>
> This file is the active execution pointer inside the active memory set.
> AI coding agents read and update this file at the start and end of meaningful work.
> Active memory set: `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
> `AGENT.md` is the entrypoint. `DECISIONS.md` is the decision log. `PROGRESS.md` is generated output only.
> Detailed execution contracts live in `tasks/beads/*.md`.
> Rewrite, don't append.
> Primary Authority File must be exactly one file.
> Files In Play should stay narrow; if it exceeds 20 entries, split the task.
> Open Questions only contains blockers that can change execution, not general curiosities.
> Noticed is facts only, never directives or hidden backlog.

Creator: Caron Ng
Document version: v0.2.0
Last updated: 2026-07-31

---

## Current Bead

- `tasks/beads/B003-adapt-technical-owner-files.md`
- State: `in_progress`
- Build lane: `Daily Inventory Recorder`
- Active feature window: `Control-layer owner-file adaptation`

## Done When

- `ARCHITECTURE.md` records the Vite plus vanilla JS shape, the four modules, and the pure-function consolidation boundary.
- `API.md` records that there is no server boundary in v1.
- `DATA-MODELS.md` records `Entry` and `DailyLog`, including free-text SKUs with leading zeros.
- `SECURITY.md` records no auth, no accounts, no personal data, no network, and the partner-identity redaction rule.
- `PROJECT-CONTEXT.md` no longer carries an `Adaptation Status` warning.
- No file states a decision not already recorded in `DECISIONS.md` or the Architecture Brief.
- Both checks below are run and recorded.

## Primary Authority File

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Files In Play

- `ARCHITECTURE.md`
- `API.md`
- `DATA-MODELS.md`
- `SECURITY.md`
- `PROJECT-CONTEXT.md`
- `tasks/beads/B003-adapt-technical-owner-files.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

## Explicit Out-of-Scope

- Do not state a decision that is not already recorded. Recording is in scope; deciding is not.
- Do not write application code, and do not create `frontend/` or `backend/`.
- Do not rewrite `AGENT.md`, `OPERATING-CONSTRAINTS.md`, or `CANDIDATE-QUEUE.md`.
- Do not grow active memory beyond `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
- Stop and ask if a gap needs a product decision.

## Next Up

- Return to `tasks/beads/B002-record-entry-to-daily-log.md`, held at `ready`, through an approved transition once this bead is accepted.

## Open Questions

- None.

## Noticed

- `B002` was activated on 2026-07-30 and moved back to `ready` on 2026-07-31 before any work was done, so control-layer owner-file adaptation could happen under its own bead rather than as drift under an implementation bead.
- `ARCHITECTURE.md`, `API.md`, `DATA-MODELS.md`, and `SECURITY.md` still carry inherited PrecodeOS content. `DATA-MODELS.md` matters most: `B002` implements `Entry` and `DailyLog`.
- `AGENT.md`, `OPERATING-CONSTRAINTS.md`, and `CANDIDATE-QUEUE.md` remain PrecodeOS-authored by decision; they describe the OS contract, not Snap Camp.
