// Ranking +Buscados: los 10 vehículos (marca + modelo) más buscados del mes y del año.
// Lo usan el admin y "Mi cuenta". Los datos vienen de la función mkt_ranking_buscados() (requiere sesión).
import { $, $$ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { brandLogoSvg } from '../render/brandLogos.js';

const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const mesNombre = (iso) => new Date(iso).toLocaleDateString('es-AR', { month: 'long', timeZone: 'America/Argentina/Buenos_Aires' });
const anio = (iso) => new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' });

function marcaIcono(marca) {
  const svg = brandLogoSvg(slug(marca), 'h-7 w-7');
  return svg
    ? `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-soft text-ink">${svg}</span>`
    : `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${esc(String(marca).slice(0, 2).toUpperCase())}</span>`;
}

function lista(items, vacioTxt) {
  if (!items.length) {
    return `<div class="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-ink/60">${esc(vacioTxt)}</div>`;
  }
  const max = Math.max(...items.map((i) => i.busquedas));
  return `
  <ol class="space-y-3">
    ${items.map((it, i) => `
    <li class="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(5,11,32,0.25)] sm:p-5">
      <span class="w-8 shrink-0 text-center text-[22px] font-bold ${i < 3 ? 'text-brand' : 'text-ink/40'}">${i + 1}</span>
      ${marcaIcono(it.marca)}
      <div class="min-w-0 flex-1">
        <p class="truncate text-[17px] font-bold">${esc(it.marca)} ${esc(it.modelo)}</p>
        <span class="mt-2 block h-2 overflow-hidden rounded-full bg-soft"><span class="rk-bar block h-full rounded-full bg-brand" data-w="${(it.busquedas / max) * 100}"></span></span>
      </div>
      <span class="shrink-0 text-right"><b class="block text-[20px] leading-none">${esc(it.busquedas)}</b><small class="text-[12px] text-ink/60">${it.busquedas === 1 ? 'búsqueda' : 'búsquedas'}</small></span>
    </li>`).join('')}
  </ol>`;
}

/**
 * Pinta el ranking dentro de `box`. `sb` es el cliente de Supabase con la sesión (admin o cuenta).
 * Devuelve false si la sesión no tiene permiso.
 */
export async function renderRanking(box, sb) {
  box.innerHTML = '<p class="py-14 text-center text-ink/60">Cargando ranking…</p>';
  const { data, error } = await sb.rpc('mkt_ranking_buscados');
  if (error) {
    box.innerHTML = `<div class="rounded-2xl border border-line bg-white px-6 py-10 text-center text-ink/70">${esc(/permiso|42501/i.test(error.message + error.code)
      ? 'El ranking está disponible para cuentas habilitadas.'
      : 'No pudimos cargar el ranking. Probá de nuevo en un rato.')}</div>`;
    return false;
  }
  const mes = mesNombre(data.desde_mes);
  box.innerHTML = `
  <div class="rounded-[24px] border border-line bg-soft p-4 sm:p-7">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-brand">${icon('search', 'h-4 w-4')} +Buscados</p>
        <h2 class="mt-2 text-[24px] font-bold leading-tight sm:text-[28px]">Los 10 vehículos más buscados</h2>
        <p class="mt-1 text-[14px] text-ink/60">Según lo que la gente busca, filtra y mira en Red de Autos.</p>
      </div>
      <div class="tabs-brand flex gap-6 border-b border-line" role="tablist" aria-label="Período del ranking" data-rk-tabs>
        <button type="button" role="tab" class="tab-btn is-active capitalize" aria-selected="true" data-rk="mes">Este mes</button>
        <button type="button" role="tab" class="tab-btn" aria-selected="false" tabindex="-1" data-rk="anio">Este año</button>
      </div>
    </div>
    <p class="mt-5 text-[14px] text-ink/70" data-rk-total></p>
    <div class="mt-4" data-rk-list></div>
  </div>`;

  const paint = (k) => {
    const items = k === 'mes' ? data.mes : data.anio;
    $('[data-rk-total]', box).textContent = k === 'mes'
      ? `${data.total_mes} ${data.total_mes === 1 ? 'búsqueda' : 'búsquedas'} en ${mes}`
      : `${data.total_anio} ${data.total_anio === 1 ? 'búsqueda' : 'búsquedas'} en ${anio(data.desde_anio)}`;
    $('[data-rk-list]', box).innerHTML = lista(items, k === 'mes' ? `Todavía no hay búsquedas con marca y modelo en ${mes}.` : 'Todavía no hay búsquedas con marca y modelo este año.');
    // Anchos por JS (la CSP no permite estilos en línea en el HTML)
    requestAnimationFrame(() => $$('.rk-bar', box).forEach((el) => { el.style.width = `${Number(el.dataset.w) || 0}%`; }));
    $$('[data-rk]', box).forEach((b) => {
      const on = b.dataset.rk === k;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  };
  $$('[data-rk]', box).forEach((b) => b.addEventListener('click', () => paint(b.dataset.rk)));
  paint('mes');
  return true;
}
