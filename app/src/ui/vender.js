// Vendé tu auto (particulares): formulario de a un auto, hasta 7 fotos y hasta 2 autos activos.
// Cada carga o cambio queda "en revisión" hasta que lo aprueba el admin. Todo se valida acá y otra vez en mkt-autos.
import { $ } from './dom.js';
import { esc, formatPrice, formatKm } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { PROVINCIAS, MAX_FOTOS } from '../lib/carga.js';
import { comprimir, formatoFotos, fotoUrl } from '../lib/fotos.js';
import { cuentaGuardada, supa } from './auth.js';
import { autosApi } from './autosApi.js';

const MAX_ACTIVOS = 2;
const MAX_MB = 25;
const ESTADOS = {
  revision: ['En revisión', 'bg-[#FFF4E0] text-[#8A5A00]', 'Lo estamos revisando. Te avisamos acá cuando esté publicado.'],
  publicado: ['Publicado', 'bg-[#E8F5E9] text-ok', ''],
  pausado: ['Pausado', 'bg-soft text-ink/70', ''],
  vendido: ['Vendido', 'bg-[#EEF1FB] text-brand', ''],
};
const numero = (v) => Number(String(v ?? '').replace(/[.\s$]/g, '').replace(',', '.'));

export function initVender() {
  const guard = $('[data-vd-guard]');
  const app = $('[data-vd-app]');
  const form = $('[data-vd-form]');
  const errBox = $('[data-vd-error]');
  const lista = $('[data-vd-mios]');
  const ulFotos = $('[data-vd-fotos]');
  const btn = $('[data-vd-submit]');

  let mios = [];
  let editando = null;     // auto que se está editando
  let fotos = [];          // [{ file, url }] fotos nuevas elegidas
  let ocupado = false;

  $('[data-vd-provincias]').insertAdjacentHTML('beforeend', PROVINCIAS.map((p) => `<option>${esc(p)}</option>`).join(''));
  const error = (msg) => { errBox.textContent = msg || ''; errBox.classList.toggle('hidden', !msg); if (msg) errBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };

  // ---------- Acceso ----------
  const pintarAcceso = async (c) => {
    const ok = c?.tipo === 'particular' && c.estado === 'activa';
    guard.hidden = ok; app.hidden = !ok;
    $('[data-vd-login]').hidden = !!c;
    $('[data-vd-agencia]').hidden = c?.tipo !== 'agencia';
    if (c?.tipo === 'agencia') {
      $('[data-vd-guard-title]').textContent = 'Esta página es para particulares';
      $('[data-vd-guard-text]').textContent = 'Las agencias y concesionarios cargan su stock con la plantilla de Excel.';
    } else if (c && !ok) {
      $('[data-vd-guard-title]').textContent = 'Tu cuenta no está activa';
      $('[data-vd-guard-text]').textContent = 'Escribinos y lo revisamos.';
    }
    if (ok) {
      const f = form.elements;
      if (!f.ciudad.value && c.ciudad) f.ciudad.value = c.ciudad;
      if (!f.provincia.value && c.provincia && PROVINCIAS.includes(c.provincia)) f.provincia.value = c.provincia;
      await cargarMios();
    }
  };

  async function cargarMios() {
    try {
      ({ autos: mios } = await autosApi('mios'));
    } catch (e) {
      if (e.status === 401 || e.status === 403) return pintarAcceso(null);
      return error(e.message);
    }
    pintarMios();
  }

  const activos = () => mios.filter((a) => a.estado !== 'vendido').length;

  function pintarMios() {
    $('[data-vd-mios-box]').hidden = !mios.length;
    const n = activos();
    $('[data-vd-mios-sub]').textContent = `${n} de ${MAX_ACTIVOS} autos activos.`;
    const lleno = n >= MAX_ACTIVOS && !editando;
    $('[data-vd-limite]').hidden = !lleno;
    form.hidden = lleno;
    lista.innerHTML = mios.map((a) => {
      const [txt, cls, nota] = ESTADOS[a.estado] ?? ESTADOS.pausado;
      const foto = fotoUrl(a.fotos?.[0] ?? '');
      const rechazado = a.estado === 'pausado' && a.pausado_por_admin;
      return `
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row">
        ${foto ? `<img src="${esc(foto)}" alt="" width="160" height="120" loading="lazy" class="h-[120px] w-full shrink-0 rounded-xl object-cover sm:w-[160px] ${a.estado === 'publicado' ? '' : 'opacity-70'}" />` : '<span class="h-[120px] w-full shrink-0 rounded-xl bg-soft sm:w-[160px]"></span>'}
        <div class="min-w-0 flex-1">
          <span class="inline-block rounded-full px-3 py-1 text-[13px] font-bold ${cls}">${rechazado ? 'No aprobado' : txt}</span>
          <p class="mt-2 truncate text-[17px] font-bold">${esc(`${a.marca} ${a.modelo} ${a.version}`)}</p>
          <p class="text-[14px] text-ink/70">${esc(`${a.anio} · ${formatKm(a.km)} · ${formatPrice(Number(a.precio), a.moneda)}`)}</p>
          ${rechazado ? '<p class="mt-1 text-[13px] text-[#B42318]">No pudimos aprobarlo. Corregí los datos o las fotos y volvé a enviarlo, o escribinos.</p>' : nota ? `<p class="mt-1 text-[13px] text-ink/60">${esc(nota)}</p>` : ''}
          <div class="mt-3 flex flex-wrap gap-2">
            ${a.estado === 'publicado' ? `<a href="./auto.html?id=${encodeURIComponent(a.id)}" class="btn-outline h-[40px] !px-4 text-[14px]">${icon('eye', 'h-4 w-4')} Ver</a>` : ''}
            ${a.estado !== 'vendido' ? `<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-vd-editar="${esc(a.id)}">Editar</button>` : ''}
            ${a.estado === 'publicado' ? `<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-vd-estado="pausado" data-id="${esc(a.id)}">Pausar</button>` : ''}
            ${a.estado === 'pausado' && !a.pausado_por_admin ? `<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-vd-estado="publicado" data-id="${esc(a.id)}">Volver a publicar</button>` : ''}
            ${a.estado !== 'vendido' ? `<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-vd-estado="vendido" data-id="${esc(a.id)}">${icon('circle-check', 'h-4 w-4')} Lo vendí</button>` : ''}
            <button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-vd-borrar="${esc(a.id)}">${icon('x', 'h-4 w-4')} Borrar</button>
          </div>
        </div>
      </li>`;
    }).join('');
  }

  lista.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-vd-estado], [data-vd-borrar], [data-vd-editar]');
    if (!b || ocupado) return;
    if (b.dataset.vdEditar) return empezarEdicion(mios.find((a) => a.id === b.dataset.vdEditar));
    const borrar = !!b.dataset.vdBorrar;
    if (borrar && !window.confirm('¿Borrar esta publicación? No se puede deshacer.')) return;
    if (b.dataset.vdEstado === 'vendido' && !window.confirm('¿Marcamos este auto como vendido? Sale del listado.')) return;
    b.disabled = true; ocupado = true; error('');
    try {
      if (borrar) await autosApi('borrar', { id: b.dataset.vdBorrar });
      else await autosApi('estado', { id: b.dataset.id, estado: b.dataset.vdEstado });
      if (editando && editando.id === (b.dataset.vdBorrar || b.dataset.id)) limpiarForm();
      await cargarMios();
    } catch (err) { b.disabled = false; error(err.message); } finally { ocupado = false; }
  });

  // ---------- Fotos ----------
  function pintarFotos() {
    const viejas = editando && !fotos.length ? (editando.fotos ?? []).map((p) => ({ url: fotoUrl(p), vieja: true })) : [];
    const items = fotos.length ? fotos : viejas;
    ulFotos.innerHTML = items.map((f, i) => `
      <li class="relative aspect-[4/3] overflow-hidden rounded-lg bg-soft">
        <img src="${esc(f.url)}" alt="Foto ${i + 1}" class="h-full w-full object-cover" />
        ${i === 0 ? '<span class="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-bold text-white">Portada</span>' : ''}
        ${f.vieja ? '' : `
        <span class="absolute right-1 top-1 flex gap-1">
          ${i ? `<button type="button" class="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[14px] shadow" data-vd-portada="${i}" aria-label="Usar como portada">★</button>` : ''}
          <button type="button" class="grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow" data-vd-quitar="${i}" aria-label="Quitar foto">${icon('x', 'h-3.5 w-3.5')}</button>
        </span>`}
      </li>`).join('');
    $('[data-vd-drop-label]').textContent = fotos.length
      ? `${fotos.length} de ${MAX_FOTOS} fotos · tocá para sumar`
      : editando ? 'Si elegís fotos nuevas, reemplazan a las actuales' : 'Arrastrá tus fotos o tocá para elegirlas';
    $('[data-vd-drop]').classList.toggle('is-done', fotos.length > 0);
  }

  const sumarFotos = (files) => {
    error('');
    const nuevas = [...files].filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
    if (nuevas.length < files.length) error('Algunos archivos no son fotos JPG, PNG o WebP y no se sumaron.');
    const grandes = nuevas.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (grandes.length) error(`Hay fotos de más de ${MAX_MB} MB que no se sumaron.`);
    const lugar = MAX_FOTOS - fotos.length;
    const ok = nuevas.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    if (ok.length > lugar) error(`Podés subir hasta ${MAX_FOTOS} fotos. Sumamos las primeras ${Math.max(lugar, 0)}.`);
    ok.slice(0, Math.max(lugar, 0)).forEach((file) => fotos.push({ file, url: URL.createObjectURL(file) }));
    pintarFotos();
  };
  $('[data-vd-input]').addEventListener('change', (e) => { sumarFotos(e.target.files); e.target.value = ''; });
  const drop = $('[data-vd-drop]');
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); sumarFotos(e.dataTransfer.files); });
  ulFotos.addEventListener('click', (e) => {
    const q = e.target.closest('[data-vd-quitar]');
    const p = e.target.closest('[data-vd-portada]');
    if (q) { const [f] = fotos.splice(Number(q.dataset.vdQuitar), 1); URL.revokeObjectURL(f.url); }
    else if (p) { const [f] = fotos.splice(Number(p.dataset.vdPortada), 1); fotos.unshift(f); }
    else return;
    pintarFotos();
  });

  // ---------- Editar ----------
  function empezarEdicion(a) {
    if (!a) return;
    editando = a;
    const f = form.elements;
    for (const k of ['marca', 'modelo', 'version', 'anio', 'combustible', 'transmision', 'carroceria', 'color', 'motor', 'moneda', 'ciudad', 'provincia', 'descripcion']) f[k].value = a[k] ?? '';
    f.km.value = Number(a.km).toLocaleString('es-AR');
    f.precio.value = Number(a.precio).toLocaleString('es-AR');
    f.puertas.value = a.puertas ?? '';
    fotos.forEach((x) => URL.revokeObjectURL(x.url)); fotos = [];
    $('[data-vd-form-title]').textContent = 'Editar publicación';
    $('[data-vd-submit-label]').textContent = 'Guardar y enviar a revisión';
    $('[data-vd-cancelar]').hidden = false;
    pintarMios(); pintarFotos(); error('');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function limpiarForm() {
    const c = cuentaGuardada();
    form.reset();
    if (c?.ciudad) form.elements.ciudad.value = c.ciudad;
    if (c?.provincia && PROVINCIAS.includes(c.provincia)) form.elements.provincia.value = c.provincia;
    editando = null;
    fotos.forEach((x) => URL.revokeObjectURL(x.url)); fotos = [];
    $('[data-vd-form-title]').textContent = 'Publicá tu auto';
    $('[data-vd-submit-label]').textContent = 'Enviar a revisión';
    $('[data-vd-cancelar]').hidden = true;
    pintarFotos(); pintarMios();
  }
  $('[data-vd-cancelar]').addEventListener('click', limpiarForm);

  // ---------- Validar y enviar ----------
  function leerForm() {
    const f = form.elements;
    const v = (k) => f[k].value.trim();
    const anioMax = new Date().getFullYear() + 1;
    const a = {
      codigo: editando?.codigo ?? `P${Date.now().toString(36).toUpperCase()}`,
      marca: v('marca'), modelo: v('modelo'), version: v('version'),
      anio: Number(v('anio')), condicion: 'usado', km: numero(v('km')), precio: numero(v('precio')), moneda: v('moneda'),
      combustible: v('combustible'), transmision: v('transmision'), carroceria: v('carroceria'),
      puertas: v('puertas') ? Number(v('puertas')) : null, color: v('color'), motor: v('motor'),
      ciudad: v('ciudad'), provincia: v('provincia'), descripcion: v('descripcion'),
    };
    const faltan = [];
    if (!a.marca) faltan.push('marca'); if (!a.modelo) faltan.push('modelo'); if (!a.version) faltan.push('versión');
    if (!a.combustible) faltan.push('combustible'); if (!a.transmision) faltan.push('caja'); if (!a.carroceria) faltan.push('carrocería');
    if (!a.ciudad) faltan.push('ciudad'); if (!a.provincia) faltan.push('provincia');
    if (faltan.length) return { error: `Completá: ${faltan.join(', ')}.` };
    if (!Number.isInteger(a.anio) || a.anio < 1950 || a.anio > anioMax) return { error: `El año tiene que estar entre 1950 y ${anioMax}.` };
    if (!Number.isInteger(a.km) || a.km < 0 || a.km > 2000000) return { error: 'Revisá los kilómetros (solo números, ej.: 85000).' };
    if (!Number.isFinite(a.precio) || a.precio <= 0 || a.precio >= 1e11) return { error: 'Revisá el precio (solo números, ej.: 14500000).' };
    if (!editando && !fotos.length) return { error: 'Subí al menos una foto.' };
    return { auto: a };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (ocupado) return;
    const r = leerForm();
    if (r.error) return error(r.error);
    ocupado = true; btn.disabled = true; error('');
    const label = $('[data-vd-submit-label]');
    const textoOriginal = label.textContent;
    try {
      let rutas = [];
      if (fotos.length) {
        const sb = await supa();
        const formato = await formatoFotos();
        label.textContent = 'Preparando fotos…';
        const blobs = [];
        for (const f of fotos) blobs.push(await comprimir(f.file, formato));
        const { urls } = await autosApi('urls_fotos', { cantidad: blobs.length, formato });
        for (const [i, blob] of blobs.entries()) {
          label.textContent = `Subiendo fotos ${i + 1} de ${blobs.length}…`;
          const { error: up } = await sb.storage.from('mkt-fotos').uploadToSignedUrl(urls[i].path, urls[i].token, blob, { contentType: formato === 'jpg' ? 'image/jpeg' : 'image/webp' });
          if (up) throw new Error('Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.');
          rutas.push(urls[i].path);
        }
      }
      label.textContent = 'Enviando…';
      await autosApi('publicar', { autos: [{ ...r.auto, fotos: rutas }] });
      limpiarForm();
      await cargarMios();
      $('[data-vd-mios-box]').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      label.textContent = textoOriginal;
      error(err.message || 'Algo salió mal. Probá de nuevo.');
    } finally {
      ocupado = false; btn.disabled = false;
    }
  });

  window.addEventListener('rda:cuenta', (e) => pintarAcceso(e.detail));
  pintarAcceso(cuentaGuardada());
  pintarFotos();
}
