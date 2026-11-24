import Swiper from 'swiper';
import { Navigation, Autoplay, EffectFade, A11y } from 'swiper/modules';
import { prefersReducedMotion } from './dom.js';

export function initHero() {
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
