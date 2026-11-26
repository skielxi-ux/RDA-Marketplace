// Red de colegas (Mi cuenta): formulario para pedir un auto que no tenés y tarjetas de los pedidos de otras agencias.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { searchBrands, SEARCH_MAKES } from '../data/modelos.js';
import { fotoUrl } from '../lib/fotos.js';

const ANIO_MAX = new Date().getFullYear() + 1;
const ANIOS = Array.from({ length: ANIO_MAX - 1989 }, (_, i) => ANIO_MAX - i);
const miles = (n) => Math.round(Number(n)).toLocaleString('es-AR');
const initials = (n) => String(n).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const select = (id, name, opts, label) => `
  <div>
    <label for="${id}" class="auth-label">${esc(label)}</label>
    <div class="relative">
      <select id="${id}" name="${name}" class="auth-input appearance-none pr-10">${opts}</select>
      ${icon('chevron-down', 'pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2')}
    </div>
  </div>`;
const input = (id, name, label, attrs = '') => `
  <div>
    <label for="${id}" class="auth-label">${esc(label)}</label>
    <input id="${id}" name="${name}" class="auth-input" ${attrs} />
  </div>`;
const opts = (lista, vacio) => `<option value="">${esc(vacio)}</option>` + lista.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join('');

/** Lista de modelos de una marca (para sugerir mientras escribe). */
export const modelosDe = (marca) => SEARCH_MAKES[marca] ?? [];

export function renderColegas() {
  return `
  <div class="space-y-8">
    <div data-tg-box></div>

    <!-- Nuevo pedido -->
    <details class="colega-form group rounded-[20px] border border-line bg-white" data-colega-details>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <span class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">${icon('plus', 'h-5 w-5')}</span>
          <span><span class="block text-[18px] font-bold">Pedir un auto a los colegas</span>
          <span class="block text-[14px] text-ink/70">¿Un cliente busca algo que no tenés? Avisale a todas las agencias de la red.</span></span>
        </span>
        ${icon('chevron-down', 'h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180')}
      </summary>
      <form class="grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" data-colega-form novalidate>
        ${select('cg-marca', 'marca', opts(searchBrands, 'Elegí la marca'), 'Marca *')}
        <div>
          <label for="cg-modelo" class="auth-label">Modelo *</label>
          <input id="cg-modelo" name="modelo" list="cg-modelos" maxlength="60" required class="auth-input" placeholder="Ej.: Corolla" autocomplete="off" />
          <datalist id="cg-modelos"></datalist>
        </div>
        ${input('cg-version', 'version', 'Versión', 'maxlength="80" placeholder="Ej.: XEi CVT (opcional)"')}
        ${select('cg-desde', 'anio_desde', opts(ANIOS, 'Indistinto'), 'Año desde')}
        ${select('cg-hasta', 'anio_hasta', opts(ANIOS, 'Indistinto'), 'Año hasta')}
        ${input('cg-km', 'km_max', 'Kilometraje máximo', 'inputmode="numeric" maxlength="9" placeholder="Ej.: 80.000"')}
        ${input('cg-color', 'color', 'Color', 'maxlength="30" placeholder="Indistinto"')}
        ${select('cg-caja', 'transmision', opts(['Manual', 'Automática'], 'Indistinto'), 'Caja')}
        ${select('cg-comb', 'combustible', opts(['Nafta', 'Diésel', 'Híbrido', 'Eléctrico', 'GNC'], 'Indistinto'), 'Combustible')}
        <div>
          <label for="cg-presu" class="auth-label">Presupuesto del cliente</label>
          <div class="flex gap-2">
            <div class="relative w-[96px] shrink-0">
              <select name="moneda" aria-label="Moneda" class="auth-input appearance-none pr-8"><option value="ARS">$</option><option value="USD">USD</option></select>
              ${icon('chevron-down', 'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2')}
            </div>
            <input id="cg-presu" name="presupuesto" inputmode="numeric" maxlength="15" class="auth-input" placeholder="Opcional" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="cg-com" class="auth-label">Comentario</label>
          <input id="cg-com" name="comentario" maxlength="400" class="auth-input" placeholder="Ej.: lo necesito para esta semana, toma usado" />
        </div>
        <p class="auth-error sm:col-span-2 lg:col-span-3" role="alert" data-colega-error hidden></p>
        <div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-3">
          <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-colega-enviar>${icon('handshake', 'h-4 w-4')} <span>Enviar a los colegas</span></button>
          <p class="text-[14px] text-ink/60">Le llega a todas las agencias de la red en la campanita y por Telegram. Queda activo hasta que lo cierres.</p>
        </div>
      </form>
    </details>

    <!-- Pedidos -->
    <div>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="tabs-brand flex gap-6 border-b border-line" role="tablist" aria-label="Pedidos">
          <button type="button" role="tab" aria-selected="true" class="tab-btn is-active" data-cg-tab="todos">Pedidos de colegas</button>
          <button type="button" role="tab" aria-selected="false" class="tab-btn" data-cg-tab="mios">Mis pedidos</button>
        </div>
        <label class="relative block md:w-[340px]"><span class="sr-only">Buscar en los pedidos</span>
          <input type="search" data-cg-q placeholder="Buscar marca, modelo o agencia" class="auth-input !pl-10" />
          ${icon('search', 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50')}
        </label>
      </div>
      <p class="mt-4 text-[14px] text-ink/60" data-cg-count aria-live="polite"></p>
      <ul class="mt-4 grid gap-4 lg:grid-cols-2" data-cg-list></ul>
    </div>
  </div>`;
}

export function renderTelegram(estado) {
  if (estado?.vinculado) {
    return `<p class="flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[14px] text-ok">${icon('circle-check', 'h-4 w-4')} Los pedidos te llegan también por Telegram${estado.como ? ` (${esc(estado.como)})` : ''}.</p>`;
  }
  return `
    <div class="flex flex-col gap-4 rounded-2xl bg-[#EEF1FB] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[15px]"><b>Recibí los pedidos en Telegram.</b> <span class="text-ink/70">Conectá tu cuenta una sola vez con el bot de Red de Autos.</span></p>
      <button type="button" class="btn-primary h-[46px] shrink-0 justify-center" data-tg-conectar>${icon('telegram', 'h-4 w-4')} Conectar Telegram</button>
    </div>`;
}

const hace = (iso) => {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
};

export function renderPedido(p) {
  const anios = p.anio_desde && p.anio_hasta ? (p.anio_desde === p.anio_hasta ? `${p.anio_desde}` : `${p.anio_desde} a ${p.anio_hasta}`)
    : p.anio_desde ? `Desde ${p.anio_desde}` : p.anio_hasta ? `Hasta ${p.anio_hasta}` : '';
  const chips = [
    anios && [icon('calendar', 'h-3.5 w-3.5'), anios],
    p.km_max != null && [icon('gauge', 'h-3.5 w-3.5'), `Hasta ${miles(p.km_max)} km`],
    p.transmision && [icon('cog', 'h-3.5 w-3.5'), p.transmision],
    p.combustible && [icon('fuel', 'h-3.5 w-3.5'), p.combustible],
    p.color && [icon('palette', 'h-3.5 w-3.5'), p.color],
  ].filter(Boolean);
  const a = p.agencia;
  const logo = fotoUrl(a.logo ?? '');
  const tel = /^\d{10,15}$/.test(a.whatsapp ?? '') ? a.whatsapp : '';
  const titulo = [p.marca, p.modelo, p.version].filter(Boolean).join(' ');
  const msg = `Hola ${a.nombre}, vi en la Red de colegas de Red de Autos que buscás ${titulo}${anios ? ` (${anios})` : ''}. Tengo uno que te puede servir.`;
  const cerrado = p.estado === 'cerrado';
  return `
  <li class="colega-card ${cerrado ? 'opacity-60' : ''}" data-pedido="${esc(p.id)}">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium uppercase tracking-wide text-brand">${p.mio ? 'Tu pedido' : 'Busca'} · <span class="normal-case tracking-normal text-ink/55">${esc(hace(p.created_at))}</span></p>
      ${cerrado ? '<span class="rounded-full bg-ink/10 px-2.5 py-0.5 text-[12px] font-medium">Cerrado</span>' : ''}
    </div>
    <h3 class="mt-1 text-[20px] font-bold leading-tight">${esc(titulo)}</h3>
    ${chips.length ? `<ul class="mt-3 flex flex-wrap gap-2">${chips.map(([ic, t]) => `<li class="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px]">${ic}${esc(t)}</li>`).join('')}</ul>` : ''}
    ${p.presupuesto ? `<p class="mt-3 text-[15px]">Presupuesto: <b>${esc(p.moneda === 'USD' ? 'USD' : '$')} ${esc(miles(p.presupuesto))}</b></p>` : ''}
    ${p.comentario ? `<p class="mt-2 text-[15px] text-ink/75">“${esc(p.comentario)}”</p>` : ''}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4">
      <a href="./agencia.html?id=${esc(encodeURIComponent(a.id))}" class="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition-colors hover:text-brand">
        ${logo ? `<img src="${esc(logo)}" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`
          : `<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[13px] font-bold text-white" aria-hidden="true">${esc(initials(a.nombre))}</span>`}
        <span class="min-w-0"><span class="block truncate font-bold">${esc(a.nombre)}</span><span class="block truncate text-[13px] text-ink/60">${esc([a.ciudad, a.provincia].filter(Boolean).join(', '))}</span></span>
      </a>
      ${p.mio
        ? (cerrado ? `<p class="text-[13px] text-ink/60">Avisado a ${esc(p.avisadas)} ${p.avisadas === 1 ? 'agencia' : 'agencias'}</p>`
          : `<div class="flex shrink-0 items-center gap-3"><span class="whitespace-nowrap text-[13px] text-ink/60">Avisado a ${esc(p.avisadas)}</span><button type="button" class="btn-outline h-[42px] whitespace-nowrap !px-4 text-[14px]" data-cg-cerrar="${esc(p.id)}">${icon('check', 'h-4 w-4')} Ya lo conseguí</button></div>`)
        : tel && !cerrado ? `<div class="flex shrink-0 gap-2">
            <a href="https://wa.me/${esc(tel)}?text=${esc(encodeURIComponent(msg))}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[44px] whitespace-nowrap !px-4 text-[14px]" data-cg-lotengo="${esc(p.id)}">${icon('message-circle', 'h-4 w-4')} ${p.respondi ? 'Escribile' : 'Lo tengo'}</a>
            <a href="tel:+${esc(tel)}" class="btn-outline h-[44px] !px-3.5" aria-label="Llamar a ${esc(a.nombre)}">${icon('phone', 'h-4 w-4')}</a>
          </div>` : ''}
    </div>
    ${p.mio && p.lo_tienen?.length ? `
    <div class="mt-4 rounded-xl bg-[#E8F5E9] p-4">
      <p class="text-[14px] font-bold text-ok">${icon('circle-check', 'mr-1 inline h-4 w-4')} ${p.lo_tienen.length === 1 ? 'Una agencia lo tiene' : `${esc(p.lo_tienen.length)} agencias lo tienen`}</p>
      <ul class="mt-2 space-y-2">${p.lo_tienen.map((x) => {
        const t = /^\d{10,15}$/.test(x.whatsapp ?? '') ? x.whatsapp : '';
        return `<li class="flex flex-wrap items-center justify-between gap-2 text-[14px]"><span><b>${esc(x.nombre)}</b>${x.ciudad ? ` · ${esc(x.ciudad)}` : ''}</span>${t ? `<a href="https://wa.me/${esc(t)}?text=${esc(encodeURIComponent(`Hola ${x.nombre}, vi que tenés un ${titulo} para mi pedido en la Red de colegas.`))}" target="_blank" rel="noopener noreferrer" class="link-view">${icon('message-circle', 'h-4 w-4')} WhatsApp</a>` : ''}</li>`;
      }).join('')}</ul>
    </div>` : ''}
    ${!p.mio && p.respondi ? `<p class="mt-3 text-[13px] text-ok">${icon('circle-check', 'mr-1 inline h-3.5 w-3.5')} Ya le avisaste que lo tenés.</p>` : ''}
  </li>`;
}
