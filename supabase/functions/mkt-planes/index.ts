// RDA Marketplace · Edge Function: mkt-planes (admin de Planes de ahorro: concesionarios y sus vendedores)
// Solo la sesión del administrador. Acciones: listar (con clics a WhatsApp y llamadas) · url_imagen (logo o foto)
// guardar_concesionario · borrar_concesionario · guardar_vendedor · borrar_vendedor
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
const IMG = /^planes\/[0-9a-f-]{36}\.(webp|jpg)$/;
const txt = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

async function adminEmail() {
  const { data } = await db.rpc("config_privada", { p_clave: "admin_whatsapp" });
  const tel = env("ADMIN_WHATSAPP") || (data as string) || "";
  return tel ? `admin-${tel}@admin.reddeautos.app` : "";
}

/** Número argentino a 10 dígitos (código de área + número), sin 0, sin 15 y sin 54/549. "" si no es válido. */
function diezDigitos(v: unknown) {
  let d = String(v ?? "").replace(/\D/g, "");
  if (d.startsWith("549")) d = d.slice(3);
  else if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 12) d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
  return d.length === 10 ? d : "";
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
      const [{ data: cs, error: e1 }, { data: vs, error: e2 }, { data: clics }] = await Promise.all([
        db.from("mkt_plan_concesionarios").select("*").order("marca").order("nombre"),
        db.from("mkt_plan_vendedores").select("*").order("nombre"),
        db.from("mkt_plan_clics").select("vendedor_id, tipo, dia"),
      ]);
      if (e1 || e2) throw e1 || e2;
      const desde = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const c = new Map<string, A>();
      for (const k of clics ?? []) {
        const x = c.get(k.vendedor_id) ?? { whatsapp: 0, llamada: 0, total: 0 };
        x.total++; if (k.dia >= desde) x[k.tipo]++;
        c.set(k.vendedor_id, x);
      }
      return json({
        concesionarios: (cs ?? []).map((x: A) => ({
          ...x, vendedores: (vs ?? []).filter((v: A) => v.concesionario_id === x.id).map((v: A) => ({ ...v, clics: c.get(v.id) ?? { whatsapp: 0, llamada: 0, total: 0 } })),
        })),
      });
    }

    if (b.accion === "url_imagen") {
      const ext = b.formato === "jpg" ? "jpg" : "webp";
      const path = `planes/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error) throw error;
      return json({ path, token: data.token });
    }

    if (b.accion === "guardar_concesionario") {
      const p = (b.concesionario ?? {}) as A;
      const fila: A = {
        nombre: txt(p.nombre, 80), marca: txt(p.marca, 40), ciudad: txt(p.ciudad, 60) || null,
        direccion: txt(p.direccion, 120) || null, activo: p.activo !== false, updated_at: new Date().toISOString(),
      };
      if (fila.nombre.length < 2) return err("Escribí el nombre del concesionario.");
      if (fila.marca.length < 2) return err("Elegí la marca.");
      return json(await guardar("mkt_plan_concesionarios", "logo", p, fila));
    }

    if (b.accion === "guardar_vendedor") {
      const p = (b.vendedor ?? {}) as A;
      const wa = diezDigitos(p.whatsapp);
      if (!wa) return err("Revisá el WhatsApp: código de área y número, por ejemplo 381 555-1234.");
      const tel = String(p.telefono ?? "").trim() ? diezDigitos(p.telefono) : "";
      if (String(p.telefono ?? "").trim() && !tel) return err("Revisá el teléfono para llamar (código de área y número).");
      const fila: A = {
        nombre: txt(p.nombre, 80), whatsapp: `549${wa}`, telefono: tel || null,
        planes: txt(p.planes, 200) || null, horario: txt(p.horario, 80) || null,
        activo: p.activo !== false, updated_at: new Date().toISOString(),
      };
      if (fila.nombre.length < 2) return err("Escribí el nombre del vendedor.");
      if (!p.id) {
        const { data: con } = await db.from("mkt_plan_concesionarios").select("id").eq("id", String(p.concesionario_id ?? "")).maybeSingle();
        if (!con) return err("Elegí el concesionario.");
        fila.concesionario_id = con.id;
      }
      return json(await guardar("mkt_plan_vendedores", "foto", p, fila));
    }

    if (b.accion === "borrar_concesionario" || b.accion === "borrar_vendedor") {
      const conc = b.accion === "borrar_concesionario";
      const tabla = conc ? "mkt_plan_concesionarios" : "mkt_plan_vendedores";
      const { data: prev } = await db.from(tabla).select(conc ? "id, logo" : "id, foto").eq("id", String(b.id ?? "")).maybeSingle();
      if (!prev) return err("No lo encontré.", 404);
      const imgs = [conc ? prev.logo : prev.foto];
      if (conc) {
        const { data: vs } = await db.from("mkt_plan_vendedores").select("foto").eq("concesionario_id", prev.id);
        imgs.push(...(vs ?? []).map((v: A) => v.foto));
      }
      const { error } = await db.from(tabla).delete().eq("id", prev.id);
      if (error) throw error;
      const borrar = imgs.filter(Boolean) as string[];
      if (borrar.length) await db.storage.from(BUCKET).remove(borrar);
      return json({ ok: true });
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-planes", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});

/** Crea o actualiza una fila con imagen opcional (logo o foto); si la imagen cambia, borra la anterior. */
async function guardar(tabla: string, campoImg: string, p: A, fila: A) {
  if (p[campoImg] !== undefined) {
    if (p[campoImg] && !IMG.test(String(p[campoImg]))) throw new Error("Imagen inválida");
    fila[campoImg] = p[campoImg] || null;
  }
  let id = typeof p.id === "string" && p.id ? p.id : null;
  let vieja: string | null = null;
  if (id) {
    const { data: prev } = await db.from(tabla).select(campoImg).eq("id", id).maybeSingle();
    if (!prev) throw new Error("No lo encontré.");
    if (p[campoImg] !== undefined && prev[campoImg] && prev[campoImg] !== fila[campoImg]) vieja = prev[campoImg];
    const { error } = await db.from(tabla).update(fila).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await db.from(tabla).insert(fila).select("id").single();
    if (error) throw error;
    id = data.id;
  }
  if (vieja) await db.storage.from(BUCKET).remove([vieja]);
  return { ok: true, id };
}
