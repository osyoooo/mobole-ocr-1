# 書籍申込 合計計算

Next.js + TypeScript + App Routerで作成した、スマホブラウザ向けの手書き冊数OCR計算アプリです。固定レイアウトの書籍申込表を撮影または画像選択し、No1〜No22の「申込冊数」セルだけをブラウザ内のTesseract.jsでOCRします。OCR結果は確認画面で手修正でき、画面には総合計のみを大きく表示します。

## 主な機能

- iOS Safari / Android Chrome のブラウザで利用できるカメラ撮影
- カメラが使えない環境向けの画像アップロード
- Canvas APIによる固定レイアウトの申込冊数セル切り出し
- 「冊」の印字部分を避ける相対座標ベースのトリミング
- グレースケール、コントラスト強調、二値化の前処理
- Tesseract.jsによるブラウザ内OCR
- 数字以外を除外し、空欄や読み取り不可は0として扱う計算処理
- No1〜No22の冊数確認・修正画面
- 冊数修正に応じた総合計の即時更新

## ローカル起動手順

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。スマホの実機でカメラを検証する場合は、同一ネットワーク内で開発サーバーへアクセスしてください。ブラウザの仕様上、カメラ利用にはHTTPSまたはlocalhostが必要です。

## ビルド確認

```bash
npm run build
```

## GitHubへpushする手順

```bash
git status
git add .
git commit -m "Add mobile OCR total calculator"
git push origin <branch-name>
```

## Vercelデプロイ手順

1. GitHubにこのリポジトリをpushします。
2. Vercelで「Add New Project」を選択します。
3. 対象リポジトリをImportします。
4. Framework PresetがNext.jsであることを確認します。
5. Build Commandは `npm run build`、Output Directoryは未指定のままにします。
6. Deployを実行します。

## 固定レイアウト調整

申込冊数セルの切り出し座標は `lib/layout.ts` に相対座標で定義しています。実際の申込表写真でずれがある場合は、以下の値を微調整してください。

- `quantityColumnX`: 申込冊数列の左端
- `quantityColumnWidth`: 申込冊数列の幅
- `firstRowY`: No1行の上端
- `rowHeight`: 各行の高さ
- `cellHeight`: 切り出すセルの高さ
- `rightPrintedUnitTrim`: 右端の「冊」印字を除外する割合
