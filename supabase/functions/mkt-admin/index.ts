// RDA Marketplace · Edge Function: mkt-admin (panel del administrador del marketplace)
// Sesión: la misma del admin de la web actual (login en la función "admin" con celular + contraseña).
// Acciones: resumen, cuentas, cuenta (aprobar, rechazar, suspender, reactivar, reset_pin, prueba, aprobar_cambios, rechazar_cambios), borrar_pruebas,
//           ferias, crear_feria, cancelar_feria, invitar_feria (WhatsApp a las agencias aprobadas),
//           autos, auto_estado (pausar / volver a publicar autos cargados por las agencias).
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

const SITIO = "https://skielxi-ux.github.io/RDA-Marketplace/";

/** WhatsApp Cloud API (mismo método que la web actual): texto si la ventana de 24 h está abierta, si no plantilla. */
async function wa(to: string, text: string) {
  const { data: abierta } = await db.rpc("ventana_abierta", { p_tel: to });
  const payload = abierta
    ? { type: "text", text: { body: text.slice(0, 4000), preview_url: true } }
    : { type: "template", template: { name: "actualizacion_pedido", language: { code: env("WA_TEMPLATE_LANG", "es_AR") },
        components: [{ type: "body", parameters: [{ type: "text", text: text.replace(/\*/g, "").replace(/[\n\t]+/g, " ").slice(0, 900) }] }] } };
  const enviar = async (dest: string) => {
    const r = await fetch(`https://graph.facebook.com/${env("WA_API_VERSION", "v23.0")}/${env("WA_PHONE_NUMBER_ID")}/messages`, {
      method: "POST", headers: { Authorization: `Bearer ${env("WA_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: dest, ...payload }),
    });
    return { r, d: await r.json().catch(() => ({})) };
  };
  let { r, d } = await enviar(to);
  if (!r.ok && to.startsWith("549") && [131030, 100].includes(d?.error?.code)) ({ r, d } = await enviar("54" + to.slice(3)));
  await db.from("wa_mensajes").insert({ direccion: "saliente", telefono: to, tipo: abierta ? "text" : "template:actualizacion_pedido", contenido: payload,
    wa_message_id: d?.messages?.[0]?.id ?? null, error: r.ok ? null : JSON.stringify(d?.error ?? d).slice(0, 500) });
  return r.ok;
}

const CAMPOS = "id, tipo, telefono, nombre, ciudad, provincia, agencia_tipo, marca_oficial, cuit, estado, es_prueba, user_id, intentos, bloqueado_hasta, revisado_at, created_at, logo, cambios_pendientes, cambios_at";
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
      case "ferias": return json(await ferias());
      case "crear_feria": return json(await crearFeria(b));
      case "cancelar_feria": return json(await cancelarFeria(b));
      case "invitar_feria": return json(await invitarFeria(b));
      case "autos": return json(await autos(b));
      case "auto_estado": return json(await autoEstado(b));
    }
    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-admin", b?.accion, e);
    return err(String((e as Error)?.message ?? "Algo salió mal").slice(0, 200), 500);
  }
});

async function resumen() {
  const { data } = await db.from("mkt_cuentas").select("tipo, estado, es_prueba, created_at, cambios_pendientes");
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
    cambios: rows.filter((r) => r.cambios_pendientes && r.estado !== "pendiente").length,
    dias,
  };
}

async function cuentas(b: A) {
  let q = db.from("mkt_cuentas").select(CAMPOS).order("created_at", { ascending: false }).limit(300);
  if (["particular", "agencia"].includes(b.tipo)) q = q.eq("tipo", b.tipo);
  if (["activa", "pendiente", "aprobada", "rechazada", "suspendida"].includes(b.estado)) q = q.eq("estado", b.estado);
  if (b.prueba === true) q = q.eq("es_prueba", true);
  if (b.cambios === true) q = q.not("cambios_pendientes", "is", null);
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
    case "aprobar_cambios": {
      const p = (c.cambios_pendientes ?? {}) as A;
      if (!Object.keys(p).length) throw new Error("No hay cambios para aprobar.");
      for (const k of ["nombre", "cuit", "agencia_tipo", "marca_oficial"]) if (k in p) upd[k] = p[k];
      if (upd.agencia_tipo === "multimarca") upd.marca_oficial = null;
      if (upd.cuit) {
        const { data: dup } = await db.from("mkt_cuentas").select("id").eq("cuit", upd.cuit).neq("id", c.id).maybeSingle();
        if (dup) throw new Error("Otra agencia ya tiene ese CUIT.");
      }
      Object.assign(upd, { cambios_pendientes: null, cambios_at: null, revisado_at: ahora });
      break;
    }
    case "rechazar_cambios": upd = { cambios_pendientes: null, cambios_at: null }; break;
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
    // Fotos de sus autos (los autos se borran solos con la cuenta)
    const { data: fotos } = await db.storage.from("mkt-fotos").list(c.id, { limit: 1000 });
    if (fotos?.length) await db.storage.from("mkt-fotos").remove(fotos.map((f) => `${c.id}/${f.name}`));
  }
  if (lista.length) {
    const { error } = await db.from("mkt_cuentas").delete().in("id", lista.map((c) => c.id)).eq("es_prueba", true);
    if (error) throw error;
  }
  return { ok: true, borradas: lista.length };
}

// ---------- Ferias ----------
const txt = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const fechaAr = (iso: string) => new Date(iso).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

async function ferias() {
  const { data, error } = await db.from("mkt_ferias").select("*").order("empieza", { ascending: false }).limit(50);
  if (error) throw error;
  const { count } = await db.from("mkt_cuentas").select("id", { count: "exact", head: true }).eq("tipo", "agencia").eq("estado", "aprobada").eq("es_prueba", false);
  return { ferias: data ?? [], agencias_aprobadas: count ?? 0 };
}

async function crearFeria(b: A) {
  const nombre = txt(b.nombre, 80);
  const descripcion = txt(b.descripcion, 160) || null;
  const empieza = new Date(String(b.empieza ?? ""));
  const termina = new Date(String(b.termina ?? ""));
  if (nombre.length < 3) throw new Error("Escribí el nombre de la feria.");
  if (isNaN(empieza.getTime()) || isNaN(termina.getTime())) throw new Error("Completá cuándo empieza y cuándo termina.");
  if (termina <= empieza) throw new Error("La feria tiene que terminar después de empezar.");
  if (termina <= new Date()) throw new Error("La fecha de fin ya pasó.");
  if (termina.getTime() - empieza.getTime() > 60 * 864e5) throw new Error("La feria puede durar como máximo 60 días.");
  const { data: choca } = await db.from("mkt_ferias").select("id, nombre").eq("estado", "activa")
    .lt("empieza", termina.toISOString()).gt("termina", empieza.toISOString()).limit(1);
  if (choca?.length) throw new Error(`Se superpone con "${choca[0].nombre}". Cancelala o cambiá las fechas.`);
  const { data, error } = await db.from("mkt_ferias").insert({ nombre, descripcion, empieza: empieza.toISOString(), termina: termina.toISOString() }).select("*").single();
  if (error) throw error;
  return { ok: true, feria: data };
}

async function cancelarFeria(b: A) {
  const { data, error } = await db.from("mkt_ferias").update({ estado: "cancelada" }).eq("id", String(b.id ?? "")).select("*").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No encontré la feria.");
  return { ok: true, feria: data };
}

async function invitarFeria(b: A) {
  const { data: f } = await db.from("mkt_ferias").select("*").eq("id", String(b.id ?? "")).maybeSingle();
  if (!f) throw new Error("No encontré la feria.");
  if (f.estado !== "activa" || new Date(f.termina) <= new Date()) throw new Error("Esa feria ya no está activa.");
  const { data: ags } = await db.from("mkt_cuentas").select("telefono, nombre").eq("tipo", "agencia").eq("estado", "aprobada").eq("es_prueba", false);
  const lista = ags ?? [];
  if (!lista.length) throw new Error("Todavía no hay agencias aprobadas para invitar.");
  let ok = 0;
  for (const a of lista) {
    const texto = `🎉 Hola ${a.nombre}! Te invitamos a la *${f.nombre}* de Red de Autos, del ${fechaAr(f.empieza)} al ${fechaAr(f.termina)} h.` +
      (f.descripcion ? `\n${f.descripcion}` : "") +
      `\nSumá tus autos con precio de feria (el descuento lo elegís vos). Entrá: ${SITIO}`;
    if (await wa(a.telefono, texto).catch(() => false)) ok++;
  }
  const { data, error } = await db.from("mkt_ferias").update({ invitacion_enviada_at: new Date().toISOString(), invitados: lista.length, invitados_ok: ok })
    .eq("id", f.id).select("*").single();
  if (error) throw error;
  return { ok: true, feria: data, enviados: ok, total: lista.length };
}

// ---------- Autos cargados por las agencias ----------
async function autos(b: A) {
  const q = txt(b.q, 60).toLowerCase();
  const { data, error } = await db.from("mkt_autos")
    .select("id, codigo, marca, modelo, version, anio, condicion, precio, moneda, fotos, estado, pausado_por_admin, created_at, cuenta:mkt_cuentas(id, nombre, es_prueba)")
    .order("created_at", { ascending: false }).limit(500);
  if (error) throw error;
  const lista = (data ?? []).filter((a: A) => !q || `${a.marca} ${a.modelo} ${a.version} ${a.codigo} ${(a.cuenta as A)?.nombre}`.toLowerCase().includes(q));
  return { autos: lista };
}

async function autoEstado(b: A) {
  const estado = b.estado === "pausado" ? "pausado" : b.estado === "publicado" ? "publicado" : "";
  if (!estado || typeof b.id !== "string") throw new Error("Datos inválidos");
  const { error } = await db.from("mkt_autos")
    .update({ estado, pausado_por_admin: estado === "pausado", updated_at: new Date().toISOString() }).eq("id", b.id);
  if (error) throw error;
  return { ok: true };
}
