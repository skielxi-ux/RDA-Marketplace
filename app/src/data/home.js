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
  title: '¿Tenés un auto para vender? Publicalo sin costo.',
  text: 'Tu publicación aparece junto al stock de agencias y concesionarios de todo el país, y los compradores te contactan directo por WhatsApp.',
  primary: { label: 'Publicar mi auto', href: './vender.html' },
  secondary: { label: 'Ver cómo funciona', href: './como-funciona.html#vender' },
  steps: [
    { icon: 'camera', title: 'Subí fotos y datos', text: 'Marca, modelo, año, kilómetros y precio. Lo completás en pocos minutos.' },
    { icon: 'clipboard-check', title: 'Validamos tu publicación', text: 'Revisamos la información y las fotos antes de que salga online.' },
    { icon: 'message-circle', title: 'Recibí consultas por WhatsApp', text: 'Coordinás directo con los compradores interesados.' },
  ],
};

// Servicio pago de fotos con fondo de estudio (home, antes del contacto, y versión chica en Mi cuenta)
export const fotoEstudio = {
  eyebrow: 'Servicio de fotos',
  title: '¿Tenés fotos de tus autos pero querés que se vean más profesionales?',
  text: 'Nos encargamos de que tus autos luzcan con fondo de estudio, para que tus publicaciones tengan más impacto y se destaquen en el listado. Escribinos y te lo resolvemos.',
  puntos: ['Fondo de estudio limpio y uniforme', 'Usamos las fotos que ya tenés', 'Listas para publicar en Red de Autos y en tus redes'],
  costo: 'Es un servicio con costo. Escribinos por WhatsApp y te pasamos el precio según la cantidad de autos.',
  mensaje: '¡Hola! Quiero consultar por el servicio de fotos con fondo de estudio para mis autos.',
};

// Bloque "Para vendedores independientes" (debajo del de particulares). foto: null hasta tener la foto definitiva.
export const forIndependents = {
  eyebrow: 'Para vendedores independientes',
  title: '¿Por qué ser vendedor independiente?',
  text: 'Sumate a nuestra red de vendedores y generá ingresos con total flexibilidad, acercando compradores a las agencias que trabajan con vos.',
  foto: './img/home/vendedor-independiente-900.webp',
  fotoChica: './img/home/vendedor-independiente-480.webp',
  fotoAlt: 'Vendedor independiente mostrando el baúl de un auto en un salón de ventas',
  benefits: [
    { icon: 'dollar-sign', title: 'Ingresos por comisión', text: 'Ganá una comisión de entre 1 % y 4 % del precio final por cada venta que se cierre. Sin límites: cuantos más clientes traigas, más ganás.' },
    { icon: 'clock', title: 'Horarios flexibles', text: 'Trabajá en tus tiempos y desde donde quieras. Vos manejás tu agenda según tu disponibilidad.' },
    { icon: 'users', title: 'Red de contactos', text: 'Aprovechá tu red personal y tus redes sociales: compartí los autos con tu link propio y seguí a tus clientes desde Mi cuenta.' },
  ],
  nota: 'La comisión la fija y la paga cada agencia. Red de Autos no participa de las operaciones ni de las comisiones.',
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
    { title: 'Red de Autos', links: [['Quiénes somos', './quienes-somos.html'], ['Cómo funciona', './como-funciona.html'], ['Preguntas frecuentes', './preguntas-frecuentes.html'], ['Seguros', './seguros.html'], ['Partners', './partners.html'], ['Contacto', '#contacto']] },
    { title: 'Comprá', links: [['Todos los autos', './autos.html'], ['Agencias', './agencias.html'], ['Autos 0km', './autos.html?condicion=0km'], ['Autos usados', './autos.html?condicion=usados'], ['De concesionarios oficiales', './autos.html?vendedor=oficial'], ['De particulares', './autos.html?vendedor=particular']] },
    { title: 'Marcas', links: [['Toyota', './autos.html?marca=Toyota'], ['Volkswagen', './autos.html?marca=Volkswagen'], ['Ford', './autos.html?marca=Ford'], ['Chevrolet', './autos.html?marca=Chevrolet'], ['Fiat', './autos.html?marca=Fiat'], ['Peugeot', './autos.html?marca=Peugeot']] },
    { title: 'Carrocerías', links: [['SUV', './autos.html?carroceria=suv'], ['Sedán', './autos.html?carroceria=sedan'], ['Hatchback', './autos.html?carroceria=hatchback'], ['Eléctrico', './autos.html?carroceria=electrico'], ['Deportivo', './autos.html?carroceria=deportivo']] },
  ],
  legal: [['Términos y condiciones', './terminos.html'], ['Privacidad', './privacidad.html']],
};
