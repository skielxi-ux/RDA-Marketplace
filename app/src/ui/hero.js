import Swiper from 'swiper';
import { Navigation, Autoplay, EffectFade, A11y } from 'swiper/modules';
import { prefersReducedMotion } from './dom.js';

export function initHero() {
  // Punto de foco de cada foto al recortarse (por CSSOM: la CSP no permite style en línea).
  document.querySelectorAll('#hero .hero-bg[data-pos]').forEach((img) => {
    if (/^\d{1,3}% \d{1,3}%$/.test(img.dataset.pos)) img.style.objectPosition = img.dataset.pos;
  });
  new Swiper('#hero', {
    modules: [Navigation, Autoplay, EffectFade, A11y],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1000,
    loop: true,
    autoplay: prefersReducedMotion() ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { prevEl: '.hero-prev', nextEl: '.hero-next' },
    a11y: { prevSlideMessage: 'Foto anterior', nextSlideMessage: 'Foto siguiente' },
  });
}
