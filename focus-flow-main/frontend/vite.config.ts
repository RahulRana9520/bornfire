import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        navigateFallbackDenylist: [/^\/GroupGame/],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Bornfire | Squad Portal',
        short_name: 'Bornfire',
        description: 'Deep Work & Social Accountability Portal',
        theme_color: '#FFDE00',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-512x512.png',
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
