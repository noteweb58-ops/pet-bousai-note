# GitHub Pages 公開手順

## 推奨設定

- リポジトリ名: `pet-bousai-note`
- 公開形式: Public
- Pages: Deploy from a branch
- Branch: `main`
- Folder: `/root`

## 手順

1. GitHubで `pet-bousai-note` というPublicリポジトリを作成する。
2. このフォルダのファイルをすべてアップロードする。
3. Settings → Pages を開く。
4. Sourceで `Deploy from a branch` を選ぶ。
5. Branchを `main`、Folderを `/root` にして保存する。
6. 数分後に表示されるURLを控える。
7. ローカルで次を実行する。

```powershell
node tools/configure-site.mjs --url https://YOUR-ID.github.io/pet-bousai-note --email noteweb58@gmail.com
node tools/check-site.mjs
```

8. 変更された `robots.txt`、`sitemap.xml`、`README.md` などをGitHubへ再アップロードする。
