import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import {
  draftPostSlugs,
  migrationBaseline,
  publishedCategoryNames,
  publishedPostSlugs,
  publishedTagNames,
} from '../src/lib/migration-baseline';

type ParsedContent = Readonly<{
  body: string;
  categories: readonly string[];
  draft: boolean;
  filename: string;
  publishedAt: string;
  slug: string;
  tags: readonly string[];
  updatedAt: string;
}>;

function fail(message: string): never {
  throw new Error(`[migration] ${message}`);
}

function assertEqual(actual: string | number, expected: string | number, label: string): void {
  if (actual !== expected) fail(`${label}: expected ${String(expected)}, received ${String(actual)}`);
}

function assertExactList(actual: readonly string[], expected: readonly string[], label: string): void {
  const actualSorted = actual.toSorted();
  const expectedSorted = expected.toSorted();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    fail(`${label}: expected ${JSON.stringify(expectedSorted)}, received ${JSON.stringify(actualSorted)}`);
  }
}

function sha256(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

function splitFrontmatter(source: string, filename: string): Readonly<{ body: string; frontmatter: string }> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (match?.[1] === undefined || match[2] === undefined) {
    return fail(`${filename}: YAML frontmatter is missing or malformed`);
  }
  return { body: match[2], frontmatter: match[1] };
}

function readRawField(frontmatter: string, field: string): string | undefined {
  return new RegExp(`^${field}:\\s*(.*?)\\s*$`, 'm').exec(frontmatter)?.[1];
}

function readRequiredScalar(frontmatter: string, field: string, filename: string): string {
  const raw = readRawField(frontmatter, field);
  if (raw === undefined || raw.length === 0) return fail(`${filename}: ${field} is required`);
  const first = raw[0];
  const last = raw.at(-1);
  if ((first === "'" || first === '"') && last === first) return raw.slice(1, -1);
  return raw;
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

function readStringArray(frontmatter: string, field: string, filename: string): readonly string[] {
  const raw = readRawField(frontmatter, field);
  return raw === undefined ? [] : parseInlineStringArray(raw, field, filename);
}

function readDraft(frontmatter: string, filename: string): boolean {
  const raw = readRawField(frontmatter, 'draft');
  if (raw === undefined || raw === 'false') return false;
  if (raw === 'true') return true;
  return fail(`${filename}: draft must be true or false`);
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry): Promise<string[]> => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return walk(path);
      return entry.isFile() ? [path] : [];
    }),
  );
  return nested.flat().toSorted();
}

function manifestDigest(entries: readonly Readonly<{ hash: string; path: string }>[]): string {
  return sha256(entries.map(({ hash, path }) => `${path}\0${hash}\n`).join(''));
}

async function readContent(): Promise<readonly ParsedContent[]> {
  const directory = join(process.cwd(), 'content', 'blog');
  const filenames = (await readdir(directory))
    .filter((filename) => extname(filename) === '.mdx')
    .toSorted();

  const expectedFilenames = ['index', ...publishedPostSlugs, ...draftPostSlugs].map(
    (slug) => `${slug}.mdx`,
  );
  assertExactList(filenames, expectedFilenames, 'content filenames');

  return Promise.all(
    filenames.map(async (filename): Promise<ParsedContent> => {
      const source = await readFile(join(directory, filename), 'utf8');
      const { body, frontmatter } = splitFrontmatter(source, filename);
      readRequiredScalar(frontmatter, 'title', filename);
      readRequiredScalar(frontmatter, 'description', filename);
      const publishedAt = readRequiredScalar(frontmatter, 'publishedAt', filename);
      const updatedAt = readRequiredScalar(frontmatter, 'updatedAt', filename);
      if (!isValidIsoDate(publishedAt)) fail(`${filename}: publishedAt is not a valid ISO date`);
      if (!isValidIsoDate(updatedAt)) fail(`${filename}: updatedAt is not a valid ISO date`);
      if (updatedAt < publishedAt) fail(`${filename}: updatedAt is earlier than publishedAt`);

      return {
        body,
        categories: readStringArray(frontmatter, 'categories', filename),
        draft: readDraft(frontmatter, filename),
        filename,
        publishedAt,
        slug: filename.slice(0, -'.mdx'.length),
        tags: readStringArray(frontmatter, 'tags', filename),
        updatedAt,
      };
    }),
  );
}

async function main(): Promise<void> {
  const content = await readContent();
  const posts = content.filter(({ slug }) => slug !== 'index');
  const published = posts.filter(({ draft }) => !draft);
  const drafts = posts.filter(({ draft }) => draft);

  assertExactList(
    published.map(({ slug }) => slug),
    publishedPostSlugs,
    'published post slugs',
  );
  assertExactList(
    drafts.map(({ slug }) => slug),
    draftPostSlugs,
    'draft post slugs',
  );
  assertExactList(
    Array.from(new Set(published.flatMap(({ categories }) => categories))),
    publishedCategoryNames,
    'published categories',
  );
  assertExactList(
    Array.from(new Set(published.flatMap(({ tags }) => tags))),
    publishedTagNames,
    'published tags',
  );

  const bodyManifest = content
    .map(({ body, filename }) => ({ hash: sha256(body), path: filename }))
    .toSorted((left, right) => left.path.localeCompare(right.path));
  assertEqual(
    manifestDigest(bodyManifest),
    migrationBaseline.bodyManifestSha256,
    'legacy body manifest SHA-256',
  );

  const imageDirectory = join(process.cwd(), 'public', 'images');
  const imagePaths = await walk(imageDirectory);
  const nonWebp = imagePaths.filter((path) => extname(path).toLowerCase() !== '.webp');
  if (nonWebp.length > 0) fail(`unexpected non-WebP image assets: ${nonWebp.join(', ')}`);
  assertEqual(imagePaths.length, migrationBaseline.imageCount, 'WebP asset count');

  const imageManifest = await Promise.all(
    imagePaths.map(async (path) => ({
      hash: sha256(await readFile(path)),
      path: relative(imageDirectory, path).split(sep).join('/'),
    })),
  );
  imageManifest.sort((left, right) => left.path.localeCompare(right.path));
  assertEqual(
    manifestDigest(imageManifest),
    migrationBaseline.imageManifestSha256,
    'legacy image manifest SHA-256',
  );

  const referencedImages = new Set<string>();
  for (const { body } of content) {
    for (const match of body.matchAll(/\/images\/[^)\s"'<>]+/g)) {
      const reference = match[0];
      if (reference !== undefined) referencedImages.add(reference.slice('/images/'.length));
    }
  }
  assertEqual(
    referencedImages.size,
    migrationBaseline.imageReferenceCount,
    'distinct image reference count',
  );

  const imageNames = new Set(imageManifest.map(({ path }) => path));
  const missingImages = Array.from(referencedImages).filter((path) => !imageNames.has(path));
  if (missingImages.length > 0) fail(`missing referenced images: ${missingImages.join(', ')}`);
  const unreferencedImages = Array.from(imageNames).filter((path) => !referencedImages.has(path));
  assertEqual(
    unreferencedImages.length,
    migrationBaseline.unreferencedImageCount,
    'unreferenced image count',
  );

  assertEqual(
    sha256(await readFile(join(process.cwd(), 'public', 'ShipporiMincho-Bold.ttf'))),
    migrationBaseline.fontSha256,
    'font SHA-256',
  );
  assertEqual(
    sha256(await readFile(join(process.cwd(), 'src', 'app', 'favicon.ico'))),
    migrationBaseline.faviconSha256,
    'favicon SHA-256',
  );

  const publicRouteCount =
    5 + publishedPostSlugs.length + publishedCategoryNames.length + publishedTagNames.length;
  assertEqual(publicRouteCount, migrationBaseline.publicRouteCount, 'public route count');

  console.log(
    `[migration] verified content=${content.length} published=${published.length} drafts=${drafts.length} images=${imagePaths.length} references=${referencedImages.size} routes=${publicRouteCount}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
