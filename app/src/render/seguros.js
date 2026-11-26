// Página Seguros: presentación del partner y botón de WhatsApp.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';
import { seguroUrl } from './ficha.js';

const PASOS = [
  ['car', 'Contanos qué auto tenés', 'Marca, modelo, año y versión. Si todavía lo estás comprando en Red de Autos, también te cotizan.'],
  ['message-circle', 'Te asesoran por WhatsApp', 'Un asesor te explica las coberturas disponibles y te ayuda a elegir la que mejor te queda.'],
  ['shield-check', 'Asegurás tu auto', 'Elegís la cobertura, cerrás todo con ellos y salís a la calle tranquilo.'],
];

export function renderSeguros() {
  const { nombre, logo } = SITE.seguros;
  const url = seguroUrl(null);
  return `
  <section class="container-x pt-12 md:pt-[80px]" aria-labelledby="seg-titulo">
    <div class="grid items-center gap-10 rounded-[28px] bg-ink px-6 py-10 text-white sm:px-10 md:grid-cols-[1.3fr_1fr] md:px-14 md:py-14">
      <div>
        <p class="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white/70">${icon('shield-check', 'h-4 w-4')} Partner en seguros</p>
        <h2 id="seg-titulo" class="mt-4 text-[28px] font-bold leading-[1.2] sm:text-[36px] md:text-[42px]">¿Necesitás asegurar tu vehículo?</h2>
        <p class="mt-4 max-w-[560px] text-[17px] leading-[1.7] text-white/80">Ahora podés hacerlo con uno de nuestros partners líderes en seguros: <b class="text-white">${esc(nombre)}</b>. Escribiles por WhatsApp y te asesoran para elegir la cobertura ideal.</p>
        ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn-cta btn-wa mt-8 !pl-2.5"><span class="btn-cta-icon">${icon('whatsapp', 'h-4 w-4')}</span> Cotizar por WhatsApp</a>` : ''}
      </div>
      <div class="grid place-items-center rounded-[22px] bg-white p-8 md:p-10">
        ${logo ? `<img src="${esc(logo)}" alt="${esc(nombre)}" width="320" height="165" class="h-auto max-h-[165px] w-full max-w-[320px] object-contain" />` : `<p class="text-center text-[30px] font-bold tracking-tight text-ink">${esc(nombre)}</p>`}
      </div>
    </div>
  </section>

  <section class="container-x pt-16 md:pt-[90px]" aria-labelledby="seg-pasos">
    <h2 id="seg-pasos" class="section-title mb-10">Cómo funciona</h2>
    <ol class="grid gap-8 md:grid-cols-3 md:gap-5">
      ${PASOS.map(([ic, t, d], i) => `
      <li class="pub-step">
        <span class="pub-num">${i + 1}</span>
        <span class="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF1FB] text-brand">${icon(ic, 'h-6 w-6')}</span>
        <h3 class="mt-4 text-[18px] font-bold">${esc(t)}</h3>
        <p class="mt-1.5 text-[15px] leading-[1.7] text-ink/70">${esc(d)}</p>
      </li>`).join('')}
    </ol>
    <p class="mt-8 max-w-[760px] text-[13px] leading-[1.6] text-ink/55">La cotización, la contratación y la atención del seguro están a cargo de ${esc(nombre)}. Red de Autos no comercializa seguros ni interviene en la contratación.</p>
  </section>`;
}
