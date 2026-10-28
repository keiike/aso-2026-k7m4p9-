/* Kochi Field Notes — no itinerary, no automatic location collection. */
'use strict';
(async () => {
  let D;
  try { D = window.KOCHI_DATA || await fetch('spots.json?v=20261028').then(r => { if (!r.ok) throw Error('data unavailable'); return r.json(); }); } catch { D = null; }
  if (D && Array.isArray(D.rows) && Array.isArray(D.fields)) D.spots = D.rows.map(row => ({...Object.fromEntries(D.fields.map((key,i)=>[key,row[i]])),checked:D.checked}));
  const $ = id => document.getElementById(id);
  if (!D || !Array.isArray(D.spots)) { $('cards').textContent = '候補データを読み込めませんでした。再読み込みしてください。'; return; }
  // Correct a typographic duplication in the source snapshot.
  D.spots.forEach(s => { s.description = s.description.replace('コレクションション','コレクション'); });
  const KEY = 'kochi-field-notes-records-v1';
  const ids = new Set(D.spots.map(s => s.id));
  const state = { category: '', visible: [], favorites: new Set(), visited: new Set() };
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = v => String(v).normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const valid = values => new Set(Array.isArray(values) ? values.filter(x => typeof x === 'string' && ids.has(x)) : []);
  const safeUrl = value => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  let toastTimer, map, markerLayer, mapPromise, activeMap = 'area', storageFailed = false;
  function toast(message) { clearTimeout(toastTimer); $('toast').textContent = message; $('toast').hidden = false; toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5500); }
  try { const saved = JSON.parse(localStorage.getItem(KEY) || '{}'); state.favorites = valid(saved?.favorites); state.visited = valid(saved?.visited); }
  catch { storageFailed = true; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify({favorites:[...state.favorites],visited:[...state.visited]})); } catch { toast('このブラウザでは記録を保存できません。「記録を保存」でファイルへ退避してください。'); } }
  const searches = new Map(D.spots.map(s => [s.id, norm([s.name,D.areas[s.area][0],s.location,s.description,s.note,...s.categories].join(' '))]));
  $('total-count').textContent = D.spots.length;
  $('scope-stats').innerHTML = ['中心圏','＋α','遠方参考'].map(z => `<span>${esc(z)}<b>${D.spots.filter(s=>s.zone===z).length}</b></span>`).join('');
  for (const [key,[name]] of Object.entries(D.areas)) { const op = document.createElement('option'); op.value=key; op.textContent=name; $('area').append(op); }
  $('categories').innerHTML = ['',...D.categories].map(c=>`<button type="button" data-category="${esc(c)}" aria-pressed="${c==='' ? 'true':'false'}">${esc(c||'すべて')} <small>${c ? D.spots.filter(s=>s.categories.includes(c)).length : D.spots.length}</small></button>`).join('');
  function mapQuery(s) { return `${s.name} 高知県 ${s.location.split('／')[0]}`; }
  function mapsUrl(s) { return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQuery(s)); }
  function card(s) {
    const favorite=state.favorites.has(s.id), visited=state.visited.has(s.id);
    return `<article class="card${visited?' is-visited':''}" id="spot-${esc(s.id)}" data-id="${esc(s.id)}"><div class="card-top"><div class="area-label"><span class="zone">${esc(s.zone)}</span><br>${esc(D.areas[s.area][0])}</div><button class="favorite" type="button" data-favorite="${esc(s.id)}" aria-label="${esc(s.name)}をお気に入り${favorite?'から解除':'に追加'}" aria-pressed="${favorite}">${favorite?'★':'☆'}</button></div><h3>${esc(s.name)}</h3><div class="card-tags">${s.pick?'<span class="pick">阿蘇版と好相性</span>':''}${s.categories.map(c=>`<span>${esc(c)}</span>`).join('')}</div><p class="desc">${esc(s.description)}</p><dl class="card-info"><div><dt>場所</dt><dd>${esc(s.location)}</dd></div><div><dt>営業</dt><dd>${esc(s.hours)}</dd></div></dl>${s.flag?`<p class="caution"><strong>${esc(s.flag)}</strong>${esc(s.note)}</p>`:''}<details><summary>${s.flag?'出典・地図リンク':'訪問メモ・出典'}</summary>${!s.flag?`<p>${esc(s.note)}</p>`:''}<div class="sources">${s.sources.map(src=>`<a href="${esc(safeUrl(src.url))}" target="_blank" rel="noopener noreferrer">${esc(src.label)} ↗</a>`).join('')}<a href="${esc(mapsUrl(s))}" target="_blank" rel="noopener noreferrer">Googleマップで直接検索 ↗</a></div><span class="checked">公開情報確認 ${esc(s.checked)} · 当日営業は未照会</span></details><div class="card-actions"><button type="button" data-map="${esc(s.id)}">地図で見る ↗</button><label><input type="checkbox" data-visited="${esc(s.id)}" ${visited?'checked':''} aria-label="${esc(s.name)}の訪問済み記録">訪問済み</label></div></article>`;
  }
  function render() {
    const terms=norm($('q').value).trim().split(/\s+/).filter(Boolean);
    state.visible = D.spots.filter(s => (!state.category||s.categories.includes(state.category)) && (!$('area').value||s.area===$('area').value) && (!$('zone').value||s.zone===$('zone').value) && (!$('picked').checked||s.pick) && (!$('favorite-only').checked||state.favorites.has(s.id)) && (!$('hide-visited').checked||!state.visited.has(s.id)) && (!$('caution-only').checked||s.flag) && terms.every(t=>searches.get(s.id).includes(t)));
    if ($('sort').value==='area') { const keys=Object.keys(D.areas); state.visible.sort((a,b)=>keys.indexOf(a.area)-keys.indexOf(b.area)); }
    if ($('sort').value==='name') state.visible.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
    $('cards').innerHTML=state.visible.map(card).join('');
    $('result-count').textContent=state.visible.length;
    $('empty').hidden=state.visible.length>0;
    const labels=[state.category, $('area').value?D.areas[$('area').value][0]:'', $('zone').value, $('q').value.trim()?`「${$('q').value.trim()}」`:'', $('picked').checked?'好相性':'', $('favorite-only').checked?'お気に入り':'', $('hide-visited').checked?'未訪問':'', $('caution-only').checked?'注意あり':''].filter(Boolean);
    $('filter-summary').textContent=labels.join(' / ')||'すべての候補 · ジャンルは重複あり';
    $('record-counts').textContent=`お気に入り ${state.favorites.size} / 訪問済み ${state.visited.size}`;
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
    renderAreaButtons(); updateMap();
  }
  function reset() { ['q','area','zone'].forEach(id=>$(id).value=''); ['picked','favorite-only','hide-visited','caution-only'].forEach(id=>$(id).checked=false); $('sort').value='editorial'; state.category=''; render(); }
  $('q').addEventListener('input',render);
  ['area','zone','picked','favorite-only','hide-visited','caution-only','sort'].forEach(id=>$(id).addEventListener('change',render));
  $('categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){state.category=b.dataset.category;render();}});
  ['reset','empty-reset'].forEach(id=>$(id).addEventListener('click',reset));
  $('show-cautions').addEventListener('click',()=>{reset();$('caution-only').checked=true;render();$('results').scrollIntoView({behavior:'smooth'});});
  $('cards').addEventListener('click',e=>{
    const f=e.target.closest('[data-favorite]'); if(f){const id=f.dataset.favorite;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);persist();render();document.querySelector(`[data-favorite="${id}"]`)?.focus({preventScroll:true});return;}
    const b=e.target.closest('[data-map]');if(b){const s=D.spots.find(s=>s.id===b.dataset.map);if(s)showPlace(s);}
  });
  $('cards').addEventListener('change',e=>{const box=e.target.closest('[data-visited]');if(!box)return; const id=box.dataset.visited;box.checked?state.visited.add(id):state.visited.delete(id);persist();render();document.querySelector(`[data-visited="${id}"]`)?.focus({preventScroll:true});});
  $('print').addEventListener('click',()=>{const details=[...$('cards').querySelectorAll('details')];const old=details.map(d=>d.open);details.forEach(d=>d.open=true);window.print();details.forEach((d,i)=>d.open=old[i]);});
  function exportRecords() { const data={app:'kochi-field-notes',version:1,exportedAt:new Date().toISOString(),favorites:[...state.favorites],visited:[...state.visited]};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='kochi-records-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('記録ファイルを保存しました。'); }
  $('export').addEventListener('click',exportRecords);
  $('import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>1024*1024)throw Error('ファイルが大きすぎます。');const x=JSON.parse(await file.text());if(x?.app!=='kochi-field-notes'||x.version!==1||!Array.isArray(x.favorites)||!Array.isArray(x.visited))throw Error('高知版の記録ファイルではありません。');valid(x.favorites).forEach(id=>state.favorites.add(id));valid(x.visited).forEach(id=>state.visited.add(id));persist();render();toast('記録を追加しました。既存の記録は残しています。');}catch(err){toast('読み込めませんでした：'+err.message);}finally{e.target.value='';}});
  function counts() { const n={};state.visible.forEach(s=>n[s.area]=(n[s.area]||0)+1);return n; }
  function renderAreaButtons() { const n=counts();$('area-buttons').innerHTML=Object.entries(D.areas).map(([key,[name]])=>`<button type="button" data-area="${key}" aria-pressed="${$('area').value===key}">${esc(name)} · ${n[key]||0}</button>`).join(''); }
  $('area-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-area]');if(b){$('area').value=$('area').value===b.dataset.area?'':b.dataset.area;render();}});
  function updateMap() { if(!map||!markerLayer)return;const n=counts();markerLayer.clearLayers();Object.entries(D.areas).forEach(([key,[name,point]])=>{if(!n[key])return; const marker=L.marker(point,{icon:L.divIcon({className:'area-marker',html:`<span class="area-dot">${n[key]}</span>`,iconAnchor:[15,14]}),title:`${name}（エリア代表点） ${n[key]}件`});const popup=document.createElement('div');const b=document.createElement('b');b.textContent=name;const p=document.createElement('p');p.textContent=`${n[key]}件 / この丸は店舗位置ではありません`;const button=document.createElement('button');button.textContent='このエリアで絞る';button.addEventListener('click',()=>{$('area').value=key;render();map.closePopup();});popup.append(b,p,button);marker.bindPopup(popup).addTo(markerLayer);}); }
  function initMap() { if(map){setTimeout(()=>map.invalidateSize(),80);return Promise.resolve();} if(mapPromise)return mapPromise;
    mapPromise=new Promise((resolve,reject)=>{if(window.L){resolve();return;}const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(css);const js=document.createElement('script');js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';js.onload=resolve;js.onerror=()=>reject(Error('map unavailable'));document.head.append(js);setTimeout(()=>{if(!window.L)reject(Error('map timeout'));},12000);}).then(()=>{if(!window.L)throw Error('no map');$('area-map').textContent='';map=L.map('area-map',{scrollWheelZoom:false}).setView([33.61,133.55],9);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);markerLayer=L.layerGroup().addTo(map);updateMap();setTimeout(()=>map.invalidateSize(),80);}).catch(()=>{$('area-map').textContent='地図を読み込めませんでした。下のエリアボタン、またはカードのGoogleマップリンクをご利用ください。';mapPromise=null;});return mapPromise;
  }
  function setMapTab(mode) {activeMap=mode;$('area-map-wrap').hidden=mode!=='area';$('place-map-wrap').hidden=mode!=='place';$('area-map-tab').setAttribute('aria-pressed',String(mode==='area'));$('place-map-tab').setAttribute('aria-pressed',String(mode==='place'));if(mode==='area'&&!$('map-panel').hidden)initMap();}
  function openMap() {$('map-panel').hidden=false;$('map-toggle').textContent='地図を閉じる';$('map-toggle').setAttribute('aria-expanded','true');}
  $('map-toggle').addEventListener('click',()=>{if($('map-panel').hidden){openMap();setMapTab(activeMap);}else{$('map-panel').hidden=true;$('map-toggle').textContent='地図を開く';$('map-toggle').setAttribute('aria-expanded','false');}});
  $('area-map-tab').addEventListener('click',()=>setMapTab('area'));$('place-map-tab').addEventListener('click',()=>setMapTab('place'));
  function showPlace(s) {openMap();setMapTab('place');$('map-place-title').textContent=s.name;$('map-external').href=mapsUrl(s);$('map-external').hidden=false;$('place-map-empty').hidden=true;$('place-map').hidden=false;$('place-map').title=s.name+'のGoogleマップ検索結果';$('place-map').src='https://maps.google.com/maps?q='+encodeURIComponent(mapQuery(s))+'&output=embed&hl=ja';$('map-section').scrollIntoView({behavior:'smooth'});}
  render();if(storageFailed)toast('保存済み記録を読み込めませんでした。新しい記録はファイルへ保存できます。');
})();
