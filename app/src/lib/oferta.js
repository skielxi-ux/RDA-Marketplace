// Precio relámpago de feria: texto del tiempo que falta y actualización en vivo de los relojes.
const pad = (n) => String(n).padStart(2, '0');
/** Cuenta regresiva: "05:59:42" o "2 d 05:59:42". */
const dur = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400), h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60), sg = t % 60;
  return `${d ? `${d} d ` : ''}${pad(h)}:${pad(m)}:${pad(sg)}`;
};

/** "Termina en 03:05:12" · "Empieza en 1 d 02:00:00" · "Terminó". */
export function textoOferta({ ini, fin }, ahora = Date.now()) {
  const i = new Date(ini).getTime(), f = new Date(fin).getTime();
  if (ahora >= f) return 'Terminó';
  return ahora < i ? `Empieza en ${dur(i - ahora)}` : `Termina en ${dur(f - ahora)}`;
}

/** Actualiza cada segundo los relojes [data-oferta-fin] dentro de root. Al terminar, avisa con onFin(el). */
export function relojesOferta(root = document, onFin) {
  const tick = () => {
    root.querySelectorAll('[data-oferta-fin]').forEach((el) => {
      const txt = textoOferta({ ini: el.dataset.ofertaIni || 0, fin: el.dataset.ofertaFin });
      const t = el.querySelector('[data-oferta-txt]') ?? el;
      if (t.textContent !== txt) t.textContent = txt;
      if (txt === 'Terminó' && onFin) onFin(el);
    });
  };
  tick();
  return setInterval(tick, 1000);
}

let global = 0;
/** Un solo reloj para todas las tarjetas de la página (listado, home, agencia, favoritos). */
export function relojGlobal() {
  if (!global) global = relojesOferta(document);
}
