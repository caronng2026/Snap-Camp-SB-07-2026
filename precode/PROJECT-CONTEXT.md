# Snap Camp — Project Context
<!-- ANCHOR: project-context -->

> AUTHORITY: Technical project constitution for stack choices, implementation conventions, architecture guardrails, integration boundaries, and project-specific build rules for Snap Camp.
> NOT_AUTHORITY: Active memory, active task selection, feature requirements, route inventory, schema field definitions, pricing decisions, or generated progress state.
> LOAD_WHEN: Shaping PRDs, deriving architecture-affecting beads, onboarding an agent, resolving implementation convention questions, or checking whether new work fits the project constitution.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `PROJECT-CONTEXT.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.3.0
Last updated: 2026-07-27

## Repository Topology

PrecodeOS is installed in the `precode/` subfolder, not at the repository root.
This is a deliberate project-specific topology, not a PrecodeOS default. See
`CODEBASE-GUIDE.md` for the full layout.

- Installed Precode root: `precode/`. `AGENT.md`, `DECISIONS.md`,
  `OPERATING-CONSTRAINTS.md`, `tasks/`, and `scripts/` live there.
- Paths inside Precode owner files, beads, and protocols are relative to
  `precode/`.
- Application code will live in sibling folders at the repository root, alongside
  `precode/` and never inside it. No application folder exists yet.
- Validation and session commands must run from `precode/`, not the repository
  root. See the session-start constraint in `OPERATING-CONSTRAINTS.md`.
- Agent shims under `precode/` are discovered only when the working directory is
  inside `precode/`. Whether to mirror them at the repository root is an open
  question.
- No Git hooks and no CI are installed. `.github/workflows/` at the repository root
  does not exist, and a workflow under `precode/.github/` would not run.

## Purpose

`PROJECT-CONTEXT.md` is the technical project constitution for Snap Camp.

It gives agents and builders a stable place to look for how this repository builds and verifies the product without adding another active-memory file.

Active memory remains:

- `AGENT.md`
- `DECISIONS.md`
- `tasks/todo.md`

Load this file only when the work needs project-level context.

Use `PRODUCT.md` for builder-facing product direction: product promise, users and jobs, strategy and non-goals, current bets, success signals, and design or voice pointers.

## Project Shape

- Product summary: Snap Camp builds the **Daily Inventory Recorder** — a fast daily log for small specialty businesses that records item SKUs and quantities during the working day, consolidates repeated SKUs automatically, and produces an Excel-ready daily summary in one action, replacing manual end-of-day spreadsheet consolidation. See `PRODUCT.md`.
- Stack: browser-based, mobile-responsive web app in `frontend/` — Vite build tooling, vanilla JavaScript modules, Vitest for tests, browser `localStorage` for persistence, one spreadsheet-writing dependency for the `.xlsx` export. No UI framework, no server, no database. Node and npm are development prerequisites. Recorded as OQ-2, OQ-3, OQ-5, and OQ-10 in `DECISIONS.md`.
- Primary users or roles: the owner or assistant at the anchor partner (needlepoint retail) recording inventory during the working day; witness A (lock manufacturing) and witness B (coffee-paper logistics) confirming the design generalizes; Caron Ng as builder and approver; AI coding agents operating inside bead boundaries.
- App directory: `frontend/`, a sibling of `precode/` at the repository root. `backend/` is a directory convention only and stays unbuilt until an approved backend bead (OQ-4). Neither exists yet. The installed Precode root is `precode/`.
- Deployment target: none configured. v1 is run locally for the "watch them use it" test with the anchor partner. Hosting is not a v1 decision.

## Operating Principles

- Keep the active-memory set tiny.
- Use `tasks/reference/STATE-MANAGEMENT-PROTOCOL.md` to recover from todo/bead drift, stale generated reports, or unclear state ownership.
- Prefer project conventions over new abstractions.
- Use one primary authority file per bead.
- Use `tasks/reference/WORKFLOW-SELECTION-PROTOCOL.md` when the right path is unclear before activating or widening work.
- Use `tasks/reference/GOAL-FRAME-PROTOCOL.md` when durable intent needs reviewed orientation before workflow selection; Goal Frames remain advisory and must be reaffirmed when stale.
- Use `tasks/reference/LONG-HORIZON-PLANNING-PROTOCOL.md` when reviewing future, blocked, deferred, follow-up, or PRD-approved work without making it active.
- Use `tasks/reference/SESSION-COMPLETION-HANDOFF-PROTOCOL.md` when closing sessions, reviewing bead completion, or handing work to another agent.
- Use `tasks/reference/DECOMPOSITION-PROTOCOL.md` when slicing broad work into beads or deciding that something is not a bead yet.
- Keep feature work traceable to approved PRD shards and requirement IDs.
- Prefer small, valuable, reviewable changes over broad implementation sweeps.
- Record evidence through `bash scripts/record-check.sh -- <command>`.
- Treat generated files as reports, not instructions.
- Stop before crossing a manual approval gate.

## Architecture Guardrails

- Route structure belongs in `ARCHITECTURE.md` or the target project's architecture authority file.
- Schema field names, relationships, and field semantics belong in `DATA-MODELS.md` or the target project's schema authority file.
- API route conventions and server-side boundaries belong in `API.md` or the target project's API authority file.
- Security policy and threat model belong in `SECURITY.md`.
- Acceptance and completion criteria belong in `ACCEPTANCE.md`.
- Product promise, users and jobs, strategy, current bets, success signals, and design or voice pointers belong in `PRODUCT.md`.
- Product decisions and open questions belong in `DECISIONS.md`.
- Feature inventory and compiled functional requirements belong in `FEATURES.md`.
- Deep product definition belongs in `tasks/prds/*.md`.

## Implementation Conventions

- Follow the existing folder and naming patterns in `frontend/` before introducing a new pattern.
- Vanilla JavaScript modules only. Do not introduce a UI framework — that reverses OQ-2 and needs a PRD amendment.
- Keep `consolidate()` a pure function: order-independent, total-preserving, no side effects. It is the one boundary the Architecture Brief fixes.
- Never treat a SKU as a number. Leading zeros must survive entry, storage, consolidation, and export. See `DATA-MODELS.md`.
- Do not add a dependency unless the active bead allows it or the builder approves it. v1 permits Vite, Vitest, and one spreadsheet writer.
- Write tests before implementation where the bead declares `failing_first`.
- Treat auth, payments, personal data, uploads, destructive actions, external integrations, and production configuration as sensitive surfaces. All are closed in v1; opening one needs a PRD amendment.
- Use `tasks/reference/VERIFICATION-GUARDRAIL-PROTOCOL.md` before accepting high-risk work or crossing sensitive-surface approval gates.

## Integration Boundaries

Every integration is deliberately closed in v1. See `SECURITY.md` for the sensitive-surface table and `API.md` for why there is no server boundary.

- Auth: none. No accounts, roles, or permissions (`PRD-001-SEC02`).
- Database: none. Persistence is browser `localStorage` (OQ-5). The MongoDB note in `DECISIONS.md` is forward-looking context only, not a v1 requirement.
- Payments: none.
- Email: none.
- Hosting: none configured for the app. The repository is hosted on GitHub, private.
- Analytics: none. No telemetry (`PRD-001-SEC03`).
- External APIs: none. Zero outbound network requests, verified by an integration check.
- Repository host: GitHub, private.
- CI provider: none installed. A workflow under `precode/.github/` would not run, because GitHub Actions reads only the repository root.
- Issue tracker: none configured.
- Deployment provider: none.
- Monitoring or error tracking: none.
- Safe health URLs for read-only uptime checks: none — there is no deployed surface.
- Manual dashboards or setup surfaces: none.

If an integration boundary changes, record the product or technical decision in `DECISIONS.md` and update the owning reference file. Reopening auth, network, or database requires a PRD amendment.

## Project Extensions

Enabled project-specific Precode extensions:

- Enabled adapters: `adapters/CLAUDE.md`, `adapters/CODEX.md`, `adapters/CURSOR.md`, `adapters/GEMINI.md`, `adapters/ANTIGRAVITY.md`, plus shim files `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md`.
- Enabled importers: `scripts/import-agent-spend.py` and `scripts/import-github-sources.py`.
- Enabled audits: `scripts/external-status.py`, `scripts/github-audit.py`, `scripts/scheduled-audit.sh`, `scripts/scheduled-audit.py`, and advisory `scripts/*-check.py` commands.
- Enabled generated reports: `OS-HEALTH.md`, `PROGRESS.md`, `logs/*.json`, `logs/*.jsonl`, `logs/*.md`, `logs/check-output/*`, and `logs/scheduled-audit-output/*`.
- Enabled external integrations: none. Snap Camp v1 makes no external calls. The vendored GitHub and external-status helpers remain available but are unconfigured and read-only.
- Extension owner files: `tasks/reference/EXTENSION-PROTOCOL.md`, `tasks/reference/EXTERNAL-STATUS-INTEGRATION-PROTOCOL.md`, `tasks/reference/GITHUB-INTEGRATION-PROTOCOL.md`, `tasks/reference/SCHEDULED-AUDIT-PROTOCOL.md`, `tasks/reference/TOOL-EXECUTION-PROTOCOL.md`, `adapters/ADAPTER-INDEX.md`, and `docs/PRECODE-FILE-INVENTORY.md`.

Use `tasks/reference/EXTENSION-PROTOCOL.md` before adding new adapters, protocols, importers, audits, generated reports, bead templates, or external integrations.

## Scheduled Audit Configuration

No scheduled audits are configured. There is no deployed surface, no CI, no external service, and no issue tracker to audit.

If audits are enabled later, they must remain read-only and must not mutate GitHub, CI, deployments, issue trackers, monitoring systems, or dashboards.

## Project-Specific Checks

Control-layer and owner-file beads use:

- `bash scripts/record-check.sh -- bash scripts/validate-memory.sh`
- `bash scripts/record-check.sh -- python3 scripts/file-inventory.py --check`

Application beads in `frontend/` add:

- `bash scripts/record-check.sh --cwd ../frontend -- npm test`

Run every check from `precode/`. The `--cwd` flag targets the sibling app directory. An active bead may narrow or expand this list; the bead's own `checks` field wins.

## Testing And Evidence

- A generated test is not evidence until it is run.
- A screenshot is review input until it is linked from closeout or recorded evidence.
- An external QA note or AI critique is review input until its findings are resolved or recorded in Closeout Evidence.
- Passing checks should be recorded with `bash scripts/record-check.sh -- <command>`.
- Manual verification must say what was checked, by whom, and whether it passed, failed, or remains blocked.
- Stronger work needs stronger proof: code, UI, data, integrations, deployment, and security work should use the Verification Guardrail Protocol tiers rather than relying on memory validation alone.

## Implementation Shape

- Use `tasks/reference/SYSTEM-DESIGN-PATTERN-PROTOCOL.md` before introducing or rejecting a design pattern, external service boundary, state flow, strategy-style rule boundary, audit trail, or auth/access boundary.
- When a module in `frontend/src/` grows a second responsibility, split it rather than widening it. The four module boundaries in `ARCHITECTURE.md` are the starting shape, not a ceiling.
- Keep role contracts compact: Navigator, Explorer, Builder, and Review should say what to load, decide, avoid, and return without becoming new active-memory files or autonomous personas.
- Defer a broad diagnostic `doctor` command and installable `precode` CLI until router-first behavior and bootstrap/install needs are proven.
- Treat PRD shards as destination documents and beads as journey units; `tasks/todo.md` remains the active journey pointer.
- New or amended code-changing beads should declare advisory `delegation_mode`, `test_strategy`, and `review_context` metadata when useful.
- Prefer vertical slices for user-facing work, failing-first test strategy when practical, and fresh-context review for medium/high-risk code-changing work.
- For meaningful implementation logic, define the deep-module interface, behavior contract, and test boundary before delegating internals.
- Use shared domain language for UI labels, module/interface names, tests, and fixtures when terms matter; glossary memory is evidence only unless promoted to an owner file.
- Use Local Hygiene before cleanup: truth is not cleanup; evidence is preserved; caches are disposable only when ignored and regeneratable.
- Prefer the simplest shape that preserves clarity, safety, and future change.
- Prefer existing framework and project conventions before adding a named pattern.
- Pattern guidance is advisory evidence only; durable pattern choices belong in `ARCHITECTURE.md`, `PROJECT-CONTEXT.md`, `API.md`, `DATA-MODELS.md`, `SECURITY.md`, `DECISIONS.md`, PRDs, or the active bead as appropriate.

## Context Loading

Use `tasks/reference/CONTEXT-ENGINEERING-PROTOCOL.md` when deciding what an agent should load, when source material is evidence instead of instruction, or when a handoff needs a compact Context Pack.

Load this file when:

- creating or approving a PRD shard
- deriving beads from a PRD
- work may affect architecture, stack, conventions, dependencies, external services, or verification strategy
- an agent is unsure which project convention applies

Do not load this file when:

- the active bead is narrow and its primary authority is sufficient
- the question belongs to a more specific authority file
- generated health or progress reports already point back to the active memory set
