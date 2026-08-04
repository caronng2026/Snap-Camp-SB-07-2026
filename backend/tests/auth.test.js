/**
 * The auth boundary.
 * Requirements: PRD-002-FR01, FR04, SEC02, SEC03, SEC04.
 *
 * These run against the real Atlas cluster in a throwaway database, because the
 * thing under test is server-side enforcement and a fake would agree with whatever
 * it was told — the lesson recorded in B006.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import { createApp } from '../src/app.js'
import { createLogin } from '../src/auth.js'

const DB_NAME = 'snapcamp_test_auth'
let client
let db
let app

beforeAll(async () => {
  client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  await client.connect()
  db = client.db(DB_NAME)
  app = createApp({ db, sessionSecret: 'test-secret' })
  await app.ready()
})

afterAll(async () => {
  await db.dropDatabase().catch(() => {})
  await app?.close()
  await client?.close()
})

beforeEach(async () => {
  await db.collection('logins').deleteMany({})
  await db.collection('sessions').deleteMany({})
})

const login = (payload) =>
  app.inject({ method: 'POST', url: '/api/auth/login', payload })

const cookieFrom = (res) => res.cookies.find((c) => c.name === 'sc_session')

describe('credentials are never recoverable — PRD-002-SEC03', () => {
  it('stores a bcrypt hash, not the passcode', async () => {
    await createLogin(db, { username: 'shop-a', passcode: 'hunter2', spaceId: 'space-a' })
    const stored = await db.collection('logins').findOne({ username: 'shop-a' })
    expect(stored.passcode_hash).toBeTruthy()
    expect(stored.passcode_hash).not.toBe('hunter2')
    expect(JSON.stringify(stored)).not.toContain('hunter2')
    expect(await bcrypt.compare('hunter2', stored.passcode_hash)).toBe(true)
  })

  it('never returns the passcode in a response', async () => {
    await createLogin(db, { username: 'shop-a', passcode: 'hunter2', spaceId: 'space-a' })
    const res = await login({ username: 'shop-a', passcode: 'hunter2' })
    expect(res.body).not.toContain('hunter2')
    expect(JSON.stringify(res.headers)).not.toContain('hunter2')
  })
})

describe('signing in — PRD-002-FR01', () => {
  beforeEach(async () => {
    await createLogin(db, { username: 'shop-a', passcode: 'hunter2', spaceId: 'space-a' })
  })

  it('returns a session for correct credentials', async () => {
    const res = await login({ username: 'shop-a', passcode: 'hunter2' })
    expect(res.statusCode).toBe(204)
    expect(cookieFrom(res)).toBeTruthy()
  })

  it('refuses a wrong passcode, with no session', async () => {
    const res = await login({ username: 'shop-a', passcode: 'wrong' })
    expect(res.statusCode).toBe(401)
    expect(cookieFrom(res)).toBeUndefined()
  })

  it('refuses an unknown username identically to a wrong passcode', async () => {
    const wrongPass = await login({ username: 'shop-a', passcode: 'wrong' })
    const noSuchUser = await login({ username: 'nobody', passcode: 'wrong' })
    expect(noSuchUser.statusCode).toBe(wrongPass.statusCode)
    expect(noSuchUser.body).toBe(wrongPass.body)
  })

  it('issues an HTTP-only cookie', async () => {
    const res = await login({ username: 'shop-a', passcode: 'hunter2' })
    expect(cookieFrom(res).httpOnly).toBe(true)
  })

  it('binds the session to exactly one space', async () => {
    await login({ username: 'shop-a', passcode: 'hunter2' })
    const sessions = await db.collection('sessions').find({}).toArray()
    expect(sessions).toHaveLength(1)
    expect(sessions[0].space_id).toBe('space-a')
    expect(sessions[0].expires_at).toBeInstanceOf(Date)
  })
})

describe('authorization is server-side — PRD-002-SEC02', () => {
  beforeEach(async () => {
    await createLogin(db, { username: 'shop-a', passcode: 'hunter2', spaceId: 'space-a' })
  })

  it('refuses a protected route with no session', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/session' })
    expect(res.statusCode).toBe(401)
  })

  it('refuses a forged session id', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { sc_session: 'not-a-real-session' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('allows a protected route with a valid session, returning only the space id', async () => {
    const signIn = await login({ username: 'shop-a', passcode: 'hunter2' })
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { sc_session: cookieFrom(signIn).value },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ spaceId: 'space-a' })
  })
})

describe('signing out and expiry — PRD-002-FR04, SEC04', () => {
  let sessionValue

  beforeEach(async () => {
    await createLogin(db, { username: 'shop-a', passcode: 'hunter2', spaceId: 'space-a' })
    sessionValue = cookieFrom(await login({ username: 'shop-a', passcode: 'hunter2' })).value
  })

  it('refuses a replayed session after sign-out', async () => {
    const out = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      cookies: { sc_session: sessionValue },
    })
    expect(out.statusCode).toBe(204)

    const replay = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { sc_session: sessionValue },
    })
    expect(replay.statusCode).toBe(401)
  })

  it('removes the session server-side, not just the cookie', async () => {
    await app.inject({ method: 'POST', url: '/api/auth/logout', cookies: { sc_session: sessionValue } })
    expect(await db.collection('sessions').countDocuments({})).toBe(0)
  })

  it('refuses an expired session', async () => {
    await db.collection('sessions').updateMany({}, { $set: { expires_at: new Date(Date.now() - 1000) } })
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      cookies: { sc_session: sessionValue },
    })
    expect(res.statusCode).toBe(401)
  })
})
