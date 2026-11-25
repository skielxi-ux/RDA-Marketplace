// Llamadas a las edge functions de la cuenta (mkt-autos: autos de la agencia · mkt-perfil: perfil y logo · mkt-colegas: Red de colegas · mkt-alertas: alertas de compradores).
import { SITE } from '../data/site.js';
import { supa } from './auth.js';

export const autosApi = (accion, extra = {}) => cuentaApi('mkt-autos', accion, extra);
export const perfilApi = (accion, extra = {}) => cuentaApi('mkt-perfil', accion, extra);
export const colegasApi = (accion, extra = {}) => cuentaApi('mkt-colegas', accion, extra);
export const alertasApi = (accion, extra = {}) => cuentaApi('mkt-alertas', accion, extra);

/** Llama a una edge function del marketplace con la sesión de la cuenta. */
async function cuentaApi(fn, accion, extra) {
  const sb = await supa();
  const token = (await sb.auth.getSession()).data.session?.access_token;
  if (!token) { const e = new Error('Tu sesión venció. Volvé a ingresar.'); e.status = 401; throw e; }
  const res = await fetch(`${SITE.supabase.url}/functions/v1/${fn}`, {
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
