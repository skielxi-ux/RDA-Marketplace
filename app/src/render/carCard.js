import { esc, formatPrice, formatKm } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { unsplash, srcset } from '../data/catalog.js';

const BADGE_TONE = { ok: 'bg-ok', brand: 'bg-brand' };
const SELLER = {
  oficial: { label: 'Concesionario oficial', icon: 'badge-check', cls: 'text-brand' },
  multimarca: { label: 'Agencia multimarca', icon: 'building-2', cls: '' },
};

export const carTitle = (c) => `${c.brand} ${c.model}`;
export const carSubtitle = (c) => `${c.condition === 'new' ? '0km' : 'Usado'} · ${c.sub}`;

/** Tarjeta de auto. `lazy` = false para las primeras visibles. */
export function renderCarCard(c, { lazy = true } = {}) {
  const title = carTitle(c);
  const seller = SELLER[c.seller] ?? SELLER.multimarca;
  const shots = c.gallery.map((g) => unsplash(g.id, 900, 600, g.crop));
  const url = `#auto-${c.id}`;

  return `
  <div class="swiper-slide">
    <article class="car-card group">
      <div class="relative h-[218px] overflow-hidden rounded-2xl bg-soft" data-gallery="${esc(JSON.stringify(shots))}">
        <img class="car-img h-full w-full object-cover"
          src="${esc(shots[0])}"
          srcset="${esc(srcset(c.photo, 3 / 2, [450, 700, 900]))}"
          sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 85vw"
          width="900" height="600" alt="${esc(title)} ${esc(c.year)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" />
        ${c.badge ? `<span class="absolute left-5 top-5 rounded-full px-[15px] py-1 text-[14px] font-medium text-white ${BADGE_TONE[c.badge.tone] ?? 'bg-brand'}">${esc(c.badge.text)}</span>` : ''}
        <button type="button" class="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-all duration-300 hover:bg-brand hover:text-white" aria-label="Guardar ${esc(title)}">
          ${icon('bookmark', 'h-3.5 w-3.5')}
        </button>
        <div class="gallery-dots" aria-hidden="true">${shots.map((_, i) => `<span class="${i === 0 ? 'is-on' : ''}"></span>`).join('')}</div>
      </div>
      <div class="pt-[18px]">
        <h3 class="car-title text-[18px] font-medium leading-snug"><a href="${esc(url)}">${esc(title)}</a></h3>
        <p class="mt-1 truncate text-[14px]">${esc(carSubtitle(c))}</p>
        <p class="mt-2 flex items-center gap-1.5 text-[13px] text-ink/70">
          ${icon(seller.icon, `h-3.5 w-3.5 ${seller.cls}`)} ${esc(seller.label)} · ${esc(c.city)}
        </p>
        <ul class="mt-[14px] grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-line py-[14px] text-[14px]">
          <li class="flex items-center gap-2">${icon('gauge', 'h-[18px] w-[18px]')}<span class="sr-only">Kilometraje: </span>${esc(formatKm(c.km))}</li>
          <li class="flex items-center gap-2">${icon('fuel', 'h-[18px] w-[18px]')}<span class="sr-only">Combustible: </span>${esc(c.fuel)}</li>
          <li class="flex items-center gap-2">${icon('cog', 'h-[18px] w-[18px]')}<span class="sr-only">Caja: </span>${esc(c.gear)}</li>
          <li class="flex items-center gap-2">${icon('calendar', 'h-[18px] w-[18px]')}<span class="sr-only">Año: </span>${esc(c.year)}</li>
        </ul>
        <div class="flex items-center justify-between pt-4">
          <span class="text-[20px] font-bold">${esc(formatPrice(c.price, c.currency))}</span>
          <a href="${esc(url)}" class="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand transition-colors hover:text-ink" aria-label="Ver detalle de ${esc(title)}">
            Ver detalle ${icon('arrow-up-right', 'h-4 w-4')}
          </a>
        </div>
      </div>
    </article>
  </div>`;
}

export const renderCarSlides = (cars) => cars.map((c, i) => renderCarCard(c, { lazy: i > 3 })).join('');
