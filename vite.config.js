import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Source lives in src/, but the build is written to the repo root so that
// GitHub Pages serves the built index.html + assets/ straight from main.
const repoRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: repoRoot,
    emptyOutDir: false, // never wipe the repo; `npm run build` clears assets/ itself
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
  },
})
