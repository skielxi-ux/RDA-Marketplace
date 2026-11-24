// Listado de autos: filtros, orden y estado en la URL (?condicion=0km&marca=Ford...).
import { $, $$ } from './dom.js';
import { initCards } from './cards.js';
import { cars, sellers } from '../data/catalog.js';
import { isSearchBrand, isSearchModel } from '../data/modelos.js';
import { renderCarGrid } from '../render/carCard.js';
import { renderModelOptions } from '../render/sections.js';
import { SORT_OPTIONS } from '../render/listing.js';

const CONDITIONS = { todos: null, '0km': 'new', usados: 'used' };
const TITLES = { todos: 'Autos en venta', '0km': 'Autos 0km', usados: 'Autos usados' };
const SORTS = new Set(SORT_OPTIONS.map((o) => o.value));
const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Math.max(0, Number(v)));

/** Lee y valida el estado desde la URL (nunca se confía en lo que viene en la URL). */
function readState() {
  const q = new URLSearchParams(location.search);
  const list = (k) => q.getAll(k).flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
  const state = {
    condicion: Object.hasOwn(CONDITIONS, q.get('condicion') ?? '') ? q.get('condicion') : 'todos',
    marca: isSearchBrand(q.get('marca')) ? q.get('marca') : '',
    modelo: q.get('modelo') || '',
    anio: num(q.get('anio')),
    moneda: ['ARS', 'USD'].includes(q.get('moneda')) ? q.get('moneda') : '',
    pmin: num(q.get('pmin')),
    pmax: num(q.get('pmax')),
    carroceria: list('carroceria'),
    vendedor: list('vendedor'),
    orden: SORTS.has(q.get('orden')) ? q.get('orden') : 'recientes',
    agencia: Object.hasOwn(sellers, q.get('agencia') ?? '') ? q.get('agencia') : '',
  };
  // Rango de precio que viene del buscador de la home (en dólares): ?precio=15000-30000
  const precio = q.get('precio');
  if (precio && /^\d*-\d*$/.test(precio) && !state.moneda) {
    const [a, b] = precio.split('-');
    Object.assign(state, { moneda: 'USD', pmin: num(a), pmax: num(b) });
  }
  if (!isSearchModel(state.marca, state.modelo)) state.modelo = '';
  return state;
}

function writeUrl(state) {
  const q = new URLSearchParams();
  if (state.condicion !== 'todos') q.set('condicion', state.condicion);
  ['marca', 'modelo', 'moneda'].forEach((k) => state[k] && q.set(k, state[k]));
  ['anio', 'pmin', 'pmax'].forEach((k) => state[k] != null && q.set(k, state[k]));
  if (state.carroceria.length) q.set('carroceria', state.carroceria.join(','));
  if (state.vendedor.length) q.set('vendedor', state.vendedor.join(','));
  if (state.orden !== 'recientes') q.set('orden', state.orden);
  if (state.agencia) q.set('agencia', state.agencia);
  const qs = q.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function filterCars(s) {
  const cond = CONDITIONS[s.condicion];
  return cars.filter((c) =>
    (!cond || c.condition === cond) &&
    (!s.marca || c.brand === s.marca) &&
    (!s.modelo || c.model === s.modelo) &&
    (s.anio == null || c.year >= s.anio) &&
    (!s.moneda || c.currency === s.moneda) &&
    (!s.moneda || s.pmin == null || c.price >= s.pmin) &&
    (!s.moneda || s.pmax == null || c.price <= s.pmax) &&
    (!s.carroceria.length || s.carroceria.includes(c.body)) &&
    (!s.vendedor.length || s.vendedor.includes(sellers[c.seller].type)) &&
    (!s.agencia || c.seller === s.agencia),
  );
}

// Sin tipo de cambio: al ordenar por precio se agrupa por moneda (primero pesos, después dólares).
const byCurrency = (a, b) => (a.currency === b.currency ? 0 : a.currency === 'ARS' ? -1 : 1);
const SORTERS = {
  recientes: (a, b) => b.published - a.published,
  'precio-asc': (a, b) => byCurrency(a, b) || a.price - b.price,
  'precio-desc': (a, b) => byCurrency(a, b) || b.price - a.price,
  'km-asc': (a, b) => a.km - b.km,
  'anio-desc': (a, b) => b.year - a.year,
};

const activeCount = (s) =>
  (s.condicion !== 'todos') + !!s.marca + !!s.modelo + (s.anio != null) + !!s.moneda +
  (s.pmin != null) + (s.pmax != null) + s.carroceria.length + s.vendedor.length + !!s.agencia;

export function initListing() {
  const form = $('#filters');
  const grid = $('#car-grid');
  const sort = $('#f-orden');
  const modelSel = $('#f-modelo');
  const priceRange = $('[data-price-range]');
  const priceHint = $('[data-price-hint]');
  let state = readState();

  // Volcar el estado en el formulario
  const paintForm = () => {
    form.elements.condicion.value = state.condicion;
    form.elements.marca.value = state.marca;
    modelSel.innerHTML = renderModelOptions(state.marca, state.modelo);
    modelSel.disabled = !state.marca;
    form.elements.anio.value = state.anio ?? '';
    form.elements.moneda.value = state.moneda;
    form.elements.pmin.value = state.pmin ?? '';
    form.elements.pmax.value = state.pmax ?? '';
    $$('input[name="carroceria"]', form).forEach((i) => { i.checked = state.carroceria.includes(i.value); });
    $$('input[name="vendedor"]', form).forEach((i) => { i.checked = state.vendedor.includes(i.value); });
    sort.value = state.orden;
  };

  const render = () => {
    const list = filterCars(state).sort(SORTERS[state.orden]);
    grid.innerHTML = renderCarGrid(list);
    initCards(grid);
    $('#empty-state').classList.toggle('hidden', list.length > 0);
    grid.classList.toggle('hidden', list.length === 0);
    $$('[data-count], [data-count-short]').forEach((el) => { el.textContent = String(list.length); });
    priceRange.hidden = !state.moneda;
    priceHint.hidden = !!state.moneda;
    const title = state.agencia ? `Autos de ${sellers[state.agencia].name}` : TITLES[state.condicion] + (state.marca ? ` ${state.marca}` : '');
    $('#listing-title').textContent = title;
    document.title = `${title} | Red de Autos`;
    const n = activeCount(state);
    const badge = $('#filters-badge');
    badge.textContent = String(n);
    badge.classList.toggle('hidden', !n);
    badge.classList.toggle('grid', !!n);
  };

  const readForm = () => {
    const fd = new FormData(form);
    const marca = fd.get('marca') || '';
    state = {
      ...state,
      condicion: Object.hasOwn(CONDITIONS, fd.get('condicion') ?? '') ? fd.get('condicion') : 'todos',
      marca,
      modelo: marca && marca === state.marca ? fd.get('modelo') || '' : '',
      anio: num(fd.get('anio')),
      moneda: fd.get('moneda') || '',
      pmin: num(fd.get('pmin')),
      pmax: num(fd.get('pmax')),
      carroceria: fd.getAll('carroceria'),
      vendedor: fd.getAll('vendedor'),
    };
  };

  const update = () => { writeUrl(state); paintForm(); render(); };

  form.addEventListener('change', () => { readForm(); update(); });
  // Precio: actualiza mientras se escribe, con una pequeña espera
  let t;
  form.addEventListener('input', (e) => {
    if (e.target.type !== 'number') return;
    clearTimeout(t);
    t = setTimeout(() => { readForm(); writeUrl(state); render(); }, 350);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  const reset = () => {
    state = { ...readState(), condicion: 'todos', marca: '', modelo: '', anio: null, moneda: '', pmin: null, pmax: null, carroceria: [], vendedor: [], agencia: '', orden: state.orden };
    update();
  };
  form.addEventListener('reset', (e) => { e.preventDefault(); reset(); });
  $('#empty-reset').addEventListener('click', reset);
  sort.addEventListener('change', () => { state.orden = SORTS.has(sort.value) ? sort.value : 'recientes'; update(); });

  // Panel de filtros en celular
  const backdrop = $('#filters-backdrop');
  const openBtn = $('#filters-open');
  const setOpen = (open) => {
    form.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('overflow-hidden', open);
  };
  openBtn.addEventListener('click', () => setOpen(true));
  backdrop.addEventListener('click', () => setOpen(false));
  $$('[data-filters-close]', form).forEach((b) => b.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && form.classList.contains('is-open')) setOpen(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && setOpen(false));

  paintForm();
  render();
}
