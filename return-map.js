/* Selected 9/22 return course, drawn as schematic visit-order lines, not road navigation.
 * Uses the existing public reference points; never reads or requests device location. */
(() => {
  'use strict';
  const ctx = window.AsoTripMap;
  if (!ctx || typeof L === 'undefined' || window.AsoReturnMap) return;
  const {map, planned, history, points, byName, panel, host} = ctx;
  const visits = window.AsoVisits;
  const color = '#37739d';
  const allowed = ['hails', 'Grandma ATQ', '彼方 kanata', 'Anvin.store'];
  let selected = [], signature = null, stops = [];
  map.createPane('returnLines'); map.getPane('returnLines').style.zIndex = 400;
  map.createPane('returnStops'); map.getPane('returnStops').style.zIndex = 475;
  const style = document.createElement('style');
  style.textContent = `
    .return-map-note{border-left:3px solid #37739d;background:#f0f5f8;padding:9px 11px;margin:10px 0;font-size:12px}
    .return-map-note p{margin:4px 0;overflow-wrap:anywhere}.return-map-note .return-map-buttons{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
    .return-map-note button{padding:6px 9px;min-height:38px}.return-map-note a{display:inline-block;padding:4px 0}
    #return-map-chain{font-size:11px;line-height:1.65;color:#38536a}#return-map-visibility{font-size:11px;color:#6a5b36}
    .return-history{display:flex;align-items:center;gap:7px;min-height:38px;font-size:12px}.return-history input{width:18px;height:18px}
    .return-pin .route-face{width:29px;height:29px;border-width:2px;font-size:12px}.return-pin{background:none!important;border:0!important}
    .return-arrow{background:none!important;border:0!important;pointer-events:none!important}.return-arrow svg{display:block;width:16px;height:16px;filter:drop-shadow(0 0 1px white)}
    @media print{.return-map-buttons,.return-history,#return-map-visibility{display:none!important}}
  `;
  document.head.append(style);
  const notice = document.createElement('div'); notice.className = 'return-map-note'; notice.id = 'return-map-note';
  notice.innerHTML = '<b>9/22の帰路｜青い番号と矢印</b><p id="return-map-chain" role="status" aria-live="polite"></p><p>線は立ち寄る順番を結んだ概略線です。道路形状・所要時間・通行可否を示すナビではありません。</p><div class="return-map-buttons"><button id="fit-return-route" type="button">帰路全体を表示</button><button id="fit-return-local" type="button">阿蘇〜熊本を拡大</button><button id="fit-return-city" type="button">熊本の店巡りを拡大</button></div><label class="return-history"><input id="return-map-history" type="checkbox">1・2日目の行程も表示（参考）</label><p id="return-map-visibility"></p><a href="#return-course">店の選択・区間別ナビはこちら ↓</a>';
  panel.after(notice);
  const plannedInput = panel.querySelector('[data-map-layer="planned"]');
  if (plannedInput) plannedInput.parentElement.lastChild.textContent = '9/22の帰路';
  const legend = host.closest('section')?.querySelector('.legend');
  function updateLegend() {
    if (!legend) return;
    const show = document.getElementById('return-map-history').checked;
    const parts = Array.from(legend.children);
    parts.slice(0,2).forEach(el => {el.hidden = !show;});
    if (parts[2]) parts[2].lastChild.textContent = '9/22 提案した帰路';
  }
  function returnToGsi() {
    const selector = document.getElementById('map-background');
    if (selector?.value === 'google') {selector.value = 'pale'; selector.dispatchEvent(new Event('change', {bubbles:true}));}
  }
  function visibilityNote() {
    const google = document.getElementById('map-background')?.value === 'google';
    document.getElementById('return-map-visibility').textContent = google ? 'Google埋め込みには独自ルートは重なりません。「帰路全体を表示」で地理院地図へ戻ります。' : plannedInput && !plannedInput.checked ? '帰路は非表示です。「帰路全体を表示」で再表示できます。' : '「今回寄る」と訪問済み除外の設定を、地図と経路リンクに同時反映します。';
  }
  function showRoute() {
    returnToGsi();
    if (plannedInput && !plannedInput.checked) {plannedInput.checked = true; plannedInput.dispatchEvent(new Event('change', {bubbles:true}));}
    visibilityNote();
  }
  function fit(list, maxZoom = 14) {
    if (!list.length) return;
    showRoute(); map.closePopup(); map.invalidateSize({pan:false});
    map.fitBounds(L.latLngBounds(list.map(p => p.position)), {paddingTopLeft:[30,85], paddingBottomRight:[30,30], maxZoom, animate:false});
  }
  function landmark(key, name, purpose, visitName) {
    const p = points[key];
    return {name, position:p.slice(0,2), query:p[3], purpose, visitName, precision:'既存行程の参照位置。店舗入口・駐車場ではありません。'};
  }
  function candidate(name, purpose) {
    const p = byName.get(name);
    if (!p?.geo) return null;
    return {name, position:[p.geo.lat,p.geo.lng], query:p.name+' '+p.address, purpose, visitName:name, source:p.geo.source || p.source, precision:p.geo.precision === 'area' ? '掲載地図の周辺目安です。入口や駐車場はGoogleマップで確認してください。' : '公表座標・住所代表点に基づく位置です。入口や駐車場とは限りません。'};
  }
  function buildStops() {
    const start = landmark('base','村田家旅館（高森）','出発｜09:00の計画枠','村田家旅館');
    const factory = candidate('ASO MILK FACTORY','スイーツ｜10:00〜10:30の計画枠');
    const daikan = landmark('daikan','大観峰方面','ミルクロードへ｜展望休憩は任意。訪問済みでも経由点として残します。','大観峰');
    const kabuto = landmark('milk','かぶと岩展望所','ミルクロードを西へ｜展望休憩の候補','ミルクロード');
    const futae = {name:'二重峠付近', position:[32.9115691,130.9687344], query:'二重峠 阿蘇市', purpose:'西へ抜ける経由点｜散策を必須にはしていません。', precision:'阿蘇市観光協会の地図リンクによる峠の参照点。車道の経由位置を厳密に指定するものではありません。石畳の散策路には車で進入しないでください。', source:'https://www.asocity-kanko.jp/spot/hutaenotouge/'};
    const lunch = candidate('道の駅 大津','昼食｜12:00〜13:00の計画枠。混雑時は周辺店へ。');
    const shops = selected.map(name => candidate(name,'午後の古道具店｜営業時間と駐車場は当日確認。'));
    const home = landmark('nakasu','福岡・中洲','帰福｜給油・駐車。レンタカー返却は翌23日08:00。');
    return [start,factory,daikan,kabuto,futae,lunch,...shops,home].filter(Boolean);
  }
  function link(url, text) {
    const a = document.createElement('a');a.href = url;a.textContent = text;a.target = '_blank';a.rel = 'noopener noreferrer';return a;
  }
  function popup(p, i) {
    const box = document.createElement('div');box.className = 'map-popup';
    const small = document.createElement('small');small.textContent = '9/22 最新の帰路｜'+(i+1)+' / '+stops.length;
    const h = document.createElement('h3');h.textContent = p.name;
    const note = document.createElement('p');note.textContent = p.purpose;
    const precision = document.createElement('p');precision.className='precision';precision.textContent=p.precision;
    box.append(small,h,note,precision);
    const links = document.createElement('div');links.className = 'popup-links';
    links.append(link('https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:p.query}),'Googleマップで確認 ↗'));
    if (p.source) links.append(link(p.source,'位置の参照元 ↗'));
    const next = stops[i+1];
    if (next) links.append(link('https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:p.query,destination:next.query,travelmode:'driving'}),'次の地点へ ↗'));
    box.append(links);
    if (p.visitName && visits) box.append(visits.control(p.visitName));
    return box;
  }
  function draw() {
    stops = buildStops(); planned.clearLayers();
    for (let i=0; i<stops.length-1; i++) {
      const a=stops[i], b=stops[i+1];
      L.polyline([a.position,b.position],{pane:'returnLines',color,weight:4,opacity:.88,dashArray:'8 6',interactive:false,className:'return-route-line'}).addTo(planned);
      const pa=map.project(a.position,10), pb=map.project(b.position,10), mid=map.unproject(pa.add(pb).divideBy(2),10);
      const angle=Math.atan2(pb.y-pa.y,pb.x-pa.x)*180/Math.PI;
      L.marker(mid,{pane:'returnLines',interactive:false,keyboard:false,icon:L.divIcon({className:'return-arrow',html:'<svg viewBox="0 0 16 16" aria-hidden="true" style="transform:rotate('+angle+'deg)"><path d="M2 2 L14 8 L2 14 L5 8 Z" fill="'+color+'" stroke="white" stroke-width="1"/></svg>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(planned);
    }
    stops.forEach((p,i) => {
      const marker=L.marker(p.position,{pane:'returnStops',title:p.name,returnStopName:p.name,icon:L.divIcon({className:'route-pin return-pin',html:'<span class="route-face" style="--pin:'+color+'">'+(i+1)+'</span>',iconSize:[29,29],iconAnchor:[14.5,14.5]})}).bindTooltip((i+1)+'｜'+p.name,{direction:'top'}).bindPopup(popup(p,i),{maxWidth:290,maxHeight:300}).addTo(planned);
      if (p.visitName) visits?.bindMarker(marker,[p.visitName]);
    });
    host.dataset.returnStops = JSON.stringify(stops.map(p=>p.name));
    host.dataset.returnShops = JSON.stringify(selected);
    host.dataset.returnVersion = '20260922-map2';
    notice.querySelector('#return-map-chain').textContent = stops.map((p,i)=>(i+1)+' '+p.name).join(' → ');
    visits?.refresh();visibilityNote();
  }
  function setShops(names) {
    const safe = new Set(Array.isArray(names) ? names : []);
    const next = allowed.filter(name=>safe.has(name));
    const key=JSON.stringify(next);if(key===signature)return;
    signature=key; selected=next;draw();
  }
  document.getElementById('return-map-history').addEventListener('change',event=>{
    returnToGsi();if(event.target.checked)history.addTo(map);else map.removeLayer(history);
    host.dataset.historyVisible=String(event.target.checked);updateLegend();
  });
  document.getElementById('fit-return-route').onclick=()=>fit(stops,12);
  document.getElementById('fit-return-local').onclick=()=>fit(stops.slice(0,-1),12);
  document.getElementById('fit-return-city').onclick=()=>{
    const city=stops.filter(p=>allowed.includes(p.name));
    fit(city.length ? city : [candidate('道の駅 大津','昼食')].filter(Boolean),14);
  };
  plannedInput?.addEventListener('change',visibilityNote);
  document.getElementById('map-background')?.addEventListener('change',()=>setTimeout(visibilityNote,0));
  window.AsoReturnMap=Object.freeze({setShops,fit:()=>fit(stops,12)});
  host.dataset.historyVisible='false';updateLegend();
  setShops(['hails','Anvin.store'].filter(name=>!visits?.has(name)));
  // Start with the relevant Aso-Kumamoto segment visible; Fukuoka is in the full-route view.
  fit(stops.slice(0,-1),12);
})();