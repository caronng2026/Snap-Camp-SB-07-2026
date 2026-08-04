/**
 * Integration tests for the entry screen.
 * Requirements: PRD-001-FR03, UX01, UX02; PRD-002-FR05, UX02.
 *
 * PRD-001-SEC02 (no auth) and PRD-001-SEC03 (no network) were reversed by PRD-002 on
 * 2026-08-03. The two sections that asserted them are amended below rather than
 * deleted, so the reversal stays visible in the suite instead of disappearing.
 *
 * The real index.html is loaded rather than a hand-built fixture, so the markup
 * under test is the markup that ships.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { createMemoryApi, flush } from './memoryApi.js'

// jsdom does not give import.meta.url a file: scheme, so resolve from the project root.
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

function type(input, value) {
  input.value = value
}

async function submit() {
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
  await flush()
}

let screen
let api

beforeEach(async () => {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  api = createMemoryApi()
  screen = mount(document, api)
  await screen.ready
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('recording an entry — PRD-001-FR03', () => {
  it('shows a saved entry in today\'s log', async () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    await submit()

    const rows = document.querySelectorAll('#log-rows tr')
    expect(rows).toHaveLength(1)
    expect(rows[0].querySelector('.sku').textContent).toBe('734')
    expect(rows[0].querySelector('.qty').textContent).toBe('3')
  })

  it('renders a numeric SKU with its leading zeros stripped', async () => {
    type(document.querySelector('#sku'), '0091')
    type(document.querySelector('#quantity'), '2')
    await submit()
    expect(document.querySelector('#log-rows .sku').textContent).toBe('91')
  })

  // Amended by B005: 00734 and 734 normalise to the same SKU, so consolidation
  // now merges them into one row rather than showing two.
  it('merges 00734 and 734 into a single consolidated row', async () => {
    for (const sku of ['00734', '734']) {
      type(document.querySelector('#sku'), sku)
      type(document.querySelector('#quantity'), '1')
      await submit()
    }
    const rows = document.querySelectorAll('#log-rows tr')
    expect(rows).toHaveLength(1)
    expect(rows[0].querySelector('.sku').textContent).toBe('734')
    expect(rows[0].querySelector('.qty').textContent).toBe('2')
  })

  it('appends further entries in order', async () => {
    for (const [sku, qty] of [['a', '1'], ['b', '2'], ['c', '3']]) {
      type(document.querySelector('#sku'), sku)
      type(document.querySelector('#quantity'), qty)
      await submit()
    }
    const skus = [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)
    expect(skus).toEqual(['A', 'B', 'C'])
  })

  it('hides the empty-state message once an entry exists', async () => {
    expect(document.querySelector('#empty').hidden).toBe(false)
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    await submit()
    expect(document.querySelector('#empty').hidden).toBe(true)
  })

  it('shows an error and records nothing when the SKU is empty', async () => {
    type(document.querySelector('#sku'), '')
    type(document.querySelector('#quantity'), '3')
    await submit()
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(document.querySelector('#error').textContent).toMatch(/sku/i)
  })

  it('shows an error and records nothing when the quantity is not a number', async () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), 'three')
    await submit()
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(document.querySelector('#error').textContent).toMatch(/quantity/i)
  })

  it('renders the SKU as text, never as markup', async () => {
    type(document.querySelector('#sku'), '<img src=x onerror=1>')
    type(document.querySelector('#quantity'), '1')
    await submit()
    const cell = document.querySelector('#log-rows .sku')
    expect(cell.querySelector('img')).toBeNull()
    // Upper-cased by entry normalisation; the point is that it is text, not markup.
    expect(cell.textContent).toBe('<IMG SRC=X ONERROR=1>')
  })
})

describe('keyboard-first entry — PRD-001-UX01', () => {
  it('returns focus to the SKU field after a successful save', async () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    await submit()
    expect(document.activeElement.id).toBe('sku')
  })

  it('returns focus to the SKU field even when the entry is rejected', async () => {
    type(document.querySelector('#sku'), '')
    type(document.querySelector('#quantity'), '3')
    await submit()
    expect(document.activeElement.id).toBe('sku')
  })

  it('clears both fields after a save so the next entry needs no clearing', async () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    await submit()
    expect(document.querySelector('#sku').value).toBe('')
    expect(document.querySelector('#quantity').value).toBe('')
  })

  // jsdom does not implement real Tab-key navigation, so this asserts the
  // structural preconditions for it. Actual Tab behaviour is manual verification.
  it('places SKU, quantity and submit in that document order with no tabindex override', async () => {
    const focusables = [...document.querySelectorAll('#entry-form input, #entry-form button')]
    expect(focusables.map((el) => el.id || el.type)).toEqual(['sku', 'quantity', 'submit'])
    for (const el of focusables) {
      expect(el.hasAttribute('tabindex')).toBe(false)
      expect(el.disabled).toBe(false)
    }
  })
})

describe('no page reload — PRD-001-UX02', () => {
  it('prevents the form submit default', async () => {
    const event = new window.Event('submit', { bubbles: true, cancelable: true })
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    document.querySelector('#entry-form').dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('updates the log in place, without re-mounting', async () => {
    const tbody = document.querySelector('#log-rows')
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    await submit()
    expect(document.querySelector('#log-rows')).toBe(tbody)
    expect(screen.entries).toHaveLength(1)
  })
})

// PRD-001-SEC02 said "no accounts". PRD-002 introduces a login, so the blanket
// no-auth-field assertion is gone. What survives is the part SEC02 was protecting and
// PRD-002 did not reverse: the recorder itself still collects no personal data.
describe('the recorder collects no personal data — PRD-001-SEC02, as amended', () => {
  it('collects only a SKU and a quantity', async () => {
    const names = [...document.querySelectorAll('#entry-form input')].map((i) => i.name)
    expect(names.sort()).toEqual(['quantity', 'sku'])
  })

  it('asks for no email, name, or contact detail even at sign-in', async () => {
    expect(document.querySelector('input[type="email"]')).toBeNull()
    expect(document.querySelector('input[name="email"]')).toBeNull()
    // A passcode field now exists, deliberately: PRD-002-FR01.
    expect(document.querySelector('#passcode').type).toBe('password')
  })

  it('has no form that would post credentials outside the app', async () => {
    expect(document.querySelector('form[action]')).toBeNull()
  })
})

// PRD-001-SEC03 required zero network requests. PRD-002 reverses that: the whole
// point of v2 is that entries leave the device. What is still worth asserting is
// where they go — the app's own origin, and nowhere else.
describe('requests go to this app and nowhere else — PRD-001-SEC03, as amended', () => {
  it('calls only same-origin /api paths across a full record cycle', async () => {
    const calls = []
    const fetchSpy = vi.fn(async (url) => {
      calls.push(String(url))
      return { ok: true, status: 200, json: async () => ({}) }
    })
    vi.stubGlobal('fetch', fetchSpy)

    // The real api module, not the double — the point is which URLs it builds.
    const { createApi } = await import('../src/api.js')
    const realApi = createApi(fetchSpy)
    await realApi.addEntry({ sku: '734', quantity: 5, dayKey: '2026-08-04' })
    await realApi.log('2026-08-04')

    expect(calls.length).toBeGreaterThan(0)
    for (const url of calls) {
      expect(url.startsWith('/api/')).toBe(true)
    }
    vi.unstubAllGlobals()
  })

  it('sends no space or tenant identifier from the browser — PRD-002-SEC02', async () => {
    // The space id must come from the session server-side. If the client ever sent
    // one, an attacker could change it, and SEC01 would rest on the browser.
    const bodies = []
    const fetchSpy = vi.fn(async (_url, init) => {
      if (init?.body) bodies.push(String(init.body))
      return { ok: true, status: 200, json: async () => ({}) }
    })
    const { createApi } = await import('../src/api.js')
    const realApi = createApi(fetchSpy)
    await realApi.addEntry({ sku: '734', quantity: 5, dayKey: '2026-08-04' })

    expect(bodies.length).toBeGreaterThan(0)
    for (const body of bodies) {
      expect(body).not.toMatch(/space|tenant|account_id/i)
    }
  })

  it('loads no external stylesheet, script, font, or image', async () => {
    const external = [...document.querySelectorAll('link[href], script[src], img[src]')]
      .map((el) => el.getAttribute('href') || el.getAttribute('src'))
      .filter((url) => /^(https?:)?\/\//.test(url))
    expect(external).toEqual([])
  })
})
