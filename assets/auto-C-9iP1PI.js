import{n as e,t}from"./site-CtOW75FA.js";import"./a11y-3Npf8TRU.js";import{n,o as r,s as i}from"./auth-CxJa9Y1n.js";import{t as a}from"./ficha-D9l5x0Zn.js";import{a as o,i as s,l as c,o as l,r as u,s as d,t as f,u as p}from"./catalog-Bvstg05i.js";import{a as m,i as h,n as g}from"./carCard-BaudcUoV.js";import{a as _,c as v,i as y,o as b,s as x}from"./fotos-DZ8ybjZn.js";var S=e=>`${o(e)} ${e.year}`,C=e=>t.url+l(e).replace(`./`,``),w=e=>f[e]??e,T=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),E=s,D=e=>Array.from({length:c(e)},(e,t)=>t),O=e=>{let t=`Hola, vi el ${S(e)} (${x(e.price,e.currency)}) en Red de Autos y me interesa. ¿Sigue disponible? ${C(e)}`;return`https://wa.me/${(p(e).phone||``).replace(/\D/g,``)}?text=${encodeURIComponent(t)}`};function k(e){let n=p(e),r={"@context":`https://schema.org`,"@graph":[{"@type":`Car`,name:S(e),description:e.desc,url:C(e),image:D(e).map(t=>E(e,t,1200,900)),brand:{"@type":`Brand`,name:e.brand},model:e.model,vehicleConfiguration:e.version,vehicleModelDate:String(e.year),bodyType:w(e.body),itemCondition:e.condition===`new`?`https://schema.org/NewCondition`:`https://schema.org/UsedCondition`,mileageFromOdometer:{"@type":`QuantitativeValue`,value:e.km,unitCode:`KMT`},fuelType:e.fuel,vehicleTransmission:e.gear,driveWheelConfiguration:e.drive,numberOfDoors:e.doors,color:e.color,vehicleEngine:{"@type":`EngineSpecification`,name:e.engine},offers:{"@type":`Offer`,price:e.price,priceCurrency:e.currency,availability:`https://schema.org/InStock`,url:C(e),seller:{"@type":n.type===`particular`?`Person`:`AutoDealer`,name:n.name},areaServed:`${e.city}, ${e.province}`}},{"@type":`BreadcrumbList`,itemListElement:[{"@type":`ListItem`,position:1,name:`Inicio`,item:t.url},{"@type":`ListItem`,position:2,name:`Autos`,item:`${t.url}autos.html`},{"@type":`ListItem`,position:3,name:S(e),item:C(e)}]}]};return`<script type="application/ld+json">${v(r)}<\/script>`}var A=(e,t,n)=>`<li class="inline-flex items-center gap-2 rounded-full bg-[#EEF1FB] px-4 py-2 text-[14px] font-medium text-ink">${y(e,`h-4 w-4 text-brand`)}<span class="sr-only">${_(n)}: </span>${_(t)}</li>`;function j(e){let t=c(e),n=n=>`${S(e)}, foto ${n+1} de ${t}`,r=D(e).slice(1,5).map(r=>{let i=r===4&&t>5;return`
      <button type="button" class="gallery-thumb group" data-open-photo="${r}" aria-label="Ver foto ${r+1} de ${t}">
        <img src="${_(E(e,r,600,450))}" width="600" height="450" alt="${_(n(r))}" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ${i?`<span class="absolute inset-0 grid place-items-center bg-ink/55 text-[16px] font-bold text-white">+${t-5} fotos</span>`:``}
      </button>`}).join(``);return`
  <div class="relative">
    <!-- Celular: slider -->
    <div id="ficha-slider" class="swiper overflow-hidden rounded-2xl md:!hidden" aria-label="Fotos del auto">
      <div class="swiper-wrapper">
        ${D(e).map(r=>`
        <div class="swiper-slide">
          <button type="button" class="block aspect-[4/3] w-full" data-open-photo="${r}" aria-label="Ampliar foto ${r+1} de ${t}">
            <img src="${_(E(e,r,900,675))}" width="900" height="675" alt="${_(n(r))}" ${r?`loading="lazy"`:`fetchpriority="high"`} decoding="async" class="h-full w-full object-cover" />
          </button>
        </div>`).join(``)}
      </div>
      <p class="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-3 py-1 text-[13px] text-white"><span data-slide-index>1</span> / ${t}</p>
    </div>
    <!-- Escritorio: foto grande + 4 chicas -->
    <div class="hidden gap-4 md:grid md:h-[460px] md:grid-rows-1 ${t>1?`md:grid-cols-[1.35fr_1fr]`:``} lg:h-[540px]">
      <button type="button" class="gallery-thumb group" data-open-photo="0" aria-label="Ampliar foto 1 de ${t}">
        <img src="${_(E(e,0,1200,900))}" width="1200" height="900" alt="${_(n(0))}" fetchpriority="high" decoding="async" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </button>
      ${t>1?`<div class="grid grid-cols-2 grid-rows-2 gap-4">${r}</div>`:``}
    </div>
    <button type="button" data-open-photo="0" class="btn-outline absolute bottom-4 left-4 z-10 hidden h-[42px] border-white bg-white md:inline-flex">${y(`images`,`h-4 w-4`)} Ver las ${t} fotos</button>
  </div>`}var M={Carrocería:`car`,Condición:`circle-check`,Kilometraje:`gauge`,Motor:`cog`,Combustible:`fuel`,Puertas:`door-open`,Año:`calendar`,Caja:`cog`,Tracción:`settings-2`,Color:`palette`};function N(e){return`
  <section aria-labelledby="specs-title" class="ficha-section">
    <h2 id="specs-title" class="ficha-h2">Ficha técnica</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${[[`Carrocería`,w(e.body)],[`Condición`,e.condition===`new`?`0km`:`Usado`],[`Kilometraje`,b(e.km)],[`Año`,e.year],[`Motor`,e.engine],[`Combustible`,e.fuel],[`Caja`,e.gear],[`Tracción`,e.drive],[`Puertas`,e.doors],[`Color`,e.color]].filter(([,e])=>e!=null&&e!==``).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="flex items-center gap-2.5 text-[15px] text-ink/70">${y(M[e]??`circle-check`,`h-[18px] w-[18px]`)} ${_(e)}</dt>
        <dd class="text-right text-[15px] font-medium">${_(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`}var P=e=>`
  <section aria-labelledby="desc-title" class="ficha-section">
    <h2 id="desc-title" class="ficha-h2">Descripción</h2>
    <p class="max-w-[720px] text-[16px] leading-[1.8] text-ink/80">${_(e.desc)}</p>
  </section>`,F=e=>e.features?`
  <section aria-labelledby="feat-title" class="ficha-section">
    <h2 id="feat-title" class="ficha-h2">Equipamiento</h2>
    <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      ${Object.entries(e.features).map(([e,t])=>`
      <div>
        <h3 class="mb-4 text-[17px] font-bold">${_(e)}</h3>
        <ul class="space-y-3">
          ${t.map(e=>`<li class="flex items-start gap-2.5 text-[15px]"><span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-brand">${y(`check`,`h-3 w-3`)}</span>${_(e)}</li>`).join(``)}
        </ul>
      </div>`).join(``)}
    </div>
  </section>`:``,I=e=>e.dims?`
  <section aria-labelledby="dims-title" class="ficha-section">
    <h2 id="dims-title" class="ficha-h2">Dimensiones y capacidad</h2>
    <dl class="grid gap-x-10 sm:grid-cols-2">
      ${Object.entries(e.dims).map(([e,t])=>`
      <div class="flex items-center justify-between gap-4 border-b border-line py-3.5">
        <dt class="text-[15px] text-ink/70">${_(e)}</dt><dd class="text-[15px] font-medium">${_(t)}</dd>
      </div>`).join(``)}
    </dl>
  </section>`:``;function L(e){if(!e.coords)return``;let[t,n,r=1]=e.coords,i=`https://www.openstreetmap.org/export/embed.html?bbox=${[n-.06*r,t-.035*r,n+.06*r,t+.035*r].map(e=>e.toFixed(4)).join(`,`)}&layer=mapnik${r>1?``:`&marker=${t},${n}`}`,a=`https://www.google.com/maps/dir/?api=1&destination=${t},${n}`;return`
  <section aria-labelledby="map-title" class="ficha-section">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="map-title" class="ficha-h2 !mb-1">Ubicación</h2>
        <p class="text-[15px] text-ink/70">${_(e.city)}, ${_(e.province)} · zona aproximada</p>
      </div>
      <a href="${_(a)}" target="_blank" rel="noopener noreferrer" class="btn-outline h-[44px]">${y(`map-pin`,`h-4 w-4`)} Cómo llegar</a>
    </div>
    <div class="map-box relative overflow-hidden rounded-2xl border border-line" data-map>
      <iframe title="Mapa de ${_(e.city)}" src="${_(i)}" loading="lazy" referrerpolicy="no-referrer" class="pointer-events-none block h-[320px] w-full md:h-[380px]"></iframe>
      <button type="button" class="map-unlock" data-map-unlock><span class="map-unlock-label">${y(`map-pin`,`h-4 w-4`)} Tocá para mover el mapa</span></button>
    </div>
  </section>`}function R(e){if(!e.reviews?.length)return``;let t=e.reviews.reduce((e,t)=>e+t.rating,0)/e.reviews.length;return`
  <section aria-labelledby="rev-title" class="ficha-section">
    <h2 id="rev-title" class="ficha-h2">${e.reviews.length} ${e.reviews.length===1?`reseña`:`reseñas`} · ${_(t.toFixed(1))} de 5</h2>
    <ul class="space-y-6">
      ${e.reviews.map(e=>`
      <li class="border-b border-line pb-6">
        <p class="font-medium">${_(e.name)} <span class="ml-2 text-[14px] font-normal text-ink/60">${_(e.date)}</span></p>
        <p class="mt-1 text-[14px] text-brand">${_(Number(e.rating).toFixed(1))} / 5</p>
        <p class="mt-2 text-[15px] leading-[1.7] text-ink/80">${_(e.text)}</p>
      </li>`).join(``)}
    </ul>
  </section>`}function z(e){let t=p(e),n=t.type===`particular`,r=(t.phone||``).replace(/\D/g,``);return`
  <aside class="seller-card" aria-label="Vendedor">
    <div class="flex items-center gap-4">
      ${t.logo?`<img src="${_(t.logo)}" alt="Logo de ${_(t.name)}" width="64" height="64" class="h-16 w-16 shrink-0 rounded-2xl border border-line bg-white object-contain p-1" />`:`<span class="grid h-16 w-16 shrink-0 place-items-center ${n?`rounded-full bg-[#EEF1FB] text-brand`:`rounded-2xl bg-ink text-white`} text-[20px] font-bold" aria-hidden="true">${_(n?T(t.name).slice(0,1):T(t.name))}</span>`}
      <div class="min-w-0">
        <p class="truncate text-[19px] font-bold">${_(t.name)}</p>
        <p class="mt-1 inline-flex items-center gap-1.5 text-[14px] ${t.type===`oficial`?`text-brand`:`text-ink/70`}">${y(t.type===`oficial`?`badge-check`:n?`user`:`store`,`h-4 w-4`)} ${_(u[t.type])}</p>
      </div>
    </div>
    <p class="mt-5 flex items-center gap-2 text-[15px] text-ink/80">${y(`map-pin`,`h-4 w-4 shrink-0`)} ${_(e.city)}, ${_(e.province)}</p>
    <div class="mt-6 space-y-3">
      <a href="${_(O(e))}" target="_blank" rel="noopener noreferrer" class="btn-cta w-full justify-center !pl-2.5" data-whatsapp>
        <span class="btn-cta-icon">${y(`message-circle`,`h-4 w-4`)}</span> Escribir por WhatsApp
      </a>
      ${r?`<a href="tel:+${_(r)}" class="btn-outline h-[54px] w-full justify-center">${y(`phone`,`h-4 w-4`)} Llamar</a>`:``}
    </div>
    ${n?``:`<a href="${e.real?`./agencia.html?id=${encodeURIComponent(t.id)}`:`./autos.html?agencia=${encodeURIComponent(e.seller)}`}" class="link-view mt-5 w-full justify-center">Ver todo su stock ${y(`arrow-up-right`,`h-4 w-4`)}</a>`}
    <p class="mt-5 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
  </aside>
  ${V(e)}`}var B=e=>{let n=t.seguros.whatsapp.replace(/\D/g,``);if(!n)return``;let r=e?`Hola, vengo de Red de Autos. Quiero cotizar el seguro de un ${S(e)}${e.condition===`new`?` 0km`:``}.`:`Hola, vengo de Red de Autos. Quiero cotizar el seguro de mi auto.`;return`https://wa.me/${n}?text=${encodeURIComponent(r)}`};function V(e){let n=B(e);if(!n)return``;let{nombre:r,logo:i}=t.seguros;return`
  <aside class="mt-5 rounded-[20px] border border-line bg-white p-5" aria-label="Seguro del auto">
    <div class="flex items-center gap-3">
      ${i?`<img src="${_(i)}" alt="${_(r)}" width="78" height="40" class="h-10 w-auto shrink-0 object-contain" loading="lazy" />`:`<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF1FB] text-brand">${y(`shield-check`,`h-5 w-5`)}</span>`}
      <p class="text-[16px] font-bold leading-tight">¿Lo comprás? Cotizá el seguro</p>
    </div>
    <p class="mt-2 text-[14px] leading-[1.6] text-ink/70">Con ${_(r)}, nuestro partner en seguros. Te asesoran por WhatsApp.</p>
    <a href="${_(n)}" target="_blank" rel="noopener noreferrer" class="btn-outline mt-4 h-[48px] w-full justify-center" data-seguro>${y(`message-circle`,`h-4 w-4`)} Cotizar por WhatsApp</a>
  </aside>`}function H(e,t=d){let n=t=>(t.body===e.body)*2+(t.brand===e.brand)*2+(t.condition===e.condition);return t.filter(t=>t.id!==e.id).sort((e,t)=>n(t)-n(e)||t.published-e.published).slice(0,8)}function U(e,t=d){let n=S(e),r=p(e);return`
  <div class="container-x pt-6 md:pt-8">
    <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li>
        <li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li>
        <li aria-current="page" class="text-ink">${_(n)}</li>
      </ol>
    </nav>

    <header class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-[28px] font-bold leading-[1.12] sm:text-[36px] md:text-[42px]">${_(n)}</h1>
        <p class="mt-2 text-[16px] text-ink/70">${_(e.version)} · ${_(u[r.type])}</p>
        <ul class="mt-5 flex flex-wrap gap-2.5" aria-label="Datos principales">
          ${A(`calendar`,e.year,`Año`)}${A(`gauge`,b(e.km),`Kilometraje`)}${A(`cog`,e.gear,`Caja`)}${A(`fuel`,e.fuel,`Combustible`)}
        </ul>
      </div>
      <div class="flex flex-col gap-4 lg:items-end">
        <div class="flex gap-3">
          <button type="button" class="btn-outline h-[42px] !px-4" data-share>${y(`share-2`,`h-4 w-4`)} Compartir</button>
          <button type="button" class="btn-outline fav-btn h-[42px] !px-4" data-car-fav="${_(e.id)}" aria-pressed="false">${y(`heart`,`h-4 w-4`)} <span data-fav-label>Guardar</span></button>
        </div>
        ${e.priceBefore?`<p class="flex items-center gap-2 text-[15px] text-ink/60"><span class="rounded-full bg-[#FDECEC] px-2.5 py-0.5 text-[13px] font-bold text-[#E5484D]">Bajó de precio</span><s>${_(x(e.priceBefore,e.currency))}</s></p>`:``}
        <p class="text-[32px] font-bold leading-none md:text-[38px]">${_(x(e.price,e.currency))}</p>
        <p class="-mt-2 text-[14px] text-ink/60">Precio en ${e.currency===`USD`?`dólares`:`pesos`}, publicado por el vendedor</p>
      </div>
    </header>

    <div class="mt-8">${j(e)}</div>

    <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div class="min-w-0">
        ${N(e)}
        ${P(e)}
        ${F(e)}
        ${I(e)}
        ${L(e)}
        ${R(e)}
      </div>
      <div class="lg:sticky lg:top-[110px] lg:self-start">${z(e)}</div>
    </div>
  </div>

  <section aria-labelledby="related-title" class="pt-16 md:pt-[90px]">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 id="related-title" class="section-title">Autos similares</h2>
        <a href="./autos.html?carroceria=${encodeURIComponent(e.body)}" class="link-view">Ver todos ${y(`arrow-up-right`,`h-4 w-4`)}</a>
      </div>
      <div id="related" class="swiper"><div class="swiper-wrapper">${g(H(e,t))}</div></div>
      <div class="mt-8 flex gap-4">
        <button type="button" class="round-nav related-prev" aria-label="Autos anteriores">${y(`chevron-left`,`h-4 w-4`)}</button>
        <button type="button" class="round-nav related-next" aria-label="Autos siguientes">${y(`chevron-right`,`h-4 w-4`)}</button>
      </div>
    </div>
  </section>

  <!-- Barra fija de contacto en celular -->
  <div class="contact-bar lg:hidden">
    <div class="min-w-0">
      <p class="truncate text-[13px] text-ink/70">${_(n)}</p>
      <p class="text-[18px] font-bold leading-tight">${_(x(e.price,e.currency))}</p>
    </div>
    <a href="${_(O(e))}" target="_blank" rel="noopener noreferrer" class="btn-primary h-[48px] shrink-0 px-5">${y(`message-circle`,`h-4 w-4`)} WhatsApp</a>
  </div>

  <!-- Visor de fotos -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Fotos de ${_(n)}" hidden>
    <button type="button" class="lightbox-btn right-4 top-4" data-lb-close aria-label="Cerrar">${y(`x`,`h-5 w-5`)}</button>
    <button type="button" class="lightbox-btn left-4 top-1/2 -translate-y-1/2" data-lb-prev aria-label="Foto anterior">${y(`chevron-left`,`h-5 w-5`)}</button>
    <img data-lb-img alt="" class="max-h-[82vh] max-w-[92vw] rounded-xl object-contain" />
    <button type="button" class="lightbox-btn right-4 top-1/2 -translate-y-1/2" data-lb-next aria-label="Foto siguiente">${y(`chevron-right`,`h-5 w-5`)}</button>
    <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] text-white/80"><span data-lb-index>1</span> / ${c(e)}</p>
  </div>
  <script type="application/json" id="ficha-data">${v({id:e.id,title:n,photos:D(e).map(t=>E(e,t,1600,1200))})}<\/script>`}document.documentElement.classList.add(`js`),i(),r(),n(),(async()=>{let t=e(`#contenido`),n=new URLSearchParams(location.search).get(`id`),r=null;try{r=await h(n)}catch{r=null}if(e(`[data-ficha-cargando]`).remove(),t.removeAttribute(`aria-busy`),!r){e(`[data-ficha-error]`).hidden=!1,document.title=`Auto no disponible | Red de Autos`;return}e(`[data-ficha-error]`).remove();let i=await m();e(`[data-ficha-root]`).innerHTML=U(r,[...i,...d]);let s=`${o(r)} ${r.year}`;document.title=`${s} · ${x(r.price,r.currency)} | Red de Autos`,e(`meta[name="description"]`).setAttribute(`content`,`${s}, ${b(r.km)}, ${r.fuel.toLowerCase()}, caja ${r.gear.toLowerCase()}. ${r.city}, ${r.province}.`);let c=document.createElement(`template`);c.innerHTML=k(r);let l=document.createElement(`script`);l.type=`application/ld+json`,l.textContent=c.content.querySelector(`script`).textContent,document.head.append(l),a()})();