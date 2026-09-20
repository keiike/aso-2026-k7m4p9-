/* Map 2026-09-20. Optional device location and manual visits use separate modules. */
(() => {
  'use strict';
  const host = document.getElementById('map');
  if (!host) return;
  if (typeof L === 'undefined') {
    host.textContent = '地図ライブラリを読み込めません。通信を確認して再読み込みするか、各店のGoogleマップリンクをご利用ください。';
    return;
  }
  // Static public-address reference points, not verified entrances or parking locations.
  const raw = [
    ...(window.ASO_HITA_GEO || []),
    ['セカンドストリート日田店',33.319560,130.930450,'published','店舗公式の経路案内座標','https://www.2ndstreet.jp/shop/details?shopsId=32075'],
    ['セカンドストリート太宰府店',33.507164,130.496490,'address','向佐野二丁目13番15号'],
    ['セカンドストリート筑紫野インター店',33.482281,130.523010,'address','上古賀四丁目9番1号'],
    ['スーパーセカンドストリート箱崎店',33.619434,130.417404,'address','箱崎四丁目7番55号'],
    ['阿蘇神社・門前町',32.947620,131.115585,'address','一の宮町宮地3083番地'],
    ['上色見熊野座神社',32.853848,131.158438,'published','高森町の施設掲載座標','https://www.town.kumamoto-takamori.lg.jp/site/kanko/1951.html'],
    ['白川水源',32.825509,131.0952073,'address','白川2040の住所代表点（南阿蘇鉄道掲載住所・MapFan）','https://mapfan.com/addresses/43/433/005000/02040'],
    ['高森湧水トンネル公園',32.813572,131.122693,'published','高森町の施設掲載座標','https://www.town.kumamoto-takamori.lg.jp/site/kanko/1963.html'],
    ['鍋ヶ滝公園',33.13735,131.0358,'published','地理院地図の地名検索「鍋ヶ滝」（滝の位置）','https://maps.gsi.go.jp/#16/33.13735/131.0358/'],
    ['TOMMY’Sアンティーク＆ステンドグラス',32.952072,131.115402,'address','一の宮町宮地3204番地'],
    ['etu',32.950008,131.116455,'address','一の宮町宮地3093番地'],
    ['森本金物店・阿蘇昭和レトロ雑貨',32.951736,131.118027,'address','一の宮町宮地167番地'],
    ['みやがわ時計店',32.948792,131.117004,'address','一の宮町宮地1865番地'],
    ['ONE PLUS ONE',32.936344,131.077469,'address','阿蘇市黒川1699番地'],
    ['菊池古道具屋',33.326939,130.937164,'address','豆田町9番29号'],
    ['四月の魚',33.3432671,130.7586437,'address','観光サイト掲載地図の参照点','https://ukihalove.jp/contents/shigatunoskana/'],
    ['つなぎ はぐくむ いとなみの道具店',33.351410,130.749939,'area','うきは市吉井町新治（地区代表点）'],
    ['骨とう・古民具さきやま',33.469677,130.690277,'address','朝倉市秋月585番地'],
    ['大正浪漫 地球屋',33.315491,130.579956,'address','久留米市山本町豊田72番地'],
    ['antique et fleur chandelle',33.310917,130.582443,'address','久留米市山本町豊田216番地'],
    ['mon Marché',33.380955,130.575058,'address','小郡市古飯489番地'],
    ['DAY DREAM',32.849319,130.882248,'area','大津町岩坂（地区代表点）'],
    ['古道具るごろ',33.058018,130.680817,'area','山鹿市津留（地区代表点）'],
    ['Différence France',33.014557,130.699646,'address','山鹿市山鹿497番地'],
    ['JOHN BULL ANTIQUES',32.758476,130.691849,'address','熊本市近見七丁目10番12号'],
    ['Grandma ATQ',32.800957,130.715088,'address','熊本市九品寺一丁目1番26号'],
    ['彼方 kanata',32.795540,130.696960,'area','熊本市呉服町二丁目（地区代表点）'],
    ['hails',32.793533,130.745926,'address','熊本市上水前寺二丁目24番12号'],
    ['Anvin.store',32.819649,130.720978,'address','熊本市黒髪三丁目10番24号']
  ];
  const GEO = Object.fromEntries(raw.map(([name,lat,lng,precision,label,source]) => [name,{lat,lng,precision,label,source:source||'https://maps.gsi.go.jp/'}]));
  const categories = {
    clothing: {name:'古着・上着', short:'衣', color:'#1e6883'},
    antiques: {name:'古道具・アンティーク', short:'古', color:'#765293'},
    classics: {name:'追加の観光', short:'観', color:'#946717'},
    titans: {name:'進撃の日田', short:'進', color:'#985149'}
  };
  const guide = typeof ASO_GUIDE === 'undefined' ? {} : ASO_GUIDE;
  const candidates = Object.keys(categories).flatMap(category => (guide[category] || []).map((place,index) => ({...place, category, id:category+'-'+index, geo:GEO[place.name]})));
  const available = candidates.filter(p => p.geo && Number.isFinite(p.geo.lat) && Number.isFinite(p.geo.lng));
  const byId = new Map(available.map(p => [p.id,p]));
  const byName = new Map(available.map(p => [p.name,p]));
  const state = {planned:true,clothing:true,antiques:true,classics:true,titans:true,query:''};
  const style = document.createElement('style');
  style.textContent = `
  .map-panel{padding:11px;border:1px solid #dce2e4;border-radius:6px;background:#f8faf9;margin:0 0 10px;font-size:12px}
  .map-panel fieldset{border:0;padding:0;margin:0}.map-panel legend{font-size:12px;font-weight:700;margin-bottom:5px}
  .map-filter-row{display:flex;flex-wrap:wrap;gap:6px 10px}.map-filter-row label{display:flex;align-items:center;gap:5px;min-height:36px;cursor:pointer}
  .map-filter-row input{width:17px;height:17px;accent-color:#3d6957;margin:0}.key-square{display:inline-block;border-radius:4px;width:18px;height:18px;color:#fff;text-align:center;line-height:18px;font-size:11px}
  .map-search-row{display:flex;gap:6px;margin:9px 0}.map-search-row input{min-width:0;width:100%;font:inherit;font-size:14px;padding:8px;border:1px solid #becace;border-radius:4px}.map-search-row button{flex:none;padding:6px 9px}
  .map-options{display:flex;gap:6px;flex-wrap:wrap}.map-options button{padding:6px 9px;min-height:34px}
  .map-panel select{font:inherit;border:1px solid #c4cfd2;border-radius:4px;padding:7px;max-width:100%;background:#fff;color:#26343b}
  .map-jump{display:block;margin-top:9px}.map-jump select{display:block;width:100%;margin-top:4px}
  #map-status{font-size:11px;margin:7px 0 0;color:#53656c;min-height:18px}
  #tile-status{font-size:12px;color:#81500d;background:#fff5df;padding:8px 10px;border-radius:4px;margin:8px 0}
  #map{height:560px;touch-action:pan-x pan-y}.map-pin,.route-pin,.cluster-pin{background:none!important;border:0!important}
  .pin-face{width:27px;height:27px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:2px solid white;background:var(--pin);color:#fff;font:700 13px/1 sans-serif;box-shadow:0 1px 5px #0006}
  .pin-face.approx{border:2px dashed var(--pin);background:#fff;color:var(--pin)}
  .route-face{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid white;background:var(--pin);color:white;font:700 11px/1 sans-serif;box-shadow:0 1px 4px #0005}
  .cluster-face{height:34px;width:34px;background:white;border:3px solid #556a73;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 13px/1 sans-serif;color:#293f49;box-shadow:0 1px 5px #0004}
  .map-popup{font-size:12px;min-width:190px;max-width:260px;overflow-wrap:anywhere}.map-popup h3{font-size:15px;margin:3px 0 8px}.map-popup p{margin:6px 0}.map-popup small{display:block;color:#5d6c73;font-size:11px}
  .map-popup .popup-links{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}.map-popup .popup-links a{padding:4px 0}.map-popup .precision{background:#f5f1e7;padding:6px;border-left:3px solid #b28c51}
  .cluster-list{max-height:210px;overflow-y:auto;display:grid;gap:5px}.cluster-list button{display:block;text-align:left;font-size:12px;padding:8px;white-space:normal;line-height:1.4}
  .view-on-map{font-size:11px;padding:5px 8px;min-height:30px;color:#285c73}
  .map-footnotes{font-size:10px;color:#617279;margin-top:9px}.map-footnotes summary{cursor:pointer}
  @media(max-width:760px){#map{height:460px}.map-filter-row{gap:2px 10px}.map-options button{min-height:38px}.map-popup{max-width:240px}.leaflet-control-attribution{max-width:250px;font-size:9px}}
  @media print{.map-panel,.map-tools,#tile-status,.view-on-map{display:none!important}#map{height:540px}}
  `;
  document.head.appendChild(style);
  const toolbar = document.querySelector('.map-tools');
  if (toolbar) toolbar.innerHTML = '<button id="local-map" type="button">阿蘇周辺</button><button id="miyaji-map" type="button">宮地を拡大</button><button id="wide-map" type="button">福岡〜熊本の全体</button><button id="hita-map" type="button">日田・進撃を拡大</button>';
  const panel = document.createElement('div');
  panel.className='map-panel';
  panel.innerHTML = '<fieldset><legend>地図に表示するもの</legend><div class="map-filter-row"><label><input type="checkbox" data-map-layer="planned" checked>予定ルート</label>'+Object.entries(categories).map(([id,c])=>'<label><input type="checkbox" data-map-layer="'+id+'" checked><span class="key-square" style="background:'+c.color+'">'+c.short+'</span>'+c.name+' '+(guide[id]||[]).length+'</label>').join('')+'</div></fieldset><div class="map-search-row"><input id="map-search" type="search" aria-label="地図の追加候補を店名や住所で絞る" placeholder="候補ピンを検索：店名・地域・家具など"><button id="clear-map-search" type="button">クリア</button></div><div class="map-options"><button id="show-all-candidates" type="button">候補を全部表示</button><button id="show-planned-only" type="button">予定ルートのみ</button><button id="fit-candidates" type="button">表示中の候補に合わせる</button><label>背景 <select id="map-background" aria-label="背景地図"><option value="pale">地理院・淡色地図</option><option value="std">地理院・標準地図</option></select></label></div><label class="map-jump">お店・観光地へ移動<select id="map-place-select"><option value="">候補を選んで地図を拡大</option></select></label><p id="map-status" role="status" aria-live="polite"></p>';
  host.before(panel);
  const tileNotice=document.createElement('p');tileNotice.id='tile-status';tileNotice.setAttribute('role','status');tileNotice.hidden=true;host.after(tileNotice);
  const credit=document.createElement('details');credit.className='map-footnotes';credit.innerHTML='<summary>地図の出典・位置精度</summary><p>背景：<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院・地理院タイル</a>。施設名・営業情報：各カードの出典。位置：掲載座標・MapFanの住所代表点または地理院地図の住所検索（協力：東大CSIS）を元に配置。国土地理院が作成した旅程ではありません。住所代表点は店舗入口や駐車場を示すものではありません。</p><p>小縮尺地図の出典：Shoreline data is derived from: United States. National Imagery and Mapping Agency. “Vector Map Level 0 (VMAP0).” Bethesda, MD: Denver, CO: The Agency; USGS Information Services, 1997. 標準地図の海底地形：The bathymetric contours are derived from those contained within the GEBCO Digital Atlas, published by the BODC on behalf of IOC and IHO (2003) (https://www.gebco.net). 海上保安庁許可第292502号（水路業務法第25条に基づく類似刊行物）。</p>';
  tileNotice.after(credit);
  const select=document.getElementById('map-place-select');
  for(const [category,c] of Object.entries(categories)){
    const group=document.createElement('optgroup');group.label=c.name;
    for(const p of available.filter(p=>p.category===category)){
      const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name+(p.geo.precision==='area'?'［地区の概略位置］':'');group.appendChild(opt);
    }
    select.appendChild(group);
  }
  const map=L.map(host,{scrollWheelZoom:false,minZoom:7,maxZoom:18,zoomControl:true});
  map.createPane('tripLines');map.getPane('tripLines').style.zIndex=390;
  map.createPane('tripStops');map.getPane('tripStops').style.zIndex=420;
  map.createPane('candidatePins');map.getPane('candidatePins').style.zIndex=450;
  map.createPane('focusedPin');map.getPane('focusedPin').style.zIndex=490;
  let background, selectedId=null, timer;
  const emptyTile='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#eef1ed"/></svg>');
  function changeBackground(kind){
    if(background)map.removeLayer(background);
    tileNotice.hidden=true;
    background=L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/'+kind+'/{z}/{x}/{y}.png',{
      attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>',
      minZoom:7,maxZoom:18,maxNativeZoom:18,noWrap:true,updateWhenIdle:true,updateWhenZooming:false,keepBuffer:1,
      referrerPolicy:'strict-origin-when-cross-origin',errorTileUrl:emptyTile
    });
    background.on('tileerror',()=>{tileNotice.textContent='背景地図の一部を読み込めません。通信を確認し、背景の種類を切り替えてください。ピンと各店のGoogleマップリンクは利用できます。';tileNotice.hidden=false;});
    background.addTo(map);
  }
  changeBackground('pale');
  L.control.scale({imperial:false}).addTo(map);
  const planned=L.layerGroup().addTo(map), pins=L.layerGroup().addTo(map), focus=L.layerGroup().addTo(map);
  const points={
    nakasu:[33.595,130.405,'中洲・出発／返却（地区代表点）','トヨタレンタカー 中洲店 福岡'],
    hita:[33.319560,130.930450,'セカンドストリート日田店','セカンドストリート日田店 本庄町5-46'],
    kuro:[33.078019,131.141697,'黒川温泉エリア','黒川温泉 南小国町'],
    daikan:[32.996287,131.067217,'大観峰','大観峰展望所'],
    base:[32.817130,131.126877,'村田家旅館・高森','ユースホステル 村田家旅館 高森1672'],
    kusa:[32.8849,131.052,'草千里・火山博物館エリア','草千里 駐車場 阿蘇'],
    yone:[32.905778,131.044472,'米塚（山体位置・車の進入先ではありません）','米塚 阿蘇'],
    miyaji:[32.947986,131.116159,'宮地・阿蘇神社・古道具店エリア','阿蘇神社 宮地3083-1'],
    meru:[32.858274,131.004367,'めるころ周辺（エリア代表点）','めるころ パン工房 南阿蘇'],
    mochi:[32.933892,131.099367,'もちとこ（住所代表点）','もちとこ 阿蘇市西町885'],
    milk:[32.982845,131.015282,'ミルクロード・かぶと岩付近','かぶと岩展望所']
  };
  const visits=window.AsoVisits;
  const visitGroups={nakasu:['トヨタレンタカー中洲店'],hita:['セカンドストリート日田店'],kuro:['Au Pan & Coffee','Patisserie ROKU 麓','黒川温泉'],daikan:['大観峰'],base:['村田家旅館'],kusa:['草千里ヶ浜','阿蘇火山博物館'],yone:['米塚'],miyaji:['阿蘇神社・門前町','komeko','TOMMY’Sアンティーク＆ステンドグラス','森本金物店・阿蘇昭和レトロ雑貨','etu','みやがわ時計店'],meru:['めるころ パン工房'],mochi:['もちとこ'],milk:['ミルクロード']};
  const dayColors=['#b8612f','#2b7655','#37739d'];
  const trips=[['nakasu','hita','kuro','daikan','base'],['base','kusa','yone','miyaji','base'],['base','meru','mochi','milk','nakasu']];
  trips.forEach((trip,i)=>L.polyline(trip.map(k=>points[k].slice(0,2)),{pane:'tripLines',color:dayColors[i],weight:3,opacity:.78,dashArray:'8 7',interactive:false}).addTo(planned));
  const routeSpecs=[['nakasu','発','#54646c'],['hita','1',dayColors[0]],['kuro','1',dayColors[0]],['daikan','1',dayColors[0]],['base','宿','#6c4d3c'],['kusa','2',dayColors[1]],['yone','2',dayColors[1]],['miyaji','2',dayColors[1]],['meru','3',dayColors[2]],['mochi','3',dayColors[2]],['milk','3',dayColors[2]]];
  const safeLink=(url,text)=>{const a=document.createElement('a');a.href=url;a.textContent=text;a.target='_blank';a.rel='noopener noreferrer';return a;};
  const google=(name,address='')=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+address.replace(/（[^）]*）/g,''));
  routeSpecs.forEach(([key,n,color])=>{
    const p=points[key],box=document.createElement('div');box.className='map-popup';
    const b=document.createElement('h3');b.textContent=p[2];box.appendChild(b);box.appendChild(safeLink(google(p[3]),'Googleマップで確認 ↗'));
    if(visits){const group=document.createElement('div');group.className='visit-popup-stops';for(const name of visitGroups[key]||[]){const row=document.createElement('div');row.className='visit-stop';const title=document.createElement('span');title.textContent=name;row.append(title,visits.control(name));group.append(row);}box.append(group);}
    const routeMarker=L.marker(p.slice(0,2),{pane:'tripStops',title:p[2],icon:L.divIcon({className:'route-pin',html:'<span class="route-face" style="--pin:'+color+'">'+n+'</span>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(planned).bindTooltip(p[2]).bindPopup(box);
    visits?.bindMarker(routeMarker,visitGroups[key]||[]);
  });
  function matches(p){return state[p.category]&&(!state.query||[p.name,p.address,p.group,p.area,p.genre,p.type,p.slot,p.status,p.note].filter(Boolean).join(' ').toLocaleLowerCase().includes(state.query));}
  function filtered(){return available.filter(matches);}
  function coords(p){return [p.geo.lat,p.geo.lng];}
  function popup(p){
    const box=document.createElement('div');box.className='map-popup';
    const badge=document.createElement('small');badge.textContent='追加候補｜'+categories[p.category].name;box.appendChild(badge);
    const h=document.createElement('h3');h.textContent=p.name;box.appendChild(h);
    [p.address,p.hours,p.status||p.slot,p.note].filter(Boolean).forEach(t=>{const el=document.createElement('p');el.textContent=t;box.appendChild(el);});
    const precision=document.createElement('p');precision.className='precision';
    precision.textContent=(p.geo.precision==='area'?'地区の概略位置です。店舗・施設の位置や入口は未特定。':p.geo.precision==='published'?'公表された地図参照座標です。駐車場・入口はリンク先で確認。':'住所または掲載地図からの代表点です。店舗入口とは限りません。')+' 参照：'+p.geo.label;
    box.appendChild(precision);
    const links=document.createElement('div');links.className='popup-links';
    links.appendChild(safeLink(google(p.name,p.address),'Googleマップで確認 ↗'));
    if(p.source)links.appendChild(safeLink(p.source,'営業情報の出典 ↗'));
    if(p.geo.source)links.appendChild(safeLink(p.geo.source,'位置の出典 ↗'));
    if(p.phone){const a=document.createElement('a');a.href='tel:'+p.phone.replace(/[^0-9+]/g,'');a.textContent='店舗に電話';links.appendChild(a);}
    box.appendChild(links);if(visits)box.append(visits.control(p.name));return box;
  }
  function makePin(p,pane='candidatePins'){
    const c=categories[p.category],approx=p.geo.precision==='area';
    const marker=L.marker(coords(p),{pane,title:p.name+(approx?'（地区の概略位置）':''),icon:L.divIcon({className:'map-pin',html:'<span class="pin-face'+(approx?' approx':'')+'" style="--pin:'+c.color+'">'+c.short+'</span>',iconSize:[27,27],iconAnchor:[13.5,13.5]}),keyboard:true}).bindTooltip(p.name+(approx?'［概略位置］':''),{direction:'top'}).bindPopup(popup(p),{maxWidth:290,maxHeight:330});
    visits?.bindMarker(marker,[p.name]);return marker;
  }
  function fitLocations(locations,maxZoom=14){if(!locations.length)return;map.fitBounds(L.latLngBounds(locations),{padding:[28,28],maxZoom,animate:false});}
  function showFocus(id,scroll=true){
    const p=byId.get(id);if(!p)return;map.closePopup();
    clearTimeout(timer);state[p.category]=true;state.query='';document.getElementById('map-search').value='';
    panel.querySelector('[data-map-layer="'+p.category+'"]').checked=true;
    selectedId=id;select.value=id;
    const zoom=p.geo.precision==='area'?13:16;
    map.setView(coords(p),zoom,{animate:false});render();
    if(scroll){document.getElementById('itinerary').scrollIntoView({behavior:'smooth',block:'start'});}
    setTimeout(()=>{map.invalidateSize({pan:false});focus.getLayers()[0]?.openPopup();},80);
  }
  function render(){
    if(state.planned&&!map.hasLayer(planned))map.addLayer(planned);
    if(!state.planned&&map.hasLayer(planned))map.removeLayer(planned);
    pins.clearLayers();
    const list=filtered(),groups=[];
    for(const p of list){
      if(p.id===selectedId)continue;
      const pix=map.latLngToContainerPoint(coords(p));
      const cluster=groups.find(g=>pix.distanceTo(g.pixel)<33);
      if(cluster){cluster.items.push(p);}
      else groups.push({pixel:pix,items:[p]});
    }
    for(const g of groups){
      if(g.items.length===1){makePin(g.items[0]).addTo(pins);continue;}
      const center=[g.items.reduce((v,p)=>v+p.geo.lat,0)/g.items.length,g.items.reduce((v,p)=>v+p.geo.lng,0)/g.items.length];
      const box=document.createElement('div');box.className='map-popup';const h=document.createElement('h3');h.textContent='近くの候補 '+g.items.length+'か所';box.appendChild(h);
      const listBox=document.createElement('div');listBox.className='cluster-list';
      g.items.forEach(p=>{const button=document.createElement('button');button.type='button';button.textContent=categories[p.category].short+'｜'+p.name;button.dataset.visitLabel=p.name;button.onclick=()=>showFocus(p.id,false);const entry=document.createElement('div');entry.className='cluster-entry';entry.append(button);if(visits)entry.append(visits.control(p.name));listBox.append(entry);});
      box.appendChild(listBox);
      const zoom=document.createElement('button');zoom.type='button';zoom.textContent='この周辺を拡大';zoom.onclick=()=>fitLocations(g.items.map(coords),17);box.appendChild(zoom);
      const clusterMarker=L.marker(center,{pane:'candidatePins',title:'近くの候補 '+g.items.length+'か所',icon:L.divIcon({className:'cluster-pin',html:'<span class="cluster-face">'+g.items.length+'</span>',iconSize:[34,34],iconAnchor:[17,17]})}).addTo(pins).bindPopup(box,{maxWidth:290}).bindTooltip('タップして候補を選ぶ');
      visits?.bindMarker(clusterMarker,g.items.map(p=>p.name),true);
    }
    if(selectedId){
      const p=byId.get(selectedId);
      if(p&&matches(p)){
        const old=focus.getLayers()[0];
        if(!old||old.options.candidateId!==selectedId){focus.clearLayers();const pin=makePin(p,'focusedPin');pin.options.candidateId=selectedId;pin.addTo(focus);}
      }else{selectedId=null;focus.clearLayers();}
    }else{focus.clearLayers();select.value='';}
    const inView=list.filter(p=>map.getBounds().contains(coords(p))).length;
    document.getElementById('map-status').textContent='追加候補 '+list.length+' / '+candidates.length+'か所を表示対象に設定（この地図内 '+inView+'か所）。数字の丸は近接する候補数。';
    host.dataset.candidateCount=String(list.length);host.dataset.plannedVisible=String(state.planned);
    visits?.refresh();
  }
  panel.querySelectorAll('[data-map-layer]').forEach(input=>input.addEventListener('change',()=>{state[input.dataset.mapLayer]=input.checked;selectedId=null;render();}));
  document.getElementById('map-search').addEventListener('input',e=>{clearTimeout(timer);timer=setTimeout(()=>{state.query=e.target.value.trim().toLocaleLowerCase();selectedId=null;render();},100);});
  document.getElementById('clear-map-search').onclick=()=>{clearTimeout(timer);state.query='';document.getElementById('map-search').value='';selectedId=null;render();};
  document.getElementById('map-background').onchange=e=>changeBackground(e.target.value);
  document.getElementById('map-place-select').onchange=e=>showFocus(e.target.value,false);
  document.getElementById('show-all-candidates').onclick=()=>{clearTimeout(timer);for(const k of Object.keys(categories)){state[k]=true;panel.querySelector('[data-map-layer="'+k+'"]').checked=true;}state.query='';document.getElementById('map-search').value='';selectedId=null;fitLocations(available.map(coords));render();};
  document.getElementById('show-planned-only').onclick=()=>{clearTimeout(timer);for(const k of Object.keys(categories)){state[k]=false;panel.querySelector('[data-map-layer="'+k+'"]').checked=false;}state.planned=true;panel.querySelector('[data-map-layer="planned"]').checked=true;selectedId=null;render();};
  document.getElementById('fit-candidates').onclick=()=>fitLocations(filtered().map(coords));
  document.getElementById('local-map').onclick=()=>fitLocations([[32.805,130.97],[33.14,131.19]],11);
  document.getElementById('hita-map').onclick=()=>fitLocations(available.filter(p=>p.category==='titans').map(coords),13);
  document.getElementById('miyaji-map').onclick=()=>map.setView([32.9500,131.1162],16,{animate:false});
  document.getElementById('wide-map').onclick=()=>fitLocations([...available.map(coords),...Object.values(points).map(p=>p.slice(0,2))],11);
  document.querySelectorAll('.place').forEach(card=>{const p=byName.get(card.querySelector('h3')?.textContent);if(!p)return;const b=document.createElement('button');b.type='button';b.className='view-on-map';b.textContent='この地図に表示';b.addEventListener('click',()=>showFocus(p.id));(card.querySelector('.links')||card).prepend(b);});
  fitLocations([[32.805,130.97],[33.14,131.19]],11);
  let rendering=false;
  map.on('zoomend',()=>{if(rendering)return;rendering=true;render();rendering=false;});
  // Panning does not change marker proximity; keep popups alive during auto-pan.
  map.on('moveend',()=>{
    const list=filtered(),inView=list.filter(p=>map.getBounds().contains(coords(p))).length;
    document.getElementById('map-status').textContent='追加候補 '+list.length+' / '+candidates.length+'か所を表示対象に設定（この地図内 '+inView+'か所）。数字の丸は近接する候補数。';
  });
  render();
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>map.invalidateSize({pan:false})).observe(host);
})();