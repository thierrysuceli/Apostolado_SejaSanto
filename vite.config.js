import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false // Desabilitar em dev para evitar conflitos
      },
      includeAssets: ['Apostolado_PNG.png', 'favicon.ico', 'robots.txt', 'bibliaAveMaria.json'],
      manifest: {
        name: 'Apostolado Seja Santo',
        short_name: 'Seja Santo',
        description: 'Plataforma de formação católica e evangelização',
        theme_color: '#d97706',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/Apostolado_PNG.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/Apostolado_PNG.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // PRECACHE: Arquivos críticos que devem estar sempre disponíveis offline
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,json,woff,woff2}'],
        // Arquivos grandes para precache (Bíblia)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        
        // Runtime caching: estratégias para diferentes tipos de conteúdo
        runtimeCaching: [
          {
            // API de conteúdo (artigos, notícias, cursos) - NetworkFirst agressivo
            urlPattern: ({ url }) => {
              return url.pathname.includes('/api/content');
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-content',
              expiration: {
                maxEntries: 200, // Mais cursos/artigos/notícias
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 dias
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              },
              // Garantir que respostas sejam cacheadas
              plugins: [
                {
                  cacheWillUpdate: async ({ response }) => {
                    if (response && response.status === 200) {
                      return response;
                    }
                    return null;
                  }
                }
              ]
            }
          },
          {
            // Liturgia diária - NetworkFirst com fallback
            urlPattern: ({ url }) => {
              return url.pathname.includes('/api/liturgia');
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'liturgia-daily',
              expiration: {
                maxEntries: 30, // Último mês
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 dias
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Bíblia (raramente muda) - Cache agressivo
            urlPattern: ({ url }) => {
              return url.pathname.includes('/api/public-data') && url.search.includes('type=bible');
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-content',
              expiration: {
                maxEntries: 500, // Todos os capítulos
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              // Plugin para garantir que funcione offline
              plugins: [
                {
                  cacheWillUpdate: async ({ response }) => {
                    if (response && response.status === 200) {
                      return response;
                    }
                    return null;
                  }
                }
              ]
            }
          },
          {
            // Imagens locais e externas (Supabase)
            urlPattern: ({ url }) => {
              return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) || 
                     url.hostname.includes('supabase.co');
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 300, // Mais imagens
                maxAgeSeconds: 90 * 24 * 60 * 60 // 90 dias
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Dados públicos (tags, roles, colunas editoriais)
            urlPattern: ({ url }) => {
              return url.pathname.includes('/api/public-data') && !url.search.includes('type=bible');
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'public-data',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 14 * 24 * 60 * 60 // 14 dias
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        
        // Navegação offline: fallback para index.html (SPA)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\/auth/, // Não cachear autenticação
          /^\/admin/ // Admin sempre online
        ],
        
        // Cleanup: remover caches antigos
        cleanupOutdatedCaches: true,
        
        // Skip waiting: ativar novo SW imediatamente
        skipWaiting: true,
        clientsClaim: true
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
