/**
 * Serving the built frontend, so the deployed app is one origin.
 * Owner files: precode/ARCHITECTURE.md, precode/API.md
 * Bead: B016. Requirement: PRD-002-FR05.
 *
 * The session cookie is SameSite=Strict and there is no CORS configuration anywhere.
 * Serving the app from this process is what makes that work in production rather
 * than only behind the Vite dev proxy.
 *
 * Written by hand rather than pulled from a plugin because PRD-002 fixed the runtime
 * dependency set at fastify, mongodb and bcrypt. The cost of that choice is that path
 * containment is this module's own responsibility: a static handler that can be
 * talked out of its root is a file-disclosure bug, so resolveWithinRoot is exported
 * and tested directly rather than only through routes.
 */

import { createReadStream, existsSync, statSync } from 'node:fs'
import { resolve, sep, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Where the frontend build lands. Computed from this file's own location so it
 * survives being checked out anywhere; the repo layout, not the machine, decides it.
 * Agreed with frontend/vite.config.js, which builds to frontend/dist.
 */
export const DEFAULT_STATIC_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../frontend/dist',
)

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

/**
 * Resolve a URL path to a file inside root, or null if it would escape.
 *
 * Returns null rather than throwing, and rather than clamping the path back inside
 * the root. Clamping would silently serve a different file than the one asked for,
 * which hides an attack instead of refusing it.
 */
export function resolveWithinRoot(root, urlPath) {
  let decoded
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  } catch {
    // Malformed percent-encoding is not a path we should guess at.
    return null
  }
  // Escaped, not a literal control byte: a literal one can be stripped by an editor
  // or a copy-paste and the guard would disappear while still looking present.
  if (decoded.includes('\u0000')) return null

  const rootPath = resolve(root)
  // Leading '.' keeps resolve from treating an absolute-looking path as absolute.
  const candidate = resolve(rootPath, '.' + (decoded.startsWith('/') ? decoded : '/' + decoded))

  // The separator matters: without it, '/root-evil' passes a check against '/root'.
  if (candidate !== rootPath && !candidate.startsWith(rootPath + sep)) return null
  return candidate
}

/**
 * Register static serving and the client-side-route fallback.
 *
 * Uses setNotFoundHandler, so the API keeps precedence structurally: this only runs
 * when no route matched. A static route registered at '/*' could shadow '/api/*'
 * depending on registration order, and route precedence that depends on ordering is
 * the kind of thing that survives review and breaks later.
 */
export function registerStatic(app, root = DEFAULT_STATIC_ROOT) {
  const rootPath = resolve(root)
  const indexPath = resolve(rootPath, 'index.html')

  if (!existsSync(indexPath)) {
    throw new Error(
      `The frontend is not built: no index.html at ${rootPath}. ` +
        'Run `npm run build` in frontend/ before starting the server. ' +
        'Without it the app cannot be served same-origin and every page request would 404.',
    )
  }

  const sendFile = (reply, filePath) => {
    const type = CONTENT_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
    return reply.type(type).send(createReadStream(filePath))
  }

  app.setNotFoundHandler((request, reply) => {
    // An unknown API path is an API 404. Falling back to the app here would answer a
    // data request with HTML, which reads as a parse bug rather than a missing route.
    if (request.url === '/api' || request.url.startsWith('/api/')) {
      return reply.code(404).type('application/json; charset=utf-8').send({ error: 'not_found' })
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return reply.code(404).type('application/json; charset=utf-8').send({ error: 'not_found' })
    }

    const filePath = resolveWithinRoot(rootPath, request.url)
    if (filePath === null) {
      // Refused, not clamped. Same shape as a miss, so probing tells an attacker nothing.
      return reply.code(404).type('application/json; charset=utf-8').send({ error: 'not_found' })
    }

    if (filePath !== rootPath && existsSync(filePath) && statSync(filePath).isFile()) {
      return sendFile(reply, filePath)
    }

    // Client-side route: hand back the app and let it route. index.html carries no
    // session-scoped content, so serving it to an unauthenticated visitor reveals
    // nothing — the sign-in gate is enforced by the API, not by which file is served.
    return sendFile(reply, indexPath)
  })

  return app
}
