// Formulario "Perfil de la agencia" (Mi cuenta). Plantilla pura: recibe el perfil y devuelve HTML.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { searchBrands } from '../data/modelos.js';
import { PROVINCIAS } from '../lib/carga.js';
import { fotoUrl } from '../lib/fotos.js';

const fmtCuit = (c) => (/^\d{11}$/.test(c ?? '') ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : c ?? '');
const fmtTel = (t) => String(t ?? '').replace(/^549(\d+)$/, '$1');

const field = (id, label, input, hint = '') => `
  <div>
    <label for="${id}" class="auth-label">${esc(label)}</label>
    ${input}
    ${hint ? `<p class="mt-1.5 text-[13px] text-ink/60">${hint}</p>` : ''}
  </div>`;
const input = (id, name, value, attrs = '') => `<input id="${id}" name="${name}" value="${esc(value ?? '')}" class="auth-input" ${attrs} />`;
const select = (id, name, opts) => `
  <div class="relative">
    <select id="${id}" name="${name}" class="auth-input appearance-none pr-10">${opts}</select>
    ${icon('chevron-down', 'pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2')}
  </div>`;
const opciones = (lista, actual, vacio = '') =>
  (vacio ? `<option value="">${esc(vacio)}</option>` : '') + lista.map((v) => `<option value="${esc(v)}"${v === actual ? ' selected' : ''}>${esc(v)}</option>`).join('');

const ETQ = { nombre: 'Nombre comercial', cuit: 'CUIT', agencia_tipo: 'Tipo', marca_oficial: 'Marca oficial' };
const valor = (k, v) => (v == null || v === '' ? '—' : k === 'cuit' ? fmtCuit(v) : k === 'agencia_tipo' ? (v === 'oficial' ? 'Concesionario oficial' : 'Agencia multimarca') : String(v));

/** Cambios que esperan revisión (nombre, CUIT o tipo). */
export const renderPendientes = (p) => {
  const cambios = p.cambios_pendientes && typeof p.cambios_pendientes === 'object' ? Object.entries(p.cambios_pendientes).filter(([k]) => ETQ[k]) : [];
  if (!cambios.length) return '';
  return `
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${icon('clipboard-check', 'h-4 w-4')} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${cambios.map(([k, v]) => `<li>${esc(ETQ[k])}: <b>${esc(valor(k, v))}</b> <span class="opacity-75">(hoy: ${esc(valor(k, p[k]))})</span></li>`).join('')}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`;
};

export const renderLogo = (p) => {
  const url = fotoUrl(p.logo ?? '');
  return url
    ? `<img src="${esc(url)}" alt="Logo de ${esc(p.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`
    : `<span class="grid h-full w-full place-items-center text-ink/35">${icon('store', 'h-10 w-10')}</span>`;
};

export function renderPerfilForm(p) {
  // Lo que pidió cambiar y espera revisión se muestra en el formulario (así no lo vuelve a escribir)
  const pend = p.cambios_pendientes ?? {};
  const v = (k) => (Object.hasOwn(pend, k) ? pend[k] : p[k]);
  const tipo = v('agencia_tipo') === 'oficial' ? 'oficial' : 'multimarca';
  return `
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${renderLogo(p)}</div>
        <p class="mt-3 text-[13px] text-ink/60">JPG, PNG o WebP. Lo recortás en cuadrado antes de guardarlo.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label class="btn-primary h-[48px] cursor-pointer justify-center">${icon('images', 'h-4 w-4')} <span data-logo-label>${p.logo ? 'Cambiar logo' : 'Subir logo'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-logo-input /></label>
          <button type="button" class="btn-outline h-[44px] justify-center" data-logo-quitar ${p.logo ? '' : 'hidden'}>${icon('x', 'h-4 w-4')} Quitar logo</button>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <form class="space-y-8" data-perfil-form novalidate>
      <div data-perfil-pendientes>${renderPendientes(p)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${icon('shield-check', 'mt-0.5 h-4 w-4 shrink-0 text-brand')} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${field('pf-nombre', 'Nombre comercial', input('pf-nombre', 'nombre', v('nombre'), 'maxlength="80" required autocomplete="organization"'))}
          ${field('pf-cuit', 'CUIT', input('pf-cuit', 'cuit', fmtCuit(v('cuit')), 'inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"'))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${tipo === 'multimarca' ? 'checked' : ''} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${tipo === 'oficial' ? 'checked' : ''} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${tipo === 'oficial' ? '' : 'hidden'}>
            ${field('pf-marca', 'Marca que representa', select('pf-marca', 'marca_oficial', opciones(searchBrands, v('marca_oficial'), 'Elegí la marca')))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${field('pf-ciudad', 'Ciudad', input('pf-ciudad', 'ciudad', p.ciudad, 'maxlength="60" required autocomplete="address-level2"'))}
          ${field('pf-provincia', 'Provincia', select('pf-provincia', 'provincia', opciones(PROVINCIAS, p.provincia, 'Elegí la provincia')))}
          ${field('pf-direccion', 'Dirección del local', input('pf-direccion', 'direccion', p.direccion, 'maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"'))}
          ${field('pf-horario', 'Horario de atención', input('pf-horario', 'horario', p.horario, 'maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"'))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${field('pf-wsp', 'WhatsApp para consultas', input('pf-wsp', 'whatsapp_ventas', fmtTel(p.whatsapp_ventas), 'type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"'), 'Si lo dejás vacío, las consultas llegan al celular con el que ingresás.')}
          ${field('pf-email', 'Email', input('pf-email', 'email', p.email, 'type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"'))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${field('pf-desc', 'Descripción', `<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${esc(p.descripcion ?? '')}</textarea>`, '<span data-desc-count>0</span>/600')}
          </div>
          ${field('pf-web', 'Sitio web', input('pf-web', 'sitio_web', p.sitio_web, 'type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"'))}
          ${field('pf-ig', 'Instagram', input('pf-ig', 'instagram', p.instagram ? `@${p.instagram}` : '', 'maxlength="60" placeholder="@tuagencia"'))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Vendedores independientes</legend>
        <p class="text-[14px] leading-[1.6] text-ink/70">Son personas que te acercan un cliente para uno de tus autos y cobran una comisión si se concreta la venta. Si aceptás, tu agencia aparece con la etiqueta <b>"Acepta vendedores independientes"</b> en el listado de agencias. La comisión solo la ven ellos.</p>
        <div class="mt-4 grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend class="vd-label">¿Aceptás trabajar con vendedores independientes?</legend>
            <div class="flex gap-2">
              <label class="filter-pill"><input type="radio" name="acepta_independientes" value="si" class="sr-only"${p.acepta_independientes ? ' checked' : ''} /><span>Sí</span></label>
              <label class="filter-pill"><input type="radio" name="acepta_independientes" value="no" class="sr-only"${p.acepta_independientes ? '' : ' checked'} /><span>No</span></label>
            </div>
          </fieldset>
          <div data-pf-comision${p.acepta_independientes ? '' : ' hidden'}>
            ${field('pf-comision', 'Comisión que pagás', `<select id="pf-comision" name="comision_independientes" class="auth-input">${[1, 2, 3, 4].map((n) => `<option value="${n}"${Number(p.comision_independientes ?? 2) === n ? ' selected' : ''}>${n} %</option>`).join('')}</select>`, 'Sobre el precio final de venta del auto.')}
          </div>
        </div>
      </fieldset>

      <p class="auth-error" role="alert" data-perfil-error hidden></p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-perfil-guardar>${icon('check', 'h-4 w-4')} <span>Guardar cambios</span></button>
        <a href="#" class="link-view justify-center" data-perfil-ver target="_blank" rel="noopener">Ver mi página ${icon('arrow-up-right', 'h-4 w-4')}</a>
        <p class="text-[14px] text-ok sm:ml-auto" role="status" data-perfil-ok></p>
      </div>
    </form>
  </div>

  <!-- Recorte del logo -->
  <div class="pub-overlay" data-crop hidden role="dialog" aria-modal="true" aria-labelledby="crop-title">
    <div class="w-full max-w-[420px] rounded-[24px] bg-white p-6">
      <p id="crop-title" class="text-[20px] font-bold">Acomodá tu logo</p>
      <p class="mt-1 text-[14px] text-ink/70">Arrastrá para mover y usá la barra para acercar o alejar.</p>
      <div class="crop-stage mx-auto mt-5" data-crop-stage><canvas width="600" height="600" data-crop-canvas aria-label="Vista previa del logo"></canvas></div>
      <label class="mt-5 flex items-center gap-3 text-[14px]">
        <span class="sr-only">Acercar o alejar</span>${icon('search', 'h-4 w-4 text-ink/50')}
        <input type="range" min="1" max="4" step="0.01" value="1" class="w-full accent-[#405FF2]" data-crop-zoom />
      </label>
      <div class="mt-6 flex gap-3">
        <button type="button" class="btn-outline h-[48px] flex-1 justify-center" data-crop-cancel>Cancelar</button>
        <button type="button" class="btn-primary h-[48px] flex-1 justify-center" data-crop-ok>${icon('check', 'h-4 w-4')} Guardar logo</button>
      </div>
    </div>
  </div>`;
}
