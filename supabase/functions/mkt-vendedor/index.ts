// RDA Marketplace · Edge Function: mkt-vendedor (vendedores independientes aprobados)
// comisiones: % que paga cada agencia adherida · panel: clientes que trajo con su link (?ref=CODIGO), por auto.
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
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u } = token ? await db.auth.getUser(token) : { data: null };
  if (!u?.user?.email?.endsWith("@" + DOMINIO)) return err("Tu sesión venció. Volvé a ingresar.", 401);
  const { data: yo } = await db.from("mkt_cuentas").select("id, tipo, estado, ref_code").eq("user_id", u.user.id).maybeSingle();
  if (!yo || yo.tipo !== "vendedor") return err("Esto es para vendedores independientes.", 403);
  if (yo.estado !== "aprobada") return err("Tu cuenta de vendedor independiente todavía está en revisión.", 403);

  try {
    if (b.accion === "comisiones") {
      const { data } = await db.from("mkt_cuentas").select("id, comision_independientes")
        .eq("tipo", "agencia").eq("estado", "aprobada").eq("acepta_independientes", true).eq("es_prueba", false);
      return json({ ref: yo.ref_code, comisiones: Object.fromEntries((data ?? []).map((a: A) => [a.id, a.comision_independientes])) });
    }
    if (b.accion === "panel") {
      const { data: refs } = await db.from("mkt_referidos").select("auto_id, agencia_id, tipo, created_at")
        .eq("vendedor_id", yo.id).order("created_at", { ascending: false }).limit(5000);
      const porAuto = new Map<string, A>();
      for (const r of refs ?? []) {
        const x = porAuto.get(r.auto_id) ?? { auto_id: r.auto_id, agencia_id: r.agencia_id, vista: 0, whatsapp: 0, llamada: 0, ultimo: r.created_at };
        x[r.tipo]++;
        porAuto.set(r.auto_id, x);
      }
      const ids = [...porAuto.keys()];
      const agIds = [...new Set([...porAuto.values()].map((x) => x.agencia_id))];
      const [{ data: autos }, { data: ags }] = await Promise.all([
        ids.length ? db.from("mkt_autos").select("id, marca, modelo, version, anio, precio, moneda, estado, fotos").in("id", ids) : Promise.resolve({ data: [] }),
        agIds.length ? db.from("mkt_cuentas").select("id, nombre, comision_independientes, acepta_independientes, whatsapp_ventas, telefono").in("id", agIds) : Promise.resolve({ data: [] }),
      ]);
      const A1 = new Map((autos ?? []).map((a: A) => [a.id, a]));
      const G = new Map((ags ?? []).map((a: A) => [a.id, a]));
      const filas = [...porAuto.values()].map((x) => {
        const a = A1.get(x.auto_id) ?? {}, g = G.get(x.agencia_id) ?? {};
        return {
          ...x,
          auto: { id: x.auto_id, titulo: [a.marca, a.modelo, a.version, a.anio].filter(Boolean).join(" "), precio: a.precio, moneda: a.moneda, estado: a.estado, foto: a.fotos?.[0] ?? null },
          agencia: { id: x.agencia_id, nombre: g.nombre, comision: g.acepta_independientes ? g.comision_independientes : null, whatsapp: g.whatsapp_ventas || g.telefono },
        };
      });
      return json({ ref: yo.ref_code, clientes: filas });
    }
    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-vendedor", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
