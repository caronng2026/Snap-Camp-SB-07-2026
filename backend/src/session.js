/**
 * Sessions.
 * Owner files: precode/DATA-MODELS.md, precode/SECURITY.md
 *
 * A server-side session record, referenced by a signed HTTP-only cookie.
 * PRD-002-SEC04 requires sign-out and expiry to invalidate server-side, which a
 * stateless token cannot do without a revocation list — and that is this table with
 * extra steps.
 *
 * The session is the ONLY source of a space id for any request.
 */

import { randomBytes } from 'node:crypto'

const TTL_MS = 12 * 60 * 60 * 1000 // a working day, comfortably

export async function createSession(db, spaceId, now = new Date()) {
  const sessionId = randomBytes(32).toString('base64url')
  await db.collection('sessions').insertOne({
    session_id: sessionId,
    space_id: spaceId,
    expires_at: new Date(now.getTime() + TTL_MS),
    created_at: now,
  })
  return sessionId
}

/** Returns the space id for a live session, or null. Expiry is checked here. */
export async function resolveSession(db, sessionId, now = new Date()) {
  if (!sessionId) return null
  const session = await db.collection('sessions').findOne({ session_id: sessionId })
  if (!session) return null
  if (session.expires_at <= now) return null
  return session.space_id
}

/** Removes the session server-side. Clearing the cookie alone is not sign-out. */
export async function destroySession(db, sessionId) {
  if (!sessionId) return
  await db.collection('sessions').deleteOne({ session_id: sessionId })
}
