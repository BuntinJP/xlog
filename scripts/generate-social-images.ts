import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, parse } from 'node:path';
import { renderSocialImage } from '../src/lib/social-image';
import {
  articleSocialImagePath,
  siteSocialImagePath,
} from '../src/lib/social-image-config';

type PostCopy = Readonly<{
  categories: readonly string[];
  description: string;
  lastModifiedAt: string;
  slug: string;
  tags: readonly string[];
  title: string;
}>;

const outputRoot = join(process.cwd(), 'public', 'generated', 'social-images');
const manifestPath = join(process.cwd(), 'src', 'generated', 'social-image-paths.ts');
const publicCacheManifestPath = join(
  process.cwd(),
  'src',
  'generated',
  'public-cache-paths.ts',
);

function fail(message: string): never {
  throw new Error(`[social-images] ${message}`);
}

function frontmatter(source: string, filename: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  return match?.[1] ?? fail(`${filename}: YAML frontmatter is missing or malformed`);
}

function scalar(source: string, field: string, filename: string): string {
  const raw = new RegExp(`^${field}:\\s*(.*?)\\s*$`, 'm').exec(source)?.[1];
  if (raw === undefined || raw.length === 0) return fail(`${filename}: ${field} is required`);

  const first = raw[0];
  const last = raw.at(-1);
  return (first === "'" || first === '"') && last === first ? raw.slice(1, -1) : raw;
}

function optionalScalar(source: string, field: string): string | undefined {
  const raw = new RegExp(`^${field}:\\s*(.*?)\\s*$`, 'm').exec(source)?.[1];
  if (raw === undefined || raw.length === 0) return undefined;

  const first = raw[0];
  const last = raw.at(-1);
  return (first === "'" || first === '"') && last === first ? raw.slice(1, -1) : raw;
}

function parseInlineStringArray(raw: string, field: string, filename: string): readonly string[] {
  let cursor = 0;
  const values: string[] = [];

  const skipWhitespace = () => {
    while (/\s/.test(raw[cursor] ?? '')) cursor += 1;
  };

  skipWhitespace();
  if (raw[cursor] !== '[') return fail(`${filename}: ${field} must be an inline string array`);
  cursor += 1;

  while (cursor < raw.length) {
    skipWhitespace();
    if (raw[cursor] === ']') {
      cursor += 1;
      skipWhitespace();
      if (cursor !== raw.length) return fail(`${filename}: ${field} has trailing syntax`);
      return values;
    }

    const quote = raw[cursor];
    if (quote !== "'" && quote !== '"') {
      return fail(`${filename}: ${field} entries must be quoted strings`);
    }
    cursor += 1;

    let value = '';
    let closed = false;
    while (cursor < raw.length) {
      const character = raw[cursor];
      if (character === quote) {
        if (quote === "'" && raw[cursor + 1] === "'") {
          value += "'";
          cursor += 2;
          continue;
        }
        cursor += 1;
        closed = true;
        break;
      }
      if (character === '\\' && quote === '"') {
        const escaped = raw[cursor + 1];
        if (escaped === undefined) return fail(`${filename}: ${field} has an incomplete escape`);
        value += escaped;
        cursor += 2;
        continue;
      }
      value += character;
      cursor += 1;
    }

    if (!closed || value.length === 0) return fail(`${filename}: ${field} has an invalid entry`);
    values.push(value);
    skipWhitespace();

    if (raw[cursor] === ',') {
      cursor += 1;
      continue;
    }
    if (raw[cursor] !== ']') return fail(`${filename}: ${field} entries must be comma-separated`);
  }

  return fail(`${filename}: ${field} is missing its closing bracket`);
}

function stringArray(source: string, field: string, filename: string): readonly string[] {
  const raw = new RegExp(`^${field}:\\s*(.*?)\\s*$`, 'm').exec(source)?.[1];
  return raw === undefined ? [] : parseInlineStringArray(raw, field, filename);
}

function assertIsoDate(value: string, field: string, filename: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(`${filename}: ${field} must use YYYY-MM-DD`);
  }
}

function isDraft(source: string, filename: string): boolean {
  const raw = /^draft:\s*(.*?)\s*$/m.exec(source)?.[1];
  if (raw === undefined || raw === 'false') return false;
  if (raw === 'true') return true;
  return fail(`${filename}: draft must be true or false`);
}

function outputPath(publicPath: string): string {
  const prefix = '/generated/social-images/';
  if (!publicPath.startsWith(prefix)) return fail(`unexpected public path: ${publicPath}`);
  return join(process.cwd(), 'public', ...publicPath.slice(1).split('/'));
}

async function writeSocialImage(path: string, copy: Readonly<{ description?: string; title: string }>) {
  const response = await renderSocialImage(copy);
  if (!response.ok) fail(`${path}: renderer returned HTTP ${String(response.status)}`);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, new Uint8Array(await response.arrayBuffer()));
}

async function readPublishedPosts(): Promise<readonly PostCopy[]> {
  const contentDirectory = join(process.cwd(), 'content', 'blog');
  const filenames = (await readdir(contentDirectory))
    .filter((filename) => extname(filename) === '.mdx' && filename !== 'index.mdx')
    .toSorted();

  const posts = await Promise.all(
    filenames.map(async (filename): Promise<PostCopy | undefined> => {
      const source = await readFile(join(contentDirectory, filename), 'utf8');
      const data = frontmatter(source, filename);
      if (isDraft(data, filename)) return undefined;

      const slug = parse(filename).name;
      if (!/^[a-z0-9][a-z0-9._-]*$/.test(slug)) return fail(`${filename}: unsupported URL slug`);

      const publishedAt = scalar(data, 'publishedAt', filename);
      const updatedAt = optionalScalar(data, 'updatedAt');
      assertIsoDate(publishedAt, 'publishedAt', filename);
      if (updatedAt !== undefined) assertIsoDate(updatedAt, 'updatedAt', filename);

      return {
        categories: stringArray(data, 'categories', filename),
        slug,
        tags: stringArray(data, 'tags', filename),
        title: scalar(data, 'title', filename),
        description: scalar(data, 'description', filename),
        lastModifiedAt: updatedAt ?? publishedAt,
      };
    }),
  );

  return posts.filter((post): post is PostCopy => post !== undefined);
}

async function writePathManifest(paths: readonly string[]): Promise<void> {
  const source = [
    '// Generated by scripts/generate-social-images.ts. Do not edit manually.',
    'export const generatedArticleSocialImagePaths = [',
    ...paths.toSorted().map((path) => `  '${path}',`),
    '] as const;',
    '',
  ].join('\n');

  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, source);
}

async function writePublicCacheManifest(posts: readonly PostCopy[]): Promise<number> {
  const categoryNames = new Set(posts.flatMap(({ categories }) => categories));
  const tagNames = new Set(posts.flatMap(({ tags }) => tags));
  const paths = Array.from(
    new Set([
      '/',
      '/posts',
      '/categories',
      '/tags',
      ...posts.map(({ slug }) => `/posts/${slug}`),
      ...Array.from(categoryNames, (name) => `/categories/${encodeURIComponent(name)}`),
      ...Array.from(tagNames, (name) => `/tags/${encodeURIComponent(name)}`),
    ]),
  ).toSorted();
  const source = [
    '// Generated by scripts/generate-social-images.ts. Do not edit manually.',
    'const publicCacheablePathnames = new Set<string>([',
    ...paths.map((path) => `  ${JSON.stringify(path)},`),
    ']);',
    '',
    'function normalizePathname(pathname: string): string | undefined {',
    '  try {',
    "    const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\\/$/, '') : pathname;",
    '    return withoutTrailingSlash',
    "      .split('/')",
    '      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))',
    "      .join('/');",
    '  } catch {',
    '    return undefined;',
    '  }',
    '}',
    '',
    'export function isPublicCacheablePathname(pathname: string): boolean {',
    '  const normalized = normalizePathname(pathname);',
    '  return normalized !== undefined && publicCacheablePathnames.has(normalized);',
    '}',
    '',
  ].join('\n');

  await mkdir(dirname(publicCacheManifestPath), { recursive: true });
  await writeFile(publicCacheManifestPath, source);
  return paths.length;
}

async function main(): Promise<void> {
  const posts = await readPublishedPosts();
  const articlePaths = posts.map((post) => articleSocialImagePath(post.slug, post.lastModifiedAt));
  await rm(outputRoot, { recursive: true, force: true });
  await writePathManifest(articlePaths);
  const publicCachePathCount = await writePublicCacheManifest(posts);

  await Promise.all([
    writeSocialImage(outputPath(siteSocialImagePath), { title: 'xlog.systems' }),
    ...posts.map((post, index) =>
      writeSocialImage(outputPath(articlePaths[index] ?? fail(`missing path for ${post.slug}`)), {
        title: post.title,
        description: post.description,
      }),
    ),
  ]);

  console.log(
    `[social-images] generated ${String(posts.length + 1)} static PNG files and ${String(publicCachePathCount)} cacheable page paths`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
