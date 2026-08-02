import { getLLMText, source } from '@/lib/source';
import { migrationNotFoundResponse } from '@/lib/cache-policy';
import { isMigrationWikiEnabled } from '@/lib/migration-wiki';

export const revalidate = false;

export async function GET() {
  if (!isMigrationWikiEnabled()) return migrationNotFoundResponse();
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
