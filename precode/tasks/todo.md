---
current_bead: tasks/beads/B013-backend-auth-boundary.md
current_state: in_progress
build_lane: Backend product definition
active_feature_window: Backend auth boundary
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
Document version: v1.3.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B013-backend-auth-boundary.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Backend auth boundary`

## Done When

- `backend/` exists as a Node project with Fastify, the `mongodb` driver, `bcrypt`,
  and Vitest as its test runner.
- A login can be created with a username and passcode, stored with a bcrypt hash.
- Signing in with correct credentials returns a session; wrong credentials do not.
- The session is a **signed HTTP-only cookie**, with a server-side session record
  carrying the space id.
- A protected route is refused without a valid session, **before any handler runs**.
- Signing out invalidates the session server-side; replaying it afterwards fails.
- An expired session is refused.
- The passcode never appears in the database, in a response, or in a log.
- The Atlas connection string is read from the environment and **never committed**.
- All checks below are run and recorded.
- **No daily-log route, and no scoped store.** Those are bead 2.

## Primary Authority File

- `tasks/prds/PRD-002-backend.md`

## Files In Play

- `backend/package.json`
- `backend/package-lock.json`
- `backend/src/`
- `backend/tests/`
- `tasks/beads/B013-backend-auth-boundary.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Explicit Out-of-Scope

- Authorization would be decided anywhere but server-side, or after a handler runs.
- The connection string would be written to any file in the repository.
- A passcode would be stored, returned, or logged in recoverable form.
- A reset, recovery, or admin path starts to appear — BQ-5 ruled them out.
- Scope reaches daily-log data or the scoped store. That is bead 2, and it must land
  whole.
- A dependency beyond Fastify, `mongodb`, `bcrypt` and the already-approved Vitest is
  needed.
- Atlas is unreachable — raise an unblocker rather than working around it.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B013-backend-auth-boundary.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B012-adapt-owner-files-for-backend.md` to `tasks/beads/B013-backend-auth-boundary.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 17:25 UTC.

