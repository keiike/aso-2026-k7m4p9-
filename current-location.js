/* Device location is opt-in and kept only in memory. No backend writes or analytics. */
(() => {
  'use strict';
  if (typeof L === 'undefined') return;
  L.Map.addInitHook(function () {
    if (this.getContainer().id === 'map') setTimeout(() => install(this), 0);
  });
  function install(map) {
    if (document.getElementById('locate-me')) return;
    const panel = document.querySelector('.map-panel');
    if (!panel) return;
    const style = document.createElement('style');
    style.textContent = `
      .location-panel{border:1px solid #cadbea;border-radius:6px;background:#f5f9fd;padding:10px 12px;margin:10px 0;font-size:12px}
      .location-actions{display:flex;align-items:center;flex-wrap:wrap;gap:7px 12px}.location-actions button{min-height:42px;padding:8px 12px}
      #locate-me{color:#145dad;border-color:#89afd5;background:#fff;font-weight:700}
      .location-actions label{display:flex;align-items:center;gap:6px;min-height:42px;cursor:pointer}.location-actions input{width:18px;height:18px;accent-color:#1967d2;margin:0}
      .location-panel button:disabled{opacity:.55;cursor:not-allowed}#location-status{margin:7px 0 4px;overflow-wrap:anywhere;line-height:1.6}
      .location-panel.is-error #location-status{color:#9b3d20}.location-privacy,.location-panel details{color:#53656c;font-size:11px;line-height:1.55}
      .location-panel summary{cursor:pointer}.location-panel details p{margin:5px 0}
      .geo-location-marker{background:none!important;border:0!important}.geo-location-dot{display:block;width:20px;height:20px;border:3px solid #fff;border-radius:50%;background:#1967d2;box-shadow:0 0 0 2px #1967d255,0 1px 5px #0005}
      .geo-location-marker.is-stale .geo-location-dot{background:#6b7b89;box-shadow:0 0 0 2px #6b7b8944,0 1px 4px #0004}
      @media print{.location-panel,.leaflet-locationPin-pane,.leaflet-locationAccuracy-pane{display:none!important}}
    `;
    document.head.append(style);
    const ui = document.createElement('div'); ui.className = 'location-panel';
    ui.innerHTML = '<div class="location-actions"><button type="button" id="locate-me" aria-controls="map">◎ 現在地</button><label><input type="checkbox" id="location-auto">自動更新</label><button type="button" id="clear-location" disabled>表示を消す</button></div><p id="location-status" role="status" aria-live="polite">ボタンを押して位置情報を許可すると、青い点で現在地を表示します。</p><p class="location-privacy">現在地は地理院地図に表示。Google表示中の取得成功時は地理院へ切り替えます。自動更新中も地図は勝手に追従しません。</p><details id="location-help"><summary>位置情報・表示できない場合</summary><p>取得は操作時だけ。現在地をこのサイトやGitHubに保存・公開しません。背景配信元には表示地域の地図タイルが要求され、Google表示へ切り替えると地図の中心位置がGoogleへ送られます。</p><p>端末の位置情報とブラウザのサイト権限を確認してください。アプリ内ブラウザで許可できない場合は、公開URLをChromeかSafari本体で開いてください。屋内・山間部では精度が下がる場合があります。</p><p>自動更新はページを離れる・非表示にする・Google表示にする操作で停止します。再開は手動です。青い点は最終取得位置、薄い円は精度の目安。運転中は操作しないでください。</p></details>';
    panel.after(ui);
    const locate = ui.querySelector('#locate-me'), auto = ui.querySelector('#location-auto');
    const clear = ui.querySelector('#clear-location'), status = ui.querySelector('#location-status');
    const help = ui.querySelector('#location-help'), background = document.getElementById('map-background');
    let serial = 0, mode = 'idle', watchId = null, deadline = null, last = null, marker = null, accuracyCircle = null, busy = false;
    const accuracyPane = map.createPane('locationAccuracy'); accuracyPane.style.zIndex = '430'; accuracyPane.style.pointerEvents = 'none';
    map.createPane('locationPin').style.zIndex = '665';
    function say(text, error = false) { status.textContent = text; ui.classList.toggle('is-error', error); }
    function clock(stamp) { return new Date(stamp).toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false}); }
    function meters(value) { return value >= 1000 ? (value / 1000).toFixed(1) + ' km' : Math.ceil(value) + ' m'; }
    function controls() {
      locate.disabled = busy; locate.textContent = busy ? '取得中…' : last ? '◎ 現在地を更新' : '◎ 現在地';
      locate.setAttribute('aria-busy', String(busy)); auto.checked = mode === 'watch';
      clear.disabled = !last && mode === 'idle'; clear.textContent = busy ? '取り消す' : '表示を消す';
    }
    function cancel() {
      serial++; clearTimeout(deadline); deadline = null;
      if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
      mode = 'idle'; busy = false; controls();
    }
    function markStale() {
      marker?.getElement()?.classList.add('is-stale');
      if (marker && last) marker.setTooltipContent('最終取得位置（' + clock(last.stamp) + '）');
      accuracyCircle?.setStyle({color:'#6b7b89', fillColor:'#6b7b89'});
    }
    function stop(message) { cancel(); markStale(); if (message) say(message + (last ? ' 最終取得：' + clock(last.stamp) + '。' : '')); }
    function errorMessage(code) {
      if (code === 1) return '位置情報が許可されていません。端末とブラウザの位置情報設定を確認し、許可してから再度押してください。';
      if (code === 3) return '時間内に現在地を取得できませんでした。屋外などで通信・位置情報を確認して、もう一度お試しください。';
      return '現在地を取得できませんでした。端末の位置情報と通信を確認して、もう一度お試しください。';
    }
    function fail(error, token) {
      if (token !== serial) return;
      cancel(); markStale(); say(errorMessage(error?.code) + (last ? ' 灰色の点は前回の取得位置です。' : ''), true); help.open = true;
    }
    function toGsi() {
      if (background?.value !== 'google') return false;
      const back = document.querySelector('.back-to-gsi');
      if (back) back.click(); else { background.value = 'pale'; background.dispatchEvent(new Event('change', {bubbles:true})); }
      return true;
    }
    function receive(position, token, center) {
      if (token !== serial || document.hidden) return;
      const c = position?.coords;
      if (!c || !Number.isFinite(c.latitude) || !Number.isFinite(c.longitude) || !Number.isFinite(c.accuracy) || Math.abs(c.latitude) > 90 || Math.abs(c.longitude) > 180 || c.accuracy < 0) { fail({code:2}, token); return; }
      clearTimeout(deadline); deadline = null;
      const continuous = mode === 'watch', stamp = Number(position.timestamp);
      last = {lat:c.latitude, lng:c.longitude, accuracy:c.accuracy, stamp:Number.isFinite(stamp) && stamp > 0 ? stamp : Date.now()};
      const point = [last.lat, last.lng], switched = toGsi();
      if (!accuracyCircle) accuracyCircle = L.circle(point, {pane:'locationAccuracy', className:'geo-accuracy-circle', radius:Math.max(1,last.accuracy), color:'#1967d2', weight:1, fillColor:'#1967d2', fillOpacity:.10, interactive:false}).addTo(map);
      else accuracyCircle.setLatLng(point).setRadius(Math.max(1,last.accuracy)).setStyle({color:'#1967d2', fillColor:'#1967d2'});
      if (!marker) marker = L.marker(point, {pane:'locationPin', title:'現在地（最終取得位置）', keyboard:true, icon:L.divIcon({className:'geo-location-marker', html:'<span class="geo-location-dot"></span>', iconSize:[20,20], iconAnchor:[10,10]})}).addTo(map).bindTooltip('現在地');
      else marker.setLatLng(point);
      marker.getElement()?.classList.remove('is-stale');
      marker.setTooltipContent('現在地｜精度の目安 約' + meters(last.accuracy) + '｜' + clock(last.stamp) + '取得');
      busy = false; if (!continuous) mode = 'idle'; controls();
      if (center) {
        map.closePopup(); map.invalidateSize({pan:false});
        if (last.accuracy > 120 && Math.abs(last.lat) < 80) map.fitBounds(accuracyCircle.getBounds(), {padding:[32,32], maxZoom:16, animate:false});
        else map.setView([Math.max(-85,Math.min(85,last.lat)),last.lng], 16, {animate:false});
      }
      say((switched ? '地理院地図に切り替えました。' : '') + (continuous ? '現在地を自動更新中。' : '現在地を表示しました（1回取得）。') + ' 精度の目安 約' + meters(last.accuracy) + '／' + clock(last.stamp) + '取得。' + (last.accuracy > 500 ? ' 位置の幅が大きいため、正確な場所とは限りません。' : '') + (continuous ? ' 地図を現在地に戻すときは「現在地を更新」を押してください。' : ' 移動後は更新してください。'));
    }
    function start(continuous) {
      cancel();
      if (!window.isSecureContext || !navigator.geolocation) { say('この表示環境では位置情報を利用できません。HTTPSの公開URLをChromeまたはSafari本体で開いてください。', true); help.open = true; return; }
      const policy = document.permissionsPolicy || document.featurePolicy;
      if (policy?.allowsFeature && !policy.allowsFeature('geolocation')) { say('この埋め込み・アプリ内の表示では位置情報が制限されています。公開URLをChromeまたはSafari本体で開いてください。', true); help.open = true; return; }
      mode = continuous ? 'watch' : 'once'; busy = true; markStale(); controls();
      say('現在地を取得しています。位置情報の確認画面が出たら許可してください。');
      const token = serial; let first = true;
      deadline = setTimeout(() => fail({code:3}, token), 30000);
      const success = p => { receive(p, token, first); first = false; };
      const failure = e => fail(e, token);
      const options = {enableHighAccuracy:true, timeout:20000, maximumAge:0};
      try {
        if (continuous) watchId = navigator.geolocation.watchPosition(success, failure, options);
        else navigator.geolocation.getCurrentPosition(success, failure, options);
      } catch (_) { fail({code:2}, token); }
    }
    locate.addEventListener('click', () => start(auto.checked));
    auto.addEventListener('change', () => { if (auto.checked) start(true); else stop('自動更新を停止しました。'); });
    clear.addEventListener('click', () => {
      cancel(); if (marker) map.removeLayer(marker); if (accuracyCircle) map.removeLayer(accuracyCircle);
      marker = null; accuracyCircle = null; last = null; controls(); say('位置情報の取得を停止し、このタブの現在地表示を消しました。');
    });
    background?.addEventListener('change', () => { if (background.value === 'google' && mode !== 'idle') stop('Google表示に切り替えたため、位置情報の取得を停止しました。'); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && mode !== 'idle') stop('画面を離れたため、位置情報の取得を停止しました。再開は手動です。'); });
    window.addEventListener('pagehide', () => stop('位置情報の取得を停止しました。'));
    map.on('unload', cancel); controls();
  }
})();
