// Llamadas a la edge function mkt-autos con la sesión de la cuenta (agencias aprobadas).
import { SITE } from '../data/site.js';
import { supa } from './auth.js';

export async function autosApi(accion, extra = {}) {
  const sb = await supa();
  const token = (await sb.auth.getSession()).data.session?.access_token;
  if (!token) { const e = new Error('Tu sesión venció. Volvé a ingresar.'); e.status = 401; throw e; }
  const res = await fetch(`${SITE.supabase.url}/functions/v1/mkt-autos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SITE.supabase.publishableKey, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ accion, ...extra }),
  });
  let data = {};
  try { data = await res.json(); } catch { /* vacío */ }
  if (!res.ok) { const e = new Error(data.error || 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.'); e.status = res.status; throw e; }
  return data;
}

export { fotoUrl } from '../lib/fotos.js';
