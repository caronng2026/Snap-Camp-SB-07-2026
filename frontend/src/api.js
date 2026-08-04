/**
 * The API client.
 * Owner file: precode/API.md
 *
 * Same-origin by decision, so requests carry the session cookie automatically and
 * there is no CORS configuration anywhere.
 *
 * This client never sends a space id. The server takes it from the session and
 * ignores anything the client claims, but sending one would still be misleading
 * about where authority lives.
 */

export class ApiError extends Error {
  constructor(message, { status = 0, unauthorized = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.unauthorized = unauthorized
  }
}

export function createApi(fetchImpl = globalThis.fetch) {
  async function request(url, init) {
    let res
    try {
      res = await fetchImpl(url, init)
    } catch (cause) {
      // Offline is out of scope, but a dropped connection must never look like success.
      throw new ApiError('Could not reach the server', { cause })
    }
    return res
  }

  const json = (body) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  return {
    async signIn(username, passcode) {
      const res = await request('/api/auth/login', json({ username, passcode }))
      return res.ok
    },

    async signOut() {
      await request('/api/auth/logout', { method: 'POST' })
    },

    /** The space id, or null when not signed in. Not being signed in is not an error. */
    async session() {
      const res = await request('/api/auth/session')
      if (!res.ok) return null
      return res.json()
    },

    async log(dayKey) {
      const res = await request(`/api/log/${dayKey}`)
      if (!res.ok) {
        throw new ApiError('Could not load today\'s log', {
          status: res.status,
          unauthorized: res.status === 401,
        })
      }
      const body = await res.json()
      return body.entries
    },

    async addEntry({ sku, quantity, dayKey }) {
      const res = await request('/api/entries', json({ sku, quantity, dayKey }))
      if (!res.ok) {
        throw new ApiError('Could not save the entry', {
          status: res.status,
          unauthorized: res.status === 401,
        })
      }
      return res.json()
    },
  }
}
