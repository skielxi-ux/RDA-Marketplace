// Ubicación aproximada para el mapa de la ficha: nunca la dirección exacta.
// Si la ciudad está en la lista, se centra en la ciudad; si no, en la provincia (con una zona más amplia).
import { CITY_COORDS } from './catalog.js';

const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

// Capital de cada provincia (centro aproximado)
const PROVINCIAS = {
  'Buenos Aires': [-34.9214, -57.9545], CABA: [-34.6037, -58.3816], Catamarca: [-28.4696, -65.7795], Chaco: [-27.4512, -58.9866],
  Chubut: [-43.3002, -65.1023], 'Córdoba': [-31.4201, -64.1888], Corrientes: [-27.4692, -58.8306], 'Entre Ríos': [-31.7333, -60.5297],
  Formosa: [-26.1775, -58.1781], Jujuy: [-24.1858, -65.2995], 'La Pampa': [-36.6203, -64.2906], 'La Rioja': [-29.4131, -66.8558],
  Mendoza: [-32.8895, -68.8458], Misiones: [-27.3621, -55.9009], 'Neuquén': [-38.9516, -68.0591], 'Río Negro': [-40.8135, -62.9967],
  Salta: [-24.7821, -65.4232], 'San Juan': [-31.5375, -68.5364], 'San Luis': [-33.295, -66.3356], 'Santa Cruz': [-51.623, -69.2168],
  'Santa Fe': [-31.6107, -60.6973], 'Santiago del Estero': [-27.7834, -64.2642], 'Tierra del Fuego': [-54.8019, -68.303], 'Tucumán': [-26.8083, -65.2176],
};
// Ciudades conocidas (y formas comunes de escribirlas)
const CIUDADES = new Map([
  ...Object.entries(CITY_COORDS).map(([k, v]) => [norm(k), v]),
  ['tucuman', CITY_COORDS['San Miguel de Tucumán']], ['san miguel de tucuman', CITY_COORDS['San Miguel de Tucumán']],
  ['capital federal', CITY_COORDS.CABA], ['buenos aires', CITY_COORDS.CABA], ['ciudad de buenos aires', CITY_COORDS.CABA],
  ['la plata', PROVINCIAS['Buenos Aires']], ['cordoba capital', CITY_COORDS['Córdoba']], ['parana', PROVINCIAS['Entre Ríos']],
  ['resistencia', PROVINCIAS.Chaco], ['posadas', PROVINCIAS.Misiones], ['neuquen', PROVINCIAS['Neuquén']],
  ['san juan', PROVINCIAS['San Juan']], ['san luis', PROVINCIAS['San Luis']], ['santa fe', PROVINCIAS['Santa Fe']],
  ['santiago del estero', PROVINCIAS['Santiago del Estero']], ['san salvador de jujuy', PROVINCIAS.Jujuy], ['corrientes', PROVINCIAS.Corrientes],
  ['mar del plata', [-38.0055, -57.5426]], ['bahia blanca', [-38.7196, -62.2724]], ['rio cuarto', [-33.1232, -64.3493]],
  ['villa maria', [-32.4075, -63.2402]], ['tafi viejo', [-26.7324, -65.2593]], ['concepcion', [-27.3436, -65.5928]],
]);

/** [lat, lng, zona] — zona 1 = ciudad, 4 = provincia. null si no se sabe. */
export function coordsFor(ciudad, provincia) {
  const c = CIUDADES.get(norm(ciudad));
  if (c) return [c[0], c[1], 1];
  const p = Object.entries(PROVINCIAS).find(([k]) => norm(k) === norm(provincia))?.[1];
  return p ? [p[0], p[1], 4] : null;
}
