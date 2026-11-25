// "Avisame cuando entre": crea una alerta con los filtros del listado y activa las notificaciones del navegador.
// Necesita cuenta: si no ingresó, abre el ingreso y después le pide tocar de nuevo (el permiso necesita un toque).
import { $ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { cuentaGuardada } from './auth.js';
import { alertasApi } from './autosApi.js';
import { activarPush } from '../lib/push.js';

/** Describe la alerta en palabras: "Toyota Corolla Cross usado desde 2020 hasta USD 25.000". */
export function describirAlerta(a) {
  const partes = [a.marca, a.modelo, a.condicion && a.condicion !== 'todos' ? (a.condicion === '0km' ? '0km' : 'usado') : ''].filter(Boolean);
  if (a.anio_desde) partes.push(`desde ${a.anio_desde}`);
  if (a.precio_max) partes.push(`hasta ${a.moneda === 'USD' ? 'USD' : '$'} ${Number(a.precio_max).toLocaleString('es-AR')}`);
  return partes.join(' ');
}

export function initAlertaListado() {
  const btn = $('[data-alerta-crear]');
  const msg = $('[data-alerta-msg]');
  if (!btn || !msg) return;
  const label = $('[data-alerta-label]', btn);
  let pendiente = false;
  let ocupado = false;

  const mostrar = (tipo, html) => {
    msg.className = `mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-[15px] ${tipo === 'ok' ? 'bg-[#E8F5E9] text-[#1E6B34]' : tipo === 'info' ? 'bg-[#EEF1FB] text-brand' : 'bg-[#FDECEC] text-[#B42318]'}`;
    msg.innerHTML = `${icon(tipo === 'ok' ? 'circle-check' : tipo === 'info' ? 'bell' : 'circle-alert', 'mt-0.5 h-5 w-5 shrink-0')}<div class="min-w-0">${html}</div>`;
    msg.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const criterios = () => {
    const q = new URLSearchParams(location.search);
    const pmax = q.get('pmax');
    return {
      marca: q.get('marca') || '',
      modelo: q.get('modelo') || '',
      condicion: ['0km', 'usados'].includes(q.get('condicion')) ? q.get('condicion') : 'todos',
      anio_desde: q.get('anio') || '',
      precio_max: pmax || '',
      moneda: pmax ? (q.get('moneda') === 'USD' ? 'USD' : 'ARS') : '',
    };
  };

  async function crear() {
    const c = criterios();
    if (!c.marca) {
      mostrar('info', 'Elegí al menos la <b>marca</b> en los filtros (y si querés, modelo, año y precio) y tocá de nuevo <b>Avisame cuando entre</b>.');
      return;
    }
    if (!cuentaGuardada()) {
      pendiente = true;
      mostrar('info', 'Ingresá o creá tu cuenta gratis con tu celular y seguimos con la alerta.');
      window.dispatchEvent(new CustomEvent('rda:abrir-ingreso'));
      return;
    }
    if (ocupado) return;
    ocupado = true; btn.disabled = true; label.textContent = 'Activando…';
    try {
      const p = await activarPush();
      if (p.error) { mostrar('error', esc(p.motivo)); return; }
      const { alerta, actualizada } = await alertasApi('crear', c);
      if (p.nueva) await alertasApi('probar').catch(() => {});
      mostrar('ok', `<b>${actualizada ? 'Actualizamos tu alerta' : 'Listo, alerta creada'}:</b> te avisamos con una notificación cuando entre un <b>${esc(describirAlerta(alerta))}</b>. <a href="./mi-cuenta.html#alertas" class="underline underline-offset-4">Ver mis alertas</a>`);
    } catch (e) {
      mostrar('error', esc(e.message || 'No pudimos crear la alerta. Probá de nuevo.'));
    } finally {
      ocupado = false; btn.disabled = false; label.textContent = 'Avisame cuando entre';
    }
  }

  btn.addEventListener('click', crear);
  // Si tuvo que ingresar: el navegador solo deja pedir permiso de notificaciones tras un toque, así que se lo pedimos
  window.addEventListener('rda:cuenta', (e) => {
    if (!pendiente || !e.detail) return;
    pendiente = false;
    mostrar('info', '¡Listo, ya ingresaste! Tocá otra vez <b>Avisame cuando entre</b> para activar los avisos.');
    btn.focus({ preventScroll: true });
  });
}

