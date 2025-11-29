import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Apostolado_PNG.png', 'favicon.ico'],
      manifest: {
        name: 'Apostolado Seja Santo',
        short_name: 'Seja Santo',
        description: 'Plataforma de formação católica e evangelização',
        theme_color: '#d97706',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/Apostolado_PNG.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Apostolado_PNG.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Estratégias de cache para reduzir custos no servidor
        runtimeCaching: [
          {
            // API de conteúdo (artigos, notícias, cursos)
            urlPattern: /^https:\/\/.*\/api\/content.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-content',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 horas
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Liturgia diária
            urlPattern: /^https:\/\/.*\/api\/liturgia.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'liturgia',
              expiration: {
                maxEntries: 7,
                maxAgeSeconds: 24 * 60 * 60 // 24 horas
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Bíblia (raramente muda)
            urlPattern: /^https:\/\/.*\/api\/public-data\?type=bible.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-content',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
              }
            }
          },
          {
            // Imagens
            urlPattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
              }
            }
          },
          {
            // Dados públicos (tags, roles, etc)
            urlPattern: /^https:\/\/.*\/api\/public-data.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'public-data',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 dias
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        // Não cachear rotas de autenticação
        navigateFallbackDenylist: [/^\/api\/auth/]
      }
    })
  ],
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
