// Contenido de la segunda mitad de la home.

// Bloque "Para agencias y concesionarios".
export const forDealers = {
  eyebrow: 'Para agencias y concesionarios',
  title: '¿Tenés una agencia o un concesionario? Sumalo a Red de Autos.',
  text: 'Subí tu stock en minutos, mantenelo al día sin complicarte y recibí compradores que ya saben lo que buscan.',
  cta: { label: 'Sumá tu agencia', href: '#sumate' },
  features: [
    { icon: 'file-spreadsheet', title: 'Carga masiva con Excel', text: 'Subí todo tu stock desde una planilla y en 2 minutos queda publicado.' },
    { icon: 'images', title: 'Fichas completas con fotos', text: 'Cada auto sale con sus fotos, datos y precio, listo para recibir consultas.' },
    { icon: 'bot', title: 'Cambios con solo pedírselo al bot', text: 'Escribile al bot “bajá el Corolla a US$ 33.000” o “marcá vendido el Polo” y se actualiza solo.' },
    { icon: 'message-circle', title: 'Consultas por WhatsApp', text: 'Los compradores te escriben directo, con el auto que les interesa.' },
  ],
};

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
  { slug: 'toyota', name: 'Toyota' },
  { slug: 'volkswagen', name: 'Volkswagen' },
  { slug: 'ford', name: 'Ford' },
  { slug: 'chevrolet', name: 'Chevrolet' },
  { slug: 'fiat', name: 'Fiat' },
  { slug: 'peugeot', name: 'Peugeot' },
];

export const footer = {
  about: 'Marketplace de autos 0km y usados de agencias multimarca y concesionarios oficiales de todo el país.',
  join: {
    title: '¿Listo para vender más?',
    text: 'Publicá tu stock hoy y empezá a recibir consultas por WhatsApp.',
    cta: { label: 'Sumá tu agencia', href: '#sumate' },
  },
  columns: [
    { title: 'Red de Autos', links: [['Quiénes somos', './quienes-somos.html'], ['Cómo funciona', '#como-funciona'], ['Preguntas frecuentes', '#faq'], ['Contacto', '#contacto']] },
    { title: 'Comprá', links: [['Todos los autos', './autos.html'], ['Autos 0km', './autos.html?condicion=0km'], ['Autos usados', './autos.html?condicion=usados'], ['De concesionarios oficiales', './autos.html?vendedor=oficial'], ['De particulares', './autos.html?vendedor=particular']] },
    { title: 'Marcas', links: [['Toyota', './autos.html?marca=Toyota'], ['Volkswagen', './autos.html?marca=Volkswagen'], ['Ford', './autos.html?marca=Ford'], ['Chevrolet', './autos.html?marca=Chevrolet'], ['Fiat', './autos.html?marca=Fiat'], ['Peugeot', './autos.html?marca=Peugeot']] },
    { title: 'Carrocerías', links: [['SUV', './autos.html?carroceria=suv'], ['Sedán', './autos.html?carroceria=sedan'], ['Hatchback', './autos.html?carroceria=hatchback'], ['Eléctrico', './autos.html?carroceria=electrico'], ['Deportivo', './autos.html?carroceria=deportivo']] },
  ],
  legal: [['Términos y condiciones', '#terminos'], ['Privacidad', '#privacidad']],
};
