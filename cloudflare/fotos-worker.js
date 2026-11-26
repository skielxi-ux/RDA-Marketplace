// Cloudflare Worker: sirve las fotos de los autos con caché de Cloudflare.
// https://fotos.<dominio>/<cuenta>/<foto>.webp  →  Supabase Storage (bucket público mkt-fotos)
// Cada foto tiene un nombre único que nunca cambia (al reemplazarla se crea otra), así que se guarda
// en caché 1 año: Supabase la entrega una sola vez por zona de Cloudflare y después sale gratis desde Cloudflare.
const ORIGEN = 'https://ytuecptdgtmrbiddyzht.supabase.co/storage/v1/object/public/mkt-fotos';
const RUTA = /^\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/;
const UN_ANIO = 31536000;

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Método no permitido', { status: 405 });
    if (!RUTA.test(url.pathname)) return new Response('No encontrada', { status: 404 });

    const cache = caches.default;
    const clave = new Request(url.origin + url.pathname, { method: 'GET' }); // sin parámetros: una sola copia por foto
    let res = await cache.match(clave);
    if (!res) {
      const r = await fetch(ORIGEN + url.pathname, { cf: { cacheEverything: true, cacheTtl: UN_ANIO } });
      if (!r.ok) return new Response('No encontrada', { status: r.status === 404 || r.status === 400 ? 404 : 502 });
      res = new Response(r.body, r);
      res.headers.set('Cache-Control', `public, max-age=${UN_ANIO}, immutable`);
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('X-Content-Type-Options', 'nosniff');
      for (const h of ['set-cookie', 'x-amz-request-id', 'x-envoy-upstream-service-time']) res.headers.delete(h);
      ctx.waitUntil(cache.put(clave, res.clone()));
    }
    return req.method === 'HEAD' ? new Response(null, { status: res.status, headers: res.headers }) : res;
  },
};
