/**
 * Backend entry point and its runtime configuration.
 * Owner files: precode/SECURITY.md, precode/ARCHITECTURE.md
 * Bead: B017. Requirements: PRD-002-SEC03, PRD-002-SEC04.
 *
 * Everything the process needs comes from the environment. No .env file is read
 * here — `npm run dev` supplies one via a Node flag for local work, and a hosted
 * instance has no such file, where that flag would itself be a startup error.
 *
 * Configuration reading is separated from acting on it so the rules can be tested.
 * The side effects below run only when this file is the entry point.
 */

import { MongoClient } from 'mongodb'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createApp } from './app.js'
import { DEFAULT_STATIC_ROOT } from './static.js'

const CONNECT_TIMEOUT_MS = 15000

/**
 * Hide the credentials in a connection string, keeping enough to diagnose with.
 *
 * A Mongo URI carries user and password inline, so it must never be printed as
 * given. The host is retained deliberately: a connection problem is close to
 * undiagnosable without knowing which cluster was unreachable. The username is
 * masked too — it is half a credential, and it is not needed to identify the target.
 */
export function redactUri(uri) {
  if (typeof uri !== 'string' || uri === '') return '(no connection string set)'
  try {
    const parsed = new URL(uri)
    const auth = parsed.username ? '***:***@' : ''
    return `${parsed.protocol}//${auth}${parsed.host}${parsed.pathname}`
  } catch {
    // Never echo an unparseable value: if it is not a URL it may still be a secret.
    return '(unparseable connection string)'
  }
}

const originOf = (value) => {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

/** Read configuration from an environment object. Pure: no defaults invented for secrets. */
export function readConfig(env = process.env) {
  const port = Number(env.PORT ?? 3000)
  const host = env.HOST ?? '127.0.0.1'
  const publicUrl = env.PUBLIC_URL ?? `http://${host}:${port}`
  return {
    uri: env.MONGO_URI,
    dbName: env.MONGO_DB ?? 'snapcamp',
    // No fallback, ever. A defaulted secret starts cleanly and is identical on every
    // instance, so nothing ever draws attention to it.
    sessionSecret: env.SESSION_SECRET,
    port,
    host,
    publicUrl,
    frontendOrigin: env.FRONTEND_ORIGIN ?? publicUrl,
  }
}

/**
 * Describe what is wrong with a configuration, or null if nothing is.
 *
 * Returns a message rather than printing one, so the caller decides where it goes and
 * so the no-secret rule can be asserted against every message this can produce.
 */
export function configProblem(config) {
  if (!config.uri) {
    return 'MONGO_URI is not set. Copy .env.example to .env for local use, or set it in the hosting environment.'
  }
  if (!config.sessionSecret) {
    return 'SESSION_SECRET is not set. It has no default: set a long random value, unique to this instance.'
  }
  if (!Number.isInteger(config.port) || config.port <= 0 || config.port > 65535) {
    return `PORT is not a usable port number. Received ${JSON.stringify(String(config.port))}.`
  }

  const publicOrigin = originOf(config.publicUrl)
  const frontendOrigin = originOf(config.frontendOrigin)
  if (publicOrigin === null || frontendOrigin === null) {
    return 'PUBLIC_URL and FRONTEND_ORIGIN must each be an absolute URL, so their origins can be compared.'
  }
  if (publicOrigin !== frontendOrigin) {
    return (
      `FRONTEND_ORIGIN (${frontendOrigin}) is a different origin from PUBLIC_URL (${publicOrigin}).\n` +
      'Cross-origin is not supported: there is no CORS setup and the session cookie is\n' +
      'not SameSite=None; Secure, so the browser will not send it and every request\n' +
      'will return 401. Serve the built frontend from this server, or put both behind\n' +
      'one hostname, or implement cross-origin support as its own bead first.'
    )
  }
  return null
}

async function main() {
  const config = readConfig(process.env)

  const problem = configProblem(config)
  if (problem) {
    console.error(problem)
    process.exit(1)
  }

  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS })
  try {
    await client.connect()
  } catch (error) {
    // The driver's message can name hosts and settings. Print our own summary and the
    // redacted target, never the URI and never the raw error, which may quote it back.
    console.error(
      `Could not reach the database at ${redactUri(config.uri)} within ${CONNECT_TIMEOUT_MS / 1000}s.\n` +
        `Cause: ${error?.name ?? 'unknown error'}.\n` +
        'Check that the connection string is correct and that this host is allowed by the\n' +
        "database's network access rules. A hosted instance usually needs its outbound\n" +
        'addresses allowed explicitly.',
    )
    process.exit(1)
  }

  /**
   * Same-origin in production means this process serves the app as well as the API.
   * Locally the Vite dev server proxies /api instead, so a build need not exist; the
   * backend then runs API-only and says so.
   */
  const hasBuild = existsSync(resolve(DEFAULT_STATIC_ROOT, 'index.html'))
  if (!hasBuild) {
    console.warn(
      `No frontend build at ${DEFAULT_STATIC_ROOT} — running API-only. Page requests will 404.\n` +
        'Run `npm run build` in frontend/ to serve the app from this process.',
    )
  }

  const app = createApp({
    db: client.db(config.dbName),
    sessionSecret: config.sessionSecret,
    logger: true,
    staticRoot: hasBuild ? DEFAULT_STATIC_ROOT : undefined,
  })

  await app.listen({ port: config.port, host: config.host })
  app.log.info(
    `Snap Camp backend on ${config.publicUrl} (same-origin with ${config.frontendOrigin}), ` +
      `serving ${hasBuild ? 'the app and the API' : 'the API only'}`,
  )

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, async () => {
      await app.close()
      await client.close()
      process.exit(0)
    })
  }
}

// Only when run directly. Importing this file for its helpers must start nothing.
if (import.meta.main) await main()
