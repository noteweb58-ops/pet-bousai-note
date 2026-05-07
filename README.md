# ペット防災ノート

犬・猫・小動物の防災備蓄量を計算する、アフィリエイト導線つき静的サイトです。

## 狙う検索意図

直接競合が多い「防災備蓄 計算」「簡易トイレ 必要数」ではなく、記事競合はあるが計算ツール競合が薄い「ペット 防災 備蓄量」「犬 防災 フード 水 必要量」「猫 防災 猫砂 何日分」を狙います。

## ファイル構成

- `index.html`: サイト本体
- `dog.html`: 犬向け入口ページ
- `cat.html`: 猫向け入口ページ
- `multi-pet.html`: 多頭飼い向け入口ページ
- `affiliate-setup.html`: 無料ASPとリンク差し替え手順
- `publish-free.html`: GitHub Pagesで無料公開する手順
- `operations.html`: 公開後の運用チェックリスト
- `affiliate-disclosure.html`: 広告表記
- `privacy.html`: プライバシーポリシー
- `disclaimer.html`: 免責事項
- `contact.html`: お問い合わせ案内
- `styles.css`: レイアウトとデザイン
- `app.js`: ペットの備蓄量計算、チェックリスト、商品カード描画
- `affiliate-config.js`: Amazon、楽天、Yahooなどのリンク差し替え用設定
- `robots.txt`: クローラー向け設定
- `sitemap.xml`: サイトマップの雛形
- `.nojekyll`: GitHub Pagesでそのまま静的ファイルを配信するための空ファイル
- `tools/check-site.mjs`: ローカル確認用スクリプト

## 公開前にやること

1. `affiliate-config.js` の検索URLを自分のアフィリエイトリンクへ差し替える。
2. `index.html` の広告表記、運営者情報、免責文、プライバシーポリシーを自分の運用に合わせる。
3. `robots.txt` と `sitemap.xml` の `https://noteweb58-ops.github.io/pet-bousai-note-note/` を公開URLへ差し替える。
4. Search Consoleに登録する。

## 無料公開ルート

1. GitHubの無料アカウントを作る。
2. `pet-bousai-note` などのリポジトリを作る。
3. このフォルダのファイルをアップロードする。
4. GitHub Pagesを有効化する。
5. 発行されたURLを `robots.txt` と `sitemap.xml` に反映する。

## ローカル確認

Node.jsが使える環境では次を実行します。

```powershell
node tools/check-site.mjs
node --check app.js
node --check affiliate-config.js
```

ローカルでブラウザ確認する場合:

```powershell
node tools/serve.mjs 4173
```

表示URL: `http://127.0.0.1:4173/`

## 公開URLと連絡先の一括設定

GitHub PagesのURLが決まったら、次のように実行します。

```powershell
node tools/configure-site.mjs --url https://YOUR-ID.github.io/pet-bousai-note --email YOUR-MAIL@example.com
node tools/check-site.mjs
```

## 次に増やすページ候補

- 犬の防災備蓄量計算
- 猫の防災備蓄量計算
- 多頭飼いの防災リスト
- シニア犬・シニア猫の災害備蓄
- 療法食が必要なペットの防災備蓄
- ペット同行避難の持ち物リスト

## 注意

計算値は一般的な目安です。持病、療法食、投薬、水分制限がある場合は、動物病院の指示を優先してください。
