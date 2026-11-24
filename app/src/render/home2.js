// Plantillas de la segunda mitad de la home: vender tu auto, cifras, testimonios, marcas y footer.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { unsplash, srcset } from '../data/catalog.js';
import { SITE } from '../data/site.js';
import { sellCta, stats, testimonials, brands, footer } from '../data/home.js';
import { logoSvg } from './logo.js';

export function renderSellCta() {
  const [small, tall] = sellCta.photos;
  return `
  <section id="vender" aria-labelledby="sell-title" class="pt-20 md:pt-[110px]">
    <div class="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div class="reveal grid grid-cols-[0.85fr_1fr] items-end gap-4 sm:gap-6">
        <img class="h-[220px] w-full rounded-2xl object-cover sm:h-[300px] lg:h-[330px]"
          src="${esc(unsplash(small.id, 600, 660))}" srcset="${esc(srcset(small.id, 600 / 660, [300, 450, 600]))}"
          sizes="(min-width:1024px) 22vw, 45vw" width="600" height="660" alt="${esc(small.alt)}" loading="lazy" decoding="async" />
        <img class="h-[320px] w-full rounded-2xl object-cover sm:h-[440px] lg:h-[520px]"
          src="${esc(unsplash(tall.id, 700, 1040))}" srcset="${esc(srcset(tall.id, 700 / 1040, [350, 520, 700]))}"
          sizes="(min-width:1024px) 26vw, 52vw" width="700" height="1040" alt="${esc(tall.alt)}" loading="lazy" decoding="async" />
      </div>
      <div class="reveal lg:max-w-[560px]">
        <h2 id="sell-title" class="section-title">${esc(sellCta.title)}</h2>
        <p class="mt-6 text-[15px] leading-[1.75]">${esc(sellCta.text)}</p>
        <ul class="mt-6 space-y-4">
          ${sellCta.bullets.map((b) => `
          <li class="flex items-start gap-3 text-[15px]">
            <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-ink">${icon('check', 'h-3 w-3')}</span>
            ${esc(b)}
          </li>`).join('')}
        </ul>
        <a href="${esc(sellCta.cta.href)}" class="btn-primary mt-9 h-[54px] px-7">${esc(sellCta.cta.label)} ${icon('arrow-up-right', 'h-4 w-4')}</a>
      </div>
    </div>
  </section>`;
}

export const renderStats = () => `
  <section aria-label="La red en números" class="pt-16 md:pt-[90px]">
    <div class="container-x">
      <dl class="grid grid-cols-2 gap-y-10 border-b border-line pb-12 text-center md:grid-cols-4 md:pb-[70px]">
        ${stats.map((s) => `
        <div class="reveal flex flex-col-reverse gap-2">
          <dt class="text-[13px] uppercase tracking-wide sm:text-[15px]">${esc(s.label)}</dt>
          <dd class="text-[32px] font-bold leading-none sm:text-[38px]"><span data-count="${esc(s.value)}">${esc(s.value.toLocaleString('es-AR'))}</span>${esc(s.suffix)}</dd>
        </div>`).join('')}
      </dl>
    </div>
  </section>`;

/** Solo se muestra si hay reseñas reales cargadas en data/home.js. */
export function renderTestimonials() {
  if (!testimonials.length) return '';
  return `
  <section aria-labelledby="testimonials-title" class="pt-20 md:pt-[110px]">
    <div class="container-x">
      <h2 id="testimonials-title" class="section-title reveal mb-10">Lo que dicen quienes compraron</h2>
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        ${testimonials.map((t) => `
        <figure class="reveal flex flex-col rounded-2xl bg-[#E9F2FF] p-8">
          <div class="flex items-start justify-between gap-4">
            <p class="text-[18px] font-medium">${esc(t.title)}</p>
            ${icon('quote', 'h-8 w-8 shrink-0 text-brand')}
          </div>
          <blockquote class="mt-5 flex-1 text-[15px] leading-[1.75]">“${esc(t.text)}”</blockquote>
          <figcaption class="mt-6 text-[15px] font-medium">${esc(t.name)}<span class="block text-[14px] font-normal text-ink/70">${esc(t.city)}</span></figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </section>`;
}

export const renderBrands = () => `
  <section aria-labelledby="brands-title" class="pt-20 md:pt-[110px]">
    <div class="container-x">
      <div class="relative">
        <div class="absolute inset-y-0 left-1/2 w-full max-w-[1160px] -translate-x-1/2 rounded-2xl bg-soft" aria-hidden="true"></div>
        <div class="relative py-12 md:py-[70px]">
          <div class="reveal mb-8 flex items-end justify-between gap-4 md:mb-10">
            <h2 id="brands-title" class="section-title">Explorá por marca</h2>
            <a href="#marcas" class="link-view">Ver todas ${icon('arrow-up-right', 'h-4 w-4')}</a>
          </div>
          <ul class="reveal grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
            ${brands.map((b) => `
            <li>
              <a href="#marca-${esc(b.slug)}" class="group flex h-[130px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_10px_30px_rgba(5,11,32,0.07)] sm:h-[150px]">
                <span class="text-[20px] font-bold tracking-tight transition-colors duration-300 group-hover:text-brand">${esc(b.name)}</span>
                <span class="text-[14px] text-ink/70">${esc(b.count)} autos</span>
              </a>
            </li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

export const renderFooter = () => `
  <footer class="mt-20 rounded-t-[32px] bg-ink text-white md:mt-[120px] md:rounded-t-[80px]">
    <div class="container-x">
      <div class="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between md:py-[60px]">
        <div>
          <p class="text-[24px] font-medium md:text-[30px]">${esc(footer.join.title)}</p>
          <p class="mt-2 text-[15px] text-white/80">${esc(footer.join.text)}</p>
        </div>
        <a href="${esc(footer.join.cta.href)}" class="btn-primary h-[54px] shrink-0 px-8">${esc(footer.join.cta.label)} ${icon('arrow-up-right', 'h-4 w-4')}</a>
      </div>

      <div class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:py-[70px]">
        <div>
          <a href="./" aria-label="Red de Autos, ir al inicio" class="inline-block">${logoSvg('h-10 w-auto', { text: '#FFFFFF' })}</a>
          <p class="mt-5 max-w-[300px] text-[15px] leading-[1.75] text-white/80">${esc(footer.about)}</p>
          <a href="tel:${esc(SITE.phone.tel)}" class="mt-5 inline-flex items-center gap-2 text-[15px] transition-colors hover:text-brand-hover">${icon('phone', 'h-4 w-4')} ${esc(SITE.phone.display)}</a>
        </div>
        ${footer.columns.map((col) => `
        <nav aria-label="${esc(col.title)}">
          <p class="mb-5 text-[18px] font-medium">${esc(col.title)}</p>
          <ul class="space-y-3">
            ${col.links.map(([label, href]) => `<li><a href="${esc(href)}" class="text-[15px] text-white/80 transition-colors hover:text-white hover:underline underline-offset-4">${esc(label)}</a></li>`).join('')}
          </ul>
        </nav>`).join('')}
      </div>

      <div class="flex flex-col gap-3 border-t border-white/10 py-7 text-[14px] text-white/80 sm:flex-row sm:items-center sm:justify-between">
        <p>© ${new Date().getFullYear()} ${esc(SITE.name)}. Todos los derechos reservados.</p>
        <ul class="flex gap-5">
          ${footer.legal.map(([label, href]) => `<li><a href="${esc(href)}" class="transition-colors hover:text-white">${esc(label)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
  </footer>`;
