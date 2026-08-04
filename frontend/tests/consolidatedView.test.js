/**
 * The consolidated log as the user sees it.
 * Requirements: PRD-001-FR04, UX03.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { dateKeyFor } from '../src/dailyLog.js'
import { createMemoryApi, flush } from './memoryApi.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

let api

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

const cells = (sel) => [...document.querySelectorAll(`#log-rows ${sel}`)].map((c) => c.textContent)

beforeEach(async () => {
  api = createMemoryApi()
  await reload()
})

describe('consolidated totals are visible in the log — PRD-001-UX03', () => {
  it('shows one row with the summed total when a SKU repeats', async () => {
    await record('734', '3')
    await record('734', '2')
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(1)
    expect(cells('.sku')).toEqual(['734'])
    expect(cells('.qty')[0]).toBe('5')
  })

  it('shows how many entries make up a row, so the merge is not taken on trust', async () => {
    await record('734', '1')
    await record('734', '1')
    await record('734', '1')
    expect(document.querySelector('#log-rows .count').textContent).toBe('3')
  })

  it('keeps different SKUs on separate rows', async () => {
    await record('734', '3')
    await record('91', '1')
    await record('734', '2')
    expect(cells('.sku')).toEqual(['734', '91'])
    expect(cells('.qty').filter((_, i) => i % 2 === 0)).toEqual(['5', '1'])
  })

  it('updates the total in place as the same SKU is entered again', async () => {
    await record('734', '3')
    expect(cells('.qty')[0]).toBe('3')
    await record('734', '4')
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(1)
    expect(cells('.qty')[0]).toBe('7')
  })
})

describe('consolidation is derived, never stored — PRD-001-FR04', () => {
  it('leaves the original entries intact on the server', async () => {
    await record('734', '3')
    await record('734', '2')
    const stored = api.days[dateKeyFor()]
    expect(stored).toHaveLength(2)
    expect(stored.map((e) => e.quantity)).toEqual([3, 2])
  })

  it('still consolidates correctly after a reload', async () => {
    await record('734', '3')
    await record('734', '2')
    await record('91', '1')
    await reload()
    expect(cells('.sku')).toEqual(['734', '91'])
    expect(cells('.qty')[0]).toBe('5')
  })

  it('shows the empty state when a day has no entries', async () => {
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(document.querySelector('#empty').hidden).toBe(false)
  })
})
