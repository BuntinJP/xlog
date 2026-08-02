import { spawn } from 'node:child_process';
import { access, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, parse } from 'node:path';

type Mode = 'heic' | 'png';

type Options = Readonly<{
  mode: Mode;
  write: boolean;
}>;

function parseOptions(args: readonly string[]): Options {
  const [mode, ...flags] = args;
  if (mode !== 'png' && mode !== 'heic') {
    throw new Error('Usage: bun run images:convert <png|heic> [--write]');
  }

  const supportedFlags = new Set(['--write']);
  const unsupported = flags.find((flag) => !supportedFlags.has(flag));
  if (unsupported !== undefined) throw new Error(`Unsupported option: ${unsupported}`);

  const write = flags.includes('--write');
  return { mode, write };
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry): Promise<string[]> => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return walk(path);
      return entry.isFile() ? [path] : [];
    }),
  );
  return paths.flat().toSorted();
}

function matchesMode(path: string, mode: Mode): boolean {
  const extension = extname(path).toLowerCase();
  return mode === 'png' ? extension === '.png' : extension === '.heic';
}

function destinationFor(path: string): string {
  const parts = parse(path);
  return join(parts.dir, `${parts.name}.webp`);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return false;
    }
    throw error;
  }
}

async function run(command: string, args: readonly string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed (code=${String(code)}, signal=${String(signal)})`));
    });
  });
}

async function convertPng(source: string, destination: string): Promise<void> {
  await run('cwebp', ['-quiet', source, '-o', destination]);
}

async function convertHeic(source: string, destination: string): Promise<void> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'xlog-heic-'));
  const temporaryPng = join(temporaryDirectory, 'source.png');

  try {
    await run('heif-convert', [source, temporaryPng]);
    await convertPng(temporaryPng, destination);
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}

async function convertSource(source: string, options: Options): Promise<void> {
  const destination = destinationFor(source);
  console.log(`${options.write ? 'convert' : 'would convert'} ${source} -> ${destination}`);
  if (!options.write) return;
  if (await exists(destination)) throw new Error(`Refusing to overwrite existing file: ${destination}`);

  if (options.mode === 'png') await convertPng(source, destination);
  else await convertHeic(source, destination);
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const sources = (await walk('public')).filter((path) => matchesMode(path, options.mode));

  if (sources.length === 0) {
    console.log(`No ${options.mode.toUpperCase()} files found under public/.`);
    return;
  }

  await sources.reduce(
    (previous, source) => previous.then(() => convertSource(source, options)),
    Promise.resolve(),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
