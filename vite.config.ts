import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
  },
  build: {
    rollupOptions: {
      external: ['api/**'], // Exclude API routes from Vite build
    },
  },
  publicDir: false, // Don't copy public files that might interfere
})

