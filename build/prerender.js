// Plugin de Vite: arma el HTML de cada página en el build (SEO + carga rápida),
// reemplaza los íconos <i data-icon> por SVG y agrega la política de seguridad (CSP).
import { icon } from '../app/src/lib/icons.js';
import { esc } from '../app/src/lib/html.js';
import { renderHeroSlides, renderMakeOptions, renderBodyTypes, renderReasons } from '../app/src/render/sections.js';
import { renderCarSlides, renderCarGrid } from '../app/src/render/carCard.js';
import { renderHeadTags, renderJsonLd } from '../app/src/render/seo.js';
import { renderForDealers, renderSellPrivate, renderStats, renderTestimonials, renderBrands, renderFooter } from '../app/src/render/home2.js';
import { renderSiteHeader, renderToTop } from '../app/src/render/layout.js';
import { renderFilters, renderSortOptions } from '../app/src/render/listing.js';
import { cars, featuredTabs } from '../app/src/data/catalog.js';
import { renderFicha, renderFichaHead, renderFichaJsonLd } from '../app/src/render/ficha.js';

// Content Security Policy: solo se permite lo nuestro + fotos de Unsplash.
// (En GitHub Pages no se pueden mandar cabeceras, por eso va como <meta>.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https://images.unsplash.com",
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
  'site-header': renderSiteHeader(),
  footer: renderFooter(),
  'to-top': renderToTop(),
});

// Slots de cada página (la clave es el nombre del archivo)
const PAGES = {
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
    stats: renderStats(),
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
