// Páginas para compartir autos reales (c/<id>.html): WhatsApp, Facebook y Telegram no ejecutan JavaScript,
// así que leen la foto, el título y el precio de estas páginas fijas. A las personas las mandan al instante a la ficha
// (auto.html?id=…), conservando el código del vendedor independiente (?ref=…).
// Se corre en GitHub Actions cada 15 minutos (.github/workflows/compartir.yml). Necesita sharp.
import { mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { SITE } from '../app/src/data/site.js';
import { formatPrice, formatKm } from '../app/src/lib/html.js';

const DIR = 'c';
const IMG = `${DIR}/img`;
const INDICE = `${DIR}/indice.json`; // id → foto de origen, para no regenerar imágenes que no cambiaron
const VERSION = 2; // subir para regenerar todas las imágenes (cambio de encuadre)
const SEGURA = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/;
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const res = await fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_autos_publicos`, {
  method: 'POST', headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' }, body: '{}',
});
if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
const autos = (await res.json()).filter((a) => ID.test(a.id) && SEGURA.test(a.fotos?.[0] ?? ''));

mkdirSync(IMG, { recursive: true });
const indice = existsSync(INDICE) ? JSON.parse(readFileSync(INDICE, 'utf8')) : {};
const nuevo = {};

for (const a of autos) {
  const foto = a.fotos[0];
  const img = `${IMG}/${a.id}.jpg`;
  const clave = `${foto}#${VERSION}`;
  if (indice[a.id] !== clave || !existsSync(img)) {
    const r = await fetch(`${SITE.supabase.url}/storage/v1/object/public/mkt-fotos/${foto}`);
    if (!r.ok) { console.warn('sin foto', a.id); continue; }
    await sharp(Buffer.from(await r.arrayBuffer())).rotate().resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 78, mozjpeg: true }).toFile(img);
  }
  nuevo[a.id] = clave;

  const titulo = `${a.marca} ${a.modelo} ${a.anio} · ${formatPrice(Number(a.precio), a.moneda)}`;
  const antes = a.precio_antes && Number(a.precio_antes) > Number(a.precio) ? ` (antes ${formatPrice(Number(a.precio_antes), a.moneda)})` : '';
  const relampago = a.etiqueta === 'relampago' ? '🔥 Precio relámpago. ' : '';
  const desc = `${relampago}${a.version} · ${a.condicion === '0km' ? '0km' : formatKm(a.km)} · ${a.ciudad}, ${a.provincia}${antes}. Vendido por ${a.vendedor_nombre} en Red de Autos.`;
  const ficha = `${SITE.url}auto.html?id=${a.id}`;
  const url = `${SITE.url}${DIR}/${a.id}.html`;
  writeFileSync(`${DIR}/${a.id}.html`, `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(titulo)} | Red de Autos</title>
<meta name="robots" content="noindex, follow" />
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${esc(ficha)}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="Red de Autos" />
<meta property="og:locale" content="es_AR" />
<meta property="og:title" content="${esc(titulo)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${esc(`${SITE.url}${img}`)}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(`${a.marca} ${a.modelo} ${a.version} ${a.anio}`)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta http-equiv="refresh" content="1;url=${esc(ficha)}" />
<script>var r=(new URLSearchParams(location.search).get('ref')||'').toUpperCase();location.replace(${JSON.stringify(ficha)}+(/^[A-Z2-9]{6}$/.test(r)?'&ref='+r:'&utm_source=link%20compartido'));</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:24px">
<p><a href="${esc(ficha)}">Ver ${esc(titulo)} en Red de Autos</a></p>
</body>
</html>
`);
}

// Autos que ya no están publicados: se borran su página y su imagen
for (const f of readdirSync(DIR)) {
  const id = f.replace(/\.html$/, '');
  if (f.endsWith('.html') && !nuevo[id]) rmSync(`${DIR}/${f}`);
}
for (const f of readdirSync(IMG)) if (!nuevo[f.replace(/\.jpg$/, '')]) rmSync(`${IMG}/${f}`);
writeFileSync(INDICE, `${JSON.stringify(nuevo, null, 1)}\n`);
console.log(`Páginas para compartir: ${Object.keys(nuevo).length}`);
