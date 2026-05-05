// Ajustes solicitados: ingreso manual horizontal arriba del mapa, sin bloque de novedades y firma en título.
(function(){
  function moveAndClean(){
    const h1=document.querySelector('.hero-title h1');
    if(h1 && !h1.querySelector('.byline')) h1.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    document.querySelectorAll('#versionBox,.version-box,.hero-title p').forEach(el=>el.remove());

    const main=document.querySelector('main.main');
    if(!main)return;
    const manual=[...main.querySelectorAll('section')].find(s=>(s.textContent||'').includes('Ingreso manual'));
    const mapSection=document.getElementById('map')?.closest('section');
    const gisModule=document.getElementById('gisModule');
    if(manual){manual.classList.add('manual-top-horizontal');manual.style.order='1';main.insertBefore(manual,mapSection||main.firstChild);}
    if(mapSection){mapSection.style.order='2';mapSection.classList.add('map-after-manual');}
    if(gisModule){gisModule.style.order='4';const mh=gisModule.querySelector('h2');if(mh)mh.textContent='📦 Módulo SIG: importar, plotear y exportar';}
  }
  function addStyles(){
    if(document.getElementById('final-request-style'))return;
    const s=document.createElement('style');
    s.id='final-request-style';
    s.textContent=`
      .hero-title h1{font-size:clamp(30px,3.2vw,44px)!important;color:white!important}.hero-title .byline{font-size:13px!important;font-weight:500!important;color:#e0f2fe!important;margin-left:10px!important;vertical-align:middle!important}
      #versionBox,.version-box,.hero-title p{display:none!important}
      .main{display:flex!important;flex-direction:column!important;gap:10px!important}.main>section{width:100%!important;grid-column:1/-1!important}
      .manual-top-horizontal{display:grid!important;grid-template-columns:minmax(190px,.7fr) minmax(150px,.55fr) minmax(330px,1.15fr) minmax(210px,.75fr) auto!important;gap:8px!important;align-items:end!important;padding:10px 12px!important}.manual-top-horizontal br{display:none!important}.manual-top-horizontal .tabs{margin:0!important;align-items:center!important}.manual-top-horizontal .tabs h2{margin:0!important;font-size:17px!important}.manual-top-horizontal #name,.manual-top-horizontal #coordForm,.manual-top-horizontal #notes,.manual-top-horizontal .btn{margin:0!important}.manual-top-horizontal #coordForm .row{display:grid!important;grid-template-columns:repeat(3,minmax(90px,1fr))!important;gap:6px!important}.manual-top-horizontal #coordForm .row4{display:grid!important;grid-template-columns:repeat(4,minmax(75px,1fr))!important;gap:6px!important}.manual-top-horizontal textarea{min-height:39px!important;height:39px!important;resize:vertical!important}.manual-top-horizontal input,.manual-top-horizontal select,.manual-top-horizontal textarea,.manual-top-horizontal button{font-size:12px!important;padding:8px 9px!important}.manual-top-horizontal button{height:38px!important;white-space:nowrap!important}
      .map-after-manual .map{height:60vh!important;min-height:500px!important}
      @media(max-width:1150px){.manual-top-horizontal{grid-template-columns:1fr!important}.manual-top-horizontal #coordForm .row,.manual-top-horizontal #coordForm .row4{grid-template-columns:1fr!important}.map-after-manual .map{height:58vh!important;min-height:430px!important}}
    `;
    document.head.appendChild(s);
  }
  function init(){addStyles();moveAndClean();setTimeout(moveAndClean,350);setTimeout(moveAndClean,900);setTimeout(moveAndClean,1600);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
