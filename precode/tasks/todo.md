---
current_bead: tasks/beads/B016-serve-built-frontend-same-origin.md
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
Document version: v1.6.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B016-serve-built-frontend-same-origin.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Frontend to backend`

## Done When

- The backend serves the built frontend at `/`, and client-side routes fall back to
  the app rather than returning 404.
- `/api/*` continues to be handled by the API and is never shadowed by the static
  handler.
- A request to `/` and a subsequent `/api/*` call resolve to the **same origin**,
  demonstrated in a test rather than asserted in prose.
- The app is still absent for an unauthenticated user in the sense `B015` established:
  serving `index.html` must not expose any space's data. Static assets carry no
  session-scoped content.
- Serving the built app does not change any `PRD-001` recording behaviour.
- The build output location is agreed between `frontend/vite.config.js` and the
  backend, and neither hard-codes an absolute machine path.
- A missing or unbuilt frontend produces a clear start-up or request error naming the
  cause, rather than a bare 404 that reads as a routing bug.
- The deployment topology decision is recorded in `DECISIONS.md`: **one service, the
  backend serving the built frontend**, chosen 2026-08-04. The record must name what
  was rejected and why, not only what was chosen — a separate frontend service on its
  own origin was considered and rejected because it forces `SameSite=None; Secure`,
  which removes the CSRF protection `SameSite=Strict` currently provides for free; and
  a two-service variant keeping one browser-facing origin was rejected because the
  `/api` routing would live in a hosting dashboard, where no test or review can reach
  it.
- All three checks below are run and recorded.

## Primary Authority File

- `tasks/prds/PRD-002-backend.md`

## Files In Play

- `DECISIONS.md`
- `backend/src/`
- `backend/tests/`
- `backend/package.json`
- `frontend/vite.config.js`
- `tasks/beads/B016-serve-built-frontend-same-origin.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Explicit Out-of-Scope

- A static route shadows `/api/*`, or route precedence becomes order-dependent in a
  way a test does not pin.
- CORS appears anywhere, or the same-origin start-up guard in `server.js` is weakened
  or removed to make something pass.
- A fourth runtime dependency is proposed. `PRD-002` fixed the set at `fastify`,
  `mongodb` and `bcrypt`; anything more is a separate approval gate, and Fastify can
  serve static files without one.
- Any hosting platform is configured, or a platform-specific assumption is baked into
  the code.
- Isolation, session handling, or authorization changes in any way. This bead moves
  files; it does not touch who may read what.
- The frontend build starts embedding anything secret in order to make serving work.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B016-serve-built-frontend-same-origin.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B015-connect-frontend-to-backend.md` to `tasks/beads/B016-serve-built-frontend-same-origin.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 18:59 UTC.

