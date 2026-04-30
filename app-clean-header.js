// Limpieza del encabezado: oculta botones redundantes Nuevo proyecto / CSV.
(function(){
  function apply(){
    if(document.getElementById('cc-clean-header-style')) return;
    const css = `
      .hero-actions{display:none!important}
      .hero{grid-template-columns:minmax(460px,1fr) minmax(320px,520px)!important;align-items:start!important}
      .hero-title{padding-right:10px!important}
      .hero h1{margin-bottom:8px!important}
      .hero-projects{justify-self:stretch!important}
      @media(max-width:1100px){.hero{grid-template-columns:1fr!important}.hero-projects{width:100%!important}}
    `;
    const s=document.createElement('style');
    s.id='cc-clean-header-style';
    s.textContent=css;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
