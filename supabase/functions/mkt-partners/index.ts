// RDA Marketplace · Edge Function: mkt-partners (admin de Partners: empresas del rubro automotor)
// Solo la sesión del administrador. Acciones: listar (con clics 30 días y total) · guardar · borrar · url_logo
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
const BUCKET = "mkt-fotos";
const LOGO = /^partners\/[0-9a-f-]{36}\.(webp|jpg)$/;
const txt = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

async function adminEmail() {
  const { data } = await db.rpc("config_privada", { p_clave: "admin_whatsapp" });
  const tel = env("ADMIN_WHATSAPP") || (data as string) || "";
  return tel ? `admin-${tel}@admin.reddeautos.app` : "";
}

/** WhatsApp argentino a formato 549 + 10 dígitos (acepta 381..., 0381 15..., +54 9 ...). */
function normalizarWa(v: unknown) {
  let d = String(v ?? "").replace(/\D/g, "");
  if (d.startsWith("549")) d = d.slice(3);
  else if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2"); // saca el 15 del celular
  return d.length === 10 ? `549${d}` : "";
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
    const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const email = await adminEmail();
    const { data: u } = token ? await db.auth.getUser(token) : { data: null };
    if (!email || !u?.user || u.user.email !== email) return err("Sesión vencida. Volvé a ingresar.", 401);

    if (b.accion === "listar") {
      const { data, error } = await db.from("mkt_partners").select("*").order("nombre");
      if (error) throw error;
      const desde = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const { data: clics } = await db.from("mkt_partner_clics").select("partner_id, dia");
      const c = new Map<string, { total: number; mes: number }>();
      for (const k of clics ?? []) {
        const x = c.get(k.partner_id) ?? { total: 0, mes: 0 };
        x.total++; if (k.dia >= desde) x.mes++;
        c.set(k.partner_id, x);
      }
      return json({ partners: (data ?? []).map((p: A) => ({ ...p, clics: c.get(p.id) ?? { total: 0, mes: 0 } })) });
    }

    if (b.accion === "url_logo") {
      const ext = b.formato === "jpg" ? "jpg" : "webp";
      const path = `partners/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error) throw error;
      return json({ path, token: data.token });
    }

    if (b.accion === "guardar") {
      const p = (b.partner ?? {}) as A;
      const fila: A = {
        nombre: txt(p.nombre, 80), rubro: txt(p.rubro, 40), ciudad: txt(p.ciudad, 60) || null,
        whatsapp: normalizarWa(p.whatsapp), instagram: String(p.instagram ?? "").replace(/^@/, "").trim() || null,
        direccion: txt(p.direccion, 120) || null, beneficio: txt(p.beneficio, 120) || null,
        activo: p.activo !== false, updated_at: new Date().toISOString(),
      };
      if (fila.nombre.length < 2) return err("Escribí el nombre de la empresa.");
      if (fila.rubro.length < 2) return err("Elegí el rubro.");
      if (!fila.whatsapp) return err("Revisá el WhatsApp: código de área y número, por ejemplo 381 555-1234.");
      if (fila.instagram && !/^[A-Za-z0-9._]{1,30}$/.test(fila.instagram)) return err("Revisá el usuario de Instagram.");
      let viejo: string | null = null;
      if (p.logo !== undefined) {
        if (p.logo && !LOGO.test(String(p.logo))) return err("Logo inválido.");
        fila.logo = p.logo || null;
      }
      let id = typeof p.id === "string" && p.id ? p.id : null;
      if (id) {
        const { data: prev } = await db.from("mkt_partners").select("logo").eq("id", id).maybeSingle();
        if (!prev) return err("No encontré ese partner.", 404);
        if (p.logo !== undefined && prev.logo && prev.logo !== fila.logo) viejo = prev.logo;
        const { error } = await db.from("mkt_partners").update(fila).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await db.from("mkt_partners").insert(fila).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      if (viejo) await db.storage.from(BUCKET).remove([viejo]);
      return json({ ok: true, id });
    }

    if (b.accion === "borrar") {
      const { data: prev } = await db.from("mkt_partners").select("logo").eq("id", String(b.id ?? "")).maybeSingle();
      if (!prev) return err("No encontré ese partner.", 404);
      const { error } = await db.from("mkt_partners").delete().eq("id", String(b.id));
      if (error) throw error;
      if (prev.logo) await db.storage.from(BUCKET).remove([prev.logo]);
      return json({ ok: true });
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-partners", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
