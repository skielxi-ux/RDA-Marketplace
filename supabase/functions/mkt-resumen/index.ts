// RDA Marketplace · Edge Function: mkt-resumen (resumen semanal para las agencias, los lunes a las 9 h)
// La llama pg_cron con la clave interna "mkt_cron" (header x-cron-secret). Nada público.
// enviar → manda a todas las agencias aprobadas (no de prueba): Telegram (si lo conectaron) + campanita del sitio.
// prueba {cuenta, mandar?} → devuelve el texto de una agencia; con mandar=true también se lo envía.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const SITIO = "https://skielxi-ux.github.io/RDA-Marketplace/";
type A = Record<string, any>;
const h = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (x: number) => Number(x || 0).toLocaleString("es-AR");
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fecha = (d: string) => { const [, m, dd] = d.split("-").map(Number); return `${dd} de ${MESES[m - 1]}`; };
const plural = (x: number, uno: string, varios: string) => `${n(x)} ${x === 1 ? uno : varios}`;

/** Demanda sin stock del marketplace (la misma para todas las agencias), se carga una vez por envío. */
let faltan: A[] = [];
async function cargarFaltantes() {
  const { data } = await db.rpc("mkt_faltantes_semana");
  faltan = (data ?? []).slice(0, 3);
}

/** Texto del resumen (HTML de Telegram) y versión corta para la campanita. */
function armar(r: A) {
  const contactos = r.whatsapp + r.llamadas;
  let tendencia = "";
  if (r.vistas_antes > 0) {
    const pct = Math.round(((r.vistas - r.vistas_antes) / r.vistas_antes) * 100);
    tendencia = pct > 0 ? ` (↑ ${pct}% que la semana anterior)` : pct < 0 ? ` (↓ ${Math.abs(pct)}% que la semana anterior)` : " (igual que la semana anterior)";
  }
  const l: string[] = [`📊 <b>Tu semana en Red de Autos</b>`, `Del ${fecha(r.desde)} al ${fecha(r.hasta)}`, ""];
  if (!r.autos) {
    l.push("Esta semana no tenías autos publicados. 🚗", "Publicá tu stock y empezá a recibir consultas.");
  } else {
    l.push(`👀 <b>${plural(r.vistas, "vista", "vistas")}</b> de tus ${plural(r.autos, "auto", "autos")}${tendencia}`);
    l.push(`💬 <b>${plural(contactos, "contacto", "contactos")}</b>${contactos ? `: ${n(r.whatsapp)} por WhatsApp · ${plural(r.llamadas, "llamada", "llamadas")}` : ""}`);
    if (r.compartidos) l.push(`🔗 Tus autos se compartieron ${plural(r.compartidos, "vez", "veces")}`);
    if (r.top_titulo && r.top_vistas) l.push(`🏆 El más mirado: <b>${h(r.top_titulo)}</b> (${plural(r.top_vistas, "vista", "vistas")})`);
    if (!r.vistas) l.push("", "Esta semana tus autos no tuvieron visitas. Probá sumar más fotos o revisar los precios.");
    if (faltan.length) l.push("", `🔎 <b>Lo que buscan y no hay:</b> ${faltan.map((f: A) => `${h(f.marca)} ${h(f.modelo)} (${plural(f.busquedas + f.alertas, "interesado", "interesados")})`).join(", ")}. Si tenés alguno, publicalo.`);
    if (r.sin_actualizar) l.push("", `🔄 ${r.sin_actualizar === 1 ? "Tenés 1 auto que no actualizás" : `Tenés ${n(r.sin_actualizar)} autos que no actualizás`} hace más de 30 días. ¿Sigue${r.sin_actualizar === 1 ? "" : "n"} disponible${r.sin_actualizar === 1 ? "" : "s"}? ¿Mismo precio? Podés cambiarlo acá mismo, por ejemplo: <i>"bajá el Cronos a 20.500.000"</i> o <i>"marcá vendido el Cronos"</i>.`);
    l.push("", "Tip: con un 🔥 <b>precio relámpago</b> (Mi cuenta → Mis autos → Editar) tus autos se destacan con contador.");
  }
  const corto = !r.autos
    ? "Tu semana: no tenías autos publicados. Publicá tu stock para recibir consultas."
    : `Tu semana: ${plural(r.vistas, "vista", "vistas")} y ${plural(contactos, "contacto", "contactos")}${r.top_titulo && r.top_vistas ? `. El más mirado: ${r.top_titulo}` : ""}.`;
  return { texto: l.join("\n"), corto };
}

async function telegram(telefono: string, texto: string) {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) return false;
  const tels = [telefono, telefono.startsWith("549") ? "54" + telefono.slice(3) : telefono];
  const { data: c } = await db.from("telegram_chats").select("chat_id").in("telefono", tels).limit(1).maybeSingle();
  if (!c?.chat_id) return false;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: c.chat_id, text: texto, parse_mode: "HTML", disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: "📈 Ver mis estadísticas", url: `${SITIO}mi-cuenta.html#mis-autos` }]] } }),
  }).catch(() => null);
  return !!r?.ok;
}

async function enviar(r: A) {
  const { texto, corto } = armar(r);
  const tg = await telegram(r.telefono, texto);
  await db.from("mkt_notificaciones").insert({ cuenta_id: r.cuenta_id, tipo: "resumen_semanal", texto: corto, link: "mi-cuenta.html#mis-autos" });
  return tg;
}

Deno.serve(async (req) => {
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  const { data: clave } = await db.rpc("config_privada", { p_clave: "mkt_cron" });
  const dada = req.headers.get("x-cron-secret") ?? "";
  if (!clave || dada.length !== String(clave).length || dada !== clave) return json({ error: "No autorizado" }, 401);
  let b: A = {};
  try { b = await req.json(); } catch { /* vacío */ }

  try {
    await cargarFaltantes();
    if (b.accion === "prueba") {
      const { data, error } = await db.rpc("mkt_resumen_semanal", { p_cuenta: String(b.cuenta ?? "") });
      if (error) throw error;
      const r = (data ?? [])[0];
      if (!r) return json({ error: "No encontré esa agencia aprobada." }, 404);
      return json({ ...armar(r), telegram: b.mandar === true ? await enviar(r) : null });
    }
    if (b.accion === "enviar") {
      const { data, error } = await db.rpc("mkt_resumen_semanal", {});
      if (error) throw error;
      let tg = 0;
      for (const r of data ?? []) if (await enviar(r).catch((e) => { console.error("resumen", r.cuenta_id, e); return false; })) tg++;
      console.log(`resumen semanal: ${(data ?? []).length} agencias, ${tg} por Telegram`);
      return json({ ok: true, agencias: (data ?? []).length, telegram: tg });
    }
    return json({ error: "Acción desconocida" }, 400);
  } catch (e) {
    console.error("mkt-resumen", e);
    return json({ error: "Algo salió mal" }, 500);
  }
});
