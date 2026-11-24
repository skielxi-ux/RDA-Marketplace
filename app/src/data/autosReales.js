// Autos cargados por las agencias (Supabase). Se leen con funciones públicas de solo lectura
// y se convierten al mismo formato que los autos de ejemplo, así usan las mismas tarjetas y fichas.
import { SITE } from './site.js';
import { CITY_COORDS } from './catalog.js';
import { fotoUrl } from '../lib/fotos.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const esIdReal = (id) => UUID.test(String(id ?? ''));
const TIPOS = new Set(['oficial', 'multimarca', 'particular']);

export function fromDb(r) {
  const titulo = `${r.marca} ${r.modelo} ${r.version}`;
  return {
    real: true,
    id: r.id,
    brand: r.marca, model: r.modelo, version: r.version, year: r.anio,
    km: r.km, condition: r.condicion === '0km' ? 'new' : 'used',
    fuel: r.combustible, gear: r.transmision, body: r.carroceria,
    price: Number(r.precio), currency: r.moneda,
    desc: r.descripcion || `${titulo} ${r.anio}, ${r.condicion === '0km' ? '0km' : 'usado'}. Consultá por WhatsApp.`,
    city: r.ciudad, province: r.provincia,
    engine: r.motor, doors: r.puertas, color: r.color, drive: r.traccion,
    photoUrls: (r.fotos ?? []).map(fotoUrl).filter(Boolean),
    sellerInfo: {
      id: r.vendedor_id,
      name: r.vendedor_nombre,
      type: TIPOS.has(r.vendedor_tipo) ? r.vendedor_tipo : 'multimarca',
      phone: /^\d{10,15}$/.test(r.vendedor_tel ?? '') ? r.vendedor_tel : '',
    },
    badge: r.condicion === '0km' ? 'nuevo' : null,
    published: new Date(r.publicado_at).getTime() || 0,
    features: null, dims: null, reviews: [],
    coords: CITY_COORDS[r.ciudad] ?? null,
  };
}

async function rpc(nombre, body = {}) {
  const res = await fetch(`${SITE.supabase.url}/rest/v1/rpc/${nombre}`, {
    method: 'POST',
    headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('No pudimos cargar los autos.');
  return res.json();
}

/** Todos los autos publicados por agencias (si falla, devuelve [] y el sitio sigue con los de ejemplo). */
export async function cargarAutosReales() {
  try {
    const rows = await rpc('mkt_autos_publicos');
    return (Array.isArray(rows) ? rows : []).map(fromDb).filter((c) => c.photoUrls.length);
  } catch {
    return [];
  }
}

/** Un auto por id (null si no existe o no está publicado). */
export async function cargarAuto(id) {
  if (!esIdReal(id)) return null;
  const rows = await rpc('mkt_auto', { p_id: id });
  const c = Array.isArray(rows) && rows[0] ? fromDb(rows[0]) : null;
  return c?.photoUrls.length ? c : null;
}
