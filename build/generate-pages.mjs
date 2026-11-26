// Genera una página por auto (app/auto-<id>.html) a partir de la plantilla, y el sitemap.
// Corre antes de `vite build`. Las páginas generadas no se suben al repo (están en .gitignore).
import fs from 'node:fs';
import path from 'node:path';
import { cars, carUrl } from '../app/src/data/catalog.js';
import { SITE } from '../app/src/data/site.js';

const root = path.resolve(import.meta.dirname, '../app');
const template = fs.readFileSync(path.join(root, 'templates/ficha.html'), 'utf8');

for (const f of fs.readdirSync(root)) if (/^auto-.+\.html$/.test(f)) fs.rmSync(path.join(root, f));
for (const c of cars) {
  if (!/^[a-z0-9-]+$/.test(c.id)) throw new Error(`id inválido: ${c.id}`);
  fs.writeFileSync(path.join(root, carUrl(c).replace('./', '')), template);
}

const urls = ['', 'autos.html', 'quienes-somos.html', 'como-funciona.html', 'preguntas-frecuentes.html', 'seguros.html', 'marcas.html', 'agencias.html', 'feria.html', 'terminos.html', 'privacidad.html', 'vender.html', ...cars.map((c) => carUrl(c).replace('./', ''))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.url}${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap);

// robots.txt según el interruptor SITE.indexable (sitemap-autos.xml lo genera el proceso de compartir cada 15 min)
const robots = SITE.indexable
  ? `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /mi-cuenta.html
Disallow: /publicar.html
Disallow: /favoritos.html
Disallow: /c/

Sitemap: ${SITE.url}sitemap.xml
Sitemap: ${SITE.url}sitemap-autos.xml
`
  : `# Mientras el catálogo sea de ejemplo no queremos que Google lo indexe.
# Para abrirlo: SITE.indexable = true en app/src/data/site.js (y la url del dominio propio).
User-agent: *
Disallow: /
`;
fs.writeFileSync(path.join(root, 'public/robots.txt'), robots);
console.log(`Fichas generadas: ${cars.length}`);
