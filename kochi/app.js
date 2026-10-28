/* Material 3 UI. Existing record keys and dataset remain compatible. */
'use strict';
(async () => {
  const $ = id => document.getElementById(id);
  // Material Icons (Google, Apache-2.0); inline SVG avoids an icon-font dependency.
  const paths = {
    search:'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.49 20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    close:'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    list:'M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM4 4.5c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zM4 16.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 5h14v2H7zm0 6h14v2H7zm0 6h14v2H7z',
    map:'m20.5 3-.16.03L15 5.1 9 3 3.36 4.9A.5.5 0 0 0 3 5.38V20.5a.5.5 0 0 0 .5.5l.16-.03L9 18.9l6 2.1 5.64-1.9a.5.5 0 0 0 .36-.48V3.5a.5.5 0 0 0-.5-.5zM10 5.47l4 1.4v14l-4-1.4zm-5 1.35 3-1.01v11.4l-3 1.16zm14 10.98-3 1.01V7.17l3-1.16z',
    bookmark:'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z',
    star:'m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
    starFilled:'m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    tune:'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    info:'M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z',
    print:'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z',
    check:'m9 16.17-4.17-4.17L3.41 13.41 9 19l12-12-1.41-1.41z',
    expand:'m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z',
    download:'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v3h14v-3H5z',
    upload:'M5 17v4h14v-4h-2v2H7v-2H5zm7-14-7 7h4v6h6v-6h4l-7-7z',
    external:'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
    place:'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',
    warning:'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${paths[name] || paths.info}"></path></svg>`;
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = v => String(v).normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const safeUrl = v => { try { const u = new URL(v); return ['https:','http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  let toastTimer;
  function toast(message) { clearTimeout(toastTimer); $('snackbar-text').textContent = message; $('snackbar').hidden = false; toastTimer = setTimeout(() => { $('snackbar').hidden = true; }, 6500); }
  $('dismiss-snackbar').onclick = () => { clearTimeout(toastTimer); $('snackbar').hidden = true; };
  // Native dialogs provide Escape handling, a focus trap and focus restoration.
  document.querySelectorAll('[data-close-dialog]').forEach(b => b.onclick = () => $(b.dataset.closeDialog).close());
  $('show-info').onclick = () => $('info-dialog').showModal();
  const theme = matchMedia('(prefers-color-scheme: dark)');
  const syncTheme = () => document.querySelector('meta[name="theme-color"]').setAttribute('content', theme.matches ? '#141218' : '#fef7ff');
  theme.addEventListener('change', syncTheme); syncTheme();
  window.addEventListener('scroll', () => document.querySelector('.app-bar').classList.toggle('scrolled', scrollY > 0), {passive:true});
  // Ripple lives inside the component's visual container, not its expanded target.
  document.addEventListener('pointerdown', e => {
    if (e.button !== 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const control = e.target.closest('.md-button,.icon-button,.chip,.segmented button,.nav-item');
    const face = control?.querySelector('.button-face,.icon-face,.chip-face,.segment-face,.nav-indicator');
    if (!face || control.disabled) return;
    const r = face.getBoundingClientRect(), size = Math.max(r.width,r.height) * 2;
    const wave = document.createElement('span'); wave.className = 'ripple';
    Object.assign(wave.style,{width:size+'px',height:size+'px',left:(e.clientX-r.left-size/2)+'px',top:(e.clientY-r.top-size/2)+'px'});
    face.append(wave); setTimeout(() => wave.remove(),500);
  });
  let D;
  try { const r = await fetch('spots.json?v=20261028'); if (!r.ok) throw Error(); D = await r.json(); }
  catch { $('loading').innerHTML = 'スポットデータを読み込めませんでした。<a href="./">再読み込み</a>'; return; }
  if (Array.isArray(D.rows) && Array.isArray(D.fields)) D.spots = D.rows.map(row => ({...Object.fromEntries(D.fields.map((key,i) => [key,row[i]])),checked:D.checked}));
  if (!Array.isArray(D.spots)) { $('loading').textContent = 'データの形式を確認してください。'; return; }
  D.spots.forEach(s => { s.description = s.description.replace('コレクションション','コレクション'); });
  const KEY = 'kochi-field-notes-records-v1';
  const ids = new Set(D.spots.map(s => s.id));
  const valid = values => new Set(Array.isArray(values) ? values.filter(x => typeof x === 'string' && ids.has(x)) : []);
  const defaults = () => ({area:'',zone:'',favoriteOnly:false,hideVisited:false,cautionOnly:false});
  const state = {view:'spots',category:'',filters:defaults(),visible:[],favorites:new Set(),visited:new Set(),records:'favorites',mapTab:'area'};
  let storageFailed = false, map, markerLayer, mapPromise;
  try { const saved = JSON.parse(localStorage.getItem(KEY) || '{}'); state.favorites = valid(saved?.favorites); state.visited = valid(saved?.visited); } catch { storageFailed = true; }
  function persist() { try { localStorage.setItem(KEY,JSON.stringify({favorites:[...state.favorites],visited:[...state.visited]})); return true; } catch { toast('記録を保存できません。「記録」の書き出しを使用してください。'); return false; } }
  const searches = new Map(D.spots.map(s => [s.id,norm([s.name,D.areas[s.area][0],s.location,s.description,s.note,...s.categories].join(' '))]));
  $('total-count').textContent = `${D.spots.length}件 / ${D.categories.length}ジャンル / ${Object.keys(D.areas).length}エリア`;
  $('checked-date').textContent = D.checked;
  for (const [key,[name]] of Object.entries(D.areas)) { const op = document.createElement('option'); op.value = key; op.textContent = name; $('area').append(op); }
  function chip(label,attribute,value,selected=false) { return `<button class="chip" type="button" ${attribute}="${esc(value)}" aria-pressed="${selected}"><span class="chip-face"><span class="selection-icon">${icon('check')}</span>${esc(label)}</span></button>`; }
  $('categories').innerHTML = ['',...D.categories].map(c => chip(c || 'すべて','data-category',c,c==='')).join('');
  const mapQuery = s => `${s.name} 高知県 ${s.location.split('／')[0]}`;
  const mapsUrl = s => 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQuery(s));
  function card(s,context) {
    const favorite = state.favorites.has(s.id), visited = state.visited.has(s.id);
    return `<article class="card" data-id="${esc(s.id)}" id="${context}-${esc(s.id)}"><div class="card-header"><div><p class="card-area">${esc(D.areas[s.area][0])} · ${esc(s.zone)}</p><h3>${esc(s.name)}</h3></div><button class="icon-button favorite-button" type="button" data-favorite="${esc(s.id)}" aria-label="${esc(s.name)}のお気に入り" title="お気に入り" aria-pressed="${favorite}"><span class="icon-face">${icon(favorite?'starFilled':'star')}</span></button></div><p class="card-categories">${s.categories.map(esc).join(' · ')}</p><p class="card-description">${esc(s.description)}</p><dl class="card-info"><div><dt>場所</dt><dd>${esc(s.location)}</dd></div><div><dt>営業</dt><dd>${esc(s.hours)}</dd></div></dl>${s.flag?`<div class="caution">${icon('warning')}<div><strong>${esc(s.flag)}</strong>${esc(s.note)}</div></div>`:''}<details><summary>詳細・出典${icon('expand')}</summary>${!s.flag?`<p>${esc(s.note)}</p>`:''}<div class="sources">${s.sources.map(src => `<a href="${esc(safeUrl(src.url))}" target="_blank" rel="noopener noreferrer">${esc(src.label)}${icon('external')}</a>`).join('')}<a href="${esc(mapsUrl(s))}" target="_blank" rel="noopener noreferrer">Googleマップ${icon('external')}</a></div><span class="checked">確認日：${esc(s.checked)} / 当日営業は未確認</span></details><div class="card-actions"><label class="check-label"><span class="check-target"><input type="checkbox" data-visited="${esc(s.id)}" ${visited?'checked':''} aria-label="${esc(s.name)}の訪問済み記録"><span class="check-box"></span></span><span>訪問済み</span></label><button class="md-button tonal" type="button" data-map="${esc(s.id)}"><span class="button-face">${icon('place')}地図</span></button></div></article>`;
  }
  function renderCards(container,spots,context) {
    const opened = new Set([...container.querySelectorAll('details[open]')].map(d => d.closest('.card').dataset.id));
    const active = document.activeElement, focused = container.contains(active);
    const action = focused && (active.dataset.favorite ? ['favorite',active.dataset.favorite] : active.dataset.visited ? ['visited',active.dataset.visited] : null);
    const oldCards = [...container.querySelectorAll('.card')], oldIndex = focused ? oldCards.indexOf(active.closest('.card')) : -1;
    container.innerHTML = spots.map(s => card(s,context)).join('');
    container.querySelectorAll('.card').forEach(c => { if (opened.has(c.dataset.id)) c.querySelector('details').open = true; });
    if (action) { const same = container.querySelector(`[data-${action[0]}="${action[1]}"]`); const fallback = container.querySelectorAll('.card')[Math.min(oldIndex,spots.length-1)]?.querySelector('button'); (same || fallback || (context==='spot'?$('q'):$('record-favorites'))).focus({preventScroll:true}); }
  }
  function filterEntries() {
    const f = state.filters;
    return [['area',f.area?D.areas[f.area][0]:''],['zone',f.zone],['favoriteOnly',f.favoriteOnly?'お気に入りのみ':''],['hideVisited',f.hideVisited?'訪問済みを除く':''],['cautionOnly',f.cautionOnly?'注意事項あり':'']].filter(([,label]) => label);
  }
  function renderRecords() {
    const list = D.spots.filter(s => state[state.records].has(s.id));
    renderCards($('record-cards'),list,'record');
    $('records-empty').hidden = list.length > 0;
    $('records-empty-label').textContent = state.records === 'favorites' ? 'お気に入りはありません' : '訪問記録はありません';
    $('favorites-count').textContent = state.favorites.size; $('visited-count').textContent = state.visited.size;
    $('record-favorites').setAttribute('aria-pressed',String(state.records==='favorites')); $('record-visited').setAttribute('aria-pressed',String(state.records==='visited'));
  }
  function counts() { const n = {}; state.visible.forEach(s => { n[s.area] = (n[s.area] || 0)+1; }); return n; }
  function render() {
    const f=state.filters, terms=norm($('q').value).trim().split(/\s+/).filter(Boolean);
    state.visible=D.spots.filter(s => (!state.category||s.categories.includes(state.category))&&(!f.area||s.area===f.area)&&(!f.zone||s.zone===f.zone)&&(!f.favoriteOnly||state.favorites.has(s.id))&&(!f.hideVisited||!state.visited.has(s.id))&&(!f.cautionOnly||s.flag)&&terms.every(t=>searches.get(s.id).includes(t)));
    if ($('sort').value==='area') { const keys=Object.keys(D.areas); state.visible.sort((a,b)=>keys.indexOf(a.area)-keys.indexOf(b.area)); }
    if ($('sort').value==='name') state.visible.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
    renderCards($('cards'),state.visible,'spot');
    $('result-count').textContent = `${state.visible.length}件`;
    $('map-count').textContent = `${state.visible.length}件`;
    $('empty').hidden = state.visible.length > 0; $('clear-search').hidden = !$('q').value;
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
    const entries = filterEntries(); $('filter-count').textContent = entries.length ? ` (${entries.length})` : '';
    $('active-filters').hidden = !entries.length;
    $('active-filters').innerHTML = entries.map(([key,label])=>`<button class="chip" type="button" data-remove="${key}" aria-label="${esc(label)}を解除"><span class="chip-face">${esc(label)}${icon('close')}</span></button>`).join('');
    const n=counts(); $('area-buttons').innerHTML=Object.entries(D.areas).map(([key,[name]])=>chip(`${name} ${n[key]||0}件`,'data-area',key,f.area===key)).join('');
    updateMap(); renderRecords();
  }
  function reset() {state.filters=defaults();state.category='';$('q').value='';$('sort').value='editorial';render();}
  $('reset').onclick=()=>{reset();$('q').focus();};
  $('q').addEventListener('input',render); $('sort').addEventListener('change',render);
  $('clear-search').onclick=()=>{$('q').value='';render();$('q').focus();};
  $('categories').onclick=e=>{const b=e.target.closest('[data-category]');if(b){state.category=b.dataset.category;render();}};
  $('active-filters').onclick=e=>{const b=e.target.closest('[data-remove]');if(b){const key=b.dataset.remove;state.filters[key]=defaults()[key];render();$('open-filters').focus({preventScroll:true});}};
  // Arrow navigation supplements native button semantics for chip groups.
  document.querySelectorAll('.chips,.segmented').forEach(group=>group.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    const buttons=[...group.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(i<0)return;
    e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[j].focus();
  }));
  const filterIds={favoriteOnly:'favorite-only',hideVisited:'hide-visited',cautionOnly:'caution-only'};
  function fillFilters(f) {$('area').value=f.area;$('zone').value=f.zone;Object.entries(filterIds).forEach(([k,id])=>{$(id).checked=f[k];});}
  $('open-filters').onclick=()=>{fillFilters(state.filters);$('filter-dialog').showModal();};
  $('reset-filters').onclick=()=>fillFilters(defaults());
  $('filter-form').onsubmit=e=>{e.preventDefault();state.filters.area=$('area').value;state.filters.zone=$('zone').value;Object.entries(filterIds).forEach(([k,id])=>{state.filters[k]=$(id).checked;});$('filter-dialog').close();render();};
  function navigate(view,focus=false) {
    if(!['spots','map','records'].includes(view))view='spots';
    state.view=view;document.querySelectorAll('.view').forEach(s=>{s.hidden=s.id!==view;});
    document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $('print').hidden=view!=='spots';
    if(view==='map')setMapTab(state.mapTab);
    if(focus){window.scrollTo({top:0,behavior:'auto'});(view==='spots'?$('q'):$(view+'-title')).focus({preventScroll:true});}
  }
  function go(view) {if(location.hash==='#'+view)navigate(view,true);else location.hash=view;}
  window.addEventListener('hashchange',()=>navigate(location.hash.slice(1),true));
  function cardClick(e) {
    const f=e.target.closest('[data-favorite]');if(f){const id=f.dataset.favorite;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);const saved=persist();render();if(saved)toast(state.favorites.has(id)?'お気に入りに追加しました':'お気に入りを解除しました');return;}
    const b=e.target.closest('[data-map]');if(b){const s=D.spots.find(s=>s.id===b.dataset.map);if(s)showPlace(s);}
  }
  function cardChange(e) {const b=e.target.closest('[data-visited]');if(!b)return;const id=b.dataset.visited;b.checked?state.visited.add(id):state.visited.delete(id);persist();render();}
  ['cards','record-cards'].forEach(id=>{$(id).onclick=cardClick;$(id).onchange=cardChange;});
  $('record-favorites').onclick=()=>{state.records='favorites';renderRecords();};$('record-visited').onclick=()=>{state.records='visited';renderRecords();};
  let printDetails=[];
  window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('.view:not([hidden]) .card details')].map(d=>[d,d.open]);printDetails.forEach(([d])=>{d.open=true;});});
  window.addEventListener('afterprint',()=>{printDetails.forEach(([d,open])=>{d.open=open;});printDetails=[];});
  $('print').onclick=()=>window.print();
  $('export').onclick=()=>{
    const data={app:'kochi-field-notes',version:1,exportedAt:new Date().toISOString(),favorites:[...state.favorites],visited:[...state.visited]};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='kochi-records-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('記録を書き出しました');
  };
  $('import-button').onclick=()=>$('import').click();
  $('import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>1024*1024)throw Error('ファイルが大きすぎます');const x=JSON.parse(await file.text());if(x?.app!=='kochi-field-notes'||x.version!==1||!Array.isArray(x.favorites)||!Array.isArray(x.visited))throw Error('高知版の記録ファイルではありません');valid(x.favorites).forEach(id=>state.favorites.add(id));valid(x.visited).forEach(id=>state.visited.add(id));const saved=persist();render();if(saved)toast('記録を追加しました');}catch(err){toast('読み込めませんでした：'+err.message);}finally{e.target.value='';}};
  function updateMap() {
    if(!map||!markerLayer)return;const n=counts();markerLayer.clearLayers();
    Object.entries(D.areas).forEach(([key,[name,point]])=>{if(!n[key])return;
      const marker=window.L.marker(point,{icon:window.L.divIcon({className:'area-marker',html:`<span class="area-dot">${n[key]}</span>`,iconSize:[32,32],iconAnchor:[16,16]}),title:`${name} ${n[key]}件（エリア代表位置）`});
      const popup=document.createElement('div'),title=document.createElement('b'),p=document.createElement('p'),button=document.createElement('button');
      title.textContent=name;p.textContent=`${n[key]}件 / エリアの代表位置`;button.className='md-button text';button.innerHTML='<span class="button-face">このエリアで絞り込む</span>';button.onclick=()=>{state.filters.area=key;render();map.closePopup();go('spots');};popup.append(title,p,button);marker.bindPopup(popup).addTo(markerLayer);
    });
  }
  function initMap() {
    if(map){setTimeout(()=>map.invalidateSize(),50);return Promise.resolve();}if(mapPromise)return mapPromise;
    mapPromise=new Promise((resolve,reject)=>{
      if(window.L){resolve();return;}
      if(!document.querySelector('[data-leaflet-css]')){const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.dataset.leafletCss='';document.head.append(css);}
      const js=document.createElement('script');js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      const timer=setTimeout(()=>{js.remove();reject(Error('timeout'));},10000);
      js.onload=()=>{clearTimeout(timer);resolve();};js.onerror=()=>{clearTimeout(timer);js.remove();reject(Error('unavailable'));};document.head.append(js);
    }).then(()=>{
      if(!window.L)throw Error('unavailable');$('area-map').textContent='';map=window.L.map('area-map',{scrollWheelZoom:false}).setView([33.61,133.55],9);
      const tiles=window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      let warned=false;tiles.on('tileerror',()=>{if(!warned){toast('背景地図を読み込めません。エリアボタンは使用できます。');warned=true;}});
      markerLayer=window.L.layerGroup().addTo(map);updateMap();setTimeout(()=>map.invalidateSize(),50);
    }).catch(()=>{$('area-map').innerHTML='<p class="map-message">地図を読み込めませんでした。下のエリアボタン、または各スポットのGoogleマップリンクを使用してください。</p>';mapPromise=null;});return mapPromise;
  }
  function setMapTab(mode) {state.mapTab=mode;$('area-map-wrap').hidden=mode!=='area';$('place-map-wrap').hidden=mode!=='place';$('area-map-tab').setAttribute('aria-pressed',String(mode==='area'));$('place-map-tab').setAttribute('aria-pressed',String(mode==='place'));if(mode==='area'&&state.view==='map')initMap();}
  $('area-map-tab').onclick=()=>setMapTab('area');$('place-map-tab').onclick=()=>setMapTab('place');
  $('area-buttons').onclick=e=>{const b=e.target.closest('[data-area]');if(b){state.filters.area=state.filters.area===b.dataset.area?'':b.dataset.area;render();go('spots');}};
  function showPlace(s) {state.mapTab='place';$('map-place-title').textContent=s.name;$('map-external').href=mapsUrl(s);$('place-map-empty').hidden=true;$('place-map-content').hidden=false;$('place-map').title=s.name+'のGoogleマップ検索結果';$('place-map').src='https://maps.google.com/maps?q='+encodeURIComponent(mapQuery(s))+'&output=embed&hl=ja';go('map');}
  $('loading').hidden=true;render();navigate(location.hash.slice(1));
  if(storageFailed)toast('保存済みの記録を読み込めませんでした。記録ファイルから復元できます。');
})();
