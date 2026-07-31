import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // jsdom is required for the FR03, UX01, UX02 and SEC03 integration tests.
    // Approved as a dev dependency under bead B002 on 2026-07-31.
    environment: 'jsdom',
  },
})
