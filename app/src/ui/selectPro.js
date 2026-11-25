// Listas desplegables con el estilo del sitio (buscador de la home y filtros del listado).
// El <select> nativo sigue siendo el control real (formulario, accesibilidad, valor); en compu, al abrirlo,
// en vez de la lista del sistema se muestra una lista propia. En celulares queda la lista nativa del teléfono.
import { esc } from '../lib/html.js';

const tactil = () => window.matchMedia('(pointer: coarse)').matches;
let abierto = null; // { sel, panel, cerrar }

function abrir(sel) {
  if (abierto?.sel === sel) return abierto.cerrar();
  abierto?.cerrar();
  if (sel.disabled || !sel.options.length) return;

  const opciones = [...sel.options];
  const panel = document.createElement('div');
  panel.className = 'cs-panel';
  panel.setAttribute('role', 'listbox');
  panel.tabIndex = -1;
  const label = sel.labels?.[0]?.textContent?.trim() || sel.getAttribute('aria-label') || '';
  if (label) panel.setAttribute('aria-label', label);
  const base = `cs-${sel.id || sel.name}`;
  panel.innerHTML = opciones.map((o, i) => `<div role="option" id="${esc(base)}-${i}" class="cs-opt${o.disabled ? ' is-disabled' : ''}" aria-selected="${o.selected}" data-i="${i}">${esc(o.textContent)}</div>`).join('');
  document.body.append(panel);

  // Posición: debajo del campo (o arriba si no entra), con el ancho del campo o un mínimo
  const caja = sel.closest('[data-cs-anchor]') ?? sel;
  const ubicar = () => {
    const r = caja.getBoundingClientRect();
    const ancho = Math.max(r.width, 220);
    const abajo = window.innerHeight - r.bottom;
    const alto = Math.min(panel.scrollHeight, 320);
    const arriba = abajo < alto + 16 && r.top > abajo;
    panel.style.width = `${ancho}px`;
    panel.style.left = `${Math.min(r.left, window.innerWidth - ancho - 8)}px`;
    panel.style.top = arriba ? `${Math.max(8, r.top - alto - 6)}px` : `${r.bottom + 6}px`;
  };
  ubicar();

  let activo = Math.max(0, sel.selectedIndex);
  const marcar = (i, scroll = true) => {
    const items = panel.children;
    if (!items[i]) return;
    items[activo]?.classList.remove('is-active');
    activo = i;
    items[i].classList.add('is-active');
    panel.setAttribute('aria-activedescendant', items[i].id);
    if (scroll) items[i].scrollIntoView({ block: 'nearest' });
  };
  marcar(activo);
  panel.focus({ preventScroll: true });
  sel.setAttribute('aria-expanded', 'true');

  const elegir = (i) => {
    if (opciones[i]?.disabled) return;
    if (sel.selectedIndex !== i) {
      sel.selectedIndex = i;
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    cerrar();
    sel.focus({ preventScroll: true });
  };

  let buscado = '', reloj;
  const teclas = (e) => {
    const n = opciones.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); marcar(Math.min(n - 1, activo + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); marcar(Math.max(0, activo - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); marcar(0); }
    else if (e.key === 'End') { e.preventDefault(); marcar(n - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(activo); }
    else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.preventDefault(); cerrar(); sel.focus({ preventScroll: true }); }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Escribir salta a la opción que empieza así
      clearTimeout(reloj); buscado += e.key.toLowerCase(); reloj = setTimeout(() => { buscado = ''; }, 700);
      const i = opciones.findIndex((o) => o.textContent.trim().toLowerCase().startsWith(buscado));
      if (i >= 0) marcar(i);
    }
  };
  const clic = (e) => { const o = e.target.closest('.cs-opt'); if (o) elegir(Number(o.dataset.i)); };
  const sobre = (e) => { const o = e.target.closest('.cs-opt'); if (o) marcar(Number(o.dataset.i), false); };
  const afuera = (e) => { if (!panel.contains(e.target) && e.target !== sel) cerrar(); };
  const alScroll = (e) => { if (!panel.contains(e.target)) cerrar(); };

  panel.addEventListener('keydown', teclas);
  panel.addEventListener('click', clic);
  panel.addEventListener('mousemove', sobre);
  document.addEventListener('pointerdown', afuera, true);
  window.addEventListener('scroll', alScroll, true);
  window.addEventListener('resize', cerrar);

  function cerrar() {
    panel.remove();
    sel.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', afuera, true);
    window.removeEventListener('scroll', alScroll, true);
    window.removeEventListener('resize', cerrar);
    if (abierto?.panel === panel) abierto = null;
  }
  abierto = { sel, panel, cerrar };
}

/** Activa la lista propia en los <select> que coincidan con el selector. */
export function initSelects(selector = '.field-select, .filter-select') {
  document.querySelectorAll(selector).forEach((sel) => {
    if (sel.dataset.cs) return;
    sel.dataset.cs = '1';
    sel.setAttribute('aria-haspopup', 'listbox');
    sel.setAttribute('aria-expanded', 'false');
    sel.addEventListener('mousedown', (e) => {
      if (tactil() || e.button !== 0) return;
      e.preventDefault();
      sel.focus({ preventScroll: true });
      abrir(sel);
    });
    sel.addEventListener('keydown', (e) => {
      if (tactil()) return;
      if (e.key === ' ' || e.key === 'Enter' || (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp'))) {
        e.preventDefault();
        abrir(sel);
      }
    });
  });
}
