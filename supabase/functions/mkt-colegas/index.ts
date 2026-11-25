// RDA Marketplace · Edge Function: mkt-colegas (Red de colegas, solo agencias aprobadas)
// listar · crear (avisa a todas las agencias: campanita + Telegram) · cerrar · notifs · leer · telegram_estado · telegram_vincular
// Un pedido queda activo hasta que la agencia que lo publicó lo cierra.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";
const SITIO = "https://skielxi-ux.github.io/RDA-Marketplace/";
const MAX_POR_DIA = 10;

const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

type A = Record<string, unknown>;
const texto = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const html = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const COMBUSTIBLES = new Set(["Nafta", "Diésel", "Híbrido", "Eléctrico", "GNC"]);
const TRANSMISIONES = new Set(["Manual", "Automática"]);
const variantes = (tel: string) => [tel, tel.startsWith("549") ? "54" + tel.slice(3) : tel];
const miles = (n: number) => Math.round(n).toLocaleString("es-AR");

const CAMPOS_PEDIDO = "id, cuenta_id, marca, modelo, version, anio_desde, anio_hasta, km_max, color, transmision, combustible, presupuesto, moneda, comentario, estado, avisadas, created_at, cerrado_at";
const CAMPOS_AGENCIA = "id, nombre, agencia_tipo, marca_oficial, ciudad, provincia, logo, telefono, whatsapp_ventas";

function resumen(p: A) {
  const anios = p.anio_desde && p.anio_hasta ? (p.anio_desde === p.anio_hasta ? `${p.anio_desde}` : `${p.anio_desde} a ${p.anio_hasta}`)
    : p.anio_desde ? `desde ${p.anio_desde}` : p.anio_hasta ? `hasta ${p.anio_hasta}` : "";
  return [
    anios, p.km_max != null ? `hasta ${miles(Number(p.km_max))} km` : "", p.transmision, p.combustible, p.color,
    p.presupuesto ? `presupuesto ${p.moneda === "USD" ? "USD" : "$"} ${miles(Number(p.presupuesto))}` : "",
  ].filter(Boolean).join(" · ");
}

async function tg(chat_id: unknown, text: string, url: string) {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) return false;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: "Ver el pedido y contactar", url }]] } }),
  }).catch(() => null);
  return !!r?.ok;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const H = cors(origin);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...H, "Content-Type": "application/json" } });
  const err = (m: string, s = 400) => json({ error: m }, s);
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  if (req.method !== "POST") return err("Método no permitido", 405);
  if (origin && !ORIGENES.has(origin)) return err("Origen no permitido", 403);

  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u } = await db.auth.getUser(token);
  if (!u?.user?.email?.endsWith("@" + DOMINIO)) return err("Tu sesión venció. Volvé a ingresar.", 401);
  const { data: yo } = await db.from("mkt_cuentas").select(`${CAMPOS_AGENCIA}, tipo, estado`).eq("user_id", u.user.id).maybeSingle();
  if (!yo) return err("Tu sesión venció. Volvé a ingresar.", 401);
  if (yo.tipo !== "agencia" || yo.estado !== "aprobada") return err("La Red de colegas es para agencias y concesionarios aprobados.", 403);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }
  if (!b || typeof b !== "object") return err("Datos inválidos");

  try {
    // ---------- Pedidos ----------
    if (b.accion === "listar") {
      const { data: activos, error } = await db.from("mkt_colegas_pedidos").select(CAMPOS_PEDIDO)
        .or(`estado.eq.activo,cuenta_id.eq.${yo.id}`).order("created_at", { ascending: false }).limit(300);
      if (error) throw error;
      const ids = [...new Set((activos ?? []).map((p: A) => String(p.cuenta_id)))];
      const { data: ags } = ids.length
        ? await db.from("mkt_cuentas").select(CAMPOS_AGENCIA).in("id", ids).eq("estado", "aprobada")
        : { data: [] };
      const porId = new Map((ags ?? []).map((a: A) => [String(a.id), a]));
      const pedidos = (activos ?? []).filter((p: A) => porId.has(String(p.cuenta_id))).map((p: A) => {
        const a = porId.get(String(p.cuenta_id)) as A;
        return {
          ...p, mio: p.cuenta_id === yo.id,
          agencia: { id: a.id, nombre: a.nombre, tipo: a.agencia_tipo, marca_oficial: a.marca_oficial, ciudad: a.ciudad, provincia: a.provincia, logo: a.logo, whatsapp: a.whatsapp_ventas || a.telefono },
        };
      });
      return json({ pedidos });
    }

    if (b.accion === "crear") {
      const anioMax = new Date().getFullYear() + 1;
      const marca = texto(b.marca, 40), modelo = texto(b.modelo, 60);
      if (!marca || !modelo) return err("Elegí la marca y escribí el modelo.");
      const num = (v: unknown) => (v == null || String(v).trim() === "" ? null : Number(String(v).replace(/[^\d]/g, "")));
      const anio_desde = num(b.anio_desde), anio_hasta = num(b.anio_hasta), km_max = num(b.km_max), presupuesto = num(b.presupuesto);
      for (const a of [anio_desde, anio_hasta]) if (a !== null && (!Number.isInteger(a) || a < 1950 || a > anioMax)) return err("Revisá los años.");
      if (anio_desde && anio_hasta && anio_desde > anio_hasta) return err("El año \"desde\" tiene que ser menor o igual al \"hasta\".");
      if (km_max !== null && (!Number.isInteger(km_max) || km_max > 2000000)) return err("Revisá el kilometraje.");
      if (presupuesto !== null && (!Number.isFinite(presupuesto) || presupuesto <= 0 || presupuesto >= 1e11)) return err("Revisá el presupuesto.");
      const moneda = presupuesto ? (b.moneda === "USD" ? "USD" : "ARS") : null;
      const transmision = TRANSMISIONES.has(String(b.transmision)) ? String(b.transmision) : null;
      const combustible = COMBUSTIBLES.has(String(b.combustible)) ? String(b.combustible) : null;

      const desde = new Date(Date.now() - 864e5).toISOString();
      const { count } = await db.from("mkt_colegas_pedidos").select("id", { count: "exact", head: true }).eq("cuenta_id", yo.id).gte("created_at", desde);
      if ((count ?? 0) >= MAX_POR_DIA) return err(`Podés publicar hasta ${MAX_POR_DIA} pedidos por día.`, 429);

      const { data: p, error } = await db.from("mkt_colegas_pedidos").insert({
        cuenta_id: yo.id, marca, modelo, version: texto(b.version, 80) || null, anio_desde, anio_hasta, km_max,
        color: texto(b.color, 30) || null, transmision, combustible, presupuesto, moneda, comentario: texto(b.comentario, 400) || null,
      }).select(CAMPOS_PEDIDO).single();
      if (error) throw error;

      // Avisar a todas las agencias aprobadas (menos la que pide)
      const { data: otras } = await db.from("mkt_cuentas").select("id, telefono").eq("tipo", "agencia").eq("estado", "aprobada").neq("id", yo.id);
      const lista = otras ?? [];
      if (lista.length) await db.from("mkt_notificaciones").insert(lista.map((o: A) => ({ cuenta_id: o.id, tipo: "colega_pedido", pedido_id: p.id })));

      let telegram = 0;
      if (lista.length && env("TELEGRAM_BOT_TOKEN")) {
        const tels = lista.flatMap((o: A) => variantes(String(o.telefono)));
        const { data: chats } = await db.from("telegram_chats").select("chat_id, telefono").in("telefono", tels);
        const titulo = [marca, modelo, texto(b.version, 80)].filter(Boolean).join(" ");
        const det = resumen(p as A);
        const msg = `🤝 <b>Red de colegas</b>\n<b>${html(yo.nombre)}</b> (${html(yo.ciudad)}) busca:\n🚗 <b>${html(titulo)}</b>` +
          (det ? `\n${html(det)}` : "") + (p.comentario ? `\n💬 ${html(p.comentario)}` : "") + "\n\n¿Lo tenés? Escribile directo.";
        const vistos = new Set<string>();
        for (const c of chats ?? []) {
          if (vistos.has(String(c.chat_id))) continue;
          vistos.add(String(c.chat_id));
          if (await tg(c.chat_id, msg, `${SITIO}mi-cuenta.html#colegas`)) telegram++;
        }
      }
      await db.from("mkt_colegas_pedidos").update({ avisadas: lista.length }).eq("id", p.id);
      return json({ ok: true, avisadas: lista.length, telegram });
    }

    if (b.accion === "cerrar") {
      const { data, error } = await db.from("mkt_colegas_pedidos").update({ estado: "cerrado", cerrado_at: new Date().toISOString() })
        .eq("id", String(b.id ?? "")).eq("cuenta_id", yo.id).select("id").maybeSingle();
      if (error) throw error;
      if (!data) return err("No encontramos ese pedido.", 404);
      return json({ ok: true });
    }

    // ---------- Campanita ----------
    if (b.accion === "notifs") {
      const { count } = await db.from("mkt_notificaciones").select("id", { count: "exact", head: true }).eq("cuenta_id", yo.id).is("leida_at", null);
      return json({ sin_leer: count ?? 0 });
    }
    if (b.accion === "leer") {
      await db.from("mkt_notificaciones").update({ leida_at: new Date().toISOString() }).eq("cuenta_id", yo.id).is("leida_at", null);
      return json({ ok: true });
    }

    // ---------- Telegram (mismo bot y mismo vínculo que la web actual) ----------
    if (b.accion === "telegram_estado") {
      const { data: c } = await db.from("telegram_chats").select("usuario, nombre").in("telefono", variantes(String(yo.telefono))).maybeSingle();
      return json({ vinculado: !!c, como: c ? (c.usuario ? "@" + c.usuario : c.nombre) : null });
    }
    if (b.accion === "telegram_vincular") {
      const { data: usuario } = await db.rpc("config_privada", { p_clave: "telegram_bot_usuario" });
      if (!usuario) return err("El bot de Telegram todavía no está configurado.");
      const t = crypto.randomUUID().replace(/-/g, "");
      await db.from("telegram_tokens").delete().lt("expira", new Date().toISOString());
      const { error } = await db.from("telegram_tokens").insert({ token: t, telefono: yo.telefono });
      if (error) throw error;
      return json({ url: `https://t.me/${usuario}?start=${t}` });
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-colegas", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
