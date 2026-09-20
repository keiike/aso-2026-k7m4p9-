/* Public photo-spot references checked 2026-09-20. Optional stops, not bookings. */
(() => {
  'use strict';
  if (typeof ASO_GUIDE === 'undefined' || document.getElementById('titans')) return;
  ASO_GUIDE.titans = [
    {name:'リヴァイ兵士長像（日田駅南広場）',address:'大分県日田市元町11-1 日田駅南広場',genre:'進撃の日田／駅前の屋外フォトスポット',hours:'屋外広場／明るい時間に訪問する案',status:'日田の上着購入とまとめやすい',note:'日田駅前のリヴァイ像。写真だけなら10〜20分の滞在枠を提案（駐車・移動は別）。セカンドストリート日田店の開店前か買い物後に。駅の送迎スペースへ長時間駐車せず、周辺駐車場を利用。',source:'https://shingeki-hita.com/spot/016.html',label:'進撃の日田公式'},
    {name:'大山ダム・エレン／ミカサ／アルミン像',address:'大分県日田市大山町西大山2008-1 大山ダム下流広場',genre:'進撃の日田／ダムを壁に見立てた銅像',hours:'公式：下流広場は365日開放／無料駐車場あり',status:'写真目的なら優先・黒川へ進む前の寄り道',note:'壁を見上げる少年期の3人と大山ダムを一緒に撮れる場所。ナビの目的地は「大山ダム銅像／下流広場」で、ダム上や管理所とは区別。20〜30分の撮影枠＋移動を見込む提案。管理所の土日祝休みと広場開放は別。放流・天候・現地規制を優先。',source:'https://shingeki-hita.com/spot/001.html',label:'進撃の日田公式'},
    {name:'田来原公園・あの丘の木（10周年記念植樹）',address:'大分県日田市大山町西大山1595-6 田来原美しい森づくり公園',genre:'進撃の日田／記念植樹と丘の風景',hours:'屋外公園／駐車場あり／イベントの利用制限は要確認',status:'大山ダムと組み合わせる追加候補',note:'「あの丘の木」を想起させる記念植樹とモニュメント。地図のピンは公園の参照位置で、木そのものや入口の確定位置ではない。園内の案内に従って徒歩移動。20〜30分の滞在枠を提案。大山ダムから車約10分という公式目安に、園内歩行も加える。',source:'https://shingeki-hita.com/spot/023.html',label:'進撃の日田公式'}
  ];
  window.ASO_HITA_GEO = [
    ['リヴァイ兵士長像（日田駅南広場）',33.3168,130.9383166,'published','公式案内のGoogleマップ地点座標','https://shingeki-hita.com/spot/016.html'],
    ['大山ダム・エレン／ミカサ／アルミン像',33.2434582,130.9574765,'published','公式案内の銅像地点座標（下流広場）','https://shingeki-hita.com/spot/001.html'],
    ['田来原公園・あの丘の木（10周年記念植樹）',33.2353944,130.9365782,'published','公式案内の公園代表点。木・入口の位置ではない','https://shingeki-hita.com/spot/023.html']
  ];
  const section = document.createElement('section'); section.id='titans'; section.className='section';
  section.innerHTML='<h2>日田の「進撃の巨人」フォトスポット 3か所</h2><p class="lead"><b>短く寄るなら日田駅のリヴァイ像、景観込みなら大山ダムを優先。</b> 3か所とも追加候補として地図に「進」ピンを表示。固定の予定ルートには自動で組み込んでいません。</p><p class="note">20日の寄り道案：日田駅 → 上着の買い物 → 大山ダム → 黒川温泉。田来原公園まで回るなら大観峰を22日に回すなど調整し、18時のチェックインを優先。滞在枠は提案で、予約時刻・渋滞込みの予測ではありません。現地の掲示・利用制限を確認してください。</p><div class="cards">'+ASO_GUIDE.titans.map(card).join('')+'</div><p class="note">撮影用の小物・花などは置き去りにせず持ち帰ってください。屋内の別候補には<a href="https://shingeki-hita.com/spot/017.html" target="_blank" rel="noopener noreferrer">進撃の巨人 in HITA ミュージアム（公式）</a>もあります。展示の撮影可否は現地案内に従ってください。</p>';
  document.getElementById('outerwear').before(section);
  const nav=document.querySelector('nav'); if(nav){const a=document.createElement('a');a.href='#titans';a.textContent='進撃の日田';nav.append(a);}
  const day=document.querySelector('.day');
  if(day){const p=document.createElement('p');p.className='note';p.innerHTML='追加の寄り道：<a href="#titans">日田駅リヴァイ像・大山ダム・田来原公園</a>。立ち寄る場所だけ選び、黒川の入浴／大観峰と時間を調整。';day.append(p);}
})();
