import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa node_modules em chunks por biblioteca
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('quill') || id.includes('react-quill')) {
              return 'vendor-editor';
            }
            // Outras dependências
            return 'vendor-libs';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
