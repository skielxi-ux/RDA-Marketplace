// Contenido de la segunda mitad de la home.

export const sellCta = {
  title: '¿Querés vender tu auto? Que las agencias te oferten',
  text: 'Cargás tu auto una sola vez y lo ven las agencias y concesionarios verificados de la red. Vos elegís la mejor oferta.',
  bullets: [
    'Publicarlo es gratis y te lleva unos minutos',
    'Te ofertan agencias verificadas de todo el país',
    'Decidís si lo vendés o lo dejás en consignación',
  ],
  cta: { label: 'Empezar', href: '#vender' },
  photos: [
    { id: 'photo-1606152421802-db97b9c7a11b', alt: 'Sedán gris estacionado en la calle' },
    { id: 'photo-1618843479313-40f8afb4b4d8', alt: 'Auto deportivo gris de frente' },
  ],
};

// EJEMPLO: cifras provisorias hasta tomarlas de la base (Supabase).
export const stats = [
  { value: 331, suffix: '', label: 'Autos publicados' },
  { value: 48, suffix: '', label: 'Agencias verificadas' },
  { value: 12, suffix: '', label: 'Concesionarios oficiales' },
  { value: 9, suffix: '', label: 'Provincias' },
];

// Solo reseñas REALES (nombre, texto y origen verificables). Si está vacío, la sección no se muestra.
// Formato: { name: 'Nombre A.', city: 'Tucumán', title: 'Compré mi auto', text: '...', rating: 5 }
export const testimonials = [];

export const brands = [
  { slug: 'toyota', name: 'Toyota', count: 64 },
  { slug: 'volkswagen', name: 'Volkswagen', count: 52 },
  { slug: 'ford', name: 'Ford', count: 41 },
  { slug: 'chevrolet', name: 'Chevrolet', count: 38 },
  { slug: 'fiat', name: 'Fiat', count: 35 },
  { slug: 'peugeot', name: 'Peugeot', count: 29 },
];

export const footer = {
  about: 'Marketplace de autos 0km y usados de agencias multimarca y concesionarios oficiales de todo el país.',
  join: {
    title: '¿Tenés una agencia o un concesionario?',
    text: 'Sumate a la red y recibí compradores que ya saben lo que buscan.',
    cta: { label: 'Sumá tu agencia', href: '#sumate' },
  },
  columns: [
    { title: 'Red de Autos', links: [['Quiénes somos', '#nosotros'], ['Cómo funciona', '#como-funciona'], ['Preguntas frecuentes', '#faq'], ['Contacto', '#contacto']] },
    { title: 'Comprá', links: [['Autos 0km', '#destacados'], ['Autos usados', '#destacados'], ['Entrega inmediata', '#destacados'], ['Concesionarios oficiales', '#concesionarios'], ['Agencias multimarca', '#agencias']] },
    { title: 'Marcas', links: [['Toyota', '#marca-toyota'], ['Volkswagen', '#marca-volkswagen'], ['Ford', '#marca-ford'], ['Chevrolet', '#marca-chevrolet'], ['Fiat', '#marca-fiat'], ['Peugeot', '#marca-peugeot']] },
    { title: 'Carrocerías', links: [['SUV', '#autos-suv'], ['Sedán', '#autos-sedan'], ['Hatchback', '#autos-hatchback'], ['Eléctrico', '#autos-electrico'], ['Deportivo', '#autos-deportivo']] },
  ],
  legal: [['Términos y condiciones', '#terminos'], ['Privacidad', '#privacidad']],
};
