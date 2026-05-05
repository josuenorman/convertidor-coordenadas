// v1.15 - Optimización de distribución visual y módulos.
(function(){
  function addLayoutStyles(){
    if(document.getElementById('cc-layout-v115')) return;
    const css = `
      body,.app,input,select,textarea,button,table{font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important}
      .app{padding:10px!important}.wrap{max-width:1760px!important}.hero{min-height:0!important;padding:14px 18px!important;border-radius:20px!important;display:grid!important;grid-template-columns:minmax(360px,1fr) minmax(330px,520px)!important;gap:14px!important;align-items:start!important}.hero-title h1{font-size:clamp(28px,3vw,44px)!important;line-height:1!important;margin:0 0 6px!important}.hero-title p{font-size:13px!important;line-height:1.25!important;margin:0!important;max-width:760px!important}.version-box{margin-top:8px!important;padding:7px 9px!important;font-size:11px!important;line-height:1.22!important}.version-box b{font-size:12px!important}.hero-projects{max-height:150px!important;padding:9px!important}.project-header-row{margin-bottom:5px!important}.projects-inline{gap:5px!important}.projects-inline .project-toolbar{margin-bottom:3px!important}.projects-inline .project-toolbar .btn{padding:5px 8px!important;font-size:11px!important}.projects-inline .project{padding:6px 8px!important;border-radius:11px!important}.hero-actions{display:none!important}.grid.workspace-grid{margin-top:10px!important;grid-template-columns:1fr!important}.main{display:grid!important;grid-template-columns:minmax(270px,.72fr) minmax(420px,1.28fr)!important;gap:10px!important}.card,.module-card{border-radius:16px!important}.card.pad,.module-card{padding:12px!important}.card h2,.module-card h2{font-size:18px!important;margin:0 0 8px!important}.tabs{gap:8px!important}.tabs select{max-width:260px!important}textarea{min-height:64px!important}.module-card{grid-column:1/-1!important}.module-grid{display:grid!important;grid-template-columns:minmax(360px,.95fr) minmax(360px,1.05fr)!important;gap:10px!important}.module-box{padding:10px!important}.module-box h3{font-size:14px!important}.module-note{font-size:11px!important;margin:4px 0!important}.coord-mode,.field-map{gap:6px!important}.preview-table{max-height:145px!important}.map{height:56vh!important;min-height:460px!important}.mapbar{gap:8px!important}.mapbar h2{margin:0!important}.mapbar .btns{gap:6px!important}.mapbar input,.mapbar select{padding:7px 9px!important;font-size:12px!important}.label-control select{min-width:120px!important}.export{padding:10px!important}.export h2{font-size:17px!important}.export p{font-size:12px!important}.tablewrap{max-height:42vh!important}table{font-size:11px!important}th{padding:7px!important}td{padding:5px!important}td input,td select{padding:6px!important;font-size:11px!important}.module-full{grid-column:1/-1!important}
      @media(min-width:1200px){
        #gisModule{grid-column:1/-1!important;order:1}.main>section.card:nth-of-type(1){order:2}.main>section.card.full:nth-of-type(1){order:3}.main>section.card.full:nth-of-type(2){order:4}.main{grid-template-columns:minmax(330px,.55fr) minmax(620px,1.45fr)!important}#gisModule+.card{align-self:start}.module-grid{grid-template-columns:minmax(360px,1fr) minmax(360px,1fr) minmax(300px,.75fr)!important}.module-box.module-full{grid-column:auto!important}.module-box.module-full .module-actions{flex-direction:column!important}.map{height:58vh!important;min-height:500px!important}
      }
      @media(max-width:1100px){.hero{grid-template-columns:1fr!important}.hero-projects{max-height:none!important}.main,.module-grid{grid-template-columns:1fr!important}.map{height:55vh!important;min-height:420px!important}.tablewrap{max-height:50vh!important}}
    `;
    const s=document.createElement('style');s.id='cc-layout-v115';s.textContent=css;document.head.appendChild(s);
  }

  function compactModuleTexts(){
    const title=document.querySelector('.hero-title h1');
    if(title) title.textContent='Utilidades SIG web';
    const p=document.querySelector('.hero-title p');
    if(p) p.textContent='Versión 1.15 · Conversión, captura, importación de tablas/SHP, ploteo y exportación CSV/GeoJSON para trabajo SIG.';
    const module=document.getElementById('gisModule');
    if(module){
      const h=module.querySelector('h2');
      if(h) h.textContent='📦 Módulo SIG: importar, plotear y exportar';
    }
  }

  function init(){
    addLayoutStyles();
    compactModuleTexts();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,450)); else setTimeout(init,450);
})();
