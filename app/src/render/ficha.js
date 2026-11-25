// Ficha de cada auto (auto-<id>.html). Se arma completa en el build.
import { esc, formatPrice, formatKm, jsonForScript } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';
import { unsplash, cars, sellerOf, carShot, photoCount, SELLER_TYPES, BODY_NAMES, carTitle, carUrl } from '../data/catalog.js';
import { renderCarSlides } from './carCard.js';

const fullTitle = (c) => `${carTitle(c)} ${c.year}`;
const absUrl = (c) => SITE.url + carUrl(c).replace('./', '');
const bodyName = (slug) => BODY_NAMES[slug] ?? slug;
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const shot = carShot;
const fotosIdx = (c) => Array.from({ length: photoCount(c) }, (_, i) => i);

/** Mensaje de WhatsApp ya armado. Sin número cargado, abre WhatsApp para elegir contacto. */
export const whatsappUrl = (c) => {
  const text = `Hola, vi el ${fullTitle(c)} (${formatPrice(c.price, c.currency)}) en Red de Autos y me interesa. ¿Sigue disponible? ${absUrl(c)}`;
  const phone = (sellerOf(c).phone || '').replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// ---------- <head> ----------
export function renderFichaHead(c) {
  const title = `${fullTitle(c)} · ${formatPrice(c.price, c.currency)} | Red de Autos`;
  const description = `${fullTitle(c)}, ${formatKm(c.km)}, ${c.fuel.toLowerCase()}, caja ${c.gear.toLowerCase()}. ${c.desc} ${c.city}, ${c.province}.`;
  const image = c.real ? shot(c, 0) : unsplash(c.photo, 1200, 630);
  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${SITE.indexable ? 'index, follow' : 'noindex, nofollow'}" />
  <link rel="canonical" href="${esc(absUrl(c))}" />
  <meta name="theme-color" content="#ffffff" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${esc(SITE.name)}" />
  <meta property="og:locale" content="${esc(SITE.locale)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(absUrl(c))}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />`;
}

export function renderFichaJsonLd(c) {
  const seller = sellerOf(c);
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Car',
        name: fullTitle(c),
        description: c.desc,
        url: absUrl(c),
        image: fotosIdx(c).map((i) => shot(c, i, 1200, 900)),
        brand: { '@type': 'Brand', name: c.brand },
        model: c.model,
        vehicleConfiguration: c.version,
        vehicleModelDate: String(c.year),
        bodyType: bodyName(c.body),
        itemCondition: c.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        mileageFromOdometer: { '@type': 'QuantitativeValue', value: c.km, unitCode: 'KMT' },
        fuelType: c.fuel,
        vehicleTransmission: c.gear,
        driveWheelConfiguration: c.drive,
        numberOfDoors: c.doors,
        color: c.color,
        vehicleEngine: { '@type': 'EngineSpecification', name: c.engine },
        offers: {
          '@type': 'Offer',
          price: c.price,
          priceCurrency: c.currency,
          availability: 'https://schema.org/InStock',
          url: absUrl(c),
          seller: { '@type': seller.type === 'particular' ? 'Person' : 'AutoDealer', name: seller.name },
          areaServed: `${c.city}, ${c.province}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Autos', item: `${SITE.url}autos.html` },
          { '@type': 'ListItem', position: 3, name: fullTitle(c), item: absUrl(c) },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">${jsonForScript(data)}</script>`;
}

// ---------- Cuerpo ----------
const chip = (ic, text, sr) => `<li class="inline-flex items-center gap-2 rounded-full bg-[#EEF1FB] px-4 py-2 text-[14px] font-medium text-ink">${icon(ic, 'h-4 w-4 text-brand')}<span class="sr-only">${esc(sr)}: </span>${esc(text)}</li>`;

function renderGallery(c) {
  const n = photoCount(c);
  const alt = (i) => `${fullTitle(c)}, foto ${i + 1} de ${n}`;
  const thumbs = fotosIdx(c).slice(1, 5).map((i) => {
    const last = i === 4 && n > 5;
    return `
      <button type="button" class="gallery-thumb group" data-open-photo="${i}" aria-label="Ver foto ${i + 1} de ${n}">
        <img src="${esc(shot(c, i, 600, 450))}" width="600" height="450" alt="${esc(alt(i))}" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ${last ? `<span class="absolute inset-0 grid place-items-center bg-ink/55 text-[16px] font-bold text-white">+${n - 5} fotos</span>` : ''}
      </button>`;
  }).join('');
  return `
  <div class="relative">
    <!-- Celular: slider -->
    <div id="ficha-slider" class="swiper overflow-hidden rounded-2xl md:!hidden" aria-label="Fotos del auto">
      <div class="swiper-wrapper">
        ${fotosIdx(c).map((i) => `
        <div class="swiper-slide">
          <button type="button" class="block aspect-[4/3] w-full" data-open-photo="${i}" aria-label="Ampliar foto ${i + 1} de ${n}">
            <img src="${esc(shot(c, i, 900, 675))}" width="900" height="675" alt="${esc(alt(i))}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" class="h-full w-full object-cover" />
          </button>
        </div>`).join('')}
      </div>
      <p class="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-3 py-1 text-[13px] text-white"><span data-slide-index>1</span> / ${n}</p>
    </div>
    <!-- Escritorio: foto grande + 4 chicas -->
    <div class="hidden gap-4 md:grid md:h-[460px] md:grid-rows-1 ${n > 1 ? 'md:grid-cols-[1.35fr_1fr]' : ''} lg:h-[540px]">
      <button type="button" class="gallery-thumb group" data-open-photo="0" aria-label="Ampliar foto 1 de ${n}">
        <img src="${esc(shot(c, 0, 1200, 900))}" width="1200" height="900" alt="${esc(alt(0))}" fetchpriority="high" decoding="async" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </button>
      ${n > 1 ? `<div class="grid grid-cols-2 grid-rows-2 gap-4">${thumbs}</div>` : ''}
    </div>
    <button type="button" data-open-photo="0" class="btn-outline absolute bottom-4 left-4 z-10 hidden h-[42px] border-white bg-white md:inline-flex">${icon('images', 'h-4 w-4')} Ver las ${n} fotos</button>
  </div>`;
}

const SPEC_ICONS = { Carrocería: 'car', Condición: 'circle-check', Kilometraje: 'gauge', Motor: 'cog', Combustible: 'fuel', Puertas: 'door-open', Año: 'calendar', Caja: 'cog', Tracción: 'settings-2', Color: 'palette' };

function renderSpecs(c) {
  const rows = [
    ['Carrocería', bodyName(c.body)], ['Condición', c.condition === 'new' ? '0km' : 'Usado'],
    ['Kilometraje', formatKm(c.km)], ['Año', c.year], ['Motor', c.engine], ['Combustible', c.fuel],
    ['Caja', c.gear], ['Tracción', c.drive], ['Puertas', c.doors], ['Color', c.color],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  return `
  <section aria-labelledby="specs-title" class="ficha-section">
    <h2 id="specs-title" class="ficha-h2">Ficha técnica</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${rows.map(([k, v]) => `
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="flex items-center gap-2.5 text-[15px] text-ink/70">${icon(SPEC_ICONS[k] ?? 'circle-check', 'h-[18px] w-[18px]')} ${esc(k)}</dt>
        <dd class="text-right text-[15px] font-medium">${esc(v)}</dd>
      </div>`).join('')}
    </dl>
  </section>`;
}

const renderDescription = (c) => `
  <section aria-labelledby="desc-title" class="ficha-section">
    <h2 id="desc-title" class="ficha-h2">Descripción</h2>
    <p class="max-w-[720px] text-[16px] leading-[1.8] text-ink/80">${esc(c.desc)}</p>
  </section>`;

const renderFeatures = (c) => !c.features ? '' : `
  <section aria-labelledby="feat-title" class="ficha-section">
    <h2 id="feat-title" class="ficha-h2">Equipamiento</h2>
    <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      ${Object.entries(c.features).map(([group, items]) => `
      <div>
        <h3 class="mb-4 text-[17px] font-bold">${esc(group)}</h3>
        <ul class="space-y-3">
          ${items.map((it) => `<li class="flex items-start gap-2.5 text-[15px]"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-brand">${icon('check', 'h-3 w-3')}</span>${esc(it)}</li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
  </section>`;

const renderDims = (c) => !c.dims ? '' : `
  <section aria-labelledby="dims-title" class="ficha-section">
    <h2 id="dims-title" class="ficha-h2">Dimensiones y capacidad</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${Object.entries(c.dims).map(([k, v]) => `
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="text-[15px] text-ink/70">${esc(k)}</dt><dd class="text-[15px] font-medium">${esc(v)}</dd>
      </div>`).join('')}
    </dl>
  </section>`;

function renderMap(c) {
  if (!c.coords) return '';
  const [lat, lng, zona = 1] = c.coords; // zona > 1: no conocemos la ciudad, se muestra la provincia
  const bbox = [lng - 0.06 * zona, lat - 0.035 * zona, lng + 0.06 * zona, lat + 0.035 * zona].map((n) => n.toFixed(4)).join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${zona > 1 ? '' : `&marker=${lat},${lng}`}`;
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  return `
  <section aria-labelledby="map-title" class="ficha-section">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="map-title" class="ficha-h2 !mb-1">Ubicación</h2>
        <p class="text-[15px] text-ink/70">${esc(c.city)}, ${esc(c.province)} · zona aproximada</p>
      </div>
      <a href="${esc(dir)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[44px]">${icon('map-pin', 'h-4 w-4')} Cómo llegar</a>
    </div>
    <div class="map-box relative overflow-hidden rounded-2xl border border-line" data-map>
      <iframe title="Mapa de ${esc(c.city)}" src="${esc(src)}" loading="lazy" referrerpolicy="no-referrer" class="pointer-events-none block h-[320px] w-full md:h-[380px]"></iframe>
      <button type="button" class="map-unlock" data-map-unlock><span class="map-unlock-label">${icon('map-pin', 'h-4 w-4')} Tocá para mover el mapa</span></button>
    </div>
  </section>`;
}

/** Reseñas: solo con reseñas reales cargadas en el auto ({ name, date, rating, text }). */
function renderReviews(c) {
  if (!c.reviews?.length) return '';
  const avg = c.reviews.reduce((a, r) => a + r.rating, 0) / c.reviews.length;
  return `
  <section aria-labelledby="rev-title" class="ficha-section">
    <h2 id="rev-title" class="ficha-h2">${c.reviews.length} ${c.reviews.length === 1 ? 'reseña' : 'reseñas'} · ${esc(avg.toFixed(1))} de 5</h2>
    <ul class="space-y-6">
      ${c.reviews.map((r) => `
      <li class="border-b border-line pb-6">
        <p class="font-medium">${esc(r.name)} <span class="ml-2 text-[14px] font-normal text-ink/60">${esc(r.date)}</span></p>
        <p class="mt-1 text-[14px] text-brand">${esc(Number(r.rating).toFixed(1))} / 5</p>
        <p class="mt-2 text-[15px] leading-[1.7] text-ink/80">${esc(r.text)}</p>
      </li>`).join('')}
    </ul>
  </section>`;
}

function renderSellerCard(c) {
  const s = sellerOf(c);
  const isPrivate = s.type === 'particular';
  const phone = (s.phone || '').replace(/\D/g, '');
  return `
  <aside class="seller-card" aria-label="Vendedor">
    <div class="flex items-center gap-4">
      ${s.logo
        ? `<img src="${esc(s.logo)}" alt="Logo de ${esc(s.name)}" width="64" height="64" class="h-16 w-16 shrink-0 rounded-2xl border border-line bg-white object-contain p-1" />`
        : `<span class="grid h-16 w-16 shrink-0 place-items-center ${isPrivate ? 'rounded-full bg-[#EEF1FB] text-brand' : 'rounded-2xl bg-ink text-white'} text-[20px] font-bold" aria-hidden="true">${esc(isPrivate ? initials(s.name).slice(0, 1) : initials(s.name))}</span>`}
      <div class="min-w-0">
        <p class="truncate text-[19px] font-bold">${esc(s.name)}</p>
        <p class="mt-1 inline-flex items-center gap-1.5 text-[14px] ${s.type === 'oficial' ? 'text-brand' : 'text-ink/70'}">${icon(s.type === 'oficial' ? 'badge-check' : isPrivate ? 'user' : 'store', 'h-4 w-4')} ${esc(SELLER_TYPES[s.type])}</p>
      </div>
    </div>
    <p class="mt-5 flex items-center gap-2 text-[15px] text-ink/80">${icon('map-pin', 'h-4 w-4 shrink-0')} ${esc(c.city)}, ${esc(c.province)}</p>
    <div class="mt-6 space-y-3">
      <a href="${esc(whatsappUrl(c))}" target="_blank" rel="noopener noreferrer" class="btn-cta w-full justify-center !pl-2.5" data-whatsapp>
        <span class="btn-cta-icon">${icon('message-circle', 'h-4 w-4')}</span> Escribir por WhatsApp
      </a>
      ${phone ? `<a href="tel:+${esc(phone)}" class="btn-outline h-[54px] w-full justify-center">${icon('phone', 'h-4 w-4')} Llamar</a>` : ''}
    </div>
    ${isPrivate ? '' : `<a href="${c.real ? `./agencia.html?id=${encodeURIComponent(s.id)}` : `./autos.html?agencia=${encodeURIComponent(c.seller)}`}" class="link-view mt-5 w-full justify-center">Ver todo su stock ${icon('arrow-up-right', 'h-4 w-4')}</a>`}
    <p class="mt-5 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
  </aside>
  ${renderSeguroCard(c)}`;
}

/** WhatsApp del partner de seguros con el auto ya escrito en el mensaje. */
export const seguroUrl = (c) => {
  const tel = SITE.seguros.whatsapp.replace(/\D/g, '');
  if (!tel) return '';
  const text = c
    ? `Hola, vengo de Red de Autos. Quiero cotizar el seguro de un ${fullTitle(c)}${c.condition === 'new' ? ' 0km' : ''}.`
    : 'Hola, vengo de Red de Autos. Quiero cotizar el seguro de mi auto.';
  return `https://wa.me/${tel}?text=${encodeURIComponent(text)}`;
};

function renderSeguroCard(c) {
  const url = seguroUrl(c);
  if (!url) return '';
  const { nombre, logo } = SITE.seguros;
  return `
  <aside class="mt-5 rounded-[20px] border border-line bg-white p-5" aria-label="Seguro del auto">
    <div class="flex items-center gap-3">
      ${logo ? `<img src="${esc(logo)}" alt="${esc(nombre)}" width="78" height="40" class="h-10 w-auto shrink-0 object-contain" loading="lazy" />` : `<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${icon('shield-check', 'h-5 w-5')}</span>`}
      <p class="text-[16px] font-bold leading-tight">¿Lo comprás? Cotizá el seguro</p>
    </div>
    <p class="mt-2 text-[14px] leading-[1.6] text-ink/70">Con ${esc(nombre)}, nuestro partner en seguros. Te asesoran por WhatsApp.</p>
    <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn-outline mt-4 h-[48px] w-full justify-center" data-seguro>${icon('message-circle', 'h-4 w-4')} Cotizar por WhatsApp</a>
  </aside>`;
}

function related(c, pool = cars) {
  const score = (o) => (o.body === c.body) * 2 + (o.brand === c.brand) * 2 + (o.condition === c.condition);
  return pool.filter((o) => o.id !== c.id).sort((a, b) => score(b) - score(a) || b.published - a.published).slice(0, 8);
}

/** pool: autos para "Autos similares" (en el navegador se suman los reales). */
export function renderFicha(c, pool = cars) {
  const title = fullTitle(c);
  const seller = sellerOf(c);
  return `
  <div class="container-x pt-6 md:pt-8">
    <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li>
        <li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li>
        <li aria-current="page" class="text-ink">${esc(title)}</li>
      </ol>
    </nav>

    <header class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-[28px] font-bold leading-[1.12] sm:text-[36px] md:text-[42px]">${esc(title)}</h1>
        <p class="mt-2 text-[16px] text-ink/70">${esc(c.version)} · ${esc(SELLER_TYPES[seller.type])}</p>
        <ul class="mt-5 flex flex-wrap gap-2.5" aria-label="Datos principales">
          ${chip('calendar', c.year, 'Año')}${chip('gauge', formatKm(c.km), 'Kilometraje')}${chip('cog', c.gear, 'Caja')}${chip('fuel', c.fuel, 'Combustible')}
        </ul>
      </div>
      <div class="flex flex-col gap-4 lg:items-end">
        <div class="flex gap-3">
          <button type="button" class="btn-outline h-[42px] !px-4" data-share>${icon('share-2', 'h-4 w-4')} Compartir</button>
          <button type="button" class="btn-outline fav-btn h-[42px] !px-4" data-car-fav="${esc(c.id)}" aria-pressed="false">${icon('heart', 'h-4 w-4')} <span data-fav-label>Guardar</span></button>
        </div>
        ${c.priceBefore ? `<p class="flex items-center gap-2 text-[15px] text-ink/60"><span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">Bajó de precio</span><s>${esc(formatPrice(c.priceBefore, c.currency))}</s></p>` : ''}
        <p class="text-[32px] font-bold leading-none md:text-[38px]">${esc(formatPrice(c.price, c.currency))}</p>
        <p class="-mt-2 text-[14px] text-ink/60">Precio en ${c.currency === 'USD' ? 'dólares' : 'pesos'}, publicado por el vendedor</p>
      </div>
    </header>

    <div class="mt-8">${renderGallery(c)}</div>

    <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div class="min-w-0">
        ${renderSpecs(c)}
        ${renderDescription(c)}
        ${renderFeatures(c)}
        ${renderDims(c)}
        ${renderMap(c)}
        ${renderReviews(c)}
      </div>
      <div class="lg:sticky lg:top-[110px] lg:self-start">${renderSellerCard(c)}</div>
    </div>
  </div>

  <section aria-labelledby="related-title" class="pt-16 md:pt-[90px]">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 id="related-title" class="section-title">Autos similares</h2>
        <a href="./autos.html?carroceria=${encodeURIComponent(c.body)}" class="link-view">Ver todos ${icon('arrow-up-right', 'h-4 w-4')}</a>
      </div>
      <div id="related" class="swiper"><div class="swiper-wrapper">${renderCarSlides(related(c, pool))}</div></div>
      <div class="mt-8 flex gap-4">
        <button type="button" class="round-nav related-prev" aria-label="Autos anteriores">${icon('chevron-left', 'h-4 w-4')}</button>
        <button type="button" class="round-nav related-next" aria-label="Autos siguientes">${icon('chevron-right', 'h-4 w-4')}</button>
      </div>
    </div>
  </section>

  <!-- Barra fija de contacto en celular -->
  <div class="contact-bar lg:hidden">
    <div class="min-w-0">
      <p class="truncate text-[13px] text-ink/70">${esc(title)}</p>
      <p class="text-[18px] font-bold leading-tight">${esc(formatPrice(c.price, c.currency))}</p>
    </div>
    <a href="${esc(whatsappUrl(c))}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[48px] shrink-0 px-5">${icon('message-circle', 'h-4 w-4')} WhatsApp</a>
  </div>

  <!-- Visor de fotos -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Fotos de ${esc(title)}" hidden>
    <button type="button" class="lightbox-btn right-4 top-4" data-lb-close aria-label="Cerrar">${icon('x', 'h-5 w-5')}</button>
    <button type="button" class="lightbox-btn left-4 top-1/2 -translate-y-1/2" data-lb-prev aria-label="Foto anterior">${icon('chevron-left', 'h-5 w-5')}</button>
    <img data-lb-img alt="" class="max-h-[82vh] max-w-[92vw] rounded-xl object-contain" />
    <button type="button" class="lightbox-btn right-4 top-1/2 -translate-y-1/2" data-lb-next aria-label="Foto siguiente">${icon('chevron-right', 'h-5 w-5')}</button>
    <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] text-white/80"><span data-lb-index>1</span> / ${photoCount(c)}</p>
  </div>
  <script type="application/json" id="ficha-data">${jsonForScript({ id: c.id, title, photos: fotosIdx(c).map((i) => shot(c, i, 1600, 1200)) })}</script>`;
}
