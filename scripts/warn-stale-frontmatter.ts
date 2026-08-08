import { spawnSync } from 'node:child_process';

type GitResult = Readonly<{
  status: number;
  stdout: string;
  stderr: string;
}>;

function git(args: readonly string[]): GitResult {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function splitFrontmatter(source: string): Readonly<{ frontmatter: string; body: string }> | undefined {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (match?.[1] === undefined || match[2] === undefined) return undefined;

  return { frontmatter: match[1], body: match[2] };
}

function readField(frontmatter: string, field: 'publishedAt' | 'updatedAt'): string | undefined {
  const match = new RegExp(`^${field}:\\s*['"]?([^'"#\\s]+)`, 'm').exec(frontmatter);
  return match?.[1];
}

function frontmatterWithoutUpdatedAt(frontmatter: string): string {
  return frontmatter
    .split(/\r?\n/)
    .filter((line) => !/^updatedAt:\s*/.test(line))
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .join('\n');
}

const staged = git([
  'diff',
  '--cached',
  '--name-only',
  '--diff-filter=ACMR',
  '-z',
  '--',
  'content/**/*.md',
  'content/**/*.mdx',
]);

if (staged.status !== 0) {
  console.warn(`[frontmatter] warning: staged content could not be inspected: ${staged.stderr.trim()}`);
  process.exit(0);
}

const paths = staged.stdout.split('\0').filter((path) => path.length > 0);
const warnings: string[] = [];

for (const path of paths) {
  const nextResult = git(['show', `:${path}`]);
  if (nextResult.status !== 0) {
    warnings.push(`${path}: staged file could not be read`);
    continue;
  }

  const next = splitFrontmatter(nextResult.stdout);
  if (next === undefined) {
    warnings.push(`${path}: YAML frontmatter is missing or malformed`);
    continue;
  }

  const nextPublishedAt = readField(next.frontmatter, 'publishedAt');
  const nextUpdatedAt = readField(next.frontmatter, 'updatedAt');
  if (nextPublishedAt === undefined) {
    warnings.push(`${path}: publishedAt must be set manually`);
    continue;
  }

  const previousResult = git(['show', `HEAD:${path}`]);
  if (previousResult.status !== 0) continue;

  const previous = splitFrontmatter(previousResult.stdout);
  if (previous === undefined) continue;

  const previousUpdatedAt = readField(previous.frontmatter, 'updatedAt');
  const contentChanged = previous.body !== next.body;
  const semanticFrontmatterChanged =
    frontmatterWithoutUpdatedAt(previous.frontmatter) !== frontmatterWithoutUpdatedAt(next.frontmatter);
  if (contentChanged || semanticFrontmatterChanged) {
    if (nextUpdatedAt === undefined) {
      warnings.push(`${path}: body or semantic frontmatter changed but updatedAt is still absent`);
    } else if (previousUpdatedAt === nextUpdatedAt) {
      warnings.push(`${path}: body or semantic frontmatter changed but updatedAt is still ${nextUpdatedAt}`);
    }
  }
}

if (warnings.length > 0) {
  console.warn('\n[frontmatter] warning: review manual content dates before committing:');
  for (const warning of warnings) console.warn(`  - ${warning}`);
  console.warn('[frontmatter] this hook warns only; the commit is not blocked.\n');
}
