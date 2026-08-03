---
current_bead: tasks/beads/B008-measure-render-performance.md
current_state: in_progress
build_lane: Daily Inventory Recorder
active_feature_window: Render measurement
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

---

## Current Bead

- `tasks/beads/B008-measure-render-performance.md`
- State: `in_progress`
- Build lane: `Daily Inventory Recorder`
- Active feature window: `Render measurement`

## Done When

- Render time at ~200 entries is measured and the actual figure recorded.
- Render time at ~1,000 entries is also measured, because the anchor partner has
  1,000+ SKUs and 200 was always a conservative stand-in.
- A regression test pins a bar based on the measurement, not on the invented figure.
- `NFR03` in the PRD and `ACCEPTANCE.md` is updated: either confirmed at 500ms with
  the measurement behind it, or revised with the reason.
- The provisional wording is removed once the figure has evidence.
- All checks below are run and recorded.

## Primary Authority File

- `tasks/prds/PRD-001-daily-inventory-recorder.md`

## Files In Play

- `frontend/tests/`
- `tasks/beads/B008-measure-render-performance.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

## Explicit Out-of-Scope

- The measurement is worse than the bar and optimisation starts. Report it instead.
- A measured figure is treated as a guarantee. It is one machine, under jsdom, on
  one day — it bounds nothing about a shop tablet.
- Scope reaches the browser-versus-jsdom difference. jsdom timings are indicative
  only, and that limit belongs in the record rather than in more work.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B008-measure-render-performance.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B007-daily-rollover.md` to `tasks/beads/B008-measure-render-performance.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-03 19:12 UTC.

