import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'Uğur Özcan Portfolyo',
        short_name: 'Uğur Özcan',
        description: 'Uğur Özcan Kişisel Portfolyo Sitesi',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/portfolyo/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
