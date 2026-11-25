// Cuentas del marketplace: ventana Ingresar / Crear cuenta, sesión y menú de usuario.
// supabase-js se carga solo cuando hace falta (al abrir la ventana o si ya hay sesión guardada).
import { $, $$ } from './dom.js';
import { SITE } from '../data/site.js';

const FN_URL = `${SITE.supabase.url}/functions/v1/mkt-cuenta`;
const STORAGE_KEY = 'rda-mkt-auth';
const PROFILE_KEY = 'rda-mkt-cuenta';

// ---------- Utilidades ----------
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* sin almacenamiento */ } },
};
const digits = (v) => String(v ?? '').replace(/\D/g, '');
/** Celular argentino sin 0 ni 15: 10 dígitos (código de área + número). */
function phoneOk(v) {
  let d = digits(v);
  if (d.startsWith('54')) d = d.slice(2);
  if (d.startsWith('9')) d = d.slice(1);
  if (d.startsWith('0')) d = d.slice(1);
  return d.length === 10 || (d.length === 12 && /15/.test(d.slice(2, 6)));
}
function cuitOk(c) {
  if (!/^\d{11}$/.test(c)) return false;
  const m = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let v = 11 - (m.reduce((a, f, i) => a + f * Number(c[i]), 0) % 11);
  if (v === 11) v = 0;
  return v !== 10 && v === Number(c[10]);
}
const pinWeak = (p) => /^(\d)\1{5}$/.test(p) || ['123456', '654321', '012345', '123123', '121212', '112233'].includes(p);

let supabasePromise = null;
// ---------- Campanita: pedidos nuevos de la Red de colegas (solo agencias aprobadas) ----------
let ultimaConsulta = 0;
async function pintarCampanita(cuenta) {
  const links = $$('[data-campanita]');
  const ok = cuenta?.tipo === 'agencia' && cuenta.estado === 'aprobada';
  links.forEach((a) => { a.hidden = !ok; });
  if (!ok || !links.length || Date.now() - ultimaConsulta < 5000) return;
  ultimaConsulta = Date.now();
  try {
    const { colegasApi } = await import('./autosApi.js');
    const { sin_leer: n } = await colegasApi('notifs');
    links.forEach((a) => {
      const badge = $('[data-campanita-n]', a);
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.hidden = !n;
      a.classList.toggle('tiene-nuevos', n > 0);
      a.setAttribute('aria-label', n ? `Red de colegas: ${n} ${n === 1 ? 'pedido nuevo' : 'pedidos nuevos'}` : 'Red de colegas');
    });
  } catch { /* sin aviso si falla */ }
}
/** Vuelve a consultar la campanita (por ejemplo, después de leer los pedidos). */
export const refrescarCampanita = () => { ultimaConsulta = 0; pintarCampanita(cuentaGuardada()); };

export function supa() {
  supabasePromise ||= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SITE.supabase.url, SITE.supabase.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: STORAGE_KEY },
    }));
  return supabasePromise;
}

async function callFn(body, accessToken) {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SITE.supabase.publishableKey,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  let data = {};
  try { data = await res.json(); } catch { /* respuesta vacía */ }
  if (!res.ok) throw new Error(data.error || 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.');
  return data;
}

// ---------- Header: botón Ingresar / menú de usuario ----------
function paintHeader(cuenta) {
  window.dispatchEvent(new CustomEvent('rda:cuenta', { detail: cuenta }));
  pintarCampanita(cuenta);
  $$('[data-auth-open]').forEach((b) => {
    const label = $('[data-auth-label]', b);
    if (label) label.textContent = cuenta ? `Hola, ${cuenta.nombre.split(' ')[0]}` : 'Ingresar';
    b.setAttribute('aria-haspopup', cuenta ? 'menu' : 'dialog');
  });
  const menu = $('#user-menu');
  if (!menu) return;
  if (cuenta) {
    $('[data-user-name]', menu).textContent = cuenta.nombre;
    $('[data-user-type]', menu).textContent = cuenta.tipo === 'agencia'
      ? (cuenta.agencia_tipo === 'oficial' ? `Concesionario oficial${cuenta.marca_oficial ? ` ${cuenta.marca_oficial}` : ''}` : 'Agencia multimarca')
      : 'Particular';
    const pend = $('[data-user-pending]', menu);
    pend.hidden = cuenta.estado !== 'pendiente';
  }
}

/** Cuenta guardada en este navegador (se confirma con el servidor al cargar). */
export const cuentaGuardada = () => store.get(PROFILE_KEY);

export function initAuth() {
  const modal = $('#auth');
  if (!modal) return;
  const userMenu = $('#user-menu');
  let cuenta = store.get(PROFILE_KEY);
  paintHeader(cuenta);

  // Si hay sesión guardada, confirmarla con el servidor (y refrescar los datos)
  if (cuenta || localStorage.getItem(STORAGE_KEY)) {
    supa().then(async (sb) => {
      const { data } = await sb.auth.getSession();
      if (!data.session) { cuenta = null; store.del(PROFILE_KEY); paintHeader(null); return; }
      try {
        const r = await callFn({ accion: 'perfil' }, data.session.access_token);
        cuenta = r.cuenta; store.set(PROFILE_KEY, cuenta); paintHeader(cuenta);
      } catch {
        await sb.auth.signOut();
        cuenta = null; store.del(PROFILE_KEY); paintHeader(null);
      }
    }).catch(() => {});
  }

  // ----- Abrir / cerrar ventana -----
  let lastFocus = null;
  const open = (view = 'login') => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.documentElement.classList.add('overflow-hidden');
    show(view);
    supa(); // precarga
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('overflow-hidden');
    setTimeout(() => { modal.hidden = true; }, 250);
    lastFocus?.focus?.();
  };

  const toggleUserMenu = (force) => {
    const show = force ?? userMenu.hidden;
    userMenu.hidden = !show;
    $$('[data-auth-open]').forEach((b) => b.setAttribute('aria-expanded', String(show)));
  };

  // Otras pantallas pueden pedir que se abra el ingreso (ej.: crear una alerta sin estar logueado)
  window.addEventListener('rda:abrir-ingreso', () => { if (!cuenta) open('login'); });

  $$('[data-auth-open]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    if (cuenta && userMenu) {
      // en el menú lateral el botón va dentro del panel: cerrarlo primero
      if (b.closest('#drawer')) $('#menu-close')?.click();
      const r = b.getBoundingClientRect();
      userMenu.style.top = `${r.bottom + 8 + window.scrollY}px`;
      userMenu.style.right = `${Math.max(16, window.innerWidth - r.right)}px`;
      toggleUserMenu();
      return;
    }
    if (b.closest('#drawer')) $('#menu-close')?.click();
    open(b.dataset.authOpen === 'registro' ? 'tipo' : 'login');
  }));
  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.hidden && !e.target.closest('#user-menu, [data-auth-open]')) toggleUserMenu(false);
  });

  $$('[data-auth-close]', modal).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modal.hidden) close();
      if (userMenu && !userMenu.hidden) toggleUserMenu(false);
    }
    if (e.key === 'Tab' && !modal.hidden) { // foco atrapado dentro de la ventana
      const f = $$('button, input, select, a, summary', modal).filter((el) => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ----- Vistas -----
  const title = $('#auth-title');
  const sub = $('[data-auth-sub]', modal);
  const tabs = $('[data-auth-tabs]', modal);
  const back = $('[data-auth-back]', modal);
  const logo = $('[data-auth-logo]', modal);
  const regForm = $('form[data-view="registro"]', modal);
  const loginForm = $('form[data-view="login"]', modal);
  const TEXTS = {
    login: ['Ingresá a tu cuenta', 'Publicá, editá y seguí tus autos.'],
    tipo: ['Creá tu cuenta', 'Es gratis y te lleva un minuto.'],
    registro: ['Creá tu cuenta', ''],
    listo: ['', ''],
  };

  function show(view) {
    $$('.auth-view', modal).forEach((v) => { v.hidden = v.dataset.view !== view; });
    const [t, s] = TEXTS[view];
    title.textContent = t || '¡Bienvenido!';
    title.hidden = view === 'listo';
    sub.textContent = view === 'registro'
      ? (regForm.elements.tipo.value === 'agencia' ? 'Datos de tu agencia o concesionario.' : 'Tus datos para publicar.')
      : s;
    sub.hidden = view === 'listo';
    tabs.hidden = view === 'registro' || view === 'listo';
    back.hidden = view !== 'registro';
    logo.classList.toggle('pl-3', view === 'registro');
    $$('[data-auth-tab]', tabs).forEach((b) => {
      const on = (b.dataset.authTab === 'login') === (view === 'login');
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $$('[data-auth-error]', modal).forEach((e) => { e.hidden = true; });
    const first = $(`.auth-view[data-view="${view}"] input:not([type=hidden]):not([tabindex="-1"]), .auth-view[data-view="${view}"] button`, modal);
    setTimeout(() => first?.focus(), 60);
  }

  $$('[data-auth-tab]', tabs).forEach((b) => b.addEventListener('click', () => show(b.dataset.authTab === 'login' ? 'login' : 'tipo')));
  back.addEventListener('click', () => show('tipo'));

  // Mostrar / ocultar PIN
  $$('[data-toggle-pin]', modal).forEach((b) => b.addEventListener('click', () => {
    const input = $(`#${b.dataset.togglePin}`, modal);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    b.setAttribute('aria-pressed', String(visible));
    b.setAttribute('aria-label', visible ? 'Ocultar PIN' : 'Mostrar PIN');
    b.classList.toggle('text-brand', visible);
  }));
  // Solo números en PIN y CUIT
  $$('input[inputmode="numeric"]', modal).forEach((i) => i.addEventListener('input', () => {
    const max = i.name === 'cuit' ? 11 : 6;
    i.value = digits(i.value).slice(0, max);
  }));

  // Elegir tipo de cuenta
  $$('[data-pick-type]', modal).forEach((b) => b.addEventListener('click', () => {
    const tipo = b.dataset.pickType;
    regForm.reset();
    regForm.elements.tipo.value = tipo;
    const isAg = tipo === 'agencia';
    $$('[data-only="agencia"]', regForm).forEach((el) => { el.hidden = !isAg; el.disabled = !isAg; });
    $('[data-only="oficial"]', regForm).hidden = true;
    $('label[for="reg-nombre"]', regForm).textContent = isAg ? 'Nombre comercial' : 'Nombre y apellido';
    regForm.elements.nombre.placeholder = isAg ? 'Ej: Norte Automotores' : 'Juan Pérez';
    regForm.elements.nombre.autocomplete = isAg ? 'organization' : 'name';
    $('label[for="reg-provincia"]', regForm).textContent = isAg ? 'Provincia' : 'Provincia (opcional)';
    $('label[for="reg-ciudad"]', regForm).textContent = isAg ? 'Ciudad' : 'Ciudad (opcional)';
    show('registro');
  }));
  regForm.addEventListener('change', (e) => {
    if (e.target.name === 'agencia_tipo') $('[data-only="oficial"]', regForm).hidden = e.target.value !== 'oficial';
  });

  // ----- Envío -----
  const busy = (form, on) => {
    const btn = $('[data-auth-submit]', form);
    btn.disabled = on;
    $('svg.i-loader-circle', btn).classList.toggle('hidden', !on);
    $('[data-label]', btn).classList.toggle('opacity-60', on);
  };
  const fail = (form, msg, field) => {
    const box = $('[data-auth-error]', form);
    $('span', box).textContent = msg;
    box.hidden = false;
    if (field) { form.elements[field]?.focus?.(); form.elements[field]?.setAttribute?.('aria-invalid', 'true'); }
  };

  async function startSession(r) {
    const sb = await supa();
    const { error } = await sb.auth.verifyOtp({ email: r.email, token: r.otp, type: 'email' });
    if (error) throw new Error('No pudimos iniciar la sesión. Probá de nuevo.');
    cuenta = r.cuenta;
    store.set(PROFILE_KEY, cuenta);
    paintHeader(cuenta);
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    $$('[aria-invalid]', loginForm).forEach((i) => i.removeAttribute('aria-invalid'));
    const tel = loginForm.elements.telefono.value;
    const pin = loginForm.elements.pin.value;
    if (!phoneOk(tel)) return fail(loginForm, 'Revisá el celular: código de área + número, sin 0 ni 15.', 'telefono');
    if (!/^\d{6}$/.test(pin)) return fail(loginForm, 'El PIN tiene 6 números.', 'pin');
    busy(loginForm, true);
    try {
      const r = await callFn({ accion: 'ingresar', telefono: tel, pin });
      await startSession(r);
      loginForm.reset();
      $('[data-listo-title]', modal).textContent = `¡Hola, ${cuenta.nombre.split(' ')[0]}!`;
      $('[data-listo-text]', modal).textContent = cuenta.estado === 'pendiente'
        ? 'Ingresaste. Tu agencia todavía está en revisión: la habilitamos apenas verifiquemos los datos.'
        : 'Ingresaste a tu cuenta.';
      show('listo');
    } catch (err) {
      fail(loginForm, err.message);
    } finally {
      busy(loginForm, false);
    }
  });

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    $$('[aria-invalid]', regForm).forEach((i) => i.removeAttribute('aria-invalid'));
    const f = regForm.elements;
    const tipo = f.tipo.value;
    const isAg = tipo === 'agencia';
    const body = {
      accion: 'registrar', tipo,
      nombre: f.nombre.value.trim(), telefono: f.telefono.value, pin: f.pin.value,
      provincia: f.provincia.value, ciudad: f.ciudad.value.trim(),
      acepto: f.acepto.checked, sitio_web: f.sitio_web.value,
    };
    if (isAg) {
      const at = regForm.querySelector('input[name="agencia_tipo"]:checked')?.value;
      if (!at) return fail(regForm, 'Elegí si es concesionario oficial o agencia multimarca.');
      if (at === 'oficial' && !f.marca_oficial.value) return fail(regForm, 'Elegí la marca que representa.', 'marca_oficial');
      if (!cuitOk(digits(f.cuit.value))) return fail(regForm, 'Revisá el CUIT: 11 números y válido.', 'cuit');
      Object.assign(body, { agencia_tipo: at, marca_oficial: f.marca_oficial.value, cuit: digits(f.cuit.value) });
    }
    if (body.nombre.length < 2) return fail(regForm, isAg ? 'Escribí el nombre comercial.' : 'Escribí tu nombre.', 'nombre');
    if (isAg && !body.provincia) return fail(regForm, 'Elegí la provincia.', 'provincia');
    if (isAg && body.ciudad.length < 2) return fail(regForm, 'Escribí la ciudad.', 'ciudad');
    if (!phoneOk(body.telefono)) return fail(regForm, 'Revisá el celular: código de área + número, sin 0 ni 15.', 'telefono');
    if (!/^\d{6}$/.test(body.pin)) return fail(regForm, 'El PIN tiene que tener 6 números.', 'pin');
    if (pinWeak(body.pin)) return fail(regForm, 'Elegí un PIN más difícil de adivinar (no 123456 ni números repetidos).', 'pin');
    if (body.pin !== f.pin2.value) return fail(regForm, 'Los dos PIN no coinciden.', 'pin2');
    if (!body.acepto) return fail(regForm, 'Tenés que aceptar los términos y condiciones.', 'acepto');

    busy(regForm, true);
    try {
      const r = await callFn(body);
      await startSession(r);
      regForm.reset();
      $('[data-listo-title]', modal).textContent = isAg ? '¡Recibimos tu agencia!' : `¡Bienvenido, ${cuenta.nombre.split(' ')[0]}!`;
      $('[data-listo-text]', modal).textContent = isAg
        ? 'Tu cuenta quedó creada. Revisamos los datos de la agencia antes de habilitar la publicación de tu stock.'
        : 'Tu cuenta quedó creada. Ya podés publicar tu auto o moto.';
      show('listo');
    } catch (err) {
      fail(regForm, err.message);
    } finally {
      busy(regForm, false);
    }
  });

  // ----- Cerrar sesión -----
  $('[data-logout]', userMenu)?.addEventListener('click', async () => {
    toggleUserMenu(false);
    try { const sb = await supa(); await sb.auth.signOut(); } catch { /* igual se borra localmente */ }
    store.del(PROFILE_KEY);
    store.del(STORAGE_KEY);
    cuenta = null;
    paintHeader(null);
  });
}
