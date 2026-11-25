// Página "Mi cuenta": +Buscados (ranking), Publicar vehículo (carga masiva) y Mis autos (agencias aprobadas).
import { $, $$ } from './dom.js';
import { esc, formatPrice } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { supa, cuentaGuardada } from './auth.js';
import { renderRanking } from './ranking.js';
import { autosApi, fotoUrl } from './autosApi.js';
import { carUrl } from '../data/catalog.js';
import { initPerfil } from './perfil.js';
import { initColegas } from './colegas.js';

export function initMiCuenta() {
  const guest = $('[data-mc-guest]');
  const panel = $('[data-mc-panel]');
  const btnBuscados = $('[data-mc-buscados]');
  const boxBuscados = $('#buscados');
  const btnPublicar = $('[data-mc-publicar]');
  const btnMis = $('[data-mc-misautos]');
  const boxMis = $('#mis-autos');
  const listaMis = $('[data-mis-autos]');
  const btnColegas = $('[data-mc-colegas]');
  const boxColegas = $('#colegas');
  const btnPerfil = $('[data-mc-perfil]');
  const boxPerfil = $('#perfil');
  let rankingCargado = false;
  let esAgencia = false;

  const activar = (btn, box) => {
    box.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-active');
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const abrirRanking = async () => {
    activar(btnBuscados, boxBuscados);
    if (!rankingCargado) {
      rankingCargado = true;
      await renderRanking(boxBuscados, await supa());
    }
  };

  // ---------- Mis autos ----------
  const pintarMisAutos = (autos) => {
    if (!autos.length) {
      listaMis.innerHTML = `
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${icon('plus', 'h-4 w-4')} Publicar vehículos</a>
        </div>`;
      return;
    }
    const pub = autos.filter((a) => a.estado === 'publicado').length;
    listaMis.innerHTML = `
      <p class="mb-4 text-[15px] text-ink/70">${autos.length} ${autos.length === 1 ? 'auto' : 'autos'} · ${pub} ${pub === 1 ? 'publicado' : 'publicados'}</p>
      <ul class="grid gap-3">
        ${autos.map((a) => {
          const foto = fotoUrl(a.fotos?.[0] ?? '');
          const pausado = a.estado === 'pausado';
          const titulo = `${a.marca} ${a.modelo} ${a.version} ${a.anio}`;
          return `
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${foto ? `<img src="${esc(foto)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${pausado ? 'opacity-50 grayscale' : ''}" />` : '<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>'}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${esc(a.codigo)}</span>
                  ${pausado ? `<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${a.pausado_por_admin ? 'Pausado por Red de Autos' : 'Pausado'}</span>` : '<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>'}
                  <span class="text-ink/60">${esc(a.fotos?.length ?? 0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${esc(titulo)}</p>
                <p class="text-[15px]">${esc(formatPrice(Number(a.precio), a.moneda))}</p>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              ${pausado ? '' : `<a href="${esc(carUrl({ real: true, id: a.id }))}" class="btn-outline h-[42px] !px-4 text-[14px]">${icon('eye', 'h-4 w-4')} Ver</a>`}
              ${a.pausado_por_admin ? '' : `<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${pausado ? 'publicado' : 'pausado'}" data-id="${esc(a.id)}">${pausado ? 'Volver a publicar' : 'Pausar'}</button>`}
            </div>
          </li>`;
        }).join('')}
      </ul>`;
  };

  const cargarMisAutos = async () => {
    listaMis.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando tus autos…</p>`;
    try {
      const { autos } = await autosApi('mios');
      pintarMisAutos(autos ?? []);
    } catch (e) {
      listaMis.innerHTML = `<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${esc(e.message)}</p>`;
    }
  };
  const abrirMisAutos = () => { activar(btnMis, boxMis); cargarMisAutos(); };
  let colegasCargado = false;
  const abrirColegas = () => {
    activar(btnColegas, boxColegas);
    if (!colegasCargado) { colegasCargado = true; initColegas($('[data-colegas-box]')); }
  };
  let perfilCargado = false;
  const abrirPerfil = () => {
    activar(btnPerfil, boxPerfil);
    if (!perfilCargado) { perfilCargado = true; initPerfil($('[data-perfil-box]')); }
  };

  listaMis.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-estado]');
    if (!b) return;
    b.disabled = true;
    try {
      await autosApi('estado', { id: b.dataset.id, estado: b.dataset.estado });
      await cargarMisAutos();
    } catch (err) {
      b.disabled = false;
      listaMis.insertAdjacentHTML('afterbegin', `<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${esc(err.message)}</p>`);
    }
  });

  // ---------- Estado de la cuenta ----------
  const habilitar = (el, on, sub) => {
    el.classList.toggle('is-soon', !on);
    if (el.tagName === 'BUTTON') el.disabled = !on;
    else { el.toggleAttribute('aria-disabled', !on); on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'); }
    $('[data-mc-publicar-sub], [data-mc-misautos-sub]', el).textContent = sub;
  };

  const pintar = (cuenta) => {
    guest.hidden = !!cuenta;
    panel.hidden = !cuenta;
    if (!cuenta) {
      $('[data-mc-title]').textContent = 'Mi cuenta';
      $('[data-mc-sub]').textContent = 'Tu espacio en Red de Autos.';
      boxBuscados.hidden = true; rankingCargado = false;
      boxMis.hidden = true;
      boxPerfil.hidden = true;
      perfilCargado = false;
      boxColegas.hidden = true;
      colegasCargado = false;
      return;
    }
    const tipo = cuenta.tipo === 'agencia'
      ? (cuenta.agencia_tipo === 'oficial' ? `Concesionario oficial${cuenta.marca_oficial ? ` ${cuenta.marca_oficial}` : ''}` : 'Agencia multimarca')
      : 'Particular';
    $('[data-mc-title]').textContent = `Hola, ${cuenta.nombre.split(' ')[0]}`;
    $('[data-mc-sub]').textContent = `${cuenta.nombre} · ${tipo}`;
    const pendiente = cuenta.estado === 'pendiente';
    $('[data-mc-pending]').classList.toggle('hidden', !pendiente);
    btnBuscados.disabled = pendiente;
    btnBuscados.classList.toggle('is-soon', pendiente);

    esAgencia = cuenta.tipo === 'agencia' && cuenta.estado === 'aprobada';
    habilitar(btnPublicar, esAgencia, esAgencia ? 'Cargá tu stock con la plantilla de Excel y tus fotos.' : pendiente ? 'Disponible cuando aprobemos tu agencia.' : 'Próximamente.');
    habilitar(btnMis, esAgencia, esAgencia ? 'Mirá, pausá o volvé a publicar tus autos.' : pendiente ? 'Disponible cuando aprobemos tu agencia.' : 'Próximamente.');

    // Perfil: cualquier agencia (aprobada o en revisión)
    btnPerfil.hidden = cuenta.tipo !== 'agencia';
    if (cuenta.tipo !== 'agencia') boxPerfil.hidden = true;
    if (cuenta.tipo === 'agencia' && location.hash === '#perfil') abrirPerfil();

    btnColegas.hidden = !esAgencia;
    if (!esAgencia) boxColegas.hidden = true;
    if (esAgencia && location.hash === '#colegas') abrirColegas();

    if (!pendiente && location.hash === '#buscados') abrirRanking();
    if (esAgencia && location.hash === '#mis-autos') abrirMisAutos();
  };

  btnBuscados.addEventListener('click', abrirRanking);
  btnMis.addEventListener('click', abrirMisAutos);
  btnPerfil.addEventListener('click', abrirPerfil);
  btnColegas.addEventListener('click', abrirColegas);
  // La campanita lleva a #colegas: si ya estamos en Mi cuenta, abrir la sección
  window.addEventListener('hashchange', () => { if (location.hash === '#colegas' && esAgencia) abrirColegas(); });
  btnPublicar.addEventListener('click', (e) => { if (!esAgencia) e.preventDefault(); });
  window.addEventListener('rda:cuenta', (e) => pintar(e.detail));
  pintar(cuentaGuardada());
}
