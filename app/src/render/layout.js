// Partes comunes a todas las páginas: header, menú lateral y botón "volver arriba".
import { logoSvg } from './logo.js';

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
        <a href="tel:+543810000000" class="hidden items-center gap-2 font-medium transition-colors duration-300 hover:text-brand md:flex">
          <i data-icon="phone" class="h-4 w-4"></i> 381 000-0000
        </a>
      </div>

      <a href="./" class="flex shrink-0 items-center" aria-label="Red de Autos, ir al inicio">${logoSvg('h-8 w-auto sm:h-10 lg:h-11')}</a>

      <div class="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <a href="#ingresar" class="hidden items-center gap-2 font-medium transition-colors duration-300 hover:text-brand sm:flex">
          <i data-icon="user" class="h-4 w-4"></i> Ingresar
        </a>
        <a href="./#vender" class="btn-outline max-sm:px-3.5 max-sm:py-[7px] max-sm:text-[14px]">
          <i data-icon="plus" class="hidden h-4 w-4 sm:block"></i>Publicar<span class="hidden sm:inline">&nbsp;auto</span>
        </a>
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
      <a href="#contacto" class="menu-link">Contacto</a>
    </nav>
    <div class="mt-auto space-y-3 pt-8">
      <a href="./#agencias" class="btn-primary h-[55px] w-full">Sumá tu agencia <i data-icon="arrow-right" class="h-4 w-4"></i></a>
      <a href="#ingresar" class="btn-outline h-[55px] w-full justify-center"><i data-icon="user" class="h-4 w-4"></i> Ingresar</a>
    </div>
  </aside>`;

export const renderToTop = () => `
  <button id="to-top" type="button" class="to-top fixed bottom-5 right-5 z-30 grid h-[46px] w-[46px] place-items-center rounded-full bg-brand text-white sm:bottom-[30px] sm:right-[30px]" aria-label="Volver arriba">
    <i data-icon="arrow-up" class="h-4 w-4"></i>
  </button>`;
