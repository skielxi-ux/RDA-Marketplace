// Plantillas HTML puras de las secciones de la home.
// Se usan en el build (HTML ya armado para Google y carga rápida) y en el navegador
// (por ejemplo, al cambiar de pestaña). Todo dato pasa por esc().
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { unsplash, srcset, heroSlides, makes, bodyTypes, reasons } from '../data/catalog.js';

export const renderHeroSlides = () =>
  heroSlides
    .map((s, i) => `
    <div class="swiper-slide hero-slide relative overflow-hidden" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${heroSlides.length}">
      <img class="hero-bg absolute inset-0 h-full w-full object-cover"
        src="${esc(unsplash(s.photo, 1600, 900))}"
        srcset="${esc(srcset(s.photo, 16 / 9, [640, 1024, 1600, 2400]))}"
        sizes="100vw" width="1600" height="900" alt="${esc(s.alt)}"
        ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
      <div class="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/15 to-ink/45"></div>
      <div class="relative flex h-full justify-center px-6 pt-[128px] text-center sm:pt-[140px] md:pt-[185px]">
        <p class="hero-anim d1 max-w-[780px] text-[36px] font-bold leading-[1.15] text-white sm:text-[48px] md:text-[70px]">${esc(s.title)}</p>
      </div>
    </div>`)
    .join('');

export const renderMakeOptions = () =>
  Object.keys(makes).map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join('');

export const renderModelOptions = (make) =>
  '<option value="">Todos los modelos</option>' +
  (makes[make] || []).map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join('');

export const renderBodyTypes = () =>
  bodyTypes
    .map((t) => `
    <div class="swiper-slide">
      <a href="#autos-${esc(t.slug)}" class="type-card group relative block h-[260px] overflow-hidden rounded-2xl sm:h-[290px]">
        <img class="absolute inset-0 h-full w-full object-cover"
          src="${esc(unsplash(t.photo, 600, 700))}"
          srcset="${esc(srcset(t.photo, 6 / 7, [300, 450, 600]))}"
          sizes="(min-width:1200px) 20vw, (min-width:640px) 40vw, 75vw"
          width="600" height="700" alt="" loading="lazy" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/10 to-transparent"></div>
        <div class="relative p-[30px] text-white">
          <p class="text-[15px]">${esc(t.count)} autos</p>
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
