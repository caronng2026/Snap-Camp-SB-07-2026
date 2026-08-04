/**
 * The API client.
 * Requirements: PRD-002-FR05, UX03.
 *
 * fetch is injected so these run without a backend. That means they assert the
 * client's call shape, not the server's contract — B006's lesson. The server's side
 * is covered by backend/tests, and the two meeting is manual verification.
 */
import { describe, it, expect, vi } from 'vitest'
import { createApi, ApiError } from '../src/api.js'

const ok = (body, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => body,
})

describe('signing in', () => {
  it('posts credentials and reports success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(null, 204))
    const api = createApi(fetchImpl)
    await expect(api.signIn('shop-a', 'pass')).resolves.toBe(true)

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('/api/auth/login')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ username: 'shop-a', passcode: 'pass' })
  })

  it('reports failure without throwing, so the screen can show a message', async () => {
    const api = createApi(vi.fn().mockResolvedValue(ok({ error: 'unauthorized' }, 401)))
    await expect(api.signIn('shop-a', 'wrong')).resolves.toBe(false)
  })

  it('never puts credentials in the URL', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(null, 204))
    await createApi(fetchImpl).signIn('shop-a', 'hunter2')
    expect(fetchImpl.mock.calls[0][0]).not.toContain('hunter2')
  })
})

describe('the session', () => {
  it('returns the space id when signed in', async () => {
    const api = createApi(vi.fn().mockResolvedValue(ok({ spaceId: 'space-a' })))
    expect(await api.session()).toEqual({ spaceId: 'space-a' })
  })

  it('returns null when not signed in, rather than throwing', async () => {
    const api = createApi(vi.fn().mockResolvedValue(ok({ error: 'unauthorized' }, 401)))
    expect(await api.session()).toBeNull()
  })
})

describe('reading and writing entries', () => {
  it('reads a day', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ entries: [{ sku: '734', quantity: 3 }] }))
    const entries = await createApi(fetchImpl).log('2026-08-04')
    expect(entries).toEqual([{ sku: '734', quantity: 3 }])
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/log/2026-08-04')
  })

  it('posts an entry without naming a space', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ sku: '734', quantity: 3 }, 201))
    await createApi(fetchImpl).addEntry({ sku: '734', quantity: 3, dayKey: '2026-08-04' })
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body)
    // The space comes from the session. A client that sends one is ignored, but it
    // should not send one at all.
    expect(body).toEqual({ sku: '734', quantity: 3, dayKey: '2026-08-04' })
    expect(Object.keys(body)).not.toContain('spaceId')
  })
})

describe('failures surface — PRD-002-UX03', () => {
  it('throws ApiError when the network is unreachable', async () => {
    const api = createApi(vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(api.addEntry({ sku: '734', quantity: 1, dayKey: '2026-08-04' }))
      .rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError when the server rejects the write', async () => {
    const api = createApi(vi.fn().mockResolvedValue(ok({ error: 'bad_request' }, 400)))
    await expect(api.addEntry({ sku: '', quantity: 1, dayKey: '2026-08-04' }))
      .rejects.toBeInstanceOf(ApiError)
  })

  it('marks a 401 so the screen can return to sign-in', async () => {
    const api = createApi(vi.fn().mockResolvedValue(ok({ error: 'unauthorized' }, 401)))
    await api.addEntry({ sku: '734', quantity: 1, dayKey: '2026-08-04' })
      .then(() => { throw new Error('should have thrown') })
      .catch((e) => expect(e.unauthorized).toBe(true))
  })
})
