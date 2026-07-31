# Snap Camp — API
<!-- ANCHOR: api -->

> AUTHORITY: API route rules, server-side boundaries, webhook patterns, and handler conventions for Snap Camp.
> NOT_AUTHORITY: Product scope, route inventory ownership, UI behavior, or schema semantics.
> LOAD_WHEN: Planning or reviewing API-affecting work.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `API.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-31

## There Is No API In v1

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

An agent finding this file nearly empty should read that as "there is nothing here
by design," not "this needs filling in."

## What Would Change This

An API boundary becomes relevant only if one of these is reopened:

| Trigger | Consequence |
|---|---|
| Multi-device use | Reopens OQ-11; `localStorage` becomes insufficient |
| A database, including the MongoDB forward-looking note | Reopens OQ-5 and the `backend/` decision |
| Accounts or authentication | Reopens `SEC02` |
| Any external service or integration | Reopens `SEC03` |

Each requires a **PRD amendment or a new PRD** before any route, handler, or
endpoint is written. None may be introduced from inside an implementation bead.

The MongoDB note in `DECISIONS.md` is forward-looking context only. It is not
approval to design a schema, activate `backend/`, or add an API.

## Conventions For A Future API

Not yet decided, and deliberately not pre-specified. When a backend PRD is shaped
and approved, route conventions, handler patterns, validation placement, and error
shapes belong in this file at that point.
