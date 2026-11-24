// Helpers puros (sirven en el build y en el navegador). No tocan el DOM.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa cualquier dato antes de meterlo en HTML. Usarlo SIEMPRE con datos de la base o de usuarios. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** JSON seguro para incrustar dentro de <script type="application/ld+json">. */
export const jsonForScript = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/** Precio en la moneda que cargó el vendedor: (40000,'USD') → "USD 40.000" · (18200000,'ARS') → "$ 18.200.000". */
export const formatPrice = (value, currency = 'ARS') =>
  `${currency === 'USD' ? 'USD' : '$'} ${Number(value).toLocaleString('es-AR')}`;

/** Kilómetros: 28000 → "28.000 km". */
export const formatKm = (km) => `${Number(km).toLocaleString('es-AR')} km`;
