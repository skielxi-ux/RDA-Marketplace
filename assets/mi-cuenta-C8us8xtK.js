import{a as e,n as t,t as n}from"./dom-B-F6zoS9.js";import{a as r,c as i,i as a,n as o,s,t as c}from"./auth-B5SgAdIA.js";import{i as l,n as u,t as d}from"./icons-xIOwbhHI.js";import{t as f}from"./ranking-DNYBLHsz.js";import{i as p,n as m,o as h,s as g,t as _}from"./autosApi-COnJuSpW.js";import{o as v}from"./catalog-C6oEt7qm.js";import{i as y,t as b}from"./modelos-BZRcky_i.js";import{t as x}from"./carga-9OZX3V5K.js";import{n as S,r as C,t as w}from"./fotos-DjFBPNXs.js";import{n as T,r as E,t as D}from"./oferta-o_gfkh8Z.js";import{a as O,i as k,r as A,t as j}from"./alertaListado-CKzcbfbo.js";var M=e=>/^\d{11}$/.test(e??``)?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:e??``,N=e=>String(e??``).replace(/^549(\d+)$/,`$1`),P=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${u(t)}</label>
    ${n}
    ${r?`<p class="mt-1.5 text-[13px] text-ink/60">${r}</p>`:``}
  </div>`,F=(e,t,n,r=``)=>`<input id="${e}" name="${t}" value="${u(n??``)}" class="auth-input" ${r} />`,I=(e,t,n)=>`
  <div class="relative">
    <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
    ${d(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
  </div>`,L=(e,t,n=``)=>(n?`<option value="">${u(n)}</option>`:``)+e.map(e=>`<option value="${u(e)}"${e===t?` selected`:``}>${u(e)}</option>`).join(``),R={nombre:`Nombre comercial`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},z=(e,t)=>t==null||t===``?`—`:e===`cuit`?M(t):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),B=e=>{let t=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>R[e]):[];return t.length?`
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${d(`clipboard-check`,`h-4 w-4`)} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${t.map(([t,n])=>`<li>${u(R[t])}: <b>${u(z(t,n))}</b> <span class="opacity-75">(hoy: ${u(z(t,e[t]))})</span></li>`).join(``)}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`:``},V=e=>{let t=C(e.logo??``);return t?`<img src="${u(t)}" alt="Logo de ${u(e.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`:`<span class="grid h-full w-full place-items-center text-ink/35">${d(`store`,`h-10 w-10`)}</span>`};function ee(e){let t=e.cambios_pendientes??{},n=n=>Object.hasOwn(t,n)?t[n]:e[n],r=n(`agencia_tipo`)===`oficial`?`oficial`:`multimarca`;return`
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${V(e)}</div>
        <p class="mt-3 text-[13px] text-ink/60">JPG, PNG o WebP. Lo recortás en cuadrado antes de guardarlo.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label class="btn-primary h-[48px] cursor-pointer justify-center">${d(`images`,`h-4 w-4`)} <span data-logo-label>${e.logo?`Cambiar logo`:`Subir logo`}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-logo-input /></label>
          <button type="button" class="btn-outline h-[44px] justify-center" data-logo-quitar ${e.logo?``:`hidden`}>${d(`x`,`h-4 w-4`)} Quitar logo</button>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <form class="space-y-8" data-perfil-form novalidate>
      <div data-perfil-pendientes>${B(e)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${d(`shield-check`,`mt-0.5 h-4 w-4 shrink-0 text-brand`)} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${P(`pf-nombre`,`Nombre comercial`,F(`pf-nombre`,`nombre`,n(`nombre`),`maxlength="80" required autocomplete="organization"`))}
          ${P(`pf-cuit`,`CUIT`,F(`pf-cuit`,`cuit`,M(n(`cuit`)),`inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"`))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${r===`multimarca`?`checked`:``} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${r===`oficial`?`checked`:``} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${r===`oficial`?``:`hidden`}>
            ${P(`pf-marca`,`Marca que representa`,I(`pf-marca`,`marca_oficial`,L(y,n(`marca_oficial`),`Elegí la marca`)))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${P(`pf-ciudad`,`Ciudad`,F(`pf-ciudad`,`ciudad`,e.ciudad,`maxlength="60" required autocomplete="address-level2"`))}
          ${P(`pf-provincia`,`Provincia`,I(`pf-provincia`,`provincia`,L(x,e.provincia,`Elegí la provincia`)))}
          ${P(`pf-direccion`,`Dirección del local`,F(`pf-direccion`,`direccion`,e.direccion,`maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"`))}
          ${P(`pf-horario`,`Horario de atención`,F(`pf-horario`,`horario`,e.horario,`maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${P(`pf-wsp`,`WhatsApp para consultas`,F(`pf-wsp`,`whatsapp_ventas`,N(e.whatsapp_ventas),`type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"`),`Si lo dejás vacío, las consultas llegan al celular con el que ingresás.`)}
          ${P(`pf-email`,`Email`,F(`pf-email`,`email`,e.email,`type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${P(`pf-desc`,`Descripción`,`<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${u(e.descripcion??``)}</textarea>`,`<span data-desc-count>0</span>/600`)}
          </div>
          ${P(`pf-web`,`Sitio web`,F(`pf-web`,`sitio_web`,e.sitio_web,`type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"`))}
          ${P(`pf-ig`,`Instagram`,F(`pf-ig`,`instagram`,e.instagram?`@${e.instagram}`:``,`maxlength="60" placeholder="@tuagencia"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Vendedores independientes</legend>
        <p class="text-[14px] leading-[1.6] text-ink/70">Son personas que te acercan un cliente para uno de tus autos y cobran una comisión si se concreta la venta. Si aceptás, tu agencia aparece con la etiqueta <b>"Acepta vendedores independientes"</b> en el listado de agencias. La comisión solo la ven ellos.</p>
        <div class="mt-4 grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend class="vd-label">¿Aceptás trabajar con vendedores independientes?</legend>
            <div class="flex gap-2">
              <label class="filter-pill"><input type="radio" name="acepta_independientes" value="si" class="sr-only"${e.acepta_independientes?` checked`:``} /><span>Sí</span></label>
              <label class="filter-pill"><input type="radio" name="acepta_independientes" value="no" class="sr-only"${e.acepta_independientes?``:` checked`} /><span>No</span></label>
            </div>
          </fieldset>
          <div data-pf-comision${e.acepta_independientes?``:` hidden`}>
            ${P(`pf-comision`,`Comisión que pagás`,`<select id="pf-comision" name="comision_independientes" class="auth-input">${[1,2,3,4].map(t=>`<option value="${t}"${Number(e.comision_independientes??2)===t?` selected`:``}>${t} %</option>`).join(``)}</select>`,`Sobre el precio final de venta del auto.`)}
          </div>
        </div>
      </fieldset>

      <p class="auth-error" role="alert" data-perfil-error hidden></p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-perfil-guardar>${d(`check`,`h-4 w-4`)} <span>Guardar cambios</span></button>
        <a href="#" class="link-view justify-center" data-perfil-ver target="_blank" rel="noopener">Ver mi página ${d(`arrow-up-right`,`h-4 w-4`)}</a>
        <p class="text-[14px] text-ok sm:ml-auto" role="status" data-perfil-ok></p>
      </div>
    </form>
  </div>

  <!-- Recorte del logo -->
  <div class="pub-overlay" data-crop hidden role="dialog" aria-modal="true" aria-labelledby="crop-title">
    <div class="w-full max-w-[420px] rounded-[24px] bg-white p-6">
      <p id="crop-title" class="text-[20px] font-bold">Acomodá tu logo</p>
      <p class="mt-1 text-[14px] text-ink/70">Arrastrá para mover y usá la barra para acercar o alejar.</p>
      <div class="crop-stage mx-auto mt-5" data-crop-stage><canvas width="600" height="600" data-crop-canvas aria-label="Vista previa del logo"></canvas></div>
      <label class="mt-5 flex items-center gap-3 text-[14px]">
        <span class="sr-only">Acercar o alejar</span>${d(`search`,`h-4 w-4 text-ink/50`)}
        <input type="range" min="1" max="4" step="0.01" value="1" class="w-full accent-[#405FF2]" data-crop-zoom />
      </label>
      <div class="mt-6 flex gap-3">
        <button type="button" class="btn-outline h-[48px] flex-1 justify-center" data-crop-cancel>Cancelar</button>
        <button type="button" class="btn-primary h-[48px] flex-1 justify-center" data-crop-ok>${d(`check`,`h-4 w-4`)} Guardar logo</button>
      </div>
    </div>
  </div>`}var te=400,H=600;async function ne(e){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${d(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tu perfil…</p>`;let i;try{({perfil:i}=await h(`ver`))}catch(t){e.innerHTML=`<p class="auth-error">${u(t.message)}</p>`;return}e.innerHTML=ee(i);let a=n(`[data-perfil-form]`,e),o=n(`[data-perfil-error]`,e),s=n(`[data-perfil-ok]`,e),c=e=>{o.textContent=e||``,o.hidden=!e};n(`[data-perfil-ver]`,e).href=`./agencia.html?id=${encodeURIComponent(i.id)}`;let l=n(`[data-pf-marca]`,e);a.addEventListener(`change`,e=>{e.target.name===`agencia_tipo`&&(l.hidden=e.target.value!==`oficial`)});let f=n(`#pf-desc`,e),p=n(`[data-desc-count]`,e),m=()=>{p.textContent=String(f.value.length)};f.addEventListener(`input`,m),m(),a.addEventListener(`change`,t=>{t.target.name===`acepta_independientes`&&(n(`[data-pf-comision]`,e).hidden=t.target.value!==`si`)}),a.addEventListener(`submit`,async t=>{t.preventDefault(),c(``),s.textContent=``;let r=new FormData(a),o=Object.fromEntries([`nombre`,`cuit`,`agencia_tipo`,`marca_oficial`,`ciudad`,`provincia`,`direccion`,`horario`,`whatsapp_ventas`,`email`,`descripcion`,`sitio_web`,`instagram`,`acepta_independientes`,`comision_independientes`].map(e=>[e,r.get(e)??``]));if(o.agencia_tipo===`oficial`&&!o.marca_oficial)return c(`Elegí la marca que representa el concesionario.`);if(!o.provincia)return c(`Elegí la provincia.`);let l=n(`[data-perfil-guardar]`,e);l.disabled=!0;try{let t=await h(`guardar`,o);i=t.perfil,n(`[data-perfil-pendientes]`,e).innerHTML=B(i),s.textContent=t.pendiente?`Guardado. El nombre, CUIT o tipo quedan en revisión.`:`Listo, tus datos están actualizados.`,i.instagram&&(n(`#pf-ig`,e).value=`@${i.instagram}`),i.sitio_web&&(n(`#pf-web`,e).value=i.sitio_web)}catch(e){c(e.message)}finally{l.disabled=!1}});let g=n(`[data-crop]`,e),_=n(`[data-crop-canvas]`,e),v=_.getContext(`2d`),y=n(`[data-crop-zoom]`,e),b=null,x=1,C=0,w=0,T=()=>x*Number(y.value),E=(e=v,t=H,n=!0)=>{let r=t/H;e.clearRect(0,0,t,t),n&&(e.fillStyle=`#fff`,e.fillRect(0,0,t,t));let i=T()*r;e.drawImage(b,C*r+(t-b.width*i)/2,w*r+(t-b.height*i)/2,b.width*i,b.height*i)},D=()=>{g.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),b?.close?.(),b=null};n(`[data-logo-input]`,e).addEventListener(`change`,async t=>{let r=t.target.files[0];if(t.target.value=``,r){if(c(``),!/^image\/(jpeg|png|webp)$/.test(r.type))return c(`El logo tiene que ser JPG, PNG o WebP.`);if(r.size>10485760)return c(`El logo pesa demasiado (máximo 10 MB).`);try{b=await createImageBitmap(r)}catch{return c(`No pudimos abrir esa imagen. Probá con otra.`)}x=Math.min(H/b.width,H/b.height),y.value=`1`,C=0,w=0,E(),g.hidden=!1,document.documentElement.classList.add(`overflow-hidden`),n(`[data-crop-ok]`,e).focus()}}),y.addEventListener(`input`,()=>b&&E());let O=null;_.addEventListener(`pointerdown`,e=>{if(!b)return;_.setPointerCapture(e.pointerId);let t=_.getBoundingClientRect();O={px:e.clientX,py:e.clientY,x:C,y:w,k:H/t.width}}),_.addEventListener(`pointermove`,e=>{if(!O)return;let t=H*.75;C=Math.max(-450,Math.min(t,O.x+(e.clientX-O.px)*O.k)),w=Math.max(-450,Math.min(t,O.y+(e.clientY-O.py)*O.k)),E()}),[`pointerup`,`pointercancel`].forEach(e=>_.addEventListener(e,()=>{O=null})),_.tabIndex=0,_.addEventListener(`keydown`,e=>{if(!b)return;let t={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];t&&(e.preventDefault(),C+=t[0],w+=t[1],E()),(e.key===`+`||e.key===`-`)&&(y.value=String(Math.min(4,Math.max(1,Number(y.value)+(e.key===`+`?.1:-.1)))),E())}),n(`[data-crop-cancel]`,e).addEventListener(`click`,D),g.addEventListener(`keydown`,e=>{e.key===`Escape`&&D()}),n(`[data-crop-ok]`,e).addEventListener(`click`,async t=>{let a=t.currentTarget;a.disabled=!0;try{let t=await S(),a=document.createElement(`canvas`);a.width=a.height=te,E(a.getContext(`2d`),te,t===`jpg`);let o=await new Promise(e=>a.toBlob(e,t===`jpg`?`image/jpeg`:`image/webp`,.9));if(!o)throw Error(`No pudimos procesar el logo.`);let{path:c,token:l}=await h(`url_logo`,{formato:t}),{error:u}=await(await r()).storage.from(`mkt-fotos`).uploadToSignedUrl(c,l,o,{contentType:o.type});if(u)throw Error(`Se cortó la subida del logo. Probá de nuevo.`);let d=await h(`guardar_logo`,{path:c});i.logo=d.logo,n(`[data-logo-preview]`,e).innerHTML=V(i),n(`[data-logo-label]`,e).textContent=`Cambiar logo`,n(`[data-logo-quitar]`,e).hidden=!1,D(),s.textContent=`Logo guardado.`}catch(e){D(),c(e.message)}finally{a.disabled=!1}}),n(`[data-logo-quitar]`,e).addEventListener(`click`,async t=>{let r=t.currentTarget;r.disabled=!0;try{await h(`quitar_logo`),i.logo=null,n(`[data-logo-preview]`,e).innerHTML=V(i),n(`[data-logo-label]`,e).textContent=`Subir logo`,r.hidden=!0}catch(e){c(e.message)}finally{r.disabled=!1}}),t(`input, select, textarea`,a).forEach(e=>e.addEventListener(`input`,()=>{s.textContent=``}))}var re=new Date().getFullYear()+1,U=Array.from({length:re-1989},(e,t)=>re-t),ie=e=>Math.round(Number(e)).toLocaleString(`es-AR`),ae=e=>String(e).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),W=(e,t,n,r)=>`
  <div>
    <label for="${e}" class="auth-label">${u(r)}</label>
    <div class="relative">
      <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
      ${d(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
    </div>
  </div>`,G=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${u(n)}</label>
    <input id="${e}" name="${t}" class="auth-input" ${r} />
  </div>`,K=(e,t)=>`<option value="">${u(t)}</option>`+e.map(e=>`<option value="${u(e)}">${u(e)}</option>`).join(``),oe=e=>b[e]??[];function q(){return`
  <div class="space-y-8">
    <div data-tg-box></div>

    <!-- Nuevo pedido -->
    <details class="colega-form group rounded-[20px] border border-line bg-white" data-colega-details>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <span class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">${d(`plus`,`h-5 w-5`)}</span>
          <span><span class="block text-[18px] font-bold">Pedir un auto a los colegas</span>
          <span class="block text-[14px] text-ink/70">¿Un cliente busca algo que no tenés? Avisale a todas las agencias de la red.</span></span>
        </span>
        ${d(`chevron-down`,`h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180`)}
      </summary>
      <form class="grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" data-colega-form novalidate>
        ${W(`cg-marca`,`marca`,K(y,`Elegí la marca`),`Marca *`)}
        <div>
          <label for="cg-modelo" class="auth-label">Modelo *</label>
          <input id="cg-modelo" name="modelo" list="cg-modelos" maxlength="60" required class="auth-input" placeholder="Ej.: Corolla" autocomplete="off" />
          <datalist id="cg-modelos"></datalist>
        </div>
        ${G(`cg-version`,`version`,`Versión`,`maxlength="80" placeholder="Ej.: XEi CVT (opcional)"`)}
        ${W(`cg-desde`,`anio_desde`,K(U,`Indistinto`),`Año desde`)}
        ${W(`cg-hasta`,`anio_hasta`,K(U,`Indistinto`),`Año hasta`)}
        ${G(`cg-km`,`km_max`,`Kilometraje máximo`,`inputmode="numeric" maxlength="9" placeholder="Ej.: 80.000"`)}
        ${G(`cg-color`,`color`,`Color`,`maxlength="30" placeholder="Indistinto"`)}
        ${W(`cg-caja`,`transmision`,K([`Manual`,`Automática`],`Indistinto`),`Caja`)}
        ${W(`cg-comb`,`combustible`,K([`Nafta`,`Diésel`,`Híbrido`,`Eléctrico`,`GNC`],`Indistinto`),`Combustible`)}
        <div>
          <label for="cg-presu" class="auth-label">Presupuesto del cliente</label>
          <div class="flex gap-2">
            <div class="relative w-[96px] shrink-0">
              <select name="moneda" aria-label="Moneda" class="auth-input appearance-none pr-8"><option value="ARS">$</option><option value="USD">USD</option></select>
              ${d(`chevron-down`,`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2`)}
            </div>
            <input id="cg-presu" name="presupuesto" inputmode="numeric" maxlength="15" class="auth-input" placeholder="Opcional" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="cg-com" class="auth-label">Comentario</label>
          <input id="cg-com" name="comentario" maxlength="400" class="auth-input" placeholder="Ej.: lo necesito para esta semana, toma usado" />
        </div>
        <p class="auth-error sm:col-span-2 lg:col-span-3" role="alert" data-colega-error hidden></p>
        <div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-3">
          <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-colega-enviar>${d(`handshake`,`h-4 w-4`)} <span>Enviar a los colegas</span></button>
          <p class="text-[14px] text-ink/60">Le llega a todas las agencias de la red en la campanita y por Telegram. Queda activo hasta que lo cierres.</p>
        </div>
      </form>
    </details>

    <!-- Pedidos -->
    <div>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="tabs-brand flex gap-6 border-b border-line" role="tablist" aria-label="Pedidos">
          <button type="button" role="tab" aria-selected="true" class="tab-btn is-active" data-cg-tab="todos">Pedidos de colegas</button>
          <button type="button" role="tab" aria-selected="false" class="tab-btn" data-cg-tab="mios">Mis pedidos</button>
        </div>
        <label class="relative block md:w-[340px]"><span class="sr-only">Buscar en los pedidos</span>
          <input type="search" data-cg-q placeholder="Buscar marca, modelo o agencia" class="auth-input !pl-10" />
          ${d(`search`,`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50`)}
        </label>
      </div>
      <p class="mt-4 text-[14px] text-ink/60" data-cg-count aria-live="polite"></p>
      <ul class="mt-4 grid gap-4 lg:grid-cols-2" data-cg-list></ul>
    </div>
  </div>`}function J(e){return e?.vinculado?`<p class="flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[14px] text-ok">${d(`circle-check`,`h-4 w-4`)} Los pedidos te llegan también por Telegram${e.como?` (${u(e.como)})`:``}.</p>`:`
    <div class="flex flex-col gap-4 rounded-2xl bg-[#EEF1FB] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[15px]"><b>Recibí los pedidos en Telegram.</b> <span class="text-ink/70">Conectá tu cuenta una sola vez con el bot de Red de Autos.</span></p>
      <button type="button" class="btn-primary h-[46px] shrink-0 justify-center" data-tg-conectar>${d(`telegram`,`h-4 w-4`)} Conectar Telegram</button>
    </div>`}var se=e=>{let t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/6e4));if(t<1)return`recién`;if(t<60)return`hace ${t} min`;let n=Math.round(t/60);if(n<24)return`hace ${n} h`;let r=Math.round(n/24);return r===1?`ayer`:`hace ${r} días`};function ce(e){let t=e.anio_desde&&e.anio_hasta?e.anio_desde===e.anio_hasta?`${e.anio_desde}`:`${e.anio_desde} a ${e.anio_hasta}`:e.anio_desde?`Desde ${e.anio_desde}`:e.anio_hasta?`Hasta ${e.anio_hasta}`:``,n=[t&&[d(`calendar`,`h-3.5 w-3.5`),t],e.km_max!=null&&[d(`gauge`,`h-3.5 w-3.5`),`Hasta ${ie(e.km_max)} km`],e.transmision&&[d(`cog`,`h-3.5 w-3.5`),e.transmision],e.combustible&&[d(`fuel`,`h-3.5 w-3.5`),e.combustible],e.color&&[d(`palette`,`h-3.5 w-3.5`),e.color]].filter(Boolean),r=e.agencia,i=C(r.logo??``),a=/^\d{10,15}$/.test(r.whatsapp??``)?r.whatsapp:``,o=[e.marca,e.modelo,e.version].filter(Boolean).join(` `),s=`Hola ${r.nombre}, vi en la Red de colegas de Red de Autos que buscás ${o}${t?` (${t})`:``}. Tengo uno que te puede servir.`,c=e.estado===`cerrado`;return`
  <li class="colega-card ${c?`opacity-60`:``}" data-pedido="${u(e.id)}">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium uppercase tracking-wide text-brand">${e.mio?`Tu pedido`:`Busca`} · <span class="normal-case tracking-normal text-ink/55">${u(se(e.created_at))}</span></p>
      ${c?`<span class="rounded-full bg-ink/10 px-2.5 py-0.5 text-[12px] font-medium">Cerrado</span>`:``}
    </div>
    <h3 class="mt-1 text-[20px] font-bold leading-tight">${u(o)}</h3>
    ${n.length?`<ul class="mt-3 flex flex-wrap gap-2">${n.map(([e,t])=>`<li class="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px]">${e}${u(t)}</li>`).join(``)}</ul>`:``}
    ${e.presupuesto?`<p class="mt-3 text-[15px]">Presupuesto: <b>${u(e.moneda===`USD`?`USD`:`$`)} ${u(ie(e.presupuesto))}</b></p>`:``}
    ${e.comentario?`<p class="mt-2 text-[15px] text-ink/75">“${u(e.comentario)}”</p>`:``}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4">
      <a href="./agencia.html?id=${u(encodeURIComponent(r.id))}" class="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition-colors hover:text-brand">
        ${i?`<img src="${u(i)}" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[13px] font-bold text-white" aria-hidden="true">${u(ae(r.nombre))}</span>`}
        <span class="min-w-0"><span class="block truncate font-bold">${u(r.nombre)}</span><span class="block truncate text-[13px] text-ink/60">${u([r.ciudad,r.provincia].filter(Boolean).join(`, `))}</span></span>
      </a>
      ${e.mio?c?`<p class="text-[13px] text-ink/60">Avisado a ${u(e.avisadas)} ${e.avisadas===1?`agencia`:`agencias`}</p>`:`<div class="flex shrink-0 items-center gap-3"><span class="whitespace-nowrap text-[13px] text-ink/60">Avisado a ${u(e.avisadas)}</span><button type="button" class="btn-outline h-[42px] whitespace-nowrap !px-4 text-[14px]" data-cg-cerrar="${u(e.id)}">${d(`check`,`h-4 w-4`)} Ya lo conseguí</button></div>`:a&&!c?`<div class="flex shrink-0 gap-2">
            <a href="https://wa.me/${u(a)}?text=${u(encodeURIComponent(s))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[44px] whitespace-nowrap !px-4 text-[14px]" data-cg-lotengo="${u(e.id)}">${d(`whatsapp`,`h-4 w-4`)} ${e.respondi?`Escribile`:`Lo tengo`}</a>
            <a href="tel:+${u(a)}" class="btn-outline h-[44px] !px-3.5" aria-label="Llamar a ${u(r.nombre)}">${d(`phone`,`h-4 w-4`)}</a>
          </div>`:``}
    </div>
    ${e.mio&&e.lo_tienen?.length?`
    <div class="mt-4 rounded-xl bg-[#E8F5E9] p-4">
      <p class="text-[14px] font-bold text-ok">${d(`circle-check`,`mr-1 inline h-4 w-4`)} ${e.lo_tienen.length===1?`Una agencia lo tiene`:`${u(e.lo_tienen.length)} agencias lo tienen`}</p>
      <ul class="mt-2 space-y-2">${e.lo_tienen.map(e=>{let t=/^\d{10,15}$/.test(e.whatsapp??``)?e.whatsapp:``;return`<li class="flex flex-wrap items-center justify-between gap-2 text-[14px]"><span><b>${u(e.nombre)}</b>${e.ciudad?` · ${u(e.ciudad)}`:``}</span>${t?`<a href="https://wa.me/${u(t)}?text=${u(encodeURIComponent(`Hola ${e.nombre}, vi que tenés un ${o} para mi pedido en la Red de colegas.`))}" target="_blank" rel="noopener noreferrer" class="link-view">${d(`message-circle`,`h-4 w-4`)} WhatsApp</a>`:``}</li>`}).join(``)}</ul>
    </div>`:``}
    ${!e.mio&&e.respondi?`<p class="mt-3 text-[13px] text-ok">${d(`circle-check`,`mr-1 inline h-3.5 w-3.5`)} Ya le avisaste que lo tenés.</p>`:``}
  </li>`}var le=e=>String(e??``).normalize(`NFD`).replace(/[̀-ͯ]/g,``).toLowerCase();async function ue(e){e.innerHTML=q();let r=n(`[data-colega-form]`,e),i=n(`[data-colega-error]`,e),o=n(`[data-cg-list]`,e),s=n(`[data-cg-count]`,e),c=n(`[data-cg-q]`,e),l=e=>{i.textContent=e||``,i.hidden=!e},d=[],f=`todos`,m=n(`[data-tg-box]`,e),h=async()=>{try{m.innerHTML=J(await p(`telegram_estado`))}catch{m.innerHTML=``}};m.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await p(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),m.insertAdjacentHTML(`beforeend`,`<p class="mt-2 text-[14px] text-ink/70">Se abrió Telegram: tocá <b>Iniciar</b> en el bot y volvé acá.</p>`),window.addEventListener(`focus`,h,{once:!0})}catch(e){m.insertAdjacentHTML(`beforeend`,`<p class="auth-error mt-2">${u(e.message)}</p>`)}finally{t.disabled=!1}}});let g=()=>{let e=le(c.value.trim()),t=d.filter(e=>f===`mios`?e.mio:!e.mio&&e.estado===`activo`).filter(t=>!e||le(`${t.marca} ${t.modelo} ${t.version??``} ${t.agencia.nombre} ${t.agencia.ciudad}`).includes(e));o.innerHTML=t.map(ce).join(``)||`<li class="rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60 lg:col-span-2">${e?`No hay pedidos con esa búsqueda.`:f===`mios`?`Todavía no pediste ningún auto a los colegas.`:`No hay pedidos de colegas por ahora.`}</li>`,s.textContent=`${t.length} ${t.length===1?`pedido`:`pedidos`}`},_=async()=>{try{({pedidos:d}=await p(`listar`)),g()}catch(e){o.innerHTML=`<li class="auth-error lg:col-span-2">${u(e.message)}</li>`}};t(`[data-cg-tab]`,e).forEach(n=>n.addEventListener(`click`,()=>{f=n.dataset.cgTab,t(`[data-cg-tab]`,e).forEach(e=>{let t=e===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-selected`,String(t))}),g()}));let v;c.addEventListener(`input`,()=>{clearTimeout(v),v=setTimeout(g,200)}),o.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-cg-lotengo]`);if(t){let e=d.find(e=>e.id===t.dataset.cgLotengo);e&&!e.respondi&&(e.respondi=!0,p(`lo_tengo`,{id:e.id}).then(()=>g()).catch(()=>{}));return}let n=e.target.closest(`[data-cg-cerrar]`);if(n){n.disabled=!0;try{await p(`cerrar`,{id:n.dataset.cgCerrar}),await _()}catch(e){n.disabled=!1,l(e.message)}}});let y=n(`#cg-marca`,e);y.addEventListener(`change`,()=>{n(`#cg-modelos`,e).innerHTML=oe(y.value).map(e=>`<option value="${u(e)}"></option>`).join(``)}),r.addEventListener(`submit`,async t=>{t.preventDefault(),l(``);let i=Object.fromEntries(new FormData(r));if(!i.marca)return l(`Elegí la marca.`);if(!String(i.modelo).trim())return l(`Escribí el modelo.`);if(i.anio_desde&&i.anio_hasta&&Number(i.anio_desde)>Number(i.anio_hasta))return l(`El año "desde" tiene que ser menor o igual al "hasta".`);let a=n(`[data-colega-enviar]`,e);a.disabled=!0;try{let t=await p(`crear`,i);r.reset(),n(`[data-colega-details]`,e).open=!1,e.insertAdjacentHTML(`afterbegin`,`<p class="mb-6 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[15px] text-ok" role="status" data-cg-ok>Listo: tu pedido les llegó a ${u(t.avisadas)} ${t.avisadas===1?`agencia`:`agencias`}${t.telegram?` (${u(t.telegram)} por Telegram)`:``}.</p>`),setTimeout(()=>n(`[data-cg-ok]`,e)?.remove(),8e3),n(`[data-cg-tab="mios"]`,e).click(),await _()}catch(e){l(e.message)}finally{a.disabled=!1}}),await Promise.all([h(),_()]);try{await p(`leer`),a()}catch{}}var de=[[2,`2 horas`],[6,`6 horas`],[12,`12 horas`],[24,`24 horas`],[48,`48 horas`],[72,`3 días`],[168,`7 días`],[360,`15 días`],[720,`30 días`]],fe=e=>String(e).padStart(2,`0`),pe=e=>{let t=new Date(e);return`${t.getFullYear()}-${fe(t.getMonth()+1)}-${fe(t.getDate())}T${fe(t.getHours())}:${fe(t.getMinutes())}`},me=e=>new Date(e).toLocaleString(`es-AR`,{weekday:`short`,day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),Y=(e,t,n=``)=>(n?`<option value="">${u(n)}</option>`:``)+e.map(e=>{let[n,r]=Array.isArray(e)?e:[e,e];return`<option value="${u(n)}"${String(n)===String(t??``)?` selected`:``}>${u(r)}</option>`}).join(``),X=(e,t,n=``)=>`<label class="block ${n}"><span class="vd-label">${u(e)}</span>${t}</label>`,Z=(e,t,n=``)=>`<input class="auth-input" name="${e}" value="${u(t??``)}" ${n} />`,Q=e=>Number(String(e??``).replace(/[.\s$]/g,``).replace(`,`,`.`)),he=[[`hatchback`,`Hatchback`],[`sedan`,`Sedán`],[`suv`,`SUV`],[`pickup`,`Pick-up`],[`utilitario`,`Utilitario`],[`deportivo`,`Deportivo`]];function ge(e,t){let i=y.includes(e.marca)?y:[e.marca,...y],a=document.createElement(`dialog`);a.className=`ea-dialog`,a.setAttribute(`aria-labelledby`,`ea-title`),a.innerHTML=`
    <form method="dialog" class="flex max-h-[90vh] flex-col" novalidate data-ea-form>
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div class="min-w-0">
          <p class="text-[13px] font-bold text-ink/60">Código ${u(e.codigo)}</p>
          <h2 id="ea-title" class="truncate text-[20px] font-bold">Editar ${u(`${e.marca} ${e.modelo}`)}</h2>
        </div>
        <button type="button" class="icon-btn grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line" data-ea-cerrar aria-label="Cerrar">${d(`x`,`h-4 w-4`)}</button>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
        <div class="grid gap-4 sm:grid-cols-2">
          ${X(`Marca`,`<select class="auth-input" name="marca">${Y(i,e.marca)}</select>`)}
          ${X(`Modelo`,Z(`modelo`,e.modelo,`maxlength="60" required`))}
          ${X(`Versión`,Z(`version`,e.version,`maxlength="80" required`),`sm:col-span-2`)}
          ${X(`Año`,Z(`anio`,e.anio,`inputmode="numeric" maxlength="4"`))}
          ${X(`Condición`,`<select class="auth-input" name="condicion">${Y([[`0km`,`0km`],[`usado`,`Usado`]],e.condicion)}</select>`)}
          ${X(`Kilómetros`,Z(`km`,Number(e.km).toLocaleString(`es-AR`),`inputmode="numeric" maxlength="9"`))}
          ${X(`Combustible`,`<select class="auth-input" name="combustible">${Y([`Nafta`,`Diésel`,`GNC`,`Híbrido`,`Eléctrico`],e.combustible)}</select>`)}
          ${X(`Precio`,Z(`precio`,Number(e.precio).toLocaleString(`es-AR`),`inputmode="numeric" maxlength="15"`))}
          ${X(`Moneda`,`<select class="auth-input" name="moneda">${Y([[`ARS`,`$ Pesos`],[`USD`,`USD`]],e.moneda)}</select>`)}
          ${X(`Caja`,`<select class="auth-input" name="transmision">${Y([`Manual`,`Automática`],e.transmision)}</select>`)}
          ${X(`Carrocería`,`<select class="auth-input" name="carroceria">${Y(he,e.carroceria)}</select>`)}
          ${X(`Puertas`,`<select class="auth-input" name="puertas">${Y([2,3,4,5],e.puertas,`—`)}</select>`)}
          ${X(`Color`,Z(`color`,e.color,`maxlength="30"`))}
          ${X(`Motor`,Z(`motor`,e.motor,`maxlength="40"`))}
          ${X(`Tracción`,Z(`traccion`,e.traccion,`maxlength="30"`))}
          ${X(`Ciudad`,Z(`ciudad`,e.ciudad,`maxlength="60"`))}
          ${X(`Provincia`,`<select class="auth-input" name="provincia">${Y(x,e.provincia)}</select>`)}
          ${X(`Descripción`,`<textarea class="auth-input !h-auto min-h-[110px] py-3" name="descripcion" maxlength="1000" rows="4">${u(e.descripcion??``)}</textarea>`,`sm:col-span-2`)}
        </div>
        <div class="mt-6">
          <p class="vd-label">Fotos</p>
          <ul class="grid grid-cols-4 gap-2 sm:grid-cols-7" data-ea-fotos></ul>
          <div class="mt-3 flex flex-wrap gap-2">
            <label class="btn-primary h-[44px] w-fit cursor-pointer !px-4 text-[14px]" data-ea-agregar-label><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-agregar /> ${d(`plus`,`h-4 w-4`)} Agregar fotos</label>
            <label class="btn-outline h-[44px] w-fit cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-input /> ${d(`images`,`h-4 w-4`)} Reemplazar todas</label>
          </div>
          <p class="mt-2 text-[13px] text-ink/60" data-ea-fotos-nota></p>
        </div>
        ${(()=>{let t=e.relampago_precio&&new Date(e.relampago_termina).getTime()>Date.now(),n=t?Math.round((new Date(e.relampago_termina)-new Date(e.relampago_empieza))/36e5):24,r=de.some(([e])=>e===n)?n:24;return`
        <fieldset class="mt-6 rounded-2xl border border-[#F3B8B4] bg-[#FFF7F6] p-4 sm:p-5" data-ea-relampago>
          <legend class="px-1 text-[16px] font-bold"><span aria-hidden="true">🔥</span> Precio relámpago</legend>
          <p class="text-[14px] text-ink/70">Bajale el precio por un tiempo determinado. Se muestra con la etiqueta <b>🔥 Relámpago</b>, el precio normal tachado y un contador. Al terminar, vuelve solo a su precio.</p>
          ${t?`<p class="mt-3 flex flex-wrap items-center gap-2 text-[14px]"><span class="feria-timer" data-oferta-ini="${u(e.relampago_empieza)}" data-oferta-fin="${u(e.relampago_termina)}"><span aria-hidden="true">🔥</span> <span data-oferta-txt>${u(E({ini:e.relampago_empieza,fin:e.relampago_termina}))}</span></span> ${u(me(e.relampago_empieza))} → ${u(me(e.relampago_termina))} <button type="button" class="font-bold text-[#B42318] underline underline-offset-2" data-ea-rel-quitar>Quitar relámpago</button></p>`:``}
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            ${X(`Precio relámpago`,Z(`rel_precio`,t?Number(e.relampago_precio).toLocaleString(`es-AR`):``,`inputmode="numeric" maxlength="15" placeholder="Vacío = sin relámpago"`))}
            ${X(`Empieza`,`<input class="auth-input" type="datetime-local" name="rel_empieza" value="${u(pe(t?Math.max(new Date(e.relampago_empieza).getTime(),Date.now()):Date.now()))}" min="${u(pe(Date.now()))}" />`)}
            ${X(`Dura`,`<select class="auth-input" name="rel_horas">${Y(de,r)}</select>`)}
          </div>
          <p class="mt-3 text-[13px] text-ink/60" data-ea-rel-resumen></p>
        </fieldset>`})()}
        <p class="mt-5 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-ea-error></p>
      </div>
      <div class="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button type="button" class="btn-outline h-[50px] justify-center !px-6" data-ea-cerrar>Cancelar</button>
        <button type="submit" class="btn-primary h-[50px] justify-center !px-8" data-ea-guardar>${d(`check`,`h-4 w-4`)} <span data-ea-label>Guardar cambios</span></button>
      </div>
    </form>`,document.body.append(a);let o=n(`[data-ea-form]`,a),s=n(`[data-ea-fotos]`,a),c=n(`[data-ea-error]`,a),l=(e.fotos??[]).filter(e=>C(e)),f=l.map(e=>({path:e,url:C(e)})),p=()=>f.filter(e=>e.file),h=()=>f.length!==l.length||f.some((e,t)=>e.path!==l[t]),g=!1,_=()=>{s.innerHTML=f.map((e,t)=>`
      <li class="group relative aspect-[4/3] overflow-hidden rounded-lg bg-soft">
        <img src="${u(e.url)}" alt="Foto ${t+1}" class="h-full w-full object-cover" />
        ${t===0?`<span class="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-bold text-white">Portada</span>`:`<button type="button" class="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-ink shadow transition-colors hover:bg-brand hover:text-white" data-ea-portada="${t}">Portada</button>`}
        ${f.length>1?`<button type="button" class="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-[#D92D20] hover:text-white" aria-label="Quitar foto ${t+1}" data-ea-quitar="${t}">${d(`x`,`h-3.5 w-3.5`)}</button>`:``}
      </li>`).join(``);let e=f.length>=7,t=n(`[data-ea-agregar-label]`,a);t.classList.toggle(`pointer-events-none`,e),t.classList.toggle(`opacity-50`,e),n(`[data-ea-agregar]`,a).disabled=e,n(`[data-ea-fotos-nota]`,a).textContent=e?`Ya tenés 7 fotos, el máximo. Para sumar otra, quitá alguna con la ✕.`:`${f.length} de 7 fotos. Podés agregar ${7-f.length} más. La primera es la portada.`},v=e=>{let t=[...e].filter(e=>/^image\/(jpeg|png|webp)$/.test(e.type)&&e.size<=26214400);return t.length<e.length&&D(`Algunos archivos no son fotos JPG, PNG o WebP de hasta 25 MB y no se sumaron.`),t},b=e=>e.forEach(e=>e.file&&URL.revokeObjectURL(e.url)),D=e=>{c.textContent=e||``,c.classList.toggle(`hidden`,!e),e&&c.scrollIntoView({block:`nearest`})},O=0,k=()=>{g||(clearInterval(O),b(f),a.close(),a.remove())},A=n(`[data-ea-relampago]`,a),j=!1,M=()=>{let e=Q(o.elements.rel_precio.value),t=Q(o.elements.precio.value),r=Math.max(new Date(o.elements.rel_empieza.value).getTime()||Date.now(),Date.now()),i=r+Number(o.elements.rel_horas.value)*36e5,s=o.elements.moneda.value===`USD`?`USD `:`$ `;n(`[data-ea-rel-resumen]`,a).textContent=e?e>=t?`Tiene que ser más bajo que el precio actual (${s}${t.toLocaleString(`es-AR`)}).`:`${s}${e.toLocaleString(`es-AR`)} en vez de ${s}${t.toLocaleString(`es-AR`)} (-${Math.round((1-e/t)*100)}%) · del ${me(r)} al ${me(i)} h.`:`Sin precio relámpago.`};A.addEventListener(`input`,e=>{if(j=!0,e.target.name===`rel_precio`){let t=Q(e.target.value);e.target.value=t?t.toLocaleString(`es-AR`):``}M()}),A.addEventListener(`change`,()=>{j=!0,M()}),o.elements.precio.addEventListener(`input`,M),n(`[data-ea-rel-quitar]`,a)?.addEventListener(`click`,()=>{o.elements.rel_precio.value=``,j=!0,M()}),M(),O=T(a),n(`[data-ea-input]`,a).addEventListener(`change`,e=>{D(``);let t=v(e.target.files);t.length>7&&D(`Podés subir hasta 7 fotos. Tomamos las primeras 7.`),t.length&&(b(f),f=t.slice(0,7).map(e=>({file:e,url:URL.createObjectURL(e)})),_()),e.target.value=``}),n(`[data-ea-agregar]`,a).addEventListener(`change`,e=>{D(``);let t=v(e.target.files),n=7-f.length;t.length>n&&D(`Entran ${n} ${n===1?`foto más`:`fotos más`} (máximo 7). Sumamos las primeras ${n}.`),f.push(...t.slice(0,n).map(e=>({file:e,url:URL.createObjectURL(e)}))),_(),e.target.value=``}),s.addEventListener(`click`,e=>{let t=e.target.closest(`[data-ea-quitar]`),n=e.target.closest(`[data-ea-portada]`);t&&f.length>1&&(b(f.splice(Number(t.dataset.eaQuitar),1)),_()),n&&(f.unshift(...f.splice(Number(n.dataset.eaPortada),1)),_())}),a.addEventListener(`click`,e=>{(e.target.closest(`[data-ea-cerrar]`)||e.target===a)&&(e.preventDefault(),k())}),a.addEventListener(`cancel`,e=>{e.preventDefault(),k()}),o.addEventListener(`submit`,async i=>{if(i.preventDefault(),g)return;let s=o.elements,c=e=>s[e].value.trim(),l=new Date().getFullYear()+1,u={codigo:e.codigo,marca:c(`marca`),modelo:c(`modelo`),version:c(`version`),anio:Number(c(`anio`)),condicion:c(`condicion`),km:Q(c(`km`)),precio:Q(c(`precio`)),moneda:c(`moneda`),combustible:c(`combustible`),transmision:c(`transmision`),carroceria:c(`carroceria`),puertas:c(`puertas`)?Number(c(`puertas`)):null,color:c(`color`),motor:c(`motor`),traccion:c(`traccion`),ciudad:c(`ciudad`),provincia:c(`provincia`),descripcion:c(`descripcion`)};if(!u.modelo||!u.version)return D(`Completá modelo y versión.`);if(!u.ciudad)return D(`Completá la ciudad.`);if(!Number.isInteger(u.anio)||u.anio<1950||u.anio>l)return D(`El año tiene que estar entre 1950 y ${l}.`);if(!Number.isInteger(u.km)||u.km<0||u.km>2e6)return D(`Revisá los kilómetros (solo números).`);if(!Number.isFinite(u.precio)||u.precio<=0||u.precio>=1e11)return D(`Revisá el precio (solo números).`);let d=Q(c(`rel_precio`));if(d&&d>=u.precio)return D(`El precio relámpago tiene que ser más bajo que el precio.`);let _=new Date(c(`rel_empieza`));if(d&&Number.isNaN(_.getTime()))return D(`Elegí cuándo empieza el precio relámpago.`);g=!0,D(``);let v=n(`[data-ea-guardar]`,a),y=n(`[data-ea-label]`,a);v.disabled=!0;try{let n=[];if(h()){let e=p();if(e.length){let t=await r(),n=await S();y.textContent=`Preparando fotos…`;let i=[];for(let t of e)i.push(await w(t.file,n));let{urls:a}=await m(`urls_fotos`,{cantidad:i.length,formato:n});for(let[r,o]of i.entries()){y.textContent=`Subiendo fotos ${r+1} de ${i.length}…`;let{error:s}=await t.storage.from(`mkt-fotos`).uploadToSignedUrl(a[r].path,a[r].token,o,{contentType:n===`jpg`?`image/jpeg`:`image/webp`});if(s)throw Error(`Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.`);e[r].subida=a[r].path}}n=f.map(e=>e.path??e.subida)}y.textContent=`Guardando…`,await m(`publicar`,{autos:[{...u,fotos:n}]}),(j||d&&Number(e.relampago_precio)!==d)&&(d?await m(`relampago`,{id:e.id,precio:d,empieza:_.toISOString(),horas:Number(c(`rel_horas`))}):e.relampago_precio&&await m(`relampago_quitar`,{id:e.id})),g=!1,k(),t?.()}catch(e){g=!1,v.disabled=!1,y.textContent=`Guardar cambios`,D(String(e.message||`No pudimos guardar. Probá de nuevo.`).replace(/^Fila 1: /,``))}}),_(),a.showModal(),_e(o)}var _e=e=>e.elements.modelo?.focus(),ve=e=>new Date(e).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`});function ye(e){let t=!1;async function n(){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${d(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus alertas…</p>`;let t;try{t=await _(`listar`)}catch(t){e.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${u(t.message)}</p>`;return}e.innerHTML=`${await k().catch(()=>!1)?`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#E8F5E9] px-5 py-4 text-[15px] text-[#1E6B34]"><span class="flex items-center gap-2">${d(`circle-check`,`h-5 w-5`)} Las notificaciones están activas en este dispositivo.</span><button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-al-probar>Mandarme una de prueba</button></div>`:`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#EEF1FB] px-5 py-4 text-[15px] text-brand"><span class="flex items-center gap-2">${d(`bell`,`h-5 w-5`)} ${O()?`Activá las notificaciones en este dispositivo para recibir los avisos.`:`Este navegador no permite notificaciones. En iPhone, agregá el sitio a la pantalla de inicio y abrilo desde ahí.`}</span>${O()?`<button type="button" class="btn-primary h-[40px] !px-4 text-[14px]" data-al-activar>Activar</button>`:``}</div>`}${t.alertas.length?`<ul class="mt-5 grid gap-3">${t.alertas.map(e=>`
          <li class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="flex items-center gap-2 text-[16px] font-bold">${d(`bell`,`h-4 w-4 text-brand`)} ${u(j(e))}</p>
              <p class="mt-1 text-[13px] text-ink/60">Creada el ${u(ve(e.created_at))} · ${e.avisos?`${u(e.avisos)} ${e.avisos===1?`aviso`:`avisos`}, el último el ${u(ve(e.ultimo_aviso_at))}`:`todavía sin avisos`}</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <a href="./autos.html?${u(new URLSearchParams(Object.entries({marca:e.marca,modelo:e.modelo??``,condicion:e.condicion===`todos`?``:e.condicion,anio:e.anio_desde??``,pmax:e.precio_max??``,moneda:e.precio_max?e.moneda:``}).filter(([,e])=>e!==``&&e!=null)).toString())}" class="btn-outline h-[40px] !px-4 text-[14px]">${d(`eye`,`h-4 w-4`)} Ver autos</a>
              <button type="button" class="btn-outline h-[40px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-al-borrar="${u(e.id)}" aria-label="Borrar alerta ${u(j(e))}">${d(`x`,`h-4 w-4`)} Borrar</button>
            </div>
          </li>`).join(``)}</ul>`:`<div class="mt-5 rounded-[20px] border border-dashed border-line p-8 text-center">
           <p class="text-[18px] font-bold">Todavía no tenés alertas</p>
           <p class="mt-1 text-[15px] text-ink/70">Filtrá el auto que buscás y tocá <b>Avisame cuando entre</b>. Te avisamos apenas lo publiquen.</p>
           <a href="./autos.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${d(`search`,`h-4 w-4`)} Buscar autos</a>
         </div>`}<p class="mt-4 text-[13px] text-ink/60">Podés tener hasta 10 alertas. Te avisamos una sola vez por cada auto.</p><p class="mt-3 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-al-error></p>`}e.addEventListener(`click`,async r=>{let i=r.target.closest(`[data-al-activar], [data-al-probar], [data-al-borrar]`);if(!i||t)return;let a=e.querySelector(`[data-al-error]`);t=!0,i.disabled=!0;try{if(i.dataset.alBorrar){if(!window.confirm(`¿Borrar esta alerta?`))return;await _(`borrar`,{id:i.dataset.alBorrar})}else if(`alActivar`in i.dataset){let e=await A();if(e.error){a.textContent=e.motivo,a.classList.remove(`hidden`);return}await _(`probar`).catch(()=>{})}else{await _(`probar`);return}await n()}catch(e){a&&(a.textContent=e.message,a.classList.remove(`hidden`))}finally{t=!1,i.disabled=!1}}),n()}var be=e=>new Date(e).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`}),xe=(e,t,n)=>`${e} ${e===1?t:n}`;async function Se(e){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${d(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando…</p>`;let t;try{t=await g(`panel`)}catch(t){e.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${u(t.message)}</p>`;return}let n=t.clientes??[];e.innerHTML=`
    <div class="rounded-[24px] bg-soft p-5 sm:p-7">
      <p class="text-[13px] font-bold uppercase tracking-[0.1em] text-ink/60">Tu código</p>
      <p class="mt-1 font-mono text-[30px] font-bold tracking-[0.15em]">${u(t.ref)}</p>
      <ol class="mt-4 grid gap-3 text-[15px] leading-[1.6] text-ink/80 md:grid-cols-3">
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">1.</b> Entrá a <a href="./agencias.html?filtro=independientes" class="text-brand underline underline-offset-4">Agencias</a> y mirá cuáles aceptan vendedores independientes y cuánta comisión pagan.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">2.</b> En la ficha de un auto de esas agencias tocá <b>"Compartir con mi link"</b> y mandáselo a tu cliente.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">3.</b> Cuando tu cliente abre el link o le escribe a la agencia, queda registrado acá. Es tu constancia ante la agencia.</li>
      </ol>
    </div>
    <h3 class="mt-8 text-[20px] font-bold">Clientes que trajiste</h3>
    ${n.length?`<ul class="mt-4 grid gap-3">${n.map(e=>{let n=C(e.auto.foto??``),r=e.agencia.whatsapp?`https://wa.me/${e.agencia.whatsapp}?text=${encodeURIComponent(`Hola ${e.agencia.nombre}, soy vendedor independiente de Red de Autos (código ${t.ref}). Te escribo por el ${e.auto.titulo}.`)}`:``;return`
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
        ${n?`<img src="${u(n)}" alt="" width="120" height="90" loading="lazy" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
        <div class="min-w-0 flex-1">
          <p class="truncate text-[16px] font-bold">${u(e.auto.titulo||`Auto`)}</p>
          <p class="text-[14px] text-ink/70">${u(e.agencia.nombre??``)}${e.agencia.comision?` · comisión ${u(e.agencia.comision)} %`:``}${e.auto.precio?` · ${u(l(Number(e.auto.precio),e.auto.moneda))}`:``}${e.auto.estado&&e.auto.estado!==`publicado`?` · <b>${e.auto.estado===`vendido`?`Vendido`:`Pausado`}</b>`:``}</p>
          <p class="mt-1 flex flex-wrap gap-x-3 text-[13px] text-ink/60">
            <span class="inline-flex items-center gap-1">${d(`eye`,`h-3.5 w-3.5`)} ${u(xe(e.vista,`visita`,`visitas`))}</span>
            <span class="inline-flex items-center gap-1">${d(`message-circle`,`h-3.5 w-3.5`)} ${u(xe(e.whatsapp,`WhatsApp a la agencia`,`WhatsApp a la agencia`))}</span>
            ${e.llamada?`<span class="inline-flex items-center gap-1">${d(`phone`,`h-3.5 w-3.5`)} ${u(xe(e.llamada,`llamada`,`llamadas`))}</span>`:``}
            <span>Último: ${u(be(e.ultimo))}</span>
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          <a href="./auto.html?id=${encodeURIComponent(e.auto.id)}" class="btn-outline h-[40px] !px-4 text-[14px]">${d(`eye`,`h-4 w-4`)} Ver</a>
          ${r?`<a href="${u(r)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[40px] !px-4 text-[14px]">${d(`message-circle`,`h-4 w-4`)} Agencia</a>`:``}
        </div>
      </li>`}).join(``)}</ul>`:`<div class="mt-4 rounded-[20px] border border-dashed border-line p-8 text-center">
        <p class="text-[18px] font-bold">Todavía no hay clientes registrados</p>
        <p class="mt-1 text-[15px] text-ink/70">Compartí autos con tu link y acá vas a ver cada visita y cada contacto con la agencia.</p>
        <a href="./agencias.html?filtro=independientes" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${d(`handshake`,`h-4 w-4`)} Ver agencias que aceptan</a>
      </div>`}
    <p class="mt-4 text-[13px] text-ink/60">Contamos una visita y un contacto por persona, auto y día. No guardamos datos de tus clientes. La comisión la arreglás y la cobrás directo con la agencia.</p>`}var Ce=[[0,`Toda la feria`],[2,`2 horas`],[6,`6 horas`],[12,`12 horas`],[24,`24 horas`],[48,`48 horas`],[72,`72 horas`]],$=e=>new Date(e).toLocaleString(`es-AR`,{weekday:`short`,day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),we=e=>String(e).padStart(2,`0`),Te=e=>{let t=new Date(e);return`${t.getFullYear()}-${we(t.getMonth()+1)}-${we(t.getDate())}T${we(t.getHours())}:${we(t.getMinutes())}`},Ee=(e,t)=>Math.round((1-t/e)*100),De=e=>`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${u(e)}</p>`;function Oe(e){let t=null,n=[],r=new Map,i=0;async function a(){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${d(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando la feria…</p>`;try{let[e,i]=await Promise.all([m(`feria`),m(`mios`)]);t=e.feria,r=new Map((e.ofertas??[]).map(e=>[e.auto_id,e])),n=(i.autos??[]).filter(e=>e.estado===`publicado`||r.has(e.id)),o()}catch(t){e.innerHTML=De(t.message)}}function o(){if(clearInterval(i),!t){e.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${d(`zap`,`h-6 w-6`)}</span>
          <p class="mt-4 text-[18px] font-bold">No hay ninguna feria programada</p>
          <p class="mx-auto mt-1 max-w-[520px] text-[15px] text-ink/70">Cuando armemos la próxima te avisamos por Telegram y desde acá vas a poder sumar tus autos con precio relámpago.</p>
        </div>`;return}let a=Date.now(),o=new Date(t.empieza).getTime()<=a,c=n.filter(e=>r.has(e.id));e.innerHTML=`
      <div class="feria-card !gap-5 !py-7">
        <div class="min-w-0">
          <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-[#9DB0FF]">${d(`zap`,`h-4 w-4`)} ${o?`En curso`:`Próxima feria`}</p>
          <p class="mt-3 text-[24px] font-bold leading-tight sm:text-[28px]">${u(t.nombre)}</p>
          <p class="mt-2 text-[15px] text-white/70">Del ${u($(t.empieza))} al ${u($(t.termina))} h</p>
        </div>
        <div class="flex flex-col gap-3 lg:items-end">
          <p class="text-[15px] text-white/80"><b class="text-[28px] text-white">${c.length}</b> ${c.length===1?`auto tuyo en la feria`:`autos tuyos en la feria`}</p>
          <a href="./feria.html" class="btn-cta w-fit" target="_blank" rel="noopener"><span class="btn-cta-icon">${d(`eye`,`h-4 w-4`)}</span> Ver la feria</a>
        </div>
      </div>
      <ol class="mt-6 grid gap-3 rounded-2xl bg-soft p-5 text-[15px] text-ink/80 sm:grid-cols-3">
        <li class="flex gap-2"><b class="text-brand">1.</b> Tocá <b>Sumar a la feria</b> en los autos que quieras ofrecer.</li>
        <li class="flex gap-2"><b class="text-brand">2.</b> Poné el precio relámpago (más bajo que el actual) y cuánto dura.</li>
        <li class="flex gap-2"><b class="text-brand">3.</b> Se muestra en la página de la feria y en la ficha. Al terminar, vuelve solo a su precio.</li>
      </ol>
      ${n.length?`<ul class="mt-6 grid gap-3">${n.map(s).join(``)}</ul>`:`
        <div class="mt-6 rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">No tenés autos publicados</p>
          <p class="mt-1 text-[15px] text-ink/70">Publicá tu stock para poder sumarlo a la feria.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${d(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`}`,i=T(e)}function s(e){let t=r.get(e.id),n=C(e.fotos?.[0]??``),i=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`,a=t&&new Date(t.termina).getTime()<=Date.now(),o=e.estado!==`publicado`;return`
      <li class="rounded-2xl border ${t&&!a?`border-[#F3B8B4]`:`border-line`} bg-white p-4" data-fe-auto="${u(e.id)}">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex min-w-0 flex-1 items-center gap-4">
            ${n?`<img src="${u(n)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
            <div class="min-w-0">
              <p class="text-[13px]"><span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${u(e.codigo)}</span></p>
              <p class="mt-1 truncate text-[16px] font-bold">${u(i)}</p>
              ${t?`
                <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[15px]"><s class="text-ink/50">${u(l(Number(e.precio),e.moneda))}</s> <b class="text-[#E5484D]">${u(l(Number(t.precio_feria),e.moneda))}</b> <span class="rounded-full bg-[#FDECEC] px-2 py-0.5 text-[12px] font-bold text-[#E5484D]">-${u(Ee(Number(e.precio),Number(t.precio_feria)))}%</span></p>
                <p class="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink/60">
                  <span class="feria-timer !px-2.5 !py-0.5 !text-[12px]" data-oferta-ini="${u(t.empieza)}" data-oferta-fin="${u(t.termina)}">${d(`clock`,`h-3 w-3`)} <span data-oferta-txt>${u(E({ini:t.empieza,fin:t.termina}))}</span></span>
                  ${u($(t.empieza))} → ${u($(t.termina))}
                </p>
                ${o?`<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el auto no está publicado.</p>`:Number(t.precio_feria)>=Number(e.precio)?`<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el precio de feria ya no es más bajo que el actual. Editalo.</p>`:``}`:`<p class="mt-0.5 text-[15px]">${u(l(Number(e.precio),e.moneda))}</p>`}
            </div>
          </div>
          <div class="flex shrink-0 flex-wrap gap-2">
            ${t?`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-fe-editar="${u(e.id)}" ${o?`disabled`:``}>Editar</button>
                   <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-fe-quitar="${u(e.id)}" aria-label="Sacar ${u(i)} de la feria">${d(`x`,`h-4 w-4`)} Sacar</button>`:`<button type="button" class="btn-primary h-[42px] !px-4 text-[14px]" data-fe-editar="${u(e.id)}">${d(`zap`,`h-4 w-4`)} Sumar a la feria</button>`}
          </div>
        </div>
        <div data-fe-form hidden></div>
      </li>`}function c(n,i){e.querySelectorAll(`[data-fe-form]`).forEach(e=>{e.hidden=!0,e.innerHTML=``});let o=r.get(i.id),s=new Date(t.empieza).getTime(),c=new Date(t.termina).getTime(),f=o?new Date(o.empieza).getTime():Math.max(s,Date.now()),p=o?Math.round((new Date(o.termina)-new Date(o.empieza))/36e5):0,h=o&&new Date(o.termina).getTime()>=c-6e4?0:Ce.find(([e])=>e===p)?.[0]??0,g=n.querySelector(`[data-fe-form]`),_=`fe-${i.id.slice(0,8)}`;g.innerHTML=`
      <form class="mt-4 grid gap-4 border-t border-line pt-4 md:grid-cols-3" novalidate>
        <div>
          <label for="${_}-p" class="auth-label">Precio de feria (${u(i.moneda===`USD`?`US$`:`$`)})</label>
          <input id="${_}-p" name="precio" class="auth-input" inputmode="numeric" autocomplete="off" required value="${o?u(Number(o.precio_feria).toLocaleString(`es-AR`)):``}" placeholder="Menor a ${u(Number(i.precio).toLocaleString(`es-AR`))}" />
        </div>
        <div>
          <label for="${_}-i" class="auth-label">Empieza</label>
          <input id="${_}-i" name="empieza" type="datetime-local" class="auth-input" required value="${u(Te(f))}" min="${u(Te(s))}" max="${u(Te(c-6e4))}" />
        </div>
        <div>
          <label for="${_}-d" class="auth-label">Dura</label>
          <select id="${_}-d" name="horas" class="auth-input">${Ce.map(([e,t])=>`<option value="${e}" ${e===h?`selected`:``}>${t}</option>`).join(``)}</select>
        </div>
        <p class="text-[14px] text-ink/70 md:col-span-3" data-fe-resumen></p>
        <p class="hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318] md:col-span-3" data-fe-error></p>
        <div class="flex flex-wrap gap-2 md:col-span-3">
          <button type="submit" class="btn-primary h-[46px] !px-6">${d(`zap`,`h-4 w-4`)} ${o?`Guardar cambios`:`Sumar a la feria`}</button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-fe-cancelar>Cancelar</button>
        </div>
      </form>`,g.hidden=!1;let v=g.querySelector(`form`),y=()=>Number(v.elements.precio.value.replace(/\D/g,``)),b=()=>{let e=y(),t=Math.max(new Date(v.elements.empieza.value).getTime()||f,Date.now()),n=Number(v.elements.horas.value),r=n?Math.min(t+n*36e5,c):c;v.querySelector(`[data-fe-resumen]`).innerHTML=e&&e<Number(i.precio)?`${d(`zap`,`inline h-4 w-4 text-[#E5484D]`)} <b>${u(l(e,i.moneda))}</b> en vez de ${u(l(Number(i.precio),i.moneda))} (<b class="text-[#E5484D]">-${u(Ee(Number(i.precio),e))}%</b>) · del ${u($(t))} al ${u($(r))} h.`:`Precio actual: ${u(l(Number(i.precio),i.moneda))}. El precio de feria tiene que ser más bajo.`};v.addEventListener(`input`,e=>{if(e.target.name===`precio`){let t=y();e.target.value=t?t.toLocaleString(`es-AR`):``}b()}),v.addEventListener(`change`,b),b(),v.elements.precio.focus(),v.querySelector(`[data-fe-cancelar]`).addEventListener(`click`,()=>{g.hidden=!0,g.innerHTML=``}),v.addEventListener(`submit`,async e=>{e.preventDefault();let t=v.querySelector(`[data-fe-error]`),n=e=>{t.textContent=e,t.classList.remove(`hidden`)};t.classList.add(`hidden`);let r=y();if(!r)return n(`Poné el precio de feria.`);if(r>=Number(i.precio))return n(`Tiene que ser más bajo que el precio actual (${l(Number(i.precio),i.moneda)}).`);let o=new Date(v.elements.empieza.value);if(Number.isNaN(o.getTime()))return n(`Elegí cuándo empieza.`);let s=v.querySelector(`[type=submit]`);s.disabled=!0;try{await m(`feria_sumar`,{id:i.id,precio:r,empieza:o.toISOString(),horas:Number(v.elements.horas.value)}),await a()}catch(e){n(e.message),s.disabled=!1}})}e.addEventListener(`click`,async t=>{let r=t.target.closest(`[data-fe-editar]`);if(r){let e=n.find(e=>e.id===r.dataset.feEditar);e&&c(r.closest(`[data-fe-auto]`),e);return}let i=t.target.closest(`[data-fe-quitar]`);if(!i)return;let o=n.find(e=>e.id===i.dataset.feQuitar);if(window.confirm(`¿Sacar ${o?`${o.marca} ${o.modelo} ${o.anio}`:`este auto`} de la feria? Vuelve a mostrarse con su precio normal.`)){i.disabled=!0;try{await m(`feria_quitar`,{id:i.dataset.feQuitar}),await a()}catch(t){i.disabled=!1,e.insertAdjacentHTML(`afterbegin`,De(t.message))}}}),a()}var ke={eyebrow:`Servicio de fotos`,title:`¿Tenés fotos de tus autos pero querés que se vean más profesionales?`,text:`Nos encargamos de que tus autos luzcan con fondo de estudio, para que tus publicaciones tengan más impacto y se destaquen en el listado. Escribinos y te lo resolvemos.`,puntos:[`Fondo de estudio limpio y uniforme`,`Usamos las fotos que ya tenés`,`Listas para publicar en Red de Autos y en tus redes`],costo:`Es un servicio con costo. Escribinos por WhatsApp y te pasamos el precio según la cantidad de autos.`,mensaje:`¡Hola! Quiero consultar por el servicio de fotos con fondo de estudio para mis autos.`},Ae=t=>`https://wa.me/${e.whatsapp}?text=${encodeURIComponent(t)}`,je=()=>`
  <aside class="mt-10 flex flex-col gap-5 rounded-[24px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8" aria-labelledby="estudio-mini">
    <div class="flex items-start gap-4">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#9DB0FF]">${d(`camera`,`h-6 w-6`)}</span>
      <div>
        <p id="estudio-mini" class="text-[18px] font-bold">Fotos con fondo de estudio para tus autos</p>
        <p class="mt-1 text-[14px] text-white/70">Mandanos las fotos que tenés y te las devolvemos con fondo profesional. Servicio con costo.</p>
      </div>
    </div>
    <a href="${u(Ae(ke.mensaje))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px] shrink-0 justify-center !px-5">${d(`whatsapp`,`h-4 w-4`)} Consultar</a>
  </aside>`;function Me(){let e=n(`[data-mc-guest]`),i=n(`[data-mc-panel]`),a=n(`[data-mc-buscados]`),o=n(`#buscados`),s=n(`[data-mc-publicar]`),h=n(`[data-mc-misautos]`),g=n(`#mis-autos`),_=n(`[data-mis-autos]`),y=n(`[data-mc-colegas]`),b=n(`#colegas`),x=n(`[data-mc-perfil]`),S=n(`#perfil`),w=!1,T=!1,O=!1,k=(e,n)=>{t(`[data-mc-panel] .mc-action[aria-controls]`).forEach(t=>{if(t===e)return;t.classList.remove(`is-active`),t.setAttribute(`aria-expanded`,`false`);let n=document.getElementById(t.getAttribute(`aria-controls`));n&&(n.hidden=!0)}),n.hidden=!1,e.setAttribute(`aria-expanded`,`true`),e.classList.add(`is-active`),n.scrollIntoView({behavior:`smooth`,block:`start`})},A=async()=>{k(a,o),w||(w=!0,await f(o,await r()))},j=[],M=e=>{if(!e)return``;let t=e.autos.reduce((e,t)=>({v:e.v+t.vistas_30,w:e.w+t.whatsapp_30,l:e.l+t.llamadas_30}),{v:0,w:0,l:0}),n=t.w+t.l,r=t.v?Math.round(n/t.v*1e3)/10:0,i=Math.max(1,...e.dias.map(e=>e.vistas)),a=e=>new Date(`${e}T12:00:00`).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`}),o=(e,t,n)=>`<div class="rounded-2xl bg-white p-4 sm:p-5"><p class="flex items-center gap-2 text-[13px] font-medium text-ink/60">${d(n,`h-4 w-4`)} ${t}</p><p class="mt-1 text-[28px] font-bold leading-none">${u(e.toLocaleString(`es-AR`))}</p></div>`;return`
      <div class="mb-6 rounded-[24px] bg-soft p-4 sm:p-6">
        <div class="flex flex-wrap items-end justify-between gap-2">
          <h3 class="text-[18px] font-bold">Estadísticas · últimos 30 días</h3>
          <p class="text-[13px] text-ink/60">Una vista o contacto por persona, auto y día.</p>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          ${o(t.v,`Vistas de fichas`,`eye`)}${o(t.w,`Clics en WhatsApp`,`message-circle`)}${o(t.l,`Llamadas`,`phone`)}
          <div class="rounded-2xl bg-white p-4 sm:p-5"><p class="text-[13px] font-medium text-ink/60">Contactos por cada 100 vistas</p><p class="mt-1 text-[28px] font-bold leading-none">${u(String(r).replace(`.`,`,`))}</p></div>
        </div>
        <div class="mt-5 rounded-2xl bg-white p-4 sm:p-5">
          <p class="text-[13px] font-medium text-ink/60">Vistas por día</p>
          <div class="mt-3 flex h-[110px] items-end gap-[3px]" role="img" aria-label="Vistas por día de los últimos 30 días: ${u(e.dias.map(e=>`${a(e.dia)} ${e.vistas}`).join(`, `))}">
            ${e.dias.map(e=>`<span class="mc-bar group relative flex-1 rounded-t-[4px] ${e.vistas?`bg-brand`:`bg-line`}" data-h="${Math.max(3,Math.round(e.vistas/i*100))}"><span class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[12px] text-white group-hover:block">${u(a(e.dia))}: ${u(e.vistas)} vistas · ${u(e.contactos)} contactos</span></span>`).join(``)}
          </div>
          <div class="mt-2 flex justify-between text-[12px] text-ink/50"><span>${u(a(e.dias[0]?.dia??``))}</span><span>Hoy</span></div>
        </div>
      </div>`},N=null,P=e=>{j=e;let t=new Map((N?.autos??[]).map(e=>[e.auto_id,e]));if(!e.length){_.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${d(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`;return}let n=e.filter(e=>e.estado===`publicado`).length,r=e.filter(e=>e.estado===`vendido`).length;_.innerHTML=`${M(N)}
      <p class="mb-4 text-[15px] text-ink/70">${e.length} ${e.length===1?`auto`:`autos`} · ${n} ${n===1?`publicado`:`publicados`}${r?` · ${r} ${r===1?`vendido`:`vendidos`}`:``}</p>
      <ul class="grid gap-3">
        ${e.map(e=>{let n=C(e.fotos?.[0]??``),r=e.estado!==`publicado`,i=e.estado===`vendido`,a=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`;return`
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${n?`<img src="${u(n)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${r?`opacity-50 grayscale`:``}" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${u(e.codigo)}</span>
                  ${i?`<span class="rounded-full bg-ink px-2.5 py-0.5 font-medium text-white">Vendido</span>`:r?`<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${e.pausado_por_admin?`Pausado por Red de Autos`:`Pausado`}</span>`:`<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>`}
                  <span class="text-ink/60">${u(e.fotos?.length??0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${u(a)}</p>
                ${e.relampago_precio&&new Date(e.relampago_termina).getTime()>Date.now()?`<p class="flex flex-wrap items-center gap-x-2 text-[15px]"><s class="text-ink/50">${u(l(Number(e.precio),e.moneda))}</s> <b class="text-[#E5484D]">${u(l(Number(e.relampago_precio),e.moneda))}</b></p>
                     <p class="mt-1"><span class="feria-timer !px-2.5 !py-0.5 !text-[12px]" data-oferta-ini="${u(e.relampago_empieza)}" data-oferta-fin="${u(e.relampago_termina)}"><span aria-hidden="true">🔥</span> Relámpago · <span data-oferta-txt>${u(E({ini:e.relampago_empieza,fin:e.relampago_termina}))}</span></span></p>`:`<p class="text-[15px]">${u(l(Number(e.precio),e.moneda))}</p>`}
                ${(()=>{let n=t.get(e.id);return n?`<p class="mt-1 flex flex-wrap gap-x-3 text-[13px] text-ink/60" title="Últimos 30 días (total histórico: ${u(n.vistas_total)} vistas, ${u(n.whatsapp_total+n.llamadas_total)} contactos)"><span class="inline-flex items-center gap-1">${d(`eye`,`h-3.5 w-3.5`)} ${u(n.vistas_30)} ${n.vistas_30===1?`vista`:`vistas`}</span><span class="inline-flex items-center gap-1">${d(`message-circle`,`h-3.5 w-3.5`)} ${u(n.whatsapp_30)} WhatsApp</span>${n.llamadas_30?`<span class="inline-flex items-center gap-1">${d(`phone`,`h-3.5 w-3.5`)} ${u(n.llamadas_30)} ${n.llamadas_30===1?`llamada`:`llamadas`}</span>`:``}</p>`:``})()}
              </div>
            </div>
            <div class="flex shrink-0 flex-wrap gap-2">
              ${r?``:`<a href="${u(v({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${d(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin||i?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${r?`publicado`:`pausado`}" data-id="${u(e.id)}">${r?`Volver a publicar`:`Pausar`}</button>`}
              ${i?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-editar="${u(e.id)}">Editar</button>`}
              <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-eliminar="${u(e.id)}" aria-label="Eliminar ${u(a)}">${d(`x`,`h-4 w-4`)} Eliminar</button>
            </div>
          </li>`}).join(``)}
      </ul>`},F=async()=>{_.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${d(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let[{autos:e},t]=await Promise.all([m(`mios`),m(`estadisticas`).catch(()=>null)]);N=t,P(e??[]),D(),_.querySelectorAll(`.mc-bar`).forEach(e=>{e.style.height=`${e.dataset.h}%`})}catch(e){_.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${u(e.message)}</p>`}},I=()=>{k(h,g),F()},L=n(`[data-mc-telegram]`),R=async()=>{if(!T)L.hidden=!0;else try{let{vinculado:e}=await p(`telegram_estado`);if(L.hidden=e,e)return;L.innerHTML=`
        <div class="mb-8 overflow-hidden rounded-[24px] bg-ink text-white">
          <div class="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
            <div>
              <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">${d(`telegram`,`h-4 w-4`)} Bot de Red de Autos en Telegram</p>
              <p class="mt-3 text-[22px] font-bold leading-tight sm:text-[26px]">Conectá Telegram y manejá tu stock desde el celular</p>
              <ul class="mt-4 grid gap-2 text-[15px] text-white/85 sm:grid-cols-2">
                ${[[`bell`,`Avisos al instante de pedidos de colegas`],[`tag`,`Cambiar el precio de un auto`],[`circle-check`,`Marcar un auto como vendido`],[`lock`,`Pausar y volver a publicar`],[`handshake`,`Pedir autos a colegas y responder "Lo tengo"`],[`badge-check`,`Avisos de tu cuenta y de ferias nuevas`]].map(([e,t])=>`<li class="flex items-start gap-2">${d(e,`mt-0.5 h-4 w-4 shrink-0 text-[#9DB0FF]`)}<span>${t}</span></li>`).join(``)}
              </ul>
            </div>
            <div class="flex flex-col gap-2 md:items-end">
              <button type="button" class="btn-primary h-[54px] justify-center !px-8" data-tg-conectar>${d(`telegram`,`h-4 w-4`)} Conectar Telegram</button>
              <p class="text-[13px] text-white/60 md:text-right">Se abre Telegram: tocá <b>Iniciar</b> y listo.<br>Si no lo tenés, bajalo gratis de tu tienda de apps.</p>
            </div>
          </div>
        </div>`}catch{L.hidden=!0}};L.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await p(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),window.addEventListener(`focus`,R,{once:!0})}catch{}finally{t.disabled=!1}}});let z=!1,B=()=>{k(y,b),z||(z=!0,ue(n(`[data-colegas-box]`)))},V=n(`[data-mc-clientes]`),ee=n(`#clientes`),te=!1,H=!1,re=()=>{H&&(k(V,ee),te||(te=!0,Se(n(`[data-clientes-box]`))))},U=n(`[data-mc-feria]`),ie=n(`#feria`),ae=!1,W=()=>{T&&(k(U,ie),ae||(ae=!0,Oe(n(`[data-feria-box]`))))},G=n(`[data-mc-alertas]`),K=n(`#alertas`),oe=!1,q=()=>{k(G,K),oe||(oe=!0,ye(n(`[data-alertas-box]`)))},J=!1,se=()=>{k(x,S),J||(J=!0,ne(n(`[data-perfil-box]`)))};_.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-editar]`);if(t){let e=j.find(e=>e.id===t.dataset.editar);e&&ge(e,F);return}let n=e.target.closest(`[data-eliminar]`),r=n||e.target.closest(`[data-estado]`);if(r){if(n){let e=j.find(e=>e.id===n.dataset.eliminar);if(!window.confirm(`¿Eliminar ${e?`${e.marca} ${e.modelo} ${e.anio} (${e.codigo})`:`este auto`}? Se borra con sus fotos y no se puede deshacer.`))return}r.disabled=!0;try{n?await m(`borrar`,{id:n.dataset.eliminar}):await m(`estado`,{id:r.dataset.id,estado:r.dataset.estado}),await F()}catch(e){r.disabled=!1,_.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${u(e.message)}</p>`)}}});let ce=(e,t,r)=>{e.classList.toggle(`is-soon`,!t),e.tagName===`BUTTON`?e.disabled=!t:(e.toggleAttribute(`aria-disabled`,!t),t?e.removeAttribute(`tabindex`):e.setAttribute(`tabindex`,`-1`)),n(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,e).textContent=r},le=t=>{if(e.hidden=!!t,i.hidden=!t,!t){n(`[data-mc-title]`).textContent=`Mi cuenta`,n(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,o.hidden=!0,w=!1,g.hidden=!0,S.hidden=!0,J=!1,b.hidden=!0,z=!1;return}let r=t.tipo===`agencia`?t.agencia_tipo===`oficial`?`Concesionario oficial${t.marca_oficial?` ${t.marca_oficial}`:``}`:`Agencia multimarca`:t.tipo===`vendedor`?`Vendedor independiente`:`Particular`;n(`[data-mc-title]`).textContent=`Hola, ${t.nombre.split(` `)[0]}`,n(`[data-mc-sub]`).textContent=`${t.nombre} · ${r}`;let c=t.estado===`pendiente`;n(`[data-mc-pending]`).classList.toggle(`hidden`,!c),a.disabled=c,a.classList.toggle(`is-soon`,c),T=t.tipo===`agencia`&&t.estado===`aprobada`,O=t.tipo===`particular`&&t.estado===`activa`,s.setAttribute(`href`,O?`./vender.html`:`./publicar.html`),ce(s,T||O,T?`Cargá tu stock con la plantilla de Excel y tus fotos.`:O?`Publicá hasta 2 autos gratis y seguí su estado.`:c?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),h.hidden=O,ce(h,T,T?`Mirá, pausá o volvé a publicar tus autos.`:c?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),x.hidden=t.tipo!==`agencia`,t.tipo!==`agencia`&&(S.hidden=!0),t.tipo===`agencia`&&location.hash===`#perfil`&&se(),y.hidden=!T,U.hidden=!T,n(`[data-estudio]`).innerHTML=t.tipo===`vendedor`?``:je(),T||(ie.hidden=!0),T&&location.hash===`#feria`&&W(),R(),T||(b.hidden=!0),T&&location.hash===`#colegas`&&B(),!c&&location.hash===`#buscados`&&A(),T&&location.hash===`#mis-autos`&&I(),location.hash===`#alertas`&&q();let l=t.tipo===`vendedor`;H=l&&t.estado===`aprobada`,s.hidden=l,l&&(h.hidden=!0),V.hidden=!l,V.disabled=!H,V.classList.toggle(`is-soon`,l&&!H),n(`[data-mc-clientes-sub]`).textContent=H?`Tu código, tu link y los clientes que trajiste.`:`Disponible cuando aprobemos tu cuenta.`,n(`[data-mc-pending]`).textContent=l?`Tu cuenta de vendedor independiente está en revisión. Cuando la aprobemos vas a ver las comisiones de cada agencia y tu link.`:`Tu agencia está en revisión. Cuando la aprobemos vas a poder ver el ranking y publicar tu stock.`,H&&location.hash===`#clientes`&&re()};a.addEventListener(`click`,A),h.addEventListener(`click`,I),x.addEventListener(`click`,se),y.addEventListener(`click`,B),G.addEventListener(`click`,q),U.addEventListener(`click`,W),V.addEventListener(`click`,re),window.addEventListener(`hashchange`,()=>{location.hash===`#colegas`&&T&&B(),location.hash===`#alertas`&&q(),location.hash===`#feria`&&T&&W(),location.hash===`#perfil`&&!x.hidden&&se(),location.hash===`#mis-autos`&&T&&I()}),s.addEventListener(`click`,e=>{!T&&!O&&e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>le(e.detail)),le(c())}document.documentElement.classList.add(`js`),i(),s(),Me(),o();