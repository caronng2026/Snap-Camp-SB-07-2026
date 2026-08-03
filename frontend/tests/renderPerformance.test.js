/**
 * Render performance at scale.
 * Requirement: PRD-001-NFR03.
 *
 * The 500ms bar in the PRD was invented before a framework was chosen and before
 * anything was measured. This measures the real thing.
 *
 * Timings under jsdom are indicative only. jsdom does no layout, paint, or
 * compositing, so a real browser on a shop tablet will differ — probably slower for
 * paint, possibly faster for the DOM work itself. These numbers bound the
 * application's own cost, not the user's experience.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '../src/main.js'
import { createEntry } from '../src/entry.js'
import { createLog, addEntry, dateKeyFor } from '../src/dailyLog.js'
import { saveState } from '../src/storage.js'
import { createMemoryStorage } from './memoryStorage.js'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))

let store

/** A realistic day: many entries, with duplicates, across a smaller set of SKUs. */
function seed(entryCount, distinctSkus) {
  let log = createLog()
  const day = dateKeyFor()
  for (let i = 0; i < entryCount; i += 1) {
    log = addEntry(log, createEntry(String(1000 + (i % distinctSkus)), (i % 9) + 1), day)
  }
  saveState(log, store)
  return log
}

function mountAndTime() {
  document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '')
  const started = performance.now()
  mount(document, store)
  return performance.now() - started
}

beforeEach(() => {
  store = createMemoryStorage()
})

/**
 * Measure a warm render. The first mount in a process pays module and JIT warm-up,
 * which made an early run report 1,000 entries as *faster* than 200 — a clear sign
 * the figure was measuring start-up, not rendering. Median of several passes.
 */
function timeRender(passes = 7) {
  const samples = []
  for (let i = 0; i < passes; i += 1) samples.push(mountAndTime())
  samples.sort((a, b) => a - b)
  return samples[Math.floor(samples.length / 2)]
}

describe('render cost at scale — PRD-001-NFR03', () => {
  it('renders a 200-entry day', () => {
    seed(200, 60)
    const ms = timeRender()
    console.log(`NFR03 measurement — 200 entries / 60 SKUs: ${ms.toFixed(1)}ms (median of 7)`)
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(60)
    // Bar set from the measurement (2.2ms), not the invented 500ms: ~45x headroom
    // catches a real regression while tolerating a slow or busy machine.
    expect(ms).toBeLessThan(100)
  })

  it('renders a 1,000-entry day, matching the anchor partner\'s catalogue size', () => {
    seed(1000, 300)
    const ms = timeRender()
    console.log(`NFR03 measurement — 1000 entries / 300 SKUs: ${ms.toFixed(1)}ms (median of 7)`)
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(300)
    // Measured 11.3ms; ~26x headroom.
    expect(ms).toBeLessThan(300)
  })

  it('stays responsive when an entry is added to a large day', () => {
    seed(200, 60)
    timeRender(3)
    const started = performance.now()
    document.querySelector('#sku').value = '9999'
    document.querySelector('#quantity').value = '1'
    document
      .querySelector('#entry-form')
      .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }))
    const ms = performance.now() - started
    console.log(`NFR03 measurement — one entry added to a 200-entry day: ${ms.toFixed(1)}ms`)
    expect(document.querySelectorAll('#log-rows tr')).toHaveLength(61)
    // This is the one the user actually feels — it happens on every save.
    // Measured 3.3ms; ~15x headroom.
    expect(ms).toBeLessThan(50)
  })
})
