import{n as e}from"./site-Dc6rIn4r.js";import{a as t,n,o as r,r as i,t as a}from"./auth-Bkpp7xbD.js";import{a as o,i as s,r as c,s as l}from"./fotos-D15BNFdh.js";import{t as u}from"./ranking-J_E50yXu.js";import{t as d}from"./autosApi-BNRofQa2.js";import{o as f}from"./catalog-Bvstg05i.js";function p(){let t=e(`[data-mc-guest]`),n=e(`[data-mc-panel]`),r=e(`[data-mc-buscados]`),p=e(`#buscados`),m=e(`[data-mc-publicar]`),h=e(`[data-mc-misautos]`),g=e(`#mis-autos`),_=e(`[data-mis-autos]`),v=!1,y=!1,b=(e,t)=>{t.hidden=!1,e.setAttribute(`aria-expanded`,`true`),e.classList.add(`is-active`),t.scrollIntoView({behavior:`smooth`,block:`start`})},x=async()=>{b(r,p),v||(v=!0,await u(p,await i()))},S=e=>{if(!e.length){_.innerHTML=`
        <div class="rounded-[20px] border border-dashed border-line p-8 text-center">
          <p class="text-[18px] font-bold">Todavía no cargaste autos</p>
          <p class="mt-1 text-[15px] text-ink/70">Con la plantilla de Excel cargás todo tu stock de una vez.</p>
          <a href="./publicar.html" class="btn-primary mx-auto mt-5 h-[50px] w-fit !px-6">${s(`plus`,`h-4 w-4`)} Publicar vehículos</a>
        </div>`;return}let t=e.filter(e=>e.estado===`publicado`).length;_.innerHTML=`
      <p class="mb-4 text-[15px] text-ink/70">${e.length} ${e.length===1?`auto`:`autos`} · ${t} ${t===1?`publicado`:`publicados`}</p>
      <ul class="grid gap-3">
        ${e.map(e=>{let t=c(e.fotos?.[0]??``),n=e.estado===`pausado`,r=`${e.marca} ${e.modelo} ${e.version} ${e.anio}`;return`
          <li class="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              ${t?`<img src="${o(t)}" alt="" width="120" height="90" loading="lazy" decoding="async" class="h-[72px] w-[96px] shrink-0 rounded-xl object-cover ${n?`opacity-50 grayscale`:``}" />`:`<span class="h-[72px] w-[96px] shrink-0 rounded-xl bg-soft"></span>`}
              <div class="min-w-0">
                <p class="flex flex-wrap items-center gap-2 text-[13px]">
                  <span class="rounded-full bg-ink px-2.5 py-0.5 font-bold text-white">${o(e.codigo)}</span>
                  ${n?`<span class="rounded-full bg-[#FFF6E5] px-2.5 py-0.5 font-medium text-[#8A5A00]">${e.pausado_por_admin?`Pausado por Red de Autos`:`Pausado`}</span>`:`<span class="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 font-medium text-ok">Publicado</span>`}
                  <span class="text-ink/60">${o(e.fotos?.length??0)} fotos</span>
                </p>
                <p class="mt-1 truncate text-[16px] font-bold">${o(r)}</p>
                <p class="text-[15px]">${o(l(Number(e.precio),e.moneda))}</p>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              ${n?``:`<a href="${o(f({real:!0,id:e.id}))}" class="btn-outline h-[42px] !px-4 text-[14px]">${s(`eye`,`h-4 w-4`)} Ver</a>`}
              ${e.pausado_por_admin?``:`<button type="button" class="btn-outline h-[42px] !px-4 text-[14px]" data-estado="${n?`publicado`:`pausado`}" data-id="${o(e.id)}">${n?`Volver a publicar`:`Pausar`}</button>`}
            </div>
          </li>`}).join(``)}
      </ul>`},C=async()=>{_.innerHTML=`<p class="flex items-center gap-2 text-ink/60">${s(`loader-circle`,`h-4 w-4 animate-spin`)} Cargando tus autos…</p>`;try{let{autos:e}=await d(`mios`);S(e??[])}catch(e){_.innerHTML=`<p class="rounded-2xl bg-[#FDECEC] px-5 py-4 text-[15px] text-[#B42318]">${o(e.message)}</p>`}},w=()=>{b(h,g),C()};_.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-estado]`);if(t){t.disabled=!0;try{await d(`estado`,{id:t.dataset.id,estado:t.dataset.estado}),await C()}catch(e){t.disabled=!1,_.insertAdjacentHTML(`afterbegin`,`<p class="mb-3 rounded-2xl bg-[#FDECEC] px-5 py-3 text-[15px] text-[#B42318]">${o(e.message)}</p>`)}}});let T=(t,n,r)=>{t.classList.toggle(`is-soon`,!n),t.tagName===`BUTTON`?t.disabled=!n:(t.toggleAttribute(`aria-disabled`,!n),n?t.removeAttribute(`tabindex`):t.setAttribute(`tabindex`,`-1`)),e(`[data-mc-publicar-sub], [data-mc-misautos-sub]`,t).textContent=r},E=i=>{if(t.hidden=!!i,n.hidden=!i,!i){e(`[data-mc-title]`).textContent=`Mi cuenta`,e(`[data-mc-sub]`).textContent=`Tu espacio en Red de Autos.`,p.hidden=!0,v=!1,g.hidden=!0;return}let a=i.tipo===`agencia`?i.agencia_tipo===`oficial`?`Concesionario oficial${i.marca_oficial?` ${i.marca_oficial}`:``}`:`Agencia multimarca`:`Particular`;e(`[data-mc-title]`).textContent=`Hola, ${i.nombre.split(` `)[0]}`,e(`[data-mc-sub]`).textContent=`${i.nombre} · ${a}`;let o=i.estado===`pendiente`;e(`[data-mc-pending]`).classList.toggle(`hidden`,!o),r.disabled=o,r.classList.toggle(`is-soon`,o),y=i.tipo===`agencia`&&i.estado===`aprobada`,T(m,y,y?`Cargá tu stock con la plantilla de Excel y tus fotos.`:o?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),T(h,y,y?`Mirá, pausá o volvé a publicar tus autos.`:o?`Disponible cuando aprobemos tu agencia.`:`Próximamente.`),!o&&location.hash===`#buscados`&&x(),y&&location.hash===`#mis-autos`&&w()};r.addEventListener(`click`,x),h.addEventListener(`click`,w),m.addEventListener(`click`,e=>{y||e.preventDefault()}),window.addEventListener(`rda:cuenta`,e=>E(e.detail)),E(a())}document.documentElement.classList.add(`js`),r(),t(),p(),n();