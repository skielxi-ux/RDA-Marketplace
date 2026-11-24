import { $, $$ } from './dom.js';

/** Menú lateral con foco atrapado, cierre con Escape y con el fondo. */
export function initDrawer() {
  const drawer = $('#drawer');
  const backdrop = $('#drawer-backdrop');
  const openBtn = $('#menu-open');

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    drawer.inert = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('overflow-hidden', open);
    (open ? $('#menu-close') : openBtn).focus();
  };

  drawer.inert = true;
  openBtn.addEventListener('click', () => setOpen(true));
  $('#menu-close').addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
  });
}
