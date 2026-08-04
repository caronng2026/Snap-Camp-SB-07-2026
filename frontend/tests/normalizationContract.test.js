/**
 * SKU normalisation exists in two places, by necessity:
 *   frontend/src/entry.js  — the user must see the normalised value immediately
 *   backend/src/store.js   — the server cannot trust the client
 *
 * Two implementations of one rule can drift silently, and a drift here means the
 * screen and the database disagree about what a SKU is. This test makes that
 * impossible to do quietly. It imports across the repo rather than coupling the two
 * builds.
 */
import { describe, it, expect } from 'vitest'
import { normalizeSku as frontendNormalize } from '../src/entry.js'
import { normalizeSku as backendNormalize } from '../../backend/src/store.js'

const CASES = [
  '00734', '734', '0091', '000', '0', '00A12', 'ac4-100w', 'AC4-100W',
  '  ac4-100w ', '  00734  ', 'blue yarn 4', '  blue yarn 4 ', 'sock-blue-M',
  'a', '1', '0000001', 'AB-01', '  Ab-01  ', '007-A', '1180',
]

describe('the two SKU normalisers agree — DATA-MODELS.md', () => {
  for (const input of CASES) {
    it(`agrees on ${JSON.stringify(input)}`, () => {
      expect(backendNormalize(input)).toBe(frontendNormalize(input))
    })
  }

  it('both return a string, never a number', () => {
    for (const input of CASES) {
      expect(typeof frontendNormalize(input)).toBe('string')
      expect(typeof backendNormalize(input)).toBe('string')
    }
  })
})
