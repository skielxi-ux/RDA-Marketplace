// Partes comunes a todas las páginas: header, menú lateral y botón "volver arriba".
import { logoSvg } from './logo.js';
import { renderAuthModal } from './auth.js';
import { renderSocial } from './social.js';
import { SITE } from '../data/site.js';
import { esc } from '../lib/html.js';

export const renderSiteHeader = () => `
  <!-- ================= HEADER ================= -->
  <div class="h-[72px] sm:h-[86px]" aria-hidden="true"></div>
  <header id="site-header" class="site-header absolute inset-x-0 top-0 z-40 border-b border-line bg-white">
    <div class="container-x flex h-[72px] items-center justify-between gap-3 sm:h-[86px]">
      <div class="flex flex-1 items-center gap-8">
        <button id="menu-open" type="button" class="group flex items-center gap-2.5 font-medium transition-colors duration-300 hover:text-brand"
          aria-label="Abrir menú" aria-controls="drawer" aria-expanded="false">
          <span class="flex flex-col gap-[5px]" aria-hidden="true">
            <span class="block h-[1.5px] w-5 bg-current"></span>
            <span class="block h-[1.5px] w-3.5 bg-current transition-all duration-300 group-hover:w-5"></span>
          </span>
          <span class="hidden sm:inline">Menú</span>
        </button>
        <a href="tel:${esc(SITE.phone.tel)}" class="hidden items-center gap-2 font-medium transition-colors duration-300 hover:text-brand md:flex">
          <i data-icon="phone" class="h-4 w-4"></i> ${esc(SITE.phone.display)}
        </a>
      </div>

      <a href="./" class="flex shrink-0 items-center" aria-label="Red de Autos, ir al inicio">${logoSvg('h-8 w-auto sm:h-10 lg:h-11')}</a>

      <div class="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <button type="button" data-auth-open aria-haspopup="dialog" aria-expanded="false" class="flex items-center gap-2 font-medium transition-colors duration-300 hover:text-brand max-sm:h-10 max-sm:w-10 max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-line" >
          <i data-icon="user" class="h-4 w-4"></i> <span data-auth-label class="max-w-[140px] truncate max-sm:sr-only">Ingresar</span>
        </button>
        <a href="./mi-cuenta.html#colegas" class="campanita" data-campanita hidden aria-label="Red de colegas: pedidos nuevos">
          <i data-icon="bell" class="h-[18px] w-[18px]"></i><span class="campanita-badge" data-campanita-n hidden></span>
        </a>
        <div class="hidden items-center gap-1.5 md:flex" role="group" aria-label="Nuestras redes">${renderSocial()}</div>
      </div>
    </div>
  </header>

  <!-- ================= MENÚ LATERAL ================= -->
  <div id="drawer-backdrop" class="drawer-backdrop fixed inset-0 z-50 bg-ink/50"></div>
  <aside id="drawer" class="drawer fixed inset-y-0 left-0 z-50 flex w-[380px] max-w-[88vw] flex-col overflow-y-auto bg-white p-6 sm:p-8" aria-label="Menú principal">
    <div class="mb-8 flex items-center justify-between">
      <p class="text-[20px] font-medium">Menú principal</p>
      <button id="menu-close" type="button" class="round-nav" aria-label="Cerrar menú"><i data-icon="x" class="h-4 w-4"></i></button>
    </div>
    <nav aria-label="Principal" class="flex flex-col">
      <a href="./" class="menu-link">Inicio</a>
      <a href="./autos.html" class="menu-link">Todos los autos <i data-icon="chevron-right" class="h-4 w-4"></i></a>
      <a href="./autos.html?condicion=0km" class="menu-link">Autos 0km <i data-icon="chevron-right" class="h-4 w-4"></i></a>
      <a href="./autos.html?condicion=usados" class="menu-link">Autos usados <i data-icon="chevron-right" class="h-4 w-4"></i></a>
      <a href="./autos.html?vendedor=oficial" class="menu-link">Concesionarios oficiales</a>
      <a href="./autos.html?vendedor=multimarca" class="menu-link">Agencias multimarca</a>
      <a href="./#vender" class="menu-link">Vendé tu auto</a>
      <a href="./favoritos.html" class="menu-link">Mis favoritos</a>
      <a href="./agencias.html" class="menu-link">Agencias</a>
      <a href="./como-funciona.html" class="menu-link">Cómo funciona</a>
      <a href="./preguntas-frecuentes.html" class="menu-link">Preguntas frecuentes</a>
      <a href="./quienes-somos.html" class="menu-link">Quiénes somos</a>
      <a href="#contacto" class="menu-link">Contacto</a>
    </nav>
    <div class="mt-8 flex items-center gap-2" role="group" aria-label="Nuestras redes">${renderSocial('!h-11 !w-11 border border-line')}</div>
    <div class="mt-auto space-y-3 pt-8">
      <a href="./#agencias" class="btn-primary h-[55px] w-full">Sumá tu agencia <i data-icon="arrow-right" class="h-4 w-4"></i></a>
      <button type="button" data-auth-open class="btn-outline h-[55px] w-full justify-center"><i data-icon="user" class="h-4 w-4"></i> <span data-auth-label>Ingresar</span></button>
    </div>
  </aside>`;

/** Menú de la cuenta (cuando hay sesión iniciada) + ventana de ingreso. */
export const renderAccountUi = () => `
  <div id="user-menu" class="user-menu" role="menu" aria-label="Mi cuenta" hidden>
    <div class="border-b border-line px-4 pb-3 pt-1">
      <p class="truncate text-[16px] font-bold" data-user-name></p>
      <p class="text-[13px] text-ink/60" data-user-type></p>
      <p class="mt-2 rounded-lg bg-[#FFF6E5] px-2.5 py-1.5 text-[12px] text-[#8A5A00]" data-user-pending hidden>Tu agencia está en revisión.</p>
    </div>
    <a href="./mi-cuenta.html" role="menuitem" class="mt-1 flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-soft hover:text-brand">
      <i data-icon="user" class="h-4 w-4"></i> Mi cuenta
    </a>
    <a href="./mi-cuenta.html#buscados" role="menuitem" class="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-soft hover:text-brand">
      <i data-icon="search" class="h-4 w-4"></i> +Buscados
    </a>
    <a href="./favoritos.html" role="menuitem" class="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-soft hover:text-brand">
      <i data-icon="heart" class="h-4 w-4"></i> Mis favoritos
    </a>
    <button type="button" role="menuitem" data-logout class="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-soft hover:text-brand">
      <i data-icon="log-out" class="h-4 w-4"></i> Cerrar sesión
    </button>
  </div>
  ${renderAuthModal()}`;

export const renderToTop = () => `${renderAccountUi()}
  <button id="to-top" type="button" class="to-top fixed bottom-5 right-5 z-30 grid h-[46px] w-[46px] place-items-center rounded-full bg-brand text-white sm:bottom-[30px] sm:right-[30px]" aria-label="Volver arriba">
    <i data-icon="arrow-up" class="h-4 w-4"></i>
  </button>`;
