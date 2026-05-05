// v1.15 - Módulo SIG: CSV/Excel, Shapefile ZIP, GeoJSON y CSV. Sin OCR redundante.
(function(){
  const VERSION='1.15';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

  function addStyles(){
    if($('cc-import-export-style'))return;
    const css=`
      body,.app,input,select,textarea,button,table{font-family:"Century Gothic","Aptos","Segoe UI",Arial,sans-serif!important}.module-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 6px 18px #0f172a0d;padding:14px}.module-card h2{margin:0 0 10px}.module-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.module-box{border:1px solid #dbeafe;background:#f8fbff;border-radius:16px;padding:12px}.module-box h3{font-size:15px;margin:0 0 8px;color:#1d4ed8}.module-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.module-note{font-size:12px;color:#64748b;line-height:1.35}.version-box{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);border-radius:14px;padding:9px 10px;margin-top:10px;color:white;font-size:12px;line-height:1.35}.version-box b{display:block;font-size:13px;margin-bottom:3px}.file-input{display:block;width:100%;border:1px dashed #93c5fd;border-radius:12px;background:white;padding:10px;font-size:13px}.field-map{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:8px;margin-top:8px}.field-map label{font-size:11px;color:#475569}.field-map select{margin-top:3px}.preview-table{max-height:190px;overflow:auto;border:1px solid #e2e8f0;border-radius:12px;background:white;margin-top:8px}.preview-table table{font-size:11px;min-width:720px}.module-full{grid-column:1/-1}.coord-mode{margin-top:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.coord-mode label{font-size:11px;color:#475569}@media(max-width:1000px){.module-grid,.field-map,.coord-mode{grid-template-columns:1fr}.module-full{grid-column:auto}}
    `;
    const s=document.createElement('style');s.id='cc-import-export-style';s.textContent=css;document.head.appendChild(s);
  }

  function cleanupOldSections(){
    document.querySelectorAll('section.card h2').forEach(h=>{
      if((h.textContent||'').toLowerCase().includes('captura / imagen / tabla')) h.closest('section')?.remove();
    });
  }

  function ensureVersionBox(){
    const title=document.querySelector('.hero-title');
    if(!title)return;
    const p=title.querySelector('p');
    if(p)p.textContent='Versión '+VERSION+' · Utilidades SIG para convertir coordenadas, importar tablas/SHP, plotear datos y exportar CSV/GeoJSON.';
    let box=$('versionBox');
    if(!box){box=document.createElement('div');box.id='versionBox';box.className='version-box';title.appendChild(box);}
    box.innerHTML=`<b>Versión ${VERSION} · Novedades</b>Nombre actualizado a Utilidades SIG web. Módulo para cargar CSV/Excel con selección X/Y y sistema de coordenadas; carga de Shapefile ZIP; exportación CSV y GeoJSON.`;
  }

  function ensureModule(){
    const main=document.querySelector('main.main');
    if(!main||$('gisModule'))return;
    const section=document.createElement('section');
    section.id='gisModule';
    section.className='module-card full';
    section.innerHTML=`
      <h2>📦 Módulo SIG v${VERSION}: importar, plotear y exportar</h2>
      <div class="module-grid">
        <div class="module-box">
          <h3>1. Cargar CSV o Excel</h3>
          <p class="module-note">Carga .csv, .xlsx o .xls. Selecciona campos X/Y y el sistema de coordenadas que corresponda.</p>
          <input id="tableFile" class="file-input" type="file" accept=".csv,.xlsx,.xls" onchange="handleTableFile(this.files[0])">
          <div class="coord-mode">
            <label>Sistema<select id="coordSystem" onchange="renderFieldMap(previewRows)"><option value="geo">Geográficas: X=Longitud, Y=Latitud</option><option value="utm">UTM WGS84 Nicaragua</option></select></label>
            <label>Zona UTM<select id="defaultZone"><option value="16">Zona 16N</option><option value="17">Zona 17N</option></select></label>
            <label>Hemisferio<select id="defaultHem"><option value="N">Norte</option><option value="S">Sur</option></select></label>
          </div>
          <div id="tableFieldMap" class="field-map"></div>
          <div class="module-actions"><button class="btn" onclick="importPreviewRows()">Plotear tabla</button><button class="btn out" onclick="clearImportPreview()">Limpiar vista previa</button></div>
          <div id="importPreview" class="preview-table"></div>
        </div>
        <div class="module-box">
          <h3>2. Cargar Shapefile</h3>
          <p class="module-note">Sube un .zip con .shp, .shx, .dbf y .prj. Se reconocen campos, se crea la tabla editable y se plotean los datos.</p>
          <input id="shapeFile" class="file-input" type="file" accept=".zip" onchange="handleShapeZip(this.files[0])">
          <div class="module-actions"><button class="btn out" onclick="document.getElementById('shapeFile').value='';">Limpiar archivo</button></div>
          <p class="module-note">Para mejor resultado, usa shapefiles en WGS84 o con .prj incluido.</p>
        </div>
        <div class="module-box module-full">
          <h3>3. Exportar para QGIS</h3>
          <p class="module-note">Exporta el proyecto activo en formatos ligeros y eficientes: CSV o GeoJSON.</p>
          <div class="module-actions">
            <button class="btn green" onclick="exportCsv(false)">Exportar CSV</button>
            <button class="btn green" onclick="exportProjectGeoJSON()">Exportar GeoJSON</button>
          </div>
        </div>
      </div>`;
    const firstFull=[...main.children].find(x=>x.classList?.contains('full'));
    if(firstFull) main.insertBefore(section,firstFull); else main.appendChild(section);
  }

  function loadScript(src){return new Promise((resolve,reject)=>{if([...document.scripts].some(s=>s.src.includes(src)))return resolve();const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
  function parseCsv(text){
    const rows=[];let row=[],cur='',q=false;
    for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cur+='"';i++;continue}if(c==='"'){q=!q;continue}if((c===','||c===';'||c==='\t')&&!q){row.push(cur.trim());cur='';continue}if((c==='\n'||c==='\r')&&!q){if(cur||row.length){row.push(cur.trim());rows.push(row);row=[];cur=''}continue}cur+=c}if(cur||row.length){row.push(cur.trim());rows.push(row)}if(!rows.length)return[];const headers=rows[0].map(h=>String(h||'').trim());return rows.slice(1).filter(r=>r.some(v=>String(v).trim())).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
  }
  function normalizeName(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
  function guessField(headers,patterns){return headers.find(h=>patterns.some(p=>normalizeName(h).includes(p)))||'';}
  function num(v){const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null;}

  window.previewRows=[];
  window.clearImportPreview=function(){window.previewRows=[];$('importPreview').innerHTML='';$('tableFieldMap').innerHTML='';msg('Vista previa de importación limpia.')};

  window.renderFieldMap=function(rows){
    rows=rows||window.previewRows||[]; if(!rows.length||!$('tableFieldMap'))return;
    const headers=Object.keys(rows[0]||{});
    const opt='<option value="">--</option>'+headers.map(h=>`<option value="${esc(h)}">${esc(h)}</option>`).join('');
    const name=guessField(headers,['nombre','name','sitio','punto','codigo','id']);
    const x=guessField(headers,['longitud','longitude','lon','x','este','easting']);
    const y=guessField(headers,['latitud','latitude','lat','y','norte','northing']);
    const zone=guessField(headers,['zona','zone','utmzona']);
    const notes=guessField(headers,['nota','observacion','descripcion','comunidad']);
    $('tableFieldMap').innerHTML=`
      <label>Nombre<select id="fmName">${opt}</select></label>
      <label>X / Longitud / Este<select id="fmX">${opt}</select></label>
      <label>Y / Latitud / Norte<select id="fmY">${opt}</select></label>
      <label>Zona del archivo<select id="fmZone">${opt}</select></label>
      <label>Notas<select id="fmNotes">${opt}</select></label>`;
    const set=(id,val)=>{if($(id)&&val)$(id).value=val}; set('fmName',name);set('fmX',x);set('fmY',y);set('fmZone',zone);set('fmNotes',notes);
  };
  function renderPreview(rows){const headers=Object.keys(rows[0]||{}).slice(0,12);$('importPreview').innerHTML=`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,8).map(r=>`<tr>${headers.map(h=>`<td>${esc(r[h])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}

  window.handleTableFile=async function(file){
    if(!file)return;try{msg('Leyendo archivo: '+file.name+' ...');const ext=file.name.split('.').pop().toLowerCase();if(ext==='csv'){window.previewRows=parseCsv(await file.text())}else{await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');const buf=await file.arrayBuffer();const wb=XLSX.read(buf,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];window.previewRows=XLSX.utils.sheet_to_json(ws,{defval:''})}if(!window.previewRows.length){msg('No se encontraron filas válidas.');return}renderFieldMap(window.previewRows);renderPreview(window.previewRows);msg('Archivo leído: '+window.previewRows.length+' fila(s). Selecciona X/Y y pulsa Plotear tabla.')}catch(e){msg('No se pudo leer el archivo. Revisa formato CSV/Excel.')}
  };
  function rowToPoint(row,i){
    const get=id=>$(id)?.value?row[$(id).value]:'';const name=get('fmName')||('Importado '+(i+1));const notes=get('fmNotes')||'Importado desde tabla';const x=num(get('fmX')),y=num(get('fmY'));if(x===null||y===null)return null;const sys=$('coordSystem')?.value||'geo';
    if(sys==='geo'){const lon=x,lat=y;if(Math.abs(lat)<=90&&Math.abs(lon)<=180)return{name,lat,lon,...ll2utm(lat,lon),source:'CSV/Excel',inputType:'Tabla geográfica',notes};return null;}
    let z=num(get('fmZone'))||num($('defaultZone')?.value)||16;if(![16,17].includes(Number(z)))z=16;const h=$('defaultHem')?.value||'N';const ll=utm2ll(x,y,z,h);return{name,lat:ll.lat,lon:ll.lon,easting:x,northing:y,zone:z,hemisphere:h,source:'CSV/Excel',inputType:'Tabla UTM',notes};
  }
  window.importPreviewRows=function(){if(!window.previewRows.length)return msg('Primero carga un CSV o Excel.');const points=window.previewRows.map(rowToPoint).filter(Boolean);if(!points.length)return msg('No se detectaron coordenadas. Revisa X/Y y sistema de coordenadas.');if(typeof addMany==='function')addMany(points);else{const p=pr();points.reverse().forEach(o=>p.points.unshift({id:crypto.randomUUID(),...o}));save();renderAll()}msg(points.length+' punto(s) importado(s), ploteado(s) y disponibles en la tabla editable.')};

  window.handleShapeZip=async function(file){
    if(!file)return;try{msg('Leyendo Shapefile ZIP...');await loadScript('https://cdn.jsdelivr.net/npm/shpjs@latest/dist/shp.min.js');const gj=await shp(await file.arrayBuffer());const features=(gj.type==='FeatureCollection'?gj.features:(Array.isArray(gj)?gj.flatMap(g=>g.features||[]):[]));const points=[];features.forEach((f,i)=>{const geom=f.geometry;if(!geom)return;let coords=null;if(geom.type==='Point')coords=geom.coordinates;if(geom.type==='MultiPoint')coords=geom.coordinates[0];if(!coords&&geom.type==='Polygon')coords=geom.coordinates?.[0]?.[0];if(!coords&&geom.type==='LineString')coords=geom.coordinates?.[0];if(coords&&Number.isFinite(coords[0])&&Number.isFinite(coords[1])){const lon=coords[0],lat=coords[1];if(Math.abs(lat)<=90&&Math.abs(lon)<=180){points.push({name:f.properties?.name||f.properties?.Nombre||f.properties?.nombre||f.properties?.NOMBRE||('SHP '+(i+1)),lat,lon,...ll2utm(lat,lon),source:'Shapefile',inputType:geom.type,notes:JSON.stringify(f.properties||{})})}}});if(!points.length)return msg('No se detectaron geometrías válidas en WGS84. Verifica .prj o usa GeoJSON/CSV.');if(typeof addMany==='function')addMany(points);else{const p=pr();points.reverse().forEach(o=>p.points.unshift({id:crypto.randomUUID(),...o}));save();renderAll()}msg(points.length+' geometría(s) importada(s), ploteada(s) y disponibles en la tabla editable.')}catch(e){msg('No se pudo leer el Shapefile ZIP. Verifica que contenga .shp, .shx, .dbf y .prj.')}
  };
  function projectGeoJSON(){return{type:'FeatureCollection',name:pr().name,features:pr().points.filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon)).map((p,i)=>({type:'Feature',properties:{numero:i+1,nombre:p.name||'',fuente:p.source||'',este_utm:p.easting||'',norte_utm:p.northing||'',zona:p.zone||'',hemisferio:p.hemisphere||'',notas:p.notes||''},geometry:{type:'Point',coordinates:[+p.lon,+p.lat]}}))}}
  function downloadBlob(name,blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
  window.exportProjectGeoJSON=function(){const gj=projectGeoJSON();downloadBlob(pr().name.replaceAll(' ','_')+'.geojson',new Blob([JSON.stringify(gj,null,2)],{type:'application/geo+json'}));msg('GeoJSON exportado.')};

  function init(){addStyles();cleanupOldSections();ensureVersionBox();ensureModule();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,350));else setTimeout(init,350);
})();
