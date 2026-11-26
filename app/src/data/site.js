export const SITE = {
  name: 'Red de Autos',
  url: 'https://skielxi-ux.github.io/RDA-Marketplace/',
  title: 'Autos 0km y usados en Tucumán | Red de Autos',
  description:
    'Autos 0km y usados de agencias y concesionarios de Tucumán. Compará precios, mirá las fotos y hablá directo con el vendedor por WhatsApp. Publicá gratis.',
  locale: 'es_AR',
  phone: { display: '381 633-5234', tel: '+543816335234' },
  email: 'reddeautostuc@gmail.com',
  // Partner de seguros (página Seguros y recuadro en la ficha de cada auto). Sin número, no se muestra el botón.
  seguros: { nombre: 'GAMAN BROKERS', whatsapp: '5493815744335', logo: './img/partners/gaman.webp' },
  address: ['San Miguel de Tucumán', 'Tucumán, Argentina'],
  ogImage: 'https://skielxi-ux.github.io/RDA-Marketplace/img/og.jpg', // imagen al compartir las páginas generales
  // Supabase (proyecto RED DE AUTOS IA). La clave "publishable" es pública por diseño:
  // los datos están protegidos por RLS y por la función del servidor.
  supabase: {
    url: 'https://ytuecptdgtmrbiddyzht.supabase.co',
    publishableKey: 'sb_publishable_hhgYneVg1XyLJL64fv1nXQ_io3nnHfO',
  },
  // Mientras el catálogo sea de ejemplo, el sitio no se indexa en Google.
  // Interruptor de Google: en false, robots.txt bloquea todo y las páginas llevan noindex (catálogo de ejemplo).
  // Al lanzar (sin autos de ejemplo y con dominio propio): cambiar `url` y poner true. Robots y sitemaps se adaptan solos.
  indexable: false,
  // Redes (en este orden en el header y el menú). Pegá la URL completa de cada perfil (https://...).
  // Mientras esté vacía, el ícono se ve pero no es un link.
  social: {
    instagram: 'https://www.instagram.com/reddeautos/',
    facebook: '',
    spotify: '',
    linkedin: 'https://www.linkedin.com/company/144697996/',
  },
};

// Equipo (página Quiénes somos). Fotos en app/public/img/equipo/{foto}-400.webp y -700.webp
export const EQUIPO = [
  {
    nombre: 'Exequiel Fernandez Montini', cargo: 'Co Founder', foto: 'exequiel',
    bio: 'Licenciado en Comunicación, con posgrados en Gestión de Recursos Humanos y Marketing 360°. El mundo de los autos lo conoce desde adentro: fue Jefe de Marketing de Lineup S.A., concesionario oficial Toyota en Tucumán. En Red de Autos se ocupa de que cada auto llegue a la persona indicada y de que la marca hable como hablamos nosotros: claro y sin vueltas.',
  },
  {
    nombre: 'Nicolas Vera Robinson', cargo: 'Co Founder', foto: 'nicolas',
    bio: 'Licenciado en Comercialización y, durante más de 7 años, Gerente de Ventas de Lineup. Conoce como pocos el día a día de un concesionario: la negociación, los tiempos y lo que necesita una agencia para cerrar una venta. Esa experiencia está detrás de cada herramienta que pensamos para las agencias.',
  },
  {
    nombre: 'Hernán Lorusso', cargo: 'Co Founder', foto: 'hernan',
    bio: 'Autodidacta de pura cepa, con una larga trayectoria comercial y en procesos. Fue Gerente de Posventa de Lineup durante más de 10 años y en 2017 ganó el Círculo Kaizen, el reconocimiento a la mejora continua. Su obsesión es que todo funcione simple y bien, y se nota en cómo trabajamos.',
  },
];
