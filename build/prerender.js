// Plugin de Vite: arma el HTML de cada página en el build (SEO + carga rápida),
// reemplaza los íconos <i data-icon> por SVG y agrega la política de seguridad (CSP).
import { icon } from '../app/src/lib/icons.js';
import { esc } from '../app/src/lib/html.js';
import { renderHeroSlides, renderMakeOptions, renderBodyTypes, renderReasons } from '../app/src/render/sections.js';
import { renderCarSlides, renderCarGrid } from '../app/src/render/carCard.js';
import { renderHeadTags, renderJsonLd } from '../app/src/render/seo.js';
import { renderForDealers, renderForIndependents, renderFotoEstudio, renderSellPrivate, renderStats, renderTestimonials, renderBrands, renderFooter } from '../app/src/render/home2.js';
import { renderSiteHeader, renderToTop } from '../app/src/render/layout.js';
import { logoSvg } from '../app/src/render/logo.js';
import { EQUIPO, SITE as SITE_DATA } from '../app/src/data/site.js';
const SITE_SEG = SITE_DATA.seguros.nombre;
import { renderGuias } from '../app/src/render/comoFunciona.js';
import { renderSeguros } from '../app/src/render/seguros.js';
import { renderMarcas } from '../app/src/render/marcas.js';
import { renderLegal, renderIndiceLegal } from '../app/src/render/legal.js';
import { TERMINOS, PRIVACIDAD, VIGENCIA } from '../app/src/data/legales.js';
import { renderFaq, renderFaqIndice, renderFaqJsonLd } from '../app/src/render/faq.js';

const renderEquipo = () => EQUIPO.map((p) => `
        <li class="reveal">
          <div class="overflow-hidden rounded-2xl bg-soft">
            <img src="./img/equipo/${esc(p.foto)}-700.webp" srcset="./img/equipo/${esc(p.foto)}-400.webp 400w, ./img/equipo/${esc(p.foto)}-700.webp 700w"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" width="700" height="875" loading="lazy" decoding="async"
              alt="${esc(p.nombre)}, ${esc(p.cargo)} de Red de Autos" class="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.03]">
          </div>
          <p class="mt-5 text-[22px] font-medium">${esc(p.nombre)}</p>
          <p class="mt-1 text-[15px] font-medium text-brand">${esc(p.cargo)}</p>
          <p class="mt-3 text-[15px] leading-[1.75] text-ink/75">${esc(p.bio)}</p>
        </li>`).join('');
import { renderFilters, renderSortOptions } from '../app/src/render/listing.js';
import { cars, featuredTabs } from '../app/src/data/catalog.js';
import { renderFicha, renderFichaHead, renderFichaJsonLd } from '../app/src/render/ficha.js';

// Content Security Policy: solo se permite lo nuestro + fotos de Unsplash.
// (En GitHub Pages no se pueden mandar cabeceras, por eso va como <meta>.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  `img-src 'self' data: blob: https://ytuecptdgtmrbiddyzht.supabase.co${SITE_DATA.fotosCdn ? ` ${new URL(SITE_DATA.fotosCdn).origin}` : ''}`,
  "font-src 'self' data:",
  "connect-src 'self' https://ytuecptdgtmrbiddyzht.supabase.co wss://ytuecptdgtmrbiddyzht.supabase.co",
  'frame-src https://www.openstreetmap.org',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const renderFeaturedTabs = () =>
  featuredTabs
    .map((t, i) => `<button type="button" role="tab" id="tab-${esc(t.key)}" class="tab-btn shrink-0 whitespace-nowrap${i === 0 ? ' is-active' : ''}" aria-selected="${i === 0}" aria-controls="featured"${i === 0 ? '' : ' tabindex="-1"'} data-tab="${esc(t.key)}">${esc(t.label)}</button>`)
    .join('');

// Partes comunes a todas las páginas
const common = (isBuild) => ({
  csp: isBuild ? `<meta http-equiv="Content-Security-Policy" content="${CSP}" />` : '',
  // Fichas de autos reales y páginas de agencias (se arman en el navegador): indexables solo con el interruptor prendido
  'robots-dinamico': `<meta name="robots" content="${SITE_DATA.indexable ? 'index, follow' : 'noindex, follow'}" />`,
  'site-header': renderSiteHeader(),
  footer: renderFooter(),
  'to-top': renderToTop(),
});

// Slots de cada página (la clave es el nombre del archivo)
const PAGES = {
  'admin.html': () => ({ logo: logoSvg('h-8 w-auto') }),
  'mi-cuenta.html': () => ({}),
  'publicar.html': () => ({}),
  'auto.html': () => ({}),
  'agencia.html': () => ({}),
  'favoritos.html': () => ({}),
  'como-funciona.html': () => ({
    head: renderHeadTags({
      title: 'Cómo funciona | Red de Autos',
      description: 'Cómo comprar, cómo vender tu auto gratis como particular y cómo trabajan las agencias y concesionarios en Red de Autos: stock, Red de colegas y bot de Telegram.',
      path: 'como-funciona.html',
    }),
    guias: renderGuias(),
  }),
  'preguntas-frecuentes.html': () => ({
    head: renderHeadTags({
      title: 'Preguntas frecuentes | Red de Autos',
      description: 'Respuestas sobre cómo comprar, cómo vender tu auto gratis, cómo trabajan las agencias en Red de Autos y cómo cuidar tu cuenta.',
      path: 'preguntas-frecuentes.html',
    }),
    jsonld: renderFaqJsonLd(),
    indice: renderFaqIndice(),
    faq: renderFaq(),
  }),
  '404.html': () => ({}),
  'terminos.html': () => ({
    head: renderHeadTags({ title: 'Términos y condiciones | Red de Autos', description: 'Términos y condiciones de uso de Red de Autos: publicaciones, cuentas, agencias, vendedores independientes y responsabilidades.', path: 'terminos.html' }),
    vigencia: `Vigentes desde el ${VIGENCIA}.`,
    indice: renderIndiceLegal(TERMINOS),
    legal: renderLegal(TERMINOS),
  }),
  'privacidad.html': () => ({
    head: renderHeadTags({ title: 'Política de privacidad | Red de Autos', description: 'Cómo Red de Autos recoge, usa y protege tus datos personales, y cómo ejercer tus derechos según la Ley 25.326.', path: 'privacidad.html' }),
    vigencia: `Vigente desde el ${VIGENCIA}.`,
    indice: renderIndiceLegal(PRIVACIDAD),
    legal: renderLegal(PRIVACIDAD),
  }),
  'feria.html': () => ({
    head: renderHeadTags({ title: 'Feria online | Red de Autos', description: 'Feria online de Red de Autos: autos 0km y usados de agencias con precio relámpago por tiempo limitado. Mirá cuánto falta y aprovechá.', path: 'feria.html' }),
  }),
  'agencias.html': () => ({
    head: renderHeadTags({
      title: 'Agencias y concesionarios | Red de Autos',
      description: 'Agencias multimarca y concesionarios oficiales verificados de Red de Autos. Mirá su stock y contactalos directo por WhatsApp.',
      path: 'agencias.html',
    }),
  }),
  'marcas.html': () => ({
    head: renderHeadTags({
      title: 'Marcas de autos 0km y usados | Red de Autos',
      description: 'Todas las marcas de autos en Red de Autos: Toyota, Volkswagen, Ford, Chevrolet, Fiat, Peugeot, BYD, MG, Chery y muchas más. Elegí la tuya y mirá los autos publicados.',
      path: 'marcas.html',
    }),
    marcas: renderMarcas(),
  }),
  'seguros.html': () => ({
    head: renderHeadTags({
      title: 'Seguros para tu auto | Red de Autos',
      description: `Asegurá tu vehículo con ${SITE_SEG}, partner de Red de Autos. Te asesoran y cotizan por WhatsApp.`,
      path: 'seguros.html',
    }),
    seguros: renderSeguros(),
  }),
  'vender.html': () => ({
    head: renderHeadTags({
      title: 'Vendé tu auto gratis | Red de Autos',
      description: 'Publicá tu auto gratis como particular: cargá los datos y hasta 7 fotos, lo revisamos y recibís consultas directo por WhatsApp.',
      path: 'vender.html',
    }),
  }),
  'quienes-somos.html': () => ({
    head: renderHeadTags({
      title: 'Quiénes somos | Red de Autos',
      description: 'Red de Autos es el marketplace tucumano de autos 0km y usados: agencias verificadas, precios a la vista y contacto directo con el vendedor.',
      path: 'quienes-somos.html',
    }),
    reasons: renderReasons(),
    equipo: renderEquipo(),
    sell: renderSellPrivate(),
  }),
  'index.html': () => ({
    head: renderHeadTags(),
    jsonld: renderJsonLd(featuredTabs[0].cars.concat(featuredTabs[1].cars), 'Autos destacados'),
    hero: renderHeroSlides(),
    makes: renderMakeOptions(),
    types: renderBodyTypes(),
    reasons: renderReasons(),
    'featured-tabs': renderFeaturedTabs(),
    featured: renderCarSlides(featuredTabs[0].cars),
    dealers: renderForDealers(),
    sell: renderSellPrivate(),
    independientes: renderForIndependents(),
    fotoEstudio: renderFotoEstudio(),
    stats: '', // oculto hasta tener cifras reales (renderStats)
    testimonials: renderTestimonials(),
    brands: renderBrands(),
  }),
  'autos.html': () => ({
    head: renderHeadTags({
      title: 'Autos 0km y usados en venta | Red de Autos',
      description: 'Listado de autos 0km y usados de concesionarios oficiales, agencias multimarca y particulares. Filtrá por marca, modelo, año, precio y carrocería.',
      path: 'autos.html',
    }),
    jsonld: renderJsonLd(cars, 'Autos en venta'),
    filters: renderFilters(),
    sort: renderSortOptions(),
    count: String(cars.length),
    grid: renderCarGrid(cars),
  }),
};

export function prerenderHome() {
  let isBuild = false;
  return {
    name: 'rda-prerender',
    configResolved(config) { isBuild = config.command === 'build'; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const file = (ctx.filename || ctx.path || '').split(/[\\/]/).pop() || 'index.html';
        const carId = file.match(/^auto-(.+)\.html$/)?.[1];
        const car = carId && cars.find((c) => c.id === carId);
        const page = car
          ? () => ({ head: renderFichaHead(car), jsonld: renderFichaJsonLd(car), ficha: renderFicha(car) })
          : PAGES[file];
        if (!page) throw new Error(`Página sin slots definidos: ${file}`);
        const slots = { ...common(isBuild), ...page() };
        return html
          .replace(/<!--slot:([\w-]+)-->/g, (_, name) => {
            if (!(name in slots)) throw new Error(`Slot desconocido en ${file}: ${name}`);
            return slots[name];
          })
          .replace(/<i data-icon="([\w-]+)" class="([^"]*)"><\/i>/g, (_, name, cls) => icon(name, cls));
      },
    },
  };
}
