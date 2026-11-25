import{a as e,i as t,o as n,s as r}from"./fotos-BlCJyuIQ.js";import{r as i}from"./oferta-o_gfkh8Z.js";import{a,f as o,i as s,l as c,o as l,r as u,u as d}from"./catalog-B6PmF8G3.js";var f={nuevo:{text:`0km`,icon:`circle-check`,cls:`text-ok`},"pocos-km":{text:`Pocos km`,icon:`gauge`,cls:`text-brand`},"mejor-precio":{text:`Mejor precio`,icon:`tag`,cls:`text-ok`},oferta:{text:`Oferta`,icon:`tag`,cls:`text-[#E5484D]`},usado:{text:`Usado`,icon:`car`,cls:`text-ink/70`},feria:{text:`Feria`,icon:`zap`,cls:`text-[#E5484D]`},relampago:{text:`Relámpago`,emoji:`🔥`}},p=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase();function m(n){let r=n.type===`particular`,i=n.logo?`<img src="${e(n.logo)}" alt="" width="36" height="36" loading="lazy" decoding="async" class="h-9 w-9 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:r?`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${e(p(n.name).slice(0,1))}</span>`:`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-[12px] font-bold tracking-tight text-white" aria-hidden="true">${e(p(n.name))}</span>`,a={particular:`<span class="text-[13px] text-ink/60">Particular</span>`,oficial:`<span class="inline-flex items-center gap-1 rounded-full bg-[#EEF1FB] px-2.5 py-1 text-[12px] font-medium text-brand">${t(`badge-check`,`h-3.5 w-3.5`)} Oficial</span>`,multimarca:`<span class="text-ink/50" title="Agencia multimarca">${t(`store`,`h-[18px] w-[18px]`)}</span>`}[n.type];return`
      <div class="mt-auto flex items-center gap-3 border-t border-line pt-4">
        ${i}
        <span class="min-w-0 flex-1 truncate text-[15px] font-medium">${e(n.name)}<span class="sr-only"> · ${e(u[n.type])}</span></span>
        ${a}
      </div>`}function h(u,{lazy:p=!0,slide:h=!1}={}){let g=`${a(u)} ${u.year}`,_=d(u),v=u.badge?f[u.badge]:null,y=Array.from({length:c(u)},(e,t)=>s(u,t,900,675)),b=l(u),x=u.feria||u.relampago,S=`
  <article class="car-card group" data-car-id="${e(u.id)}">
    <div class="car-media" data-gallery="${e(JSON.stringify(y))}">
      <img class="car-img h-full w-full object-cover"
        src="${e(y[0])}"
        ${u.real?``:`srcset="${e(o(u.photo,4/3,[450,700,900]))}"`}
        sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 90vw"
        width="900" height="675" alt="${e(g)}" ${p?`loading="lazy"`:``} decoding="async" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"></div>
      ${v?`<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium shadow-sm">${v.emoji?`<span aria-hidden="true">${v.emoji}</span>`:t(v.icon,`h-4 w-4 ${v.cls}`)}${e(v.text)}</span>`:``}
      ${x?`<span class="feria-timer absolute left-4 top-[58px]" data-oferta-ini="${e(x.ini)}" data-oferta-fin="${e(x.fin)}">${t(`clock`,`h-3.5 w-3.5`)} <span data-oferta-txt>${e(i(x))}</span></span>`:``}
      <button type="button" class="icon-btn fav-btn absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink" aria-label="Guardar ${e(g)} en favoritos" aria-pressed="false">
        ${t(`heart`,`h-5 w-5`)}
      </button>
      <div class="pointer-events-none absolute inset-x-4 bottom-4 text-white">
        <p class="flex items-center gap-2 text-[14px] font-medium"><span>${e(u.year)}</span><span class="h-3.5 w-px bg-white/50" aria-hidden="true"></span><span>${e(n(u.km))}</span></p>
        ${u.priceBefore?`<p class="mt-1 text-[14px] text-white/75"><span class="sr-only">${x?`Precio normal`:`Antes`}: </span><s>${e(r(u.priceBefore,u.currency))}</s></p>`:``}
        <p class="mt-0.5 text-[24px] font-bold leading-tight">${e(r(u.price,u.currency))}</p>
      </div>
      <div class="gallery-dots" aria-hidden="true">${y.map((e,t)=>`<span class="${t===0?`is-on`:``}"></span>`).join(``)}</div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="car-title text-[19px] font-medium leading-snug"><a href="${e(b)}" class="car-link">${e(g)}</a></h3>
      <p class="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-ink/70">${e(u.desc)}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink/80">
        <span class="inline-flex items-center gap-1.5">${t(`fuel`,`h-4 w-4`)}<span class="sr-only">Combustible: </span>${e(u.fuel)}</span>
        <span class="inline-flex items-center gap-1.5">${t(`cog`,`h-4 w-4`)}<span class="sr-only">Caja: </span>${e(u.gear)}</span>
      </p>
      <p class="mt-2 flex items-center gap-1.5 text-[15px]">${t(`map-pin`,`h-4 w-4 shrink-0 text-ink/70`)} ${e(u.city)}, ${e(u.province)}</p>
      <a href="${e(b)}" class="btn-outline relative z-[2] mb-5 mt-4 h-[46px] justify-center" aria-label="Ver más sobre ${e(g)}">Ver más ${t(`arrow-right`,`h-4 w-4`)}</a>
      ${m(_)}
    </div>
  </article>`;return h?`<div class="swiper-slide !h-auto">${S}</div>`:S}var g=e=>e.map((e,t)=>h(e,{lazy:t>3,slide:!0})).join(``),_=e=>e.map((e,t)=>h(e,{lazy:t>5})).join(``);export{g as n,_ as t};