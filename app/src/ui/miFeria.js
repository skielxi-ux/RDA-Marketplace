// Mi cuenta → Feria (agencias aprobadas): elegir qué autos del stock entran a la feria vigente,
// con su precio relámpago, desde cuándo y cuánto dura. Todo se valida de nuevo en el servidor (mkt-autos).
import { esc, formatPrice } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { autosApi, fotoUrl } from './autosApi.js';
import { textoOferta, relojesOferta } from '../lib/oferta.js';

const DURACIONES = [[0, 'Toda la feria'], [2, '2 horas'], [6, '6 horas'], [12, '12 horas'], [24, '24 horas'], [48, '48 horas'], [72, '72 horas']];
const fmt = (d) => new Date(d).toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const pad = (n) => String(n).padStart(2, '0');
/** Fecha para un <input type="datetime-local"> en la hora del dispositivo. */
const aInput = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const pct = (antes, ahora) => Math.round((1 - ahora / antes) * 100);
const error = (m) => `<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${esc(m)}</p>`;

export function initMiFeria(box) {
  let feria = null, autos = [], ofertas = new Map(), timer = 0;

  async function cargar() {
    box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando la feria…</p>`;
    try {
      const [f, m] = await Promise.all([autosApi('feria'), autosApi('mios')]);
      feria = f.feria;
      ofertas = new Map((f.ofertas ?? []).map((o) => [o.auto_id, o]));
      autos = (m.autos ?? []).filter((a) => a.estado === 'publicado' || ofertas.has(a.id));
      pintar();
    } catch (e) { box.innerHTML = error(e.message); }
  }

  function pintar() {
    clearInterval(timer);
    if (!feria) {
      box.innerHTML = `
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${icon('zap', 'h-6 w-6')}</span>
          <p class="mt-4 text-[18px] font-bold">No hay ninguna feria programada</p>
          <p class="mx-auto mt-1 max-w-[520px] text-[15px] text-ink/70">Cuando armemos la próxima te avisamos por Telegram y desde acá vas a poder sumar tus autos con precio relámpago.</p>
        </div>`;
      return;
    }
    const ahora = Date.now();
    const enCurso = new Date(feria.empieza).getTime() <= ahora;
    const enFeria = autos.filter((a) => ofertas.has(a.id));
    box.innerHTML = `
      <div class="feria-card !gap-5 !py-7">
        <div class="min-w-0">
          <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-[#9DB0FF]">${icon('zap', 'h-4 w-4')} ${enCurso ? 'En curso' : 'Próxima feria'}</p>
          <p class="mt-3 text-[24px] font-bold leading-tight sm:text-[28px]">${esc(feria.nombre)}</p>
          <p class="mt-2 text-[15px] text-white/70">Del ${esc(fmt(feria.empieza))} al ${esc(fmt(feria.termina))} h</p>
        </div>
        <div class="flex flex-col gap-3 lg:items-end">
          <p class="text-[15px] text-white/80"><b class="text-[28px] text-white">${enFeria.length}</b> ${enFeria.length === 1 ? 'auto tuyo en la feria' : 'autos tuyos en la feria'}</p>
          <a href="./feria.html" class="btn-cta w-fit" target="_blank" rel="noopener"><span class="btn-cta-icon">${icon('eye', 'h-4 w-4')}</span> Ver la feria</a>
        </div>
      </div>
      <ol class="mt-6 grid gap-3 rounded-2xl bg-soft p-5 text-[15px] text-ink/80 sm:grid-cols-3">
        <li class="flex gap-2"><b class="text-brand">1.</b> Tocá <b>Sumar a la feria</b> en los autos que quieras ofrecer.</li>
        <li class="flex gap-2"><b class="text-brand">2.</b> Poné el precio relámpago (más bajo que el actual) y cuánto dura.</li>
        <li class="flex gap-2"><b class="text-brand">3.</b> Se muestra en la página de la feria y en la ficha. Al terminar, vuelve solo a su precio.</li>
      </ol>
      ${autos.length ? `<ul class="mt-6 grid gap-3">${autos.map(fila).join('')}</ul>` : `
        <div class="mt-6 rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">No tenés autos publicados</p>
          <p class="mt-1 text-[15px] text-ink/70">Publicá tu stock para poder sumarlo a la feria.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${icon('plus', 'h-4 w-4')} Publicar vehículos</a>
        </div>`}`;
    timer = relojesOferta(box);
  }

  function fila(a) {
    const o = ofertas.get(a.id);
    const foto = fotoUrl(a.fotos?.[0] ?? '');
    const titulo = `${a.marca} ${a.modelo} ${a.version} ${a.anio}`;
    const terminada = o && new Date(o.termina).getTime() <= Date.now();
    const noPublicado = a.estado !== 'publicado';
    return `
      <li class="rounded-2xl border ${o && !terminada ? 'border-[#F3B8B4]' : 'border-line'} bg-white p-4" data-fe-auto="${esc(a.id)}">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex min-w-0 flex-1 items-center gap-4">
            ${foto ? `<img src="${esc(foto)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />` : '<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>'}
            <div class="min-w-0">
              <p class="text-[13px]"><span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${esc(a.codigo)}</span></p>
              <p class="mt-1 truncate text-[16px] font-bold">${esc(titulo)}</p>
              ${o ? `
                <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[15px]"><s class="text-ink/50">${esc(formatPrice(Number(a.precio), a.moneda))}</s> <b class="text-[#E5484D]">${esc(formatPrice(Number(o.precio_feria), a.moneda))}</b> <span class="rounded-full bg-[#FDECEC] px-2 py-0.5 text-[12px] font-bold text-[#E5484D]">-${esc(pct(Number(a.precio), Number(o.precio_feria)))}%</span></p>
                <p class="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink/60">
                  <span class="feria-timer !px-2.5 !py-0.5 !text-[12px]" data-oferta-ini="${esc(o.empieza)}" data-oferta-fin="${esc(o.termina)}">${icon('clock', 'h-3 w-3')} <span data-oferta-txt>${esc(textoOferta({ ini: o.empieza, fin: o.termina }))}</span></span>
                  ${esc(fmt(o.empieza))} → ${esc(fmt(o.termina))}
                </p>
                ${noPublicado ? '<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el auto no está publicado.</p>' : Number(o.precio_feria) >= Number(a.precio) ? '<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el precio de feria ya no es más bajo que el actual. Editalo.</p>' : ''}`
                : `<p class="mt-0.5 text-[15px]">${esc(formatPrice(Number(a.precio), a.moneda))}</p>`}
            </div>
          </div>
          <div class="flex shrink-0 flex-wrap gap-2">
            ${o ? `<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-fe-editar="${esc(a.id)}" ${noPublicado ? 'disabled' : ''}>Editar</button>
                   <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-fe-quitar="${esc(a.id)}" aria-label="Sacar ${esc(titulo)} de la feria">${icon('x', 'h-4 w-4')} Sacar</button>`
                : `<button type="button" class="btn-primary h-[42px] !px-4 text-[14px]" data-fe-editar="${esc(a.id)}">${icon('zap', 'h-4 w-4')} Sumar a la feria</button>`}
          </div>
        </div>
        <div data-fe-form hidden></div>
      </li>`;
  }

  function abrirForm(li, a) {
    box.querySelectorAll('[data-fe-form]').forEach((f) => { f.hidden = true; f.innerHTML = ''; });
    const o = ofertas.get(a.id);
    const fIni = new Date(feria.empieza).getTime(), fFin = new Date(feria.termina).getTime();
    const ini = o ? new Date(o.empieza).getTime() : Math.max(fIni, Date.now());
    const horas = o ? Math.round((new Date(o.termina) - new Date(o.empieza)) / 36e5) : 0;
    const dur = o && new Date(o.termina).getTime() >= fFin - 60000 ? 0 : (DURACIONES.find(([h]) => h === horas)?.[0] ?? 0);
    const cont = li.querySelector('[data-fe-form]');
    const id = `fe-${a.id.slice(0, 8)}`;
    cont.innerHTML = `
      <form class="mt-4 grid gap-4 border-t border-line pt-4 md:grid-cols-3" novalidate>
        <div>
          <label for="${id}-p" class="auth-label">Precio de feria (${esc(a.moneda === 'USD' ? 'US$' : '$')})</label>
          <input id="${id}-p" name="precio" class="auth-input" inputmode="numeric" autocomplete="off" required value="${o ? esc(Number(o.precio_feria).toLocaleString('es-AR')) : ''}" placeholder="Menor a ${esc(Number(a.precio).toLocaleString('es-AR'))}" />
        </div>
        <div>
          <label for="${id}-i" class="auth-label">Empieza</label>
          <input id="${id}-i" name="empieza" type="datetime-local" class="auth-input" required value="${esc(aInput(ini))}" min="${esc(aInput(fIni))}" max="${esc(aInput(fFin - 60000))}" />
        </div>
        <div>
          <label for="${id}-d" class="auth-label">Dura</label>
          <select id="${id}-d" name="horas" class="auth-input">${DURACIONES.map(([h, t]) => `<option value="${h}" ${h === dur ? 'selected' : ''}>${t}</option>`).join('')}</select>
        </div>
        <p class="text-[14px] text-ink/70 md:col-span-3" data-fe-resumen></p>
        <p class="hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318] md:col-span-3" data-fe-error></p>
        <div class="flex flex-wrap gap-2 md:col-span-3">
          <button type="submit" class="btn-primary h-[46px] !px-6">${icon('zap', 'h-4 w-4')} ${o ? 'Guardar cambios' : 'Sumar a la feria'}</button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-fe-cancelar>Cancelar</button>
        </div>
      </form>`;
    cont.hidden = false;
    const form = cont.querySelector('form');
    const precioDe = () => Number(form.elements.precio.value.replace(/\D/g, ''));
    const resumen = () => {
      const p = precioDe();
      const i = Math.max(new Date(form.elements.empieza.value).getTime() || ini, Date.now());
      const h = Number(form.elements.horas.value);
      const f = h ? Math.min(i + h * 36e5, fFin) : fFin;
      form.querySelector('[data-fe-resumen]').innerHTML = p && p < Number(a.precio)
        ? `${icon('zap', 'inline h-4 w-4 text-[#E5484D]')} <b>${esc(formatPrice(p, a.moneda))}</b> en vez de ${esc(formatPrice(Number(a.precio), a.moneda))} (<b class="text-[#E5484D]">-${esc(pct(Number(a.precio), p))}%</b>) · del ${esc(fmt(i))} al ${esc(fmt(f))} h.`
        : `Precio actual: ${esc(formatPrice(Number(a.precio), a.moneda))}. El precio de feria tiene que ser más bajo.`;
    };
    form.addEventListener('input', (e) => {
      if (e.target.name === 'precio') {
        const n = precioDe();
        e.target.value = n ? n.toLocaleString('es-AR') : '';
      }
      resumen();
    });
    form.addEventListener('change', resumen);
    resumen();
    form.elements.precio.focus();
    form.querySelector('[data-fe-cancelar]').addEventListener('click', () => { cont.hidden = true; cont.innerHTML = ''; });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = form.querySelector('[data-fe-error]');
      const fallo = (m) => { err.textContent = m; err.classList.remove('hidden'); };
      err.classList.add('hidden');
      const precio = precioDe();
      if (!precio) return fallo('Poné el precio de feria.');
      if (precio >= Number(a.precio)) return fallo(`Tiene que ser más bajo que el precio actual (${formatPrice(Number(a.precio), a.moneda)}).`);
      const empieza = new Date(form.elements.empieza.value);
      if (Number.isNaN(empieza.getTime())) return fallo('Elegí cuándo empieza.');
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true;
      try {
        await autosApi('feria_sumar', { id: a.id, precio, empieza: empieza.toISOString(), horas: Number(form.elements.horas.value) });
        await cargar();
      } catch (ex) { fallo(ex.message); btn.disabled = false; }
    });
  }

  box.addEventListener('click', async (e) => {
    const ed = e.target.closest('[data-fe-editar]');
    if (ed) {
      const a = autos.find((x) => x.id === ed.dataset.feEditar);
      if (a) abrirForm(ed.closest('[data-fe-auto]'), a);
      return;
    }
    const q = e.target.closest('[data-fe-quitar]');
    if (!q) return;
    const a = autos.find((x) => x.id === q.dataset.feQuitar);
    if (!window.confirm(`¿Sacar ${a ? `${a.marca} ${a.modelo} ${a.anio}` : 'este auto'} de la feria? Vuelve a mostrarse con su precio normal.`)) return;
    q.disabled = true;
    try { await autosApi('feria_quitar', { id: q.dataset.feQuitar }); await cargar(); } catch (ex) { q.disabled = false; box.insertAdjacentHTML('afterbegin', error(ex.message)); }
  });

  cargar();
}
