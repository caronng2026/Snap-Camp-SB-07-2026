/**
 * The Fastify app and the auth boundary.
 * Owner files: precode/API.md, precode/ARCHITECTURE.md
 *
 * The rule that comes before every other (PRD-002-SEC02): authorization is decided
 * server-side, before any handler runs, and the space id comes from the session —
 * never from the request body, query, headers, or path.
 *
 * A handler never receives a space id it could have been lied to about.
 */

import Fastify from 'fastify'
import { verifyCredentials } from './auth.js'
import { createSession, resolveSession, destroySession } from './session.js'

export const SESSION_COOKIE = 'sc_session'

/** Identical for "wrong passcode", "no such user", and "not your data". */
const DENIED = { error: 'unauthorized' }

export function createApp({ db, sessionSecret, logger = false }) {
  const app = Fastify({ logger })

  // Minimal cookie parsing. Avoids a dependency for one header.
  app.decorateRequest('sessionId', null)
  app.addHook('onRequest', async (request) => {
    const raw = request.headers.cookie
    if (!raw) return
    for (const part of raw.split(';')) {
      const [name, ...rest] = part.trim().split('=')
      if (name === SESSION_COOKIE) request.sessionId = rest.join('=')
    }
  })

  /**
   * The auth boundary. Runs before any handler on a protected route, and sets
   * request.spaceId from the session alone.
   */
  const requireSession = async (request, reply) => {
    const spaceId = await resolveSession(db, request.sessionId)
    if (!spaceId) return reply.code(401).send(DENIED)
    request.spaceId = spaceId
  }
  app.decorate('requireSession', requireSession)
  app.decorateRequest('spaceId', null)

  app.post('/api/auth/login', async (request, reply) => {
    const { username, passcode } = request.body ?? {}
    if (typeof username !== 'string' || typeof passcode !== 'string') {
      return reply.code(401).send(DENIED)
    }

    const spaceId = await verifyCredentials(db, { username, passcode })
    if (!spaceId) return reply.code(401).send(DENIED)

    const sessionId = await createSession(db, spaceId)
    reply.header(
      'set-cookie',
      // HttpOnly so script cannot read it; SameSite=Strict because the frontend is
      // same-origin by decision, so no cross-site request ever needs to carry it.
      `${SESSION_COOKIE}=${sessionId}; HttpOnly; SameSite=Strict; Path=/`,
    )
    return reply.code(204).send()
  })

  app.post('/api/auth/logout', async (request, reply) => {
    await destroySession(db, request.sessionId)
    reply.header('set-cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`)
    return reply.code(204).send()
  })

  app.get('/api/auth/session', { onRequest: requireSession }, async (request) => {
    // Returns the space id and nothing else. No username, no login document.
    return { spaceId: request.spaceId }
  })

  return app
}
