// Página Partners: empresas del rubro automotor de la red, con buscador y filtro por rubro.
// Tocar el logo abre el WhatsApp del partner (y suma un clic anónimo para las estadísticas del admin).
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { $, $$ } from './ui/dom.js';
import { esc } from './lib/html.js';
import { icon } from './lib/icons.js';
import { logoPartnerUrl } from './lib/fotos.js';
import { rpc } from './data/autosReales.js';
import { MENSAJE_PARTNER } from './data/partners.js';
import { waRda } from './render/home2.js';

document.documentElement.classList.add('js');
initHeader();
initDrawer();
initAuth();

const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const iniciales = (n) => n.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const wa = (p) => `https://wa.me/${p.whatsapp}?text=${encodeURIComponent(MENSAJE_PARTNER(p.nombre))}`;

function tarjeta(p) {
  const logo = logoPartnerUrl(p.logo);
  return `
  <li class="flex flex-col items-center text-center">
    <a href="${esc(wa(p))}" target="_blank" rel="noopener noreferrer" class="group grid aspect-square w-full place-items-center overflow-hidden rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1DA851] hover:shadow-[0_18px_40px_-18px_rgba(29,168,81,0.55)]"
       aria-label="Escribirle a ${esc(p.nombre)} por WhatsApp" data-pa-wa="${esc(p.id)}">
      ${logo
        ? `<img src="${esc(logo)}" alt="" width="200" height="200" loading="lazy" decoding="async" class="max-h-full max-w-full object-contain" />`
        : `<span class="grid h-20 w-20 place-items-center rounded-2xl bg-[#EEF1FB] text-[26px] font-bold text-brand">${esc(iniciales(p.nombre))}</span>`}
    </a>
    <p class="mt-3 text-[16px] font-bold leading-snug">${esc(p.nombre)}</p>
    <p class="mt-0.5 text-[13px] text-ink/60">${esc(p.rubro)}${p.ciudad ? ` · ${esc(p.ciudad)}` : ''}</p>
    ${p.beneficio ? `<p class="mt-2 inline-flex items-start gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[12px] font-bold text-[#1E6B34]">${icon('tag', 'mt-px h-3.5 w-3.5 shrink-0')} ${esc(p.beneficio)}</p>` : ''}
    <div class="mt-2 flex items-center gap-3 text-[13px]">
      <a href="${esc(wa(p))}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-medium text-[#178F45] hover:underline" data-pa-wa="${esc(p.id)}">${icon('whatsapp', 'h-3.5 w-3.5')} WhatsApp</a>
      ${p.instagram ? `<a href="https://instagram.com/${esc(p.instagram)}" target="_blank" rel="noopener noreferrer" class="text-ink/60 hover:text-brand">@${esc(p.instagram)}</a>` : ''}
    </div>
    ${p.direccion ? `<p class="mt-1 text-[12px] text-ink/50">${esc(p.direccion)}</p>` : ''}
  </li>`;
}

(async () => {
  const lista = $('[data-pa-lista]');
  const cuenta = $('[data-pa-cuenta]');
  $('[data-pa-sumate]').href = waRda('¡Hola! Tengo una empresa del rubro automotor y quiero sumarme como partner de Red de Autos.');
  let partners = [];
  try { partners = await rpc('mkt_partners_publicos'); } catch { partners = []; }

  if (!partners.length) {
    lista.innerHTML = `
      <li class="col-span-full rounded-[24px] border border-dashed border-line p-8 text-center sm:p-12">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${icon('handshake', 'h-6 w-6')}</span>
        <p class="mt-4 text-[20px] font-bold">Pronto vas a encontrar acá a las empresas de la red</p>
        <p class="mx-auto mt-2 max-w-[520px] text-[15px] text-ink/70">Talleres, detailing, polarizados, gestoría y más, con contacto directo por WhatsApp.</p>
      </li>`;
    return;
  }

  // Rubros presentes (con cantidad)
  const rubros = [...partners.reduce((m, p) => m.set(p.rubro, (m.get(p.rubro) ?? 0) + 1), new Map())].sort((a, b) => a[0].localeCompare(b[0], 'es'));
  $('[data-pa-rubros]').innerHTML = [['', 'Todos', partners.length], ...rubros.map(([r, n]) => [r, r, n])]
    .map(([v, t, n], i) => `<label class="filter-pill"><input type="radio" name="pa-rubro" value="${esc(v)}" class="sr-only" ${i ? '' : 'checked'} /><span>${esc(t)} <span class="text-ink/50">(${n})</span></span></label>`).join('');
  $('[data-pa-filtros]').hidden = false;

  const pintar = () => {
    const q = norm($('[data-pa-q]').value.trim());
    const rubro = $('[name="pa-rubro"]:checked')?.value ?? '';
    const vis = partners.filter((p) => (!rubro || p.rubro === rubro) && (!q || norm(`${p.nombre} ${p.rubro} ${p.ciudad ?? ''} ${p.beneficio ?? ''}`).includes(q)));
    cuenta.textContent = `${vis.length} ${vis.length === 1 ? 'partner' : 'partners'}`;
    lista.innerHTML = vis.length ? vis.map(tarjeta).join('') : '<li class="col-span-full py-10 text-center text-ink/60">No encontramos partners con esa búsqueda.</li>';
  };
  pintar();
  $('[data-pa-filtros]').addEventListener('input', pintar);
  $('[data-pa-filtros]').addEventListener('submit', (e) => e.preventDefault());
  // Clic al WhatsApp: se cuenta (anónimo) sin frenar la apertura
  lista.addEventListener('click', (e) => {
    const a = e.target.closest('[data-pa-wa]');
    if (a) rpc('mkt_registrar_clic_partner', { p_id: a.dataset.paWa }).catch(() => {});
  });
})();
