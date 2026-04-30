// Mejoras adicionales: ubicación, zoom con scroll y OCR/tabla más robusto.
(function(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }

  // Reemplaza/fortalece el parser global si existe.
  window.parseCoords = function(text){
    const out=[], seen=new Set();
    const clean=String(text||'')
      .replace(/−/g,'-')
      .replace(/º/g,'°')
      .replace(/,/g,'.')
      .replace(/[|\t]+/g,' ');

    const addGeo=(lat,lon,note)=>{
      lat=Number(lat); lon=Number(lon);
      if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180) return;
      const k=lat.toFixed(7)+','+lon.toFixed(7);
      if(seen.has(k)) return;
      seen.add(k);
      try{ out.push({name:'Extraído '+(out.length+1),lat,lon,...ll2utm(lat,lon),source:'Texto/OCR',notes:note||''}); }catch{}
    };
    const addUtm=(E,N,z,h,note)=>{
      E=Number(E); N=Number(N); z=Number(z||16); h=(h||'N').toUpperCase();
      if(!Number.isFinite(E)||!Number.isFinite(N)||!Number.isFinite(z)) return;
      if(E<100000||E>900000||N<0||N>10000000||z<1||z>60) return;
      try{ const ll=utm2ll(E,N,z,h); const k=ll.lat.toFixed(7)+','+ll.lon.toFixed(7); if(seen.has(k)) return; seen.add(k); out.push({name:'Extraído '+(out.length+1),lat:ll.lat,lon:ll.lon,easting:E,northing:N,zone:z,hemisphere:h,source:'Texto/OCR',notes:note||''}); }catch{}
    };

    // Coordenadas decimales con hemisferio: 12.15468 N 86.27372 W / 12.15468°N, -86.27372°O
    let reHem=/(-?\d{1,2}(?:\.\d+)?)\s*°?\s*([NS])?\s*[,;\s]+(-?\d{1,3}(?:\.\d+)?)\s*°?\s*([EOW])?/gi, m;
    while((m=reHem.exec(clean))){
      let lat=Number(m[1]), lon=Number(m[3]), h1=(m[2]||'').toUpperCase(), h2=(m[4]||'').toUpperCase();
      if(h1==='S') lat=-Math.abs(lat); if(h1==='N') lat=Math.abs(lat);
      if(h2==='W'||h2==='O') lon=-Math.abs(lon); if(h2==='E') lon=Math.abs(lon);
      addGeo(lat,lon,m[0]);
    }

    const lines=clean.split(/\n|;/).map(x=>x.trim()).filter(Boolean);
    for(const line of lines){
      const nums=(line.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
      if(nums.length<2) continue;
      const hasUtm=/\b(utm|este|easting|east|x\s*[:=]|norte|northing|north|y\s*[:=]|zona|zone)\b/i.test(line);
      const E=nums.find(n=>n>=100000&&n<=900000);
      const N=nums.find(n=>n>=900000&&n<=10000000&&n!==E);
      const zCandidate=nums.find(n=>n>=1&&n<=60&&n!==E&&n!==N);
      const hemi=(line.match(/\b([NS])\b/i)||[])[1]||'N';

      // UTM explícito o tabla UTM aunque no diga UTM: zona, este, norte / este, norte / este norte zona.
      if((hasUtm || (Number.isFinite(E)&&Number.isFinite(N))) && Number.isFinite(E)&&Number.isFinite(N)){
        addUtm(E,N,zCandidate||16,hemi,line);
        continue;
      }

      // Decimales normales en columnas: lat lon
      for(let i=0;i<nums.length-1;i++){
        const a=nums[i], b=nums[i+1];
        if(Math.abs(a)<=90 && Math.abs(b)<=180) addGeo(a,b,line);
      }
    }
    return out;
  };

  // Reemplaza extractText para usar el nuevo parser.
  window.extractText = function(){
    const arr=window.parseCoords(document.getElementById('textCoords')?.value||'');
    if(!arr.length) return msg('No encontré coordenadas claras. Prueba con grados decimales, UTM o una tabla con este/norte/zona.');
    addMany(arr);
    msg(arr.length+' coordenada(s) extraída(s).');
  };

  window.useLocation = function(){
    if(!navigator.geolocation) return msg('Tu navegador no permite geolocalización.');
    msg('Solicitando ubicación del dispositivo...');
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat=pos.coords.latitude, lon=pos.coords.longitude;
      view.lat=lat; view.lon=lon; view.z=16;
      try{ addPoint({name:'Mi ubicación',lat,lon,...ll2utm(lat,lon),source:'Ubicación',notes:'Capturada con geolocalización del navegador'}); }
      catch{ drawMap(); }
      msg('Mapa centrado en tu ubicación.');
    },err=>{
      msg('No se pudo obtener la ubicación. Revisa permisos del navegador o activa el GPS.');
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };

  window.mapWheel = function(e){
    e.preventDefault();
    const oldZ=view.z;
    const newZ=Math.max(3,Math.min(18,view.z+(e.deltaY<0?1:-1)));
    if(newZ===oldZ) return;
    const rect=document.getElementById('map').getBoundingClientRect();
    const s=256, mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const worldX=tx(view.lon,oldZ)*s-(rect.width/2)+mx;
    const worldY=ty(view.lat,oldZ)*s-(470/2)+my;
    const lonAtMouse=lonFrom(worldX/s,oldZ), latAtMouse=latFrom(worldY/s,oldZ);
    view.z=newZ;
    const newWorldX=tx(lonAtMouse,newZ)*s, newWorldY=ty(latAtMouse,newZ)*s;
    view.lon=lonFrom((newWorldX-mx+rect.width/2)/s,newZ);
    view.lat=latFrom((newWorldY-my+470/2)/s,newZ);
    drawMap();
  };

  ready(()=>{
    const map=document.getElementById('map');
    if(map){ map.addEventListener('wheel',window.mapWheel,{passive:false}); }
    const bar=document.querySelector('.mapbar .btns');
    if(bar && !document.getElementById('locBtn')){
      const b=document.createElement('button');
      b.id='locBtn'; b.className='btn out'; b.textContent='📍 Usar ubicación';
      b.onclick=window.useLocation;
      bar.prepend(b);
    }
    const ta=document.getElementById('textCoords');
    if(ta) ta.placeholder='Pega texto o tabla. Ejemplos: 12.15468°N, -86.27372°O | 12.15468, -86.27372 | UTM 16N 589000 1319000 | tabla con Este Norte Zona';
  });
})();
