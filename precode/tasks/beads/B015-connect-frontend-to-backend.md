---
bead_id: B015
status: done
execution_mode: builder
bead_kind: implementation
primary_authority: tasks/prds/PRD-002-backend.md
depends_on: []
parent_prd: PRD-002
requirement_ids:
  - PRD-002-FR05
  - PRD-002-UX01
  - PRD-002-UX02
  - PRD-002-UX03
files_in_play:
  - frontend/src/
  - frontend/tests/
  - frontend/index.html
  - frontend/vite.config.js
  - backend/src/
  - backend/tests/
  - tasks/beads/B015-connect-frontend-to-backend.md
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
# B015 — Connect The Frontend To The Backend
<!-- ANCHOR: b015-connect-frontend-to-backend -->

> AUTHORITY: The recorder signs in and works against server-stored data, preserving the `PRD-001` experience.
> NOT_AUTHORITY: Product scope, isolation enforcement, or deployment.
> LOAD_WHEN: Building or reviewing the frontend-to-backend connection.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-04

## State

- ID: `B015`
- Status: `done`
- Execution mode: `builder`

## Primary Authority

- `tasks/prds/PRD-002-backend.md`

## Depends On

- none

`B013` and `B014` built the boundary and the store. Not declared formally, for the
usual transition-checker reason.

## Parent PRD

- `PRD-002` — approved 2026-08-04.

## Requirement IDs

- `PRD-002-FR05` — recording, consolidation, rollover and export behave exactly as `PRD-001` defines, against server-stored data
- `PRD-002-UX01` — signing in happens once per session, never per entry
- `PRD-002-UX02` — the signed-in identity is visible at all times
- `PRD-002-UX03` — a connection failure mid-entry shows a plain message and does not silently discard the entry

## Objective

A user signs in, records inventory against the backend, and gets the same recording
experience `PRD-001` delivered — with the signed-in identity always visible and
nothing lost silently when a request fails.

## Done When

- A sign-in screen exists; the recorder is not reachable without a session.
- Vite proxies `/api` to the backend in development, so the app is same-origin.
- Entries are written to and read from the backend, not `localStorage`.
- Consolidation, day rollover, and `.xlsx` export behave exactly as `PRD-001`
  defines, now over server data.
- The signed-in identity is visible on every screen state while signed in.
- Signing out returns to the sign-in screen.
- A failed request shows a plain message and **preserves the typed entry**.
- **SKU normalisation is settled**: the rule exists in two places by necessity — the
  backend cannot trust the client, and the frontend needs it for display — and a
  contract test asserts the two agree, so they cannot drift silently.
- All three checks below are run and recorded.

## Files In Play

- `frontend/src/`, `frontend/tests/`, `frontend/index.html`, `frontend/vite.config.js`
- `backend/src/`, `backend/tests/` — only if serving the built frontend needs it
- `tasks/beads/B015-connect-frontend-to-backend.md`, `tasks/todo.md`

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Verification Type

- `unit`
- `integration`

## Delegation Mode

`human_in_loop` — this changes how v1 behaves for the first time since it was
accepted.

## Test Strategy

`failing_first`

## Review Context

`fresh_context_recommended`

## Stop If

- `PRD-001` behaviour changes rather than being preserved. Storage moves; behaviour
  does not.
- Offline support, retry queues, or optimistic writes appear — `BQ-7` ruled them out.
- A second dependency is needed to talk to the backend. `fetch` is built in.
- Isolation enforcement moves to the client in any form.
- The two SKU normalisations are allowed to differ.
- Scope reaches the network-cost measurement, which is bead 4.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T18:02:14.502038+00:00; log `logs/check-output/20260804T180214Z-bash-scripts-validate-memory.sh.log` | `npm test` -> pass (exit 0) at 2026-08-04T18:02:17.131528+00:00; log `logs/check-output/20260804T180214Z-npm-test.log` | `npm test` -> pass (exit 0) at 2026-08-04T18:03:12.539985+00:00; log `logs/check-output/20260804T180217Z-npm-test.log` | `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-04T18:20:31.805859+00:00; log `logs/check-output/20260804T182031Z-bash-scripts-validate-memory.sh.log` | `npm test` -> pass (exit 0) at 2026-08-04T18:20:34.432861+00:00; log `logs/check-output/20260804T182032Z-npm-test.log` | `npm test` -> pass (exit 0) at 2026-08-04T18:21:24.387122+00:00; log `logs/check-output/20260804T182034Z-npm-test.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Caron Ng (builder) signed in and used the recorder in Chrome and confirmed the autofill fix; Claude (agent) ran the automated checks and the live end-to-end probes. What was checked: sign-in gates the recorder; entries write to and read from MongoDB Atlas rather than `localStorage`; consolidation, rollover and `.xlsx` export behave as `PRD-001` defines over server data; the signed-in space is visible while signed in; sign-out returns to the sign-in screen and is invalidated server-side; a save the server refuses shows a plain message and preserves the typed SKU and quantity; two logins in separate spaces cannot see each other's entries; and the SKU normalisation contract test holds the frontend and backend rules together. Environment: local macOS, backend on 127.0.0.1:3000 against MongoDB Atlas, Vite dev server on localhost:5174 proxying `/api`, Chrome plus headless Chrome, Node 25.2.1. Result: pass. Remaining uncertainty: no way to create a login exists in the product, so both test logins were seeded from a scratchpad one-off; `SEC01` remains a negative claim and only the attempts we thought of were refused; a real business day, real Tab-key navigation and a real midnight roll are still unobserved; concurrent writes from two devices are untested; and the two seeded `e2e-*` logins still exist in Atlas.
- Files changed: 17 changed path(s) at last evidence update
- Next bead: `tasks/beads/B016-serve-built-frontend-same-origin.md`
- Review decision: accepted by Caron Ng on 2026-08-04 after verifying sign-in, recording, sign-out and the autofill fix in Chrome. All three checks pass and are recorded: frontend 174 tests, backend 37 tests, `validate-memory.sh` clean.
- Drift observed: none. Changed paths were `frontend/index.html`, `frontend/vite.config.js`, `frontend/src/main.js`, new `frontend/src/api.js`, six modified and four new files under `frontend/tests/`, this bead file and `tasks/todo.md` — all inside `files_in_play`. `backend/src/` was read but not modified, so serving the built frontend was not needed. `frontend/src/storage.js` was deliberately left in place rather than deleted. Checked by hand, since `files-in-play-check.py` is blind in this subfolder topology.
- Lesson to promote: Two lessons. First, the suite went green at 174 tests and still missed the defect that mattered: signing in as a second business failed because Chrome filled the first business's saved passcode over the typed one, and jsdom has no password manager so no test could see it. It was diagnosed only by a split experiment the builder ran by hand — a clean Chrome profile worked, an incognito window of the saving profile failed, because incognito isolates cookies but shares the profile's saved passwords. That split is what ruled out the server and the session. Second, the identical-denial rule that prevents username enumeration is also what made the failure undiagnosable from the server log, since wrong-passcode and unknown-username are byte-identical by design. That is the right trade for a multi-tenant product, but the cost is real and should be paid knowingly rather than 'fixed' later by loosening the message.
- Follow-up bead needed: yes, four. Bead 4 of the backend decomposition, measuring network cost for `NFR01` and `NFR02`, whose bead file is not yet written. A login-creation path, because `createLogin` is reachable only from tests and no business can be onboarded without a scratchpad one-off. A decision on `frontend/src/storage.js`, which is now imported only by its own test — 18 passing tests cover code the app never calls, which is green without being evidence. And removal of the two seeded `e2e-shop` and `e2e-shop-b` logins from Atlas before any real use.
- Blocked escape: not needed; the bead completed without blockers.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: Caron Ng
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the recorded check results and a manual sign-in and
record cycle in a browser. Do not activate a next bead.