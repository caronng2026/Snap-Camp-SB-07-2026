# Snap Camp — Decision Log & Open Questions
<!-- ANCHOR: decisions -->

> AUTHORITY: Hard decisions currently in force, unresolved open questions, and superseded or historical decision context for Snap Camp.
> NOT_AUTHORITY: Detailed route structure, schema field definitions, generated progress state, or active task selection.
> LOAD_WHEN: Making or revisiting any architectural, product, or operating-system decision.
> CLASS: active-memory

Creator: Caron Ng
Adapted from the PrecodeOS `DECISIONS.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-28

## Hard Decisions In Force Now

### Operating Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-26 | Active memory is limited to `AGENT.md`, `DECISIONS.md`, and `tasks/todo.md`. | Keeps agent context small and inspectable. |
| 2026-04-26 | Product features must pass the Product Definition Gate before implementation beads. | Prevents vague ideas from becoming code. |
| 2026-04-26 | Only one bead may be `in_progress`. | Keeps execution bounded and reviewable. |
| 2026-07-24 | PrecodeOS is installed in the `precode/` subfolder, not at the repository root. Application code will live in sibling folders. Precode commands run from `precode/`. | Keeps the control layer separable from application code. Recorded in `PROJECT-CONTEXT.md` and `CODEBASE-GUIDE.md` under bead `B001`. |
| 2026-07-24 | Git hooks and CI are not installed. | A workflow under `precode/.github/` would not run; GitHub Actions reads only the repository root. Revisit as separate approved work. |

### Technical Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-28 | v1 is a **browser-based web app, mobile-responsive** (OQ-2). Not a desktop app, not a native mobile app. | No install or app-store friction, so it can be put in front of the anchor partner fast for the "watch them use it" test. Keyboard-first SKU entry works naturally in a browser; a responsive layout also covers phone use on the shop floor. Native mobile was ruled out for v1 because the core interaction is fast repeated typing, which phone keyboards handle worst. An installable PWA is a later upgrade that needs no rework. |
| 2026-07-28 | v1 persists data in **browser `localStorage`** (OQ-5). Not IndexedDB, not a user-managed file, not a backend database. | Survives reload and browser restart with no dependency, no server, and no setup, satisfying `PRD-001-NFR01`. IndexedDB solves a scale problem that ~200 entries/day does not have. A user-managed file would break the speed bar in `UX01`. A backend database would activate `backend/` and contradict `SEC03`, and is the v2 path. **Condition:** `localStorage` is per-device, per-browser, and can be wiped by clearing browsing data without warning. The daily `.xlsx` export (`FR05`) is therefore the **durable record** — the copy that leaves the browser. **Single-device use confirmed** by the client on 2026-07-28 (OQ-11), so `localStorage` is sufficient for v1 and the backend question stays closed for `PRD-001`. |
| 2026-07-28 | Application code lives in **`frontend/` and `backend/`, siblings to `precode/`** at the repository root (OQ-4). `backend/` stays absent and unbuilt until a backend bead is approved and activated; that absence is expected, not incomplete setup. | Establishes the directory convention once, so later work does not have to relocate code or rewrite path conventions. **Reaffirmed deliberately even though `PRD-001` v1 has no backend work**: `PRD-001` scopes a browser-only slice with no accounts, no external services, and no server (`SEC02`, `SEC03`), so `backend/` will stay empty through this PRD. The convention is recorded for scope beyond `PRD-001`, not for v1. This supersedes the agent's recommendation of a single neutral `app/` folder, which was argued on the basis that v1 alone needs no backend; the builder's decision weighs future scope over v1 minimalism. The principle that an app directory may be intentionally absent until an approved bead creates it is supported by `docs/PRECODE-SUPPORT-RUNBOOK.md:116`; the `frontend/`/`backend/` naming itself is a Snap Camp project decision, not a PrecodeOS convention. |
| 2026-07-28 | "Excel-ready" means a **`.xlsx` file download for v1** (OQ-3, revised by OQ-10). `.csv` is ruled out for v1. Clipboard copy is not the primary output. | The client confirmed the anchor partner's SKUs are **numeric with leading zeros** (OQ-10). Excel strips leading zeros from `.csv` on open, so `00734` would silently become `734` — a wrong item code in the file the product exists to produce. That is a correctness failure, not a formatting preference, and it would destroy trust in the export. `.xlsx` writes the SKU column as text and preserves the codes exactly. **Consequence:** v1 now requires a spreadsheet-writing dependency, which is an explicit approval gate in the `PRD-001` risk model and must be approved before the export bead. The original `.csv`-for-v1 decision is recorded as superseded below. |
| 2026-07-28 | v1 remains **single-device** (OQ-11 confirmed). `localStorage` is sufficient and the `backend/` question stays closed for `PRD-001`. | The client confirmed the anchor partner records on one device only. The condition attached to the OQ-5 persistence decision therefore holds, and no backend or sync work enters v1. |

### Product Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-28 | The **Daily Inventory Recorder** is the canonical v1 scope. The Flexible Inventory Tracker is superseded. | Prototyping showed the dominant value is automatically producing the daily summary, not disambiguating near-identical items. |
| 2026-07-28 | The existing prototype is **design/source evidence only**. Its code is not reused, not preserved, not implementation authority, and not PRD, bead, review, transition, or acceptance approval. | Keeps the prototype as learning evidence without letting unreviewed code become the product. |
| 2026-07-28 | Build v1 for the anchor partner (needlepoint retail). The two witnesses confirm it generalizes. Do not build three variants. | Three industries is a focus trap; the anchor's pain is quantified and specific. |
| 2026-07-28 | SKU transformation and combo/bundle (kit) items are deferred to v2. | Both break the simple SKU model. Witness B gets real value from v1 with combos deferred, at zero cost to v1 scope. |
| 2026-07-28 | Design-partner identities are redacted to roles in this repository: anchor partner (needlepoint retail), witness A (lock manufacturing), witness B (coffee-paper logistics). No real customer names or supplier pricing are stored here. | The source packet sets this rule twice. This repository is committed and pushed. |
| 2026-07-28 | v1 has no authentication, no accounts, no personal data, and no external service calls. | Keeps sensitive surfaces at zero for the first slice. |

## Open Questions

| # | Question | Affects | Status |
|---|---|---|---|
| OQ-2 | What stack and platform — web, desktop, or mobile? | Every bead; `PROJECT-CONTEXT.md`; `ARCHITECTURE.md` | **Resolved 2026-07-28** — browser-based web app, mobile-responsive. See Technical Decisions. `PROJECT-CONTEXT.md` stack fields still need updating during Architecture Shaping. |
| OQ-3 | What does "Excel-ready" mean concretely — `.xlsx`, `.csv`, or clipboard? | `PRD-001-FR05`, `PRD-001-NFR02` | **Resolved 2026-07-28, revised by OQ-10** — `.xlsx` for v1. `.csv` ruled out. See Technical Decisions. |
| OQ-10 | What format are the anchor partner's real SKUs? Specifically, can they contain leading zeros or look purely numeric? | `PRD-001-FR05`; the OQ-3 export decision | **Resolved 2026-07-28** — client confirmed numeric with leading zeros. `.csv` ruled out for v1; export uses `.xlsx`. See Technical Decisions. |
| OQ-4 | Where does the application directory live and what is it called? | `CODEBASE-GUIDE.md`; all beads | **Resolved 2026-07-28** — `frontend/` and `backend/`, siblings to `precode/`. `backend/` unbuilt until an approved backend bead. See Technical Decisions. `CODEBASE-GUIDE.md` still says "to be defined" and needs updating. |
| OQ-5 | How is data persisted — browser storage, local file, or database? | `PRD-001-NFR01`; `DATA-MODELS.md` | **Resolved 2026-07-28** — browser `localStorage`, with the `.xlsx` export as the durable record. Single-device confirmed (OQ-11). See Technical Decisions. |
| OQ-11 | Does the user ever start recording on one device and finish on another — for example the counter computer in the morning and a tablet in the afternoon? | The OQ-5 `localStorage` decision; whether `backend/` is needed in v1 | **Resolved 2026-07-28** — client confirmed single-device only for v1. `localStorage` is sufficient; `backend/` stays out of `PRD-001`. See Technical Decisions and Forward-Looking Notes. |
| OQ-6 | Does a business day roll at midnight local time, or is it user-controlled? | `PRD-001-FR06` | Open — not blocking |
| OQ-7 | Should quantities allow decimals or negatives for returns and corrections? | `PRD-001-FR02` | Open — not blocking |
| OQ-8 | Can an entry be edited or deleted after saving? | `PRD-001-FR03`; destructive-action gate | Open — not blocking |
| OQ-9 | Should agent shim files also exist at the repository root? | Agent discovery outside `precode/` | Open — not blocking |

## Forward-Looking Notes

Not decisions, not requirements, and not v1 scope. Recorded so future planning has the context; **nothing here may pull work into `PRD-001`**.

| Date | Note | Boundary |
|---|---|---|
| 2026-07-28 | The client has stated an intent to move to **MongoDB** in a future v2 or backend phase. | **Not a v1 requirement.** `PRD-001` v1 persists to browser `localStorage` (OQ-5) and is confirmed single-device (OQ-11). No database, no `backend/` work, no schema design, and no data-migration planning belongs in the current PRD. Revisit only when a backend PRD is shaped and approved. Do not treat this note as approval to activate `backend/`, add a dependency, design a schema, or widen any v1 bead. |

## Superseded / Historical Decisions

Historical context only. Do not implement from this section when it conflicts with active decisions above.

| Date | Decision | Superseded By |
|---|---|---|
| 2026-05-03 | PrecodeOS uses the repository root (`.`) as its app/workspace directory. | 2026-07-24 — Snap Camp installs PrecodeOS in `precode/`. The original applied to the PrecodeOS package repository, not to this project. |
| 2026-05-03 | B000 project-specific checks are memory validation, version metadata, file-inventory, and completion/handoff advisory review. | 2026-07-24 — `B001` declares its own checks: `validate-memory.sh` and `file-inventory.py --check`. |
| 2026-05-03 | OQ-1: what app directory and project checks should this scaffold use after installation? | Resolved for Snap Camp by the 2026-07-24 topology decision. |
| 2026-07-28 | "Excel-ready" means a `.csv` file download for v1, with `.xlsx` as a follow-up. | 2026-07-28 — superseded the same day by the OQ-10 answer. The anchor partner's SKUs are numeric with leading zeros, which `.csv` corrupts on open in Excel. v1 uses `.xlsx`. The condition attached to the original decision fired as written. |
| 2026-07-17 | Product scope is the **Flexible Inventory Tracker**: add item with attributes, update count fast, tell near-identical items apart, find an item in seconds. | 2026-07-28 — superseded by the Daily Inventory Recorder scope. The superseded wording still appears in the source packet and its handoff prompt; do not build from it. |
