/* Visits are manual, local to this browser, and never inferred from geolocation. */
(() => {
  'use strict';
  const KEY = 'aso-2026-k7m4p9-:visited:v1';
  const DAYS = [
    ['トヨタレンタカー中洲店','セカンドストリート日田店','Au Pan & Coffee','Patisserie ROKU 麓','黒川温泉','大観峰','村田家旅館'],
    ['草千里ヶ浜','阿蘇火山博物館','米塚','阿蘇神社・門前町','komeko','TOMMY’Sアンティーク＆ステンドグラス','森本金物店・阿蘇昭和レトロ雑貨','etu','みやがわ時計店','上色見熊野座神社'],
    ['白川水源','めるころ パン工房','もちとこ','ミルクロード']
  ];
  const guide = typeof ASO_GUIDE === 'undefined' ? {} : ASO_GUIDE;
  const candidateNames = ['clothing','antiques','classics','titans'].flatMap(k => (guide[k] || []).map(p => p.name));
  const names = new Set([...DAYS.flat(), ...candidateNames]);
  let saved = {}, storageOk = true;
  const markers = new Set();
  function read() {
    const text = localStorage.getItem(KEY);
    if (!text) return {};
    const data = JSON.parse(text);
    if (data.version !== 1 || !data.places || typeof data.places !== 'object') throw new Error('Invalid visit data');
    return Object.fromEntries(Object.entries(data.places).filter(([k,v]) => names.has(k) && v === true));
  }
  try { saved = read(); } catch (_) { storageOk = false; }
  const has = name => saved[name] === true;
  function set(name, value) {
    if (!names.has(name)) return;
    let next = {...saved};
    try { next = read(); } catch (_) { /* Keep this tab's data when storage is blocked. */ }
    if (value) next[name] = true; else delete next[name];
    saved = next;
    try { localStorage.setItem(KEY, JSON.stringify({version:1,places:saved})); storageOk = true; }
    catch (_) { storageOk = false; }
    refresh();
  }
  function control(name) {
    const label = document.createElement('label'); label.className = 'visit-check';
    const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.visitKey = name;
    input.checked = has(name); input.setAttribute('aria-label', name + 'を訪問済みにする');
    const text = document.createElement('span'); text.textContent = '訪問済み';
    label.append(input,text); label.addEventListener('click', e => e.stopPropagation());
    input.addEventListener('change', () => set(name,input.checked));
    return label;
  }
  function bindMarker(marker, list, cluster = false) {
    const keys = [...new Set(list)].filter(k => names.has(k));
    if (!keys.length) return marker;
    marker._visitKeys = keys; marker._visitCluster = cluster;
    marker.on('add', () => {markers.add(marker); decorate(marker);});
    marker.on('remove', () => markers.delete(marker));
    marker.on('popupopen', refresh);
    if (marker._map) { markers.add(marker); decorate(marker); }
    return marker;
  }
  function decorate(marker) {
    const el = marker.getElement(); if (!el) return;
    const keys = marker._visitKeys, n = keys.filter(has).length, complete = n === keys.length;
    el.classList.toggle('visit-complete',complete); el.classList.toggle('visit-partial',n > 0 && !complete);
    el.dataset.visitedCount = String(n); el.dataset.visitTotal = String(keys.length);
    let badge = el.querySelector('.visit-pin-badge');
    if (n && !badge) { badge = document.createElement('span'); badge.className = 'visit-pin-badge'; el.append(badge); }
    if (badge) { badge.hidden = !n; badge.textContent = complete && keys.length === 1 ? '✓' : '✓' + n + '/' + keys.length; }
    const title = marker.options.title || keys.join('・');
    el.setAttribute('aria-label',title + '（訪問済み ' + n + '/' + keys.length + '）');
  }
  function refresh() {
    document.querySelectorAll('input[data-visit-key]').forEach(input => {
      input.checked = has(input.dataset.visitKey);
      input.closest('.visit-check')?.classList.toggle('is-visited',input.checked);
      input.closest('.place')?.classList.toggle('place-visited',input.checked);
      input.closest('.visit-stop')?.classList.toggle('is-visited',input.checked);
    });
    document.querySelectorAll('[data-visit-label]').forEach(el => {
      const name = el.dataset.visitLabel; el.textContent = (has(name) ? '✓ ' : '') + name;
    });
    for (const marker of markers) decorate(marker);
    const summary = document.getElementById('visit-summary');
    if (summary) summary.textContent = '訪問済み ' + [...names].filter(has).length + ' / ' + names.size + 'か所';
    const hint = document.getElementById('visit-storage-status');
    if (hint) { hint.textContent = storageOk ? 'チェックはこのブラウザに保存。別端末・別ブラウザとは自動同期しません。' : 'ブラウザへ保存できないため、このタブ内だけの記録です。閉じると失われる場合があります。'; hint.classList.toggle('visit-warning',!storageOk); }
  }
  window.AsoVisits = Object.freeze({has,set,control,bindMarker,refresh});
  window.addEventListener('storage', e => {
    if (e.key !== KEY && e.key !== null) return;
    try { saved = read(); storageOk = true; } catch (_) { storageOk = false; }
    refresh();
  });
  const style = document.createElement('style');
  style.textContent = `
    .visit-check{display:inline-flex;align-items:center;gap:7px;min-height:40px;cursor:pointer;font-size:12px;line-height:1.4;color:#465760}
    .visit-check input{width:19px;height:19px;margin:0;accent-color:#516e64;flex:none}.visit-check.is-visited{color:#49665b;font-weight:700}
    .visit-summary-panel{font-size:12px;padding:10px 12px;border:1px solid #d5dfd9;border-radius:6px;background:#f4f8f5;margin:10px 0}
    .visit-summary-panel p{margin:4px 0}.visit-summary-panel details{font-size:11px}.visit-summary-panel summary{cursor:pointer}
    #visit-storage-status{font-size:11px;color:#586e63}.visit-warning{color:#92501a!important}
    .visit-pin-badge{position:absolute;top:-10px;right:-10px;background:#fff;color:#255647;border:1.5px solid #527968;border-radius:8px;padding:2px 4px;font:700 10px/1.1 sans-serif;white-space:nowrap;pointer-events:none;z-index:1}
    .visit-complete .pin-face,.visit-complete .route-face{background:#778b84!important;color:#fff!important;box-shadow:0 1px 3px #0003}
    .visit-complete .cluster-face{background:#e4eee7;border-color:#71877a;color:#41614c}.visit-partial .pin-face,.visit-partial .route-face{outline:2px solid #738c7e;outline-offset:1px}
    .place.place-visited{background:#f3f7f4;border-color:#c5d7cb}.place-visited h3::before{content:'✓ ';color:#486b56}
    .visit-day-checks{margin-top:10px;font-size:12px;border-top:1px solid #dce2e4;padding-top:5px}.visit-day-checks>summary{cursor:pointer;padding:8px 0;font-weight:700}
    .visit-stop{display:flex;gap:8px;align-items:center;justify-content:space-between;border-bottom:1px solid #eef1ef;min-height:43px}
    .visit-stop>span{overflow-wrap:anywhere}.visit-stop .visit-check{flex:none;font-size:11px}.visit-stop.is-visited>span{color:#63766d}
    .visit-popup-stops{margin:8px 0}.visit-popup-stops .visit-stop{font-size:11px}.cluster-entry{border-bottom:1px solid #dde4df;padding-bottom:4px}.cluster-entry .visit-check{padding-left:7px}
    @media print{.visit-summary-panel,.visit-day-checks,.visit-check{display:none!important}}
  `;
  document.head.append(style);
  function install() {
    const panel = document.querySelector('.map-panel');
    if (!panel || document.getElementById('visit-summary')) return;
    const info = document.createElement('div'); info.className = 'visit-summary-panel';
    info.innerHTML = '<b id="visit-summary"></b><p>地理院地図：訪問済みは灰緑のピン＋✓。複数地点をまとめたピンは「✓済数/総数」。チェックを外すと元に戻ります。</p><p id="visit-storage-status" role="status"></p><details><summary>保存・Googleマップ表示について</summary><p>チェックは手動です。現在地から自動判定せず、訪問状況をGitHubやこのサイトのサーバーに送信しません。シークレットモードやサイトデータ削除では記録が消える場合があります。Google埋め込みのピンは変更できませんが、下のチェックは共通です。</p></details>';
    panel.after(info);
    document.querySelectorAll('.day').forEach((day,index) => {
      if (!DAYS[index]) return;
      const details = document.createElement('details'); details.className = 'visit-day-checks';
      const summary = document.createElement('summary'); summary.textContent = '立ち寄り先の訪問チェック'; details.append(summary);
      for (const name of DAYS[index]) {
        const row = document.createElement('div'); row.className = 'visit-stop';
        const title = document.createElement('span'); title.textContent = name;
        row.append(title,control(name)); details.append(row);
      }
      day.append(details);
    });
    document.querySelectorAll('.place').forEach(card => {
      const name = card.querySelector('h3')?.textContent;
      if (names.has(name)) card.append(control(name));
    });
    const placeSelect = document.getElementById('map-place-select');
    if (placeSelect) {
      for (const option of placeSelect.options) {
        const match = /^([a-z]+)-(\d+)$/.exec(option.value);
        const p = match && guide[match[1]]?.[Number(match[2])];
        if (p) option.dataset.visitLabel = p.name;
      }
      const googleInfo = document.querySelector('.google-map-info');
      if (googleInfo) {
        const row = document.createElement('div'); row.className = 'google-visit-check'; googleInfo.prepend(row);
        const syncGoogle = () => {
          row.replaceChildren();
          const match = /^([a-z]+)-(\d+)$/.exec(placeSelect.value);
          const p = match && guide[match[1]]?.[Number(match[2])];
          if (p) row.append(control(p.name));
          refresh();
        };
        placeSelect.addEventListener('change',syncGoogle);
        document.getElementById('map-background')?.addEventListener('change',syncGoogle);
      }
    }
    refresh();
  }
  if (typeof L !== 'undefined') L.Map.addInitHook(function () {if(this.getContainer().id === 'map') setTimeout(install,0);});
})();
