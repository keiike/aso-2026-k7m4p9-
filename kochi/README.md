# 高知スポット

公開ページ: https://keiike.github.io/aso-2026-k7m4p9-/kochi/

2026-10-28に確認した公開情報をまとめた候補集。**行程・訪問順・予約は作成していません。**

## 収録内容

95件、9ジャンル、17エリア。高知市・南国・香美・香南を中心に、仁淀川流域、佐川・越知、土佐・須崎、嶺北、安芸へ拡張。北川・梼原・四国カルストなどは遠方参考として分離。

古道具・骨董、器・工芸・雑貨、喫茶・カフェ、甘いもの、食事・市場、建築・文化、自然・景色、道の駅、温泉・サウナ。ジャンルは重複あり。同じ敷地の道の駅と売店などはカード上に関係を明記。95件は95の完全独立した移動先という意味ではありません。

データの `pick` は旧UIの編集用フラグで、現在の画面には表示・絞り込みを設けていません。中心圏には山間部も含まれ、短時間で到達できる意味ではありません。

## 情報の扱い

各カード・spots.jsonに出典URLと確認日を保持。JSONは `fields` が列名、`rows` が各レコードの配列で、確認日はトップレベルの `checked` を全件に適用。店舗公式、施設、自治体、観光協会、道の駅連絡会の情報を優先。現地確認・電話による当日営業照会は行っていません。営業時間が取得できない場所は未確認のまま明記し、不定休や情報不一致を隠さず記載。臨時休業・在庫を網羅的に監視する機能はありません。

特に注意する情報:
- LOW&SLOWは自由入店の実店舗ではなく、倉庫兼工房への事前相談制。
- 高知県立美術館は2026年10月28日および29–30日に一部展示室等の休室案内。全館休館とは区別。
- 龍河洞の観光コースは11月から最終入洞16:30。冒険コース等は別条件。
- モネの庭は2026年11月1日から水の庭の一部制限、同年のモネのナイトキャンバスは中止。
- 道の駅木の香は連絡会の現行掲載で温泉のみ営業、売店・レストラン・宿泊は休業中。
- 龍河温泉の日帰りは2026年公式案内で土日祝のみ。月次告知も確認。
- 沢田マンションは現役住宅。住居部分の無断立入・撮影等をしない。

## 地図とプライバシー

エリア俯瞰図はエリアの代表点であり、店舗の緯度経度ではありません。各カードは店舗名・所在地を使うGoogleマップ検索と埋め込み表示に対応。入口や駐車場、同名施設は公式アクセスで照合してください。

位置情報の自動取得なし。個人の宿泊予約、便名、氏名、メールアドレス、仕事の会場・予定は収録しません。noindexはアクセス制限ではなく、リポジトリ・ページは公開です。

## 機能

キーワード検索、エリア・範囲・ジャンル絞り込み、注意事項ありフィルタ、名前順・エリア順、お気に入り、訪問済み除外、記録JSONの書き出しと追加読み込み、絞り込み結果の印刷。

記録キー `kochi-field-notes-records-v1` は阿蘇版から分離。端末・ブラウザ単位のlocalStorageであり、GitHubへ送信・同期しません。保存不可でも一覧は動作します。端末変更時はJSONを退避してください。

## 構成・起動

- `index.html` / `styles.css` / `app.js`: ビルド不要の静的サイト
- `spots.json`: ブラウザとダウンロードで共用する候補データ
- `README.md`: 調査範囲・注意点

ローカルでは `python -m http.server 8000` を起動してブラウザで開きます。
地図の初回表示時のみLeaflet 1.9.4をCDNから取得し、背景図にOpenStreetMapを利用。店舗地図はGoogleマップ。外部地図が読み込めなくても候補検索・記録・出典リンクは使えます。


## UI（2026-10-28更新）

Material Design 3のbaselineを参照し、HTML/CSS/JavaScriptで実装。公式コンポーネントライブラリを使用しているという意味ではありません。

キャッチコピー、英語の装飾ラベル、ヒーロー、編集おすすめバッジ、コピー入りフッターを撤去。「スポット」「地図」「記録」を主画面とし、利用上の注意はカードと「情報」に配置。スポットデータ95件は変更していません。

- 色: Material 3 baselineのlight/dark color rolesを `--md-sys-color-*` に定義。`prefers-color-scheme` に追従。
- 文字: title large 22/28、title medium 16/24、body large 16/24、body medium 14/20、body small 12/16、label large 14/20。日本語は端末のサンセリフへフォールバック。フォントファイルは同梱しない。
- 形状: outlined card 12px、chip 8px、outlined text field 4px、dialog 28px、button full。
- 操作: buttonの視覚高40px、chip 32px、操作領域48px以上。hover/pressedのstate layer、ripple、focus ringを実装。
- 構成: top app bar 64px。600px未満はnavigation bar、600px以上はnavigation rail。小画面の絞り込みはfull-screen dialog。
- アクセシビリティ: ネイティブbutton/select/checkbox/dialog、Escapeによるキャンセル、フォーカス復帰、選択状態、live region、reduced motion、forced colorsを実装。
- 保存互換性: `kochi-field-notes-records-v1` とJSONの `app` / `version` を維持。

### 参照した公式仕様

- Color roles: https://m3.material.io/styles/color/the-color-system
- Typography: https://m3.material.io/styles/typography/applying-type
- Material 3: https://developer.android.com/develop/ui/compose/designsystems/material3
- App bars: https://m3.material.io/components/app-bars/overview
- Navigation bar / rail: https://m3.material.io/components/navigation-bar/overview / https://m3.material.io/components/navigation-rail/overview
- Cards: https://m3.material.io/components/cards/overview
- Chips: https://m3.material.io/components/chips/overview
- Text fields: https://m3.material.io/components/text-fields/overview
- Buttons: https://m3.material.io/components/buttons/overview
- Dialogs: https://m3.material.io/components/dialogs/overview

### 検証

ChromiumでオフラインDOM描画による50項目のテストを実施。表示幅320 / 360 / 390 / 599 / 600 / 768 / 1024 / 1440pxの横はみ出し、検索、絞り込みの適用・キャンセル、地図の失敗時表示、記録ファイルの読み書き、フォーカス、ダークテーマ、印刷時の詳細展開を確認。

この環境はURLへのブラウザアクセスが制限されているため、データ取得はローカルのfixture、localStorageはテストダブルを使用。保存データの形式と復元ロジックを検証したもので、実ネットワークの地図描画や実ブラウザストレージの永続性を検証したという意味ではありません。公開反映はGitHub Pagesのデプロイ結果で別途確認します。

### アイコン

`app.js` のインラインSVGはGoogle Material Iconsを基にしています（Apache License 2.0）。原典: https://github.com/google/material-design-icons 。ライセンスは `MATERIAL-ICONS-LICENSE.txt` に同梱。アイコンフォントや外部UIライブラリは不要です。
