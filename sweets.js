/* Four optional sweets stops requested via screenshot. Public references checked 2026-09-21. */
(() => {
  'use strict';
  if (typeof ASO_GUIDE === 'undefined' || document.getElementById('sweets')) return;
  ASO_GUIDE.sweets = [
    {
      name:'kibaco（キバコ）',
      address:'熊本県阿蘇郡南阿蘇村河陽4368-1 新阿蘇大橋展望所 ヨ・ミュール内',
      genre:'南阿蘇／生ソフト・リボンソフト',
      hours:'観光局掲載：9:30〜17:00／定休日・当日営業は要確認',
      status:'南阿蘇の買い物・新阿蘇大橋の休憩に追加しやすい',
      note:'画像の「kibako」は、同住所のkibacoとして掲載。自然派ソフトの2号店。22日の南阿蘇観光で寄る候補ですが、めるころやもちとことの順番は当日の経路次第。休憩室の9時開館とソフト販売開始を混同しないよう、販売時間を優先。駐車場あり。地図は展望所の周辺参照位置です。',
      source:'https://minamiaso.info/spot/yomyuru/',label:'みなみあそ観光局',
      extra:'https://www.toretabi.jp/travel_info/kumamoto-aso.html'
    },
    {
      name:'ついんスター',
      address:'熊本県菊池市旭志麓1584-4',
      genre:'菊池・旭志／芸術ソフト・アイスクリーム',
      hours:'観光協会掲載：9:00〜17:00／木曜休（祝日は営業）',
      phone:'0968-37-4556',status:'菊池・大津方面へ抜ける帰路の候補',
      note:'特徴的な形の「芸術ソフト」の店。駐車場25台の案内あり。通常の日田・うきは経由とは別の寄り道で、菊池側に回る場合に選ぶ。9/20〜22の連休営業・売切れ状況は未照会。地図は掲載地図の周辺参照位置で、入口はGoogleマップで確認。',
      source:'https://kikuchikanko.ne.jp/archives/gallery/store20240207',label:'菊池観光協会',
      social:'https://ice-twinstar.com/'
    },
    {
      name:'栗と空',address:'熊本県山鹿市菊鹿町米原451-16 歴史公園鞠智城内',
      genre:'山鹿・菊鹿／和栗・モンブランソフト',
      hours:'10:00〜16:00（カフェ15:45まで）／月曜休（祝日の場合は翌日）',
      phone:'0968-48-2200',status:'9/22の振替休業に注意・要電話',
      note:'山鹿和栗を使うスイーツ店。公式の通常ルールでは祝日の月曜日の翌日が休み。9/21は月曜祝日なので、22日の休業可能性を先に確認してください。22日自体も休日ですが、連休の扱いは未確認です。山鹿の古道具店と組み合わせる別ルート候補で、9〜11月は提供待ちの注意書きもあります。',
      source:'https://www.kuriandsora.com/',label:'店舗公式',
      extra:'https://yamagawaguri.com/shop/392'
    },
    {
      name:'熊本城香梅庵（陣太鼓ソフト）',
      address:'熊本県熊本市中央区二の丸1-1-2 城彩苑桜の小路',
      genre:'熊本市・城彩苑／陣太鼓ソフト',
      hours:'9:00〜18:00／ソフト等ラストオーダー17:00（変更の場合あり）',
      phone:'096-288-0039',status:'熊本市内を通る帰路の候補',
      note:'画像のおまけ「陣太鼓ソフト」は商品名なので、公式に取扱いを確認した熊本城香梅庵を代表の1店舗として地図登録。香梅の全店で買えるわけではありません。熊本市内へ寄る日に選び、日田経由の帰路へそのまま追加しない案です。城彩苑の駐車・歩行時間を見込み、閉店より早いソフトの受付終了に注意。',
      source:'https://kobai.jp/store',label:'お菓子の香梅公式',extra:'https://kobai.jp/cafe'
    }
  ];
  // First three positions are published embedded-map centers, not claimed shop entrances.
  window.ASO_SWEETS_GEO = [
    ['kibaco（キバコ）',32.87761026127267,130.98454951288332,'area','観光局掲載地図の表示中心。展望所周辺の目安で店舗入口ではない','https://minamiaso.info/spot/yomyuru/'],
    ['ついんスター',32.941674,130.8639821,'area','観光協会掲載地図の表示中心。店舗周辺の目安で入口ではない','https://kikuchikanko.ne.jp/archives/gallery/store20240207'],
    ['栗と空',33.001731680904825,130.78708501506347,'area','スイーツフェア公式掲載地図の表示中心。施設周辺の目安','https://yamagawaguri.com/shop/392'],
    ['熊本城香梅庵（陣太鼓ソフト）',32.8039288,130.7037358,'published','香梅公式のGoogleマップ案内に含まれる店舗座標','https://kobai.jp/store']
  ];
  const section=document.createElement('section');section.id='sweets';section.className='section';
  section.innerHTML='<h2>ソフトクリーム・スイーツ 4候補</h2><p class="lead"><b>画像の3店＋陣太鼓ソフトの取扱店を追加。</b> 地図の「甘」ピンと訪問済みチェックで管理できます。固定の行程には自動で組み込んでいません。</p><div class="memo"><b>帰路と休業日の確認</b>南阿蘇のkibacoが既存の観光と組み合わせやすい候補。ついんスター・栗と空は菊池／山鹿側、熊本城香梅庵は熊本市側に回る別案です。<br><b>栗と空は「月曜が祝日の場合は翌日休み」。9/22は休業の可能性があるため、向かう前に電話確認してください。</b></div><div class="cards" style="margin-top:12px">'+ASO_GUIDE.sweets.map(card).join('')+'</div><p class="note">2026/9/21に店舗・観光団体の公開情報を確認。通常営業時間であり、連休の特別営業・在庫・価格は未確認です。画像は2025/5/9の投稿のため、掲載住所を照合して今回の公開案内を優先。kibaco・ついんスター・栗と空のピンは公式掲載地図の表示中心を使う周辺目安で、入口の正確な位置ではありません。<a href="https://www.nao.ac.jp/news/topics/2025/20250203-rekiyoko.html" target="_blank" rel="noopener noreferrer">2026年の祝日・休日（国立天文台）</a></p>';
  const anchor=document.getElementById('classics');
  if(anchor)anchor.before(section);else document.querySelector('main')?.append(section);
  const nav=document.querySelector('nav');if(nav){const a=document.createElement('a');a.href='#sweets';a.textContent='ソフト・スイーツ';nav.append(a);}
  const day=document.querySelectorAll('.day')[2];
  if(day){const p=document.createElement('p');p.className='note';p.innerHTML='甘いものの追加候補：<a href="#sweets">kibaco／ついんスター／栗と空／陣太鼓ソフト</a>。4店を回る予定ではなく、帰る方向・営業日に合う店を選ぶ。';day.append(p);}
})();
