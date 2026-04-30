// Ajuste final de interfaz: proyectos compactos, eliminar proyecto, deseleccionar punto y botones superiores pequeños.
(function(){
  let selectedIdFinal = null;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

  function addFinalStyles(){
    if($('cc-final-style')) return;
    const css = `
      .hero{display:grid!important;grid-template-columns:minmax(420px,1fr) minmax(320px,440px) auto!important;gap:14px!important;align-items:start!important;padding:18px 22px!important}.hero h1{font-size:clamp(30px,4vw,48px)!important;line-height:1!important}.hero p{font-size:15px!important;max-width:760px!important}.hero-actions{align-self:start!important}.hero-actions .btn{padding:7px 10px!important;border-radius:12px!important;font-size:12px!important;box-shadow:none!important}.hero-projects{background:rgba(255,255,255,.14)!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:16px!important;padding:10px!important;max-height:185px!important;overflow:auto!important}.project-header-row{display:flex!important;justify-content:space-between!important;gap:8px!important;align-items:center!important;margin-bottom:7px!important}.project-header-row strong{font-size:14px!important;color:white!important}.hero-status{font-size:11px!important;line-height:1.2!important;padding:6px 8px!important;margin:0!important;background:rgba(255,255,255,.14)!important;color:white!important;max-width:220px!important}.projects-inline{display:flex!important;flex-direction:column!important;gap:6px!important}.projects-inline .project-toolbar{display:flex!important;gap:6px!important;margin-bottom:4px!important}.projects-inline .project-toolbar .btn{padding:6px 8px!important;border-radius:10px!important;font-size:11px!important;box-shadow:none!important}.projects-inline .project{display:grid!important;grid-template-columns:1fr auto auto!important;align-items:center!important;gap:6px!important;background:rgba(255,255,255,.93)!important;color:#0f172a!important;border:1px solid rgba(255,255,255,.6)!important;border-radius:12px!important;padding:7px 8px!important;margin:0!important}.projects-inline .project.active{outline:2px solid #bfdbfe!important}.projects-inline .project button{background:transparent!important;border:0!important;cursor:pointer!important}.project-main-btn{text-align:left!important;min-width:0!important}.project-name-line{display:flex!important;align-items:center!important;gap:8px!important;justify-content:space-between!important}.project-name-line b{font-size:13px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.project-count{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:22px!important;height:20px!important;border-radius:999px!important;background:#dbeafe!important;color:#1d4ed8!important;font-size:11px!important;font-weight:800!important}.project-sub{display:block!important;font-size:10px!important;color:#64748b!important;margin-top:1px!important}.mini-project-icon{width:24px!important;height:24px!important;border-radius:8px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;color:#475569!important}.mini-project-icon:hover{background:#eff6ff!important;color:#1d4ed8!important}.mini-project-icon.delete:hover{background:#fee2e2!important;color:#dc2626!important}.grid.workspace-grid{grid-template-columns:1fr!important}.grid>aside.card{display:none!important}.point-row.selected{background:#fff7ed!important;outline:2px solid #fb923c!important}.marker.selected{background:#dc2626!important;box-shadow:0 0 0 5px rgba(220,38,38,.18),0 8px 18px #0f172a40!important}.point-label{position:absolute;transform:translate(10px,-50%);background:rgba(255,255,255,.95);border:1px solid #bfdbfe;color:#0f172a;border-radius:8px;padding:3px 7px;font-size:11px;font-weight:800;box-shadow:0 4px 10px #0f172a22;white-space:nowrap;z-index:4;pointer-events:none}.label-control,.selection-control{display:flex!important;align-items:center!important;gap:6px!important}.selection-control .btn{padding:7px 9px!important;font-size:12px!important}.zoom-cell button{padding:6px 9px;border-radius:10px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;font-weight:800;cursor:pointer}@media(max-width:1100px){.hero{grid-template-columns:1fr!important}.hero-projects{max-height:none!important}.hero-actions{justify-self:start!important}}
    `;
    const s=document.createElement('style');s.id='cc-final-style';s.textContent=css;document.head.appendChild(s);
  }

  window.deleteProject = function(id){
    if(projects.length <= 1){ msg('Debe quedar al menos un proyecto.'); return; }
    const deletedActive = active === id;
    projects = projects.filter(p => p.id !== id);
    if(deletedActive) active = projects[0].id;
    save();
    if(window.renderAll) renderAll();
    msg('Proyecto eliminado.');
  };

  window.deselectPoint = function(){
    selectedIdFinal = null;
    drawMap();
    if(window.renderTable) renderTable();
    msg('Punto deseleccionado.');
  };

  // La app guarda los puntos nuevos al inicio del arreglo. Para que N° represente el orden real de captura,
  // se calcula de forma inversa: el primer punto capturado conserva N° 1, el segundo N° 2, etc.
  function pointNo(p){
    const points = pr().points;
    const idx = points.findIndex(x => x.id === p.id);
    return idx >= 0 ? points.length - idx : '';
  }
  function labelFor(p,i){
    const field = $('labelField')?.value || 'numero';
    if(field === 'none') return '';
    if(field === 'numero') return String(pointNo(p) || i + 1);
    if(field === 'nombre') return p.name || '';
    if(field === 'fuente') return p.source || '';
    if(field === 'zona') return p.zone ? `Z${p.zone}${p.hemisphere || ''}` : '';
    if(field === 'latlon') return `${Number(p.lat).toFixed(5)}, ${Number(p.lon).toFixed(5)}`;
    if(field === 'notas') return p.notes || '';
    return p[field] || '';
  }

  window.renderProjects = function(){
    const box = $('projects'); if(!box) return;
    box.innerHTML = `<div class="project-toolbar"><button class="btn white" onclick="newProject()">+ Crear</button><button class="btn white" onclick="renameProject(active)">Renombrar</button></div>` +
      projects.map(p => `<div class="project ${p.id===active?'active':''}">
        <button class="project-main-btn" onclick="active='${p.id}';renderAll()"><span class="project-name-line"><b>${esc(p.name)}</b><span class="project-count">${p.points.length}</span></span><span class="project-sub">${p.images?.length||0} imágenes · datos locales</span></button>
        <button class="mini-project-icon" title="Renombrar" onclick="renameProject('${p.id}')">✏️</button>
        <button class="mini-project-icon delete" title="Eliminar" onclick="deleteProject('${p.id}')">🗑️</button>
      </div>`).join('');
  };

  window.zoomToPoint = function(id,z=17){
    const p = pr().points.find(x => x.id === id);
    if(!p || !Number.isFinite(Number(p.lat)) || !Number.isFinite(Number(p.lon))){ msg('Ese punto no tiene coordenadas válidas.'); return; }
    selectedIdFinal = id;
    view.lat = Number(p.lat); view.lon = Number(p.lon); view.z = z;
    drawMap();
    if(window.renderTable) renderTable();
    msg('Zoom al punto: ' + (p.name || pointNo(p)));
  };

  window.renderTable = function(){
    const body = $('tbody'); if(!body) return;
    const q = ($('search')?.value || '').toLowerCase();
    const pts = pr().points.filter(p => JSON.stringify(p).toLowerCase().includes(q));
    const head = document.querySelector('thead tr');
    if(head) head.innerHTML = '<th>N°</th><th>Nombre</th><th>Fuente</th><th>Lat</th><th>Lon</th><th>Este</th><th>Norte</th><th>Zona</th><th>Hem</th><th>Notas</th><th>Zoom</th><th></th>';
    body.innerHTML = pts.map(p => `<tr class="point-row ${p.id===selectedIdFinal?'selected':''}" onclick="zoomToPoint('${p.id}',17)">
      <td><b>${pointNo(p)}</b></td>
      <td><input onclick="event.stopPropagation()" value="${esc(p.name)}" oninput="edit('${p.id}','name',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${esc(p.source)}" oninput="edit('${p.id}','source',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.lat,7)}" oninput="edit('${p.id}','lat',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.lon,7)}" oninput="edit('${p.id}','lon',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.easting,2)}" oninput="edit('${p.id}','easting',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${fix(p.northing,2)}" oninput="edit('${p.id}','northing',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${esc(p.zone)}" oninput="edit('${p.id}','zone',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${esc(p.hemisphere || 'N')}" oninput="edit('${p.id}','hemisphere',this.value)"></td>
      <td><input onclick="event.stopPropagation()" value="${esc(p.notes)}" oninput="edit('${p.id}','notes',this.value)"></td>
      <td class="zoom-cell"><button onclick="event.stopPropagation();zoomToPoint('${p.id}',18)">🔎</button></td>
      <td><button class="danger" onclick="event.stopPropagation();del('${p.id}')">🗑️</button></td>
    </tr>`).join('') || '<tr><td colspan="12" style="text-align:center;padding:25px;color:#64748b">No hay coordenadas guardadas.</td></tr>';
    drawMap();
  };

  window.drawMap = function(){
    const el = $('map'); if(!el) return;
    const q = ($('search')?.value || '').toLowerCase();
    const pts = pr().points.filter(p => JSON.stringify(p).toLowerCase().includes(q)).filter(p => Number.isFinite(+p.lat) && Number.isFinite(+p.lon));
    const base = $('base')?.value || 'osm', m = maps[base] || maps.osm, w = el.clientWidth || 900, h = el.clientHeight || 580, s = 256, cx = tx(view.lon,view.z)*s, cy = ty(view.lat,view.z)*s, tlx = cx - w/2, tly = cy - h/2, max = 2**view.z;
    let html = '';
    for(let x=Math.floor(tlx/s); x<=Math.floor((tlx+w)/s); x++) for(let y=Math.floor(tly/s); y<=Math.floor((tly+h)/s); y++) if(y>=0 && y<max){ let xx=((x%max)+max)%max; html += `<img class="tile" src="${tileUrl(m.u,view.z,xx,y)}" style="left:${x*s-tlx}px;top:${y*s-tly}px">`; if(m.o) html += `<img class="tile labeltile" src="${tileUrl(m.o,view.z,xx,y)}" style="left:${x*s-tlx}px;top:${y*s-tly}px">`; }
    pts.forEach((p,i) => { const x = tx(+p.lon,view.z)*s - tlx, y = ty(+p.lat,view.z)*s - tly, lab = esc(labelFor(p,i)); html += `<div class="marker ${p.id===selectedIdFinal?'selected':''}" style="left:${x}px;top:${y}px">${pointNo(p) || i+1}</div>`; if(lab) html += `<div class="point-label" style="left:${x}px;top:${y}px">${lab}</div>`; });
    html += `<div class="mapinfo"><b>🖐 Arrastra para mover · ${document.getElementById('captureBtn')?.textContent?.includes('activa')?'clic captura':'activa captura para guardar'}</b><br>${m.n} · zoom ${view.z}</div><div class="zoom"><button onclick="event.stopPropagation();view.z=Math.min(18,view.z+1);drawMap()">+</button><button onclick="event.stopPropagation();view.z=Math.max(3,view.z-1);drawMap()">−</button><button onclick="event.stopPropagation();overview()">⌂</button></div><div class="credit">${m.n}</div>`;
    el.innerHTML = html;
  };

  function ensureControls(){
    const bar = document.querySelector('.mapbar .btns'); if(!bar) return;
    if(!$('labelField')){ const d=document.createElement('div'); d.className='label-control'; d.innerHTML='<span class="small">Etiqueta:</span><select id="labelField"><option value="numero">N°</option><option value="nombre">Nombre</option><option value="fuente">Fuente</option><option value="zona">Zona</option><option value="latlon">Lat/Lon</option><option value="notas">Notas</option><option value="none">Sin etiqueta</option></select>'; d.querySelector('select').onchange=drawMap; bar.appendChild(d); }
    if(!$('deselectPointBtn')){ const d=document.createElement('div'); d.className='selection-control'; d.innerHTML='<button id="deselectPointBtn" class="btn out" onclick="deselectPoint()">Quitar selección</button>'; bar.appendChild(d); }
  }

  function init(){ addFinalStyles(); ensureControls(); if(window.renderProjects) renderProjects(); if(window.renderTable) renderTable(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init,120)); else setTimeout(init,120);
})();
