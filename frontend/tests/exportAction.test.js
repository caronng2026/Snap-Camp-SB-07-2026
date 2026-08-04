/**
 * The export action on the log view.
 * Requirements: PRD-001-UX04, SEC03.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
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

beforeEach(async () => {
  api = createMemoryApi()
  await reload()
})

describe('the export action — PRD-001-UX04', () => {
  it('is present on the log view', async () => {
    expect(document.querySelector('#export')).not.toBeNull()
  })

  it('is disabled while the day is empty', async () => {
    expect(document.querySelector('#export').disabled).toBe(true)
  })

  it('becomes available as soon as an entry exists', async () => {
    await record('734', '1')
    expect(document.querySelector('#export').disabled).toBe(false)
  })

  it('is reachable in one step — a single click, no intermediate screen', async () => {
    await record('734', '1')
    const btn = document.querySelector('#export')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.getAttribute('type')).toBe('button')
    expect(btn.closest('form')).toBeNull() // cannot accidentally submit the entry form
  })
})

describe('exporting does not disturb the log — PRD-001-FR05', () => {
  it('leaves the stored entries untouched', async () => {
    await record('734', '3')
    await record('734', '2')
    const before = JSON.stringify(api.days[dateKeyFor()])

    document.querySelector('#export').click()
    await Promise.resolve()

    expect(JSON.stringify(api.days[dateKeyFor()])).toBe(before)
  })

  it('leaves the rendered log unchanged', async () => {
    await record('734', '3')
    const before = document.querySelector('#log-rows').innerHTML
    document.querySelector('#export').click()
    await Promise.resolve()
    expect(document.querySelector('#log-rows').innerHTML).toBe(before)
  })
})

// PRD-001-SEC03 (no network at all) was reversed by PRD-002. Recording now calls the
// server; the export must not. Asserting on a stubbed global `fetch` would prove
// nothing here, because the screen is driven by an injected API double — the stub
// could never be called either way. Counting calls on the double can actually fail.
describe('the export is built client-side — PRD-001-SEC03, as amended', () => {
  it('makes no further API call during export', async () => {
    await record('734', '1')
    const before = api.calls.length

    document.querySelector('#export').click()
    await Promise.resolve()

    expect(before).toBeGreaterThan(0) // the recording did call the server
    expect(api.calls.length).toBe(before) // the export did not
  })
})
