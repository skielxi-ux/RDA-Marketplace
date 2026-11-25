// Ventana "Ingresar / Crear cuenta" (se arma en el build e igual en todas las páginas).
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { logoSvg } from './logo.js';
import { searchBrands } from '../data/modelos.js';

export const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];
// Marcas para "Concesionario oficial": las mismas del buscador, más "Otra".
const MARCAS = [...searchBrands, 'Otra'];

const options = (list, placeholder) => `<option value="">${esc(placeholder)}</option>${list.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join('')}`;

const field = (id, label, input, hint = '') => `
  <div class="auth-field">
    <label for="${id}" class="auth-label">${esc(label)}</label>
    ${input}
    ${hint ? `<p class="mt-1.5 text-[13px] text-ink/60">${esc(hint)}</p>` : ''}
  </div>`;

const selectBox = (id, name, opts, attrs = '') => `
  <div class="relative">
    <select id="${id}" name="${name}" class="auth-input appearance-none pr-10" ${attrs}>${opts}</select>
    ${icon('chevron-down', 'pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2')}
  </div>`;

const pinInput = (id, name, label, autocomplete) => field(id, label, `
  <div class="relative">
    <input id="${id}" name="${name}" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" minlength="6" autocomplete="${autocomplete}" required class="auth-input pr-12 tracking-[0.3em]" placeholder="••••••" />
    <button type="button" class="auth-eye" data-toggle-pin="${id}" aria-label="Mostrar PIN" aria-pressed="false">${icon('eye', 'h-5 w-5')}</button>
  </div>`);

const phoneInput = (id, label, hint) => field(id, label, `
  <div class="relative">
    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-ink/60">+54</span>
    <input id="${id}" name="telefono" type="tel" inputmode="tel" autocomplete="tel-national" required class="auth-input pl-14" placeholder="381 555-1234" maxlength="20" />
  </div>`, hint);

const errorBox = () => `<p class="auth-error" data-auth-error role="alert" hidden>${icon('circle-alert', 'mt-0.5 h-4 w-4 shrink-0')}<span></span></p>`;

const submit = (label) => `
  <button type="submit" class="btn-primary h-[54px] w-full text-[16px]" data-auth-submit>
    <span data-label>${esc(label)}</span>${icon('loader-circle', 'hidden h-5 w-5 animate-spin')}
  </button>`;

export const renderAuthModal = () => `
<div id="auth" class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" hidden>
  <div class="auth-backdrop" data-auth-close></div>
  <div class="auth-panel">
    <div class="flex items-center justify-between border-b border-line px-6 py-4 sm:px-8">
      <button type="button" class="round-nav" data-auth-back aria-label="Volver" hidden>${icon('arrow-left', 'h-4 w-4')}</button>
      <span class="flex-1" data-auth-logo>${logoSvg('h-7 w-auto')}</span>
      <button type="button" class="round-nav" data-auth-close aria-label="Cerrar">${icon('x', 'h-4 w-4')}</button>
    </div>

    <div class="overflow-y-auto px-6 pb-8 pt-6 sm:px-8">
      <h2 id="auth-title" class="text-[26px] font-bold leading-tight">Ingresá a tu cuenta</h2>
      <p class="mt-1.5 text-[15px] text-ink/70" data-auth-sub>Publicá, editá y seguí tus autos.</p>

      <div class="tabs-brand mt-6 flex gap-7 border-b border-line" role="tablist" aria-label="Ingresar o crear cuenta" data-auth-tabs>
        <button type="button" role="tab" id="auth-tab-login" class="tab-btn is-active" aria-selected="true" data-auth-tab="login">Ingresar</button>
        <button type="button" role="tab" id="auth-tab-registro" class="tab-btn" aria-selected="false" tabindex="-1" data-auth-tab="registro">Crear cuenta</button>
      </div>

      <!-- INGRESAR -->
      <form class="auth-view mt-6 space-y-5" data-view="login" novalidate>
        ${phoneInput('login-tel', 'Celular')}
        ${pinInput('login-pin', 'pin', 'PIN de 6 números', 'current-password')}
        ${errorBox()}
        ${submit('Ingresar')}
        <details class="text-[14px] text-ink/70">
          <summary class="cursor-pointer font-medium text-ink underline-offset-4 hover:text-brand hover:underline">¿Olvidaste tu PIN?</summary>
          <p class="mt-2 leading-[1.6]">Por seguridad no lo enviamos por mensaje. Escribinos desde el celular de tu cuenta y te ayudamos a crear uno nuevo.</p>
        </details>
      </form>

      <!-- CREAR CUENTA · paso 1: tipo -->
      <div class="auth-view mt-6" data-view="tipo" hidden>
        <p class="mb-4 text-[16px] font-medium">¿Cómo vas a usar Red de Autos?</p>
        <div class="grid gap-4">
          <button type="button" class="auth-type group" data-pick-type="particular">
            <span class="auth-type-icon">${icon('user', 'h-6 w-6')}</span>
            <span class="flex-1 text-left">
              <span class="block text-[18px] font-bold">Soy particular</span>
              <span class="mt-1 block text-[14px] text-ink/70">Quiero comprar o vender mi auto.</span>
            </span>
            ${icon('chevron-right', 'h-5 w-5 text-ink/40')}
          </button>
          <button type="button" class="auth-type group" data-pick-type="agencia">
            <span class="auth-type-icon">${icon('store', 'h-6 w-6')}</span>
            <span class="flex-1 text-left">
              <span class="block text-[18px] font-bold">Soy agencia o concesionario</span>
              <span class="mt-1 block text-[14px] text-ink/70">Quiero publicar mi stock y recibir compradores.</span>
            </span>
            ${icon('chevron-right', 'h-5 w-5 text-ink/40')}
          </button>
        </div>
      </div>

      <!-- CREAR CUENTA · paso 2: datos -->
      <form class="auth-view mt-6 space-y-5" data-view="registro" novalidate hidden>
        <input type="hidden" name="tipo" value="" />
        <!-- Campo trampa para bots: las personas no lo ven -->
        <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label for="reg-web">Sitio web</label><input id="reg-web" name="sitio_web" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <fieldset class="space-y-5" data-only="agencia">
          <legend class="auth-label">Tipo de agencia</legend>
          <div class="-mt-3 flex flex-wrap gap-2">
            <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" /><span>Concesionario oficial</span></label>
            <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" /><span>Agencia multimarca</span></label>
          </div>
          <div data-only="oficial" hidden>${field('reg-marca', 'Marca que representa', selectBox('reg-marca', 'marca_oficial', options(MARCAS, 'Elegí la marca')))}</div>
          ${field('reg-cuit', 'CUIT', '<input id="reg-cuit" name="cuit" type="text" inputmode="numeric" autocomplete="off" maxlength="13" class="auth-input" placeholder="30-12345678-9" />', 'Lo usamos para verificar la agencia. No se muestra en el sitio.')}
        </fieldset>

        ${field('reg-nombre', 'Nombre y apellido', '<input id="reg-nombre" name="nombre" type="text" autocomplete="name" maxlength="80" required class="auth-input" placeholder="Juan Pérez" />')}

        <div class="grid gap-5 sm:grid-cols-2">
          ${field('reg-provincia', 'Provincia', selectBox('reg-provincia', 'provincia', options(PROVINCIAS, 'Elegí la provincia')))}
          ${field('reg-ciudad', 'Ciudad', '<input id="reg-ciudad" name="ciudad" type="text" autocomplete="address-level2" maxlength="60" class="auth-input" placeholder="San Miguel de Tucumán" />')}
        </div>

        ${phoneInput('reg-tel', 'Celular con WhatsApp', 'Con código de área, sin 0 ni 15. Con este número vas a ingresar.')}
        <div class="grid gap-5 sm:grid-cols-2">
          ${pinInput('reg-pin', 'pin', 'Elegí un PIN de 6 números', 'new-password')}
          ${pinInput('reg-pin2', 'pin2', 'Repetí el PIN', 'new-password')}
        </div>

        <label class="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5]">
          <input type="checkbox" name="acepto" class="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-brand" required />
          <span>Acepto los <a href="./#terminos" class="font-medium text-brand underline-offset-4 hover:underline">términos y condiciones</a> y la <a href="./#privacidad" class="font-medium text-brand underline-offset-4 hover:underline">política de privacidad</a>.</span>
        </label>

        ${errorBox()}
        ${submit('Crear mi cuenta')}
      </form>

      <!-- LISTO -->
      <div class="auth-view mt-8 text-center" data-view="listo" hidden>
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EEF1FB] text-brand">${icon('circle-check', 'h-8 w-8')}</span>
        <p class="mt-5 text-[22px] font-bold" data-listo-title>¡Listo!</p>
        <p class="mx-auto mt-2 max-w-[360px] text-[15px] leading-[1.6] text-ink/70" data-listo-text></p>
        <button type="button" class="btn-primary mt-7 h-[54px] w-full" data-auth-close>Seguir navegando</button>
      </div>
    </div>
  </div>
</div>`;
