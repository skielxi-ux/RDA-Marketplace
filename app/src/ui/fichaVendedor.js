// Ficha de un auto real: seguimiento del link de vendedores independientes (?ref=CODIGO)
// y, si el que mira es un vendedor aprobado, el recuadro "Compartir con mi link".
import { urlCompartir } from '../lib/compartir.js';
import { $ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { SITE } from '../data/site.js';
import { cuentaGuardada } from './auth.js';
import { vendedorApi } from './autosApi.js';

const REF = /^[A-Z2-9]{6}$/;
const clave = (id) => `rda-ref:${id}`;

function registrar(ref, autoId, tipo) {
  try {
    fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_registrar_referido`, {
      method: 'POST',
      keepalive: true,
      headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_ref: ref, p_auto: autoId, p_tipo: tipo }),
    }).catch(() => {});
  } catch { /* nunca frena la ficha */ }
}

export async function initFichaVendedor(c) {
  // 1) Llegó por el link de un vendedor: lo recordamos para este auto (por si recarga) y registramos la visita y los contactos
  const q = new URLSearchParams(location.search).get('ref')?.toUpperCase() ?? '';
  let ref = REF.test(q) ? q : '';
  try {
    if (ref) sessionStorage.setItem(clave(c.id), ref);
    else ref = sessionStorage.getItem(clave(c.id)) ?? '';
  } catch { /* sin almacenamiento: solo esta carga */ }
  if (REF.test(ref)) {
    registrar(ref, c.id, 'vista');
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-whatsapp]')) registrar(ref, c.id, 'whatsapp');
      else if (e.target.closest('[data-llamar]')) registrar(ref, c.id, 'llamada');
    });
  }

  // 2) Es un vendedor independiente aprobado y la agencia acepta: recuadro para compartir con su link
  const yo = cuentaGuardada();
  if (yo?.tipo !== 'vendedor' || yo.estado !== 'aprobada') return;
  let r;
  try { r = await vendedorApi('comisiones'); } catch { return; }
  const comision = r.comisiones?.[c.sellerInfo?.id];
  const card = $('.seller-card');
  if (!card || !r.ref) return;
  const caja = document.createElement('aside');
  caja.className = 'mt-5 rounded-[20px] border border-line bg-white p-5';
  caja.setAttribute('aria-label', 'Vendedor independiente');
  if (!comision) {
    caja.innerHTML = `<p class="flex items-center gap-2 text-[15px] text-ink/70">${icon('handshake', 'h-5 w-5 text-ink/40')} Esta agencia no trabaja con vendedores independientes.</p>`;
  } else {
    const url = await urlCompartir(c.id, r.ref);
    const texto = `Mirá este auto: ${document.title.split(' | ')[0]} ${url}`;
    caja.innerHTML = `
      <p class="flex items-center gap-2 text-[16px] font-bold">${icon('handshake', 'h-5 w-5 text-brand')} Comisión para vos: ${esc(comision)} %</p>
      <p class="mt-1 text-[14px] leading-[1.6] text-ink/70">Sobre el precio final de venta. Compartí el auto con tu link: las visitas y los contactos de tu cliente quedan registrados en Mis clientes.</p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <a href="https://wa.me/?text=${encodeURIComponent(texto)}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[46px] justify-center !px-3 text-[14px]">${icon('message-circle', 'h-4 w-4')} Compartir</a>
        <button type="button" class="btn-outline h-[46px] justify-center !px-3 text-[14px]" data-copiar-ref>${icon('share-2', 'h-4 w-4')} Copiar link</button>
      </div>`;
    caja.querySelector('[data-copiar-ref]').addEventListener('click', async (e) => {
      const b = e.currentTarget;
      try { await navigator.clipboard.writeText(url); b.lastChild.textContent = ' ¡Copiado!'; } catch { window.prompt('Copiá tu link:', url); }
    });
  }
  card.after(caja);
}
