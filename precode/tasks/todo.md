---
current_bead: tasks/beads/B001-adopt-precode-control-layer.md
current_state: in_progress
build_lane: Snap Camp PrecodeOS adoption
active_feature_window: Control-layer setup and orientation
primary_authority: PROJECT-CONTEXT.md
session_state: parked
parked_awaiting: Conviction Packet
parked_since: 2026-07-27
next_safe_action: Local Source Intake
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

## Parked

This project is **PARKED** as of 2026-07-27, awaiting the Conviction Packet.

Setup is complete and validated under `precode/`. The pause is deliberate, not a
blocker, failure, or drift. Intake cannot start because the Conviction Packet does
not exist yet.

- Parked because: the Conviction Packet is not ready.
- B001 remains `in_progress`. It was not accepted, closed, or transitioned.
- `scripts/session-close.sh` was deliberately not run.

### Next Safe Action When The Conviction Packet Arrives

Run **Local Source Intake**, using `tasks/reference/LOCAL-SOURCE-INTAKE-PROTOCOL.md`.

This matches the documented order in `tasks/templates/PRODUCT-IDEATION-WORKBOOK.md`:
`Conviction Packet -> Local Source Intake`.

Local Source Intake produces a reviewed source summary. It is evidence only. It
does not approve a PRD, activate a bead, or authorize implementation.

### Explicitly Not The Next Action

- Not a PRD. A PRD shard comes after intake and human review, not before.
- Not beads. No bead may be activated from a parked state.
- Not code. No application code, no `frontend/`, no `backend/`.
- Not bead acceptance or transition for B001.

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

Held while parked. Nothing below starts without the Conviction Packet and explicit
human approval.

- On unpark: run Local Source Intake on the Conviction Packet and produce a source
  summary for review. Stop there.
- Still outstanding from B001: adapt `PROJECT-CONTEXT.md` and `CODEBASE-GUIDE.md`
  to describe Snap Camp and the `precode/` topology, then stop for human review.
- A first product PRD shard may be proposed only after intake is reviewed. A next
  bead becomes active only through an explicitly approved transition.

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
