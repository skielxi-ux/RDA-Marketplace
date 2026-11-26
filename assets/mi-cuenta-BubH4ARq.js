import{n as e,t}from"./dom-C1X2dB9K.js";import{a as n,c as r,i,n as a,s as o,t as s}from"./auth-Ct2Oz9NK.js";import{i as c,n as l,t as u}from"./icons-BCeff-oe.js";import{t as d}from"./ranking-MEihF3Kb.js";import{i as f,n as p,o as m,s as h,t as g}from"./autosApi-C41y-rlb.js";import{o as _}from"./catalog-C6oEt7qm.js";import{i as v,t as y}from"./modelos-BZRcky_i.js";import{t as b}from"./carga-9OZX3V5K.js";import{n as x,r as S,t as C}from"./fotos-B_fbhPIY.js";import{n as w,r as ee,t as T}from"./oferta-o_gfkh8Z.js";import{a as E,i as D,r as O,t as k}from"./alertaListado-PtCeqrU_.js";import{t as A}from"./home2-KZz3WobX.js";var j=e=>/^\d{11}$/.test(e??``)?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:e??``,te=e=>String(e??``).replace(/^549(\d+)$/,`$1`),M=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${l(t)}</label>
    ${n}
    ${r?`<p class="mt-1.5 text-[13px] text-ink/60">${r}</p>`:``}
  </div>`,N=(e,t,n,r=``)=>`<input id="${e}" name="${t}" value="${l(n??``)}" class="auth-input" ${r} />`,P=(e,t,n)=>`
  <div class="relative">
    <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
    ${u(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
  </div>`,F=(e,t,n=``)=>(n?`<option value="">${l(n)}</option>`:``)+e.map(e=>`<option value="${l(e)}"${e===t?` selected`:``}>${l(e)}</option>`).join(``),I={nombre:`Nombre comercial`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},ne=(e,t)=>t==null||t===``?`—`:e===`cuit`?j(t):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),L=e=>{let t=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>I[e]):[];return t.length?`
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${u(`clipboard-check`,`h-4 w-4`)} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${t.map(([t,n])=>`<li>${l(I[t])}: <b>${l(ne(t,n))}</b> <span class="opacity-75">(hoy: ${l(ne(t,e[t]))})</span></li>`).join(``)}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`:``},R=e=>{let t=S(e.logo??``);return t?`<img src="${l(t)}" alt="Logo de ${l(e.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`:`<span class="grid h-full w-full place-items-center text-ink/35">${u(`store`,`h-10 w-10`)}</span>`};function z(e){return e.direccion?e.lat==null?`<span class="font-medium text-[#8A5A00]">No encontramos esa dirección en el mapa. Revisala (calle y número, ej. Av. Mitre 181) y guardá de nuevo. Mientras tanto se muestra la zona de tu ciudad.</span>`:`<a href="https://www.openstreetmap.org/?mlat=${Number(e.lat)}&mlon=${Number(e.lng)}#map=18/${Number(e.lat)}/${Number(e.lng)}" target="_blank" rel="noopener noreferrer" class="font-medium text-ok hover:underline">✓ Tu local está ubicado en el mapa · ver dónde quedó</a>`:`<span class="text-ink/60">Cargá calle y número para que tus autos muestren el local exacto en el mapa.</span>`}function re(e){let t=e.cambios_pendientes??{},n=n=>Object.hasOwn(t,n)?t[n]:e[n],r=n(`agencia_tipo`)===`oficial`?`oficial`:`multimarca`;return`
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${R(e)}</div>
        <p class="mt-3 text-[13px] text-ink/60">JPG, PNG o WebP. Lo recortás en cuadrado antes de guardarlo.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label class="btn-primary h-[48px] cursor-pointer justify-center">${u(`images`,`h-4 w-4`)} <span data-logo-label>${e.logo?`Cambiar logo`:`Subir logo`}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-logo-input /></label>
          <button type="button" class="btn-outline h-[44px] justify-center" data-logo-quitar ${e.logo?``:`hidden`}>${u(`x`,`h-4 w-4`)} Quitar logo</button>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <form class="space-y-8" data-perfil-form novalidate>
      <div data-perfil-pendientes>${L(e)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${u(`shield-check`,`mt-0.5 h-4 w-4 shrink-0 text-brand`)} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${M(`pf-nombre`,`Nombre comercial`,N(`pf-nombre`,`nombre`,n(`nombre`),`maxlength="80" required autocomplete="organization"`))}
          ${M(`pf-cuit`,`CUIT`,N(`pf-cuit`,`cuit`,j(n(`cuit`)),`inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"`))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${r===`multimarca`?`checked`:``} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${r===`oficial`?`checked`:``} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${r===`oficial`?``:`hidden`}>
            ${M(`pf-marca`,`Marca que representa`,P(`pf-marca`,`marca_oficial`,F(v,n(`marca_oficial`),`Elegí la marca`)))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${M(`pf-ciudad`,`Ciudad`,N(`pf-ciudad`,`ciudad`,e.ciudad,`maxlength="60" required autocomplete="address-level2"`))}
          ${M(`pf-provincia`,`Provincia`,P(`pf-provincia`,`provincia`,F(b,e.provincia,`Elegí la provincia`)))}
          ${M(`pf-direccion`,`Dirección del local`,N(`pf-direccion`,`direccion`,e.direccion,`maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"`))}
          <p class="text-[13px] sm:col-span-2" data-perfil-mapa>${z(e)}</p>
          ${M(`pf-horario`,`Horario de atención`,N(`pf-horario`,`horario`,e.horario,`maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${M(`pf-wsp`,`WhatsApp para consultas`,N(`pf-wsp`,`whatsapp_ventas`,te(e.whatsapp_ventas),`type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"`),`Si lo dejás vacío, las consultas llegan al celular con el que ingresás.`)}
          ${M(`pf-email`,`Email`,N(`pf-email`,`email`,e.email,`type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${M(`pf-desc`,`Descripción`,`<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${l(e.descripcion??``)}</textarea>`,`<span data-desc-count>0</span>/600`)}
          </div>
          ${M(`pf-web`,`Sitio web`,N(`pf-web`,`sitio_web`,e.sitio_web,`type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"`))}
          ${M(`pf-ig`,`Instagram`,N(`pf-ig`,`instagram`,e.instagram?`@${e.instagram}`:``,`maxlength="60" placeholder="@tuagencia"`))}
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
            ${M(`pf-comision`,`Comisión que pagás`,`<select id="pf-comision" name="comision_independientes" class="auth-input">${[1,2,3,4].map(t=>`<option value="${t}"${Number(e.comision_independientes??2)===t?` selected`:``}>${t} %</option>`).join(``)}</select>`,`Sobre el precio final de venta del auto.`)}
          </div>
        </div>
      </fieldset>

      <p class="auth-error" role="alert" data-perfil-error hidden></p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-perfil-guardar>${u(`check`,`h-4 w-4`)} <span>Guardar cambios</span></button>
        <a href="#" class="link-view justify-center" data-perfil-ver target="_blank" rel="noopener">Ver mi página ${u(`arrow-up-right`,`h-4 w-4`)}</a>
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
        <span class="sr-only">Acercar o alejar</span>${u(`search`,`h-4 w-4 text-ink/50`)}
        <input type="range" min="1" max="4" step="0.01" value="1" class="w-full accent-[#405FF2]" data-crop-zoom />
      </label>
      <div class="mt-6 flex gap-3">
        <button type="button" class="btn-outline h-[48px] flex-1 justify-center" data-crop-cancel>Cancelar</button>
        <button type="button" class="btn-primary h-[48px] flex-1 justify-center" data-crop-ok>${u(`check`,`h-4 w-4`)} Guardar logo</button>
      </div>
    </div>
  </div>`}var B=400,V=600;async function ie(r){r.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${u(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tu perfil…</p>`;let i;try{({perfil:i}=await m(`ver`))}catch(e){r.innerHTML=`<p class="auth-error">${l(e.message)}</p>`;return}r.innerHTML=re(i);let a=t(`[data-perfil-form]`,r),o=t(`[data-perfil-error]`,r),s=t(`[data-perfil-ok]`,r),c=e=>{o.textContent=e||``,o.hidden=!e};t(`[data-perfil-ver]`,r).href=`./agencia.html?id=${encodeURIComponent(i.id)}`;let d=t(`[data-pf-marca]`,r);a.addEventListener(`change`,e=>{e.target.name===`agencia_tipo`&&(d.hidden=e.target.value!==`oficial`)});let f=t(`#pf-desc`,r),p=t(`[data-desc-count]`,r),h=()=>{p.textContent=String(f.value.length)};f.addEventListener(`input`,h),h(),a.addEventListener(`change`,e=>{e.target.name===`acepta_independientes`&&(t(`[data-pf-comision]`,r).hidden=e.target.value!==`si`)}),a.addEventListener(`submit`,async e=>{e.preventDefault(),c(``),s.textContent=``;let n=new FormData(a),o=Object.fromEntries([`nombre`,`cuit`,`agencia_tipo`,`marca_oficial`,`ciudad`,`provincia`,`direccion`,`horario`,`whatsapp_ventas`,`email`,`descripcion`,`sitio_web`,`instagram`,`acepta_independientes`,`comision_independientes`].map(e=>[e,n.get(e)??``]));if(o.agencia_tipo===`oficial`&&!o.marca_oficial)return c(`Elegí la marca que representa el concesionario.`);if(!o.provincia)return c(`Elegí la provincia.`);let l=t(`[data-perfil-guardar]`,r);l.disabled=!0;try{let e=await m(`guardar`,o);i=e.perfil,t(`[data-perfil-pendientes]`,r).innerHTML=L(i),t(`[data-perfil-mapa]`,r).innerHTML=z(i),s.textContent=e.pendiente?`Guardado. El nombre, CUIT o tipo quedan en revisión.`:`Listo, tus datos están actualizados.`,i.instagram&&(t(`#pf-ig`,r).value=`@${i.instagram}`),i.sitio_web&&(t(`#pf-web`,r).value=i.sitio_web)}catch(e){c(e.message)}finally{l.disabled=!1}});let g=t(`[data-crop]`,r),_=t(`[data-crop-canvas]`,r),v=_.getContext(`2d`),y=t(`[data-crop-zoom]`,r),b=null,S=1,C=0,w=0,ee=()=>S*Number(y.value),T=(e=v,t=V,n=!0)=>{let r=t/V;e.clearRect(0,0,t,t),n&&(e.fillStyle=`#fff`,e.fillRect(0,0,t,t));let i=ee()*r;e.drawImage(b,C*r+(t-b.width*i)/2,w*r+(t-b.height*i)/2,b.width*i,b.height*i)},E=()=>{g.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),b?.close?.(),b=null};t(`[data-logo-input]`,r).addEventListener(`change`,async e=>{let n=e.target.files[0];if(e.target.value=``,n){if(c(``),!/^image\/(jpeg|png|webp)$/.test(n.type))return c(`El logo tiene que ser JPG, PNG o WebP.`);if(n.size>10485760)return c(`El logo pesa demasiado (máximo 10 MB).`);try{b=await createImageBitmap(n)}catch{return c(`No pudimos abrir esa imagen. Probá con otra.`)}S=Math.min(V/b.width,V/b.height),y.value=`1`,C=0,w=0,T(),g.hidden=!1,document.documentElement.classList.add(`overflow-hidden`),t(`[data-crop-ok]`,r).focus()}}),y.addEventListener(`input`,()=>b&&T());let D=null;_.addEventListener(`pointerdown`,e=>{if(!b)return;_.setPointerCapture(e.pointerId);let t=_.getBoundingClientRect();D={px:e.clientX,py:e.clientY,x:C,y:w,k:V/t.width}}),_.addEventListener(`pointermove`,e=>{if(!D)return;let t=V*.75;C=Math.max(-450,Math.min(t,D.x+(e.clientX-D.px)*D.k)),w=Math.max(-450,Math.min(t,D.y+(e.clientY-D.py)*D.k)),T()}),[`pointerup`,`pointercancel`].forEach(e=>_.addEventListener(e,()=>{D=null})),_.tabIndex=0,_.addEventListener(`keydown`,e=>{if(!b)return;let t={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];t&&(e.preventDefault(),C+=t[0],w+=t[1],T()),(e.key===`+`||e.key===`-`)&&(y.value=String(Math.min(4,Math.max(1,Number(y.value)+(e.key===`+`?.1:-.1)))),T())}),t(`[data-crop-cancel]`,r).addEventListener(`click`,E),g.addEventListener(`keydown`,e=>{e.key===`Escape`&&E()}),t(`[data-crop-ok]`,r).addEventListener(`click`,async e=>{let a=e.currentTarget;a.disabled=!0;try{let e=await x(),a=document.createElement(`canvas`);a.width=a.height=B,T(a.getContext(`2d`),B,e===`jpg`);let o=await new Promise(t=>a.toBlob(t,e===`jpg`?`image/jpeg`:`image/webp`,.9));if(!o)throw Error(`No pudimos procesar el logo.`);let{path:c,token:l}=await m(`url_logo`,{formato:e}),{error:u}=await(await n()).storage.from(`mkt-fotos`).uploadToSignedUrl(c,l,o,{contentType:o.type});if(u)throw Error(`Se cortó la subida del logo. Probá de nuevo.`);let d=await m(`guardar_logo`,{path:c});i.logo=d.logo,t(`[data-logo-preview]`,r).innerHTML=R(i),t(`[data-logo-label]`,r).textContent=`Cambiar logo`,t(`[data-logo-quitar]`,r).hidden=!1,E(),s.textContent=`Logo guardado.`}catch(e){E(),c(e.message)}finally{a.disabled=!1}}),t(`[data-logo-quitar]`,r).addEventListener(`click`,async e=>{let n=e.currentTarget;n.disabled=!0;try{await m(`quitar_logo`),i.logo=null,t(`[data-logo-preview]`,r).innerHTML=R(i),t(`[data-logo-label]`,r).textContent=`Subir logo`,n.hidden=!0}catch(e){c(e.message)}finally{n.disabled=!1}}),e(`input, select, textarea`,a).forEach(e=>e.addEventListener(`input`,()=>{s.textContent=``}))}var H=new Date().getFullYear()+1,U=Array.from({length:H-1989},(e,t)=>H-t),ae=e=>Math.round(Number(e)).toLocaleString(`es-AR`),oe=e=>String(e).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),W=(e,t,n,r)=>`
  <div>
    <label for="${e}" class="auth-label">${l(r)}</label>
    <div class="relative">
      <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
      ${u(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
    </div>
  </div>`,G=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${l(n)}</label>
    <input id="${e}" name="${t}" class="auth-input" ${r} />
  </div>`,K=(e,t)=>`<option value="">${l(t)}</option>`+e.map(e=>`<option value="${l(e)}">${l(e)}</option>`).join(``),se=e=>y[e]??[];function q(){return`
  <div class="space-y-8">
    <div data-tg-box></div>

    <!-- Nuevo pedido -->
    <details class="colega-form group rounded-[20px] border border-line bg-white" data-colega-details>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <span class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">${u(`plus`,`h-5 w-5`)}</span>
          <span><span class="block text-[18px] font-bold">Pedir un auto a los colegas</span>
          <span class="block text-[14px] text-ink/70">¿Un cliente busca algo que no tenés? Avisale a todas las agencias de la red.</span></span>
        </span>
        ${u(`chevron-down`,`h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180`)}
      </summary>
      <form class="grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3" data-colega-form novalidate>
        ${W(`cg-marca`,`marca`,K(v,`Elegí la marca`),`Marca *`)}
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
              ${u(`chevron-down`,`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2`)}
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
          <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-colega-enviar>${u(`handshake`,`h-4 w-4`)} <span>Enviar a los colegas</span></button>
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
          ${u(`search`,`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50`)}
        </label>
      </div>
      <p class="mt-4 text-[14px] text-ink/60" data-cg-count aria-live="polite"></p>
      <ul class="mt-4 grid gap-4 lg:grid-cols-2" data-cg-list></ul>
    </div>
  </div>`}function J(e){return e?.vinculado?`<p class="flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[14px] text-ok">${u(`circle-check`,`h-4 w-4`)} Los pedidos te llegan también por Telegram${e.como?` (${l(e.como)})`:``}.</p>`:`
    <div class="flex flex-col gap-4 rounded-2xl bg-[#EEF1FB] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[15px]"><b>Recibí los pedidos en Telegram.</b> <span class="text-ink/70">Conectá tu cuenta una sola vez con el bot de Red de Autos.</span></p>
      <button type="button" class="btn-primary h-[46px] shrink-0 justify-center" data-tg-conectar>${u(`telegram`,`h-4 w-4`)} Conectar Telegram</button>
    </div>`}var ce=e=>{let t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/6e4));if(t<1)return`recién`;if(t<60)return`hace ${t} min`;let n=Math.round(t/60);if(n<24)return`hace ${n} h`;let r=Math.round(n/24);return r===1?`ayer`:`hace ${r} días`};function le(e){let t=e.anio_desde&&e.anio_hasta?e.anio_desde===e.anio_hasta?`${e.anio_desde}`:`${e.anio_desde} a ${e.anio_hasta}`:e.anio_desde?`Desde ${e.anio_desde}`:e.anio_hasta?`Hasta ${e.anio_hasta}`:``,n=[t&&[u(`calendar`,`h-3.5 w-3.5`),t],e.km_max!=null&&[u(`gauge`,`h-3.5 w-3.5`),`Hasta ${ae(e.km_max)} km`],e.transmision&&[u(`cog`,`h-3.5 w-3.5`),e.transmision],e.combustible&&[u(`fuel`,`h-3.5 w-3.5`),e.combustible],e.color&&[u(`palette`,`h-3.5 w-3.5`),e.color]].filter(Boolean),r=e.agencia,i=S(r.logo??``),a=/^\d{10,15}$/.test(r.whatsapp??``)?r.whatsapp:``,o=[e.marca,e.modelo,e.version].filter(Boolean).join(` `),s=`Hola ${r.nombre}, vi en la Red de colegas de Red de Autos que buscás ${o}${t?` (${t})`:``}. Tengo uno que te puede servir.`,c=e.estado===`cerrado`;return`
  <li class="colega-card ${c?`opacity-60`:``}" data-pedido="${l(e.id)}">
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium uppercase tracking-wide text-brand">${e.mio?`Tu pedido`:`Busca`} · <span class="normal-case tracking-normal text-ink/55">${l(ce(e.created_at))}</span></p>
      ${c?`<span class="rounded-full bg-ink/10 px-2.5 py-0.5 text-[12px] font-medium">Cerrado</span>`:``}
    </div>
    <h3 class="mt-1 text-[20px] font-bold leading-tight">${l(o)}</h3>
    ${n.length?`<ul class="mt-3 flex flex-wrap gap-2">${n.map(([e,t])=>`<li class="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px]">${e}${l(t)}</li>`).join(``)}</ul>`:``}
    ${e.presupuesto?`<p class="mt-3 text-[15px]">Presupuesto: <b>${l(e.moneda===`USD`?`USD`:`$`)} ${l(ae(e.presupuesto))}</b></p>`:``}
    ${e.comentario?`<p class="mt-2 text-[15px] text-ink/75">“${l(e.comentario)}”</p>`:``}
    <div class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4">
      <a href="./agencia.html?id=${l(encodeURIComponent(r.id))}" class="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition-colors hover:text-brand">
        ${i?`<img src="${l(i)}" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[13px] font-bold text-white" aria-hidden="true">${l(oe(r.nombre))}</span>`}
        <span class="min-w-0"><span class="block truncate font-bold">${l(r.nombre)}</span><span class="block truncate text-[13px] text-ink/60">${l([r.ciudad,r.provincia].filter(Boolean).join(`, `))}</span></span>
      </a>
      ${e.mio?c?`<p class="text-[13px] text-ink/60">Avisado a ${l(e.avisadas)} ${e.avisadas===1?`agencia`:`agencias`}</p>`:`<div class="flex shrink-0 items-center gap-3"><span class="whitespace-nowrap text-[13px] text-ink/60">Avisado a ${l(e.avisadas)}</span><button type="button" class="btn-outline h-[42px] whitespace-nowrap !px-4 text-[14px]" data-cg-cerrar="${l(e.id)}">${u(`check`,`h-4 w-4`)} Ya lo conseguí</button></div>`:a&&!c?`<div class="flex shrink-0 gap-2">
            <a href="https://wa.me/${l(a)}?text=${l(encodeURIComponent(s))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[44px] whitespace-nowrap !px-4 text-[14px]" data-cg-lotengo="${l(e.id)}">${u(`whatsapp`,`h-4 w-4`)} ${e.respondi?`Escribile`:`Lo tengo`}</a>
            <a href="tel:+${l(a)}" class="btn-outline h-[44px] !px-3.5" aria-label="Llamar a ${l(r.nombre)}">${u(`phone`,`h-4 w-4`)}</a>
          </div>`:``}
    </div>
    ${e.mio&&e.lo_tienen?.length?`
    <div class="mt-4 rounded-xl bg-[#E8F5E9] p-4">
      <p class="text-[14px] font-bold text-ok">${u(`circle-check`,`mr-1 inline h-4 w-4`)} ${e.lo_tienen.length===1?`Una agencia lo tiene`:`${l(e.lo_tienen.length)} agencias lo tienen`}</p>
      <ul class="mt-2 space-y-2">${e.lo_tienen.map(e=>{let t=/^\d{10,15}$/.test(e.whatsapp??``)?e.whatsapp:``;return`<li class="flex flex-wrap items-center justify-between gap-2 text-[14px]"><span><b>${l(e.nombre)}</b>${e.ciudad?` · ${l(e.ciudad)}`:``}</span>${t?`<a href="https://wa.me/${l(t)}?text=${l(encodeURIComponent(`Hola ${e.nombre}, vi que tenés un ${o} para mi pedido en la Red de colegas.`))}" target="_blank" rel="noopener noreferrer" class="link-view">${u(`message-circle`,`h-4 w-4`)} WhatsApp</a>`:``}</li>`}).join(``)}</ul>
    </div>`:``}
    ${!e.mio&&e.respondi?`<p class="mt-3 text-[13px] text-ok">${u(`circle-check`,`mr-1 inline h-3.5 w-3.5`)} Ya le avisaste que lo tenés.</p>`:``}
  </li>`}var ue=e=>String(e??``).normalize(`NFD`).replace(/[̀-ͯ]/g,``).toLowerCase();async function de(n){n.innerHTML=q();let r=t(`[data-colega-form]`,n),a=t(`[data-colega-error]`,n),o=t(`[data-cg-list]`,n),s=t(`[data-cg-count]`,n),c=t(`[data-cg-q]`,n),u=e=>{a.textContent=e||``,a.hidden=!e},d=[],p=`todos`,m=t(`[data-tg-box]`,n),h=async()=>{try{m.innerHTML=J(await f(`telegram_estado`))}catch{m.innerHTML=``}};m.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await f(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),m.insertAdjacentHTML(`beforeend`,`<p class="mt-2 text-[14px] text-ink/70">Se abrió Telegram: tocá <b>Iniciar</b> en el bot y volvé acá.</p>`),window.addEventListener(`focus`,h,{once:!0})}catch(e){m.insertAdjacentHTML(`beforeend`,`<p class="auth-error mt-2">${l(e.message)}</p>`)}finally{t.disabled=!1}}});let g=()=>{let e=ue(c.value.trim()),t=d.filter(e=>p===`mios`?e.mio:!e.mio&&e.estado===`activo`).filter(t=>!e||ue(`${t.marca} ${t.modelo} ${t.version??``} ${t.agencia.nombre} ${t.agencia.ciudad}`).includes(e));o.innerHTML=t.map(le).join(``)||`<li class="rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60 lg:col-span-2">${e?`No hay pedidos con esa búsqueda.`:p===`mios`?`Todavía no pediste ningún auto a los colegas.`:`No hay pedidos de colegas por ahora.`}</li>`,s.textContent=`${t.length} ${t.length===1?`pedido`:`pedidos`}`},_=async()=>{try{({pedidos:d}=await f(`listar`)),g()}catch(e){o.innerHTML=`<li class="auth-error lg:col-span-2">${l(e.message)}</li>`}};e(`[data-cg-tab]`,n).forEach(t=>t.addEventListener(`click`,()=>{p=t.dataset.cgTab,e(`[data-cg-tab]`,n).forEach(e=>{let n=e===t;e.classList.toggle(`is-active`,n),e.setAttribute(`aria-selected`,String(n))}),g()}));let v;c.addEventListener(`input`,()=>{clearTimeout(v),v=setTimeout(g,200)}),o.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-cg-lotengo]`);if(t){let e=d.find(e=>e.id===t.dataset.cgLotengo);e&&!e.respondi&&(e.respondi=!0,f(`lo_tengo`,{id:e.id}).then(()=>g()).catch(()=>{}));return}let n=e.target.closest(`[data-cg-cerrar]`);if(n){n.disabled=!0;try{await f(`cerrar`,{id:n.dataset.cgCerrar}),await _()}catch(e){n.disabled=!1,u(e.message)}}});let y=t(`#cg-marca`,n);y.addEventListener(`change`,()=>{t(`#cg-modelos`,n).innerHTML=se(y.value).map(e=>`<option value="${l(e)}"></option>`).join(``)}),r.addEventListener(`submit`,async e=>{e.preventDefault(),u(``);let i=Object.fromEntries(new FormData(r));if(!i.marca)return u(`Elegí la marca.`);if(!String(i.modelo).trim())return u(`Escribí el modelo.`);if(i.anio_desde&&i.anio_hasta&&Number(i.anio_desde)>Number(i.anio_hasta))return u(`El año "desde" tiene que ser menor o igual al "hasta".`);let a=t(`[data-colega-enviar]`,n);a.disabled=!0;try{let e=await f(`crear`,i);r.reset(),t(`[data-colega-details]`,n).open=!1,n.insertAdjacentHTML(`afterbegin`,`<p class="mb-6 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] px-5 py-3 text-[15px] text-ok" role="status" data-cg-ok>Listo: tu pedido les llegó a ${l(e.avisadas)} ${e.avisadas===1?`agencia`:`agencias`}${e.telegram?` (${l(e.telegram)} por Telegram)`:``}.</p>`),setTimeout(()=>t(`[data-cg-ok]`,n)?.remove(),8e3),t(`[data-cg-tab="mios"]`,n).click(),await _()}catch(e){u(e.message)}finally{a.disabled=!1}}),await Promise.all([h(),_()]);try{await f(`leer`),i()}catch{}}var fe=[[2,`2 horas`],[6,`6 horas`],[12,`12 horas`],[24,`24 horas`],[48,`48 horas`],[72,`3 días`],[168,`7 días`],[360,`15 días`],[720,`30 días`]],pe=e=>String(e).padStart(2,`0`),me=e=>{let t=new Date(e);return`${t.getFullYear()}-${pe(t.getMonth()+1)}-${pe(t.getDate())}T${pe(t.getHours())}:${pe(t.getMinutes())}`},he=e=>new Date(e).toLocaleString(`es-AR`,{weekday:`short`,day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),Y=(e,t,n=``)=>(n?`<option value="">${l(n)}</option>`:``)+e.map(e=>{let[n,r]=Array.isArray(e)?e:[e,e];return`<option value="${l(n)}"${String(n)===String(t??``)?` selected`:``}>${l(r)}</option>`}).join(``),X=(e,t,n=``)=>`<label class="block ${n}"><span class="vd-label">${l(e)}</span>${t}</label>`,Z=(e,t,n=``)=>`<input class="auth-input" name="${e}" value="${l(t??``)}" ${n} />`,Q=e=>Number(String(e??``).replace(/[.\s$]/g,``).replace(`,`,`.`)),ge=[[`hatchback`,`Hatchback`],[`sedan`,`Sedán`],[`suv`,`SUV`],[`pickup`,`Pick-up`],[`utilitario`,`Utilitario`],[`deportivo`,`Deportivo`]];function _e(e,r){let i=v.includes(e.marca)?v:[e.marca,...v],a=document.createElement(`dialog`);a.className=`ea-dialog`,a.setAttribute(`aria-labelledby`,`ea-title`),a.innerHTML=`
    <form method="dialog" class="flex max-h-[90vh] flex-col" novalidate data-ea-form>
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div class="min-w-0">
          <p class="text-[13px] font-bold text-ink/60">Código ${l(e.codigo)}</p>
          <h2 id="ea-title" class="truncate text-[20px] font-bold">Editar ${l(`${e.marca} ${e.modelo}`)}</h2>
        </div>
        <button type="button" class="icon-btn grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line" data-ea-cerrar aria-label="Cerrar">${u(`x`,`h-4 w-4`)}</button>
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
          ${X(`Carrocería`,`<select class="auth-input" name="carroceria">${Y(ge,e.carroceria)}</select>`)}
          ${X(`Puertas`,`<select class="auth-input" name="puertas">${Y([2,3,4,5],e.puertas,`—`)}</select>`)}
          ${X(`Color`,Z(`color`,e.color,`maxlength="30"`))}
          ${X(`Motor`,Z(`motor`,e.motor,`maxlength="40"`))}
          ${X(`Tracción`,Z(`traccion`,e.traccion,`maxlength="30"`))}
          ${X(`Ciudad`,Z(`ciudad`,e.ciudad,`maxlength="60"`))}
          ${X(`Provincia`,`<select class="auth-input" name="provincia">${Y(b,e.provincia)}</select>`)}
          ${X(`Descripción`,`<textarea class="auth-input !h-auto min-h-[110px] py-3" name="descripcion" maxlength="1000" rows="4">${l(e.descripcion??``)}</textarea>`,`sm:col-span-2`)}
        </div>
        <div class="mt-6">
          <p class="vd-label">Fotos</p>
          <ul class="grid grid-cols-4 gap-2 sm:grid-cols-7" data-ea-fotos></ul>
          <div class="mt-3 flex flex-wrap gap-2">
            <label class="btn-primary h-[44px] w-fit cursor-pointer !px-4 text-[14px]" data-ea-agregar-label><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-agregar /> ${u(`plus`,`h-4 w-4`)} Agregar fotos</label>
            <label class="btn-outline h-[44px] w-fit cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" multiple class="sr-only" data-ea-input /> ${u(`images`,`h-4 w-4`)} Reemplazar todas</label>
          </div>
          <p class="mt-2 text-[13px] text-ink/60" data-ea-fotos-nota></p>
        </div>
        ${(()=>{let t=e.relampago_precio&&new Date(e.relampago_termina).getTime()>Date.now(),n=t?Math.round((new Date(e.relampago_termina)-new Date(e.relampago_empieza))/36e5):24,r=fe.some(([e])=>e===n)?n:24;return`
        <fieldset class="mt-6 rounded-2xl border border-[#F3B8B4] bg-[#FFF7F6] p-4 sm:p-5" data-ea-relampago>
          <legend class="px-1 text-[16px] font-bold"><span aria-hidden="true">🔥</span> Precio relámpago</legend>
          <p class="text-[14px] text-ink/70">Bajale el precio por un tiempo determinado. Se muestra con la etiqueta <b>🔥 Relámpago</b>, el precio normal tachado y un contador. Al terminar, vuelve solo a su precio.</p>
          ${t?`<p class="mt-3 flex flex-wrap items-center gap-2 text-[14px]"><span class="feria-timer" data-oferta-ini="${l(e.relampago_empieza)}" data-oferta-fin="${l(e.relampago_termina)}"><span aria-hidden="true">🔥</span> <span data-oferta-txt>${l(ee({ini:e.relampago_empieza,fin:e.relampago_termina}))}</span></span> ${l(he(e.relampago_empieza))} → ${l(he(e.relampago_termina))} <button type="button" class="font-bold text-[#B42318] underline underline-offset-2" data-ea-rel-quitar>Quitar relámpago</button></p>`:``}
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            ${X(`Precio relámpago`,Z(`rel_precio`,t?Number(e.relampago_precio).toLocaleString(`es-AR`):``,`inputmode="numeric" maxlength="15" placeholder="Vacío = sin relámpago"`))}
            ${X(`Empieza`,`<input class="auth-input" type="datetime-local" name="rel_empieza" value="${l(me(t?Math.max(new Date(e.relampago_empieza).getTime(),Date.now()):Date.now()))}" min="${l(me(Date.now()))}" />`)}
            ${X(`Dura`,`<select class="auth-input" name="rel_horas">${Y(fe,r)}</select>`)}
          </div>
          <p class="mt-3 text-[13px] text-ink/60" data-ea-rel-resumen></p>
        </fieldset>`})()}
        <p class="mt-5 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-ea-error></p>
      </div>
      <div class="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button type="button" class="btn-outline h-[50px] justify-center !px-6" data-ea-cerrar>Cancelar</button>
        <button type="submit" class="btn-primary h-[50px] justify-center !px-8" data-ea-guardar>${u(`check`,`h-4 w-4`)} <span data-ea-label>Guardar cambios</span></button>
      </div>
    </form>`,document.body.append(a);let o=t(`[data-ea-form]`,a),s=t(`[data-ea-fotos]`,a),c=t(`[data-ea-error]`,a),d=(e.fotos??[]).filter(e=>S(e)),f=d.map(e=>({path:e,url:S(e)})),m=()=>f.filter(e=>e.file),h=()=>f.length!==d.length||f.some((e,t)=>e.path!==d[t]),g=!1,_=()=>{s.innerHTML=f.map((e,t)=>`
      <li class="group relative aspect-[4/3] overflow-hidden rounded-lg bg-soft">
        <img src="${l(e.url)}" alt="Foto ${t+1}" class="h-full w-full object-cover" />
        ${t===0?`<span class="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-bold text-white">Portada</span>`:`<button type="button" class="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-ink shadow transition-colors hover:bg-brand hover:text-white" data-ea-portada="${t}">Portada</button>`}
        ${f.length>1?`<button type="button" class="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-[#D92D20] hover:text-white" aria-label="Quitar foto ${t+1}" data-ea-quitar="${t}">${u(`x`,`h-3.5 w-3.5`)}</button>`:``}
      </li>`).join(``);let e=f.length>=7,n=t(`[data-ea-agregar-label]`,a);n.classList.toggle(`pointer-events-none`,e),n.classList.toggle(`opacity-50`,e),t(`[data-ea-agregar]`,a).disabled=e,t(`[data-ea-fotos-nota]`,a).textContent=e?`Ya tenés 7 fotos, el máximo. Para sumar otra, quitá alguna con la ✕.`:`${f.length} de 7 fotos. Podés agregar ${7-f.length} más. La primera es la portada.`},y=e=>{let t=[...e].filter(e=>/^image\/(jpeg|png|webp)$/.test(e.type)&&e.size<=26214400);return t.length<e.length&&E(`Algunos archivos no son fotos JPG, PNG o WebP de hasta 25 MB y no se sumaron.`),t},T=e=>e.forEach(e=>e.file&&URL.revokeObjectURL(e.url)),E=e=>{c.textContent=e||``,c.classList.toggle(`hidden`,!e),e&&c.scrollIntoView({block:`nearest`})},D=0,O=()=>{g||(clearInterval(D),T(f),a.close(),a.remove())},k=t(`[data-ea-relampago]`,a),A=!1,j=()=>{let e=Q(o.elements.rel_precio.value),n=Q(o.elements.precio.value),r=Math.max(new Date(o.elements.rel_empieza.value).getTime()||Date.now(),Date.now()),i=r+Number(o.elements.rel_horas.value)*36e5,s=o.elements.moneda.value===`USD`?`USD `:`$ `;t(`[data-ea-rel-resumen]`,a).textContent=e?e>=n?`Tiene que ser más bajo que el precio actual (${s}${n.toLocaleString(`es-AR`)}).`:`${s}${e.toLocaleString(`es-AR`)} en vez de ${s}${n.toLocaleString(`es-AR`)} (-${Math.round((1-e/n)*100)}%) · del ${he(r)} al ${he(i)} h.`:`Sin precio relámpago.`};k.addEventListener(`input`,e=>{if(A=!0,e.target.name===`rel_precio`){let t=Q(e.target.value);e.target.value=t?t.toLocaleString(`es-AR`):``}j()}),k.addEventListener(`change`,()=>{A=!0,j()}),o.elements.precio.addEventListener(`input`,j),t(`[data-ea-rel-quitar]`,a)?.addEventListener(`click`,()=>{o.elements.rel_precio.value=``,A=!0,j()}),j(),D=w(a),t(`[data-ea-input]`,a).addEventListener(`change`,e=>{E(``);let t=y(e.target.files);t.length>7&&E(`Podés subir hasta 7 fotos. Tomamos las primeras 7.`),t.length&&(T(f),f=t.slice(0,7).map(e=>({file:e,url:URL.createObjectURL(e)})),_()),e.target.value=``}),t(`[data-ea-agregar]`,a).addEventListener(`change`,e=>{E(``);let t=y(e.target.files),n=7-f.length;t.length>n&&E(`Entran ${n} ${n===1?`foto más`:`fotos más`} (máximo 7). Sumamos las primeras ${n}.`),f.push(...t.slice(0,n).map(e=>({file:e,url:URL.createObjectURL(e)}))),_(),e.target.value=``}),s.addEventListener(`click`,e=>{let t=e.target.closest(`[data-ea-quitar]`),n=e.target.closest(`[data-ea-portada]`);t&&f.length>1&&(T(f.splice(Number(t.dataset.eaQuitar),1)),_()),n&&(f.unshift(...f.splice(Number(n.dataset.eaPortada),1)),_())}),a.addEventListener(`click`,e=>{(e.target.closest(`[data-ea-cerrar]`)||e.target===a)&&(e.preventDefault(),O())}),a.addEventListener(`cancel`,e=>{e.preventDefault(),O()}),o.addEventListener(`submit`,async i=>{if(i.preventDefault(),g)return;let s=o.elements,c=e=>s[e].value.trim(),l=new Date().getFullYear()+1,u={codigo:e.codigo,marca:c(`marca`),modelo:c(`modelo`),version:c(`version`),anio:Number(c(`anio`)),condicion:c(`condicion`),km:Q(c(`km`)),precio:Q(c(`precio`)),moneda:c(`moneda`),combustible:c(`combustible`),transmision:c(`transmision`),carroceria:c(`carroceria`),puertas:c(`puertas`)?Number(c(`puertas`)):null,color:c(`color`),motor:c(`motor`),traccion:c(`traccion`),ciudad:c(`ciudad`),provincia:c(`provincia`),descripcion:c(`descripcion`)};if(!u.modelo||!u.version)return E(`Completá modelo y versión.`);if(!u.ciudad)return E(`Completá la ciudad.`);if(!Number.isInteger(u.anio)||u.anio<1950||u.anio>l)return E(`El año tiene que estar entre 1950 y ${l}.`);if(!Number.isInteger(u.km)||u.km<0||u.km>2e6)return E(`Revisá los kilómetros (solo números).`);if(!Number.isFinite(u.precio)||u.precio<=0||u.precio>=1e11)return E(`Revisá el precio (solo números).`);let d=Q(c(`rel_precio`));if(d&&d>=u.precio)return E(`El precio relámpago tiene que ser más bajo que el precio.`);let _=new Date(c(`rel_empieza`));if(d&&Number.isNaN(_.getTime()))return E(`Elegí cuándo empieza el precio relámpago.`);g=!0,E(``);let v=t(`[data-ea-guardar]`,a),y=t(`[data-ea-label]`,a);v.disabled=!0;try{let t=[];if(h()){let e=m();if(e.length){let t=await n(),r=await x();y.textContent=`Preparando fotos…`;let i=[];for(let t of e)i.push(await C(t.file,r));let{urls:a}=await p(`urls_fotos`,{cantidad:i.length,formato:r});for(let[n,o]of i.entries()){y.textContent=`Subiendo fotos ${n+1} de ${i.length}…`;let{error:s}=await t.storage.from(`mkt-fotos`).uploadToSignedUrl(a[n].path,a[n].token,o,{contentType:r===`jpg`?`image/jpeg`:`image/webp`});if(s)throw Error(`Se cortó la subida de una foto. Revisá tu conexión y probá de nuevo.`);e[n].subida=a[n].path}}t=f.map(e=>e.path??e.subida)}y.textContent=`Guardando…`,await p(`publicar`,{autos:[{...u,fotos:t}]}),(A||d&&Number(e.relampago_precio)!==d)&&(d?await p(`relampago`,{id:e.id,precio:d,empieza:_.toISOString(),horas:Number(c(`rel_horas`))}):e.relampago_precio&&await p(`relampago_quitar`,{id:e.id})),g=!1,O(),r?.()}catch(e){g=!1,v.disabled=!1,y.textContent=`Guardar cambios`,E(String(e.message||`No pudimos guardar. Probá de nuevo.`).replace(/^Fila 1: /,``))}}),_(),a.showModal(),ve(o)}var ve=e=>e.elements.modelo?.focus(),ye=e=>new Date(e).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`});function be(e){let t=!1;async function n(){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${u(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus alertas…</p>`;let t;try{t=await g(`listar`)}catch(t){e.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${l(t.message)}</p>`;return}e.innerHTML=`${await D().catch(()=>!1)?`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#E8F5E9] px-5 py-4 text-[15px] text-[#1E6B34]"><span class="flex items-center gap-2">${u(`circle-check`,`h-5 w-5`)} Las notificaciones están activas en este dispositivo.</span><button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-al-probar>Mandarme una de prueba</button></div>`:`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#EEF1FB] px-5 py-4 text-[15px] text-brand"><span class="flex items-center gap-2">${u(`bell`,`h-5 w-5`)} ${E()?`Activá las notificaciones en este dispositivo para recibir los avisos.`:`Este navegador no permite notificaciones. En iPhone, agregá el sitio a la pantalla de inicio y abrilo desde ahí.`}</span>${E()?`<button type="button" class="btn-primary h-[40px] !px-4 text-[14px]" data-al-activar>Activar</button>`:``}</div>`}${t.alertas.length?`<ul class="mt-5 grid gap-3">${t.alertas.map(e=>`
          <li class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="flex items-center gap-2 text-[16px] font-bold">${u(`bell`,`h-4 w-4 text-brand`)} ${l(k(e))}</p>
              <p class="mt-1 text-[13px] text-ink/60">Creada el ${l(ye(e.created_at))} · ${e.avisos?`${l(e.avisos)} ${e.avisos===1?`aviso`:`avisos`}, el último el ${l(ye(e.ultimo_aviso_at))}`:`todavía sin avisos`}</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <a href="./autos.html?${l(new URLSearchParams(Object.entries({marca:e.marca,modelo:e.modelo??``,condicion:e.condicion===`todos`?``:e.condicion,anio:e.anio_desde??``,pmax:e.precio_max??``,moneda:e.precio_max?e.moneda:``}).filter(([,e])=>e!==``&&e!=null)).toString())}" class="btn-outline h-[40px] !px-4 text-[14px]">${u(`eye`,`h-4 w-4`)} Ver autos</a>
              <button type="button" class="btn-outline h-[40px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-al-borrar="${l(e.id)}" aria-label="Borrar alerta ${l(k(e))}">${u(`x`,`h-4 w-4`)} Borrar</button>
            </div>
          </li>`).join(``)}</ul>`:`<div class="mt-5 rounded-[20px] border border-dashed border-line p-8 text-center">
           <p class="text-[18px] font-bold">Todavía no tenés alertas</p>
           <p class="mt-1 text-[15px] text-ink/70">Filtrá el auto que buscás y tocá <b>Avisame cuando entre</b>. Te avisamos apenas lo publiquen.</p>
           <a href="./autos.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${u(`search`,`h-4 w-4`)} Buscar autos</a>
         </div>`}<p class="mt-4 text-[13px] text-ink/60">Podés tener hasta 10 alertas. Te avisamos una sola vez por cada auto.</p><p class="mt-3 hidden rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]" role="alert" data-al-error></p>`}e.addEventListener(`click`,async r=>{let i=r.target.closest(`[data-al-activar], [data-al-probar], [data-al-borrar]`);if(!i||t)return;let a=e.querySelector(`[data-al-error]`);t=!0,i.disabled=!0;try{if(i.dataset.alBorrar){if(!window.confirm(`¿Borrar esta alerta?`))return;await g(`borrar`,{id:i.dataset.alBorrar})}else if(`alActivar`in i.dataset){let e=await O();if(e.error){a.textContent=e.motivo,a.classList.remove(`hidden`);return}await g(`probar`).catch(()=>{})}else{await g(`probar`);return}await n()}catch(e){a&&(a.textContent=e.message,a.classList.remove(`hidden`))}finally{t=!1,i.disabled=!1}}),n()}var xe=e=>new Date(e).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`}),Se=(e,t,n)=>`${e} ${e===1?t:n}`;async function Ce(e){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${u(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando…</p>`;let t;try{t=await h(`panel`)}catch(t){e.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${l(t.message)}</p>`;return}let n=t.clientes??[];e.innerHTML=`
    <div class="rounded-[24px] bg-soft p-5 sm:p-7">
      <p class="text-[13px] font-bold uppercase tracking-[0.1em] text-ink/60">Tu código</p>
      <p class="mt-1 font-mono text-[30px] font-bold tracking-[0.15em]">${l(t.ref)}</p>
      <ol class="mt-4 grid gap-3 text-[15px] leading-[1.6] text-ink/80 md:grid-cols-3">
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">1.</b> Entrá a <a href="./agencias.html?filtro=independientes" class="text-brand underline underline-offset-4">Agencias</a> y mirá cuáles aceptan vendedores independientes y cuánta comisión pagan.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">2.</b> En la ficha de un auto de esas agencias tocá <b>"Compartir con mi link"</b> y mandáselo a tu cliente.</li>
        <li class="rounded-2xl bg-white p-4"><b class="text-ink">3.</b> Cuando tu cliente abre el link o le escribe a la agencia, queda registrado acá. Es tu constancia ante la agencia.</li>
      </ol>
    </div>
    <h3 class="mt-8 text-[20px] font-bold">Clientes que trajiste</h3>
    ${n.length?`<ul class="mt-4 grid gap-3">${n.map(e=>{let n=S(e.auto.foto??``),r=e.agencia.whatsapp?`https://wa.me/${e.agencia.whatsapp}?text=${encodeURIComponent(`Hola ${e.agencia.nombre}, soy vendedor independiente de Red de Autos (código ${t.ref}). Te escribo por el ${e.auto.titulo}.`)}`:``;return`
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
        ${n?`<img src="${l(n)}" alt="" width="120" height="90" loading="lazy" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
        <div class="min-w-0 flex-1">
          <p class="truncate text-[16px] font-bold">${l(e.auto.titulo||`Auto`)}</p>
          <p class="text-[14px] text-ink/70">${l(e.agencia.nombre??``)}${e.agencia.comision?` · comisión ${l(e.agencia.comision)} %`:``}${e.auto.precio?` · ${l(c(Number(e.auto.precio),e.auto.moneda))}`:``}${e.auto.estado&&e.auto.estado!==`publicado`?` · <b>${e.auto.estado===`vendido`?`Vendido`:`Pausado`}</b>`:``}</p>
          <p class="mt-1 flex flex-wrap gap-x-3 text-[13px] text-ink/60">
            <span class="inline-flex items-center gap-1">${u(`eye`,`h-3.5 w-3.5`)} ${l(Se(e.vista,`visita`,`visitas`))}</span>
            <span class="inline-flex items-center gap-1">${u(`message-circle`,`h-3.5 w-3.5`)} ${l(Se(e.whatsapp,`WhatsApp a la agencia`,`WhatsApp a la agencia`))}</span>
            ${e.llamada?`<span class="inline-flex items-center gap-1">${u(`phone`,`h-3.5 w-3.5`)} ${l(Se(e.llamada,`llamada`,`llamadas`))}</span>`:``}
            <span>Último: ${l(xe(e.ultimo))}</span>
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          <a href="./auto.html?id=${encodeURIComponent(e.auto.id)}" class="btn-outline h-[40px] !px-4 text-[14px]">${u(`eye`,`h-4 w-4`)} Ver</a>
          ${r?`<a href="${l(r)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[40px] !px-4 text-[14px]">${u(`message-circle`,`h-4 w-4`)} Agencia</a>`:``}
        </div>
      </li>`}).join(``)}</ul>`:`<div class="mt-4 rounded-[20px] border border-dashed border-line p-8 text-center">
        <p class="text-[18px] font-bold">Todavía no hay clientes registrados</p>
        <p class="mt-1 text-[15px] text-ink/70">Compartí autos con tu link y acá vas a ver cada visita y cada contacto con la agencia.</p>
        <a href="./agencias.html?filtro=independientes" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${u(`handshake`,`h-4 w-4`)} Ver agencias que aceptan</a>
      </div>`}
    <p class="mt-4 text-[13px] text-ink/60">Contamos una visita y un contacto por persona, auto y día. No guardamos datos de tus clientes. La comisión la arreglás y la cobrás directo con la agencia.</p>`}var we=[[0,`Toda la feria`],[2,`2 horas`],[6,`6 horas`],[12,`12 horas`],[24,`24 horas`],[48,`48 horas`],[72,`72 horas`]],$=e=>new Date(e).toLocaleString(`es-AR`,{weekday:`short`,day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`}),Te=e=>String(e).padStart(2,`0`),Ee=e=>{let t=new Date(e);return`${t.getFullYear()}-${Te(t.getMonth()+1)}-${Te(t.getDate())}T${Te(t.getHours())}:${Te(t.getMinutes())}`},De=(e,t)=>Math.round((1-t/e)*100),Oe=e=>`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${l(e)}</p>`;function ke(e){let t=null,n=[],r=new Map,i=0;async function a(){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${u(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando la feria…</p>`;try{let[e,i]=await Promise.all([p(`feria`),p(`mios`)]);t=e.feria,r=new Map((e.ofertas??[]).map(e=>[e.auto_id,e])),n=(i.autos??[]).filter(e=>e.estado===`publicado`||r.has(e.id)),o()}catch(t){e.innerHTML=Oe(t.message)}}function o(){if(clearInterval(i),!t){e.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${u(`zap`,`h-6 w-6`)}</span>
          <p class="mt-4 text-[18px] font-bold">No hay ninguna feria programada</p>
          <p class="mx-auto mt-1 max-w-[520px] text-[15px] text-ink/70">Cuando armemos la próxima te avisamos por Telegram y desde acá vas a poder sumar tus autos con precio relámpago.</p>
        </div>`;return}let a=Date.now(),o=new Date(t.empieza).getTime()<=a,c=n.filter(e=>r.has(e.id));e.innerHTML=`
      <div class="feria-card !gap-5 !py-7">
        <div class="min-w-0">
          <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-[#9DB0FF]">${u(`zap`,`h-4 w-4`)} ${o?`En curso`:`Próxima feria`}</p>
          <p class="mt-3 text-[24px] font-bold leading-tight sm:text-[28px]">${l(t.nombre)}</p>
          <p class="mt-2 text-[15px] text-white/70">Del ${l($(t.empieza))} al ${l($(t.termina))} h</p>
        </div>
        <div class="flex flex-col gap-3 lg:items-end">
          <p class="text-[15px] text-white/80"><b class="text-[28px] text-white">${c.length}</b> ${c.length===1?`auto tuyo en la feria`:`autos tuyos en la feria`}</p>
          <a href="./feria.html" class="btn-cta w-fit" target="_blank" rel="noopener"><span class="btn-cta-icon">${u(`eye`,`h-4 w-4`)}</span> Ver la feria</a>
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
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${u(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`}`,i=w(e)}function s(e){let t=r.get(e.id),n=S(e.fotos?.[0]??``),i=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`,a=t&&new Date(t.termina).getTime()<=Date.now(),o=e.estado!==`publicado`;return`
      <li class="rounded-2xl border ${t&&!a?`border-[#F3B8B4]`:`border-line`} bg-white p-4" data-fe-auto="${l(e.id)}">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex min-w-0 flex-1 items-center gap-4">
            ${n?`<img src="${l(n)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
            <div class="min-w-0">
              <p class="text-[13px]"><span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${l(e.codigo)}</span></p>
              <p class="mt-1 truncate text-[16px] font-bold">${l(i)}</p>
              ${t?`
                <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[15px]"><s class="text-ink/50">${l(c(Number(e.precio),e.moneda))}</s> <b class="text-[#E5484D]">${l(c(Number(t.precio_feria),e.moneda))}</b> <span class="rounded-full bg-[#FDECEC] px-2 py-0.5 text-[12px] font-bold text-[#E5484D]">-${l(De(Number(e.precio),Number(t.precio_feria)))}%</span></p>
                <p class="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink/60">
                  <span class="feria-timer !px-2.5 !py-0.5 !text-[12px]" data-oferta-ini="${l(t.empieza)}" data-oferta-fin="${l(t.termina)}">${u(`clock`,`h-3 w-3`)} <span data-oferta-txt>${l(ee({ini:t.empieza,fin:t.termina}))}</span></span>
                  ${l($(t.empieza))} → ${l($(t.termina))}
                </p>
                ${o?`<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el auto no está publicado.</p>`:Number(t.precio_feria)>=Number(e.precio)?`<p class="mt-1 text-[13px] font-medium text-[#8A5A00]">No se muestra: el precio de feria ya no es más bajo que el actual. Editalo.</p>`:``}`:`<p class="mt-0.5 text-[15px]">${l(c(Number(e.precio),e.moneda))}</p>`}
            </div>
          </div>
          <div class="flex shrink-0 flex-wrap gap-2">
            ${t?`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-fe-editar="${l(e.id)}" ${o?`disabled`:``}>Editar</button>
                   <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-fe-quitar="${l(e.id)}" aria-label="Sacar ${l(i)} de la feria">${u(`x`,`h-4 w-4`)} Sacar</button>`:`<button type="button" class="btn-primary h-[42px] !px-4 text-[14px]" data-fe-editar="${l(e.id)}">${u(`zap`,`h-4 w-4`)} Sumar a la feria</button>`}
          </div>
        </div>
        <div data-fe-form hidden></div>
      </li>`}function d(n,i){e.querySelectorAll(`[data-fe-form]`).forEach(e=>{e.hidden=!0,e.innerHTML=``});let o=r.get(i.id),s=new Date(t.empieza).getTime(),d=new Date(t.termina).getTime(),f=o?new Date(o.empieza).getTime():Math.max(s,Date.now()),m=o?Math.round((new Date(o.termina)-new Date(o.empieza))/36e5):0,h=o&&new Date(o.termina).getTime()>=d-6e4?0:we.find(([e])=>e===m)?.[0]??0,g=n.querySelector(`[data-fe-form]`),_=`fe-${i.id.slice(0,8)}`;g.innerHTML=`
      <form class="mt-4 grid gap-4 border-t border-line pt-4 md:grid-cols-3" novalidate>
        <div>
          <label for="${_}-p" class="auth-label">Precio de feria (${l(i.moneda===`USD`?`US$`:`$`)})</label>
          <input id="${_}-p" name="precio" class="auth-input" inputmode="numeric" autocomplete="off" required value="${o?l(Number(o.precio_feria).toLocaleString(`es-AR`)):``}" placeholder="Menor a ${l(Number(i.precio).toLocaleString(`es-AR`))}" />
        </div>
        <div>
          <label for="${_}-i" class="auth-label">Empieza</label>
          <input id="${_}-i" name="empieza" type="datetime-local" class="auth-input" required value="${l(Ee(f))}" min="${l(Ee(s))}" max="${l(Ee(d-6e4))}" />
        </div>
        <div>
          <label for="${_}-d" class="auth-label">Dura</label>
          <select id="${_}-d" name="horas" class="auth-input">${we.map(([e,t])=>`<option value="${e}" ${e===h?`selected`:``}>${t}</option>`).join(``)}</select>
        </div>
        <p class="text-[14px] text-ink/70 md:col-span-3" data-fe-resumen></p>
        <p class="hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318] md:col-span-3" data-fe-error></p>
        <div class="flex flex-wrap gap-2 md:col-span-3">
          <button type="submit" class="btn-primary h-[46px] !px-6">${u(`zap`,`h-4 w-4`)} ${o?`Guardar cambios`:`Sumar a la feria`}</button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-fe-cancelar>Cancelar</button>
        </div>
      </form>`,g.hidden=!1;let v=g.querySelector(`form`),y=()=>Number(v.elements.precio.value.replace(/\D/g,``)),b=()=>{let e=y(),t=Math.max(new Date(v.elements.empieza.value).getTime()||f,Date.now()),n=Number(v.elements.horas.value),r=n?Math.min(t+n*36e5,d):d;v.querySelector(`[data-fe-resumen]`).innerHTML=e&&e<Number(i.precio)?`${u(`zap`,`inline h-4 w-4 text-[#E5484D]`)} <b>${l(c(e,i.moneda))}</b> en vez de ${l(c(Number(i.precio),i.moneda))} (<b class="text-[#E5484D]">-${l(De(Number(i.precio),e))}%</b>) · del ${l($(t))} al ${l($(r))} h.`:`Precio actual: ${l(c(Number(i.precio),i.moneda))}. El precio de feria tiene que ser más bajo.`};v.addEventListener(`input`,e=>{if(e.target.name===`precio`){let t=y();e.target.value=t?t.toLocaleString(`es-AR`):``}b()}),v.addEventListener(`change`,b),b(),v.elements.precio.focus(),v.querySelector(`[data-fe-cancelar]`).addEventListener(`click`,()=>{g.hidden=!0,g.innerHTML=``}),v.addEventListener(`submit`,async e=>{e.preventDefault();let t=v.querySelector(`[data-fe-error]`),n=e=>{t.textContent=e,t.classList.remove(`hidden`)};t.classList.add(`hidden`);let r=y();if(!r)return n(`Poné el precio de feria.`);if(r>=Number(i.precio))return n(`Tiene que ser más bajo que el precio actual (${c(Number(i.precio),i.moneda)}).`);let o=new Date(v.elements.empieza.value);if(Number.isNaN(o.getTime()))return n(`Elegí cuándo empieza.`);let s=v.querySelector(`[type=submit]`);s.disabled=!0;try{await p(`feria_sumar`,{id:i.id,precio:r,empieza:o.toISOString(),horas:Number(v.elements.horas.value)}),await a()}catch(e){n(e.message),s.disabled=!1}})}e.addEventListener(`click`,async t=>{let r=t.target.closest(`[data-fe-editar]`);if(r){let e=n.find(e=>e.id===r.dataset.feEditar);e&&d(r.closest(`[data-fe-auto]`),e);return}let i=t.target.closest(`[data-fe-quitar]`);if(!i)return;let o=n.find(e=>e.id===i.dataset.feQuitar);if(window.confirm(`¿Sacar ${o?`${o.marca} ${o.modelo} ${o.anio}`:`este auto`} de la feria? Vuelve a mostrarse con su precio normal.`)){i.disabled=!0;try{await p(`feria_quitar`,{id:i.dataset.feQuitar}),await a()}catch(t){i.disabled=!1,e.insertAdjacentHTML(`afterbegin`,Oe(t.message))}}}),a()}function Ae(){let r=t(`[data-mc-guest]`),i=t(`[data-mc-panel]`),a=t(`[data-mc-buscados]`),o=t(`#buscados`),m=t(`[data-mc-publicar]`),h=t(`[data-mc-misautos]`),g=t(`#mis-autos`),v=t(`[data-mis-autos]`),y=t(`[data-mc-colegas]`),b=t(`#colegas`),x=t(`[data-mc-perfil]`),C=t(`#perfil`),w=!1,E=!1,D=!1,O=(t,n)=>{e(`[data-mc-panel] .mc-action[aria-controls]`).forEach(e=>{if(e===t)return;e.classList.remove(`is-active`),e.setAttribute(`aria-expanded`,`false`);let n=document.getElementById(e.getAttribute(`aria-controls`));n&&(n.hidden=!0)}),n.hidden=!1,t.setAttribute(`aria-expanded`,`true`),t.classList.add(`is-active`),n.scrollIntoView({behavior:`smooth`,block:`start`})},k=async()=>{O(a,o),w||(w=!0,await d(o,await n()))},j=[],te=e=>{if(!e)return``;let t=e.autos.reduce((e,t)=>({v:e.v+t.vistas_30,w:e.w+t.whatsapp_30,l:e.l+t.llamadas_30}),{v:0,w:0,l:0}),n=t.w+t.l,r=t.v?Math.round(n/t.v*1e3)/10:0,i=Math.max(1,...e.dias.map(e=>e.vistas)),a=e=>new Date(`${e}T12:00:00`).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`}),o=(e,t,n)=>`<div class="rounded-2xl bg-white p-4 sm:p-5"><p class="flex items-center gap-2 text-[13px] font-medium text-ink/60">${u(n,`h-4 w-4`)} ${t}</p><p class="mt-1 text-[28px] font-bold leading-none">${l(e.toLocaleString(`es-AR`))}</p></div>`;return`
      <div class="mb-6 rounded-[24px] bg-soft p-4 sm:p-6">
        <div class="flex flex-wrap items-end justify-between gap-2">
          <h3 class="text-[18px] font-bold">Estadísticas · últimos 30 días</h3>
          <p class="text-[13px] text-ink/60">Una vista o contacto por persona, auto y día.</p>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          ${o(t.v,`Vistas de fichas`,`eye`)}${o(t.w,`Clics en WhatsApp`,`message-circle`)}${o(t.l,`Llamadas`,`phone`)}
          <div class="rounded-2xl bg-white p-4 sm:p-5"><p class="text-[13px] font-medium text-ink/60">Contactos por cada 100 vistas</p><p class="mt-1 text-[28px] font-bold leading-none">${l(String(r).replace(`.`,`,`))}</p></div>
        </div>
        <div class="mt-5 rounded-2xl bg-white p-4 sm:p-5">
          <p class="text-[13px] font-medium text-ink/60">Vistas por día</p>
          <div class="mt-3 flex h-[110px] items-end gap-[3px]" role="img" aria-label="Vistas por día de los últimos 30 días: ${l(e.dias.map(e=>`${a(e.dia)} ${e.vistas}`).join(`, `))}">
            ${e.dias.map(e=>`<span class="mc-bar group relative flex-1 rounded-t-[4px] ${e.vistas?`bg-brand`:`bg-line`}" data-h="${Math.max(3,Math.round(e.vistas/i*100))}"><span class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[12px] text-white group-hover:block">${l(a(e.dia))}: ${l(e.vistas)} vistas · ${l(e.contactos)} contactos</span></span>`).join(``)}
          </div>
          <div class="mt-2 flex justify-between text-[12px] text-ink/50"><span>${l(a(e.dias[0]?.dia??``))}</span><span>Hoy</span></div>
        </div>
      </div>`},M=null,N=e=>{j=e;let t=new Map((M?.autos??[]).map(e=>[e.auto_id,e]));if(!e.length){v.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${u(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`;return}let n=e.filter(e=>e.estado===`publicado`).length,r=e.filter(e=>e.estado===`vendido`).length;v.innerHTML=`${te(M)}
      <p class="mb-4 text-[15px] text-ink/70">${e.length} ${e.length===1?`auto`:`autos`} · ${n} ${n===1?`publicado`:`publicados`}${r?` · ${r} ${r===1?`vendido`:`vendidos`}`:``}</p>
      <ul class="grid gap-3">
        ${e.map(e=>{let n=S(e.fotos?.[0]??``),r=e.estado!==`publicado`,i=e.estado===`vendido`,a=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`;return`
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${n?`<img src="${l(n)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${r?`opacity-50 grayscale`:``}" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${l(e.codigo)}</span>
                  ${i?`<span class="rounded-full bg-ink px-2.5 py-0.5 font-medium text-white">Vendido</span>`:r?`<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${e.pausado_por_admin?`Pausado por Red de Autos`:`Pausado`}</span>`:`<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>`}
                  <span class="text-ink/60">${l(e.fotos?.length??0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${l(a)}</p>
                ${e.relampago_precio&&new Date(e.relampago_termina).getTime()>Date.now()?`<p class="flex flex-wrap items-center gap-x-2 text-[15px]"><s class="text-ink/50">${l(c(Number(e.precio),e.moneda))}</s> <b class="text-[#E5484D]">${l(c(Number(e.relampago_precio),e.moneda))}</b></p>
                     <p class="mt-1"><span class="feria-timer !px-2.5 !py-0.5 !text-[12px]" data-oferta-ini="${l(e.relampago_empieza)}" data-oferta-fin="${l(e.relampago_termina)}"><span aria-hidden="true">🔥</span> Relámpago · <span data-oferta-txt>${l(ee({ini:e.relampago_empieza,fin:e.relampago_termina}))}</span></span></p>`:`<p class="text-[15px]">${l(c(Number(e.precio),e.moneda))}</p>`}
                ${(()=>{let n=t.get(e.id);return n?`<p class="mt-1 flex flex-wrap gap-x-3 text-[13px] text-ink/60" title="Últimos 30 días (total histórico: ${l(n.vistas_total)} vistas, ${l(n.whatsapp_total+n.llamadas_total)} contactos)"><span class="inline-flex items-center gap-1">${u(`eye`,`h-3.5 w-3.5`)} ${l(n.vistas_30)} ${n.vistas_30===1?`vista`:`vistas`}</span><span class="inline-flex items-center gap-1">${u(`message-circle`,`h-3.5 w-3.5`)} ${l(n.whatsapp_30)} WhatsApp</span>${n.llamadas_30?`<span class="inline-flex items-center gap-1">${u(`phone`,`h-3.5 w-3.5`)} ${l(n.llamadas_30)} ${n.llamadas_30===1?`llamada`:`llamadas`}</span>`:``}</p>`:``})()}
              </div>
            </div>
            <div class="flex shrink-0 flex-wrap gap-2">
              ${r?``:`<a href="${l(_({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${u(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin||i?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${r?`publicado`:`pausado`}" data-id="${l(e.id)}">${r?`Volver a publicar`:`Pausar`}</button>`}
              ${i?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-editar="${l(e.id)}">Editar</button>`}
              <button type="button" class="btn-outline h-[42px] !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-eliminar="${l(e.id)}" aria-label="Eliminar ${l(a)}">${u(`x`,`h-4 w-4`)} Eliminar</button>
            </div>
          </li>`}).join(``)}
      </ul>`},P=async()=>{v.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${u(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let[{autos:e},t]=await Promise.all([p(`mios`),p(`estadisticas`).catch(()=>null)]);M=t,N(e??[]),T(),v.querySelectorAll(`.mc-bar`).forEach(e=>{e.style.height=`${e.dataset.h}%`})}catch(e){v.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${l(e.message)}</p>`}},F=()=>{O(h,g),P()},I=t(`[data-mc-telegram]`),ne=async()=>{if(!E)I.hidden=!0;else try{let{vinculado:e}=await f(`telegram_estado`);if(I.hidden=e,e)return;I.innerHTML=`
        <div class="mb-8 overflow-hidden rounded-[24px] bg-ink text-white">
          <div class="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
            <div>
              <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">${u(`telegram`,`h-4 w-4`)} Bot de Red de Autos en Telegram</p>
              <p class="mt-3 text-[22px] font-bold leading-tight sm:text-[26px]">Conectá Telegram y manejá tu stock desde el celular</p>
              <ul class="mt-4 grid gap-2 text-[15px] text-white/85 sm:grid-cols-2">
                ${[[`bell`,`Avisos al instante de pedidos de colegas`],[`tag`,`Cambiar el precio de un auto`],[`circle-check`,`Marcar un auto como vendido`],[`lock`,`Pausar y volver a publicar`],[`handshake`,`Pedir autos a colegas y responder "Lo tengo"`],[`badge-check`,`Avisos de tu cuenta y de ferias nuevas`]].map(([e,t])=>`<li class="flex items-start gap-2">${u(e,`mt-0.5 h-4 w-4 shrink-0 text-[#9DB0FF]`)}<span>${t}</span></li>`).join(``)}
              </ul>
            </div>
            <div class="flex flex-col gap-2 md:items-end">
              <button type="button" class="btn-primary h-[54px] justify-center !px-8" data-tg-conectar>${u(`telegram`,`h-4 w-4`)} Conectar Telegram</button>
              <p class="text-[13px] text-white/60 md:text-right">Se abre Telegram: tocá <b>Iniciar</b> y listo.<br>Si no lo tenés, bajalo gratis de tu tienda de apps.</p>
            </div>
          </div>
        </div>`}catch{I.hidden=!0}};I.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-tg-conectar]`);if(t){t.disabled=!0;try{let{url:e}=await f(`telegram_vincular`);/^https:\/\/t\.me\//.test(e)&&window.open(e,`_blank`,`noopener`),window.addEventListener(`focus`,ne,{once:!0})}catch{}finally{t.disabled=!1}}});let L=!1,R=()=>{O(y,b),L||(L=!0,de(t(`[data-colegas-box]`)))},z=t(`[data-mc-clientes]`),re=t(`#clientes`),B=!1,V=!1,H=()=>{V&&(O(z,re),B||(B=!0,Ce(t(`[data-clientes-box]`))))},U=t(`[data-mc-feria]`),ae=t(`#feria`),oe=!1,W=()=>{E&&(O(U,ae),oe||(oe=!0,ke(t(`[data-feria-box]`))))},G=t(`[data-mc-alertas]`),K=t(`#alertas`),se=!1,q=()=>{O(G,K),se||(se=!0,be(t(`[data-alertas-box]`)))},J=!1,ce=()=>{O(x,C),J||(J=!0,ie(t(`[data-perfil-box]`)))};v.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-editar]`);if(t){let e=j.find(e=>e.id===t.dataset.editar);e&&_e(e,P);return}let n=e.target.closest(`[data-eliminar]`),r=n||e.target.closest(`[data-estado]`);if(r){if(n){let e=j.find(e=>e.id===n.dataset.eliminar);if(!window.confirm(`¿Eliminar ${e?`${e.marca} ${e.modelo} ${e.anio} (${e.codigo})`:`este auto`}? Se borra con sus fotos y no se puede deshacer.`))return}r.disabled=!0;try{n?await p(`borrar`,{id:n.dataset.eliminar}):await p(`estado`,{id:r.dataset.id,estado:r.dataset.estado}),await P()}catch(e){r.disabled=!1,v.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${l(e.message)}</p>`)}}});let le=(e,n,r)=>{e.classList.toggle(`is-soon`,!n),e.tagName===`BUTTON`?e.disabled=!n:(e.toggleAttribute(`aria-disabled`,!n),n?e.removeAttribute(`tabindex`):e.setAttribute(`tabindex`,`-1`)),t(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,e).textContent=r},ue=e=>{if(r.hidden=!!e,i.hidden=!e,!e){t(`[data-mc-title]`).textContent=`Mi cuenta`,t(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,o.hidden=!0,w=!1,g.hidden=!0,C.hidden=!0,J=!1,b.hidden=!0,L=!1;return}let n=e.tipo===`agencia`?e.agencia_tipo===`oficial`?`Concesionario oficial${e.marca_oficial?` ${e.marca_oficial}`:``}`:`Agencia multimarca`:e.tipo===`vendedor`?`Vendedor independiente`:`Particular`;t(`[data-mc-title]`).textContent=`Hola, ${e.nombre.split(` `)[0]}`,t(`[data-mc-sub]`).textContent=`${e.nombre} · ${n}`;let s=e.estado===`pendiente`;t(`[data-mc-pending]`).classList.toggle(`hidden`,!s),a.disabled=s,a.classList.toggle(`is-soon`,s),E=e.tipo===`agencia`&&e.estado===`aprobada`,D=e.tipo===`particular`&&e.estado===`activa`,m.setAttribute(`href`,D?`./vender.html`:`./publicar.html`),le(m,E||D,E?`Cargá tu stock con la plantilla de Excel y tus fotos.`:D?`Publicá hasta 2 autos gratis y seguí su estado.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),h.hidden=D,le(h,E,E?`Mirá, pausá o volvé a publicar tus autos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),x.hidden=e.tipo!==`agencia`,e.tipo!==`agencia`&&(C.hidden=!0),e.tipo===`agencia`&&location.hash===`#perfil`&&ce(),y.hidden=!E,U.hidden=!E,t(`[data-estudio]`).innerHTML=e.tipo===`vendedor`?``:A(),E||(ae.hidden=!0),E&&location.hash===`#feria`&&W(),ne(),E||(b.hidden=!0),E&&location.hash===`#colegas`&&R(),!s&&location.hash===`#buscados`&&k(),E&&location.hash===`#mis-autos`&&F(),location.hash===`#alertas`&&q();let c=e.tipo===`vendedor`;V=c&&e.estado===`aprobada`,m.hidden=c,c&&(h.hidden=!0),z.hidden=!c,z.disabled=!V,z.classList.toggle(`is-soon`,c&&!V),t(`[data-mc-clientes-sub]`).textContent=V?`Tu código, tu link y los clientes que trajiste.`:`Disponible cuando aprobemos tu cuenta.`,t(`[data-mc-pending]`).textContent=c?`Tu cuenta de vendedor independiente está en revisión. Cuando la aprobemos vas a ver las comisiones de cada agencia y tu link.`:`Tu agencia está en revisión. Cuando la aprobemos vas a poder ver el ranking y publicar tu stock.`,V&&location.hash===`#clientes`&&H()};a.addEventListener(`click`,k),h.addEventListener(`click`,F),x.addEventListener(`click`,ce),y.addEventListener(`click`,R),G.addEventListener(`click`,q),U.addEventListener(`click`,W),z.addEventListener(`click`,H),window.addEventListener(`hashchange`,()=>{location.hash===`#colegas`&&E&&R(),location.hash===`#alertas`&&q(),location.hash===`#feria`&&E&&W(),location.hash===`#perfil`&&!x.hidden&&ce(),location.hash===`#mis-autos`&&E&&F()}),m.addEventListener(`click`,e=>{!E&&!D&&e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>ue(e.detail)),ue(s())}document.documentElement.classList.add(`js`),r(),o(),Ae(),a();