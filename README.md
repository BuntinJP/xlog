# xlog

Fumadocs、Next.js、Tailwind CSS、TypeScript で構築した [xlog.systems](https://www.xlog.systems/) のソースです。パッケージ管理とスクリプト実行には Bun を使用します。

## Local development

```bash
bun install --frozen-lockfile
git config core.hooksPath .githooks
bun run dev
```

ローカルサイトは通常 `http://localhost:3000` で開きます。他の package manager の lockfile は作成しません。

## Verification

```bash
bun run lint
bun run types:check
bun run types:check:compat
bun run build
```

CI と同じ一括チェックは次のコマンドです。

```bash
bun run ci
```

`types:check` は TypeScript 7 の正式な型チェックです。Fumadocs / Next.js の MDX生成処理が TypeScript のプログラムAPIを利用するため、`types:check:compat` では隔離した TypeScript 6 互換チェックも実行します。型制約を回避するための `any` や型チェックの無効化は行いません。

Type gate は Next.js が残す production / development route declaration の衝突を避けるため、`.next/types` と `.next/dev/types` だけを再生成します。`bun run dev`、`bun run start`、`bun run build` と型チェックまたは `bun run ci` を同時実行しないでください。

## Content dates

ブログ記事の `publishedAt` は必須で、公開日を `YYYY-MM-DD` 形式で手動設定します。実際に公開後の内容を変更したときだけ `updatedAt` を手動設定し、一度も更新していない記事ではフィールド自体を省略します。Git履歴、filesystem timestamp、build time、deploy timeから日付を自動生成しません。

`.githooks/pre-commit` は本文または意味のあるfront matterを変更したのに `updatedAt` が未設定・未変更の場合に警告します。警告は内容と日付を人が確認するためのもので、コミット自体は止めません。

下書きを公開するときは、`draft: false` にする前に `publishedAt` が実際の公開日か確認し、公開後の更新実績がなければ `updatedAt` を付けないでください。

## Static social images and caching

`bun run dev` と `bun run build` の前に、公開記事のOG画像と公開ページのCDNキャッシュ対象一覧を静的生成します。個別に再生成する場合は次を実行します。

```bash
bun run social-images:generate
```

OG画像のURLには記事の最終変更日が含まれるため、更新時にURLが変わり、長期CDNキャッシュを安全に利用できます。公開ページ一覧も同じYAML parserとfront matter schemaから生成し、下書きや存在しないパスを共有キャッシュの対象にしません。

## Image conversion

変換スクリプトはpreview-onlyが既定です。上書きは拒否し、変換成功後も入力ファイルを削除しません。

```bash
bun run images:convert png
bun run images:convert heic
bun run images:convert png --write
bun run images:convert heic --write
```

PNGは `cwebp`、HEICは `heif-convert` と `cwebp` をcommand argument arrayで呼び出します。

## Upstream compatibility

- TypeScript 7を正式なcheckerとし、MDX生成用のTypeScript 6 runtimeだけを分離しています。
- `@typescript/typescript6`、`fumadocs-core`、`fumadocs-mdx` のpatchは、strict modeおよびTypeScript 7で上流型宣言を安全に利用するために必要です。依存更新時はpatchの必要性を再確認してください。
- `postcss.config.mjs` はTailwind CSS / Next.jsの設定読込に必要な上流互換のため、TypeScript-only方針の設定ファイル例外です。
