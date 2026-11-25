// Panel lateral de notificaciones (se abre con la campanita del header).
// Al abrirlo se marcan todas como leídas. Cada aviso lleva a donde corresponde.
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { notifsApi } from './autosApi.js';
import { pintarSinLeer } from './auth.js';

const ICONOS = {
  cuenta_aprobada: ['shield-check', 'bg-[#E8F5E9] text-[#1E6B34]'],
  cuenta_rechazada: ['circle-alert', 'bg-[#FDECEC] text-[#B42318]'],
  cambios_aprobados: ['badge-check', 'bg-[#E8F5E9] text-[#1E6B34]'],
  cambios_rechazados: ['circle-alert', 'bg-[#FDECEC] text-[#B42318]'],
  colega_pedido: ['handshake', 'bg-[#EEF1FB] text-brand'],
  colega_respuesta: ['handshake', 'bg-[#E8F5E9] text-[#1E6B34]'],
  feria_nueva: ['zap', 'bg-[#FDECEC] text-[#E5484D]'],
  auto_publicado: ['car', 'bg-[#E8F5E9] text-[#1E6B34]'],
  auto_pausado: ['car', 'bg-[#FFF6E5] text-[#8A5A00]'],
};

/** "Hace 5 min", "Hace 3 horas", "Hace 1 día"… */
function hace(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'Recién';
  const m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (m < 60) return `Hace ${m} min`;
  if (h < 24) return `Hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
  if (d < 30) return `Hace ${d} ${d === 1 ? 'día' : 'días'}`;
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

let panel, fondo, lista, origen;

function crear() {
  fondo = document.createElement('div');
  fondo.className = 'drawer-backdrop fixed inset-0 z-[60] bg-ink/50';
  panel = document.createElement('aside');
  panel.id = 'notif-panel';
  panel.className = 'notif-panel fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-[#F7F7F7] sm:w-[420px]';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'notif-titulo');
  panel.innerHTML = `
    <div class="flex items-center justify-between border-b border-line px-5 py-5 sm:px-6">
      <h2 id="notif-titulo" class="text-[24px] font-bold">Notificaciones</h2>
      <button type="button" class="icon-btn grid h-10 w-10 place-items-center rounded-full" data-notif-cerrar aria-label="Cerrar">${icon('x', 'h-5 w-5')}</button>
    </div>
    <div class="flex-1 overflow-y-auto" data-notif-lista aria-live="polite"></div>`;
  document.body.append(fondo, panel);
  lista = panel.querySelector('[data-notif-lista]');
  fondo.addEventListener('click', cerrar);
  panel.querySelector('[data-notif-cerrar]').addEventListener('click', cerrar);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
}

function cerrar() {
  panel.classList.remove('is-open');
  fondo.classList.remove('is-open');
  document.documentElement.classList.remove('overflow-hidden');
  document.querySelectorAll('[data-campanita]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  origen?.focus?.();
}

function pintar(items) {
  if (!items.length) {
    lista.innerHTML = `
      <div class="px-6 py-16 text-center">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-ink/40">${icon('bell', 'h-6 w-6')}</span>
        <p class="mt-4 text-[17px] font-bold">No tenés notificaciones</p>
        <p class="mt-1 text-[15px] text-ink/60">Acá te avisamos de tu cuenta, tus autos y las novedades.</p>
      </div>`;
    return;
  }
  lista.innerHTML = `<ul>${items.map((n) => {
    const [ic, cls] = ICONOS[n.tipo] ?? ['bell', 'bg-[#EEF1FB] text-brand'];
    const cuerpo = `
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full ${cls}">${icon(ic, 'h-5 w-5')}</span>
      <span class="min-w-0 flex-1">
        <span class="block text-[16px] leading-[1.5] ${n.leida ? '' : 'font-bold'}">${esc(n.texto)}</span>
        <span class="mt-1 block text-[14px] text-ink/60">${esc(hace(n.created_at))}</span>
      </span>
      ${n.leida ? '' : '<span class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" aria-label="Nueva"></span>'}`;
    return `<li class="border-b border-line">${n.link
      ? `<a href="./${esc(n.link)}" class="flex items-start gap-4 px-5 py-5 transition-colors hover:bg-white sm:px-6" data-notif-link>${cuerpo}</a>`
      : `<div class="flex items-start gap-4 px-5 py-5 sm:px-6">${cuerpo}</div>`}</li>`;
  }).join('')}</ul>`;
  // Si el link es de la misma página (ej. Mi cuenta → #feria), cerrar el panel
  lista.querySelectorAll('[data-notif-link]').forEach((a) => a.addEventListener('click', () => {
    const u = new URL(a.href);
    if (u.pathname === location.pathname) { cerrar(); if (u.hash === location.hash) window.dispatchEvent(new HashChangeEvent('hashchange')); }
  }));
}

export async function abrirNotificaciones(boton) {
  if (!panel) crear();
  origen = boton;
  lista.innerHTML = `<p class="flex items-center gap-2 px-6 py-8 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando…</p>`;
  fondo.classList.add('is-open');
  requestAnimationFrame(() => panel.classList.add('is-open'));
  document.documentElement.classList.add('overflow-hidden');
  document.querySelectorAll('[data-campanita]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  panel.querySelector('[data-notif-cerrar]').focus();
  try {
    const { items, sin_leer: n } = await notifsApi('listar');
    pintar(items);
    if (n) { await notifsApi('leer'); pintarSinLeer(0); }
  } catch (e) {
    lista.innerHTML = `<p class="m-5 rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${esc(e.message)}</p>`;
  }
}
