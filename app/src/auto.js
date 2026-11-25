// Ficha de un auto cargado por una agencia: auto.html?id=<uuid>
import 'swiper/css';
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initFicha } from './ui/ficha.js';
import { initFichaVendedor } from './ui/fichaVendedor.js';
import { $ } from './ui/dom.js';
import { cars, carTitle } from './data/catalog.js';
import { cargarAuto, cargarAutosReales, cargarOfertaFeria } from './data/autosReales.js';
import { relojesOferta } from './lib/oferta.js';
import { renderFicha, renderFichaJsonLd } from './render/ficha.js';
import { formatPrice, formatKm } from './lib/html.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();

(async () => {
  const main = $('#contenido');
  const id = new URLSearchParams(location.search).get('id');
  let c = null;
  let oferta = null;
  try { [c, oferta] = await Promise.all([cargarAuto(id), cargarOfertaFeria(id)]); } catch { c = null; }
  // En feria: se muestra el precio relámpago y el normal tachado, con lo que falta para que termine
  if (c && oferta && oferta.precio < c.price) Object.assign(c, { priceBefore: c.price, price: oferta.precio, feria: { ini: 0, fin: oferta.fin } });
  $('[data-ficha-cargando]').remove();
  main.removeAttribute('aria-busy');
  if (!c) {
    $('[data-ficha-error]').hidden = false;
    document.title = 'Auto no disponible | Red de Autos';
    return;
  }
  $('[data-ficha-error]').remove();
  const reales = await cargarAutosReales();
  $('[data-ficha-root]').innerHTML = renderFicha(c, [...reales, ...cars]);
  const titulo = `${carTitle(c)} ${c.year}`;
  document.title = `${titulo} · ${formatPrice(c.price, c.currency)} | Red de Autos`;
  $('meta[name="description"]').setAttribute('content', `${titulo}, ${formatKm(c.km)}, ${c.fuel.toLowerCase()}, caja ${c.gear.toLowerCase()}. ${c.city}, ${c.province}.`);
  // Datos estructurados para buscadores (JSON-LD, no ejecutable)
  const ld = document.createElement('template');
  ld.innerHTML = renderFichaJsonLd(c);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = ld.content.querySelector('script').textContent;
  document.head.append(script);
  initFicha();
  initFichaVendedor(c);
  if (c.feria) relojesOferta(main, () => location.reload());
})();
