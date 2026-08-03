# Snap Camp — Acceptance Criteria
<!-- ANCHOR: acceptance -->

> AUTHORITY: Done checks, verification criteria, and feature completion gates for Snap Camp.
> NOT_AUTHORITY: New product behavior, route design, schema changes, or pricing decisions.
> LOAD_WHEN: Defining or reviewing acceptance criteria for a PRD, feature, or bead.
> CLASS: reference

Creator: Caron Ng
Adapted from the PrecodeOS `ACCEPTANCE.md` template (Apache-2.0, © 2026 Dan Sears / Recode)
Document version: v0.2.0
Last updated: 2026-07-30

## How Acceptance Works Here

Acceptance has two layers, and both must hold before the Daily Inventory Recorder
counts as done.

1. **Requirement-level oracles** — every requirement has an expected behavior and a
   check. The full matrix, including fixtures and "what this does not prove" for
   each row, lives in `tasks/prds/PRD-001-daily-inventory-recorder.md`. It is not
   duplicated here.
2. **Feature-level completion** — the behavioural signals below, which decide
   whether the product actually works for a real user.

Nothing is proof until it is run through `bash scripts/record-check.sh -- <command>`
and recorded in bead Closeout Evidence. A written criterion, a generated test, a
screenshot, or a passing local run is review input, not acceptance.

## Feature Completion Gate — Daily Inventory Recorder

Source: `PRD-001`, approved 2026-07-30.

**The feature is done when** the anchor partner records one real business day end to
end in the tool and accepts the exported summary as correct.

That single gate implies all of:

- A full day of entries recorded without touching a spreadsheet.
- Repeated SKUs consolidated correctly, with the totals visible in the log.
- An `.xlsx` export that opens in Excel with no repair prompt.
- SKUs with leading zeros preserved exactly — `00734` reads as `00734`, not `734`.
- Entries surviving a reload during the working day.
- A new empty log the next business day, with the prior day still retrievable.

## Behavioural Success Signals

These decide whether the product is worth continuing, and they outrank opinions.
Any one of them is stronger evidence than any amount of positive feedback.

| Signal | Why it counts |
|---|---|
| Returns and uses it again the next business day | Habit, not novelty |
| Enters more items than asked, unprompted | Real work, not a demo |
| Asks to move an assistant's workflow onto it | Trusts it with someone else's time |
| Offers to pay | Demand evidence |

**Signals to slow down or stop:**

| Signal | What it means |
|---|---|
| Completes the tasks but never returns | The value assumption is wrong — not a UI problem |
| Says it is not faster than their sheet | `UX01` is not met; entry speed is the adoption bar |

Record what was observed **before** recording what was said. No leading questions.
Test each partner separately.

## Manual Verification Format

Manual checks must state, per `tasks/reference/VERIFICATION-GUARDRAIL-PROTOCOL.md`:

- who checked
- what was checked
- environment
- result: pass, fail, or blocked
- remaining uncertainty

## Measured Criteria

| Criterion | Status |
|---|---|
| `PRD-001-NFR03` — log renders under 500ms at ~200 entries | **Confirmed 2026-08-03** under `B008`. Median of seven warm renders: 2.2ms at 200 entries, 11.3ms at 1,000, 3.3ms to add one entry to a 200-entry day. Roughly 227x headroom. Measured under jsdom, which does no layout or paint — the figures bound the application's own work, not what a user feels on shop hardware |

## Optional EARS-Style Pattern

When an acceptance criterion is vague, you may rewrite it in an EARS-style shape:

```text
WHEN [condition or event] THE SYSTEM SHALL [observable expected behavior].
```

Examples:

- WHEN a signed-out visitor opens the dashboard URL THE SYSTEM SHALL redirect them to the sign-in page.
- WHEN a user submits an invalid email address THE SYSTEM SHALL show a plain error and keep the form values intact.
- WHEN an import file is missing a required column THE SYSTEM SHALL stop the import and explain which column is missing.

Use this pattern only when it makes the expected behavior easier to verify. Clear non-EARS acceptance criteria remain valid when they are observable and testable. EARS-style wording is not required schema, proof by itself, PRD approval, implementation authority, or a reason to reject otherwise clear acceptance criteria.
