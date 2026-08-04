/**
 * Reload behaviour of the entry screen.
 * Requirements: PRD-001-NFR01, UX05.
 *
 * A reload is simulated by discarding the DOM and mounting again against the same
 * backend double — which is what a real refresh does now that data is server-side.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { dateKeyFor } from '../src/dailyLog.js'
import { createMemoryApi, flush } from './memoryApi.js'

let api

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

async function reload() {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  const screen = mount(document, api)
  await screen.ready
  return screen
}

async function record(sku, quantity) {
  document.querySelector('#sku').value = sku
  document.querySelector('#quantity').value = quantity
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
  await flush()
}

function renderedSkus() {
  return [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)
}

beforeEach(async () => {
  api = createMemoryApi()
  await reload()
})

describe('entries survive a reload — PRD-001-NFR01', () => {
  it('shows entries recorded before the reload', async () => {
    await record('00734', '3')
    expect(renderedSkus()).toEqual(['734'])

    await reload()
    expect(renderedSkus()).toEqual(['734'])
  })

  it('keeps every entry, in order, across a reload', async () => {
    await record('734', '1')
    await record('91', '2')
    await record('1180', '3')
    await reload()
    expect(renderedSkus()).toEqual(['734', '91', '1180'])
  })

  it('keeps quantities across a reload', async () => {
    await record('734', '12')
    await reload()
    expect(document.querySelector('#log-rows .qty').textContent).toBe('12')
  })

  it('keeps a SKU a string across a reload', async () => {
    await record('00734', '1')
    const after = await reload()
    expect(typeof after.entries[0].sku).toBe('string')
    expect(after.entries[0].sku).toBe('734')
  })

  it('hides the empty-state message after a reload when entries exist', async () => {
    await record('734', '1')
    await reload()
    expect(document.querySelector('#empty').hidden).toBe(true)
  })

  it('starts empty when nothing was ever recorded', async () => {
    await reload()
    expect(renderedSkus()).toEqual([])
    expect(document.querySelector('#empty').hidden).toBe(false)
  })
})

describe('active day and last-saved indicator — PRD-001-UX05', () => {
  it('shows the current local business day', async () => {
    expect(document.querySelector('#day-label').textContent).toBe(dateKeyFor())
  })

  it('shows nothing saved yet before the first entry', async () => {
    expect(document.querySelector('#last-saved').textContent).toMatch(/not saved|no entries/i)
  })

  it('shows a last-saved time after an entry is recorded', async () => {
    await record('734', '1')
    expect(document.querySelector('#last-saved').textContent).toMatch(/saved/i)
    expect(document.querySelector('#last-saved').textContent).not.toMatch(/not saved/i)
  })

  it('advances the last-saved time on a later write', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-31T10:00:00Z'))
    await record('734', '1')
    const first = document.querySelector('#last-saved').dataset.savedAt

    vi.setSystemTime(new Date('2026-07-31T10:05:00Z'))
    await record('91', '2')
    const second = document.querySelector('#last-saved').dataset.savedAt

    expect(second).not.toBe(first)
    expect(new Date(second).getTime()).toBeGreaterThan(new Date(first).getTime())
    vi.useRealTimers()
  })

  it('still shows a last-saved time after a reload', async () => {
    await record('734', '1')
    await reload()
    expect(document.querySelector('#last-saved').textContent).toMatch(/saved/i)
  })
})

describe('storage stays local — PRD-001-SEC03', () => {
  it('makes no network call across a record-and-reload cycle', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    await record('734', '1')
    await reload()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
