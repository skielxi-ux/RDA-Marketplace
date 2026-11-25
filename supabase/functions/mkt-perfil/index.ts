// RDA Marketplace · Edge Function: mkt-perfil
// Perfil de la agencia (con su sesión): ver · guardar · url_logo · guardar_logo · quitar_logo
// Incluye si acepta vendedores independientes y la comisión (1 a 4 %).
// Nombre, CUIT y tipo (multimarca / oficial y marca) quedan como "cambios pendientes" hasta que el admin los apruebe.
// El resto se guarda al instante. El logo se sube a Storage (mkt-fotos) con URL firmada, dentro de la carpeta de la cuenta.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";
const BUCKET = "mkt-fotos";

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
const texto = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const textoLargo = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u0009\u000b-\u001f<>]/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);

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
function cuitValido(c: string) {
  if (!/^\d{11}$/.test(c)) return false;
  const m = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let v = 11 - (m.reduce((a, f, i) => a + f * Number(c[i]), 0) % 11);
  if (v === 11) v = 0;
  return v !== 10 && v === Number(c[10]);
}

async function avisarAdminTelegram(msg: string) {
  try {
    const token = env("TELEGRAM_BOT_TOKEN");
    if (!token) return;
    const { data: tel } = await db.rpc("config_privada", { p_clave: "admin_whatsapp" });
    const admin = env("ADMIN_WHATSAPP") || (tel as string) || "";
    if (!admin) return;
    const { data: chat } = await db.from("telegram_chats").select("chat_id").eq("telefono", admin).maybeSingle();
    if (!chat?.chat_id) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat.chat_id, text: msg.slice(0, 3500), disable_web_page_preview: true }),
    });
  } catch (e) { console.error("aviso telegram", e); }
}

const CAMPOS = "id, tipo, estado, nombre, cuit, agencia_tipo, marca_oficial, ciudad, provincia, direccion, horario, telefono, whatsapp_ventas, email, descripcion, sitio_web, instagram, logo, cambios_pendientes, cambios_at, acepta_independientes, comision_independientes";
const publico = (c: A) => ({ ...c, telefono: undefined, tipo: undefined });

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
  const { data: c } = await db.from("mkt_cuentas").select(CAMPOS).eq("user_id", u.user.id).maybeSingle();
  if (!c) return err("Tu sesión venció. Volvé a ingresar.", 401);
  if (c.tipo !== "agencia") return err("El perfil de agencia es solo para agencias y concesionarios.", 403);
  if (c.estado === "suspendida" || c.estado === "rechazada") return err("Esta cuenta no está habilitada.", 403);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }
  if (!b || typeof b !== "object") return err("Datos inválidos");

  try {
    if (b.accion === "ver") return json({ perfil: publico(c) });

    if (b.accion === "guardar") {
      // Datos que se guardan al instante
      const ciudad = texto(b.ciudad, 60);
      const provincia = texto(b.provincia, 40);
      if (ciudad.length < 2) return err("Escribí la ciudad.");
      if (!PROVINCIAS.has(provincia)) return err("Elegí una provincia de la lista.");
      const wsp = String(b.whatsapp_ventas ?? "").trim();
      const whatsapp_ventas = wsp ? normTel(wsp) : null;
      if (whatsapp_ventas && !/^549\d{10}$/.test(whatsapp_ventas)) return err("Revisá el WhatsApp de ventas (con código de área, ej. 381 555-1234).");
      const email = texto(b.email, 120).toLowerCase() || null;
      if (email && !/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(email)) return err("Revisá el email.");
      let sitio_web = texto(b.sitio_web, 200) || null;
      if (sitio_web && !/^https?:\/\//i.test(sitio_web)) sitio_web = "https://" + sitio_web;
      if (sitio_web) {
        try { const url = new URL(sitio_web); if (!/\./.test(url.hostname)) throw 0; url.protocol = "https:"; sitio_web = url.toString().slice(0, 200); }
        catch { return err("Revisá el sitio web."); }
      }
      const instagram = texto(b.instagram, 60).replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/.*$/, "") || null;
      if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) return err("Revisá el usuario de Instagram (ej. @motorshow).");
      // Vendedores independientes: si acepta, comisión entera de 1 a 4 % sobre el precio final de venta
      const acepta_independientes = b.acepta_independientes === true || b.acepta_independientes === "si";
      const comision = Number(b.comision_independientes);
      if (acepta_independientes && !(Number.isInteger(comision) && comision >= 1 && comision <= 4)) return err("Elegí la comisión para vendedores independientes (de 1 a 4 %).");
      const directos: A = {
        ciudad, provincia, whatsapp_ventas, email, sitio_web, instagram,
        acepta_independientes, comision_independientes: acepta_independientes ? comision : null,
        direccion: texto(b.direccion, 120) || null,
        horario: texto(b.horario, 120) || null,
        descripcion: textoLargo(b.descripcion, 600) || null,
        updated_at: new Date().toISOString(),
      };

      // Datos que revisa el admin
      const nombre = texto(b.nombre, 80);
      if (nombre.length < 2) return err("Escribí el nombre comercial.");
      const cuit = String(b.cuit ?? "").replace(/\D/g, "");
      if (!cuitValido(cuit)) return err("Revisá el CUIT: tiene que tener 11 números y ser válido.");
      const agencia_tipo = b.agencia_tipo === "oficial" ? "oficial" : b.agencia_tipo === "multimarca" ? "multimarca" : "";
      if (!agencia_tipo) return err("Elegí si es concesionario oficial o agencia multimarca.");
      const marca_oficial = agencia_tipo === "oficial" ? texto(b.marca_oficial, 40) : null;
      if (agencia_tipo === "oficial" && (!marca_oficial || marca_oficial.length < 2)) return err("Elegí la marca que representa el concesionario.");
      const pedido: A = { nombre, cuit, agencia_tipo, marca_oficial };
      const actual: A = { nombre: c.nombre, cuit: c.cuit, agencia_tipo: c.agencia_tipo, marca_oficial: c.marca_oficial ?? null };
      const cambios = Object.fromEntries(Object.entries(pedido).filter(([k, v]) => v !== actual[k]));
      if (cambios.cuit) {
        const { data: dup } = await db.from("mkt_cuentas").select("id").eq("cuit", cuit).neq("id", c.id).maybeSingle();
        if (dup) return err("Ya hay otra agencia registrada con ese CUIT.", 409);
      }
      const hayCambios = Object.keys(cambios).length > 0;
      const yaPendiente = JSON.stringify(c.cambios_pendientes ?? null) === JSON.stringify(hayCambios ? cambios : null);
      const upd: A = { ...directos };
      if (!yaPendiente) {
        upd.cambios_pendientes = hayCambios ? cambios : null;
        upd.cambios_at = hayCambios ? new Date().toISOString() : null;
      }
      const { error } = await db.from("mkt_cuentas").update(upd).eq("id", c.id);
      if (error) throw error;
      if (hayCambios && !yaPendiente) {
        const etiquetas: Record<string, string> = { nombre: "Nombre", cuit: "CUIT", agencia_tipo: "Tipo", marca_oficial: "Marca oficial" };
        await avisarAdminTelegram([
          `✏️ ${c.nombre} pidió cambiar datos de su perfil (para revisar)`,
          ...Object.entries(cambios).map(([k, v]) => `${etiquetas[k]}: ${actual[k] ?? "—"} → ${v ?? "—"}`),
          "Revisalo en: https://skielxi-ux.github.io/RDA-Marketplace/admin.html (Concesionarios)",
        ].join("\n"));
      }
      const { data: nuevo } = await db.from("mkt_cuentas").select(CAMPOS).eq("id", c.id).single();
      return json({ ok: true, perfil: publico(nuevo), pendiente: hayCambios });
    }

    if (b.accion === "url_logo") {
      const ext = b.formato === "jpg" ? "jpg" : "webp";
      const path = `${c.id}/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error) throw error;
      return json({ path, token: data.token });
    }

    if (b.accion === "guardar_logo") {
      const path = String(b.path ?? "");
      if (!new RegExp(`^${c.id}/[0-9a-f-]{36}\\.(webp|jpg)$`).test(path)) return err("Logo inválido.");
      const { data: existe } = await db.rpc("mkt_fotos_existentes", { p_names: [path] });
      if (!((existe ?? []) as unknown[]).length) return err("El logo no terminó de subir. Probá de nuevo.");
      const { error } = await db.from("mkt_cuentas").update({ logo: path, updated_at: new Date().toISOString() }).eq("id", c.id);
      if (error) throw error;
      if (c.logo && c.logo !== path) await db.storage.from(BUCKET).remove([String(c.logo)]);
      return json({ ok: true, logo: path });
    }

    if (b.accion === "quitar_logo") {
      if (c.logo) {
        await db.from("mkt_cuentas").update({ logo: null, updated_at: new Date().toISOString() }).eq("id", c.id);
        await db.storage.from(BUCKET).remove([String(c.logo)]);
      }
      return json({ ok: true });
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-perfil", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
