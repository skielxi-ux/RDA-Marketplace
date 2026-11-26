// Panel del administrador del marketplace (admin.html).
// Ingreso con la misma contraseña del admin de la web actual (función "admin"); los datos salen de "mkt-admin".
import { createClient } from '@supabase/supabase-js';
import { $, $$, initTabs } from './dom.js';
import { esc, formatPrice } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';
import { renderRanking } from './ranking.js';
import { renderEstadisticas } from './adminEstadisticas.js';
import { renderPartners } from './adminPartners.js';
import { renderPlanes } from './adminPlanes.js';
import { fotoUrl } from '../lib/fotos.js';

const sb = createClient(SITE.supabase.url, SITE.supabase.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rda-mkt-admin' },
});
const FN = (name) => `${SITE.supabase.url}/functions/v1/${name}`;

async function call(name, body, auth = true) {
  let token = null;
  if (auth) token = (await sb.auth.getSession()).data.session?.access_token;
  const res = await fetch(FN(name), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SITE.supabase.publishableKey, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  let data = {};
  try { data = await res.json(); } catch { /* vacío */ }
  if (!res.ok) { const e = new Error(data.error || 'No pudimos conectarnos.'); e.status = res.status; throw e; }
  return data;
}
const admin = (accion, extra = {}) => call('mkt-admin', { accion, ...extra });

// ---------- Formatos ----------
const fmtTel = (t) => String(t || '').replace(/^549(\d{3})(\d{3})(\d{4})$/, '+54 9 $1 $2-$3');
const fmtCuit = (c) => (c ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : '');
const fmtFecha = (d) => new Date(d).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
const ESTADOS = {
  activa: ['Activa', 'bg-[#E8F5E9] text-ok'],
  aprobada: ['Aprobada', 'bg-[#E8F5E9] text-ok'],
  pendiente: ['En revisión', 'bg-[#FFF6E5] text-[#8A5A00]'],
  rechazada: ['Rechazada', 'bg-[#FDECEC] text-[#B42318]'],
  suspendida: ['Suspendida', 'bg-[#FDECEC] text-[#B42318]'],
};
const chip = (text, cls) => `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${cls}">${esc(text)}</span>`;

// ---------- Toast ----------
function toast(text, ok = true) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = text;
  t.classList.toggle('!bg-[#B42318]', !ok);
  t.classList.add('is-on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('is-on'), 2600);
}

// ---------- Diálogo de confirmación ----------
function dialog({ title, text, ok = 'Confirmar', danger = false, extra = '', onOpen, cancel = 'Cancelar' }) {
  const d = $('#adm-dialog');
  $('#dlg-title').textContent = title;
  $('#dlg-text').textContent = text;
  $('[data-dlg-extra]', d).innerHTML = extra;
  const okBtn = $('[data-dlg-ok]', d);
  okBtn.textContent = ok;
  okBtn.hidden = !ok;
  okBtn.classList.toggle('!bg-[#D92D20]', danger);
  okBtn.disabled = false;
  $$('[data-dlg-cancel]', d)[1].textContent = cancel;
  d.hidden = false;
  requestAnimationFrame(() => d.classList.add('is-open'));
  onOpen?.(d, okBtn);
  (ok ? okBtn : $$('[data-dlg-cancel]', d)[1]).focus();
  return new Promise((resolve) => {
    const done = (v) => {
      d.classList.remove('is-open');
      setTimeout(() => { d.hidden = true; }, 200);
      okBtn.removeEventListener('click', yes);
      $$('[data-dlg-cancel]', d).forEach((b) => b.removeEventListener('click', no));
      document.removeEventListener('keydown', esc_);
      resolve(v);
    };
    const yes = () => done(true);
    const no = () => done(false);
    const esc_ = (e) => { if (e.key === 'Escape') no(); };
    okBtn.addEventListener('click', yes);
    $$('[data-dlg-cancel]', d).forEach((b) => b.addEventListener('click', no));
    document.addEventListener('keydown', esc_);
  });
}

// ---------- Tarjeta de cuenta ----------
const btn = (op, id, label, ic, cls = 'btn-outline') => `<button type="button" class="${cls} h-[40px] !px-3.5 text-[14px]" data-op="${op}" data-id="${esc(id)}">${icon(ic, 'h-4 w-4')} ${esc(label)}</button>`;

function cuentaCard(c) {
  const [estTxt, estCls] = ESTADOS[c.estado] ?? [c.estado, 'bg-soft'];
  const tipo = c.tipo === 'agencia'
    ? (c.agencia_tipo === 'oficial' ? `Concesionario oficial ${c.marca_oficial ?? ''}` : 'Agencia multimarca')
    : c.tipo === 'vendedor' ? 'Vendedor independiente' : 'Particular';
  const acciones = [];
  if (c.estado === 'pendiente') acciones.push(btn('aprobar', c.id, 'Aprobar', 'circle-check', 'btn-primary'), btn('rechazar', c.id, 'Rechazar', 'x'));
  else if (c.estado === 'rechazada') acciones.push(btn('aprobar', c.id, 'Aprobar', 'circle-check', 'btn-primary'));
  else if (c.estado === 'suspendida') acciones.push(btn('reactivar', c.id, 'Reactivar', 'rotate-ccw', 'btn-primary'));
  else acciones.push(btn('suspender', c.id, 'Suspender', 'lock'));
  if (c.bloqueada) acciones.push(btn('desbloquear', c.id, 'Desbloquear', 'lock'));
  acciones.push(btn('reset_pin', c.id, 'Nuevo PIN', 'rotate-ccw'));
  acciones.push(btn('prueba', c.id, c.es_prueba ? 'No es prueba' : 'Marcar prueba', 'tag'));

  const ETQ = { nombre: 'Nombre', cuit: 'CUIT', agencia_tipo: 'Tipo', marca_oficial: 'Marca oficial' };
  const val = (k, v) => (v == null || v === '' ? '—' : k === 'cuit' ? fmtCuit(String(v)) : k === 'agencia_tipo' ? (v === 'oficial' ? 'Concesionario oficial' : 'Agencia multimarca') : String(v));
  const cambios = c.cambios_pendientes && typeof c.cambios_pendientes === 'object' ? Object.entries(c.cambios_pendientes).filter(([k]) => ETQ[k]) : [];
  const logo = fotoUrl(c.logo ?? '');

  return `
  <article class="rounded-2xl border border-line bg-white p-5 sm:p-6" data-card="${esc(c.id)}">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="flex flex-wrap items-center gap-2 text-[18px] font-bold leading-tight">
          ${logo ? `<img src="${esc(logo)}" alt="" width="32" height="32" class="h-8 w-8 rounded-lg border border-line object-contain" />` : icon(c.tipo === 'agencia' ? 'store' : c.tipo === 'vendedor' ? 'handshake' : 'user', 'h-5 w-5 text-brand')} <span class="break-words">${esc(c.nombre)}</span>
        </p>
        <p class="mt-1 text-[14px] text-ink/70">${esc(tipo)}</p>
      </div>
      <div class="flex flex-wrap gap-2">${chip(estTxt, estCls)}${c.es_prueba ? chip('Prueba', 'bg-ink/10 text-ink') : ''}${c.bloqueada ? chip('Bloqueada 15 min', 'bg-[#FDECEC] text-[#B42318]') : ''}</div>
    </div>
    <dl class="mt-4 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
      <div class="flex gap-2"><dt class="text-ink/60">WhatsApp</dt><dd><a href="https://wa.me/${esc(c.telefono)}" target="_blank" rel="noopener noreferrer" class="font-medium text-brand underline-offset-4 hover:underline">${esc(fmtTel(c.telefono))}</a></dd></div>
      ${c.cuit ? `<div class="flex gap-2"><dt class="text-ink/60">CUIT</dt><dd class="font-medium">${esc(fmtCuit(c.cuit))}</dd></div>` : ''}
      ${c.dni ? `<div class="flex gap-2"><dt class="text-ink/60">DNI</dt><dd class="font-medium">${esc(Number(c.dni).toLocaleString('es-AR'))}</dd></div>` : ''}
      ${c.email && c.tipo === 'vendedor' ? `<div class="flex gap-2"><dt class="text-ink/60">Email</dt><dd class="break-all">${esc(c.email)}</dd></div>` : ''}
      ${c.ciudad || c.provincia ? `<div class="flex gap-2"><dt class="text-ink/60">Zona</dt><dd>${esc([c.ciudad, c.provincia].filter(Boolean).join(', '))}</dd></div>` : ''}
      <div class="flex gap-2"><dt class="text-ink/60">Alta</dt><dd>${esc(fmtFecha(c.created_at))}</dd></div>
      ${c.revisado_at ? `<div class="flex gap-2"><dt class="text-ink/60">Revisada</dt><dd>${esc(fmtFecha(c.revisado_at))}</dd></div>` : ''}
    </dl>
    ${cambios.length ? `
    <div class="mt-4 rounded-xl bg-[#EEF1FB] p-4">
      <p class="text-[14px] font-bold text-brand">Pidió cambiar${c.cambios_at ? ` · ${esc(fmtFecha(c.cambios_at))}` : ''}</p>
      <ul class="mt-2 space-y-1 text-[14px]">${cambios.map(([k, v]) => `<li><span class="text-ink/60">${esc(ETQ[k])}:</span> ${esc(val(k, c[k]))} → <b>${esc(val(k, v))}</b></li>`).join('')}</ul>
      <div class="mt-3 flex flex-wrap gap-2">${btn('aprobar_cambios', c.id, 'Aprobar cambios', 'circle-check', 'btn-primary')}${btn('rechazar_cambios', c.id, 'Rechazar', 'x')}</div>
    </div>` : ''}
    <div class="mt-5 flex flex-wrap gap-2">${acciones.join('')}</div>
  </article>`;
}

const vacio = (texto) => `<div class="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-ink/60">${esc(texto)}</div>`;

// ---------- Vistas ----------
let resumenData = null;

function renderResumen(r) {
  const cards = [
    ['Cuentas', r.total, 'user'], ['Particulares', r.particulares, 'user'], ['Agencias', r.agencias, 'store'], ['Vendedores independientes', r.vendedores ?? 0, 'handshake'],
    ['Agencias aprobadas', r.agencias_aprobadas, 'badge-check'], ['Por revisar', r.pendientes, 'clipboard-check'],
    ['Suspendidas', r.suspendidas, 'lock'],
  ];
  const max = Math.max(1, ...r.dias.map((d) => d.particulares + d.agencias));
  const diaTxt = (s) => new Date(`${s}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  $('#v-resumen').innerHTML = `
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      ${cards.map(([k, v, ic]) => `
      <div class="rounded-2xl border border-line bg-white p-5">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${icon(ic, 'h-5 w-5')}</span>
        <p class="mt-4 text-[30px] font-bold leading-none">${esc(v)}</p>
        <p class="mt-1.5 text-[14px] text-ink/70">${esc(k)}</p>
      </div>`).join('')}
    </div>
    ${r.autos_revision ? `<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF4E0] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FDEBC8]" data-go="autos"><span><b>${esc(r.autos_revision)}</b> ${r.autos_revision === 1 ? 'auto de particular espera' : 'autos de particulares esperan'} tu revisión</span>${icon('arrow-right', 'h-5 w-5')}</button>` : ''}
    ${r.cambios ? `<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#EEF1FB] px-5 py-4 text-left text-brand transition-colors hover:bg-[#E2E7FA]" data-go="concesionarios"><span><b>${esc(r.cambios)}</b> ${r.cambios === 1 ? 'agencia pidió' : 'agencias pidieron'} cambiar datos de su perfil</span>${icon('arrow-right', 'h-5 w-5')}</button>` : ''}
    ${r.vendedores_pendientes ? `<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF6E5] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FFEFD1]" data-go="vendedores"><span><b>${esc(r.vendedores_pendientes)}</b> ${r.vendedores_pendientes === 1 ? 'vendedor independiente espera' : 'vendedores independientes esperan'} revisión</span>${icon('arrow-right', 'h-5 w-5')}</button>` : ''}
    ${r.pendientes ? `<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF6E5] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FFEFD1]" data-go="concesionarios"><span><b>${esc(r.pendientes)}</b> ${r.pendientes === 1 ? 'agencia espera' : 'agencias esperan'} revisión</span>${icon('arrow-right', 'h-5 w-5')}</button>` : ''}
    <section class="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-6" aria-labelledby="reg-title">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 id="reg-title" class="text-[20px] font-bold">Registros de los últimos 14 días</h2>
        <p class="flex gap-4 text-[13px] text-ink/70"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-brand"></span>Particulares</span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-ink"></span>Agencias</span></p>
      </div>
      <ul class="mt-5 space-y-2.5">
        ${r.dias.slice().reverse().map((d) => {
          const tot = d.particulares + d.agencias;
          return `
        <li class="grid grid-cols-[92px_minmax(0,1fr)_28px] items-center gap-3 text-[13px]">
          <span class="capitalize text-ink/70">${esc(diaTxt(d.dia))}</span>
          <span class="flex h-3 overflow-hidden rounded-full bg-soft" role="img" aria-label="${esc(`${d.particulares} particulares y ${d.agencias} agencias`)}">
            <span class="adm-bar bg-brand" data-w="${(d.particulares / max) * 100}"></span><span class="adm-bar bg-ink" data-w="${(d.agencias / max) * 100}"></span>
          </span>
          <span class="text-right font-medium">${esc(tot)}</span>
        </li>`;
        }).join('')}
      </ul>
      ${r.pruebas ? `<p class="mt-5 text-[13px] text-ink/60">No se cuentan ${esc(r.pruebas)} ${r.pruebas === 1 ? 'cuenta' : 'cuentas'} de prueba.</p>` : ''}
    </section>`;
  // Anchos de las barras por JS (la CSP no permite estilos en línea en el HTML)
  $$('.adm-bar', $('#v-resumen')).forEach((el) => { el.style.width = `${Number(el.dataset.w) || 0}%`; });

  const pend = $('[data-count-pend]');
  pend.textContent = String(r.pendientes);
  pend.hidden = !r.pendientes;
  const pv = $('[data-count-vend]');
  if (pv) { pv.textContent = String(r.vendedores_pendientes ?? 0); pv.hidden = !r.vendedores_pendientes; }
  const pr = $('[data-count-pruebas]');
  pr.textContent = String(r.pruebas);
  pr.hidden = !r.pruebas;
}

async function loadResumen() {
  resumenData = await admin('resumen');
  renderResumen(resumenData);
}

// ---------- Particulares y Concesionarios ----------
const LIST_TABS = {
  particulares: {
    tipo: 'particular', titulo: 'Particulares', placeholder: 'Buscar por nombre, ciudad o celular',
    estados: [['', 'Todos los estados'], ['activa', 'Activa'], ['suspendida', 'Suspendida']],
  },
  vendedores: {
    tipo: 'vendedor', titulo: 'Vendedores independientes', placeholder: 'Buscar por nombre, ciudad o celular',
    estados: [['', 'Todos los estados'], ['pendiente', 'En revisión'], ['aprobada', 'Aprobado'], ['rechazada', 'Rechazado'], ['suspendida', 'Suspendido']],
  },
  concesionarios: {
    tipo: 'agencia', titulo: 'Concesionarios y agencias', placeholder: 'Buscar por nombre, ciudad, celular o CUIT',
    estados: [['', 'Todos los estados'], ['pendiente', 'En revisión'], ['aprobada', 'Aprobada'], ['rechazada', 'Rechazada'], ['suspendida', 'Suspendida']],
  },
};

function listShell(tab) {
  const box = $(`#v-${tab}`);
  if (box.dataset.ready) return box;
  const cfg = LIST_TABS[tab];
  box.dataset.ready = '1';
  box.innerHTML = `
    ${tab === 'concesionarios' ? '<div data-pend></div>' : ''}
    <form class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]" role="search" aria-label="Buscar ${esc(cfg.titulo)}">
      <label class="sr-only" for="q-${tab}">Buscar</label>
      <div class="relative">
        ${icon('search', 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50')}
        <input id="q-${tab}" name="q" type="search" class="auth-input pl-11" placeholder="${esc(cfg.placeholder)}" maxlength="60" />
      </div>
      <label class="sr-only" for="e-${tab}">Estado</label>
      <div class="relative">
        <select id="e-${tab}" name="estado" class="auth-input appearance-none pr-10">${cfg.estados.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select>
        ${icon('chevron-down', 'pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2')}
      </div>
    </form>
    <div data-lista class="mt-6"></div>`;
  const f = $('form', box);
  let t;
  f.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => reload(tab), 350); });
  f.addEventListener('submit', (e) => { e.preventDefault(); reload(tab); });
  return box;
}

async function loadList(tab) {
  const cfg = LIST_TABS[tab];
  const box = listShell(tab);
  const f = $('form', box);
  const lista = $('[data-lista]', box);
  lista.innerHTML = vacio('Cargando…');
  const estado = f.elements.estado.value;
  const [todas, pend, camb] = await Promise.all([
    admin('cuentas', { tipo: cfg.tipo, q: f.elements.q.value, estado }),
    tab === 'concesionarios' ? admin('cuentas', { tipo: 'agencia', estado: 'pendiente' }) : null,
    tab === 'concesionarios' ? admin('cuentas', { tipo: 'agencia', cambios: true }) : null,
  ]);
  let cuentas = todas.cuentas;
  if (pend) {
    $('[data-pend]', box).innerHTML = pend.cuentas.length ? `
      <section class="mb-10 rounded-2xl bg-[#FFF6E5] p-4 sm:p-6" aria-labelledby="pend-title">
        <h2 id="pend-title" class="mb-4 text-[20px] font-bold text-[#8A5A00]">Esperan revisión (${pend.cuentas.length})</h2>
        <div class="grid gap-4 xl:grid-cols-2">${pend.cuentas.map(cuentaCard).join('')}</div>
      </section>` : '';
    const conCambios = camb.cuentas.filter((c) => c.estado !== 'pendiente');
    if (conCambios.length) $('[data-pend]', box).insertAdjacentHTML('beforeend', `
      <section class="mb-10 rounded-2xl bg-[#EEF1FB] p-4 sm:p-6" aria-labelledby="camb-title">
        <h2 id="camb-title" class="mb-4 text-[20px] font-bold text-brand">Cambios de perfil para revisar (${conCambios.length})</h2>
        <div class="grid gap-4 xl:grid-cols-2">${conCambios.map(cuentaCard).join('')}</div>
      </section>`);
    if (!estado) cuentas = cuentas.filter((c) => c.estado !== 'pendiente'); // ya se muestran arriba
  }
  lista.innerHTML = cuentas.length
    ? `<p class="mb-4 text-[14px] text-ink/60">${cuentas.length} ${cuentas.length === 1 ? 'cuenta' : 'cuentas'}</p><div class="grid gap-4 xl:grid-cols-2">${cuentas.map(cuentaCard).join('')}</div>`
    : vacio(f.elements.q.value || estado ? 'No encontramos cuentas con esos filtros.' : `Todavía no hay ${cfg.titulo.toLowerCase()}.`);
}

// ---------- Feria ----------
const fmtFeria = (d) => new Date(d).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
function feriaEstado(f) {
  const now = Date.now();
  if (f.estado === 'cancelada') return ['Cancelada', 'bg-[#FDECEC] text-[#B42318]', false];
  if (new Date(f.termina).getTime() <= now) return ['Terminada', 'bg-ink/10 text-ink', false];
  if (new Date(f.empieza).getTime() <= now) return ['En curso', 'bg-[#E8F5E9] text-ok', true];
  return ['Próxima', 'bg-[#EEF1FB] text-brand', true];
}

/** Autos que las agencias sumaron a una feria, con su precio relámpago y el botón para sacarlos. */
function feriaAutos(f) {
  const lista = (feriaData.autos ?? []).filter((x) => x.feria_id === f.id);
  if (!lista.length) return `<p class="mt-3 text-[14px] text-ink/60">${icon('zap', 'inline h-4 w-4')} Todavía ninguna agencia sumó autos.</p>`;
  const ahora = Date.now();
  return `
    <details class="mt-4 rounded-xl border border-line">
      <summary class="cursor-pointer select-none px-4 py-3 text-[15px] font-bold">${icon('zap', 'inline h-4 w-4 text-[#E5484D]')} ${lista.length} ${lista.length === 1 ? 'auto sumado' : 'autos sumados'} por las agencias</summary>
      <ul class="divide-y divide-line border-t border-line">
        ${lista.map((x) => {
          const a = x.mkt_autos ?? {};
          const ini = new Date(x.empieza).getTime(), fin = new Date(x.termina).getTime();
          const est = fin <= ahora ? 'Terminó' : ini > ahora ? 'Programada' : 'Activa';
          return `
          <li class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0 text-[14px]">
              <p class="font-bold">${esc(`${a.marca ?? ''} ${a.modelo ?? ''} ${a.version ?? ''} ${a.anio ?? ''}`)} <span class="font-normal text-ink/60">· ${esc(a.mkt_cuentas?.nombre ?? '')} · ${esc(a.codigo ?? '')}</span></p>
              <p class="mt-0.5"><s class="text-ink/50">${esc(formatPrice(Number(a.precio), a.moneda))}</s> <b class="text-[#E5484D]">${esc(formatPrice(Number(x.precio_feria), a.moneda))}</b> · ${esc(fmtFeria(x.empieza))} → ${esc(fmtFeria(x.termina))} · ${esc(est)}${a.estado !== 'publicado' ? ' · no publicado' : ''}</p>
            </div>
            <button type="button" class="btn-outline h-[40px] shrink-0 !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-feria-sacar="${esc(x.auto_id)}" data-feria-de="${esc(f.id)}">${icon('x', 'h-4 w-4')} Sacar</button>
          </li>`;
        }).join('')}
      </ul>
    </details>`;
}

function feriaCard(f, aprobadas) {
  const [txt, cls, viva] = feriaEstado(f);
  const inv = f.invitacion_enviada_at
    ? `Invitación enviada el ${esc(fmtFeria(f.invitacion_enviada_at))} a ${esc(f.invitados)} ${f.invitados === 1 ? 'agencia' : 'agencias'} (campanita a todas · ${esc(f.invitados_ok)} por Telegram)`
    : `Sin invitar · ${esc(aprobadas)} ${aprobadas === 1 ? 'agencia aprobada' : 'agencias aprobadas'} para invitar`;
  return `
  <article class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 md:flex-row md:items-start md:justify-between">
    <div class="min-w-0">
      ${chip(txt, cls)}
      <h3 class="mt-3 text-[20px] font-bold leading-tight">${esc(f.nombre)}</h3>
      ${f.descripcion ? `<p class="mt-1 text-[15px] text-ink/70">${esc(f.descripcion)}</p>` : ''}
      <p class="mt-2 text-[15px]">${esc(fmtFeria(f.empieza))} → ${esc(fmtFeria(f.termina))}</p>
      <p class="mt-1 text-[13px] text-ink/60">${inv}</p>
      ${feriaAutos(f)}
    </div>
    ${viva ? `<div class="flex shrink-0 flex-wrap gap-2">
      <button type="button" class="btn-primary h-[46px] !px-5" data-feria-invitar="${esc(f.id)}">${icon('message-circle', 'h-4 w-4')} ${f.invitacion_enviada_at ? 'Volver a invitar' : 'Invitar agencias'}</button>
      <button type="button" class="btn-outline h-[46px] !border-[#F3B8B4] !px-5 !text-[#B42318] hover:!border-[#D92D20] hover:!bg-[#D92D20] hover:!text-white" data-feria-cancelar="${esc(f.id)}">Cancelar</button>
    </div>` : ''}
  </article>`;
}

let feriaData = { ferias: [], agencias_aprobadas: 0, autos: [] };
async function loadFeria() {
  const box = $('#feria-lista');
  box.innerHTML = vacio('Cargando…');
  feriaData = await admin('ferias');
  box.innerHTML = feriaData.ferias.length
    ? feriaData.ferias.map((f) => feriaCard(f, feriaData.agencias_aprobadas)).join('')
    : vacio('Todavía no creaste ninguna feria.');
}

async function crearFeria(e) {
  e.preventDefault();
  const f = e.currentTarget;
  const err = $('[data-error]', f);
  err.hidden = true;
  const fail = (m) => { $('span', err).textContent = m; err.hidden = false; };
  const nombre = f.elements.nombre.value.trim();
  const ini = f.elements.empieza.value;
  const fin = f.elements.termina.value;
  if (nombre.length < 3) return fail('Escribí el nombre de la feria.');
  if (!ini || !fin) return fail('Completá cuándo empieza y cuándo termina.');
  const empieza = new Date(ini);
  const termina = new Date(fin);
  if (termina <= empieza) return fail('La feria tiene que terminar después de empezar.');
  if (termina <= new Date()) return fail('La fecha de fin ya pasó.');
  const btnS = $('[data-submit]', f);
  btnS.disabled = true;
  try {
    await admin('crear_feria', { nombre, descripcion: f.elements.descripcion.value.trim(), empieza: empieza.toISOString(), termina: termina.toISOString() });
    f.reset();
    toast('Feria creada');
    await loadFeria();
  } catch (ex) {
    if (ex?.status === 401) return handleError(ex);
    fail(ex.message);
  } finally {
    btnS.disabled = false;
  }
}

async function invitarFeria(id) {
  const f = feriaData.ferias.find((x) => x.id === id);
  const n = feriaData.agencias_aprobadas;
  if (!n) return dialog({ title: 'No hay a quién invitar', text: 'Todavía no hay agencias aprobadas en el marketplace. Aprobá alguna en "Concesionarios" y volvé.', ok: '', cancel: 'Entendido' });
  const ok = await dialog({
    title: f?.invitacion_enviada_at ? 'Volver a invitar' : 'Invitar agencias',
    text: `Les llega a ${n} ${n === 1 ? 'agencia aprobada' : 'agencias aprobadas'} un aviso en la campanita del sitio y, a las que conectaron Telegram, un mensaje del bot con el nombre y las fechas de "${f?.nombre ?? ''}".`,
    ok: 'Enviar invitaciones',
  });
  if (!ok) return;
  try {
    const r = await admin('invitar_feria', { id });
    toast(`Invitación enviada a ${r.total} ${r.total === 1 ? 'agencia' : 'agencias'} (${r.enviados} por Telegram)`);
    await loadFeria();
  } catch (e) { handleError(e); }
}

async function cancelarFeria(id) {
  const f = feriaData.ferias.find((x) => x.id === id);
  const ok = await dialog({ title: 'Cancelar feria', text: `"${f?.nombre ?? ''}" deja de mostrarse en el sitio. No se puede reactivar: si hace falta, creá una nueva.`, ok: 'Cancelar feria', cancel: 'Volver', danger: true });
  if (!ok) return;
  try { await admin('cancelar_feria', { id }); toast('Feria cancelada'); await loadFeria(); } catch (e) { handleError(e); }
}

async function sacarDeFeria(feria, auto) {
  const x = (feriaData.autos ?? []).find((a) => a.feria_id === feria && a.auto_id === auto);
  const a = x?.mkt_autos ?? {};
  const ok = await dialog({ title: 'Sacar de la feria', text: `${a.marca ?? ''} ${a.modelo ?? ''} ${a.anio ?? ''} de ${a.mkt_cuentas?.nombre ?? 'la agencia'} deja de mostrarse en la feria y vuelve a su precio normal. La agencia puede volver a sumarlo.`, ok: 'Sacar', cancel: 'Volver', danger: true });
  if (!ok) return;
  try { await admin('quitar_auto_feria', { feria, auto }); toast('Auto sacado de la feria'); await loadFeria(); } catch (e) { handleError(e); }
}

async function loadPruebas() {
  const box = $('#v-pruebas');
  box.innerHTML = vacio('Cargando…');
  const { cuentas } = await admin('cuentas', { prueba: true });
  box.innerHTML = `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5">
      <p class="max-w-[620px] text-[15px] text-ink/75">Las cuentas marcadas como prueba no se cuentan en el resumen. Desde acá las podés borrar todas juntas (también su usuario de ingreso).</p>
      <button type="button" class="btn-primary h-[48px] !bg-[#D92D20] !px-5 hover:!bg-[#B42318]" data-borrar-pruebas ${cuentas.length ? '' : 'disabled'}>${icon('x', 'h-4 w-4')} Borrar ${cuentas.length} ${cuentas.length === 1 ? 'cuenta' : 'cuentas'} de prueba</button>
    </div>
    ${cuentas.length ? `<div class="grid gap-4 xl:grid-cols-2">${cuentas.map(cuentaCard).join('')}</div>` : vacio('No hay cuentas de prueba.')}`;
}

// ---------- Autos cargados por las agencias ----------
let autosQ = '';
async function loadAutos() {
  const box = $('#v-autos');
  if (!box.dataset.listo) {
    box.dataset.listo = '1';
    box.innerHTML = `
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[15px] text-ink/70">Autos de agencias y particulares. Los de particulares salen recién cuando los aprobás. Si pausás uno, el vendedor no puede volver a publicarlo.</p>
        <label class="relative block sm:w-[320px]"><span class="sr-only">Buscar autos</span>
          <input type="search" data-autos-q placeholder="Buscar marca, modelo, código o agencia" class="auth-input !pl-10" />
          ${icon('search', 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50')}
        </label>
      </div>
      <div data-autos-list></div>`;
    let t;
    $('[data-autos-q]', box).addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { autosQ = e.target.value; loadAutos(); }, 350); });
    box.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-auto-estado]');
      if (!b) return;
      b.disabled = true;
      try { await admin('auto_estado', { id: b.dataset.id, estado: b.dataset.autoEstado }); await loadAutos(); } catch (err) { b.disabled = false; handleError(err); }
    });
  }
  const list = $('[data-autos-list]', box);
  const { autos } = await admin('autos', { q: autosQ });
  if (!autos.length) { list.innerHTML = `<p class="rounded-2xl bg-soft px-5 py-8 text-center text-ink/60">${autosQ ? 'No hay autos con esa búsqueda.' : 'Todavía no hay autos cargados.'}</p>`; return; }
  list.innerHTML = `<p class="mb-3 text-[14px] text-ink/60">${autos.length} ${autos.length === 1 ? 'auto' : 'autos'}</p><ul class="grid gap-3">${autos.map((a) => {
    if (a.estado === 'revision') return autoRevision(a);
    const foto = fotoUrl(a.fotos?.[0] ?? '');
    const pausado = a.estado !== 'publicado';
    return `
    <li class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
      <div class="flex min-w-0 flex-1 items-center gap-4">
        ${foto ? `<img src="${esc(foto)}" alt="" width="96" height="72" loading="lazy" class="h-[64px] w-[86px] shrink-0 rounded-lg object-cover ${pausado ? 'opacity-50 grayscale' : ''}" />` : '<span class="h-[64px] w-[86px] shrink-0 rounded-lg bg-soft"></span>'}
        <div class="min-w-0">
          <p class="truncate font-bold">${esc(`${a.marca} ${a.modelo} ${a.version} ${a.anio}`)}</p>
          <p class="text-[14px] text-ink/70">${esc(formatPrice(Number(a.precio), a.moneda))} · ${esc(a.cuenta?.nombre ?? '')} · ${esc(a.codigo)}${a.cuenta?.es_prueba ? ' · <b>prueba</b>' : ''}</p>
          <p class="text-[13px] ${pausado ? 'text-[#8A5A00]' : 'text-ok'}">${a.estado === 'vendido' ? 'Vendido' : pausado ? (a.pausado_por_admin ? 'Pausado por vos' : `Pausado por ${a.cuenta?.tipo === 'particular' ? 'el particular' : 'la agencia'}`) : 'Publicado'}${a.cuenta?.tipo === 'particular' ? ' · Particular' : ''} · ${esc(fmtFecha(a.created_at))}</p>
        </div>
      </div>
      <div class="flex shrink-0 gap-2">
        ${pausado ? '' : `<a href="./auto.html?id=${encodeURIComponent(a.id)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[40px] !px-4 text-[14px]">${icon('eye', 'h-4 w-4')} Ver</a>`}
        ${a.estado === 'vendido' ? '' : `<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-auto-estado="${pausado ? 'publicado' : 'pausado'}" data-id="${esc(a.id)}">${pausado ? 'Volver a publicar' : 'Pausar'}</button>`}
      </div>
    </li>`;
  }).join('')}</ul>`;
}

/** Patente + cédula (privada, link de 10 min) para comparar con el aviso. Se borra sola al aprobar o rechazar. */
function cedulaRevision(a) {
  const pat = a.dominio ? `<b class="rounded-md border border-ink/20 bg-white px-2 py-0.5 font-mono tracking-[0.1em]">${esc(a.dominio)}</b>` : '<span class="text-ink/60">sin patente</span>';
  const rep = (a.patente_repetida ?? []).length
    ? `<p class="mt-2 rounded-lg bg-[#FDECEC] px-3 py-2 text-[13px] text-[#B42318]">⚠ Esta patente también está en: ${a.patente_repetida.map(esc).join(' · ')}</p>` : '';
  const ced = a.cedula_url
    ? `<a href="${esc(a.cedula_url)}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block"><img src="${esc(a.cedula_url)}" alt="Cédula del auto" class="max-h-[200px] rounded-lg border border-line" /></a>
       <p class="text-[12px] text-ink/60">Compará marca, modelo, año y patente con el aviso. La cédula se borra sola al aprobar o rechazar.</p>`
    : a.cedula_verificada_at ? `<p class="mt-1 text-[13px] text-ok">✓ Cédula verificada el ${esc(fmtFecha(a.cedula_verificada_at))} (cambio de datos, misma patente)</p>`
    : '<p class="mt-1 text-[13px] text-[#B42318]">Sin cédula</p>';
  return `<div class="mt-3 rounded-xl border border-line bg-white p-3"><p class="text-[14px]">Patente: ${pat}</p>${rep}${ced}</div>`;
}

/** Auto de un particular esperando revisión: se ve todo (fotos y datos) para aprobarlo o rechazarlo. */
function autoRevision(a) {
  const fotos = (a.fotos ?? []).map((f) => fotoUrl(f)).filter(Boolean);
  const tel = String(a.cuenta?.telefono ?? '').replace(/\D/g, '');
  return `
    <li class="rounded-2xl border-2 border-[#F5C26B] bg-[#FFFBF2] p-4 sm:p-5">
      <p class="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8A5A00]">En revisión · Particular · ${esc(fmtFecha(a.updated_at ?? a.created_at))}</p>
      <p class="mt-1 text-[18px] font-bold">${esc(`${a.marca} ${a.modelo} ${a.version} ${a.anio}`)}</p>
      <p class="text-[14px] text-ink/75">${esc(formatPrice(Number(a.precio), a.moneda))} · ${esc(Number(a.km).toLocaleString('es-AR'))} km · ${esc(a.combustible)} · ${esc(a.transmision)} · ${esc(`${a.ciudad}, ${a.provincia}`)}</p>
      <p class="text-[14px] text-ink/75">${esc(a.cuenta?.nombre ?? '')}${tel ? ` · <a class="text-brand underline" href="https://wa.me/${esc(tel)}" target="_blank" rel="noopener noreferrer">WhatsApp ${esc(tel)}</a>` : ''}</p>
      ${a.descripcion ? `<p class="mt-2 whitespace-pre-line text-[14px]">${esc(a.descripcion)}</p>` : ''}
      ${cedulaRevision(a)}
      ${fotos.length ? `<div class="mt-3 flex gap-2 overflow-x-auto pb-1">${fotos.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="shrink-0"><img src="${esc(u)}" alt="" width="160" height="120" loading="lazy" class="h-[90px] w-[120px] rounded-lg object-cover sm:h-[120px] sm:w-[160px]" /></a>`).join('')}</div>` : ''}
      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class="btn-primary h-[44px] !px-5 text-[14px]" data-auto-estado="publicado" data-id="${esc(a.id)}">${icon('circle-check', 'h-4 w-4')} Aprobar y publicar</button>
        <button type="button" class="btn-outline h-[44px] !px-5 text-[14px]" data-auto-estado="pausado" data-id="${esc(a.id)}">${icon('x', 'h-4 w-4')} Rechazar</button>
      </div>
    </li>`;
}

const LOADERS = {
  resumen: loadResumen,
  particulares: () => loadList('particulares'),
  concesionarios: () => loadList('concesionarios'),
  vendedores: () => loadList('vendedores'),
  feria: loadFeria,
  autos: () => loadAutos(),
  buscados: () => renderRanking($('#v-buscados'), sb),
  estadisticas: () => renderEstadisticas($('#v-estadisticas'), sb),
  planes: () => renderPlanes($('#v-planes'), (accion, extra = {}) => call('mkt-planes', { accion, ...extra }), { toast, handleError, dialog, sb }),
  partners: () => renderPartners($('#v-partners'), (accion, extra = {}) => call('mkt-partners', { accion, ...extra }), { toast, handleError, dialog, sb }),
  pruebas: loadPruebas,
};
let actual = 'resumen';
const reload = async (tab = actual) => {
  try { await LOADERS[tab](); } catch (e) { handleError(e); }
};

// ---------- Acciones sobre cuentas ----------
const OPS = {
  aprobar: { title: 'Aprobar cuenta', text: 'Una agencia va a poder publicar su stock; un vendedor independiente, ver las comisiones y usar su link. Avisale por WhatsApp que ya está habilitada.', ok: 'Aprobar' },
  rechazar: { title: 'Rechazar cuenta', text: 'No va a poder ingresar. Podés volver a aprobarla más adelante.', ok: 'Rechazar', danger: true },
  suspender: { title: 'Suspender cuenta', text: 'La cuenta no va a poder ingresar y su sesión abierta se corta. Podés reactivarla cuando quieras.', ok: 'Suspender', danger: true },
  reactivar: { title: 'Reactivar cuenta', text: 'La cuenta vuelve a poder ingresar.', ok: 'Reactivar' },
  desbloquear: { title: 'Desbloquear', text: 'Se borran los intentos fallidos de PIN y puede volver a probar ya.', ok: 'Desbloquear' },
  reset_pin: { title: 'Crear un PIN nuevo', text: 'Se genera un PIN temporal de 6 números y el anterior deja de funcionar. Lo vas a ver una sola vez para mandárselo por WhatsApp.', ok: 'Crear PIN nuevo' },
  aprobar_cambios: { title: 'Aprobar cambios de perfil', text: 'Los datos nuevos (nombre, CUIT o tipo) se publican enseguida.', ok: 'Aprobar cambios' },
  rechazar_cambios: { title: 'Rechazar cambios de perfil', text: 'Se descartan los datos nuevos y quedan los de antes. Avisale a la agencia por WhatsApp.', ok: 'Rechazar cambios', danger: true },
  prueba: { title: 'Cuenta de prueba', text: 'Cambia si esta cuenta se marca como de prueba (no se cuenta en el resumen y se puede borrar desde "Pruebas").', ok: 'Cambiar' },
};

async function runOp(op, id, card) {
  const meta = OPS[op];
  if (!meta || !(await dialog(meta))) return;
  try {
    const r = await admin('cuenta', { id, op });
    if (r.pin_temporal) {
      const tel = r.cuenta.telefono;
      const msg = `Hola ${r.cuenta.nombre.split(' ')[0]}, te creamos un PIN nuevo para entrar a Red de Autos: ${r.pin_temporal}. Ingresá con tu celular y este PIN.`;
      await dialog({
        title: 'PIN nuevo creado',
        text: `Mandale este PIN a ${r.cuenta.nombre}. No lo vas a poder ver de nuevo.`,
        ok: '',
        cancel: 'Listo',
        extra: `
          <p class="mt-5 rounded-2xl bg-soft py-5 text-center text-[34px] font-bold tracking-[0.3em]">${esc(r.pin_temporal)}</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" class="btn-outline h-[48px] justify-center" data-copy="${esc(r.pin_temporal)}">${icon('clipboard-check', 'h-4 w-4')} Copiar PIN</button>
            <a href="https://wa.me/${esc(tel)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px]">${icon('whatsapp', 'h-4 w-4')} Enviar por WhatsApp</a>
          </div>`,
        onOpen: (d) => {
          $('[data-copy]', d)?.addEventListener('click', async (e) => {
            try { await navigator.clipboard.writeText(e.currentTarget.dataset.copy); toast('PIN copiado'); } catch { toast('No se pudo copiar', false); }
          });
        },
      });
    } else {
      toast('Listo, cambio guardado');
    }
    await Promise.all([loadResumen(), actual !== 'resumen' ? LOADERS[actual]() : null]);
  } catch (e) {
    handleError(e);
  }
}

async function borrarPruebas() {
  const ok = await dialog({
    title: 'Borrar cuentas de prueba',
    text: 'Se borran para siempre todas las cuentas marcadas como prueba y sus usuarios de ingreso. No se puede deshacer.\n\nEscribí BORRAR para confirmar.',
    ok: 'Borrar para siempre',
    danger: true,
    extra: '<label for="dlg-confirm" class="sr-only">Escribí BORRAR</label><input id="dlg-confirm" class="auth-input mt-4 uppercase" autocomplete="off" placeholder="BORRAR" />',
    onOpen: (d, okBtn) => {
      okBtn.disabled = true;
      const i = $('#dlg-confirm', d);
      i.addEventListener('input', () => { okBtn.disabled = i.value.trim().toUpperCase() !== 'BORRAR'; });
      setTimeout(() => i.focus(), 50);
    },
  });
  if (!ok) return;
  try {
    const r = await admin('borrar_pruebas', { confirmar: 'BORRAR' });
    toast(`Se borraron ${r.borradas} ${r.borradas === 1 ? 'cuenta' : 'cuentas'} de prueba`);
    await Promise.all([loadResumen(), loadPruebas()]);
  } catch (e) {
    handleError(e);
  }
}

// ---------- Sesión ----------
function showLogin(msg) {
  $('#adm-loading').hidden = true;
  $('#adm-panel').hidden = true;
  $('#adm-logout').hidden = true;
  $('#adm-login').hidden = false;
  if (msg) {
    const box = $('[data-error]', $('#adm-login'));
    $('span', box).textContent = msg;
    box.hidden = false;
  }
  setTimeout(() => $('#adm-tel').focus(), 50);
}

async function showPanel() {
  $('#adm-loading').hidden = false;
  $('#adm-login').hidden = true;
  await loadResumen();
  $('#adm-loading').hidden = true;
  $('#adm-panel').hidden = false;
  $('#adm-logout').hidden = false;
}

function handleError(e) {
  if (e?.status === 401) { sb.auth.signOut().finally(() => showLogin('Tu sesión venció. Volvé a ingresar.')); return; }
  toast(e?.message || 'Algo salió mal', false);
}

export async function initAdmin() {
  // Pestañas
  initTabs($('#adm-tabs'), (tab) => {
    actual = tab.dataset.tab;
    $$('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== `v-${actual}`; });
    reload(actual);
  });
  const goTab = (name) => $(`#t-${name}`).click();
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) goTab(go.dataset.go);
    const b = e.target.closest('[data-op]');
    if (b) runOp(b.dataset.op, b.dataset.id, b.closest('[data-card]'));
    if (e.target.closest('[data-borrar-pruebas]')) borrarPruebas();
  });

  // Feria
  $('#feria-form').addEventListener('submit', crearFeria);
  document.addEventListener('click', (e) => {
    const inv = e.target.closest('[data-feria-invitar]');
    if (inv) invitarFeria(inv.dataset.feriaInvitar);
    const can = e.target.closest('[data-feria-cancelar]');
    if (can) cancelarFeria(can.dataset.feriaCancelar);
    const sac = e.target.closest('[data-feria-sacar]');
    if (sac) sacarDeFeria(sac.dataset.feriaDe, sac.dataset.feriaSacar);
  });
  $('#adm-refresh').addEventListener('click', () => Promise.all([reload('resumen'), actual !== 'resumen' ? reload(actual) : null]).then(() => toast('Actualizado')));

  // Mostrar contraseña
  $('[data-toggle-pw]').addEventListener('click', (e) => {
    const i = $('#adm-clave');
    const show = i.type === 'password';
    i.type = show ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-pressed', String(show));
    e.currentTarget.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  // Ingreso
  const lf = $('#adm-login-form');
  lf.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('[data-error]', lf);
    err.hidden = true;
    const telefono = lf.elements.telefono.value;
    const clave = lf.elements.clave.value;
    if (telefono.replace(/\D/g, '').length < 10 || !clave) {
      $('span', err).textContent = 'Completá el celular y la contraseña.';
      err.hidden = false;
      return;
    }
    const sbm = $('[data-submit]', lf);
    sbm.disabled = true;
    $('svg.i-loader-circle', sbm).classList.remove('hidden');
    try {
      const r = await call('admin', { accion: 'login', telefono, clave }, false);
      const { error } = await sb.auth.verifyOtp({ email: r.email, token: r.otp, type: 'email' });
      if (error) throw new Error('No pudimos iniciar la sesión.');
      lf.reset();
      await showPanel();
    } catch (ex) {
      $('span', err).textContent = ex.message;
      err.hidden = false;
    } finally {
      sbm.disabled = false;
      $('svg.i-loader-circle', sbm).classList.add('hidden');
    }
  });

  $('#adm-logout').addEventListener('click', async () => {
    await sb.auth.signOut();
    showLogin();
  });

  // ¿Ya hay sesión de admin?
  const { data } = await sb.auth.getSession();
  if (!data.session) return showLogin();
  try { await showPanel(); } catch (e) { e?.status === 401 ? showLogin() : handleError(e); }
}
