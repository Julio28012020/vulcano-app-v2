import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://cursosvulcano-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://cursosvulcano-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})