/**
 * Logins and credential verification.
 * Owner files: precode/DATA-MODELS.md, precode/SECURITY.md
 *
 * A login is the isolation boundary and nothing more (BQ-5): no profile, no role,
 * no admin, no recovery. It maps to exactly one space.
 *
 * Passcodes are hashed with bcrypt — one-way by design. PRD-002-SEC03 requires that
 * credentials never be stored in recoverable form, which is why this is hashing
 * rather than encryption.
 */

import bcrypt from 'bcrypt'

const ROUNDS = 12

export async function createLogin(db, { username, passcode, spaceId }) {
  const passcode_hash = await bcrypt.hash(passcode, ROUNDS)
  await db.collection('logins').insertOne({
    username,
    passcode_hash, // never the passcode itself
    space_id: spaceId,
    created_at: new Date(),
  })
}

/**
 * Returns the space id for valid credentials, or null.
 *
 * An unknown username and a wrong passcode are deliberately indistinguishable to
 * the caller — a difference here would let an attacker enumerate usernames.
 */
export async function verifyCredentials(db, { username, passcode }) {
  const login = await db.collection('logins').findOne({ username })
  if (!login) {
    // Compare against a dummy hash anyway, so a missing user and a wrong passcode
    // take comparable time. Absent this, response timing leaks which usernames exist.
    await bcrypt.compare(passcode, '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin')
    return null
  }
  const ok = await bcrypt.compare(passcode, login.passcode_hash)
  return ok ? login.space_id : null
}
