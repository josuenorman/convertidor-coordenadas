// v1.23 - Ajuste estable: módulos arriba, mapa después y tabla al final.
// Mantiene funcionalidad existente; solo compacta y suaviza la distribución visual.
(function(){
  const $ = id => document.getElementById(id);

  function addStyles(){
    if($('cc-layout-v123')) return;
    const style = document.createElement('style');
    style.id = 'cc-layout-v123';
    style.textContent = `
      body,.app,input,select,textarea,button,table{
        font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important;
      }
      body{background:#f3f6f8!important;color:#0f172a!important;}
      .app{padding:10px!important;}
      .wrap{max-width:1500px!important;margin:0 auto!important;}

      /* Encabezado estable, centrado y sin subtítulo redundante */
      .hero{
        background:#ffffff!important;
        border:1px solid #d8e3ec!important;
        border-radius:18px!important;
        box-shadow:0 8px 22px rgba(15,95,124,.06)!important;
        padding:14px 16px!important;
        display:block!important;
      }
      .hero:before{display:none!important;}
      .hero-title{
        text-align:center!important;
        width:100%!important;
        margin:0 auto 10px!important;
        padding:0!important;
      }
      .hero-title h1{
        text-align:center!important;
        margin:0 auto!important;
        font-size:26px!important;
        line-height:1.15!important;
        color:#0f172a!important;
        font-weight:800!important;
      }
      .hero-title h1:after{display:none!important;content:""!important;}
      .hero-title p,.version-box,.compact-info{display:none!important;}
      .byline{
        font-size:11px!important;
        font-weight:500!important;
        color:#475569!important;
        margin-left:7px!important;
        vertical-align:middle!important;
      }

      /* Proyectos: compacto, con Nuevo/CSV en la misma línea */
      .hero-projects{
        width:100%!important;
        max-width:1080px!important;
        margin:0 auto!important;
        padding:8px 10px!important;
        background:#f8fbfd!important;
        border:1px solid #d8e3ec!important;
        border-radius:13px!important;
        box-shadow:none!important;
        max-height:112px!important;
        overflow:auto!important;
      }
      .project-header-row{
        display:flex!important;
        align-items:center!important;
        gap:8px!important;
        flex-wrap:wrap!important;
        margin:0 0 6px!important;
      }
      .project-header-row strong{
        font-size:11px!important;
        color:#0f5f7c!important;
        text-transform:uppercase!important;
        letter-spacing:.07em!important;
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
        padding:5px 9px!important;
        border-radius:8px!important;
        box-shadow:none!important;
      }
      .projects-inline{
        display:flex!important;
        flex-direction:row!important;
        gap:6px!important;
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
        min-width:175px!important;
        max-width:210px!important;
        margin:0!important;
        padding:6px!important;
        border-radius:10px!important;
        background:#ffffff!important;
        border:1px solid #cfe2ee!important;
        display:flex!important;
        align-items:center!important;
        gap:4px!important;
      }
      .projects-inline .project.active{
        background:#e6f7fb!important;
        outline:2px solid #7dd3fc!important;
      }
      .project-name-line b{font-size:11px!important;}
      .project-sub{font-size:9px!important;}
      .mini-project-icon{width:20px!important;height:20px!important;}

      /* Orden definitivo: módulos → mapa → tabla */
      .grid.workspace-grid{display:block!important;margin-top:12px!important;}
      .main{
        display:grid!important;
        grid-template-columns:1fr!important;
        grid-template-areas:
          "modules"
          "map"
          "table"!important;
        gap:13px!important;
      }
      #sigModulesV122{grid-area:modules!important;}
      .main>section.card.full:nth-of-type(1){grid-area:map!important;}
      .main>section.card.full:nth-of-type(2){grid-area:table!important;}

      /* Módulos compactos y uniformes: letra 11 */
      #sigModulesV122{
        display:grid!important;
        grid-template-columns:repeat(4,minmax(210px,1fr))!important;
        gap:12px!important;
        align-items:stretch!important;
      }
      .sig-module-card{
        background:#ffffff!important;
        border:1px solid #d8e3ec!important;
        border-radius:14px!important;
        box-shadow:0 8px 20px rgba(15,95,124,.06)!important;
        min-height:auto!important;
        overflow:hidden!important;
      }
      .sig-module-title{
        background:#0f5f7c!important;
        color:#ffffff!important;
        text-align:center!important;
        font-size:11px!important;
        line-height:1.2!important;
        font-weight:800!important;
        padding:8px 9px!important;
      }
      .sig-module-body{
        padding:10px!important;
        font-size:11px!important;
      }
      .sig-module-body *{
        font-size:11px!important;
      }
      .sig-module-body h2,
      .sig-module-body h3{
        font-size:11px!important;
        line-height:1.25!important;
        color:#0f5f7c!important;
        margin:0 0 7px!important;
        font-weight:800!important;
      }
      .sig-module-body .card,
      .sig-module-body .module-box{
        display:block!important;
        border:0!important;
        box-shadow:none!important;
        background:transparent!important;
        padding:0!important;
      }
      .sig-module-body input,
      .sig-module-body select,
      .sig-module-body textarea{
        padding:7px!important;
        border-radius:9px!important;
        min-height:auto!important;
      }
      .sig-module-body textarea{min-height:58px!important;}
      .sig-module-body .coord-mode,
      .sig-module-body .field-map{
        display:grid!important;
        grid-template-columns:1fr!important;
        gap:6px!important;
      }
      .sig-module-body .module-actions{
        display:flex!important;
        gap:6px!important;
        flex-wrap:wrap!important;
      }
      .sig-module-body .btn{
        padding:7px 9px!important;
        border-radius:9px!important;
      }
      .sig-module-body .preview-table{max-height:115px!important;}

      /* Ocultar contenedores originales ya reubicados */
      .main>section.card:not(.full),#gisModule{display:none!important;}

      /* Mapa más limpio */
      .card,.module-card{
        background:#ffffff!important;
        border:1px solid #d8e3ec!important;
        border-radius:16px!important;
        box-shadow:0 8px 22px rgba(15,95,124,.06)!important;
      }
      .card.pad{padding:13px!important;}
      .card h2{
        font-size:16px!important;
        color:#0f5f7c!important;
        margin:0 0 10px!important;
      }
      .map{
        height:52vh!important;
        min-height:420px!important;
        border-radius:14px!important;
        border:1px solid #d8e3ec!important;
      }
      .mapbar h2{color:#0f5f7c!important;}
      .mapbar .btns{gap:6px!important;}

      /* Tabla al final */
      .export{
        padding:10px!important;
        border-radius:13px!important;
        background:linear-gradient(90deg,#ecfdf5,#ecfeff)!important;
        border:1px solid #99f6e4!important;
      }
      .export h2{
        font-size:15px!important;
        color:#065f46!important;
      }
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
      td input,td select{
        font-size:11px!important;
        padding:5px!important;
      }
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
    document.head.appendChild(style);
  }

  function fixTitle(){
    document.title='Utilidades SIG Web v1.23';
    const h=document.querySelector('.hero-title h1');
    if(h) h.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    const p=document.querySelector('.hero-title p');
    if(p) p.remove();
  }

  function init(){
    addStyles();
    setTimeout(fixTitle,250);
    setTimeout(fixTitle,900);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
