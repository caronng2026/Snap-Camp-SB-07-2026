/**
 * The space-scoped store.
 * Requirements: PRD-002-FR02, FR03, FR06, SEC01.
 *
 * The store must be impossible to call without a space id. These tests assert that
 * structurally, not by convention.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoClient } from 'mongodb'
import * as storeModule from '../src/store.js'
import { createStore, normalizeSku } from '../src/store.js'

const DB_NAME = 'snapcamp_test_store'
let client, db, store

beforeAll(async () => {
  client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  await client.connect()
  db = client.db(DB_NAME)
  store = createStore(db)
})

afterAll(async () => {
  await db.dropDatabase().catch(() => {})
  await client?.close()
})

beforeEach(async () => {
  await db.collection('entries').deleteMany({})
})

describe('the store cannot be called unscoped — PRD-002-SEC01', () => {
  it('rejects a missing space id on every data function', async () => {
    for (const value of [undefined, null, '', '   ']) {
      await expect(store.addEntry(value, { sku: 'A', quantity: 1 }, '2026-08-04')).rejects.toThrow(/space/i)
      await expect(store.entriesFor(value, '2026-08-04')).rejects.toThrow(/space/i)
      await expect(store.daysFor(value)).rejects.toThrow(/space/i)
    }
  })

  it('rejects a non-string space id, so an object cannot smuggle a query operator', async () => {
    // { $ne: null } would otherwise match every document.
    await expect(store.entriesFor({ $ne: null }, '2026-08-04')).rejects.toThrow(/space/i)
    await expect(store.entriesFor(['a', 'b'], '2026-08-04')).rejects.toThrow(/space/i)
  })

  it('exports no raw collection or unscoped query helper', () => {
    const exported = Object.keys(storeModule)
    expect(exported.sort()).toEqual(['createStore', 'normalizeSku'])
    const s = createStore(db)
    // Every function on the store takes a space id first. Nothing hands out a handle.
    for (const [name, value] of Object.entries(s)) {
      expect(typeof value).toBe('function')
      expect(value.length, `${name} must take a space id first`).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('SKU normalisation is server-side — DATA-MODELS.md', () => {
  it('trims, upper-cases, then strips leading zeros when entirely digits', () => {
    expect(normalizeSku('  ac4-100w ')).toBe('AC4-100W')
    expect(normalizeSku('00734')).toBe('734')
    expect(normalizeSku('000')).toBe('0')
    expect(normalizeSku('00A12')).toBe('00A12')
    expect(normalizeSku('  blue yarn 4 ')).toBe('BLUE YARN 4')
  })

  it('normalises on write, because the client is not trusted', async () => {
    await store.addEntry('space-a', { sku: '  00734 ', quantity: 3 }, '2026-08-04')
    const entries = await store.entriesFor('space-a', '2026-08-04')
    expect(entries[0].sku).toBe('734')
    expect(typeof entries[0].sku).toBe('string')
  })
})

describe('spaces are isolated — PRD-002-FR02, FR03', () => {
  beforeEach(async () => {
    await store.addEntry('space-a', { sku: '734', quantity: 3 }, '2026-08-04')
    await store.addEntry('space-b', { sku: '999', quantity: 7 }, '2026-08-04')
  })

  it('does not show space B\'s entries to space A', async () => {
    const a = await store.entriesFor('space-a', '2026-08-04')
    expect(a).toHaveLength(1)
    expect(a[0].sku).toBe('734')
  })

  it('does not show space A\'s entries to space B', async () => {
    const b = await store.entriesFor('space-b', '2026-08-04')
    expect(b).toHaveLength(1)
    expect(b[0].sku).toBe('999')
  })

  it('returns nothing for a space that has no data', async () => {
    expect(await store.entriesFor('space-nonexistent', '2026-08-04')).toEqual([])
  })

  it('keeps days separate within a space', async () => {
    await store.addEntry('space-a', { sku: '91', quantity: 1 }, '2026-08-05')
    expect(await store.entriesFor('space-a', '2026-08-04')).toHaveLength(1)
    expect(await store.entriesFor('space-a', '2026-08-05')).toHaveLength(1)
  })

  it('lists only its own days', async () => {
    await store.addEntry('space-a', { sku: '91', quantity: 1 }, '2026-08-05')
    expect((await store.daysFor('space-a')).sort()).toEqual(['2026-08-04', '2026-08-05'])
    expect(await store.daysFor('space-b')).toEqual(['2026-08-04'])
  })
})

describe('data persists — PRD-002-FR06', () => {
  it('survives a fresh client connection', async () => {
    await store.addEntry('space-a', { sku: '734', quantity: 5 }, '2026-08-04')

    const other = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
    await other.connect()
    try {
      const freshStore = createStore(other.db(DB_NAME))
      const entries = await freshStore.entriesFor('space-a', '2026-08-04')
      expect(entries).toHaveLength(1)
      expect(entries[0].quantity).toBe(5)
    } finally {
      await other.close()
    }
  })
})
