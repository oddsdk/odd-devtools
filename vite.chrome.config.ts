import { crx } from '@crxjs/vite-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import manifest from './manifest-chrome.json'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: resolve('./dist/chrome'),
    rollupOptions: {
      input: {
        panel: resolve('./src/devtools/panel.html'),
      },
    },
    sourcemap: false
  },
  plugins: [ svelte(), crx({ manifest }) ],
  resolve: {
    alias: {
      $utils: resolve('./src/utils')
    },
  },
})
