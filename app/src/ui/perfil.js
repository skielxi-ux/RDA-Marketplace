// Mi cuenta → Perfil de la agencia: datos, contacto, presentación y logo (con recorte cuadrado).
import { $, $$ } from './dom.js';
import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { renderPerfilForm, renderPendientes, renderLogo } from '../render/perfil.js';
import { formatoFotos } from '../lib/fotos.js';
import { perfilApi } from './autosApi.js';
import { supa } from './auth.js';

const LOGO_PX = 400;   // tamaño final del logo
const STAGE_PX = 600;  // lienzo de recorte (se ve a 300 px)

export async function initPerfil(box) {
  box.innerHTML = `<p class="flex items-center gap-2 text-ink/60">${icon('loader-circle', 'h-4 w-4 animate-spin')} Cargando tu perfil…</p>`;
  let perfil;
  try {
    ({ perfil } = await perfilApi('ver'));
  } catch (e) {
    box.innerHTML = `<p class="auth-error">${esc(e.message)}</p>`;
    return;
  }
  box.innerHTML = renderPerfilForm(perfil);

  const form = $('[data-perfil-form]', box);
  const errBox = $('[data-perfil-error]', box);
  const ok = $('[data-perfil-ok]', box);
  const error = (m) => { errBox.textContent = m || ''; errBox.hidden = !m; };
  $('[data-perfil-ver]', box).href = `./agencia.html?id=${encodeURIComponent(perfil.id)}`;

  // Tipo: la marca solo para concesionarios oficiales
  const marca = $('[data-pf-marca]', box);
  form.addEventListener('change', (e) => {
    if (e.target.name === 'agencia_tipo') marca.hidden = e.target.value !== 'oficial';
  });
  // Contador de la descripción
  const desc = $('#pf-desc', box);
  const cnt = $('[data-desc-count]', box);
  const contar = () => { cnt.textContent = String(desc.value.length); };
  desc.addEventListener('input', contar);
  contar();

  // Vendedores independientes: la comisión solo se pide si acepta
  form.addEventListener('change', (e) => {
    if (e.target.name === 'acepta_independientes') $('[data-pf-comision]', box).hidden = e.target.value !== 'si';
  });

  // ---------- Guardar datos ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error(''); ok.textContent = '';
    const fd = new FormData(form);
    const datos = Object.fromEntries(['nombre', 'cuit', 'agencia_tipo', 'marca_oficial', 'ciudad', 'provincia', 'direccion', 'horario', 'whatsapp_ventas', 'email', 'descripcion', 'sitio_web', 'instagram', 'acepta_independientes', 'comision_independientes'].map((k) => [k, fd.get(k) ?? '']));
    if (datos.agencia_tipo === 'oficial' && !datos.marca_oficial) return error('Elegí la marca que representa el concesionario.');
    if (!datos.provincia) return error('Elegí la provincia.');
    const btn = $('[data-perfil-guardar]', box);
    btn.disabled = true;
    try {
      const r = await perfilApi('guardar', datos);
      perfil = r.perfil;
      $('[data-perfil-pendientes]', box).innerHTML = renderPendientes(perfil);
      ok.textContent = r.pendiente ? 'Guardado. El nombre, CUIT o tipo quedan en revisión.' : 'Listo, tus datos están actualizados.';
      if (perfil.instagram) $('#pf-ig', box).value = `@${perfil.instagram}`;
      if (perfil.sitio_web) $('#pf-web', box).value = perfil.sitio_web;
    } catch (err) {
      error(err.message);
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- Logo: recorte cuadrado ----------
  const crop = $('[data-crop]', box);
  const canvas = $('[data-crop-canvas]', box);
  const ctx = canvas.getContext('2d');
  const zoom = $('[data-crop-zoom]', box);
  let img = null, base = 1, x = 0, y = 0;

  const escala = () => base * Number(zoom.value);
  const dibujar = (c = ctx, size = STAGE_PX, fondo = true) => {
    const k = size / STAGE_PX;
    c.clearRect(0, 0, size, size);
    if (fondo) { c.fillStyle = '#fff'; c.fillRect(0, 0, size, size); }
    const s = escala() * k;
    c.drawImage(img, (x * k) + (size - img.width * s) / 2, (y * k) + (size - img.height * s) / 2, img.width * s, img.height * s);
  };
  const cerrar = () => {
    crop.hidden = true;
    document.documentElement.classList.remove('overflow-hidden');
    img?.close?.(); img = null;
  };

  $('[data-logo-input]', box).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    error('');
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return error('El logo tiene que ser JPG, PNG o WebP.');
    if (file.size > 10 * 1024 * 1024) return error('El logo pesa demasiado (máximo 10 MB).');
    try {
      img = await createImageBitmap(file);
    } catch {
      return error('No pudimos abrir esa imagen. Probá con otra.');
    }
    base = Math.min(STAGE_PX / img.width, STAGE_PX / img.height); // entra completo
    zoom.value = '1'; x = 0; y = 0;
    dibujar();
    crop.hidden = false;
    document.documentElement.classList.add('overflow-hidden');
    $('[data-crop-ok]', box).focus();
  });
  zoom.addEventListener('input', () => img && dibujar());

  // Mover arrastrando (mouse o dedo)
  let arrastre = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (!img) return;
    canvas.setPointerCapture(e.pointerId);
    const r = canvas.getBoundingClientRect();
    arrastre = { px: e.clientX, py: e.clientY, x, y, k: STAGE_PX / r.width };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    const lim = STAGE_PX * 0.75;
    x = Math.max(-lim, Math.min(lim, arrastre.x + (e.clientX - arrastre.px) * arrastre.k));
    y = Math.max(-lim, Math.min(lim, arrastre.y + (e.clientY - arrastre.py) * arrastre.k));
    dibujar();
  });
  ['pointerup', 'pointercancel'].forEach((t) => canvas.addEventListener(t, () => { arrastre = null; }));
  // Con teclado: flechas mueven, + y - acercan
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', (e) => {
    if (!img) return;
    const paso = 12;
    const mov = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] }[e.key];
    if (mov) { e.preventDefault(); x += mov[0]; y += mov[1]; dibujar(); }
    if (e.key === '+' || e.key === '-') { zoom.value = String(Math.min(4, Math.max(1, Number(zoom.value) + (e.key === '+' ? 0.1 : -0.1)))); dibujar(); }
  });

  $('[data-crop-cancel]', box).addEventListener('click', cerrar);
  crop.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  $('[data-crop-ok]', box).addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const formato = await formatoFotos();
      const out = document.createElement('canvas');
      out.width = out.height = LOGO_PX;
      // WebP conserva la transparencia; en JPEG se pone fondo blanco
      dibujar(out.getContext('2d'), LOGO_PX, formato === 'jpg');
      const blob = await new Promise((r) => out.toBlob(r, formato === 'jpg' ? 'image/jpeg' : 'image/webp', 0.9));
      if (!blob) throw new Error('No pudimos procesar el logo.');
      const { path, token } = await perfilApi('url_logo', { formato });
      const sb = await supa();
      const { error: e2 } = await sb.storage.from('mkt-fotos').uploadToSignedUrl(path, token, blob, { contentType: blob.type });
      if (e2) throw new Error('Se cortó la subida del logo. Probá de nuevo.');
      const r = await perfilApi('guardar_logo', { path });
      perfil.logo = r.logo;
      $('[data-logo-preview]', box).innerHTML = renderLogo(perfil);
      $('[data-logo-label]', box).textContent = 'Cambiar logo';
      $('[data-logo-quitar]', box).hidden = false;
      cerrar();
      ok.textContent = 'Logo guardado.';
    } catch (err) {
      cerrar();
      error(err.message);
    } finally {
      btn.disabled = false;
    }
  });

  $('[data-logo-quitar]', box).addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      await perfilApi('quitar_logo');
      perfil.logo = null;
      $('[data-logo-preview]', box).innerHTML = renderLogo(perfil);
      $('[data-logo-label]', box).textContent = 'Subir logo';
      btn.hidden = true;
    } catch (err) {
      error(err.message);
    } finally {
      btn.disabled = false;
    }
  });
  $$('input, select, textarea', form).forEach((el) => el.addEventListener('input', () => { ok.textContent = ''; }));
}
