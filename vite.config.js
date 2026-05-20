import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8080';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: backendUrl.startsWith('https'),
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true,
        secure: backendUrl.startsWith('https'),
      },
    },
  },
})