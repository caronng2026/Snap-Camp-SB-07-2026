import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    // Integration tests hit Atlas; a single connection avoids pool churn.
    fileParallelism: false,
    testTimeout: 20000,
  },
})
