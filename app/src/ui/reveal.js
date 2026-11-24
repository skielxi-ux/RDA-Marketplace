import { $$, prefersReducedMotion } from './dom.js';

/** Aparición suave de bloques al entrar en pantalla. */
export function initReveal() {
  const items = $$('.reveal');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => revealObserver.observe(el));
}
