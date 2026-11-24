// Contenido de la segunda mitad de la home.

// Bloque "Para particulares": venta directa entre particulares (decisión 24/11/2026).
export const sellPrivate = {
  eyebrow: 'Para particulares',
  title: '¿Tenés un auto o una moto para vender? Publicalo sin costo.',
  text: 'Tu publicación aparece junto al stock de agencias y concesionarios de todo el país, y los compradores te contactan directo por WhatsApp.',
  primary: { label: 'Publicar mi vehículo', href: '#publicar' },
  secondary: { label: 'Ver cómo funciona', href: '#como-funciona' },
  steps: [
    { icon: 'camera', title: 'Subí fotos y datos', text: 'Marca, modelo, año, kilómetros y precio. Lo completás en pocos minutos.' },
    { icon: 'clipboard-check', title: 'Validamos tu publicación', text: 'Revisamos la información y las fotos antes de que salga online.' },
    { icon: 'message-circle', title: 'Recibí consultas por WhatsApp', text: 'Coordinás directo con los compradores interesados.' },
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
