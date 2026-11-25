// Mi cuenta → Mis alertas: lista de alertas, borrar, y estado de las notificaciones en este dispositivo.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { alertasApi } from './autosApi.js';
import { activarPush, pushActivo, pushSoportado } from '../lib/push.js';
import { describirAlerta } from './alertaListado.js';

const fecha = (iso) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

export function initMisAlertas(box) {
  let ocupado = false;

  async function pintar() {
    box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando tus alertas…</p>`;
    let r;
    try { r = await alertasApi('listar'); } catch (e) {
      box.innerHTML = `<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${esc(e.message)}</p>`;
      return;
    }
    const activo = await pushActivo().catch(() => false);
    const aviso = activo
      ? `<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#E8F5E9] px-5 py-4 text-[15px] text-[#1E6B34]"><span class="flex items-center gap-2">${icon('circle-check', 'h-5 w-5')} Las notificaciones están activas en este dispositivo.</span><button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-al-probar>Mandarme una de prueba</button></div>`
      : `<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#EEF1FB] px-5 py-4 text-[15px] text-brand"><span class="flex items-center gap-2">${icon('bell', 'h-5 w-5')} ${pushSoportado() ? 'Activá las notificaciones en este dispositivo para recibir los avisos.' : 'Este navegador no permite notificaciones. En iPhone, agregá el sitio a la pantalla de inicio y abrilo desde ahí.'}</span>${pushSoportado() ? '<button type="button" class="btn-primary h-[40px] !px-4 text-[14px]" data-al-activar>Activar</button>' : ''}</div>`;
    const lista = r.alertas.length
      ? `<ul class="mt-5 grid gap-3">${r.alertas.map((a) => `
          <li class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="flex items-center gap-2 text-[16px] font-bold">${icon('bell', 'h-4 w-4 text-brand')} ${esc(describirAlerta(a))}</p>
              <p class="mt-1 text-[13px] text-ink/60">Creada el ${esc(fecha(a.created_at))} · ${a.avisos ? `${esc(a.avisos)} ${a.avisos === 1 ? 'aviso' : 'avisos'}, el último el ${esc(fecha(a.ultimo_aviso_at))}` : 'todavía sin avisos'}</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <a href="./autos.html?${esc(new URLSearchParams(Object.entries({ marca: a.marca, modelo: a.modelo ?? '', condicion: a.condicion === 'todos' ? '' : a.condicion, anio: a.anio_desde ?? '', pmax: a.precio_max ?? '', moneda: a.precio_max ? a.moneda : '' }).filter(([, v]) => v !== '' && v != null)).toString())}" class="btn-outline h-[40px] !px-4 text-[14px]">${icon('eye', 'h-4 w-4')} Ver autos</a>
              <button type="button" class="btn-outline h-[40px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-al-borrar="${esc(a.id)}" aria-label="Borrar alerta ${esc(describirAlerta(a))}">${icon('x', 'h-4 w-4')} Borrar</button>
            </div>
          </li>`).join('')}</ul>`
      : `<div class="mt-5 rounded-[20px] border border-dashed border-line p-8 text-center">
           <p class="text-[18px] font-bold">Todavía no tenés alertas</p>
           <p class="mt-1 text-[15px] text-ink/70">Filtrá el auto que buscás y tocá <b>Avisame cuando entre</b>. Te avisamos apenas lo publiquen.</p>
           <a href="./autos.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${icon('search', 'h-4 w-4')} Buscar autos</a>
         </div>`;
    box.innerHTML = `${aviso}${lista}<p class="mt-4 text-[13px] text-ink/60">Podés tener hasta 10 alertas. Te avisamos una sola vez por cada auto.</p><p class="mt-3 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-al-error></p>`;
  }

  box.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-al-activar], [data-al-probar], [data-al-borrar]');
    if (!b || ocupado) return;
    const err = box.querySelector('[data-al-error]');
    ocupado = true; b.disabled = true;
    try {
      if (b.dataset.alBorrar) {
        if (!window.confirm('¿Borrar esta alerta?')) return;
        await alertasApi('borrar', { id: b.dataset.alBorrar });
      } else if ('alActivar' in b.dataset) {
        const p = await activarPush();
        if (p.error) { err.textContent = p.motivo; err.classList.remove('hidden'); return; }
        await alertasApi('probar').catch(() => {});
      } else {
        await alertasApi('probar');
        return;
      }
      await pintar();
    } catch (ex) {
      if (err) { err.textContent = ex.message; err.classList.remove('hidden'); }
    } finally { ocupado = false; b.disabled = false; }
  });

  pintar();
}
