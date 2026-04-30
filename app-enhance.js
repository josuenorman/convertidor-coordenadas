// Mejoras adicionales: ubicación, búsqueda de lugares, modo captura, zoom con scroll y OCR/tabla robusto.
(function(){
  let captureMode=false;
  let suppressNextClick=false;

  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }

  window.parseCoords=function(text){
    const out=[], seen=new Set();
    const clean=String(text||'').replace(/−/g,'-').replace(/º/g,'°').replace(/,/g,'.').replace(/[|\t]+/g,' ');
    const addGeo=(lat,lon,note)=>{lat=Number(lat);lon=Number(lon);if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return;const k=lat.toFixed(7)+','+lon.toFixed(7);if(seen.has(k))return;seen.add(k);try{out.push({name:'Extraído '+(out.length+1),lat,lon,...ll2utm(lat,lon),source:'Texto/OCR',notes:note||''})}catch{}};
    const addUtm=(E,N,z,h,note)=>{E=Number(E);N=Number(N);z=Number(z||16);h=(h||'N').toUpperCase();if(!Number.isFinite(E)||!Number.isFinite(N)||!Number.isFinite(z))return;if(E<100000||E>900000||N<0||N>10000000||z<1||z>60)return;try{const ll=utm2ll(E,N,z,h);const k=ll.lat.toFixed(7)+','+ll.lon.toFixed(7);if(seen.has(k))return;seen.add(k);out.push({name:'Extraído '+(out.length+1),lat:ll.lat,lon:ll.lon,easting:E,northing:N,zone:z,hemisphere:h,source:'Texto/OCR',notes:note||''})}catch{}};

    let reHem=/(-?\d{1,2}(?:\.\d+)?)\s*°?\s*([NS])?\s*[,;\s]+(-?\d{1,3}(?:\.\d+)?)\s*°?\s*([EOW])?/gi,m;
    while((m=reHem.exec(clean))){let lat=Number(m[1]),lon=Number(m[3]),h1=(m[2]||'').toUpperCase(),h2=(m[4]||'').toUpperCase();if(h1==='S')lat=-Math.abs(lat);if(h1==='N')lat=Math.abs(lat);if(h2==='W'||h2==='O')lon=-Math.abs(lon);if(h2==='E')lon=Math.abs(lon);addGeo(lat,lon,m[0])}

    const lines=clean.split(/\n|;/).map(x=>x.trim()).filter(Boolean);
    for(const line of lines){
      const nums=(line.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
      if(nums.length<2)continue;
      const hasUtm=/\b(utm|este|easting|east|x\s*[:=]|norte|northing|north|y\s*[:=]|zona|zone)\b/i.test(line);
      const E=nums.find(n=>n>=100000&&n<=900000);
      const N=nums.find(n=>n>=900000&&n<=10000000&&n!==E);
      const zCandidate=nums.find(n=>n>=1&&n<=60&&n!==E&&n!==N);
      const hemi=(line.match(/\b([NS])\b/i)||[])[1]||'N';
      if((hasUtm||(Number.isFinite(E)&&Number.isFinite(N)))&&Number.isFinite(E)&&Number.isFinite(N)){addUtm(E,N,zCandidate||16,hemi,line);continue;}
      for(let i=0;i<nums.length-1;i++){const a=nums[i],b=nums[i+1];if(Math.abs(a)<=90&&Math.abs(b)<=180)addGeo(a,b,line);}
    }
    return out;
  };

  window.extractText=function(){const arr=window.parseCoords(document.getElementById('textCoords')?.value||'');if(!arr.length)return msg('No encontré coordenadas claras. Prueba con grados decimales, UTM o una tabla con este/norte/zona.');addMany(arr);msg(arr.length+' coordenada(s) extraída(s).')};

  window.toggleCaptureMode=function(){captureMode=!captureMode;const b=document.getElementById('captureBtn');if(b){b.textContent=captureMode?'✅ Captura activa':'📌 Capturar punto';b.classList.toggle('green',captureMode);b.classList.toggle('out',!captureMode);}const map=document.getElementById('map');if(map){map.style.cursor=captureMode?'crosshair':'grab';}msg(captureMode?'Modo captura activo: haz clic en el mapa para guardar un punto.':'Modo navegación activo: puedes mover, buscar y hacer zoom sin capturar puntos.')};

  window.useLocation=function(){
    if(!navigator.geolocation)return msg('Tu navegador no permite geolocalización.');
    msg('Solicitando ubicación del dispositivo... acepta el permiso del navegador.');
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat=pos.coords.latitude,lon=pos.coords.longitude;
      view.lat=lat;view.lon=lon;view.z=17;
      try{addPoint({name:'Mi ubicación',lat,lon,...ll2utm(lat,lon),source:'Ubicación',notes:'Capturada con geolocalización del navegador'});}catch{drawMap();}
      drawMap();msg('Mapa centrado en tu ubicación. Precisión aproximada: '+Math.round(pos.coords.accuracy||0)+' m.');
    },err=>{
      let t='No se pudo obtener la ubicación. ';
      if(err.code===1)t+='Permiso denegado. Activa permisos de ubicación para este sitio.';
      else if(err.code===2)t+='La ubicación no está disponible. Activa GPS/WiFi o prueba otro navegador.';
      else t+='Tiempo agotado al solicitar ubicación.';
      msg(t);
    },{enableHighAccuracy:true,timeout:20000,maximumAge:0});
  };

  window.searchPlace=async function(){
    const q=(document.getElementById('placeSearch')?.value||'').trim();
    if(!q)return msg('Escribe un lugar a buscar. Ejemplo: Managua, Santa Teresa, La Pita.');
    msg('Buscando lugar: '+q+' ...');
    try{
      const url='https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q);
      const res=await fetch(url,{headers:{'Accept':'application/json'}});
      const data=await res.json();
      if(!data.length)return msg('No encontré ese lugar. Prueba agregando país o municipio.');
      const lat=Number(data[0].lat),lon=Number(data[0].lon);
      view.lat=lat;view.lon=lon;view.z=14;drawMap();msg('Mapa centrado en: '+(data[0].display_name||q));
    }catch(e){msg('No se pudo buscar el lugar. Revisa conexión o intenta de nuevo.');}
  };

  window.mapWheel=function(e){e.preventDefault();const oldZ=view.z,newZ=Math.max(3,Math.min(18,view.z+(e.deltaY<0?1:-1)));if(newZ===oldZ)return;const rect=document.getElementById('map').getBoundingClientRect(),s=256,mx=e.clientX-rect.left,my=e.clientY-rect.top;const worldX=tx(view.lon,oldZ)*s-rect.width/2+mx,worldY=ty(view.lat,oldZ)*s-470/2+my;const lonAtMouse=lonFrom(worldX/s,oldZ),latAtMouse=latFrom(worldY/s,oldZ);view.z=newZ;const nx=tx(lonAtMouse,newZ)*s,ny=ty(latAtMouse,newZ)*s;view.lon=lonFrom((nx-mx+rect.width/2)/s,newZ);view.lat=latFrom((ny-my+470/2)/s,newZ);drawMap()};

  const originalMapClick=window.mapClick;
  window.mapClick=function(e){if(suppressNextClick){suppressNextClick=false;return;}if(!captureMode){msg('Modo navegación activo. Activa “Capturar punto” para guardar coordenadas desde el mapa.');return;}originalMapClick(e)};
  const oldMapUp=window.mapUp;
  window.mapUp=function(e){const before=typeof drag!=='undefined'&&drag?drag.moved:false;oldMapUp(e);if(before)suppressNextClick=true;};

  ready(()=>{
    const map=document.getElementById('map');
    if(map){map.addEventListener('wheel',window.mapWheel,{passive:false});map.style.cursor='grab';}
    const bar=document.querySelector('.mapbar .btns');
    if(bar){
      if(!document.getElementById('captureBtn')){const b=document.createElement('button');b.id='captureBtn';b.className='btn out';b.textContent='📌 Capturar punto';b.onclick=window.toggleCaptureMode;bar.prepend(b)}
      if(!document.getElementById('locBtn')){const b=document.createElement('button');b.id='locBtn';b.className='btn out';b.textContent='📍 Mi ubicación';b.onclick=window.useLocation;bar.prepend(b)}
      if(!document.getElementById('placeSearch')){const i=document.createElement('input');i.id='placeSearch';i.placeholder='Buscar lugar...';i.onkeydown=e=>{if(e.key==='Enter')window.searchPlace()};const b=document.createElement('button');b.id='placeBtn';b.className='btn out';b.textContent='🔎 Ir';b.onclick=window.searchPlace;bar.prepend(b);bar.prepend(i)}
    }
    const ta=document.getElementById('textCoords');
    if(ta)ta.placeholder='Pega texto o tabla. Ejemplos: 12.15468°N, -86.27372°O | 12.15468, -86.27372 | UTM 16N 589000 1319000 | tabla con Este Norte Zona';
    msg('Mapa en modo navegación. Activa “Capturar punto” cuando quieras guardar coordenadas desde el mapa.');
  });
})();
