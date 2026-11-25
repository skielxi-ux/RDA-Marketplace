// RDA Marketplace · Edge Function: mkt-notifs (campanita de notificaciones, cualquier cuenta con sesión)
// contar · listar (últimas 40, con texto y link) · leer (marca todas como leídas)
// Las de la Red de colegas se arman con los datos del pedido; las demás traen su texto (las crea mkt-admin).
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";
const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
type A = Record<string, any>;
const LINK = /^(mi-cuenta\.html(#[a-z-]+)?|vender\.html|feria\.html|agencias\.html)$/;

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
  const { data: yo } = await db.from("mkt_cuentas").select("id, estado").eq("user_id", u.user.id).maybeSingle();
  if (!yo) return err("Tu sesión venció. Volvé a ingresar.", 401);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }

  try {
    const sinLeer = async () => (await db.from("mkt_notificaciones").select("id", { count: "exact", head: true }).eq("cuenta_id", yo.id).is("leida_at", null)).count ?? 0;

    if (b.accion === "contar") return json({ sin_leer: await sinLeer() });

    if (b.accion === "leer") {
      const { error } = await db.from("mkt_notificaciones").update({ leida_at: new Date().toISOString() }).eq("cuenta_id", yo.id).is("leida_at", null);
      if (error) throw error;
      return json({ ok: true });
    }

    if (b.accion === "listar") {
      const { data, error } = await db.from("mkt_notificaciones").select("id, tipo, texto, link, pedido_id, origen_id, leida_at, created_at")
        .eq("cuenta_id", yo.id).order("created_at", { ascending: false }).limit(40);
      if (error) throw error;
      const filas = (data ?? []) as A[];
      const pedidos = [...new Set(filas.map((n) => n.pedido_id).filter(Boolean))];
      const origenes = [...new Set(filas.map((n) => n.origen_id).filter(Boolean))];
      const { data: ps } = pedidos.length
        ? await db.from("mkt_colegas_pedidos").select("id, marca, modelo, version, anio_desde, cuenta_id").in("id", pedidos)
        : { data: [] };
      const cuentas = [...new Set([...origenes, ...(ps ?? []).map((p: A) => p.cuenta_id)])];
      const { data: os } = cuentas.length ? await db.from("mkt_cuentas").select("id, nombre").in("id", cuentas) : { data: [] };
      const O = new Map((os ?? []).map((o: A) => [o.id, o]));
      const P = new Map((ps ?? []).map((p: A) => [p.id, { ...p, autor: O.get(p.cuenta_id)?.nombre }]));
      const items = filas.map((n) => {
        let texto = n.texto as string | null;
        let link = n.link as string | null;
        if (n.tipo === "colega_pedido" || n.tipo === "colega_respuesta") {
          const p = P.get(n.pedido_id);
          const auto = p ? [p.marca, p.modelo, p.version, p.anio_desde ? `desde ${p.anio_desde}` : ""].filter(Boolean).join(" ") : "un auto";
          texto = n.tipo === "colega_pedido"
            ? `${p?.autor ?? "Una agencia"} busca ${auto}. ¿Lo tenés?`
            : `${O.get(n.origen_id)?.nombre ?? "Una agencia"} tiene el ${auto} que pediste.`;
          link = "mi-cuenta.html#colegas";
        }
        return { id: n.id, tipo: n.tipo, texto: texto ?? "", link: link && LINK.test(link) ? link : null, leida: !!n.leida_at, created_at: n.created_at };
      });
      return json({ items, sin_leer: items.filter((i) => !i.leida).length });
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-notifs", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
