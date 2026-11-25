// RDA Marketplace · Edge Function: mkt-bot
// Enrutador del webhook de Telegram (@Reddeautosbot), compartido con la web actual:
//  - Lo del marketplace (agencias de mkt_cuentas, botones "MK_…", pasos en curso) se atiende acá.
//  - Todo lo demás se reenvía sin cambios a whatsapp-webhook (bot de la web actual).
// Para el marketplace, con botones: Mis autos (cambiar precio, marcar vendido, pausar/reactivar),
// Pedidos de colegas ("Lo tengo") y Pedir a colegas (paso a paso).
// Acción de instalación: POST {"accion":"conectar","token":"<token de mkt_bot_setup>"} apunta el webhook acá.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const SITIO = "https://skielxi-ux.github.io/RDA-Marketplace/";
const VIEJO = `${env("SUPABASE_URL")}/functions/v1/whatsapp-webhook`;
const MAX_PEDIDOS_DIA = 10;
type A = Record<string, any>;

// ---------- utilidades ----------
const html = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const miles = (n: number) => Math.round(Number(n)).toLocaleString("es-AR");
const precio = (n: number, m: string) => `${m === "USD" ? "USD" : "$"} ${miles(n)}`;
const variantes = (tel: string) => [tel, tel.startsWith("549") ? "54" + tel.slice(3) : tel];
const norm = (s: unknown) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const NADA = /^(-|no|ninguno|ninguna|indistinto|cualquiera|da igual|sin preferencia|n\/a)$/i;

async function conf(clave: string) {
  const { data } = await db.rpc("config_privada", { p_clave: clave });
  return (data as string) ?? "";
}
async function tg(metodo: string, body: A) {
  const r = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/${metodo}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }).catch(() => null);
  const d = await r?.json().catch(() => ({}));
  return { ok: !!r?.ok && d?.ok !== false, d };
}
const send = (chat: number, text: string, botones?: A[][]) =>
  tg("sendMessage", { chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true, ...(botones ? { reply_markup: { inline_keyboard: botones } } : {}) });
const btn = (text: string, data: string) => ({ text, callback_data: data });
const link = (text: string, url: string) => ({ text, url });

async function estado(chat: number) {
  const { data } = await db.from("mkt_bot_estado").select("paso, datos, updated_at").eq("chat_id", chat).maybeSingle();
  if (!data) return null;
  if (Date.now() - new Date(data.updated_at).getTime() > 30 * 60e3) { await limpiar(chat); return null; } // vence a los 30 min
  return data;
}
const guardar = (chat: number, paso: string, datos: A = {}) =>
  db.from("mkt_bot_estado").upsert({ chat_id: chat, paso, datos, updated_at: new Date().toISOString() });
const limpiar = (chat: number) => db.from("mkt_bot_estado").delete().eq("chat_id", chat);

async function agenciaMkt(tel: string) {
  const { data } = await db.from("mkt_cuentas").select("id, nombre, ciudad, provincia, telefono, whatsapp_ventas, estado, tipo")
    .in("telefono", variantes(tel)).eq("tipo", "agencia").maybeSingle();
  return data && data.estado === "aprobada" ? data : null;
}
async function esDeLaWebActual(tel: string) {
  const alt = tel.startsWith("549") ? tel : tel.startsWith("54") ? "549" + tel.slice(2) : tel;
  const { data } = await db.from("agencias").select("id").or(`whatsapp.eq.${alt},whatsapp_alertas.eq.${alt}`).eq("activa", true).limit(1).maybeSingle();
  if (data) return true;
  const admin = String(env("ADMIN_WHATSAPP") || await conf("admin_whatsapp")).replace(/\D/g, "");
  return !!admin && variantes(tel).some((t) => t === admin || t === (admin.startsWith("54") && !admin.startsWith("549") ? "549" + admin.slice(2) : admin));
}
async function chatDe(tel: string) {
  const { data } = await db.from("telegram_chats").select("chat_id").in("telefono", variantes(tel)).limit(1).maybeSingle();
  return data?.chat_id as number | undefined;
}

/** Precio escrito como "24 millones", "24,5M", "24.500.000", "usd 22000", "22 mil". */
function leerPrecio(t: string, monedaPorDefecto: string) {
  const s = norm(t);
  const moneda = /(usd|u\$s|us\$|dolar)/.test(s) ? "USD" : /(ars|peso|\$)/.test(s) ? "ARS" : monedaPorDefecto;
  const m = s.match(/(\d+(?:[.,]\d+)*)\s*(millones|millon|mill|m\b|mil\b|k\b)?/);
  if (!m) return null;
  let n: number;
  const crudo = m[1];
  if (m[2]) n = Number(crudo.replace(/\.(?=\d{3}\b)/g, "").replace(",", "."));
  else if (/^\d{1,3}([.,]\d{3})+$/.test(crudo)) n = Number(crudo.replace(/[.,]/g, ""));
  else n = Number(crudo.replace(",", "."));
  if (m[2]) n *= /^(millones|millon|mill|m)$/.test(m[2]) ? 1e6 : 1e3;
  n = Math.round(n);
  return Number.isFinite(n) && n > 0 && n < 1e11 ? { n, moneda } : null;
}
const leerNumero = (t: string) => {
  const s = norm(t).replace(/km/g, "");
  const m = s.match(/(\d+(?:[.,]\d+)*)\s*(mil\b|k\b)?/);
  if (!m) return null;
  let n = /^\d{1,3}([.,]\d{3})+$/.test(m[1]) ? Number(m[1].replace(/[.,]/g, "")) : Number(m[1].replace(",", "."));
  if (m[2]) n *= 1e3;
  return Number.isFinite(n) ? Math.round(n) : null;
};

// ---------- menú ----------
const MENU = [[btn("🚗 Mis autos", "MK_L:0")], [btn("📋 Pedidos de colegas", "MK_C:0"), btn("🤝 Pedir a colegas", "MK_N")]];
const menu = (chat: number, ag: A, intro = "") =>
  send(chat, `${intro}${intro ? "\n\n" : ""}<b>${html(ag.nombre)}</b> · ¿Qué querés hacer?`, MENU);

// ---------- Mis autos ----------
const ESTADO_TXT: A = { publicado: "🟢 Publicado", pausado: "⏸ Pausado", vendido: "✅ Vendido" };
async function misAutos(chat: number, ag: A, pagina: number) {
  const POR = 8;
  const { data, count } = await db.from("mkt_autos").select("id, marca, modelo, version, anio, precio, moneda, estado", { count: "exact" })
    .eq("cuenta_id", ag.id).order("created_at", { ascending: false }).range(pagina * POR, pagina * POR + POR - 1);
  if (!data?.length) return send(chat, "Todavía no cargaste autos. Los cargás desde la web con la plantilla de Excel.", [[link("Publicar vehículos", `${SITIO}publicar.html`)], [btn("⬅️ Menú", "MK_M")]]);
  const filas = data.map((a: A) => [btn(`${a.estado === "publicado" ? "" : a.estado === "vendido" ? "✅ " : "⏸ "}${a.marca} ${a.modelo} ${a.anio} · ${precio(a.precio, a.moneda)}`.slice(0, 60), `MK_A:${a.id}`)]);
  const nav = [];
  if (pagina > 0) nav.push(btn("⬅️ Anteriores", `MK_L:${pagina - 1}`));
  if ((count ?? 0) > (pagina + 1) * POR) nav.push(btn("Más ➡️", `MK_L:${pagina + 1}`));
  if (nav.length) filas.push(nav);
  filas.push([btn("⬅️ Menú", "MK_M")]);
  return send(chat, `🚗 <b>Tus autos</b> (${count ?? data.length}). Elegí uno:`, filas);
}
async function autoDe(ag: A, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await db.from("mkt_autos").select("id, codigo, marca, modelo, version, anio, km, precio, moneda, estado, pausado_por_admin, fotos")
    .eq("id", id).eq("cuenta_id", ag.id).maybeSingle();
  return data;
}
async function verAuto(chat: number, ag: A, id: string, aviso = "") {
  const a = await autoDe(ag, id);
  if (!a) return send(chat, "No encontré ese auto.", [[btn("⬅️ Mis autos", "MK_L:0")]]);
  const txt = `${aviso ? aviso + "\n\n" : ""}<b>${html(`${a.marca} ${a.modelo} ${a.version}`)}</b> · ${a.anio}\n${miles(a.km)} km · <b>${precio(a.precio, a.moneda)}</b>\nCódigo ${html(a.codigo)} · ${ESTADO_TXT[a.estado]}${a.pausado_por_admin ? " (por Red de Autos)" : ""}`;
  const filas: A[][] = [];
  if (a.estado !== "vendido") filas.push([btn("💲 Cambiar precio", `MK_P:${a.id}`), btn("✅ Vendido", `MK_V:${a.id}`)]);
  if (a.estado === "publicado") filas.push([btn("⏸ Pausar", `MK_PA:${a.id}`), link("Ver en la web", `${SITIO}auto.html?id=${a.id}`)]);
  else if (!a.pausado_por_admin) filas.push([btn("▶️ Volver a publicar", `MK_RE:${a.id}`)]);
  filas.push([btn("⬅️ Mis autos", "MK_L:0")]);
  return send(chat, txt, filas);
}
async function cambiarEstado(chat: number, ag: A, id: string, nuevo: "publicado" | "pausado" | "vendido") {
  const a = await autoDe(ag, id);
  if (!a) return send(chat, "No encontré ese auto.");
  if (nuevo === "publicado" && a.pausado_por_admin) return send(chat, "Este auto lo pausó Red de Autos. Escribinos para revisarlo.");
  await db.from("mkt_autos").update({ estado: nuevo, vendido_at: nuevo === "vendido" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", a.id);
  const aviso = { publicado: "▶️ Listo, el auto volvió al listado.", pausado: "⏸ Listo, el auto quedó pausado (no se ve en el listado).", vendido: "🎉 ¡Felicitaciones! Lo marcamos como vendido y salió del listado." }[nuevo];
  return verAuto(chat, ag, a.id, aviso);
}

// ---------- Red de colegas ----------
function resumenPedido(p: A) {
  const anios = p.anio_desde && p.anio_hasta ? (p.anio_desde === p.anio_hasta ? `${p.anio_desde}` : `${p.anio_desde} a ${p.anio_hasta}`)
    : p.anio_desde ? `desde ${p.anio_desde}` : p.anio_hasta ? `hasta ${p.anio_hasta}` : "";
  return [anios, p.km_max != null ? `hasta ${miles(p.km_max)} km` : "", p.transmision, p.combustible, p.color,
    p.presupuesto ? `presupuesto ${precio(p.presupuesto, p.moneda)}` : ""].filter(Boolean).join(" · ");
}
const tituloPedido = (p: A) => [p.marca, p.modelo, p.version].filter(Boolean).join(" ");

async function pedidos(chat: number, ag: A, pagina: number) {
  const POR = 5;
  const { data, count } = await db.from("mkt_colegas_pedidos").select("*", { count: "exact" }).eq("estado", "activo").neq("cuenta_id", ag.id)
    .order("created_at", { ascending: false }).range(pagina * POR, pagina * POR + POR - 1);
  if (!data?.length) return send(chat, "No hay pedidos de colegas por ahora.", [[btn("🤝 Pedir a colegas", "MK_N")], [btn("⬅️ Menú", "MK_M")]]);
  const ids = [...new Set(data.map((p: A) => p.cuenta_id))];
  const { data: ags } = await db.from("mkt_cuentas").select("id, nombre, ciudad").in("id", ids);
  const nom = new Map((ags ?? []).map((x: A) => [x.id, x]));
  for (const p of data) {
    const a = nom.get(p.cuenta_id) as A | undefined;
    const det = resumenPedido(p);
    await send(chat, `🤝 <b>${html(a?.nombre ?? "Una agencia")}</b>${a?.ciudad ? ` (${html(a.ciudad)})` : ""} busca:\n🚗 <b>${html(tituloPedido(p))}</b>${det ? `\n${html(det)}` : ""}${p.comentario ? `\n💬 ${html(p.comentario)}` : ""}`,
      [[btn("🙋 Lo tengo", `MK_LT:${p.id}`)]]);
  }
  const nav = [];
  if ((count ?? 0) > (pagina + 1) * POR) nav.push(btn("Ver más ➡️", `MK_C:${pagina + 1}`));
  nav.push(btn("⬅️ Menú", "MK_M"));
  return send(chat, `Mostrando ${Math.min((pagina + 1) * POR, count ?? 0)} de ${count ?? 0} pedidos.`, [nav]);
}

async function loTengo(chat: number, ag: A, pedidoId: string) {
  if (!/^[0-9a-f-]{36}$/.test(pedidoId)) return;
  const { data: p } = await db.from("mkt_colegas_pedidos").select("*").eq("id", pedidoId).maybeSingle();
  if (!p || p.estado !== "activo") return send(chat, "Ese pedido ya está cerrado.");
  if (p.cuenta_id === ag.id) return send(chat, "Es tu propio pedido 🙂");
  const { data: autor } = await db.from("mkt_cuentas").select("id, nombre, telefono, whatsapp_ventas").eq("id", p.cuenta_id).maybeSingle();
  if (!autor) return send(chat, "Ese pedido ya no está disponible.");
  const { error } = await db.from("mkt_colegas_respuestas").insert({ pedido_id: p.id, cuenta_id: ag.id });
  const nueva = !error;
  const telAutor = autor.whatsapp_ventas || autor.telefono;
  const telYo = ag.whatsapp_ventas || ag.telefono;
  if (nueva) {
    await db.from("mkt_notificaciones").insert({ cuenta_id: autor.id, tipo: "colega_respuesta", pedido_id: p.id, origen_id: ag.id });
    const chatAutor = await chatDe(autor.telefono);
    if (chatAutor) {
      await send(chatAutor, `🙋 <b>${html(ag.nombre)}</b>${ag.ciudad ? ` (${html(ag.ciudad)})` : ""} tiene un auto para tu pedido:\n🚗 <b>${html(tituloPedido(p))}</b>`,
        [[link("Escribir por WhatsApp", `https://wa.me/${telYo}?text=${encodeURIComponent(`Hola ${ag.nombre}, vi que tenés un ${tituloPedido(p)} para mi pedido en la Red de colegas.`)}`)]]);
    }
  }
  return send(chat, `${nueva ? "✅ Le avisamos a" : "Ya le habías avisado a"} <b>${html(autor.nombre)}</b> que lo tenés. Escribile directo para cerrar:`,
    [[link("Escribir por WhatsApp", `https://wa.me/${telAutor}?text=${encodeURIComponent(`Hola ${autor.nombre}, vi en la Red de colegas que buscás ${tituloPedido(p)}. Tengo uno que te puede servir.`)}`)], [btn("⬅️ Menú", "MK_M")]]);
}

/** Publica un pedido y avisa a todas las agencias (campanita + Telegram). Misma lógica que mkt-colegas. */
async function crearPedido(ag: A, d: A) {
  const desde = new Date(Date.now() - 864e5).toISOString();
  const { count } = await db.from("mkt_colegas_pedidos").select("id", { count: "exact", head: true }).eq("cuenta_id", ag.id).gte("created_at", desde);
  if ((count ?? 0) >= MAX_PEDIDOS_DIA) return { error: `Podés publicar hasta ${MAX_PEDIDOS_DIA} pedidos por día.` };
  const { data: p, error } = await db.from("mkt_colegas_pedidos").insert({
    cuenta_id: ag.id, marca: d.marca, modelo: d.modelo, version: null, anio_desde: d.anio_desde ?? null, anio_hasta: d.anio_hasta ?? null,
    km_max: d.km_max ?? null, color: d.color ?? null, transmision: d.transmision ?? null, combustible: d.combustible ?? null,
    presupuesto: d.presupuesto ?? null, moneda: d.presupuesto ? d.moneda : null, comentario: null,
  }).select("*").single();
  if (error) throw error;
  const { data: otras } = await db.from("mkt_cuentas").select("id, telefono").eq("tipo", "agencia").eq("estado", "aprobada").neq("id", ag.id);
  const lista = otras ?? [];
  if (lista.length) await db.from("mkt_notificaciones").insert(lista.map((o: A) => ({ cuenta_id: o.id, tipo: "colega_pedido", pedido_id: p.id })));
  let telegram = 0;
  const { data: chats } = lista.length ? await db.from("telegram_chats").select("chat_id").in("telefono", lista.flatMap((o: A) => variantes(o.telefono))) : { data: [] };
  const det = resumenPedido(p);
  const vistos = new Set<string>();
  for (const c of chats ?? []) {
    if (vistos.has(String(c.chat_id))) continue;
    vistos.add(String(c.chat_id));
    const r = await send(c.chat_id, `🤝 <b>Red de colegas</b>\n<b>${html(ag.nombre)}</b> (${html(ag.ciudad)}) busca:\n🚗 <b>${html(tituloPedido(p))}</b>${det ? `\n${html(det)}` : ""}\n\n¿Lo tenés?`,
      [[btn("🙋 Lo tengo", `MK_LT:${p.id}`), link("Ver en la web", `${SITIO}mi-cuenta.html#colegas`)]]);
    if (r.ok) telegram++;
  }
  await db.from("mkt_colegas_pedidos").update({ avisadas: lista.length }).eq("id", p.id);
  return { avisadas: lista.length, telegram };
}

// Pasos de "Pedir a colegas"
const PASOS: A = {
  p_marca: "1/8 · ¿Qué <b>marca</b> busca tu cliente? (ej.: Toyota)",
  p_modelo: "2/8 · ¿Qué <b>modelo</b> y versión? (ej.: Corolla XEi)",
  p_anios: "3/8 · ¿Qué <b>años</b>? (ej.: 2018-2021, 2020, desde 2019). Mandá <b>-</b> si da igual.",
  p_km: "4/8 · ¿<b>Kilometraje máximo</b>? (ej.: 80 mil). Mandá <b>-</b> si da igual.",
  p_caja: "5/8 · ¿<b>Caja</b>?",
  p_comb: "6/8 · ¿<b>Combustible</b>?",
  p_color: "7/8 · ¿<b>Color</b>? Mandá <b>-</b> si da igual.",
  p_presu: "8/8 · ¿<b>Presupuesto</b> del cliente? (ej.: 25 millones, USD 22000). Mandá <b>-</b> si no querés ponerlo.",
};
const CANCELAR = [btn("✖️ Cancelar", "MK_X")];
async function preguntar(chat: number, paso: string, datos: A) {
  await guardar(chat, paso, datos);
  if (paso === "p_caja") return send(chat, PASOS[paso], [[btn("Manual", "MK_PCJ:Manual"), btn("Automática", "MK_PCJ:Automática")], [btn("Indistinto", "MK_PCJ:-")], CANCELAR]);
  if (paso === "p_comb") return send(chat, PASOS[paso], [[btn("Nafta", "MK_PCB:Nafta"), btn("Diésel", "MK_PCB:Diésel"), btn("GNC", "MK_PCB:GNC")], [btn("Híbrido", "MK_PCB:Híbrido"), btn("Eléctrico", "MK_PCB:Eléctrico")], [btn("Indistinto", "MK_PCB:-")], CANCELAR]);
  return send(chat, PASOS[paso], [CANCELAR]);
}
async function confirmarPedido(chat: number, datos: A) {
  await guardar(chat, "p_confirmar", datos);
  const det = resumenPedido(datos);
  return send(chat, `Revisá tu pedido:\n🚗 <b>${html(`${datos.marca} ${datos.modelo}`)}</b>${det ? `\n${html(det)}` : ""}\n\nSe lo mandamos a todas las agencias de la red.`,
    [[btn("✅ Enviar a los colegas", "MK_PE")], CANCELAR]);
}
async function pasoTexto(chat: number, ag: A, est: A, texto: string) {
  const d = { ...est.datos };
  const vacio = NADA.test(texto.trim());
  switch (est.paso) {
    case "precio": {
      const a = await autoDe(ag, d.auto_id);
      if (!a) { await limpiar(chat); return send(chat, "No encontré ese auto."); }
      const p = leerPrecio(texto, a.moneda);
      if (!p) return send(chat, "No entendí el precio 🤔 Escribilo así: <b>24500000</b>, <b>24,5 millones</b> o <b>USD 22000</b>.", [CANCELAR]);
      await guardar(chat, "precio_ok", { auto_id: a.id, precio: p.n, moneda: p.moneda });
      return send(chat, `¿Cambiamos el precio del <b>${html(`${a.marca} ${a.modelo} ${a.anio}`)}</b>?\n${precio(a.precio, a.moneda)} → <b>${precio(p.n, p.moneda)}</b>`,
        [[btn("✅ Sí, cambiar", "MK_PC"), btn("✖️ Cancelar", "MK_X")]]);
    }
    case "p_marca":
      if (vacio || texto.trim().length < 2) return send(chat, "Escribí la marca (ej.: Toyota).", [CANCELAR]);
      d.marca = texto.trim().slice(0, 40).replace(/\b\p{L}/gu, (c) => c.toUpperCase());
      return preguntar(chat, "p_modelo", d);
    case "p_modelo":
      if (vacio || !texto.trim()) return send(chat, "Escribí el modelo (ej.: Corolla XEi).", [CANCELAR]);
      d.modelo = texto.trim().slice(0, 60);
      return preguntar(chat, "p_anios", d);
    case "p_anios": {
      if (!vacio) {
        const max = new Date().getFullYear() + 1;
        const ns = (texto.match(/\b(19[5-9]\d|20\d\d)\b/g) ?? []).map(Number).filter((n) => n <= max);
        if (!ns.length) return send(chat, "Escribí los años así: <b>2018-2021</b>, <b>2020</b> o <b>desde 2019</b>. Mandá <b>-</b> si da igual.", [CANCELAR]);
        if (ns.length >= 2) { d.anio_desde = Math.min(ns[0], ns[1]); d.anio_hasta = Math.max(ns[0], ns[1]); }
        else if (/desde|mas de|más de|\+/.test(norm(texto))) d.anio_desde = ns[0];
        else if (/hasta|menos de/.test(norm(texto))) d.anio_hasta = ns[0];
        else { d.anio_desde = ns[0]; d.anio_hasta = ns[0]; }
      }
      return preguntar(chat, "p_km", d);
    }
    case "p_km": {
      if (!vacio) {
        const n = leerNumero(texto);
        if (n === null || n > 2000000) return send(chat, "Escribí el kilometraje máximo (ej.: <b>80 mil</b> o <b>80000</b>). Mandá <b>-</b> si da igual.", [CANCELAR]);
        d.km_max = n;
      }
      return preguntar(chat, "p_caja", d);
    }
    case "p_color":
      if (!vacio) d.color = texto.trim().slice(0, 30);
      return preguntar(chat, "p_presu", d);
    case "p_presu": {
      if (!vacio) {
        const p = leerPrecio(texto, "ARS");
        if (!p) return send(chat, "No entendí el presupuesto. Ej.: <b>25 millones</b> o <b>USD 22000</b>. Mandá <b>-</b> si no querés ponerlo.", [CANCELAR]);
        d.presupuesto = p.n; d.moneda = p.moneda;
      }
      return confirmarPedido(chat, d);
    }
    default:
      return send(chat, "Usá los botones de arriba 👆 o tocá Cancelar.", [CANCELAR]);
  }
}

// ---------- vincular Telegram (botón "Conectar Telegram" del marketplace) ----------
async function vincularMkt(chat: number, tel: string, from: A, ag: A) {
  await db.from("telegram_chats").delete().eq("chat_id", chat);
  await db.from("telegram_chats").delete().in("telefono", variantes(tel));
  await db.from("telegram_chats").insert({ telefono: tel, chat_id: chat, nombre: [from?.first_name, from?.last_name].filter(Boolean).join(" ") || null, usuario: from?.username ?? null, vinculado_at: new Date().toISOString() });
  return menu(chat, ag, `✅ ¡Listo! Conectaste Telegram a <b>${html(ag.nombre)}</b>.\nTe van a llegar los pedidos de la Red de colegas y los avisos de tu cuenta. Desde acá también podés cambiar precios, marcar autos vendidos y pausarlos.`);
}

// ---------- atender un update del marketplace ----------
async function atender(u: A, chat: number, ag: A) {
  const cq = u.callback_query;
  if (cq) {
    const data = String(cq.data ?? "");
    await tg("answerCallbackQuery", { callback_query_id: cq.id });
    const [acc, arg = ""] = data.split(":");
    switch (acc) {
      case "MK_M": await limpiar(chat); return menu(chat, ag);
      case "MK_X": await limpiar(chat); return menu(chat, ag, "Listo, cancelado.");
      case "MK_L": await limpiar(chat); return misAutos(chat, ag, Math.max(0, Number(arg) || 0));
      case "MK_A": return verAuto(chat, ag, arg);
      case "MK_P": {
        const a = await autoDe(ag, arg);
        if (!a) return send(chat, "No encontré ese auto.");
        await guardar(chat, "precio", { auto_id: a.id });
        return send(chat, `💲 Precio actual del <b>${html(`${a.marca} ${a.modelo} ${a.anio}`)}</b>: ${precio(a.precio, a.moneda)}\nEscribí el <b>precio nuevo</b> (ej.: 24,5 millones o USD 22000):`, [CANCELAR]);
      }
      case "MK_PC": {
        const est = await estado(chat);
        if (est?.paso !== "precio_ok") return send(chat, "Esa confirmación venció. Volvé a elegir el auto.", [[btn("🚗 Mis autos", "MK_L:0")]]);
        const a = await autoDe(ag, est.datos.auto_id);
        await limpiar(chat);
        if (!a) return send(chat, "No encontré ese auto.");
        await db.from("mkt_autos").update({ precio: est.datos.precio, moneda: est.datos.moneda, updated_at: new Date().toISOString() }).eq("id", a.id);
        return verAuto(chat, ag, a.id, `✅ Precio actualizado: <b>${precio(est.datos.precio, est.datos.moneda)}</b>. Ya se ve en el sitio.`);
      }
      case "MK_V": {
        const a = await autoDe(ag, arg);
        if (!a) return send(chat, "No encontré ese auto.");
        return send(chat, `¿Marcamos el <b>${html(`${a.marca} ${a.modelo} ${a.anio}`)}</b> como vendido? Sale del listado.`, [[btn("✅ Sí, se vendió", `MK_VC:${a.id}`), btn("✖️ No", `MK_A:${a.id}`)]]);
      }
      case "MK_VC": return cambiarEstado(chat, ag, arg, "vendido");
      case "MK_PA": return cambiarEstado(chat, ag, arg, "pausado");
      case "MK_RE": return cambiarEstado(chat, ag, arg, "publicado");
      case "MK_C": await limpiar(chat); return pedidos(chat, ag, Math.max(0, Number(arg) || 0));
      case "MK_LT": return loTengo(chat, ag, arg);
      case "MK_N": return preguntar(chat, "p_marca", {});
      case "MK_PCJ": {
        const est = await estado(chat);
        if (est?.paso !== "p_caja") return;
        return preguntar(chat, "p_comb", { ...est.datos, ...(arg !== "-" ? { transmision: arg } : {}) });
      }
      case "MK_PCB": {
        const est = await estado(chat);
        if (est?.paso !== "p_comb") return;
        return preguntar(chat, "p_color", { ...est.datos, ...(arg !== "-" ? { combustible: arg } : {}) });
      }
      case "MK_PE": {
        const est = await estado(chat);
        if (est?.paso !== "p_confirmar") return send(chat, "Ese pedido venció. Empezalo de nuevo.", [[btn("🤝 Pedir a colegas", "MK_N")]]);
        await limpiar(chat);
        const r = await crearPedido(ag, est.datos);
        if ("error" in r) return send(chat, String(r.error), [[btn("⬅️ Menú", "MK_M")]]);
        return send(chat, `✅ Listo: tu pedido les llegó a ${r.avisadas} ${r.avisadas === 1 ? "agencia" : "agencias"}. Cuando alguien toque "Lo tengo" te aviso por acá.`, [[btn("⬅️ Menú", "MK_M")]]);
      }
    }
    return menu(chat, ag);
  }
  const texto = String(u.message?.text ?? "").trim();
  if (/^\/?(cancelar|menu|menú|inicio|start)\b/i.test(texto)) { await limpiar(chat); return menu(chat, ag); }
  const est = await estado(chat);
  if (est && texto) return pasoTexto(chat, ag, est, texto);
  return menu(chat, ag);
}

// ---------- entrada ----------
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  const raw = await req.text();

  // Instalación: apuntar el webhook del bot a esta función (token de un solo uso creado por el admin)
  if (!req.headers.has("x-telegram-bot-api-secret-token")) {
    let b: A = {};
    try { b = JSON.parse(raw); } catch { /* nada */ }
    if (b.accion !== "conectar" || typeof b.token !== "string") return new Response("no", { status: 400 });
    const { data: tk } = await db.from("mkt_bot_setup").select("token").eq("token", b.token).gt("expira", new Date().toISOString()).maybeSingle();
    if (!tk) return new Response("token inválido", { status: 401 });
    await db.from("mkt_bot_setup").delete().eq("token", b.token);
    // La URL incluye la ruta de whatsapp-webhook para que el panel de la web actual siga mostrando el webhook como conectado
    const r = await tg("setWebhook", {
      url: `${env("SUPABASE_URL")}/functions/v1/mkt-bot?via=/functions/v1/whatsapp-webhook`,
      secret_token: await conf("telegram_webhook_secret"), allowed_updates: ["message", "callback_query"],
    });
    return new Response(JSON.stringify({ ok: r.ok, respuesta: r.d?.description ?? null }), { headers: { "Content-Type": "application/json" } });
  }

  const secreto = await conf("telegram_webhook_secret");
  if (!secreto || req.headers.get("x-telegram-bot-api-secret-token") !== secreto) return new Response("no autorizado", { status: 401 });
  let u: A;
  try { u = JSON.parse(raw); } catch { return new Response("ok"); }

  const reenviar = () => fetch(VIEJO, { method: "POST", headers: { "Content-Type": "application/json", "x-telegram-bot-api-secret-token": secreto }, body: raw })
    .then((r) => r.text()).catch((e) => console.error("reenviar", e));

  const trabajo = (async () => {
    const cq = u.callback_query;
    const msg = u.message ?? cq?.message;
    const chat: number | undefined = msg?.chat?.id;
    if (!chat || msg.chat.type !== "private") return reenviar();
    const texto = String(u.message?.text ?? "");
    const data = String(cq?.data ?? "");

    // /start <token>: si el token es de una agencia del marketplace, la vinculamos acá
    if (/^\/start\s+\S+/.test(texto)) {
      const token = texto.split(/\s+/)[1];
      const { data: tk } = await db.from("telegram_tokens").select("telefono").eq("token", token).gt("expira", new Date().toISOString()).maybeSingle();
      if (tk) {
        const ag = await agenciaMkt(tk.telefono);
        if (ag && !(await esDeLaWebActual(tk.telefono))) {
          await db.from("telegram_tokens").delete().eq("token", token);
          return vincularMkt(chat, tk.telefono, u.message?.from ?? {}, ag);
        }
      }
      return reenviar();
    }

    // Compartir el número (otra forma de conectarse): si es una agencia del marketplace, la vinculamos acá
    const ct = u.message?.contact;
    if (ct && ct.user_id === u.message?.from?.id) {
      let tel = String(ct.phone_number ?? "").replace(/\D/g, "");
      if (tel.startsWith("54") && !tel.startsWith("549")) tel = "549" + tel.slice(2);
      const agC = await agenciaMkt(tel);
      if (agC && !(await esDeLaWebActual(tel))) return vincularMkt(chat, agC.telefono, u.message.from, agC);
      return reenviar();
    }

    const { data: vinculo } = await db.from("telegram_chats").select("telefono").eq("chat_id", chat).maybeSingle();
    const ag = vinculo ? await agenciaMkt(vinculo.telefono) : null;
    if (!ag) {
      if (data.startsWith("MK_")) {
        await tg("answerCallbackQuery", { callback_query_id: cq.id });
        return send(chat, "Esta opción es para agencias aprobadas de Red de Autos. Conectá tu Telegram desde Mi cuenta en la web.");
      }
      return reenviar();
    }
    // Agencias que también están en la web actual: lo del marketplace solo con sus botones o un paso en curso
    if (await esDeLaWebActual(vinculo!.telefono)) {
      const enCurso = await estado(chat);
      if (!data.startsWith("MK_") && !enCurso) return reenviar();
    }
    return atender(u, chat, ag);
  })().catch((e) => console.error("mkt-bot", u?.update_id, e));

  // deno-lint-ignore no-explicit-any
  const rt = (globalThis as any).EdgeRuntime;
  if (rt?.waitUntil) rt.waitUntil(trabajo); else await trabajo;
  return new Response("ok");
});
