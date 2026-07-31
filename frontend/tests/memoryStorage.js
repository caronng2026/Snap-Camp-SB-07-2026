/**
 * An in-memory Storage stand-in for tests.
 *
 * Node 25 exposes a `localStorage` global that shadows jsdom's and lacks the
 * Storage API, so tests supply their own store rather than relying on the global.
 */
export function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    clear: () => data.clear(),
    key: (i) => [...data.keys()][i] ?? null,
    get length() {
      return data.size
    },
    keys: () => [...data.keys()],
  }
}
