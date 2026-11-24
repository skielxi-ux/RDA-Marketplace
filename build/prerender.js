// Plugin de Vite: arma el HTML de la home en el build (SEO + carga rápida),
// reemplaza los íconos <i data-icon> por SVG y agrega la política de seguridad (CSP).
import { icon } from '../app/src/lib/icons.js';
import { esc } from '../app/src/lib/html.js';
import { renderHeroSlides, renderMakeOptions, renderBodyTypes, renderReasons } from '../app/src/render/sections.js';
import { renderCarSlides } from '../app/src/render/carCard.js';
import { renderHeadTags, renderJsonLd } from '../app/src/render/seo.js';
import { featuredTabs } from '../app/src/data/catalog.js';
import { renderSellPrivate, renderStats, renderTestimonials, renderBrands, renderFooter } from '../app/src/render/home2.js';
import { logoSvg } from '../app/src/render/logo.js';

// Content Security Policy: solo se permite lo nuestro + fotos de Unsplash.
// (En GitHub Pages no se pueden mandar cabeceras, por eso va como <meta>.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const renderFeaturedTabs = () =>
  featuredTabs
    .map((t, i) => `<button type="button" role="tab" id="tab-${esc(t.key)}" class="tab-btn shrink-0 whitespace-nowrap${i === 0 ? ' is-active' : ''}" aria-selected="${i === 0}" aria-controls="featured"${i === 0 ? '' : ' tabindex="-1"'} data-tab="${esc(t.key)}">${esc(t.label)}</button>`)
    .join('');

export function prerenderHome() {
  let isBuild = false;
  return {
    name: 'rda-prerender-home',
    configResolved(config) { isBuild = config.command === 'build'; },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const slots = {
          csp: isBuild ? `<meta http-equiv="Content-Security-Policy" content="${CSP}" />` : '',
          head: renderHeadTags(),
          jsonld: renderJsonLd(),
          hero: renderHeroSlides(),
          makes: renderMakeOptions(),
          types: renderBodyTypes(),
          reasons: renderReasons(),
          'featured-tabs': renderFeaturedTabs(),
          featured: renderCarSlides(featuredTabs[0].cars),
          logo: logoSvg('h-8 w-auto sm:h-10 lg:h-11'),
          sell: renderSellPrivate(),
          stats: renderStats(),
          testimonials: renderTestimonials(),
          brands: renderBrands(),
          footer: renderFooter(),
        };
        return html
          .replace(/<!--slot:([\w-]+)-->/g, (_, name) => {
            if (!(name in slots)) throw new Error(`Slot desconocido: ${name}`);
            return slots[name];
          })
          .replace(/<i data-icon="([\w-]+)" class="([^"]*)"><\/i>/g, (_, name, cls) => icon(name, cls));
      },
    },
  };
}
