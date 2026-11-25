// Estadísticas del sitio, anónimas: qué página se vio, de dónde vino la visita y si es celular o compu.
// Sin cookies ni servicios de terceros. El servidor guarda un código diario irreversible en lugar de la IP.
import { SITE } from '../data/site.js';

const BUSCADORES = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|yandex)\./;
const REDES = [
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'whatsapp'],
  [/(^|\.)(t\.me|telegram\.org)$/, 'telegram'],
  [/(^|\.)(tiktok\.com)$/, 'tiktok'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
];

function origen() {
  const q = new URLSearchParams(location.search);
  if (q.get('ref')) return 'vendedor independiente';
  const utm = (q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9 .-]/g, '').slice(0, 40);
  if (utm) return utm;
  let h = '';
  try { h = new URL(document.referrer).hostname.replace(/^(www|m|l|lm|mobile)\./, ''); } catch { /* sin referencia */ }
  if (!h) return 'directo';
  if (h === location.hostname) return 'interno';
  const b = h.match(BUSCADORES);
  if (b) return b[2];
  return REDES.find(([re]) => re.test(h))?.[1] ?? h.slice(0, 40);
}

const pagina = () => {
  const f = location.pathname.split('/').pop().replace(/\.html$/, '');
  if (!f || f === 'index') return 'inicio';
  if (f === 'auto' || f.startsWith('auto-')) return 'ficha';
  return f.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'otra';
};

/** Registra la página vista (una vez por carga). Nunca frena la navegación. */
export function registrarVisita() {
  try {
    if (navigator.webdriver || /^(localhost|127\.)/.test(location.hostname)) return;
    let entrada = false;
    try { entrada = !sessionStorage.getItem('rda-visita'); sessionStorage.setItem('rda-visita', '1'); } catch { entrada = true; }
    const dispositivo = matchMedia('(pointer: coarse)').matches && innerWidth < 1024 ? 'celular' : 'compu';
    fetch(`${SITE.supabase.url}/rest/v1/rpc/mkt_registrar_visita`, {
      method: 'POST',
      keepalive: true,
      headers: { apikey: SITE.supabase.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_pagina: pagina(), p_origen: entrada ? origen() : null, p_dispositivo: dispositivo, p_entrada: entrada }),
    }).catch(() => {});
  } catch { /* nada */ }
}
