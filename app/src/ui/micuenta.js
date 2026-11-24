// Página "Mi cuenta": botón +Buscados con el ranking (y lugar para publicar y ver autos más adelante).
import { $ } from './dom.js';
import { supa, cuentaGuardada } from './auth.js';
import { renderRanking } from './ranking.js';

export function initMiCuenta() {
  const guest = $('[data-mc-guest]');
  const panel = $('[data-mc-panel]');
  const btn = $('[data-mc-buscados]');
  const box = $('#buscados');
  let cargado = false;

  const abrirRanking = async () => {
    box.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-active');
    if (!cargado) {
      cargado = true;
      await renderRanking(box, await supa());
    }
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pintar = (cuenta) => {
    guest.hidden = !!cuenta;
    panel.hidden = !cuenta;
    if (!cuenta) {
      $('[data-mc-title]').textContent = 'Mi cuenta';
      $('[data-mc-sub]').textContent = 'Tu espacio en Red de Autos.';
      box.hidden = true; cargado = false;
      return;
    }
    const tipo = cuenta.tipo === 'agencia'
      ? (cuenta.agencia_tipo === 'oficial' ? `Concesionario oficial${cuenta.marca_oficial ? ` ${cuenta.marca_oficial}` : ''}` : 'Agencia multimarca')
      : 'Particular';
    $('[data-mc-title]').textContent = `Hola, ${cuenta.nombre.split(' ')[0]}`;
    $('[data-mc-sub]').textContent = `${cuenta.nombre} · ${tipo}`;
    const pendiente = cuenta.estado === 'pendiente';
    $('[data-mc-pending]').classList.toggle('hidden', !pendiente);
    btn.disabled = pendiente;
    btn.classList.toggle('is-soon', pendiente);
    if (!pendiente && location.hash === '#buscados') abrirRanking();
  };

  btn.addEventListener('click', abrirRanking);
  window.addEventListener('rda:cuenta', (e) => pintar(e.detail));
  pintar(cuentaGuardada());
}
