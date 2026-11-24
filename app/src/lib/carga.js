// Carga masiva de autos: leer la plantilla, validar cada fila y unir cada foto con su auto por el Código.
// Funciones puras (sin DOM): se pueden probar en Node.
import { isSearchBrand, searchBrands } from '../data/modelos.js';

export const MAX_FOTOS = 7;
export const MAX_AUTOS = 200;
export const CODIGO_RE = /^[A-Za-z0-9_-]{1,30}$/;

export const PROVINCIAS = ['Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'];
const COMBUSTIBLES = ['Nafta', 'Diésel', 'Híbrido', 'Eléctrico', 'GNC'];
const TRANSMISIONES = ['Manual', 'Automática'];
export const CARROCERIAS = { SUV: 'suv', 'Sedán': 'sedan', Hatchback: 'hatchback', 'Pick-up': 'pickup', Deportivo: 'deportivo', Utilitario: 'utilitario' };

// Encabezado de la plantilla → campo
const COLUMNAS = {
  'código': 'codigo', marca: 'marca', modelo: 'modelo', 'versión': 'version', 'año': 'anio', 'condición': 'condicion', km: 'km',
  precio: 'precio', moneda: 'moneda', combustible: 'combustible', 'transmisión': 'transmision', 'carrocería': 'carroceria',
  ciudad: 'ciudad', provincia: 'provincia', motor: 'motor', puertas: 'puertas', color: 'color', 'tracción': 'traccion', 'descripción': 'descripcion',
};
const COLUMNAS_CLAVE = () => Object.fromEntries(Object.entries(COLUMNAS).map(([k, v]) => [clave(k), v]));
const OBLIGATORIAS = ['codigo', 'marca', 'modelo', 'version', 'anio', 'condicion', 'km', 'precio', 'moneda', 'combustible', 'transmision', 'carroceria'];

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const clave = (s) => sinTildes(String(s ?? '').toLowerCase().trim());
/** Busca el valor en una lista sin importar mayúsculas ni tildes. */
const enLista = (v, lista) => lista.find((x) => clave(x) === clave(v)) ?? null;
const txt = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
const numero = (v) => {
  if (typeof v === 'number') return v;
  const s = String(v ?? '').trim().replace(/[^\d,.-]/g, '');
  if (!s) return NaN;
  // "1.250.000" o "1,250,000" → 1250000; "45000,50" → 45000.5
  const limpio = /[.,]\d{3}([.,]|$)/.test(s) ? s.replace(/[.,](?=\d{3}(\D|$))/g, '') : s;
  return Number(limpio.replace(',', '.'));
};

/**
 * Convierte las filas de la hoja "Autos" (primera fila = encabezados) en autos validados.
 * defaults: { ciudad, provincia } de la agencia. existentes: Set de códigos ya publicados (en mayúsculas).
 */
export function leerFilas(filas, { defaults = {}, existentes = new Set(), anioMax = new Date().getFullYear() + 1 } = {}) {
  if (!Array.isArray(filas) || !filas.length) return { autos: [], error: 'El Excel está vacío.' };
  const cols = COLUMNAS_CLAVE();
  const enc = filas[0].map((h) => cols[clave(String(h ?? '').replace('*', '')).replace(/\s+/g, ' ')] ?? null);
  const faltan = OBLIGATORIAS.filter((c) => !enc.includes(c));
  if (faltan.length) return { autos: [], error: 'Este Excel no tiene las columnas de la plantilla. Descargá la plantilla y volvé a intentar.' };

  const autos = [];
  const vistos = new Map();
  filas.slice(1).forEach((fila, i) => {
    const r = {};
    enc.forEach((campo, j) => { if (campo) r[campo] = fila[j]; });
    if (Object.values(r).every((v) => v == null || String(v).trim() === '')) return; // fila vacía
    const errores = [];
    const a = { fila: i + 2, errores, fotos: [] };

    a.codigo = String(r.codigo ?? '').trim();
    if (!CODIGO_RE.test(a.codigo)) errores.push('Código: solo letras, números, - o _ (hasta 30).');
    const cod = a.codigo.toUpperCase();
    if (a.codigo && vistos.has(cod)) errores.push(`Código repetido (también en la fila ${vistos.get(cod)}).`);
    vistos.set(cod, a.fila);
    a.existe = existentes.has(cod);

    a.marca = enLista(r.marca, searchBrands) ?? txt(r.marca, 40);
    if (!a.marca) errores.push('Falta la marca.');
    else if (!isSearchBrand(a.marca)) errores.push(`Marca "${a.marca}": elegila de la lista de la plantilla.`);
    a.modelo = txt(r.modelo, 60);
    if (!a.modelo) errores.push('Falta el modelo.');
    a.version = txt(r.version, 80);
    if (!a.version) errores.push('Falta la versión.');

    a.anio = numero(r.anio);
    if (!Number.isInteger(a.anio) || a.anio < 1950 || a.anio > anioMax) errores.push(`Año inválido (entre 1950 y ${anioMax}).`);
    const cond = clave(r.condicion);
    a.condicion = cond === '0km' || cond === '0 km' || cond === 'nuevo' ? '0km' : cond === 'usado' ? 'usado' : '';
    if (!a.condicion) errores.push('Condición: 0km o Usado.');
    a.km = numero(r.km);
    if (a.condicion === '0km' && (r.km == null || String(r.km).trim() === '')) a.km = 0;
    if (!Number.isInteger(a.km) || a.km < 0 || a.km > 2000000) errores.push('Km: un número entero (0 si es 0km).');
    a.precio = Math.round(numero(r.precio));
    if (!Number.isFinite(a.precio) || a.precio <= 0) errores.push('Precio: solo números, mayor a 0.');
    a.moneda = enLista(r.moneda, ['ARS', 'USD']) ?? (/^(\$|pesos?)$/i.test(String(r.moneda ?? '').trim()) ? 'ARS' : /^(u\$s|us\$|d[oó]lares?)$/i.test(String(r.moneda ?? '').trim()) ? 'USD' : '');
    if (!a.moneda) errores.push('Moneda: ARS o USD.');
    a.combustible = enLista(r.combustible, COMBUSTIBLES) ?? (clave(r.combustible) === 'diesel' ? 'Diésel' : '');
    if (!a.combustible) errores.push(`Combustible: ${COMBUSTIBLES.join(', ')}.`);
    a.transmision = enLista(r.transmision, TRANSMISIONES) ?? (clave(r.transmision) === 'automatico' ? 'Automática' : '');
    if (!a.transmision) errores.push('Transmisión: Manual o Automática.');
    const carr = enLista(r.carroceria, Object.keys(CARROCERIAS)) ?? (clave(r.carroceria).replace(/[\s-]/g, '') === 'pickup' ? 'Pick-up' : null);
    a.carroceria = carr ? CARROCERIAS[carr] : '';
    a.carroceriaNombre = carr ?? '';
    if (!a.carroceria) errores.push(`Carrocería: ${Object.keys(CARROCERIAS).join(', ')}.`);

    a.ciudad = txt(r.ciudad, 60) || txt(defaults.ciudad, 60);
    if (!a.ciudad) errores.push('Falta la ciudad.');
    a.provincia = enLista(r.provincia, PROVINCIAS) ?? (String(r.provincia ?? '').trim() ? '' : enLista(defaults.provincia, PROVINCIAS) ?? '');
    if (!a.provincia) errores.push('Provincia: elegila de la lista.');

    a.motor = txt(r.motor, 40) || null;
    a.color = txt(r.color, 30) || null;
    a.traccion = txt(r.traccion, 30) || null;
    a.descripcion = txt(r.descripcion, 1000) || null;
    const p = r.puertas == null || String(r.puertas).trim() === '' ? null : numero(r.puertas);
    a.puertas = p;
    if (p !== null && (!Number.isInteger(p) || p < 2 || p > 5)) errores.push('Puertas: entre 2 y 5.');
    autos.push(a);
  });
  if (!autos.length) return { autos, error: 'No encontramos autos en la hoja "Autos". Completá una fila por auto.' };
  if (autos.length > MAX_AUTOS) return { autos: [], error: `Podés cargar hasta ${MAX_AUTOS} autos por vez. Dividí el Excel en partes.` };
  return { autos, error: null };
}

const IMAGEN_RE = /\.(jpe?g|png|webp)$/i;
export const esImagen = (nombre) => IMAGEN_RE.test(nombre);
const natural = (a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });

/**
 * Une cada foto con su auto. fotos: [{ id, nombre, ruta }] (ruta = "Fotos/A001/1.jpg" o solo el nombre).
 * Primero mira las carpetas (una carpeta con el nombre del código); si no, el inicio del nombre ("A001-1.jpg").
 * Devuelve { asignadas: Map(codigoMayus → [ids]), sueltas: [ids], sobrantes: Map(codigoMayus → n) }.
 */
export function unirFotos(fotos, codigos) {
  const porClave = new Map(codigos.filter(Boolean).map((c) => [c.toUpperCase(), c]));
  const ordenados = [...porClave.keys()].sort((a, b) => b.length - a.length); // el código más largo primero
  const grupos = new Map();
  const sueltas = [];
  for (const f of [...fotos].sort((a, b) => natural(a.ruta || a.nombre, b.ruta || b.nombre))) {
    const partes = String(f.ruta || f.nombre).split('/').filter(Boolean);
    const carpetas = partes.slice(0, -1).reverse().map((p) => p.trim().toUpperCase());
    let cod = carpetas.find((p) => porClave.has(p)) ?? null;
    if (!cod) {
      const base = f.nombre.replace(/\.[^.]+$/, '').trim().toUpperCase();
      cod = ordenados.find((c) => base === c || (base.startsWith(c) && /^[\s._-]/.test(base.slice(c.length)))) ?? null;
    }
    if (cod) (grupos.get(cod) ?? grupos.set(cod, []).get(cod)).push(f.id);
    else sueltas.push(f.id);
  }
  const sobrantes = new Map();
  for (const [cod, ids] of grupos) {
    if (ids.length > MAX_FOTOS) {
      sobrantes.set(cod, ids.length - MAX_FOTOS);
      sueltas.push(...ids.splice(MAX_FOTOS));
    }
  }
  return { asignadas: grupos, sueltas, sobrantes };
}
