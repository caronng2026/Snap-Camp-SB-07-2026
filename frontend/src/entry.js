/**
 * Entry — one record of an item and how many moved.
 * Owner file: precode/DATA-MODELS.md
 *
 * The `sku` is free text and is always a string. Leading zeros are stripped when
 * the SKU is entirely digits, because `00734` and `734` are the same item
 * (amended 2026-07-31, reversing the original OQ-10 answer). A SKU that is not
 * entirely digits is stored exactly as typed.
 *
 * Normalisation happens once, here, on entry. Storage, consolidation, and export
 * all see the already-normalised value and need no zero-handling of their own.
 */

/** `00734` -> `734`, `000` -> `0`, `00A12` -> `00A12`. Never returns a number. */
export function normalizeSku(sku) {
  if (!/^\d+$/.test(sku)) return sku
  const stripped = sku.replace(/^0+/, '')
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
