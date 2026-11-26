import{t as e}from"./dom-C8xd8TO7.js";import{c as t,n,s as r}from"./auth-DjO-SZcN.js";import{i,t as a}from"./carCard-DtukT7ni.js";import{t as o}from"./autosReales-Cf4Tc_-b.js";import{n as s,t as c}from"./icons-xIOwbhHI.js";import{r as l}from"./catalog-C6oEt7qm.js";import{n as u,t as d}from"./seoDinamico-BymFIwq4.js";var f=e=>e.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),p=e=>String(e).replace(/^549(\d{3})(\d{3})(\d+)$/,`$1 $2-$3`);function m(e){let t=e.tipo===`oficial`?`${l.oficial}${e.marca_oficial?` ${e.marca_oficial}`:``}`:l.multimarca,n=e.whatsapp?`https://wa.me/${e.whatsapp}?text=${encodeURIComponent(`Hola ${e.nombre}, te escribo desde Red de Autos.`)}`:``,r=[e.direccion?[c(`map-pin`,`h-4 w-4`),`${e.direccion}, ${e.ciudad}, ${e.provincia}`]:[c(`map-pin`,`h-4 w-4`),`${e.ciudad}, ${e.provincia}`],e.horario?[c(`calendar`,`h-4 w-4`),e.horario]:null,e.whatsapp?[c(`phone`,`h-4 w-4`),p(e.whatsapp)]:null].filter(Boolean),i=[e.email?`<a href="mailto:${s(e.email)}" class="link-view">${c(`message-circle`,`h-4 w-4`)} ${s(e.email)}</a>`:``,e.sitio_web?`<a href="${s(e.sitio_web)}" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${c(`arrow-up-right`,`h-4 w-4`)} ${s(e.sitio_web.replace(/^https:\/\/(www\.)?/,``).replace(/\/$/,``))}</a>`:``,e.instagram?`<a href="https://www.instagram.com/${s(e.instagram)}/" target="_blank" rel="noopener noreferrer nofollow" class="link-view">${c(`arrow-up-right`,`h-4 w-4`)} @${s(e.instagram)}</a>`:``].filter(Boolean);return`
  <section class="border-b border-line bg-soft">
    <div class="container-x py-8 md:py-12">
      <nav aria-label="Migas de pan" class="text-[14px] text-ink/60">
        <ol class="flex flex-wrap items-center gap-2"><li><a href="./" class="transition-colors hover:text-brand">Inicio</a></li><li aria-hidden="true">/</li><li><a href="./autos.html" class="transition-colors hover:text-brand">Autos</a></li><li aria-hidden="true">/</li><li aria-current="page" class="text-ink">${s(e.nombre)}</li></ol>
      </nav>
      <div class="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
        ${e.logoUrl?`<img src="${s(e.logoUrl)}" alt="Logo de ${s(e.nombre)}" width="400" height="400" class="h-24 w-24 shrink-0 rounded-[20px] border border-line bg-white object-contain p-2 md:h-28 md:w-28" />`:`<span class="grid h-24 w-24 shrink-0 place-items-center rounded-[20px] bg-ink text-[30px] font-bold text-white md:h-28 md:w-28" aria-hidden="true">${s(f(e.nombre))}</span>`}
        <div class="min-w-0 flex-1">
          <h1 class="text-[30px] font-bold leading-[1.1] sm:text-[38px] md:text-[44px]">${s(e.nombre)}</h1>
          <p class="mt-2 inline-flex items-center gap-1.5 text-[15px] ${e.tipo===`oficial`?`text-brand`:`text-ink/70`}">${c(e.tipo===`oficial`?`badge-check`:`store`,`h-4 w-4`)} ${s(t)}</p>
        </div>
        ${n?`<a href="${s(n)}" target="_blank" rel="noopener noreferrer" class="btn-cta btn-wa shrink-0 justify-center !pl-2.5"><span class="btn-cta-icon">${c(`whatsapp`,`h-4 w-4`)}</span> Escribir por WhatsApp</a>`:``}
      </div>
    </div>
  </section>

  <div class="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div class="min-w-0 lg:order-1">
      <h2 class="section-title">Stock disponible <span class="text-ink/45">(${s(e.autos.length)})</span></h2>
      ${e.autos.length?`<div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" data-agencia-grid>${a(e.autos)}</div>`:`<p class="mt-6 rounded-[20px] border border-dashed border-line px-6 py-12 text-center text-ink/60">Esta agencia todavía no publicó autos.</p>`}
    </div>
    <aside class="lg:order-2">
      <div class="rounded-[20px] border border-line bg-white p-6 lg:sticky lg:top-[110px]">
        <p class="text-[18px] font-bold">Datos de contacto</p>
        <ul class="mt-4 space-y-3 text-[15px] text-ink/80">${r.map(([e,t])=>`<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-brand">${e}</span><span>${s(t)}</span></li>`).join(``)}</ul>
        ${i.length?`<div class="mt-5 flex flex-col items-start gap-3">${i.join(``)}</div>`:``}
        ${e.descripcion?`<div class="mt-6 border-t border-line pt-5"><p class="text-[16px] font-bold">Sobre ${s(e.nombre)}</p><p class="mt-2 whitespace-pre-line text-[15px] leading-[1.7] text-ink/75">${s(e.descripcion)}</p></div>`:``}
        <p class="mt-6 rounded-xl bg-soft px-4 py-3 text-[13px] leading-[1.6] text-ink/70">Nunca hagas pagos por adelantado sin ver el auto y la documentación.</p>
      </div>
    </aside>
  </div>`}document.documentElement.classList.add(`js`),t(),r(),n(),(async()=>{let t=e(`#contenido`),n=null;try{n=await o(new URLSearchParams(location.search).get(`id`))}catch{n=null}if(e(`[data-ag-cargando]`).remove(),t.removeAttribute(`aria-busy`),!n){e(`[data-ag-error]`).hidden=!1,document.title=`Agencia no disponible | Red de Autos`,u();return}e(`[data-ag-error]`).remove(),e(`[data-ag-root]`).innerHTML=m(n),document.title=`${n.nombre} · ${n.ciudad} | Red de Autos`,d(new URL(`agencia.html?id=${encodeURIComponent(n.id)}`,location.href).href),e(`meta[name="description"]`).setAttribute(`content`,`${n.nombre}: ${n.autos.length} autos en venta en ${n.ciudad}, ${n.provincia}. Contacto, horarios y ubicación.`);let r=e(`[data-agencia-grid]`);r&&i(r)})();