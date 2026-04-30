// UI adicional: proyectos en encabezado, numeración, etiquetas de puntos y zoom desde tabla.
(function(){
  let selectedPointId=null;
  const $=id=>document.getElementById(id);
  const safe=v=>String(v??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

  function injectLayoutStyles(){
    if($('cc-layout-v2'))return;
    const css=`
      .hero{display:grid!important;grid-template-columns:minmax(320px,1fr) minmax(360px,520px)!important;align-items:stretch!important;gap:18px!important}.header-project-panel{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.28);border-radius:20px;padding:12px;backdrop-filter:blur(4px);color:white}.header-project-panel h3{margin:0 0 8px;font-size:16px}.header-project-panel .project-toolbar{display:flex;gap:8px;margin-bottom:8px}.header-project-panel .project-toolbar .btn{box-shadow:none;padding:8px 10px;border-radius:12px}.header-project-panel .project{background:rgba(255,255,255,.92)!important;color:#0f172a;margin-bottom:7px!important}.header-project-panel .status{background:rgba(255,255,255,.18)!important;color:white!important;margin-top:8px!important}.header-project-panel .small{display:none}.grid{grid-template-columns:1fr!important}.grid>aside.card{display:none!important}.main{grid-template-columns:minmax(290px,.8fr) minmax(320px,1.2fr)!important}.map{min-height:580px}.point-label{position:absolute;transform:translate(10px,-50%);background:rgba(255,255,255,.95);border:1px solid #bfdbfe;color:#0f172a;border-radius:8px;padding:3px 7px;font-size:11px;font-weight:800;box-shadow:0 4px 10px #0f172a22;white-space:nowrap;z-index:4;pointer-events:none}.marker.selected{background:#dc2626!important;box-shadow:0 0 0 5px rgba(220,38,38,.18),0 8px 18px #0f172a40!important}.point-row{cursor:pointer}.point-row.selected{background:#fff7ed!important;outline:2px solid #fb923c}.label-control{display:flex;align-items:center;gap:6px}.label-control select{min-width:160px}.zoom-cell button{padding:6px 9px;border-radius:10px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;font-weight:800;cursor:pointer}@media(max-width:1100px){.hero{grid-template-columns:1fr!important}.main{grid-template-columns:1fr!important}.header-project-panel{max-height:none}}
    `;
    const s=document.createElement('style');s.id='cc-layout-v2';s.textContent=css;document.head.appendChild(s);
  }

  function moveProjectsToHeader(){
    if($('headerProjectPanel'))return;
    const hero=document.querySelector('.hero');
    const projects=$('projects');
    const msgBox=$('msg');
    if(!hero||!projects||!msgBox)return;
    const panel=document.createElement('div');
    panel.id='headerProjectPanel';
    panel.className='header-project-panel';
    panel.innerHTML='<h3>Proyectos</h3>';
    panel.appendChild(projects);
    panel.appendChild(msgBox);
    const small=document.querySelector('aside .small');
    if(small)panel.appendChild(small);
    hero.appendChild(panel);
  }

  const oldRenderProjects=window.renderProjects;
  window.renderProjects=function(){
    const box=$('projects');
    if(!box)return oldRenderProjects&&oldRenderProjects();
    box.innerHTML=`<div class="project-toolbar"><button class="btn white" onclick="newProject()">+ Proyecto</button><button class="btn white" onclick="renameProject(active)">Renombrar</button></div>`+
      projects.map(p=>`<div class="project ${p.id===active?'active':''}"><button onclick="active='${p.id}';renderAll()"><span class="compact-project-name"><b>${safe(p.name)}</b><span class="project-count">${p.points.length}</span></span><span class="muted">${p.images?.length||0} imágenes · datos locales</span></button><button title="Renombrar" onclick="renameProject('${p.id}')">✏️</button></div>`).join('');
  };

  function pointNumber(p){return (pr().points.findIndex(x=>x.id===p.id)+1)||'';}
  function labelValue(p,i){
    const field=$('labelField')?.value||'numero';
    if(field==='none')return '';
    if(field==='numero')return String(pointNumber(p)||i+1);
    if(field==='nombre')return p.name||'';
    if(field==='fuente')return p.source||'';
    if(field==='zona')return p.zone?`Z${p.zone}${p.hemisphere||''}`:'';
    if(field==='notas')return p.notes||'';
    if(field==='latlon')return `${Number(p.lat).toFixed(5)}, ${Number(p.lon).toFixed(5)}`;
    return p[field]||'';
  }

  window.zoomToPoint=function(id,z=17){
    const p=pr().points.find(x=>x.id===id);
    if(!p||!Number.isFinite(Number(p.lat))||!Number.isFinite(Number(p.lon)))return msg('Ese punto no tiene coordenadas válidas.');
    selectedPointId=id;
    view.lat=Number(p.lat);view.lon=Number(p.lon);view.z=z;
    drawMap();
    if(window.renderTable)renderTable();
    msg('Zoom al punto: '+(p.name||pointNumber(p)));
  };

  window.renderTable=function(){
    const body=$('tbody'); if(!body)return;
    const q=($('search')?.value||'').toLowerCase();
    const pts=pr().points.filter(p=>JSON.stringify(p).toLowerCase().includes(q));
    const head=document.querySelector('thead tr');
    if(head&&!head.dataset.numbered){head.innerHTML='<th>N°</th><th>Nombre</th><th>Fuente</th><th>Lat</th><th>Lon</th><th>Este</th><th>Norte</th><th>Zona</th><th>Hem</th><th>Notas</th><th>Zoom</th><th></th>';head.dataset.numbered='1';}
    body.innerHTML=pts.map(p=>`<tr class="point-row ${p.id===selectedPointId?'selected':''}" onclick="zoomToPoint('${p.id}',17)">
      <td><b>${pointNumber(p)}</b></td>
      <td><input onclick="event.stopPropagation()" value="${safe(p.name)}" oninput="edit('${p.id}','name',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${safe(p.source)}" oninput="edit('${p.id}','source',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.lat,7)}" oninput="edit('${p.id}','lat',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.lon,7)}" oninput="edit('${p.id}','lon',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.easting,2)}" oninput="edit('${p.id}','easting',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.northing,2)}" oninput="edit('${p.id}','northing',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${safe(p.zone)}" oninput="edit('${p.id}','zone',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${safe(p.hemisphere||'N')}" oninput="edit('${p.id}','hemisphere',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${safe(p.notes)}" oninput="edit('${p.id}','notes',this.value)"></td>
      <td class="zoom-cell"><button onclick="event.stopPropagation();zoomToPoint('${p.id}',18)">🔎</button></td>
      <td><button class="danger" onclick="event.stopPropagation();del('${p.id}')">🗑️</button></td>
    </tr>`).join('')||'<tr><td colspan="12" style="text-align:center;padding:25px;color:#64748b">No hay coordenadas guardadas.</td></tr>';
    drawMap();
  };

  window.drawMap=function(){
    const el=$('map'); if(!el)return;
    const q=($('search')?.value||'').toLowerCase();
    const pts=pr().points.filter(p=>JSON.stringify(p).toLowerCase().includes(q)).filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon));
    const base=$('base')?.value||'osm',m=maps[base]||maps.osm,w=el.clientWidth||900,h=el.clientHeight||580,s=256,cx=tx(view.lon,view.z)*s,cy=ty(view.lat,view.z)*s,tlx=cx-w/2,tly=cy-h/2,max=2**view.z;
    let html='';
    for(let x=Math.floor(tlx/s);x<=Math.floor((tlx+w)/s);x++)for(let y=Math.floor(tly/s);y<=Math.floor((tly+h)/s);y++)if(y>=0&&y<max){let xx=((x%max)+max)%max;html+=`<img class="tile" src="${tileUrl(m.u,view.z,xx,y)}" style="left:${x*s-tlx}px;top:${y*s-tly}px">`;if(m.o)html+=`<img class="tile labeltile" src="${tileUrl(m.o,view.z,xx,y)}" style="left:${x*s-tlx}px;top:${y*s-tly}px">`}
    pts.forEach((p,i)=>{const x=tx(+p.lon,view.z)*s-tlx,y=ty(+p.lat,view.z)*s-tly,lab=safe(labelValue(p,i));html+=`<div class="marker ${p.id===selectedPointId?'selected':''}" style="left:${x}px;top:${y}px">${pointNumber(p)||i+1}</div>`;if(lab)html+=`<div class="point-label" style="left:${x}px;top:${y}px">${lab}</div>`});
    html+=`<div class="mapinfo"><b>🖐 Arrastra para mover · ${document.getElementById('captureBtn')?.textContent?.includes('activa')?'clic captura':'activa captura para guardar'}</b><br>${m.n} · zoom ${view.z}</div><div class="zoom"><button onclick="event.stopPropagation();view.z=Math.min(18,view.z+1);drawMap()">+</button><button onclick="event.stopPropagation();view.z=Math.max(3,view.z-1);drawMap()">−</button><button onclick="event.stopPropagation();overview()">⌂</button></div><div class="credit">${m.n}</div>`;
    el.innerHTML=html;
  };

  function addLabelSelector(){
    const bar=document.querySelector('.mapbar .btns'); if(!bar||$('labelField'))return;
    const div=document.createElement('div');
    div.className='label-control';
    div.innerHTML='<span class="small">Etiqueta:</span><select id="labelField"><option value="numero">N°</option><option value="nombre">Nombre</option><option value="fuente">Fuente</option><option value="zona">Zona</option><option value="latlon">Lat/Lon</option><option value="notas">Notas</option><option value="none">Sin etiqueta</option></select>';
    div.querySelector('select').onchange=drawMap;
    bar.appendChild(div);
  }

  function init(){injectLayoutStyles();moveProjectsToHeader();addLabelSelector();if(window.renderProjects)renderProjects();if(window.renderTable)renderTable();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,80));else setTimeout(init,80);
})();
