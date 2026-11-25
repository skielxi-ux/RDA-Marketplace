// RDA Marketplace · Edge Function: mkt-autos
// Carga masiva de autos de agencias aprobadas (plantilla Excel + carpeta de fotos)
// y carga de a uno para particulares (hasta 2 autos activos; cada carga o cambio queda "en revisión" hasta que la aprueba el admin).
// Con sesión de agencia aprobada o particular activo: mios · urls_fotos · publicar · estado · borrar · estadisticas
// Solo agencias: feria · feria_sumar · feria_quitar (autos del stock con precio relámpago en la feria vigente)
// Las fotos se suben directo a Storage (bucket mkt-fotos) con URLs firmadas que da esta función,
// siempre dentro de la carpeta de la cuenta. Datos en public.mkt_autos (sin acceso público directo).
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const DOMINIO = "mkt.reddeautos.app";
const BUCKET = "mkt-fotos";
const MAX_FOTOS = 7;
const MAX_AUTOS = 200;
const MAX_PARTICULAR = 2;

const ORIGENES = new Set(["https://skielxi-ux.github.io", "http://localhost:5173", "http://localhost:4173"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGENES.has(origin) ? origin : "https://skielxi-ux.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

type A = Record<string, unknown>;

/** Avisa a las alertas de compradores que entraron autos nuevos (no frena la respuesta si falla). */
function avisarAlertas(ids: string[]) {
  if (!ids.length) return;
  const p = fetch(`${env("SUPABASE_URL")}/functions/v1/mkt-alertas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env("SUPABASE_SERVICE_ROLE_KEY")}` },
    body: JSON.stringify({ accion: "disparar", autos: ids }),
  }).catch((e) => console.error("alertas", e));
  // deno-lint-ignore no-explicit-any
  (globalThis as any).EdgeRuntime?.waitUntil?.(p);
}

const texto = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const CODIGO = /^[A-Za-z0-9_-]{1,30}$/;
const COMBUSTIBLES = new Set(["Nafta", "Diésel", "Híbrido", "Eléctrico", "GNC"]);
const TRANSMISIONES = new Set(["Manual", "Automática"]);
const CARROCERIAS = new Set(["suv", "sedan", "hatchback", "pickup", "deportivo", "utilitario"]);
const PROVINCIAS = new Set([
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
]);
const CAMPOS = "id, codigo, marca, modelo, version, anio, condicion, km, precio, moneda, combustible, transmision, carroceria, ciudad, provincia, motor, puertas, color, traccion, descripcion, fotos, estado, pausado_por_admin, created_at, updated_at";

/** Valida un auto que viene de la plantilla. Devuelve el auto limpio o el motivo del error. */
function validarAuto(x: A, anioMax: number): { ok: A } | { error: string } {
  const codigo = String(x.codigo ?? "").trim();
  if (!CODIGO.test(codigo)) return { error: "Código inválido (letras, números, - o _, hasta 30)." };
  const marca = texto(x.marca, 40), modelo = texto(x.modelo, 60), version = texto(x.version, 80);
  if (!marca || !modelo || !version) return { error: "Faltan marca, modelo o versión." };
  const anio = Number(x.anio);
  if (!Number.isInteger(anio) || anio < 1950 || anio > anioMax) return { error: "Año inválido." };
  const condicion = x.condicion === "0km" ? "0km" : x.condicion === "usado" ? "usado" : "";
  if (!condicion) return { error: "Condición inválida." };
  const km = Number(x.km);
  if (!Number.isInteger(km) || km < 0 || km > 2000000) return { error: "Km inválidos." };
  const precio = Number(x.precio);
  if (!Number.isFinite(precio) || precio <= 0 || precio >= 1e11) return { error: "Precio inválido." };
  const moneda = x.moneda === "USD" ? "USD" : x.moneda === "ARS" ? "ARS" : "";
  if (!moneda) return { error: "Moneda inválida." };
  const combustible = String(x.combustible ?? ""), transmision = String(x.transmision ?? ""), carroceria = String(x.carroceria ?? "");
  if (!COMBUSTIBLES.has(combustible)) return { error: "Combustible inválido." };
  if (!TRANSMISIONES.has(transmision)) return { error: "Transmisión inválida." };
  if (!CARROCERIAS.has(carroceria)) return { error: "Carrocería inválida." };
  const ciudad = texto(x.ciudad, 60), provincia = texto(x.provincia, 40);
  if (!ciudad) return { error: "Falta la ciudad." };
  if (!PROVINCIAS.has(provincia)) return { error: "Provincia inválida." };
  const puertas = x.puertas == null || x.puertas === "" ? null : Number(x.puertas);
  if (puertas !== null && (!Number.isInteger(puertas) || puertas < 2 || puertas > 5)) return { error: "Puertas inválidas." };
  return {
    ok: {
      codigo, marca, modelo, version, anio, condicion, km, precio: Math.round(precio), moneda, combustible, transmision, carroceria,
      ciudad, provincia, puertas,
      motor: texto(x.motor, 40) || null, color: texto(x.color, 30) || null, traccion: texto(x.traccion, 30) || null,
      descripcion: texto(x.descripcion, 1000) || null,
    },
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const H = cors(origin);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...H, "Content-Type": "application/json" } });
  const err = (m: string, s = 400) => json({ error: m }, s);

  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  if (req.method !== "POST") return err("Método no permitido", 405);
  if (origin && !ORIGENES.has(origin)) return err("Origen no permitido", 403);

  // Sesión: agencias aprobadas o particulares activos
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u } = await db.auth.getUser(token);
  if (!u?.user?.email?.endsWith("@" + DOMINIO)) return err("Tu sesión venció. Volvé a ingresar.", 401);
  const { data: cuenta } = await db.from("mkt_cuentas").select("id, tipo, estado").eq("user_id", u.user.id).maybeSingle();
  if (!cuenta) return err("Tu sesión venció. Volvé a ingresar.", 401);
  const esParticular = cuenta.tipo === "particular";
  if (esParticular ? cuenta.estado !== "activa" : cuenta.estado !== "aprobada") return err(esParticular ? "Tu cuenta no está activa." : "La carga de autos está disponible para agencias aprobadas.", 403);

  let b: A;
  try { b = await req.json(); } catch { return err("Datos inválidos"); }
  if (!b || typeof b !== "object") return err("Datos inválidos");

  try {
    // ---- Mis autos ----
    if (b.accion === "mios") {
      const { data, error } = await db.from("mkt_autos").select(CAMPOS).eq("cuenta_id", cuenta.id).order("created_at", { ascending: false });
      if (error) throw error;
      return json({ autos: data });
    }

    // ---- URLs firmadas para subir fotos (WebP ya comprimidas en el navegador) ----
    if (b.accion === "urls_fotos") {
      const n = Number(b.cantidad);
      if (!Number.isInteger(n) || n < 1 || n > (esParticular ? MAX_FOTOS : MAX_AUTOS * MAX_FOTOS)) return err("Cantidad de fotos inválida.");
      const ext = b.formato === "jpg" ? "jpg" : "webp";
      const urls = [];
      for (let i = 0; i < n; i++) {
        const path = `${cuenta.id}/${crypto.randomUUID()}.${ext}`;
        const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
        if (error) throw error;
        urls.push({ path, token: data.token });
      }
      return json({ urls });
    }

    // ---- Publicar (crea o actualiza por código) ----
    if (b.accion === "publicar") {
      const lista = Array.isArray(b.autos) ? b.autos as A[] : [];
      if (!lista.length) return err("No hay autos para publicar.");
      if (lista.length > MAX_AUTOS) return err(`Podés publicar hasta ${MAX_AUTOS} autos por carga.`);
      if (esParticular && lista.length !== 1) return err("Cargá un auto por vez.");
      const anioMax = new Date().getFullYear() + 1;
      const codigos = new Set<string>();
      const limpios: { auto: A; fotos: string[] }[] = [];
      for (const [i, x] of lista.entries()) {
        const v = validarAuto(x, anioMax);
        if ("error" in v) return err(esParticular ? v.error : `Fila ${i + 1}: ${v.error}`);
        if (esParticular) v.ok.condicion = "usado"; // los particulares publican usados
        const cod = String(v.ok.codigo).toUpperCase();
        if (codigos.has(cod)) return err(`El código ${v.ok.codigo} está repetido.`);
        codigos.add(cod);
        const fotos = Array.isArray(x.fotos) ? (x.fotos as unknown[]).map(String) : [];
        if (fotos.length > MAX_FOTOS) return err(`${v.ok.codigo}: máximo ${MAX_FOTOS} fotos.`);
        if (fotos.some((p) => !new RegExp(`^${cuenta.id}/[0-9a-f-]{36}\\.(webp|jpg)$`).test(p))) return err(`${v.ok.codigo}: fotos inválidas.`);
        limpios.push({ auto: v.ok, fotos });
      }

      // Las fotos tienen que existir en Storage y ser de esta cuenta
      const todas = limpios.flatMap((l) => l.fotos);
      if (todas.length) {
        const { data: objs, error } = await db.rpc("mkt_fotos_existentes", { p_names: todas });
        if (error) throw error;
        const existen = new Set(((objs ?? []) as unknown[]).map(String));
        const falta = limpios.find((l) => l.fotos.some((p) => !existen.has(p)));
        if (falta) return err(`${falta.auto.codigo}: alguna foto no terminó de subir. Probá de nuevo.`);
      }

      const { data: previos } = await db.from("mkt_autos").select("id, codigo, fotos").eq("cuenta_id", cuenta.id).in("codigo", [...new Set(limpios.map((l) => String(l.auto.codigo)))]);
      const prev = new Map((previos ?? []).map((p: A) => [String(p.codigo), p]));
      const sinFotos = limpios.find((l) => !l.fotos.length && !prev.has(String(l.auto.codigo)));
      if (sinFotos) return err(esParticular ? "Subí al menos una foto." : `${sinFotos.auto.codigo}: un auto nuevo necesita al menos una foto.`);
      if (esParticular && !prev.size) {
        const { count } = await db.from("mkt_autos").select("id", { count: "exact", head: true }).eq("cuenta_id", cuenta.id).neq("estado", "vendido");
        if ((count ?? 0) >= MAX_PARTICULAR) return err(`Podés tener hasta ${MAX_PARTICULAR} autos publicados. Marcá uno como vendido o borralo para cargar otro.`);
      }

      const viejas: string[] = [];
      const idsNuevos: string[] = [];
      let nuevos = 0, actualizados = 0;
      for (const { auto, fotos } of limpios) {
        const p = prev.get(String(auto.codigo)) as A | undefined;
        if (p) {
          const cambios: A = { ...auto, updated_at: new Date().toISOString() };
          if (esParticular) cambios.estado = "revision"; // cada cambio de un particular se vuelve a revisar
          if (fotos.length) {
            cambios.fotos = fotos;
            viejas.push(...((p.fotos as string[]) ?? []).filter((f) => !fotos.includes(f)));
          }
          const { error } = await db.from("mkt_autos").update(cambios).eq("id", p.id);
          if (error) throw error;
          actualizados++;
        } else {
          const { data: ins, error } = await db.from("mkt_autos").insert({ ...auto, fotos, cuenta_id: cuenta.id, ...(esParticular ? { estado: "revision", condicion: "usado" } : {}) }).select("id").single();
          if (error) throw error;
          if (!esParticular && ins?.id) idsNuevos.push(String(ins.id));
          nuevos++;
        }
      }
      if (viejas.length) await db.storage.from(BUCKET).remove(viejas);
      avisarAlertas(idsNuevos); // los de particulares se avisan cuando el admin los aprueba
      return json({ ok: true, nuevos, actualizados, revision: esParticular });
    }

    // ---- Pausar / volver a publicar un auto propio ----
    if (b.accion === "estado") {
      const estado = ["pausado", "publicado", "vendido"].includes(String(b.estado)) ? String(b.estado) : "";
      if (!estado || typeof b.id !== "string") return err("Datos inválidos");
      const { data: a } = await db.from("mkt_autos").select("id, estado, pausado_por_admin").eq("id", b.id).eq("cuenta_id", cuenta.id).maybeSingle();
      if (!a) return err("No encontramos ese auto.", 404);
      if (a.estado === "revision" && estado !== "vendido") return err("Lo estamos revisando. Te avisamos cuando esté publicado.", 403);
      if (a.estado === "vendido") return err("Ese auto ya está marcado como vendido.", 403);
      if (estado === "publicado" && a.pausado_por_admin) return err("Este auto lo pausó Red de Autos. Escribinos para revisarlo.", 403);
      const { error } = await db.from("mkt_autos").update({ estado, vendido_at: estado === "vendido" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", a.id);
      if (error) throw error;
      return json({ ok: true });
    }

    // ---- Estadísticas: vistas de ficha y contactos por auto (últimos 30 días y total) + vistas por día ----
    if (b.accion === "estadisticas") {
      const [{ data: porAuto, error: e1 }, { data: dias, error: e2 }] = await Promise.all([
        db.rpc("mkt_estadisticas_cuenta", { p_cuenta: cuenta.id }),
        db.rpc("mkt_estadisticas_dias", { p_cuenta: cuenta.id }),
      ]);
      if (e1 || e2) throw e1 || e2;
      return json({ autos: porAuto ?? [], dias: dias ?? [] });
    }

    // ---- Borrar un auto propio (con sus fotos) ----
    if (b.accion === "borrar") {
      if (typeof b.id !== "string") return err("Datos inválidos");
      const { data: a } = await db.from("mkt_autos").select("id, fotos").eq("id", b.id).eq("cuenta_id", cuenta.id).maybeSingle();
      if (!a) return err("No encontramos ese auto.", 404);
      const { error } = await db.from("mkt_autos").delete().eq("id", a.id);
      if (error) throw error;
      if ((a.fotos as string[])?.length) await db.storage.from(BUCKET).remove(a.fotos as string[]);
      return json({ ok: true });
    }

    // ---- Feria: la vigente o próxima, con los autos que esta agencia sumó ----
    if (String(b.accion).startsWith("feria")) {
      if (esParticular) return err("La feria es para agencias.", 403);
      const { data: feria } = await db.from("mkt_ferias").select("id, nombre, descripcion, empieza, termina")
        .eq("estado", "activa").gt("termina", new Date().toISOString()).order("empieza").limit(1).maybeSingle();

      if (b.accion === "feria") {
        if (!feria) return json({ feria: null, ofertas: [] });
        const { data: mios } = await db.from("mkt_autos").select("id").eq("cuenta_id", cuenta.id);
        const ids = (mios ?? []).map((a: A) => a.id as string);
        const { data: ofertas, error } = ids.length
          ? await db.from("mkt_feria_autos").select("auto_id, precio_feria, empieza, termina").eq("feria_id", feria.id).in("auto_id", ids)
          : { data: [], error: null };
        if (error) throw error;
        return json({ feria, ofertas });
      }

      if (!feria) return err("No hay ninguna feria programada.", 404);
      if (typeof b.id !== "string") return err("Datos inválidos");
      const { data: a } = await db.from("mkt_autos").select("id, precio, estado").eq("id", b.id).eq("cuenta_id", cuenta.id).maybeSingle();
      if (!a) return err("No encontramos ese auto.", 404);

      if (b.accion === "feria_quitar") {
        const { error } = await db.from("mkt_feria_autos").delete().eq("feria_id", feria.id).eq("auto_id", a.id);
        if (error) throw error;
        return json({ ok: true });
      }

      if (b.accion === "feria_sumar") {
        if (a.estado !== "publicado") return err("Solo pueden entrar autos publicados.");
        const precio = Math.round(Number(b.precio));
        if (!Number.isFinite(precio) || precio <= 0) return err("Poné el precio de feria.");
        if (precio >= Number(a.precio)) return err("El precio de feria tiene que ser más bajo que el precio actual.");
        const fIni = new Date(feria.empieza).getTime(), fFin = new Date(feria.termina).getTime();
        const ahora = Date.now();
        let ini = b.empieza ? new Date(String(b.empieza)).getTime() : Math.max(fIni, ahora);
        if (!Number.isFinite(ini)) return err("La fecha de inicio no es válida.");
        if (ini < fIni) return err("La oferta no puede empezar antes que la feria.");
        if (ini >= fFin) return err("La oferta tiene que empezar antes de que termine la feria.");
        ini = Math.max(ini, Math.min(ahora, fFin - 60_000));
        const horas = Number(b.horas);
        if (!Number.isInteger(horas) || horas < 0 || horas > 720) return err("Duración inválida.");
        const fin = horas === 0 ? fFin : Math.min(ini + horas * 3_600_000, fFin);
        const { error } = await db.from("mkt_feria_autos").upsert({
          feria_id: feria.id, auto_id: a.id, precio_feria: precio,
          empieza: new Date(ini).toISOString(), termina: new Date(fin).toISOString(),
        }, { onConflict: "feria_id,auto_id" });
        if (error) throw error;
        return json({ ok: true });
      }
    }

    return err("Acción desconocida");
  } catch (e) {
    console.error("mkt-autos", b?.accion, e);
    return err("Algo salió mal. Probá de nuevo en un rato.", 500);
  }
});
