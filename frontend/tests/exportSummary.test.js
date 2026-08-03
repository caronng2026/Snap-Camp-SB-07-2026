/**
 * The daily summary export.
 * Requirements: PRD-001-FR05, NFR02.
 *
 * These tests pin the *rows* handed to the spreadsheet writer, not the bytes it
 * produces. Whether the resulting file opens cleanly in Excel is manual
 * verification — no automated check in this project can settle it.
 */
import { describe, it, expect, vi } from 'vitest'
import { createEntry } from '../src/entry.js'
import { createLog, addEntry, entriesFor } from '../src/dailyLog.js'
import { summaryRows, summaryFilename, HEADER, downloadSummary } from '../src/exportSummary.js'

const day = '2026-08-03'

function logWith(...pairs) {
  let log = createLog()
  for (const [sku, qty] of pairs) log = addEntry(log, createEntry(sku, qty), day)
  return log
}

const cellValues = (rows) => rows.map((r) => r.map((c) => c.value))

describe('summaryRows — PRD-001-FR05', () => {
  it('starts with a header row', () => {
    expect(cellValues(summaryRows([]))[0]).toEqual(HEADER)
  })

  it('writes one row per consolidated SKU, matching the log', () => {
    const rows = summaryRows(entriesFor(logWith(['734', 3], ['734', 2], ['91', 1]), day))
    expect(rows).toHaveLength(3) // header + 2 SKUs
    expect(cellValues(rows)[1][0]).toBe('734')
    expect(cellValues(rows)[1][1]).toBe(5)
    expect(cellValues(rows)[2][0]).toBe('91')
  })

  it('keeps rows in the same order as the log', () => {
    const rows = summaryRows(entriesFor(logWith(['91', 1], ['734', 1], ['91', 5]), day))
    expect(cellValues(rows).slice(1).map((r) => r[0])).toEqual(['91', '734'])
  })

  it('produces only a header row for a day with no entries', () => {
    expect(summaryRows([])).toHaveLength(1)
  })

  // The reason this project uses .xlsx at all: a SKU must never be reinterpreted
  // as a number by Excel.
  it('types every SKU cell as a string', () => {
    const rows = summaryRows(entriesFor(logWith(['734', 1], ['00A12', 2]), day))
    for (const row of rows.slice(1)) {
      expect(row[0].type).toBe(String)
      expect(typeof row[0].value).toBe('string')
    }
  })

  it('preserves a non-numeric SKU exactly', () => {
    const rows = summaryRows(entriesFor(logWith(['00A12', 1]), day))
    expect(cellValues(rows)[1][0]).toBe('00A12')
  })

  it('types quantities as numbers', () => {
    const rows = summaryRows(entriesFor(logWith(['734', 7]), day))
    expect(rows[1][1].type).toBe(Number)
    expect(rows[1][1].value).toBe(7)
  })

  it('includes the entry count and last-recorded time', () => {
    const rows = summaryRows(entriesFor(logWith(['734', 1], ['734', 2]), day))
    expect(rows[1][2].value).toBe(2)
    expect(typeof rows[1][3].value).toBe('string')
  })

  it('does not modify the entries it is given', () => {
    const entries = entriesFor(logWith(['734', 3], ['734', 2]), day)
    const before = JSON.stringify(entries)
    summaryRows(entries)
    expect(JSON.stringify(entries)).toBe(before)
  })
})

describe('summaryFilename', () => {
  it('names the file after the business day', () => {
    expect(summaryFilename(day)).toBe('daily-inventory-2026-08-03.xlsx')
  })
})

describe('downloadSummary actually writes a file', () => {
  // The browser build returns { toBlob, toFile } and only toFile() downloads.
  // Awaiting the writer without calling toFile() silently does nothing — no file,
  // no error. That shipped once; these tests exist so it cannot ship again.
  it('calls toFile with the day-stamped filename', async () => {
    const toFile = vi.fn().mockResolvedValue(undefined)
    const write = vi.fn(() => ({ toFile, toBlob: vi.fn() }))

    await downloadSummary(entriesFor(logWith(['734', 3]), day), day, write)

    expect(write).toHaveBeenCalledOnce()
    expect(toFile).toHaveBeenCalledWith('daily-inventory-2026-08-03.xlsx')
  })

  it('passes the consolidated rows to the writer', async () => {
    const write = vi.fn(() => ({ toFile: vi.fn().mockResolvedValue(undefined) }))
    await downloadSummary(entriesFor(logWith(['734', 3], ['734', 2]), day), day, write)
    const rows = write.mock.calls[0][0]
    expect(rows[1][0].value).toBe('734')
    expect(rows[1][1].value).toBe(5)
  })

  it('surfaces a writer failure rather than swallowing it', async () => {
    const write = vi.fn(() => ({ toFile: vi.fn().mockRejectedValue(new Error('disk full')) }))
    await expect(downloadSummary([], day, write)).rejects.toThrow(/disk full/)
  })
})
