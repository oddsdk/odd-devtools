import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import manifest from "./manifest-chrome.json";

const srcDir = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: resolve(__dirname, 'dist/chrome'),
        rollupOptions: {
            input: {
              panel: resolve(__dirname, 'src/devtools/panel.html'),
            },
          },
    },
    plugins: [ svelte(), crx({ manifest }) ],
    resolve: {
        alias: {
            src: srcDir,
        },
    },
})
