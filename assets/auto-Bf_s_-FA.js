import{a as e,t}from"./dom-BlTyJZs9.js";import"./a11y-3Npf8TRU.js";import{c as n,n as r,s as i,t as a}from"./auth-BJy7-iIn.js";import{n as o,t as s}from"./ficha-B_aU83AQ.js";import{a as c,i as l,n as u,r as d,t as f}from"./icons-YsKP1_xN.js";import{s as p}from"./autosApi-BK_SK5VV.js";import{a as m,i as h,l as g,o as _,r as v,s as y,t as b,u as x}from"./catalog-B6PmF8G3.js";import{i as S,o as C,r as w}from"./autosReales-BrMzxGqt.js";import{n as T,r as E}from"./oferta-o_gfkh8Z.js";import{n as D,t as O}from"./seoDinamico-BymFIwq4.js";import{n as k}from"./carCard-DEQSxUoR.js";var A=/^[A-Z2-9]{6}$/,j=e=>`rda-ref:${e}`;function M(t,n,r){try{fetch(`${e.supabase.url}/rest/v1/rpc/mkt_registrar_referido`,{method:`POST`,keepalive:!0,headers:{apikey:e.supabase.publishableKey,"Content-Type":`application/json`},body:JSON.stringify({p_ref:t,p_auto:n,p_tipo:r})}).catch(()=>{})}catch{}}async function N(e){let n=new URLSearchParams(location.search).get(`ref`)?.toUpperCase()??``,r=A.test(n)?n:``;try{r?sessionStorage.setItem(j(e.id),r):r=sessionStorage.getItem(j(e.id))??``}catch{}A.test(r)&&(M(r,e.id,`vista`),document.addEventListener(`click`,t=>{t.target.closest(`[data-whatsapp]`)?M(r,e.id,`whatsapp`):t.target.closest(`[data-llamar]`)&&M(r,e.id,`llamada`)}));let i=a();if(i?.tipo!==`vendedor`||i.estado!==`aprobada`)return;let s;try{s=await p(`comisiones`)}catch{return}let c=s.comisiones?.[e.sellerInfo?.id],l=t(`.seller-card`);if(!l||!s.ref)return;let d=document.createElement(`aside`);if(d.className=`mt-5 rounded-[20px] border border-line bg-white p-5`,d.setAttribute(`aria-label`,`Vendedor independiente`),!c)d.innerHTML=`<p class="flex items-center gap-2 text-[15px] text-ink/70">${f(`handshake`,`h-5 w-5 text-ink/40`)} Esta agencia no trabaja con vendedores independientes.</p>`;else{let t=await o(e.id,s.ref),n=`Mirá este auto: ${document.title.split(` | `)[0]} ${t}`;d.innerHTML=`
      <p class="flex items-center gap-2 text-[16px] font-bold">${f(`handshake`,`h-5 w-5 text-brand`)} Comisión para vos: ${u(c)} %</p>
      <p class="mt-1 text-[14px] leading-[1.6] text-ink/70">Sobre el precio final de venta. Compartí el auto con tu link: las visitas y los contactos de tu cliente quedan registrados en Mis clientes.</p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <a href="https://wa.me/?text=${encodeURIComponent(n)}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[46px] justify-center !px-3 text-[14px]">${f(`message-circle`,`h-4 w-4`)} Compartir</a>
        <button type="button" class="btn-outline h-[46px] justify-center !px-3 text-[14px]" data-copiar-ref>${f(`share-2`,`h-4 w-4`)} Copiar link</button>
      </div>`,d.querySelector(`[data-copiar-ref]`).addEventListener(`click`,async e=>{let n=e.currentTarget;try{await navigator.clipboard.writeText(t),n.lastChild.textContent=` ¡Copiado!`}catch{window.prompt(`Copiá tu link:`,t)}})}l.after(d)}var P=e=>`${m(e)} ${e.year}`,F=t=>e.url+_(t).replace(`./`,``),I=e=>b[e]??e,L=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),R=h,z=e=>Array.from({length:g(e)},(e,t)=>t),B=e=>{let t=`Hola, vi el ${P(e)} (${l(e.price,e.currency)}) en Red de Autos y me interesa. ¿Sigue disponible? ${F(e)}`;return`https://wa.me/${(x(e).phone||``).replace(/\D/g,``)}?text=${encodeURIComponent(t)}`};function V(t){let n=x(t),r={"@context":`https://schema.org`,"@graph":[{"@type":`Car`,name:P(t),description:t.desc,url:F(t),image:z(t).map(e=>R(t,e,1200,900)),brand:{"@type":`Brand`,name:t.brand},model:t.model,vehicleConfiguration:t.version,vehicleModelDate:String(t.year),bodyType:I(t.body),itemCondition:t.condition===`new`?`https://schema.org/NewCondition`:`https://schema.org/UsedCondition`,mileageFromOdometer:{"@type":`QuantitativeValue`,value:t.km,unitCode:`KMT`},fuelType:t.fuel,vehicleTransmission:t.gear,driveWheelConfiguration:t.drive,numberOfDoors:t.doors,color:t.color,vehicleEngine:{"@type":`EngineSpecification`,name:t.engine},offers:{"@type":`Offer`,price:t.price,priceCurrency:t.currency,availability:`https://schema.org/InStock`,url:F(t),seller:{"@type":n.type===`particular`?`Person`:`AutoDealer`,name:n.name},areaServed:`${t.city}, ${t.province}`}},{"@type":`BreadcrumbList`,itemListElement:[{"@type":`ListItem`,position:1,name:`Inicio`,item:e.url},{"@type":`ListItem`,position:2,name:`Autos`,item:`${e.url}autos.html`},{"@type":`ListItem`,position:3,name:P(t),item:F(t)}]}]};return`<script type="application/ld+json">${c(r)}<\/script>`}var H=(e,t,n)=>`<li class="inline-flex items-center gap-2 rounded-full bg-[#EEF1FB] px-4 py-2 text-[14px] font-medium text-ink">${f(e,`h-4 w-4 text-brand`)}<span class="sr-only">${u(n)}: </span>${u(t)}</li>`;function U(e){let t=g(e),n=n=>`${P(e)}, foto ${n+1} de ${t}`,r=z(e).slice(1,5).map(r=>{let i=r===4&&t>5;return`
      <button type="button" class="gallery-thumb group" data-open-photo="${r}" aria-label="Ver foto ${r+1} de ${t}">
        <img src="${u(R(e,r,600,450))}" width="600" height="450" alt="${u(n(r))}" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ${i?`<span class="absolute inset-0 grid place-items-center bg-ink/55 text-[16px] font-bold text-white">+${t-5} fotos</span>`:``}
      </button>`}).join(``);return`
  <div class="relative">
    <!-- Celular: slider -->
    <div id="ficha-slider" class="swiper overflow-hidden rounded-2xl md:!hidden" aria-label="Fotos del auto">
      <div class="swiper-wrapper">
        ${z(e).map(r=>`
        <div class="swiper-slide">
          <button type="button" class="block aspect-[4/3] w-full" data-open-photo="${r}" aria-label="Ampliar foto ${r+1} de ${t}">
            <img src="${u(R(e,r,900,675))}" width="900" height="675" alt="${u(n(r))}" ${r?`loading="lazy"`:`fetchpriority="high"`} decoding="async" class="h-full w-full object-cover" />
          </button>
        </div>`).join(``)}
      </div>
      <p class="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-3 py-1 text-[13px] text-white"><span data-slide-index>1</span> / ${t}</p>
    </div>
    <!-- Escritorio: foto grande + 4 chicas -->
    <div class="hidden gap-4 md:grid md:h-[460px] md:grid-rows-1 ${t>1?`md:grid-cols-[1.35fr_1fr]`:``} lg:h-[540px]">
      <button type="button" class="gallery-thumb group" data-open-photo="0" aria-label="Ampliar foto 1 de ${t}">
        <img src="${u(R(e,0,1200,900))}" width="1200" height="900" alt="${u(n(0))}" fetchpriority="high" decoding="async" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </button>
      ${t>1?`<div class="grid grid-cols-2 grid-rows-2 gap-4">${r}</div>`:``}
    </div>
    <button type="button" data-open-photo="0" class="btn-outline absolute bottom-4 left-4 z-10 hidden h-[42px] border-white bg-white md:inline-flex">${f(`images`,`h-4 w-4`)} Ver las ${t} fotos</button>
  </div>`}var W={Carrocería:`car`,Condición:`circle-check`,Kilometraje:`gauge`,Motor:`cog`,Combustible:`fuel`,Puertas:`door-open`,Año:`calendar`,Caja:`cog`,Tracción:`settings-2`,Color:`palette`};function G(e){return`
  <section aria-labelledby="specs-title" class="ficha-section">
    <h2 id="specs-title" class="ficha-h2">Ficha técnica</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${[[`Carrocería`,I(e.body)],[`Condición`,e.condition===`new`?`0km`:`Usado`],[`Kilometraje`,d(e.km)],[`Año`,e.year],[`Motor`,e.engine],[`Combustible`,e.fuel],[`Caja`,e.gear],[`Tracción`,e.drive],[`Puertas`,e.doors],[`Color`,e.color]].filter(([,e])=>e!=null&&e!==``).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="flex items-center gap-2.5 text-[15px] text-ink/70">${f(W[e]??`circle-check`,`h-[18px] w-[18px]`)} ${u(e)}</dt>
        <dd class="text-right text-[15px] font-medium">${u(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`}var K=e=>`
  <section aria-labelledby="desc-title" class="ficha-section">
    <h2 id="desc-title" class="ficha-h2">Descripción</h2>
    <p class="max-w-[720px] text-[16px] leading-[1.8] text-ink/80">${u(e.desc)}</p>
  </section>`,q=e=>e.features?`
  <section aria-labelledby="feat-title" class="ficha-section">
    <h2 id="feat-title" class="ficha-h2">Equipamiento</h2>
    <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      ${Object.entries(e.features).map(([e,t])=>`
      <div>
        <h3 class="mb-4 text-[17px] font-bold">${u(e)}</h3>
        <ul class="space-y-3">
          ${t.map(e=>`<li class="flex items-start gap-2.5 text-[15px]"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-brand">${f(`check`,`h-3 w-3`)}</span>${u(e)}</li>`).join(``)}
        </ul>
      </div>`).join(``)}
    </div>
  </section>`:``,J=e=>e.dims?`
  <section aria-labelledby="dims-title" class="ficha-section">
    <h2 id="dims-title" class="ficha-h2">Dimensiones y capacidad</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${Object.entries(e.dims).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="text-[15px] text-ink/70">${u(e)}</dt><dd class="text-[15px] font-medium">${u(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`:``;function Y(e){if(!e.coords)return``;let[t,n,r=1]=e.coords,i=`https://www.openstreetmap.org/export/embed.html?bbox=${[n-.06*r,t-.035*r,n+.06*r,t+.035*r].map(e=>e.toFixed(4)).join(`,`)}&layer=mapnik${r>1?``:`&marker=${t},${n}`}`,a=`https://www.google.com/maps/dir/?api=1&destination=${t},${n}`;return`
  <section aria-labelledby="map-title" class="ficha-section">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="map-title" class="ficha-h2 !mb-1">Ubicación</h2>
        <p class="text-[15px] text-ink/70">${u(e.city)}, ${u(e.province)} · zona aproximada</p>
      </div>
      <a href="${u(a)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[44px]">${f(`map-pin`,`h-4 w-4`)} Cómo llegar</a>
    </div>
    <div class="map-box relative overflow-hidden rounded-2xl border border-line" data-map>
      <iframe title="Mapa de ${u(e.city)}" src="${u(i)}" loading="lazy" referrerpolicy="no-referrer" class="pointer-events-none block h-[320px] w-full md:h-[380px]"></iframe>
      <button type="button" class="map-unlock" data-map-unlock><span class="map-unlock-label">${f(`map-pin`,`h-4 w-4`)} Tocá para mover el mapa</span></button>
    </div>
  </section>`}function X(e){if(!e.reviews?.length)return``;let t=e.reviews.reduce((e,t)=>e+t.rating,0)/e.reviews.length;return`
  <section aria-labelledby="rev-title" class="ficha-section">
    <h2 id="rev-title" class="ficha-h2">${e.reviews.length} ${e.reviews.length===1?`reseña`:`reseñas`} · ${u(t.toFixed(1))} de 5</h2>
    <ul class="space-y-6">
      ${e.reviews.map(e=>`
      <li class="border-b border-line pb-6">
        <p class="font-medium">${u(e.name)} <span class="ml-2 text-[14px] font-normal text-ink/60">${u(e.date)}</span></p>
        <p class="mt-1 text-[14px] text-brand">${u(Number(e.rating).toFixed(1))} / 5</p>
        <p class="mt-2 text-[15px] leading-[1.7] text-ink/80">${u(e.text)}</p>
      </li>`).join(``)}
    </ul>
  </section>`}function Z(e){let t=x(e),n=t.type===`particular`,r=(t.phone||``).replace(/\D/g,``);return`
  <aside class="seller-card" aria-label="Vendedor">
    <div class="flex items-center gap-4">
      ${t.logo?`<img src="${u(t.logo)}" alt="Logo de ${u(t.name)}" width="64" height="64" class="h-16 w-16 shrink-0 rounded-2xl border border-line bg-white object-contain p-1" />`:`<span class="grid h-16 w-16 shrink-0 place-items-center ${n?`rounded-full bg-[#EEF1FB] text-brand`:`rounded-2xl bg-ink text-white`} text-[20px] font-bold" aria-hidden="true">${u(n?L(t.name).slice(0,1):L(t.name))}</span>`}
      <div class="min-w-0">
        <p class="truncate text-[19px] font-bold">${u(t.name)}</p>
        <p class="mt-1 inline-flex items-center gap-1.5 text-[14px] ${t.type===`oficial`?`text-brand`:`text-ink/70`}">${f(t.type===`oficial`?`badge-check`:n?`user`:`store`,`h-4 w-4`)} ${u(v[t.type])}</p>
      </div>
    </div>
    <p class="mt-5 flex items-center gap-2 text-[15px] text-ink/80">${f(`map-pin`,`h-4 w-4 shrink-0`)} ${u(e.city)}, ${u(e.province)}</p>
    <div class="mt-6 space-y-3">
      <a href="${u(B(e))}" target="_blank" rel="noopener noreferrer" class="btn-cta w-full justify-center !pl-2.5" data-whatsapp>
        <span class="btn-cta-icon">${f(`message-circle`,`h-4 w-4`)}</span> Escribir por WhatsApp
      </a>
      ${r?`<a href="tel:+${u(r)}" class="btn-outline h-[54px] w-full justify-center" data-llamar>${f(`phone`,`h-4 w-4`)} Llamar</a>`:``}
    </div>
    ${n?``:`<a href="${e.real?`./agencia.html?id=${encodeURIComponent(t.id)}`:`./autos.html?agencia=${encodeURIComponent(e.seller)}`}" class="link-view mt-5 w-full justify-center">Ver todo su stock ${f(`arrow-up-right`,`h-4 w-4`)}</a>`}
    <p class="mt-5 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
  </aside>
  ${$(e)}`}var Q=t=>{let n=e.seguros.whatsapp.replace(/\D/g,``);if(!n)return``;let r=t?`Hola, vengo de Red de Autos. Quiero cotizar el seguro de un ${P(t)}${t.condition===`new`?` 0km`:``}.`:`Hola, vengo de Red de Autos. Quiero cotizar el seguro de mi auto.`;return`https://wa.me/${n}?text=${encodeURIComponent(r)}`};function $(t){let n=Q(t);if(!n)return``;let{nombre:r,logo:i}=e.seguros;return`
  <aside class="mt-5 rounded-[20px] border border-line bg-white p-5" aria-label="Seguro del auto">
    <div class="flex items-center gap-3">
      ${i?`<img src="${u(i)}" alt="${u(r)}" width="78" height="40" class="h-10 w-auto shrink-0 object-contain" loading="lazy" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${f(`shield-check`,`h-5 w-5`)}</span>`}
      <p class="text-[16px] font-bold leading-tight">¿Lo comprás? Cotizá el seguro</p>
    </div>
    <p class="mt-2 text-[14px] leading-[1.6] text-ink/70">Con ${u(r)}, nuestro partner en seguros. Te asesoran por WhatsApp.</p>
    <a href="${u(n)}" target="_blank" rel="noopener noreferrer" class="btn-outline mt-4 h-[48px] w-full justify-center" data-seguro>${f(`message-circle`,`h-4 w-4`)} Cotizar por WhatsApp</a>
  </aside>`}function ee(e,t=y){let n=t=>(t.body===e.body)*2+(t.brand===e.brand)*2+(t.condition===e.condition);return t.filter(t=>t.id!==e.id).sort((e,t)=>n(t)-n(e)||t.published-e.published).slice(0,8)}function te(e,t=y){let n=P(e),r=x(e);return`
  <div class="container-x pt-6 md:pt-8">
    <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li>
        <li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li>
        <li aria-current="page" class="text-ink">${u(n)}</li>
      </ol>
    </nav>

    <header class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-[28px] font-bold leading-[1.12] sm:text-[36px] md:text-[42px]">${u(n)}</h1>
        <p class="mt-2 text-[16px] text-ink/70">${u(e.version)} · ${u(v[r.type])}</p>
        <ul class="mt-5 flex flex-wrap gap-2.5" aria-label="Datos principales">
          ${H(`calendar`,e.year,`Año`)}${H(`gauge`,d(e.km),`Kilometraje`)}${H(`cog`,e.gear,`Caja`)}${H(`fuel`,e.fuel,`Combustible`)}
        </ul>
      </div>
      <div class="flex flex-col gap-4 lg:items-end">
        <div class="flex gap-3">
          <button type="button" class="btn-outline h-[42px] !px-4" data-share>${f(`share-2`,`h-4 w-4`)} Compartir</button>
          <button type="button" class="btn-outline fav-btn h-[42px] !px-4" data-car-fav="${u(e.id)}" aria-pressed="false">${f(`heart`,`h-4 w-4`)} <span data-fav-label>Guardar</span></button>
        </div>
        ${e.feria?`<a href="./feria.html" class="feria-timer !static" data-oferta-ini="${u(e.feria.ini)}" data-oferta-fin="${u(e.feria.fin)}">${f(`zap`,`h-3.5 w-3.5`)} Precio de feria · <span data-oferta-txt>${u(E(e.feria))}</span></a>`:e.relampago?`<p class="feria-timer !static" data-oferta-ini="0" data-oferta-fin="${u(e.relampago.fin)}"><span aria-hidden="true">🔥</span> Precio relámpago · <span data-oferta-txt>${u(E(e.relampago))}</span></p>`:``}
        ${e.priceBefore?`<p class="flex items-center gap-2 text-[15px] text-ink/60">${e.feria||e.relampago?`<span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">-${u(Math.round((1-e.price/e.priceBefore)*100))}%</span><span class="sr-only">Precio normal:</span>`:`<span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">Bajó de precio</span>`}<s>${u(l(e.priceBefore,e.currency))}</s></p>`:``}
        <p class="text-[32px] font-bold leading-none md:text-[38px]">${u(l(e.price,e.currency))}</p>
        <p class="-mt-2 text-[14px] text-ink/60">Precio en ${e.currency===`USD`?`dólares`:`pesos`}, publicado por el vendedor</p>
      </div>
    </header>

    <div class="mt-8">${U(e)}</div>

    <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div class="min-w-0">
        ${G(e)}
        ${K(e)}
        ${q(e)}
        ${J(e)}
        ${Y(e)}
        ${X(e)}
      </div>
      <div class="lg:sticky lg:top-[110px] lg:self-start">${Z(e)}</div>
    </div>
  </div>

  <section aria-labelledby="related-title" class="pt-16 md:pt-[90px]">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 id="related-title" class="section-title">Autos similares</h2>
        <a href="./autos.html?carroceria=${encodeURIComponent(e.body)}" class="link-view">Ver todos ${f(`arrow-up-right`,`h-4 w-4`)}</a>
      </div>
      <div id="related" class="swiper"><div class="swiper-wrapper">${k(ee(e,t))}</div></div>
      <div class="mt-8 flex gap-4">
        <button type="button" class="round-nav related-prev" aria-label="Autos anteriores">${f(`chevron-left`,`h-4 w-4`)}</button>
        <button type="button" class="round-nav related-next" aria-label="Autos siguientes">${f(`chevron-right`,`h-4 w-4`)}</button>
      </div>
    </div>
  </section>

  <!-- Barra fija de contacto en celular -->
  <div class="contact-bar lg:hidden">
    <div class="min-w-0">
      <p class="truncate text-[13px] text-ink/70">${u(n)}</p>
      <p class="text-[18px] font-bold leading-tight">${u(l(e.price,e.currency))}</p>
    </div>
    <a href="${u(B(e))}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[48px] shrink-0 px-5">${f(`message-circle`,`h-4 w-4`)} WhatsApp</a>
  </div>

  <!-- Visor de fotos -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Fotos de ${u(n)}" hidden>
    <button type="button" class="lightbox-btn right-4 top-4" data-lb-close aria-label="Cerrar">${f(`x`,`h-5 w-5`)}</button>
    <button type="button" class="lightbox-btn left-4 top-1/2 -translate-y-1/2" data-lb-prev aria-label="Foto anterior">${f(`chevron-left`,`h-5 w-5`)}</button>
    <img data-lb-img alt="" class="max-h-[82vh] max-w-[92vw] rounded-xl object-contain" />
    <button type="button" class="lightbox-btn right-4 top-1/2 -translate-y-1/2" data-lb-next aria-label="Foto siguiente">${f(`chevron-right`,`h-5 w-5`)}</button>
    <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] text-white/80"><span data-lb-index>1</span> / ${g(e)}</p>
  </div>
  <script type="application/json" id="ficha-data">${c({id:e.id,title:n,marca:e.brand,modelo:e.model,condicion:e.condition===`new`?`0km`:`usados`,photos:z(e).map(t=>R(e,t,1600,1200))})}<\/script>`}document.documentElement.classList.add(`js`),n(),i(),r(),(async()=>{let e=t(`#contenido`),n=new URLSearchParams(location.search).get(`id`),r=null,i=null;try{[r,i]=await Promise.all([w(n),C(n)])}catch{r=null}if(r&&i&&i.precio<r.price&&Object.assign(r,{priceBefore:r.price,price:i.precio,feria:{ini:0,fin:i.fin},relampago:null}),t(`[data-ficha-cargando]`).remove(),e.removeAttribute(`aria-busy`),!r){t(`[data-ficha-error]`).hidden=!1,document.title=`Auto no disponible | Red de Autos`,D();return}t(`[data-ficha-error]`).remove();let a=await S();t(`[data-ficha-root]`).innerHTML=te(r,[...a,...y]);let o=`${m(r)} ${r.year}`;document.title=`${o} · ${l(r.price,r.currency)} | Red de Autos`,O(new URL(`auto.html?id=${encodeURIComponent(n)}`,location.href).href),t(`meta[name="description"]`).setAttribute(`content`,`${o}, ${d(r.km)}, ${r.fuel.toLowerCase()}, caja ${r.gear.toLowerCase()}. ${r.city}, ${r.province}.`);let c=document.createElement(`template`);c.innerHTML=V(r);let u=document.createElement(`script`);u.type=`application/ld+json`,u.textContent=c.content.querySelector(`script`).textContent,document.head.append(u),s(),N(r),(r.feria||r.relampago)&&T(e,()=>location.reload())})();