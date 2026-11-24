// Ficha del auto: visor de fotos, slider en celular, compartir, favoritos y autos similares.
import Swiper from 'swiper';
import { Navigation, A11y } from 'swiper/modules';
import { $, $$ } from './dom.js';
import { initCards, bindFavorites } from './cards.js';

function readData() {
  try { return JSON.parse($('#ficha-data').textContent); } catch { return null; }
}

function initLightbox(photos) {
  const box = $('#lightbox');
  const img = $('[data-lb-img]', box);
  const idx = $('[data-lb-index]', box);
  let cur = 0;
  let lastFocus = null;

  const show = (n) => {
    cur = (n + photos.length) % photos.length;
    img.src = photos[cur];
    img.alt = `Foto ${cur + 1} de ${photos.length}`;
    idx.textContent = String(cur + 1);
  };
  const open = (n) => {
    lastFocus = document.activeElement;
    show(n);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
    document.documentElement.classList.add('overflow-hidden');
    $('[data-lb-close]', box).focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    box.hidden = true;
    document.documentElement.classList.remove('overflow-hidden');
    lastFocus?.focus();
  };

  $$('[data-open-photo]').forEach((b) => b.addEventListener('click', () => open(Number(b.dataset.openPhoto) || 0)));
  $('[data-lb-close]', box).addEventListener('click', close);
  $('[data-lb-prev]', box).addEventListener('click', () => show(cur - 1));
  $('[data-lb-next]', box).addEventListener('click', () => show(cur + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'Tab') { // foco atrapado dentro del visor
      const f = $$('button', box);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    }
  });
  // Deslizar con el dedo
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

function toast(text) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.append(t);
  }
  t.textContent = text;
  t.classList.add('is-on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('is-on'), 2200);
}

function initShare(title) {
  $$('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const data = { title, text: `${title} en Red de Autos`, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(location.href);
      toast('Link copiado');
    } catch {
      toast('No se pudo copiar el link');
    }
  }));
}

export function initFicha() {
  const data = readData();
  if (!data) return;

  initLightbox(data.photos);
  initShare(data.title);
  bindFavorites(document);

  const slider = $('#ficha-slider');
  if (slider) {
    const counter = $('[data-slide-index]', slider);
    new Swiper(slider, {
      modules: [A11y],
      spaceBetween: 8,
      on: { slideChange: (s) => { counter.textContent = String(s.activeIndex + 1); } },
    });
  }

  const related = $('#related');
  if (related) {
    new Swiper(related, {
      modules: [Navigation, A11y],
      slidesPerView: 1.1, spaceBetween: 16, speed: 600,
      navigation: { prevEl: '.related-prev', nextEl: '.related-next' },
      breakpoints: { 640: { slidesPerView: 2.2 }, 900: { slidesPerView: 3, spaceBetween: 24 }, 1200: { slidesPerView: 4, spaceBetween: 30 } },
    });
    initCards(related);
  }
}
