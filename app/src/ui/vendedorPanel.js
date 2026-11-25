// Mi cuenta → Mis clientes (vendedores independientes): su código, cómo usar el link y los clientes que trajo por auto.
import { esc, formatPrice } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { fotoUrl } from '../lib/fotos.js';
import { vendedorApi } from './autosApi.js';

const fecha = (iso) => new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
const n = (x, uno, varios) => `${x} ${x === 1 ? uno : varios}`;

export async function initVendedorPanel(box) {
  box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando…</p>`;
  let r;
  try { r = await vendedorApi('panel'); } catch (e) {
    box.innerHTML = `<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${esc(e.message)}</p>`;
    return;
  }
  const filas = r.clientes ?? [];
  box.innerHTML = `
    <div class="rounded-[24px] bg-soft p-5 sm:p-7">
      <p class="text-[13px] font-bold uppercase tracking-[0.1em] text-ink/60">Tu código</p>
      <p class="mt-1 font-mono text-[30px] font-bold tracking-[0.15em]">${esc(r.ref)}</p>
      <ol class="mt-4 grid gap-3 text-[15px] leading-[1.6] text-ink/80 md:grid-cols-3">
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">1.</b> Entrá a <a href="./agencias.html?filtro=independientes" class="text-brand underline underline-offset-4">Agencias</a> y mirá cuáles aceptan vendedores independientes y cuánta comisión pagan.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">2.</b> En la ficha de un auto de esas agencias tocá <b>"Compartir con mi link"</b> y mandáselo a tu cliente.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">3.</b> Cuando tu cliente abre el link o le escribe a la agencia, queda registrado acá. Es tu constancia ante la agencia.</li>
      </ol>
    </div>
    <h3 class="mt-8 text-[20px] font-bold">Clientes que trajiste</h3>
    ${filas.length ? `<ul class="mt-4 grid gap-3">${filas.map((x) => {
      const foto = fotoUrl(x.auto.foto ?? '');
      const wa = x.agencia.whatsapp ? `https://wa.me/${x.agencia.whatsapp}?text=${encodeURIComponent(`Hola ${x.agencia.nombre}, soy vendedor independiente de Red de Autos (código ${r.ref}). Te escribo por el ${x.auto.titulo}.`)}` : '';
      return `
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
        ${foto ? `<img src="${esc(foto)}" alt="" width="120" height="90" loading="lazy" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />` : '<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>'}
        <div class="min-w-0 flex-1">
          <p class="truncate text-[16px] font-bold">${esc(x.auto.titulo || 'Auto')}</p>
          <p class="text-[14px] text-ink/70">${esc(x.agencia.nombre ?? '')}${x.agencia.comision ? ` · comisión ${esc(x.agencia.comision)} %` : ''}${x.auto.precio ? ` · ${esc(formatPrice(Number(x.auto.precio), x.auto.moneda))}` : ''}${x.auto.estado && x.auto.estado !== 'publicado' ? ` · <b>${x.auto.estado === 'vendido' ? 'Vendido' : 'Pausado'}</b>` : ''}</p>
          <p class="mt-1 flex flex-wrap gap-x-3 text-[13px] text-ink/60">
            <span class="inline-flex items-center gap-1">${icon('eye', 'h-3.5 w-3.5')} ${esc(n(x.vista, 'visita', 'visitas'))}</span>
            <span class="inline-flex items-center gap-1">${icon('message-circle', 'h-3.5 w-3.5')} ${esc(n(x.whatsapp, 'WhatsApp a la agencia', 'WhatsApp a la agencia'))}</span>
            ${x.llamada ? `<span class="inline-flex items-center gap-1">${icon('phone', 'h-3.5 w-3.5')} ${esc(n(x.llamada, 'llamada', 'llamadas'))}</span>` : ''}
            <span>Último: ${esc(fecha(x.ultimo))}</span>
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          <a href="./auto.html?id=${encodeURIComponent(x.auto.id)}" class="btn-outline h-[40px] !px-4 text-[14px]">${icon('eye', 'h-4 w-4')} Ver</a>
          ${wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[40px] !px-4 text-[14px]">${icon('message-circle', 'h-4 w-4')} Agencia</a>` : ''}
        </div>
      </li>`;
    }).join('')}</ul>`
    : `<div class="mt-4 rounded-[20px] border border-dashed border-line p-8 text-center">
        <p class="text-[18px] font-bold">Todavía no hay clientes registrados</p>
        <p class="mt-1 text-[15px] text-ink/70">Compartí autos con tu link y acá vas a ver cada visita y cada contacto con la agencia.</p>
        <a href="./agencias.html?filtro=independientes" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${icon('handshake', 'h-4 w-4')} Ver agencias que aceptan</a>
      </div>`}
    <p class="mt-4 text-[13px] text-ink/60">Contamos una visita y un contacto por persona, auto y día. No guardamos datos de tus clientes. La comisión la arreglás y la cobrás directo con la agencia.</p>`;
}
