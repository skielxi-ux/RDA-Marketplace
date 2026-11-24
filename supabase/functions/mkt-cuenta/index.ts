// RDA Marketplace · Edge Function: mkt-cuenta
// Cuentas del marketplace (particulares y agencias/concesionarios) con celular + PIN de 6 números.
// Público: registrar, ingresar · Con sesión: perfil
// Datos en public.mkt_cuentas (sin acceso público; solo esta función con service role).
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";

// Solo el sitio del marketplace (y el servidor local de desarrollo) puede llamar a esta función.
const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

type A = Record<string, unknown>;

const PROVINCIAS = new Set([
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
]);

function normTel(t: unknown) {
  let d = String(t ?? "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (!d.startsWith("54")) d = "54" + d;
  let n = d.slice(2);
  if (n.length === 12 && !n.startsWith("9")) {
    for (const a of [3, 4, 2]) if (n.slice(a, a + 2) === "15") { n = n.slice(0, a) + n.slice(a + 2); break; }
  }
  return n.startsWith("9") ? "54" + n : "549" + n;
}

/** CUIT/CUIL argentino: 11 dígitos con dígito verificador válido. */
function cuitValido(c: string) {
  if (!/^\d{11}$/.test(c)) return false;
  const m = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const s = m.reduce((a, f, i) => a + f * Number(c[i]), 0);
  let v = 11 - (s % 11);
  if (v === 11) v = 0;
  if (v === 10) return false;
  return v === Number(c[10]);
}

const texto = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const pinDebil = (p: string) => /^(\d)\1{5}$/.test(p) || ["123456", "654321", "012345", "123123", "121212", "112233"].includes(p);

async function sesion(tel: string, tipo: string) {
  const email = `${tel}@${DOMINIO}`;
  const { error: e } = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: { telefono: tel, rol: `mkt_${tipo}` } });
  if (e && !/already|registered|exists/i.test(e.message)) throw e;
  const { data: link, error } = await db.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;
  const uid = link.user?.id;
  if (uid) await db.from("mkt_cuentas").update({ user_id: uid }).eq("telefono", tel).is("user_id", null);
  return { email, otp: link.properties?.email_otp };
}

const publica = (c: A) => ({
  tipo: c.tipo, nombre: c.nombre, ciudad: c.ciudad, provincia: c.provincia, estado: c.estado,
  agencia_tipo: c.agencia_tipo, marca_oficial: c.marca_oficial,
  telefono: String(c.telefono ?? "").replace(/^549(\d+)(\d{4})$/, (_, a, b) => `${a.slice(0, -2).replace(/./g, "•")}${a.slice(-2)} ${b}`),
});

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
  if (!b || typeof b !== "object") return err("Datos inválidos");

  try {
    if (b.accion === "registrar") return await registrar(b, json, err);
    if (b.accion === "ingresar") return await ingresar(b, json, err);
    if (b.accion === "perfil") {
      const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
      const { data: u } = await db.auth.getUser(token);
      if (!u?.user?.email?.endsWith("@" + DOMINIO)) return err("Tu sesión venció. Volvé a ingresar.", 401);
      const { data: c } = await db.from("mkt_cuentas").select("*").eq("user_id", u.user.id).maybeSingle();
      if (!c) return err("Tu sesión venció. Volvé a ingresar.", 401);
      return json({ cuenta: publica(c) });
    }
    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-cuenta", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});

type J = (b: unknown, s?: number) => Response;

async function registrar(b: A, json: J, err: J) {
  if (texto(b.sitio_web, 10)) return err("No pudimos crear la cuenta."); // campo trampa para bots
  if (b.acepto !== true) return err("Tenés que aceptar los términos y condiciones.");
  const tipo = b.tipo === "agencia" ? "agencia" : b.tipo === "particular" ? "particular" : "";
  if (!tipo) return err("Elegí si sos particular o agencia.");

  const tel = normTel(b.telefono);
  const pin = String(b.pin ?? "").replace(/\D/g, "");
  if (!/^549\d{10}$/.test(tel)) return err("Revisá el celular (con código de área, ej. 381 555-1234).");
  if (!/^\d{6}$/.test(pin)) return err("El PIN tiene que tener 6 números.");
  if (pinDebil(pin)) return err("Elegí un PIN más difícil de adivinar.");

  const nombre = texto(b.nombre, 80);
  if (nombre.length < 2) return err(tipo === "agencia" ? "Escribí el nombre comercial." : "Escribí tu nombre.");
  const ciudad = texto(b.ciudad, 60) || null;
  const provincia = texto(b.provincia, 60) || null;
  if (provincia && !PROVINCIAS.has(provincia)) return err("Elegí una provincia de la lista.");

  const fila: A = { tipo, telefono: tel, nombre, ciudad, provincia, estado: tipo === "agencia" ? "pendiente" : "activa", acepto_terminos_at: new Date().toISOString() };

  if (tipo === "agencia") {
    const agencia_tipo = b.agencia_tipo === "oficial" ? "oficial" : b.agencia_tipo === "multimarca" ? "multimarca" : "";
    if (!agencia_tipo) return err("Elegí si es concesionario oficial o agencia multimarca.");
    const marca = texto(b.marca_oficial, 40);
    if (agencia_tipo === "oficial" && marca.length < 2) return err("Elegí la marca que representa el concesionario.");
    const cuit = String(b.cuit ?? "").replace(/\D/g, "");
    if (!cuitValido(cuit)) return err("Revisá el CUIT: tiene que tener 11 números y ser válido.");
    if (!ciudad || ciudad.length < 2) return err("Escribí la ciudad.");
    if (!provincia) return err("Elegí la provincia.");
    Object.assign(fila, { agencia_tipo, marca_oficial: agencia_tipo === "oficial" ? marca : null, cuit });
    const { data: dup } = await db.from("mkt_cuentas").select("id").eq("cuit", cuit).maybeSingle();
    if (dup) return err("Ya hay una agencia registrada con ese CUIT. Ingresá con su celular.", 409);
  }

  const { data: existe } = await db.from("mkt_cuentas").select("id").eq("telefono", tel).maybeSingle();
  if (existe) return err("Ya hay una cuenta con ese celular. Ingresá con tu PIN.", 409);

  const { error } = await db.from("mkt_cuentas").insert(fila);
  if (error) {
    if (/duplicate|unique/i.test(error.message)) return err("Ya hay una cuenta con esos datos. Ingresá con tu PIN.", 409);
    throw error;
  }
  await db.rpc("mkt_set_pin", { p_tel: tel, p_pin: pin });
  const s = await sesion(tel, tipo);
  const { data: c } = await db.from("mkt_cuentas").select("*").eq("telefono", tel).single();
  return json({ email: s.email, otp: s.otp, cuenta: publica(c) });
}

async function ingresar(b: A, json: J, err: J) {
  const tel = normTel(b.telefono);
  const pin = String(b.pin ?? "").replace(/\D/g, "");
  if (!/^549\d{10}$/.test(tel)) return err("Revisá el celular (con código de área, ej. 381 555-1234).");
  if (!/^\d{6}$/.test(pin)) return err("El PIN tiene que tener 6 números.");
  const { data: r } = await db.rpc("mkt_verificar_pin", { p_tel: tel, p_pin: pin });
  const msg: Record<string, string> = {
    sin_cuenta: "No encontramos una cuenta con ese celular. Creala en \"Crear cuenta\".",
    sin_pin: "Tu PIN fue reiniciado. Escribinos para crear uno nuevo.",
    bloqueado: "Demasiados intentos. Esperá 15 minutos y probá de nuevo.",
    incorrecto: "El celular o el PIN no coinciden.",
  };
  if (r !== "ok") return err(msg[String(r)] ?? "No pudimos ingresar.", 401);
  const { data: c } = await db.from("mkt_cuentas").select("*").eq("telefono", tel).single();
  if (c.estado === "suspendida" || c.estado === "rechazada") return err("Esta cuenta no está habilitada. Escribinos si creés que es un error.", 403);
  const s = await sesion(tel, String(c.tipo));
  return json({ email: s.email, otp: s.otp, cuenta: publica(c) });
}
