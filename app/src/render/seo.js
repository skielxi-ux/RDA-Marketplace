// Etiquetas de SEO del <head> y datos estructurados (schema.org).
import { esc, jsonForScript } from '../lib/html.js';
import { SITE } from '../data/site.js';
import { cars, carTitle } from '../data/catalog.js';

export function renderHeadTags(page = {}) {
  const title = page.title ?? SITE.title;
  const description = page.description ?? SITE.description;
  const url = SITE.url + (page.path ?? '');
  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${SITE.indexable ? 'index, follow' : 'noindex, nofollow'}" />
  <link rel="canonical" href="${esc(url)}" />
  <meta name="theme-color" content="#ffffff" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(SITE.name)}" />
  <meta property="og:locale" content="${esc(SITE.locale)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:image" content="${esc(SITE.ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(SITE.ogImage)}" />`;
}

export function renderJsonLd(list = cars, listName = 'Autos destacados') {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE.url}#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}favicon.svg` },
      { '@type': 'WebSite', '@id': `${SITE.url}#web`, name: SITE.name, url: SITE.url, inLanguage: 'es-AR', publisher: { '@id': `${SITE.url}#org` } },
      {
        '@type': 'ItemList',
        name: listName,
        itemListElement: list.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Car',
            name: `${carTitle(c)} ${c.year}`,
            brand: { '@type': 'Brand', name: c.brand },
            model: c.model,
            vehicleModelDate: String(c.year),
            itemCondition: c.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
            mileageFromOdometer: { '@type': 'QuantitativeValue', value: c.km, unitCode: 'KMT' },
            fuelType: c.fuel,
            vehicleTransmission: c.gear,
            url: `${SITE.url}#auto-${c.id}`,
            offers: { '@type': 'Offer', price: c.price, priceCurrency: c.currency, availability: 'https://schema.org/InStock' },
            bodyType: c.body,
          },
        })),
      },
    ],
  };
  return `<script type="application/ld+json">${jsonForScript(data)}</script>`;
}
