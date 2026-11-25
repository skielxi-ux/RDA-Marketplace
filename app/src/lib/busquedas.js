// Registra una búsqueda para el ranking +Buscados (solo marca, modelo y condición; sin datos personales).
// origen: 'buscador' (home) · 'filtro' (listado) · 'marca' (clic en una marca) · 'ficha' (visita a un auto).
// El servidor no cuenta dos veces la misma marca/modelo del mismo visitante en 30 minutos.
import { SITE } from '../data/site.js';

export function registrarBusqueda({ marca, modelo = null, condicion = 'todos', origen = 'buscador' }) {
  if (!marca) return;
  try {
    fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_registrar_busqueda`, {
      method: 'POST',
      keepalive: true,
      headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_marca: marca, p_modelo: modelo || null, p_condicion: condicion, p_origen: origen }),
    }).catch(() => {});
  } catch { /* si falla, la navegación sigue igual */ }
}
