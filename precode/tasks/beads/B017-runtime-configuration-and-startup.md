---
bead_id: B017
status: in_progress
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids:
  - PRD-002-SEC03
  - PRD-002-SEC04
files_in_play:
  - backend/package.json
  - backend/src/server.js
  - backend/.env.example
  - backend/tests/
  - tasks/beads/B017-runtime-configuration-and-startup.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
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
# B017 — Runtime Configuration And Start-Up
<!-- ANCHOR: b017-runtime-configuration-and-startup -->

> AUTHORITY: The backend starts correctly in a hosted environment from environment variables alone, and fails loudly when it cannot.
> NOT_AUTHORITY: Hosting platform configuration, secret values, serving the frontend, product behaviour, or isolation rules.
> LOAD_WHEN: Making the backend runnable outside a developer machine.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B017`
- Status: `in_progress`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md`

## Depends On

- none

Sequenced after `B016` so the start-up path can be verified serving the real
artifact. Not declared formally, for the usual transition-checker reason.

## Parent PRD

- `PRD-002` — approved 2026-08-04.

## Requirement IDs

- `PRD-002-SEC03` — credentials are never stored in recoverable form, and by
  extension never committed, never logged, and never printed at start-up
- `PRD-002-SEC04` — sessions are invalidated server-side, which requires the session
  secret to be supplied by the environment rather than defaulted

## Objective

The backend starts in a hosted environment configured only by environment variables,
binds where the host can reach it, and fails immediately and legibly when required
configuration is absent or wrong.

## Why This Is Its Own Bead

The current entry point is developer-shaped. `npm run dev` passes
`node --env-file=.env`, and a hosted instance has no `.env` file — Node treats a
missing `--env-file` as an error, so that script cannot be the deployed one. The host
binding defaults to `127.0.0.1`, which a platform router cannot reach. Neither is a
product change, and neither belongs in the same diff as serving the frontend.

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

## Explicitly Not In Scope

- **Hosting platform configuration.** Render services, build and start commands
  entered in a dashboard, platform environment variables, Atlas network allowlists,
  DNS, certificates, scaling. These are builder actions on a third-party system, not
  repository changes, and this bead must not encode them as if they were.
- **Rotating or setting any credential value.** Values live in the platform's secret
  store and in the local gitignored `.env`, never in the repository.
- **Serving the built frontend** — that is `B016`.
- **The `Secure` cookie flag.** Raised separately as a `SECURITY.md`-governed
  decision. It is genuinely adjacent to this bead, which makes it the likeliest thing
  to fold in by accident; do not.
- A login-creation path.
- Network-cost measurement (`NFR01`, `NFR02`).

## Files In Play

- `backend/package.json` — the start command
- `backend/src/server.js` — binding, configuration reads, fail-fast paths
- `backend/.env.example` — documented variables, placeholders only
- `backend/tests/` — start-up and configuration tests
- `tasks/beads/B017-runtime-configuration-and-startup.md`, `tasks/todo.md`

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

Run from `precode/`.

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`human_in_loop` — start-up behaviour is where a misconfiguration becomes an outage,
and the builder owns the platform side.

## Test Strategy

`failing_first`

## Review Context

`fresh_context_recommended`

## Stop If

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

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T19:26:08.736474+00:00; log `logs/check-output/20260804T192608Z-bash-scripts-validate-memory.sh.log` | `npm test` -> pass (exit 0) at 2026-08-04T19:27:00.026867+00:00; log `logs/check-output/20260804T192609Z-npm-test.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: pending — must state who checked, what was checked, environment, result, and remaining uncertainty
- Files changed: 6 changed path(s) at last evidence update
- Next bead: pending
- Review decision: pending
- Drift observed: pending — check by hand, since `files-in-play-check.py` is blind in this subfolder topology
- Lesson to promote: pending
- Follow-up bead needed: pending
- Blocked escape: pending
- Reference follow-through: pending
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: pending
- Attribution reviewed by: pending
- Attribution uncertainty: pending
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results, a demonstration that the
server starts from environment variables with no `.env` file present, and the list of
variables the platform must supply.

Do not activate a next bead. A deployed instance still cannot onboard a business
until a login-creation path exists, and the `Secure` cookie flag remains an open
`SECURITY.md` decision.