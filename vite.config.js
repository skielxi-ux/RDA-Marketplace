import { defineConfig } from 'vite';
import { resolve } from 'node:path';
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
      input: { index: resolve(import.meta.dirname, 'app/index.html'), autos: resolve(import.meta.dirname, 'app/autos.html') },
    },
  },
});
