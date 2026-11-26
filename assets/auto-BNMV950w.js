import{a as e,n as t,t as n}from"./dom-CSnsUUoB.js";import{n as r,r as i,t as a}from"./a11y-3Npf8TRU.js";import{c as o,n as s,s as c,t as l}from"./auth-GF6d9ne3.js";import{i as u,n as d,r as f}from"./carCard-CBVtmFNn.js";import{t as p}from"./busquedas-C92xsTyH.js";import{a as m,i as h,n as g,r as _,t as v}from"./icons-BDwMUW1t.js";import{s as y}from"./autosApi-DDQ_u59i.js";import{a as b,i as x,l as S,o as C,r as w,s as T,t as ee,u as E}from"./catalog-C6oEt7qm.js";import{i as D,o as O,r as k}from"./autosReales-KkoND1e2.js";import{n as A,r as j}from"./oferta-o_gfkh8Z.js";import{n as M,t as N}from"./seoDinamico-BymFIwq4.js";var P=new Map;async function F(e,t=``){let n=new URL(`./`,location.href),r=new URL(`auto.html?id=${encodeURIComponent(e)}`,n),i=new URL(`c/${encodeURIComponent(e)}.html`,n);P.has(e)||P.set(e,fetch(i,{method:`HEAD`,cache:`no-store`}).then(e=>e.ok).catch(()=>!1));let a=await P.get(e)?i:r;return t&&a.searchParams.set(`ref`,t),a.toString()}var I=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function L(t,n){if(I.test(String(t)))try{fetch(`${e.supabase.url}/rest/v1/rpc/mkt_registrar_evento`,{method:`POST`,keepalive:!0,headers:{apikey:e.supabase.publishableKey,"Content-Type":`application/json`},body:JSON.stringify({p_auto:t,p_tipo:n})}).catch(()=>{})}catch{}}function te(){try{return JSON.parse(n(`#ficha-data`).textContent)}catch{return null}}function R(e){let r=n(`#lightbox`),i=n(`[data-lb-img]`,r),a=n(`[data-lb-index]`,r),o=0,s=null,c=t=>{o=(t+e.length)%e.length,i.src=e[o],i.alt=`Foto ${o+1} de ${e.length}`,a.textContent=String(o+1)},l=e=>{s=document.activeElement,c(e),r.hidden=!1,requestAnimationFrame(()=>r.classList.add(`is-open`)),document.documentElement.classList.add(`overflow-hidden`),n(`[data-lb-close]`,r).focus()},u=()=>{r.classList.remove(`is-open`),r.hidden=!0,document.documentElement.classList.remove(`overflow-hidden`),s?.focus()};t(`[data-open-photo]`).forEach(e=>e.addEventListener(`click`,()=>l(Number(e.dataset.openPhoto)||0))),n(`[data-lb-close]`,r).addEventListener(`click`,u),n(`[data-lb-prev]`,r).addEventListener(`click`,()=>c(o-1)),n(`[data-lb-next]`,r).addEventListener(`click`,()=>c(o+1)),r.addEventListener(`click`,e=>{e.target===r&&u()}),document.addEventListener(`keydown`,e=>{if(!r.hidden&&(e.key===`Escape`&&u(),e.key===`ArrowLeft`&&c(o-1),e.key===`ArrowRight`&&c(o+1),e.key===`Tab`)){let n=t(`button`,r),i=n.indexOf(document.activeElement);e.preventDefault(),n[(i+(e.shiftKey?n.length-1:1))%n.length].focus()}});let d=null;r.addEventListener(`touchstart`,e=>{d=e.touches[0].clientX},{passive:!0}),r.addEventListener(`touchend`,e=>{if(d==null)return;let t=e.changedTouches[0].clientX-d;Math.abs(t)>40&&c(o+(t<0?1:-1)),d=null})}function z(e){let t=n(`#toast`);t||(t=document.createElement(`div`),t.id=`toast`,t.className=`toast`,t.setAttribute(`role`,`status`),document.body.append(t)),t.textContent=e,t.classList.add(`is-on`),clearTimeout(t._h),t._h=setTimeout(()=>t.classList.remove(`is-on`),2200)}function B(e){let n=new URLSearchParams(location.search).get(`id`),r=/auto\.html$/.test(location.pathname)&&n,i=location.href;r&&F(n).then(e=>{i=e}),t(`[data-share]`).forEach(t=>t.addEventListener(`click`,async()=>{let t={title:e,text:`${e} en Red de Autos`,url:i};try{if(navigator.share){await navigator.share(t);return}}catch(e){if(e?.name===`AbortError`)return}try{await navigator.clipboard.writeText(i),z(`Link copiado`)}catch{z(`No se pudo copiar el link`)}}))}function V(){let e=te();if(!e)return;R(e.photos),p({marca:e.marca,modelo:e.modelo,condicion:e.condicion,origen:`ficha`}),L(e.id,`vista`),document.addEventListener(`click`,t=>{t.target.closest(`[data-whatsapp]`)?L(e.id,`whatsapp`):t.target.closest(`[data-llamar]`)?L(e.id,`llamada`):t.target.closest(`[data-share]`)&&L(e.id,`compartir`)});let t=n(`[data-map]`);t&&n(`[data-map-unlock]`,t)?.addEventListener(`click`,e=>{n(`iframe`,t).classList.remove(`pointer-events-none`),e.currentTarget.remove()}),B(e.title),f(document);let o=n(`#ficha-slider`);if(o){let e=n(`[data-slide-index]`,o);new i(o,{modules:[a],spaceBetween:8,on:{slideChange:t=>{e.textContent=String(t.activeIndex+1)}}})}let s=n(`#related`);s&&(new i(s,{modules:[r,a],slidesPerView:1.1,spaceBetween:16,speed:600,navigation:{prevEl:`.related-prev`,nextEl:`.related-next`},breakpoints:{640:{slidesPerView:2.2},900:{slidesPerView:3,spaceBetween:24},1200:{slidesPerView:4,spaceBetween:30}}}),u(s))}var H=/^[A-Z2-9]{6}$/,U=e=>`rda-ref:${e}`;function W(t,n,r){try{fetch(`${e.supabase.url}/rest/v1/rpc/mkt_registrar_referido`,{method:`POST`,keepalive:!0,headers:{apikey:e.supabase.publishableKey,"Content-Type":`application/json`},body:JSON.stringify({p_ref:t,p_auto:n,p_tipo:r})}).catch(()=>{})}catch{}}async function G(e){let t=new URLSearchParams(location.search).get(`ref`)?.toUpperCase()??``,r=H.test(t)?t:``;try{r?sessionStorage.setItem(U(e.id),r):r=sessionStorage.getItem(U(e.id))??``}catch{}H.test(r)&&(W(r,e.id,`vista`),document.addEventListener(`click`,t=>{t.target.closest(`[data-whatsapp]`)?W(r,e.id,`whatsapp`):t.target.closest(`[data-llamar]`)&&W(r,e.id,`llamada`)}));let i=l();if(i?.tipo!==`vendedor`||i.estado!==`aprobada`)return;let a;try{a=await y(`comisiones`)}catch{return}let o=a.comisiones?.[e.sellerInfo?.id],s=n(`.seller-card`);if(!s||!a.ref)return;let c=document.createElement(`aside`);if(c.className=`mt-5 rounded-[20px] border border-line bg-white p-5`,c.setAttribute(`aria-label`,`Vendedor independiente`),!o)c.innerHTML=`<p class="flex items-center gap-2 text-[15px] text-ink/70">${v(`handshake`,`h-5 w-5 text-ink/40`)} Esta agencia no trabaja con vendedores independientes.</p>`;else{let t=await F(e.id,a.ref),n=`Mirá este auto: ${document.title.split(` | `)[0]} ${t}`;c.innerHTML=`
      <p class="flex items-center gap-2 text-[16px] font-bold">${v(`handshake`,`h-5 w-5 text-brand`)} Comisión para vos: ${g(o)} %</p>
      <p class="mt-1 text-[14px] leading-[1.6] text-ink/70">Sobre el precio final de venta. Compartí el auto con tu link: las visitas y los contactos de tu cliente quedan registrados en Mis clientes.</p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <a href="https://wa.me/?text=${encodeURIComponent(n)}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[46px] justify-center !px-3 text-[14px]">${v(`message-circle`,`h-4 w-4`)} Compartir</a>
        <button type="button" class="btn-outline h-[46px] justify-center !px-3 text-[14px]" data-copiar-ref>${v(`share-2`,`h-4 w-4`)} Copiar link</button>
      </div>`,c.querySelector(`[data-copiar-ref]`).addEventListener(`click`,async e=>{let n=e.currentTarget;try{await navigator.clipboard.writeText(t),n.lastChild.textContent=` ¡Copiado!`}catch{window.prompt(`Copiá tu link:`,t)}})}s.after(c)}var K=e=>`${b(e)} ${e.year}`,q=t=>e.url+C(t).replace(`./`,``),J=e=>ee[e]??e,Y=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),X=x,Z=e=>Array.from({length:S(e)},(e,t)=>t),Q=e=>{let t=`Hola, vi el ${K(e)} (${h(e.price,e.currency)}) en Red de Autos y me interesa. ¿Sigue disponible? ${q(e)}`;return`https://wa.me/${(E(e).phone||``).replace(/\D/g,``)}?text=${encodeURIComponent(t)}`};function ne(t){let n=E(t),r={"@context":`https://schema.org`,"@graph":[{"@type":`Car`,name:K(t),description:t.desc,url:q(t),image:Z(t).map(e=>X(t,e,1200,900)),brand:{"@type":`Brand`,name:t.brand},model:t.model,vehicleConfiguration:t.version,vehicleModelDate:String(t.year),bodyType:J(t.body),itemCondition:t.condition===`new`?`https://schema.org/NewCondition`:`https://schema.org/UsedCondition`,mileageFromOdometer:{"@type":`QuantitativeValue`,value:t.km,unitCode:`KMT`},fuelType:t.fuel,vehicleTransmission:t.gear,driveWheelConfiguration:t.drive,numberOfDoors:t.doors,color:t.color,vehicleEngine:{"@type":`EngineSpecification`,name:t.engine},offers:{"@type":`Offer`,price:t.price,priceCurrency:t.currency,availability:`https://schema.org/InStock`,url:q(t),seller:{"@type":n.type===`particular`?`Person`:`AutoDealer`,name:n.name},areaServed:`${t.city}, ${t.province}`}},{"@type":`BreadcrumbList`,itemListElement:[{"@type":`ListItem`,position:1,name:`Inicio`,item:e.url},{"@type":`ListItem`,position:2,name:`Autos`,item:`${e.url}autos.html`},{"@type":`ListItem`,position:3,name:K(t),item:q(t)}]}]};return`<script type="application/ld+json">${m(r)}<\/script>`}var $=(e,t,n)=>`<li class="inline-flex items-center gap-2 rounded-full bg-[#EEF1FB] px-4 py-2 text-[14px] font-medium text-ink">${v(e,`h-4 w-4 text-brand`)}<span class="sr-only">${g(n)}: </span>${g(t)}</li>`;function re(e){let t=S(e),n=n=>`${K(e)}, foto ${n+1} de ${t}`,r=Z(e).slice(1,5).map(r=>{let i=r===4&&t>5;return`
      <button type="button" class="gallery-thumb group" data-open-photo="${r}" aria-label="Ver foto ${r+1} de ${t}">
        <img src="${g(X(e,r,600,450))}" width="600" height="450" alt="${g(n(r))}" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ${i?`<span class="absolute inset-0 grid place-items-center bg-ink/55 text-[16px] font-bold text-white">+${t-5} fotos</span>`:``}
      </button>`}).join(``);return`
  <div class="relative">
    <!-- Celular: slider -->
    <div id="ficha-slider" class="swiper overflow-hidden rounded-2xl md:!hidden" aria-label="Fotos del auto">
      <div class="swiper-wrapper">
        ${Z(e).map(r=>`
        <div class="swiper-slide">
          <button type="button" class="block aspect-[4/3] w-full" data-open-photo="${r}" aria-label="Ampliar foto ${r+1} de ${t}">
            <img src="${g(X(e,r,900,675))}" width="900" height="675" alt="${g(n(r))}" ${r?`loading="lazy"`:`fetchpriority="high"`} decoding="async" class="h-full w-full object-cover" />
          </button>
        </div>`).join(``)}
      </div>
      <p class="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-3 py-1 text-[13px] text-white"><span data-slide-index>1</span> / ${t}</p>
    </div>
    <!-- Escritorio: foto grande + 4 chicas -->
    <div class="hidden gap-4 md:grid md:h-[460px] md:grid-rows-1 ${t>1?`md:grid-cols-[1.35fr_1fr]`:``} lg:h-[540px]">
      <button type="button" class="gallery-thumb group" data-open-photo="0" aria-label="Ampliar foto 1 de ${t}">
        <img src="${g(X(e,0,1200,900))}" width="1200" height="900" alt="${g(n(0))}" fetchpriority="high" decoding="async" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </button>
      ${t>1?`<div class="grid grid-cols-2 grid-rows-2 gap-4">${r}</div>`:``}
    </div>
    <button type="button" data-open-photo="0" class="btn-outline absolute bottom-4 left-4 z-10 hidden h-[42px] border-white bg-white md:inline-flex">${v(`images`,`h-4 w-4`)} Ver las ${t} fotos</button>
  </div>`}var ie={Carrocería:`car`,Condición:`circle-check`,Kilometraje:`gauge`,Motor:`cog`,Combustible:`fuel`,Puertas:`door-open`,Año:`calendar`,Caja:`cog`,Tracción:`settings-2`,Color:`palette`};function ae(e){return`
  <section aria-labelledby="specs-title" class="ficha-section">
    <h2 id="specs-title" class="ficha-h2">Ficha técnica</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${[[`Carrocería`,J(e.body)],[`Condición`,e.condition===`new`?`0km`:`Usado`],[`Kilometraje`,_(e.km)],[`Año`,e.year],[`Motor`,e.engine],[`Combustible`,e.fuel],[`Caja`,e.gear],[`Tracción`,e.drive],[`Puertas`,e.doors],[`Color`,e.color]].filter(([,e])=>e!=null&&e!==``).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="flex items-center gap-2.5 text-[15px] text-ink/70">${v(ie[e]??`circle-check`,`h-[18px] w-[18px]`)} ${g(e)}</dt>
        <dd class="text-right text-[15px] font-medium">${g(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`}var oe=e=>`
  <section aria-labelledby="desc-title" class="ficha-section">
    <h2 id="desc-title" class="ficha-h2">Descripción</h2>
    <p class="max-w-[720px] text-[16px] leading-[1.8] text-ink/80">${g(e.desc)}</p>
  </section>`,se=e=>e.features?`
  <section aria-labelledby="feat-title" class="ficha-section">
    <h2 id="feat-title" class="ficha-h2">Equipamiento</h2>
    <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      ${Object.entries(e.features).map(([e,t])=>`
      <div>
        <h3 class="mb-4 text-[17px] font-bold">${g(e)}</h3>
        <ul class="space-y-3">
          ${t.map(e=>`<li class="flex items-start gap-2.5 text-[15px]"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-brand">${v(`check`,`h-3 w-3`)}</span>${g(e)}</li>`).join(``)}
        </ul>
      </div>`).join(``)}
    </div>
  </section>`:``,ce=e=>e.dims?`
  <section aria-labelledby="dims-title" class="ficha-section">
    <h2 id="dims-title" class="ficha-h2">Dimensiones y capacidad</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${Object.entries(e.dims).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="text-[15px] text-ink/70">${g(e)}</dt><dd class="text-[15px] font-medium">${g(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`:``;function le(e){if(!e.coords)return``;let[t,n,r=1]=e.coords,i=`https://www.openstreetmap.org/export/embed.html?bbox=${[n-.06*r,t-.035*r,n+.06*r,t+.035*r].map(e=>e.toFixed(4)).join(`,`)}&layer=mapnik${r>1?``:`&marker=${t},${n}`}`,a=`https://www.google.com/maps/dir/?api=1&destination=${t},${n}`;return`
  <section aria-labelledby="map-title" class="ficha-section">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="map-title" class="ficha-h2 !mb-1">Ubicación</h2>
        <p class="text-[15px] text-ink/70">${g(e.city)}, ${g(e.province)} · zona aproximada</p>
      </div>
      <a href="${g(a)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[44px]">${v(`map-pin`,`h-4 w-4`)} Cómo llegar</a>
    </div>
    <div class="map-box relative overflow-hidden rounded-2xl border border-line" data-map>
      <iframe title="Mapa de ${g(e.city)}" src="${g(i)}" loading="lazy" referrerpolicy="no-referrer" class="pointer-events-none block h-[320px] w-full md:h-[380px]"></iframe>
      <button type="button" class="map-unlock" data-map-unlock><span class="map-unlock-label">${v(`map-pin`,`h-4 w-4`)} Tocá para mover el mapa</span></button>
    </div>
  </section>`}function ue(e){if(!e.reviews?.length)return``;let t=e.reviews.reduce((e,t)=>e+t.rating,0)/e.reviews.length;return`
  <section aria-labelledby="rev-title" class="ficha-section">
    <h2 id="rev-title" class="ficha-h2">${e.reviews.length} ${e.reviews.length===1?`reseña`:`reseñas`} · ${g(t.toFixed(1))} de 5</h2>
    <ul class="space-y-6">
      ${e.reviews.map(e=>`
      <li class="border-b border-line pb-6">
        <p class="font-medium">${g(e.name)} <span class="ml-2 text-[14px] font-normal text-ink/60">${g(e.date)}</span></p>
        <p class="mt-1 text-[14px] text-brand">${g(Number(e.rating).toFixed(1))} / 5</p>
        <p class="mt-2 text-[15px] leading-[1.7] text-ink/80">${g(e.text)}</p>
      </li>`).join(``)}
    </ul>
  </section>`}function de(e){let t=E(e),n=t.type===`particular`,r=(t.phone||``).replace(/\D/g,``);return`
  <aside class="seller-card" aria-label="Vendedor">
    <div class="flex items-center gap-4">
      ${t.logo?`<img src="${g(t.logo)}" alt="Logo de ${g(t.name)}" width="64" height="64" class="h-16 w-16 shrink-0 rounded-2xl border border-line bg-white object-contain p-1" />`:`<span class="grid h-16 w-16 shrink-0 place-items-center ${n?`rounded-full bg-[#EEF1FB] text-brand`:`rounded-2xl bg-ink text-white`} text-[20px] font-bold" aria-hidden="true">${g(n?Y(t.name).slice(0,1):Y(t.name))}</span>`}
      <div class="min-w-0">
        <p class="truncate text-[19px] font-bold">${g(t.name)}</p>
        <p class="mt-1 inline-flex items-center gap-1.5 text-[14px] ${t.type===`oficial`?`text-brand`:`text-ink/70`}">${v(t.type===`oficial`?`badge-check`:n?`user`:`store`,`h-4 w-4`)} ${g(w[t.type])}</p>
      </div>
    </div>
    <p class="mt-5 flex items-center gap-2 text-[15px] text-ink/80">${v(`map-pin`,`h-4 w-4 shrink-0`)} ${g(e.city)}, ${g(e.province)}</p>
    <div class="mt-6 space-y-3">
      <a href="${g(Q(e))}" target="_blank" rel="noopener noreferrer" class="btn-cta btn-wa w-full justify-center !pl-2.5" data-whatsapp>
        <span class="btn-cta-icon">${v(`message-circle`,`h-4 w-4`)}</span> Escribir por WhatsApp
      </a>
      ${r?`<a href="tel:+${g(r)}" class="btn-outline h-[54px] w-full justify-center" data-llamar>${v(`phone`,`h-4 w-4`)} Llamar</a>`:``}
    </div>
    ${n?``:`<a href="${e.real?`./agencia.html?id=${encodeURIComponent(t.id)}`:`./autos.html?agencia=${encodeURIComponent(e.seller)}`}" class="link-view mt-5 w-full justify-center">Ver todo su stock ${v(`arrow-up-right`,`h-4 w-4`)}</a>`}
    <p class="mt-5 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
  </aside>
  ${pe(e)}`}var fe=t=>{let n=e.seguros.whatsapp.replace(/\D/g,``);if(!n)return``;let r=t?`Hola, vengo de Red de Autos. Quiero cotizar el seguro de un ${K(t)}${t.condition===`new`?` 0km`:``}.`:`Hola, vengo de Red de Autos. Quiero cotizar el seguro de mi auto.`;return`https://wa.me/${n}?text=${encodeURIComponent(r)}`};function pe(t){let n=fe(t);if(!n)return``;let{nombre:r,logo:i}=e.seguros;return`
  <aside class="mt-5 rounded-[20px] border border-line bg-white p-5" aria-label="Seguro del auto">
    <div class="flex items-center gap-3">
      ${i?`<img src="${g(i)}" alt="${g(r)}" width="78" height="40" class="h-10 w-auto shrink-0 object-contain" loading="lazy" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${v(`shield-check`,`h-5 w-5`)}</span>`}
      <p class="text-[16px] font-bold leading-tight">¿Lo comprás? Cotizá el seguro</p>
    </div>
    <p class="mt-2 text-[14px] leading-[1.6] text-ink/70">Con ${g(r)}, nuestro partner en seguros. Te asesoran por WhatsApp.</p>
    <a href="${g(n)}" target="_blank" rel="noopener noreferrer" class="btn-outline btn-wa mt-4 h-[48px] w-full justify-center" data-seguro>${v(`message-circle`,`h-4 w-4`)} Cotizar por WhatsApp</a>
  </aside>`}function me(e,t=T){let n=t=>(t.body===e.body)*2+(t.brand===e.brand)*2+(t.condition===e.condition);return t.filter(t=>t.id!==e.id).sort((e,t)=>n(t)-n(e)||t.published-e.published).slice(0,8)}function he(e,t=T){let n=K(e),r=E(e);return`
  <div class="container-x pt-6 md:pt-8">
    <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li>
        <li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li>
        <li aria-current="page" class="text-ink">${g(n)}</li>
      </ol>
    </nav>

    <header class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-[28px] font-bold leading-[1.12] sm:text-[36px] md:text-[42px]">${g(n)}</h1>
        <p class="mt-2 text-[16px] text-ink/70">${g(e.version)} · ${g(w[r.type])}</p>
        <ul class="mt-5 flex flex-wrap gap-2.5" aria-label="Datos principales">
          ${$(`calendar`,e.year,`Año`)}${$(`gauge`,_(e.km),`Kilometraje`)}${$(`cog`,e.gear,`Caja`)}${$(`fuel`,e.fuel,`Combustible`)}
        </ul>
      </div>
      <div class="flex flex-col gap-4 lg:items-end">
        <div class="flex gap-3">
          <button type="button" class="btn-outline h-[42px] !px-4" data-share>${v(`share-2`,`h-4 w-4`)} Compartir</button>
          <button type="button" class="btn-outline fav-btn h-[42px] !px-4" data-car-fav="${g(e.id)}" aria-pressed="false">${v(`heart`,`h-4 w-4`)} <span data-fav-label>Guardar</span></button>
        </div>
        ${e.feria?`<a href="./feria.html" class="feria-timer !static" data-oferta-ini="${g(e.feria.ini)}" data-oferta-fin="${g(e.feria.fin)}">${v(`zap`,`h-3.5 w-3.5`)} Precio de feria · <span data-oferta-txt>${g(j(e.feria))}</span></a>`:e.relampago?`<p class="feria-timer !static" data-oferta-ini="0" data-oferta-fin="${g(e.relampago.fin)}"><span aria-hidden="true">🔥</span> Precio relámpago · <span data-oferta-txt>${g(j(e.relampago))}</span></p>`:``}
        ${e.priceBefore?`<p class="flex items-center gap-2 text-[15px] text-ink/60">${e.feria||e.relampago?`<span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">-${g(Math.round((1-e.price/e.priceBefore)*100))}%</span><span class="sr-only">Precio normal:</span>`:`<span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">Bajó de precio</span>`}<s>${g(h(e.priceBefore,e.currency))}</s></p>`:``}
        <p class="text-[32px] font-bold leading-none md:text-[38px]">${g(h(e.price,e.currency))}</p>
        <p class="-mt-2 text-[14px] text-ink/60">Precio en ${e.currency===`USD`?`dólares`:`pesos`}, publicado por el vendedor</p>
      </div>
    </header>

    <div class="mt-8">${re(e)}</div>

    <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div class="min-w-0">
        ${ae(e)}
        ${oe(e)}
        ${se(e)}
        ${ce(e)}
        ${le(e)}
        ${ue(e)}
      </div>
      <div class="lg:sticky lg:top-[110px] lg:self-start">${de(e)}</div>
    </div>
  </div>

  <section aria-labelledby="related-title" class="pt-16 md:pt-[90px]">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 id="related-title" class="section-title">Autos similares</h2>
        <a href="./autos.html?carroceria=${encodeURIComponent(e.body)}" class="link-view">Ver todos ${v(`arrow-up-right`,`h-4 w-4`)}</a>
      </div>
      <div id="related" class="swiper"><div class="swiper-wrapper">${d(me(e,t))}</div></div>
      <div class="mt-8 flex gap-4">
        <button type="button" class="round-nav related-prev" aria-label="Autos anteriores">${v(`chevron-left`,`h-4 w-4`)}</button>
        <button type="button" class="round-nav related-next" aria-label="Autos siguientes">${v(`chevron-right`,`h-4 w-4`)}</button>
      </div>
    </div>
  </section>

  <!-- Barra fija de contacto en celular -->
  <div class="contact-bar lg:hidden">
    <div class="min-w-0">
      <p class="truncate text-[13px] text-ink/70">${g(n)}</p>
      <p class="text-[18px] font-bold leading-tight">${g(h(e.price,e.currency))}</p>
    </div>
    <a href="${g(Q(e))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px] shrink-0 px-5">${v(`message-circle`,`h-4 w-4`)} WhatsApp</a>
  </div>

  <!-- Visor de fotos -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Fotos de ${g(n)}" hidden>
    <button type="button" class="lightbox-btn right-4 top-4" data-lb-close aria-label="Cerrar">${v(`x`,`h-5 w-5`)}</button>
    <button type="button" class="lightbox-btn left-4 top-1/2 -translate-y-1/2" data-lb-prev aria-label="Foto anterior">${v(`chevron-left`,`h-5 w-5`)}</button>
    <img data-lb-img alt="" class="max-h-[82vh] max-w-[92vw] rounded-xl object-contain" />
    <button type="button" class="lightbox-btn right-4 top-1/2 -translate-y-1/2" data-lb-next aria-label="Foto siguiente">${v(`chevron-right`,`h-5 w-5`)}</button>
    <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] text-white/80"><span data-lb-index>1</span> / ${S(e)}</p>
  </div>
  <script type="application/json" id="ficha-data">${m({id:e.id,title:n,marca:e.brand,modelo:e.model,condicion:e.condition===`new`?`0km`:`usados`,photos:Z(e).map(t=>X(e,t,1600,1200))})}<\/script>`}document.documentElement.classList.add(`js`),o(),c(),s(),(async()=>{let e=n(`#contenido`),t=new URLSearchParams(location.search).get(`id`),r=null,i=null;try{[r,i]=await Promise.all([k(t),O(t)])}catch{r=null}if(r&&i&&i.precio<r.price&&Object.assign(r,{priceBefore:r.price,price:i.precio,feria:{ini:0,fin:i.fin},relampago:null}),n(`[data-ficha-cargando]`).remove(),e.removeAttribute(`aria-busy`),!r){n(`[data-ficha-error]`).hidden=!1,document.title=`Auto no disponible | Red de Autos`,M();return}n(`[data-ficha-error]`).remove();let a=await D();n(`[data-ficha-root]`).innerHTML=he(r,[...a,...T]);let o=`${b(r)} ${r.year}`;document.title=`${o} · ${h(r.price,r.currency)} | Red de Autos`,N(new URL(`auto.html?id=${encodeURIComponent(t)}`,location.href).href),n(`meta[name="description"]`).setAttribute(`content`,`${o}, ${_(r.km)}, ${r.fuel.toLowerCase()}, caja ${r.gear.toLowerCase()}. ${r.city}, ${r.province}.`);let s=document.createElement(`template`);s.innerHTML=ne(r);let c=document.createElement(`script`);c.type=`application/ld+json`,c.textContent=s.content.querySelector(`script`).textContent,document.head.append(c),V(),G(r),(r.feria||r.relampago)&&A(e,()=>location.reload())})();