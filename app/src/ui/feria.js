// Aviso de feria online (home y página de la feria): lee la feria vigente (función pública de solo lectura) y muestra la cuenta regresiva.
// Devuelve la feria si hay una próxima o en curso, o null.
import { $, $$ } from './dom.js';
import { SITE } from '../data/site.js';

const pad = (n) => String(n).padStart(2, '0');
const fecha = (d) => new Date(d).toLocaleString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export async function initFeria() {
  const box = $('#feria-banner');
  if (!box) return null;
  let f;
  try {
    const res = await fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_feria_actual`, {
      method: 'POST',
      headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return null;
    [f] = await res.json();
  } catch { return null; }
  if (!f?.nombre) return null;

  const empieza = new Date(f.empieza).getTime();
  const termina = new Date(f.termina).getTime();
  if (Number.isNaN(empieza) || Number.isNaN(termina)) return null;

  // Todo con textContent: los datos vienen de la base, nunca se insertan como HTML.
  $('[data-feria-nombre]', box).textContent = f.nombre;
  const desc = $('[data-feria-desc]', box);
  desc.textContent = f.descripcion || '';
  desc.hidden = !f.descripcion;
  $('[data-feria-fechas]', box).textContent = `Del ${fecha(f.empieza)} al ${fecha(f.termina)} h`;

  const cd = Object.fromEntries($$('[data-cd]', box).map((el) => [el.dataset.cd, el]));
  const tick = () => {
    const now = Date.now();
    if (now >= termina) { box.hidden = true; clearInterval(timer); return; }
    const enCurso = now >= empieza;
    $('[data-feria-estado]', box).textContent = enCurso ? 'Feria online · En curso' : 'Feria online · Próximamente';
    $('[data-feria-cuenta-label]', box).textContent = enCurso ? 'Termina en' : 'Empieza en';
    const left = Math.max(0, Math.floor(((enCurso ? termina : empieza) - now) / 1000));
    cd.d.textContent = String(Math.floor(left / 86400));
    cd.h.textContent = pad(Math.floor((left % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((left % 3600) / 60));
    cd.s.textContent = pad(left % 60);
  };
  const timer = setInterval(tick, 1000);
  tick();
  box.hidden = false;
  return f;
}
