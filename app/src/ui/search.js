import { $, initTabs } from './dom.js';
import { renderModelOptions } from '../render/sections.js';
import { SITE } from '../data/site.js';

export function initSearch() {
  const make = $('#sel-make');
  const model = $('#sel-model');
  const condition = $('#search-condition');

  make.addEventListener('change', () => {
    model.innerHTML = renderModelOptions(make.value);
    model.disabled = !make.value;
  });

  initTabs($('#search-tabs'), (tab) => { condition.value = tab.dataset.cond; });

  // El formulario va a autos.html por GET (funciona aun sin JavaScript).
  // Antes de ir, se registra la búsqueda para el ranking +Buscados (solo marca, modelo y condición; sin datos personales).
  const form = $('#search-form');
  form.addEventListener('submit', (e) => {
    if (!make.value) return; // sin marca no se cuenta
    e.preventDefault();
    try {
      fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_registrar_busqueda`, {
        method: 'POST',
        keepalive: true,
        headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_marca: make.value, p_modelo: model.value || null, p_condicion: condition.value }),
      }).catch(() => {});
    } catch { /* si falla, la búsqueda sigue igual */ }
    form.submit();
  });
}
