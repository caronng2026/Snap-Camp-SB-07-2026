import { describe, it, expect } from 'vitest'
import { createEntry } from '../src/entry.js'
import { dateKeyFor, createLog, addEntry, entriesFor } from '../src/dailyLog.js'

describe('dateKeyFor — PRD-001-FR06', () => {
  it('keys by local calendar date as YYYY-MM-DD', () => {
    expect(dateKeyFor(new Date(2026, 6, 31, 14, 5))).toBe('2026-07-31')
  })

  it('pads single-digit months and days', () => {
    expect(dateKeyFor(new Date(2026, 0, 5, 9, 0))).toBe('2026-01-05')
  })

  it('rolls to the next key after local midnight', () => {
    const before = dateKeyFor(new Date(2026, 6, 31, 23, 59))
    const after = dateKeyFor(new Date(2026, 7, 1, 0, 1))
    expect(before).toBe('2026-07-31')
    expect(after).toBe('2026-08-01')
    expect(after).not.toBe(before)
  })
})

describe('addEntry — PRD-001-FR03', () => {
  it('appends an entry to the given day', () => {
    const log = addEntry(createLog(), createEntry('00734', 3), '2026-07-31')
    expect(entriesFor(log, '2026-07-31')).toHaveLength(1)
    // 00734 normalises to 734 on entry (amended 2026-07-31).
    expect(entriesFor(log, '2026-07-31')[0].sku).toBe('734')
  })

  it('keeps entries in the order recorded', () => {
    let log = createLog()
    log = addEntry(log, createEntry('a', 1), '2026-07-31')
    log = addEntry(log, createEntry('b', 2), '2026-07-31')
    log = addEntry(log, createEntry('c', 3), '2026-07-31')
    expect(entriesFor(log, '2026-07-31').map((e) => e.sku)).toEqual(['a', 'b', 'c'])
  })

  it('keeps separate days separate', () => {
    let log = createLog()
    log = addEntry(log, createEntry('00734', 1), '2026-07-30')
    log = addEntry(log, createEntry('0091', 2), '2026-07-31')
    expect(entriesFor(log, '2026-07-30')).toHaveLength(1)
    expect(entriesFor(log, '2026-07-31')).toHaveLength(1)
  })

  // "A prior day's entries are never rewritten or removed by the app."
  it('never mutates the log it is given', () => {
    const first = addEntry(createLog(), createEntry('00734', 1), '2026-07-30')
    const snapshot = JSON.stringify(first)
    addEntry(first, createEntry('0091', 5), '2026-07-31')
    expect(JSON.stringify(first)).toBe(snapshot)
  })

  it('leaves a prior day untouched when a new day starts', () => {
    let log = addEntry(createLog(), createEntry('00734', 4), '2026-07-30')
    log = addEntry(log, createEntry('0091', 1), '2026-07-31')
    expect(entriesFor(log, '2026-07-30')[0].quantity).toBe(4)
  })
})

describe('entriesFor', () => {
  it('returns an empty list for a day with no entries', () => {
    expect(entriesFor(createLog(), '2026-07-31')).toEqual([])
  })
})
