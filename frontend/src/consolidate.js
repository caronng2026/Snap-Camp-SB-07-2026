/**
 * Consolidation — combining repeated entries for the same SKU into one total.
 * Owner file: precode/DATA-MODELS.md, precode/ARCHITECTURE.md
 *
 * A pure function applied at read time. Nothing is stored: the original entries
 * stay exactly as recorded and remain inspectable, and totals are derived whenever
 * the log is displayed or exported.
 *
 * Grouping is by exact SKU string. SKUs are already normalised on entry, so
 * `00734` and `734` arrive here identical and need no handling of their own.
 * Case sensitivity, whitespace, and near-match grouping are deliberately
 * undefined in v1 — a bead needing any of those must stop and ask.
 */

/**
 * @returns rows of `{ sku, quantity, entryCount, lastRecordedAt }`, ordered by
 * first appearance so the log still reads in the order things were recorded.
 * Totals are independent of input order.
 */
export function consolidate(entries) {
  const rows = new Map()

  for (const entry of entries) {
    const existing = rows.get(entry.sku)
    if (!existing) {
      rows.set(entry.sku, {
        sku: entry.sku,
        quantity: entry.quantity,
        entryCount: 1,
        lastRecordedAt: entry.timestamp,
      })
      continue
    }
    existing.quantity += entry.quantity
    existing.entryCount += 1
    if (entry.timestamp > existing.lastRecordedAt) {
      existing.lastRecordedAt = entry.timestamp
    }
  }

  return [...rows.values()]
}
