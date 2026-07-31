import { describe, it, expect } from 'vitest'
import { createEntry } from '../src/entry.js'

describe('createEntry — PRD-001-FR01, FR02', () => {
  it('stores the SKU as a normalised string', () => {
    expect(createEntry('sock-blue-M', 3).sku).toBe('SOCK-BLUE-M')
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

  it('does not strip leading zeros from a SKU that is not entirely digits', () => {
    expect(createEntry('00A12', 1).sku).toBe('00A12')
  })

  it('keeps the SKU a string — stripping zeros is not converting to a number', () => {
    const entry = createEntry('0091', 1)
    expect(typeof entry.sku).toBe('string')
    expect(entry.sku).toBe('91')
    expect(entry.sku).not.toBe(91)
  })

  // Amended 2026-07-31 (second change): SKUs are trimmed and upper-cased on entry,
  // because ac4-100w and AC4-100w are the same item and a trailing space is
  // invisible on screen.
  it('upper-cases the SKU', () => {
    expect(createEntry('ac4-100w', 1).sku).toBe('AC4-100W')
  })

  it('treats differently-cased SKUs as the same stored value', () => {
    expect(createEntry('ac4-100w', 1).sku).toBe(createEntry('AC4-100W', 1).sku)
  })

  it('trims surrounding whitespace', () => {
    expect(createEntry('  AC4-100W  ', 1).sku).toBe('AC4-100W')
  })

  it('treats a padded SKU as the same as an unpadded one', () => {
    expect(createEntry(' ac4-100w ', 1).sku).toBe(createEntry('AC4-100W', 1).sku)
  })

  it('keeps inner spaces', () => {
    expect(createEntry('  blue yarn 4 ', 1).sku).toBe('BLUE YARN 4')
  })

  it('strips leading zeros after trimming, when the result is all digits', () => {
    expect(createEntry('  00734  ', 1).sku).toBe('734')
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
