// Página pública de una agencia (agencia.html?id=): logo, datos de contacto, presentación y su stock.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { renderCarGrid } from './carCard.js';
import { SELLER_TYPES } from '../data/catalog.js';

const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const fmtTel = (t) => String(t).replace(/^549(\d{3})(\d{3})(\d+)$/, '$1 $2-$3');

export function renderAgencia(a) {
  const tipo = a.tipo === 'oficial' ? `${SELLER_TYPES.oficial}${a.marca_oficial ? ` ${a.marca_oficial}` : ''}` : SELLER_TYPES.multimarca;
  const wa = a.whatsapp ? `https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Hola ${a.nombre}, te escribo desde Red de Autos.`)}` : '';
  const datos = [
    a.direccion ? [icon('map-pin', 'h-4 w-4'), `${a.direccion}, ${a.ciudad}, ${a.provincia}`] : [icon('map-pin', 'h-4 w-4'), `${a.ciudad}, ${a.provincia}`],
    a.horario ? [icon('calendar', 'h-4 w-4'), a.horario] : null,
    a.whatsapp ? [icon('phone', 'h-4 w-4'), fmtTel(a.whatsapp)] : null,
  ].filter(Boolean);
  const links = [
    a.email ? `<a href="mailto:${esc(a.email)}" class="link-view">${icon('message-circle', 'h-4 w-4')} ${esc(a.email)}</a>` : '',
    a.sitio_web ? `<a href="${esc(a.sitio_web)}" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${icon('arrow-up-right', 'h-4 w-4')} ${esc(a.sitio_web.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>` : '',
    a.instagram ? `<a href="https://www.instagram.com/${esc(a.instagram)}/" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${icon('arrow-up-right', 'h-4 w-4')} @${esc(a.instagram)}</a>` : '',
  ].filter(Boolean);

  return `
  <section class="border-b border-line bg-soft">
    <div class="container-x py-8 md:py-12">
      <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
        <ol class="flex flex-wrap items-center gap-2"><li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li><li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li><li aria-current="page" class="text-ink">${esc(a.nombre)}</li></ol>
      </nav>
      <div class="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
        ${a.logoUrl
          ? `<img src="${esc(a.logoUrl)}" alt="Logo de ${esc(a.nombre)}" width="400" height="400" class="h-24 w-24 shrink-0 rounded-[20px] border border-line bg-white object-contain p-2 md:h-28 md:w-28" />`
          : `<span class="grid h-24 w-24 shrink-0 place-items-center rounded-[20px] bg-ink text-[30px] font-bold text-white md:h-28 md:w-28" aria-hidden="true">${esc(initials(a.nombre))}</span>`}
        <div class="min-w-0 flex-1">
          <h1 class="text-[30px] font-bold leading-[1.1] sm:text-[38px] md:text-[44px]">${esc(a.nombre)}</h1>
          <p class="mt-2 inline-flex items-center gap-1.5 text-[15px] ${a.tipo === 'oficial' ? 'text-brand' : 'text-ink/70'}">${icon(a.tipo === 'oficial' ? 'badge-check' : 'store', 'h-4 w-4')} ${esc(tipo)}</p>
        </div>
        ${wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener noreferrer" class="btn-cta btn-wa shrink-0 justify-center !pl-2.5"><span class="btn-cta-icon">${icon('message-circle', 'h-4 w-4')}</span> Escribir por WhatsApp</a>` : ''}
      </div>
    </div>
  </section>

  <div class="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div class="min-w-0 lg:order-1">
      <h2 class="section-title">Stock disponible <span class="text-ink/45">(${esc(a.autos.length)})</span></h2>
      ${a.autos.length
        ? `<div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" data-agencia-grid>${renderCarGrid(a.autos)}</div>`
        : `<p class="mt-6 rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60">Esta agencia todavía no publicó autos.</p>`}
    </div>
    <aside class="lg:order-2">
      <div class="rounded-[20px] border border-line bg-white p-6 lg:sticky lg:top-[110px]">
        <p class="text-[18px] font-bold">Datos de contacto</p>
        <ul class="mt-4 space-y-3 text-[15px] text-ink/80">${datos.map(([ic, t]) => `<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-brand">${ic}</span><span>${esc(t)}</span></li>`).join('')}</ul>
        ${links.length ? `<div class="mt-5 flex flex-col items-start gap-3">${links.join('')}</div>` : ''}
        ${a.descripcion ? `<div class="mt-6 border-t border-line pt-5"><p class="text-[16px] font-bold">Sobre ${esc(a.nombre)}</p><p class="mt-2 whitespace-pre-line text-[15px] leading-[1.7] text-ink/75">${esc(a.descripcion)}</p></div>` : ''}
        <p class="mt-6 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
      </div>
    </aside>
  </div>`;
}
