---
bead_id: B013
status: in_progress
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids:
  - PRD-002-FR01
  - PRD-002-FR04
  - PRD-002-SEC02
  - PRD-002-SEC03
  - PRD-002-SEC04
files_in_play:
  - backend/package.json
  - backend/package-lock.json
  - backend/src/
  - backend/tests/
  - tasks/beads/B013-backend-auth-boundary.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh --cwd ../backend -- npm test
verification_type:
  - unit
  - integration
delegation_mode: human_in_loop
test_strategy: failing_first
review_context: fresh_context_required
complexity: standard
required_planning_depth: brief
autonomy_level: supervised
---
# B013 — The Backend Auth Boundary
<!-- ANCHOR: b013-backend-auth-boundary -->

> AUTHORITY: First backend slice: a login signs in, receives a session, and signs out, and every protected route is refused without one.
> NOT_AUTHORITY: Daily-log data, the scoped store, frontend changes, or deployment.
> LOAD_WHEN: Building or reviewing the backend auth boundary.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B013`
- Status: `in_progress`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md`

## Depends On

- none

First backend bead. `B012` brought the owner files in line; not declared formally,
for the usual transition-checker reason.

## Parent PRD

- `PRD-002` — approved 2026-08-04, Architecture Shaping completed the same day.

## Requirement IDs

- `PRD-002-FR01` — a username and passcode grant access to exactly one data space
- `PRD-002-FR04` — signing out ends the session
- `PRD-002-SEC02` — authorization is decided server-side on every request
- `PRD-002-SEC03` — credentials are never stored, transmitted, or logged recoverably
- `PRD-002-SEC04` — sessions expire, and sign-out invalidates them server-side

## Objective

A login signs in with a username and passcode, receives a session, and signs out —
and every protected route is refused without a valid session.

This is where server-side authorization is **established structurally**, before any
data route exists to retrofit it onto.

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

## Files In Play

- `backend/package.json`, `backend/package-lock.json`
- `backend/src/`, `backend/tests/`
- `tasks/beads/B013-backend-auth-boundary.md`, `tasks/todo.md`

`frontend/` is out of scope — connecting the two is bead 3.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

Run from `precode/`.

Test coverage expected:

- unit: a stored credential is a bcrypt hash, not the passcode, and does not match it
- unit: session creation carries a space id and an expiry
- integration: correct credentials return a session cookie; wrong ones return none
- integration: a protected route without a session is refused
- integration: a protected route with an expired session is refused
- integration: after sign-out, replaying the same session is refused
- integration: the passcode appears in no response body and no log line
- integration: the cookie is HTTP-only

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`human_in_loop` — this creates `backend/`, adds the first backend dependencies, and
handles credentials.

## Test Strategy

`failing_first`

## Review Context

`fresh_context_required` — this is the security boundary every later bead assumes.

## Stop If

- Authorization would be decided anywhere but server-side, or after a handler runs.
- The connection string would be written to any file in the repository.
- A passcode would be stored, returned, or logged in recoverable form.
- A reset, recovery, or admin path starts to appear — BQ-5 ruled them out.
- Scope reaches daily-log data or the scoped store. That is bead 2, and it must land
  whole.
- A dependency beyond Fastify, `mongodb`, `bcrypt` and the already-approved Vitest is
  needed.
- Atlas is unreachable — raise an unblocker rather than working around it.

## Closeout Evidence

- Checks run: `npm test` -> pass (exit 0) at 2026-08-04T17:28:36.947369+00:00; log `logs/check-output/20260804T172820Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:28:37.376663+00:00; log `logs/check-output/20260804T172837Z-bash-scripts-validate-memory.sh.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-04. What was checked: seven curl steps against a running server on port 3111 with a seeded login — protected route with no session refused 401; wrong passcode 401; unknown username returned a byte-identical body and status to a wrong passcode; correct credentials returned 204 with `HttpOnly; SameSite=Strict`; the protected route with the session returned only `{spaceId}`; sign-out returned 204; replaying the same cookie afterwards returned 401. Environment: local macOS, Node v25.2.1, live MongoDB Atlas, throwaway `snapcamp_smoke` database since dropped. Result: pass. Remaining uncertainty: **the server log was not grepped for the passcode before being deleted**, so the bead's log-leak check was not actually performed — the automated tests cover response bodies and headers only; no human has exercised this through a browser; and the session TTL of 12 hours has not been validated against a real working day.
- Files changed: 13 changed path(s) at last evidence update
- Next bead: `tasks/beads/B014-space-scoped-store.md`
- Review decision: accepted by Caron Ng on 2026-08-04. 13 automated tests pass against live Atlas and are recorded, plus a seven-step manual smoke test through curl covering sign-in, refusal, identical denials, the protected route, sign-out and replay. `SEC02` is established structurally: `request.spaceId` is set only by the session hook, so no handler can receive a space id it was lied to about. Accepted with the log-leak check not performed and no browser exercise.
- Drift observed: none. Changed files were `backend/` (new — `package.json`, `package-lock.json`, `src/`, `tests/`, `vitest.config.js`, `.env.example`), this bead file and `tasks/todo.md`. `backend/.env` holds the Atlas connection string and is gitignored, verified by `git check-ignore`; a grep for the credential across `backend/` found it in that file alone. `frontend/` untouched. Checked by hand.
- Lesson to promote: identical denial bodies are not enough on their own. An unknown username and a wrong passcode return the same status and body, but without a bcrypt compare against a dummy hash on the missing-user path, the missing user returns measurably faster and response timing enumerates valid usernames. The equalising compare is deliberate and looks like dead code to anyone who does not know why it is there — which is why it carries a comment saying so.
- Follow-up bead needed: yes — bead 2, the space-scoped store, which must land whole. Also outstanding: grepping a server log for credential leakage, which this bead intended and did not do.
- Blocked escape: not needed. Atlas reachability was verified before the bead began — connect 1456ms, write 114ms, read 80ms.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and a manual sign-in check.
Do not activate a next bead.
