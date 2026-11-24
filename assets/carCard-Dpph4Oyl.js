import{t as e}from"./site-Dlu_XqSV.js";import{a as t,i as n,o as r,r as i,s as a}from"./fotos-CLrCvvI0.js";import{a as o,f as s,i as c,l,n as u,o as d,r as f,u as p}from"./catalog-Bvstg05i.js";var m=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,h=e=>m.test(String(e??``)),g=new Set([`oficial`,`multimarca`,`particular`]);function _(e){let t=`${e.marca} ${e.modelo} ${e.version}`;return{real:!0,id:e.id,brand:e.marca,model:e.modelo,version:e.version,year:e.anio,km:e.km,condition:e.condicion===`0km`?`new`:`used`,fuel:e.combustible,gear:e.transmision,body:e.carroceria,price:Number(e.precio),currency:e.moneda,desc:e.descripcion||`${t} ${e.anio}, ${e.condicion===`0km`?`0km`:`usado`}. Consultá por WhatsApp.`,city:e.ciudad,province:e.provincia,engine:e.motor,doors:e.puertas,color:e.color,drive:e.traccion,photoUrls:(e.fotos??[]).map(i).filter(Boolean),sellerInfo:{id:e.vendedor_id,name:e.vendedor_nombre,type:g.has(e.vendedor_tipo)?e.vendedor_tipo:`multimarca`,phone:/^\d{10,15}$/.test(e.vendedor_tel??``)?e.vendedor_tel:``},badge:e.condicion===`0km`?`nuevo`:null,published:new Date(e.publicado_at).getTime()||0,features:null,dims:null,reviews:[],coords:u[e.ciudad]??null}}async function v(t,n={}){let r=await fetch(`${e.supabase.url}/rest/v1/rpc/${t}`,{method:`POST`,headers:{apikey:e.supabase.publishableKey,"Content-Type":`application/json`},body:JSON.stringify(n)});if(!r.ok)throw Error(`No pudimos cargar los autos.`);return r.json()}async function y(){try{let e=await v(`mkt_autos_publicos`);return(Array.isArray(e)?e:[]).map(_).filter(e=>e.photoUrls.length)}catch{return[]}}async function b(e){if(!h(e))return null;let t=await v(`mkt_auto`,{p_id:e}),n=Array.isArray(t)&&t[0]?_(t[0]):null;return n?.photoUrls.length?n:null}var x={nuevo:{text:`0km`,icon:`circle-check`,cls:`text-ok`},"pocos-km":{text:`Pocos km`,icon:`gauge`,cls:`text-brand`},"mejor-precio":{text:`Mejor precio`,icon:`tag`,cls:`text-ok`},oferta:{text:`Oferta`,icon:`tag`,cls:`text-[#E5484D]`}},S=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase();function C(e){let r=e.type===`particular`?`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${t(S(e.name).slice(0,1))}</span>`:`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-[12px] font-bold tracking-tight text-white" aria-hidden="true">${t(S(e.name))}</span>`,i={particular:`<span class="text-[13px] text-ink/60">Particular</span>`,oficial:`<span class="inline-flex items-center gap-1 rounded-full bg-[#EEF1FB] px-2.5 py-1 text-[12px] font-medium text-brand">${n(`badge-check`,`h-3.5 w-3.5`)} Oficial</span>`,multimarca:`<span class="text-ink/50" title="Agencia multimarca">${n(`store`,`h-[18px] w-[18px]`)}</span>`}[e.type];return`
      <div class="mt-auto flex items-center gap-3 border-t border-line pt-4">
        ${r}
        <span class="min-w-0 flex-1 truncate text-[15px] font-medium">${t(e.name)}<span class="sr-only"> · ${t(f[e.type])}</span></span>
        ${i}
      </div>`}function w(e,{lazy:i=!0,slide:u=!1}={}){let f=`${o(e)} ${e.year}`,m=p(e),h=e.badge?x[e.badge]:null,g=Array.from({length:l(e)},(t,n)=>c(e,n,900,675)),_=d(e),v=`
  <article class="car-card group" data-car-id="${t(e.id)}">
    <div class="car-media" data-gallery="${t(JSON.stringify(g))}">
      <img class="car-img h-full w-full object-cover"
        src="${t(g[0])}"
        ${e.real?``:`srcset="${t(s(e.photo,4/3,[450,700,900]))}"`}
        sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 90vw"
        width="900" height="675" alt="${t(f)}" ${i?`loading="lazy"`:``} decoding="async" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"></div>
      ${h?`<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium shadow-sm">${n(h.icon,`h-4 w-4 ${h.cls}`)}${t(h.text)}</span>`:``}
      <button type="button" class="icon-btn fav-btn absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink" aria-label="Guardar ${t(f)} en favoritos" aria-pressed="false">
        ${n(`heart`,`h-5 w-5`)}
      </button>
      <div class="pointer-events-none absolute inset-x-4 bottom-4 text-white">
        <p class="flex items-center gap-2 text-[14px] font-medium"><span>${t(e.year)}</span><span class="h-3.5 w-px bg-white/50" aria-hidden="true"></span><span>${t(r(e.km))}</span></p>
        <p class="mt-0.5 text-[24px] font-bold leading-tight">${t(a(e.price,e.currency))}</p>
      </div>
      <div class="gallery-dots" aria-hidden="true">${g.map((e,t)=>`<span class="${t===0?`is-on`:``}"></span>`).join(``)}</div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="car-title text-[19px] font-medium leading-snug"><a href="${t(_)}" class="car-link">${t(f)}</a></h3>
      <p class="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-ink/70">${t(e.desc)}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink/80">
        <span class="inline-flex items-center gap-1.5">${n(`fuel`,`h-4 w-4`)}<span class="sr-only">Combustible: </span>${t(e.fuel)}</span>
        <span class="inline-flex items-center gap-1.5">${n(`cog`,`h-4 w-4`)}<span class="sr-only">Caja: </span>${t(e.gear)}</span>
      </p>
      <p class="mt-2 flex items-center gap-1.5 text-[15px]">${n(`map-pin`,`h-4 w-4 shrink-0 text-ink/70`)} ${t(e.city)}, ${t(e.province)}</p>
      <a href="${t(_)}" class="btn-outline relative z-[2] mb-5 mt-4 h-[46px] justify-center" aria-label="Ver más sobre ${t(f)}">Ver más ${n(`arrow-right`,`h-4 w-4`)}</a>
      ${C(m)}
    </div>
  </article>`;return u?`<div class="swiper-slide !h-auto">${v}</div>`:v}var T=e=>e.map((e,t)=>w(e,{lazy:t>3,slide:!0})).join(``),E=e=>e.map((e,t)=>w(e,{lazy:t>5})).join(``);export{h as a,y as i,T as n,b as r,E as t};