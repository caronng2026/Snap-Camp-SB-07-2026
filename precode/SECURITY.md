# Snap Camp — Security
<!-- ANCHOR: security -->

> AUTHORITY: Security, privacy, auth, and sensitive-surface rules for Snap Camp, plus the local-execution posture of the vendored PrecodeOS scripts.
> NOT_AUTHORITY: Feature prioritization, route inventory, schema field ownership, or active task selection.
> LOAD_WHEN: Work touches auth, payments, personal data, uploads, destructive actions, external integrations, secrets, production configuration, or local command execution.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `SECURITY.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.3.0
Last updated: 2026-08-04

## Purpose

This file records Snap Camp's security posture and the rules that protect the
design partners' information.

Do not store secrets, credentials, private keys, dashboard values, production
configuration, private customer records, or sensitive raw exports in this file or
anywhere in this repository.

## Sensitive Surfaces — v1 As Built

All surfaces are closed in v1 as built. Each is a recorded decision, not an oversight.
**`PRD-002` reopens several of them for v2** — see the v2 section below.

| Surface | v1 status | Basis |
|---|---|---|
| Auth | **none** — no accounts, roles, or permissions | `PRD-001-SEC02` |
| Payments | **none** | Out of scope |
| Personal data | **none** — inventory counts only | `PRD-001-SEC02` |
| Uploads | **none** — the export is download-only | `PRD-001` |
| Secrets | **none** — no API keys, tokens, or env vars | `PRD-001-SEC03` |
| External services | **none** — zero network requests | `PRD-001-SEC03` |
| Destructive actions | day rollover must never delete a prior day | OQ-6 |

Reopening any of these required a recorded decision, and on 2026-08-03 `SEC02` and
`SEC03` were reopened for `PRD-002` scope only. They remain in force for v1.

## Design-Partner Confidentiality

The product evidence comes from three real businesses. **Their identities must not
appear in this repository.**

Use roles only:

| Role | Never write |
|---|---|
| anchor partner (needlepoint retail) | their real first name or business name |
| witness A (lock manufacturing) | their real first name or business name |
| witness B (coffee-paper logistics) | their real first name or business name |

Also excluded: real supplier pricing, real customer names held by any partner, and
any private client list. Quantified labour costs are retained because they are the
evidence the product rests on; identities are not needed to carry that evidence.

`PRD-001-SEC01` makes this a checked requirement rather than a one-time cleanup:
every bead verifies that fixtures and committed files contain no real partner
identities or supplier pricing. **Use dummy SKUs and dummy costs in all fixtures,
tests, screenshots, and demos.**

This repository is private, but the rule holds regardless — privacy settings change,
and a repository can be shared or forked.

## Verification

| Requirement | How it is checked |
|---|---|
| `SEC01` no partner identities or supplier pricing | static scan of fixtures; review before commit |
| `SEC02` no auth, accounts, or personal data | no auth dependency in the manifest; no personal-data fields in the model |
| `SEC03` no external network request | integration assertion of zero outbound requests across a full record-to-export cycle |

Nothing is proof until run through `bash scripts/record-check.sh -- <command>` and
recorded in bead Closeout Evidence.

## Dependency Posture

v1 permits exactly three development or runtime dependencies: **Vite**, **Vitest**,
and **one spreadsheet writer** for the `.xlsx` export.

The spreadsheet writer is approved in principle only. Before use, the implementing
agent must select it against these criteria and report the choice, licence, and
bundle size for confirmation:

1. writes text-typed cells, so leading-zero SKUs survive
2. permissive licence — MIT or Apache-2.0
3. actively maintained
4. runs in-browser with no server
5. smallest bundle satisfying 1–4

Any dependency beyond those three is an approval gate.

## Vendored PrecodeOS Scripts

`precode/scripts/` contains 77 executable scripts vendored from the PrecodeOS
package. They run locally on this machine, so they are a real local-execution
surface even though the product itself has none.

Posture inherited from the package and unchanged here:

- Read-only by default. Mutating modes require explicit approved action IDs.
- Generated evidence under `logs/`, plus `OS-HEALTH.md`, `PRECODE-HELP.md`,
  `PROGRESS.md`, and generated HTML, must never be treated as approval for tasks,
  commands, transitions, or acceptance.
- GitHub helpers and scheduled audits are read-only unless a separate approved path
  allows mutation.
- No Git hooks and no CI are installed in this repository.

Two known limitations in this subfolder install, recorded in `B001`'s closeout:

- `scripts/files-in-play-check.py` cannot detect drift, because it treats `precode/`
  as the workspace root while `.git` is one level up. Empty output must not be read
  as "no drift" — files-in-play discipline here is manual.
- `scripts/bead-transition.py --approve` drops version metadata from
  `tasks/todo.md` when it rewrites the file.

## Advisory Scanner Set

When the tools are installed, an optional local scan set:

```bash
gitleaks detect --source .
npm audit --prefix ../frontend
```

If a tool is unavailable, record it as unavailable rather than silently skipping it
or installing dependencies without approval. Review scanner output manually before
treating it as a real finding. Scanner output is evidence, not certification.

## v2 Security — Decided, Not Built

From the `PRD-002` Architecture Brief, 2026-08-04. `backend/` does not exist yet.

### What Reopens

| Surface | v2 status |
|---|---|
| Auth | **Introduced.** Username and passcode. No reset, no recovery, no admin (BQ-5) |
| User data | **Leaves the machine and the network.** Inventory data is stored by a third party (Atlas) for the first time |
| Secrets | **Introduced.** A session secret, credential hashes, and a **MongoDB connection string** |
| Network | **Introduced.** The app calls its own backend; the backend calls **MongoDB Atlas over the internet** |
| Destructive | Server-side data loss, and **permanent lockout on a lost passcode** |

Payments and uploads stay closed. The export remains download-only.

### The Isolation Guarantee, And Its Limit

`PRD-002-SEC01`: **no request may read, write, or infer another space's contents —
including through logs, error messages, or response differences.**

How it is enforced:

1. Session middleware rejects before any handler runs.
2. The space id comes from the session. **Never** from body, query, headers, or path.
3. Every data function takes a space id first, and **no unscoped alternative exists
   to call**. Isolation is structural, not a rule to remember.
4. Denial responses are **identical** for "not yours" and "does not exist". A
   difference between them is an enumeration oracle.

**The limit, stated plainly:** this is a negative claim over an unbounded set of
requests. A passing suite means *the attempts we thought of were refused* — not that
nothing leaks. The `SEC01` suite covers id substitution, enumeration, session-token
reuse, and non-existent ids. Paths it does not exercise are uncovered.

**A cross-space leak found at any point, including in development, is an escalation
rather than an ordinary bug.** It is the failure this whole PRD exists to prevent.

### Credentials And Sessions

- Passcodes are stored only as a non-reversible hash. Never logged, never returned,
  never recoverable (`PRD-002-SEC03`).
- Sessions use a signed HTTP-only cookie with a server-side session table. Sign-out
  and expiry invalidate **server-side** (`PRD-002-SEC04`). Client-side sign-out alone
  is not sign-out.
- The session secret and the **Atlas connection string** are secrets. Neither belongs
  in the repository, in a fixture, or in a log. An Atlas connection string carries
  credentials inline, which makes it the likeliest thing to leak by accident — and
  unlike a local file, a leaked one is reachable from anywhere.
- Passcodes are hashed with **bcrypt**. Hashing, not encryption: `PRD-002-SEC03`
  requires that credentials never be stored in recoverable form, and encryption is
  reversible by whoever holds the key.

### No Recovery — An Accepted Consequence

There is no password reset, no forgotten-login recovery, and no operator override
(decision, 2026-08-03). **A business that loses its passcode loses its server data
permanently.** Nobody, including Snap Camp as operator, can restore it.

Partial mitigation: the `.xlsx` export is the durable record, so any day already
exported survives. That only helps if the business exports regularly.

### Dependency Posture For v2

v2 adds exactly three: **`fastify` 5.11.2 (MIT)**, **`mongodb` 7.5.0 (Apache-2.0)**
and **`bcrypt` 6.0.0 (MIT)**. Reported with version, licence, last-published date and
size on 2026-08-04 and approved. Anything beyond these three is a further gate.

**Atlas is a third-party data processor.** Partner inventory data will be stored
there. The redaction rule above still holds — no real partner identities or supplier
pricing anywhere, including in seeded or demo data on Atlas.

