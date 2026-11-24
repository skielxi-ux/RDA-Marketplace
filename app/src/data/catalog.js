// Catálogo de ejemplo. Más adelante se reemplaza por el stock real (Supabase).

/** URL de Unsplash con recorte y formato automático (WebP/AVIF según el navegador). */
export const unsplash = (id, w, h, extra = '') =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=72${extra}`;

/** srcset responsive para una foto con proporción fija. */
export const srcset = (id, ratio, widths, extra = '') =>
  widths.map((w) => `${unsplash(id, w, Math.round(w / ratio), extra)} ${w}w`).join(', ');

// Recortes de detalle para la galería hasta tener 3+ fotos reales por auto.
const DETAIL_CROPS = ['', '&crop=focalpoint&fp-x=.3&fp-y=.55&fp-z=1.7', '&crop=focalpoint&fp-x=.72&fp-y=.5&fp-z=1.7'];
const gallery = (id) => DETAIL_CROPS.map((crop) => ({ id, crop }));

export const heroSlides = [
  { photo: 'photo-1568605117036-5fe5e7bab0b7', title: 'Un auto para cada estilo de vida', alt: 'Auto deportivo blanco en una ruta al atardecer' },
  { photo: 'photo-1494905998402-395d579af36f', title: 'Encontrá tu 0km o usado ideal', alt: 'Auto deportivo gris entre árboles' },
  { photo: 'photo-1555215695-3004980ad54e', title: 'Comprar el auto correcto, simple', alt: 'Sedán blanco estacionado junto a palmeras' },
];

export const makes = {
  Toyota: ['Corolla', 'Hilux', 'Yaris', 'SW4', 'Corolla Cross'],
  Volkswagen: ['Polo', 'Taos', 'Amarok', 'T-Cross', 'Nivus'],
  Ford: ['Ranger', 'Territory', 'Mustang', 'Bronco Sport'],
  Chevrolet: ['Cruze', 'Tracker', 'Onix', 'S10', 'Camaro'],
  Fiat: ['Cronos', 'Pulse', 'Toro', '500'],
  Audi: ['A3', 'A4', 'A6', 'A7', 'Q3', 'Q5'],
  BMW: ['Serie 1', 'Serie 3', 'M4', 'X1', 'X3'],
  Peugeot: ['208', '2008', '3008', 'Partner'],
};

export const bodyTypes = [
  { slug: 'suv', name: 'SUV', count: 128, photo: 'photo-1563720223185-11003d516935' },
  { slug: 'sedan', name: 'Sedán', count: 96, photo: 'photo-1616422285623-13ff0162193c' },
  { slug: 'hatchback', name: 'Hatchback', count: 74, photo: 'photo-1541899481282-d53bffe3c35d' },
  { slug: 'electrico', name: 'Eléctrico', count: 12, photo: 'photo-1606016159991-dfe4f2746ad5' },
  { slug: 'deportivo', name: 'Deportivo', count: 21, photo: 'photo-1632245889029-e406faaa34cd' },
];

export const reasons = [
  { icon: 'badge-percent', title: 'Financiación a tu medida', text: 'Las agencias de la red te ofrecen créditos y planes para que pagues como te quede cómodo.' },
  { icon: 'shield-check', title: 'Agencias verificadas', text: 'Cada concesionario y agencia pasa por una verificación antes de publicar.' },
  { icon: 'receipt-text', title: 'Precios transparentes', text: 'Ves el precio publicado de cada unidad, sin letra chica ni sorpresas.' },
  { icon: 'wrench', title: 'Servicio y garantía', text: 'Unidades revisadas y, en 0km, con la garantía oficial de fábrica.' },
];

// condition: 'new' | 'used' · seller: 'oficial' (concesionario oficial) | 'multimarca' (agencia)
const car = (o) => ({ currency: 'USD', ...o, gallery: gallery(o.photo) });

const cars = {
  corolla: car({ id: 'toyota-corolla-xei-2026', brand: 'Toyota', model: 'Corolla XEi 2.0 CVT', sub: 'Híbrido disponible · Entrega en 30 días', condition: 'new', km: 0, fuel: 'Nafta', gear: 'Automática', year: 2026, price: 34900, badge: { text: 'Mejor precio', tone: 'ok' }, seller: 'oficial', city: 'Tucumán', photo: 'photo-1619682817481-e994891cd1f5' }),
  polo: car({ id: 'volkswagen-polo-track-2026', brand: 'Volkswagen', model: 'Polo Track 1.6', sub: 'Manual 5 velocidades', condition: 'new', km: 0, fuel: 'Nafta', gear: 'Manual', year: 2026, price: 19800, badge: null, seller: 'oficial', city: 'Córdoba', photo: 'photo-1541899481282-d53bffe3c35d' }),
  a7: car({ id: 'audi-a7-sportback-2026', brand: 'Audi', model: 'A7 Sportback 45 TFSI', sub: 'quattro S tronic', condition: 'new', km: 0, fuel: 'Nafta', gear: 'Automática', year: 2026, price: 118000, badge: { text: 'Oficial', tone: 'brand' }, seller: 'oficial', city: 'CABA', photo: 'photo-1616422285623-13ff0162193c' }),
  rrsport: car({ id: 'range-rover-sport-p400-2026', brand: 'Land Rover', model: 'Range Rover Sport P400', sub: 'Dynamic SE', condition: 'new', km: 0, fuel: 'Híbrido', gear: 'Automática', year: 2026, price: 165000, badge: null, seller: 'oficial', city: 'Rosario', photo: 'photo-1563720223185-11003d516935' }),
  boxster: car({ id: 'porsche-718-boxster-2026', brand: 'Porsche', model: '718 Boxster', sub: 'PDK', condition: 'new', km: 0, fuel: 'Nafta', gear: 'Automática', year: 2026, price: 142500, badge: { text: 'Oferta', tone: 'ok' }, seller: 'oficial', city: 'CABA', photo: 'photo-1632245889029-e406faaa34cd' }),
  amggt: car({ id: 'mercedes-amg-gt-63-2026', brand: 'Mercedes-Benz', model: 'AMG GT 63', sub: '4MATIC+', condition: 'new', km: 0, fuel: 'Nafta', gear: 'Automática', year: 2026, price: 210000, badge: null, seller: 'oficial', city: 'Mendoza', photo: 'photo-1605559424843-9e4c228bf1c2' }),
  mustang: car({ id: 'ford-mustang-gt-2019', brand: 'Ford', model: 'Mustang GT 5.0', sub: 'Único dueño · Service oficial', condition: 'used', km: 28000, fuel: 'Nafta', gear: 'Automática', year: 2019, price: 52000, badge: { text: 'Pocos km', tone: 'brand' }, seller: 'multimarca', city: 'Tucumán', photo: 'photo-1494976388531-d1058494cdd8' }),
  camaro: car({ id: 'chevrolet-camaro-ss-2018', brand: 'Chevrolet', model: 'Camaro SS', sub: 'Impecable · Escape deportivo', condition: 'used', km: 41500, fuel: 'Nafta', gear: 'Automática', year: 2018, price: 45900, badge: null, seller: 'multimarca', city: 'Salta', photo: 'photo-1552519507-da3b142c6e3d' }),
  fiat500: car({ id: 'fiat-500-lounge-2016', brand: 'Fiat', model: '500 Lounge 1.4', sub: 'Ideal ciudad · Techo panorámico', condition: 'used', km: 62000, fuel: 'Nafta', gear: 'Manual', year: 2016, price: 13500, badge: { text: 'Mejor precio', tone: 'ok' }, seller: 'multimarca', city: 'Córdoba', photo: 'photo-1549317661-bd32c8ce0db2' }),
  m4: car({ id: 'bmw-m4-competition-2021', brand: 'BMW', model: 'M4 Competition', sub: 'Garantía de agencia 6 meses', condition: 'used', km: 19000, fuel: 'Nafta', gear: 'Automática', year: 2021, price: 98000, badge: { text: 'Pocos km', tone: 'brand' }, seller: 'multimarca', city: 'CABA', photo: 'photo-1580273916550-e323be2ae537' }),
  a6: car({ id: 'audi-a6-45-tfsi-2020', brand: 'Audi', model: 'A6 45 TFSI', sub: 'Full · Libro de service', condition: 'used', km: 55000, fuel: 'Nafta', gear: 'Automática', year: 2020, price: 47000, badge: null, seller: 'oficial', city: 'Rosario', photo: 'photo-1606664515524-ed2f786a0bd6' }),
  explorer: car({ id: 'ford-explorer-limited-2019', brand: 'Ford', model: 'Explorer Limited', sub: '7 asientos · 4x4', condition: 'used', km: 73000, fuel: 'Nafta', gear: 'Automática', year: 2019, price: 39900, badge: null, seller: 'multimarca', city: 'Tucumán', photo: 'photo-1533473359331-0135ef1b58bf' }),
};

export const featuredTabs = [
  { key: 'nuevos', label: '0km', cars: [cars.corolla, cars.polo, cars.a7, cars.rrsport, cars.boxster, cars.amggt] },
  { key: 'usados', label: 'Usados', cars: [cars.mustang, cars.camaro, cars.fiat500, cars.m4, cars.a6, cars.explorer] },
  { key: 'inmediata', label: 'Entrega inmediata', cars: [cars.corolla, cars.fiat500, cars.polo, cars.mustang, cars.explorer, cars.rrsport] },
];
