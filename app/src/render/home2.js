// Plantillas de la segunda mitad de la home: vender tu auto, cifras, testimonios, marcas y footer.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';
import { forDealers, forIndependents, sellPrivate, stats, testimonials, brands, footer } from '../data/home.js';
import { logoSvg } from './logo.js';
import { brandLogoSvg } from './brandLogos.js';
import { countBy } from '../data/catalog.js';

export const renderForDealers = () => `
  <section id="agencias" aria-labelledby="dealers-title" class="pt-20 md:pt-[110px]">
    <div class="container-x">
      <div class="reveal grid items-center gap-10 rounded-[28px] bg-ink px-5 py-10 text-white sm:px-10 md:px-14 md:py-14 xl:grid-cols-[1.05fr_1fr] xl:gap-14 xl:px-[80px] xl:py-[80px]">
        <div>
          <p class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-[#9DB0FF]">
            ${icon('store', 'h-4 w-4')} ${esc(forDealers.eyebrow)}
          </p>
          <h2 id="dealers-title" class="mt-5 max-w-[640px] text-[32px] font-bold leading-[1.08] tracking-tight text-balance sm:text-[42px] xl:text-[52px]">${esc(forDealers.title)}</h2>
          <p class="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-white/80 sm:text-[18px]">${esc(forDealers.text)}</p>
          <a href="${esc(forDealers.cta.href)}" class="btn-cta group mt-9">
            <span class="btn-cta-icon">${icon('arrow-right', 'h-4 w-4')}</span>
            ${esc(forDealers.cta.label)}
          </a>
        </div>
        <ul class="grid overflow-hidden rounded-2xl border border-white/15 sm:grid-cols-2">
          ${forDealers.features.map((f) => `
          <li class="feature-cell group">
            <span class="feature-icon">${icon(f.icon, 'h-6 w-6')}</span>
            <h3 class="mt-5 text-[18px] font-bold leading-snug sm:text-[19px]">${esc(f.title)}</h3>
            <p class="mt-2 text-[15px] leading-[1.65] text-white/75">${esc(f.text)}</p>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`;

export const renderSellPrivate = () => `
  <section id="vender" aria-labelledby="sell-title" class="pt-20 md:pt-[110px]">
    <div class="container-x">
      <div class="reveal grid items-center gap-10 rounded-[28px] border border-line bg-soft px-5 py-10 sm:px-10 md:px-14 md:py-14 xl:grid-cols-[1.05fr_1fr] xl:gap-14 xl:px-[80px] xl:py-[80px]">
        <div>
          <p class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-ink/80">
            ${icon('user', 'h-4 w-4 text-brand')} ${esc(sellPrivate.eyebrow)}
          </p>
          <h2 id="sell-title" class="mt-5 max-w-[640px] text-[32px] font-bold leading-[1.08] tracking-tight text-balance sm:text-[42px] xl:text-[52px]">${esc(sellPrivate.title)}</h2>
          <p class="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-ink/80 sm:text-[18px]">${esc(sellPrivate.text)}</p>
          <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="${esc(sellPrivate.primary.href)}" class="btn-cta group">
              <span class="btn-cta-icon">${icon('plus', 'h-4 w-4')}</span>
              ${esc(sellPrivate.primary.label)}
            </a>
            <a href="${esc(sellPrivate.secondary.href)}" class="btn-arrow group">
              ${esc(sellPrivate.secondary.label)}
              ${icon('chevron-right', 'h-4 w-4')}
            </a>
          </div>
        </div>
        <ol class="overflow-hidden rounded-2xl border border-line bg-white">
          ${sellPrivate.steps.map((st, i) => `
          <li class="step-row group">
            <span class="step-icon">${icon(st.icon, 'h-6 w-6')}</span>
            <div class="min-w-0 flex-1">
              <h3 class="text-[18px] font-bold leading-snug sm:text-[20px]">${esc(st.title)}</h3>
              <p class="mt-1.5 text-[15px] leading-[1.6] text-ink/75">${esc(st.text)}</p>
            </div>
            <span class="step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          </li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;

export const renderForIndependents = () => {
  const d = forIndependents;
  const foto = d.foto
    ? `<img src="${esc(d.foto)}" alt="${esc(d.fotoAlt)}" width="900" height="1100" loading="lazy" decoding="async" class="h-full w-full object-cover" />`
    : `<div class="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#405FF2_0%,#050B20_100%)] text-white/80">${icon('handshake', 'h-16 w-16')}</div>`;
  return `
  <section id="independientes" aria-labelledby="indep-title" class="pt-20 md:pt-[110px]">
    <div class="container-x">
      <div class="reveal grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 xl:gap-16">
        <div class="relative min-h-[300px] overflow-hidden rounded-[28px] sm:min-h-[420px]">
          ${foto}
          <p class="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold shadow-sm">${icon('handshake', 'h-4 w-4 text-brand')} Comisión de 1 % a 4 %</p>
        </div>
        <div class="flex flex-col justify-center">
          <p class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-ink/80">${icon('handshake', 'h-4 w-4 text-brand')} ${esc(d.eyebrow)}</p>
          <h2 id="indep-title" class="mt-5 text-[32px] font-bold leading-[1.08] tracking-tight text-balance sm:text-[42px] xl:text-[48px]">${esc(d.title)}</h2>
          <p class="mt-5 max-w-[600px] text-[16px] leading-[1.7] text-ink/80 sm:text-[18px]">${esc(d.text)}</p>
          <ul class="mt-8 grid gap-3">
            ${d.benefits.map((b) => `
            <li class="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(5,11,32,0.08)]">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${icon(b.icon, 'h-6 w-6')}</span>
              <div class="min-w-0">
                <h3 class="text-[18px] font-bold leading-snug">${esc(b.title)}</h3>
                <p class="mt-1 text-[15px] leading-[1.6] text-ink/75">${esc(b.text)}</p>
              </div>
            </li>`).join('')}
          </ul>
          <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button type="button" class="btn-cta group" data-registro-tipo="vendedor">
              <span class="btn-cta-icon">${icon('arrow-right', 'h-4 w-4')}</span>
              Quiero ser vendedor independiente
            </button>
            <a href="./agencias.html?filtro=independientes#listado" class="btn-arrow group">Ver agencias que aceptan ${icon('chevron-right', 'h-4 w-4')}</a>
          </div>
          <p class="mt-5 text-[13px] text-ink/60">${esc(d.nota)}</p>
        </div>
      </div>
    </div>
  </section>`;
};

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
            <a href="./marcas.html" class="link-view">Ver todas ${icon('arrow-up-right', 'h-4 w-4')}</a>
          </div>
          <ul class="reveal grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
            ${brands.map((b) => `
            <li>
              <a href="./autos.html?marca=${encodeURIComponent(b.name)}&amp;o=marca" class="group flex h-[150px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_10px_30px_rgba(5,11,32,0.07)] active:translate-y-0 active:scale-[0.98] sm:h-[170px]">
                <span class="mb-2 text-ink transition-all duration-300 group-hover:scale-110 group-hover:text-brand">${brandLogoSvg(b.slug, 'h-10 w-10 sm:h-11 sm:w-11')}</span>
                <span class="text-[17px] font-bold tracking-tight transition-colors duration-300 group-hover:text-brand sm:text-[18px]">${esc(b.name)}</span>
                ${((n) => `<span class="text-[14px] text-ink/70">${n ? `${n} ${n === 1 ? 'auto' : 'autos'}` : 'Ver autos'}</span>`)(countBy((c) => c.brand === b.name))}
              </a>
            </li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

const renderContacto = () => `
  <section id="contacto" class="container-x mt-20 scroll-mt-28 md:mt-[120px]" aria-labelledby="contacto-titulo">
    <div class="grid items-center gap-10 md:grid-cols-2 lg:gap-[100px]">
      <div class="overflow-hidden rounded-2xl bg-line">
        <img src="./img/contacto-760.webp" srcset="./img/contacto-480.webp 480w, ./img/contacto-760.webp 760w"
          sizes="(min-width: 768px) 45vw, 100vw" width="753" height="659" loading="lazy" decoding="async"
          alt="Mujer sonriendo mientras mira su celular en la calle" class="h-full w-full object-cover">
      </div>
      <div>
        <h2 id="contacto-titulo" class="text-[28px] font-bold leading-[1.25] tracking-tight sm:text-[36px] lg:text-[40px]">¿Tenés más preguntas? No dudes en contactarnos</h2>
        <address class="mt-6 text-[15px] not-italic leading-[1.75]">${SITE.address.map(esc).join('<br>')}</address>
        <div class="mt-6 flex flex-wrap gap-4">
          <a href="tel:${esc(SITE.phone.tel)}" class="btn-outline h-[54px] rounded-full px-7 max-sm:w-full max-sm:justify-center">${icon('smartphone', 'h-5 w-5')} ${esc(SITE.phone.display)}</a>
          <a href="mailto:${esc(SITE.email)}" class="btn-outline h-[54px] rounded-full px-7 max-sm:w-full max-sm:justify-center">${icon('mail', 'h-5 w-5')} ${esc(SITE.email)}</a>
        </div>
      </div>
    </div>
  </section>`;

export const renderFooter = () => `${renderContacto()}
  <footer class="mt-20 rounded-t-[32px] bg-ink text-white md:mt-[120px] md:rounded-t-[80px]">
    <div class="container-x">
      <div class="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between md:py-[60px]">
        <div>
          <p class="text-[24px] font-medium md:text-[30px]">${esc(footer.join.title)}</p>
          <p class="mt-2 text-[15px] text-white/80">${esc(footer.join.text)}</p>
        </div>
        <a href="${esc(footer.join.cta.href)}" class="btn-primary h-[54px] shrink-0 px-8">${esc(footer.join.cta.label)} ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>

      <div class="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:py-[70px]">
        <div class="col-span-2 md:col-span-4 lg:col-span-1">
          <a href="./" aria-label="Red de Autos, ir al inicio" class="inline-block">${logoSvg('h-10 w-auto', { text: '#FFFFFF' })}</a>
          <p class="mt-5 max-w-[300px] text-[15px] leading-[1.75] text-white/80">${esc(footer.about)}</p>
          <a href="tel:${esc(SITE.phone.tel)}" class="mt-5 flex w-fit items-center gap-2 text-[15px] transition-colors hover:text-brand-hover">${icon('phone', 'h-4 w-4')} ${esc(SITE.phone.display)}</a>
          <a href="mailto:${esc(SITE.email)}" class="mt-3 flex w-fit items-center gap-2 text-[15px] transition-colors hover:text-brand-hover">${icon('mail', 'h-4 w-4')} ${esc(SITE.email)}</a>
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
        <ul class="flex flex-wrap items-center gap-5">
          ${footer.legal.map(([label, href]) => `<li><a href="${esc(href)}" class="transition-colors hover:text-white">${esc(label)}</a></li>`).join('')}
          <li><a href="./admin.html" rel="nofollow" class="text-[12px] text-white/15 transition-colors hover:text-white/50">Admin</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
