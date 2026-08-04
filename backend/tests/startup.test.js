/**
 * Runtime configuration and start-up.
 * Bead: B017. Requirements: PRD-002-SEC03, PRD-002-SEC04.
 *
 * These are the paths that only run on a machine nobody is watching, which is why
 * they are tested here rather than confirmed by hand once. The one that matters most
 * is that no message ever contains a secret: a Mongo connection string carries its
 * credentials inline, so logging the URI when Atlas is unreachable would put a live
 * credential into a hosting platform's log stream.
 *
 * Importing server.js must not start anything. Its side effects sit behind a main
 * guard so the helpers below can be exercised directly.
 */
import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { readConfig, redactUri, configProblem } from '../src/server.js'

const SECRET = 'S3cr3tP4ssw0rd'
const URI = `mongodb+srv://someuser:${SECRET}@cluster0.example.mongodb.net/`

const base = {
  MONGO_URI: URI,
  SESSION_SECRET: 'a-long-random-value',
}

describe('required configuration — PRD-002-SEC04', () => {
  it('reports the connection string by name when it is absent', () => {
    const problem = configProblem(readConfig({ SESSION_SECRET: 'x' }))
    expect(problem).toMatch(/MONGO_URI/)
  })

  it('reports the session secret by name when it is absent', () => {
    const problem = configProblem(readConfig({ MONGO_URI: URI }))
    expect(problem).toMatch(/SESSION_SECRET/)
  })

  it('never invents a session secret', () => {
    // A defaulted secret starts successfully and is identical on every instance,
    // which is worse than one that is absent, because nothing draws attention to it.
    expect(readConfig({ MONGO_URI: URI }).sessionSecret).toBeFalsy()
  })

  it('accepts a complete configuration', () => {
    expect(configProblem(readConfig(base))).toBeNull()
  })
})

describe('listen address', () => {
  it('defaults to loopback, which stays correct for local use', () => {
    expect(readConfig(base).host).toBe('127.0.0.1')
  })

  it('binds where a hosting platform requires when told to', () => {
    expect(readConfig({ ...base, HOST: '0.0.0.0' }).host).toBe('0.0.0.0')
  })

  it('defaults the port and takes one from the environment as a number', () => {
    expect(readConfig(base).port).toBe(3000)
    expect(readConfig({ ...base, PORT: '10000' }).port).toBe(10000)
  })

  it('treats an unusable port as a configuration problem rather than NaN', () => {
    expect(configProblem(readConfig({ ...base, PORT: 'not-a-port' }))).toMatch(/PORT/)
  })
})

describe('the same-origin guard — held by a test, not by hand', () => {
  it('passes when both origins agree', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'https://app.example.com', FRONTEND_ORIGIN: 'https://app.example.com' })
    expect(configProblem(config)).toBeNull()
  })

  it('defaults the frontend origin to the public URL, so they cannot drift', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'https://app.example.com' })
    expect(config.frontendOrigin).toBe('https://app.example.com')
    expect(configProblem(config)).toBeNull()
  })

  it('refuses two different origins', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'https://app.example.com', FRONTEND_ORIGIN: 'https://api.example.com' })
    expect(configProblem(config)).toMatch(/origin/i)
  })

  it('treats a scheme change as a different origin', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'https://app.example.com', FRONTEND_ORIGIN: 'http://app.example.com' })
    expect(configProblem(config)).toMatch(/origin/i)
  })

  it('ignores a path difference, since only the origin matters', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'https://app.example.com/', FRONTEND_ORIGIN: 'https://app.example.com/app' })
    expect(configProblem(config)).toBeNull()
  })

  it('reports an unparseable URL rather than silently allowing it', () => {
    const config = readConfig({ ...base, PUBLIC_URL: 'not a url', FRONTEND_ORIGIN: 'not a url' })
    expect(configProblem(config)).toMatch(/PUBLIC_URL|FRONTEND_ORIGIN|origin/i)
  })
})

describe('no secret is ever printed — PRD-002-SEC03', () => {
  it('masks the password when a connection string is shown', () => {
    const shown = redactUri(URI)
    expect(shown).not.toContain(SECRET)
    // The host is kept: a connection problem is undiagnosable without knowing where.
    expect(shown).toContain('cluster0.example.mongodb.net')
  })

  it('masks the user as well, since a username is half a credential', () => {
    expect(redactUri(URI)).not.toContain('someuser')
  })

  it('handles a connection string with no credentials in it', () => {
    const plain = 'mongodb://localhost:27017/'
    expect(redactUri(plain)).toContain('localhost')
    expect(redactUri(plain)).not.toContain('undefined')
  })

  it('never returns the input unchanged when the input carries a password', () => {
    expect(redactUri(URI)).not.toBe(URI)
  })

  it('returns something safe for a value that is not a URL at all', () => {
    expect(redactUri('garbage')).not.toContain('garbage')
    expect(redactUri(undefined)).toBeTruthy()
  })

  it('keeps the secret out of every configuration problem message', () => {
    const cases = [
      { SESSION_SECRET: 'x' },
      { ...base, PORT: 'not-a-port' },
      { ...base, PUBLIC_URL: 'https://a.example.com', FRONTEND_ORIGIN: 'https://b.example.com' },
      { ...base, PUBLIC_URL: 'not a url', FRONTEND_ORIGIN: 'not a url' },
    ]
    for (const env of cases) {
      const problem = configProblem(readConfig({ MONGO_URI: URI, ...env })) ?? ''
      expect(problem).not.toContain(SECRET)
      expect(problem).not.toContain(base.SESSION_SECRET)
    }
  })
})

describe('the start command is deployable', () => {
  it('exists', async () => {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    expect(pkg.scripts.start).toBeTruthy()
  })

  it('does not pass --env-file, which errors when the file is absent', async () => {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    expect(pkg.scripts.start).not.toContain('--env-file')
  })

  it('leaves the local dev script reading .env, so local work is unchanged', async () => {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    expect(pkg.scripts.dev).toContain('--env-file')
  })
})

describe('.env.example documents what the server reads', () => {
  it('names every variable readConfig consults', async () => {
    const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8')
    for (const name of ['MONGO_URI', 'MONGO_DB', 'SESSION_SECRET', 'HOST', 'PORT', 'PUBLIC_URL', 'FRONTEND_ORIGIN']) {
      expect(example).toContain(name)
    }
  })

  it('carries placeholders rather than a usable credential', async () => {
    const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8')
    expect(example).toMatch(/<password>|<user>/)
    expect(example).not.toMatch(/mongodb\+srv:\/\/[a-z0-9_]+:[^<@\s]+@/i)
  })
})
