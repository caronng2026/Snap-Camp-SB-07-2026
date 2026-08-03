/**
 * Day rollover.
 * Requirement: PRD-001-FR06.
 *
 * A real midnight roll cannot be staged by hand, so these tests drive the clock.
 * That is a genuine limit on the evidence and is recorded in the bead.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { entriesFor } from '../src/dailyLog.js'
import { loadState } from '../src/storage.js'
import { createMemoryStorage } from './memoryStorage.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

const DAY_ONE = new Date(2026, 7, 3, 14, 0) // 3 Aug 2026, local
const DAY_TWO = new Date(2026, 7, 4, 9, 30) // 4 Aug 2026, local

let store
let screen

function reload() {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  screen = mount(document, store)
  return screen
}

function record(sku, quantity) {
  document.querySelector('#sku').value = sku
  document.querySelector('#quantity').value = quantity
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
}

const skus = () => [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)

beforeEach(() => {
  vi.useFakeTimers()
  store = createMemoryStorage()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('a new day starts empty — PRD-001-FR06', () => {
  it('does not show yesterday\'s entries today', () => {
    vi.setSystemTime(DAY_ONE)
    reload()
    record('734', '3')
    expect(skus()).toEqual(['734'])

    vi.setSystemTime(DAY_TWO)
    reload()
    expect(skus()).toEqual([])
    expect(document.querySelector('#empty').hidden).toBe(false)
  })

  it('shows the new date on the new day', () => {
    vi.setSystemTime(DAY_ONE)
    reload()
    expect(document.querySelector('#day-label').textContent).toBe('2026-08-03')

    vi.setSystemTime(DAY_TWO)
    reload()
    expect(document.querySelector('#day-label').textContent).toBe('2026-08-04')
  })

  it('records the new day under its own key', () => {
    vi.setSystemTime(DAY_ONE)
    reload()
    record('734', '3')

    vi.setSystemTime(DAY_TWO)
    reload()
    record('91', '1')

    const log = loadState(store).log
    expect(entriesFor(log, '2026-08-03').map((e) => e.sku)).toEqual(['734'])
    expect(entriesFor(log, '2026-08-04').map((e) => e.sku)).toEqual(['91'])
  })
})

describe('the previous day survives — PRD-001-FR06', () => {
  it('keeps yesterday\'s entries in storage', () => {
    vi.setSystemTime(DAY_ONE)
    reload()
    record('734', '3')
    record('91', '2')
    const yesterday = JSON.stringify(entriesFor(loadState(store).log, '2026-08-03'))

    vi.setSystemTime(DAY_TWO)
    reload()
    record('1180', '5')

    expect(JSON.stringify(entriesFor(loadState(store).log, '2026-08-03'))).toBe(yesterday)
  })

  it('never deletes a day key', () => {
    vi.setSystemTime(DAY_ONE)
    reload()
    record('734', '1')
    vi.setSystemTime(DAY_TWO)
    reload()
    record('91', '1')
    expect(Object.keys(loadState(store).log).sort()).toEqual(['2026-08-03', '2026-08-04'])
  })
})

describe('rolling over while the app stays open', () => {
  // A shop may leave the tab open overnight. Reloading is not a precondition.
  it('empties the log and updates the date without a reload', () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    reload()
    record('734', '3')
    expect(skus()).toEqual(['734'])

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    vi.advanceTimersByTime(61_000)

    expect(document.querySelector('#day-label').textContent).toBe('2026-08-04')
    expect(skus()).toEqual([])
  })

  it('writes a post-roll entry to the new day', () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    reload()
    record('734', '3')

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    vi.advanceTimersByTime(61_000)
    record('91', '7')

    const log = loadState(store).log
    expect(entriesFor(log, '2026-08-03').map((e) => e.sku)).toEqual(['734'])
    expect(entriesFor(log, '2026-08-04').map((e) => e.sku)).toEqual(['91'])
  })

  it('leaves the closing day untouched after the roll', () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    reload()
    record('734', '3')
    const before = JSON.stringify(entriesFor(loadState(store).log, '2026-08-03'))

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    vi.advanceTimersByTime(61_000)
    record('91', '1')

    expect(JSON.stringify(entriesFor(loadState(store).log, '2026-08-03'))).toBe(before)
  })
})
