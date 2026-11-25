import{n as e,r as t}from"./site-DaVZwNLf.js";import{a as n,n as r,o as i,r as a,t as o}from"./auth-bLtX9eL3.js";import{a as s,i as c,n as l,r as u,s as d}from"./fotos-YHnUa55G.js";import{t as f}from"./ranking-Dha1OmSM.js";import{a as p,o as m,t as h}from"./carga-CXCd0wkr.js";import{o as g}from"./catalog-Bvstg05i.js";import{i as _}from"./modelos-C4UpMEQ_.js";var v=e=>/^\d{11}$/.test(e??``)?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:e??``,y=e=>String(e??``).replace(/^549(\d+)$/,`$1`),b=(e,t,n,r=``)=>`
  <div>
    <label for="${e}" class="auth-label">${s(t)}</label>
    ${n}
    ${r?`<p class="mt-1.5 text-[13px] text-ink/60">${r}</p>`:``}
  </div>`,x=(e,t,n,r=``)=>`<input id="${e}" name="${t}" value="${s(n??``)}" class="auth-input" ${r} />`,S=(e,t,n)=>`
  <div class="relative">
    <select id="${e}" name="${t}" class="auth-input appearance-none pr-10">${n}</select>
    ${c(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
  </div>`,C=(e,t,n=``)=>(n?`<option value="">${s(n)}</option>`:``)+e.map(e=>`<option value="${s(e)}"${e===t?` selected`:``}>${s(e)}</option>`).join(``),w={nombre:`Nombre comercial`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},T=(e,t)=>t==null||t===``?`—`:e===`cuit`?v(t):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),E=e=>{let t=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>w[e]):[];return t.length?`
    <div class="rounded-2xl bg-[#FFF6E5] px-5 py-4 text-[15px] text-[#8A5A00]">
      <p class="flex items-center gap-2 font-bold">${c(`clipboard-check`,`h-4 w-4`)} Cambios en revisión</p>
      <ul class="mt-2 space-y-1">${t.map(([t,n])=>`<li>${s(w[t])}: <b>${s(T(t,n))}</b> <span class="opacity-75">(hoy: ${s(T(t,e[t]))})</span></li>`).join(``)}</ul>
      <p class="mt-2 text-[14px]">Los vas a ver publicados cuando los aprobemos. Mientras tanto se muestran los datos de hoy.</p>
    </div>`:``},D=e=>{let t=u(e.logo??``);return t?`<img src="${s(t)}" alt="Logo de ${s(e.nombre)}" width="400" height="400" class="h-full w-full object-contain" />`:`<span class="grid h-full w-full place-items-center text-ink/35">${c(`store`,`h-10 w-10`)}</span>`};function O(e){let t=e.cambios_pendientes??{},n=n=>Object.hasOwn(t,n)?t[n]:e[n],r=n(`agencia_tipo`)===`oficial`?`oficial`:`multimarca`;return`
  <div class="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
    <!-- Logo -->
    <div>
      <div class="rounded-[20px] border border-line bg-white p-6 text-center lg:sticky lg:top-[110px]">
        <p class="text-[17px] font-bold">Logo</p>
        <div class="mx-auto mt-4 h-[160px] w-[160px] overflow-hidden rounded-2xl border border-line bg-white p-2" data-logo-preview>${D(e)}</div>
        <p class="mt-3 text-[13px] text-ink/60">JPG, PNG o WebP. Lo recortás en cuadrado antes de guardarlo.</p>
        <div class="mt-4 flex flex-col gap-2">
          <label class="btn-primary h-[48px] cursor-pointer justify-center">${c(`images`,`h-4 w-4`)} <span data-logo-label>${e.logo?`Cambiar logo`:`Subir logo`}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-logo-input /></label>
          <button type="button" class="btn-outline h-[44px] justify-center" data-logo-quitar ${e.logo?``:`hidden`}>${c(`x`,`h-4 w-4`)} Quitar logo</button>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <form class="space-y-8" data-perfil-form novalidate>
      <div data-perfil-pendientes>${E(e)}</div>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Datos de la agencia</legend>
        <p class="mb-5 flex items-start gap-2 text-[14px] text-ink/70">${c(`shield-check`,`mt-0.5 h-4 w-4 shrink-0 text-brand`)} Si cambiás el nombre, el CUIT o el tipo, lo revisamos antes de publicarlo.</p>
        <div class="grid gap-5 sm:grid-cols-2">
          ${b(`pf-nombre`,`Nombre comercial`,x(`pf-nombre`,`nombre`,n(`nombre`),`maxlength="80" required autocomplete="organization"`))}
          ${b(`pf-cuit`,`CUIT`,x(`pf-cuit`,`cuit`,v(n(`cuit`)),`inputmode="numeric" maxlength="13" required placeholder="30-12345678-9"`))}
          <div class="sm:col-span-2">
            <p class="auth-label">Tipo</p>
            <div class="flex flex-wrap gap-2">
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="multimarca" class="sr-only" ${r===`multimarca`?`checked`:``} /><span>Agencia multimarca</span></label>
              <label class="filter-pill"><input type="radio" name="agencia_tipo" value="oficial" class="sr-only" ${r===`oficial`?`checked`:``} /><span>Concesionario oficial</span></label>
            </div>
          </div>
          <div data-pf-marca ${r===`oficial`?``:`hidden`}>
            ${b(`pf-marca`,`Marca que representa`,S(`pf-marca`,`marca_oficial`,C(_,n(`marca_oficial`),`Elegí la marca`)))}
          </div>
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Ubicación y horario</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${b(`pf-ciudad`,`Ciudad`,x(`pf-ciudad`,`ciudad`,e.ciudad,`maxlength="60" required autocomplete="address-level2"`))}
          ${b(`pf-provincia`,`Provincia`,S(`pf-provincia`,`provincia`,C(h,e.provincia,`Elegí la provincia`)))}
          ${b(`pf-direccion`,`Dirección del local`,x(`pf-direccion`,`direccion`,e.direccion,`maxlength="120" placeholder="Av. Mate de Luna 1234" autocomplete="street-address"`))}
          ${b(`pf-horario`,`Horario de atención`,x(`pf-horario`,`horario`,e.horario,`maxlength="120" placeholder="Lun a vie 9 a 19 h · Sáb 9 a 13 h"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Contacto de ventas</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          ${b(`pf-wsp`,`WhatsApp para consultas`,x(`pf-wsp`,`whatsapp_ventas`,y(e.whatsapp_ventas),`type="tel" inputmode="tel" maxlength="20" placeholder="381 555-1234" autocomplete="tel-national"`),`Si lo dejás vacío, las consultas llegan al celular con el que ingresás.`)}
          ${b(`pf-email`,`Email`,x(`pf-email`,`email`,e.email,`type="email" maxlength="120" placeholder="ventas@tuagencia.com" autocomplete="email"`))}
        </div>
      </fieldset>

      <fieldset class="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <legend class="px-2 text-[17px] font-bold">Presentación</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            ${b(`pf-desc`,`Descripción`,`<textarea id="pf-desc" name="descripcion" rows="4" maxlength="600" class="auth-input !h-auto py-3 leading-[1.6]" placeholder="Contá en pocas líneas quiénes son, desde cuándo y qué ofrecen.">${s(e.descripcion??``)}</textarea>`,`<span data-desc-count>0</span>/600`)}
          </div>
          ${b(`pf-web`,`Sitio web`,x(`pf-web`,`sitio_web`,e.sitio_web,`type="url" maxlength="200" placeholder="https://tuagencia.com" autocomplete="url"`))}
          ${b(`pf-ig`,`Instagram`,x(`pf-ig`,`instagram`,e.instagram?`@${e.instagram}`:``,`maxlength="60" placeholder="@tuagencia"`))}
        </div>
      </fieldset>

      <p class="auth-error" role="alert" data-perfil-error hidden></p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" class="btn-primary h-[54px] justify-center !px-8" data-perfil-guardar>${c(`check`,`h-4 w-4`)} <span>Guardar cambios</span></button>
        <a href="#" class="link-view justify-center" data-perfil-ver target="_blank" rel="noopener">Ver mi página ${c(`arrow-up-right`,`h-4 w-4`)}</a>
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
        <span class="sr-only">Acercar o alejar</span>${c(`search`,`h-4 w-4 text-ink/50`)}
        <input type="range" min="1" max="4" step="0.01" value="1" class="w-full accent-[#405FF2]" data-crop-zoom />
      </label>
      <div class="mt-6 flex gap-3">
        <button type="button" class="btn-outline h-[48px] flex-1 justify-center" data-crop-cancel>Cancelar</button>
        <button type="button" class="btn-primary h-[48px] flex-1 justify-center" data-crop-ok>${c(`check`,`h-4 w-4`)} Guardar logo</button>
      </div>
    </div>
  </div>`}var k=400,A=600;async function j(n){n.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${c(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tu perfil…</p>`;let r;try{({perfil:r}=await m(`ver`))}catch(e){n.innerHTML=`<p class="auth-error">${s(e.message)}</p>`;return}n.innerHTML=O(r);let i=e(`[data-perfil-form]`,n),o=e(`[data-perfil-error]`,n),u=e(`[data-perfil-ok]`,n),d=e=>{o.textContent=e||``,o.hidden=!e};e(`[data-perfil-ver]`,n).href=`./agencia.html?id=${encodeURIComponent(r.id)}`;let f=e(`[data-pf-marca]`,n);i.addEventListener(`change`,e=>{e.target.name===`agencia_tipo`&&(f.hidden=e.target.value!==`oficial`)});let p=e(`#pf-desc`,n),h=e(`[data-desc-count]`,n),g=()=>{h.textContent=String(p.value.length)};p.addEventListener(`input`,g),g(),i.addEventListener(`submit`,async t=>{t.preventDefault(),d(``),u.textContent=``;let a=new FormData(i),o=Object.fromEntries([`nombre`,`cuit`,`agencia_tipo`,`marca_oficial`,`ciudad`,`provincia`,`direccion`,`horario`,`whatsapp_ventas`,`email`,`descripcion`,`sitio_web`,`instagram`].map(e=>[e,a.get(e)??``]));if(o.agencia_tipo===`oficial`&&!o.marca_oficial)return d(`Elegí la marca que representa el concesionario.`);if(!o.provincia)return d(`Elegí la provincia.`);let s=e(`[data-perfil-guardar]`,n);s.disabled=!0;try{let t=await m(`guardar`,o);r=t.perfil,e(`[data-perfil-pendientes]`,n).innerHTML=E(r),u.textContent=t.pendiente?`Guardado. El nombre, CUIT o tipo quedan en revisión.`:`Listo, tus datos están actualizados.`,r.instagram&&(e(`#pf-ig`,n).value=`@${r.instagram}`),r.sitio_web&&(e(`#pf-web`,n).value=r.sitio_web)}catch(e){d(e.message)}finally{s.disabled=!1}});let _=e(`[data-crop]`,n),v=e(`[data-crop-canvas]`,n),y=v.getContext(`2d`),b=e(`[data-crop-zoom]`,n),x=null,S=1,C=0,w=0,T=()=>S*Number(b.value),j=(e=y,t=A,n=!0)=>{let r=t/A;e.clearRect(0,0,t,t),n&&(e.fillStyle=`#fff`,e.fillRect(0,0,t,t));let i=T()*r;e.drawImage(x,C*r+(t-x.width*i)/2,w*r+(t-x.height*i)/2,x.width*i,x.height*i)},M=()=>{_.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),x?.close?.(),x=null};e(`[data-logo-input]`,n).addEventListener(`change`,async t=>{let r=t.target.files[0];if(t.target.value=``,r){if(d(``),!/^image\/(jpeg|png|webp)$/.test(r.type))return d(`El logo tiene que ser JPG, PNG o WebP.`);if(r.size>10485760)return d(`El logo pesa demasiado (máximo 10 MB).`);try{x=await createImageBitmap(r)}catch{return d(`No pudimos abrir esa imagen. Probá con otra.`)}S=Math.min(A/x.width,A/x.height),b.value=`1`,C=0,w=0,j(),_.hidden=!1,document.documentElement.classList.add(`overflow-hidden`),e(`[data-crop-ok]`,n).focus()}}),b.addEventListener(`input`,()=>x&&j());let N=null;v.addEventListener(`pointerdown`,e=>{if(!x)return;v.setPointerCapture(e.pointerId);let t=v.getBoundingClientRect();N={px:e.clientX,py:e.clientY,x:C,y:w,k:A/t.width}}),v.addEventListener(`pointermove`,e=>{if(!N)return;let t=A*.75;C=Math.max(-450,Math.min(t,N.x+(e.clientX-N.px)*N.k)),w=Math.max(-450,Math.min(t,N.y+(e.clientY-N.py)*N.k)),j()}),[`pointerup`,`pointercancel`].forEach(e=>v.addEventListener(e,()=>{N=null})),v.tabIndex=0,v.addEventListener(`keydown`,e=>{if(!x)return;let t={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];t&&(e.preventDefault(),C+=t[0],w+=t[1],j()),(e.key===`+`||e.key===`-`)&&(b.value=String(Math.min(4,Math.max(1,Number(b.value)+(e.key===`+`?.1:-.1)))),j())}),e(`[data-crop-cancel]`,n).addEventListener(`click`,M),_.addEventListener(`keydown`,e=>{e.key===`Escape`&&M()}),e(`[data-crop-ok]`,n).addEventListener(`click`,async t=>{let i=t.currentTarget;i.disabled=!0;try{let t=await l(),i=document.createElement(`canvas`);i.width=i.height=k,j(i.getContext(`2d`),k,t===`jpg`);let o=await new Promise(e=>i.toBlob(e,t===`jpg`?`image/jpeg`:`image/webp`,.9));if(!o)throw Error(`No pudimos procesar el logo.`);let{path:s,token:c}=await m(`url_logo`,{formato:t}),{error:d}=await(await a()).storage.from(`mkt-fotos`).uploadToSignedUrl(s,c,o,{contentType:o.type});if(d)throw Error(`Se cortó la subida del logo. Probá de nuevo.`);let f=await m(`guardar_logo`,{path:s});r.logo=f.logo,e(`[data-logo-preview]`,n).innerHTML=D(r),e(`[data-logo-label]`,n).textContent=`Cambiar logo`,e(`[data-logo-quitar]`,n).hidden=!1,M(),u.textContent=`Logo guardado.`}catch(e){M(),d(e.message)}finally{i.disabled=!1}}),e(`[data-logo-quitar]`,n).addEventListener(`click`,async t=>{let i=t.currentTarget;i.disabled=!0;try{await m(`quitar_logo`),r.logo=null,e(`[data-logo-preview]`,n).innerHTML=D(r),e(`[data-logo-label]`,n).textContent=`Subir logo`,i.hidden=!0}catch(e){d(e.message)}finally{i.disabled=!1}}),t(`input, select, textarea`,i).forEach(e=>e.addEventListener(`input`,()=>{u.textContent=``}))}function M(){let t=e(`[data-mc-guest]`),n=e(`[data-mc-panel]`),r=e(`[data-mc-buscados]`),i=e(`#buscados`),l=e(`[data-mc-publicar]`),m=e(`[data-mc-misautos]`),h=e(`#mis-autos`),_=e(`[data-mis-autos]`),v=e(`[data-mc-perfil]`),y=e(`#perfil`),b=!1,x=!1,S=(e,t)=>{t.hidden=!1,e.setAttribute(`aria-expanded`,`true`),e.classList.add(`is-active`),t.scrollIntoView({behavior:`smooth`,block:`start`})},C=async()=>{S(r,i),b||(b=!0,await f(i,await a()))},w=e=>{if(!e.length){_.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${c(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`;return}let t=e.filter(e=>e.estado===`publicado`).length;_.innerHTML=`
      <p class="mb-4 text-[15px] text-ink/70">${e.length} ${e.length===1?`auto`:`autos`} · ${t} ${t===1?`publicado`:`publicados`}</p>
      <ul class="grid gap-3">
        ${e.map(e=>{let t=u(e.fotos?.[0]??``),n=e.estado===`pausado`,r=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`;return`
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${t?`<img src="${s(t)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${n?`opacity-50 grayscale`:``}" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${s(e.codigo)}</span>
                  ${n?`<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${e.pausado_por_admin?`Pausado por Red de Autos`:`Pausado`}</span>`:`<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>`}
                  <span class="text-ink/60">${s(e.fotos?.length??0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${s(r)}</p>
                <p class="text-[15px]">${s(d(Number(e.precio),e.moneda))}</p>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              ${n?``:`<a href="${s(g({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${c(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${n?`publicado`:`pausado`}" data-id="${s(e.id)}">${n?`Volver a publicar`:`Pausar`}</button>`}
            </div>
          </li>`}).join(``)}
      </ul>`},T=async()=>{_.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${c(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let{autos:e}=await p(`mios`);w(e??[])}catch(e){_.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${s(e.message)}</p>`}},E=()=>{S(m,h),T()},D=!1,O=()=>{S(v,y),D||(D=!0,j(e(`[data-perfil-box]`)))};_.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-estado]`);if(t){t.disabled=!0;try{await p(`estado`,{id:t.dataset.id,estado:t.dataset.estado}),await T()}catch(e){t.disabled=!1,_.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${s(e.message)}</p>`)}}});let k=(t,n,r)=>{t.classList.toggle(`is-soon`,!n),t.tagName===`BUTTON`?t.disabled=!n:(t.toggleAttribute(`aria-disabled`,!n),n?t.removeAttribute(`tabindex`):t.setAttribute(`tabindex`,`-1`)),e(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,t).textContent=r},A=a=>{if(t.hidden=!!a,n.hidden=!a,!a){e(`[data-mc-title]`).textContent=`Mi cuenta`,e(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,i.hidden=!0,b=!1,h.hidden=!0,y.hidden=!0,D=!1;return}let o=a.tipo===`agencia`?a.agencia_tipo===`oficial`?`Concesionario oficial${a.marca_oficial?` ${a.marca_oficial}`:``}`:`Agencia multimarca`:`Particular`;e(`[data-mc-title]`).textContent=`Hola, ${a.nombre.split(` `)[0]}`,e(`[data-mc-sub]`).textContent=`${a.nombre} · ${o}`;let s=a.estado===`pendiente`;e(`[data-mc-pending]`).classList.toggle(`hidden`,!s),r.disabled=s,r.classList.toggle(`is-soon`,s),x=a.tipo===`agencia`&&a.estado===`aprobada`,k(l,x,x?`Cargá tu stock con la plantilla de Excel y tus fotos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),k(m,x,x?`Mirá, pausá o volvé a publicar tus autos.`:s?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),v.hidden=a.tipo!==`agencia`,a.tipo!==`agencia`&&(y.hidden=!0),a.tipo===`agencia`&&location.hash===`#perfil`&&O(),!s&&location.hash===`#buscados`&&C(),x&&location.hash===`#mis-autos`&&E()};r.addEventListener(`click`,C),m.addEventListener(`click`,E),v.addEventListener(`click`,O),l.addEventListener(`click`,e=>{x||e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>A(e.detail)),A(o())}document.documentElement.classList.add(`js`),i(),n(),M(),r();