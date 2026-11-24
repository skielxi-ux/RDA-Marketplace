// Panel del administrador del marketplace (admin.html).
// Ingreso con la misma contraseña del admin de la web actual (función "admin"); los datos salen de "mkt-admin".
import { createClient } from '@supabase/supabase-js';
import { $, $$, initTabs } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';

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
    : 'Particular';
  const acciones = [];
  if (c.estado === 'pendiente') acciones.push(btn('aprobar', c.id, 'Aprobar', 'circle-check', 'btn-primary'), btn('rechazar', c.id, 'Rechazar', 'x'));
  else if (c.estado === 'rechazada') acciones.push(btn('aprobar', c.id, 'Aprobar', 'circle-check', 'btn-primary'));
  else if (c.estado === 'suspendida') acciones.push(btn('reactivar', c.id, 'Reactivar', 'rotate-ccw', 'btn-primary'));
  else acciones.push(btn('suspender', c.id, 'Suspender', 'lock'));
  if (c.bloqueada) acciones.push(btn('desbloquear', c.id, 'Desbloquear', 'lock'));
  acciones.push(btn('reset_pin', c.id, 'Nuevo PIN', 'rotate-ccw'));
  acciones.push(btn('prueba', c.id, c.es_prueba ? 'No es prueba' : 'Marcar prueba', 'tag'));

  return `
  <article class="rounded-2xl border border-line bg-white p-5 sm:p-6" data-card="${esc(c.id)}">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="flex flex-wrap items-center gap-2 text-[18px] font-bold leading-tight">
          ${icon(c.tipo === 'agencia' ? 'store' : 'user', 'h-5 w-5 text-brand')} <span class="break-words">${esc(c.nombre)}</span>
        </p>
        <p class="mt-1 text-[14px] text-ink/70">${esc(tipo)}</p>
      </div>
      <div class="flex flex-wrap gap-2">${chip(estTxt, estCls)}${c.es_prueba ? chip('Prueba', 'bg-ink/10 text-ink') : ''}${c.bloqueada ? chip('Bloqueada 15 min', 'bg-[#FDECEC] text-[#B42318]') : ''}</div>
    </div>
    <dl class="mt-4 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
      <div class="flex gap-2"><dt class="text-ink/60">WhatsApp</dt><dd><a href="https://wa.me/${esc(c.telefono)}" target="_blank" rel="noopener noreferrer" class="font-medium text-brand underline-offset-4 hover:underline">${esc(fmtTel(c.telefono))}</a></dd></div>
      ${c.cuit ? `<div class="flex gap-2"><dt class="text-ink/60">CUIT</dt><dd class="font-medium">${esc(fmtCuit(c.cuit))}</dd></div>` : ''}
      ${c.ciudad || c.provincia ? `<div class="flex gap-2"><dt class="text-ink/60">Zona</dt><dd>${esc([c.ciudad, c.provincia].filter(Boolean).join(', '))}</dd></div>` : ''}
      <div class="flex gap-2"><dt class="text-ink/60">Alta</dt><dd>${esc(fmtFecha(c.created_at))}</dd></div>
      ${c.revisado_at ? `<div class="flex gap-2"><dt class="text-ink/60">Revisada</dt><dd>${esc(fmtFecha(c.revisado_at))}</dd></div>` : ''}
    </dl>
    <div class="mt-5 flex flex-wrap gap-2">${acciones.join('')}</div>
  </article>`;
}

const vacio = (texto) => `<div class="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-ink/60">${esc(texto)}</div>`;

// ---------- Vistas ----------
let resumenData = null;

function renderResumen(r) {
  const cards = [
    ['Cuentas', r.total, 'user'], ['Particulares', r.particulares, 'user'], ['Agencias', r.agencias, 'store'],
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
    ${r.pendientes ? `<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF6E5] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FFEFD1]" data-go="pendientes"><span><b>${esc(r.pendientes)}</b> ${r.pendientes === 1 ? 'agencia espera' : 'agencias esperan'} revisión</span>${icon('arrow-right', 'h-5 w-5')}</button>` : ''}
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
  const pr = $('[data-count-pruebas]');
  pr.textContent = String(r.pruebas);
  pr.hidden = !r.pruebas;
}

async function loadResumen() {
  resumenData = await admin('resumen');
  renderResumen(resumenData);
}

async function loadPendientes() {
  const box = $('#v-pendientes');
  box.innerHTML = vacio('Cargando…');
  const { cuentas } = await admin('cuentas', { tipo: 'agencia', estado: 'pendiente' });
  box.innerHTML = cuentas.length
    ? `<div class="grid gap-4 xl:grid-cols-2">${cuentas.map(cuentaCard).join('')}</div>`
    : vacio('No hay agencias esperando revisión. ¡Todo al día!');
}

async function loadCuentas() {
  const f = $('#adm-filtros');
  const box = $('#adm-lista');
  box.innerHTML = vacio('Cargando…');
  const { cuentas } = await admin('cuentas', { q: f.elements.q.value, tipo: f.elements.tipo.value, estado: f.elements.estado.value });
  box.innerHTML = cuentas.length
    ? `<p class="mb-4 text-[14px] text-ink/60">${cuentas.length} ${cuentas.length === 1 ? 'cuenta' : 'cuentas'}</p><div class="grid gap-4 xl:grid-cols-2">${cuentas.map(cuentaCard).join('')}</div>`
    : vacio('No encontramos cuentas con esos filtros.');
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

const LOADERS = { resumen: loadResumen, pendientes: loadPendientes, cuentas: loadCuentas, pruebas: loadPruebas };
let actual = 'resumen';
const reload = async (tab = actual) => {
  try { await LOADERS[tab](); } catch (e) { handleError(e); }
};

// ---------- Acciones sobre cuentas ----------
const OPS = {
  aprobar: { title: 'Aprobar agencia', text: 'La agencia va a poder publicar su stock. Avisale por WhatsApp que ya está habilitada.', ok: 'Aprobar' },
  rechazar: { title: 'Rechazar agencia', text: 'La agencia no va a poder ingresar. Podés volver a aprobarla más adelante.', ok: 'Rechazar', danger: true },
  suspender: { title: 'Suspender cuenta', text: 'La cuenta no va a poder ingresar y su sesión abierta se corta. Podés reactivarla cuando quieras.', ok: 'Suspender', danger: true },
  reactivar: { title: 'Reactivar cuenta', text: 'La cuenta vuelve a poder ingresar.', ok: 'Reactivar' },
  desbloquear: { title: 'Desbloquear', text: 'Se borran los intentos fallidos de PIN y puede volver a probar ya.', ok: 'Desbloquear' },
  reset_pin: { title: 'Crear un PIN nuevo', text: 'Se genera un PIN temporal de 6 números y el anterior deja de funcionar. Lo vas a ver una sola vez para mandárselo por WhatsApp.', ok: 'Crear PIN nuevo' },
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
            <a href="https://wa.me/${esc(tel)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[48px]">${icon('message-circle', 'h-4 w-4')} Enviar por WhatsApp</a>
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
    if (card && actual !== 'pendientes') card.outerHTML = cuentaCard(r.cuenta);
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

  // Filtros de cuentas
  const f = $('#adm-filtros');
  let t;
  f.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => reload('cuentas'), 350); });
  f.addEventListener('submit', (e) => { e.preventDefault(); reload('cuentas'); });
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
