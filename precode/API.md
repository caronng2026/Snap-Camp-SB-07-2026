# Snap Camp — API
<!-- ANCHOR: api -->

> AUTHORITY: API route rules, server-side boundaries, webhook patterns, and handler conventions for Snap Camp.
> NOT_AUTHORITY: Product scope, route inventory ownership, UI behavior, or schema semantics.
> LOAD_WHEN: Planning or reviewing API-affecting work.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `API.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.3.0
Last updated: 2026-08-04

## There Is No API In v1 — And v2 Adds One

Snap Camp v1 has **no server boundary, no API routes, no webhooks, and no request
handlers**. This is a deliberate decision, not an omission or unfinished work.

It follows from decisions already recorded in `DECISIONS.md`:

- v1 is a browser-only web app (OQ-2).
- Data persists in browser `localStorage` (OQ-5).
- Use is single-device, confirmed with the client (OQ-11).
- `PRD-001-SEC03` requires **zero external network requests**, verified by an
  integration check across a full record-to-export cycle.
- `backend/` exists as a directory convention only and stays unbuilt until an
  approved backend bead (OQ-4).

**That remains true of v1 as built.** `PRD-002`, approved 2026-08-04, introduces a
server boundary for the first time. The conventions below are **decided but not
built** — `backend/` does not exist.

## v2 API Conventions — Decided, Not Built

From the `PRD-002` Architecture Brief. Node with **Fastify**, same origin as the
frontend in both environments.

### The Rule That Comes Before Every Other

**Authorization is decided server-side, before any handler runs** (`PRD-002-SEC02`).
Session middleware rejects unauthenticated requests, and the **space id comes from
the session** — never from the request body, query string, headers, or path.

A route handler never receives a space id it could have been lied to about.

### Route Conventions

- Routes are grouped by resource, not by page.
- Every data route reads and writes through the space-scoped store. There is no
  unscoped data function to call — see `ARCHITECTURE.md`.
- Request bodies are schema-validated at the boundary. Fastify was chosen partly for
  this.
- The frontend and backend share an origin, so requests are same-origin and carry the
  session cookie automatically. No CORS configuration exists or should be added.

### Error Shapes

**Denial responses must be identical for "not yours" and "does not exist"**
(`PRD-002-SEC01`). If they differ, the difference is itself an enumeration oracle and
the isolation guarantee leaks through the error channel.

Error messages must never contain another space's data, and neither must server logs.

### What Is Still Undecided

Route paths, handler file layout, status-code conventions beyond the rule above, and
pagination. These are left to the implementing agent, per the Architecture Brief.

Deployment is deliberately undecided and comes after backend beads are built.
