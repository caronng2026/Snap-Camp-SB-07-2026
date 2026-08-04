/**
 * Daily Inventory Recorder — sign-in and entry screen.
 * Beads: B002, B004, B005, B006, B007, B015.
 * Requirements: PRD-001 FR01-FR06, UX01-UX05; PRD-002 FR05, UX01-UX03.
 *
 * Storage moved from browser localStorage to the backend under PRD-002. The
 * recording behaviour PRD-001 defines is preserved exactly — what changed is where
 * the data lives, not how the screen behaves.
 *
 * No offline support, no retry queue, no optimistic write: BQ-7 ruled those out.
 * A failed request must therefore surface plainly and never discard what was typed.
 */

import { createEntry } from './entry.js'
import { dateKeyFor } from './dailyLog.js'
import { consolidate } from './consolidate.js'
import { downloadSummary } from './exportSummary.js'
import { createApi } from './api.js'

const DAY_WATCH_MS = 30_000
let dayWatch = null

export function mount(root, api = createApi()) {
  const signinScreen = root.querySelector('#signin-screen')
  const appScreen = root.querySelector('#app-screen')
  const signinForm = root.querySelector('#signin-form')
  const signinError = root.querySelector('#signin-error')
  const whoEl = root.querySelector('#who')
  const signoutBtn = root.querySelector('#signout')

  const form = root.querySelector('#entry-form')
  const skuInput = root.querySelector('#sku')
  const quantityInput = root.querySelector('#quantity')
  const errorEl = root.querySelector('#error')
  const rowsEl = root.querySelector('#log-rows')
  const emptyEl = root.querySelector('#empty')
  const dayLabel = root.querySelector('#day-label')
  const lastSavedEl = root.querySelector('#last-saved')
  const exportBtn = root.querySelector('#export')

  let entries = []
  let savedAt = null
  let spaceId = null
  const dayKey = () => dateKeyFor()
  let renderedDay = dayKey()

  function showSignIn() {
    signinScreen.hidden = false
    appScreen.hidden = true
    root.querySelector('#username')?.focus()
  }

  function showApp() {
    signinScreen.hidden = true
    appScreen.hidden = false
    if (whoEl) whoEl.textContent = spaceId // UX02: always visible while signed in
    skuInput?.focus()
  }

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
    renderedDay = dayKey()
    if (dayLabel) dayLabel.textContent = renderedDay
    const rows = consolidate(entries)
    rowsEl.textContent = ''
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
      count.textContent = String(row.entryCount)
      const at = document.createElement('td')
      at.textContent = new Date(row.lastRecordedAt).toLocaleTimeString()
      tr.append(sku, qty, count, at)
      rowsEl.append(tr)
    }
    emptyEl.hidden = rows.length > 0
    if (exportBtn) exportBtn.disabled = rows.length === 0
  }

  async function loadDay() {
    const loaded = await api.log(dayKey())
    // The server returns recordedAt; consolidate() expects timestamp.
    entries = loaded.map((e) => ({ ...e, timestamp: e.recordedAt ?? e.timestamp }))
    render()
  }

  /** A 401 at any point means the session ended underneath us. */
  async function withSession(work, onError) {
    try {
      await work()
    } catch (error) {
      if (error?.unauthorized) {
        spaceId = null
        showSignIn()
        return
      }
      onError?.(error)
    }
  }

  signinForm?.addEventListener('submit', async (event) => {
    event.preventDefault()
    signinError.textContent = ''
    const username = root.querySelector('#username').value
    const passcode = root.querySelector('#passcode').value
    try {
      const ok = await api.signIn(username, passcode)
      if (!ok) {
        signinError.textContent = 'That username and passcode did not match.'
        return
      }
      const session = await api.session()
      spaceId = session?.spaceId ?? null
      root.querySelector('#passcode').value = ''
      showApp()
      await withSession(loadDay, () => { errorEl.textContent = 'Could not load today\'s log.' })
    } catch {
      signinError.textContent = 'Could not reach the server.'
    }
  })

  signoutBtn?.addEventListener('click', async () => {
    await api.signOut().catch(() => {})
    spaceId = null
    entries = []
    savedAt = null
    showSignIn()
  })

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorEl.textContent = ''

    const rawSku = skuInput.value
    const rawQuantity = quantityInput.value.trim()
    const quantity = rawQuantity === '' ? undefined : Number(rawQuantity)

    let entry
    try {
      // Validate locally first, so a typo never costs a round trip.
      entry = createEntry(rawSku, quantity)
    } catch (error) {
      errorEl.textContent = error.message
      skuInput.focus()
      return
    }

    await withSession(
      async () => {
        const saved = await api.addEntry({ sku: entry.sku, quantity: entry.quantity, dayKey: dayKey() })
        entries = [...entries, { ...saved, timestamp: saved.recordedAt ?? new Date().toISOString() }]
        savedAt = new Date().toISOString()
        render()
        renderSaved()
        form.reset()
      },
      // UX03: the typed entry stays in the fields. Nothing is discarded silently.
      () => { errorEl.textContent = 'Could not save. Your entry is still here — try again.' },
    )
    skuInput.focus()
  })

  exportBtn?.addEventListener('click', async () => {
    try {
      await downloadSummary(entries, dayKey())
    } catch (error) {
      root.querySelector('#export-status').textContent = `Export failed: ${error.message}`
    }
  })

  if (dayWatch) clearInterval(dayWatch)
  dayWatch = setInterval(() => {
    if (dayKey() !== renderedDay) withSession(loadDay)
  }, DAY_WATCH_MS)

  // Resume an existing session rather than forcing a sign-in on every reload (UX01).
  const ready = (async () => {
    const session = await api.session().catch(() => null)
    if (session?.spaceId) {
      spaceId = session.spaceId
      showApp()
      await withSession(loadDay, () => { errorEl.textContent = 'Could not load today\'s log.' })
    } else {
      showSignIn()
    }
    render()
    renderSaved()
  })()

  return {
    ready,
    get entries() { return entries },
    get spaceId() { return spaceId },
  }
}

if (typeof document !== 'undefined' && document.querySelector('#signin-form')) {
  mount(document)
}
