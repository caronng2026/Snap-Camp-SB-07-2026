---
current_bead: tasks/beads/B001-adopt-precode-control-layer.md
current_state: in_progress
build_lane: Snap Camp PrecodeOS adoption
active_feature_window: Control-layer setup and orientation
primary_authority: PROJECT-CONTEXT.md
---

# Snap Camp — Active Work File
<!-- ANCHOR: active-work -->

> AUTHORITY: Current task, done-when target, primary authority file, files in play, checks to run, immediate next-up queue, open questions, and noticed execution facts.
> NOT_AUTHORITY: Resolved decisions, feature requirements, generated progress, or long-range roadmap commitments.
> LOAD_WHEN: Start and end of every session and whenever task scope materially changes.
> CLASS: active-memory

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-07-24

## Current Bead

- `tasks/beads/B001-adopt-precode-control-layer.md`
- State: `in_progress`
- Build lane: Snap Camp PrecodeOS adoption
- Active feature window: Control-layer setup and orientation

## Done When

- The PrecodeOS control layer is adopted under `precode/`, ready for the app siblings.
- `PROJECT-CONTEXT.md` records the subfolder topology and that checks run from `precode/`.
- `CODEBASE-GUIDE.md` reflects the same arrangement.
- Active memory remains exactly `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`.
- Both checks below are run and recorded.

## Primary Authority File

- `PROJECT-CONTEXT.md`

## Files In Play

- `tasks/todo.md`
- `tasks/beads/B001-adopt-precode-control-layer.md`
- `PROJECT-CONTEXT.md`
- `CODEBASE-GUIDE.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

## Explicit Out-of-Scope

- Do not write application code during this bead.
- Do not add product features before a PRD shard exists.
- Do not adapt owner files beyond recording the `precode/` topology.
- Do not install Git hooks, change CI, or alter repository settings.
- Do not create `frontend/`, `backend/`, or any other application directory yet.

## Next Up

- Adapt `PROJECT-CONTEXT.md` and `CODEBASE-GUIDE.md` to describe Snap Camp and the
  `precode/` topology, then stop for human review.
- Propose the first product PRD shard without activating it. A next bead becomes
  active only through an explicitly approved transition.

## Open Questions

- What is Snap Camp's product? No product definition, stack, or app directory has
  been decided yet, so `PRODUCT.md` and most owner files still hold PrecodeOS's
  packaged placeholder content.
- Should the agent shim files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) also exist at
  the repository root? Inside `precode/` they are only discovered when work happens
  in that folder.

## Noticed

- PrecodeOS is installed at `precode/`, not at the repository root. The installed
  Precode root is `precode/`, and all checks must run from there.
- Application code is intended to live in sibling folders at the repository root,
  alongside `precode/`. No such folders exist yet.
- The repository root currently holds only `.git`, `.gitignore`, and `precode/`.
- `tasks/beads/` and `tasks/prds/` intentionally contain only schema and template
  files plus this bead. PrecodeOS's own numbered development beads and PRDs were
  deliberately excluded during adoption.
- Git hooks and GitHub Actions were not installed. `.github/workflows/` is absent,
  and a workflow placed under `precode/.github/` would not run.
