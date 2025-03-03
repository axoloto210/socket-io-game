import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@socket-io-game/common': resolve(__dirname, '../common/dist')
    }
  },
  optimizeDeps: {
    include: ['@socket-io-game/common'],
  },
  build: {
    commonjsOptions: {
      include: [/common/, /node_modules/]
    }
  }
})