import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:3031',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3031',
        changeOrigin: true
      }
    }
  }
})
