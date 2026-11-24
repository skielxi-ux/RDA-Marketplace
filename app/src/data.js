// Datos de ejemplo. Más adelante se reemplazan por el stock real (Supabase).
const U = (id, q = 'w=900&h=600&fit=crop') => `https://images.unsplash.com/${id}?${q}&auto=format&q=75`;

// Tres "fotos" por auto: la principal y dos detalles (recortes) hasta tener fotos reales.
const shots = (id) => [
  U(id),
  U(id, 'w=900&h=600&fit=crop&crop=focalpoint&fp-x=.3&fp-y=.55&fp-z=1.7'),
  U(id, 'w=900&h=600&fit=crop&crop=focalpoint&fp-x=.72&fp-y=.5&fp-z=1.7'),
];

export const heroSlides = [
  { img: U('photo-1568605117036-5fe5e7bab0b7', 'w=2000&h=1100&fit=crop'), title: 'Un auto para cada estilo de vida' },
  { img: U('photo-1494905998402-395d579af36f', 'w=2000&h=1100&fit=crop'), title: 'Encontrá tu 0km o usado ideal' },
  { img: U('photo-1555215695-3004980ad54e', 'w=2000&h=1100&fit=crop'), title: 'Comprar el auto correcto, simple' },
];

export const makes = {
  Toyota: ['Corolla', 'Hilux', 'Yaris', 'SW4', 'Corolla Cross'],
  Volkswagen: ['Polo', 'Taos', 'Amarok', 'T-Cross', 'Nivus'],
  Ford: ['Ranger', 'Territory', 'Mustang', 'Bronco Sport'],
  Chevrolet: ['Cruze', 'Tracker', 'Onix', 'S10', 'Camaro'],
  Fiat: ['Cronos', 'Pulse', 'Toro', '500'],
  Audi: ['A3', 'A4', 'A7', 'Q3', 'Q5'],
  BMW: ['Serie 1', 'Serie 3', 'M4', 'X1', 'X3'],
  Peugeot: ['208', '2008', '3008', 'Partner'],
};

export const bodyTypes = [
  { name: 'SUV', count: 128, img: U('photo-1563720223185-11003d516935', 'w=600&h=700&fit=crop') },
  { name: 'Sedán', count: 96, img: U('photo-1616422285623-13ff0162193c', 'w=600&h=700&fit=crop') },
  { name: 'Hatchback', count: 74, img: U('photo-1541899481282-d53bffe3c35d', 'w=600&h=700&fit=crop') },
  { name: 'Eléctrico', count: 12, img: U('photo-1606016159991-dfe4f2746ad5', 'w=600&h=700&fit=crop') },
  { name: 'Deportivo', count: 21, img: U('photo-1632245889029-e406faaa34cd', 'w=600&h=700&fit=crop') },
];

export const reasons = [
  { icon: 'badge-percent', title: 'Financiación a tu medida', text: 'Las agencias de la red te ofrecen créditos y planes para que pagues como te quede cómodo.' },
  { icon: 'shield-check', title: 'Agencias verificadas', text: 'Cada concesionario y agencia pasa por una verificación antes de publicar.' },
  { icon: 'receipt-text', title: 'Precios transparentes', text: 'Ves el precio publicado de cada unidad, sin letra chica ni sorpresas.' },
  { icon: 'wrench', title: 'Servicio y garantía', text: 'Unidades revisadas y, en 0km, con la garantía oficial de fábrica.' },
];

// seller: 'oficial' = concesionario oficial, 'multimarca' = agencia multimarca
export const listings = {
  nuevos: [
    { title: 'Toyota Corolla XEi 2.0 CVT', sub: '0km · Híbrido disponible · Entrega en 30 días', km: '0 km', fuel: 'Nafta', gear: 'Automática', year: 2026, price: 'US$ 34.900', badge: ['Mejor precio', 'ok'], seller: 'oficial', city: 'Tucumán', img: shots('photo-1619682817481-e994891cd1f5') },
    { title: 'Volkswagen Polo Track 1.6', sub: '0km · Manual 5 velocidades', km: '0 km', fuel: 'Nafta', gear: 'Manual', year: 2026, price: 'US$ 19.800', badge: null, seller: 'oficial', city: 'Córdoba', img: shots('photo-1541899481282-d53bffe3c35d') },
    { title: 'Audi A7 Sportback 45 TFSI', sub: '0km · quattro S tronic', km: '0 km', fuel: 'Nafta', gear: 'Automática', year: 2026, price: 'US$ 118.000', badge: ['Oficial', 'brand'], seller: 'oficial', city: 'CABA', img: shots('photo-1616422285623-13ff0162193c') },
    { title: 'Range Rover Sport P400', sub: '0km · Dynamic SE', km: '0 km', fuel: 'Híbrido', gear: 'Automática', year: 2026, price: 'US$ 165.000', badge: null, seller: 'oficial', city: 'Rosario', img: shots('photo-1563720223185-11003d516935') },
    { title: 'Porsche 718 Boxster', sub: '0km · PDK', km: '0 km', fuel: 'Nafta', gear: 'Automática', year: 2026, price: 'US$ 142.500', badge: ['Oferta', 'ok'], seller: 'oficial', city: 'CABA', img: shots('photo-1632245889029-e406faaa34cd') },
    { title: 'Mercedes-AMG GT 63', sub: '0km · 4MATIC+', km: '0 km', fuel: 'Nafta', gear: 'Automática', year: 2026, price: 'US$ 210.000', badge: null, seller: 'oficial', city: 'Mendoza', img: shots('photo-1605559424843-9e4c228bf1c2') },
  ],
  usados: [
    { title: 'Ford Mustang GT 5.0', sub: 'Único dueño · Service oficial', km: '28.000 km', fuel: 'Nafta', gear: 'Automática', year: 2019, price: 'US$ 52.000', badge: ['Pocos km', 'brand'], seller: 'multimarca', city: 'Tucumán', img: shots('photo-1494976388531-d1058494cdd8') },
    { title: 'Chevrolet Camaro SS', sub: 'Impecable · Escape deportivo', km: '41.500 km', fuel: 'Nafta', gear: 'Automática', year: 2018, price: 'US$ 45.900', badge: null, seller: 'multimarca', city: 'Salta', img: shots('photo-1552519507-da3b142c6e3d') },
    { title: 'Fiat 500 Lounge 1.4', sub: 'Ideal ciudad · Techo panorámico', km: '62.000 km', fuel: 'Nafta', gear: 'Manual', year: 2016, price: 'US$ 13.500', badge: ['Mejor precio', 'ok'], seller: 'multimarca', city: 'Córdoba', img: shots('photo-1549317661-bd32c8ce0db2') },
    { title: 'BMW M4 Competition', sub: 'Garantía de agencia 6 meses', km: '19.000 km', fuel: 'Nafta', gear: 'Automática', year: 2021, price: 'US$ 98.000', badge: ['Pocos km', 'brand'], seller: 'multimarca', city: 'CABA', img: shots('photo-1580273916550-e323be2ae537') },
    { title: 'Audi A6 45 TFSI', sub: 'Full · Libro de service', km: '55.000 km', fuel: 'Nafta', gear: 'Automática', year: 2020, price: 'US$ 47.000', badge: null, seller: 'oficial', city: 'Rosario', img: shots('photo-1606664515524-ed2f786a0bd6') },
    { title: 'Ford Explorer Limited', sub: '7 asientos · 4x4', km: '73.000 km', fuel: 'Nafta', gear: 'Automática', year: 2019, price: 'US$ 39.900', badge: null, seller: 'multimarca', city: 'Tucumán', img: shots('photo-1533473359331-0135ef1b58bf') },
  ],
  inmediata: [],
};
listings.inmediata = [listings.nuevos[0], listings.usados[2], listings.nuevos[1], listings.usados[0], listings.usados[5], listings.nuevos[3]];
