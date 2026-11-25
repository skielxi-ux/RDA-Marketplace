import{n as e,r as t}from"./site-DXcwHTbK.js";import{i as n,n as r,o as i,r as a,s as o,t as s}from"./auth-MSfTgDFu.js";import{a as c,i as l,n as u,r as d,s as f,t as p}from"./fotos-CZGd48oL.js";import{t as m}from"./ranking-Dxtbj-5f.js";import{i as h,r as g,t as _}from"./autosApi-CvjFEs7E.js";import{o as v}from"./catalog-B6PmF8G3.js";import{i as y,t as b}from"./modelos-B845yErK.js";import{t as x}from"./carga-CEIl-EbJ.js";var S=e=>/^\d{11}$/.test(e??``)?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:e??``,C=e=>String(e??``).replace(/^549(\d+)$/,`$1`),w=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${c(t)}</label>
    ${n}
    ${r?`<p class="mt-1.5 text-[13px] text-ink/60">${r}</p>`:``}
  </div>`,T=(e,t,n,r=``)=>`<input id="${e}" name="${t}" value="${c(n??``)}" class="auth-input" ${r} />`,E=(e,t,n)=>`
  <div class="relative">
    <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
    ${l(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
  </div>`,D=(e,t,n=``)=>(n?`<option value="">${c(n)}</option>`:``)+e.map(e=>`<option value="${c(e)}"${e===t?` selected`:``}>${c(e)}</option>`).join(``),O={nombre:`Nombre comercial`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},k=(e,t)=>t==null||t===``?`—`:e===`cuit`?S(t):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),A=e=>{let t=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>O[e]):[];return t.length?`
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${l(`clipboard-check`,`h-4 w-4`)} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${t.map(([t,n])=>`<li>${c(O[t])}: <b>${c(k(t,n))}</b> <span class="opacity-75">(hoy: ${c(k(t,e[t]))})</span></li>`).join(``)}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`:``},j=e=>{let t=d(e.logo??``);return t?`<img src="${c(t)}" alt="Logo de ${c(e.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`:`<span class="grid h-full w-full place-items-center text-ink/35">${l(`store`,`h-10 w-10`)}</span>`};function M(e){let t=e.cambios_pendientes??{},n=n=>Object.hasOwn(t,n)?t[n]:e[n],r=n(`agencia_tipo`)===`oficial`?`oficial`:`multimarca`;return`
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${j(e)}</div>
        <p class="mt-3 text-[13px] text-ink/60">JPG, PNG o WebP. Lo recortás en cuadrado antes de guardarlo.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label class="btn-primary h-[48px] cursor-pointer justify-center">${l(`images`,`h-4 w-4`)} <span data-logo-label>${e.logo?`Cambiar logo`:`Subir logo`}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-logo-input /></label>
          <button type="button" class="btn-outline h-[44px] justify-center" data-logo-quitar ${e.logo?``:`hidden`}>${l(`x`,`h-4 w-4`)} Quitar logo</button>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <form class="space-y-8" data-perfil-form novalidate>
      <div data-perfil-pendientes>${A(e)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${l(`shield-check`,`mt-0.5 h-4 w-4 shrink-0 text-brand`)} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${w(`pf-nombre`,`Nombre comercial`,T(`pf-nombre`,`nombre`,n(`nombre`),`maxlength="80" required autocomplete="organization"`))}
          ${w(`pf-cuit`,`CUIT`,T(`pf-cuit`,`cuit`,S(n(`cuit`)),`inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"`))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${r===`multimarca`?`checked`:``} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${r===`oficial`?`checked`:``} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${r===`oficial`?``:`hidden`}>
            ${w(`pf-marca`,`Marca que representa`,E(`pf-marca`,`marca_oficial`,D(y,n(`marca_oficial`),`Elegí la marca`)))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${w(`pf-ciudad`,`Ciudad`,T(`pf-ciudad`,`ciudad`,e.ciudad,`maxlength="60" required autocomplete="address-level2"`))}
          ${w(`pf-provincia`,`Provincia`,E(`pf-provincia`,`provincia`,D(x,e.provincia,`Elegí la provincia`)))}
          ${w(`pf-direccion`,`Dirección del local`,T(`pf-direccion`,`direccion`,e.direccion,`maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"`))}
          ${w(`pf-horario`,`Horario de atención`,T(`pf-horario`,`horario`,e.horario,`maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${w(`pf-wsp`,`WhatsApp para consultas`,T(`pf-wsp`,`whatsapp_ventas`,C(e.whatsapp_ventas),`type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"`),`Si lo dejás vacío, las consultas llegan al celular con el que ingresás.`)}
          ${w(`pf-email`,`Email`,T(`pf-email`,`email`,e.email,`type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${w(`pf-desc`,`Descripción`,`<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${c(e.descripcion??``)}</textarea>`,`<span data-desc-count>0</span>/600`)}
          </div>
          ${w(`pf-web`,`Sitio web`,T(`pf-web`,`sitio_web`,e.sitio_web,`type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"`))}
          ${w(`pf-ig`,`Instagram`,T(`pf-ig`,`instagram`,e.instagram?`@${e.instagram}`:``,`maxlength="60" placeholder="@tuagencia"`))}
        </div>
      </fieldset>

      <p class="auth-error" role="alert" data-perfil-error hidden></p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-perfil-guardar>${l(`check`,`h-4 w-4`)} <span>Guardar cambios</span></button>
        <a href="#" class="link-view justify-center" data-perfil-ver target="_blank" rel="noopener">Ver mi página ${l(`arrow-up-right`,`h-4 w-4`)}</a>
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
        <span class="sr-only">Acercar o alejar</span>${l(`search`,`h-4 w-4 text-ink/50`)}
        <input type="range" min="1" max="4" step="0.01" value="1" class="w-full accent-[#405FF2]" data-crop-zoom />
      </label>
      <div class="mt-6 flex gap-3">
        <button type="button" class="btn-outline h-[48px] flex-1 justify-center" data-crop-cancel>Cancelar</button>
        <button type="button" class="btn-primary h-[48px] flex-1 justify-center" data-crop-ok>${l(`check`,`h-4 w-4`)} Guardar logo</button>
      </div>
    </div>
  </div>`}var N=400,P=600;async function F(r){r.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${l(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tu perfil…</p>`;let i;try{({perfil:i}=await h(`ver`))}catch(e){r.innerHTML=`<p class="auth-error">${c(e.message)}</p>`;return}r.innerHTML=M(i);let a=e(`[data-perfil-form]`,r),o=e(`[data-perfil-error]`,r),s=e(`[data-perfil-ok]`,r),d=e=>{o.textContent=e||``,o.hidden=!e};e(`[data-perfil-ver]`,r).href=`./agencia.html?id=${encodeURIComponent(i.id)}`;let f=e(`[data-pf-marca]`,r);a.addEventListener(`change`,e=>{e.target.name===`agencia_tipo`&&(f.hidden=e.target.value!==`oficial`)});let p=e(`#pf-desc`,r),m=e(`[data-desc-count]`,r),g=()=>{m.textContent=String(p.value.length)};p.addEventListener(`input`,g),g(),a.addEventListener(`submit`,async t=>{t.preventDefault(),d(``),s.textContent=``;let n=new FormData(a),o=Object.fromEntries([`nombre`,`cuit`,`agencia_tipo`,`marca_oficial`,`ciudad`,`provincia`,`direccion`,`horario`,`whatsapp_ventas`,`email`,`descripcion`,`sitio_web`,`instagram`].map(e=>[e,n.get(e)??``]));if(o.agencia_tipo===`oficial`&&!o.marca_oficial)return d(`Elegí la marca que representa el concesionario.`);if(!o.provincia)return d(`Elegí la provincia.`);let c=e(`[data-perfil-guardar]`,r);c.disabled=!0;try{let t=await h(`guardar`,o);i=t.perfil,e(`[data-perfil-pendientes]`,r).innerHTML=A(i),s.textContent=t.pendiente?`Guardado. El nombre, CUIT o tipo quedan en revisión.`:`Listo, tus datos están actualizados.`,i.instagram&&(e(`#pf-ig`,r).value=`@${i.instagram}`),i.sitio_web&&(e(`#pf-web`,r).value=i.sitio_web)}catch(e){d(e.message)}finally{c.disabled=!1}});let _=e(`[data-crop]`,r),v=e(`[data-crop-canvas]`,r),y=v.getContext(`2d`),b=e(`[data-crop-zoom]`,r),x=null,S=1,C=0,w=0,T=()=>S*Number(b.value),E=(e=y,t=P,n=!0)=>{let r=t/P;e.clearRect(0,0,t,t),n&&(e.fillStyle=`#fff`,e.fillRect(0,0,t,t));let i=T()*r;e.drawImage(x,C*r+(t-x.width*i)/2,w*r+(t-x.height*i)/2,x.width*i,x.height*i)},D=()=>{_.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),x?.close?.(),x=null};e(`[data-logo-input]`,r).addEventListener(`change`,async t=>{let n=t.target.files[0];if(t.target.value=``,n){if(d(``),!/^image\/(jpeg|png|webp)$/.test(n.type))return d(`El logo tiene que ser JPG, PNG o WebP.`);if(n.size>10485760)return d(`El logo pesa demasiado (máximo 10 MB).`);try{x=await createImageBitmap(n)}catch{return d(`No pudimos abrir esa imagen. Probá con otra.`)}S=Math.min(P/x.width,P/x.height),b.value=`1`,C=0,w=0,E(),_.hidden=!1,document.documentElement.classList.add(`overflow-hidden`),e(`[data-crop-ok]`,r).focus()}}),b.addEventListener(`input`,()=>x&&E());let O=null;v.addEventListener(`pointerdown`,e=>{if(!x)return;v.setPointerCapture(e.pointerId);let t=v.getBoundingClientRect();O={px:e.clientX,py:e.clientY,x:C,y:w,k:P/t.width}}),v.addEventListener(`pointermove`,e=>{if(!O)return;let t=P*.75;C=Math.max(-450,Math.min(t,O.x+(e.clientX-O.px)*O.k)),w=Math.max(-450,Math.min(t,O.y+(e.clientY-O.py)*O.k)),E()}),[`pointerup`,`pointercancel`].forEach(e=>v.addEventListener(e,()=>{O=null})),v.tabIndex=0,v.addEventListener(`keydown`,e=>{if(!x)return;let t={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];t&&(e.preventDefault(),C+=t[0],w+=t[1],E()),(e.key===`+`||e.key===`-`)&&(b.value=String(Math.min(4,Math.max(1,Number(b.value)+(e.key===`+`?.1:-.1)))),E())}),e(`[data-crop-cancel]`,r).addEventListener(`click`,D),_.addEventListener(`keydown`,e=>{e.key===`Escape`&&D()}),e(`[data-crop-ok]`,r).addEventListener(`click`,async t=>{let a=t.currentTarget;a.disabled=!0;try{let t=await u(),a=document.createElement(`canvas`);a.width=a.height=N,E(a.getContext(`2d`),N,t===`jpg`);let o=await new Promise(e=>a.toBlob(e,t===`jpg`?`image/jpeg`:`image/webp`,.9));if(!o)throw Error(`No pudimos procesar el logo.`);let{path:c,token:l}=await h(`url_logo`,{formato:t}),{error:d}=await(await n()).storage.from(`mkt-fotos`).uploadToSignedUrl(c,l,o,{contentType:o.type});if(d)throw Error(`Se cortó la subida del logo. Probá de nuevo.`);let f=await h(`guardar_logo`,{path:c});i.logo=f.logo,e(`[data-logo-preview]`,r).innerHTML=j(i),e(`[data-logo-label]`,r).textContent=`Cambiar logo`,e(`[data-logo-quitar]`,r).hidden=!1,D(),s.textContent=`Logo guardado.`}catch(e){D(),d(e.message)}finally{a.disabled=!1}}),e(`[data-logo-quitar]`,r).addEventListener(`click`,async t=>{let n=t.currentTarget;n.disabled=!0;try{await h(`quitar_logo`),i.logo=null,e(`[data-logo-preview]`,r).innerHTML=j(i),e(`[data-logo-label]`,r).textContent=`Subir logo`,n.hidden=!0}catch(e){d(e.message)}finally{n.disabled=!1}}),t(`input, select, textarea`,a).forEach(e=>e.addEventListener(`input`,()=>{s.textContent=``}))}var I=new Date().getFullYear()+1,L=Array.from({length:I-1989},(e,t)=>I-t),R=e=>Math.round(Number(e)).toLocaleString(`es-AR`),z=e=>String(e).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),B=(e,t,n,r)=>`
  <div>
    <label for="${e}" class="auth-label">${c(r)}</label>
    <div class="relative">
      <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
      ${l(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
    </div>
  </div>`,V=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${c(n)}</label>
    <input id="${e}" name="${t}" class="auth-input" ${r} />
  </div>`,H=(e,t)=>`<option value="">${c(t)}</option>`+e.map(e=>`<option value="${c(e)}">${c(e)}</option>`).join(``),U=e=>b[e]??[];function W(){return`
  <div class="space-y-8">
    <div data-tg-box></div>

    <!-- Nuevo pedido -->
    <details class="colega-form group rounded-[20px] border border-line bg-white" data-colega-details>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <span class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">${l(`plus`,`h-5 w-5`)}</span>
          <span><span class="block text-[18px] font-bold">Pedir un auto a los colegas</span>
          <span class="block text-[14px] text-ink/70">¿Un cliente busca algo que no tenés? Avisale a todas las agencias de la red.</span></span>
        </span>
        ${l(`chevron-down`,`h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180`)}
      </summary>
      <form class="grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" data-colega-form novalidate>
        ${B(`cg-marca`,`marca`,H(y,`Elegí la marca`),`Marca *`)}
        <div>
          <label for="cg-modelo" class="auth-label">Modelo *</label>
          <input id="cg-modelo" name="modelo" list="cg-modelos" maxlength="60" required class="auth-input" placeholder="Ej.: Corolla" autocomplete="off" />
          <datalist id="cg-modelos"></datalist>
        </div>
        ${V(`cg-version`,`version`,`Versión`,`maxlength="80" placeholder="Ej.: XEi CVT (opcional)"`)}
        ${B(`cg-desde`,`anio_desde`,H(L,`Indistinto`),`Año desde`)}
        ${B(`cg-hasta`,`anio_hasta`,H(L,`Indistinto`),`Año hasta`)}
        ${V(`cg-km`,`km_max`,`Kilometraje máximo`,`inputmode="numeric" maxlength="9" placeholder="Ej.: 80.000"`)}
        ${V(`cg-color`,`color`,`Color`,`maxlength="30" placeholder="Indistinto"`)}
        ${B(`cg-caja`,`transmision`,H([`Manual`,`Automática`],`Indistinto`),`Caja`)}
        ${B(`cg-comb`,`combustible`,H([`Nafta`,`Diésel`,`Híbrido`,`Eléctrico`,`GNC`],`Indistinto`),`Combustible`)}
        <div>
          <label for="cg-presu" class="auth-label">Presupuesto del cliente</label>
          <div class="flex gap-2">
            <div class="relative w-[96px] shrink-0">
              <select name="moneda" aria-label="Moneda" class="auth-input appearance-none pr-8"><option value="ARS">$</option><option value="USD">USD</option></select>
              ${l(`chevron-down`,`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2`)}
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
          <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-colega-enviar>${l(`handshake`,`h-4 w-4`)} <span>Enviar a los colegas</span></button>
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
          ${l(`search`,`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50`)}
        </label>
      </div>
      <p class="mt-4 text-[14px] text-ink/60" data-cg-count aria-live="polite"></p>
      <ul class="mt-4 grid gap-4 lg:grid-cols-2" data-cg-list></ul>
    </div>
  </div>`}function G(e){return e?.vinculado?`<p class="flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[14px] text-ok">${l(`circle-check`,`h-4 w-4`)} Los pedidos te llegan también por Telegram${e.como?` (${c(e.como)})`:``}.</p>`:`
    <div class="flex flex-col gap-4 rounded-2xl bg-[#EEF1FB] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[15px]"><b>Recibí los pedidos en Telegram.</b> <span class="text-ink/70">Conectá tu cuenta una sola vez con el bot de Red de Autos.</span></p>
      <button type="button" class="btn-primary h-[46px] shrink-0 justify-center" data-tg-conectar>${l(`message-circle`,`h-4 w-4`)} Conectar Telegram</button>
    </div>`}var K=e=>{let t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/6e4));if(t<1)return`recién`;if(t<60)return`hace ${t} min`;let n=Math.round(t/60);if(n<24)return`hace ${n} h`;let r=Math.round(n/24);return r===1?`ayer`:`hace ${r} días`};function q(e){let t=e.anio_desde&&e.anio_hasta?e.anio_desde===e.anio_hasta?`${e.anio_desde}`:`${e.anio_desde} a ${e.anio_hasta}`:e.anio_desde?`Desde ${e.anio_desde}`:e.anio_hasta?`Hasta ${e.anio_hasta}`:``,n=[t&&[l(`calendar`,`h-3.5 w-3.5`),t],e.km_max!=null&&[l(`gauge`,`h-3.5 w-3.5`),`Hasta ${R(e.km_max)} km`],e.transmision&&[l(`cog`,`h-3.5 w-3.5`),e.transmision],e.combustible&&[l(`fuel`,`h-3.5 w-3.5`),e.combustible],e.color&&[l(`palette`,`h-3.5 w-3.5`),e.color]].filter(Boolean),r=e.agencia,i=d(r.logo??``),a=/^\d{10,15}$/.test(r.whatsapp??``)?r.whatsapp:``,o=[e.marca,e.modelo,e.version].filter(Boolean).join(` `),s=`Hola ${r.nombre}, vi en la Red de colegas de Red de Autos que buscás ${o}${t?` (${t})`:``}. Tengo uno que te puede servir.`,u=e.estado===`cerrado`;return`
  <li class="colega-card ${u?`opacity-60`:``}" data-pedido="${c(e.id)}">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium uppercase tracking-wide text-brand">${e.mio?`Tu pedido`:`Busca`} · <span class="normal-case tracking-normal text-ink/55">${c(K(e.created_at))}</span></p>
      ${u?`<span class="rounded-full bg-ink/10 px-2.5 py-0.5 text-[12px] font-medium">Cerrado</span>`:``}
    </div>
    <h3 class="mt-1 text-[20px] font-bold leading-tight">${c(o)}</h3>
    ${n.length?`<ul class="mt-3 flex flex-wrap gap-2">${n.map(([e,t])=>`<li class="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px]">${e}${c(t)}</li>`).join(``)}</ul>`:``}
    ${e.presupuesto?`<p class="mt-3 text-[15px]">Presupuesto: <b>${c(e.moneda===`USD`?`USD`:`$`)} ${c(R(e.presupuesto))}</b></p>`:``}
    ${e.comentario?`<p class="mt-2 text-[15px] text-ink/75">“${c(e.comentario)}”</p>`:``}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4">
      <a href="./agencia.html?id=${c(encodeURIComponent(r.id))}" class="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition-colors hover:text-brand">
        ${i?`<img src="${c(i)}" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[13px] font-bold text-white" aria-hidden="true">${c(z(r.nombre))}</span>`}
        <span class="min-w-0"><span class="block truncate font-bold">${c(r.nombre)}</span><span class="block truncate text-[13px] text-ink/60">${c([r.ciudad,r.provincia].filter(Boolean).join(`, `))}</span></span>
      </a>
      ${e.mio?u?`<p class="text-[13px] text-ink/60">Avisado a ${c(e.avisadas)} ${e.avisadas===1?`agencia`:`agencias`}</p>`:`<div class="flex shrink-0 items-center gap-3"><span class="whitespace-nowrap text-[13px] text-ink/60">Avisado a ${c(e.avisadas)}</span><button type="button" class="btn-outline h-[42px] whitespace-nowrap !px-4 text-[14px]" data-cg-cerrar="${c(e.id)}">${l(`check`,`h-4 w-4`)} Ya lo conseguí</button></div>`:a&&!u?`<div class="flex shrink-0 gap-2">
            <a href="https://wa.me/${c(a)}?text=${c(encodeURIComponent(s))}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[44px] whitespace-nowrap !px-4 text-[14px]" data-cg-lotengo="${c(e.id)}">${l(`message-circle`,`h-4 w-4`)} ${e.respondi?`Escribile`:`Lo tengo`}</a>
            <a href="tel:+${c(a)}" class="btn-outline h-[44px] !px-3.5" aria-label="Llamar a ${c(r.nombre)}">${l(`phone`,`h-4 w-4`)}</a>
          </div>`:``}
    </div>
    ${e.mio&&e.lo_tienen?.length?`
    <div class="mt-4 rounded-xl bg-[#E8F5E9] p-4">
      <p class="text-[14px] font-bold text-ok">${l(`circle-check`,`mr-1 inline h-4 w-4`)} ${e.lo_tienen.length===1?`Una agencia lo tiene`:`${c(e.lo_tienen.length)} agencias lo tienen`}</p>
      <ul class="mt-2 space-y-2">${e.lo_tienen.map(e=>{let t=/^\d{10,15}$/.test(e.whatsapp??``)?e.whatsapp:``;return`<li class="flex flex-wrap items-center justify-between gap-2 text-[14px]"><span><b>${c(e.nombre)}</b>${e.ciudad?` · ${c(e.ciudad)}`:``}</span>${t?`<a href="https://wa.me/${c(t)}?text=${c(encodeURIComponent(`Hola ${e.nombre}, vi que tenés un ${o} para mi pedido en la Red de colegas.`))}" target="_blank" rel="noopener noreferrer" class="link-view">${l(`message-circle`,`h-4 w-4`)} WhatsApp</a>`:``}</li>`}).join(``)}</ul>
    </div>`:``}
    ${!e.mio&&e.respondi?`<p class="mt-3 text-[13px] text-ok">${l(`circle-check`,`mr-1 inline h-3.5 w-3.5`)} Ya le avisaste que lo tenés.</p>`:``}
  </li>`}var J=e=>String(e??``).normalize(`NFD`).replace(/[̀-ͯ]/g,``).toLowerCase();async function Y(n){n.innerHTML=W();let r=e(`[data-colega-form]`,n),i=e(`[data-colega-error]`,n),o=e(`[data-cg-list]`,n),s=e(`[data-cg-count]`,n),l=e(`[data-cg-q]`,n),u=e=>{i.textContent=e||``,i.hidden=!e},d=[],f=`todos`,p=e(`[data-tg-box]`,n),m=async()=>{try{p.innerHTML=G(await g(`telegram_estado`))}catch{p.innerHTML=``}};p.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await g(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),p.insertAdjacentHTML(`beforeend`,`<p class="mt-2 text-[14px] text-ink/70">Se abrió Telegram: tocá <b>Iniciar</b> en el bot y volvé acá.</p>`),window.addEventListener(`focus`,m,{once:!0})}catch(e){p.insertAdjacentHTML(`beforeend`,`<p class="auth-error mt-2">${c(e.message)}</p>`)}finally{t.disabled=!1}}});let h=()=>{let e=J(l.value.trim()),t=d.filter(e=>f===`mios`?e.mio:!e.mio&&e.estado===`activo`).filter(t=>!e||J(`${t.marca} ${t.modelo} ${t.version??``} ${t.agencia.nombre} ${t.agencia.ciudad}`).includes(e));o.innerHTML=t.map(q).join(``)||`<li class="rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60 lg:col-span-2">${e?`No hay pedidos con esa búsqueda.`:f===`mios`?`Todavía no pediste ningún auto a los colegas.`:`No hay pedidos de colegas por ahora.`}</li>`,s.textContent=`${t.length} ${t.length===1?`pedido`:`pedidos`}`},_=async()=>{try{({pedidos:d}=await g(`listar`)),h()}catch(e){o.innerHTML=`<li class="auth-error lg:col-span-2">${c(e.message)}</li>`}};t(`[data-cg-tab]`,n).forEach(e=>e.addEventListener(`click`,()=>{f=e.dataset.cgTab,t(`[data-cg-tab]`,n).forEach(t=>{let n=t===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-selected`,String(n))}),h()}));let v;l.addEventListener(`input`,()=>{clearTimeout(v),v=setTimeout(h,200)}),o.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-cg-lotengo]`);if(t){let e=d.find(e=>e.id===t.dataset.cgLotengo);e&&!e.respondi&&(e.respondi=!0,g(`lo_tengo`,{id:e.id}).then(()=>h()).catch(()=>{}));return}let n=e.target.closest(`[data-cg-cerrar]`);if(n){n.disabled=!0;try{await g(`cerrar`,{id:n.dataset.cgCerrar}),await _()}catch(e){n.disabled=!1,u(e.message)}}});let y=e(`#cg-marca`,n);y.addEventListener(`change`,()=>{e(`#cg-modelos`,n).innerHTML=U(y.value).map(e=>`<option value="${c(e)}"></option>`).join(``)}),r.addEventListener(`submit`,async t=>{t.preventDefault(),u(``);let i=Object.fromEntries(new FormData(r));if(!i.marca)return u(`Elegí la marca.`);if(!String(i.modelo).trim())return u(`Escribí el modelo.`);if(i.anio_desde&&i.anio_hasta&&Number(i.anio_desde)>Number(i.anio_hasta))return u(`El año "desde" tiene que ser menor o igual al "hasta".`);let a=e(`[data-colega-enviar]`,n);a.disabled=!0;try{let t=await g(`crear`,i);r.reset(),e(`[data-colega-details]`,n).open=!1,n.insertAdjacentHTML(`afterbegin`,`<p class="mb-6 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[15px] text-ok" role="status" data-cg-ok>Listo: tu pedido les llegó a ${c(t.avisadas)} ${t.avisadas===1?`agencia`:`agencias`}${t.telegram?` (${c(t.telegram)} por Telegram)`:``}.</p>`),setTimeout(()=>e(`[data-cg-ok]`,n)?.remove(),8e3),e(`[data-cg-tab="mios"]`,n).click(),await _()}catch(e){u(e.message)}finally{a.disabled=!1}}),await Promise.all([m(),_()]);try{await g(`leer`),a()}catch{}}var X=(e,t,n=``)=>(n?`<option value="">${c(n)}</option>`:``)+e.map(e=>{let[n,r]=Array.isArray(e)?e:[e,e];return`<option value="${c(n)}"${String(n)===String(t??``)?` selected`:``}>${c(r)}</option>`}).join(``),Z=(e,t,n=``)=>`<label class="block ${n}"><span class="vd-label">${c(e)}</span>${t}</label>`,Q=(e,t,n=``)=>`<input class="auth-input" name="${e}" value="${c(t??``)}" ${n} />`,$=e=>Number(String(e??``).replace(/[.\s$]/g,``).replace(`,`,`.`)),ee=[[`hatchback`,`Hatchback`],[`sedan`,`Sedán`],[`suv`,`SUV`],[`pickup`,`Pick-up`],[`utilitario`,`Utilitario`],[`deportivo`,`Deportivo`]];function te(t,r){let i=y.includes(t.marca)?y:[t.marca,...y],a=document.createElement(`dialog`);a.className=`ea-dialog`,a.setAttribute(`aria-labelledby`,`ea-title`),a.innerHTML=`
    <form method="dialog" class="flex max-h-[90vh] flex-col" novalidate data-ea-form>
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div class="min-w-0">
          <p class="text-[13px] font-bold text-ink/60">Código ${c(t.codigo)}</p>
          <h2 id="ea-title" class="truncate text-[20px] font-bold">Editar ${c(`${t.marca} ${t.modelo}`)}</h2>
        </div>
        <button type="button" class="icon-btn grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line" data-ea-cerrar aria-label="Cerrar">${l(`x`,`h-4 w-4`)}</button>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
        <div class="grid gap-4 sm:grid-cols-2">
          ${Z(`Marca`,`<select class="auth-input" name="marca">${X(i,t.marca)}</select>`)}
          ${Z(`Modelo`,Q(`modelo`,t.modelo,`maxlength="60" required`))}
          ${Z(`Versión`,Q(`version`,t.version,`maxlength="80" required`),`sm:col-span-2`)}
          ${Z(`Año`,Q(`anio`,t.anio,`inputmode="numeric" maxlength="4"`))}
          ${Z(`Condición`,`<select class="auth-input" name="condicion">${X([[`0km`,`0km`],[`usado`,`Usado`]],t.condicion)}</select>`)}
          ${Z(`Kilómetros`,Q(`km`,Number(t.km).toLocaleString(`es-AR`),`inputmode="numeric" maxlength="9"`))}
          ${Z(`Combustible`,`<select class="auth-input" name="combustible">${X([`Nafta`,`Diésel`,`GNC`,`Híbrido`,`Eléctrico`],t.combustible)}</select>`)}
          ${Z(`Precio`,Q(`precio`,Number(t.precio).toLocaleString(`es-AR`),`inputmode="numeric" maxlength="15"`))}
          ${Z(`Moneda`,`<select class="auth-input" name="moneda">${X([[`ARS`,`$ Pesos`],[`USD`,`USD`]],t.moneda)}</select>`)}
          ${Z(`Caja`,`<select class="auth-input" name="transmision">${X([`Manual`,`Automática`],t.transmision)}</select>`)}
          ${Z(`Carrocería`,`<select class="auth-input" name="carroceria">${X(ee,t.carroceria)}</select>`)}
          ${Z(`Puertas`,`<select class="auth-input" name="puertas">${X([2,3,4,5],t.puertas,`—`)}</select>`)}
          ${Z(`Color`,Q(`color`,t.color,`maxlength="30"`))}
          ${Z(`Motor`,Q(`motor`,t.motor,`maxlength="40"`))}
          ${Z(`Tracción`,Q(`traccion`,t.traccion,`maxlength="30"`))}
          ${Z(`Ciudad`,Q(`ciudad`,t.ciudad,`maxlength="60"`))}
          ${Z(`Provincia`,`<select class="auth-input" name="provincia">${X(x,t.provincia)}</select>`)}
          ${Z(`Descripción`,`<textarea class="auth-input !h-auto min-h-[110px] py-3" name="descripcion" maxlength="1000" rows="4">${c(t.descripcion??``)}</textarea>`,`sm:col-span-2`)}
        </div>
        <div class="mt-6">
          <p class="vd-label">Fotos</p>
          <ul class="grid grid-cols-4 gap-2 sm:grid-cols-7" data-ea-fotos></ul>
          <label class="btn-outline mt-3 h-[44px] w-fit cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-input /> ${l(`images`,`h-4 w-4`)} Reemplazar fotos</label>
          <p class="mt-2 text-[13px] text-ink/60" data-ea-fotos-nota>Si elegís fotos nuevas (hasta 7), reemplazan a las actuales. La primera es la portada.</p>
        </div>
        <p class="mt-5 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-ea-error></p>
      </div>
      <div class="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button type="button" class="btn-outline h-[50px] justify-center !px-6" data-ea-cerrar>Cancelar</button>
        <button type="submit" class="btn-primary h-[50px] justify-center !px-8" data-ea-guardar>${l(`check`,`h-4 w-4`)} <span data-ea-label>Guardar cambios</span></button>
      </div>
    </form>`,document.body.append(a);let o=e(`[data-ea-form]`,a),s=e(`[data-ea-fotos]`,a),f=e(`[data-ea-error]`,a),m=[],h=!1,g=()=>{let e=m.length?m.map(e=>e.url):(t.fotos??[]).map(d).filter(Boolean);s.innerHTML=e.map((e,t)=>`<li class="relative aspect-[4/3] overflow-hidden rounded-lg bg-soft"><img src="${c(e)}" alt="Foto ${t+1}" class="h-full w-full object-cover" />${t===0?`<span class="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-bold text-white">Portada</span>`:``}</li>`).join(``)},v=e=>{f.textContent=e||``,f.classList.toggle(`hidden`,!e),e&&f.scrollIntoView({block:`nearest`})},b=()=>{h||(m.forEach(e=>URL.revokeObjectURL(e.url)),a.close(),a.remove())};e(`[data-ea-input]`,a).addEventListener(`change`,e=>{v(``);let t=[...e.target.files].filter(e=>/^image\/(jpeg|png|webp)$/.test(e.type)&&e.size<=26214400);t.length<e.target.files.length&&v(`Algunos archivos no son fotos JPG, PNG o WebP de hasta 25 MB y no se sumaron.`),t.length>7&&v(`Podés subir hasta 7 fotos. Tomamos las primeras 7.`),m.forEach(e=>URL.revokeObjectURL(e.url)),m=t.slice(0,7).map(e=>({file:e,url:URL.createObjectURL(e)})),g(),e.target.value=``}),a.addEventListener(`click`,e=>{(e.target.closest(`[data-ea-cerrar]`)||e.target===a)&&(e.preventDefault(),b())}),a.addEventListener(`cancel`,e=>{e.preventDefault(),b()}),o.addEventListener(`submit`,async i=>{if(i.preventDefault(),h)return;let s=o.elements,c=e=>s[e].value.trim(),l=new Date().getFullYear()+1,d={codigo:t.codigo,marca:c(`marca`),modelo:c(`modelo`),version:c(`version`),anio:Number(c(`anio`)),condicion:c(`condicion`),km:$(c(`km`)),precio:$(c(`precio`)),moneda:c(`moneda`),combustible:c(`combustible`),transmision:c(`transmision`),carroceria:c(`carroceria`),puertas:c(`puertas`)?Number(c(`puertas`)):null,color:c(`color`),motor:c(`motor`),traccion:c(`traccion`),ciudad:c(`ciudad`),provincia:c(`provincia`),descripcion:c(`descripcion`)};if(!d.modelo||!d.version)return v(`Completá modelo y versión.`);if(!d.ciudad)return v(`Completá la ciudad.`);if(!Number.isInteger(d.anio)||d.anio<1950||d.anio>l)return v(`El año tiene que estar entre 1950 y ${l}.`);if(!Number.isInteger(d.km)||d.km<0||d.km>2e6)return v(`Revisá los kilómetros (solo números).`);if(!Number.isFinite(d.precio)||d.precio<=0||d.precio>=1e11)return v(`Revisá el precio (solo números).`);h=!0,v(``);let f=e(`[data-ea-guardar]`,a),g=e(`[data-ea-label]`,a);f.disabled=!0;try{let e=[];if(m.length){let t=await n(),r=await u();g.textContent=`Preparando fotos…`;let i=[];for(let e of m)i.push(await p(e.file,r));let{urls:a}=await _(`urls_fotos`,{cantidad:i.length,formato:r});for(let[n,o]of i.entries()){g.textContent=`Subiendo fotos ${n+1} de ${i.length}…`;let{error:s}=await t.storage.from(`mkt-fotos`).uploadToSignedUrl(a[n].path,a[n].token,o,{contentType:r===`jpg`?`image/jpeg`:`image/webp`});if(s)throw Error(`Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.`);e.push(a[n].path)}}g.textContent=`Guardando…`,await _(`publicar`,{autos:[{...d,fotos:e}]}),h=!1,b(),r?.()}catch(e){h=!1,f.disabled=!1,g.textContent=`Guardar cambios`,v(String(e.message||`No pudimos guardar. Probá de nuevo.`).replace(/^Fila 1: /,``))}}),g(),a.showModal(),ne(o)}var ne=e=>e.elements.modelo?.focus();function re(){let r=e(`[data-mc-guest]`),i=e(`[data-mc-panel]`),a=e(`[data-mc-buscados]`),o=e(`#buscados`),u=e(`[data-mc-publicar]`),p=e(`[data-mc-misautos]`),h=e(`#mis-autos`),y=e(`[data-mis-autos]`),b=e(`[data-mc-colegas]`),x=e(`#colegas`),S=e(`[data-mc-perfil]`),C=e(`#perfil`),w=!1,T=!1,E=!1,D=(e,n)=>{t(`[data-mc-panel] .mc-action[aria-controls]`).forEach(t=>{if(t===e)return;t.classList.remove(`is-active`),t.setAttribute(`aria-expanded`,`false`);let n=document.getElementById(t.getAttribute(`aria-controls`));n&&(n.hidden=!0)}),n.hidden=!1,e.setAttribute(`aria-expanded`,`true`),e.classList.add(`is-active`),n.scrollIntoView({behavior:`smooth`,block:`start`})},O=async()=>{D(a,o),w||(w=!0,await m(o,await n()))},k=[],A=e=>{if(k=e,!e.length){y.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${l(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`;return}let t=e.filter(e=>e.estado===`publicado`).length,n=e.filter(e=>e.estado===`vendido`).length;y.innerHTML=`
      <p class="mb-4 text-[15px] text-ink/70">${e.length} ${e.length===1?`auto`:`autos`} · ${t} ${t===1?`publicado`:`publicados`}${n?` · ${n} ${n===1?`vendido`:`vendidos`}`:``}</p>
      <ul class="grid gap-3">
        ${e.map(e=>{let t=d(e.fotos?.[0]??``),n=e.estado!==`publicado`,r=e.estado===`vendido`,i=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`;return`
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${t?`<img src="${c(t)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${n?`opacity-50 grayscale`:``}" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${c(e.codigo)}</span>
                  ${r?`<span class="rounded-full bg-ink px-2.5 py-0.5 font-medium text-white">Vendido</span>`:n?`<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${e.pausado_por_admin?`Pausado por Red de Autos`:`Pausado`}</span>`:`<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>`}
                  <span class="text-ink/60">${c(e.fotos?.length??0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${c(i)}</p>
                <p class="text-[15px]">${c(f(Number(e.precio),e.moneda))}</p>
              </div>
            </div>
            <div class="flex shrink-0 flex-wrap gap-2">
              ${n?``:`<a href="${c(v({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${l(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin||r?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${n?`publicado`:`pausado`}" data-id="${c(e.id)}">${n?`Volver a publicar`:`Pausar`}</button>`}
              ${r?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-editar="${c(e.id)}">Editar</button>`}
              <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-eliminar="${c(e.id)}" aria-label="Eliminar ${c(i)}">${l(`x`,`h-4 w-4`)} Eliminar</button>
            </div>
          </li>`}).join(``)}
      </ul>`},j=async()=>{y.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${l(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let{autos:e}=await _(`mios`);A(e??[])}catch(e){y.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${c(e.message)}</p>`}},M=()=>{D(p,h),j()},N=e(`[data-mc-telegram]`),P=async()=>{if(!T)N.hidden=!0;else try{let{vinculado:e}=await g(`telegram_estado`);if(N.hidden=e,e)return;N.innerHTML=`
        <div class="mb-8 overflow-hidden rounded-[24px] bg-ink text-white">
          <div class="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
            <div>
              <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">${l(`message-circle`,`h-4 w-4`)} Bot de Red de Autos en Telegram</p>
              <p class="mt-3 text-[22px] font-bold leading-tight sm:text-[26px]">Conectá Telegram y manejá tu stock desde el celular</p>
              <ul class="mt-4 grid gap-2 text-[15px] text-white/85 sm:grid-cols-2">
                ${[[`bell`,`Avisos al instante de pedidos de colegas`],[`tag`,`Cambiar el precio de un auto`],[`circle-check`,`Marcar un auto como vendido`],[`lock`,`Pausar y volver a publicar`],[`handshake`,`Pedir autos a colegas y responder "Lo tengo"`],[`badge-check`,`Avisos de tu cuenta y de ferias nuevas`]].map(([e,t])=>`<li class="flex items-start gap-2">${l(e,`mt-0.5 h-4 w-4 shrink-0 text-[#9DB0FF]`)}<span>${t}</span></li>`).join(``)}
              </ul>
            </div>
            <div class="flex flex-col gap-2 md:items-end">
              <button type="button" class="btn-primary h-[54px] justify-center !px-8" data-tg-conectar>${l(`message-circle`,`h-4 w-4`)} Conectar Telegram</button>
              <p class="text-[13px] text-white/60 md:text-right">Se abre Telegram: tocá <b>Iniciar</b> y listo.<br>Si no lo tenés, bajalo gratis de tu tienda de apps.</p>
            </div>
          </div>
        </div>`}catch{N.hidden=!0}};N.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await g(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),window.addEventListener(`focus`,P,{once:!0})}catch{}finally{t.disabled=!1}}});let I=!1,L=()=>{D(b,x),I||(I=!0,Y(e(`[data-colegas-box]`)))},R=!1,z=()=>{D(S,C),R||(R=!0,F(e(`[data-perfil-box]`)))};y.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-editar]`);if(t){let e=k.find(e=>e.id===t.dataset.editar);e&&te(e,j);return}let n=e.target.closest(`[data-eliminar]`),r=n||e.target.closest(`[data-estado]`);if(r){if(n){let e=k.find(e=>e.id===n.dataset.eliminar);if(!window.confirm(`¿Eliminar ${e?`${e.marca} ${e.modelo} ${e.anio} (${e.codigo})`:`este auto`}? Se borra con sus fotos y no se puede deshacer.`))return}r.disabled=!0;try{n?await _(`borrar`,{id:n.dataset.eliminar}):await _(`estado`,{id:r.dataset.id,estado:r.dataset.estado}),await j()}catch(e){r.disabled=!1,y.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${c(e.message)}</p>`)}}});let B=(t,n,r)=>{t.classList.toggle(`is-soon`,!n),t.tagName===`BUTTON`?t.disabled=!n:(t.toggleAttribute(`aria-disabled`,!n),n?t.removeAttribute(`tabindex`):t.setAttribute(`tabindex`,`-1`)),e(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,t).textContent=r},V=t=>{if(r.hidden=!!t,i.hidden=!t,!t){e(`[data-mc-title]`).textContent=`Mi cuenta`,e(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,o.hidden=!0,w=!1,h.hidden=!0,C.hidden=!0,R=!1,x.hidden=!0,I=!1;return}let n=t.tipo===`agencia`?t.agencia_tipo===`oficial`?`Concesionario oficial${t.marca_oficial?` ${t.marca_oficial}`:``}`:`Agencia multimarca`:`Particular`;e(`[data-mc-title]`).textContent=`Hola, ${t.nombre.split(` `)[0]}`,e(`[data-mc-sub]`).textContent=`${t.nombre} · ${n}`;let s=t.estado===`pendiente`;e(`[data-mc-pending]`).classList.toggle(`hidden`,!s),a.disabled=s,a.classList.toggle(`is-soon`,s),T=t.tipo===`agencia`&&t.estado===`aprobada`,E=t.tipo===`particular`&&t.estado===`activa`,u.setAttribute(`href`,E?`./vender.html`:`./publicar.html`),B(u,T||E,T?`Cargá tu stock con la plantilla de Excel y tus fotos.`:E?`Publicá hasta 2 autos gratis y seguí su estado.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),p.hidden=E,B(p,T,T?`Mirá, pausá o volvé a publicar tus autos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),S.hidden=t.tipo!==`agencia`,t.tipo!==`agencia`&&(C.hidden=!0),t.tipo===`agencia`&&location.hash===`#perfil`&&z(),b.hidden=!T,P(),T||(x.hidden=!0),T&&location.hash===`#colegas`&&L(),!s&&location.hash===`#buscados`&&O(),T&&location.hash===`#mis-autos`&&M()};a.addEventListener(`click`,O),p.addEventListener(`click`,M),S.addEventListener(`click`,z),b.addEventListener(`click`,L),window.addEventListener(`hashchange`,()=>{location.hash===`#colegas`&&T&&L()}),u.addEventListener(`click`,e=>{!T&&!E&&e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>V(e.detail)),V(s())}document.documentElement.classList.add(`js`),o(),i(),re(),r();