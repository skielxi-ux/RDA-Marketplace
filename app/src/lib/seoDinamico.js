// SEO de las páginas que se arman en el navegador (ficha de auto real y página de agencia).
/** Si el contenido no existe, que los buscadores no indexen la página. */
export function sinIndexar() {
  let m = document.querySelector('meta[name="robots"]');
  if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.append(m); }
  m.content = 'noindex, follow';
}

/** Dirección canónica: una sola URL por auto o agencia (sin ?ref=, ?utm_source=…). */
export function canonica(url) {
  let l = document.querySelector('link[rel="canonical"]');
  if (!l) { l = document.createElement('link'); l.rel = 'canonical'; document.head.append(l); }
  l.href = url;
}
