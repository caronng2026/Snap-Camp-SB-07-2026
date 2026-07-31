/**
 * DailyLog — everything recorded for one business day.
 * Owner file: precode/DATA-MODELS.md
 *
 * Keyed by local calendar date. A new key appears automatically at local midnight
 * (OQ-6). Prior days are retained and are never rewritten or removed by the app,
 * so every write returns a new log rather than mutating the one it was given.
 */

/** Local calendar date as YYYY-MM-DD. Local, not UTC — the business day is local. */
export function dateKeyFor(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function createLog() {
  return {}
}

/** Returns a new log with `entry` appended to `key`. Never mutates `log`. */
export function addEntry(log, entry, key = dateKeyFor()) {
  const existing = log[key] ?? []
  return { ...log, [key]: [...existing, entry] }
}

export function entriesFor(log, key) {
  return log[key] ?? []
}
