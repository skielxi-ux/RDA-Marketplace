# Fotos por Cloudflare

Las fotos de los autos se guardan en Supabase, pero se sirven a través de Cloudflare con caché de 1 año.
Así casi no se usa la transferencia del plan gratis de Supabase.

## Puesta en marcha (una sola vez, con el dominio ya agregado en Cloudflare)

1. Cloudflare → Workers & Pages → Create → Worker → nombre `rda-fotos`. Pegar `fotos-worker.js` y desplegar.
2. En el Worker → Settings → Domains & Routes → Add → Custom domain: `fotos.<dominio>` (Cloudflare crea el DNS solo).
3. Probar: `https://fotos.<dominio>/<ruta de una foto>` tiene que mostrar la foto (segunda vez: cabecera `cf-cache-status: HIT`).
4. En `app/src/data/site.js` poner `fotosCdn: 'https://fotos.<dominio>'`, compilar y publicar.
   La política de seguridad (CSP) suma ese dominio sola.

Para volver a Supabase directo: `fotosCdn: ''`.
