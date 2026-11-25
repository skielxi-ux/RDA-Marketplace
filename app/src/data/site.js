export const SITE = {
  name: 'Red de Autos',
  url: 'https://skielxi-ux.github.io/RDA-Marketplace/',
  title: 'Autos 0km y usados de agencias y concesionarios oficiales | Red de Autos',
  description:
    'Encontrá autos 0km y usados de agencias multimarca y concesionarios oficiales de todo el país. Compará precios, financiación y entrega inmediata.',
  locale: 'es_AR',
  phone: { display: '381 000-0000', tel: '+543810000000' },
  ogImage:
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=630&fit=crop&auto=format&q=75',
  // Supabase (proyecto RED DE AUTOS IA). La clave "publishable" es pública por diseño:
  // los datos están protegidos por RLS y por la función del servidor.
  supabase: {
    url: 'https://ytuecptdgtmrbiddyzht.supabase.co',
    publishableKey: 'sb_publishable_hhgYneVg1XyLJL64fv1nXQ_io3nnHfO',
  },
  // Mientras el catálogo sea de ejemplo, el sitio no se indexa en Google.
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
