// import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from 'vite-plugin-static-copy'
// import manifest from "./manifest-firefox.json";

const srcDir = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: resolve(__dirname, 'dist/firefox'),
        rollupOptions: {
            input: {
                // manifest: resolve('./manifest-firefox.json'),
                devtools: resolve('./src/devtools/devtools.html'),
                panel: resolve('./src/devtools/panel.html'),
            },
        },
        sourcemap: true
    },
    plugins: [ svelte(),
    viteStaticCopy({
        targets: [
            {
                src: 'manifest-firefox.json',
                dest: '',
                rename: 'manifest.json'
            },
            {
                src: 'src/background/background.js',
                dest: 'src/background',
            },
            {
                src: 'src/content/content.js',
                dest: 'src/content',
            }
        ]
    })

    ],
    resolve: {
        alias: {
            src: srcDir,
        },
    },
})
