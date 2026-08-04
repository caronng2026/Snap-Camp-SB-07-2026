/**
 * The space-scoped store.
 * Owner files: precode/ARCHITECTURE.md, precode/DATA-MODELS.md, precode/SECURITY.md
 *
 * PRD-002-SEC01: no request may read, write, or infer another space's contents.
 *
 * That guarantee is structural here, not a convention. Every function takes a space
 * id as its first argument, the collection handle is never exported, and there is no
 * unscoped query helper to reach for. A caller cannot forget to scope, because
 * nothing exists that would let them.
 *
 * The space id must be a non-empty string. A non-string is rejected outright — an
 * object such as `{ $ne: null }` would otherwise reach the query and match every
 * document in the collection.
 */

/** Trim, upper-case, then strip leading zeros if entirely digits. */
export function normalizeSku(sku) {
  const cleaned = String(sku ?? '').trim().toUpperCase()
  if (!/^\d+$/.test(cleaned)) return cleaned
  const stripped = cleaned.replace(/^0+/, '')
  return stripped === '' ? '0' : stripped
}

function requireSpaceId(spaceId) {
  if (typeof spaceId !== 'string' || spaceId.trim() === '') {
    throw new Error('a space id is required for every data access')
  }
  return spaceId
}

function requireDayKey(dayKey) {
  if (typeof dayKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    throw new Error('a day key of the form YYYY-MM-DD is required')
  }
  return dayKey
}

export function createStore(db) {
  // Never exported. The only path to it is through the scoped functions below.
  const entries = db.collection('entries')

  return {
    async addEntry(spaceId, entry, dayKey) {
      requireSpaceId(spaceId)
      requireDayKey(dayKey)

      const sku = normalizeSku(entry?.sku)
      if (sku === '') throw new Error('sku is required and cannot be empty')

      const quantity = entry?.quantity
      if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
        throw new Error('quantity must be a whole number')
      }

      const doc = {
        space_id: spaceId, // set from the session by the caller, never from the request
        day_key: dayKey,
        sku,
        quantity,
        recorded_at: new Date(),
      }
      await entries.insertOne(doc)
      return { sku: doc.sku, quantity: doc.quantity, recordedAt: doc.recorded_at.toISOString() }
    },

    async entriesFor(spaceId, dayKey) {
      requireSpaceId(spaceId)
      requireDayKey(dayKey)
      const found = await entries
        .find({ space_id: spaceId, day_key: dayKey })
        .sort({ recorded_at: 1 })
        .toArray()
      return found.map((d) => ({
        sku: d.sku,
        quantity: d.quantity,
        recordedAt: d.recorded_at.toISOString(),
      }))
    },

    async daysFor(spaceId) {
      requireSpaceId(spaceId)
      return entries.distinct('day_key', { space_id: spaceId })
    },
  }
}
