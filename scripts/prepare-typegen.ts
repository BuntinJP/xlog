import { rm } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const repositoryRoot = resolve(process.cwd());
const generatedRoot = join(repositoryRoot, '.next');
const targets = [join(generatedRoot, 'types'), join(generatedRoot, 'dev', 'types')] as const;
const incrementalCache = join(repositoryRoot, 'tsconfig.tsbuildinfo');

for (const target of targets) {
  if (!target.startsWith(`${generatedRoot}${sep}`) || target === generatedRoot) {
    throw new Error(`Refusing to remove an unexpected path: ${target}`);
  }
}

await Promise.all([
  ...targets.map((target) => rm(target, { force: true, recursive: true })),
  rm(incrementalCache, { force: true }),
]);
console.log('Removed stale route types and the TypeScript incremental cache.');
