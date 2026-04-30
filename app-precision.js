// Corrección de precisión de captura, cursor especial y nombre al capturar punto.
(function(){
  let precisionCaptureMode = false;
  let precisionDrag = null;
  const $ = id => document.getElementById(id);

  function addPrecisionStyles(){
    if($('cc-precision-style')) return;
    const css = `
      .map.capture-active{cursor:crosshair!important;}
      .map.capture-active::after{content:"+";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;border:2px solid #dc2626;border-radius:999px;color:#dc2626;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;font-weight:900;z-index:9;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.25)}
      .capture-hint{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);background:rgba(220,38,38,.92);color:white;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;z-index:9;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.22)}
    `;
    const s=document.createElement('style');s.id='cc-precision-style';s.textContent=css;document.head.appendChild(s);
  }

  function getMapMath(){
    const el=$('map');
    const w=el?.clientWidth||900;
    const h=el?.clientHeight||580;
    const s=256;
    const tlx=tx(view.lon,view.z)*s-w/2;
    const tly=ty(view.lat,view.z)*s-h/2;
    return {el,w,h,s,tlx,tly};
  }

  function eventToLatLon(e){
    const {el,s,tlx,tly}=getMapMath();
    const r=el.getBoundingClientRect();
    const wx=(tlx+e.clientX-r.left)/s;
    const wy=(tly+e.clientY-r.top)/s;
    return {lat:latFrom(wy,view.z), lon:lonFrom(wx,view.z)};
  }

  function nextPointNumber(){
    return (pr()?.points?.length || 0) + 1;
  }

  function askPointName(){
    const defaultName = 'Punto ' + nextPointNumber();
    const name = prompt('Nombre del punto capturado:', defaultName);
    if(name === null) return null;
    const clean = String(name).trim();
    return clean || defaultName;
  }

  function addPointNoMove(point){
    const p=pr();
    p.points.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),name:point.name||'Punto '+(p.points.length+1),...point});
    save();
    if(window.renderProjects) renderProjects();
    if(window.renderTable) renderTable(); else drawMap();
  }

  function updateCaptureButton(){
    const b=$('captureBtn');
    const map=$('map');
    if(b){
      b.textContent=precisionCaptureMode?'✅ Captura activa':'📌 Capturar punto';
      b.classList.toggle('green',precisionCaptureMode);
      b.classList.toggle('out',!precisionCaptureMode);
    }
    if(map){
      map.classList.toggle('capture-active',precisionCaptureMode);
      map.style.cursor=precisionCaptureMode?'crosshair':'grab';
    }
    drawMap();
  }

  window.toggleCaptureMode=function(){
    precisionCaptureMode=!precisionCaptureMode;
    updateCaptureButton();
    msg(precisionCaptureMode?'Modo captura activo: haz clic, escribe el nombre del punto y se guardará sin mover la vista.':'Modo navegación activo: puedes mover, buscar y hacer zoom sin capturar puntos.');
  };

  window.mapWheel=function(e){
    e.preventDefault();
    const oldZ=view.z;
    const newZ=Math.max(3,Math.min(18,view.z+(e.deltaY<0?1:-1)));
    if(newZ===oldZ)return;
    const {el,w,h,s}=getMapMath();
    const r=el.getBoundingClientRect();
    const mx=e.clientX-r.left;
    const my=e.clientY-r.top;
    const worldX=tx(view.lon,oldZ)*s-w/2+mx;
    const worldY=ty(view.lat,oldZ)*s-h/2+my;
    const lonAtMouse=lonFrom(worldX/s,oldZ);
    const latAtMouse=latFrom(worldY/s,oldZ);
    view.z=newZ;
    const nx=tx(lonAtMouse,newZ)*s;
    const ny=ty(latAtMouse,newZ)*s;
    view.lon=lonFrom((nx-mx+w/2)/s,newZ);
    view.lat=latFrom((ny-my+h/2)/s,newZ);
    drawMap();
  };

  window.mapDown=function(e){
    precisionDrag={x:e.clientX,y:e.clientY,startLat:view.lat,startLon:view.lon,moved:false};
    $('map')?.classList.add('grabbing');
  };

  window.mapMove=function(e){
    if(!precisionDrag)return;
    const dx=e.clientX-precisionDrag.x;
    const dy=e.clientY-precisionDrag.y;
    if(Math.abs(dx)+Math.abs(dy)>4)precisionDrag.moved=true;
    if(precisionCaptureMode && !precisionDrag.moved)return;
    const {s}=getMapMath();
    const cx=tx(precisionDrag.startLon,view.z)*s-dx;
    const cy=ty(precisionDrag.startLat,view.z)*s-dy;
    view.lon=lonFrom(cx/s,view.z);
    view.lat=latFrom(cy/s,view.z);
    drawMap();
  };

  window.mapUp=function(e){
    $('map')?.classList.remove('grabbing');
    if(!precisionDrag)return;
    const moved=precisionDrag.moved;
    precisionDrag=null;
    if(moved)return;
    if(!precisionCaptureMode){msg('Modo navegación activo. Activa “Capturar punto” para guardar coordenadas desde el mapa.');return;}
    const {lat,lon}=eventToLatLon(e);
    const pointName = askPointName();
    if(pointName === null){msg('Captura cancelada. El modo captura sigue activo.');return;}
    try{
      addPointNoMove({name:pointName,lat,lon,...ll2utm(lat,lon),source:'Mapa',notes:'Capturada en mapa'});
      msg('Punto "'+pointName+'" capturado: '+lat.toFixed(7)+', '+lon.toFixed(7)+'. Captura sigue activa.');
    }catch(err){msg(err.message||'No se pudo capturar la coordenada.');}
  };

  const oldDraw=window.drawMap;
  window.drawMap=function(){
    oldDraw&&oldDraw();
    const map=$('map');
    if(map){
      map.classList.toggle('capture-active',precisionCaptureMode);
      if(precisionCaptureMode && !map.querySelector('.capture-hint')){
        const h=document.createElement('div');
        h.className='capture-hint';
        h.textContent='Captura activa: clic, nombre y guardar';
        map.appendChild(h);
      }
    }
  };

  function init(){
    addPrecisionStyles();
    const map=$('map');
    if(map){map.addEventListener('wheel',window.mapWheel,{passive:false});}
    updateCaptureButton();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,180));else setTimeout(init,180);
})();
