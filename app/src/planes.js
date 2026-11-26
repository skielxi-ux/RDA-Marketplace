// Planes de ahorro: vitrina de vendedores de plan de los concesionarios (los carga el admin).
// Paso 1: elegir el concesionario. Paso 2: elegir el vendedor y escribirle por WhatsApp o llamarlo.
// Cada toque en WhatsApp o Llamar suma un clic anónimo para las estadísticas del admin.
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { $ } from './ui/dom.js';
import { esc } from './lib/html.js';
import { icon } from './lib/icons.js';
import { planImgUrl } from './lib/fotos.js';
import { rpc } from './data/autosReales.js';
import { waRda } from './render/home2.js';

document.documentElement.classList.add('js');
initHeader();
initDrawer();
initAuth();

const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const iniciales = (n) => n.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const fmtTel = (t) => String(t).replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2-$3');
const wa = (v, c) => `https://wa.me/${v.whatsapp}?text=${encodeURIComponent(`¡Hola ${v.nombre.split(' ')[0]}! Te contacto desde Red de Autos por un plan de ahorro ${c.marca} en ${c.nombre}.`)}`;

function tarjetaConcesionario(c, activo) {
  const logo = planImgUrl(c.logo);
  const n = c.vendedores?.length ?? 0;
  return `
  <li>
    <button type="button" class="group flex h-full w-full flex-col items-center rounded-[20px] border bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_18px_40px_-18px_rgba(64,95,242,0.45)] ${activo ? 'border-brand ring-2 ring-brand/30' : 'border-line'}"
      aria-pressed="${activo}" data-pl-con="${esc(c.id)}">
      <span class="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-white p-2">
        ${logo ? `<img src="${esc(logo)}" alt="" width="200" height="150" loading="lazy" decoding="async" class="max-h-full max-w-full object-contain" />`
               : `<span class="grid h-16 w-16 place-items-center rounded-2xl bg-[#EEF1FB] text-[22px] font-bold text-brand">${esc(iniciales(c.nombre))}</span>`}
      </span>
      <span class="mt-3 text-[16px] font-bold leading-snug">${esc(c.nombre)}</span>
      <span class="mt-0.5 text-[13px] text-ink/60">${esc(c.marca)}${c.ciudad ? ` · ${esc(c.ciudad)}` : ''}</span>
      <span class="mt-2 rounded-full bg-soft px-2.5 py-0.5 text-[12px] font-medium text-ink/70">${n} ${n === 1 ? 'vendedor' : 'vendedores'}</span>
    </button>
  </li>`;
}

function tarjetaVendedor(v, c) {
  const foto = planImgUrl(v.foto);
  return `
  <li class="flex flex-col rounded-[20px] border border-line bg-white p-5">
    <div class="flex items-center gap-4">
      ${foto ? `<img src="${esc(foto)}" alt="" width="72" height="72" loading="lazy" decoding="async" class="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />`
             : `<span class="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[22px] font-bold text-brand">${esc(iniciales(v.nombre))}</span>`}
      <div class="min-w-0">
        <p class="text-[18px] font-bold leading-snug">${esc(v.nombre)}</p>
        <p class="text-[14px] text-ink/60">${esc(c.nombre)} · ${esc(c.marca)}</p>
      </div>
    </div>
    ${v.planes ? `<p class="mt-4 text-[14px]"><span class="font-bold">Planes:</span> ${esc(v.planes)}</p>` : ''}
    ${v.horario ? `<p class="mt-2 flex items-center gap-1.5 text-[14px] text-ink/70">${icon('clock', 'h-4 w-4 shrink-0')} ${esc(v.horario)}</p>` : ''}
    <div class="mt-auto grid grid-cols-2 gap-2 pt-5">
      <a href="${esc(wa(v, c))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px] justify-center !px-3" data-pl-clic="whatsapp" data-id="${esc(v.id)}">${icon('whatsapp', 'h-4 w-4')} WhatsApp</a>
      <a href="tel:+54${esc(v.telefono)}" class="btn-outline h-[48px] justify-center !px-3" data-pl-clic="llamada" data-id="${esc(v.id)}" aria-label="Llamar a ${esc(v.nombre)} al ${esc(fmtTel(v.telefono))}">${icon('phone', 'h-4 w-4')} Llamar</a>
    </div>
  </li>`;
}

(async () => {
  const lista = $('[data-pl-concesionarios]');
  const vendBox = $('[data-pl-vend-box]');
  $('[data-pl-sumate]').href = waRda('¡Hola! Vendo planes de ahorro en un concesionario y quiero aparecer en la página de Planes de ahorro de Red de Autos.');
  let datos = [];
  try { datos = await rpc('mkt_planes_publicos'); } catch { datos = []; }
  if (!Array.isArray(datos)) datos = [];

  if (!datos.length) {
    lista.innerHTML = `
      <li class="col-span-full rounded-[24px] border border-dashed border-line p-8 text-center sm:p-12">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${icon('handshake', 'h-6 w-6')}</span>
        <p class="mt-4 text-[20px] font-bold">Pronto vas a encontrar acá a los vendedores de planes de ahorro</p>
        <p class="mx-auto mt-2 max-w-[520px] text-[15px] text-ink/70">De los concesionarios de Tucumán, con contacto directo por WhatsApp o teléfono.</p>
      </li>`;
    return;
  }

  let elegido = new URLSearchParams(location.search).get('c');
  if (!datos.some((c) => c.id === elegido)) elegido = datos.length === 1 ? datos[0].id : null;

  const marcas = [...new Set(datos.map((c) => c.marca))].sort((a, b) => a.localeCompare(b, 'es'));
  if (marcas.length > 1) {
    $('[data-pl-marcas]').innerHTML = ['', ...marcas].map((m, i) => `<label class="filter-pill"><input type="radio" name="pl-marca" value="${esc(m)}" class="sr-only" ${i ? '' : 'checked'} /><span>${esc(m || 'Todas')}</span></label>`).join('');
  }
  $('[data-pl-filtros]').hidden = false;
  $('[data-pl-paso1]').hidden = false;

  const pintarVendedores = (scroll) => {
    const c = datos.find((x) => x.id === elegido);
    vendBox.hidden = !c;
    if (!c) return;
    $('[data-pl-vend-sub]').textContent = `${c.nombre} · ${c.marca}${c.direccion ? ` · ${c.direccion}` : ''}${c.ciudad ? `, ${c.ciudad}` : ''}`;
    $('[data-pl-vendedores]').innerHTML = (c.vendedores ?? []).map((v) => tarjetaVendedor(v, c)).join('');
    if (scroll) vendBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const pintar = () => {
    const q = norm($('[data-pl-q]').value.trim());
    const marca = $('[name="pl-marca"]:checked')?.value ?? '';
    const vis = datos.filter((c) => (!marca || c.marca === marca)
      && (!q || norm(`${c.nombre} ${c.marca} ${c.ciudad ?? ''} ${(c.vendedores ?? []).map((v) => `${v.nombre} ${v.planes ?? ''}`).join(' ')}`).includes(q)));
    lista.innerHTML = vis.length ? vis.map((c) => tarjetaConcesionario(c, c.id === elegido)).join('')
      : '<li class="col-span-full py-10 text-center text-ink/60">No encontramos concesionarios con esa búsqueda.</li>';
  };
  pintar();
  pintarVendedores(false);

  $('[data-pl-filtros]').addEventListener('input', pintar);
  $('[data-pl-filtros]').addEventListener('submit', (e) => e.preventDefault());
  lista.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pl-con]');
    if (!b) return;
    elegido = b.dataset.plCon;
    const url = new URL(location.href); url.searchParams.set('c', elegido); history.replaceState(null, '', url);
    pintar(); pintarVendedores(true);
  });
  // Clic a WhatsApp o Llamar: se cuenta (anónimo) sin frenar la acción
  vendBox.addEventListener('click', (e) => {
    const a = e.target.closest('[data-pl-clic]');
    if (a) rpc('mkt_registrar_clic_plan', { p_id: a.dataset.id, p_tipo: a.dataset.plClic }).catch(() => {});
  });
})();
