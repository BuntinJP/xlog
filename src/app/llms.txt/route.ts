import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { migrationNotFoundResponse } from '@/lib/cache-policy';
import { isMigrationWikiEnabled } from '@/lib/migration-wiki';

export const revalidate = false;

export function GET() {
  if (!isMigrationWikiEnabled()) return migrationNotFoundResponse();
  return new Response(llms(source).index());
}
