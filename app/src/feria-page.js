// Página de la feria online: cuenta regresiva + autos con precio relámpago (se cargan en vivo).
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initSelects } from './ui/selectPro.js';
import { initFeria } from './ui/feria.js';
import { initCards } from './ui/cards.js';
import { $ } from './ui/dom.js';
import { cargarFeria } from './data/autosReales.js';
import { renderCarGrid } from './render/carCard.js';
import { relojesOferta } from './lib/oferta.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();

const ORDEN = {
  termina: (a, b) => new Date(a.feria.fin) - new Date(b.feria.fin),
  descuento: (a, b) => (b.priceBefore - b.price) / b.priceBefore - (a.priceBefore - a.price) / a.priceBefore,
  precio: (a, b) => (a.currency === b.currency ? a.price - b.price : a.currency === 'ARS' ? -1 : 1),
};

(async () => {
  const main = $('#contenido');
  const grid = $('[data-fe-grid]');
  const cuenta = $('[data-fe-cuenta]');
  const vacio = $('[data-fe-vacio]');
  const ordenSel = $('[data-fe-orden]');
  let datos = { feria: null, autos: [] };
  const [feria] = await Promise.all([initFeria(), cargarFeria().then((d) => { datos = d; }).catch(() => {})]);
  main.removeAttribute('aria-busy');

  if (!feria) {
    document.title = 'Feria online | Red de Autos';
    cuenta.textContent = 'No hay ninguna feria en este momento.';
    $('[data-fe-vacio-titulo]').textContent = 'No hay ninguna feria en este momento';
    $('[data-fe-vacio-texto]').textContent = 'Cuando programemos la próxima la vas a ver acá y en la página de inicio, con su cuenta regresiva.';
    vacio.hidden = false;
    return;
  }
  document.title = `${feria.nombre} · Feria online | Red de Autos`;

  const pintar = () => {
    const ahora = Date.now();
    const autos = datos.autos.filter((c) => new Date(c.feria.fin).getTime() > ahora).sort(ORDEN[ordenSel.value] ?? ORDEN.termina);
    cuenta.textContent = autos.length
      ? `${autos.length} ${autos.length === 1 ? 'auto' : 'autos'} con precio de feria por tiempo limitado.`
      : 'Todavía no hay autos en la feria.';
    vacio.hidden = autos.length > 0;
    $('[data-fe-orden-box]').hidden = autos.length < 2;
    grid.innerHTML = renderCarGrid(autos);
    initCards(grid);
  };
  pintar();
  initSelects();
  ordenSel.addEventListener('change', pintar);
  // Cuando una oferta termina, sale de la lista
  relojesOferta(grid, () => pintar());
})();
