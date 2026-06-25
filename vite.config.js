import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// User GitHub Pages site (mrdwaynecarter3-design.github.io) serves from root.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
