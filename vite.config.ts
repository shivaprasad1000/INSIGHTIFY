import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/INSIGHTIFY/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendors': ['react', 'react-dom'],
          'utils': ['lodash', 'moment'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: Increase warning limit (in kB)
  },
})