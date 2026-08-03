---
current_bead: tasks/beads/B009-shape-backend-prd.md
current_state: in_progress
build_lane: Backend product definition
active_feature_window: Backend PRD shaping
primary_authority: tasks/reference/PRD-PROTOCOL.md
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
Document version: v0.9.0
Last updated: 2026-08-03

---

## Current Bead

- `tasks/beads/B009-shape-backend-prd.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Backend PRD shaping`

## Done When

- The backend problem is stated in plain language, or its absence is recorded.
- The user and the painful moment are named, with whatever evidence exists.
- It is established whether the problem is real now or anticipated later.
- Non-goals are explicit, including which `PRD-001` decisions would be reopened.
- Open questions are listed with what each one blocks.
- A `PRD-002` draft exists at `status: draft` following `PRD-SHARD-SCHEMA.md`.
- The draft is **not** approved. Approval is a separate human gate.
- No architecture is chosen. Architecture Shaping runs only after PRD approval.
- Both checks below are run and recorded.

## Primary Authority File

- `tasks/reference/PRD-PROTOCOL.md`

## Files In Play

- `tasks/prds/PRD-002-backend.md`
- `CANDIDATE-QUEUE.md`
- `tasks/beads/B009-shape-backend-prd.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

## Explicit Out-of-Scope

- A problem statement would have to be invented to justify the backend. Say so and
  park it instead.
- A technology choice starts driving the requirements rather than the reverse.
- Any `PRD-001` decision is reopened without recording what changed and why —
  particularly `OQ-11` (single-device), `SEC02` (no accounts), and `SEC03` (no
  external services).
- Scope reaches architecture, hosting, schema design, or bead proposals.
- The draft starts being treated as approved.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B009-shape-backend-prd.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B008-measure-render-performance.md` to `tasks/beads/B009-shape-backend-prd.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-03 19:21 UTC.

