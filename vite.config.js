import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// El código fuente vive en app/. El build se escribe en la raíz del repo,
// que es lo que publica GitHub Pages ("Deploy from a branch": main / root).
export default defineConfig({
  root: 'app',
  base: './',
  plugins: [tailwindcss()],
  build: { outDir: '..', emptyOutDir: false, assetsDir: 'assets' },
});
