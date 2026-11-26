import{a as e,n as t,r as n,t as r}from"./dom-C1X2dB9K.js";import{t as i}from"./dist-C9spcNMa.js";import{i as a,n as o,t as s}from"./icons-BCeff-oe.js";import{t as c}from"./ranking-MEihF3Kb.js";import{i as l,n as u,r as d,t as ee}from"./fotos-B_fbhPIY.js";import{n as f}from"./partners-hLCp_Db-.js";var p={inicio:`Inicio`,autos:`Listado de autos`,ficha:`Fichas de autos`,feria:`Feria online`,agencias:`Agencias`,agencia:`Página de una agencia`,marcas:`Marcas`,favoritos:`Favoritos`,"mi-cuenta":`Mi cuenta`,vender:`Vendé tu auto`,publicar:`Publicar (agencias)`,"como-funciona":`Cómo funciona`,"preguntas-frecuentes":`Preguntas frecuentes`,"quienes-somos":`Quiénes somos`,seguros:`Seguros`,terminos:`Términos y condiciones`,privacidad:`Privacidad`},m={directo:`Directo (escribieron la dirección, favoritos o apps)`,interno:`Otra pestaña del sitio`,google:`Google`,bing:`Bing`,yahoo:`Yahoo`,duckduckgo:`DuckDuckGo`,facebook:`Facebook`,instagram:`Instagram`,whatsapp:`WhatsApp`,telegram:`Telegram`,tiktok:`TikTok`,x:`X (Twitter)`,linkedin:`LinkedIn`,youtube:`YouTube`,"link compartido":`Link compartido (WhatsApp y otros)`,"vendedor independiente":`Link de un vendedor independiente`},h=e=>Number(e||0).toLocaleString(`es-AR`),g=e=>new Date(`${String(e).slice(0,10)}T12:00:00`).toLocaleDateString(`es-AR`,{day:`numeric`,month:`short`}),_=(e,t,n,r=``)=>`
  <div class="rounded-2xl border border-line bg-white p-5">
    <p class="flex items-center gap-2 text-[14px] font-medium text-ink/60">${s(n,`h-4 w-4`)} ${t}</p>
    <p class="mt-2 text-[32px] font-bold leading-none">${o(h(e))}</p>
    ${r?`<p class="mt-2 text-[13px] text-ink/50">${r}</p>`:``}
  </div>`;function v(e,t,n){let r=t.reduce((e,t)=>e+Number(t.n),0)||1;return`
  <div class="rounded-2xl border border-line bg-white p-5">
    <h3 class="text-[17px] font-bold">${e}</h3>
    ${t.length?`<ul class="mt-4 space-y-3">${t.map(e=>{let t=Math.round(Number(e.n)/r*100);return`<li>
        <div class="flex items-baseline justify-between gap-3 text-[14px]"><span class="min-w-0 truncate">${o(n(e))}</span><span class="shrink-0 font-bold">${o(h(e.n))} <span class="font-normal text-ink/50">· ${t}%</span></span></div>
        <div class="mt-1 h-2 overflow-hidden rounded-full bg-soft"><span class="est-barra block h-full rounded-full bg-brand" data-w="${t}"></span></div>
      </li>`}).join(``)}</ul>`:`<p class="mt-3 text-[14px] text-ink/60">Todavía no hay datos.</p>`}
  </div>`}async function y(e,t){let n=Number(e.dataset.dias||30);e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${s(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando estadísticas…</p>`;let{data:r,error:i}=await t.rpc(`mkt_estadisticas_sitio`,{p_dias:n});if(i)throw Error(`No pudimos cargar las estadísticas.`);let a=Math.max(1,...r.por_dia.map(e=>e.visitantes)),c=r.red;e.innerHTML=`
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-[22px] font-bold">Estadísticas del sitio</h2>
        <p class="mt-1 text-[14px] text-ink/60">Anónimas: sin cookies, sin guardar IP y sin servicios de terceros. Empezaron a contarse el 25 de noviembre de 2026.</p>
      </div>
      <div class="flex gap-2" role="group" aria-label="Período">
        ${[7,30,90].map(e=>`<button type="button" class="${e===n?`btn-primary`:`btn-outline`} h-[40px] !px-4 text-[14px]" data-est-dias="${e}" aria-pressed="${e===n}">${e} días</button>`).join(``)}
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      ${_(r.visitas,`Visitas`,`eye`,`Cada vez que alguien entra al sitio.`)}
      ${_(r.visitantes,`Visitantes`,`users`,`Personas distintas por día, sumadas.`)}
      ${_(r.paginas_vistas,`Páginas vistas`,`images`)}
      ${_(Number(r.contactos.whatsapp)+Number(r.contactos.llamadas),`Contactos a vendedores`,`message-circle`,`${h(r.contactos.whatsapp)} WhatsApp · ${h(r.contactos.llamadas)} llamadas · ${h(r.contactos.compartidos)} compartidos`)}
    </div>

    <div class="mt-4 rounded-2xl border border-line bg-white p-5">
      <h3 class="text-[17px] font-bold">Visitantes por día</h3>
      <div class="mt-4 flex h-[140px] items-end gap-[3px]" role="img" aria-label="Visitantes por día: ${o(r.por_dia.map(e=>`${g(e.dia)} ${e.visitantes}`).join(`, `))}">
        ${r.por_dia.map(e=>`<span class="mc-bar group relative flex-1 rounded-t-[4px] ${e.visitantes?`bg-brand`:`bg-line`}" data-h="${Math.max(3,Math.round(e.visitantes/a*100))}"><span class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[12px] text-white group-hover:block">${o(g(e.dia))}: ${o(e.visitantes)} visitantes · ${o(e.visitas)} visitas</span></span>`).join(``)}
      </div>
      <div class="mt-2 flex justify-between text-[12px] text-ink/50"><span>${o(g(r.por_dia[0]?.dia??``))}</span><span>Hoy</span></div>
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-3">
      ${v(`De dónde vienen`,r.origenes,e=>m[e.origen]??e.origen)}
      ${v(`Páginas más vistas`,r.paginas,e=>p[e.pagina]??e.pagina)}
      ${v(`Dispositivo`,r.dispositivos,e=>({celular:`Celular`,compu:`Compu / tablet`})[e.dispositivo]??`Otro`)}
    </div>

    <div class="mt-4 rounded-2xl border border-line bg-white p-5">
      <h3 class="text-[17px] font-bold">Autos más mirados</h3>
      ${r.autos.length?`<ol class="mt-4 divide-y divide-line">${r.autos.map((e,t)=>`
        <li class="flex items-center gap-4 py-3 text-[15px]">
          <span class="w-6 shrink-0 text-center font-bold text-ink/40">${t+1}</span>
          <a href="./auto.html?id=${encodeURIComponent(e.id)}" target="_blank" rel="noopener" class="min-w-0 flex-1 truncate font-medium hover:text-brand">${o(e.titulo)} <span class="font-normal text-ink/60">· ${o(e.agencia)}</span></a>
          <span class="shrink-0 text-ink/70">${s(`eye`,`inline h-4 w-4`)} ${o(h(e.vistas))}</span>
          <span class="shrink-0 text-ink/70">${s(`message-circle`,`inline h-4 w-4`)} ${o(h(e.contactos))}</span>
        </li>`).join(``)}</ol>`:`<p class="mt-3 text-[14px] text-ink/60">Todavía no hay datos.</p>`}
    </div>

    <div class="mt-4 rounded-2xl bg-soft p-5">
      <h3 class="text-[17px] font-bold">Números reales de la red (hoy)</h3>
      <p class="mt-1 text-[14px] text-ink/60">Son los que irían en el bloque de cifras de la home, que está oculto. Avisá cuando quieras mostrarlo.</p>
      <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        ${_(c.autos,`Autos publicados`,`car`)}${_(c.agencias,`Agencias verificadas`,`badge-check`)}${_(c.oficiales,`Concesionarios oficiales`,`store`)}${_(c.provincias,`Provincias`,`map-pin`)}
      </div>
    </div>`,e.querySelectorAll(`.mc-bar`).forEach(e=>{e.style.height=`${e.dataset.h}%`}),e.querySelectorAll(`.est-barra`).forEach(e=>{e.style.width=`${Math.max(2,e.dataset.w)}%`}),e.querySelectorAll(`[data-est-dias]`).forEach(n=>n.addEventListener(`click`,()=>{e.dataset.dias=n.dataset.estDias,y(e,t).catch(()=>{})}))}var b=e=>String(e||``).replace(/^549(\d{3})(\d{3})(\d{4})$/,`381 $2-$3`).replace(/^381 (\d{3}-\d{4})$/,`381 $1`),x=(e,t,n=``)=>`<label class="block ${n}"><span class="auth-label">${e}</span>${t}</label>`;async function S(e,n,i){e.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${s(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando partners…</p>`;let{partners:a}=await n(`listar`),c=a.filter(e=>e.activo).length;e.innerHTML=`
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-[22px] font-bold">Partners</h2>
        <p class="mt-1 text-[14px] text-ink/60">${a.length} cargados · ${c} visibles en <a href="./partners.html" target="_blank" rel="noopener" class="text-brand underline">la página de Partners</a>. Los clics son las veces que tocaron su WhatsApp (uno por persona por día).</p>
      </div>
      <button type="button" class="btn-primary h-[46px] !px-5" data-pa-nuevo>${s(`plus`,`h-4 w-4`)} Nuevo partner</button>
    </div>
    <div data-pa-form class="mt-6" hidden></div>
    <ul class="mt-6 grid gap-3">
      ${a.length?a.map(e=>`
      <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center ${e.activo?``:`opacity-60`}">
        <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-1.5">${l(e.logo)?`<img src="${o(l(e.logo))}" alt="" class="max-h-full max-w-full object-contain" />`:`<span class="text-[18px] font-bold text-brand">${o(e.nombre.slice(0,2).toUpperCase())}</span>`}</span>
        <div class="min-w-0 flex-1 text-[14px]">
          <p class="text-[16px] font-bold">${o(e.nombre)} ${e.activo?``:`<span class="ml-1 rounded-full bg-soft px-2 py-0.5 text-[12px] font-medium text-ink/70">Pausado</span>`}</p>
          <p class="text-ink/70">${o(e.rubro)}${e.ciudad?` · ${o(e.ciudad)}`:``} · WhatsApp ${o(b(e.whatsapp))}</p>
          ${e.beneficio?`<p class="mt-0.5 text-[#1E6B34]">${s(`tag`,`inline h-3.5 w-3.5`)} ${o(e.beneficio)}</p>`:``}
        </div>
        <div class="flex shrink-0 items-center gap-5">
          <span class="text-center"><b class="block text-[20px] leading-none">${o(e.clics.mes)}</b><small class="text-[12px] text-ink/60">clics 30 días</small></span>
          <span class="text-center"><b class="block text-[20px] leading-none">${o(e.clics.total)}</b><small class="text-[12px] text-ink/60">total</small></span>
          <div class="flex gap-2">
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px]" data-pa-editar="${o(e.id)}">Editar</button>
            <button type="button" class="btn-outline h-[40px] !px-3.5 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-pa-borrar="${o(e.id)}" aria-label="Borrar ${o(e.nombre)}">${s(`x`,`h-4 w-4`)}</button>
          </div>
        </div>
      </li>`).join(``):`<li class="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-ink/60">Todavía no cargaste partners. Tocá "Nuevo partner".</li>`}
    </ul>`;let d=r(`[data-pa-form]`,e),p=(t={})=>{let a=f.includes(t.rubro)||!t.rubro;d.innerHTML=`
      <form class="rounded-2xl border border-line bg-soft p-5 sm:p-6" novalidate>
        <h3 class="text-[18px] font-bold">${t.id?`Editar ${o(t.nombre)}`:`Nuevo partner`}</h3>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          ${x(`Nombre de la empresa`,`<input class="auth-input" name="nombre" maxlength="80" required value="${o(t.nombre??``)}" />`)}
          ${x(`Rubro`,`<select class="auth-input" name="rubro_sel">${f.map(e=>`<option ${e===t.rubro?`selected`:``}>${o(e)}</option>`).join(``)}<option value="__otro" ${a?``:`selected`}>Otro…</option></select>
            <input class="auth-input mt-2" name="rubro_otro" maxlength="40" placeholder="Escribí el rubro" value="${a?``:o(t.rubro)}" ${a?`hidden`:``} />`)}
          ${x(`WhatsApp`,`<input class="auth-input" name="whatsapp" inputmode="tel" required placeholder="381 555-1234" value="${o(t.whatsapp?b(t.whatsapp):``)}" />`)}
          ${x(`Ciudad (opcional)`,`<input class="auth-input" name="ciudad" maxlength="60" value="${o(t.ciudad??``)}" />`)}
          ${x(`Instagram (opcional)`,`<input class="auth-input" name="instagram" maxlength="31" placeholder="@usuario" value="${o(t.instagram?`@${t.instagram}`:``)}" />`)}
          ${x(`Dirección (opcional)`,`<input class="auth-input" name="direccion" maxlength="120" value="${o(t.direccion??``)}" />`)}
          ${x(`Beneficio para la red (opcional)`,`<input class="auth-input" name="beneficio" maxlength="120" placeholder="Ej.: 10% off presentando Red de Autos" value="${o(t.beneficio??``)}" />`,`sm:col-span-2`)}
          <div class="sm:col-span-2">
            <span class="auth-label">Logo</span>
            <div class="flex flex-wrap items-center gap-4">
              <span class="grid h-20 w-20 place-items-center overflow-hidden rounded-xl border border-line bg-white p-2" data-pa-prev>${l(t.logo)?`<img src="${o(l(t.logo))}" alt="" class="max-h-full max-w-full object-contain" />`:`<span class="text-[12px] text-ink/50">Sin logo</span>`}</span>
              <label class="btn-outline h-[44px] cursor-pointer !px-4 text-[14px]"><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" data-pa-logo /> ${s(`images`,`h-4 w-4`)} ${t.logo?`Cambiar logo`:`Subir logo`}</label>
              <span class="text-[13px] text-ink/60">Ideal: cuadrado, fondo blanco o transparente.</span>
            </div>
          </div>
          <label class="flex items-center gap-2 text-[15px] sm:col-span-2"><input type="checkbox" name="activo" class="h-4 w-4" ${t.activo===!1?``:`checked`} /> Visible en la página de Partners</label>
        </div>
        <p class="mt-4 hidden rounded-xl bg-[#FDECEC] px-4 py-3 text-[14px] text-[#B42318]" data-pa-error></p>
        <div class="mt-5 flex flex-wrap gap-2">
          <button type="submit" class="btn-primary h-[46px] !px-6">${s(`check`,`h-4 w-4`)} <span data-pa-label>Guardar</span></button>
          <button type="button" class="btn-outline h-[46px] !px-5" data-pa-cancelar>Cancelar</button>
        </div>
      </form>`,d.hidden=!1,d.scrollIntoView({behavior:`smooth`,block:`start`});let c=r(`form`,d),p=null;c.elements.rubro_sel.addEventListener(`change`,()=>{c.elements.rubro_otro.hidden=c.elements.rubro_sel.value!==`__otro`}),r(`[data-pa-logo]`,c).addEventListener(`change`,e=>{let t=e.target.files[0];t&&(!/^image\/(jpeg|png|webp)$/.test(t.type)||t.size>10485760?i.toast(`El logo tiene que ser JPG, PNG o WebP de hasta 10 MB`,!1):(p=t,r(`[data-pa-prev]`,c).innerHTML=`<img src="${o(URL.createObjectURL(t))}" alt="" class="max-h-full max-w-full object-contain" />`))}),r(`[data-pa-cancelar]`,c).addEventListener(`click`,()=>{d.hidden=!0,d.innerHTML=``}),c.addEventListener(`submit`,async a=>{a.preventDefault();let o=r(`[data-pa-error]`,c),s=e=>{o.textContent=e,o.classList.remove(`hidden`)};o.classList.add(`hidden`);let l=e=>c.elements[e].value.trim(),d=l(`rubro_sel`)===`__otro`?l(`rubro_otro`):l(`rubro_sel`);if(l(`nombre`).length<2)return s(`Escribí el nombre de la empresa.`);if(d.length<2)return s(`Escribí el rubro.`);let f=r(`[type=submit]`,c),m=r(`[data-pa-label]`,c);f.disabled=!0;try{let r={id:t.id,nombre:l(`nombre`),rubro:d,whatsapp:l(`whatsapp`),ciudad:l(`ciudad`),instagram:l(`instagram`),direccion:l(`direccion`),beneficio:l(`beneficio`),activo:c.elements.activo.checked};if(p){m.textContent=`Subiendo logo…`;let e=await u(),t=await ee(p,e),{path:a,token:o}=await n(`url_logo`,{formato:e}),{error:s}=await i.sb.storage.from(`mkt-fotos`).uploadToSignedUrl(a,o,t,{contentType:e===`jpg`?`image/jpeg`:`image/webp`});if(s)throw Error(`No se pudo subir el logo. Probá de nuevo.`);r.logo=a}m.textContent=`Guardando…`,await n(`guardar`,{partner:r}),i.toast(t.id?`Partner actualizado`:`Partner agregado`),await S(e,n,i)}catch(e){s(e.message),f.disabled=!1,m.textContent=`Guardar`}})};r(`[data-pa-nuevo]`,e).addEventListener(`click`,()=>p()),t(`[data-pa-editar]`,e).forEach(e=>e.addEventListener(`click`,()=>p(a.find(t=>t.id===e.dataset.paEditar)))),t(`[data-pa-borrar]`,e).forEach(t=>t.addEventListener(`click`,async()=>{let r=a.find(e=>e.id===t.dataset.paBorrar);if(await i.dialog({title:`Borrar partner`,text:`${r.nombre} deja de aparecer en la página de Partners y se borran su logo y sus clics. Si solo querés ocultarlo un tiempo, editalo y destildá "Visible".`,ok:`Borrar`,danger:!0,cancel:`Volver`}))try{await n(`borrar`,{id:r.id}),i.toast(`Partner borrado`),await S(e,n,i)}catch(e){i.handleError(e)}}))}var C=i(e.supabase.url,e.supabase.publishableKey,{auth:{persistSession:!0,autoRefreshToken:!0,storageKey:`rda-mkt-admin`}}),te=t=>`${e.supabase.url}/functions/v1/${t}`;async function w(t,n,r=!0){let i=null;r&&(i=(await C.auth.getSession()).data.session?.access_token);let a=await fetch(te(t),{method:`POST`,headers:{"Content-Type":`application/json`,apikey:e.supabase.publishableKey,...i?{Authorization:`Bearer ${i}`}:{}},body:JSON.stringify(n)}),o={};try{o=await a.json()}catch{}if(!a.ok){let e=Error(o.error||`No pudimos conectarnos.`);throw e.status=a.status,e}return o}var T=(e,t={})=>w(`mkt-admin`,{accion:e,...t}),ne=e=>String(e||``).replace(/^549(\d{3})(\d{3})(\d{4})$/,`+54 9 $1 $2-$3`),E=e=>e?`${e.slice(0,2)}-${e.slice(2,10)}-${e.slice(10)}`:``,D=e=>new Date(e).toLocaleString(`es-AR`,{day:`2-digit`,month:`2-digit`,year:`2-digit`,hour:`2-digit`,minute:`2-digit`}),O={activa:[`Activa`,`bg-[#E8F5E9] text-ok`],aprobada:[`Aprobada`,`bg-[#E8F5E9] text-ok`],pendiente:[`En revisión`,`bg-[#FFF6E5] text-[#8A5A00]`],rechazada:[`Rechazada`,`bg-[#FDECEC] text-[#B42318]`],suspendida:[`Suspendida`,`bg-[#FDECEC] text-[#B42318]`]},k=(e,t)=>`<span class="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${t}">${o(e)}</span>`;function A(e,t=!0){let n=r(`#toast`);n||(n=document.createElement(`div`),n.id=`toast`,n.className=`toast`,n.setAttribute(`role`,`status`),document.body.append(n)),n.textContent=e,n.classList.toggle(`!bg-[#B42318]`,!t),n.classList.add(`is-on`),clearTimeout(n._h),n._h=setTimeout(()=>n.classList.remove(`is-on`),2600)}function j({title:e,text:n,ok:i=`Confirmar`,danger:a=!1,extra:o=``,onOpen:s,cancel:c=`Cancelar`}){let l=r(`#adm-dialog`);r(`#dlg-title`).textContent=e,r(`#dlg-text`).textContent=n,r(`[data-dlg-extra]`,l).innerHTML=o;let u=r(`[data-dlg-ok]`,l);return u.textContent=i,u.hidden=!i,u.classList.toggle(`!bg-[#D92D20]`,a),u.disabled=!1,t(`[data-dlg-cancel]`,l)[1].textContent=c,l.hidden=!1,requestAnimationFrame(()=>l.classList.add(`is-open`)),s?.(l,u),(i?u:t(`[data-dlg-cancel]`,l)[1]).focus(),new Promise(e=>{let n=n=>{l.classList.remove(`is-open`),setTimeout(()=>{l.hidden=!0},200),u.removeEventListener(`click`,r),t(`[data-dlg-cancel]`,l).forEach(e=>e.removeEventListener(`click`,i)),document.removeEventListener(`keydown`,a),e(n)},r=()=>n(!0),i=()=>n(!1),a=e=>{e.key===`Escape`&&i()};u.addEventListener(`click`,r),t(`[data-dlg-cancel]`,l).forEach(e=>e.addEventListener(`click`,i)),document.addEventListener(`keydown`,a)})}var M=(e,t,n,r,i=`btn-outline`)=>`<button type="button" class="${i} h-[40px] !px-3.5 text-[14px]" data-op="${e}" data-id="${o(t)}">${s(r,`h-4 w-4`)} ${o(n)}</button>`;function N(e){let[t,n]=O[e.estado]??[e.estado,`bg-soft`],r=e.tipo===`agencia`?e.agencia_tipo===`oficial`?`Concesionario oficial ${e.marca_oficial??``}`:`Agencia multimarca`:e.tipo===`vendedor`?`Vendedor independiente`:`Particular`,i=[];e.estado===`pendiente`?i.push(M(`aprobar`,e.id,`Aprobar`,`circle-check`,`btn-primary`),M(`rechazar`,e.id,`Rechazar`,`x`)):e.estado===`rechazada`?i.push(M(`aprobar`,e.id,`Aprobar`,`circle-check`,`btn-primary`)):e.estado===`suspendida`?i.push(M(`reactivar`,e.id,`Reactivar`,`rotate-ccw`,`btn-primary`)):i.push(M(`suspender`,e.id,`Suspender`,`lock`)),e.bloqueada&&i.push(M(`desbloquear`,e.id,`Desbloquear`,`lock`)),i.push(M(`reset_pin`,e.id,`Nuevo PIN`,`rotate-ccw`)),i.push(M(`prueba`,e.id,e.es_prueba?`No es prueba`:`Marcar prueba`,`tag`));let a={nombre:`Nombre`,cuit:`CUIT`,agencia_tipo:`Tipo`,marca_oficial:`Marca oficial`},c=(e,t)=>t==null||t===``?`—`:e===`cuit`?E(String(t)):e===`agencia_tipo`?t===`oficial`?`Concesionario oficial`:`Agencia multimarca`:String(t),l=e.cambios_pendientes&&typeof e.cambios_pendientes==`object`?Object.entries(e.cambios_pendientes).filter(([e])=>a[e]):[],u=d(e.logo??``);return`
  <article class="rounded-2xl border border-line bg-white p-5 sm:p-6" data-card="${o(e.id)}">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="flex flex-wrap items-center gap-2 text-[18px] font-bold leading-tight">
          ${u?`<img src="${o(u)}" alt="" width="32" height="32" class="h-8 w-8 rounded-lg border border-line object-contain" />`:s(e.tipo===`agencia`?`store`:e.tipo===`vendedor`?`handshake`:`user`,`h-5 w-5 text-brand`)} <span class="break-words">${o(e.nombre)}</span>
        </p>
        <p class="mt-1 text-[14px] text-ink/70">${o(r)}</p>
      </div>
      <div class="flex flex-wrap gap-2">${k(t,n)}${e.es_prueba?k(`Prueba`,`bg-ink/10 text-ink`):``}${e.bloqueada?k(`Bloqueada 15 min`,`bg-[#FDECEC] text-[#B42318]`):``}</div>
    </div>
    <dl class="mt-4 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
      <div class="flex gap-2"><dt class="text-ink/60">WhatsApp</dt><dd><a href="https://wa.me/${o(e.telefono)}" target="_blank" rel="noopener noreferrer" class="font-medium text-brand underline-offset-4 hover:underline">${o(ne(e.telefono))}</a></dd></div>
      ${e.cuit?`<div class="flex gap-2"><dt class="text-ink/60">CUIT</dt><dd class="font-medium">${o(E(e.cuit))}</dd></div>`:``}
      ${e.dni?`<div class="flex gap-2"><dt class="text-ink/60">DNI</dt><dd class="font-medium">${o(Number(e.dni).toLocaleString(`es-AR`))}</dd></div>`:``}
      ${e.email&&e.tipo===`vendedor`?`<div class="flex gap-2"><dt class="text-ink/60">Email</dt><dd class="break-all">${o(e.email)}</dd></div>`:``}
      ${e.ciudad||e.provincia?`<div class="flex gap-2"><dt class="text-ink/60">Zona</dt><dd>${o([e.ciudad,e.provincia].filter(Boolean).join(`, `))}</dd></div>`:``}
      <div class="flex gap-2"><dt class="text-ink/60">Alta</dt><dd>${o(D(e.created_at))}</dd></div>
      ${e.revisado_at?`<div class="flex gap-2"><dt class="text-ink/60">Revisada</dt><dd>${o(D(e.revisado_at))}</dd></div>`:``}
    </dl>
    ${l.length?`
    <div class="mt-4 rounded-xl bg-[#EEF1FB] p-4">
      <p class="text-[14px] font-bold text-brand">Pidió cambiar${e.cambios_at?` · ${o(D(e.cambios_at))}`:``}</p>
      <ul class="mt-2 space-y-1 text-[14px]">${l.map(([t,n])=>`<li><span class="text-ink/60">${o(a[t])}:</span> ${o(c(t,e[t]))} → <b>${o(c(t,n))}</b></li>`).join(``)}</ul>
      <div class="mt-3 flex flex-wrap gap-2">${M(`aprobar_cambios`,e.id,`Aprobar cambios`,`circle-check`,`btn-primary`)}${M(`rechazar_cambios`,e.id,`Rechazar`,`x`)}</div>
    </div>`:``}
    <div class="mt-5 flex flex-wrap gap-2">${i.join(``)}</div>
  </article>`}var P=e=>`<div class="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-ink/60">${o(e)}</div>`,F=null;function re(e){let n=[[`Cuentas`,e.total,`user`],[`Particulares`,e.particulares,`user`],[`Agencias`,e.agencias,`store`],[`Vendedores independientes`,e.vendedores??0,`handshake`],[`Agencias aprobadas`,e.agencias_aprobadas,`badge-check`],[`Por revisar`,e.pendientes,`clipboard-check`],[`Suspendidas`,e.suspendidas,`lock`]],i=Math.max(1,...e.dias.map(e=>e.particulares+e.agencias)),a=e=>new Date(`${e}T12:00:00`).toLocaleDateString(`es-AR`,{weekday:`short`,day:`2-digit`,month:`2-digit`});r(`#v-resumen`).innerHTML=`
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      ${n.map(([e,t,n])=>`
      <div class="rounded-2xl border border-line bg-white p-5">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${s(n,`h-5 w-5`)}</span>
        <p class="mt-4 text-[30px] font-bold leading-none">${o(t)}</p>
        <p class="mt-1.5 text-[14px] text-ink/70">${o(e)}</p>
      </div>`).join(``)}
    </div>
    ${e.autos_revision?`<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF4E0] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FDEBC8]" data-go="autos"><span><b>${o(e.autos_revision)}</b> ${e.autos_revision===1?`auto de particular espera`:`autos de particulares esperan`} tu revisión</span>${s(`arrow-right`,`h-5 w-5`)}</button>`:``}
    ${e.cambios?`<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#EEF1FB] px-5 py-4 text-left text-brand transition-colors hover:bg-[#E2E7FA]" data-go="concesionarios"><span><b>${o(e.cambios)}</b> ${e.cambios===1?`agencia pidió`:`agencias pidieron`} cambiar datos de su perfil</span>${s(`arrow-right`,`h-5 w-5`)}</button>`:``}
    ${e.vendedores_pendientes?`<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF6E5] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FFEFD1]" data-go="vendedores"><span><b>${o(e.vendedores_pendientes)}</b> ${e.vendedores_pendientes===1?`vendedor independiente espera`:`vendedores independientes esperan`} revisión</span>${s(`arrow-right`,`h-5 w-5`)}</button>`:``}
    ${e.pendientes?`<button type="button" class="mt-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FFF6E5] px-5 py-4 text-left text-[#8A5A00] transition-colors hover:bg-[#FFEFD1]" data-go="concesionarios"><span><b>${o(e.pendientes)}</b> ${e.pendientes===1?`agencia espera`:`agencias esperan`} revisión</span>${s(`arrow-right`,`h-5 w-5`)}</button>`:``}
    <section class="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-6" aria-labelledby="reg-title">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 id="reg-title" class="text-[20px] font-bold">Registros de los últimos 14 días</h2>
        <p class="flex gap-4 text-[13px] text-ink/70"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-brand"></span>Particulares</span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-ink"></span>Agencias</span></p>
      </div>
      <ul class="mt-5 space-y-2.5">
        ${e.dias.slice().reverse().map(e=>{let t=e.particulares+e.agencias;return`
        <li class="grid grid-cols-[92px_minmax(0,1fr)_28px] items-center gap-3 text-[13px]">
          <span class="capitalize text-ink/70">${o(a(e.dia))}</span>
          <span class="flex h-3 overflow-hidden rounded-full bg-soft" role="img" aria-label="${o(`${e.particulares} particulares y ${e.agencias} agencias`)}">
            <span class="adm-bar bg-brand" data-w="${e.particulares/i*100}"></span><span class="adm-bar bg-ink" data-w="${e.agencias/i*100}"></span>
          </span>
          <span class="text-right font-medium">${o(t)}</span>
        </li>`}).join(``)}
      </ul>
      ${e.pruebas?`<p class="mt-5 text-[13px] text-ink/60">No se cuentan ${o(e.pruebas)} ${e.pruebas===1?`cuenta`:`cuentas`} de prueba.</p>`:``}
    </section>`,t(`.adm-bar`,r(`#v-resumen`)).forEach(e=>{e.style.width=`${Number(e.dataset.w)||0}%`});let c=r(`[data-count-pend]`);c.textContent=String(e.pendientes),c.hidden=!e.pendientes;let l=r(`[data-count-vend]`);l&&(l.textContent=String(e.vendedores_pendientes??0),l.hidden=!e.vendedores_pendientes);let u=r(`[data-count-pruebas]`);u.textContent=String(e.pruebas),u.hidden=!e.pruebas}async function I(){F=await T(`resumen`),re(F)}var L={particulares:{tipo:`particular`,titulo:`Particulares`,placeholder:`Buscar por nombre, ciudad o celular`,estados:[[``,`Todos los estados`],[`activa`,`Activa`],[`suspendida`,`Suspendida`]]},vendedores:{tipo:`vendedor`,titulo:`Vendedores independientes`,placeholder:`Buscar por nombre, ciudad o celular`,estados:[[``,`Todos los estados`],[`pendiente`,`En revisión`],[`aprobada`,`Aprobado`],[`rechazada`,`Rechazado`],[`suspendida`,`Suspendido`]]},concesionarios:{tipo:`agencia`,titulo:`Concesionarios y agencias`,placeholder:`Buscar por nombre, ciudad, celular o CUIT`,estados:[[``,`Todos los estados`],[`pendiente`,`En revisión`],[`aprobada`,`Aprobada`],[`rechazada`,`Rechazada`],[`suspendida`,`Suspendida`]]}};function ie(e){let t=r(`#v-${e}`);if(t.dataset.ready)return t;let n=L[e];t.dataset.ready=`1`,t.innerHTML=`
    ${e===`concesionarios`?`<div data-pend></div>`:``}
    <form class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]" role="search" aria-label="Buscar ${o(n.titulo)}">
      <label class="sr-only" for="q-${e}">Buscar</label>
      <div class="relative">
        ${s(`search`,`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50`)}
        <input id="q-${e}" name="q" type="search" class="auth-input pl-11" placeholder="${o(n.placeholder)}" maxlength="60" />
      </div>
      <label class="sr-only" for="e-${e}">Estado</label>
      <div class="relative">
        <select id="e-${e}" name="estado" class="auth-input appearance-none pr-10">${n.estados.map(([e,t])=>`<option value="${e}">${o(t)}</option>`).join(``)}</select>
        ${s(`chevron-down`,`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2`)}
      </div>
    </form>
    <div data-lista class="mt-6"></div>`;let i=r(`form`,t),a;return i.addEventListener(`input`,()=>{clearTimeout(a),a=setTimeout(()=>X(e),350)}),i.addEventListener(`submit`,t=>{t.preventDefault(),X(e)}),t}async function R(e){let t=L[e],n=ie(e),i=r(`form`,n),a=r(`[data-lista]`,n);a.innerHTML=P(`Cargando…`);let o=i.elements.estado.value,[s,c,l]=await Promise.all([T(`cuentas`,{tipo:t.tipo,q:i.elements.q.value,estado:o}),e===`concesionarios`?T(`cuentas`,{tipo:`agencia`,estado:`pendiente`}):null,e===`concesionarios`?T(`cuentas`,{tipo:`agencia`,cambios:!0}):null]),u=s.cuentas;if(c){r(`[data-pend]`,n).innerHTML=c.cuentas.length?`
      <section class="mb-10 rounded-2xl bg-[#FFF6E5] p-4 sm:p-6" aria-labelledby="pend-title">
        <h2 id="pend-title" class="mb-4 text-[20px] font-bold text-[#8A5A00]">Esperan revisión (${c.cuentas.length})</h2>
        <div class="grid gap-4 xl:grid-cols-2">${c.cuentas.map(N).join(``)}</div>
      </section>`:``;let e=l.cuentas.filter(e=>e.estado!==`pendiente`);e.length&&r(`[data-pend]`,n).insertAdjacentHTML(`beforeend`,`
      <section class="mb-10 rounded-2xl bg-[#EEF1FB] p-4 sm:p-6" aria-labelledby="camb-title">
        <h2 id="camb-title" class="mb-4 text-[20px] font-bold text-brand">Cambios de perfil para revisar (${e.length})</h2>
        <div class="grid gap-4 xl:grid-cols-2">${e.map(N).join(``)}</div>
      </section>`),o||(u=u.filter(e=>e.estado!==`pendiente`))}a.innerHTML=u.length?`<p class="mb-4 text-[14px] text-ink/60">${u.length} ${u.length===1?`cuenta`:`cuentas`}</p><div class="grid gap-4 xl:grid-cols-2">${u.map(N).join(``)}</div>`:P(i.elements.q.value||o?`No encontramos cuentas con esos filtros.`:`Todavía no hay ${t.titulo.toLowerCase()}.`)}var z=e=>new Date(e).toLocaleString(`es-AR`,{day:`2-digit`,month:`short`,hour:`2-digit`,minute:`2-digit`});function ae(e){let t=Date.now();return e.estado===`cancelada`?[`Cancelada`,`bg-[#FDECEC] text-[#B42318]`,!1]:new Date(e.termina).getTime()<=t?[`Terminada`,`bg-ink/10 text-ink`,!1]:new Date(e.empieza).getTime()<=t?[`En curso`,`bg-[#E8F5E9] text-ok`,!0]:[`Próxima`,`bg-[#EEF1FB] text-brand`,!0]}function B(e){let t=(V.autos??[]).filter(t=>t.feria_id===e.id);if(!t.length)return`<p class="mt-3 text-[14px] text-ink/60">${s(`zap`,`inline h-4 w-4`)} Todavía ninguna agencia sumó autos.</p>`;let n=Date.now();return`
    <details class="mt-4 rounded-xl border border-line">
      <summary class="cursor-pointer select-none px-4 py-3 text-[15px] font-bold">${s(`zap`,`inline h-4 w-4 text-[#E5484D]`)} ${t.length} ${t.length===1?`auto sumado`:`autos sumados`} por las agencias</summary>
      <ul class="divide-y divide-line border-t border-line">
        ${t.map(t=>{let r=t.mkt_autos??{},i=new Date(t.empieza).getTime(),c=new Date(t.termina).getTime()<=n?`Terminó`:i>n?`Programada`:`Activa`;return`
          <li class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0 text-[14px]">
              <p class="font-bold">${o(`${r.marca??``} ${r.modelo??``} ${r.version??``} ${r.anio??``}`)} <span class="font-normal text-ink/60">· ${o(r.mkt_cuentas?.nombre??``)} · ${o(r.codigo??``)}</span></p>
              <p class="mt-0.5"><s class="text-ink/50">${o(a(Number(r.precio),r.moneda))}</s> <b class="text-[#E5484D]">${o(a(Number(t.precio_feria),r.moneda))}</b> · ${o(z(t.empieza))} → ${o(z(t.termina))} · ${o(c)}${r.estado===`publicado`?``:` · no publicado`}</p>
            </div>
            <button type="button" class="btn-outline h-[40px] shrink-0 !px-4 text-[14px] hover:!border-[#D92D20] hover:!bg-[#D92D20]" data-feria-sacar="${o(t.auto_id)}" data-feria-de="${o(e.id)}">${s(`x`,`h-4 w-4`)} Sacar</button>
          </li>`}).join(``)}
      </ul>
    </details>`}function oe(e,t){let[n,r,i]=ae(e),a=e.invitacion_enviada_at?`Invitación enviada el ${o(z(e.invitacion_enviada_at))} a ${o(e.invitados)} ${e.invitados===1?`agencia`:`agencias`} (campanita a todas · ${o(e.invitados_ok)} por Telegram)`:`Sin invitar · ${o(t)} ${t===1?`agencia aprobada`:`agencias aprobadas`} para invitar`;return`
  <article class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 md:flex-row md:items-start md:justify-between">
    <div class="min-w-0">
      ${k(n,r)}
      <h3 class="mt-3 text-[20px] font-bold leading-tight">${o(e.nombre)}</h3>
      ${e.descripcion?`<p class="mt-1 text-[15px] text-ink/70">${o(e.descripcion)}</p>`:``}
      <p class="mt-2 text-[15px]">${o(z(e.empieza))} → ${o(z(e.termina))}</p>
      <p class="mt-1 text-[13px] text-ink/60">${a}</p>
      ${B(e)}
    </div>
    ${i?`<div class="flex shrink-0 flex-wrap gap-2">
      <button type="button" class="btn-primary h-[46px] !px-5" data-feria-invitar="${o(e.id)}">${s(`message-circle`,`h-4 w-4`)} ${e.invitacion_enviada_at?`Volver a invitar`:`Invitar agencias`}</button>
      <button type="button" class="btn-outline h-[46px] !border-[#F3B8B4] !px-5 !text-[#B42318] hover:!border-[#D92D20] hover:!bg-[#D92D20] hover:!text-white" data-feria-cancelar="${o(e.id)}">Cancelar</button>
    </div>`:``}
  </article>`}var V={ferias:[],agencias_aprobadas:0,autos:[]};async function H(){let e=r(`#feria-lista`);e.innerHTML=P(`Cargando…`),V=await T(`ferias`),e.innerHTML=V.ferias.length?V.ferias.map(e=>oe(e,V.agencias_aprobadas)).join(``):P(`Todavía no creaste ninguna feria.`)}async function se(e){e.preventDefault();let t=e.currentTarget,n=r(`[data-error]`,t);n.hidden=!0;let i=e=>{r(`span`,n).textContent=e,n.hidden=!1},a=t.elements.nombre.value.trim(),o=t.elements.empieza.value,s=t.elements.termina.value;if(a.length<3)return i(`Escribí el nombre de la feria.`);if(!o||!s)return i(`Completá cuándo empieza y cuándo termina.`);let c=new Date(o),l=new Date(s);if(l<=c)return i(`La feria tiene que terminar después de empezar.`);if(l<=new Date)return i(`La fecha de fin ya pasó.`);let u=r(`[data-submit]`,t);u.disabled=!0;try{await T(`crear_feria`,{nombre:a,descripcion:t.elements.descripcion.value.trim(),empieza:c.toISOString(),termina:l.toISOString()}),t.reset(),A(`Feria creada`),await H()}catch(e){if(e?.status===401)return $(e);i(e.message)}finally{u.disabled=!1}}async function ce(e){let t=V.ferias.find(t=>t.id===e),n=V.agencias_aprobadas;if(!n)return j({title:`No hay a quién invitar`,text:`Todavía no hay agencias aprobadas en el marketplace. Aprobá alguna en "Concesionarios" y volvé.`,ok:``,cancel:`Entendido`});if(await j({title:t?.invitacion_enviada_at?`Volver a invitar`:`Invitar agencias`,text:`Les llega a ${n} ${n===1?`agencia aprobada`:`agencias aprobadas`} un aviso en la campanita del sitio y, a las que conectaron Telegram, un mensaje del bot con el nombre y las fechas de "${t?.nombre??``}".`,ok:`Enviar invitaciones`}))try{let t=await T(`invitar_feria`,{id:e});A(`Invitación enviada a ${t.total} ${t.total===1?`agencia`:`agencias`} (${t.enviados} por Telegram)`),await H()}catch(e){$(e)}}async function U(e){if(await j({title:`Cancelar feria`,text:`"${V.ferias.find(t=>t.id===e)?.nombre??``}" deja de mostrarse en el sitio. No se puede reactivar: si hace falta, creá una nueva.`,ok:`Cancelar feria`,cancel:`Volver`,danger:!0}))try{await T(`cancelar_feria`,{id:e}),A(`Feria cancelada`),await H()}catch(e){$(e)}}async function W(e,t){let n=(V.autos??[]).find(n=>n.feria_id===e&&n.auto_id===t)?.mkt_autos??{};if(await j({title:`Sacar de la feria`,text:`${n.marca??``} ${n.modelo??``} ${n.anio??``} de ${n.mkt_cuentas?.nombre??`la agencia`} deja de mostrarse en la feria y vuelve a su precio normal. La agencia puede volver a sumarlo.`,ok:`Sacar`,cancel:`Volver`,danger:!0}))try{await T(`quitar_auto_feria`,{feria:e,auto:t}),A(`Auto sacado de la feria`),await H()}catch(e){$(e)}}async function G(){let e=r(`#v-pruebas`);e.innerHTML=P(`Cargando…`);let{cuentas:t}=await T(`cuentas`,{prueba:!0});e.innerHTML=`
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5">
      <p class="max-w-[620px] text-[15px] text-ink/75">Las cuentas marcadas como prueba no se cuentan en el resumen. Desde acá las podés borrar todas juntas (también su usuario de ingreso).</p>
      <button type="button" class="btn-primary h-[48px] !bg-[#D92D20] !px-5 hover:!bg-[#B42318]" data-borrar-pruebas ${t.length?``:`disabled`}>${s(`x`,`h-4 w-4`)} Borrar ${t.length} ${t.length===1?`cuenta`:`cuentas`} de prueba</button>
    </div>
    ${t.length?`<div class="grid gap-4 xl:grid-cols-2">${t.map(N).join(``)}</div>`:P(`No hay cuentas de prueba.`)}`}var K=``;async function q(){let e=r(`#v-autos`);if(!e.dataset.listo){e.dataset.listo=`1`,e.innerHTML=`
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[15px] text-ink/70">Autos de agencias y particulares. Los de particulares salen recién cuando los aprobás. Si pausás uno, el vendedor no puede volver a publicarlo.</p>
        <label class="relative block sm:w-[320px]"><span class="sr-only">Buscar autos</span>
          <input type="search" data-autos-q placeholder="Buscar marca, modelo, código o agencia" class="auth-input !pl-10" />
          ${s(`search`,`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50`)}
        </label>
      </div>
      <div data-autos-list></div>`;let t;r(`[data-autos-q]`,e).addEventListener(`input`,e=>{clearTimeout(t),t=setTimeout(()=>{K=e.target.value,q()},350)}),e.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-auto-estado]`);if(t){t.disabled=!0;try{await T(`auto_estado`,{id:t.dataset.id,estado:t.dataset.autoEstado}),await q()}catch(e){t.disabled=!1,$(e)}}})}let t=r(`[data-autos-list]`,e),{autos:n}=await T(`autos`,{q:K});t.innerHTML=n.length?`<p class="mb-3 text-[14px] text-ink/60">${n.length} ${n.length===1?`auto`:`autos`}</p><ul class="grid gap-3">${n.map(e=>{if(e.estado===`revision`)return ue(e);let t=d(e.fotos?.[0]??``),n=e.estado!==`publicado`;return`
    <li class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
      <div class="flex min-w-0 flex-1 items-center gap-4">
        ${t?`<img src="${o(t)}" alt="" width="96" height="72" loading="lazy" class="h-[64px] w-[86px] shrink-0 rounded-lg object-cover ${n?`opacity-50 grayscale`:``}" />`:`<span class="h-[64px] w-[86px] shrink-0 rounded-lg bg-soft"></span>`}
        <div class="min-w-0">
          <p class="truncate font-bold">${o(`${e.marca} ${e.modelo} ${e.version} ${e.anio}`)}</p>
          <p class="text-[14px] text-ink/70">${o(a(Number(e.precio),e.moneda))} · ${o(e.cuenta?.nombre??``)} · ${o(e.codigo)}${e.cuenta?.es_prueba?` · <b>prueba</b>`:``}</p>
          <p class="text-[13px] ${n?`text-[#8A5A00]`:`text-ok`}">${e.estado===`vendido`?`Vendido`:n?e.pausado_por_admin?`Pausado por vos`:`Pausado por ${e.cuenta?.tipo===`particular`?`el particular`:`la agencia`}`:`Publicado`}${e.cuenta?.tipo===`particular`?` · Particular`:``} · ${o(D(e.created_at))}</p>
        </div>
      </div>
      <div class="flex shrink-0 gap-2">
        ${n?``:`<a href="./auto.html?id=${encodeURIComponent(e.id)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[40px] !px-4 text-[14px]">${s(`eye`,`h-4 w-4`)} Ver</a>`}
        ${e.estado===`vendido`?``:`<button type="button" class="btn-outline h-[40px] !px-4 text-[14px]" data-auto-estado="${n?`publicado`:`pausado`}" data-id="${o(e.id)}">${n?`Volver a publicar`:`Pausar`}</button>`}
      </div>
    </li>`}).join(``)}</ul>`:`<p class="rounded-2xl bg-soft px-5 py-8 text-center text-ink/60">${K?`No hay autos con esa búsqueda.`:`Todavía no hay autos cargados.`}</p>`}function le(e){return`<div class="mt-3 rounded-xl border border-line bg-white p-3"><p class="text-[14px]">Patente: ${e.dominio?`<b class="rounded-md border border-ink/20 bg-white px-2 py-0.5 font-mono tracking-[0.1em]">${o(e.dominio)}</b>`:`<span class="text-ink/60">sin patente</span>`}</p>${(e.patente_repetida??[]).length?`<p class="mt-2 rounded-lg bg-[#FDECEC] px-3 py-2 text-[13px] text-[#B42318]">⚠ Esta patente también está en: ${e.patente_repetida.map(o).join(` · `)}</p>`:``}${e.cedula_url?`<a href="${o(e.cedula_url)}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block"><img src="${o(e.cedula_url)}" alt="Cédula del auto" class="max-h-[200px] rounded-lg border border-line" /></a>
       <p class="text-[12px] text-ink/60">Compará marca, modelo, año y patente con el aviso. La cédula se borra sola al aprobar o rechazar.</p>`:e.cedula_verificada_at?`<p class="mt-1 text-[13px] text-ok">✓ Cédula verificada el ${o(D(e.cedula_verificada_at))} (cambio de datos, misma patente)</p>`:`<p class="mt-1 text-[13px] text-[#B42318]">Sin cédula</p>`}</div>`}function ue(e){let t=(e.fotos??[]).map(e=>d(e)).filter(Boolean),n=String(e.cuenta?.telefono??``).replace(/\D/g,``);return`
    <li class="rounded-2xl border-2 border-[#F5C26B] bg-[#FFFBF2] p-4 sm:p-5">
      <p class="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8A5A00]">En revisión · Particular · ${o(D(e.updated_at??e.created_at))}</p>
      <p class="mt-1 text-[18px] font-bold">${o(`${e.marca} ${e.modelo} ${e.version} ${e.anio}`)}</p>
      <p class="text-[14px] text-ink/75">${o(a(Number(e.precio),e.moneda))} · ${o(Number(e.km).toLocaleString(`es-AR`))} km · ${o(e.combustible)} · ${o(e.transmision)} · ${o(`${e.ciudad}, ${e.provincia}`)}</p>
      <p class="text-[14px] text-ink/75">${o(e.cuenta?.nombre??``)}${n?` · <a class="text-brand underline" href="https://wa.me/${o(n)}" target="_blank" rel="noopener noreferrer">WhatsApp ${o(n)}</a>`:``}</p>
      ${e.descripcion?`<p class="mt-2 whitespace-pre-line text-[14px]">${o(e.descripcion)}</p>`:``}
      ${le(e)}
      ${t.length?`<div class="mt-3 flex gap-2 overflow-x-auto pb-1">${t.map(e=>`<a href="${o(e)}" target="_blank" rel="noopener noreferrer" class="shrink-0"><img src="${o(e)}" alt="" width="160" height="120" loading="lazy" class="h-[90px] w-[120px] rounded-lg object-cover sm:h-[120px] sm:w-[160px]" /></a>`).join(``)}</div>`:``}
      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class="btn-primary h-[44px] !px-5 text-[14px]" data-auto-estado="publicado" data-id="${o(e.id)}">${s(`circle-check`,`h-4 w-4`)} Aprobar y publicar</button>
        <button type="button" class="btn-outline h-[44px] !px-5 text-[14px]" data-auto-estado="pausado" data-id="${o(e.id)}">${s(`x`,`h-4 w-4`)} Rechazar</button>
      </div>
    </li>`}var J={resumen:I,particulares:()=>R(`particulares`),concesionarios:()=>R(`concesionarios`),vendedores:()=>R(`vendedores`),feria:H,autos:()=>q(),buscados:()=>c(r(`#v-buscados`),C),estadisticas:()=>y(r(`#v-estadisticas`),C),partners:()=>S(r(`#v-partners`),(e,t={})=>w(`mkt-partners`,{accion:e,...t}),{toast:A,handleError:$,dialog:j,sb:C}),pruebas:G},Y=`resumen`,X=async(e=Y)=>{try{await J[e]()}catch(e){$(e)}},de={aprobar:{title:`Aprobar cuenta`,text:`Una agencia va a poder publicar su stock; un vendedor independiente, ver las comisiones y usar su link. Avisale por WhatsApp que ya está habilitada.`,ok:`Aprobar`},rechazar:{title:`Rechazar cuenta`,text:`No va a poder ingresar. Podés volver a aprobarla más adelante.`,ok:`Rechazar`,danger:!0},suspender:{title:`Suspender cuenta`,text:`La cuenta no va a poder ingresar y su sesión abierta se corta. Podés reactivarla cuando quieras.`,ok:`Suspender`,danger:!0},reactivar:{title:`Reactivar cuenta`,text:`La cuenta vuelve a poder ingresar.`,ok:`Reactivar`},desbloquear:{title:`Desbloquear`,text:`Se borran los intentos fallidos de PIN y puede volver a probar ya.`,ok:`Desbloquear`},reset_pin:{title:`Crear un PIN nuevo`,text:`Se genera un PIN temporal de 6 números y el anterior deja de funcionar. Lo vas a ver una sola vez para mandárselo por WhatsApp.`,ok:`Crear PIN nuevo`},aprobar_cambios:{title:`Aprobar cambios de perfil`,text:`Los datos nuevos (nombre, CUIT o tipo) se publican enseguida.`,ok:`Aprobar cambios`},rechazar_cambios:{title:`Rechazar cambios de perfil`,text:`Se descartan los datos nuevos y quedan los de antes. Avisale a la agencia por WhatsApp.`,ok:`Rechazar cambios`,danger:!0},prueba:{title:`Cuenta de prueba`,text:`Cambia si esta cuenta se marca como de prueba (no se cuenta en el resumen y se puede borrar desde "Pruebas").`,ok:`Cambiar`}};async function fe(e,t,n){let i=de[e];if(i&&await j(i))try{let n=await T(`cuenta`,{id:t,op:e});if(n.pin_temporal){let e=n.cuenta.telefono,t=`Hola ${n.cuenta.nombre.split(` `)[0]}, te creamos un PIN nuevo para entrar a Red de Autos: ${n.pin_temporal}. Ingresá con tu celular y este PIN.`;await j({title:`PIN nuevo creado`,text:`Mandale este PIN a ${n.cuenta.nombre}. No lo vas a poder ver de nuevo.`,ok:``,cancel:`Listo`,extra:`
          <p class="mt-5 rounded-2xl bg-soft py-5 text-center text-[34px] font-bold tracking-[0.3em]">${o(n.pin_temporal)}</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" class="btn-outline h-[48px] justify-center" data-copy="${o(n.pin_temporal)}">${s(`clipboard-check`,`h-4 w-4`)} Copiar PIN</button>
            <a href="https://wa.me/${o(e)}?text=${encodeURIComponent(t)}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px]">${s(`whatsapp`,`h-4 w-4`)} Enviar por WhatsApp</a>
          </div>`,onOpen:e=>{r(`[data-copy]`,e)?.addEventListener(`click`,async e=>{try{await navigator.clipboard.writeText(e.currentTarget.dataset.copy),A(`PIN copiado`)}catch{A(`No se pudo copiar`,!1)}})}})}else A(`Listo, cambio guardado`);await Promise.all([I(),Y===`resumen`?null:J[Y]()])}catch(e){$(e)}}async function pe(){if(await j({title:`Borrar cuentas de prueba`,text:`Se borran para siempre todas las cuentas marcadas como prueba y sus usuarios de ingreso. No se puede deshacer.

Escribí BORRAR para confirmar.`,ok:`Borrar para siempre`,danger:!0,extra:`<label for="dlg-confirm" class="sr-only">Escribí BORRAR</label><input id="dlg-confirm" class="auth-input mt-4 uppercase" autocomplete="off" placeholder="BORRAR" />`,onOpen:(e,t)=>{t.disabled=!0;let n=r(`#dlg-confirm`,e);n.addEventListener(`input`,()=>{t.disabled=n.value.trim().toUpperCase()!==`BORRAR`}),setTimeout(()=>n.focus(),50)}}))try{let e=await T(`borrar_pruebas`,{confirmar:`BORRAR`});A(`Se borraron ${e.borradas} ${e.borradas===1?`cuenta`:`cuentas`} de prueba`),await Promise.all([I(),G()])}catch(e){$(e)}}function Z(e){if(r(`#adm-loading`).hidden=!0,r(`#adm-panel`).hidden=!0,r(`#adm-logout`).hidden=!0,r(`#adm-login`).hidden=!1,e){let t=r(`[data-error]`,r(`#adm-login`));r(`span`,t).textContent=e,t.hidden=!1}setTimeout(()=>r(`#adm-tel`).focus(),50)}async function Q(){r(`#adm-loading`).hidden=!1,r(`#adm-login`).hidden=!0,await I(),r(`#adm-loading`).hidden=!0,r(`#adm-panel`).hidden=!1,r(`#adm-logout`).hidden=!1}function $(e){e?.status===401?C.auth.signOut().finally(()=>Z(`Tu sesión venció. Volvé a ingresar.`)):A(e?.message||`Algo salió mal`,!1)}async function me(){n(r(`#adm-tabs`),e=>{Y=e.dataset.tab,t(`[role="tabpanel"]`).forEach(e=>{e.hidden=e.id!==`v-${Y}`}),X(Y)});let e=e=>r(`#t-${e}`).click();document.addEventListener(`click`,t=>{let n=t.target.closest(`[data-go]`);n&&e(n.dataset.go);let r=t.target.closest(`[data-op]`);r&&fe(r.dataset.op,r.dataset.id,r.closest(`[data-card]`)),t.target.closest(`[data-borrar-pruebas]`)&&pe()}),r(`#feria-form`).addEventListener(`submit`,se),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-feria-invitar]`);t&&ce(t.dataset.feriaInvitar);let n=e.target.closest(`[data-feria-cancelar]`);n&&U(n.dataset.feriaCancelar);let r=e.target.closest(`[data-feria-sacar]`);r&&W(r.dataset.feriaDe,r.dataset.feriaSacar)}),r(`#adm-refresh`).addEventListener(`click`,()=>Promise.all([X(`resumen`),Y===`resumen`?null:X(Y)]).then(()=>A(`Actualizado`))),r(`[data-toggle-pw]`).addEventListener(`click`,e=>{let t=r(`#adm-clave`),n=t.type===`password`;t.type=n?`text`:`password`,e.currentTarget.setAttribute(`aria-pressed`,String(n)),e.currentTarget.setAttribute(`aria-label`,n?`Ocultar contraseña`:`Mostrar contraseña`)});let i=r(`#adm-login-form`);i.addEventListener(`submit`,async e=>{e.preventDefault();let t=r(`[data-error]`,i);t.hidden=!0;let n=i.elements.telefono.value,a=i.elements.clave.value;if(n.replace(/\D/g,``).length<10||!a){r(`span`,t).textContent=`Completá el celular y la contraseña.`,t.hidden=!1;return}let o=r(`[data-submit]`,i);o.disabled=!0,r(`svg.i-loader-circle`,o).classList.remove(`hidden`);try{let e=await w(`admin`,{accion:`login`,telefono:n,clave:a},!1),{error:t}=await C.auth.verifyOtp({email:e.email,token:e.otp,type:`email`});if(t)throw Error(`No pudimos iniciar la sesión.`);i.reset(),await Q()}catch(e){r(`span`,t).textContent=e.message,t.hidden=!1}finally{o.disabled=!1,r(`svg.i-loader-circle`,o).classList.add(`hidden`)}}),r(`#adm-logout`).addEventListener(`click`,async()=>{await C.auth.signOut(),Z()});let{data:a}=await C.auth.getSession();if(!a.session)return Z();try{await Q()}catch(e){e?.status===401?Z():$(e)}}document.documentElement.classList.add(`js`),me();