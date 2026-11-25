import{n as e}from"./site-D80qxBJO.js";import{n as t,o as n,s as r}from"./auth-BJqJBXdL.js";import{n as i}from"./cards-BatAsiDT.js";import{t as a}from"./autosReales-js0VMAnY.js";import{a as o,i as s}from"./fotos-BlCJyuIQ.js";import{t as c}from"./carCard-jwNtML8F.js";import{r as l}from"./catalog-B6PmF8G3.js";var u=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),d=e=>String(e).replace(/^549(\d{3})(\d{3})(\d+)$/,`$1 $2-$3`);function f(e){let t=e.tipo===`oficial`?`${l.oficial}${e.marca_oficial?` ${e.marca_oficial}`:``}`:l.multimarca,n=e.whatsapp?`https://wa.me/${e.whatsapp}?text=${encodeURIComponent(`Hola ${e.nombre}, te escribo desde Red de Autos.`)}`:``,r=[e.direccion?[s(`map-pin`,`h-4 w-4`),`${e.direccion}, ${e.ciudad}, ${e.provincia}`]:[s(`map-pin`,`h-4 w-4`),`${e.ciudad}, ${e.provincia}`],e.horario?[s(`calendar`,`h-4 w-4`),e.horario]:null,e.whatsapp?[s(`phone`,`h-4 w-4`),d(e.whatsapp)]:null].filter(Boolean),i=[e.email?`<a href="mailto:${o(e.email)}" class="link-view">${s(`message-circle`,`h-4 w-4`)} ${o(e.email)}</a>`:``,e.sitio_web?`<a href="${o(e.sitio_web)}" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${s(`arrow-up-right`,`h-4 w-4`)} ${o(e.sitio_web.replace(/^https:\/\/(www\.)?/,``).replace(/\/$/,``))}</a>`:``,e.instagram?`<a href="https://www.instagram.com/${o(e.instagram)}/" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${s(`arrow-up-right`,`h-4 w-4`)} @${o(e.instagram)}</a>`:``].filter(Boolean);return`
  <section class="border-b border-line bg-soft">
    <div class="container-x py-8 md:py-12">
      <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
        <ol class="flex flex-wrap items-center gap-2"><li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li><li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li><li aria-current="page" class="text-ink">${o(e.nombre)}</li></ol>
      </nav>
      <div class="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
        ${e.logoUrl?`<img src="${o(e.logoUrl)}" alt="Logo de ${o(e.nombre)}" width="400" height="400" class="h-24 w-24 shrink-0 rounded-[20px] border border-line bg-white object-contain p-2 md:h-28 md:w-28" />`:`<span class="grid h-24 w-24 shrink-0 place-items-center rounded-[20px] bg-ink text-[30px] font-bold text-white md:h-28 md:w-28" aria-hidden="true">${o(u(e.nombre))}</span>`}
        <div class="min-w-0 flex-1">
          <h1 class="text-[30px] font-bold leading-[1.1] sm:text-[38px] md:text-[44px]">${o(e.nombre)}</h1>
          <p class="mt-2 inline-flex items-center gap-1.5 text-[15px] ${e.tipo===`oficial`?`text-brand`:`text-ink/70`}">${s(e.tipo===`oficial`?`badge-check`:`store`,`h-4 w-4`)} ${o(t)}</p>
        </div>
        ${n?`<a href="${o(n)}" target="_blank" rel="noopener noreferrer" class="btn-cta shrink-0 justify-center !pl-2.5"><span class="btn-cta-icon">${s(`message-circle`,`h-4 w-4`)}</span> Escribir por WhatsApp</a>`:``}
      </div>
    </div>
  </section>

  <div class="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div class="min-w-0 lg:order-1">
      <h2 class="section-title">Stock disponible <span class="text-ink/45">(${o(e.autos.length)})</span></h2>
      ${e.autos.length?`<div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" data-agencia-grid>${c(e.autos)}</div>`:`<p class="mt-6 rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60">Esta agencia todavía no publicó autos.</p>`}
    </div>
    <aside class="lg:order-2">
      <div class="rounded-[20px] border border-line bg-white p-6 lg:sticky lg:top-[110px]">
        <p class="text-[18px] font-bold">Datos de contacto</p>
        <ul class="mt-4 space-y-3 text-[15px] text-ink/80">${r.map(([e,t])=>`<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-brand">${e}</span><span>${o(t)}</span></li>`).join(``)}</ul>
        ${i.length?`<div class="mt-5 flex flex-col items-start gap-3">${i.join(``)}</div>`:``}
        ${e.descripcion?`<div class="mt-6 border-t border-line pt-5"><p class="text-[16px] font-bold">Sobre ${o(e.nombre)}</p><p class="mt-2 whitespace-pre-line text-[15px] leading-[1.7] text-ink/75">${o(e.descripcion)}</p></div>`:``}
        <p class="mt-6 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
      </div>
    </aside>
  </div>`}document.documentElement.classList.add(`js`),r(),n(),t(),(async()=>{let t=e(`#contenido`),n=null;try{n=await a(new URLSearchParams(location.search).get(`id`))}catch{n=null}if(e(`[data-ag-cargando]`).remove(),t.removeAttribute(`aria-busy`),!n){e(`[data-ag-error]`).hidden=!1,document.title=`Agencia no disponible | Red de Autos`;return}e(`[data-ag-error]`).remove(),e(`[data-ag-root]`).innerHTML=f(n),document.title=`${n.nombre} · ${n.ciudad} | Red de Autos`,e(`meta[name="description"]`).setAttribute(`content`,`${n.nombre}: ${n.autos.length} autos en venta en ${n.ciudad}, ${n.provincia}. Contacto, horarios y ubicación.`);let r=e(`[data-agencia-grid]`);r&&i(r)})();