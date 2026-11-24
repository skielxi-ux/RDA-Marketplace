# Red de Autos · Marketplace

Marketplace de autos 0km y usados para agencias multimarca y concesionarios oficiales.
Web: https://skielxi-ux.github.io/RDA-Marketplace/

## Stack
Vite · Tailwind CSS 4 · Swiper · íconos Lucide (SVG en línea) · DM Sans (local)

## Estructura
```
app/                 código fuente (raíz de Vite)
  index.html         plantilla con <!--slot:...--> e <i data-icon> (se completan en el build)
  public/            favicon, manifest, robots.txt, sitemap.xml
  src/
    data/            site.js (datos del sitio y SEO) · catalog.js (catálogo de ejemplo)
    lib/             html.js (esc, formatos) · icons.js (SVG de Lucide)
    render/          plantillas HTML puras: secciones, tarjeta de auto, SEO/JSON-LD
    ui/              comportamiento en el navegador (header, menú, hero, buscador, sliders)
    styles/main.css  tokens de diseño y componentes
    main.js          punto de entrada
build/prerender.js   plugin de Vite: arma el HTML en el build, íconos y CSP
```
El build escribe el sitio compilado en la raíz del repo (index.html + assets/), que es lo que publica GitHub Pages (main / root).

## Comandos
- `npm install`
- `npm run dev` → servidor local
- `npm run build` → compila a la raíz. **Siempre hacer build antes de commitear.**

## Reglas
- Responsive primero en celular.
- SEO: HTML ya armado en el build, meta tags, Open Graph, JSON-LD (Car / ItemList), alt en imágenes.
- Seguridad: todo dato pasa por `esc()`; CSP estricta (sin scripts ni estilos en línea); sin claves en el front.
- Mientras el catálogo sea de ejemplo el sitio va con `noindex` (`SITE.indexable` en `app/src/data/site.js`).
