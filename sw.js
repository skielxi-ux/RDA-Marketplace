// Red de Autos · service worker: solo muestra las notificaciones de las alertas (no guarda nada en caché).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

const BASE = new URL('./', self.registration.scope).href;
const propia = (u) => { try { const x = new URL(u, BASE); return x.href.startsWith(BASE) ? x.href : BASE; } catch { return BASE; } };

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'Red de Autos', body: e.data?.text() ?? '' }; }
  e.waitUntil(self.registration.showNotification(String(d.title || 'Red de Autos').slice(0, 120), {
    body: String(d.body || '').slice(0, 240),
    icon: `${BASE}apple-touch-icon.png`,
    badge: `${BASE}favicon.svg`,
    tag: d.tag || undefined,
    data: { url: propia(d.url || BASE) },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || BASE;
  e.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const t = tabs.find((c) => c.url.startsWith(BASE));
    if (t) { await t.focus(); return t.navigate(url); }
    return self.clients.openWindow(url);
  })());
});
