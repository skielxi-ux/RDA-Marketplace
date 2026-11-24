import { $, initTabs } from './dom.js';
import { renderModelOptions } from '../render/sections.js';

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
}
