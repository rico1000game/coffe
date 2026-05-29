import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu/menu.html'),
        sobre: resolve(__dirname, 'sobre/sobre.html'),
        galeria: resolve(__dirname, 'galeria/galeria.html'),
        contato: resolve(__dirname, 'contato/contato.html'),
      }
    }
  }
})
