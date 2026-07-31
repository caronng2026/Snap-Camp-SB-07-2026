/**
 * Persistence for the daily log.
 * Owner file: precode/DATA-MODELS.md, precode/ARCHITECTURE.md
 *
 * Browser `localStorage` only — single-device, no sync, no server, no database
 * (OQ-5, OQ-11). This is the *working* store; the exported summary is the durable
 * record. Storage can be cleared by the browser without warning, which is why the
 * screen shows what is stored and when it was last saved (UX05).
 *
 * Unreadable or wrong-shaped data falls back to an empty log rather than throwing,
 * so a corrupt entry can never lock the user out of recording today's inventory.
 */

import { createLog } from './dailyLog.js'

export const STORAGE_KEY = 'snap-camp.daily-log.v1'

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Every day maps to an array of entries; anything else is not our shape. */
function isLogShaped(value) {
  return isPlainObject(value) && Object.values(value).every(Array.isArray)
}

export function loadState(storage = localStorage) {
  const empty = { log: createLog(), savedAt: null }
  let raw
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return empty // storage disabled or blocked — recording still works, in memory
  }
  if (!raw) return empty

  try {
    const parsed = JSON.parse(raw)
    if (!isPlainObject(parsed) || !isLogShaped(parsed.log)) return empty
    return {
      log: parsed.log,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
    }
  } catch {
    return empty
  }
}

/** Writes the whole log under one key. Returns the ISO time recorded, or null. */
export function saveState(log, storage = localStorage, now = new Date()) {
  const savedAt = now.toISOString()
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, log, savedAt }))
  } catch {
    return null // quota or private mode — the caller keeps working in memory
  }
  return savedAt
}
