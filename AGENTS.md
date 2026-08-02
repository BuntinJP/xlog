# xLog migration instructions

## Scope and workspace boundary

- Work only in `/Users/larchel/gits/xlog-fumadocs-next` on `migration/fumadocs-latest`.
- Treat `/Users/larchel/gits/xlog` on `migration/legacy` as read-only reference material.
- Preserve the uncommitted legacy article and sitemap change. Never clean, stash, reset, commit, or rewrite them.
- Do not push, merge, deploy, or modify `main` without explicit user approval.

## Migration method

- The generated Fumadocs scaffold is the destination architecture. Port behavior into it in small, reviewable phases; do not transplant the legacy application shell.
- Prefer the current official Next.js and Fumadocs APIs. If an old extension cannot be expressed with official APIs or a sound TypeScript redesign, record it in `content/docs/migration/deferred-items.mdx` instead of adding a fragile compatibility hack.
- Keep the migration wiki current whenever a decision, constraint, validation result, or deferred item changes.
- Use Bun for dependency management and scripts. Keep only `bun.lock`; do not add npm, pnpm, or Yarn lockfiles.

## Type and code safety

- Application and repository scripts must be TypeScript. Configuration may use the file format required by the upstream tool.
- TypeScript 7 is the authoritative CLI type checker. TypeScript 6 exists only as the documented MDX/Next ecosystem compatibility package.
- Do not use `any`, unsafe type assertions, `@ts-ignore`, unchecked non-null assertions, or broad lint disables. Narrow `unknown` values at boundaries.
- Do not weaken `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `skipLibCheck: false`, or other strict compiler options to make a migration pass.
- Validate external data and frontmatter at runtime. Prefer explicit immutable data and Server Components; use Client Components only where interaction or browser APIs require them.
- Avoid raw HTML injection. Never expose secrets, environment values, private URLs, or credentials in browser bundles, logs, fixtures, docs, or review prompts.

## Content dates

- `publishedAt` and `updatedAt` are manual ISO `YYYY-MM-DD` frontmatter fields.
- Never derive `updatedAt` from Git history, filesystem timestamps, build time, or deployment time.
- When article content changes materially, update `updatedAt` in the same change. The pre-commit hook warns when this is missed.
- Do not change dates for mechanical moves or formatting-only changes unless the rendered meaning changes; document exceptional bulk migrations.

## Required verification

- Run `bun install --frozen-lockfile`, `bun run lint`, `bun run types:check`, and `bun run build` before calling a phase complete.
- Also run `bun run types:check:compat` while the TS6 compatibility package remains necessary.
- Compare routes, metadata, RSS, sitemap, OG images, assets, categories, tags, caching, analytics, and rendered MDX against the legacy workspace.
- Record commands and exact results in the migration wiki. A passing local build is not deployment proof.
