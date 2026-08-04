/**
 * The cross-space attempt suite.
 * Requirement: PRD-002-SEC01.
 *
 * This is the requirement the whole PRD exists for. It is a negative claim over an
 * unbounded set of requests, so what follows bounds the attempts that were thought
 * of — id substitution, enumeration, session reuse, non-existent ids — and nothing
 * more. A passing run is not proof that nothing leaks.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoClient } from 'mongodb'
import { createApp } from '../src/app.js'
import { createLogin } from '../src/auth.js'
import { createStore } from '../src/store.js'

const DB_NAME = 'snapcamp_test_isolation'
let client, db, app, store

const DAY = '2026-08-04'

beforeAll(async () => {
  client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  await client.connect()
  db = client.db(DB_NAME)
  store = createStore(db)
  app = createApp({ db, sessionSecret: 'test-secret' })
  await app.ready()
})

afterAll(async () => {
  await db.dropDatabase().catch(() => {})
  await app?.close()
  await client?.close()
})

async function signIn(username, passcode) {
  const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { username, passcode } })
  return res.cookies.find((c) => c.name === 'sc_session')?.value
}

let cookieA, cookieB

beforeEach(async () => {
  for (const c of ['logins', 'sessions', 'entries']) await db.collection(c).deleteMany({})
  await createLogin(db, { username: 'shop-a', passcode: 'pass-a', spaceId: 'space-a' })
  await createLogin(db, { username: 'shop-b', passcode: 'pass-b', spaceId: 'space-b' })
  cookieA = await signIn('shop-a', 'pass-a')
  cookieB = await signIn('shop-b', 'pass-b')
  await store.addEntry('space-a', { sku: 'SECRET-A', quantity: 11 }, DAY)
  await store.addEntry('space-b', { sku: 'SECRET-B', quantity: 22 }, DAY)
})

const get = (url, cookie) =>
  app.inject({ method: 'GET', url, ...(cookie ? { cookies: { sc_session: cookie } } : {}) })

describe('a space sees only its own data', () => {
  it('returns only space A\'s entries to space A', async () => {
    const res = await get(`/api/log/${DAY}`, cookieA)
    expect(res.statusCode).toBe(200)
    expect(res.body).toContain('SECRET-A')
    expect(res.body).not.toContain('SECRET-B')
  })

  it('returns only space B\'s entries to space B', async () => {
    const res = await get(`/api/log/${DAY}`, cookieB)
    expect(res.body).toContain('SECRET-B')
    expect(res.body).not.toContain('SECRET-A')
  })

  it('writes to the session\'s space, whatever the body claims', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/entries',
      cookies: { sc_session: cookieA },
      // A hostile client naming another space explicitly.
      payload: { sku: 'INJECTED', quantity: 1, dayKey: DAY, spaceId: 'space-b', space_id: 'space-b' },
    })
    const b = await get(`/api/log/${DAY}`, cookieB)
    expect(b.body).not.toContain('INJECTED')
    const a = await get(`/api/log/${DAY}`, cookieA)
    expect(a.body).toContain('INJECTED')
  })
})

describe('id substitution and enumeration are refused', () => {
  it('ignores a space id supplied in the query string', async () => {
    const res = await get(`/api/log/${DAY}?spaceId=space-b&space_id=space-b`, cookieA)
    expect(res.body).not.toContain('SECRET-B')
  })

  it('ignores a space id supplied in a header', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/log/${DAY}`,
      cookies: { sc_session: cookieA },
      headers: { 'x-space-id': 'space-b', 'x-space': 'space-b' },
    })
    expect(res.body).not.toContain('SECRET-B')
  })

  it('gives nothing distinguishable when enumerating day keys', async () => {
    const mine = await get(`/api/log/${DAY}`, cookieA)
    const empty = await get('/api/log/2020-01-01', cookieA)
    expect(mine.statusCode).toBe(empty.statusCode)
    expect(empty.json()).toEqual({ entries: [] })
  })

  it('refuses a malformed day key without revealing whether data exists', async () => {
    const bad = await get('/api/log/not-a-date', cookieA)
    expect(bad.statusCode).toBe(400)
    expect(bad.body).not.toContain('SECRET')
  })
})

describe('session misuse is refused', () => {
  it('refuses a forged session', async () => {
    const res = await get(`/api/log/${DAY}`, 'forged-session-value')
    expect(res.statusCode).toBe(401)
    expect(res.body).not.toContain('SECRET')
  })

  it('refuses no session at all', async () => {
    const res = await get(`/api/log/${DAY}`)
    expect(res.statusCode).toBe(401)
  })

  it('refuses a session replayed after sign-out', async () => {
    await app.inject({ method: 'POST', url: '/api/auth/logout', cookies: { sc_session: cookieA } })
    const res = await get(`/api/log/${DAY}`, cookieA)
    expect(res.statusCode).toBe(401)
    expect(res.body).not.toContain('SECRET-A')
  })

  it('refuses an expired session', async () => {
    await db.collection('sessions').updateMany({}, { $set: { expires_at: new Date(Date.now() - 1000) } })
    const res = await get(`/api/log/${DAY}`, cookieA)
    expect(res.statusCode).toBe(401)
  })
})

describe('denials are indistinguishable', () => {
  // If "not yours" and "does not exist" differ, the difference is an enumeration
  // oracle and the guarantee leaks through the error channel.
  it('returns byte-identical responses for a forged session and an absent one', async () => {
    const forged = await get(`/api/log/${DAY}`, 'forged-session-value')
    const absent = await get(`/api/log/${DAY}`)
    expect(forged.statusCode).toBe(absent.statusCode)
    expect(forged.body).toBe(absent.body)
  })

  it('never names a space id in an error response', async () => {
    for (const res of [
      await get(`/api/log/${DAY}`, 'forged'),
      await get('/api/log/not-a-date', cookieA),
      await get(`/api/log/${DAY}`),
    ]) {
      expect(res.body).not.toContain('space-a')
      expect(res.body).not.toContain('space-b')
    }
  })
})
