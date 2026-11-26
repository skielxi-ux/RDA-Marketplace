// Admin → Planes de ahorro: concesionarios (con logo) y sus vendedores (con foto, planes, horario),
// con los clics a WhatsApp y Llamar de los últimos 30 días.
import { $, $$ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { comprimir, formatoFotos, planImgUrl } from '../lib/fotos.js';
import { searchBrands } from '../data/modelos.js';

const fmt10 = (t) => String(t || '').replace(/^549/, '').replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2-$3');
const campo = (label, html, extra = '') => `<label class="block ${extra}"><span class="auth-label">${label}</span>${html}</label>`;
const ini = (n) => n.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const miniImg = (path, nombre, redonda) => planImgUrl(path)
  ? `<img src="${esc(planImgUrl(path))}" alt="" class="h-full w-full ${redonda ? 'object-cover' : 'object-contain'}" />`
  : `<span class="text-[15px] font-bold text-brand">${esc(ini(nombre))}</span>`;

/** Pinta la pestaña. `api(accion, extra)` llama a mkt-planes con la sesión del admin; `ui` = { toast, handleError, dialog, sb }. */
export async function renderPlanes(box, api, ui) {
  box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando planes de ahorro…</p>`;
  const { concesionarios } = await api('listar');
  const nVend = concesionarios.reduce((s, c) => s + c.vendedores.length, 0);

  box.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-[22px] font-bold">Planes de ahorro</h2>
        <p class="mt-1 text-[14px] text-ink/60">${concesionarios.length} concesionarios · ${nVend} vendedores · se ven en <a href="./planes-de-ahorro.html" target="_blank" rel="noopener" class="text-brand underline">la página de Planes de ahorro</a> (solo los concesionarios con algún vendedor visible). Clics = veces que tocaron WhatsApp o Llamar en los últimos 30 días (uno por persona por día).</p>
      </div>
      <button type="button" class="btn-primary h-[46px] !px-5" data-pl-nuevo-con>${icon('plus', 'h-4 w-4')} Nuevo concesionario</button>
    </div>
    <datalist id="pl-marcas">${searchBrands.map((m) => `<option value="${esc(m)}"></option>`).join('')}</datalist>
    <div data-pl-form class="mt-6" hidden></div>
    <div class="mt-6 grid gap-5">
      ${concesionarios.length ? concesionarios.map((c) => `
      <section class="rounded-2xl border border-line bg-white p-4 sm:p-5 ${c.activo ? '' : 'opacity-60'}">
        <div class="flex flex-wrap items-center gap-4">
          <span class="grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-1.5">${miniImg(c.logo, c.nombre)}</span>
          <div class="min-w-0 flex-1">
            <p class="text-[18px] font-bold">${esc(c.nombre)} ${c.activo ? '' : '<span class="ml-1 rounded-full bg-soft px-2 py-0.5 text-[12px] font-medium text-ink/70">Pausado</span>'}</p>
            <p class="text-[14px] text-ink/70">${esc(c.marca)}${c.ciudad ? ` · ${esc(c.ciudad)}` : ''}${c.direccion ? ` · ${esc(c.direccion)}` : ''}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn-primary h-[40px] !px-3.5 text-[14px]" data-pl-nuevo-vend="${esc(c.id)}">${icon('plus', 'h-4 w-4')} Vendedor</button>
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px]" data-pl-editar-con="${esc(c.id)}">Editar</button>
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-pl-borrar-con="${esc(c.id)}" aria-label="Borrar ${esc(c.nombre)}">${icon('x', 'h-4 w-4')}</button>
          </div>
        </div>
        <ul class="mt-4 grid gap-2">
          ${c.vendedores.length ? c.vendedores.map((v) => `
          <li class="flex flex-col gap-3 rounded-xl bg-soft p-3 sm:flex-row sm:items-center ${v.activo ? '' : 'opacity-60'}">
            <span class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white">${miniImg(v.foto, v.nombre, true)}</span>
            <div class="min-w-0 flex-1 text-[14px]">
              <p class="font-bold">${esc(v.nombre)} ${v.activo ? '' : '· <span class="font-medium text-ink/60">Pausado</span>'}</p>
              <p class="text-ink/70">WhatsApp ${esc(fmt10(v.whatsapp))}${v.telefono ? ` · Llamar ${esc(fmt10(v.telefono))}` : ''}${v.horario ? ` · ${esc(v.horario)}` : ''}</p>
              ${v.planes ? `<p class="text-ink/70">Planes: ${esc(v.planes)}</p>` : ''}
            </div>
            <div class="flex shrink-0 items-center gap-4">
              <span class="text-center"><b class="block text-[18px] leading-none">${esc(v.clics.whatsapp)}</b><small class="text-[11px] text-ink/60">WhatsApp</small></span>
              <span class="text-center"><b class="block text-[18px] leading-none">${esc(v.clics.llamada)}</b><small class="text-[11px] text-ink/60">Llamadas</small></span>
              <button type="button" class="btn-outline h-[38px] !px-3 text-[13px]" data-pl-editar-vend="${esc(v.id)}">Editar</button>
              <button type="button" class="btn-outline h-[38px] !px-3 text-[13px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-pl-borrar-vend="${esc(v.id)}" aria-label="Borrar ${esc(v.nombre)}">${icon('x', 'h-4 w-4')}</button>
            </div>
          </li>`).join('') : '<li class="rounded-xl bg-soft px-4 py-3 text-[14px] text-ink/60">Sin vendedores todavía. No se muestra en la página hasta que cargues uno.</li>'}
        </ul>
      </section>`).join('') : '<p class="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-ink/60">Todavía no cargaste concesionarios. Empezá con "Nuevo concesionario" y después sumale sus vendedores.</p>'}
    </div>`;

  const formBox = $('[data-pl-form]', box);
  const recargar = () => renderPlanes(box, api, ui);
  const vendedores = concesionarios.flatMap((c) => c.vendedores.map((v) => ({ ...v, con: c })));

  /** Formulario genérico (concesionario o vendedor) con imagen opcional. */
  function abrir({ titulo, campos, img, redonda, onGuardar }) {
    formBox.innerHTML = `
      <form class="rounded-2xl border border-line bg-soft p-5 sm:p-6" novalidate>
        <h3 class="text-[18px] font-bold">${titulo}</h3>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          ${campos}
          <div class="sm:col-span-2">
            <span class="auth-label">${redonda ? 'Foto' : 'Logo'}</span>
            <div class="flex flex-wrap items-center gap-4">
              <span class="grid h-20 w-20 place-items-center overflow-hidden ${redonda ? 'rounded-full' : 'rounded-xl p-2'} border border-line bg-white" data-pl-prev>${planImgUrl(img) ? `<img src="${esc(planImgUrl(img))}" alt="" class="h-full w-full ${redonda ? 'object-cover' : 'object-contain'}" />` : '<span class="text-[12px] text-ink/50">Sin imagen</span>'}</span>
              <label class="btn-outline h-[44px] cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-pl-img /> ${icon('images', 'h-4 w-4')} ${img ? 'Cambiar' : 'Subir'}</label>
              <span class="text-[13px] text-ink/60">${redonda ? 'Foto de cara, cuadrada si se puede.' : 'Ideal: fondo blanco o transparente.'}</span>
            </div>
          </div>
          <label class="flex items-center gap-2 text-[15px] sm:col-span-2"><input type="checkbox" name="activo" class="h-4 w-4" checked /> Visible en la página</label>
        </div>
        <p class="mt-4 hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318]" data-pl-error></p>
        <div class="mt-5 flex flex-wrap gap-2">
          <button type="submit" class="btn-primary h-[46px] !px-6">${icon('check', 'h-4 w-4')} <span data-pl-label>Guardar</span></button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-pl-cancelar>Cancelar</button>
        </div>
      </form>`;
    formBox.hidden = false;
    formBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const f = $('form', formBox);
    let archivo = null;
    $('[data-pl-img]', f).addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) { ui.toast('La imagen tiene que ser JPG, PNG o WebP de hasta 10 MB', false); return; }
      archivo = file;
      $('[data-pl-prev]', f).innerHTML = `<img src="${esc(URL.createObjectURL(file))}" alt="" class="h-full w-full ${redonda ? 'object-cover' : 'object-contain'}" />`;
    });
    $('[data-pl-cancelar]', f).addEventListener('click', () => { formBox.hidden = true; formBox.innerHTML = ''; });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = $('[data-pl-error]', f);
      errBox.classList.add('hidden');
      const btn = $('[type=submit]', f), label = $('[data-pl-label]', f);
      btn.disabled = true;
      try {
        let ruta;
        if (archivo) {
          label.textContent = 'Subiendo imagen…';
          const formato = await formatoFotos();
          const blob = await comprimir(archivo, formato);
          const { path, token } = await api('url_imagen', { formato });
          const { error } = await ui.sb.storage.from('mkt-fotos').uploadToSignedUrl(path, token, blob, { contentType: formato === 'jpg' ? 'image/jpeg' : 'image/webp' });
          if (error) throw new Error('No se pudo subir la imagen. Probá de nuevo.');
          ruta = path;
        }
        label.textContent = 'Guardando…';
        await onGuardar(f, ruta);
        ui.toast('Guardado');
        await recargar();
      } catch (ex) { errBox.textContent = ex.message; errBox.classList.remove('hidden'); btn.disabled = false; label.textContent = 'Guardar'; }
    });
    return f;
  }

  const abrirConcesionario = (c = {}) => {
    const f = abrir({
      titulo: c.id ? `Editar ${esc(c.nombre)}` : 'Nuevo concesionario', img: c.logo,
      campos: `
        ${campo('Nombre del concesionario', `<input class="auth-input" name="nombre" maxlength="80" value="${esc(c.nombre ?? '')}" placeholder="Ej.: Toyota Tucumán Motors" />`)}
        ${campo('Marca', `<input class="auth-input" name="marca" maxlength="40" list="pl-marcas" value="${esc(c.marca ?? '')}" placeholder="Ej.: Toyota" />`)}
        ${campo('Ciudad (opcional)', `<input class="auth-input" name="ciudad" maxlength="60" value="${esc(c.ciudad ?? 'San Miguel de Tucumán')}" />`)}
        ${campo('Dirección (opcional)', `<input class="auth-input" name="direccion" maxlength="120" value="${esc(c.direccion ?? '')}" />`)}`,
      onGuardar: (f, logo) => api('guardar_concesionario', { concesionario: {
        id: c.id, nombre: f.elements.nombre.value, marca: f.elements.marca.value, ciudad: f.elements.ciudad.value,
        direccion: f.elements.direccion.value, activo: f.elements.activo.checked, ...(logo ? { logo } : {}) } }),
    });
    f.elements.activo.checked = c.activo !== false;
  };
  const abrirVendedor = (v = {}, con) => {
    const f = abrir({
      titulo: v.id ? `Editar ${esc(v.nombre)}` : `Nuevo vendedor de ${esc(con.nombre)}`, img: v.foto, redonda: true,
      campos: `
        ${campo('Nombre y apellido', `<input class="auth-input" name="nombre" maxlength="80" value="${esc(v.nombre ?? '')}" />`)}
        ${campo('WhatsApp', `<input class="auth-input" name="whatsapp" inputmode="tel" placeholder="381 555-1234" value="${esc(fmt10(v.whatsapp))}" />`)}
        ${campo('Teléfono para llamar (opcional)', `<input class="auth-input" name="telefono" inputmode="tel" placeholder="Si lo dejás vacío, se usa el WhatsApp" value="${esc(fmt10(v.telefono))}" />`)}
        ${campo('Horario de atención (opcional)', `<input class="auth-input" name="horario" maxlength="80" placeholder="Lun a vie 9 a 18 h · Sáb 9 a 13 h" value="${esc(v.horario ?? '')}" />`)}
        ${campo('Planes que ofrece (opcional)', `<input class="auth-input" name="planes" maxlength="200" placeholder="Ej.: Hilux 70/30, Yaris 100 %, Corolla Cross" value="${esc(v.planes ?? '')}" />`, 'sm:col-span-2')}`,
      onGuardar: (f, foto) => api('guardar_vendedor', { vendedor: {
        id: v.id, concesionario_id: con.id, nombre: f.elements.nombre.value, whatsapp: f.elements.whatsapp.value,
        telefono: f.elements.telefono.value, horario: f.elements.horario.value, planes: f.elements.planes.value,
        activo: f.elements.activo.checked, ...(foto ? { foto } : {}) } }),
    });
    f.elements.activo.checked = v.activo !== false;
  };
  const borrar = async (accion, id, nombre, texto) => {
    const ok = await ui.dialog({ title: `Borrar ${nombre}`, text: texto, ok: 'Borrar', danger: true, cancel: 'Volver' });
    if (!ok) return;
    try { await api(accion, { id }); ui.toast('Borrado'); await recargar(); } catch (ex) { ui.handleError(ex); }
  };

  $('[data-pl-nuevo-con]', box).addEventListener('click', () => abrirConcesionario());
  $$('[data-pl-editar-con]', box).forEach((b) => b.addEventListener('click', () => abrirConcesionario(concesionarios.find((c) => c.id === b.dataset.plEditarCon))));
  $$('[data-pl-nuevo-vend]', box).forEach((b) => b.addEventListener('click', () => abrirVendedor({}, concesionarios.find((c) => c.id === b.dataset.plNuevoVend))));
  $$('[data-pl-editar-vend]', box).forEach((b) => b.addEventListener('click', () => { const v = vendedores.find((x) => x.id === b.dataset.plEditarVend); abrirVendedor(v, v.con); }));
  $$('[data-pl-borrar-con]', box).forEach((b) => b.addEventListener('click', () => {
    const c = concesionarios.find((x) => x.id === b.dataset.plBorrarCon);
    borrar('borrar_concesionario', c.id, c.nombre, `Se borra el concesionario con sus ${c.vendedores.length} vendedores, fotos y clics. Si solo querés ocultarlo, editalo y destildá "Visible".`);
  }));
  $$('[data-pl-borrar-vend]', box).forEach((b) => b.addEventListener('click', () => {
    const v = vendedores.find((x) => x.id === b.dataset.plBorrarVend);
    borrar('borrar_vendedor', v.id, v.nombre, 'Se borra el vendedor con su foto y sus clics. Si solo querés ocultarlo, editalo y destildá "Visible".');
  }));
}
