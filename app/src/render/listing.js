// Plantillas del listado de autos (autos.html): filtros y barra de resultados.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { BODY_NAMES, countBy, sellers, SELLER_TYPES } from '../data/catalog.js';
import { searchBrands } from '../data/modelos.js';

export const YEAR_OPTIONS = [2026, 2024, 2022, 2020, 2018, 2015, 2010];
export const SORT_OPTIONS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'km-asc', label: 'Menos kilómetros' },
  { value: 'anio-desc', label: 'Más nuevos' },
];

const sellerCount = (type) => countBy((c) => sellers[c.seller].type === type);

const group = (title, body) => `
  <fieldset class="filter-group">
    <legend class="filter-title">${esc(title)}</legend>
    ${body}
  </fieldset>`;

const pill = (name, value, label, checked = false) => `
  <label class="filter-pill"><input type="radio" name="${esc(name)}" value="${esc(value)}" class="sr-only"${checked ? ' checked' : ''} /><span>${esc(label)}</span></label>`;

const check = (name, value, label, count) => `
  <label class="filter-check">
    <input type="checkbox" name="${esc(name)}" value="${esc(value)}" />
    <span class="flex-1">${esc(label)}</span>
    <span class="text-[13px] text-ink/50" data-filter-count="${esc(name)}:${esc(value)}">${esc(count)}</span>
  </label>`;

export const renderFilters = () => `
  <div class="flex items-center justify-between border-b border-line pb-4 lg:hidden">
    <p class="text-[20px] font-bold">Filtros</p>
    <button type="button" class="round-nav" data-filters-close aria-label="Cerrar filtros">${icon('x', 'h-4 w-4')}</button>
  </div>

  ${group('Condición', `<div class="flex flex-wrap gap-2">${pill('condicion', 'todos', 'Todos', true)}${pill('condicion', '0km', '0km')}${pill('condicion', 'usados', 'Usados')}</div>`)}

  ${group('Marca y modelo', `
    <label for="f-marca" class="sr-only">Marca</label>
    <div class="relative">
      <select id="f-marca" name="marca" class="filter-select"><option value="">Todas las marcas</option>${searchBrands.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('')}</select>
      ${icon('chevron-down', 'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2')}
    </div>
    <label for="f-modelo" class="sr-only">Modelo</label>
    <div class="relative mt-3">
      <select id="f-modelo" name="modelo" class="filter-select" disabled><option value="">Todos los modelos</option></select>
      ${icon('chevron-down', 'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2')}
    </div>`)}

  ${group('Año', `
    <label for="f-anio" class="sr-only">Año desde</label>
    <div class="relative">
      <select id="f-anio" name="anio" class="filter-select"><option value="">Cualquier año</option>${YEAR_OPTIONS.map((y) => `<option value="${y}">Desde ${y}</option>`).join('')}</select>
      ${icon('chevron-down', 'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2')}
    </div>`)}

  ${group('Precio', `
    <div class="flex flex-wrap gap-2">${pill('moneda', '', 'Todas', true)}${pill('moneda', 'ARS', 'Pesos')}${pill('moneda', 'USD', 'Dólares')}</div>
    <p class="filter-hint mt-3 text-[13px] text-ink/60" data-price-hint>Elegí la moneda para filtrar por precio.</p>
    <div class="mt-3 grid grid-cols-2 gap-3" data-price-range hidden>
      <label class="block"><span class="mb-1 block text-[13px] text-ink/70">Desde</span><input type="number" name="pmin" min="0" step="1000" inputmode="numeric" class="filter-input" placeholder="Mín." /></label>
      <label class="block"><span class="mb-1 block text-[13px] text-ink/70">Hasta</span><input type="number" name="pmax" min="0" step="1000" inputmode="numeric" class="filter-input" placeholder="Máx." /></label>
    </div>`)}

  ${group('Carrocería', `<div class="space-y-1">${Object.entries(BODY_NAMES).map(([slug, name]) => check('carroceria', slug, name, countBy((c) => c.body === slug))).join('')}</div>`)}

  ${group('Vendedor', `<div class="space-y-1">${Object.entries(SELLER_TYPES).map(([k, v]) => check('vendedor', k, v, sellerCount(k))).join('')}</div>`)}

  <div class="sticky bottom-0 -mx-5 mt-auto flex gap-3 border-t border-line bg-white px-5 py-4 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0">
    <button type="reset" class="btn-outline h-[50px] flex-1 justify-center">${icon('rotate-ccw', 'h-4 w-4')} Limpiar</button>
    <button type="button" class="btn-primary h-[50px] flex-1 lg:hidden" data-filters-close>Ver <span data-count-short>0</span> autos</button>
  </div>`;

export const renderSortOptions = () =>
  SORT_OPTIONS.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
