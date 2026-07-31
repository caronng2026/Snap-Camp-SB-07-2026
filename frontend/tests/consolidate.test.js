import { describe, it, expect } from 'vitest'
import { createEntry } from '../src/entry.js'
import { consolidate } from '../src/consolidate.js'

const e = (sku, qty, iso = '2026-07-31T10:00:00Z') => createEntry(sku, qty, new Date(iso))

/** Totals as a plain map, so order-independence can be asserted without row order. */
const totals = (rows) => Object.fromEntries(rows.map((r) => [r.sku, r.quantity]))

describe('consolidate — PRD-001-FR04', () => {
  it('combines repeated entries for one SKU into a single row', () => {
    const rows = consolidate([e('734', 3), e('734', 2)])
    expect(rows).toHaveLength(1)
    expect(rows[0].sku).toBe('734')
    expect(rows[0].quantity).toBe(5)
  })

  it('keeps different SKUs separate', () => {
    const rows = consolidate([e('734', 3), e('91', 1), e('1180', 4)])
    expect(rows).toHaveLength(3)
    expect(totals(rows)).toEqual({ 734: 3, 91: 1, 1180: 4 })
  })

  // Order-independence is about the totals, not the row order. Row order follows
  // first appearance so the log still reads in the order things were recorded.
  it('produces the same totals whatever order the entries arrive in', () => {
    const forward = consolidate([e('734', 3), e('91', 1), e('734', 2)])
    const reverse = consolidate([e('734', 2), e('91', 1), e('734', 3)])
    expect(totals(forward)).toEqual(totals(reverse))
  })

  it('preserves the overall total', () => {
    const entries = [e('734', 3), e('91', 1), e('734', 2), e('1180', 7)]
    const sum = (ns) => ns.reduce((a, b) => a + b, 0)
    expect(sum(consolidate(entries).map((r) => r.quantity))).toBe(
      sum(entries.map((x) => x.quantity)),
    )
  })

  it('orders rows by first appearance', () => {
    const rows = consolidate([e('91', 1), e('734', 1), e('91', 5)])
    expect(rows.map((r) => r.sku)).toEqual(['91', '734'])
  })

  it('returns an empty list for a day with no entries', () => {
    expect(consolidate([])).toEqual([])
  })

  // 00734 and 734 already normalise to 734 on entry, so they arrive here identical.
  it('consolidates 00734 and 734 together', () => {
    const rows = consolidate([e('00734', 2), e('734', 3)])
    expect(rows).toHaveLength(1)
    expect(rows[0].sku).toBe('734')
    expect(rows[0].quantity).toBe(5)
  })

  it('compares SKUs as strings, never as numbers', () => {
    const rows = consolidate([e('734', 1), e('0734', 1)])
    expect(rows).toHaveLength(1)
    expect(typeof rows[0].sku).toBe('string')
  })

  it('keeps a non-numeric SKU distinct from a numeric one', () => {
    const rows = consolidate([e('734', 1), e('00A12', 1)])
    expect(rows).toHaveLength(2)
  })

  // Case and padding are settled on entry, so these arrive here already identical.
  it('consolidates differently-cased SKUs together', () => {
    const rows = consolidate([e('ac4-100w', 1), e('AC4-100W', 2)])
    expect(rows).toHaveLength(1)
    expect(rows[0].sku).toBe('AC4-100W')
    expect(rows[0].quantity).toBe(3)
  })

  it('consolidates a padded SKU with an unpadded one', () => {
    const rows = consolidate([e(' ac4-100w ', 1), e('AC4-100W', 4)])
    expect(rows).toHaveLength(1)
    expect(rows[0].quantity).toBe(5)
  })

  it('does not mutate the entries it is given', () => {
    const entries = [e('734', 3), e('734', 2)]
    const before = JSON.stringify(entries)
    consolidate(entries)
    expect(JSON.stringify(entries)).toBe(before)
  })

  it('reports the last time each SKU was recorded', () => {
    const rows = consolidate([
      e('734', 1, '2026-07-31T10:00:00Z'),
      e('734', 1, '2026-07-31T14:30:00Z'),
    ])
    expect(rows[0].lastRecordedAt).toBe(new Date('2026-07-31T14:30:00Z').toISOString())
  })

  it('reports how many entries make up each row', () => {
    const rows = consolidate([e('734', 1), e('734', 1), e('734', 1), e('91', 2)])
    expect(rows.find((r) => r.sku === '734').entryCount).toBe(3)
    expect(rows.find((r) => r.sku === '91').entryCount).toBe(1)
  })
})
