import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import { prerenderHome } from './build/prerender.js';

// El código fuente vive en app/. El build se escribe en la raíz del repo,
// que es lo que publica GitHub Pages ("Deploy from a branch": main / root).
export default defineConfig({
  root: 'app',
  base: './',
  plugins: [tailwindcss(), prerenderHome()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    assetsDir: 'assets',
    rollupOptions: {
      // home + listado + una ficha por auto (generadas por build/generate-pages.mjs)
      input: Object.fromEntries(
        readdirSync(resolve(import.meta.dirname, 'app'))
          .filter((f) => f.endsWith('.html'))
          .map((f) => [f.replace('.html', ''), resolve(import.meta.dirname, 'app', f)]),
      ),
    },
  },
});
