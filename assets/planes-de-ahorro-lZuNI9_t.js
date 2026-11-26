import{t as e}from"./dom-CeVhs_nS.js";import{c as t,n,s as r}from"./auth-Dxvu_kyS.js";import{n as i,t as a}from"./icons-BCeff-oe.js";import{a as o}from"./fotos-Z3M4dMCM.js";import{c as s}from"./autosReales-C7yyMh5i.js";import{n as c}from"./home2-GBBp38in.js";document.documentElement.classList.add(`js`),t(),r(),n();var l=e=>String(e||``).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase(),u=e=>e.split(/\s+/).slice(0,2).map(e=>e[0]).join(``).toUpperCase(),d=e=>String(e).replace(/^(\d{3})(\d{3})(\d{4})$/,`$1 $2-$3`),f=(e,t)=>`https://wa.me/${e.whatsapp}?text=${encodeURIComponent(`¡Hola ${e.nombre.split(` `)[0]}! Te contacto desde Red de Autos por un plan de ahorro ${t.marca} en ${t.nombre}.`)}`;function p(e,t){let n=o(e.logo),r=e.vendedores?.length??0;return`
  <li>
    <button type="button" class="group flex h-full w-full flex-col items-center rounded-[20px] border bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_18px_40px_-18px_rgba(64,95,242,0.45)] ${t?`border-brand ring-2 ring-brand/30`:`border-line`}"
      aria-pressed="${t}" data-pl-con="${i(e.id)}">
      <span class="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-white p-2">
        ${n?`<img src="${i(n)}" alt="" width="200" height="150" loading="lazy" decoding="async" class="max-h-full max-w-full object-contain" />`:`<span class="grid h-16 w-16 place-items-center rounded-2xl bg-[#EEF1FB] text-[22px] font-bold text-brand">${i(u(e.nombre))}</span>`}
      </span>
      <span class="mt-3 text-[16px] font-bold leading-snug">${i(e.nombre)}</span>
      <span class="mt-0.5 text-[13px] text-ink/60">${i(e.marca)}${e.ciudad?` · ${i(e.ciudad)}`:``}</span>
      <span class="mt-2 rounded-full bg-soft px-2.5 py-0.5 text-[12px] font-medium text-ink/70">${r} ${r===1?`vendedor`:`vendedores`}</span>
    </button>
  </li>`}function m(e,t){let n=o(e.foto);return`
  <li class="flex flex-col rounded-[20px] border border-line bg-white p-5">
    <div class="flex items-center gap-4">
      ${n?`<img src="${i(n)}" alt="" width="72" height="72" loading="lazy" decoding="async" class="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />`:`<span class="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-[#EEF1FB] text-[22px] font-bold text-brand">${i(u(e.nombre))}</span>`}
      <div class="min-w-0">
        <p class="text-[18px] font-bold leading-snug">${i(e.nombre)}</p>
        <p class="text-[14px] text-ink/60">${i(t.nombre)} · ${i(t.marca)}</p>
      </div>
    </div>
    ${e.planes?`<p class="mt-4 text-[14px]"><span class="font-bold">Planes:</span> ${i(e.planes)}</p>`:``}
    ${e.horario?`<p class="mt-2 flex items-center gap-1.5 text-[14px] text-ink/70">${a(`clock`,`h-4 w-4 shrink-0`)} ${i(e.horario)}</p>`:``}
    <div class="mt-auto grid grid-cols-2 gap-2 pt-5">
      <a href="${i(f(e,t))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px] justify-center !px-3" data-pl-clic="whatsapp" data-id="${i(e.id)}">${a(`whatsapp`,`h-4 w-4`)} WhatsApp</a>
      <a href="tel:+54${i(e.telefono)}" class="btn-outline h-[48px] justify-center !px-3" data-pl-clic="llamada" data-id="${i(e.id)}" aria-label="Llamar a ${i(e.nombre)} al ${i(d(e.telefono))}">${a(`phone`,`h-4 w-4`)} Llamar</a>
    </div>
  </li>`}(async()=>{let t=e(`[data-pl-concesionarios]`),n=e(`[data-pl-vend-box]`);e(`[data-pl-sumate]`).href=c(`¡Hola! Vendo planes de ahorro en un concesionario y quiero aparecer en la página de Planes de ahorro de Red de Autos.`);let r=[];try{r=await s(`mkt_planes_publicos`)}catch{r=[]}if(Array.isArray(r)||(r=[]),!r.length){t.innerHTML=`
      <li class="col-span-full rounded-[24px] border border-dashed border-line p-8 text-center sm:p-12">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand">${a(`handshake`,`h-6 w-6`)}</span>
        <p class="mt-4 text-[20px] font-bold">Pronto vas a encontrar acá a los vendedores de planes de ahorro</p>
        <p class="mx-auto mt-2 max-w-[520px] text-[15px] text-ink/70">De los concesionarios de Tucumán, con contacto directo por WhatsApp o teléfono.</p>
      </li>`;return}let o=new URLSearchParams(location.search).get(`c`);r.some(e=>e.id===o)||(o=r.length===1?r[0].id:null);let u=[...new Set(r.map(e=>e.marca))].sort((e,t)=>e.localeCompare(t,`es`));u.length>1&&(e(`[data-pl-marcas]`).innerHTML=[``,...u].map((e,t)=>`<label class="filter-pill"><input type="radio" name="pl-marca" value="${i(e)}" class="sr-only" ${t?``:`checked`} /><span>${i(e||`Todas`)}</span></label>`).join(``)),e(`[data-pl-filtros]`).hidden=!1,e(`[data-pl-paso1]`).hidden=!1;let d=t=>{let i=r.find(e=>e.id===o);n.hidden=!i,i&&(e(`[data-pl-vend-sub]`).textContent=`${i.nombre} · ${i.marca}${i.direccion?` · ${i.direccion}`:``}${i.ciudad?`, ${i.ciudad}`:``}`,e(`[data-pl-vendedores]`).innerHTML=(i.vendedores??[]).map(e=>m(e,i)).join(``),t&&n.scrollIntoView({behavior:`smooth`,block:`start`}))},f=()=>{let n=l(e(`[data-pl-q]`).value.trim()),i=e(`[name="pl-marca"]:checked`)?.value??``,a=r.filter(e=>(!i||e.marca===i)&&(!n||l(`${e.nombre} ${e.marca} ${e.ciudad??``} ${(e.vendedores??[]).map(e=>`${e.nombre} ${e.planes??``}`).join(` `)}`).includes(n)));t.innerHTML=a.length?a.map(e=>p(e,e.id===o)).join(``):`<li class="col-span-full py-10 text-center text-ink/60">No encontramos concesionarios con esa búsqueda.</li>`};f(),d(!1),e(`[data-pl-filtros]`).addEventListener(`input`,f),e(`[data-pl-filtros]`).addEventListener(`submit`,e=>e.preventDefault()),t.addEventListener(`click`,e=>{let t=e.target.closest(`[data-pl-con]`);if(!t)return;o=t.dataset.plCon;let n=new URL(location.href);n.searchParams.set(`c`,o),history.replaceState(null,``,n),f(),d(!0)}),n.addEventListener(`click`,e=>{let t=e.target.closest(`[data-pl-clic]`);t&&s(`mkt_registrar_clic_plan`,{p_id:t.dataset.id,p_tipo:t.dataset.plClic}).catch(()=>{})})})();