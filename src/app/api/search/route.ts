import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { migrationNotFoundResponse } from '@/lib/cache-policy';
import { isMigrationWikiEnabled } from '@/lib/migration-wiki';

const search = createFromSource(source);

export async function GET(request: Request): Promise<Response> {
  if (!isMigrationWikiEnabled()) return migrationNotFoundResponse();
  return search.GET(request);
}
