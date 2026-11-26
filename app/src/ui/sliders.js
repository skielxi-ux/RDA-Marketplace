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

/** Cantidad real de autos por carrocería y por marca en la home ("3 autos" / "Ver autos"). */
function pintarConteos(reales) {
  const texto = (n) => (n ? `${n} ${n === 1 ? 'auto' : 'autos'}` : 'Ver autos');
  $$('[data-conteo-tipo]').forEach((el) => {
    const t = el.dataset.conteoTipo;
    el.textContent = texto(reales.filter((c) => (t === 'electrico' ? c.fuel === 'Eléctrico' : c.body === t)).length);
  });
  $$('[data-conteo-marca]').forEach((el) => {
    const m = el.dataset.conteoMarca.toLowerCase();
    el.textContent = texto(reales.filter((c) => c.brand.toLowerCase() === m).length);
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

  // Destacados: los autos reales más nuevos. Las pestañas sin autos se ocultan; sin autos, se oculta la sección.
  let tabs = featuredTabs;
  let activa = featuredTabs[0].key;
  const pintar = (key) => {
    const data = tabs.find((t) => t.key === key);
    if (!data) return;
    wrapper.innerHTML = renderCarSlides(data.cars);
    swiper.update();
    swiper.slideTo(0, 0);
    initCards(el);
  };
  cargarAutosReales().catch(() => []).then((reales) => {
    pintarConteos(reales);
    const de = (fn) => reales.filter(fn).slice(0, 8);
    const autos = { nuevos: de((c) => c.condition === 'new'), usados: de((c) => c.condition === 'used'), particulares: de((c) => c.sellerInfo.type === 'particular') };
    tabs = featuredTabs.map((t) => ({ ...t, cars: autos[t.key] ?? [] }));
    const conAutos = tabs.filter((t) => t.cars.length);
    if (!conAutos.length) { el.closest('section').hidden = true; return; }
    $$('#featured-tabs [data-tab]').forEach((b) => {
      const vacia = !conAutos.some((t) => t.key === b.dataset.tab);
      b.hidden = vacia;
      b.setAttribute('aria-selected', String(b.dataset.tab === conAutos[0].key));
      b.classList.toggle('is-active', b.dataset.tab === conAutos[0].key);
      b.tabIndex = b.dataset.tab === conAutos[0].key ? 0 : -1;
    });
    // Con una sola pestaña, la barra de pestañas no hace falta
    $('#featured-tabs').hidden = conAutos.length < 2;
    activa = conAutos[0].key;
    el.setAttribute('aria-labelledby', `tab-${activa}`);
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
