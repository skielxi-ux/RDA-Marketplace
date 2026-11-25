// RDA Marketplace · Edge Function: mkt-alertas (alertas de compradores con notificaciones del navegador)
// Público: clave (clave VAPID pública para suscribirse).
// Con sesión (cualquier cuenta activa o aprobada): listar · crear · borrar · suscribir · desuscribir · probar.
// Interno (otras funciones, con la clave de servicio): disparar {autos:[ids]} → avisa a las alertas que coinciden.
import { createClient } from "npm:@supabase/supabase-js@2";
import { vapid, pushCuenta } from "./_shared/push.ts";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";
const SITIO = "https://skielxi-ux.github.io/RDA-Marketplace/";
const MAX_ALERTAS = 10;
const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
type A = Record<string, any>;

const texto = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const norm = (s: unknown) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const miles = (n: number) => Math.round(Number(n)).toLocaleString("es-AR");
const precio = (n: number, m: string) => `${m === "USD" ? "USD" : "$"} ${miles(n)}`;
const CAMPOS_ALERTA = "id, marca, modelo, condicion, anio_desde, precio_max, moneda, avisos, ultimo_aviso_at, created_at";

/** ¿El auto cumple la alerta? El modelo se compara sin mayúsculas, espacios ni acentos, y alcanza con que uno empiece como el otro. */
function coincide(al: A, a: A) {
  if (norm(al.marca) !== norm(a.marca)) return false;
  if (al.modelo) {
    const x = norm(al.modelo), y = norm(a.modelo);
    if (!(y.startsWith(x) || (y.length >= 4 && x.startsWith(y)))) return false;
  }
  if (al.condicion === "0km" && a.condicion !== "0km") return false;
  if (al.condicion === "usados" && a.condicion !== "usado") return false;
  if (al.anio_desde && a.anio < al.anio_desde) return false;
  if (al.precio_max && (al.moneda ?? "ARS") === a.moneda && Number(a.precio) > Number(al.precio_max)) return false;
  if (al.precio_max && (al.moneda ?? "ARS") !== a.moneda) return false;
  return true;
}

async function disparar(ids: string[]) {
  const { data: autos } = await db.from("mkt_autos")
    .select("id, cuenta_id, marca, modelo, version, anio, condicion, precio, moneda, ciudad, estado, cuenta:mkt_cuentas(estado, es_prueba)")
    .in("id", ids.slice(0, 500)).eq("estado", "publicado");
  const validos = (autos ?? []).filter((a: A) => ["activa", "aprobada"].includes(a.cuenta?.estado) && !a.cuenta?.es_prueba);
  if (!validos.length) return { avisos: 0 };
  const marcas = new Set(validos.map((a: A) => norm(a.marca)));
  const { data: todas } = await db.from("mkt_alertas").select("*").limit(5000);
  const alertas = (todas ?? []).filter((al: A) => marcas.has(norm(al.marca)));
  const porCuenta = new Map<string, { alerta: A; autos: A[] }[]>();
  for (const al of alertas) {
    const lista = validos.filter((a: A) => a.cuenta_id !== al.cuenta_id && coincide(al, a));
    if (!lista.length) continue;
    // Sacar los que ya se avisaron a esta alerta
    const { data: ya } = await db.from("mkt_alertas_enviadas").select("auto_id").eq("alerta_id", al.id).in("auto_id", lista.map((a: A) => a.id));
    const yaSet = new Set((ya ?? []).map((r: A) => r.auto_id));
    const nuevos = lista.filter((a: A) => !yaSet.has(a.id));
    if (!nuevos.length) continue;
    await db.from("mkt_alertas_enviadas").insert(nuevos.map((a: A) => ({ alerta_id: al.id, auto_id: a.id })));
    await db.from("mkt_alertas").update({ avisos: (al.avisos ?? 0) + nuevos.length, ultimo_aviso_at: new Date().toISOString() }).eq("id", al.id);
    const arr = porCuenta.get(al.cuenta_id) ?? [];
    arr.push({ alerta: al, autos: nuevos });
    porCuenta.set(al.cuenta_id, arr);
  }
  let avisos = 0;
  for (const [cuentaId, grupos] of porCuenta) {
    const todos = [...new Map(grupos.flatMap((g) => g.autos).map((a: A) => [a.id, a])).values()];
    const a = todos[0];
    const msg = todos.length === 1
      ? { title: `Entró un ${a.marca} ${a.modelo} ${a.anio}`, body: `${precio(a.precio, a.moneda)} · ${a.ciudad}. Tocá para verlo.`, url: `${SITIO}auto.html?id=${a.id}`, tag: `auto-${a.id}` }
      : { title: `Entraron ${todos.length} autos que buscás`, body: todos.slice(0, 3).map((x: A) => `${x.marca} ${x.modelo} ${x.anio}`).join(" · "), url: `${SITIO}mi-cuenta.html#alertas`, tag: "alertas" };
    avisos += await pushCuenta(cuentaId, msg);
  }
  return { avisos };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const H = cors(origin);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...H, "Content-Type": "application/json" } });
  const err = (m: string, s = 400) => json({ error: m }, s);
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  if (req.method !== "POST") return err("Método no permitido", 405);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");

  try {
    // Interno: lo llaman mkt-autos y mkt-admin al publicar autos
    if (b.accion === "disparar") {
      if (!token || token !== env("SUPABASE_SERVICE_ROLE_KEY")) return err("No autorizado", 401);
      const ids = Array.isArray(b.autos) ? b.autos.filter((x: unknown) => typeof x === "string") : [];
      return json(await disparar(ids));
    }

    if (origin && !ORIGENES.has(origin)) return err("Origen no permitido", 403);
    if (b.accion === "clave") return json({ clave: (await vapid()).pub });

    // Con sesión
    const { data: u } = token ? await db.auth.getUser(token) : { data: null };
    if (!u?.user?.email?.endsWith("@" + DOMINIO)) return err("Tu sesión venció. Volvé a ingresar.", 401);
    const { data: cuenta } = await db.from("mkt_cuentas").select("id, estado").eq("user_id", u.user.id).maybeSingle();
    if (!cuenta || !["activa", "aprobada"].includes(cuenta.estado)) return err("Tu cuenta no está activa.", 403);

    switch (b.accion) {
      case "listar": {
        const { data } = await db.from("mkt_alertas").select(CAMPOS_ALERTA).eq("cuenta_id", cuenta.id).order("created_at", { ascending: false });
        const { count } = await db.from("mkt_push").select("id", { count: "exact", head: true }).eq("cuenta_id", cuenta.id);
        return json({ alertas: data ?? [], dispositivos: count ?? 0 });
      }
      case "crear": {
        const marca = texto(b.marca, 40);
        if (marca.length < 2) return err("Elegí la marca.");
        const modelo = texto(b.modelo, 60) || null;
        const condicion = ["0km", "usados"].includes(b.condicion) ? b.condicion : "todos";
        const anio = b.anio_desde == null || b.anio_desde === "" ? null : Number(b.anio_desde);
        if (anio !== null && (!Number.isInteger(anio) || anio < 1950 || anio > 2100)) return err("Año inválido.");
        const pmax = b.precio_max == null || b.precio_max === "" ? null : Number(b.precio_max);
        if (pmax !== null && (!Number.isFinite(pmax) || pmax <= 0 || pmax >= 1e11)) return err("Precio inválido.");
        const moneda = pmax ? (b.moneda === "USD" ? "USD" : "ARS") : null;
        const { data: mias } = await db.from("mkt_alertas").select("id, marca, modelo, condicion").eq("cuenta_id", cuenta.id);
        const igual = (mias ?? []).find((x: A) => norm(x.marca) === norm(marca) && norm(x.modelo) === norm(modelo) && x.condicion === condicion);
        if (igual) {
          const { data } = await db.from("mkt_alertas").update({ anio_desde: anio, precio_max: pmax, moneda }).eq("id", igual.id).select(CAMPOS_ALERTA).single();
          return json({ ok: true, alerta: data, actualizada: true });
        }
        if ((mias ?? []).length >= MAX_ALERTAS) return err(`Podés tener hasta ${MAX_ALERTAS} alertas. Borrá alguna para crear otra.`);
        const { data, error } = await db.from("mkt_alertas").insert({ cuenta_id: cuenta.id, marca, modelo, condicion, anio_desde: anio, precio_max: pmax, moneda }).select(CAMPOS_ALERTA).single();
        if (error) throw error;
        return json({ ok: true, alerta: data });
      }
      case "borrar": {
        if (typeof b.id !== "string") return err("Datos inválidos");
        await db.from("mkt_alertas").delete().eq("id", b.id).eq("cuenta_id", cuenta.id);
        return json({ ok: true });
      }
      case "suscribir": {
        const endpoint = String(b.endpoint ?? ""), p256dh = String(b.p256dh ?? ""), auth = String(b.auth ?? "");
        if (!/^https:\/\/[^\s]{10,800}$/.test(endpoint) || !/^[A-Za-z0-9_-]{20,200}$/.test(p256dh) || !/^[A-Za-z0-9_-]{8,100}$/.test(auth)) return err("Suscripción inválida.");
        const { error } = await db.from("mkt_push").upsert({ cuenta_id: cuenta.id, endpoint, p256dh, auth }, { onConflict: "endpoint" });
        if (error) throw error;
        return json({ ok: true });
      }
      case "desuscribir": {
        await db.from("mkt_push").delete().eq("cuenta_id", cuenta.id).eq("endpoint", String(b.endpoint ?? ""));
        return json({ ok: true });
      }
      case "probar": {
        const n = await pushCuenta(cuenta.id, { title: "¡Listo! Las alertas funcionan", body: "Te vamos a avisar acá cuando entre un auto que buscás.", url: `${SITIO}mi-cuenta.html#alertas`, tag: "prueba" });
        return json({ ok: true, enviadas: n });
      }
    }
    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-alertas", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
