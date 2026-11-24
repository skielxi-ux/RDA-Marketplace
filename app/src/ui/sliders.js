import Swiper from 'swiper';
import { Navigation, A11y } from 'swiper/modules';
import { $, $$, initTabs } from './dom.js';
import { renderCarSlides } from '../render/carCard.js';
import { featuredTabs } from '../data/catalog.js';

export function initBodyTypes() {
  new Swiper('#types', {
    modules: [A11y],
    slidesPerView: 1.25, spaceBetween: 16, grabCursor: true,
    breakpoints: { 640: { slidesPerView: 2.3 }, 900: { slidesPerView: 3.3, spaceBetween: 24 }, 1200: { slidesPerView: 5, spaceBetween: 30 } },
  });
}

/** Galería al pasar el mouse: la posición del cursor elige la foto. */
function bindGalleries(root) {
  $$('[data-gallery]', root).forEach((box) => {
    if (box.dataset.bound) return;
    box.dataset.bound = '1';
    let shots;
    try { shots = JSON.parse(box.dataset.gallery); } catch { return; }
    if (!Array.isArray(shots) || shots.length < 2) return;

    const img = $('img', box);
    const dots = $$('.gallery-dots span', box);
    let cur = 0;
    let preloaded = false;
    const show = (n) => {
      if (n === cur) return;
      cur = n;
      img.removeAttribute('srcset');
      img.src = shots[n];
      dots.forEach((d, i) => d.classList.toggle('is-on', i === n));
    };
    box.addEventListener('mouseenter', () => {
      if (preloaded) return;
      preloaded = true;
      shots.slice(1).forEach((s) => { const i = new Image(); i.src = s; });
    });
    box.addEventListener('mousemove', (e) => {
      const r = box.getBoundingClientRect();
      show(Math.min(shots.length - 1, Math.floor(((e.clientX - r.left) / r.width) * shots.length)));
    });
    box.addEventListener('mouseleave', () => show(0));
  });
}

export function initFeatured() {
  const el = $('#featured');
  const wrapper = $('.swiper-wrapper', el);
  const swiper = new Swiper(el, {
    modules: [Navigation, A11y],
    slidesPerView: 1.15, spaceBetween: 16, speed: 600,
    navigation: { prevEl: '.featured-prev', nextEl: '.featured-next' },
    breakpoints: { 640: { slidesPerView: 2.2 }, 900: { slidesPerView: 3, spaceBetween: 24 }, 1200: { slidesPerView: 4, spaceBetween: 30 } },
  });
  bindGalleries(el);

  initTabs($('#featured-tabs'), (tab) => {
    const data = featuredTabs.find((t) => t.key === tab.dataset.tab);
    if (!data) return;
    el.classList.add('is-switching');
    setTimeout(() => {
      wrapper.innerHTML = renderCarSlides(data.cars);
      el.setAttribute('aria-labelledby', tab.id);
      swiper.update();
      swiper.slideTo(0, 0);
      bindGalleries(el);
      el.classList.remove('is-switching');
    }, 250);
  });
}
