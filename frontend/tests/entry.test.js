import { describe, it, expect } from 'vitest'
import { createEntry } from '../src/entry.js'

describe('createEntry — PRD-001-FR01, FR02', () => {
  it('stores the SKU exactly as typed', () => {
    expect(createEntry('sock-blue-M', 3).sku).toBe('sock-blue-M')
  })

  // Amended 2026-07-31: leading zeros are stripped for purely numeric SKUs,
  // because 00734 and 734 are the same item. Reverses the original OQ-10 answer.
  it('strips leading zeros from a purely numeric SKU', () => {
    expect(createEntry('00734', 1).sku).toBe('734')
  })

  it('treats 00734 and 734 as the same stored SKU', () => {
    expect(createEntry('00734', 1).sku).toBe(createEntry('734', 1).sku)
  })

  it('normalises an all-zero SKU to a single zero', () => {
    expect(createEntry('000', 1).sku).toBe('0')
  })

  it('leaves a SKU that is not entirely digits exactly as typed', () => {
    expect(createEntry('00A12', 1).sku).toBe('00A12')
  })

  it('keeps the SKU a string — stripping zeros is not converting to a number', () => {
    const entry = createEntry('0091', 1)
    expect(typeof entry.sku).toBe('string')
    expect(entry.sku).toBe('91')
    expect(entry.sku).not.toBe(91)
  })

  it('does not trim or case-fold a non-numeric SKU', () => {
    expect(createEntry('  Ab-01  ', 1).sku).toBe('  Ab-01  ')
  })

  it('records the quantity', () => {
    expect(createEntry('00734', 12).quantity).toBe(12)
  })

  it('records an ISO timestamp', () => {
    const at = new Date('2026-07-31T10:30:00Z')
    expect(createEntry('00734', 1, at).timestamp).toBe(at.toISOString())
  })

  it('rejects an empty SKU', () => {
    expect(() => createEntry('', 1)).toThrow(/sku/i)
  })

  it('rejects a whitespace-only SKU', () => {
    expect(() => createEntry('   ', 1)).toThrow(/sku/i)
  })

  it('rejects a non-numeric quantity', () => {
    expect(() => createEntry('00734', 'three')).toThrow(/quantity/i)
  })

  it('rejects a non-whole quantity', () => {
    // Decimals are OQ-7, still open. v1 is whole numbers only.
    expect(() => createEntry('00734', 1.5)).toThrow(/quantity/i)
  })

  it('rejects a missing quantity', () => {
    expect(() => createEntry('00734')).toThrow(/quantity/i)
  })
})
