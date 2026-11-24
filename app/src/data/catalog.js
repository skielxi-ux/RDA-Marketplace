// Catálogo de ejemplo. Más adelante se reemplaza por el stock real (Supabase).

/** URL de Unsplash con recorte y formato automático (WebP/AVIF según el navegador). */
export const unsplash = (id, w, h, extra = '') =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=72${extra}`;

/** srcset responsive para una foto con proporción fija. */
export const srcset = (id, ratio, widths, extra = '') =>
  widths.map((w) => `${unsplash(id, w, Math.round(w / ratio), extra)} ${w}w`).join(', ');

// Recortes de detalle para la galería hasta tener 3+ fotos reales por auto.
const DETAIL_CROPS = [
  '',
  '&crop=focalpoint&fp-x=.3&fp-y=.55&fp-z=1.7',
  '&crop=focalpoint&fp-x=.72&fp-y=.5&fp-z=1.7',
  '&crop=focalpoint&fp-x=.5&fp-y=.62&fp-z=2.2',
  '&crop=focalpoint&fp-x=.2&fp-y=.45&fp-z=1.4',
];
const gallery = (id) => DETAIL_CROPS.map((crop) => ({ id, crop }));

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
  { slug: 'suv', name: 'SUV', photo: 'photo-1563720223185-11003d516935' },
  { slug: 'sedan', name: 'Sedán', photo: 'photo-1616422285623-13ff0162193c' },
  { slug: 'hatchback', name: 'Hatchback', photo: 'photo-1541899481282-d53bffe3c35d' },
  { slug: 'electrico', name: 'Eléctrico', photo: 'photo-1606016159991-dfe4f2746ad5' },
  { slug: 'deportivo', name: 'Deportivo', photo: 'photo-1632245889029-e406faaa34cd' },
];

export const reasons = [
  { icon: 'message-circle', title: 'Hablá directo con el vendedor', text: 'Escribile por WhatsApp a la agencia, al concesionario o al particular, sin intermediarios.' },
  { icon: 'shield-check', title: 'Agencias verificadas', text: 'Cada concesionario y agencia pasa por una verificación antes de publicar.' },
  { icon: 'receipt-text', title: 'Precios transparentes', text: 'Ves el precio publicado de cada unidad, sin letra chica ni sorpresas.' },
  { icon: 'car', title: '0km y usados en un solo lugar', text: 'Concesionarios oficiales, agencias y particulares en una misma búsqueda.' },
];

// ---------- Vendedores (ficticios, de ejemplo) ----------
// type: 'oficial' (concesionario oficial) | 'multimarca' (agencia) | 'particular'
// phone: número de WhatsApp en formato internacional sin "+" (ej. 5493815551234).
// En los vendedores de ejemplo va vacío: el botón de WhatsApp abre WhatsApp para elegir contacto
// y no se muestra "Llamar" (así nunca escribimos a un número real por error).
export const sellers = {
  'jardin-automotores': { name: 'Jardín Automotores', type: 'oficial', phone: '' },
  'sol-motors': { name: 'Sol Motors', type: 'oficial', phone: '' },
  'ruta9-autos': { name: 'Ruta 9 Autos', type: 'multimarca', phone: '' },
  'garage-38': { name: 'Garage 38', type: 'multimarca', phone: '' },
  'juan-pablo-m': { name: 'Juan Pablo M.', type: 'particular', phone: '' },
  'carolina-r': { name: 'Carolina R.', type: 'particular', phone: '' },
};

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
const FEATURES = {
  base: {
    Confort: ['Aire acondicionado', 'Dirección asistida', 'Levantavidrios eléctricos', 'Cierre centralizado'],
    Seguridad: ['ABS', 'Airbags frontales', 'Control de estabilidad', 'Anclajes ISOFIX'],
    Multimedia: ['Bluetooth', 'Pantalla táctil', 'Apple CarPlay', 'Android Auto'],
    Exterior: ['Llantas de aleación', 'Faros antiniebla'],
  },
  full: {
    Confort: ['Climatizador bizona', 'Tapizado de cuero', 'Asientos eléctricos', 'Techo solar', 'Arranque sin llave'],
    Seguridad: ['ABS', '6+ airbags', 'Control de estabilidad', 'Asistente de frenado', 'Cámara de retroceso', 'Sensores de estacionamiento'],
    Multimedia: ['Bluetooth', 'Pantalla táctil', 'Apple CarPlay', 'Android Auto', 'Cargador inalámbrico'],
    Exterior: ['Llantas de aleación', 'Faros LED', 'Sensor de lluvia', 'Espejos rebatibles eléctricos'],
  },
};

export const SELLER_TYPES = {
  oficial: 'Concesionario oficial',
  multimarca: 'Agencia multimarca',
  particular: 'Particular',
};

// ---------- Autos (ejemplo) ----------
// condition: 'new' | 'used' · currency: 'ARS' | 'USD' (la que cargó el vendedor)
// badge: 'nuevo' | 'pocos-km' | 'mejor-precio' | 'oferta' | null · body: slug de bodyTypeList
const EXTRAS = {
  'toyota-corolla-xei-2026': { engine: '2.0', doors: 4, color: 'Blanco perlado', drive: 'Delantera', features: 'full', dims: { Largo: '4.630 mm', Ancho: '1.780 mm', Alto: '1.435 mm', 'Distancia entre ejes': '2.700 mm', 'Baúl': '470 L', 'Tanque': '50 L', Asientos: '5' } },
  'volkswagen-polo-track-2026': { engine: '1.6', doors: 5, color: 'Azul', drive: 'Delantera', features: 'base', dims: { Largo: '4.070 mm', Ancho: '1.750 mm', Alto: '1.470 mm', 'Distancia entre ejes': '2.570 mm', 'Baúl': '300 L', 'Tanque': '52 L', Asientos: '5' } },
  'audi-a7-sportback-2026': { engine: '2.0 TFSI', doors: 5, color: 'Gris', drive: 'Integral (quattro)', features: 'full', dims: { Largo: '4.970 mm', Ancho: '1.910 mm', Alto: '1.420 mm', 'Distancia entre ejes': '2.930 mm', 'Baúl': '535 L', 'Tanque': '63 L', Asientos: '5' } },
  'range-rover-sport-p400-2026': { engine: '3.0 híbrido', doors: 5, color: 'Negro', drive: 'Integral', features: 'full', dims: { Largo: '4.950 mm', Ancho: '2.050 mm', Alto: '1.820 mm', 'Distancia entre ejes': '3.000 mm', 'Baúl': '650 L', 'Tanque': '80 L', Asientos: '5' } },
  'porsche-718-boxster-2026': { engine: '2.0 turbo', doors: 2, color: 'Amarillo', drive: 'Trasera', features: 'full' },
  'mercedes-amg-gt-63-2026': { engine: '4.0 V8 biturbo', doors: 2, color: 'Amarillo', drive: 'Integral', features: 'full' },
  'ford-mustang-gt-2019': { engine: '5.0 V8', doors: 2, color: 'Negro', drive: 'Trasera', features: 'full' },
  'chevrolet-camaro-ss-2018': { engine: '6.2 V8', doors: 2, color: 'Azul', drive: 'Trasera', features: 'full' },
  'fiat-500-lounge-2016': { engine: '1.4', doors: 3, color: 'Celeste', drive: 'Delantera', features: 'base' },
  'bmw-m4-competition-2021': { engine: '3.0 turbo', doors: 2, color: 'Gris', drive: 'Trasera', features: 'full' },
  'audi-a6-45-tfsi-2020': { engine: '2.0 TFSI', doors: 4, color: 'Negro', drive: 'Delantera', features: 'full' },
  'ford-explorer-limited-2019': { engine: '3.5 V6', doors: 5, color: 'Blanco', drive: 'Integral 4x4', features: 'full' },
  'bmw-320i-2019': { engine: '2.0 turbo', doors: 4, color: 'Blanco', drive: 'Trasera', features: 'base' },
  'bmw-m240i-2018': { engine: '3.0 turbo', doors: 2, color: 'Azul', drive: 'Trasera', features: 'full' },
};

const car = (o) => {
  const x = EXTRAS[o.id] ?? {};
  return { reviews: [], dims: null, ...o, ...x, features: FEATURES[x.features ?? 'base'], gallery: gallery(o.photo), coords: CITY_COORDS[o.city] ?? null };
};

/** Ficha de cada auto: las de ejemplo se arman en el build (auto-<id>.html); las cargadas por agencias, en auto.html?id=. */
export const carUrl = (c) => (c.real ? `./auto.html?id=${encodeURIComponent(c.id)}` : `./auto-${c.id}.html`);

// ---- Accesos comunes a autos de ejemplo y autos reales (cargados por agencias) ----
/** Vendedor del auto: { name, type, phone } (en los reales viene de la cuenta que lo publicó). */
export const sellerOf = (c) => c.sellerInfo ?? sellers[c.seller];
/** Cantidad de fotos del auto. */
export const photoCount = (c) => (c.photoUrls ? c.photoUrls.length : c.gallery.length);
/** URL de la foto i (las reales ya vienen achicadas a 1600 px; w y h solo se usan con Unsplash). */
export const carShot = (c, i, w, h) => (c.photoUrls ? c.photoUrls[i] : unsplash(c.gallery[i].id, w, h, c.gallery[i].crop));
/** Nombres de todas las carrocerías (incluye las que solo pueden cargar las agencias). */
export const BODY_NAMES = { suv: 'SUV', sedan: 'Sedán', hatchback: 'Hatchback', pickup: 'Pick-up', deportivo: 'Deportivo', utilitario: 'Utilitario', electrico: 'Eléctrico' };

export const cars = [
  car({ id: 'toyota-corolla-xei-2026', brand: 'Toyota', model: 'Corolla', version: 'XEi 2.0 CVT', year: 2026, km: 0, condition: 'new', fuel: 'Nafta', gear: 'Automática', body: 'sedan', price: 41500000, currency: 'ARS', desc: 'Entrega en 30 días. Versión híbrida disponible, garantía oficial de 3 años.', city: 'San Miguel de Tucumán', province: 'Tucumán', seller: 'jardin-automotores', badge: 'nuevo', published: 20, photo: 'photo-1619682817481-e994891cd1f5' }),
  car({ id: 'volkswagen-polo-track-2026', brand: 'Volkswagen', model: 'Polo', version: 'Track 1.6', year: 2026, km: 0, condition: 'new', fuel: 'Nafta', gear: 'Manual', body: 'hatchback', price: 26900000, currency: 'ARS', desc: 'Caja manual de 5 velocidades, aire acondicionado y pantalla táctil.', city: 'Córdoba', province: 'Córdoba', seller: 'sol-motors', badge: 'mejor-precio', published: 19, photo: 'photo-1541899481282-d53bffe3c35d' }),
  car({ id: 'audi-a7-sportback-2026', brand: 'Audi', model: 'A7', version: 'Sportback 45 TFSI', year: 2026, km: 0, condition: 'new', fuel: 'Nafta', gear: 'Automática', body: 'sedan', price: 118000, currency: 'USD', desc: 'Tracción quattro, caja S tronic, techo panorámico y faros Matrix LED.', city: 'CABA', province: 'Buenos Aires', seller: 'sol-motors', badge: 'nuevo', published: 18, photo: 'photo-1616422285623-13ff0162193c' }),
  car({ id: 'range-rover-sport-p400-2026', brand: 'Land Rover', model: 'Range Rover Sport', version: 'P400 Dynamic SE', year: 2026, km: 0, condition: 'new', fuel: 'Híbrido', gear: 'Automática', body: 'suv', price: 165000, currency: 'USD', desc: 'Motor híbrido enchufable, suspensión neumática y asientos con masaje.', city: 'Rosario', province: 'Santa Fe', seller: 'jardin-automotores', badge: 'nuevo', published: 17, photo: 'photo-1563720223185-11003d516935' }),
  car({ id: 'porsche-718-boxster-2026', brand: 'Porsche', model: '718 Boxster', version: 'PDK', year: 2026, km: 0, condition: 'new', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 142500, currency: 'USD', desc: 'Descapotable con caja PDK, llantas de 20" y paquete Sport Chrono.', city: 'CABA', province: 'Buenos Aires', seller: 'sol-motors', badge: 'oferta', published: 16, photo: 'photo-1632245889029-e406faaa34cd' }),
  car({ id: 'mercedes-amg-gt-63-2026', brand: 'Mercedes-Benz', model: 'AMG GT', version: '63 4MATIC+', year: 2026, km: 0, condition: 'new', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 210000, currency: 'USD', desc: 'V8 biturbo, tracción integral 4MATIC+ y escape deportivo AMG.', city: 'Mendoza', province: 'Mendoza', seller: 'jardin-automotores', badge: 'nuevo', published: 15, photo: 'photo-1605559424843-9e4c228bf1c2' }),
  car({ id: 'ford-mustang-gt-2019', brand: 'Ford', model: 'Mustang', version: 'GT 5.0', year: 2019, km: 28000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 52000, currency: 'USD', desc: 'Único dueño, services oficiales al día y cubiertas nuevas.', city: 'Yerba Buena', province: 'Tucumán', seller: 'ruta9-autos', badge: 'pocos-km', published: 14, photo: 'photo-1494976388531-d1058494cdd8' }),
  car({ id: 'chevrolet-camaro-ss-2018', brand: 'Chevrolet', model: 'Camaro', version: 'SS', year: 2018, km: 41500, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 45900, currency: 'USD', desc: 'Impecable, escape deportivo, butacas de cuero y cámara de retroceso.', city: 'Salta', province: 'Salta', seller: 'garage-38', badge: 'pocos-km', published: 13, photo: 'photo-1552519507-da3b142c6e3d' }),
  car({ id: 'fiat-500-lounge-2016', brand: 'Fiat', model: '500', version: 'Lounge 1.4', year: 2016, km: 62000, condition: 'used', fuel: 'Nafta', gear: 'Manual', body: 'hatchback', price: 13500000, currency: 'ARS', desc: 'Ideal ciudad. Techo panorámico, aire acondicionado y llantas de aleación.', city: 'Córdoba', province: 'Córdoba', seller: 'carolina-r', badge: 'mejor-precio', published: 12, photo: 'photo-1549317661-bd32c8ce0db2' }),
  car({ id: 'bmw-m4-competition-2021', brand: 'BMW', model: 'M4', version: 'Competition', year: 2021, km: 19000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 98000, currency: 'USD', desc: 'Garantía de agencia por 6 meses, fibra de carbono y frenos M.', city: 'CABA', province: 'Buenos Aires', seller: 'garage-38', badge: 'pocos-km', published: 11, photo: 'photo-1580273916550-e323be2ae537' }),
  car({ id: 'audi-a6-45-tfsi-2020', brand: 'Audi', model: 'A6', version: '45 TFSI', year: 2020, km: 55000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'sedan', price: 47000, currency: 'USD', desc: 'Full equipo, libro de service completo y tapizado de cuero.', city: 'Rosario', province: 'Santa Fe', seller: 'sol-motors', badge: null, published: 10, photo: 'photo-1606664515524-ed2f786a0bd6' }),
  car({ id: 'ford-explorer-limited-2019', brand: 'Ford', model: 'Explorer', version: 'Limited 4x4', year: 2019, km: 73000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'suv', price: 39900, currency: 'USD', desc: 'Siete asientos, tracción 4x4, techo solar y sensores de estacionamiento.', city: 'San Miguel de Tucumán', province: 'Tucumán', seller: 'ruta9-autos', badge: null, published: 9, photo: 'photo-1533473359331-0135ef1b58bf' }),
  car({ id: 'bmw-320i-2019', brand: 'BMW', model: 'Serie 3', version: '320i Sport Line', year: 2019, km: 64000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'sedan', price: 38500000, currency: 'ARS', desc: 'Services en concesionario, llantas de 18" y faros LED.', city: 'Yerba Buena', province: 'Tucumán', seller: 'juan-pablo-m', badge: null, published: 8, photo: 'photo-1555215695-3004980ad54e' }),
  car({ id: 'bmw-m240i-2018', brand: 'BMW', model: 'Serie 2', version: 'M240i Coupé', year: 2018, km: 47000, condition: 'used', fuel: 'Nafta', gear: 'Automática', body: 'deportivo', price: 42000, currency: 'USD', desc: 'Coupé de 340 CV, butacas deportivas y equipo de audio Harman Kardon.', city: 'Mendoza', province: 'Mendoza', seller: 'garage-38', badge: 'pocos-km', published: 7, photo: 'photo-1502877338535-766e1452684a' }),
];

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
