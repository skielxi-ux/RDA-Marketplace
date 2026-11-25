// Mi cuenta → Red de colegas: pedir un auto a todas las agencias y ver los pedidos de los colegas.
import { $, $$ } from './dom.js';
import { esc } from '../lib/html.js';
import { renderColegas, renderPedido, renderTelegram, modelosDe } from '../render/colegas.js';
import { colegasApi } from './autosApi.js';
import { refrescarCampanita } from './auth.js';

const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export async function initColegas(box) {
  box.innerHTML = renderColegas();
  const form = $('[data-colega-form]', box);
  const errBox = $('[data-colega-error]', box);
  const list = $('[data-cg-list]', box);
  const count = $('[data-cg-count]', box);
  const q = $('[data-cg-q]', box);
  const error = (m) => { errBox.textContent = m || ''; errBox.hidden = !m; };
  let pedidos = [];
  let tab = 'todos';

  // ---------- Telegram ----------
  const tgBox = $('[data-tg-box]', box);
  const pintarTelegram = async () => {
    try { tgBox.innerHTML = renderTelegram(await colegasApi('telegram_estado')); } catch { tgBox.innerHTML = ''; }
  };
  tgBox.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-tg-conectar]');
    if (!b) return;
    b.disabled = true;
    try {
      const { url } = await colegasApi('telegram_vincular');
      if (/^https:\/\/t\.me\//.test(url)) window.open(url, '_blank', 'noopener');
      tgBox.insertAdjacentHTML('beforeend', '<p class="mt-2 text-[14px] text-ink/70">Se abrió Telegram: tocá <b>Iniciar</b> en el bot y volvé acá.</p>');
      // Al volver a la pestaña, revisar si quedó conectado
      window.addEventListener('focus', pintarTelegram, { once: true });
    } catch (err) {
      tgBox.insertAdjacentHTML('beforeend', `<p class="auth-error mt-2">${esc(err.message)}</p>`);
    } finally {
      b.disabled = false;
    }
  });

  // ---------- Lista ----------
  const pintar = () => {
    const t = norm(q.value.trim());
    const visibles = pedidos.filter((p) => (tab === 'mios' ? p.mio : !p.mio && p.estado === 'activo'))
      .filter((p) => !t || norm(`${p.marca} ${p.modelo} ${p.version ?? ''} ${p.agencia.nombre} ${p.agencia.ciudad}`).includes(t));
    list.innerHTML = visibles.map(renderPedido).join('') || `<li class="rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60 lg:col-span-2">${
      t ? 'No hay pedidos con esa búsqueda.' : tab === 'mios' ? 'Todavía no pediste ningún auto a los colegas.' : 'No hay pedidos de colegas por ahora.'}</li>`;
    count.textContent = `${visibles.length} ${visibles.length === 1 ? 'pedido' : 'pedidos'}`;
  };
  const cargar = async () => {
    try {
      ({ pedidos } = await colegasApi('listar'));
      pintar();
    } catch (e) {
      list.innerHTML = `<li class="auth-error lg:col-span-2">${esc(e.message)}</li>`;
    }
  };
  $$('[data-cg-tab]', box).forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.cgTab;
    $$('[data-cg-tab]', box).forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
    pintar();
  }));
  let tq;
  q.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(pintar, 200); });

  list.addEventListener('click', async (e) => {
    // "Lo tengo": abre WhatsApp y además le avisa a la agencia que pidió (campanita + Telegram)
    const lt = e.target.closest('[data-cg-lotengo]');
    if (lt) {
      const p = pedidos.find((x) => x.id === lt.dataset.cgLotengo);
      if (p && !p.respondi) { p.respondi = true; colegasApi('lo_tengo', { id: p.id }).then(() => pintar()).catch(() => {}); }
      return;
    }
    const b = e.target.closest('[data-cg-cerrar]');
    if (!b) return;
    b.disabled = true;
    try { await colegasApi('cerrar', { id: b.dataset.cgCerrar }); await cargar(); } catch (err) { b.disabled = false; error(err.message); }
  });

  // ---------- Nuevo pedido ----------
  const marca = $('#cg-marca', box);
  marca.addEventListener('change', () => {
    $('#cg-modelos', box).innerHTML = modelosDe(marca.value).map((m) => `<option value="${esc(m)}"></option>`).join('');
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error('');
    const d = Object.fromEntries(new FormData(form));
    if (!d.marca) return error('Elegí la marca.');
    if (!String(d.modelo).trim()) return error('Escribí el modelo.');
    if (d.anio_desde && d.anio_hasta && Number(d.anio_desde) > Number(d.anio_hasta)) return error('El año "desde" tiene que ser menor o igual al "hasta".');
    const btn = $('[data-colega-enviar]', box);
    btn.disabled = true;
    try {
      const r = await colegasApi('crear', d);
      form.reset();
      $('[data-colega-details]', box).open = false;
      box.insertAdjacentHTML('afterbegin', `<p class="mb-6 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[15px] text-ok" role="status" data-cg-ok>Listo: tu pedido les llegó a ${esc(r.avisadas)} ${r.avisadas === 1 ? 'agencia' : 'agencias'}${r.telegram ? ` (${esc(r.telegram)} por Telegram)` : ''}.</p>`);
      setTimeout(() => $('[data-cg-ok]', box)?.remove(), 8000);
      $('[data-cg-tab="mios"]', box).click();
      await cargar();
    } catch (err) {
      error(err.message);
    } finally {
      btn.disabled = false;
    }
  });

  await Promise.all([pintarTelegram(), cargar()]);
  // Ya los vio: la campanita vuelve a cero
  try { await colegasApi('leer'); refrescarCampanita(); } catch { /* nada */ }
}
