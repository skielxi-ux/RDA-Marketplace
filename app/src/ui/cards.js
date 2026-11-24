import { $, $$ } from './dom.js';

/** Galería al pasar el mouse por la tarjeta: la posición del cursor sobre la foto elige la imagen. */
export function bindGalleries(root = document) {
  $$('.car-card', root).forEach((card) => {
    if (card.dataset.bound) return;
    card.dataset.bound = '1';
    const media = $('[data-gallery]', card);
    if (!media) return;
    let shots;
    try { shots = JSON.parse(media.dataset.gallery); } catch { return; }
    if (!Array.isArray(shots) || shots.length < 2) return;

    const img = $('img', media);
    const dots = $$('.gallery-dots span', media);
    let cur = 0;
    let preloaded = false;
    const show = (n) => {
      if (n === cur) return;
      cur = n;
      img.removeAttribute('srcset');
      img.src = shots[n];
      dots.forEach((d, i) => d.classList.toggle('is-on', i === n));
    };
    card.addEventListener('mouseenter', () => {
      if (preloaded) return;
      preloaded = true;
      shots.slice(1).forEach((s) => { const i = new Image(); i.src = s; });
    });
    card.addEventListener('mousemove', (e) => {
      const r = media.getBoundingClientRect();
      if (e.clientY > r.bottom) return show(0);
      const x = Math.min(Math.max(e.clientX - r.left, 0), r.width - 1);
      show(Math.floor((x / r.width) * shots.length));
    });
    card.addEventListener('mouseleave', () => show(0));
  });
}

// ---------- Favoritos (se guardan solo en este navegador) ----------
const KEY = 'rda:favoritos';
const readFavs = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
};
const saveFavs = (set) => {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* sin almacenamiento: no pasa nada */ }
};

export function bindFavorites(root = document) {
  const favs = readFavs();
  $$('.fav-btn', root).forEach((btn) => {
    const id = btn.closest('.car-card')?.querySelector('.car-link')?.getAttribute('href')?.replace('#auto-', '');
    if (!id) return;
    const paint = () => btn.setAttribute('aria-pressed', String(favs.has(id)));
    paint();
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      favs.has(id) ? favs.delete(id) : favs.add(id);
      saveFavs(favs);
      paint();
    });
  });
}

export function initCards(root = document) {
  bindGalleries(root);
  bindFavorites(root);
}
