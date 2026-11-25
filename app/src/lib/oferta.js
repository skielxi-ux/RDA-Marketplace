// Precio relámpago de feria: texto del tiempo que falta y actualización en vivo de los relojes.
const dur = (ms) => {
  const m = Math.max(1, Math.ceil(ms / 60000));
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
  if (d) return `${d} d ${h} h`;
  if (h) return `${h} h ${String(min).padStart(2, '0')} min`;
  return `${min} min`;
};

/** "Termina en 3 h 05 min" · "Empieza en 1 d 2 h" · "Terminó". */
export function textoOferta({ ini, fin }, ahora = Date.now()) {
  const i = new Date(ini).getTime(), f = new Date(fin).getTime();
  if (ahora >= f) return 'Terminó';
  return ahora < i ? `Empieza en ${dur(i - ahora)}` : `Termina en ${dur(f - ahora)}`;
}

/** Actualiza cada 30 s los relojes [data-oferta-fin] dentro de root. Al terminar, avisa con onFin(el). */
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
  return setInterval(tick, 30000);
}
