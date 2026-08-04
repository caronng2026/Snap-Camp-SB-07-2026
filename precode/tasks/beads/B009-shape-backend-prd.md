---
bead_id: B009
status: in_progress
execution_mode: builder
bead_kind: planning
primary_authority: tasks/reference/PRD-PROTOCOL.md
depends_on: []
parent_prd: null
requirement_ids: []
files_in_play:
  - tasks/prds/PRD-002-backend.md
  - CANDIDATE-QUEUE.md
  - tasks/beads/B009-shape-backend-prd.md
  - tasks/todo.md
checks:
  - bash scripts/record-check.sh -- bash scripts/validate-memory.sh
  - bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check
verification_type:
  - static
delegation_mode: human_in_loop
test_strategy: not_applicable
review_context: same_session_ok
complexity: standard
required_planning_depth: PRD
autonomy_level: supervised
---
# B009 — Shape The Backend PRD
<!-- ANCHOR: b009-shape-backend-prd -->

> AUTHORITY: Planning bead for shaping a backend PRD: establish the problem, users, non-goals, and open questions before any backend work is proposed.
> NOT_AUTHORITY: Approving the PRD, activating implementation beads, choosing a database, creating `backend/`, or writing any application code.
> LOAD_WHEN: Shaping or reviewing the backend product definition.
> CLASS: active-task

Creator: Caron Ng
Document version: v0.1.0
Last updated: 2026-08-03

## State

- ID: `B009`
- Status: `in_progress`
- Execution mode: `builder`

## Primary Authority

- `tasks/reference/PRD-PROTOCOL.md`

## Depends On

- none

`PRD-001` is complete and its beads are closed. This bead opens a separate product
destination and does not extend that PRD.

## Parent PRD

- none. This bead **produces** a PRD draft; it does not implement one.

## Requirement IDs

- none. Planning work produces candidate requirements, not approved ones.

## Objective

Produce a reviewable draft of `PRD-002` for the backend, starting from the problem
rather than from the technology.

## The Problem With Starting Here

The only recorded backend input is a **solution**, not a problem:

> *"The client has stated an intent to move to MongoDB in a future v2 or backend
> phase."* — `DECISIONS.md`, 2026-07-28, recorded as a forward-looking note only.

No user problem, painful moment, or workaround has been captured for the backend.
`PRD-001` closed the obvious candidates deliberately: `OQ-11` confirmed single-device
use, `SEC02` closed accounts, `SEC03` closed external services. Each was a recorded
decision, not an oversight.

The Product Ideation Workbook explicitly warns against solution-first framing. A PRD
shaped from "we want MongoDB" would be a technology looking for a justification.

**So this bead's first job is to establish what the backend is for.** If no problem
survives that question, the honest outcome is to say so and park it — that is a
legitimate result, not a failure.

## Done When

- The backend problem is stated in plain language, or its absence is recorded.
- The user and the painful moment are named, with whatever evidence exists.
- It is established whether the problem is real now or anticipated later.
- Non-goals are explicit, including which `PRD-001` decisions would be reopened.
- Open questions are listed with what each one blocks.
- A `PRD-002` draft exists at `status: draft` following `PRD-SHARD-SCHEMA.md`.
- The draft is **not** approved. Approval is a separate human gate.
- No architecture is chosen. Architecture Shaping runs only after PRD approval.
- Both checks below are run and recorded.

## Explicitly Not In Scope

- Choosing MongoDB, any database, hosting, or an auth provider.
- Creating `backend/` or any code.
- Architecture Shaping. Its load condition is an **approved** PRD.
- Decomposition or bead proposals.
- Amending `PRD-001`, which is complete.

## Files In Play

- `tasks/prds/PRD-002-backend.md` — the draft, to be created
- `CANDIDATE-QUEUE.md` — for parked ideas that are not this PRD
- `tasks/beads/B009-shape-backend-prd.md`
- `tasks/todo.md`

Paths are relative to the installed Precode root. `frontend/` and `backend/` are out
of scope.

## Checks

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Run from `precode/`.

## Verification Type

- `static`

## Delegation Mode

`human_in_loop` — the problem statement can only come from the builder and the
client. An agent inventing one would be exactly the failure this bead exists to
avoid.

## Test Strategy

`not_applicable` — planning work produces documents, not behaviour.

## Review Context

`same_session_ok`

## Stop If

- A problem statement would have to be invented to justify the backend. Say so and
  park it instead.
- A technology choice starts driving the requirements rather than the reverse.
- Any `PRD-001` decision is reopened without recording what changed and why —
  particularly `OQ-11` (single-device), `SEC02` (no accounts), and `SEC03` (no
  external services).
- Scope reaches architecture, hosting, schema design, or bead proposals.
- The draft starts being treated as approved.

## Closeout Evidence

- Checks run: `bash scripts/validate-memory.sh` -> pass (exit 0) at 2026-08-03T19:29:07.238099+00:00; log `logs/check-output/20260803T192907Z-bash-scripts-validate-memory.sh.log` | `python3 scripts/file-inventory.py --check` -> pass (exit 0) at 2026-08-03T19:29:07.671644+00:00; log `logs/check-output/20260803T192907Z-python3-scripts-file-inventory.py-check.log`
- Result: latest recorded command status is pass (exit 0)
- Manual verification: Who checked: Claude (agent), 2026-08-03. What was checked: `PRD-002-backend.md` created at `status: draft` with all 24 sections required by `PRD-SHARD-SCHEMA.md`; the Problem section deliberately left open with the reason recorded; five `PRD-001` decisions listed as inherited non-goals each with what reopening costs; four open questions BQ-1 to BQ-4 each naming what it would reopen and what it blocks; no technology, architecture, hosting, or schema proposed; `PRD-001`, `B001` and `frontend/` confirmed untouched by Git diff. Environment: local macOS checkout, run from `precode/`. Result: pass — the skeleton is complete as scaffolding. Remaining uncertainty: **no backend problem was found**, so the PRD cannot progress; whether one exists is unknown until BQ-1 is answered by the builder and client.
- Files changed: 1 changed path(s) at last evidence update
- Next bead: none named yet
- Review decision: pending human acceptance
- Drift observed: yes, and one of it was an **explicit override of a stop condition**. On 2026-08-04 the builder directed an amendment to `PRD-001-UX01`, which this bead lists under Explicitly Not In Scope as *"Amending `PRD-001`, which is complete"*. The instruction named the PRD directly and was deliberate, so it is recorded as an override rather than treated as ordinary drift; the stop condition surfaced it rather than being bypassed silently. Separately, `DECISIONS.md` was edited to record three backend decisions and this one, and it is not in this bead's `files_in_play` — the same declared-boundary crossing as earlier PRD amendments. All other changed files were in scope. Checked by hand, since `files-in-play-check.py` is blind in this topology.
- Lesson to promote: a stated technology is not a problem statement. The only backend input was the client's intent to use MongoDB, and `PRD-001` had already closed the three problems a backend usually solves — each as a recorded decision, not an oversight. Recording those closures as inherited non-goals that must be *explicitly reopened* is what stops a new PRD quietly assuming its way past earlier decisions. Listing what each open question would reopen makes the cost of an answer visible before it is given.
- Follow-up bead needed: none from this bead. `PRD-002` is parked pending BQ-1. Carried forward from v1: the `UX01` timing comparison, real Tab-key navigation, browser re-check of consolidation since the case amendment, and observing a real midnight roll.
- Blocked escape: not needed. The bead anticipated this outcome — its Objective states that if no problem survives the question, saying so and parking is a legitimate result rather than a failure. That is what happened.
- Reference follow-through: not applicable — no public PrecodeOS package surfaces were changed.
- Human contributor: Caron Ng
- Contributor role: builder and approver
- Agent/tool surface: Claude Code (Opus 5)
- Attribution reviewed by: not reviewed
- Attribution uncertainty: none noted
- Evidence source: `logs/check-results.jsonl`

## Handback

Return to the builder with the `PRD-002` draft and the open questions that block it.
State plainly whether a real problem was found or whether the backend is currently a
technology in search of one.

Carried forward from `PRD-001` and still open: `UX01` has no timed comparison against
handwriting, real Tab-key navigation has not been exercised, consolidation has not
been re-checked in the browser since the case amendment, and no real midnight roll
has been observed.
