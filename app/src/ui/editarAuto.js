// Editar un auto a mano (Mi cuenta → Mis autos de las agencias): ventana con el formulario completo.
// Guarda con la misma acción que la carga masiva (mkt-autos "publicar", mismo código → actualiza, no duplica).
// Si se eligen fotos nuevas, reemplazan a las actuales; si no, quedan las que estaban.
import { $ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { PROVINCIAS, MAX_FOTOS } from '../lib/carga.js';
import { comprimir, formatoFotos, fotoUrl } from '../lib/fotos.js';
import { searchBrands } from '../data/modelos.js';
import { supa } from './auth.js';
import { autosApi } from './autosApi.js';
import { textoOferta, relojesOferta } from '../lib/oferta.js';

const DURA_RELAMPAGO = [[2, '2 horas'], [6, '6 horas'], [12, '12 horas'], [24, '24 horas'], [48, '48 horas'], [72, '3 días'], [168, '7 días'], [360, '15 días'], [720, '30 días']];
const pad2 = (n) => String(n).padStart(2, '0');
const aInput = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const fmtFecha = (t) => new Date(t).toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const opts = (lista, sel, vacio = '') => (vacio ? `<option value="">${esc(vacio)}</option>` : '') +
  lista.map((o) => { const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}"${String(v) === String(sel ?? '') ? ' selected' : ''}>${esc(t)}</option>`; }).join('');
const campo = (label, html, cls = '') => `<label class="block ${cls}"><span class="vd-label">${esc(label)}</span>${html}</label>`;
const input = (name, val, extra = '') => `<input class="auth-input" name="${name}" value="${esc(val ?? '')}" ${extra} />`;
const numero = (v) => Number(String(v ?? '').replace(/[.\s$]/g, '').replace(',', '.'));
const CARROCERIAS = [['hatchback', 'Hatchback'], ['sedan', 'Sedán'], ['suv', 'SUV'], ['pickup', 'Pick-up'], ['utilitario', 'Utilitario'], ['deportivo', 'Deportivo']];

/** Abre el editor. onGuardado() se llama después de guardar. */
export function editarAuto(a, onGuardado) {
  const marcas = searchBrands.includes(a.marca) ? searchBrands : [a.marca, ...searchBrands];
  const dlg = document.createElement('dialog');
  dlg.className = 'ea-dialog';
  dlg.setAttribute('aria-labelledby', 'ea-title');
  dlg.innerHTML = `
    <form method="dialog" class="flex max-h-[90vh] flex-col" novalidate data-ea-form>
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div class="min-w-0">
          <p class="text-[13px] font-bold text-ink/60">Código ${esc(a.codigo)}</p>
          <h2 id="ea-title" class="truncate text-[20px] font-bold">Editar ${esc(`${a.marca} ${a.modelo}`)}</h2>
        </div>
        <button type="button" class="icon-btn grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line" data-ea-cerrar aria-label="Cerrar">${icon('x', 'h-4 w-4')}</button>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
        <div class="grid gap-4 sm:grid-cols-2">
          ${campo('Marca', `<select class="auth-input" name="marca">${opts(marcas, a.marca)}</select>`)}
          ${campo('Modelo', input('modelo', a.modelo, 'maxlength="60" required'))}
          ${campo('Versión', input('version', a.version, 'maxlength="80" required'), 'sm:col-span-2')}
          ${campo('Año', input('anio', a.anio, 'inputmode="numeric" maxlength="4"'))}
          ${campo('Condición', `<select class="auth-input" name="condicion">${opts([['0km', '0km'], ['usado', 'Usado']], a.condicion)}</select>`)}
          ${campo('Kilómetros', input('km', Number(a.km).toLocaleString('es-AR'), 'inputmode="numeric" maxlength="9"'))}
          ${campo('Combustible', `<select class="auth-input" name="combustible">${opts(['Nafta', 'Diésel', 'GNC', 'Híbrido', 'Eléctrico'], a.combustible)}</select>`)}
          ${campo('Precio', input('precio', Number(a.precio).toLocaleString('es-AR'), 'inputmode="numeric" maxlength="15"'))}
          ${campo('Moneda', `<select class="auth-input" name="moneda">${opts([['ARS', '$ Pesos'], ['USD', 'USD']], a.moneda)}</select>`)}
          ${campo('Caja', `<select class="auth-input" name="transmision">${opts(['Manual', 'Automática'], a.transmision)}</select>`)}
          ${campo('Carrocería', `<select class="auth-input" name="carroceria">${opts(CARROCERIAS, a.carroceria)}</select>`)}
          ${campo('Puertas', `<select class="auth-input" name="puertas">${opts([2, 3, 4, 5], a.puertas, '—')}</select>`)}
          ${campo('Color', input('color', a.color, 'maxlength="30"'))}
          ${campo('Motor', input('motor', a.motor, 'maxlength="40"'))}
          ${campo('Tracción', input('traccion', a.traccion, 'maxlength="30"'))}
          ${campo('Ciudad', input('ciudad', a.ciudad, 'maxlength="60"'))}
          ${campo('Provincia', `<select class="auth-input" name="provincia">${opts(PROVINCIAS, a.provincia)}</select>`)}
          ${campo('Descripción', `<textarea class="auth-input !h-auto min-h-[110px] py-3" name="descripcion" maxlength="1000" rows="4">${esc(a.descripcion ?? '')}</textarea>`, 'sm:col-span-2')}
        </div>
        <div class="mt-6">
          <p class="vd-label">Fotos</p>
          <ul class="grid grid-cols-4 gap-2 sm:grid-cols-7" data-ea-fotos></ul>
          <label class="btn-outline mt-3 h-[44px] w-fit cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-input /> ${icon('images', 'h-4 w-4')} Reemplazar fotos</label>
          <p class="mt-2 text-[13px] text-ink/60" data-ea-fotos-nota>Si elegís fotos nuevas (hasta ${MAX_FOTOS}), reemplazan a las actuales. La primera es la portada.</p>
        </div>
        ${(() => {
          const vigente = a.relampago_precio && new Date(a.relampago_termina).getTime() > Date.now();
          const horas = vigente ? Math.round((new Date(a.relampago_termina) - new Date(a.relampago_empieza)) / 36e5) : 24;
          const dura = DURA_RELAMPAGO.some(([h]) => h === horas) ? horas : 24;
          return `
        <fieldset class="mt-6 rounded-2xl border border-[#F3B8B4] bg-[#FFF7F6] p-4 sm:p-5" data-ea-relampago>
          <legend class="px-1 text-[16px] font-bold"><span aria-hidden="true">🔥</span> Precio relámpago</legend>
          <p class="text-[14px] text-ink/70">Bajale el precio por un tiempo determinado. Se muestra con la etiqueta <b>🔥 Relámpago</b>, el precio normal tachado y un contador. Al terminar, vuelve solo a su precio.</p>
          ${vigente ? `<p class="mt-3 flex flex-wrap items-center gap-2 text-[14px]"><span class="feria-timer" data-oferta-ini="${esc(a.relampago_empieza)}" data-oferta-fin="${esc(a.relampago_termina)}"><span aria-hidden="true">🔥</span> <span data-oferta-txt>${esc(textoOferta({ ini: a.relampago_empieza, fin: a.relampago_termina }))}</span></span> ${esc(fmtFecha(a.relampago_empieza))} → ${esc(fmtFecha(a.relampago_termina))} <button type="button" class="font-bold text-[#B42318] underline underline-offset-2" data-ea-rel-quitar>Quitar relámpago</button></p>` : ''}
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            ${campo('Precio relámpago', input('rel_precio', vigente ? Number(a.relampago_precio).toLocaleString('es-AR') : '', 'inputmode="numeric" maxlength="15" placeholder="Vacío = sin relámpago"'))}
            ${campo('Empieza', `<input class="auth-input" type="datetime-local" name="rel_empieza" value="${esc(aInput(vigente ? Math.max(new Date(a.relampago_empieza).getTime(), Date.now()) : Date.now()))}" min="${esc(aInput(Date.now()))}" />`)}
            ${campo('Dura', `<select class="auth-input" name="rel_horas">${opts(DURA_RELAMPAGO, dura)}</select>`)}
          </div>
          <p class="mt-3 text-[13px] text-ink/60" data-ea-rel-resumen></p>
        </fieldset>`;
        })()}
        <p class="mt-5 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-ea-error></p>
      </div>
      <div class="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button type="button" class="btn-outline h-[50px] justify-center !px-6" data-ea-cerrar>Cancelar</button>
        <button type="submit" class="btn-primary h-[50px] justify-center !px-8" data-ea-guardar>${icon('check', 'h-4 w-4')} <span data-ea-label>Guardar cambios</span></button>
      </div>
    </form>`;
  document.body.append(dlg);

  const form = $('[data-ea-form]', dlg);
  const ul = $('[data-ea-fotos]', dlg);
  const err = $('[data-ea-error]', dlg);
  let nuevas = [];
  let ocupado = false;

  const pintarFotos = () => {
    const items = nuevas.length ? nuevas.map((f) => f.url) : (a.fotos ?? []).map(fotoUrl).filter(Boolean);
    ul.innerHTML = items.map((u, i) => `<li class="relative aspect-[4/3] overflow-hidden rounded-lg bg-soft"><img src="${esc(u)}" alt="Foto ${i + 1}" class="h-full w-full object-cover" />${i === 0 ? '<span class="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-bold text-white">Portada</span>' : ''}</li>`).join('');
  };
  const error = (m) => { err.textContent = m || ''; err.classList.toggle('hidden', !m); if (m) err.scrollIntoView({ block: 'nearest' }); };
  let reloj = 0;
  const cerrar = () => { if (ocupado) return; clearInterval(reloj); nuevas.forEach((f) => URL.revokeObjectURL(f.url)); dlg.close(); dlg.remove(); };

  // ---- Precio relámpago: resumen en vivo, y solo se guarda si se tocó ----
  const relBox = $('[data-ea-relampago]', dlg);
  let relTocado = false;
  const relResumen = () => {
    const p = numero(form.elements.rel_precio.value);
    const normal = numero(form.elements.precio.value);
    const ini = Math.max(new Date(form.elements.rel_empieza.value).getTime() || Date.now(), Date.now());
    const fin = ini + Number(form.elements.rel_horas.value) * 36e5;
    const mon = form.elements.moneda.value === 'USD' ? 'USD ' : '$ ';
    $('[data-ea-rel-resumen]', dlg).textContent = !p
      ? 'Sin precio relámpago.'
      : p >= normal
      ? `Tiene que ser más bajo que el precio actual (${mon}${normal.toLocaleString('es-AR')}).`
      : `${mon}${p.toLocaleString('es-AR')} en vez de ${mon}${normal.toLocaleString('es-AR')} (-${Math.round((1 - p / normal) * 100)}%) · del ${fmtFecha(ini)} al ${fmtFecha(fin)} h.`;
  };
  relBox.addEventListener('input', (e) => {
    relTocado = true;
    if (e.target.name === 'rel_precio') { const n = numero(e.target.value); e.target.value = n ? n.toLocaleString('es-AR') : ''; }
    relResumen();
  });
  relBox.addEventListener('change', () => { relTocado = true; relResumen(); });
  form.elements.precio.addEventListener('input', relResumen);
  $('[data-ea-rel-quitar]', dlg)?.addEventListener('click', () => { form.elements.rel_precio.value = ''; relTocado = true; relResumen(); });
  relResumen();
  reloj = relojesOferta(dlg);

  $('[data-ea-input]', dlg).addEventListener('change', (e) => {
    error('');
    const files = [...e.target.files].filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type) && f.size <= 25 * 1024 * 1024);
    if (files.length < e.target.files.length) error('Algunos archivos no son fotos JPG, PNG o WebP de hasta 25 MB y no se sumaron.');
    if (files.length > MAX_FOTOS) error(`Podés subir hasta ${MAX_FOTOS} fotos. Tomamos las primeras ${MAX_FOTOS}.`);
    nuevas.forEach((f) => URL.revokeObjectURL(f.url));
    nuevas = files.slice(0, MAX_FOTOS).map((file) => ({ file, url: URL.createObjectURL(file) }));
    pintarFotos();
    e.target.value = '';
  });
  dlg.addEventListener('click', (e) => { if (e.target.closest('[data-ea-cerrar]') || e.target === dlg) { e.preventDefault(); cerrar(); } });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (ocupado) return;
    const f = form.elements;
    const v = (k) => f[k].value.trim();
    const anioMax = new Date().getFullYear() + 1;
    const auto = {
      codigo: a.codigo, marca: v('marca'), modelo: v('modelo'), version: v('version'), anio: Number(v('anio')),
      condicion: v('condicion'), km: numero(v('km')), precio: numero(v('precio')), moneda: v('moneda'),
      combustible: v('combustible'), transmision: v('transmision'), carroceria: v('carroceria'),
      puertas: v('puertas') ? Number(v('puertas')) : null, color: v('color'), motor: v('motor'), traccion: v('traccion'),
      ciudad: v('ciudad'), provincia: v('provincia'), descripcion: v('descripcion'),
    };
    if (!auto.modelo || !auto.version) return error('Completá modelo y versión.');
    if (!auto.ciudad) return error('Completá la ciudad.');
    if (!Number.isInteger(auto.anio) || auto.anio < 1950 || auto.anio > anioMax) return error(`El año tiene que estar entre 1950 y ${anioMax}.`);
    if (!Number.isInteger(auto.km) || auto.km < 0 || auto.km > 2000000) return error('Revisá los kilómetros (solo números).');
    if (!Number.isFinite(auto.precio) || auto.precio <= 0 || auto.precio >= 1e11) return error('Revisá el precio (solo números).');
    const relPrecio = numero(v('rel_precio'));
    if (relPrecio && relPrecio >= auto.precio) return error('El precio relámpago tiene que ser más bajo que el precio.');
    const relEmpieza = new Date(v('rel_empieza'));
    if (relPrecio && Number.isNaN(relEmpieza.getTime())) return error('Elegí cuándo empieza el precio relámpago.');

    ocupado = true; error('');
    const btn = $('[data-ea-guardar]', dlg), label = $('[data-ea-label]', dlg);
    btn.disabled = true;
    try {
      let fotos = [];
      if (nuevas.length) {
        const sb = await supa();
        const formato = await formatoFotos();
        label.textContent = 'Preparando fotos…';
        const blobs = [];
        for (const n of nuevas) blobs.push(await comprimir(n.file, formato));
        const { urls } = await autosApi('urls_fotos', { cantidad: blobs.length, formato });
        for (const [i, blob] of blobs.entries()) {
          label.textContent = `Subiendo fotos ${i + 1} de ${blobs.length}…`;
          const { error: up } = await sb.storage.from('mkt-fotos').uploadToSignedUrl(urls[i].path, urls[i].token, blob, { contentType: formato === 'jpg' ? 'image/jpeg' : 'image/webp' });
          if (up) throw new Error('Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.');
          fotos.push(urls[i].path);
        }
      }
      label.textContent = 'Guardando…';
      await autosApi('publicar', { autos: [{ ...auto, fotos }] });
      if (relTocado || (relPrecio && Number(a.relampago_precio) !== relPrecio)) {
        if (relPrecio) await autosApi('relampago', { id: a.id, precio: relPrecio, empieza: relEmpieza.toISOString(), horas: Number(v('rel_horas')) });
        else if (a.relampago_precio) await autosApi('relampago_quitar', { id: a.id });
      }
      ocupado = false;
      cerrar();
      onGuardado?.();
    } catch (ex) {
      ocupado = false; btn.disabled = false; label.textContent = 'Guardar cambios';
      error(String(ex.message || 'No pudimos guardar. Probá de nuevo.').replace(/^Fila 1: /, ''));
    }
  });

  pintarFotos();
  dlg.showModal();
  f0(form);
}
const f0 = (form) => form.elements.modelo?.focus();
