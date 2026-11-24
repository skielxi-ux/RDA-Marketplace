import Swiper from 'swiper';
import { Navigation, A11y } from 'swiper/modules';
import { $, $$, initTabs } from './dom.js';
import { renderCarSlides } from '../render/carCard.js';
import { initCards } from './cards.js';
import { featuredTabs } from '../data/catalog.js';

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

  initTabs($('#featured-tabs'), (tab) => {
    const data = featuredTabs.find((t) => t.key === tab.dataset.tab);
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
