/* Optional Google Maps embed. No private API key, direct tile fetching, or paid API.
 * GSI/Leaflet remains the full itinerary/candidate map; the embed is a separate view.
 * Load after Leaflet and before map.js. */
(() => {
  'use strict';
  if (typeof L === 'undefined') return;
  L.Map.addInitHook(function () {
    if (this.getContainer().id !== 'map') return;
    const map = this;
    setTimeout(() => installGoogleView(map), 0);
  });
  function installGoogleView(map) {
    const host = map.getContainer();
    const selector = document.getElementById('map-background');
    const placeSelect = document.getElementById('map-place-select');
    const panel = selector?.closest('.map-panel');
    if (!selector || !panel || !placeSelect || document.getElementById('google-map-frame')) return;
    let active = false, lastGsi = selector.value, timeout, destination = null;
    const baseChange = selector.onchange;
    const oldPlaceChange = placeSelect.onchange;
    const guide = typeof ASO_GUIDE === 'undefined' ? {} : ASO_GUIDE;
    const places = new Map();
    for (const category of ['clothing', 'antiques', 'classics']) {
      (guide[category] || []).forEach((p, index) => places.set(category + '-' + index, p));
    }
    const googleOption = document.createElement('option');
    googleOption.value = 'google'; googleOption.textContent = 'Googleマップ（埋め込み）'; selector.append(googleOption);
    selector.setAttribute('aria-label', '背景・地図表示の切り替え');
    const style = document.createElement('style');
    style.textContent = `
      .google-map-stage{position:relative;min-width:0}
      .google-map-stage.is-google>#map{visibility:hidden;pointer-events:none}
      #google-map-frame{position:absolute;inset:0;width:100%;height:100%;border:1px solid #ccd5d8;border-radius:6px;background:#fff}
      .google-map-info{font-size:12px;border-left:3px solid #4285f4;background:#f0f5fc;padding:10px 12px;margin:8px 0}
      .google-map-info p{margin:4px 0}.google-map-info button{min-height:34px;margin:6px 7px 0 0}
      .google-map-info a{display:inline-block;margin:6px 7px 0 0}.google-map-info details{margin-top:8px}
      .map-panel button:disabled,.map-panel input:disabled{cursor:not-allowed;opacity:.5}
      .google-view-mode #tile-status,.google-view-mode .legend{display:none!important}
      .google-selected-place{font-weight:700;overflow-wrap:anywhere}
      @media print{#google-map-frame,.google-map-info{display:none!important}.google-map-stage.is-google>#map{visibility:visible!important}}
    `;
    document.head.append(style);
    const stage = document.createElement('div'); stage.className = 'google-map-stage';
    host.before(stage); stage.append(host);
    const frame = document.createElement('iframe');
    frame.id = 'google-map-frame'; frame.title = 'Googleマップ・選択した地域または店舗';
    frame.referrerPolicy = 'strict-origin-when-cross-origin'; frame.setAttribute('allowfullscreen', '');
    frame.hidden = true; stage.append(frame);
    const info = document.createElement('div'); info.className = 'google-map-info'; info.hidden = true;
    info.innerHTML = '<b>Googleマップ表示</b><p>これは別表示の埋め込み地図です。予定ルートの破線・29か所の候補ピンは重なりません。上の「お店・観光地へ移動」で、選んだ地点を個別に表示できます。</p><p class="google-selected-place"></p><p class="google-frame-status" role="status" aria-live="polite"></p><button type="button" class="back-to-gsi">候補ピンの地図へ戻る</button><button type="button" class="retry-google-map">再読み込み</button><a class="open-google-map" target="_blank" rel="noopener noreferrer">Googleマップ本体で開く ↗</a><details><summary>表示方式について</summary><p>全ピンをGoogleの背景に重ねる方式にはMaps JavaScript APIの設定が必要です。このページでは課金設定を追加せず、Googleの地図全体を埋め込む方式を使っています。地理院地図へ戻ると候補・表示範囲の設定を引き継ぎます。Google内だけのパン・ズームは地理院側とは同期しません。</p></details>';
    stage.before(info);
    const status = info.querySelector('.google-frame-status');
    const current = info.querySelector('.google-selected-place');
    const external = info.querySelector('.open-google-map');
    const controls = [
      ...panel.querySelectorAll('[data-map-layer]'),
      document.getElementById('map-search'), document.getElementById('clear-map-search'),
      document.getElementById('show-all-candidates'), document.getElementById('show-planned-only'),
      document.getElementById('fit-candidates')
    ].filter(Boolean);
    const initialDisabled = new Map(controls.map(el => [el, el.disabled]));
    const section = stage.closest('section');
    const stats = document.getElementById('map-status');
    frame.addEventListener('load', () => {
      if (!active || !frame.getAttribute('src')) return;
      clearTimeout(timeout);
      // A cross-origin iframe's load event does not prove its maps rendered.
      status.textContent = 'Googleの表示が出ない場合は「再読み込み」または「Googleマップ本体で開く」を使ってください。';
    });
    function areaDestination() {
      const c = map.getCenter();
      return {query:c.lat.toFixed(6)+','+c.lng.toFixed(6), zoom:map.getZoom(), name:'選択中の地域（中心位置）', isArea:true};
    }
    function placeDestination(id) {
      const p = places.get(id); if (!p) return null;
      return {query:p.name+' '+(p.address||''), zoom:16, name:p.name, isArea:false};
    }
    function loadGoogle(next) {
      destination = next || areaDestination();
      const zoom = Math.max(7, Math.min(18, Number(destination.zoom)||11));
      const q = new URLSearchParams({q:destination.query,hl:'ja',z:String(zoom),output:'embed'});
      const url = 'https://www.google.com/maps?'+q.toString();
      current.textContent = '表示先：'+destination.name;
      if (destination.isArea) {
        external.href = 'https://www.google.com/maps/@?'+new URLSearchParams({api:'1',map_action:'map',center:destination.query,zoom:String(zoom),basemap:'roadmap'});
      } else {
        external.href = 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:destination.query});
      }
      status.textContent = 'Googleマップを読み込んでいます…';
      clearTimeout(timeout);
      frame.src = url;
      timeout = setTimeout(() => {if(active)status.textContent='読み込みに時間がかかっています。Googleマップ本体でも確認できます。';},12000);
    }
    function toggle(on) {
      active = on; stage.classList.toggle('is-google',on); section?.classList.toggle('google-view-mode',on);
      frame.hidden = !on; info.hidden = !on; host.inert = on;
      if(on)host.setAttribute('aria-hidden','true');else host.removeAttribute('aria-hidden');
      controls.forEach(el => {el.disabled = on || initialDisabled.get(el);});
      if(stats)stats.hidden=on;
      host.dataset.mapView = on ? 'google-embed' : 'gsi';
      if (!on) {
        clearTimeout(timeout);
        // Retain Leaflet state but stop using the Google frame after leaving it.
        frame.removeAttribute('src');
        map.invalidateSize({pan:false});
      }
    }
    selector.onchange = function (e) {
      if (selector.value === 'google') {
        toggle(true); map.closePopup(); loadGoogle(placeDestination(placeSelect.value)||areaDestination());
      } else {
        lastGsi = selector.value; toggle(false); baseChange?.call(selector,e);
      }
    };
    function back() {selector.value=lastGsi;selector.dispatchEvent(new Event('change',{bubbles:true}));}
    info.querySelector('.back-to-gsi').onclick=back;
    info.querySelector('.retry-google-map').onclick=()=>loadGoogle(destination);
    placeSelect.onchange=function(e){
      if(!active){oldPlaceChange?.call(this,e);return;}
      const next=placeDestination(this.value);if(next)loadGoogle(next);
    };
    for(const id of ['local-map','miyaji-map','wide-map']) {
      const b=document.getElementById(id);if(!b)continue;
      const original=b.onclick;
      b.onclick=function(e){original?.call(this,e);if(active){placeSelect.value='';loadGoogle(areaDestination());}};
    }
    document.querySelectorAll('.view-on-map').forEach(b=>b.addEventListener('click',()=>{if(active)back();},true));
    host.dataset.mapView='gsi';
  }
})();