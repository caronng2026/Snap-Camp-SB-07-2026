/**
 * Daily Inventory Recorder — entry screen.
 * Bead: B002. Requirements: FR01, FR02, FR03, UX01, UX02, SEC02, SEC03.
 *
 * In-memory only. Persistence is a separate bead and is deliberately absent here.
 * No network calls, no accounts, no personal data.
 */

import { createEntry } from './entry.js'
import { createLog, addEntry, entriesFor, dateKeyFor } from './dailyLog.js'

/** Wires the screen to a log. Exported so tests can mount it on a document. */
export function mount(root) {
  const form = root.querySelector('#entry-form')
  const skuInput = root.querySelector('#sku')
  const quantityInput = root.querySelector('#quantity')
  const errorEl = root.querySelector('#error')
  const rowsEl = root.querySelector('#log-rows')
  const emptyEl = root.querySelector('#empty')
  const dayLabel = root.querySelector('#day-label')

  let log = createLog()
  const dayKey = dateKeyFor()
  if (dayLabel) dayLabel.textContent = dayKey

  function render() {
    const entries = entriesFor(log, dayKey)
    rowsEl.textContent = ''
    // Built with textContent, never innerHTML — a SKU is user input.
    for (const entry of entries) {
      const tr = document.createElement('tr')
      const sku = document.createElement('td')
      sku.className = 'sku'
      sku.textContent = entry.sku
      const qty = document.createElement('td')
      qty.className = 'qty'
      qty.textContent = String(entry.quantity)
      const at = document.createElement('td')
      at.textContent = new Date(entry.timestamp).toLocaleTimeString()
      tr.append(sku, qty, at)
      rowsEl.append(tr)
    }
    emptyEl.hidden = entries.length > 0
  }

  form.addEventListener('submit', (event) => {
    // UX02: update in place. Never reload.
    event.preventDefault()
    errorEl.textContent = ''

    const rawSku = skuInput.value
    const rawQuantity = quantityInput.value.trim()

    // Parse without coercing the SKU. Only the quantity becomes a number.
    const quantity = rawQuantity === '' ? undefined : Number(rawQuantity)

    try {
      const entry = createEntry(rawSku, quantity)
      log = addEntry(log, entry, dayKey)
      render()
      form.reset()
    } catch (error) {
      errorEl.textContent = error.message
    } finally {
      // UX01: the next entry starts without reaching for the mouse.
      skuInput.focus()
    }
  })

  render()
  return {
    get entries() {
      return entriesFor(log, dayKey)
    },
  }
}

if (typeof document !== 'undefined' && document.querySelector('#entry-form')) {
  mount(document)
}
