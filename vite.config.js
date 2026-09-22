import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Multi-page site: the one-pager plus standalone pages, each with its own HTML entry.
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        circularFlow: page('./circular-flow/index.html'),
      },
    },
  },
})
