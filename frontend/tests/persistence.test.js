/**
 * Reload behaviour of the entry screen.
 * Requirements: PRD-001-NFR01, UX05.
 *
 * A reload is simulated by discarding the DOM and mounting again against the same
 * localStorage — which is what a real refresh does.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { dateKeyFor } from '../src/dailyLog.js'
import { createMemoryStorage } from './memoryStorage.js'

let store

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

// A reload discards the DOM but keeps the store — exactly what a refresh does.
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

function renderedSkus() {
  return [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)
}

beforeEach(() => {
  store = createMemoryStorage()
  reload()
})

describe('entries survive a reload — PRD-001-NFR01', () => {
  it('shows entries recorded before the reload', () => {
    record('00734', '3')
    expect(renderedSkus()).toEqual(['734'])

    reload()
    expect(renderedSkus()).toEqual(['734'])
  })

  it('keeps every entry, in order, across a reload', () => {
    record('734', '1')
    record('91', '2')
    record('1180', '3')
    reload()
    expect(renderedSkus()).toEqual(['734', '91', '1180'])
  })

  it('keeps quantities across a reload', () => {
    record('734', '12')
    reload()
    expect(document.querySelector('#log-rows .qty').textContent).toBe('12')
  })

  it('keeps a SKU a string across a reload', () => {
    record('00734', '1')
    const after = reload()
    expect(typeof after.entries[0].sku).toBe('string')
    expect(after.entries[0].sku).toBe('734')
  })

  it('hides the empty-state message after a reload when entries exist', () => {
    record('734', '1')
    reload()
    expect(document.querySelector('#empty').hidden).toBe(true)
  })

  it('starts empty when nothing was ever recorded', () => {
    reload()
    expect(renderedSkus()).toEqual([])
    expect(document.querySelector('#empty').hidden).toBe(false)
  })
})

describe('active day and last-saved indicator — PRD-001-UX05', () => {
  it('shows the current local business day', () => {
    expect(document.querySelector('#day-label').textContent).toBe(dateKeyFor())
  })

  it('shows nothing saved yet before the first entry', () => {
    expect(document.querySelector('#last-saved').textContent).toMatch(/not saved|no entries/i)
  })

  it('shows a last-saved time after an entry is recorded', () => {
    record('734', '1')
    expect(document.querySelector('#last-saved').textContent).toMatch(/saved/i)
    expect(document.querySelector('#last-saved').textContent).not.toMatch(/not saved/i)
  })

  it('advances the last-saved time on a later write', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-31T10:00:00Z'))
    record('734', '1')
    const first = document.querySelector('#last-saved').dataset.savedAt

    vi.setSystemTime(new Date('2026-07-31T10:05:00Z'))
    record('91', '2')
    const second = document.querySelector('#last-saved').dataset.savedAt

    expect(second).not.toBe(first)
    expect(new Date(second).getTime()).toBeGreaterThan(new Date(first).getTime())
    vi.useRealTimers()
  })

  it('still shows a last-saved time after a reload', () => {
    record('734', '1')
    reload()
    expect(document.querySelector('#last-saved').textContent).toMatch(/saved/i)
  })
})

describe('storage stays local — PRD-001-SEC03', () => {
  it('makes no network call across a record-and-reload cycle', () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    record('734', '1')
    reload()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
