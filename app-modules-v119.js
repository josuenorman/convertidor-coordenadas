// v1.20 - Layout mejorado: módulos arriba, mapa, tabla. Título centrado. Sin textos redundantes.
(function(){
  const VERSION='1.20';
  const $=id=>document.getElementById(id);

  function css(){
    if($('cc-modules-v120')) return;
    const s=document.createElement('style');
    s.id='cc-modules-v120';
    s.textContent=`
      :root{
        --bg:#f3f6f8;--ink:#0f172a;--muted:#64748b;
        --blue:#0f5f7c;--blue2:#0e7490;--teal:#0f766e;
        --line:#d8e3ec;--card:#ffffff;--soft:#eef7fb;
      }
      body{background:var(--bg)!important;color:var(--ink)!important}
      body,.app,input,select,textarea,button,table{
        font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important
      }
      .app{padding:8px 10px!important}
      .wrap{max-width:1500px!important;margin:auto!important}

      /* ── ENCABEZADO ── */
      .hero{
        background:#fff!important;border:0!important;border-radius:0!important;
        box-shadow:none!important;padding:14px 12px 10px!important;
        display:flex!important;flex-direction:column!important;align-items:center!important;
      }
      .hero:before{display:none!important}
      .hero-title{
        width:100%!important;text-align:center!important;
        display:flex!important;justify-content:center!important;
        margin:0 auto!important;padding:0!important;
      }
      .hero-title h1{
        font-size:26px!important;line-height:1.2!important;margin:0!important;
        color:#0b1220!important;font-weight:800!important;letter-spacing:-.02em!important;
        text-align:center!important;
      }
      .hero-title h1:after{display:none!important}
      .byline{font-size:11px!important;font-weight:500!important;margin-left:6px!important;color:#475569!important}
      .hero-title p,.version-box,.compact-info{display:none!important}
      .info-dot{right:24px!important;top:22px!important}

      /* ── PROYECTOS ── */
      .hero-projects{
        max-width:1060px!important;margin:10px auto 0!important;
        background:#fff!important;border:1px solid var(--line)!important;
        border-radius:14px!important;box-shadow:0 8px 22px rgba(15,95,124,.07)!important;
        padding:8px!important;text-align:left!important;
        max-height:105px!important;overflow:auto!important;width:100%!important;
      }
      .project-header-row{
        margin:0 0 5px!important;display:flex!important;
        align-items:center!important;gap:8px!important;flex-wrap:wrap!important;
      }
      .project-header-row strong{
        font-size:11px!important;color:var(--blue)!important;
        text-transform:uppercase!important;letter-spacing:.06em!important;
      }
      .hero-status{
        font-size:10px!important;background:#eef7fb!important;color:#475569!important;
        padding:4px 7px!important;border-radius:9px!important;margin:0!important;
      }
      .hero-actions{
        display:inline-flex!important;gap:6px!important;margin-left:auto!important;
      }
      .hero-actions .btn{
        font-size:10px!important;padding:5px 10px!important;border-radius:8px!important;
      }
      .projects-inline{
        display:flex!important;gap:6px!important;flex-direction:row!important;overflow-x:auto!important;
      }
      .projects-inline .project-toolbar{
        display:flex!important;gap:5px!important;margin:0!important;flex:0 0 auto!important;
      }
      .projects-inline .project-toolbar .btn{
        font-size:10px!important;padding:5px 8px!important;
        background:var(--blue)!important;color:#fff!important;border-radius:8px!important;
      }
      .projects-inline .project{
        min-width:185px!important;max-width:210px!important;margin:0!important;
        padding:6px!important;border-radius:10px!important;background:#f8fbfd!important;
        border:1px solid #cfe2ee!important;display:flex!important;gap:4px!important;align-items:center!important;
      }
      .projects-inline .project.active{background:#e6f7fb!important;outline:2px solid #7dd3fc!important}
      .project-name-line b{font-size:12px!important}
      .project-sub{font-size:9px!important}
      .mini-project-icon{width:21px!important;height:21px!important}

      /* ── LAYOUT PRINCIPAL: módulos → mapa → tabla ── */
      .grid.workspace-grid{display:block!important;margin-top:10px!important}
      .main{
        display:grid!important;
        grid-template-columns:1fr!important;
        grid-template-areas:"modules" "map" "table"!important;
        gap:14px!important;
      }
      /* Ocultar secciones originales que el JS reemplaza */
      .main>section.card:not(.full),#gisModule{display:none!important}

      /* ── MÓDULOS ── */
      .u-modules{
        grid-area:modules!important;
        display:grid!important;
        grid-template-columns:repeat(4,minmax(210px,1fr))!important;
        gap:14px!important;align-items:start!important;
      }
      .u-module{
        background:var(--blue)!important;color:white!important;
        border:1px solid #083344!important;border-radius:24px!important;
        min-height:158px!important;box-shadow:0 10px 22px rgba(15,95,124,.18)!important;
        overflow:hidden!important;transition:.18s;
      }
      .u-module.is-open{
        background:#fff!important;color:var(--ink)!important;
        border-color:var(--line)!important;box-shadow:0 12px 28px rgba(15,95,124,.12)!important;
        grid-column:span 2!important;
      }
      .u-module-head{
        padding:14px 16px!important;text-align:center!important;
        font-size:13px!important;font-weight:800!important;cursor:pointer!important;
        display:flex!important;align-items:center!important;
        justify-content:center!important;gap:8px!important;min-height:70px!important;
      }
      .u-module.is-open .u-module-head{
        background:linear-gradient(135deg,var(--blue),var(--blue2))!important;
        color:white!important;min-height:auto!important;
      }
      .u-module-body{display:none!important;padding:14px!important;background:#fff!important;color:var(--ink)!important}
      .u-module.is-open .u-module-body{display:block!important}
      .u-module-placeholder{
        font-size:11px!important;line-height:1.35!important;opacity:.9;
        padding:0 14px 16px!important;text-align:center!important;
      }
      .u-module.is-open .u-module-placeholder{display:none!important}
      .u-module-body .card,.u-module-body .module-box{
        display:block!important;border:0!important;box-shadow:none!important;
        background:transparent!important;padding:0!important;
      }
      .u-module-body h2,.u-module-body h3{font-size:16px!important;color:var(--blue)!important;margin:0 0 10px!important}
      .u-module-body .tabs{gap:8px!important}
      .u-module-body input,.u-module-body select,.u-module-body textarea{
        padding:8px!important;font-size:12px!important;border-radius:10px!important;
      }
      .u-module-body textarea{min-height:70px!important}
      .u-module-body .coord-mode,.u-module-body .field-map{
        display:grid!important;grid-template-columns:1fr!important;gap:7px!important;
      }
      .u-module-body .module-actions{display:flex!important;gap:7px!important;flex-wrap:wrap!important}
      .u-module-body .btn{font-size:12px!important;padding:8px 10px!important;border-radius:10px!important}
      .u-module-body .preview-table{max-height:130px!important}

      /* ── MAPA (grid-area: map) ── */
      .main>section.card.full:nth-of-type(1){grid-area:map!important}
      /* ── TABLA (grid-area: table) ── */
      .main>section.card.full:nth-of-type(2){grid-area:table!important}

      /* ── TARJETAS GENERALES ── */
      .card,.module-card{
        background:#fff!important;border:1px solid var(--line)!important;
        border-radius:16px!important;box-shadow:0 8px 22px rgba(15,95,124,.07)!important;
      }
      .card.pad{padding:13px!important}
      .card h2{font-size:18px!important;color:var(--blue)!important;margin:0 0 10px!important}
      .export{
        padding:10px!important;border-radius:14px!important;
        background:linear-gradient(90deg,#ecfdf5,#ecfeff)!important;
        border:1px solid #99f6e4!important;
      }
      .export h2{font-size:16px!important;color:#065f46!important}
      .export p{font-size:11px!important}
      .tablewrap{max-height:38vh!important;border:1px solid var(--line)!important;border-radius:13px!important}
      table{font-size:11px!important}
      th{background:#eef7fb!important;color:#334155!important;padding:7px!important;position:sticky!important;top:0!important}
      td{padding:5px!important}
      td input,td select{font-size:11px!important;padding:5px!important}
      .map{height:52vh!important;min-height:430px!important;border-radius:15px!important;border:1px solid var(--line)!important}
      .mapbar h2{color:var(--blue)!important}
      .mapbar .btns{gap:6px!important}
      .place-wrap{max-width:280px!important}
      .btn:not(.white):not(.out){background:var(--blue)!important}
      .btn.green{background:var(--teal)!important}
      .btn.out,.btn.white{background:#fff!important;color:var(--ink)!important;border:1px solid #cbd5e1!important;box-shadow:none!important}

      /* ── RESPONSIVO ── */
      @media(max-width:1180px){
        .u-modules{grid-template-columns:repeat(2,1fr)!important}
        .u-module.is-open{grid-column:span 2!important}
        .map{height:50vh!important}
        .tablewrap{max-height:42vh!important}
      }
      @media(max-width:700px){
        .hero-title h1{font-size:22px!important}
        .byline{display:block!important;margin:3px 0 0!important}
        .u-modules{grid-template-columns:1fr!important}
        .u-module.is-open{grid-column:span 1!important}
        .projects-inline{flex-direction:column!important}
        .projects-inline .project{max-width:none!important;width:100%!important}
        .map{height:48vh!important;min-height:360px!important}
        .tablewrap{max-height:46vh!important}
        .hero-actions{margin-left:0!important}
      }
    `;
    document.head.appendChild(s);
  }

  function buildModules(){
    if($('uModules')) return;
    const main=document.querySelector('main.main'); if(!main) return;
    const manual=document.querySelector('.main>section.card:not(.full)');
    const boxes=document.querySelectorAll('#gisModule .module-box');
    const csv=boxes[0], shp=boxes[1], exp=boxes[2];
    const wrap=document.createElement('section');
    wrap.id='uModules';
    wrap.className='u-modules';
    const items=[
      {id:'manual', title:'✏️ Ingreso manual',    hint:'Convertir y agregar coordenadas manualmente.', el:manual},
      {id:'csv',    title:'📂 CSV / Excel',        hint:'Importar tabla, seleccionar columnas X/Y y plotear.', el:csv},
      {id:'shp',    title:'🗺️ Shapefile',          hint:'Cargar ZIP con geometrías y atributos.', el:shp},
      {id:'export', title:'⬇️ Exportar',           hint:'Descargar CSV o GeoJSON para QGIS.', el:exp}
    ];
    items.forEach((it,i)=>{
      const card=document.createElement('article');
      card.className='u-module'+(i===0?' is-open':'');
      card.dataset.module=it.id;
      card.innerHTML=`
        <div class="u-module-head">${it.title}</div>
        <div class="u-module-placeholder">${it.hint}</div>
        <div class="u-module-body"></div>
      `;
      if(it.el) card.querySelector('.u-module-body').appendChild(it.el);
      card.querySelector('.u-module-head').onclick=()=>openModule(it.id);
      wrap.appendChild(card);
    });
    main.prepend(wrap);
  }

  function openModule(id){
    document.querySelectorAll('.u-module').forEach(m=>{
      m.classList.toggle('is-open', m.dataset.module===id);
    });
    if(typeof msg==='function'){
      const labels={manual:'Ingreso manual',csv:'CSV / Excel',shp:'Shapefile',export:'Exportar'};
      msg((labels[id]||'Módulo')+' activo.');
    }
  }

  function fixHeader(){
    document.title='Utilidades SIG Web v1.20';
    // Título centrado
    const h=document.querySelector('.hero-title h1');
    if(h) h.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    // Eliminar subtítulo de versión redundante
    const p=document.querySelector('.hero-title p');
    if(p) p.remove();
    // Eliminar tabs y compact-info si existen
    const oldTabs=$('moduleTabs'); if(oldTabs) oldTabs.remove();
    const oldInfo=document.querySelector('.compact-info'); if(oldInfo) oldInfo.remove();
  }

  function init(){
    css();
    setTimeout(()=>{ fixHeader(); buildModules(); }, 300);
    setTimeout(()=>{ fixHeader(); buildModules(); }, 1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
