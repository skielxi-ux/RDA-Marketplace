import Swiper from 'swiper';
import { Navigation, A11y } from 'swiper/modules';
import { $, $$, initTabs } from './dom.js';
import { renderCarSlides } from '../render/carCard.js';
import { initCards } from './cards.js';
import { featuredTabs } from '../data/catalog.js';
import { cargarAutosReales } from '../data/autosReales.js';

export function initBodyTypes() {
  new Swiper('#types', {
    modules: [A11y],
    slidesPerView: 1.25, spaceBetween: 16, grabCursor: true,
    breakpoints: { 640: { slidesPerView: 2.3 }, 900: { slidesPerView: 3.3, spaceBetween: 24 }, 1200: { slidesPerView: 5, spaceBetween: 30 } },
  });
}

export function initFeatured() {
  const el = $('#featured');
  const wrapper = $('.swiper-wrapper', el);
  const swiper = new Swiper(el, {
    modules: [Navigation, A11y],
    slidesPerView: 1.1, spaceBetween: 16, speed: 600,
    navigation: { prevEl: '.featured-prev', nextEl: '.featured-next' },
    breakpoints: { 640: { slidesPerView: 2.2 }, 900: { slidesPerView: 3, spaceBetween: 24 }, 1200: { slidesPerView: 4, spaceBetween: 30 } },
  });
  initCards(el);

  // Destacados: primero los autos reales de las agencias (los más nuevos), después los de ejemplo
  let tabs = featuredTabs;
  let activa = $('#featured-tabs [aria-selected="true"]')?.dataset.tab ?? featuredTabs[0].key;
  const pintar = (key) => {
    const data = tabs.find((t) => t.key === key);
    if (!data) return;
    wrapper.innerHTML = renderCarSlides(data.cars);
    swiper.update();
    swiper.slideTo(0, 0);
    initCards(el);
  };
  cargarAutosReales().then((reales) => {
    if (!reales.length) return;
    const de = (fn) => reales.filter(fn);
    const extra = { nuevos: de((c) => c.condition === 'new'), usados: de((c) => c.condition === 'used'), particulares: de((c) => c.sellerInfo.type === 'particular') };
    tabs = featuredTabs.map((t) => ({ ...t, cars: [...(extra[t.key] ?? []), ...t.cars].slice(0, 8) }));
    pintar(activa);
  });

  initTabs($('#featured-tabs'), (tab) => {
    activa = tab.dataset.tab;
    const data = tabs.find((t) => t.key === tab.dataset.tab);
    if (!data) return;
    el.classList.add('is-switching');
    setTimeout(() => {
      wrapper.innerHTML = renderCarSlides(data.cars);
      el.setAttribute('aria-labelledby', tab.id);
      swiper.update();
      swiper.slideTo(0, 0);
      initCards(el);
      el.classList.remove('is-switching');
    }, 250);
  });
}
