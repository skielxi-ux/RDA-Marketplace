// Mis favoritos: los autos guardados con el corazón (de ejemplo y de agencias). Se guardan en este navegador.
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initCards, readFavs } from './ui/cards.js';
import { $ } from './ui/dom.js';
import { cars } from './data/catalog.js';
import { cargarAutosReales, cargarAuto, esIdReal } from './data/autosReales.js';
import { renderCarGrid } from './render/carCard.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();

const grid = $('[data-fav-grid]');
const vacio = $('[data-fav-vacio]');
const sub = $('[data-fav-sub]');

const contar = () => {
  const n = grid.children.length;
  vacio.hidden = n > 0;
  sub.textContent = n ? `${n} ${n === 1 ? 'auto guardado' : 'autos guardados'}.` : 'Los autos que guardaste con el corazón.';
};

(async () => {
  const ids = [...readFavs()];
  const ejemplo = cars.filter((c) => ids.includes(c.id));
  const realesIds = ids.filter(esIdReal);
  let reales = [];
  if (realesIds.length) {
    const publicos = await cargarAutosReales();
    reales = publicos.filter((c) => realesIds.includes(c.id));
    // Los que no están en el listado público (por ejemplo, de cuentas de prueba) se buscan uno por uno
    const faltan = realesIds.filter((id) => !reales.some((c) => c.id === id));
    const extra = await Promise.all(faltan.map((id) => cargarAuto(id).catch(() => null)));
    reales.push(...extra.filter(Boolean));
  }
  // En el orden en que se guardaron (los últimos primero)
  const todos = [...reales, ...ejemplo].sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));
  grid.innerHTML = renderCarGrid(todos);
  initCards(grid);
  contar();
})();

// Al sacar el corazón, el auto se va de la lista
grid.addEventListener('rda:favorito', (e) => {
  if (e.detail.guardado) return;
  const card = e.target.closest('[data-car-id]');
  if (!card) return;
  card.style.transition = 'opacity .3s, transform .3s';
  card.style.opacity = '0';
  card.style.transform = 'scale(.97)';
  setTimeout(() => { card.remove(); contar(); }, 300);
});
