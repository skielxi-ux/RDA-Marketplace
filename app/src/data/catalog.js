// Datos fijos del sitio (hero, carrocerías, tipos de vendedor) y accesos comunes a los autos.
// Los autos son todos reales: los carga cada agencia o particular y llegan de Supabase (data/autosReales.js).

/** URL de Unsplash con recorte y formato automático (WebP/AVIF según el navegador). */
export const unsplash = (id, w, h, extra = '') =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=72${extra}`;

/** srcset responsive para una foto con proporción fija. */
export const srcset = (id, ratio, widths, extra = '') =>
  widths.map((w) => `${unsplash(id, w, Math.round(w / ratio), extra)} ${w}w`).join(', ');

// Fotos propias del hero (en app/public/img/hero, en WebP 16:9 a 640/1024/1600/2400 px), sin texto encima.
// pos: punto de la foto que queda a la vista cuando se recorta (celular).
export const heroSlides = [
  { file: 'byd-dolphin-mini', pos: '62% 55%', alt: 'BYD Dolphin Mini amarillo en una calle de edificios de colores' },
  { file: 'mg3', pos: '45% 55%', alt: 'MG3 azul frente a una estructura naranja con el cielo de fondo' },
  { file: 'concesionario', pos: '48% 50%', alt: 'Pareja sonriente revisando el baúl de un auto en un concesionario' },
];
export const HERO_WIDTHS = [640, 1024, 1600, 2400];
export const heroSrc = (file, w) => `./img/hero/${file}-${w}.webp`;

export const bodyTypeList = [
  // Fotos propias en app/public/img/carrocerias/{slug}-{300|450|600}.webp (6:7, oscurecidas con el mismo estilo)
  { slug: 'suv', name: 'SUV', alt: 'Toyota Corolla Cross' },
  { slug: 'sedan', name: 'Sedán', alt: 'Honda Civic' },
  { slug: 'hatchback', name: 'Hatchback', alt: 'Peugeot 208' },
  { slug: 'electrico', name: 'Eléctrico', alt: 'BYD Dolphin Mini' },
  { slug: 'deportivo', name: 'Deportivo', alt: 'Volkswagen Vento GLI' },
];

export const reasons = [
  { icon: 'message-circle', title: 'Hablá directo con el vendedor', text: 'Escribile por WhatsApp a la agencia, al concesionario o al particular, sin intermediarios.' },
  { icon: 'shield-check', title: 'Agencias verificadas', text: 'Cada concesionario y agencia pasa por una verificación antes de publicar.' },
  { icon: 'receipt-text', title: 'Precios transparentes', text: 'Ves el precio publicado de cada unidad, sin letra chica ni sorpresas.' },
  { icon: 'car', title: '0km y usados en un solo lugar', text: 'Concesionarios oficiales, agencias y particulares en una misma búsqueda.' },
];

// Vendedores de ejemplo: ya no hay (todos los autos son de cuentas reales).
export const sellers = {};

// Centro aproximado de cada ciudad: el mapa muestra la ZONA, nunca la dirección exacta.
export const CITY_COORDS = {
  'San Miguel de Tucumán': [-26.8083, -65.2176],
  'Yerba Buena': [-26.8167, -65.3167],
  'Córdoba': [-31.4201, -64.1888],
  'CABA': [-34.6037, -58.3816],
  'Rosario': [-32.9442, -60.6505],
  'Mendoza': [-32.8895, -68.8458],
  'Salta': [-24.7821, -65.4232],
};

// Equipamiento de ejemplo por nivel (en la base real lo carga cada vendedor).

export const SELLER_TYPES = {
  oficial: 'Concesionario oficial',
  multimarca: 'Agencia multimarca',
  particular: 'Particular',
};

/** Ficha de cada auto (auto.html?id=). */
export const carUrl = (c) => (c.real ? `./auto.html?id=${encodeURIComponent(c.id)}` : `./auto-${c.id}.html`);

// ---- Accesos comunes a los autos ----
/** Vendedor del auto: { name, type, phone } (en los reales viene de la cuenta que lo publicó). */
export const sellerOf = (c) => c.sellerInfo ?? sellers[c.seller];
/** Cantidad de fotos del auto. */
export const photoCount = (c) => (c.photoUrls ? c.photoUrls.length : c.gallery.length);
/** URL de la foto i (las reales ya vienen achicadas a 1600 px; w y h solo se usan con Unsplash). */
export const carShot = (c, i, w, h) => (c.photoUrls ? c.photoUrls[i] : unsplash(c.gallery[i].id, w, h, c.gallery[i].crop));
/** Nombres de todas las carrocerías (incluye las que solo pueden cargar las agencias). */
export const BODY_NAMES = { suv: 'SUV', sedan: 'Sedán', hatchback: 'Hatchback', pickup: 'Pick-up', deportivo: 'Deportivo', utilitario: 'Utilitario', electrico: 'Eléctrico' };

// Sin autos de ejemplo: el listado, la home y las fichas muestran solo los autos reales.
export const cars = [];

/** Datos derivados del catálogo (así los números siempre coinciden con el listado). */
export const carTitle = (c) => `${c.brand} ${c.model} ${c.version}`;
export const brandsInStock = [...new Set(cars.map((c) => c.brand))].sort((a, b) => a.localeCompare(b, 'es'));
export const modelsByBrand = cars.reduce((acc, c) => {
  (acc[c.brand] ||= new Set()).add(c.model);
  return acc;
}, {});
export const countBy = (fn) => cars.filter(fn).length;
export const bodyTypes = bodyTypeList.map((t) => ({ ...t, count: countBy((c) => c.body === t.slug) }));

export const featuredTabs = [
  { key: 'nuevos', label: '0km', cars: cars.filter((c) => c.condition === 'new').slice(0, 8) },
  { key: 'usados', label: 'Usados', cars: cars.filter((c) => c.condition === 'used').slice(0, 8) },
  { key: 'particulares', label: 'De particulares', cars: cars.filter((c) => sellers[c.seller].type === 'particular') },
];
