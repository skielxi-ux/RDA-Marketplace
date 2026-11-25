import{a as e,i as t,o as n,s as r}from"./fotos-B0LySqZB.js";import{a as i,f as a,i as o,l as s,o as c,r as l,u}from"./catalog-B6PmF8G3.js";var d={nuevo:{text:`0km`,icon:`circle-check`,cls:`text-ok`},"pocos-km":{text:`Pocos km`,icon:`gauge`,cls:`text-brand`},"mejor-precio":{text:`Mejor precio`,icon:`tag`,cls:`text-ok`},oferta:{text:`Oferta`,icon:`tag`,cls:`text-[#E5484D]`},usado:{text:`Usado`,icon:`car`,cls:`text-ink/70`}},f=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase();function p(n){let r=n.type===`particular`,i=n.logo?`<img src="${e(n.logo)}" alt="" width="36" height="36" loading="lazy" decoding="async" class="h-9 w-9 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:r?`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${e(f(n.name).slice(0,1))}</span>`:`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-[12px] font-bold tracking-tight text-white" aria-hidden="true">${e(f(n.name))}</span>`,a={particular:`<span class="text-[13px] text-ink/60">Particular</span>`,oficial:`<span class="inline-flex items-center gap-1 rounded-full bg-[#EEF1FB] px-2.5 py-1 text-[12px] font-medium text-brand">${t(`badge-check`,`h-3.5 w-3.5`)} Oficial</span>`,multimarca:`<span class="text-ink/50" title="Agencia multimarca">${t(`store`,`h-[18px] w-[18px]`)}</span>`}[n.type];return`
      <div class="mt-auto flex items-center gap-3 border-t border-line pt-4">
        ${i}
        <span class="min-w-0 flex-1 truncate text-[15px] font-medium">${e(n.name)}<span class="sr-only"> · ${e(l[n.type])}</span></span>
        ${a}
      </div>`}function m(l,{lazy:f=!0,slide:m=!1}={}){let h=`${i(l)} ${l.year}`,g=u(l),_=l.badge?d[l.badge]:null,v=Array.from({length:s(l)},(e,t)=>o(l,t,900,675)),y=c(l),b=`
  <article class="car-card group" data-car-id="${e(l.id)}">
    <div class="car-media" data-gallery="${e(JSON.stringify(v))}">
      <img class="car-img h-full w-full object-cover"
        src="${e(v[0])}"
        ${l.real?``:`srcset="${e(a(l.photo,4/3,[450,700,900]))}"`}
        sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 90vw"
        width="900" height="675" alt="${e(h)}" ${f?`loading="lazy"`:``} decoding="async" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"></div>
      ${_?`<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium shadow-sm">${t(_.icon,`h-4 w-4 ${_.cls}`)}${e(_.text)}</span>`:``}
      <button type="button" class="icon-btn fav-btn absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink" aria-label="Guardar ${e(h)} en favoritos" aria-pressed="false">
        ${t(`heart`,`h-5 w-5`)}
      </button>
      <div class="pointer-events-none absolute inset-x-4 bottom-4 text-white">
        <p class="flex items-center gap-2 text-[14px] font-medium"><span>${e(l.year)}</span><span class="h-3.5 w-px bg-white/50" aria-hidden="true"></span><span>${e(n(l.km))}</span></p>
        ${l.priceBefore?`<p class="mt-1 text-[14px] text-white/75"><span class="sr-only">Antes: </span><s>${e(r(l.priceBefore,l.currency))}</s></p>`:``}
        <p class="mt-0.5 text-[24px] font-bold leading-tight">${e(r(l.price,l.currency))}</p>
      </div>
      <div class="gallery-dots" aria-hidden="true">${v.map((e,t)=>`<span class="${t===0?`is-on`:``}"></span>`).join(``)}</div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="car-title text-[19px] font-medium leading-snug"><a href="${e(y)}" class="car-link">${e(h)}</a></h3>
      <p class="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-ink/70">${e(l.desc)}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink/80">
        <span class="inline-flex items-center gap-1.5">${t(`fuel`,`h-4 w-4`)}<span class="sr-only">Combustible: </span>${e(l.fuel)}</span>
        <span class="inline-flex items-center gap-1.5">${t(`cog`,`h-4 w-4`)}<span class="sr-only">Caja: </span>${e(l.gear)}</span>
      </p>
      <p class="mt-2 flex items-center gap-1.5 text-[15px]">${t(`map-pin`,`h-4 w-4 shrink-0 text-ink/70`)} ${e(l.city)}, ${e(l.province)}</p>
      <a href="${e(y)}" class="btn-outline relative z-[2] mb-5 mt-4 h-[46px] justify-center" aria-label="Ver más sobre ${e(h)}">Ver más ${t(`arrow-right`,`h-4 w-4`)}</a>
      ${p(g)}
    </div>
  </article>`;return m?`<div class="swiper-slide !h-auto">${b}</div>`:b}var h=e=>e.map((e,t)=>m(e,{lazy:t>3,slide:!0})).join(``),g=e=>e.map((e,t)=>m(e,{lazy:t>5})).join(``);export{h as n,g as t};