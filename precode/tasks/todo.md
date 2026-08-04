---
current_bead: tasks/beads/B014-space-scoped-store.md
current_state: in_progress
build_lane: Backend product definition
active_feature_window: Space-scoped store
primary_authority: tasks/prds/PRD-002-backend.md
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
Document version: v1.4.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B014-space-scoped-store.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Space-scoped store`

## Done When

- A store module exists whose every data function takes a space id first, and which
  **exports no way to reach daily-log data without one**.
- Entries recorded in one space are invisible from another, at both read and write.
- The space id used by any route comes from `request.spaceId`, set only by the
  session hook from `B013`.
- The cross-space attempt suite passes: id substitution, enumeration, session-token
  reuse, and non-existent ids — each refused.
- Denial responses are **byte-identical** for "not yours" and "does not exist".
- Data survives a client reconnect and a server restart.
- SKUs are normalised server-side by the `DATA-MODELS.md` rule — trim, upper-case,
  then strip leading zeros if entirely digits — because the client is not trusted.
- All checks below are run and recorded.
- **No consolidation, export, or frontend change.** Those are bead 3.

## Primary Authority File

- `tasks/prds/PRD-002-backend.md`

## Files In Play

- `backend/src/`
- `backend/tests/`
- `backend/package.json`
- `tasks/beads/B014-space-scoped-store.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Explicit Out-of-Scope

- Any data path can be called without a space id.
- A space id could come from the request body, query, headers, or path.
- Denial responses differ between "not yours" and "does not exist".
- The store exports a raw collection handle or an unscoped query helper.
- Scope reaches consolidation, export, or the frontend.
- A dependency beyond the approved three plus Vitest is needed.
- A cross-space leak is found — **escalate rather than patching quietly.**
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B014-space-scoped-store.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B013-backend-auth-boundary.md` to `tasks/beads/B014-space-scoped-store.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 17:35 UTC.

