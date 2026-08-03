/**
 * The Excel-ready daily summary.
 * Owner file: precode/ARCHITECTURE.md, precode/DATA-MODELS.md
 *
 * Writes the consolidated day as `.xlsx` (OQ-12). The format matters for one
 * reason above all: SKU cells are typed as text, so a code like `00A12` is never
 * reinterpreted as a number by Excel.
 *
 * Reads from stored entries and changes nothing. Consolidation is derived here the
 * same way the screen derives it, so the file always matches what the user sees.
 */

// The package exposes no "." export — browser and node builds are separate
// entry points. This app is browser-only.
import writeXlsxFile from 'write-excel-file/browser'
import { consolidate } from './consolidate.js'

export const HEADER = ['SKU', 'Total', 'Entries', 'Last recorded']

/**
 * Rows in `write-excel-file` cell form: `{ value, type }`.
 * Row 0 is the header; one row per consolidated SKU after that.
 */
export function summaryRows(entries) {
  const header = HEADER.map((value) => ({ value, type: String, fontWeight: 'bold' }))

  const body = consolidate(entries).map((row) => [
    // type: String is the whole reason this project exports .xlsx rather than .csv.
    { value: row.sku, type: String },
    { value: row.quantity, type: Number },
    { value: row.entryCount, type: Number },
    { value: new Date(row.lastRecordedAt).toLocaleTimeString(), type: String },
  ])

  return [header, ...body]
}

export function summaryFilename(dayKey) {
  return `daily-inventory-${dayKey}.xlsx`
}

/**
 * Triggers the download. Separated from row building so the rows stay testable.
 *
 * The browser build does not write a file directly: `writeXlsxFile(...)` returns
 * `{ toBlob, toFile }`, and only `toFile(fileName)` downloads. Calling it without
 * `.toFile()` silently does nothing — no file and no error — which is exactly the
 * bug this comment exists to prevent recurring.
 */
export async function downloadSummary(entries, dayKey, write = writeXlsxFile) {
  const file = write(summaryRows(entries), {
    columns: [{ width: 18 }, { width: 10 }, { width: 10 }, { width: 16 }],
  })
  await file.toFile(summaryFilename(dayKey))
}
