import './style.css';
import Swiper from 'swiper';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import {
  createIcons, Menu, Phone, User, Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight, ArrowUp,
  Gauge, Fuel, Cog, Calendar, Bookmark, X, BadgePercent, ShieldCheck, ReceiptText, Wrench, MapPin, Sparkle, BadgeCheck, Building2,
} from 'lucide';
import { heroSlides, makes, bodyTypes, reasons, listings } from './data.js';

const icons = { Menu, Phone, User, Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight, ArrowUp, Gauge, Fuel, Cog, Calendar, Bookmark, X, BadgePercent, ShieldCheck, ReceiptText, Wrench, MapPin, Sparkle, BadgeCheck, Building2 };
const paintIcons = () => createIcons({ icons, attrs: { 'stroke-width': 1.6 } });
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Header: se esconde al bajar, vuelve al subir ---------- */
(() => {
  const header = $('#site-header');
  const h = 86;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > h * 3) {
      header.classList.add('is-sticky');
      header.classList.toggle('is-hidden', y > last);
    } else if (y <= h) {
      header.classList.remove('is-sticky', 'is-hidden');
    }
    last = y;
    $('#to-top').classList.toggle('!opacity-100', y > 600);
    $('#to-top').classList.toggle('!translate-y-0', y > 600);
  }, { passive: true });
  $('#to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- Menú lateral ---------- */
(() => {
  const drawer = $('#drawer'), back = $('#drawer-backdrop');
  const open = (v) => {
    drawer.classList.toggle('-translate-x-full', !v);
    back.classList.toggle('invisible', !v);
    back.classList.toggle('opacity-0', !v);
    drawer.setAttribute('aria-hidden', String(!v));
    document.body.style.overflow = v ? 'hidden' : '';
  };
  $('#menu-open').addEventListener('click', () => open(true));
  $('#menu-close').addEventListener('click', () => open(false));
  back.addEventListener('click', () => open(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && open(false));
  $$('#drawer a').forEach((a) => a.addEventListener('click', () => open(false)));
})();

/* ---------- Hero ---------- */
$('#hero-wrapper').innerHTML = heroSlides.map((s) => `
  <div class="swiper-slide hero-slide relative overflow-hidden">
    <img src="${s.img}" alt="" class="hero-bg absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/15 to-ink/40"></div>
    <div class="relative flex h-full flex-col items-center px-6 pt-[90px] text-center text-white md:pt-[140px]">
      <p class="hero-anim text-[15px]">Autos 0km y usados de agencias y concesionarios oficiales</p>
      <h1 class="hero-anim d1 mt-4 max-w-[760px] text-[36px] font-bold leading-[1.15] sm:text-[48px] md:text-[70px]">${s.title}</h1>
    </div>
  </div>`).join('');

new Swiper('#hero', {
  modules: [Navigation, Autoplay, EffectFade],
  effect: 'fade',
  fadeEffect: { crossFade: true },
  speed: 1000,
  loop: true,
  autoplay: { delay: 6000, disableOnInteraction: false },
  navigation: { prevEl: '.hero-prev', nextEl: '.hero-next' },
});

/* ---------- Buscador ---------- */
(() => {
  const mk = $('#sel-make'), md = $('#sel-model');
  mk.insertAdjacentHTML('beforeend', Object.keys(makes).map((m) => `<option>${m}</option>`).join(''));
  mk.addEventListener('change', () => {
    md.innerHTML = '<option value="">Todos los modelos</option>' + (makes[mk.value] || []).map((m) => `<option>${m}</option>`).join('');
  });
  $$('#search-tabs .tab-btn').forEach((b) => b.addEventListener('click', () => {
    $$('#search-tabs .tab-btn').forEach((x) => { x.classList.remove('is-active'); x.classList.add('opacity-80'); });
    b.classList.add('is-active'); b.classList.remove('opacity-80');
  }));
  $('#search-form').addEventListener('submit', (e) => { e.preventDefault(); $('#destacados').scrollIntoView({ behavior: 'smooth' }); });
})();

/* ---------- Carrocerías ---------- */
$('#types .swiper-wrapper').innerHTML = bodyTypes.map((t) => `
  <div class="swiper-slide">
    <a href="#" class="type-card group relative block h-[290px] overflow-hidden rounded-2xl">
      <img src="${t.img}" alt="${t.name}" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/10 to-transparent"></div>
      <div class="relative p-[30px] text-white">
        <p class="text-[15px]">${t.count} autos</p>
        <h3 class="mt-1 text-[18px] font-medium">${t.name}</h3>
      </div>
    </a>
  </div>`).join('');

new Swiper('#types', {
  slidesPerView: 1.3, spaceBetween: 16, grabCursor: true,
  breakpoints: { 640: { slidesPerView: 2.3 }, 900: { slidesPerView: 3.3, spaceBetween: 24 }, 1200: { slidesPerView: 5, spaceBetween: 30 } },
});

/* ---------- Por qué elegirnos ---------- */
$('#reasons').innerHTML = reasons.map((r) => `
  <div class="reveal rounded-2xl bg-white p-[40px] shadow-[0_10px_40px_rgba(5,11,32,0.05)] transition-transform duration-300 hover:-translate-y-1.5">
    <span class="relative inline-block text-brand">
      <i data-lucide="${r.icon}" class="h-[42px] w-[42px]"></i>
      <i data-lucide="sparkle" class="absolute -right-2 -top-1 h-3.5 w-3.5 text-[#E959D9]"></i>
    </span>
    <h3 class="mt-6 text-[20px] font-medium leading-tight">${r.title}</h3>
    <p class="mt-4 text-[15px] leading-[1.75]">${r.text}</p>
  </div>`).join('');

/* ---------- Destacados ---------- */
const badgeCls = { ok: 'bg-ok', brand: 'bg-brand' };
const card = (c) => `
  <div class="swiper-slide">
    <article class="car-card group">
      <div class="relative h-[218px] overflow-hidden rounded-2xl bg-soft" data-gallery='${JSON.stringify(c.img)}'>
        <img src="${c.img[0]}" alt="${c.title}" loading="lazy" class="car-img h-full w-full object-cover" />
        ${c.badge ? `<span class="absolute left-5 top-5 rounded-full px-[15px] py-[4px] text-[14px] font-medium text-white ${badgeCls[c.badge[1]]}">${c.badge[0]}</span>` : ''}
        <button class="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-all duration-300 hover:bg-brand hover:text-white" aria-label="Guardar">
          <i data-lucide="bookmark" class="h-3.5 w-3.5"></i>
        </button>
        <div class="gallery-dots">${c.img.map((_, i) => `<span class="${i === 0 ? 'is-on' : ''}"></span>`).join('')}</div>
      </div>
      <div class="pt-[18px]">
        <a href="#"><h3 class="car-title text-[18px] font-medium leading-snug">${c.title}</h3></a>
        <p class="mt-1 truncate text-[14px]">${c.sub}</p>
        <p class="mt-2 flex items-center gap-1.5 text-[13px] text-ink/70">
          <i data-lucide="${c.seller === 'oficial' ? 'badge-check' : 'building-2'}" class="h-3.5 w-3.5 ${c.seller === 'oficial' ? 'text-brand' : ''}"></i>
          ${c.seller === 'oficial' ? 'Concesionario oficial' : 'Agencia multimarca'} · ${c.city}
        </p>
        <div class="mt-[14px] grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-line py-[14px] text-[14px]">
          <span class="flex items-center gap-2"><i data-lucide="gauge" class="h-[18px] w-[18px]"></i>${c.km}</span>
          <span class="flex items-center gap-2"><i data-lucide="fuel" class="h-[18px] w-[18px]"></i>${c.fuel}</span>
          <span class="flex items-center gap-2"><i data-lucide="cog" class="h-[18px] w-[18px]"></i>${c.gear}</span>
          <span class="flex items-center gap-2"><i data-lucide="calendar" class="h-[18px] w-[18px]"></i>${c.year}</span>
        </div>
        <div class="flex items-center justify-between pt-[16px]">
          <span class="text-[20px] font-bold">${c.price}</span>
          <a href="#" class="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand transition-colors hover:text-ink">Ver detalle <i data-lucide="arrow-up-right" class="h-4 w-4"></i></a>
        </div>
      </div>
    </article>
  </div>`;

// Galería al pasar el mouse: la posición del cursor elige la foto
const bindGalleries = (root) => $$('[data-gallery]', root).forEach((box) => {
  const imgs = JSON.parse(box.dataset.gallery);
  imgs.forEach((src) => { const i = new Image(); i.src = src; });
  const img = $('img', box), dots = $$('.gallery-dots span', box);
  let cur = 0;
  const show = (n) => {
    if (n === cur) return;
    cur = n; img.src = imgs[n];
    dots.forEach((d, i) => d.classList.toggle('is-on', i === n));
  };
  box.addEventListener('mousemove', (e) => {
    const r = box.getBoundingClientRect();
    show(Math.min(imgs.length - 1, Math.floor(((e.clientX - r.left) / r.width) * imgs.length)));
  });
  box.addEventListener('mouseleave', () => show(0));
});

const featured = new Swiper('#featured', {
  modules: [Navigation],
  slidesPerView: 1.15, spaceBetween: 16, speed: 600,
  navigation: { prevEl: '.featured-prev', nextEl: '.featured-next' },
  breakpoints: { 640: { slidesPerView: 2.2 }, 900: { slidesPerView: 3, spaceBetween: 24 }, 1200: { slidesPerView: 4, spaceBetween: 30 } },
});

const renderFeatured = (key) => {
  const wrap = $('#featured');
  wrap.style.transition = 'opacity .3s ease';
  wrap.style.opacity = '0';
  setTimeout(() => {
    $('#featured .swiper-wrapper').innerHTML = listings[key].map(card).join('');
    paintIcons();
    bindGalleries(wrap);
    featured.update(); featured.slideTo(0, 0);
    wrap.style.opacity = '1';
  }, 250);
};
$$('#featured-tabs .tab-btn').forEach((b) => b.addEventListener('click', () => {
  $$('#featured-tabs .tab-btn').forEach((x) => x.classList.remove('is-active'));
  b.classList.add('is-active');
  renderFeatured(b.dataset.tab);
}));

$('#featured .swiper-wrapper').innerHTML = listings.nuevos.map(card).join('');
featured.update();
bindGalleries($('#featured'));

/* ---------- Íconos y animaciones de entrada ---------- */
paintIcons();
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.reveal').forEach((el) => io.observe(el));
