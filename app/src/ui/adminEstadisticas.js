// Admin → Estadísticas del sitio: visitas, de dónde vienen, qué páginas y qué autos se miran, y los números reales de la red.
// Datos anónimos (ver lib/visitas.js). Los da la función mkt_estadisticas_sitio, solo para la sesión del admin.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';

const PAGINAS = {
  inicio: 'Inicio', autos: 'Listado de autos', ficha: 'Fichas de autos', feria: 'Feria online', agencias: 'Agencias', agencia: 'Página de una agencia',
  marcas: 'Marcas', favoritos: 'Favoritos', 'mi-cuenta': 'Mi cuenta', vender: 'Vendé tu auto', publicar: 'Publicar (agencias)',
  'como-funciona': 'Cómo funciona', 'preguntas-frecuentes': 'Preguntas frecuentes', 'quienes-somos': 'Quiénes somos', seguros: 'Seguros',
  terminos: 'Términos y condiciones', privacidad: 'Privacidad',
};
const ORIGENES = {
  directo: 'Directo (escribieron la dirección, favoritos o apps)', interno: 'Otra pestaña del sitio', google: 'Google', bing: 'Bing', yahoo: 'Yahoo',
  duckduckgo: 'DuckDuckGo', facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', telegram: 'Telegram', tiktok: 'TikTok',
  x: 'X (Twitter)', linkedin: 'LinkedIn', youtube: 'YouTube', 'link compartido': 'Link compartido (WhatsApp y otros)',
  'vendedor independiente': 'Link de un vendedor independiente',
};
const n = (x) => Number(x || 0).toLocaleString('es-AR');
const fmtDia = (d) => new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

const dato = (valor, txt, ic, nota = '') => `
  <div class="rounded-2xl border border-line bg-white p-5">
    <p class="flex items-center gap-2 text-[14px] font-medium text-ink/60">${icon(ic, 'h-4 w-4')} ${txt}</p>
    <p class="mt-2 text-[32px] font-bold leading-none">${esc(n(valor))}</p>
    ${nota ? `<p class="mt-2 text-[13px] text-ink/50">${nota}</p>` : ''}
  </div>`;

function lista(titulo, filas, etiqueta) {
  const total = filas.reduce((a, f) => a + Number(f.n), 0) || 1;
  return `
  <div class="rounded-2xl border border-line bg-white p-5">
    <h3 class="text-[17px] font-bold">${titulo}</h3>
    ${filas.length ? `<ul class="mt-4 space-y-3">${filas.map((f) => {
      const pct = Math.round((Number(f.n) / total) * 100);
      return `<li>
        <div class="flex items-baseline justify-between gap-3 text-[14px]"><span class="min-w-0 truncate">${esc(etiqueta(f))}</span><span class="shrink-0 font-bold">${esc(n(f.n))} <span class="font-normal text-ink/50">· ${pct}%</span></span></div>
        <div class="mt-1 h-2 overflow-hidden rounded-full bg-soft"><span class="est-barra block h-full rounded-full bg-brand" data-w="${pct}"></span></div>
      </li>`;
    }).join('')}</ul>` : '<p class="mt-3 text-[14px] text-ink/60">Todavía no hay datos.</p>'}
  </div>`;
}

export async function renderEstadisticas(box, sb) {
  let dias = Number(box.dataset.dias || 30);
  box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando estadísticas…</p>`;
  const { data: e, error } = await sb.rpc('mkt_estadisticas_sitio', { p_dias: dias });
  if (error) throw new Error('No pudimos cargar las estadísticas.');
  const max = Math.max(1, ...e.por_dia.map((d) => d.visitantes));
  const r = e.red;
  box.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-[22px] font-bold">Estadísticas del sitio</h2>
        <p class="mt-1 text-[14px] text-ink/60">Anónimas: sin cookies, sin guardar IP y sin servicios de terceros. Empezaron a contarse el 25 de noviembre de 2026.</p>
      </div>
      <div class="flex gap-2" role="group" aria-label="Período">
        ${[7, 30, 90].map((d) => `<button type="button" class="${d === dias ? 'btn-primary' : 'btn-outline'} h-[40px] !px-4 text-[14px]" data-est-dias="${d}" aria-pressed="${d === dias}">${d} días</button>`).join('')}
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      ${dato(e.visitas, 'Visitas', 'eye', 'Cada vez que alguien entra al sitio.')}
      ${dato(e.visitantes, 'Visitantes', 'users', 'Personas distintas por día, sumadas.')}
      ${dato(e.paginas_vistas, 'Páginas vistas', 'images')}
      ${dato(Number(e.contactos.whatsapp) + Number(e.contactos.llamadas), 'Contactos a vendedores', 'message-circle', `${n(e.contactos.whatsapp)} WhatsApp · ${n(e.contactos.llamadas)} llamadas · ${n(e.contactos.compartidos)} compartidos`)}
    </div>

    <div class="mt-4 rounded-2xl border border-line bg-white p-5">
      <h3 class="text-[17px] font-bold">Visitantes por día</h3>
      <div class="mt-4 flex h-[140px] items-end gap-[3px]" role="img" aria-label="Visitantes por día: ${esc(e.por_dia.map((d) => `${fmtDia(d.dia)} ${d.visitantes}`).join(', '))}">
        ${e.por_dia.map((d) => `<span class="mc-bar group relative flex-1 rounded-t-[4px] ${d.visitantes ? 'bg-brand' : 'bg-line'}" data-h="${Math.max(3, Math.round((d.visitantes / max) * 100))}"><span class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[12px] text-white group-hover:block">${esc(fmtDia(d.dia))}: ${esc(d.visitantes)} visitantes · ${esc(d.visitas)} visitas</span></span>`).join('')}
      </div>
      <div class="mt-2 flex justify-between text-[12px] text-ink/50"><span>${esc(fmtDia(e.por_dia[0]?.dia ?? ''))}</span><span>Hoy</span></div>
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-3">
      ${lista('De dónde vienen', e.origenes, (f) => ORIGENES[f.origen] ?? f.origen)}
      ${lista('Páginas más vistas', e.paginas, (f) => PAGINAS[f.pagina] ?? f.pagina)}
      ${lista('Dispositivo', e.dispositivos, (f) => ({ celular: 'Celular', compu: 'Compu / tablet' }[f.dispositivo] ?? 'Otro'))}
    </div>

    <div class="mt-4 rounded-2xl border border-line bg-white p-5">
      <h3 class="text-[17px] font-bold">Autos más mirados</h3>
      ${e.autos.length ? `<ol class="mt-4 divide-y divide-line">${e.autos.map((a, i) => `
        <li class="flex items-center gap-4 py-3 text-[15px]">
          <span class="w-6 shrink-0 text-center font-bold text-ink/40">${i + 1}</span>
          <a href="./auto.html?id=${encodeURIComponent(a.id)}" target="_blank" rel="noopener" class="min-w-0 flex-1 truncate font-medium hover:text-brand">${esc(a.titulo)} <span class="font-normal text-ink/60">· ${esc(a.agencia)}</span></a>
          <span class="shrink-0 text-ink/70">${icon('eye', 'inline h-4 w-4')} ${esc(n(a.vistas))}</span>
          <span class="shrink-0 text-ink/70">${icon('message-circle', 'inline h-4 w-4')} ${esc(n(a.contactos))}</span>
        </li>`).join('')}</ol>` : '<p class="mt-3 text-[14px] text-ink/60">Todavía no hay datos.</p>'}
    </div>

    <div class="mt-4 rounded-2xl bg-soft p-5">
      <h3 class="text-[17px] font-bold">Números reales de la red (hoy)</h3>
      <p class="mt-1 text-[14px] text-ink/60">Son los que irían en el bloque de cifras de la home, que está oculto. Avisá cuando quieras mostrarlo.</p>
      <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        ${dato(r.autos, 'Autos publicados', 'car')}${dato(r.agencias, 'Agencias verificadas', 'badge-check')}${dato(r.oficiales, 'Concesionarios oficiales', 'store')}${dato(r.provincias, 'Provincias', 'map-pin')}
      </div>
    </div>`;
  // Alturas y anchos por CSSOM (la CSP no deja estilos en línea)
  box.querySelectorAll('.mc-bar').forEach((b) => { b.style.height = `${b.dataset.h}%`; });
  box.querySelectorAll('.est-barra').forEach((b) => { b.style.width = `${Math.max(2, b.dataset.w)}%`; });
  box.querySelectorAll('[data-est-dias]').forEach((b) => b.addEventListener('click', () => {
    box.dataset.dias = b.dataset.estDias;
    renderEstadisticas(box, sb).catch(() => {});
  }));
}
