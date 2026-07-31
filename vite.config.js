import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/qagent-platform/',
  plugins: [react({ include: /\.(jsx?|tsx?)$/ }), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5174,
    allowedHosts: true,
  },
  build: {
    cssMinify: 'esbuild',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
          'charts': ['recharts'],
        },
      },
    },
  },
})
