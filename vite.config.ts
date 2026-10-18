import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relativer Basispfad: funktioniert auf GitHub Pages unter /cat-scratch/ ebenso wie lokal
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 2500 },
})
