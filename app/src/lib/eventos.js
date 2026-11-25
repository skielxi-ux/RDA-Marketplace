// Estadísticas para las agencias: vistas de ficha y clics de contacto de los autos reales.
// Sin datos personales; el servidor cuenta una vez por visitante, auto, tipo y día.
import { SITE } from '../data/site.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function registrarEvento(autoId, tipo) {
  if (!UUID.test(String(autoId))) return; // los autos de ejemplo no se cuentan
  try {
    fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_registrar_evento`, {
      method: 'POST',
      keepalive: true,
      headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_auto: autoId, p_tipo: tipo }),
    }).catch(() => {});
  } catch { /* nunca frena la navegación */ }
}
