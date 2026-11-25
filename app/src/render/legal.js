// Páginas legales (Términos y Privacidad) a partir de data/legales.js.
import { esc } from '../lib/html.js';

const ancla = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const renderLegal = (secciones) => secciones.map(([titulo, bloques]) => `
  <section id="${ancla(titulo)}" class="scroll-mt-28" aria-labelledby="${ancla(titulo)}-t">
    <h2 id="${ancla(titulo)}-t">${esc(titulo)}</h2>
    ${bloques.map((b) => (typeof b === 'string' ? `<p>${esc(b)}</p>` : `<ul>${b.lista.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`)).join('')}
  </section>`).join('');

export const renderIndiceLegal = (secciones) => secciones.map(([titulo]) =>
  `<li><a href="#${ancla(titulo)}" class="block rounded-lg px-3 py-2 text-ink/70 transition-colors hover:bg-soft hover:text-brand">${esc(titulo)}</a></li>`).join('');
