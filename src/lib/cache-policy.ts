export const staticPageCacheHeaders: Readonly<Record<string, string>> = {
  'Cache-Control': 'public, max-age=1800, stale-while-revalidate=60',
  'CDN-Cache-Control': 'public, s-maxage=302400, stale-while-revalidate=86400',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=604800',
};

export const ogCacheHeaders: Readonly<Record<string, string>> = {
  'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=86400',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=86400',
};

export const rssCacheHeaders: Readonly<Record<string, string>> = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
  'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
};

export const noStoreHeaders: Readonly<Record<string, string>> = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

export function migrationNotFoundResponse(): Response {
  return new Response('Not Found', { status: 404, headers: noStoreHeaders });
}
