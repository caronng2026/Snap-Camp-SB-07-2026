---
bead_id: B016
status: done
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids:
  - PRD-002-FR05
files_in_play:
  - DECISIONS.md
  - backend/src/
  - backend/tests/
  - backend/package.json
  - frontend/vite.config.js
  - tasks/beads/B016-serve-built-frontend-same-origin.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh --cwd ../frontend -- npm test
  - bash scripts/record-check.sh --cwd ../backend -- npm test
verification_type:
  - unit
  - integration
delegation_mode: human_in_loop
test_strategy: failing_first
review_context: fresh_context_recommended
complexity: standard
required_planning_depth: brief
autonomy_level: supervised
---
# B016 — Serve The Built Frontend Same-Origin
<!-- ANCHOR: b016-serve-built-frontend-same-origin -->

> AUTHORITY: The backend serves the built frontend, so the deployed app is one origin.
> NOT_AUTHORITY: Hosting platform configuration, runtime environment variables, start-up, DNS, certificates, or credentials.
> LOAD_WHEN: Making the production artifact same-origin.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B016`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md`

## Depends On

- none

`B015` connected the frontend to the backend and is closed. Not declared formally,
for the usual transition-checker reason: a declared dependency must already be
`done`, and the predecessor only reaches `done` during the transition that would
activate this bead.

## Parent PRD

- `PRD-002` — approved 2026-08-04.

## Requirement IDs

- `PRD-002-FR05` — the recorder works against server-stored data. In production that
  requires the app and the API to share an origin, because the session cookie is
  `SameSite=Strict` and no CORS configuration exists.

## Objective

In production the backend serves the built frontend, so the browser loads the app
and calls the API from a single origin. This is what makes the recorded same-origin
architecture true of a deployed artifact rather than only of the dev server.

## Why This Is Its Own Bead

`ARCHITECTURE.md` records same-origin in both environments: Vite proxies `/api` in
development, and **the backend serves the built frontend in production**. The first
half exists; the second half has never been written. Without it a deployment yields
an API and no application, and the only ways to reach the app become cross-origin —
which the cookie and the missing CORS setup both forbid.

The builder settled the topology on 2026-08-04: one service. That closes the question
this bead depends on, and means the frontend is **not** deployed as its own service.

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

## Explicitly Not In Scope

- **Hosting platform configuration of any kind** — Render services, build commands,
  dashboard environment variables, Atlas network allowlists, DNS, certificates.
- **Runtime configuration and start-up**, including the `start` script and host
  binding. That is `B017`.
- **The `Secure` cookie flag.** Raised separately as a `SECURITY.md`-governed
  decision; it must not arrive inside this bead's diff.
- **A login-creation path.** Separate scope — see this bead's Handback.
- Any CORS configuration, or any change that makes cross-origin viable.
- Network-cost measurement (`NFR01`, `NFR02`).

## Files In Play

- `DECISIONS.md` — the deployment topology decision, declared in scope deliberately
- `backend/src/` — the static-serving route
- `backend/tests/` — the same-origin and route-precedence tests
- `backend/package.json` — only if serving requires a dependency, which is an
  approval gate in its own right (see Stop If)
- `frontend/vite.config.js` — only if the build output location must be settled
- `tasks/beads/B016-serve-built-frontend-same-origin.md`, `tasks/todo.md`

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

Run from `precode/`.

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`human_in_loop` — this decides the shape of the deployed artifact.

## Test Strategy

`failing_first`

## Review Context

`fresh_context_recommended`

## Stop If

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

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T19:06:38.682901+00:00; log `logs/check-output/20260804T190638Z-bash-scripts-validate-memory.sh.log` | `npm test` -> pass (exit 0) at 2026-08-04T19:06:41.623067+00:00; log `logs/check-output/20260804T190639Z-npm-test.log` | `npm test` -> pass (exit 0) at 2026-08-04T19:07:32.601465+00:00; log `logs/check-output/20260804T190641Z-npm-test.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Caron Ng (builder) reviewed and accepted on 2026-08-04; Claude (agent) ran the recorded checks, the mutation probes and the live end-to-end verification. What was checked: one process serves the app at `/` and the API at `/api/*`; a client-side route falls back to the app; an unknown `/api` path returns a JSON 404 rather than HTML; assets are served with usable content types; path containment refuses plain, percent-encoded, null-byte and sibling-prefix traversal, and refuses rather than clamping; sign-in, recording and read-back all work over a single origin with the Vite dev server stopped; real Chrome loads the served app with the sign-in gate intact and no console errors; the built bundle carries no session-scoped or secret content and no partner identity or pricing; and the deployment topology is recorded in `DECISIONS.md` naming both rejected alternatives. Environment: local macOS, Node 25.2.1, backend on 127.0.0.1:3000 against MongoDB Atlas, Vite stopped entirely, headless and interactive Chrome. Result: pass. Remaining uncertainty: the deployed filesystem must contain `frontend/dist` because the static root resolves out of `backend/` into a sibling directory, and that is unverified on any hosting platform; the server warns and runs API-only when no build is present, and deciding to stop instead based on environment is deferred to `B017`; path containment is hand-written rather than delegated to a reviewed plugin, so it is bounded by the cases tested and symlinks inside the build directory are untested; and no adversarial review by someone who did not build it has happened.
- Files changed: 10 paths: `backend/src/static.js` and `backend/tests/static.test.js` added; `backend/src/app.js`, `backend/src/server.js`, `frontend/vite.config.js`, `DECISIONS.md`, `tasks/todo.md` and the B015, B016, B017 bead files modified
- Next bead: `tasks/beads/B017-runtime-configuration-and-startup.md`
- Review decision: accepted by Caron Ng on 2026-08-04. All three checks pass and are recorded: frontend 178 tests, backend 55 tests, `validate-memory.sh` clean. One process serves the app and the API on a single origin, verified live with the dev proxy stopped.
- Drift observed: one crossing, declared. `tasks/beads/B015-connect-frontend-to-backend.md` was edited to set its status and name this bead as next, which the approved activation required, and it is not in this bead's `files_in_play`. Everything else was in scope: `DECISIONS.md` was declared in scope deliberately for the topology record. `frontend/dist/` is generated build output and correctly gitignored. Checked by hand, since `files-in-play-check.py` is blind in this subfolder topology.
- Lesson to promote: Declining the conventional dependency moved a security surface into this repository. Without `@fastify/static`, path containment became ours to get right, so `resolveWithinRoot` was exported and tested directly rather than only through routes, and five mutations were used to prove the tests could fail: a naive `startsWith` without the separator, skipping percent-decoding, dropping the null-byte guard, letting `/api` reach the app fallback, and removing containment outright. A second lesson came from the code itself: the null-byte guard was first written as a literal control character, which works and is invisible, and which an editor or a copy-paste can strip while the guard still looks present. Rewriting it as an escape sequence was not cosmetic, and composing the commit message reproduced the same defect twice before it landed. Route precedence got the same treatment: static serving is a not-found handler rather than a catch-all route, so the API cannot be shadowed by registration order.
- Follow-up bead needed: yes, three beyond `B017`. A login-creation path, which needs a `PRD-002` answer on who may create a login before it is implementable, since a deployed instance cannot onboard a business without one. A `SECURITY.md` decision on the `Secure` cookie attribute, deliberately kept out of both deployment beads so it is decided rather than buried in a diff. And the network-cost measurement for `NFR01` and `NFR02`, still unauthored.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: Caron Ng
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and a local demonstration that
one process serves both the app and the API on one origin.

Do not activate a next bead. Two items are deliberately outside this bead and still
open: a login-creation path, without which a deployed instance cannot onboard any
business; and the `Secure` cookie flag, which is a `SECURITY.md` decision rather than
a deployment detail.