---
bead_id: B014
status: done
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids:
  - PRD-002-FR02
  - PRD-002-FR03
  - PRD-002-FR06
  - PRD-002-SEC01
files_in_play:
  - backend/src/
  - backend/tests/
  - backend/package.json
  - tasks/beads/B014-space-scoped-store.md
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
# B014 — The Space-Scoped Store
<!-- ANCHOR: b014-space-scoped-store -->

> AUTHORITY: Daily-log data behind a store that cannot be called without a space id, and the cross-space attempt suite that tests it.
> NOT_AUTHORITY: Frontend changes, consolidation or export behaviour, or deployment.
> LOAD_WHEN: Building or reviewing the isolation boundary.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B014`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md`

## Depends On

- none

`B013` built the auth boundary this scopes against. Not declared formally, for the
usual transition-checker reason.

## Parent PRD

- `PRD-002` — approved 2026-08-04.

## Requirement IDs

- `PRD-002-FR02` — entries are stored in the session's space and no other
- `PRD-002-FR03` — the log shows only the signed-in space's data
- `PRD-002-FR06` — a space persists server-side across sessions and restarts
- `PRD-002-SEC01` — **no request can read, write, or infer another space's contents**

## Objective

Daily-log data is read and written only through a store that cannot be called
without a space id, and the cross-space attempt suite is refused.

**This bead must land whole.** Splitting it would leave `SEC01` unprovable across
several beads, which the decomposition names as a stop condition.

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

## Files In Play

- `backend/src/`, `backend/tests/`, `backend/package.json`
- `tasks/beads/B014-space-scoped-store.md`, `tasks/todo.md`

`frontend/` is out of scope.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

Test coverage expected:

- unit: every exported store function rejects a missing or empty space id
- unit: the store exports no raw collection or unscoped query helper
- unit: SKU normalisation matches `DATA-MODELS.md`
- integration: an entry written in space A is absent from space B's log
- integration: a session for space A cannot read space B by any request shape
- integration: enumeration of space ids returns nothing distinguishable
- integration: a session token reused after sign-out is refused
- integration: a non-existent id and another space's id return byte-identical denials
- integration: data survives a fresh client connection

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`human_in_loop` — this is the requirement the whole PRD exists for.

## Test Strategy

`failing_first`

## Review Context

`fresh_context_required` — the isolation guarantee should be reviewed without
carrying the assumptions that built it.

## Stop If

- Any data path can be called without a space id.
- A space id could come from the request body, query, headers, or path.
- Denial responses differ between "not yours" and "does not exist".
- The store exports a raw collection handle or an unscoped query helper.
- Scope reaches consolidation, export, or the frontend.
- A dependency beyond the approved three plus Vitest is needed.
- A cross-space leak is found — **escalate rather than patching quietly.**

## Closeout Evidence

- Checks run: `npm test` -> pass (exit 0) at 2026-08-04T17:40:50.853992+00:00; log `logs/check-output/20260804T173954Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T17:40:51.235152+00:00; log `logs/check-output/20260804T174051Z-bash-scripts-validate-memory.sh.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-04. What was checked: 37 tests across three files — 13 auth, 11 store, 13 cross-space isolation; plus two structural audits by grep, confirming `collection('entries')` appears only in `src/store.js` and that no route reads a space id from a request body, query string, or header. The isolation suite covers id substitution through body, query, header and path; enumeration of day keys; forged, absent, expired and replayed sessions; malformed input; and byte-identical denials. Environment: local macOS, Node v25.2.1, live MongoDB Atlas, throwaway `snapcamp_test_store` and `snapcamp_test_isolation` databases, both dropped. Result: pass. Remaining uncertainty: **`SEC01` is a negative claim over an unbounded set of requests, and 37 tests bound only the attempts that were thought of** — paths nobody imagined remain uncovered and no suite can close that; no human has exercised isolation through a browser; no adversarial review by a second party has been done; and the store has not been tested under concurrent writes from two sessions.
- Files changed: 7 changed path(s) at last evidence update
- Next bead: `tasks/beads/B015-connect-frontend-to-backend.md`
- Review decision: accepted by Caron Ng on 2026-08-04. 37 tests pass and are recorded, plus two structural audits confirming the collection handle exists only in `src/store.js` and that no route reads a space id from a request. `SEC01` is enforced structurally. Accepted with four items open and recorded: the suite bounds only the attacks that were thought of; no adversarial review by a second party; no concurrent-write test; no browser exercise. The second of those should be closed before any deployment.
- Drift observed: none. Changed files were `backend/src/store.js` (new), `backend/src/app.js`, `backend/tests/store.test.js` and `backend/tests/isolation.test.js` (both new), this bead file and `tasks/todo.md` — all within the declared `files_in_play`. `frontend/` untouched; no consolidation or export work; no new dependency. Checked by hand.
- Lesson to promote: a type check was load-bearing, not defensive habit. `requireSpaceId` rejects a non-string rather than merely a falsy value, because `{ $ne: null }` reaching a Mongo query matches every document in the collection — a truthiness check would have passed it straight through. The same shape of bug does not exist in the SQL the earlier SQLite decision would have produced, so the reversal to MongoDB quietly changed what the guard had to do. A store is only as scoped as its weakest argument check.
- Follow-up bead needed: yes — bead 3, connecting the frontend. Also worth considering before any deployment: an adversarial review of isolation by someone who did not build it, and a concurrent-write test with two sessions.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and the cross-space attempt
suite output. State plainly that a passing suite bounds the attempts that were
thought of and is not proof that nothing leaks.