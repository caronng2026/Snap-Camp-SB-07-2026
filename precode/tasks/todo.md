---
current_bead: tasks/beads/B010-architecture-shaping-backend.md
current_state: in_progress
build_lane: Backend product definition
active_feature_window: Backend architecture shaping
primary_authority: tasks/reference/ARCHITECTURE-SHAPING-PROTOCOL.md
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
Document version: v1.0.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B010-architecture-shaping-backend.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Backend architecture shaping`

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

## Primary Authority File

- `tasks/reference/ARCHITECTURE-SHAPING-PROTOCOL.md`

## Files In Play

- `tasks/prds/PRD-002-backend.md`
- `DECISIONS.md`
- `tasks/beads/B010-architecture-shaping-backend.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

## Explicit Out-of-Scope

- A decision would be recorded that the builder has not made.
- `backend/` is created, or any code or dependency is added.
- Deployment is being decided rather than deferred.
- Isolation would rest on remembering to scope each call site rather than on
  structure — that is the `SEC01` risk and it should be surfaced, not accepted
  quietly.
- Any `PRD-002` requirement would change. That is a PRD amendment, not architecture.
- Scope reaches decomposition.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B010-architecture-shaping-backend.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B009-shape-backend-prd.md` to `tasks/beads/B010-architecture-shaping-backend.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 16:58 UTC.

