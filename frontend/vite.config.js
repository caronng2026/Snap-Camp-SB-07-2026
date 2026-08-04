import { defineConfig } from 'vite'

export default defineConfig({
  // Stated rather than left to Vite's default, because backend/src/static.js resolves
  // this exact path. An implicit default on one side and a hard path on the other is
  // precisely the pair that drifts without anything failing loudly.
  build: { outDir: 'dist' },
  // Same origin in development, so the session cookie is carried without CORS.
  server: {
    proxy: { '/api': { target: 'http://127.0.0.1:3000', changeOrigin: false } },
  },
  test: {
    // jsdom is required for the FR03, UX01, UX02 and SEC03 integration tests.
    // Approved as a dev dependency under bead B002 on 2026-07-31.
    environment: 'jsdom',
  },
})
