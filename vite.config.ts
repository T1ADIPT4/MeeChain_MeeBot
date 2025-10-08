import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src-frontend'),
      '@backend': path.resolve(__dirname, './src')
    }
  },
  root: './src-frontend',
  publicDir: '../public',
  build: {
    outDir: '../dist-frontend',
    emptyOutDir: true,
    sourcemap: true
  },
  base: '/MeeChain_MeeBot/',
  server: {
    port: 3000,
    open: true
  }
})
