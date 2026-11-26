import{n as e,t}from"./dom-CSnsUUoB.js";import{i as n,n as r,r as i,t as a}from"./icons-xIOwbhHI.js";import{r as o,t as s}from"./oferta-o_gfkh8Z.js";import{a as c,f as l,i as u,l as d,o as f,r as p,u as m}from"./catalog-C6oEt7qm.js";function h(n=document){e(`.car-card`,n).forEach(n=>{if(n.dataset.bound)return;n.dataset.bound=`1`;let r=t(`[data-gallery]`,n);if(!r)return;let i;try{i=JSON.parse(r.dataset.gallery)}catch{return}if(!Array.isArray(i)||i.length<2)return;let a=t(`img`,r),o=e(`.gallery-dots span`,r),s=0,c=!1,l=e=>{e!==s&&(s=e,a.removeAttribute(`srcset`),a.src=i[e],o.forEach((t,n)=>t.classList.toggle(`is-on`,n===e)))};n.addEventListener(`mouseenter`,()=>{c||(c=!0,i.slice(1).forEach(e=>{let t=new Image;t.src=e}))}),n.addEventListener(`mousemove`,e=>{let t=r.getBoundingClientRect();if(e.clientY>t.bottom)return l(0);let n=Math.min(Math.max(e.clientX-t.left,0),t.width-1);l(Math.floor(n/t.width*i.length))}),n.addEventListener(`mouseleave`,()=>l(0))})}var g=`rda:favoritos`,_=()=>{try{return new Set(JSON.parse(localStorage.getItem(g)||`[]`))}catch{return new Set}},v=e=>{try{localStorage.setItem(g,JSON.stringify([...e]))}catch{}};function y(t=document){let n=_();e(`.fav-btn`,t).forEach(e=>{let t=e.dataset.carFav||e.closest(`[data-car-id]`)?.dataset.carId;if(!t)return;let r=e.querySelector(`[data-fav-label]`),i=()=>{e.setAttribute(`aria-pressed`,String(n.has(t))),r&&(r.textContent=n.has(t)?`Guardado`:`Guardar`)};i(),e.dataset.bound||(e.dataset.bound=`1`,e.addEventListener(`click`,r=>{r.preventDefault(),r.stopPropagation(),n.has(t)?n.delete(t):n.add(t),v(n),i(),e.dispatchEvent(new CustomEvent(`rda:favorito`,{bubbles:!0,detail:{id:t,guardado:n.has(t)}}))}))})}function b(e=document){s(),h(e),y(e)}var x={nuevo:{text:`0km`,icon:`circle-check`,cls:`text-ok`},"pocos-km":{text:`Pocos km`,icon:`gauge`,cls:`text-brand`},"mejor-precio":{text:`Mejor precio`,icon:`tag`,cls:`text-ok`},oferta:{text:`Oferta`,icon:`tag`,cls:`text-[#E5484D]`},usado:{text:`Usado`,icon:`car`,cls:`text-ink/70`},feria:{text:`Feria`,icon:`zap`,cls:`text-[#E5484D]`},relampago:{text:`Relámpago`,emoji:`🔥`}},S=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase();function C(e){let t=e.type===`particular`,n=e.logo?`<img src="${r(e.logo)}" alt="" width="36" height="36" loading="lazy" decoding="async" class="h-9 w-9 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />`:t?`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[14px] font-bold text-brand" aria-hidden="true">${r(S(e.name).slice(0,1))}</span>`:`<span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-[12px] font-bold tracking-tight text-white" aria-hidden="true">${r(S(e.name))}</span>`,i={particular:`<span class="text-[13px] text-ink/60">Particular</span>`,oficial:`<span class="inline-flex items-center gap-1 rounded-full bg-[#EEF1FB] px-2.5 py-1 text-[12px] font-medium text-brand">${a(`badge-check`,`h-3.5 w-3.5`)} Oficial</span>`,multimarca:`<span class="text-ink/50" title="Agencia multimarca">${a(`store`,`h-[18px] w-[18px]`)}</span>`}[e.type];return`
      <div class="flex items-center gap-3 border-t border-line pt-4">
        ${n}
        <span class="min-w-0 flex-1 truncate text-[15px] font-medium">${r(e.name)}<span class="sr-only"> · ${r(p[e.type])}</span></span>
        ${i}
      </div>`}function w(e,{lazy:t=!0,slide:s=!1}={}){let p=`${c(e)} ${e.year}`,h=m(e),g=e.badge?x[e.badge]:null,_=Array.from({length:d(e)},(t,n)=>u(e,n,900,675)),v=f(e),y=e.feria||e.relampago,b=`
  <article class="car-card group" data-car-id="${r(e.id)}">
    <div class="car-media" data-gallery="${r(JSON.stringify(_))}">
      <img class="car-img h-full w-full object-cover"
        src="${r(_[0])}"
        ${e.real?``:`srcset="${r(l(e.photo,4/3,[450,700,900]))}"`}
        sizes="(min-width:1200px) 25vw, (min-width:900px) 33vw, (min-width:640px) 45vw, 90vw"
        width="900" height="675" alt="${r(p)}" ${t?`loading="lazy"`:``} decoding="async" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"></div>
      ${g?`<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium shadow-sm">${g.emoji?`<span aria-hidden="true">${g.emoji}</span>`:a(g.icon,`h-4 w-4 ${g.cls}`)}${r(g.text)}</span>`:``}
      ${y?`<span class="feria-timer absolute left-4 top-[58px]" data-oferta-ini="${r(y.ini)}" data-oferta-fin="${r(y.fin)}">${a(`clock`,`h-3.5 w-3.5`)} <span data-oferta-txt>${r(o(y))}</span></span>`:``}
      <button type="button" class="icon-btn fav-btn absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink" aria-label="Guardar ${r(p)} en favoritos" aria-pressed="false">
        ${a(`heart`,`h-5 w-5`)}
      </button>
      <div class="pointer-events-none absolute inset-x-4 bottom-4 text-white">
        <p class="flex items-center gap-2 text-[14px] font-medium"><span>${r(e.year)}</span><span class="h-3.5 w-px bg-white/50" aria-hidden="true"></span><span>${r(i(e.km))}</span></p>
        ${e.priceBefore?`<p class="mt-1 text-[14px] text-white/75"><span class="sr-only">${y?`Precio normal`:`Antes`}: </span><s>${r(n(e.priceBefore,e.currency))}</s></p>`:``}
        <p class="mt-0.5 text-[24px] font-bold leading-tight">${r(n(e.price,e.currency))}</p>
      </div>
      <div class="gallery-dots" aria-hidden="true">${_.map((e,t)=>`<span class="${t===0?`is-on`:``}"></span>`).join(``)}</div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="car-title line-clamp-2 min-h-[53px] text-[19px] font-medium leading-snug" title="${r(p)}"><a href="${r(v)}" class="car-link">${r(p)}</a></h3>
      <p class="mt-2 line-clamp-2 min-h-[47px] text-[15px] leading-[1.55] text-ink/70">${r(e.desc)}</p>
      <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink/80">
        <span class="inline-flex items-center gap-1.5">${a(`fuel`,`h-4 w-4`)}<span class="sr-only">Combustible: </span>${r(e.fuel)}</span>
        <span class="inline-flex items-center gap-1.5">${a(`cog`,`h-4 w-4`)}<span class="sr-only">Caja: </span>${r(e.gear)}</span>
      </p>
      <p class="mt-2 flex min-w-0 items-center gap-1.5 text-[15px]">${a(`map-pin`,`h-4 w-4 shrink-0 text-ink/70`)} <span class="truncate">${r(e.city)}, ${r(e.province)}</span></p>
      <span class="block h-4 shrink-0" aria-hidden="true"></span>
      <a href="${r(v)}" class="btn-outline relative z-[2] mb-5 mt-auto h-[46px] shrink-0 justify-center" aria-label="Ver más sobre ${r(p)}">Ver más ${a(`arrow-right`,`h-4 w-4`)}</a>
      ${C(h)}
    </div>
  </article>`;return s?`<div class="swiper-slide !h-auto">${b}</div>`:b}var T=e=>e.map((e,t)=>w(e,{lazy:t>3,slide:!0})).join(``),E=e=>e.map((e,t)=>w(e,{lazy:t>5})).join(``);export{_ as a,b as i,T as n,y as r,E as t};