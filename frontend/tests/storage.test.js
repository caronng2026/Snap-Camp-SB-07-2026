import { describe, it, expect, beforeEach } from 'vitest'
import { createEntry } from '../src/entry.js'
import { createLog, addEntry, entriesFor } from '../src/dailyLog.js'
import { loadState, saveState, STORAGE_KEY } from '../src/storage.js'
import { createMemoryStorage } from './memoryStorage.js'

let store

beforeEach(() => {
  store = createMemoryStorage()
})

describe('saveState / loadState — PRD-001-NFR01', () => {
  it('returns an empty log when nothing is stored', () => {
    expect(loadState(store).log).toEqual(createLog())
    expect(loadState(store).savedAt).toBeNull()
  })

  it('round-trips a log', () => {
    const log = addEntry(createLog(), createEntry('734', 3), '2026-07-31')
    saveState(log, store)
    expect(entriesFor(loadState(store).log, '2026-07-31')).toHaveLength(1)
  })

  // JSON round-tripping is where a normalised SKU could silently become a number
  // again and quietly undo the 2026-07-31 amendment.
  it('round-trips a numeric-looking SKU as a string, never a number', () => {
    saveState(addEntry(createLog(), createEntry('00734', 1), '2026-07-31'), store)
    const sku = entriesFor(loadState(store).log, '2026-07-31')[0].sku
    expect(typeof sku).toBe('string')
    expect(sku).toBe('734')
    expect(sku).not.toBe(734)
  })

  it('records when the save happened', () => {
    const at = new Date('2026-07-31T10:30:00Z')
    saveState(createLog(), store, at)
    expect(loadState(store).savedAt).toBe(at.toISOString())
  })

  it('keeps separate days separate through a round-trip', () => {
    let log = addEntry(createLog(), createEntry('734', 4), '2026-07-30')
    log = addEntry(log, createEntry('91', 1), '2026-07-31')
    saveState(log, store)
    const loaded = loadState(store).log
    expect(entriesFor(loaded, '2026-07-30')[0].quantity).toBe(4)
    expect(entriesFor(loaded, '2026-07-31')[0].quantity).toBe(1)
  })

  it('does not modify a prior day when today is written', () => {
    let log = addEntry(createLog(), createEntry('734', 4), '2026-07-30')
    saveState(log, store)
    const before = JSON.stringify(entriesFor(loadState(store).log, '2026-07-30'))
    log = addEntry(log, createEntry('91', 9), '2026-07-31')
    saveState(log, store)
    expect(JSON.stringify(entriesFor(loadState(store).log, '2026-07-30'))).toBe(before)
  })

  it('falls back to an empty log when stored data is unreadable', () => {
    store.setItem(STORAGE_KEY, 'not json {{{')
    expect(loadState(store).log).toEqual(createLog())
    expect(loadState(store).savedAt).toBeNull()
  })

  it('falls back to an empty log when stored data has the wrong shape', () => {
    store.setItem(STORAGE_KEY, JSON.stringify({ nonsense: true }))
    expect(loadState(store).log).toEqual(createLog())
  })

  it('writes under a single namespaced key', () => {
    saveState(addEntry(createLog(), createEntry('734', 1), '2026-07-31'), store)
    expect(store.keys()).toEqual([STORAGE_KEY])
  })
})
