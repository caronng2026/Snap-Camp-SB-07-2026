/**
 * Backend entry point.
 *
 * The Atlas connection string comes from the environment and is never committed.
 * See .env.example for the shape; .env is gitignored.
 */

import { MongoClient } from 'mongodb'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createApp } from './app.js'
import { DEFAULT_STATIC_ROOT } from './static.js'

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB ?? 'snapcamp'
const sessionSecret = process.env.SESSION_SECRET
const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '127.0.0.1'
const publicUrl = process.env.PUBLIC_URL ?? `http://${host}:${port}`
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? publicUrl

if (!uri) {
  console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}
if (!sessionSecret) {
  console.error('SESSION_SECRET is not set.')
  process.exit(1)
}

/**
 * The frontend and backend share an origin by decision (precode/ARCHITECTURE.md), so
 * no CORS configuration exists here. If these two origins differ, the browser will
 * not send the session cookie cross-site and every request will 401 — which looks
 * like a credentials bug rather than a configuration one. Say so at startup instead
 * of letting it be discovered from the outside.
 */
const originOf = (value) => {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

if (originOf(publicUrl) !== originOf(frontendOrigin)) {
  console.error(
    `FRONTEND_ORIGIN (${frontendOrigin}) is a different origin from PUBLIC_URL (${publicUrl}).\n` +
      'Cross-origin is not supported: there is no CORS setup and the session cookie is\n' +
      'not SameSite=None; Secure, so the browser will not send it and every request\n' +
      'will return 401. Serve the built frontend from this server, or put both behind\n' +
      'one hostname, or implement cross-origin support as its own bead first.',
  )
  process.exit(1)
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
await client.connect()

/**
 * Same-origin in production means this process serves the app as well as the API.
 *
 * Locally the Vite dev server proxies /api instead, so a build need not exist; the
 * backend then runs API-only and says so. Making that a hard failure depends on
 * knowing the environment, which is runtime configuration and belongs to B017.
 */
const hasBuild = existsSync(resolve(DEFAULT_STATIC_ROOT, 'index.html'))
if (!hasBuild) {
  console.warn(
    `No frontend build at ${DEFAULT_STATIC_ROOT} — running API-only. Page requests will 404.\n` +
      'Run `npm run build` in frontend/ to serve the app from this process.',
  )
}

const app = createApp({
  db: client.db(dbName),
  sessionSecret,
  logger: true,
  staticRoot: hasBuild ? DEFAULT_STATIC_ROOT : undefined,
})
await app.listen({ port, host })
app.log.info(`Snap Camp backend on ${publicUrl} (same-origin with ${frontendOrigin})`)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await app.close()
    await client.close()
    process.exit(0)
  })
}
