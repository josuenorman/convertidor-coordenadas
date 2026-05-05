// Corrección final de layout solicitada: título limpio, ingreso manual horizontal, mapa, tabla y módulo SIG al final.
(function(){
  function applyFinalLayout(){
    const titleBox=document.querySelector('.hero-title');
    const h1=document.querySelector('.hero-title h1');
    if(h1) h1.innerHTML='Utilidades SIG web <span class="byline">by Norman Garcia</span>';
    document.querySelectorAll('.hero-title p,.version-box,#versionBox').forEach(el=>el.remove());

    const main=document.querySelector('main.main');
    if(!main) return;

    const manual=[...main.querySelectorAll('section')].find(s=>(s.textContent||'').includes('Ingreso manual'));
    const mapSection=document.getElementById('map')?.closest('section');
    const tableSection=document.getElementById('tbody')?.closest('section');
    const gisModule=document.getElementById('gisModule');

    if(manual){manual.classList.add('manual-horizontal');manual.style.order='1';}
    if(mapSection){mapSection.classList.add('map-wide-section');mapSection.style.order='2';}
    if(tableSection){tableSection.classList.add('table-final-section');tableSection.style.order='3';}
    if(gisModule){gisModule.style.order='4';main.appendChild(gisModule);const h=gisModule.querySelector('h2');if(h)h.textContent='📦 Módulo SIG: importar, plotear y exportar';}

    if(titleBox) titleBox.style.width='100%';
  }

  function addFinalStyles(){
    if(document.getElementById('final-layout-v30'))return;
    const css=`
      .hero{display:grid!important;grid-template-columns:minmax(420px,1fr) minmax(360px,540px)!important;align-items:center!important;gap:14px!important;padding:14px 18px!important}
      .hero-title{text-align:center!important}.hero-title h1{margin:0!important;font-size:clamp(30px,3.4vw,46px)!important;line-height:1!important;color:white!important}.hero-title .byline{font-size:13px!important;font-weight:500!important;margin-left:8px!important;color:#e0f2fe!important;vertical-align:middle!important}.hero-title p,.version-box,#versionBox{display:none!important}
      .grid.workspace-grid{display:block!important;grid-template-columns:1fr!important}.main{display:flex!important;flex-direction:column!important;gap:10px!important}.main>section,.module-card{width:100%!important;grid-column:1/-1!important}
      .manual-horizontal{display:grid!important;grid-template-columns:minmax(230px,.75fr) minmax(170px,.65fr) minmax(360px,1.2fr) minmax(220px,.85fr) auto!important;gap:8px!important;align-items:end!important;padding:10px 12px!important}.manual-horizontal br{display:none!important}.manual-horizontal .tabs{margin:0!important;align-items:center!important}.manual-horizontal .tabs h2{margin:0!important;font-size:17px!important}.manual-horizontal #name,.manual-horizontal #coordForm,.manual-horizontal #notes,.manual-horizontal .btn{margin:0!important}.manual-horizontal #coordForm .row,.manual-horizontal #coordForm .row4{display:grid!important;grid-template-columns:repeat(3,minmax(95px,1fr))!important;gap:6px!important}.manual-horizontal #coordForm .row4{grid-template-columns:repeat(4,minmax(80px,1fr))!important}.manual-horizontal textarea{min-height:40px!important;height:40px!important;resize:vertical!important}.manual-horizontal input,.manual-horizontal select,.manual-horizontal textarea,.manual-horizontal button{font-size:12px!important;padding:8px 9px!important}.manual-horizontal button{height:38px!important;white-space:nowrap!important}
      .map-wide-section{padding:10px!important}.map-wide-section .mapbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}.map-wide-section .mapbar h2{margin:0!important}.map-wide-section .map{height:62vh!important;min-height:520px!important;width:100%!important}.table-final-section .export{margin-bottom:8px!important}.tablewrap{max-height:42vh!important}
      #gisModule{margin-top:0!important}.module-grid{display:grid!important;grid-template-columns:repeat(3,minmax(260px,1fr))!important;gap:10px!important}.module-box.module-full{grid-column:auto!important}
      @media(max-width:1150px){.hero{grid-template-columns:1fr!important}.manual-horizontal{grid-template-columns:1fr!important}.manual-horizontal #coordForm .row,.manual-horizontal #coordForm .row4,.module-grid{grid-template-columns:1fr!important}.map-wide-section .map{height:58vh!important;min-height:430px!important}}
    `;
    const s=document.createElement('style');s.id='final-layout-v30';s.textContent=css;document.head.appendChild(s);
  }

  function init(){addFinalStyles();applyFinalLayout();setTimeout(applyFinalLayout,300);setTimeout(applyFinalLayout,900);setTimeout(applyFinalLayout,1600);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
