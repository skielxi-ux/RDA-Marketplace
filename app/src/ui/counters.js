import { $$, prefersReducedMotion } from './dom.js';

/** Cuenta animada de 0 al número final cuando la cifra entra en pantalla. */
export function initCounters() {
  const items = $$('[data-count]');
  if (!items.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const fmt = (n) => Math.round(n).toLocaleString('es-AR');
  const run = (el) => {
    const target = Number(el.dataset.count) || 0;
    const start = performance.now();
    const DURATION = 1600;
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = fmt(target * (1 - (1 - t) ** 3));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      run(e.target);
      counterObserver.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  items.forEach((el) => { el.textContent = '0'; counterObserver.observe(el); });
}
