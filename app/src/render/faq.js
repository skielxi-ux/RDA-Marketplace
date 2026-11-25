// Preguntas frecuentes: acordeones nativos (<details>), índice por tema y datos estructurados FAQPage.
import { esc, jsonForScript } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { FAQ } from '../data/faq.js';

export const renderFaqIndice = () => FAQ.map((g) =>
  `<a href="#${g.id}" class="cf-tab border border-line bg-white">${icon(g.icon, 'h-4 w-4')} ${esc(g.titulo)}</a>`).join('');

export const renderFaq = () => FAQ.map((g) => `
  <section id="${g.id}" aria-labelledby="${g.id}-t" class="scroll-mt-28">
    <h2 id="${g.id}-t" class="flex items-center gap-3 text-[24px] font-bold md:text-[28px]">
      <span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF1FB] text-brand">${icon(g.icon, 'h-5 w-5')}</span>${esc(g.titulo)}
    </h2>
    <div class="mt-5 grid gap-3">
      ${g.preguntas.map(([q, a]) => `
      <details class="faq-item">
        <summary>${esc(q)}${icon('plus', 'faq-icon h-5 w-5 shrink-0')}</summary>
        <p>${esc(a)}</p>
      </details>`).join('')}
    </div>
  </section>`).join('');

export const renderFaqJsonLd = () => `<script type="application/ld+json">${jsonForScript({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.flatMap((g) => g.preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))),
})}</script>`;
