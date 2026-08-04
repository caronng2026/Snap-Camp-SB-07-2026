---
current_bead: tasks/beads/B015-connect-frontend-to-backend.md
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
Document version: v1.5.0
Last updated: 2026-08-04

---

## Current Bead

- `tasks/beads/B015-connect-frontend-to-backend.md`
- State: `in_progress`
- Build lane: `Backend product definition`
- Active feature window: `Frontend to backend`

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

## Primary Authority File

- `tasks/prds/PRD-002-backend.md`

## Files In Play

- `frontend/src/`
- `frontend/tests/`
- `frontend/index.html`
- `frontend/vite.config.js`
- `backend/src/`
- `backend/tests/`
- `tasks/beads/B015-connect-frontend-to-backend.md`
- `tasks/todo.md`

## Checks To Run

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh --cwd ../frontend -- npm test`
- `bash scripts/record-check.sh --cwd ../backend -- npm test`

## Explicit Out-of-Scope

- `PRD-001` behaviour changes rather than being preserved. Storage moves; behaviour
  does not.
- Offline support, retry queues, or optimistic writes appear — `BQ-7` ruled them out.
- A second dependency is needed to talk to the backend. `fetch` is built in.
- Isolation enforcement moves to the client in any form.
- The two SKU normalisations are allowed to differ.
- Scope reaches the network-cost measurement, which is bead 4.
- Stop condition: pause and ask before crossing any stop condition above.

## Next Up

- Begin `tasks/beads/B015-connect-frontend-to-backend.md` only within its Done When, Files In Play, and Stop If boundaries.
- If the bead is too broad, split it before implementation.

## Open Questions

- None.

## Noticed

- Promoted from `tasks/beads/B014-space-scoped-store.md` to `tasks/beads/B015-connect-frontend-to-backend.md` by `python3 scripts/bead-transition.py --approve` at 2026-08-04 17:46 UTC.

