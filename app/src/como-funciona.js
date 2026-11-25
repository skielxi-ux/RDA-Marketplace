// Cómo funciona: pestañas accesibles (flechas del teclado) y la guía elegida en la URL (#comprar, #vender, #agencias).
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { $$ } from './ui/dom.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();

const tabs = $$('[data-cf-tab]');
const paneles = $$('[data-cf-panel]');
const ids = tabs.map((t) => t.dataset.cfTab);

function mostrar(id, { foco = false, url = true } = {}) {
  if (!ids.includes(id)) return;
  tabs.forEach((t) => {
    const on = t.dataset.cfTab === id;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && foco) t.focus();
  });
  paneles.forEach((p) => { p.removeAttribute('data-cf-oculto'); p.hidden = p.id !== id; });
  if (url) history.replaceState(null, '', `#${id}`);
}

tabs.forEach((t, i) => {
  t.addEventListener('click', () => mostrar(t.dataset.cfTab));
  t.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); mostrar(ids[e.key === 'Home' ? 0 : ids.length - 1], { foco: true }); return; }
    if (!d) return;
    e.preventDefault();
    mostrar(ids[(i + d + ids.length) % ids.length], { foco: true });
  });
});

const desdeHash = () => mostrar(location.hash.slice(1), { url: false });
mostrar(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : ids[0], { url: false });
window.addEventListener('hashchange', desdeHash);
