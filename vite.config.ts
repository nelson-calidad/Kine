import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg', 'models/rehab-human.glb'],
      manifest: {
        name: 'Tu rodilla, paso a paso - Guía posoperatoria LCA (HTH)',
        short_name: 'Tu Rodilla LCA',
        description: 'Guía educativa de recuperación en casa después de una reconstrucción del ligamento cruzado anterior (LCA) mediante autoinjerto HTH rotuliano.',
        theme_color: '#173B59',
        background_color: '#F7FAFB',
        display: 'standalone',
        lang: 'es-AR',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,glb}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
