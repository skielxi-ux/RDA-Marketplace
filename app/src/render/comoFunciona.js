// Página "Cómo funciona": pestañas (una guía por tipo de usuario). Sin JS se ven todas, una abajo de la otra.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { GUIAS } from '../data/comoFunciona.js';

export const renderGuias = () => `
  <div class="cf-tabs" role="tablist" aria-label="Elegí tu guía">
    ${GUIAS.map((g, i) => `<button type="button" role="tab" id="tab-${g.id}" class="cf-tab${i === 0 ? ' is-active' : ''}" aria-selected="${i === 0}" aria-controls="${g.id}"${i ? ' tabindex="-1"' : ''} data-cf-tab="${g.id}">${icon(g.icon, 'h-5 w-5')} <span>${esc(g.tab)}</span></button>`).join('')}
  </div>
  ${GUIAS.map((g, i) => `
  <section id="${g.id}" role="tabpanel" aria-labelledby="tab-${g.id}" class="cf-panel scroll-mt-28 pt-10 md:pt-14" data-cf-panel${i ? ' data-cf-oculto' : ''}>
    <div class="max-w-[760px]">
      <h2 class="text-[26px] font-bold leading-[1.2] tracking-tight sm:text-[32px] md:text-[38px]">${esc(g.titulo)}</h2>
      <p class="mt-4 text-[16px] leading-[1.75] text-ink/75">${esc(g.intro)}</p>
    </div>
    <ol class="mt-10 grid gap-8 sm:grid-cols-2 ${g.pasos.length > 5 ? 'xl:grid-cols-3' : 'xl:grid-cols-5'} xl:gap-5">
      ${g.pasos.map((p, k) => `
      <li class="pub-step">
        <span class="pub-num">${k + 1}</span>
        <span class="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF1FB] text-brand">${icon(p.icon, 'h-6 w-6')}</span>
        <h3 class="mt-4 text-[18px] font-bold">${esc(p.titulo)}</h3>
        <p class="mt-1.5 text-[15px] leading-[1.7] text-ink/70">${esc(p.texto)}</p>
      </li>`).join('')}
    </ol>
    <div class="mt-10 flex flex-col gap-6 rounded-[24px] bg-soft p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div class="max-w-[720px]">
        <p class="flex items-center gap-2 text-[17px] font-bold">${icon('shield-check', 'h-5 w-5 text-brand')} ${esc(g.consejo.titulo)}</p>
        <p class="mt-2 text-[15px] leading-[1.7] text-ink/75">${esc(g.consejo.texto)}</p>
      </div>
      <a href="${esc(g.cta.href)}" class="btn-primary h-[54px] shrink-0 justify-center !px-8">${icon(g.cta.icon, 'h-4 w-4')} ${esc(g.cta.label)}</a>
    </div>
  </section>`).join('')}`;
