/**
 * An in-memory stand-in for the backend API.
 *
 * Replaces `createMemoryStorage` for every test that drives the screen. Under
 * `PRD-002` the screen's data no longer lives in the browser, so a Storage double
 * can no longer stand in for it — the seam moved from `localStorage` to `fetch`.
 *
 * This double implements the same surface as `src/api.js` and holds days in a plain
 * object, so a test can inspect what the server would be holding via `api.days`.
 */

/**
 * Flush pending microtasks.
 *
 * Recording is asynchronous now, so a `submit` dispatch no longer leaves the DOM
 * updated by the time it returns. Using `setTimeout` here would deadlock the tests
 * that install fake timers, hence a plain microtask drain.
 */
export async function flush(turns = 12) {
  for (let i = 0; i < turns; i += 1) await Promise.resolve()
}

export function createMemoryApi({
  spaceId = 'demo-space',
  signedIn = true,
  credentials = { demo: 'let-me-in' },
  days = {},
} = {}) {
  let session = signedIn ? spaceId : null

  const api = {
    days,
    /** Every data call made through this double, so a test can assert call counts. */
    calls: [],
    /** Set to make the next write or read fail, for the UX03 failure path. */
    failNext: false,
    /** Set to make requests fail as 401, for the expired-session path. */
    unauthorizedNext: false,

    async signIn(username, passcode) {
      if (credentials[username] !== passcode) return false
      session = spaceId
      return true
    },

    async signOut() {
      session = null
    },

    async session() {
      return session ? { spaceId: session } : null
    },

    async log(dayKey) {
      return [...(days[dayKey] ?? [])]
    },

    async addEntry({ sku, quantity, dayKey }) {
      const record = { sku, quantity, recordedAt: new Date().toISOString() }
      days[dayKey] = [...(days[dayKey] ?? []), record]
      return record
    },
  }

  // Wrap the two data calls so a test can force a failure without restating them.
  for (const name of ['log', 'addEntry']) {
    const real = api[name].bind(api)
    api[name] = async (...args) => {
      api.calls.push(name)
      if (api.unauthorizedNext) {
        api.unauthorizedNext = false
        const error = new Error('unauthorized')
        error.unauthorized = true
        throw error
      }
      if (api.failNext) {
        api.failNext = false
        throw new Error('network down')
      }
      if (!session) {
        const error = new Error('unauthorized')
        error.unauthorized = true
        throw error
      }
      return real(...args)
    }
  }

  return api
}
