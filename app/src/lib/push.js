// Notificaciones del navegador para las alertas de compradores (Web Push).
// Devuelve { ok } o { error, motivo } con un texto listo para mostrar.
import { alertasApi } from '../ui/autosApi.js';

const esIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const instalada = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const deB64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

export const pushSoportado = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

/** ¿Este dispositivo ya está suscripto? */
export async function pushActivo() {
  if (!pushSoportado() || Notification.permission !== 'granted') return false;
  const reg = await navigator.serviceWorker.getRegistration('./');
  return !!(await reg?.pushManager.getSubscription());
}

/** Pide permiso, suscribe este navegador y lo guarda en la cuenta. */
export async function activarPush() {
  if (!pushSoportado()) {
    return { error: true, motivo: esIOS() && !instalada()
      ? 'En iPhone, primero agregá Red de Autos a tu pantalla de inicio (botón Compartir → "Agregar a inicio") y creá la alerta desde ahí.'
      : 'Tu navegador no permite notificaciones. Probá con Chrome, Edge, Firefox o Safari actualizados.' };
  }
  if (Notification.permission === 'denied') {
    return { error: true, motivo: 'Bloqueaste las notificaciones de este sitio. Activalas desde el candado de la barra de direcciones y volvé a intentar.' };
  }
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') return { error: true, motivo: 'Para avisarte necesitamos que permitas las notificaciones.' };
  const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
  await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  const nueva = !sub;
  if (!sub) {
    const { clave } = await alertasApi('clave');
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: deB64u(clave) });
  }
  const j = sub.toJSON();
  await alertasApi('suscribir', { endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
  return { ok: true, nueva };
}

export async function desactivarPush() {
  const reg = await navigator.serviceWorker?.getRegistration('./');
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  await alertasApi('desuscribir', { endpoint: sub.endpoint }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}
