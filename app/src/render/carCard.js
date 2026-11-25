// Tarjeta de auto (una sola para todo el sitio: destacados de la home y listado).
import { esc, formatPrice, formatKm } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { textoOferta } from '../lib/oferta.js';
import { srcset, sellerOf, carShot, photoCount, SELLER_TYPES, carTitle, carUrl } from '../data/catalog.js';

export { carTitle };

const BADGES = {
  nuevo: { text: '0km', icon: 'circle-check', cls: 'text-ok' },
  'pocos-km': { text: 'Pocos km', icon: 'gauge', cls: 'text-brand' },
  'mejor-precio': { text: 'Mejor precio', icon: 'tag', cls: 'text-ok' },
  oferta: { text: 'Oferta', icon: 'tag', cls: 'text-[#E5484D]' },
  usado: { text: 'Usado', icon: 'car', cls: 'text-ink/70' },
  feria: { text: 'Feria', icon: 'zap', cls: 'text-[#E5484D]' },
};

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function renderSeller(seller) {
  const isPrivate = seller.type === 'particular';
  const avatar = seller.logo
    ? `<img src="${esc(seller.logo)}" alt="" width="36" height="36" loading="lazy" decoding="async" class="h-9 w-9 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`
    : isPrivate
    ? `<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${esc(initials(seller.name).slice(0, 1))}</span>`
    : `<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-[12px] font-bold tracking-tight text-white" aria-hidden="true">${esc(initials(seller.name))}</span>`;
  const tag = {
    particular: `<span class="text-[13px] text-ink/60">Particular</span>`,
    oficial: `<span class="inline-flex items-center gap-1 rounded-full bg-[#EEF1FB] px-2.5 py-1 text-[12px] font-medium text-brand">${icon('badge-check', 'h-3.5 w-3.5')} Oficial</span>`,
    multimarca: `<span class="text-ink/50" title="Agencia multimarca">${icon('store', 'h-[18px] w-[18px]')}</span>`,
  }[seller.type];
  return `
      <div class="mt-auto flex items-center gap-3 border-t border-line pt-4">
        ${avatar}
        <span class="min-w-0 flex-1 truncate text-[15px] font-medium">${esc(seller.name)}<span class="sr-only"> · ${esc(SELLER_TYPES[seller.type])}</span></span>
        ${tag}
      </div>`;
}

/** Tarjeta de auto. `lazy` = false para las primeras visibles. `slide` = envolverla en un swiper-slide. */
export function renderCarCard(c, { lazy = true, slide = false } = {}) {
  const title = `${carTitle(c)} ${c.year}`;
  const seller = sellerOf(c);
  const badge = c.badge ? BADGES[c.badge] : null;
  const shots = Array.from({ length: photoCount(c) }, (_, i) => carShot(c, i, 900, 675));
  const url = carUrl(c);

  const card = `
  <article class="car-card group" data-car-id="${esc(c.id)}">
    <div class="car-media" data-gallery="${esc(JSON.stringify(shots))}">
      <img class="car-img h-full w-full object-cover"
        src="${esc(shots[0])}"
        ${c.real ? '' : `srcset="${esc(srcset(c.photo, 4 / 3, [450, 700, 900]))}"`}
        sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 90vw"
        width="900" height="675" alt="${esc(title)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"></div>
      ${badge ? `<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium shadow-sm">${icon(badge.icon, `h-4 w-4 ${badge.cls}`)}${esc(badge.text)}</span>` : ''}
      ${c.feria ? `<span class="feria-timer absolute left-4 top-[58px]" data-oferta-ini="${esc(c.feria.ini)}" data-oferta-fin="${esc(c.feria.fin)}">${icon('clock', 'h-3.5 w-3.5')} <span data-oferta-txt>${esc(textoOferta(c.feria))}</span></span>` : ''}
      <button type="button" class="icon-btn fav-btn absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink" aria-label="Guardar ${esc(title)} en favoritos" aria-pressed="false">
        ${icon('heart', 'h-5 w-5')}
      </button>
      <div class="pointer-events-none absolute inset-x-4 bottom-4 text-white">
        <p class="flex items-center gap-2 text-[14px] font-medium"><span>${esc(c.year)}</span><span class="h-3.5 w-px bg-white/50" aria-hidden="true"></span><span>${esc(formatKm(c.km))}</span></p>
        ${c.priceBefore ? `<p class="mt-1 text-[14px] text-white/75"><span class="sr-only">${c.feria ? 'Precio normal' : 'Antes'}: </span><s>${esc(formatPrice(c.priceBefore, c.currency))}</s></p>` : ''}
        <p class="mt-0.5 text-[24px] font-bold leading-tight">${esc(formatPrice(c.price, c.currency))}</p>
      </div>
      <div class="gallery-dots" aria-hidden="true">${shots.map((_, i) => `<span class="${i === 0 ? 'is-on' : ''}"></span>`).join('')}</div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="car-title text-[19px] font-medium leading-snug"><a href="${esc(url)}" class="car-link">${esc(title)}</a></h3>
      <p class="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-ink/70">${esc(c.desc)}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink/80">
        <span class="inline-flex items-center gap-1.5">${icon('fuel', 'h-4 w-4')}<span class="sr-only">Combustible: </span>${esc(c.fuel)}</span>
        <span class="inline-flex items-center gap-1.5">${icon('cog', 'h-4 w-4')}<span class="sr-only">Caja: </span>${esc(c.gear)}</span>
      </p>
      <p class="mt-2 flex items-center gap-1.5 text-[15px]">${icon('map-pin', 'h-4 w-4 shrink-0 text-ink/70')} ${esc(c.city)}, ${esc(c.province)}</p>
      <a href="${esc(url)}" class="btn-outline relative z-[2] mb-5 mt-4 h-[46px] justify-center" aria-label="Ver más sobre ${esc(title)}">Ver más ${icon('arrow-right', 'h-4 w-4')}</a>
      ${renderSeller(seller)}
    </div>
  </article>`;

  return slide ? `<div class="swiper-slide !h-auto">${card}</div>` : card;
}

export const renderCarSlides = (list) => list.map((c, i) => renderCarCard(c, { lazy: i > 3, slide: true })).join('');
export const renderCarGrid = (list) => list.map((c, i) => renderCarCard(c, { lazy: i > 5 })).join('');
