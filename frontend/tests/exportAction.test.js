/**
 * The export action on the log view.
 * Requirements: PRD-001-UX04, SEC03.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { entriesFor, dateKeyFor } from '../src/dailyLog.js'
import { loadState } from '../src/storage.js'
import { createMemoryStorage } from './memoryStorage.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

let store

function reload() {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  return mount(document, store)
}

function record(sku, quantity) {
  document.querySelector('#sku').value = sku
  document.querySelector('#quantity').value = quantity
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
}

beforeEach(() => {
  store = createMemoryStorage()
  reload()
})

describe('the export action — PRD-001-UX04', () => {
  it('is present on the log view', () => {
    expect(document.querySelector('#export')).not.toBeNull()
  })

  it('is disabled while the day is empty', () => {
    expect(document.querySelector('#export').disabled).toBe(true)
  })

  it('becomes available as soon as an entry exists', () => {
    record('734', '1')
    expect(document.querySelector('#export').disabled).toBe(false)
  })

  it('is reachable in one step — a single click, no intermediate screen', () => {
    record('734', '1')
    const btn = document.querySelector('#export')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.getAttribute('type')).toBe('button')
    expect(btn.closest('form')).toBeNull() // cannot accidentally submit the entry form
  })
})

describe('exporting does not disturb the log — PRD-001-FR05', () => {
  it('leaves the stored entries untouched', async () => {
    record('734', '3')
    record('734', '2')
    const before = JSON.stringify(entriesFor(loadState(store).log, dateKeyFor()))

    document.querySelector('#export').click()
    await Promise.resolve()

    expect(JSON.stringify(entriesFor(loadState(store).log, dateKeyFor()))).toBe(before)
  })

  it('leaves the rendered log unchanged', async () => {
    record('734', '3')
    const before = document.querySelector('#log-rows').innerHTML
    document.querySelector('#export').click()
    await Promise.resolve()
    expect(document.querySelector('#log-rows').innerHTML).toBe(before)
  })
})

describe('exporting makes no network call — PRD-001-SEC03', () => {
  it('does not fetch during a record-and-export cycle', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    record('734', '1')
    document.querySelector('#export').click()
    await Promise.resolve()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
