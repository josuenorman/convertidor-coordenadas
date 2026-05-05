// v1.18 - Pestañas reales de módulos: no desplaza, muestra el panel seleccionado.
(function(){
  const VERSION='1.18';
  const $=id=>document.getElementById(id);
  let activeModule='manual';

  function addStyles(){
    if($('cc-tabs-v118')) return;
    const css=`
      :root{--u-bg:#f4f7f9;--u-card:#ffffff;--u-ink:#172033;--u-muted:#5f6f82;--u-blue:#0b4f71;--u-blue2:#0e6f8d;--u-teal:#0f766e;--u-line:#d7e3ec;--u-soft:#eef7fb;--u-soft2:#f8fbfd;}
      body{background:var(--u-bg)!important;color:var(--u-ink)!important}body,.app,input,select,textarea,button,table{font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important}.app{padding:12px!important}.wrap{max-width:1500px!important;margin:auto!important}
      .hero{background:#fff!important;color:var(--u-ink)!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:22px 16px 12px!important;display:block!important;text-align:center!important}.hero:before{display:none!important}.hero-title{padding:0!important;margin:0 auto!important;text-align:center!important;max-width:980px!important}.hero-title h1{font-size:22px!important;line-height:1.1!important;color:#0f172a!important;letter-spacing:0!important;margin:0!important;font-weight:800!important}.hero-title h1:after{display:none!important}.byline{font-size:11px!important;color:#111827!important;font-weight:500!important;margin-left:5px!important;vertical-align:baseline!important}.hero-title p,.version-box{display:none!important}.hero-actions{display:none!important}.hero-projects{margin:12px auto 0!important;max-width:1020px!important;background:#f8fbfd!important;border:1px solid var(--u-line)!important;border-radius:16px!important;padding:9px!important;text-align:left!important;box-shadow:0 8px 22px rgba(15,76,129,.07)!important;max-height:120px!important;overflow:auto!important}.project-header-row{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 0 6px!important}.project-header-row strong{font-size:11px!important;text-transform:uppercase!important;letter-spacing:.08em!important;color:var(--u-blue)!important}.hero-status{font-size:10px!important;background:#eef7fb!important;color:#475569!important;border-radius:10px!important;padding:5px 8px!important;margin:0!important}.projects-inline{display:flex!important;gap:7px!important;overflow-x:auto!important;flex-direction:row!important;padding-bottom:2px!important}.projects-inline .project-toolbar{display:flex!important;gap:5px!important;margin:0!important;flex:0 0 auto!important}.projects-inline .project-toolbar .btn{font-size:10px!important;padding:6px 8px!important;border-radius:9px!important;background:var(--u-blue)!important;color:white!important}.projects-inline .project{display:flex!important;min-width:190px!important;max-width:210px!important;background:white!important;border:1px solid #cfe2ee!important;border-radius:12px!important;padding:7px!important;margin:0!important;align-items:center!important;gap:4px!important}.projects-inline .project.active{outline:2px solid #67e8f9!important;background:#ecfeff!important}.project-name-line b{font-size:12px!important}.project-sub{font-size:9px!important}.mini-project-icon{width:22px!important;height:22px!important}
      .module-tabs{display:flex!important;justify-content:center!important;gap:18px!important;flex-wrap:wrap!important;margin:14px auto 4px!important;max-width:1000px!important}.module-chip{min-width:130px!important;border:1px solid #083344!important;background:#155e75!important;color:white!important;border-radius:6px!important;padding:11px 18px!important;font-size:12px!important;font-weight:800!important;box-shadow:0 4px 10px rgba(21,94,117,.18)!important;cursor:pointer!important}.module-chip:hover{background:#0e7490!important;transform:none!important}.module-chip.active{background:#0f766e!important;border-color:#0f766e!important;box-shadow:0 0 0 3px rgba(15,118,110,.18)!important}
      .grid.workspace-grid{display:block!important;margin-top:8px!important}.main{display:grid!important;grid-template-columns:1fr!important;grid-template-areas:"panel" "table" "map"!important;gap:12px!important}.card,.module-card{background:white!important;border:1px solid var(--u-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(23,32,51,.06)!important}.card.pad,.module-card{padding:14px!important}.card h2,.module-card h2{font-size:18px!important;color:var(--u-blue)!important;margin:0 0 10px!important}.main>section.card:not(.full){grid-area:panel!important}.main>section.card.full:nth-of-type(2){grid-area:table!important}.main>section.card.full:nth-of-type(1){grid-area:map!important}#gisModule{grid-area:panel!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}#gisModule>h2{display:none!important}.module-grid{display:block!important}.module-box{display:none!important;background:white!important;border:1px solid var(--u-line)!important;border-radius:16px!important;padding:14px!important;box-shadow:0 8px 22px rgba(23,32,51,.06)!important}.module-box h3{font-size:18px!important;color:var(--u-blue)!important;margin:0 0 8px!important}.module-box.is-active{display:block!important}.module-note{font-size:12px!important;color:var(--u-muted)!important;margin:4px 0 10px!important}.coord-mode{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:8px!important}.field-map{display:grid!important;grid-template-columns:repeat(5,minmax(120px,1fr))!important;gap:8px!important}.file-input{background:#f8fbfd!important;border:1px dashed #7dd3fc!important;border-radius:12px!important;padding:10px!important}.preview-table{max-height:170px!important}.module-actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}.module-actions .btn{padding:9px 12px!important;font-size:12px!important;border-radius:10px!important}.module-full .module-actions{flex-direction:row!important}.module-full .btn{width:auto!important}.main>section.card:not(.full){display:none}.main>section.card:not(.full).is-active{display:block!important}
      .export{background:linear-gradient(90deg,#ecfdf5,#ecfeff)!important;border:1px solid #99f6e4!important;border-radius:14px!important;padding:12px!important}.export h2{color:#065f46!important}.tablewrap{max-height:42vh!important;border:1px solid var(--u-line)!important;border-radius:14px!important}table{font-size:11px!important}th{background:#eef6fa!important;color:#334155!important;padding:8px!important;position:sticky!important;top:0!important;z-index:1!important}td{padding:5px!important}td input,td select{font-size:11px!important;padding:6px!important}.map{height:55vh!important;min-height:440px!important;border-radius:16px!important;border:1px solid var(--u-line)!important}.mapbar h2{color:var(--u-blue)!important}.mapbar .btns{gap:7px!important}.place-wrap{max-width:300px!important}.btn:not(.white):not(.out){background:var(--u-blue)!important}.btn.green{background:#0f766e!important}.btn.out,.btn.white{background:white!important;color:#0f172a!important;border:1px solid #cbd5e1!important;box-shadow:none!important}.compact-info{max-width:1000px;margin:6px auto 0;color:#64748b;font-size:11px;text-align:center}.info-dot{position:absolute;right:26px;top:26px;background:#111827;color:white;border-radius:999px;width:22px;height:22px;display:grid;place-items:center;font-weight:900;font-size:14px;cursor:pointer}
      @media(max-width:900px){.module-tabs{gap:8px!important}.module-chip{min-width:auto!important;flex:1 1 44%!important;padding:10px!important}.coord-mode,.field-map{grid-template-columns:1fr!important}.hero-projects{max-height:none!important}.projects-inline{flex-direction:column!important}.projects-inline .project{max-width:none!important;width:100%!important}.map{height:52vh!important;min-height:380px!important}.tablewrap{max-height:48vh!important}}
    `;
    const s=document.createElement('style');s.id='cc-tabs-v118';s.textContent=css;document.head.appendChild(s);
  }

  function ensureHeader(){
    const hero=document.querySelector('.hero'); if(!hero) return;
    const h=document.querySelector('.hero-title h1');
    if(h) h.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    const p=document.querySelector('.hero-title p'); if(p) p.textContent='';
    if(!$('infoDot')){const i=document.createElement('div');i.id='infoDot';i.className='info-dot';i.title='Utilidades SIG Web';i.textContent='i';i.onclick=()=>msg('Utilidades SIG Web: módulos para ingreso manual, CSV/Excel, Shapefile, tabla, mapa y exportación. Versión 1.18.');hero.appendChild(i)}
    if(!$('moduleTabs')){
      const nav=document.createElement('nav');nav.id='moduleTabs';nav.className='module-tabs';nav.innerHTML=`
        <button class="module-chip active" data-module="manual">Ingreso manual</button>
        <button class="module-chip" data-module="csv">Cargar CSV o Excel</button>
        <button class="module-chip" data-module="shp">Cargar Shapefile</button>
        <button class="module-chip" data-module="export">Exportar para QGIS</button>`;
      hero.appendChild(nav);
      const info=document.createElement('div');info.className='compact-info';info.textContent='Selecciona un módulo para mostrar sus opciones. La tabla y el mapa permanecen disponibles para revisar, editar y visualizar datos.';hero.appendChild(info);
      nav.querySelectorAll('.module-chip').forEach(b=>b.onclick=()=>setModule(b.dataset.module));
    }
  }

  function setModule(mod){
    activeModule=mod;
    document.querySelectorAll('.module-chip').forEach(b=>b.classList.toggle('active',b.dataset.module===mod));
    const manual=document.querySelector('.main>section.card:not(.full)');
    const boxes=document.querySelectorAll('#gisModule .module-box');
    if(manual) manual.classList.toggle('is-active',mod==='manual');
    boxes.forEach((box,i)=>{
      const key=i===0?'csv':i===1?'shp':'export';
      box.classList.toggle('is-active',mod===key);
    });
    const msgText={manual:'Módulo activo: ingreso manual de coordenadas.',csv:'Módulo activo: cargar CSV o Excel, seleccionar X/Y y plotear.',shp:'Módulo activo: cargar Shapefile ZIP y convertir a tabla.',export:'Módulo activo: exportar proyecto para QGIS.'}[mod];
    if(typeof msg==='function') msg(msgText);
  }

  function preparePanels(){
    const module=$('gisModule');
    if(module){
      const boxes=module.querySelectorAll('.module-box');
      if(boxes[0]) boxes[0].dataset.module='csv';
      if(boxes[1]) boxes[1].dataset.module='shp';
      if(boxes[2]) boxes[2].dataset.module='export';
    }
    setModule(activeModule);
  }

  function init(){addStyles();ensureHeader();setTimeout(()=>{ensureHeader();preparePanels();},500);setTimeout(()=>{ensureHeader();preparePanels();},1200)}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
