// Página "Marcas": todas las marcas del buscador, cada una lleva al listado filtrado.
import { esc } from '../lib/html.js';
import { searchBrands } from '../data/modelos.js';
import { BRAND_LOGOS } from './brandLogos.js';
import { BRAND_LOGOS_EXTRA } from './brandLogosExtra.js';

const slug = (n) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const logo = (nombre) => {
  const l = BRAND_LOGOS[slug(nombre)] ?? BRAND_LOGOS_EXTRA[slug(nombre)];
  if (l) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${l.vb}" class="h-14 w-14 sm:h-16 sm:w-16" fill="currentColor" aria-hidden="true" focusable="false">${l.inner}</svg>`;
  // Sin logo libre: el nombre en letras grandes
  return `<span class="px-2 text-center text-[22px] font-bold uppercase leading-tight tracking-[0.06em] sm:text-[24px]" aria-hidden="true">${esc(nombre)}</span>`;
};

export const renderMarcas = () => searchBrands.map((m) => `
      <li>
        <a href="./autos.html?marca=${encodeURIComponent(m)}" class="group flex flex-col items-center gap-3 text-center">
          <span class="grid aspect-square w-full place-items-center rounded-2xl border border-line bg-white text-ink transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand group-hover:text-brand group-hover:shadow-[0_10px_30px_rgba(5,11,32,0.07)] group-active:translate-y-0 group-active:scale-[0.98]">${logo(m)}</span>
          <span class="text-[16px] font-medium transition-colors group-hover:text-brand">${esc(m)}</span>
        </a>
      </li>`).join('');
