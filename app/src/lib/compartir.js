// Link para compartir un auto real: la página c/<id>.html tiene foto, título y precio para la vista previa de WhatsApp
// (se genera cada 15 minutos). Si todavía no existe (auto recién publicado), se comparte la ficha.
const cache = new Map();

/** URL para compartir el auto `id` (con el código del vendedor independiente si hay). */
export async function urlCompartir(id, ref = '') {
  const base = new URL('./', location.href);
  const ficha = new URL(`auto.html?id=${encodeURIComponent(id)}`, base);
  const share = new URL(`c/${encodeURIComponent(id)}.html`, base);
  if (!cache.has(id)) cache.set(id, fetch(share, { method: 'HEAD', cache: 'no-store' }).then((r) => r.ok).catch(() => false));
  const url = (await cache.get(id)) ? share : ficha;
  if (ref) url.searchParams.set('ref', ref);
  return url.toString();
}
