import{n as e,t}from"./icons-xIOwbhHI.js";import{a as n}from"./dom-C8xd8TO7.js";var r={eyebrow:`Servicio de fotos`,title:`¿Tenés fotos de tus autos pero querés que se vean más profesionales?`,text:`Nos encargamos de que tus autos luzcan con fondo de estudio, para que tus publicaciones tengan más impacto y se destaquen en el listado. Escribinos y te lo resolvemos.`,puntos:[`Fondo de estudio limpio y uniforme`,`Usamos las fotos que ya tenés`,`Listas para publicar en Red de Autos y en tus redes`],costo:`Es un servicio con costo. Escribinos por WhatsApp y te pasamos el precio según la cantidad de autos.`,mensaje:`¡Hola! Quiero consultar por el servicio de fotos con fondo de estudio para mis autos.`},i=e=>`https://wa.me/${n.whatsapp}?text=${encodeURIComponent(e)}`,a=()=>`
  <aside class="mt-10 flex flex-col gap-5 rounded-[24px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8" aria-labelledby="estudio-mini">
    <div class="flex items-start gap-4">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#9DB0FF]">${t(`camera`,`h-6 w-6`)}</span>
      <div>
        <p id="estudio-mini" class="text-[18px] font-bold">Fotos con fondo de estudio para tus autos</p>
        <p class="mt-1 text-[14px] text-white/70">Mandanos las fotos que tenés y te las devolvemos con fondo profesional. Servicio con costo.</p>
      </div>
    </div>
    <a href="${e(i(r.mensaje))}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-wa h-[48px] shrink-0 justify-center !px-5">${t(`whatsapp`,`h-4 w-4`)} Consultar</a>
  </aside>`;export{i as n,a as t};