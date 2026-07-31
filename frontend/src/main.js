/**
 * Daily Inventory Recorder — entry screen.
 * Beads: B002, B004, B005. Requirements: FR01-FR04, UX01-UX03, UX05, NFR01, SEC02, SEC03.
 *
 * Entries persist to browser localStorage so a reload does not lose the day
 * (NFR01), and the screen shows the active day and when it last saved (UX05).
 * No network calls, no accounts, no personal data.
 */

import { createEntry } from './entry.js'
import { addEntry, entriesFor, dateKeyFor } from './dailyLog.js'
import { loadState, saveState } from './storage.js'
import { consolidate } from './consolidate.js'

/**
 * Wires the screen to a log.
 *
 * `storage` is injected rather than reached for as a global. Node 25 ships its own
 * non-functional `localStorage` global that shadows jsdom's under test, and an
 * injected store is easier to verify besides. In the browser the default is the
 * real one.
 */
export function mount(root, storage = globalThis.localStorage) {
  const form = root.querySelector('#entry-form')
  const skuInput = root.querySelector('#sku')
  const quantityInput = root.querySelector('#quantity')
  const errorEl = root.querySelector('#error')
  const rowsEl = root.querySelector('#log-rows')
  const emptyEl = root.querySelector('#empty')
  const dayLabel = root.querySelector('#day-label')
  const lastSavedEl = root.querySelector('#last-saved')

  const restored = loadState(storage)
  let log = restored.log
  let savedAt = restored.savedAt
  const dayKey = dateKeyFor()
  if (dayLabel) dayLabel.textContent = dayKey

  function renderSaved() {
    if (!lastSavedEl) return
    if (!savedAt) {
      lastSavedEl.textContent = 'Not saved yet'
      delete lastSavedEl.dataset.savedAt
      return
    }
    lastSavedEl.textContent = `Saved ${new Date(savedAt).toLocaleTimeString()}`
    lastSavedEl.dataset.savedAt = savedAt
  }

  function render() {
    // Consolidated at read time — the stored entries are never rewritten (FR04).
    const rows = consolidate(entriesFor(log, dayKey))
    rowsEl.textContent = ''
    // Built with textContent, never innerHTML — a SKU is user input.
    for (const row of rows) {
      const tr = document.createElement('tr')
      const sku = document.createElement('td')
      sku.className = 'sku'
      sku.textContent = row.sku
      const qty = document.createElement('td')
      qty.className = 'qty'
      qty.textContent = String(row.quantity)
      const count = document.createElement('td')
      count.className = 'qty count'
      // Shown so the merge is visible rather than something to take on trust (UX03).
      count.textContent = String(row.entryCount)
      const at = document.createElement('td')
      at.textContent = new Date(row.lastRecordedAt).toLocaleTimeString()
      tr.append(sku, qty, count, at)
      rowsEl.append(tr)
    }
    emptyEl.hidden = rows.length > 0
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
      savedAt = saveState(log, storage) ?? savedAt
      render()
      renderSaved()
      form.reset()
    } catch (error) {
      errorEl.textContent = error.message
    } finally {
      // UX01: the next entry starts without reaching for the mouse.
      skuInput.focus()
    }
  })

  render()
  renderSaved()
  return {
    get entries() {
      return entriesFor(log, dayKey)
    },
  }
}

if (typeof document !== 'undefined' && document.querySelector('#entry-form')) {
  mount(document)
}
