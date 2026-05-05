// v1.17 - Branding centrado, chips de módulos y paleta profesional.
(function(){
  const VERSION='1.17';
  const $=id=>document.getElementById(id);

  function addStyles(){
    if($('cc-design-v117')) return;
    const css=`
      :root{--bg:#f3f7fa;--card:#ffffff;--ink:#152238;--muted:#617083;--primary:#0b4f71;--primary2:#0e7490;--accent:#14b8a6;--accent2:#0f766e;--line:#d7e3ec;--soft:#eef7fb;--soft2:#f8fbfd;}
      body{background:var(--bg)!important;color:var(--ink)!important}body,.app,input,select,textarea,button,table{font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important}.app{padding:10px!important}.wrap{max-width:1780px!important}
      .hero{display:block!important;background:linear-gradient(180deg,#ffffff 0%,#f7fbfd 100%)!important;border:1px solid var(--line)!important;border-radius:24px!important;box-shadow:0 14px 34px rgba(11,79,113,.10)!important;padding:18px 20px 16px!important;color:var(--ink)!important;position:relative!important;overflow:visible!important}.hero:before{content:""!important;position:absolute!important;left:22px!important;right:22px!important;top:0!important;height:5px!important;width:auto!important;background:linear-gradient(90deg,var(--primary),var(--accent))!important;border-radius:0 0 999px 999px!important}.hero-title{text-align:center!important;padding:0!important;max-width:980px!important;margin:0 auto 12px!important}.hero-title h1{font-size:clamp(30px,3.4vw,48px)!important;line-height:1.05!important;margin:0!important;color:var(--primary)!important;letter-spacing:-.04em!important}.hero-title h1:after{content:""!important}.byline{font-size:13px!important;font-weight:700!important;color:#0f172a!important;letter-spacing:0!important;margin-left:8px!important;vertical-align:middle!important}.hero-title p{font-size:13px!important;line-height:1.35!important;color:#475569!important;margin:8px auto 0!important;max-width:780px!important}.version-box{background:#ecfeff!important;color:#155e75!important;border:1px solid #a5f3fc!important;border-radius:999px!important;padding:7px 12px!important;margin:10px auto 0!important;font-size:11px!important;line-height:1.2!important;max-width:max-content!important}.version-box b{display:inline!important;color:var(--primary)!important;margin-right:6px!important}.hero-projects{background:#ffffff!important;border:1px solid var(--line)!important;border-radius:18px!important;box-shadow:0 8px 22px rgba(11,79,113,.08)!important;padding:10px!important;max-height:160px!important;overflow:auto!important;margin:10px auto 0!important;max-width:980px!important}.project-header-row strong{color:var(--primary)!important}.hero-status{background:#f1f5f9!important;color:#475569!important}.hero-actions{display:none!important}
      .module-tabs{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin:14px auto 2px!important;max-width:1080px}.module-chip{border:1px solid #b8d7e5;background:linear-gradient(180deg,#ffffff,#edf8fb);color:var(--primary);border-radius:999px;padding:10px 16px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 8px 18px rgba(11,79,113,.08);transition:.15s}.module-chip:hover{transform:translateY(-1px);background:linear-gradient(180deg,#ffffff,#dff7f5);border-color:#5eead4;color:#0f766e}.module-chip.active{background:linear-gradient(135deg,var(--primary),var(--primary2));color:white;border-color:transparent}.module-chip small{display:inline-block;font-size:10px;font-weight:700;opacity:.85;margin-left:4px}
      .grid.workspace-grid{margin-top:12px!important;display:block!important}.main{display:grid!important;grid-template-columns:minmax(310px,.55fr) minmax(630px,1.45fr)!important;grid-template-areas:"tools tools" "manual table" "map map"!important;gap:12px!important}.card,.module-card{border:1px solid var(--line)!important;border-radius:20px!important;background:var(--card)!important;box-shadow:0 10px 26px rgba(21,34,56,.06)!important}.card.pad,.module-card{padding:14px!important}.card h2,.module-card h2{font-size:18px!important;color:var(--primary)!important;margin:0 0 10px!important}.main>section.card:not(.full){grid-area:manual!important}#gisModule{grid-area:tools!important}.main>section.card.full:nth-of-type(2){grid-area:table!important}.main>section.card.full:nth-of-type(1){grid-area:map!important}
      #gisModule h2{color:var(--primary)!important}#gisModule h2:after{content:"Selecciona datos, revisa tabla, visualiza y exporta"!important;font-size:11px!important;color:var(--muted)!important;margin-left:auto!important}.module-grid{grid-template-columns:1.3fr 1fr .75fr!important;gap:10px!important}.module-box{background:linear-gradient(180deg,#ffffff,#f8fbfd)!important;border:1px solid var(--line)!important;border-radius:18px!important}.module-box h3{color:var(--primary)!important}.btn:not(.white):not(.out){background:var(--primary)!important}.btn.green{background:var(--accent2)!important}.btn.out,.btn.white{background:#fff!important;color:var(--ink)!important;border:1px solid #cbd5e1!important;box-shadow:none!important}.file-input{background:#f8fafc!important;border-color:#8bd5e6!important}.export{background:linear-gradient(90deg,#ecfdf5,#ecfeff)!important;border-color:#99f6e4!important}.export h2{color:#065f46!important}.mapbar h2{color:var(--primary)!important}.map{border-radius:18px!important;border-color:var(--line)!important;min-height:540px!important;height:62vh!important}.tablewrap{border-color:var(--line)!important}th{background:#eef6fa!important;color:#334155!important}.point-row.selected{background:#fff7ed!important}.marker.selected{background:#dc2626!important}
      .projects-inline .project-toolbar .btn{background:linear-gradient(135deg,var(--primary),var(--primary2))!important;color:white!important;border:0!important}.projects-inline .project{background:#f8fafc!important;border:1px solid #dbeafe!important}.projects-inline .project.active{background:#eff6ff!important;outline:2px solid #7dd3fc!important}.mini-project-icon:hover{background:#e0f2fe!important;color:var(--primary)!important}.mini-project-icon.delete:hover{background:#fee2e2!important;color:#dc2626!important}
      @media(max-width:1280px){.main{grid-template-columns:1fr!important;grid-template-areas:"tools" "manual" "table" "map"!important}.module-grid{grid-template-columns:1fr!important}.map{height:58vh!important;min-height:460px!important}.hero-projects{max-width:none!important}}
      @media(max-width:760px){.hero-title h1{font-size:30px!important}.byline{display:block!important;margin:4px 0 0!important}.module-chip{width:100%;justify-content:center;text-align:center}.map{height:55vh!important;min-height:390px!important}}
    `;
    const s=document.createElement('style');s.id='cc-design-v117';s.textContent=css;document.head.appendChild(s);
  }

  function ensureTabs(){
    const hero=document.querySelector('.hero');
    if(!hero || $('moduleTabs')) return;
    const tabs=document.createElement('nav');
    tabs.id='moduleTabs';
    tabs.className='module-tabs';
    tabs.innerHTML=`
      <button class="module-chip" data-target="manual">Ingreso manual</button>
      <button class="module-chip" data-target="csv">CSV / Excel</button>
      <button class="module-chip" data-target="shp">Shapefile</button>
      <button class="module-chip" data-target="export">Exportar</button>`;
    hero.appendChild(tabs);
    tabs.querySelectorAll('.module-chip').forEach(btn=>{
      btn.addEventListener('click',()=>{
        tabs.querySelectorAll('.module-chip').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const t=btn.dataset.target;
        let el=null;
        if(t==='manual') el=document.querySelector('.main>section.card:not(.full)');
        if(t==='csv') el=document.querySelector('#gisModule .module-box:nth-child(1)');
        if(t==='shp') el=document.querySelector('#gisModule .module-box:nth-child(2)');
        if(t==='export') el=document.querySelector('#gisModule .module-box:nth-child(3), #gisModule .module-full');
        el?.scrollIntoView({behavior:'smooth',block:'center'});
      });
    });
  }

  function relabel(){
    document.title='Utilidades SIG Web v'+VERSION;
    const h=document.querySelector('.hero-title h1');
    if(h) h.innerHTML='Utilidades SIG Web <span class="byline">by Norman García</span>';
    const p=document.querySelector('.hero-title p');
    if(p) p.textContent='Herramientas web para convertir coordenadas, importar tablas y Shapefiles, editar datos, visualizar en mapa y exportar para QGIS.';
    const v=$('versionBox');
    if(v) v.innerHTML='<b>Versión '+VERSION+' · Rediseño visual</b> Módulos tipo chips, título centrado, colores profesionales y mejor organización del flujo SIG.';
    const module=$('gisModule');
    if(module){
      const h2=module.querySelector('h2'); if(h2) h2.textContent='Herramientas de carga y exportación SIG';
      const boxes=module.querySelectorAll('.module-box h3');
      if(boxes[0]) boxes[0].textContent='CSV / Excel';
      if(boxes[1]) boxes[1].textContent='Shapefile';
      if(boxes[2]) boxes[2].textContent='Exportar';
    }
  }

  function init(){addStyles();ensureTabs();setTimeout(relabel,100);setTimeout(()=>{ensureTabs();relabel();},700)}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
