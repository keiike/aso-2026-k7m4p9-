/* Additional milk sweets researched 2026-09-21. Load after sweets.js, before map/visit modules.
 * Existing names and indexes stay unchanged so saved visits and selectors remain compatible.
 * Public map reference points are not assertions about shop entrances or parking access. */
(() => {
  'use strict';
  const section = document.getElementById('sweets');
  if (typeof ASO_GUIDE === 'undefined' || !section || section.dataset.milkExpanded === 'true') return;
  if (!Array.isArray(ASO_GUIDE.sweets) || typeof card !== 'function' || typeof E !== 'function') return;
  const additions = [
    {
      name:'ASO MILK FACTORY', address:'熊本県阿蘇市小里781',
      group:'阿蘇市・草千里・宮地', genre:'阿部牧場／ソフト・ジェラート・プリン・バウム・カンノーリ',
      hours:'9:30〜18:00／ジェラート・ドリンクL.O.17:30／年中無休',
      phone:'0967-23-6262', status:'ミルクのお菓子を幅広く選ぶ第一候補',
      milk:'阿部牧場のASO MILK。ソフト・ジェラート・ASOMILKプリン、自家製リコッタのカンノーリを公式確認。',
      note:'阿部牧場のASO MILKを使うソフト・ジェラート・プリンを軸に、バウムソフトやリコッタのカンノーリも選べる。冷たいもの以外も買いたい日に向く。22日、もちとこから内牧・大観峰方面へ向かう際の追加案。隔週水曜は機械メンテナンスでソフト関連L.O.16:00。保冷が必要な品は持ち歩ける時間を店で確認。',
      source:'https://asomilkfactory.com/about/', label:'阿部牧場・施設公式',
      extra:'https://www.asocity-kanko.jp/spot/aso-milk-factory/'
    },
    {
      name:'道の駅阿蘇 ソフトクリーム販売所', address:'熊本県阿蘇市黒川1440-1',
      group:'阿蘇市・草千里・宮地', genre:'阿蘇駅前／阿部牧場と竹原牧場のミルクソフト',
      hours:'通常の販売所9:30〜17:00／道の駅は9:00〜18:00・年中無休（季節変動あり）',
      phone:'0967-35-5088', status:'2人で違う牧場のソフトを食べ比べる候補',
      milk:'阿蘇市内の阿部牧場・竹原牧場の牛乳。2牧場のミルクソフトを施設公式で確認。',
      note:'阿部牧場と竹原牧場の2つのミルクソフトを、1か所で選べる。9/5/2026からASO MILK抹茶ソフトも発売。以前のヨーグルトソフトは8/31販売終了のため候補にしていない。草千里から宮地へ向かう途中や、22日のもちとこ前後に短い休憩を取る案。売店本体の閉店時刻とソフトの販売終了は別。',
      source:'https://www.aso-denku.jp/recommend/2026/08/%E3%80%90%E3%82%BD%E3%83%95%E3%83%88%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%80%91%E6%96%B0%E5%95%86%E5%93%81%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B/', label:'道の駅公式・販売品の更新',
      extra:'https://www.aso-denku.jp/information/2025/08/%E3%80%90%E3%81%8A%E7%9B%86%E6%9C%9F%E9%96%93%E3%81%AE%E5%96%B6%E6%A5%AD%E6%99%82%E9%96%93%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%80%91/'
    },
    {
      name:'ASO MILK ice cream shop（ニュー草千里）', address:'熊本県阿蘇市永草2391-15 ニュー草千里1階',
      group:'阿蘇市・草千里・宮地', genre:'草千里／ASO MILKの特製アイス',
      hours:'10:00〜17:00／不定休', phone:'0967-34-0011', status:'草千里散策・博物館のあとに寄る候補',
      milk:'施設公式が、阿蘇の草・水で育てた牛のミルクを使うASOMILKのアイスと案内。',
      note:'ニュー草千里1階のアイス店。草千里珈琲焙煎所とは別の売場。早朝6時台の散策時には開いていないので、博物館を見た後の10時以降に選ぶ。すでに草千里に駐車している間に寄れば、別の買い物先へ移動する手間を減らせる。',
      source:'https://www.newkusasenri.com/', label:'ニュー草千里公式'
    },
    {
      name:'阿蘇天然アイス', address:'熊本県阿蘇市一の宮町宮地2269-2',
      group:'阿蘇市・草千里・宮地', genre:'宮地／小国ジャージー牛乳の手作りアイス・ジェラート',
      hours:'10:00〜17:00（季節変動あり）／不定休', phone:'0967-22-4840', status:'宮地の古道具店巡りと組み合わせやすい',
      milk:'公式は、使用する牛乳を阿蘇・小国のジャージー牛乳と明記。',
      note:'小国ジャージー牛乳と季節の果物・野菜を使う手作りアイス。ソフト専門ではなくジェラート／アイスを選ぶ候補。宮地の参拝・komeko・アンティーク店巡りの前後に追加しやすい。公式掲載の駐車場は5台。当日の味と売切れ状況は未確認。',
      source:'https://www.asoice.jp/kodawari', label:'店舗公式・原材料', extra:'https://www.asoice.jp/company'
    },
    {
      name:'阿蘇ミルクファーム（阿蘇ファームランド）', address:'熊本県阿蘇郡南阿蘇村河陽5579-3 阿蘇ファームランド内',
      group:'南阿蘇・西原', genre:'南阿蘇・赤水側／ASO MILKソフト・ジェラート・プリン・チーズケーキ',
      hours:'公式掲載9:00〜17:00。ただし確認できた時間表は夏期対象で、9月の営業は要確認',
      phone:'0967-67-2100', status:'南阿蘇で冷菓とお土産をまとめて選ぶ候補',
      milk:'施設公式でASO MILKのソフト・ジェラート、自家製スイーツの取扱いを確認。',
      note:'ミルクのソフト・ジェラートに加え、濃厚生チーズケーキ1592、あそりんどうプリンなどを扱う。全商品の乳原料を一律に阿蘇産と断定せず、個別表示を確認。ファームランドの入場自体は無料だが有料施設は別。西原村の「阿蘇ミルク牧場」とは異なる施設。電話は日帰り施設の総合窓口。',
      source:'https://asofarmland.co.jp/shopping/milkfarm', label:'施設公式・商品', extra:'https://asofarmland.co.jp/price'
    },
    {
      name:'山田さんちの牧場 ミルクの里', address:'熊本県阿蘇郡西原村小森1801-3',
      group:'南阿蘇・西原', genre:'西原村／自家牧場の牛乳ソフト・ジェラート',
      hours:'10:00〜17:30／年中無休', phone:'096-279-2720', status:'西原・熊本空港側に帰るなら有力',
      milk:'山田さんちの牧場の牛乳を使用すると店舗公式が明記。',
      note:'公式掲載では「100％牛乳ソフトクリーム」とジェラートが各380円、旬の果肉入りソフト530円。「100％牛乳」は商品名で、糖類等を含まないという意味ではない。価格は現地表示を優先。南阿蘇から西原・熊本空港側へ帰る別案に向き、日田経由へそのまま足す寄り道ではない。',
      source:'https://www.yamada-milk.com/milk/', label:'店舗公式・牛乳／価格／営業時間'
    },
    {
      name:'阿蘇ミルク牧場 モーモーソフトの家', address:'熊本県阿蘇郡西原村河原3944-1 らくのうマザーズ阿蘇ミルク牧場内',
      group:'南阿蘇・西原', genre:'西原村／5種類の乳牛の自家製ミルクソフト',
      hours:'ソフトの家は土日祝11:00〜15:00／牧場10:00〜17:00・最終入場16:45。休園日は営業カレンダーで確認',
      phone:'096-292-2100', status:'入場料が別途必要・牧場も楽しむ日に',
      milk:'牧場で飼う5種類の乳牛のミルクを使うと施設公式に明記。',
      note:'公式掲載はソフト500円に加え大人入場料800円。2人が入場して1個ずつ買うと2,600円の計算なので、安くソフトだけ買うなら他店を優先。牧場の散策も楽しむ場合の候補。園内ジャーマンポテトの家にもソフトの掲載があるが売場ごとに時間が異なる。',
      source:'https://www.aso-milk.jp/eat/', label:'牧場公式・ソフトの原料／売場', extra:'https://aso-milk.jp/information/'
    },
    {
      name:'OGUNIYA JERSEY', address:'熊本県阿蘇郡小国町宮原1760-3',
      group:'小国・わいた', genre:'小国・宮原／小国ジャージーのソフト・ジェラート',
      hours:'10:00〜17:00／公式は火曜休、観光協会は不定休の掲載。9/22営業は要電話',
      phone:'0967-32-8061', status:'小国経由の候補・22日は開く前提にしない',
      milk:'小国の梅田牧場のジャージー乳を使うと観光協会が明記。',
      note:'道の駅小国ゆうステーション近くのジャージー牛乳専門店。小国を通るときに選びやすいが、公式と観光協会の休業日表記が一致しない。9/22は火曜かつ休日なので特別営業の有無を電話で確認。カップルも同じ梅田牧場系なので、両店を必須にせず行きやすい方を選ぶ。',
      source:'https://oguniya.com/', label:'店舗公式・営業時間', extra:'https://ogunitown.info/tourism/2104/'
    },
    {
      name:'ジャージー牧場 カップル', address:'熊本県阿蘇郡小国町西里2053-204',
      group:'小国・わいた', genre:'小国・西里／ジャージープリンソフト・手作り乳製品',
      hours:'観光協会掲載：平日9:00〜17:00／土日祝9:00〜18:00／木曜休（祝日は営業）',
      phone:'0967-46-5838', status:'小国・わいた方面へ回る日の候補',
      milk:'小国の梅田ジャージー牧場直営。自家製ジャージー乳のスイーツを観光協会で確認。',
      note:'ジャージープリンソフトを選ぶならここ。自家製の乳製品も扱う。小国中心部から西里方面へ寄る案で、阿蘇市西町にある「果実の国カップルズ」とは別の店。そらいろのたねとの組合せも候補だが、帰福時刻に余裕がある場合に。',
      source:'https://ogunitown.info/tourism/5198/', label:'ASOおぐに観光協会'
    },
    {
      name:'そらいろのたね', address:'熊本県阿蘇郡小国町西里3223-20',
      group:'小国・わいた', genre:'小国・西里／ジャージーミルクパン・カスタードのクリームパン',
      hours:'観光協会掲載10:00〜17:00／水・木曜休。売切れ・当日の閉店時刻は要確認',
      phone:'0967-46-3666', status:'ソフト以外のミルク菓子・帰りの軽食候補',
      milk:'小国の特産ジャージー牛乳を使うミルクパン・クリームパンを自治体の返礼品紹介でも確認。',
      note:'ソフト専門店ではなくパン屋。ジャージーミルクのパンと、同じ牛乳で作るカスタードのクリームパンが候補。菓子パンを持ち帰りたいとき向き。人気商品の在庫や保冷の要否は購入時に確認。小国・わいた方面への寄り道になるため、南阿蘇から直行で熊本市へ帰る場合は見送る。',
      source:'https://ogunitown.info/tourism/1815/', label:'ASOおぐに観光協会', social:'https://soraironotane.jp/',
      extra:'https://furusato.jreast.co.jp/furusato/products/detail/C987/C987-5603391'
    }
  ];
  const existingNames = new Set(ASO_GUIDE.sweets.map(p => p.name));
  if (additions.some(p => existingNames.has(p.name))) return;
  ASO_GUIDE.sweets.push(...additions);
  const referencePoints = [
    ['ASO MILK FACTORY',32.9760748,131.051105,'published','観光協会のGoogleマップリンクに含まれる施設参照座標','https://www.asocity-kanko.jp/spot/aso-milk-factory/'],
    ['道の駅阿蘇 ソフトクリーム販売所',32.937234,131.080627,'area','道の駅公式の掲載地図の中心。周辺位置の目安で売場入口ではない','https://www.aso-denku.jp/access/'],
    ['ASO MILK ice cream shop（ニュー草千里）',32.886147,131.054318,'published','ニュー草千里公式のGoogleマップ案内に含まれる建物座標','https://www.newkusasenri.com/'],
    ['阿蘇天然アイス',32.940541,131.119768,'published','店舗公式のアクセス案内リンクに含まれる店舗参照座標','https://www.asoice.jp/company'],
    ['阿蘇ミルクファーム（阿蘇ファームランド）',32.8968001,131.0053301,'address','ファームランド公式地図の施設代表点。店内売場や駐車場入口の位置ではない','https://asofarmland.co.jp/access'],
    ['山田さんちの牧場 ミルクの里',32.841187214548036,130.8983598705626,'area','店舗公式の掲載地図の表示中心。広域の目安で店舗位置は地図リンクで確認','https://www.yamada-milk.com/milk/'],
    ['阿蘇ミルク牧場 モーモーソフトの家',32.7981995,130.9089047,'area','牧場公式掲載地図の中心。牧場周辺の目安で園内売場の位置ではない','https://aso-milk.jp/information/'],
    ['OGUNIYA JERSEY',33.1223634189671,131.0636467754407,'area','店舗公式掲載地図の中心。周辺の目安で店舗入口ではない','https://oguniya.com/access.html'],
    ['ジャージー牧場 カップル',33.165876973393104,131.1107344101139,'area','観光協会掲載地図の中心。周辺の目安で店舗入口ではない','https://ogunitown.info/tourism/5198/'],
    ['そらいろのたね',33.1534754720034,131.12616231445028,'area','観光協会掲載地図の中心。周辺の目安で店舗入口ではない','https://ogunitown.info/tourism/1815/']
  ];
  window.ASO_SWEETS_GEO = [...(window.ASO_SWEETS_GEO || []), ...referencePoints];
  const originalGroups = {'kibaco（キバコ）':'南阿蘇・西原','ついんスター':'菊池・山鹿・熊本市','栗と空':'菊池・山鹿・熊本市','熊本城香梅庵（陣太鼓ソフト）':'菊池・山鹿・熊本市'};
  const groupOrder = ['阿蘇市・草千里・宮地','南阿蘇・西原','小国・わいた','菊池・山鹿・熊本市'];
  const getGroup = p => p.group || originalGroups[p.name] || '菊池・山鹿・熊本市';
  const renderCard = p => {
    const markup = card(p);
    const milk = p.milk ? '<p class="milk-origin"><b>牛乳・乳製品：</b>'+E(p.milk)+'</p>' : '<p class="milk-origin milk-unverified">以前追加した候補。今回、阿蘇産牛乳の使用は個別に確認していません。</p>';
    return markup.replace('<div class="links">',milk+'<div class="links">');
  };
  section.innerHTML = '<h2>ソフトクリーム・ミルクスイーツ '+ASO_GUIDE.sweets.length+'候補</h2>'+
    '<p class="lead"><b>阿蘇の牛乳を使う店を中心に10店追加。</b> ソフトだけでなく、ジェラート・プリン・チーズ菓子・クリームパンまで選べます。地図の「甘」ピンと訪問チェックに対応。既存の行程へ全店を自動追加したわけではありません。</p>'+
    '<div class="memo"><b>今の行程なら、この順に検討</b>宮地の店巡りには「阿蘇天然アイス」。阿蘇駅周辺なら「道の駅阿蘇」で2牧場のソフトを比較。冷たいものも焼き菓子も選ぶなら「ASO MILK FACTORY」。草千里ではアイス店の10時開店に注意。<br><b>22日の休業注意：</b>OGUNIYAは公式が火曜休、栗と空は月曜祝日の翌日休みの案内。連休の特別営業は未確認なので、向かう前に電話。<br><b>費用：</b>山田さんちの牧場のソフトは公式掲載380円。阿蘇ミルク牧場はソフト500円に加え大人入場800円。価格・営業は現地を優先。</div>'+
    '<div class="searchbar"><input type="search" id="sweets-search" aria-label="スイーツの候補を検索" placeholder="地域・店名・プリン・牛乳など"><button type="button" id="open-sweets">全地域を開く</button></div>'+
    groupOrder.map((g,i) => '<details class="storegroup sweets-group" '+(i<2?'open':'')+'><summary>'+E(g)+' <span>'+ASO_GUIDE.sweets.filter(p=>getGroup(p)===g).length+'店</span></summary><div class="cards">'+ASO_GUIDE.sweets.filter(p=>getGroup(p)===g).map(renderCard).join('')+'</div></details>').join('')+
    '<p class="note">確認日：2026/9/21。牛乳の産地・牧場は、店舗・観光協会等が明記した範囲を記載しています。すべての商品・原材料が阿蘇産という意味ではありません。通常営業時間と掲載価格であり、当日の特別営業・提供メニュー・在庫・変更は未照会。生菓子の保冷条件は購入時に確認してください。白地・破線の地図ピンは掲載地図中心を使った周辺目安で、店舗入口を示しません。</p>';
  section.dataset.milkExpanded = 'true';
  const style = document.createElement('style');
  style.textContent = '#sweets .milk-origin{border-left:2px solid #b27987;background:#fcf7f8;padding:7px 9px;font-size:11px}#sweets .milk-unverified{color:#69777c;background:#f7f8f8;border-color:#ccd4d6}#sweets .sweets-group{scroll-margin-top:12px}';
  document.head.append(style);
  document.getElementById('sweets-search').addEventListener('input', e => {
    const q=e.target.value.trim().toLocaleLowerCase();
    section.querySelectorAll('.sweets-group').forEach(group => {
      let n=0;
      group.querySelectorAll('.place').forEach(el => {el.hidden=!!q&&!el.textContent.toLocaleLowerCase().includes(q);if(!el.hidden)n++;});
      group.hidden=n===0;if(q&&n)group.open=true;
    });
  });
  document.getElementById('open-sweets').onclick=()=>section.querySelectorAll('.sweets-group').forEach(el=>{el.open=true;});
  const days=document.querySelectorAll('.day');
  if(days[1]){const p=document.createElement('p');p.className='note';p.innerHTML='ミルクの寄り道：<a href="#sweets">草千里のASO MILK店（10時〜）／道の駅阿蘇／宮地の阿蘇天然アイス</a>から選ぶ。すべてを回らず、店巡りと組み合わせる案。';days[1].append(p);}
  if(days[2]){const old=Array.from(days[2].querySelectorAll('.note')).find(el=>el.textContent.startsWith('甘いものの追加候補：'));if(old)old.innerHTML='甘いものの追加候補：<a href="#sweets">kibaco／ASO MILK FACTORY／西原の牧場スイーツ／小国のジャージー菓子</a>。帰る方向に合う1〜2店を選び、菊池・熊本方面は別経路として検討。';}
})();
