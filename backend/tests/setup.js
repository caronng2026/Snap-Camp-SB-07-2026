/**
 * Loads .env for tests without a dependency.
 * .env is gitignored; .env.example documents the shape.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const path = resolve(process.cwd(), '.env')
if (existsSync(path)) {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}
