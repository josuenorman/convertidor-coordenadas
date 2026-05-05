// Oculta el bloque redundante 'Proyectos' de la esquina superior derecha del encabezado.
(function(){
  function hideHeaderProjects(){
    const header=document.querySelector('header.hero');
    const headerProjects=header?.querySelector(':scope > .hero-projects');
    if(headerProjects) headerProjects.style.display='none';
  }
  function addStyle(){
    if(document.getElementById('hide-header-projects-style'))return;
    const s=document.createElement('style');
    s.id='hide-header-projects-style';
    s.textContent=`
      header.hero{grid-template-columns:1fr!important;align-items:center!important;}
      header.hero>.hero-projects{display:none!important;}
      header.hero .hero-title{width:100%!important;text-align:center!important;}
      header.hero .hero-title h1{margin:0 auto!important;}
    `;
    document.head.appendChild(s);
  }
  function init(){addStyle();hideHeaderProjects();setTimeout(hideHeaderProjects,500);setTimeout(hideHeaderProjects,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
