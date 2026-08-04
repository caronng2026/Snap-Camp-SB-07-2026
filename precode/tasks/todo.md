---
current_bead: tasks/beads/B017-runtime-configuration-and-startup.md
current_state: in_progress
build_lane: Backend product definition
active_feature_window: Frontend to backend
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
Document version: v1.7.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B017-runtime-configuration-and-startup.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Frontend to backend`

## Done When

- A start command exists that runs the server from environment variables only, with
  no `.env` file present and no developer-only flags.
- The listen host is configurable and defaults safely. `127.0.0.1` stays correct for
  local use; a hosted instance can bind where its platform requires.
- The port is taken from the environment when the host supplies one.
- Missing required configuration — connection string, session secret — exits non-zero
  with a message naming what is missing. This already holds and must not regress.
- A data-store connection failure at start-up surfaces as a clear message rather than
  a silent hang or an unexplained timeout.
- **No secret is ever printed**, including at start-up, in error paths, and in the
  connection-failure message. A connection string carries its credentials inline, so
  logging the URI on failure is the obvious mistake to prevent.
- The same-origin start-up guard added on 2026-08-04 still holds and is covered by a
  test rather than only by hand.
- `backend/.env.example` describes every variable the server reads, with no real
  value in it.
- Both checks below are run and recorded.

## Primary Authority File

- `tasks/prds/PRD-002-backend.md`

## Files In Play

- `backend/package.json`
- `backend/src/server.js`
- `backend/.env.example`
- `backend/tests/`
- `tasks/beads/B017-runtime-configuration-and-startup.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Explicit Out-of-Scope

- A real credential, connection string, or session secret is written into any
  committed file, including `.env.example`, a test fixture, or a default value.
- A secret would be logged, echoed at start-up, or included in an error message.
- A default is introduced for the session secret. A defaulted secret is worse than a
  missing one, because it starts successfully and is identical everywhere.
- The same-origin guard is removed, softened, or made bypassable to get a deploy
  running.
- Platform-specific configuration is committed, or the code begins assuming one host.
- Scope reaches serving the frontend, CORS, cookie attributes, or product behaviour.
- Any change to isolation, sessions, or authorization is required to make start-up
  work. That would mean the problem has been misdiagnosed.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B017-runtime-configuration-and-startup.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B016-serve-built-frontend-same-origin.md` to `tasks/beads/B017-runtime-configuration-and-startup.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 19:20 UTC.

