# Snap Camp — Codebase Guide
<!-- ANCHOR: codebase-guide -->

> AUTHORITY: Repository layout, file placement, naming conventions, and code organization guidance for Snap Camp.
> NOT_AUTHORITY: Product requirements, schema semantics, acceptance decisions, or pricing policy.
> LOAD_WHEN: Deciding where code or docs belong.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `CODEBASE-GUIDE.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-27

## Repository Layout

Snap Camp keeps the PrecodeOS control layer in a subfolder rather than at the
repository root. This is a deliberate project-specific topology, not a PrecodeOS
default.

```text
<repo root>/
  .git/
  .gitignore          # repository-root ignore rules
  precode/            # installed PrecodeOS root (the control layer)
  frontend/           # the web app — not created yet
  backend/            # absent until an approved backend bead activates
```

### The Installed Precode Root Is `precode/`

`AGENT.md`, `DECISIONS.md`, `OPERATING-CONSTRAINTS.md`, `tasks/`, `scripts/`,
`docs/`, `modes/`, `memory/`, and `adapters/` all live under `precode/`, not at the
repository root.

Every path written inside a Precode owner file, bead, or protocol is relative to
`precode/`. A bead that names `tasks/todo.md` means `precode/tasks/todo.md`.

### Validation Runs From `precode/`

All Precode commands must be run with `precode/` as the working directory:

```bash
cd precode && bash scripts/validate-memory.sh
cd precode && python3 scripts/file-inventory.py --check
cd precode && bash scripts/session-start.sh
```

Running them from the repository root will fail to resolve active memory. See
`OPERATING-CONSTRAINTS.md` for the session-start constraint.

### Application Code

Application code lives in `frontend/` and `backend/`, siblings of `precode/` at the
repository root — never inside it. Recorded as OQ-4 in `DECISIONS.md`.

- `frontend/` — the browser-based, mobile-responsive web app (OQ-2).
- `backend/` — **absent until an approved backend bead activates.** That absence is
  expected, not incomplete setup. `PRD-001` v1 has no server, no accounts, and no
  external services, so `backend/` stays empty for the whole of that PRD. The
  convention is recorded for scope beyond `PRD-001`.

Neither directory exists yet. Neither should be created before an approved PRD
shard defines the first slice and a bead is activated for it.

### Known Limitation Of This Topology

Agent shim files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) and
`.github/copilot-instructions.md` live under `precode/`. Agent tools discover these
at the repository root or the current working directory, so they load only when the
working directory is inside `precode/`. Whether to also place shims at the
repository root is an open question recorded in `tasks/todo.md`.

`precode/.github/workflows/` would likewise not run as CI; GitHub Actions reads
`.github/workflows/` only at the repository root. No workflows are installed.

## File Placement

| Kind of file | Where it belongs |
|---|---|
| Precode owner, reference, protocol, script, bead, PRD | under `precode/` |
| Generated Precode evidence | `precode/logs/`, `precode/tasks/prds-html/` — gitignored |
| Repository-wide ignore rules | root `.gitignore` |
| Application source code (web app) | `frontend/` |
| Server-side code | `backend/` — only once an approved backend bead exists |
| Raw project evidence | `precode/project-evidence/` — review before committing |

## Naming Conventions

Precode file, bead, and PRD naming follows the package conventions in
`tasks/beads/BEAD-SCHEMA.md` and `tasks/prds/PRD-SHARD-SCHEMA.md`.

Application code is a browser-based, mobile-responsive web app (OQ-2) persisting to
browser `localStorage` (OQ-5), living in `frontend/`. Framework-level naming
conventions will be recorded here once a framework is chosen during Architecture
Shaping.
