/**
 * Entry — one record of an item and how many moved.
 * Owner file: precode/DATA-MODELS.md
 *
 * The `sku` is free text and is always a string. It is normalised once, here, on
 * entry, so storage, consolidation, and export all see the same value and need no
 * case, whitespace, or zero handling of their own.
 *
 * Order matters: trim, then upper-case, then strip leading zeros if what remains
 * is entirely digits. Both rules were set on 2026-07-31 after the builder found
 * that `00734`/`734` and `ac4-100w`/`AC4-100w` are the same items.
 */

/**
 * `  ac4-100w ` -> `AC4-100W`, `00734` -> `734`, `000` -> `0`, `00A12` -> `00A12`.
 * Inner spaces are kept. Never returns a number.
 */
export function normalizeSku(sku) {
  const cleaned = sku.trim().toUpperCase()
  if (!/^\d+$/.test(cleaned)) return cleaned
  const stripped = cleaned.replace(/^0+/, '')
  return stripped === '' ? '0' : stripped
}

export function createEntry(sku, quantity, now = new Date()) {
  if (typeof sku !== 'string' || sku.trim() === '') {
    throw new Error('sku is required and cannot be empty')
  }
  if (typeof quantity !== 'number' || !Number.isFinite(quantity)) {
    throw new Error('quantity must be a number')
  }
  if (!Number.isInteger(quantity)) {
    // Decimals and negatives are OQ-7, still open. v1 is whole numbers.
    throw new Error('quantity must be a whole number')
  }

  return {
    sku: normalizeSku(sku), // string always — stripping zeros is not Number()
    quantity,
    timestamp: now.toISOString(),
  }
}
