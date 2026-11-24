// Marcas y modelos que se ofrecen en el buscador (mercado argentino).
// Es más amplio que el stock: así el ranking +Buscados muestra lo que la gente busca de verdad.
// Incluye todas las marcas/modelos del catálogo para que los filtros coincidan.
import { cars } from './catalog.js';

const BASE = {
  Audi: ['A1', 'A3', 'A4', 'A6', 'A7', 'Q3', 'Q5'],
  BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'M4', 'X1', 'X3', 'X5'],
  BYD: ['Dolphin', 'Yuan Pro', 'Song Plus', 'Seal'],
  Chery: ['Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 7'],
  Chevrolet: ['Onix', 'Prisma', 'Cruze', 'Tracker', 'Equinox', 'Spin', 'S10', 'Camaro'],
  'Citroën': ['C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'Berlingo'],
  Fiat: ['Mobi', 'Argo', 'Cronos', 'Pulse', 'Fastback', 'Strada', 'Toro', 'Palio', 'Siena', '500'],
  Ford: ['Ka', 'Fiesta', 'Focus', 'EcoSport', 'Territory', 'Kuga', 'Bronco Sport', 'Ranger', 'Maverick', 'Explorer', 'Mustang'],
  Honda: ['Fit', 'City', 'Civic', 'WR-V', 'HR-V', 'CR-V'],
  Hyundai: ['HB20', 'Creta', 'Tucson', 'Santa Fe'],
  Jeep: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee'],
  Kia: ['Picanto', 'Rio', 'Seltos', 'Sportage', 'Sorento'],
  'Land Rover': ['Range Rover Evoque', 'Range Rover Sport', 'Defender', 'Discovery'],
  'Mercedes-Benz': ['Clase A', 'Clase C', 'GLA', 'GLC', 'Sprinter', 'AMG GT'],
  Nissan: ['March', 'Versa', 'Sentra', 'Kicks', 'X-Trail', 'Frontier'],
  Peugeot: ['208', '2008', '308', '408', '3008', '5008', 'Partner'],
  Porsche: ['718 Boxster', '911', 'Cayenne', 'Macan'],
  RAM: ['1500', '2500', 'Rampage'],
  Renault: ['Kwid', 'Sandero', 'Stepway', 'Logan', 'Duster', 'Captur', 'Kangoo', 'Oroch', 'Alaskan'],
  Toyota: ['Etios', 'Yaris', 'Corolla', 'Corolla Cross', 'Camry', 'RAV4', 'Hilux', 'SW4'],
  Volkswagen: ['Gol', 'Polo', 'Virtus', 'Vento', 'T-Cross', 'Nivus', 'Taos', 'Tiguan', 'Saveiro', 'Amarok'],
};

// Sumar lo que haya en el catálogo y no esté en la lista
for (const c of cars) {
  BASE[c.brand] ||= [];
  if (!BASE[c.brand].includes(c.model)) BASE[c.brand].push(c.model);
}

export const SEARCH_MAKES = Object.fromEntries(
  Object.keys(BASE).sort((a, b) => a.localeCompare(b, 'es')).map((m) => [m, [...BASE[m]].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))]),
);
export const searchBrands = Object.keys(SEARCH_MAKES);
export const isSearchBrand = (b) => Object.hasOwn(SEARCH_MAKES, b ?? '');
export const isSearchModel = (b, m) => isSearchBrand(b) && SEARCH_MAKES[b].includes(m);
