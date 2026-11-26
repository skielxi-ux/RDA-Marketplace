// Admin → Partners: alta, edición, pausa y baja de empresas del rubro, con logo y clics a su WhatsApp.
import { $, $$ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { comprimir, formatoFotos, logoPartnerUrl } from '../lib/fotos.js';
import { RUBROS } from '../data/partners.js';

const fmtWa = (t) => String(t || '').replace(/^549(\d{3})(\d{3})(\d{4})$/, '381 $2-$3').replace(/^381 (\d{3}-\d{4})$/, '381 $1');
const campo = (label, html, extra = '') => `<label class="block ${extra}"><span class="auth-label">${label}</span>${html}</label>`;

/**
 * Pinta la pestaña Partners. `api(accion, extra)` llama a la función mkt-partners con la sesión del admin.
 * `ui` = { toast, handleError, dialog, sb }.
 */
export async function renderPartners(box, api, ui) {
  box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando partners…</p>`;
  const { partners } = await api('listar');
  const activos = partners.filter((p) => p.activo).length;

  box.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-[22px] font-bold">Partners</h2>
        <p class="mt-1 text-[14px] text-ink/60">${partners.length} cargados · ${activos} visibles en <a href="./partners.html" target="_blank" rel="noopener" class="text-brand underline">la página de Partners</a>. Los clics son las veces que tocaron su WhatsApp (uno por persona por día).</p>
      </div>
      <button type="button" class="btn-primary h-[46px] !px-5" data-pa-nuevo>${icon('plus', 'h-4 w-4')} Nuevo partner</button>
    </div>
    <div data-pa-form class="mt-6" hidden></div>
    <ul class="mt-6 grid gap-3">
      ${partners.length ? partners.map((p) => `
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center ${p.activo ? '' : 'opacity-60'}">
        <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-1.5">${logoPartnerUrl(p.logo) ? `<img src="${esc(logoPartnerUrl(p.logo))}" alt="" class="max-h-full max-w-full object-contain" />` : `<span class="text-[18px] font-bold text-brand">${esc(p.nombre.slice(0, 2).toUpperCase())}</span>`}</span>
        <div class="min-w-0 flex-1 text-[14px]">
          <p class="text-[16px] font-bold">${esc(p.nombre)} ${p.activo ? '' : '<span class="ml-1 rounded-full bg-soft px-2 py-0.5 text-[12px] font-medium text-ink/70">Pausado</span>'}</p>
          <p class="text-ink/70">${esc(p.rubro)}${p.ciudad ? ` · ${esc(p.ciudad)}` : ''} · WhatsApp ${esc(fmtWa(p.whatsapp))}</p>
          ${p.beneficio ? `<p class="mt-0.5 text-[#1E6B34]">${icon('tag', 'inline h-3.5 w-3.5')} ${esc(p.beneficio)}</p>` : ''}
        </div>
        <div class="flex shrink-0 items-center gap-5">
          <span class="text-center"><b class="block text-[20px] leading-none">${esc(p.clics.mes)}</b><small class="text-[12px] text-ink/60">clics 30 días</small></span>
          <span class="text-center"><b class="block text-[20px] leading-none">${esc(p.clics.total)}</b><small class="text-[12px] text-ink/60">total</small></span>
          <div class="flex gap-2">
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px]" data-pa-editar="${esc(p.id)}">Editar</button>
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-pa-borrar="${esc(p.id)}" aria-label="Borrar ${esc(p.nombre)}">${icon('x', 'h-4 w-4')}</button>
          </div>
        </div>
      </li>`).join('') : '<li class="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-ink/60">Todavía no cargaste partners. Tocá "Nuevo partner".</li>'}
    </ul>`;

  const formBox = $('[data-pa-form]', box);
  const abrir = (p = {}) => {
    const rubroLista = RUBROS.includes(p.rubro) || !p.rubro;
    formBox.innerHTML = `
      <form class="rounded-2xl border border-line bg-soft p-5 sm:p-6" novalidate>
        <h3 class="text-[18px] font-bold">${p.id ? `Editar ${esc(p.nombre)}` : 'Nuevo partner'}</h3>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          ${campo('Nombre de la empresa', `<input class="auth-input" name="nombre" maxlength="80" required value="${esc(p.nombre ?? '')}" />`)}
          ${campo('Rubro', `<select class="auth-input" name="rubro_sel">${RUBROS.map((r) => `<option ${r === p.rubro ? 'selected' : ''}>${esc(r)}</option>`).join('')}<option value="__otro" ${rubroLista ? '' : 'selected'}>Otro…</option></select>
            <input class="auth-input mt-2" name="rubro_otro" maxlength="40" placeholder="Escribí el rubro" value="${rubroLista ? '' : esc(p.rubro)}" ${rubroLista ? 'hidden' : ''} />`)}
          ${campo('WhatsApp', `<input class="auth-input" name="whatsapp" inputmode="tel" required placeholder="381 555-1234" value="${esc(p.whatsapp ? fmtWa(p.whatsapp) : '')}" />`)}
          ${campo('Ciudad (opcional)', `<input class="auth-input" name="ciudad" maxlength="60" value="${esc(p.ciudad ?? '')}" />`)}
          ${campo('Instagram (opcional)', `<input class="auth-input" name="instagram" maxlength="31" placeholder="@usuario" value="${esc(p.instagram ? `@${p.instagram}` : '')}" />`)}
          ${campo('Dirección (opcional)', `<input class="auth-input" name="direccion" maxlength="120" value="${esc(p.direccion ?? '')}" />`)}
          ${campo('Beneficio para la red (opcional)', `<input class="auth-input" name="beneficio" maxlength="120" placeholder="Ej.: 10% off presentando Red de Autos" value="${esc(p.beneficio ?? '')}" />`, 'sm:col-span-2')}
          <div class="sm:col-span-2">
            <span class="auth-label">Logo</span>
            <div class="flex flex-wrap items-center gap-4">
              <span class="grid h-20 w-20 place-items-center overflow-hidden rounded-xl border border-line bg-white p-2" data-pa-prev>${logoPartnerUrl(p.logo) ? `<img src="${esc(logoPartnerUrl(p.logo))}" alt="" class="max-h-full max-w-full object-contain" />` : `<span class="text-[12px] text-ink/50">Sin logo</span>`}</span>
              <label class="btn-outline h-[44px] cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-pa-logo /> ${icon('images', 'h-4 w-4')} ${p.logo ? 'Cambiar logo' : 'Subir logo'}</label>
              <span class="text-[13px] text-ink/60">Ideal: cuadrado, fondo blanco o transparente.</span>
            </div>
          </div>
          <label class="flex items-center gap-2 text-[15px] sm:col-span-2"><input type="checkbox" name="activo" class="h-4 w-4" ${p.activo === false ? '' : 'checked'} /> Visible en la página de Partners</label>
        </div>
        <p class="mt-4 hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318]" data-pa-error></p>
        <div class="mt-5 flex flex-wrap gap-2">
          <button type="submit" class="btn-primary h-[46px] !px-6">${icon('check', 'h-4 w-4')} <span data-pa-label>Guardar</span></button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-pa-cancelar>Cancelar</button>
        </div>
      </form>`;
    formBox.hidden = false;
    formBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const f = $('form', formBox);
    let archivo = null;
    f.elements.rubro_sel.addEventListener('change', () => { f.elements.rubro_otro.hidden = f.elements.rubro_sel.value !== '__otro'; });
    $('[data-pa-logo]', f).addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) { ui.toast('El logo tiene que ser JPG, PNG o WebP de hasta 10 MB', false); return; }
      archivo = file;
      $('[data-pa-prev]', f).innerHTML = `<img src="${esc(URL.createObjectURL(file))}" alt="" class="max-h-full max-w-full object-contain" />`;
    });
    $('[data-pa-cancelar]', f).addEventListener('click', () => { formBox.hidden = true; formBox.innerHTML = ''; });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = $('[data-pa-error]', f);
      const fallo = (m) => { errBox.textContent = m; errBox.classList.remove('hidden'); };
      errBox.classList.add('hidden');
      const v = (k) => f.elements[k].value.trim();
      const rubro = v('rubro_sel') === '__otro' ? v('rubro_otro') : v('rubro_sel');
      if (v('nombre').length < 2) return fallo('Escribí el nombre de la empresa.');
      if (rubro.length < 2) return fallo('Escribí el rubro.');
      const btn = $('[type=submit]', f), label = $('[data-pa-label]', f);
      btn.disabled = true;
      try {
        const partner = { id: p.id, nombre: v('nombre'), rubro, whatsapp: v('whatsapp'), ciudad: v('ciudad'), instagram: v('instagram'),
          direccion: v('direccion'), beneficio: v('beneficio'), activo: f.elements.activo.checked };
        if (archivo) {
          label.textContent = 'Subiendo logo…';
          const formato = await formatoFotos();
          const blob = await comprimir(archivo, formato);
          const { path, token } = await api('url_logo', { formato });
          const { error } = await ui.sb.storage.from('mkt-fotos').uploadToSignedUrl(path, token, blob, { contentType: formato === 'jpg' ? 'image/jpeg' : 'image/webp' });
          if (error) throw new Error('No se pudo subir el logo. Probá de nuevo.');
          partner.logo = path;
        }
        label.textContent = 'Guardando…';
        await api('guardar', { partner });
        ui.toast(p.id ? 'Partner actualizado' : 'Partner agregado');
        await renderPartners(box, api, ui);
      } catch (ex) { fallo(ex.message); btn.disabled = false; label.textContent = 'Guardar'; }
    });
  };

  $('[data-pa-nuevo]', box).addEventListener('click', () => abrir());
  $$('[data-pa-editar]', box).forEach((b) => b.addEventListener('click', () => abrir(partners.find((x) => x.id === b.dataset.paEditar))));
  $$('[data-pa-borrar]', box).forEach((b) => b.addEventListener('click', async () => {
    const p = partners.find((x) => x.id === b.dataset.paBorrar);
    const ok = await ui.dialog({ title: 'Borrar partner', text: `${p.nombre} deja de aparecer en la página de Partners y se borran su logo y sus clics. Si solo querés ocultarlo un tiempo, editalo y destildá "Visible".`, ok: 'Borrar', danger: true, cancel: 'Volver' });
    if (!ok) return;
    try { await api('borrar', { id: p.id }); ui.toast('Partner borrado'); await renderPartners(box, api, ui); } catch (ex) { ui.handleError(ex); }
  }));
}
