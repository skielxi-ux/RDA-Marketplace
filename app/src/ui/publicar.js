// Publicar vehículos (agencias aprobadas): plantilla Excel + carpeta de fotos → revisión → publicar.
// Las fotos se unen con cada auto por el Código (carpeta "A001/" o nombre "A001-1.jpg").
// Todo se valida acá y otra vez en el servidor (edge function mkt-autos).
import { $, $$ } from './dom.js';
import { esc, formatPrice, formatKm } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { leerFilas, unirFotos, esImagen, MAX_FOTOS } from '../lib/carga.js';
import { comprimir, formatoFotos } from '../lib/fotos.js';
import { cuentaGuardada, supa } from './auth.js';
import { autosApi } from './autosApi.js';

const MAX_MB = 25;

export function initPublicar() {
  const guard = $('[data-pub-guard]');
  const app = $('[data-pub-app]');
  const errBox = $('[data-pub-error]');
  const review = $('[data-pub-review]');
  const list = $('[data-pub-list]');
  const sueltasBox = $('[data-sueltas-box]');
  const sueltasUl = $('[data-sueltas]');
  const btnPub = $('[data-pub-publicar]');

  let cuenta = null;
  let existentes = new Set();
  let autos = [];               // filas del Excel validadas
  const fotos = new Map();      // id → { id, file, nombre, ruta, url }
  let asign = new Map();        // CODIGO → [ids]
  let sueltas = [];             // ids sin auto
  let avisos = [];              // avisos de la última carga de fotos
  let nextId = 1;
  let ocupado = false;

  const error = (msg) => { errBox.textContent = msg || ''; errBox.classList.toggle('hidden', !msg); };

  // ---------- Quién puede usar la página ----------
  const pintarAcceso = async (c) => {
    cuenta = c;
    const ok = c?.tipo === 'agencia' && c.estado === 'aprobada';
    guard.hidden = ok;
    app.hidden = !ok;
    if (!c) {
      $('[data-pub-guard-title]').textContent = 'Ingresá con tu agencia';
      $('[data-pub-guard-text]').textContent = 'La carga de autos es para agencias y concesionarios aprobados.';
      $('[data-pub-login]').hidden = false;
    } else if (!ok) {
      $('[data-pub-login]').hidden = true;
      $('[data-pub-guard-title]').textContent = c.tipo === 'agencia' ? 'Tu agencia está en revisión' : 'Por ahora es solo para agencias';
      $('[data-pub-guard-text]').textContent = c.tipo === 'agencia'
        ? 'Cuando la aprobemos vas a poder cargar tu stock desde acá.'
        : 'La carga masiva es para agencias y concesionarios. Muy pronto vas a poder publicar tu auto como particular.';
    }
    if (ok) {
      try {
        const { autos: mios } = await autosApi('mios');
        existentes = new Set((mios ?? []).map((a) => String(a.codigo).toUpperCase()));
        if (autos.length) recalcular();
      } catch (e) { if (e.status === 401 || e.status === 403) pintarAcceso(null); }
    }
  };
  window.addEventListener('rda:cuenta', (e) => pintarAcceso(e.detail));
  pintarAcceso(cuentaGuardada());

  // ---------- Excel ----------
  const leerExcel = async (file) => {
    error('');
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) return error('El archivo tiene que ser un Excel .xlsx (usá la plantilla).');
    if (file.size > 5 * 1024 * 1024) return error('El Excel pesa demasiado (máximo 5 MB).');
    $('[data-excel-label]').textContent = `Leyendo ${file.name}…`;
    try {
      const { readSheet } = await import('read-excel-file/browser');
      let filas;
      try { filas = await readSheet(file, 'Autos'); } catch { filas = await readSheet(file); }
      const r = leerFilas(filas, { defaults: { ciudad: cuenta?.ciudad, provincia: cuenta?.provincia }, existentes });
      if (r.error) { $('[data-excel-label]').textContent = 'Arrastrá el Excel o tocá para elegirlo'; return error(r.error); }
      autos = r.autos;
      $('[data-excel-label]').textContent = `${file.name} · ${autos.length} ${autos.length === 1 ? 'auto' : 'autos'}`;
      $('[data-drop="excel"]').classList.add('is-done');
      recalcular();
    } catch {
      $('[data-excel-label]').textContent = 'Arrastrá el Excel o tocá para elegirlo';
      error('No pudimos leer el Excel. Guardalo como .xlsx y probá de nuevo.');
    }
  };
  $('[data-input-excel]').addEventListener('change', (e) => { leerExcel(e.target.files[0]); e.target.value = ''; });

  // ---------- Fotos ----------
  const sumarFotos = (lista) => {
    error('');
    let ignoradas = 0, pesadas = 0, heic = 0;
    for (const { file, ruta } of lista) {
      if (/\.(heic|heif)$/i.test(file.name)) { heic++; continue; }
      if (!esImagen(file.name)) { if (!file.name.startsWith('.')) ignoradas++; continue; }
      if (file.size > MAX_MB * 1024 * 1024) { pesadas++; continue; }
      const dup = [...fotos.values()].some((f) => f.ruta === ruta && f.file.size === file.size);
      if (dup) continue;
      const id = nextId++;
      fotos.set(id, { id, file, nombre: file.name, ruta, url: URL.createObjectURL(file) });
    }
    avisos = [];
    if (heic) avisos.push(`${heic} ${heic === 1 ? 'foto está' : 'fotos están'} en formato HEIC (iPhone): pasalas a JPG.`);
    if (pesadas) avisos.push(`${pesadas} ${pesadas === 1 ? 'foto pesa' : 'fotos pesan'} más de ${MAX_MB} MB y no se cargaron.`);
    if (ignoradas) avisos.push(`${ignoradas} ${ignoradas === 1 ? 'archivo no es' : 'archivos no son'} fotos (JPG, PNG o WebP) y se ignoraron.`);
    $('[data-fotos-label]').textContent = `${fotos.size} ${fotos.size === 1 ? 'foto cargada' : 'fotos cargadas'} · podés sumar más`;
    $('[data-drop="fotos"]').classList.toggle('is-done', fotos.size > 0);
    recalcular();
  };
  const desdeInput = (input) => sumarFotos([...input.files].map((file) => ({ file, ruta: file.webkitRelativePath || file.name })));
  $('[data-input-carpeta]').addEventListener('change', (e) => { desdeInput(e.target); e.target.value = ''; });
  $('[data-input-fotos]').addEventListener('change', (e) => { desdeInput(e.target); e.target.value = ''; });

  // Leer carpetas arrastradas (con subcarpetas)
  const leerEntrada = (entry) => new Promise((resolve) => {
    if (entry.isFile) return entry.file((file) => resolve([{ file, ruta: entry.fullPath.replace(/^\//, '') }]), () => resolve([]));
    if (!entry.isDirectory) return resolve([]);
    const reader = entry.createReader();
    const todas = [];
    const leer = () => reader.readEntries(async (ents) => {
      if (!ents.length) {
        const partes = await Promise.all(todas.map(leerEntrada));
        return resolve(partes.flat());
      }
      todas.push(...ents);
      leer();
    }, () => resolve([]));
    leer();
  });

  // Zonas para soltar archivos
  $$('[data-drop]').forEach((zona) => {
    ['dragenter', 'dragover'].forEach((t) => zona.addEventListener(t, (e) => {
      if (!e.dataTransfer?.types?.includes('Files')) return;
      e.preventDefault(); zona.classList.add('is-over');
    }));
    ['dragleave', 'drop'].forEach((t) => zona.addEventListener(t, () => zona.classList.remove('is-over')));
    zona.addEventListener('drop', async (e) => {
      if (!e.dataTransfer?.types?.includes('Files')) return;
      e.preventDefault();
      if (zona.dataset.drop === 'excel') return leerExcel(e.dataTransfer.files[0]);
      const items = [...e.dataTransfer.items].map((it) => it.webkitGetAsEntry?.()).filter(Boolean);
      const lista = items.length ? (await Promise.all(items.map(leerEntrada))).flat()
        : [...e.dataTransfer.files].map((file) => ({ file, ruta: file.name }));
      sumarFotos(lista);
    });
  });
  // Que soltar un archivo fuera de las zonas no abra la foto en la pestaña
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  // ---------- Unir fotos con autos ----------
  function recalcular() {
    autos.forEach((a) => { a.existe = existentes.has(a.codigo.toUpperCase()); });
    const r = unirFotos([...fotos.values()], autos.map((a) => a.codigo));
    asign = r.asignadas;
    sueltas = r.sueltas;
    avisos = avisos.filter((a) => !a.includes('tenía más de'));
    for (const [cod, n] of r.sobrantes) avisos.push(`${cod} tenía más de ${MAX_FOTOS} fotos: ${n} ${n === 1 ? 'quedó' : 'quedaron'} sin asignar.`);
    render();
  }

  const fotosDe = (a) => asign.get(a.codigo.toUpperCase()) ?? [];
  const erroresDe = (a) => [...a.errores, ...(!a.existe && !fotosDe(a).length ? ['Falta al menos una foto.'] : [])];

  const thumb = (id, { pos, total, enAuto }) => {
    const f = fotos.get(id);
    return `
      <li class="pub-thumb" draggable="true" data-foto="${id}">
        <img src="${esc(f.url)}" alt="${esc(f.nombre)}" loading="lazy" decoding="async" />
        ${enAuto && pos === 0 ? '<span class="pub-portada">Portada</span>' : ''}
        <span class="pub-thumb-actions">
          ${enAuto ? `
          <button type="button" class="pub-mini" data-act="izq" ${pos === 0 ? 'disabled' : ''} aria-label="Mover antes">${icon('chevron-left', 'h-3.5 w-3.5')}</button>
          <button type="button" class="pub-mini" data-act="der" ${pos === total - 1 ? 'disabled' : ''} aria-label="Mover después">${icon('chevron-right', 'h-3.5 w-3.5')}</button>` : ''}
          <button type="button" class="pub-mini" data-act="${enAuto ? 'soltar' : 'descartar'}" aria-label="${enAuto ? 'Quitar de este auto' : 'Descartar foto'}">${icon('x', 'h-3.5 w-3.5')}</button>
        </span>
        ${enAuto ? '' : `
        <label class="sr-only" for="as-${id}">Asignar ${esc(f.nombre)} a un auto</label>
        <select id="as-${id}" class="pub-asignar" data-asignar>
          <option value="">Asignar a…</option>
          ${autos.map((a) => `<option value="${esc(a.codigo)}" ${fotosDe(a).length >= MAX_FOTOS ? 'disabled' : ''}>${esc(a.codigo)} · ${esc(a.marca)} ${esc(a.modelo)}</option>`).join('')}
        </select>`}
        <span class="pub-thumb-name" title="${esc(f.ruta)}">${esc(f.nombre)}</span>
      </li>`;
  };

  function render() {
    review.hidden = !autos.length && !fotos.size;
    const conError = autos.filter((a) => erroresDe(a).length);
    const listos = autos.length - conError.length;

    $('[data-pub-summary]').innerHTML = [
      `<b>${autos.length}</b> ${autos.length === 1 ? 'auto' : 'autos'}`,
      `<span class="text-ok">${listos} ${listos === 1 ? 'listo' : 'listos'}</span>`,
      conError.length ? `<span class="text-[#D92D20]">${conError.length} con algo para corregir</span>` : '',
      sueltas.length ? `<span class="text-[#8A5A00]">${sueltas.length} ${sueltas.length === 1 ? 'foto' : 'fotos'} sin asignar</span>` : '',
    ].filter(Boolean).join(' · ') + (avisos.length ? `<br><span class="text-[#8A5A00]">${avisos.map(esc).join(' ')}</span>` : '')
      + (!autos.length ? '<br>Subí el Excel para ver los autos.' : '');

    btnPub.disabled = !autos.length || conError.length > 0 || ocupado;
    $('[data-pub-publicar-label]').textContent = autos.length ? `Publicar ${autos.length} ${autos.length === 1 ? 'auto' : 'autos'}` : 'Publicar';

    sueltasBox.classList.toggle('hidden', !sueltas.length);
    $('[data-sueltas-count]').textContent = `(${sueltas.length})`;
    sueltasUl.innerHTML = sueltas.map((id) => thumb(id, { enAuto: false })).join('');

    // Primero los que tienen errores
    const orden = [...autos].sort((a, b) => (erroresDe(b).length > 0) - (erroresDe(a).length > 0) || a.fila - b.fila);
    list.innerHTML = orden.map((a) => {
      const ids = fotosDe(a);
      const errs = erroresDe(a);
      const cod = a.codigo || `fila ${a.fila}`;
      return `
      <li class="pub-car ${errs.length ? 'has-error' : ''}" data-drop-target="${esc(a.codigo.toUpperCase())}">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <p class="flex flex-wrap items-center gap-2 text-[13px]">
              <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${esc(cod)}</span>
              <span class="text-ink/60">Fila ${a.fila}</span>
              ${a.existe ? '<span class="rounded-full bg-[#EEF1FB] px-2.5 py-0.5 font-medium text-brand">Se actualiza</span>' : '<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Nuevo</span>'}
            </p>
            <h3 class="mt-2 truncate text-[18px] font-bold">${esc([a.marca, a.modelo, a.version].filter(Boolean).join(' '))} ${Number.isInteger(a.anio) ? esc(a.anio) : ''}</h3>
            <p class="mt-1 text-[14px] text-ink/70">${[Number.isInteger(a.km) ? formatKm(a.km) : '', a.combustible, a.transmision, a.carroceriaNombre, a.ciudad && a.provincia ? `${a.ciudad}, ${a.provincia}` : ''].filter(Boolean).map(esc).join(' · ')}</p>
          </div>
          <p class="shrink-0 text-[22px] font-bold">${Number.isFinite(a.precio) && a.precio > 0 && a.moneda ? esc(formatPrice(a.precio, a.moneda)) : ''}</p>
        </div>
        ${errs.length ? `<ul class="mt-3 space-y-1 rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318]">${errs.map((e) => `<li class="flex gap-2">${icon('circle-alert', 'mt-0.5 h-4 w-4 shrink-0')}<span>${esc(e)}</span></li>`).join('')}</ul>` : ''}
        <div class="mt-4">
          <p class="mb-2 text-[13px] text-ink/60">Fotos ${ids.length}/${MAX_FOTOS}${a.existe && !ids.length ? ' · si no subís fotos, mantiene las que ya tiene' : ''}</p>
          <ul class="flex flex-wrap gap-3">${ids.map((id, i) => thumb(id, { pos: i, total: ids.length, enAuto: true })).join('')}
            ${ids.length < MAX_FOTOS ? '<li class="pub-slot" aria-hidden="true">Soltá una foto acá</li>' : ''}
          </ul>
        </div>
      </li>`;
    }).join('');
  }

  // ---------- Mover fotos (botones, selector y arrastrar) ----------
  const quitar = (id) => {
    for (const ids of asign.values()) { const i = ids.indexOf(id); if (i >= 0) ids.splice(i, 1); }
    sueltas = sueltas.filter((x) => x !== id);
  };
  const mover = (id, destino) => {
    if (destino === 'sueltas') { quitar(id); sueltas.push(id); return true; }
    const ids = asign.get(destino) ?? asign.set(destino, []).get(destino);
    if (ids.includes(id)) return false;
    if (ids.length >= MAX_FOTOS) { error(`Ese auto ya tiene ${MAX_FOTOS} fotos. Quitá una antes de sumar otra.`); return false; }
    quitar(id); ids.push(id); error('');
    return true;
  };

  review.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const id = Number(b.closest('[data-foto]').dataset.foto);
    const act = b.dataset.act;
    if (act === 'descartar') {
      quitar(id); URL.revokeObjectURL(fotos.get(id).url); fotos.delete(id);
      $('[data-fotos-label]').textContent = `${fotos.size} ${fotos.size === 1 ? 'foto cargada' : 'fotos cargadas'} · podés sumar más`;
    } else if (act === 'soltar') {
      mover(id, 'sueltas');
    } else {
      const ids = [...asign.values()].find((l) => l.includes(id));
      const i = ids.indexOf(id), j = act === 'izq' ? i - 1 : i + 1;
      if (j >= 0 && j < ids.length) [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    render();
  });
  review.addEventListener('change', (e) => {
    if (!e.target.matches('[data-asignar]') || !e.target.value) return;
    const id = Number(e.target.closest('[data-foto]').dataset.foto);
    if (mover(id, e.target.value.toUpperCase())) render();
  });

  let arrastrando = null;
  review.addEventListener('dragstart', (e) => {
    const li = e.target.closest?.('[data-foto]');
    if (!li) return;
    arrastrando = Number(li.dataset.foto);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(arrastrando));
    li.classList.add('is-dragging');
  });
  review.addEventListener('dragend', () => { arrastrando = null; $$('.is-dragging, .is-over', review).forEach((x) => x.classList.remove('is-dragging', 'is-over')); });
  review.addEventListener('dragover', (e) => {
    const t = e.target.closest('[data-drop-target]');
    if (arrastrando == null || !t) return;
    e.preventDefault();
    $$('.is-over', review).forEach((x) => x !== t && x.classList.remove('is-over'));
    t.classList.add('is-over');
  });
  review.addEventListener('drop', (e) => {
    const t = e.target.closest('[data-drop-target]');
    if (arrastrando == null || !t) return;
    e.preventDefault();
    e.stopPropagation();
    if (mover(arrastrando, t.dataset.dropTarget)) render();
    arrastrando = null;
  });

  // ---------- Publicar ----------
  const overlay = $('[data-pub-progress]');
  const progreso = (texto, hecho, total) => {
    $('[data-prog-text]').textContent = texto;
    $('[data-prog-bar]').style.width = `${total ? Math.round((hecho / total) * 100) : 0}%`;
  };
  async function enParalelo(items, n, fn) {
    let i = 0;
    await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) { const k = i++; await fn(items[k], k); }
    }));
  }

  btnPub.addEventListener('click', async () => {
    if (btnPub.disabled || ocupado) return;
    ocupado = true; btnPub.disabled = true; error('');
    overlay.hidden = false;
    $('[data-prog-run]').hidden = false; $('[data-prog-done]').hidden = true;
    document.documentElement.classList.add('overflow-hidden');
    try {
      const sb = await supa();
      const formato = await formatoFotos();
      const tareas = autos.flatMap((a) => fotosDe(a).map((id) => ({ a, id })));
      const blobs = new Map();
      let hechas = 0;
      progreso('Preparando fotos…', 0, tareas.length);
      await enParalelo(tareas, 3, async ({ id }) => {
        blobs.set(id, await comprimir(fotos.get(id).file, formato));
        progreso(`Preparando fotos ${++hechas} de ${tareas.length}…`, hechas, tareas.length * 2);
      });
      const rutas = new Map();
      if (tareas.length) {
        const { urls } = await autosApi('urls_fotos', { cantidad: tareas.length, formato });
        let subidas = 0;
        await enParalelo(tareas, 4, async ({ id }, k) => {
          const { path, token } = urls[k];
          const { error: e } = await sb.storage.from('mkt-fotos').uploadToSignedUrl(path, token, blobs.get(id), { contentType: formato === 'jpg' ? 'image/jpeg' : 'image/webp' });
          if (e) throw new Error('Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.');
          rutas.set(id, path);
          progreso(`Subiendo fotos ${++subidas} de ${tareas.length}…`, tareas.length + subidas, tareas.length * 2);
        });
      }
      progreso('Publicando…', 1, 1);
      const payload = autos.map(({ errores, fila, existe, carroceriaNombre, fotos: _, ...a }) => ({ ...a, fotos: fotosDe(a).map((id) => rutas.get(id)) }));
      const r = await autosApi('publicar', { autos: payload });
      $('[data-prog-run]').hidden = true; $('[data-prog-done]').hidden = false;
      $('[data-prog-result]').textContent = [
        r.nuevos ? `${r.nuevos} ${r.nuevos === 1 ? 'auto publicado' : 'autos publicados'}` : '',
        r.actualizados ? `${r.actualizados} ${r.actualizados === 1 ? 'actualizado' : 'actualizados'}` : '',
      ].filter(Boolean).join(' y ') + '. Ya se ven en el listado.';
      autos.forEach((a) => existentes.add(a.codigo.toUpperCase()));
    } catch (e) {
      overlay.hidden = true;
      document.documentElement.classList.remove('overflow-hidden');
      error(e.message || 'Algo salió mal. Probá de nuevo.');
    } finally {
      ocupado = false;
      render();
    }
  });

  $('[data-prog-otra]').addEventListener('click', () => {
    overlay.hidden = true;
    document.documentElement.classList.remove('overflow-hidden');
    fotos.forEach((f) => URL.revokeObjectURL(f.url));
    fotos.clear(); autos = []; asign = new Map(); sueltas = []; avisos = [];
    $('[data-excel-label]').textContent = 'Arrastrá el Excel o tocá para elegirlo';
    $('[data-fotos-label]').textContent = 'Arrastrá la carpeta de fotos acá';
    $$('[data-drop]').forEach((z) => z.classList.remove('is-done'));
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
