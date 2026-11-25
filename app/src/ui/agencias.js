// Directorio de agencias: buscar, filtrar (aceptan vendedores independientes / oficiales) y contactar.
import { $ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { cargarAgencias } from '../data/autosReales.js';
import { cuentaGuardada } from './auth.js';
import { vendedorApi } from './autosApi.js';

const iniciales = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const fmtTel = (t) => { const n = String(t).replace(/^549?/, ''); return n.length === 10 ? `${n.slice(0, 3)} ${n.slice(3, 6)}-${n.slice(6)}` : n; };

let comisiones = {}; // solo para vendedores independientes aprobados

function tarjeta(a) {
  const tipo = a.agencia_tipo === 'oficial' ? `Concesionario oficial${a.marca_oficial ? ` ${a.marca_oficial}` : ''}` : 'Agencia multimarca';
  const wa = a.tel ? `https://wa.me/${a.tel}?text=${encodeURIComponent(`Hola ${a.nombre}, los contacto desde Red de Autos.`)}` : '';
  return `
  <li class="flex flex-col rounded-[22px] border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(5,11,32,0.08)]">
    <div class="flex items-start gap-4">
      ${a.logoUrl
        ? `<img src="${esc(a.logoUrl)}" alt="Logo de ${esc(a.nombre)}" width="72" height="72" loading="lazy" class="h-[72px] w-[72px] shrink-0 rounded-2xl border border-line bg-white object-contain p-1.5" />`
        : `<span class="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl bg-ink text-[22px] font-bold text-white" aria-hidden="true">${esc(iniciales(a.nombre))}</span>`}
      <div class="min-w-0">
        <h2 class="text-[18px] font-bold leading-tight"><a href="./agencia.html?id=${encodeURIComponent(a.id)}" class="transition-colors hover:text-brand">${esc(a.nombre)}</a></h2>
        <p class="mt-1 flex items-center gap-1.5 text-[14px] text-brand">${icon('badge-check', 'h-4 w-4 shrink-0')} ${esc(tipo)}</p>
        <p class="mt-1 flex items-center gap-1.5 text-[14px] text-ink/70">${icon('map-pin', 'h-4 w-4 shrink-0')} ${esc([a.ciudad, a.provincia].filter(Boolean).join(', '))}</p>
      </div>
    </div>
    ${a.acepta_independientes ? `<p class="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-[13px] font-bold text-[#1E6B34]">${icon('handshake', 'h-4 w-4')} Acepta vendedores independientes${comisiones[a.id] ? ` · ${esc(comisiones[a.id])} %` : ''}</p>` : ''}
    ${a.horario ? `<p class="mt-3 text-[13px] text-ink/60">${icon('clock', 'mr-1 inline h-3.5 w-3.5 align-[-2px]')}${esc(a.horario)}</p>` : ''}
    <div class="mt-auto pt-5">
      <a href="./agencia.html?id=${encodeURIComponent(a.id)}" class="link-view mb-4 text-[15px]">Ver ${esc(a.autos)} ${a.autos === 1 ? 'auto publicado' : 'autos publicados'} ${icon('arrow-up-right', 'h-4 w-4')}</a>
      ${a.tel ? `<div class="grid grid-cols-2 gap-2">
        <a href="${esc(wa)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[46px] justify-center !px-3 text-[14px]">${icon('message-circle', 'h-4 w-4')} WhatsApp</a>
        <a href="tel:+${esc(a.tel)}" class="btn-outline h-[46px] justify-center !px-3 text-[14px]" aria-label="Llamar a ${esc(a.nombre)} al ${esc(fmtTel(a.tel))}">${icon('phone', 'h-4 w-4')} Llamar</a>
      </div>` : ''}
    </div>
  </li>`;
}

export async function initAgencias() {
  const lista = $('[data-ag-lista]');
  const cuenta = $('[data-ag-cuenta]');
  const form = $('[data-ag-filtros]');
  if (!lista) return;
  let agencias = [];
  const yo = cuentaGuardada();
  if (yo?.tipo === 'vendedor' && yo.estado === 'aprobada') {
    try { comisiones = (await vendedorApi('comisiones')).comisiones ?? {}; } catch { comisiones = {}; }
  }
  try { agencias = await cargarAgencias(); } catch {
    lista.innerHTML = '<li class="col-span-full rounded-2xl bg-[#FDECEC] px-5 py-4 text-[#B42318]">No pudimos cargar las agencias. Probá de nuevo en un rato.</li>';
    return;
  }
  const q0 = new URLSearchParams(location.search);
  if (q0.get('filtro') && form.querySelector(`[value="${CSS.escape(q0.get('filtro'))}"]`)) form.querySelector(`[value="${CSS.escape(q0.get('filtro'))}"]`).checked = true;

  const pintar = () => {
    const q = norm($('[data-ag-q]').value.trim());
    const filtro = new FormData(form).get('ag-filtro');
    const vis = agencias.filter((a) =>
      (!q || norm(`${a.nombre} ${a.ciudad} ${a.provincia} ${a.marca_oficial ?? ''}`).includes(q))
      && (filtro !== 'independientes' || a.acepta_independientes)
      && (filtro !== 'oficial' || a.agencia_tipo === 'oficial'));
    cuenta.textContent = `${vis.length} ${vis.length === 1 ? 'agencia' : 'agencias'}`;
    lista.innerHTML = vis.length ? vis.map(tarjeta).join('')
      : `<li class="col-span-full rounded-[20px] border border-dashed border-line p-10 text-center text-ink/70">${filtro === 'independientes' && !q
        ? 'Todavía ninguna agencia se sumó a trabajar con vendedores independientes. ¡Volvé pronto!'
        : 'No encontramos agencias con ese filtro.'}</li>`;
  };
  form.addEventListener('input', pintar);
  // Botón del banner: muestra solo las que aceptan vendedores independientes, sin recargar
  $('[data-ag-independientes]')?.addEventListener('click', (e) => {
    e.preventDefault();
    form.querySelector('[value="independientes"]').checked = true;
    pintar();
    history.replaceState(null, '', './agencias.html?filtro=independientes#listado');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  pintar();
}
