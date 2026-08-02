# xlog

xlog を current Fumadocs / Next.js scaffold 上へ再構築する migration worktree です。旧 application shell は移植せず、公開 blog、taxonomy、RSS、SEO、OG、assets、運用拡張を公式 API で再実装しています。

## Local development

この repository の package manager と script runtime は Bun 1.3.14 です。他の package manager の lockfile は作成しません。

```bash
bun install --frozen-lockfile
bun run dev
```

ローカルサイトは通常 `http://localhost:3000` で開きます。migration wiki は開発時だけ `/docs` で閲覧でき、production build では 404 になります。

## Verification

個別 gate:

```bash
bun run lint
bun run verify:migration
bun run types:check
bun run types:check:compat
bun run build
```

CI と同じ canonical gate:

```bash
bun run ci
```

`types:check` は TypeScript 7 の authoritative checker、`types:check:compat` は Fumadocs / Next MDX tooling のために隔離した TypeScript 6 compatibility check です。

`verify:migration` は監査済み legacy baseline に対して content/body、draft/public taxonomy、image references、asset hashes、公開 route 数を検証し、`check` と `ci` の先頭でも実行されます。

Type gate は Next.js が残す production / development route declaration の衝突を避けるため、`.next/types` と `.next/dev/types` だけを再生成します。`bun run dev` / `bun run start` / `bun run build` と type gate / `bun run ci` を同時実行しないでください。

## Content dates

全 MDX は `publishedAt` と `updatedAt` を `YYYY-MM-DD` で手動管理します。Git 履歴、filesystem timestamp、build time、deploy time から生成しません。

## Image conversion

変換 script は preview-only が既定です。上書きは拒否し、変換成功後も入力 source を削除しません。

```bash
bun run images:convert png
bun run images:convert heic
bun run images:convert png --write
bun run images:convert heic --write
```

PNG は `cwebp`、HEIC は `heif-convert` と `cwebp` を command argument array で呼び出します。

## Migration authority

- Repository rules: `AGENTS.md`
- Migration wiki source: `content/docs/migration/`
- Implementation and parity status: `content/docs/migration/implementation-status.mdx`
- Live-vs-local QA matrix: `content/docs/migration/visual-parity.mdx`
- Deferred work: `content/docs/migration/deferred-items.mdx`
