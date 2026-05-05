// v1.14 - Módulo de importación/exportación SIG: CSV, Excel, Shapefile ZIP, GeoJSON y SHP.
(function(){
  const VERSION='1.14';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

  function addStyles(){
    if($('cc-import-export-style'))return;
    const css=`
      .module-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 6px 18px #0f172a0d;padding:14px}.module-card h2{margin:0 0 10px}.module-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.module-box{border:1px solid #dbeafe;background:#f8fbff;border-radius:16px;padding:12px}.module-box h3{font-size:15px;margin:0 0 8px;color:#1d4ed8}.module-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.module-note{font-size:12px;color:#64748b;line-height:1.35}.version-box{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);border-radius:14px;padding:9px 10px;margin-top:10px;color:white;font-size:12px;line-height:1.35}.version-box b{display:block;font-size:13px;margin-bottom:3px}.file-input{display:block;width:100%;border:1px dashed #93c5fd;border-radius:12px;background:white;padding:10px;font-size:13px}.field-map{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:8px;margin-top:8px}.field-map label{font-size:11px;color:#475569}.field-map select{margin-top:3px}.preview-table{max-height:190px;overflow:auto;border:1px solid #e2e8f0;border-radius:12px;background:white;margin-top:8px}.preview-table table{font-size:11px;min-width:720px}.module-full{grid-column:1/-1}.gpkg-disabled{opacity:.72}@media(max-width:1000px){.module-grid,.field-map{grid-template-columns:1fr}.module-full{grid-column:auto}}
    `;
    const s=document.createElement('style');s.id='cc-import-export-style';s.textContent=css;document.head.appendChild(s);
  }

  function ensureVersionBox(){
    const title=document.querySelector('.hero-title');
    if(!title||$('versionBox'))return;
    const box=document.createElement('div');
    box.id='versionBox';
    box.className='version-box';
    box.innerHTML=`<b>Versión ${VERSION} · Novedades</b>Importación de CSV/Excel, lectura de UTM zonas 16/17, carga de Shapefile ZIP, exportación GeoJSON/SHP y módulo SIG.`;
    title.appendChild(box);
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
          <p class="module-note">Acepta .csv, .xlsx y .xls. Detecta coordenadas decimales o UTM. Para Nicaragua se priorizan zonas 16 y 17.</p>
          <input id="tableFile" class="file-input" type="file" accept=".csv,.xlsx,.xls" onchange="handleTableFile(this.files[0])">
          <div id="tableFieldMap" class="field-map"></div>
          <div class="module-actions"><button class="btn" onclick="importPreviewRows()">Plotear tabla</button><button class="btn out" onclick="clearImportPreview()">Limpiar vista previa</button></div>
          <div id="importPreview" class="preview-table"></div>
        </div>
        <div class="module-box">
          <h3>2. Cargar Shapefile</h3>
          <p class="module-note">Sube un .zip que contenga .shp, .shx, .dbf y .prj. Se convierte a tabla y se plotea en el mapa.</p>
          <input id="shapeFile" class="file-input" type="file" accept=".zip" onchange="handleShapeZip(this.files[0])">
          <div class="module-actions"><button class="btn out" onclick="document.getElementById('shapeFile').value='';">Limpiar archivo</button></div>
          <p class="module-note">Nota: si el shapefile está en UTM, debe traer .prj para convertir correctamente en el navegador.</p>
        </div>
        <div class="module-box module-full">
          <h3>3. Exportar para QGIS</h3>
          <p class="module-note">Puedes exportar los puntos del proyecto activo. QGIS abre CSV, GeoJSON y Shapefile. GeoPackage requiere una librería espacial más pesada; se deja como mejora futura.</p>
          <div class="module-actions">
            <button class="btn green" onclick="exportProjectGeoJSON()">Exportar GeoJSON</button>
            <button class="btn green" onclick="exportProjectShapefile()">Exportar SHP ZIP</button>
            <button class="btn out gpkg-disabled" onclick="msg('GeoPackage se recomienda para QGIS, pero en navegador requiere una librería SQLite/GeoPackage pesada. Por ahora usa GeoJSON o SHP ZIP.')">GeoPackage próximamente</button>
          </div>
        </div>
      </div>`;
    const cards=main.querySelectorAll('section.card, section.module-card');
    if(cards.length>=2) main.insertBefore(section,cards[2]); else main.appendChild(section);
  }

  function loadScript(src){return new Promise((resolve,reject)=>{if([...document.scripts].some(s=>s.src.includes(src)))return resolve();const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}

  function parseCsv(text){
    const rows=[]; let row=[], cur='', q=false;
    for(let i=0;i<text.length;i++){
      const c=text[i], n=text[i+1];
      if(c==='"'&&q&&n==='"'){cur+='"';i++;continue}
      if(c==='"'){q=!q;continue}
      if((c===','||c===';'||c==='\t')&&!q){row.push(cur.trim());cur='';continue}
      if((c==='\n'||c==='\r')&&!q){if(cur||row.length){row.push(cur.trim());rows.push(row);row=[];cur=''}continue}
      cur+=c;
    }
    if(cur||row.length){row.push(cur.trim());rows.push(row)}
    if(!rows.length)return [];
    const headers=rows[0].map(h=>String(h||'').trim());
    return rows.slice(1).filter(r=>r.some(v=>String(v).trim())).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
  }

  function normalizeName(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
  function guessField(headers,patterns){return headers.find(h=>patterns.some(p=>normalizeName(h).includes(p)))||'';}
  function num(v){const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null;}

  let previewRows=[];
  window.clearImportPreview=function(){previewRows=[];$('importPreview').innerHTML='';$('tableFieldMap').innerHTML='';msg('Vista previa de importación limpia.')};

  function renderFieldMap(rows){
    const headers=Object.keys(rows[0]||{});
    const opt='<option value="">--</option>'+headers.map(h=>`<option value="${esc(h)}">${esc(h)}</option>`).join('');
    const lat=guessField(headers,['lat','latitud','y']);
    const lon=guessField(headers,['lon','long','longitud','x']);
    const east=guessField(headers,['este','easting','utmeste','x']);
    const north=guessField(headers,['norte','northing','utmnorte','y']);
    const zone=guessField(headers,['zona','zone','utmzona']);
    const name=guessField(headers,['nombre','name','sitio','punto','codigo','id']);
    $('tableFieldMap').innerHTML=`
      <label>Nombre<select id="fmName">${opt}</select></label>
      <label>Latitud<select id="fmLat">${opt}</select></label>
      <label>Longitud<select id="fmLon">${opt}</select></label>
      <label>Este UTM<select id="fmEast">${opt}</select></label>
      <label>Norte UTM<select id="fmNorth">${opt}</select></label>
      <label>Zona<select id="fmZone">${opt}</select></label>
      <label>Hemisferio<select id="fmHem">${opt}</select></label>
      <label>Notas<select id="fmNotes">${opt}</select></label>`;
    const set=(id,val)=>{if($(id)&&val)$(id).value=val};
    set('fmName',name);set('fmLat',lat);set('fmLon',lon);set('fmEast',east);set('fmNorth',north);set('fmZone',zone);
  }

  function renderPreview(rows){
    const headers=Object.keys(rows[0]||{}).slice(0,12);
    $('importPreview').innerHTML=`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,8).map(r=>`<tr>${headers.map(h=>`<td>${esc(r[h])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  window.handleTableFile=async function(file){
    if(!file)return;
    try{
      msg('Leyendo archivo: '+file.name+' ...');
      const ext=file.name.split('.').pop().toLowerCase();
      if(ext==='csv'){
        const text=await file.text(); previewRows=parseCsv(text);
      }else{
        await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
        const buf=await file.arrayBuffer(); const wb=XLSX.read(buf,{type:'array'}); const ws=wb.Sheets[wb.SheetNames[0]];
        previewRows=XLSX.utils.sheet_to_json(ws,{defval:''});
      }
      if(!previewRows.length){msg('No se encontraron filas válidas.');return;}
      renderFieldMap(previewRows); renderPreview(previewRows);
      msg('Archivo leído: '+previewRows.length+' fila(s). Revisa campos y pulsa Plotear tabla.');
    }catch(e){msg('No se pudo leer el archivo. Revisa formato CSV/Excel.');}
  };

  function rowToPoint(row,i){
    const get=id=>$(id)?.value?row[$(id).value]:'';
    const name=get('fmName')||('Importado '+(i+1)); const notes=get('fmNotes')||'Importado desde tabla';
    const la=num(get('fmLat')), lo=num(get('fmLon'));
    if(la!==null&&lo!==null&&Math.abs(la)<=90&&Math.abs(lo)<=180){return {name,lat:la,lon:lo,...ll2utm(la,lo),source:'CSV/Excel',inputType:'Tabla',notes};}
    const e=num(get('fmEast')), n=num(get('fmNorth')); let z=num(get('fmZone'))||16; const h=String(get('fmHem')||'N').toUpperCase().startsWith('S')?'S':'N';
    if(e!==null&&n!==null){
      if(![16,17].includes(Number(z))) z=16;
      const ll=utm2ll(e,n,z,h); return {name,lat:ll.lat,lon:ll.lon,easting:e,northing:n,zone:z,hemisphere:h,source:'CSV/Excel',inputType:'UTM tabla',notes};
    }
    return null;
  }

  window.importPreviewRows=function(){
    if(!previewRows.length)return msg('Primero carga un CSV o Excel.');
    const points=previewRows.map(rowToPoint).filter(Boolean);
    if(!points.length)return msg('No se detectaron coordenadas. Revisa la asignación de campos.');
    if(typeof addMany==='function') addMany(points); else {const p=pr();points.reverse().forEach(o=>p.points.unshift({id:crypto.randomUUID(),...o}));save();renderAll();}
    msg(points.length+' punto(s) importado(s) y ploteado(s) desde CSV/Excel.');
  };

  window.handleShapeZip=async function(file){
    if(!file)return;
    try{
      msg('Leyendo Shapefile ZIP...');
      await loadScript('https://cdn.jsdelivr.net/npm/shpjs@latest/dist/shp.min.js');
      const buf=await file.arrayBuffer(); const gj=await shp(buf);
      const features=(gj.type==='FeatureCollection'?gj.features:(Array.isArray(gj)?gj.flatMap(g=>g.features||[]):[]));
      const points=[];
      features.forEach((f,i)=>{
        const geom=f.geometry; if(!geom)return;
        let coords=null;
        if(geom.type==='Point') coords=geom.coordinates;
        if(geom.type==='MultiPoint') coords=geom.coordinates[0];
        if(!coords&&geom.type==='Polygon') coords=geom.coordinates?.[0]?.[0];
        if(!coords&&geom.type==='LineString') coords=geom.coordinates?.[0];
        if(coords&&Number.isFinite(coords[0])&&Number.isFinite(coords[1])){
          const lon=coords[0],lat=coords[1]; if(Math.abs(lat)<=90&&Math.abs(lon)<=180){points.push({name:f.properties?.name||f.properties?.Nombre||f.properties?.nombre||('SHP '+(i+1)),lat,lon,...ll2utm(lat,lon),source:'Shapefile',inputType:geom.type,notes:JSON.stringify(f.properties||{})});}
        }
      });
      if(!points.length)return msg('No se detectaron geometrías puntuales válidas en WGS84. Si el SHP está en UTM debe incluir .prj.');
      if(typeof addMany==='function') addMany(points); else {const p=pr();points.reverse().forEach(o=>p.points.unshift({id:crypto.randomUUID(),...o}));save();renderAll();}
      msg(points.length+' geometría(s) importada(s) desde Shapefile.');
    }catch(e){msg('No se pudo leer el Shapefile ZIP. Verifica que contenga .shp, .shx, .dbf y .prj.');}
  };

  function projectGeoJSON(){
    return {type:'FeatureCollection',name:pr().name,features:pr().points.filter(p=>Number.isFinite(+p.lat)&&Number.isFinite(+p.lon)).map((p,i)=>({type:'Feature',properties:{numero:i+1,nombre:p.name||'',fuente:p.source||'',este_utm:p.easting||'',norte_utm:p.northing||'',zona:p.zone||'',hemisferio:p.hemisphere||'',notas:p.notes||''},geometry:{type:'Point',coordinates:[+p.lon,+p.lat]}}))};
  }
  function downloadBlob(name,blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);}
  window.exportProjectGeoJSON=function(){const gj=projectGeoJSON();downloadBlob(pr().name.replaceAll(' ','_')+'.geojson',new Blob([JSON.stringify(gj,null,2)],{type:'application/geo+json'}));msg('GeoJSON exportado.');};
  window.exportProjectShapefile=async function(){try{await loadScript('https://cdn.jsdelivr.net/npm/shp-write@latest/shpwrite.js');const gj=projectGeoJSON();if(!gj.features.length)return msg('No hay puntos válidos para exportar.');shpwrite.download(gj,{folder:pr().name.replaceAll(' ','_'),types:{point:'puntos'}});msg('Shapefile ZIP generado.');}catch(e){msg('No se pudo generar SHP ZIP. Usa GeoJSON como alternativa para QGIS.');}};

  function init(){addStyles();ensureVersionBox();ensureModule();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,250));else setTimeout(init,250);
})();
