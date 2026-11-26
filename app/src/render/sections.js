// Plantillas HTML puras de las secciones de la home.
// Se usan en el build (HTML ya armado para Google y carga rápida) y en el navegador
// (por ejemplo, al cambiar de pestaña). Todo dato pasa por esc().
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { heroSlides, HERO_WIDTHS, heroSrc, bodyTypes, reasons } from '../data/catalog.js';
import { SEARCH_MAKES, searchBrands } from '../data/modelos.js';

export const renderHeroSlides = () =>
  heroSlides
    .map((s, i) => `
    <div class="swiper-slide hero-slide relative overflow-hidden" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${heroSlides.length}">
      <img class="hero-bg absolute inset-0 h-full w-full object-cover" data-pos="${esc(s.pos)}"
        src="${esc(heroSrc(s.file, 1600))}"
        srcset="${esc(HERO_WIDTHS.map((w) => `${heroSrc(s.file, w)} ${w}w`).join(', '))}"
        sizes="100vw" width="1600" height="900" alt="${esc(s.alt)}"
        ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
      <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" aria-hidden="true"></div>
    </div>`)
    .join('');

export const renderMakeOptions = (selected = '') =>
  searchBrands.map((m) => `<option value="${esc(m)}"${m === selected ? ' selected' : ''}>${esc(m)}</option>`).join('');

export const renderModelOptions = (make, selected = '') =>
  '<option value="">Todos los modelos</option>' +
  (Object.hasOwn(SEARCH_MAKES, make ?? '') ? SEARCH_MAKES[make] : []).map((m) => `<option value="${esc(m)}"${m === selected ? ' selected' : ''}>${esc(m)}</option>`).join('');

export const renderBodyTypes = () =>
  bodyTypes
    .map((t) => `
    <div class="swiper-slide">
      <a href="./autos.html?carroceria=${esc(t.slug)}" class="type-card group relative block h-[260px] overflow-hidden rounded-2xl sm:h-[290px]">
        <img class="absolute inset-0 h-full w-full object-cover"
          src="./img/carrocerias/${esc(t.slug)}-600.webp"
          srcset="${[300, 450, 600].map((w) => `./img/carrocerias/${esc(t.slug)}-${w}.webp ${w}w`).join(', ')}"
          sizes="(min-width:1200px) 20vw, (min-width:640px) 40vw, 75vw"
          width="600" height="700" alt="${esc(t.alt ?? '')}" loading="lazy" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/10 to-transparent"></div>
        <div class="relative p-[30px] text-white">
          <p class="text-[15px]" data-conteo-tipo="${esc(t.slug)}">Ver autos</p>
          <h3 class="mt-1 text-[18px] font-medium">${esc(t.name)}</h3>
        </div>
      </a>
    </div>`)
    .join('');

export const renderReasons = () =>
  reasons
    .map((r) => `
    <article class="reveal rounded-2xl bg-white p-8 shadow-[0_10px_40px_rgba(5,11,32,0.05)] transition-transform duration-300 hover:-translate-y-1.5 md:p-10">
      <span class="relative inline-block text-brand">
        ${icon(r.icon, 'h-[42px] w-[42px]')}
        ${icon('sparkle', 'absolute -right-2 -top-1 h-3.5 w-3.5 text-[#E959D9]')}
      </span>
      <h3 class="mt-6 text-[20px] font-medium leading-tight">${esc(r.title)}</h3>
      <p class="mt-4 text-[15px] leading-[1.75]">${esc(r.text)}</p>
    </article>`)
    .join('');
