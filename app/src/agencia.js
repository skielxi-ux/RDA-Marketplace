// Página de una agencia: agencia.html?id=<uuid>
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initCards } from './ui/cards.js';
import { $ } from './ui/dom.js';
import { cargarAgencia } from './data/autosReales.js';
import { renderAgencia } from './render/agencia.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();

(async () => {
  const main = $('#contenido');
  let a = null;
  try { a = await cargarAgencia(new URLSearchParams(location.search).get('id')); } catch { a = null; }
  $('[data-ag-cargando]').remove();
  main.removeAttribute('aria-busy');
  if (!a) {
    $('[data-ag-error]').hidden = false;
    document.title = 'Agencia no disponible | Red de Autos';
    return;
  }
  $('[data-ag-error]').remove();
  $('[data-ag-root]').innerHTML = renderAgencia(a);
  document.title = `${a.nombre} · ${a.ciudad} | Red de Autos`;
  $('meta[name="description"]').setAttribute('content', `${a.nombre}: ${a.autos.length} autos en venta en ${a.ciudad}, ${a.provincia}. Contacto, horarios y ubicación.`);
  const grid = $('[data-agencia-grid]');
  if (grid) initCards(grid);
})();
