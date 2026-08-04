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
import { createMemoryApi, flush } from './memoryApi.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

const DAY_ONE = new Date(2026, 7, 3, 14, 0) // 3 Aug 2026, local
const DAY_TWO = new Date(2026, 7, 4, 9, 30) // 4 Aug 2026, local

let api
let screen

async function reload() {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  screen = mount(document, api)
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

const skus = () => [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)

beforeEach(async () => {
  vi.useFakeTimers()
  api = createMemoryApi()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('a new day starts empty — PRD-001-FR06', () => {
  it('does not show yesterday\'s entries today', async () => {
    vi.setSystemTime(DAY_ONE)
    await reload()
    await record('734', '3')
    expect(skus()).toEqual(['734'])

    vi.setSystemTime(DAY_TWO)
    await reload()
    expect(skus()).toEqual([])
    expect(document.querySelector('#empty').hidden).toBe(false)
  })

  it('shows the new date on the new day', async () => {
    vi.setSystemTime(DAY_ONE)
    await reload()
    expect(document.querySelector('#day-label').textContent).toBe('2026-08-03')

    vi.setSystemTime(DAY_TWO)
    await reload()
    expect(document.querySelector('#day-label').textContent).toBe('2026-08-04')
  })

  it('records the new day under its own key', async () => {
    vi.setSystemTime(DAY_ONE)
    await reload()
    await record('734', '3')

    vi.setSystemTime(DAY_TWO)
    await reload()
    await record('91', '1')

    expect(api.days['2026-08-03'].map((e) => e.sku)).toEqual(['734'])
    expect(api.days['2026-08-04'].map((e) => e.sku)).toEqual(['91'])
  })
})

describe('the previous day survives — PRD-001-FR06', () => {
  it('keeps yesterday\'s entries in storage', async () => {
    vi.setSystemTime(DAY_ONE)
    await reload()
    await record('734', '3')
    await record('91', '2')
    const yesterday = JSON.stringify(api.days['2026-08-03'])

    vi.setSystemTime(DAY_TWO)
    await reload()
    await record('1180', '5')

    expect(JSON.stringify(api.days['2026-08-03'])).toBe(yesterday)
  })

  it('never deletes a day key', async () => {
    vi.setSystemTime(DAY_ONE)
    await reload()
    await record('734', '1')
    vi.setSystemTime(DAY_TWO)
    await reload()
    await record('91', '1')
    expect(Object.keys(api.days).sort()).toEqual(['2026-08-03', '2026-08-04'])
  })
})

describe('rolling over while the app stays open', () => {
  // A shop may leave the tab open overnight. Reloading is not a precondition.
  it('empties the log and updates the date without a reload', async () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    await reload()
    await record('734', '3')
    expect(skus()).toEqual(['734'])

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    await vi.advanceTimersByTimeAsync(61_000)
    await flush()

    expect(document.querySelector('#day-label').textContent).toBe('2026-08-04')
    expect(skus()).toEqual([])
  })

  it('writes a post-roll entry to the new day', async () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    await reload()
    await record('734', '3')

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    await vi.advanceTimersByTimeAsync(61_000)
    await flush()
    await record('91', '7')

    expect(api.days['2026-08-03'].map((e) => e.sku)).toEqual(['734'])
    expect(api.days['2026-08-04'].map((e) => e.sku)).toEqual(['91'])
  })

  it('leaves the closing day untouched after the roll', async () => {
    vi.setSystemTime(new Date(2026, 7, 3, 23, 59))
    await reload()
    await record('734', '3')
    const before = JSON.stringify(api.days['2026-08-03'])

    vi.setSystemTime(new Date(2026, 7, 4, 0, 1))
    await vi.advanceTimersByTimeAsync(61_000)
    await flush()
    await record('91', '1')

    expect(JSON.stringify(api.days['2026-08-03'])).toBe(before)
  })
})
