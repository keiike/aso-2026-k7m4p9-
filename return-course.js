/* Optional return plan, 2026-09-22. Visit flags stay in the existing browser store.
 * Unchecked is not proof of a real-world non-visit. Hours are not live opening status. */
(() => {
  'use strict';
  const install = () => {
    if (typeof ASO_GUIDE === 'undefined' || document.getElementById('return-course')) return;
    const visits = window.AsoVisits;
    const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const lookup = new Map(Object.entries(ASO_GUIDE).flatMap(([category,items]) => Array.isArray(items) ? items.map((p,i) => [p.name,{...p,mapId:category+'-'+i}]) : []));
    const chosen = new Set(['hails','Anvin.store']);
    const order = ['hails','Grandma ATQ','彼方 kanata','Anvin.store'];
    const optional = new Set(['Grandma ATQ','彼方 kanata']);
    const times = {'hails':'14:00〜14:45','Grandma ATQ':'15:00〜15:40','彼方 kanata':'15:00〜15:40','Anvin.store':'16:00〜17:00'};
    const hints = {
      'hails':'北欧家具・照明・雑貨。公式の火曜営業は13〜18時。まず当日の開店を電話確認。',
      'Grandma ATQ':'欧州ヴィンテージ。公式に来店前の連絡が必要と案内。近隣の有料駐車場を利用。',
      '彼方 kanata':'普段使いの器・骨董。営業時間は未確認。Grandmaと両方ではなく、営業を確認できた一方を選ぶ。',
      'Anvin.store':'古道具・木箱・古書。2026年6月の取材では13〜18:30、第2・第4日曜休。22日の営業はSNSで確認。'
    };
    const has = name => Boolean(visits?.has(name));
    const placeQuery = name => { const p=lookup.get(name);return p ? p.name+' '+p.address : name; };
    const dir = (origin,destination,waypoints=[]) => 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin,destination,travelmode:'driving',...(waypoints.length ? {waypoints:waypoints.join('|')} : {})});
    const section=document.createElement('section');section.id='return-course';section.className='section';
    section.innerHTML=`<h2>9/22 帰路案｜ミルクロード → 熊本の古道具</h2>
      <p class="lead"><b>午前は阿蘇のミルクスイーツと草原ドライブ、午後は古道具店を2店＋任意1店。</b> 日田へ戻る従来案とは別の、西へ抜けるコースです。下の「今回寄る」で店を選ぶと、午後の順番・地図の帰路・経路リンクが一緒に変わります。</p>
      <div class="memo"><b>訪問記録と営業について</b>「未訪問」は、このブラウザの訪問チェックが付いていない店を指します。チェック内容はこの端末で読み取り、サーバーへ送信しません。実際に行った店には先にチェックしてください。<br>下の時間は<b>高森を9時に出る場合の計画枠</b>で、所要時間の実測・渋滞予測・予約ではありません。9/22の特別営業は電話確認していません。</div>
      <div class="rc-flow" aria-label="帰路の時間配分">
        <div><time>09:00</time><span>村田家旅館を出発。南阿蘇の買い物は必須にせず、内牧方面へ。</span></div>
        <div><time>10:00〜10:30</time><span><b>ASO MILK FACTORY</b>でソフト・ジェラート・プリンなど。公式9:30開店。スイーツは朝食の量に合わせて軽めに。</span></div>
        <div><time>10:45〜12:00</time><span><b>大観峰方面 → かぶと岩展望所 → 二重峠</b>。ミルクロードを西へ。展望休憩は1か所、15〜20分を目安に。大観峰が訪問済みでも道路上の経由地は残しています。</span></div>
        <div><time>12:00〜13:00</time><span><b>道の駅大津</b>付近で昼食。候補は「あか牛レストランよかよか」。長い行列なら国道57号沿いの空いている店へ。価格・提供時間は現地確認。</span></div>
        <div><time>14:00〜17:00</time><span>下で選んだ<b>未訪問の古道具店</b>を順に。任意店を省けば休憩・早めの帰福に充てる。</span></div>
        <div><time>17:00頃〜</time><span>福岡へ。帰福は高速利用なら19〜20時を計画枠にし、一般道ならさらに余裕を取る。実際の到着時刻はナビで再確認。<b>23日08:00中洲返却</b>に備えて給油・駐車。</span></div>
      </div>
      <p class="note">前の13〜15時のミルクロード案は日田経由の配分。今回の熊本市内店巡りでは、13時開店の店を午後に回るため山上を午前〜昼前へ前倒しします。道路規制・天候・駐車場の混雑を優先し、視界が悪ければ展望休憩は省略。</p>
      <div class="rc-controls"><label><input id="rc-unvisited" type="checkbox" checked>訪問済みの古道具店をコースから外す</label><button id="rc-refresh" type="button">チェックを再反映</button><button id="rc-show-route" type="button">地図でこの帰路を見る</button></div>
      <p id="rc-status" role="status" aria-live="polite"></p><div id="rc-shop-options" class="rc-options"></div>
      <p id="rc-chain" class="rc-chain"></p>
      <div class="links rc-nav"><a id="rc-morning" target="_blank" rel="noopener noreferrer">① 宿 → ミルクスイーツ ↗</a><a id="rc-scenic" target="_blank" rel="noopener noreferrer">② ミルクロード → 大津 ↗</a><a id="rc-shops" target="_blank" rel="noopener noreferrer">③ 選んだ店を順に回る ↗</a><a id="rc-home" target="_blank" rel="noopener noreferrer">④ 最後の店 → 福岡 ↗</a></div>
      <p class="note">Googleマップ用リンクはスマホ向けに分割（各区間の途中地点は3か所以内）。現在地から走る場合はGoogle側で出発地を変更してください。リンクは混雑を避ける最適化や営業確認を行うものではありません。<b>上の地図もこの帰路案に変更し、「今回寄る」と訪問済み除外に連動します。</b> 青い番号と矢印は訪問順の概略線で、道路に沿ったナビではありません。</p>
      <details class="rc-details"><summary>宮地に未訪問が残っている場合</summary><p id="rc-miyaji-left"></p><p>TOMMY’Sは11時、etuは12時開店。残りを優先するなら11〜12時台に宮地の店を1〜2店 → 昼食・スイーツ → 13〜14時台ミルクロード → 熊本市内は1〜2店へ減らす。朝9時から全店が開く前提にしない。</p></details>
      <details class="rc-details"><summary>スイーツを昼食後にしたい場合・出発が遅い場合</summary><p>ASO MILK FACTORYで11時から早めのランチとスイーツをまとめる案なら、道の駅大津での昼食は省略。ミルクロードは12〜13時台、市内の店は15時頃から2店を目安に。朝のスイーツのためだけに遠回りしない。</p><p>元の「もちとこ」に行くなら11:30の昼食 → ASO MILK FACTORYは短い休憩 → ミルクロードとし、市内はAnvin.storeを優先して1〜2店。遅れた分を山道の運転で取り戻さない。</p></details>
      <details class="rc-details"><summary>熊本側の店が休み・訪問済みなら日田側へ</summary><p id="rc-north-left"></p><p>代替は「ミルクロード → 小国・日田 → 四月の魚 → 地球屋 → 福岡」。熊本市内・山鹿と一度に回らない。四月の魚は11〜18時、地球屋は10〜18時の掲載。日田経由を選ぶ場合は、先に確認済みの<a href="#milkroad">東へ走って北上する経路案</a>へ切り替える。</p></details>
      <p class="note">JOHN BULLは通常火曜休み、Différenceも火曜は通常営業日に入らないため基本コースから除外。DAY DREAM・ONE PLUS ONEは事前連絡なしで組み込まず、山鹿のるごろは別経路として残しています。</p>
      <details class="rc-details"><summary>営業・所在地の確認元（9/22閲覧）</summary><div class="links"><a href="https://asomilkfactory.com/about/" target="_blank" rel="noopener noreferrer">ASO MILK FACTORY公式</a><a href="https://www.qsr.mlit.go.jp/n-michi/michi_no_eki/kobetu/ozu/ozu.html" target="_blank" rel="noopener noreferrer">道の駅大津・国土交通省</a><a href="https://www.asocity-kanko.jp/spot/kabutoiwa/" target="_blank" rel="noopener noreferrer">かぶと岩・観光協会</a><a href="https://asomonzen.or.jp/?p=237" target="_blank" rel="noopener noreferrer">TOMMY’S・商店街</a><a href="https://asomonzen.or.jp/?p=184" target="_blank" rel="noopener noreferrer">etu・商店街</a><a href="https://www.johnbulljapan.co.jp/" target="_blank" rel="noopener noreferrer">JOHN BULL公式</a><a href="https://difference-web.com/" target="_blank" rel="noopener noreferrer">Différence公式</a></div></details>`;
    const style=document.createElement('style');style.textContent=`
      #return-course{border-top:3px solid #37739d}.rc-flow{margin:16px 0}.rc-flow>div{display:grid;grid-template-columns:105px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid #e5eaec;font-size:13px}.rc-flow time{font-weight:700;color:#466273;font-variant-numeric:tabular-nums}.rc-controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:12px 0}.rc-controls label,.rc-pick{display:flex;gap:8px;align-items:center;font-size:13px;min-height:42px}.rc-controls input,.rc-pick input{width:19px;height:19px;flex:none}.rc-options{display:grid;grid-template-columns:1fr 1fr;gap:12px}.rc-card{border:1px solid #dce2e4;padding:12px;border-radius:6px;min-width:0}.rc-card h3{font-size:16px;margin:4px 0}.rc-card p{font-size:12px;margin:5px 0;overflow-wrap:anywhere}.rc-card small{font-size:11px;color:#53656c}.rc-card .rc-switches{display:flex;gap:16px;flex-wrap:wrap;align-items:center}.rc-card .rc-pick{font-size:12px}.rc-chain{padding:12px;background:#eef4f7;font-size:14px;font-weight:700;overflow-wrap:anywhere}.rc-details{font-size:13px;border-top:1px solid #e1e7e8;padding:10px 0}.rc-details summary{cursor:pointer;font-weight:700}.rc-nav a{padding:8px 0}#rc-status{font-size:12px;color:#53656c;min-height:20px}.rc-meta{color:#53656c}
      @media(max-width:760px){.rc-options{grid-template-columns:1fr}.rc-flow>div{grid-template-columns:1fr;gap:2px}.rc-flow{font-size:13px}}@media print{.rc-controls,.rc-switches{display:none!important}.rc-options{grid-template-columns:1fr 1fr}}
    `;document.head.append(style);
    document.getElementById('itinerary')?.after(section);
    const nav=document.querySelector('nav');if(nav){const a=document.createElement('a');a.href='#return-course';a.textContent='9/22 帰路コース';nav.prepend(a);}
    const day=document.querySelectorAll('.day')[2];if(day){const p=document.createElement('p');p.className='revision';p.innerHTML='<b>古道具中心の新しい帰路案：</b><a href="#return-course">午前ミルクロード → 午後は熊本市内へ</a>。以下の行程は従来の日田経由案です。両方を同じ日に回る予定ではありません。';day.querySelector('h2')?.after(p);}
    const milkroad=document.getElementById('milkroad');if(milkroad){const p=document.createElement('p');p.className='revision';p.innerHTML='9/22の古道具中心の案では午前〜昼前に通ります。<a href="#return-course">最新の帰路コースへ</a>。以下の13〜15時は従来の配分です。';milkroad.querySelector('h2')?.after(p);}
    document.getElementById('rc-morning').href=dir('ユースホステル 村田家旅館 高森1672',placeQuery('ASO MILK FACTORY'));
    document.getElementById('rc-scenic').href=dir(placeQuery('ASO MILK FACTORY'),placeQuery('道の駅 大津'),['大観峰展望所 阿蘇','かぶと岩展望所 阿蘇','二重峠 阿蘇']);
    const options=section.querySelector('#rc-shop-options');
    for(const name of order){
      const p=lookup.get(name);if(!p)continue;
      const article=document.createElement('article');article.className='rc-card';article.dataset.returnShop=name;
      article.innerHTML='<small>'+times[name]+(optional.has(name)?'｜任意・事前確認後':'｜基本候補')+'</small><h3>'+esc(name)+'</h3><p>'+esc(hints[name])+'</p><p class="rc-meta">'+esc(p.address)+'</p><div class="rc-switches"><label class="rc-pick"><input type="checkbox" data-course-pick="'+esc(name)+'" '+(chosen.has(name)?'checked':'')+'>今回寄る</label></div><div class="links"><a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">確認元 ↗</a>'+(p.social?'<a href="'+esc(p.social)+'" target="_blank" rel="noopener noreferrer">店舗サイト・SNS ↗</a>':'')+(p.phone?'<a href="tel:'+p.phone.replace(/[^0-9+]/g,'')+'">'+esc(p.phone)+'</a>':'')+'<button type="button" data-course-map="'+esc(p.mapId)+'">この地図に表示</button></div>';
      if(visits)article.querySelector('.rc-switches').append(visits.control(name));
      options.append(article);
    }
    const refresh=()=>{
      const exclude=section.querySelector('#rc-unvisited').checked;
      const active=order.filter(n=>chosen.has(n)&&(!exclude||!has(n)));
      window.AsoReturnMap?.setShops(active);
      options.querySelectorAll('.rc-card').forEach(el=>{el.hidden=exclude&&has(el.dataset.returnShop);el.querySelector('[data-course-pick]').checked=chosen.has(el.dataset.returnShop);});
      const done=order.filter(has);
      section.querySelector('#rc-status').textContent='この案で選択中：'+active.length+'店。'+(done.length?'訪問チェック済み：'+done.join('・')+'。':'基本候補の訪問チェックはまだありません。')+' 営業確認済みという意味ではありません。';
      section.querySelector('#rc-chain').textContent=active.length?'午後の順番：道の駅大津 → '+active.join(' → ')+' → 福岡':'午後の古道具店は未選択です。訪問済みなら再訪せず、別経路への変更または早めの帰福を検討。';
      const link=section.querySelector('#rc-shops');link.hidden=!active.length;
      if(active.length)link.href=dir(placeQuery('道の駅 大津'),placeQuery(active.at(-1)),active.slice(0,-1).map(placeQuery));else link.removeAttribute('href');
      section.querySelector('#rc-home').href=dir(placeQuery(active.at(-1)||'道の駅 大津'),'福岡市 中洲');
      const remaining=names=>names.filter(n=>!has(n));
      const miyaji=remaining(['TOMMY’Sアンティーク＆ステンドグラス','etu','森本金物店・阿蘇昭和レトロ雑貨','みやがわ時計店']);
      section.querySelector('#rc-miyaji-left').textContent='このブラウザで未チェック：'+(miyaji.length?miyaji.join('／'):'宮地の4店はすべてチェック済みです。');
      const north=remaining(['四月の魚','大正浪漫 地球屋']);section.querySelector('#rc-north-left').textContent='北側の基本候補で未チェック：'+(north.length?north.join('／'):'2店ともチェック済みです。');
      visits?.refresh();
    };
    options.addEventListener('change',e=>{
      const name=e.target.dataset.coursePick;if(!name)return;
      if(e.target.checked){if(optional.has(name))for(const n of optional)chosen.delete(n);chosen.add(name);}else chosen.delete(name);
      refresh();
    });
    options.addEventListener('click',e=>{const b=e.target.closest('[data-course-map]');if(!b)return;const bg=document.getElementById('map-background');if(bg?.value==='google'){bg.value='pale';bg.dispatchEvent(new Event('change',{bubbles:true}));}const select=document.getElementById('map-place-select');if(select){select.value=b.dataset.courseMap;select.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('map')?.scrollIntoView({behavior:'smooth',block:'center'});}});
    section.querySelector('#rc-unvisited').addEventListener('change',refresh);
    section.querySelector('#rc-refresh').onclick=refresh;
    section.querySelector('#rc-show-route').onclick=()=>{window.AsoReturnMap?.fit();document.getElementById('map')?.scrollIntoView({behavior:'smooth',block:'center'});};
    document.addEventListener('change',e=>{if(e.target.matches('input[data-visit-key]'))setTimeout(refresh,0);});
    window.addEventListener('storage',()=>setTimeout(refresh,0));
    refresh();
  };
  // Existing map and visit-control init hooks finish first. No geolocation request.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})();
