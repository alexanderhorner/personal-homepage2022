import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        credits: resolve(__dirname, 'credits.html'),
        notfounf: resolve(__dirname, '404.html')
      },
      output: {
        manualChunks: {
          vendor: ['AOS'],
        },
      },
    },
  },
})