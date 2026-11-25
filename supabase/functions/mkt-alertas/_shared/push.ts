// @ts-nocheck  (tipos de Uint8Array/BufferSource demasiado estrictos en Deno 2)
// RDA Marketplace · Notificaciones del navegador (Web Push, RFC 8291/8292) sin librerías:
// VAPID (ES256) + cifrado aes128gcm con WebCrypto. Las claves del marketplace se crean solas
// la primera vez y quedan en privado.config ("mkt_vapid").
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", { auth: { persistSession: false } });

const enc = new TextEncoder();
const b64u = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const deB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const concat = (...a: Uint8Array[]) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };

type Vapid = { pub: string; jwk: JsonWebKey };
let _vapid: Vapid | null = null;

export async function vapid(): Promise<Vapid> {
  if (_vapid) return _vapid;
  const { data } = await db.rpc("config_privada", { p_clave: "mkt_vapid" });
  if (data) return (_vapid = JSON.parse(data as string));
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const pub = b64u(new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey)));
  const jwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  const { data: guardado, error } = await db.rpc("config_init", { p_clave: "mkt_vapid", p_valor: JSON.stringify({ pub, jwk }) });
  if (error) throw error;
  return (_vapid = JSON.parse(guardado as string));
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, bytes: number) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, bytes * 8));
}

async function jwtVapid(endpoint: string, v: Vapid) {
  const aud = new URL(endpoint).origin;
  const h = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const p = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:reddeautostuc@gmail.com" })));
  const key = await crypto.subtle.importKey("jwk", v.jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(`${h}.${p}`)));
  return `${h}.${p}.${b64u(sig)}`;
}

async function cifrar(texto: string, p256dh: string, auth: string) {
  const uaPub = deB64u(p256dh), secreto = deB64u(auth);
  const as = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]) as CryptoKeyPair;
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, as.privateKey, 256));
  const ikm = await hkdf(secreto, ecdh, concat(enc.encode("WebPush: info\0"), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);
  const k = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, k, concat(enc.encode(texto), new Uint8Array([2]))));
  return concat(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPub.length]), asPub, cifrado);
}

/** Manda la notificación a todos los navegadores de una cuenta. Borra suscripciones vencidas. Devuelve cuántas salieron. */
export async function pushCuenta(cuentaId: string, msg: { title: string; body: string; url?: string; tag?: string; image?: string }) {
  const { data: subs } = await db.from("mkt_push").select("id, endpoint, p256dh, auth").eq("cuenta_id", cuentaId);
  if (!subs?.length) return 0;
  const v = await vapid();
  let n = 0;
  for (const s of subs) {
    try {
      const r = await fetch(s.endpoint, {
        method: "POST",
        headers: {
          Authorization: `vapid t=${await jwtVapid(s.endpoint, v)}, k=${v.pub}`,
          "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", TTL: "86400", Urgency: "normal",
        },
        body: await cifrar(JSON.stringify(msg), s.p256dh, s.auth),
      });
      if (r.status === 404 || r.status === 410) await db.from("mkt_push").delete().eq("id", s.id);
      else if (r.ok) n++;
      else console.warn("push", r.status, (await r.text()).slice(0, 200));
    } catch (e) { console.error("push", e); }
  }
  return n;
}
