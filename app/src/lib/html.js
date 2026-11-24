// Helpers puros (sirven en el build y en el navegador). No tocan el DOM.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa cualquier dato antes de meterlo en HTML. Usarlo SIEMPRE con datos de la base o de usuarios. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** JSON seguro para incrustar dentro de <script type="application/ld+json">. */
export const jsonForScript = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/** Precio con formato argentino: 34900 → "US$ 34.900". */
export const formatPrice = (value, currency = 'USD') =>
  `${currency === 'USD' ? 'US$' : '$'} ${Number(value).toLocaleString('es-AR')}`;

/** Kilómetros: 28000 → "28.000 km". */
export const formatKm = (km) => `${Number(km).toLocaleString('es-AR')} km`;
