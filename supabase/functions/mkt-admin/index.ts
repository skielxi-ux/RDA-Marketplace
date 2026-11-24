// RDA Marketplace · Edge Function: mkt-admin (panel del administrador del marketplace)
// Sesión: la misma del admin de la web actual (login en la función "admin" con celular + contraseña).
// Acciones: resumen, cuentas, cuenta (aprobar, rechazar, suspender, reactivar, reset_pin, prueba), borrar_pruebas.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
type A = Record<string, any>;

async function adminEmail() {
  const { data } = await db.rpc("config_privada", { p_clave: "admin_whatsapp" });
  const tel = env("ADMIN_WHATSAPP") || (data as string) || "";
  return tel ? `admin-${tel}@admin.reddeautos.app` : "";
}

const CAMPOS = "id, tipo, telefono, nombre, ciudad, provincia, agencia_tipo, marca_oficial, cuit, estado, es_prueba, user_id, intentos, bloqueado_hasta, revisado_at, created_at";
const pinDebil = (p: string) => /^(\d)\1{5}$/.test(p) || ["123456", "654321", "012345", "123123", "121212", "112233"].includes(p);
function pinTemporal() {
  for (;;) {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
    const p = String(n).padStart(6, "0");
    if (!pinDebil(p)) return p;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const H = cors(origin);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...H, "Content-Type": "application/json" } });
  const err = (m: string, s = 400) => json({ error: m }, s);
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  if (req.method !== "POST") return err("Método no permitido", 405);
  if (origin && !ORIGENES.has(origin)) return err("Origen no permitido", 403);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }

  try {
    // Solo el administrador
    const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const email = await adminEmail();
    const { data: u } = token ? await db.auth.getUser(token) : { data: null };
    if (!email || !u?.user || u.user.email !== email) return err("Sesión vencida. Volvé a ingresar.", 401);

    switch (b.accion) {
      case "resumen": return json(await resumen());
      case "cuentas": return json(await cuentas(b));
      case "cuenta": return json(await cuenta(b));
      case "borrar_pruebas": return json(await borrarPruebas(b));
    }
    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-admin", b?.accion, e);
    return err(String((e as Error)?.message ?? "Algo salió mal").slice(0, 200), 500);
  }
});

async function resumen() {
  const { data } = await db.from("mkt_cuentas").select("tipo, estado, es_prueba, created_at");
  const rows = data ?? [];
  const reales = rows.filter((r) => !r.es_prueba);
  const n = (f: (r: A) => boolean) => reales.filter(f).length;
  // Registros por día (hora de Argentina), últimos 14 días
  const dias: { dia: string; particulares: number; agencias: number }[] = [];
  const hoyAr = new Date(Date.now() - 3 * 36e5);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.UTC(hoyAr.getUTCFullYear(), hoyAr.getUTCMonth(), hoyAr.getUTCDate() - i));
    dias.push({ dia: d.toISOString().slice(0, 10), particulares: 0, agencias: 0 });
  }
  for (const r of reales) {
    const dia = new Date(new Date(r.created_at).getTime() - 3 * 36e5).toISOString().slice(0, 10);
    const x = dias.find((d) => d.dia === dia);
    if (x) r.tipo === "agencia" ? x.agencias++ : x.particulares++;
  }
  return {
    total: reales.length,
    particulares: n((r) => r.tipo === "particular"),
    agencias: n((r) => r.tipo === "agencia"),
    agencias_aprobadas: n((r) => r.tipo === "agencia" && r.estado === "aprobada"),
    pendientes: rows.filter((r) => r.tipo === "agencia" && r.estado === "pendiente").length,
    suspendidas: n((r) => r.estado === "suspendida"),
    rechazadas: n((r) => r.estado === "rechazada"),
    pruebas: rows.length - reales.length,
    dias,
  };
}

async function cuentas(b: A) {
  let q = db.from("mkt_cuentas").select(CAMPOS).order("created_at", { ascending: false }).limit(300);
  if (["particular", "agencia"].includes(b.tipo)) q = q.eq("tipo", b.tipo);
  if (["activa", "pendiente", "aprobada", "rechazada", "suspendida"].includes(b.estado)) q = q.eq("estado", b.estado);
  if (b.prueba === true) q = q.eq("es_prueba", true);
  const texto = String(b.q ?? "").trim().slice(0, 60);
  if (texto) {
    const dig = texto.replace(/\D/g, "");
    const limpio = texto.replace(/[,()%*\\]/g, " ").trim();
    const ors = [`nombre.ilike.%${limpio}%`, `ciudad.ilike.%${limpio}%`];
    if (dig.length >= 4) ors.push(`telefono.ilike.%${dig}%`, `cuit.ilike.%${dig}%`);
    q = q.or(ors.join(","));
  }
  const { data, error } = await q;
  if (error) throw error;
  return { cuentas: (data ?? []).map((c: A) => ({ ...c, user_id: undefined, tiene_usuario: !!c.user_id, bloqueada: !!c.bloqueado_hasta && new Date(c.bloqueado_hasta) > new Date() })) };
}

async function cuenta(b: A) {
  const { data: c } = await db.from("mkt_cuentas").select(CAMPOS).eq("id", String(b.id ?? "")).maybeSingle();
  if (!c) throw new Error("No encontré la cuenta.");
  const ahora = new Date().toISOString();
  let upd: A = {};
  let pin: string | null = null;
  switch (b.op) {
    case "aprobar":
      if (c.tipo !== "agencia") throw new Error("Solo se aprueban agencias.");
      upd = { estado: "aprobada", revisado_at: ahora }; break;
    case "rechazar":
      if (c.tipo !== "agencia") throw new Error("Solo se rechazan agencias.");
      upd = { estado: "rechazada", revisado_at: ahora }; break;
    case "suspender": upd = { estado: "suspendida" }; break;
    case "reactivar": upd = { estado: c.tipo === "agencia" ? "aprobada" : "activa", intentos: 0, bloqueado_hasta: null }; break;
    case "desbloquear": upd = { intentos: 0, bloqueado_hasta: null }; break;
    case "prueba": upd = { es_prueba: !c.es_prueba }; break;
    case "reset_pin": {
      pin = pinTemporal();
      const { error } = await db.rpc("mkt_set_pin", { p_tel: c.telefono, p_pin: pin });
      if (error) throw error;
      break;
    }
    default: throw new Error("Acción inválida");
  }
  if (Object.keys(upd).length) {
    const { error } = await db.from("mkt_cuentas").update({ ...upd, updated_at: ahora }).eq("id", c.id);
    if (error) throw error;
  }
  // (Una cuenta suspendida o rechazada no puede ingresar, y su sesión abierta se corta en la próxima visita: ver "perfil" en mkt-cuenta.)
  const { data: nueva } = await db.from("mkt_cuentas").select(CAMPOS).eq("id", c.id).single();
  return { ok: true, cuenta: { ...nueva, user_id: undefined }, pin_temporal: pin };
}

async function borrarPruebas(b: A) {
  if (b.confirmar !== "BORRAR") throw new Error("Falta confirmar escribiendo BORRAR.");
  const { data } = await db.from("mkt_cuentas").select("id, user_id").eq("es_prueba", true);
  const lista = data ?? [];
  for (const c of lista) {
    if (c.user_id) await db.auth.admin.deleteUser(c.user_id).catch((e) => console.error("borrar usuario", e));
  }
  if (lista.length) {
    const { error } = await db.from("mkt_cuentas").delete().in("id", lista.map((c) => c.id)).eq("es_prueba", true);
    if (error) throw error;
  }
  return { ok: true, borradas: lista.length };
}
