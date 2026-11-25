import { registrarVisita } from '../lib/visitas.js';
import { $ } from './dom.js';

/** Header que se esconde al bajar y reaparece al subir + botón "volver arriba". */
export function initHeader() {
  registrarVisita();
  const header = $('#site-header');
  const toTop = $('#to-top');
  const H = header.offsetHeight;
  let last = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (y > H * 3) {
      header.classList.add('is-sticky');
      header.classList.toggle('is-hidden', y > last);
    } else if (y <= H) {
      header.classList.remove('is-sticky', 'is-hidden');
    }
    toTop.classList.toggle('is-visible', y > 600);
    last = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
