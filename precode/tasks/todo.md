---
current_bead: tasks/beads/B005-consolidate-duplicate-skus.md
current_state: in_progress
build_lane: Daily Inventory Recorder
active_feature_window: Consolidation slice
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
Document version: v0.5.0
Last updated: 2026-07-31

---

## Current Bead

- `tasks/beads/B005-consolidate-duplicate-skus.md`
- State: `in_progress`
- Build lane: `Daily Inventory Recorder`
- Active feature window: `Consolidation slice`

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

## Primary Authority File

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Files In Play

- `frontend/src/`
- `frontend/tests/`
- `frontend/index.html`
- `tasks/beads/B005-consolidate-duplicate-skus.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

## Explicit Out-of-Scope

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
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B005-consolidate-duplicate-skus.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B004-persist-daily-log.md` to `tasks/beads/B005-consolidate-duplicate-skus.md` by `python3 scripts/bead-transition.py --approve` at 2026-07-31 19:33 UTC.

