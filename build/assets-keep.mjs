// Conserva los assets de la compilación anterior para que una página cacheada
// (GitHub Pages guarda el HTML ~10 min) no pida un CSS/JS que ya no existe.
// pre: borra todo lo que no sea de la última compilación. post: anota la nueva.
import { readdirSync, readFileSync, writeFileSync, rmSync, statSync, existsSync, mkdirSync } from 'node:fs';

const DIR = 'assets', LISTA = 'build/.assets-ultima.json', INICIO = 'build/.assets-inicio';
const modo = process.argv[2];
if (!existsSync(DIR)) mkdirSync(DIR);
const archivos = readdirSync(DIR);

if (modo === 'pre') {
  const ultima = existsSync(LISTA) ? new Set(JSON.parse(readFileSync(LISTA, 'utf8'))) : new Set(archivos);
  for (const f of archivos) if (!ultima.has(f)) rmSync(`${DIR}/${f}`, { recursive: true, force: true });
  writeFileSync(INICIO, String(Date.now()));
} else {
  const desde = Number(readFileSync(INICIO, 'utf8')) - 1000;
  writeFileSync(LISTA, JSON.stringify(archivos.filter((f) => statSync(`${DIR}/${f}`).mtimeMs >= desde)));
  rmSync(INICIO, { force: true });
}
