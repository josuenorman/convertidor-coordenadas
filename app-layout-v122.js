// v1.22 - Reorganización visual exacta: encabezado → módulos → mapa → tabla.
// No cambia la lógica de la aplicación; solo mueve/ordena secciones existentes.
(function(){
  const $ = id => document.getElementById(id);

  function addStyles(){
    if($('cc-layout-v122')) return;
    const css = `
      body,.app,input,select,textarea,button,table{
        font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important;
      }
      body{background:#f3f6f8!important;color:#0f172a!important;}
      .app{padding:10px!important;}
      .wrap{max-width:1500px!important;margin:0 auto!important;}

      /* 1. ENCABEZADO */
      .hero{
        background:#ffffff!important;
        border:1px solid #d8e3ec!important;
        border-radius:20px!important;
        box-shadow:0 8px 24px rgba(15,95,124,.07)!important;
        padding:16px 18px!important;
        display:block!important;
        color:#0f172a!important;
      }
      .hero:before{display:none!important;}
      .hero-title{
        width:100%!important;
        text-align:center!important;
        margin:0 auto 12px!important;
        padding:0!important;
      }
      .hero-title h1{
        text-align:center!important;
        margin:0!important;
        font-size:28px!important;
        line-height:1.15!important;
        color:#0f172a!important;
        font-weight:800!important;
        letter-spacing:-.02em!important;
      }
      .hero-title h1:after{display:none!important;content:""!important;}
      .hero-title p,.version-box,.compact-info{display:none!important;}
      .byline{
        font-size:12px!important;
        color:#475569!important;
        font-weight:500!important;
        margin-left:8px!important;
        vertical-align:middle!important;
      }
      .hero-projects{
        width:100%!important;
        max-width:1080px!important;
        margin:0 auto!important;
        padding:8px 10px!important;
        background:#f8fbfd!important;
        border:1px solid #d8e3ec!important;
        border-radius:14px!important;
        box-shadow:none!important;
        max-height:120px!important;
        overflow:auto!important;
      }
      .project-header-row{
        display:flex!important;
        align-items:center!important;
        gap:8px!important;
        margin:0 0 6px!important;
        flex-wrap:wrap!important;
      }
      .project-header-row strong{
        font-size:11px!important;
        text-transform:uppercase!important;
        letter-spacing:.08em!important;
        color:#0f5f7c!important;
      }
      .hero-status{
        font-size:10px!important;
        background:#eef7fb!important;
        color:#475569!important;
        padding:5px 8px!important;
        border-radius:9px!important;
        margin:0!important;
      }
      .hero-actions{
        display:inline-flex!important;
        gap:6px!important;
        margin-left:auto!important;
        align-items:center!important;
      }
      .hero-actions .btn{
        font-size:10px!important;
        padding:6px 10px!important;
        border-radius:9px!important;
        box-shadow:none!important;
      }
      .projects-inline{
        display:flex!important;
        gap:6px!important;
        flex-direction:row!important;
        overflow-x:auto!important;
      }
      .projects-inline .project-toolbar{
        display:flex!important;
        gap:5px!important;
        margin:0!important;
        flex:0 0 auto!important;
      }
      .projects-inline .project-toolbar .btn{
        font-size:10px!important;
        padding:5px 8px!important;
        border-radius:8px!important;
        background:#0f5f7c!important;
        color:white!important;
      }
      .projects-inline .project{
        min-width:185px!important;
        max-width:220px!important;
        margin:0!important;
        padding:6px!important;
        border-radius:10px!important;
        background:#fff!important;
        border:1px solid #cfe2ee!important;
        display:flex!important;
        align-items:center!important;
        gap:4px!important;
      }
      .projects-inline .project.active{
        background:#e6f7fb!important;
        outline:2px solid #7dd3fc!important;
      }

      /* ORDEN PRINCIPAL */
      .grid.workspace-grid{display:block!important;margin-top:12px!important;}
      .main{
        display:grid!important;
        grid-template-columns:1fr!important;
        grid-template-areas:
          "modules"
          "map"
          "table"!important;
        gap:14px!important;
      }

      /* 2. MÓDULOS */
      #sigModulesV122{
        grid-area:modules!important;
        display:grid!important;
        grid-template-columns:repeat(4,minmax(210px,1fr))!important;
        gap:12px!important;
        align-items:start!important;
      }
      .sig-module-card{
        background:#ffffff!important;
        border:1px solid #d8e3ec!important;
        border-radius:18px!important;
        box-shadow:0 8px 22px rgba(15,95,124,.07)!important;
        overflow:hidden!important;
        min-height:140px!important;
      }
      .sig-module-title{
        background:linear-gradient(135deg,#0f5f7c,#0e7490)!important;
        color:white!important;
        font-size:13px!important;
        font-weight:800!important;
        text-align:center!important;
        padding:11px 12px!important;
      }
      .sig-module-body{
        padding:12px!important;
      }
      .sig-module-body .card,
      .sig-module-body .module-box{
        display:block!important;
        border:0!important;
        box-shadow:none!important;
        background:transparent!important;
        padding:0!important;
      }
      .sig-module-body h2,
      .sig-module-body h3{
        font-size:15px!important;
        color:#0f5f7c!important;
        margin:0 0 8px!important;
      }
      .sig-module-body input,
      .sig-module-body select,
      .sig-module-body textarea{
        font-size:12px!important;
        padding:8px!important;
        border-radius:10px!important;
      }
      .sig-module-body textarea{min-height:70px!important;}
      .sig-module-body .coord-mode,
      .sig-module-body .field-map{
        display:grid!important;
        grid-template-columns:1fr!important;
        gap:7px!important;
      }
      .sig-module-body .module-actions{
        display:flex!important;
        gap:7px!important;
        flex-wrap:wrap!important;
      }
      .sig-module-body .btn{
        font-size:12px!important;
        padding:8px 10px!important;
        border-radius:10px!important;
      }
      .sig-module-body .preview-table{max-height:130px!important;}

      /* Ocultar contenedores originales una vez movidos */
      .main>section.card:not(.full),#gisModule{display:none!important;}

      /* 3. MAPA */
      .main>section.card.full:nth-of-type(1){grid-area:map!important;}
      .map{
        height:54vh!important;
        min-height:440px!important;
        border-radius:15px!important;
        border:1px solid #d8e3ec!important;
      }
      .mapbar h2{color:#0f5f7c!important;}
      .mapbar .btns{gap:6px!important;}

      /* 4. TABLA */
      .main>section.card.full:nth-of-type(2){grid-area:table!important;}
      .card,.module-card{
        background:#fff!important;
        border:1px solid #d8e3ec!important;
        border-radius:16px!important;
        box-shadow:0 8px 22px rgba(15,95,124,.07)!important;
      }
      .card.pad{padding:13px!important;}
      .card h2{font-size:18px!important;color:#0f5f7c!important;margin:0 0 10px!important;}
      .export{
        padding:10px!important;
        border-radius:14px!important;
        background:linear-gradient(90deg,#ecfdf5,#ecfeff)!important;
        border:1px solid #99f6e4!important;
      }
      .export h2{font-size:16px!important;color:#065f46!important;}
      .export p{font-size:11px!important;}
      .tablewrap{
        max-height:42vh!important;
        border:1px solid #d8e3ec!important;
        border-radius:13px!important;
      }
      table{font-size:11px!important;}
      th{
        background:#eef7fb!important;
        color:#334155!important;
        padding:7px!important;
        position:sticky!important;
        top:0!important;
      }
      td{padding:5px!important;}
      td input,td select{font-size:11px!important;padding:5px!important;}
      .btn:not(.white):not(.out){background:#0f5f7c!important;}
      .btn.green{background:#0f766e!important;}
      .btn.out,.btn.white{
        background:#fff!important;
        color:#0f172a!important;
        border:1px solid #cbd5e1!important;
        box-shadow:none!important;
      }

      @media(max-width:1180px){
        #sigModulesV122{grid-template-columns:repeat(2,minmax(210px,1fr))!important;}
        .map{height:50vh!important;}
        .tablewrap{max-height:44vh!important;}
      }
      @media(max-width:720px){
        .hero-title h1{font-size:22px!important;}
        .byline{display:block!important;margin:3px 0 0!important;}
        #sigModulesV122{grid-template-columns:1fr!important;}
        .projects-inline{flex-direction:column!important;}
        .projects-inline .project{width:100%!important;max-width:none!important;}
        .hero-actions{margin-left:0!important;}
        .map{height:48vh!important;min-height:360px!important;}
      }
    `;
    const style=document.createElement('style');
    style.id='cc-layout-v122';
    style.textContent=css;
    document.head.appendChild(style);
  }

  function createModule(title, element){
    const card=document.createElement('section');
    card.className='sig-module-card';
    card.innerHTML=`<div class="sig-module-title">${title}</div><div class="sig-module-body"></div>`;
    if(element) card.querySelector('.sig-module-body').appendChild(element);
    return card;
  }

  function organize(){
    const main=document.querySelector('main.main');
    if(!main || $('sigModulesV122')) return;

    const manual=document.querySelector('.main>section.card:not(.full)');
    const moduleBoxes=document.querySelectorAll('#gisModule .module-box');
    const csv=moduleBoxes[0] || null;
    const shp=moduleBoxes[1] || null;
    const exp=moduleBoxes[2] || null;

    const modules=document.createElement('section');
    modules.id='sigModulesV122';
    modules.appendChild(createModule('Ingreso manual', manual));
    modules.appendChild(createModule('CSV / Excel', csv));
    modules.appendChild(createModule('Shapefile', shp));
    modules.appendChild(createModule('Exportar', exp));
    main.prepend(modules);
  }

  function fixHeader(){
    document.title='Utilidades SIG Web v1.22';
    const h=document.querySelector('.hero-title h1');
    if(h) h.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    const p=document.querySelector('.hero-title p');
    if(p) p.remove();
    const oldTabs=$('moduleTabs'); if(oldTabs) oldTabs.remove();
    const oldInfo=document.querySelector('.compact-info'); if(oldInfo) oldInfo.remove();
  }

  function init(){
    addStyles();
    setTimeout(()=>{fixHeader();organize();},250);
    setTimeout(()=>{fixHeader();organize();},900);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
