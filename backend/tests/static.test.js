/**
 * Serving the built frontend from the backend.
 * Bead: B016. Requirement: PRD-002-FR05.
 *
 * This is what makes production same-origin. The session cookie is SameSite=Strict
 * and there is no CORS anywhere, so if the app were served from another origin the
 * browser would not send the cookie and every request would 401.
 *
 * The static handler is hand-rolled rather than taken from a plugin, because PRD-002
 * fixed the runtime dependency set at three. That makes path containment this
 * module's own responsibility, so it is tested directly and not only through routes.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, isAbsolute } from 'node:path'
import { createApp } from '../src/app.js'
import { DEFAULT_STATIC_ROOT, resolveWithinRoot } from '../src/static.js'

const INDEX = '<!doctype html><title>Daily Inventory Recorder</title><script type="module" src="/assets/app.js"></script>'

let root
let app

/** No Mongo needed: none of these paths reach the database. */
const stubDb = {
  collection: () => ({
    findOne: async () => null,
    insertOne: async () => ({}),
    deleteOne: async () => ({}),
    deleteMany: async () => ({}),
    find: () => ({ toArray: async () => [] }),
    distinct: async () => [],
  }),
}

const makeApp = (staticRoot) =>
  createApp({ db: stubDb, sessionSecret: 'test-only-secret', staticRoot })

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'snapcamp-dist-'))
  await mkdir(join(root, 'assets'), { recursive: true })
  await writeFile(join(root, 'index.html'), INDEX)
  await writeFile(join(root, 'assets', 'app.js'), 'export const x = 1\n')
  await writeFile(join(root, 'assets', 'app.css'), 'body { margin: 0 }\n')
  app = makeApp(root)
  await app.ready()
})

afterAll(async () => {
  await app?.close()
  if (root) await rm(root, { recursive: true, force: true })
})

describe('the app is served at the root — PRD-002-FR05', () => {
  it('serves index.html at /', async () => {
    const res = await app.inject({ method: 'GET', url: '/' })
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/html/)
    expect(res.body).toContain('Daily Inventory Recorder')
  })

  it('serves a built asset with a usable content type', async () => {
    const res = await app.inject({ method: 'GET', url: '/assets/app.js' })
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/javascript/)
    expect(res.body).toContain('export const x')
  })

  it('serves stylesheets as CSS, not as a download', async () => {
    const res = await app.inject({ method: 'GET', url: '/assets/app.css' })
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/css/)
  })

  it('falls back to the app for a client-side route', async () => {
    const res = await app.inject({ method: 'GET', url: '/some/deep/route' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toContain('Daily Inventory Recorder')
  })
})

describe('the API is never shadowed by the static handler', () => {
  it('still answers a real API route', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/session' })
    // No cookie, so 401 — the point is that the API answered, not the file server.
    expect(res.statusCode).toBe(401)
    expect(res.json()).toEqual({ error: 'unauthorized' })
  })

  it('404s an unknown /api path as JSON rather than serving the app', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/does-not-exist' })
    expect(res.statusCode).toBe(404)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).not.toContain('Daily Inventory Recorder')
  })

  it('does not let an /api path reach the SPA fallback under any method', async () => {
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
      const res = await app.inject({ method, url: '/api/nope' })
      expect(res.body).not.toContain('Daily Inventory Recorder')
    }
  })

  it('serves the app and the API from one origin, so the cookie is carried', async () => {
    const page = await app.inject({ method: 'GET', url: '/' })
    const api = await app.inject({ method: 'GET', url: '/api/auth/session' })
    // Both answered by the same server. Same-origin is structural here, not configured.
    expect(page.statusCode).toBe(200)
    expect(api.statusCode).toBe(401)
    // The app must not reference another origin for its own assets.
    expect(page.body).not.toMatch(/(src|href)=["']https?:\/\//)
  })
})

describe('path containment', () => {
  it('resolves an ordinary path inside the root', () => {
    expect(resolveWithinRoot(root, '/assets/app.js')).toBe(resolve(root, 'assets/app.js'))
  })

  it('refuses to escape the root with ..', () => {
    expect(resolveWithinRoot(root, '/../../../../etc/passwd')).toBeNull()
    expect(resolveWithinRoot(root, '/assets/../../secret')).toBeNull()
  })

  it('refuses percent-encoded traversal', () => {
    expect(resolveWithinRoot(root, '/%2e%2e%2f%2e%2e%2fetc/passwd')).toBeNull()
    expect(resolveWithinRoot(root, '/assets%2f..%2f..%2fsecret')).toBeNull()
  })

  it('refuses a null byte', () => {
    expect(resolveWithinRoot(root, '/index.html\u0000.js')).toBeNull()
  })

  it('refuses a path that merely starts with the root name', () => {
    // /rootname-evil must not pass a naive startsWith check.
    expect(resolveWithinRoot(root, '/../' + root.split('/').pop() + '-evil/x')).toBeNull()
  })

  it('does not serve a file outside the root over HTTP', async () => {
    for (const url of ['/../../../../etc/passwd', '/%2e%2e%2f%2e%2e%2fetc%2fpasswd']) {
      const res = await app.inject({ method: 'GET', url })
      expect(res.body).not.toContain('root:')
    }
  })
})

describe('an unbuilt frontend fails clearly', () => {
  it('names the cause rather than 404ing', async () => {
    const missing = join(root, 'not-built-yet')
    expect(() => makeApp(missing)).toThrowError(/build|not built|frontend/i)
  })

  it('still starts with no static root at all, for API-only use', async () => {
    const apiOnly = makeApp(undefined)
    await apiOnly.ready()
    const res = await apiOnly.inject({ method: 'GET', url: '/api/auth/session' })
    expect(res.statusCode).toBe(401)
    await apiOnly.close()
  })
})

describe('the build output location is agreed, not hard-coded', () => {
  it('points at the frontend build directory', () => {
    expect(DEFAULT_STATIC_ROOT.replace(/\\/g, '/')).toMatch(/frontend\/dist$/)
  })

  it('is derived from this module, not from a machine-specific path', async () => {
    // Absolute at runtime is fine and necessary; what matters is that it is computed
    // relative to the source file, so it survives being checked out anywhere.
    expect(isAbsolute(DEFAULT_STATIC_ROOT)).toBe(true)
    const source = await import('node:fs/promises').then((fs) =>
      fs.readFile(new URL('../src/static.js', import.meta.url), 'utf8'),
    )
    expect(source).not.toMatch(/\/Users\/|\/home\/|C:\\\\/)
  })
})
