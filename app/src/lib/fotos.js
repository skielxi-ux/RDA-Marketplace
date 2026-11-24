// Fotos de autos cargados por las agencias (Supabase Storage, bucket público mkt-fotos).
import { SITE } from '../data/site.js';

const SEGURA = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/;
/** URL pública de una foto. Solo acepta rutas con el formato que genera el servidor. */
export const fotoUrl = (path) => (SEGURA.test(String(path)) ? `${SITE.supabase.url}/storage/v1/object/public/mkt-fotos/${path}` : '');

/** Achica la foto en el navegador (lado mayor 1600 px) y la pasa a WebP (o JPEG si el navegador no sabe WebP). */
export async function comprimir(file, formato) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const escala = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * escala), h = Math.round(bmp.height * escala);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close?.();
  const tipo = formato === 'jpg' ? 'image/jpeg' : 'image/webp';
  const blob = await new Promise((r) => canvas.toBlob(r, tipo, 0.82));
  if (!blob) throw new Error('No pudimos procesar una foto.');
  return blob;
}

/** ¿El navegador sabe generar WebP? (Safari viejo devuelve PNG). */
export async function formatoFotos() {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const b = await new Promise((r) => c.toBlob(r, 'image/webp', 0.8));
  return b?.type === 'image/webp' ? 'webp' : 'jpg';
}
