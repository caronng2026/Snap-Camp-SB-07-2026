/**
 * Integration tests for the entry screen.
 * Requirements: PRD-001-FR03, UX01, UX02, SEC02, SEC03.
 *
 * The real index.html is loaded rather than a hand-built fixture, so the markup
 * under test is the markup that ships.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'

// jsdom does not give import.meta.url a file: scheme, so resolve from the project root.
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

function type(input, value) {
  input.value = value
}

function submit() {
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
}

let screen

beforeEach(() => {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  screen = mount(document)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('recording an entry — PRD-001-FR03', () => {
  it('shows a saved entry in today\'s log', () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    submit()

    const rows = document.querySelectorAll('#log-rows tr')
    expect(rows).toHaveLength(1)
    expect(rows[0].querySelector('.sku').textContent).toBe('734')
    expect(rows[0].querySelector('.qty').textContent).toBe('3')
  })

  it('renders a numeric SKU with its leading zeros stripped', () => {
    type(document.querySelector('#sku'), '0091')
    type(document.querySelector('#quantity'), '2')
    submit()
    expect(document.querySelector('#log-rows .sku').textContent).toBe('91')
  })

  // Amended by B005: 00734 and 734 normalise to the same SKU, so consolidation
  // now merges them into one row rather than showing two.
  it('merges 00734 and 734 into a single consolidated row', () => {
    for (const sku of ['00734', '734']) {
      type(document.querySelector('#sku'), sku)
      type(document.querySelector('#quantity'), '1')
      submit()
    }
    const rows = document.querySelectorAll('#log-rows tr')
    expect(rows).toHaveLength(1)
    expect(rows[0].querySelector('.sku').textContent).toBe('734')
    expect(rows[0].querySelector('.qty').textContent).toBe('2')
  })

  it('appends further entries in order', () => {
    for (const [sku, qty] of [['a', '1'], ['b', '2'], ['c', '3']]) {
      type(document.querySelector('#sku'), sku)
      type(document.querySelector('#quantity'), qty)
      submit()
    }
    const skus = [...document.querySelectorAll('#log-rows .sku')].map((c) => c.textContent)
    expect(skus).toEqual(['A', 'B', 'C'])
  })

  it('hides the empty-state message once an entry exists', () => {
    expect(document.querySelector('#empty').hidden).toBe(false)
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    submit()
    expect(document.querySelector('#empty').hidden).toBe(true)
  })

  it('shows an error and records nothing when the SKU is empty', () => {
    type(document.querySelector('#sku'), '')
    type(document.querySelector('#quantity'), '3')
    submit()
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(document.querySelector('#error').textContent).toMatch(/sku/i)
  })

  it('shows an error and records nothing when the quantity is not a number', () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), 'three')
    submit()
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(document.querySelector('#error').textContent).toMatch(/quantity/i)
  })

  it('renders the SKU as text, never as markup', () => {
    type(document.querySelector('#sku'), '<img src=x onerror=1>')
    type(document.querySelector('#quantity'), '1')
    submit()
    const cell = document.querySelector('#log-rows .sku')
    expect(cell.querySelector('img')).toBeNull()
    // Upper-cased by entry normalisation; the point is that it is text, not markup.
    expect(cell.textContent).toBe('<IMG SRC=X ONERROR=1>')
  })
})

describe('keyboard-first entry — PRD-001-UX01', () => {
  it('returns focus to the SKU field after a successful save', () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    submit()
    expect(document.activeElement.id).toBe('sku')
  })

  it('returns focus to the SKU field even when the entry is rejected', () => {
    type(document.querySelector('#sku'), '')
    type(document.querySelector('#quantity'), '3')
    submit()
    expect(document.activeElement.id).toBe('sku')
  })

  it('clears both fields after a save so the next entry needs no clearing', () => {
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '3')
    submit()
    expect(document.querySelector('#sku').value).toBe('')
    expect(document.querySelector('#quantity').value).toBe('')
  })

  // jsdom does not implement real Tab-key navigation, so this asserts the
  // structural preconditions for it. Actual Tab behaviour is manual verification.
  it('places SKU, quantity and submit in that document order with no tabindex override', () => {
    const focusables = [...document.querySelectorAll('#entry-form input, #entry-form button')]
    expect(focusables.map((el) => el.id || el.type)).toEqual(['sku', 'quantity', 'submit'])
    for (const el of focusables) {
      expect(el.hasAttribute('tabindex')).toBe(false)
      expect(el.disabled).toBe(false)
    }
  })
})

describe('no page reload — PRD-001-UX02', () => {
  it('prevents the form submit default', () => {
    const event = new window.Event('submit', { bubbles: true, cancelable: true })
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    document.querySelector('#entry-form').dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('updates the log in place, without re-mounting', () => {
    const tbody = document.querySelector('#log-rows')
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '1')
    submit()
    expect(document.querySelector('#log-rows')).toBe(tbody)
    expect(screen.entries).toHaveLength(1)
  })
})

describe('no accounts or personal data — PRD-001-SEC02', () => {
  it('collects only a SKU and a quantity', () => {
    const names = [...document.querySelectorAll('#entry-form input')].map((i) => i.name)
    expect(names.sort()).toEqual(['quantity', 'sku'])
  })

  it('has no password, email, or auth field anywhere on the screen', () => {
    expect(document.querySelector('input[type="password"]')).toBeNull()
    expect(document.querySelector('input[type="email"]')).toBeNull()
    expect(document.querySelector('form[action]')).toBeNull()
  })
})

describe('no network requests — PRD-001-SEC03', () => {
  it('makes no fetch or XHR call across a full record cycle', () => {
    const fetchSpy = vi.fn()
    const xhrOpen = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.stubGlobal('XMLHttpRequest', class {
      open(...args) { xhrOpen(...args) }
      send() {}
      setRequestHeader() {}
    })

    const fresh = mount(document)
    type(document.querySelector('#sku'), '00734')
    type(document.querySelector('#quantity'), '5')
    submit()

    expect(fresh.entries.length + screen.entries.length).toBeGreaterThan(0)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(xhrOpen).not.toHaveBeenCalled()
  })

  it('loads no external stylesheet, script, font, or image', () => {
    const external = [...document.querySelectorAll('link[href], script[src], img[src]')]
      .map((el) => el.getAttribute('href') || el.getAttribute('src'))
      .filter((url) => /^(https?:)?\/\//.test(url))
    expect(external).toEqual([])
  })
})
