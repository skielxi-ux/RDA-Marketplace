import{n as e,r as t}from"./site-BNTt-Gny.js";import{i as n,n as r,o as i,r as a,s as o,t as s}from"./auth-DorRCFPY.js";import{a as c,i as l,n as u,r as d,s as f}from"./fotos-AhM2BSt6.js";import{t as p}from"./ranking-CRer7dxg.js";import{i as m,r as h,t as g}from"./autosApi-OZ5vt2A3.js";import{o as _}from"./catalog-Bvstg05i.js";import{i as v,t as y}from"./modelos-C4UpMEQ_.js";import{t as b}from"./carga-04TQKseX.js";var x=e=>/^\d{11}$/.test(e??``)?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:e??``,S=e=>String(e??``).replace(/^549(\d+)$/,`$1`),C=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${c(t)}</label>
    ${n}
    ${r?`<p class="mt-1.5 text-[13px] text-ink/60">${r}</p>`:``}
  </div>`,w=(e,t,n,r=``)=>`<input id="${e}" name="${t}" value="${c(n??``)}" class="auth-input" ${r} />`,T=(e,t,n)=>`
  <div class="relative">
    <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
    ${l(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
  </div>`,E=(e,t,n=``)=>(n?`<option value="">${c(n)}</option>`:``)+e.map(e=>`<option value="${c(e)}"${e===t?` selected`:``}>${c(e)}</option>`).join(``),D={nombre:`Nombre comercial`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},O=(e,t)=>t==null||t===``?`—`:e===`cuit`?x(t):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),k=e=>{let t=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>D[e]):[];return t.length?`
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${l(`clipboard-check`,`h-4 w-4`)} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${t.map(([t,n])=>`<li>${c(D[t])}: <b>${c(O(t,n))}</b> <span class="opacity-75">(hoy: ${c(O(t,e[t]))})</span></li>`).join(``)}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`:``},A=e=>{let t=d(e.logo??``);return t?`<img src="${c(t)}" alt="Logo de ${c(e.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`:`<span class="grid h-full w-full place-items-center text-ink/35">${l(`store`,`h-10 w-10`)}</span>`};function j(e){let t=e.cambios_pendientes??{},n=n=>Object.hasOwn(t,n)?t[n]:e[n],r=n(`agencia_tipo`)===`oficial`?`oficial`:`multimarca`;return`
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${A(e)}</div>
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
      <div data-perfil-pendientes>${k(e)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${l(`shield-check`,`mt-0.5 h-4 w-4 shrink-0 text-brand`)} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${C(`pf-nombre`,`Nombre comercial`,w(`pf-nombre`,`nombre`,n(`nombre`),`maxlength="80" required autocomplete="organization"`))}
          ${C(`pf-cuit`,`CUIT`,w(`pf-cuit`,`cuit`,x(n(`cuit`)),`inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"`))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${r===`multimarca`?`checked`:``} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${r===`oficial`?`checked`:``} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${r===`oficial`?``:`hidden`}>
            ${C(`pf-marca`,`Marca que representa`,T(`pf-marca`,`marca_oficial`,E(v,n(`marca_oficial`),`Elegí la marca`)))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${C(`pf-ciudad`,`Ciudad`,w(`pf-ciudad`,`ciudad`,e.ciudad,`maxlength="60" required autocomplete="address-level2"`))}
          ${C(`pf-provincia`,`Provincia`,T(`pf-provincia`,`provincia`,E(b,e.provincia,`Elegí la provincia`)))}
          ${C(`pf-direccion`,`Dirección del local`,w(`pf-direccion`,`direccion`,e.direccion,`maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"`))}
          ${C(`pf-horario`,`Horario de atención`,w(`pf-horario`,`horario`,e.horario,`maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${C(`pf-wsp`,`WhatsApp para consultas`,w(`pf-wsp`,`whatsapp_ventas`,S(e.whatsapp_ventas),`type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"`),`Si lo dejás vacío, las consultas llegan al celular con el que ingresás.`)}
          ${C(`pf-email`,`Email`,w(`pf-email`,`email`,e.email,`type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${C(`pf-desc`,`Descripción`,`<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${c(e.descripcion??``)}</textarea>`,`<span data-desc-count>0</span>/600`)}
          </div>
          ${C(`pf-web`,`Sitio web`,w(`pf-web`,`sitio_web`,e.sitio_web,`type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"`))}
          ${C(`pf-ig`,`Instagram`,w(`pf-ig`,`instagram`,e.instagram?`@${e.instagram}`:``,`maxlength="60" placeholder="@tuagencia"`))}
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
  </div>`}var M=400,N=600;async function P(r){r.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${l(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tu perfil…</p>`;let i;try{({perfil:i}=await m(`ver`))}catch(e){r.innerHTML=`<p class="auth-error">${c(e.message)}</p>`;return}r.innerHTML=j(i);let a=e(`[data-perfil-form]`,r),o=e(`[data-perfil-error]`,r),s=e(`[data-perfil-ok]`,r),d=e=>{o.textContent=e||``,o.hidden=!e};e(`[data-perfil-ver]`,r).href=`./agencia.html?id=${encodeURIComponent(i.id)}`;let f=e(`[data-pf-marca]`,r);a.addEventListener(`change`,e=>{e.target.name===`agencia_tipo`&&(f.hidden=e.target.value!==`oficial`)});let p=e(`#pf-desc`,r),h=e(`[data-desc-count]`,r),g=()=>{h.textContent=String(p.value.length)};p.addEventListener(`input`,g),g(),a.addEventListener(`submit`,async t=>{t.preventDefault(),d(``),s.textContent=``;let n=new FormData(a),o=Object.fromEntries([`nombre`,`cuit`,`agencia_tipo`,`marca_oficial`,`ciudad`,`provincia`,`direccion`,`horario`,`whatsapp_ventas`,`email`,`descripcion`,`sitio_web`,`instagram`].map(e=>[e,n.get(e)??``]));if(o.agencia_tipo===`oficial`&&!o.marca_oficial)return d(`Elegí la marca que representa el concesionario.`);if(!o.provincia)return d(`Elegí la provincia.`);let c=e(`[data-perfil-guardar]`,r);c.disabled=!0;try{let t=await m(`guardar`,o);i=t.perfil,e(`[data-perfil-pendientes]`,r).innerHTML=k(i),s.textContent=t.pendiente?`Guardado. El nombre, CUIT o tipo quedan en revisión.`:`Listo, tus datos están actualizados.`,i.instagram&&(e(`#pf-ig`,r).value=`@${i.instagram}`),i.sitio_web&&(e(`#pf-web`,r).value=i.sitio_web)}catch(e){d(e.message)}finally{c.disabled=!1}});let _=e(`[data-crop]`,r),v=e(`[data-crop-canvas]`,r),y=v.getContext(`2d`),b=e(`[data-crop-zoom]`,r),x=null,S=1,C=0,w=0,T=()=>S*Number(b.value),E=(e=y,t=N,n=!0)=>{let r=t/N;e.clearRect(0,0,t,t),n&&(e.fillStyle=`#fff`,e.fillRect(0,0,t,t));let i=T()*r;e.drawImage(x,C*r+(t-x.width*i)/2,w*r+(t-x.height*i)/2,x.width*i,x.height*i)},D=()=>{_.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),x?.close?.(),x=null};e(`[data-logo-input]`,r).addEventListener(`change`,async t=>{let n=t.target.files[0];if(t.target.value=``,n){if(d(``),!/^image\/(jpeg|png|webp)$/.test(n.type))return d(`El logo tiene que ser JPG, PNG o WebP.`);if(n.size>10485760)return d(`El logo pesa demasiado (máximo 10 MB).`);try{x=await createImageBitmap(n)}catch{return d(`No pudimos abrir esa imagen. Probá con otra.`)}S=Math.min(N/x.width,N/x.height),b.value=`1`,C=0,w=0,E(),_.hidden=!1,document.documentElement.classList.add(`overflow-hidden`),e(`[data-crop-ok]`,r).focus()}}),b.addEventListener(`input`,()=>x&&E());let O=null;v.addEventListener(`pointerdown`,e=>{if(!x)return;v.setPointerCapture(e.pointerId);let t=v.getBoundingClientRect();O={px:e.clientX,py:e.clientY,x:C,y:w,k:N/t.width}}),v.addEventListener(`pointermove`,e=>{if(!O)return;let t=N*.75;C=Math.max(-450,Math.min(t,O.x+(e.clientX-O.px)*O.k)),w=Math.max(-450,Math.min(t,O.y+(e.clientY-O.py)*O.k)),E()}),[`pointerup`,`pointercancel`].forEach(e=>v.addEventListener(e,()=>{O=null})),v.tabIndex=0,v.addEventListener(`keydown`,e=>{if(!x)return;let t={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];t&&(e.preventDefault(),C+=t[0],w+=t[1],E()),(e.key===`+`||e.key===`-`)&&(b.value=String(Math.min(4,Math.max(1,Number(b.value)+(e.key===`+`?.1:-.1)))),E())}),e(`[data-crop-cancel]`,r).addEventListener(`click`,D),_.addEventListener(`keydown`,e=>{e.key===`Escape`&&D()}),e(`[data-crop-ok]`,r).addEventListener(`click`,async t=>{let a=t.currentTarget;a.disabled=!0;try{let t=await u(),a=document.createElement(`canvas`);a.width=a.height=M,E(a.getContext(`2d`),M,t===`jpg`);let o=await new Promise(e=>a.toBlob(e,t===`jpg`?`image/jpeg`:`image/webp`,.9));if(!o)throw Error(`No pudimos procesar el logo.`);let{path:c,token:l}=await m(`url_logo`,{formato:t}),{error:d}=await(await n()).storage.from(`mkt-fotos`).uploadToSignedUrl(c,l,o,{contentType:o.type});if(d)throw Error(`Se cortó la subida del logo. Probá de nuevo.`);let f=await m(`guardar_logo`,{path:c});i.logo=f.logo,e(`[data-logo-preview]`,r).innerHTML=A(i),e(`[data-logo-label]`,r).textContent=`Cambiar logo`,e(`[data-logo-quitar]`,r).hidden=!1,D(),s.textContent=`Logo guardado.`}catch(e){D(),d(e.message)}finally{a.disabled=!1}}),e(`[data-logo-quitar]`,r).addEventListener(`click`,async t=>{let n=t.currentTarget;n.disabled=!0;try{await m(`quitar_logo`),i.logo=null,e(`[data-logo-preview]`,r).innerHTML=A(i),e(`[data-logo-label]`,r).textContent=`Subir logo`,n.hidden=!0}catch(e){d(e.message)}finally{n.disabled=!1}}),t(`input, select, textarea`,a).forEach(e=>e.addEventListener(`input`,()=>{s.textContent=``}))}var F=new Date().getFullYear()+1,I=Array.from({length:F-1989},(e,t)=>F-t),L=e=>Math.round(Number(e)).toLocaleString(`es-AR`),R=e=>String(e).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),z=(e,t,n,r)=>`
  <div>
    <label for="${e}" class="auth-label">${c(r)}</label>
    <div class="relative">
      <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
      ${l(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
    </div>
  </div>`,B=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${c(n)}</label>
    <input id="${e}" name="${t}" class="auth-input" ${r} />
  </div>`,V=(e,t)=>`<option value="">${c(t)}</option>`+e.map(e=>`<option value="${c(e)}">${c(e)}</option>`).join(``),H=e=>y[e]??[];function U(){return`
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
        ${z(`cg-marca`,`marca`,V(v,`Elegí la marca`),`Marca *`)}
        <div>
          <label for="cg-modelo" class="auth-label">Modelo *</label>
          <input id="cg-modelo" name="modelo" list="cg-modelos" maxlength="60" required class="auth-input" placeholder="Ej.: Corolla" autocomplete="off" />
          <datalist id="cg-modelos"></datalist>
        </div>
        ${B(`cg-version`,`version`,`Versión`,`maxlength="80" placeholder="Ej.: XEi CVT (opcional)"`)}
        ${z(`cg-desde`,`anio_desde`,V(I,`Indistinto`),`Año desde`)}
        ${z(`cg-hasta`,`anio_hasta`,V(I,`Indistinto`),`Año hasta`)}
        ${B(`cg-km`,`km_max`,`Kilometraje máximo`,`inputmode="numeric" maxlength="9" placeholder="Ej.: 80.000"`)}
        ${B(`cg-color`,`color`,`Color`,`maxlength="30" placeholder="Indistinto"`)}
        ${z(`cg-caja`,`transmision`,V([`Manual`,`Automática`],`Indistinto`),`Caja`)}
        ${z(`cg-comb`,`combustible`,V([`Nafta`,`Diésel`,`Híbrido`,`Eléctrico`,`GNC`],`Indistinto`),`Combustible`)}
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
  </div>`}function W(e){return e?.vinculado?`<p class="flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[14px] text-ok">${l(`circle-check`,`h-4 w-4`)} Los pedidos te llegan también por Telegram${e.como?` (${c(e.como)})`:``}.</p>`:`
    <div class="flex flex-col gap-4 rounded-2xl bg-[#EEF1FB] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[15px]"><b>Recibí los pedidos en Telegram.</b> <span class="text-ink/70">Conectá tu cuenta una sola vez con el bot de Red de Autos.</span></p>
      <button type="button" class="btn-primary h-[46px] shrink-0 justify-center" data-tg-conectar>${l(`message-circle`,`h-4 w-4`)} Conectar Telegram</button>
    </div>`}var G=e=>{let t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/6e4));if(t<1)return`recién`;if(t<60)return`hace ${t} min`;let n=Math.round(t/60);if(n<24)return`hace ${n} h`;let r=Math.round(n/24);return r===1?`ayer`:`hace ${r} días`};function K(e){let t=e.anio_desde&&e.anio_hasta?e.anio_desde===e.anio_hasta?`${e.anio_desde}`:`${e.anio_desde} a ${e.anio_hasta}`:e.anio_desde?`Desde ${e.anio_desde}`:e.anio_hasta?`Hasta ${e.anio_hasta}`:``,n=[t&&[l(`calendar`,`h-3.5 w-3.5`),t],e.km_max!=null&&[l(`gauge`,`h-3.5 w-3.5`),`Hasta ${L(e.km_max)} km`],e.transmision&&[l(`cog`,`h-3.5 w-3.5`),e.transmision],e.combustible&&[l(`fuel`,`h-3.5 w-3.5`),e.combustible],e.color&&[l(`palette`,`h-3.5 w-3.5`),e.color]].filter(Boolean),r=e.agencia,i=d(r.logo??``),a=/^\d{10,15}$/.test(r.whatsapp??``)?r.whatsapp:``,o=[e.marca,e.modelo,e.version].filter(Boolean).join(` `),s=`Hola ${r.nombre}, vi en la Red de colegas de Red de Autos que buscás ${o}${t?` (${t})`:``}. Tengo uno que te puede servir.`,u=e.estado===`cerrado`;return`
  <li class="colega-card ${u?`opacity-60`:``}" data-pedido="${c(e.id)}">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium uppercase tracking-wide text-brand">${e.mio?`Tu pedido`:`Busca`} · <span class="normal-case tracking-normal text-ink/55">${c(G(e.created_at))}</span></p>
      ${u?`<span class="rounded-full bg-ink/10 px-2.5 py-0.5 text-[12px] font-medium">Cerrado</span>`:``}
    </div>
    <h3 class="mt-1 text-[20px] font-bold leading-tight">${c(o)}</h3>
    ${n.length?`<ul class="mt-3 flex flex-wrap gap-2">${n.map(([e,t])=>`<li class="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px]">${e}${c(t)}</li>`).join(``)}</ul>`:``}
    ${e.presupuesto?`<p class="mt-3 text-[15px]">Presupuesto: <b>${c(e.moneda===`USD`?`USD`:`$`)} ${c(L(e.presupuesto))}</b></p>`:``}
    ${e.comentario?`<p class="mt-2 text-[15px] text-ink/75">“${c(e.comentario)}”</p>`:``}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4">
      <a href="./agencia.html?id=${c(encodeURIComponent(r.id))}" class="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition-colors hover:text-brand">
        ${i?`<img src="${c(i)}" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[13px] font-bold text-white" aria-hidden="true">${c(R(r.nombre))}</span>`}
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
  </li>`}var q=e=>String(e??``).normalize(`NFD`).replace(/[̀-ͯ]/g,``).toLowerCase();async function J(n){n.innerHTML=U();let r=e(`[data-colega-form]`,n),i=e(`[data-colega-error]`,n),o=e(`[data-cg-list]`,n),s=e(`[data-cg-count]`,n),l=e(`[data-cg-q]`,n),u=e=>{i.textContent=e||``,i.hidden=!e},d=[],f=`todos`,p=e(`[data-tg-box]`,n),m=async()=>{try{p.innerHTML=W(await h(`telegram_estado`))}catch{p.innerHTML=``}};p.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await h(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),p.insertAdjacentHTML(`beforeend`,`<p class="mt-2 text-[14px] text-ink/70">Se abrió Telegram: tocá <b>Iniciar</b> en el bot y volvé acá.</p>`),window.addEventListener(`focus`,m,{once:!0})}catch(e){p.insertAdjacentHTML(`beforeend`,`<p class="auth-error mt-2">${c(e.message)}</p>`)}finally{t.disabled=!1}}});let g=()=>{let e=q(l.value.trim()),t=d.filter(e=>f===`mios`?e.mio:!e.mio&&e.estado===`activo`).filter(t=>!e||q(`${t.marca} ${t.modelo} ${t.version??``} ${t.agencia.nombre} ${t.agencia.ciudad}`).includes(e));o.innerHTML=t.map(K).join(``)||`<li class="rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60 lg:col-span-2">${e?`No hay pedidos con esa búsqueda.`:f===`mios`?`Todavía no pediste ningún auto a los colegas.`:`No hay pedidos de colegas por ahora.`}</li>`,s.textContent=`${t.length} ${t.length===1?`pedido`:`pedidos`}`},_=async()=>{try{({pedidos:d}=await h(`listar`)),g()}catch(e){o.innerHTML=`<li class="auth-error lg:col-span-2">${c(e.message)}</li>`}};t(`[data-cg-tab]`,n).forEach(e=>e.addEventListener(`click`,()=>{f=e.dataset.cgTab,t(`[data-cg-tab]`,n).forEach(t=>{let n=t===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-selected`,String(n))}),g()}));let v;l.addEventListener(`input`,()=>{clearTimeout(v),v=setTimeout(g,200)}),o.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-cg-lotengo]`);if(t){let e=d.find(e=>e.id===t.dataset.cgLotengo);e&&!e.respondi&&(e.respondi=!0,h(`lo_tengo`,{id:e.id}).then(()=>g()).catch(()=>{}));return}let n=e.target.closest(`[data-cg-cerrar]`);if(n){n.disabled=!0;try{await h(`cerrar`,{id:n.dataset.cgCerrar}),await _()}catch(e){n.disabled=!1,u(e.message)}}});let y=e(`#cg-marca`,n);y.addEventListener(`change`,()=>{e(`#cg-modelos`,n).innerHTML=H(y.value).map(e=>`<option value="${c(e)}"></option>`).join(``)}),r.addEventListener(`submit`,async t=>{t.preventDefault(),u(``);let i=Object.fromEntries(new FormData(r));if(!i.marca)return u(`Elegí la marca.`);if(!String(i.modelo).trim())return u(`Escribí el modelo.`);if(i.anio_desde&&i.anio_hasta&&Number(i.anio_desde)>Number(i.anio_hasta))return u(`El año "desde" tiene que ser menor o igual al "hasta".`);let a=e(`[data-colega-enviar]`,n);a.disabled=!0;try{let t=await h(`crear`,i);r.reset(),e(`[data-colega-details]`,n).open=!1,n.insertAdjacentHTML(`afterbegin`,`<p class="mb-6 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[15px] text-ok" role="status" data-cg-ok>Listo: tu pedido les llegó a ${c(t.avisadas)} ${t.avisadas===1?`agencia`:`agencias`}${t.telegram?` (${c(t.telegram)} por Telegram)`:``}.</p>`),setTimeout(()=>e(`[data-cg-ok]`,n)?.remove(),8e3),e(`[data-cg-tab="mios"]`,n).click(),await _()}catch(e){u(e.message)}finally{a.disabled=!1}}),await Promise.all([m(),_()]);try{await h(`leer`),a()}catch{}}function Y(){let r=e(`[data-mc-guest]`),i=e(`[data-mc-panel]`),a=e(`[data-mc-buscados]`),o=e(`#buscados`),u=e(`[data-mc-publicar]`),m=e(`[data-mc-misautos]`),v=e(`#mis-autos`),y=e(`[data-mis-autos]`),b=e(`[data-mc-colegas]`),x=e(`#colegas`),S=e(`[data-mc-perfil]`),C=e(`#perfil`),w=!1,T=!1,E=(e,n)=>{t(`[data-mc-panel] .mc-action[aria-controls]`).forEach(t=>{if(t===e)return;t.classList.remove(`is-active`),t.setAttribute(`aria-expanded`,`false`);let n=document.getElementById(t.getAttribute(`aria-controls`));n&&(n.hidden=!0)}),n.hidden=!1,e.setAttribute(`aria-expanded`,`true`),e.classList.add(`is-active`),n.scrollIntoView({behavior:`smooth`,block:`start`})},D=async()=>{E(a,o),w||(w=!0,await p(o,await n()))},O=e=>{if(!e.length){y.innerHTML=`
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
            <div class="flex shrink-0 gap-2">
              ${n?``:`<a href="${c(_({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${l(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${n?`publicado`:`pausado`}" data-id="${c(e.id)}">${n?`Volver a publicar`:`Pausar`}</button>`}
            </div>
          </li>`}).join(``)}
      </ul>`},k=async()=>{y.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${l(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let{autos:e}=await g(`mios`);O(e??[])}catch(e){y.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${c(e.message)}</p>`}},A=()=>{E(m,v),k()},j=e(`[data-mc-telegram]`),M=async()=>{if(!T)j.hidden=!0;else try{let{vinculado:e}=await h(`telegram_estado`);if(j.hidden=e,e)return;j.innerHTML=`
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
        </div>`}catch{j.hidden=!0}};j.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await h(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),window.addEventListener(`focus`,M,{once:!0})}catch{}finally{t.disabled=!1}}});let N=!1,F=()=>{E(b,x),N||(N=!0,J(e(`[data-colegas-box]`)))},I=!1,L=()=>{E(S,C),I||(I=!0,P(e(`[data-perfil-box]`)))};y.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-estado]`);if(t){t.disabled=!0;try{await g(`estado`,{id:t.dataset.id,estado:t.dataset.estado}),await k()}catch(e){t.disabled=!1,y.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${c(e.message)}</p>`)}}});let R=(t,n,r)=>{t.classList.toggle(`is-soon`,!n),t.tagName===`BUTTON`?t.disabled=!n:(t.toggleAttribute(`aria-disabled`,!n),n?t.removeAttribute(`tabindex`):t.setAttribute(`tabindex`,`-1`)),e(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,t).textContent=r},z=t=>{if(r.hidden=!!t,i.hidden=!t,!t){e(`[data-mc-title]`).textContent=`Mi cuenta`,e(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,o.hidden=!0,w=!1,v.hidden=!0,C.hidden=!0,I=!1,x.hidden=!0,N=!1;return}let n=t.tipo===`agencia`?t.agencia_tipo===`oficial`?`Concesionario oficial${t.marca_oficial?` ${t.marca_oficial}`:``}`:`Agencia multimarca`:`Particular`;e(`[data-mc-title]`).textContent=`Hola, ${t.nombre.split(` `)[0]}`,e(`[data-mc-sub]`).textContent=`${t.nombre} · ${n}`;let s=t.estado===`pendiente`;e(`[data-mc-pending]`).classList.toggle(`hidden`,!s),a.disabled=s,a.classList.toggle(`is-soon`,s),T=t.tipo===`agencia`&&t.estado===`aprobada`,R(u,T,T?`Cargá tu stock con la plantilla de Excel y tus fotos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),R(m,T,T?`Mirá, pausá o volvé a publicar tus autos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),S.hidden=t.tipo!==`agencia`,t.tipo!==`agencia`&&(C.hidden=!0),t.tipo===`agencia`&&location.hash===`#perfil`&&L(),b.hidden=!T,M(),T||(x.hidden=!0),T&&location.hash===`#colegas`&&F(),!s&&location.hash===`#buscados`&&D(),T&&location.hash===`#mis-autos`&&A()};a.addEventListener(`click`,D),m.addEventListener(`click`,A),S.addEventListener(`click`,L),b.addEventListener(`click`,F),window.addEventListener(`hashchange`,()=>{location.hash===`#colegas`&&T&&F()}),u.addEventListener(`click`,e=>{T||e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>z(e.detail)),z(s())}document.documentElement.classList.add(`js`),o(),i(),Y(),r();