/**
 * Sign-in gating, identity, sign-out, and the failure path.
 * Requirements: PRD-002-FR05, UX01, UX02, UX03.
 *
 * These are the behaviours B015 adds. The recorder's own behaviour is unchanged and
 * is covered by the PRD-001 suites; what is new is that it is now behind a session.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { createMemoryApi, flush } from './memoryApi.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

let api
let screen

async function mountFresh(options) {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  api = createMemoryApi(options)
  screen = mount(document, api)
  await screen.ready
  return screen
}

async function signIn(username = 'demo', passcode = 'let-me-in') {
  document.querySelector('#username').value = username
  document.querySelector('#passcode').value = passcode
  document
    .querySelector('#signin-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
  await flush()
}

async function record(sku, quantity) {
  document.querySelector('#sku').value = sku
  document.querySelector('#quantity').value = quantity
  document
    .querySelector('#entry-form')
    .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
  await flush()
}

const signedOut = () =>
  document.querySelector('#signin-screen').hidden === false &&
  document.querySelector('#app-screen').hidden === true

beforeEach(async () => {
  await mountFresh({ signedIn: false })
})

describe('the recorder is not reachable without a session — PRD-002-FR05', () => {
  it('shows the sign-in screen and hides the recorder when signed out', () => {
    expect(signedOut()).toBe(true)
  })

  it('shows the recorder after a correct sign-in', async () => {
    await signIn()
    expect(signedOut()).toBe(false)
    expect(document.querySelector('#app-screen').hidden).toBe(false)
  })

  it('stays on the sign-in screen when the passcode is wrong', async () => {
    await signIn('demo', 'wrong')
    expect(signedOut()).toBe(true)
    expect(document.querySelector('#signin-error').textContent).toMatch(/did not match/i)
  })

  it('gives the same message for an unknown username as for a wrong passcode', async () => {
    await signIn('demo', 'wrong')
    const wrongPasscode = document.querySelector('#signin-error').textContent
    await mountFresh({ signedIn: false })
    await signIn('nobody', 'let-me-in')
    // A different message here would tell an attacker which usernames exist.
    expect(document.querySelector('#signin-error').textContent).toBe(wrongPasscode)
  })

  it('resumes an existing session without asking again', async () => {
    await mountFresh({ signedIn: true })
    expect(signedOut()).toBe(false)
  })

  it('never keeps the passcode in the field after signing in', async () => {
    await signIn()
    expect(document.querySelector('#passcode').value).toBe('')
  })
})

// Found by hand on 2026-08-04, not by this suite: signing in as a second business
// failed on a browser profile that had saved the first business's passcode, because
// Chrome filled the saved one over the typed one. Confirmed by the split between a
// clean Chrome profile (worked) and an incognito window of the saving profile
// (failed — incognito shares the profile's password store).
describe('a saved passcode cannot be filled for another business', () => {
  it('does not advertise the passcode field as a saved credential', () => {
    const passcode = document.querySelector('#passcode')
    // "current-password" is the attribute that invited the wrong fill.
    expect(passcode.getAttribute('autocomplete')).toBe('new-password')
  })

  it('does not let the browser fill the username either', () => {
    expect(document.querySelector('#username').getAttribute('autocomplete')).toBe('off')
    expect(document.querySelector('#signin-form').getAttribute('autocomplete')).toBe('off')
  })

  it('still keeps the passcode masked', () => {
    expect(document.querySelector('#passcode').type).toBe('password')
  })
})

describe('the signed-in identity is visible — PRD-002-UX02', () => {
  it('shows nothing before signing in', () => {
    expect(document.querySelector('#who').textContent).toBe('')
  })

  it('shows the space on the recorder screen', async () => {
    await signIn()
    expect(document.querySelector('#who').textContent).toBe('demo-space')
  })

  it('keeps the identity visible after recording an entry', async () => {
    await signIn()
    await record('734', '3')
    expect(document.querySelector('#who').textContent).toBe('demo-space')
    expect(document.querySelector('#app-screen').hidden).toBe(false)
  })
})

describe('signing out — PRD-002-FR05', () => {
  it('returns to the sign-in screen', async () => {
    await signIn()
    document.querySelector('#signout').click()
    await flush()
    expect(signedOut()).toBe(true)
  })

  it('clears the entries held in the page', async () => {
    await signIn()
    await record('734', '3')
    expect(screen.entries).toHaveLength(1)
    document.querySelector('#signout').click()
    await flush()
    expect(screen.entries).toHaveLength(0)
  })

  it('leaves no rows rendered for the next person at the till', async () => {
    await signIn()
    await record('734', '3')
    document.querySelector('#signout').click()
    await flush()
    await signIn()
    // Same space, so the day is reloaded from the server rather than lost.
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(1)
  })
})

describe('a failed save never loses what was typed — PRD-002-UX03', () => {
  it('shows a plain message when the request fails', async () => {
    await signIn()
    api.failNext = true
    await record('734', '3')
    expect(document.querySelector('#error').textContent).toMatch(/could not save/i)
  })

  it('keeps the typed SKU and quantity in the fields', async () => {
    await signIn()
    api.failNext = true
    await record('734', '3')
    expect(document.querySelector('#sku').value).toBe('734')
    expect(document.querySelector('#quantity').value).toBe('3')
  })

  it('does not show the entry as recorded when it was not', async () => {
    await signIn()
    api.failNext = true
    await record('734', '3')
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(0)
    expect(screen.entries).toHaveLength(0)
  })

  it('records normally on the retry', async () => {
    await signIn()
    api.failNext = true
    await record('734', '3')
    await record('734', '3')
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(1)
    expect(document.querySelector('#log-rows .qty').textContent).toBe('3')
  })

  it('leaves focus on the SKU field so a retry needs no mouse — UX01', async () => {
    await signIn()
    api.failNext = true
    await record('734', '3')
    expect(document.activeElement.id).toBe('sku')
  })
})

describe('an expired session sends the user back to sign-in — PRD-002-SEC04', () => {
  it('returns to the sign-in screen when a save is refused', async () => {
    await signIn()
    api.unauthorizedNext = true
    await record('734', '3')
    expect(signedOut()).toBe(true)
  })

  it('does not claim the entry was saved', async () => {
    await signIn()
    api.unauthorizedNext = true
    await record('734', '3')
    expect(screen.entries).toHaveLength(0)
  })
})
