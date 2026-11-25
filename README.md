# Red de Autos · Marketplace

Marketplace de autos 0km y usados para agencias multimarca y concesionarios oficiales.
Web: https://skielxi-ux.github.io/RDA-Marketplace/

## Stack
Vite · Tailwind CSS 4 · Swiper · íconos Lucide (SVG en línea) · DM Sans (local)

## Estructura
```
app/                 código fuente (raíz de Vite)
  index.html         home (plantilla con <!--slot:...--> e <i data-icon>, se completan en el build)
  autos.html         listado de autos con filtros (?condicion=0km&marca=Ford&carroceria=suv&vendedor=particular&moneda=USD&pmin=&pmax=&anio=&orden=)
  public/            favicon, manifest, robots.txt, sitemap.xml
  src/
    data/            site.js (datos del sitio y SEO) · catalog.js (catálogo de ejemplo)
    lib/             html.js (esc, formatos) · icons.js (SVG de Lucide)
    render/          plantillas HTML puras: layout (header/menú), secciones, tarjeta de auto, listado, SEO/JSON-LD
    ui/              comportamiento en el navegador (header, menú, hero, buscador, sliders)
    styles/main.css  tokens de diseño y componentes
    main.js          punto de entrada de la home · autos.js: del listado
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

## Cuentas (Supabase)
- Proyecto Supabase "RED DE AUTOS IA". Tabla propia `public.mkt_cuentas` (particulares y agencias), sin acceso público (RLS sin políticas).
- Funciones SQL `mkt_set_pin` / `mkt_verificar_pin` (bcrypt, 5 intentos → bloqueo 15 min), solo para `service_role`.
- Edge function `mkt-cuenta` (código en `supabase/functions/mkt-cuenta/`): `registrar`, `ingresar`, `perfil`. Valida todo del lado del servidor (celular, PIN, CUIT con dígito verificador, provincia) y solo acepta llamadas desde el sitio (CORS).
- El sitio usa la clave *publishable* (pública por diseño) y carga `@supabase/supabase-js` solo cuando hace falta.

## +Buscados

- El buscador de la home registra cada búsqueda (marca obligatoria) con la RPC pública `mkt_registrar_busqueda` (valida marca y modelo, límite por visitante, sin guardar la IP).
- `mkt_ranking_buscados()` devuelve el top 10 del mes y del año por marca + modelo, solo para el admin o cuentas activas / aprobadas.
- Se muestra en `admin.html` (pestaña +Buscados) y en `mi-cuenta.html` (botón +Buscados, abre directo con `#buscados`). `mi-cuenta.html` tiene noindex y no va al sitemap.

## Carga masiva de autos (agencias aprobadas)

- `publicar.html`: la agencia descarga `plantilla-autos.xlsx` (se genera con `python3 build/plantilla.py`), sube el Excel y arrastra la carpeta de fotos. Cada foto se une con su auto por el **Código**: carpeta `A001/` o nombre `A001-1.jpg`. Máximo 7 fotos por auto (las que sobran quedan "sin asignar"). Pantalla de revisión con errores por fila, mover/reordenar fotos y elegir portada.
- Lectura y validación: `app/src/lib/carga.js` (puro). Las fotos se achican en el navegador (1600 px, WebP o JPEG) y se suben a Storage (`mkt-fotos`) con URLs firmadas.
- Edge function `mkt-autos` (solo agencias aprobadas): `mios`, `urls_fotos`, `publicar` (crea o actualiza por código; valida todo otra vez y que las fotos existan y sean de la cuenta), `estado` (pausar / volver a publicar).
- Tabla `mkt_autos` (RLS sin políticas). Lectura pública: `mkt_autos_publicos()` (sin cuentas de prueba) y `mkt_auto(id)`.
- Los autos reales se suman a los de ejemplo en el listado, los destacados de la home y "Autos similares". Su ficha es `auto.html?id=<uuid>` (se arma en el navegador).
- Admin → pestaña **Autos**: buscar y pausar / volver a publicar (si lo pausa el admin, la agencia no puede reactivarlo).

## Perfil de la agencia

- Mi cuenta → **Perfil de la agencia** (cualquier agencia no suspendida): nombre, CUIT, tipo/marca, ciudad, provincia, dirección, horario, WhatsApp de ventas, email, descripción, sitio web, Instagram y logo (recorte cuadrado en el navegador, 400 px).
- Edge function `mkt-perfil` (`ver`, `guardar`, `url_logo`, `guardar_logo`, `quitar_logo`). Nombre, CUIT y tipo quedan en `cambios_pendientes` y avisan al admin por Telegram; el admin los aprueba o rechaza en Concesionarios (`mkt-admin`: `aprobar_cambios` / `rechazar_cambios`).
- Página pública `agencia.html?id=<uuid>` (funciones `mkt_agencia` y `mkt_autos_agencia`). El logo se ve en las tarjetas, en la ficha y en esa página; "Ver todo su stock" lleva ahí. Las consultas por WhatsApp van al número de ventas si lo cargó.
