import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  noStoreHeaders,
  seoDocumentCacheHeaders,
  socialImageCacheHeaders,
  staticPageCacheHeaders,
} from '@/lib/cache-policy';
import { isPublicCacheablePathname } from '@/lib/migration-baseline';
import { isMigrationWikiEnabled } from '@/lib/migration-wiki';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { isVersionedSocialImagePathname } from '@/lib/social-image-config';

const docsRewriter = rewritePath(`${docsRoute}{/*path}`, `${docsContentRoute}{/*path}/content.md`);
const suffixRewriter = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function withHeaders(response: NextResponse, headers: Readonly<Record<string, string>>): NextResponse {
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  return response;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDocsRequest = pathname === docsRoute || pathname.startsWith(`${docsRoute}/`);

  if (!isDocsRequest) {
    if (pathname.startsWith('/generated/social-images/')) {
      const headers = isVersionedSocialImagePathname(pathname)
        ? socialImageCacheHeaders
        : noStoreHeaders;
      return withHeaders(NextResponse.next(), headers);
    }

    const headers =
      pathname === '/sitemap.xml' || pathname === '/robots.txt'
        ? seoDocumentCacheHeaders
        : isPublicCacheablePathname(pathname)
          ? staticPageCacheHeaders
          : noStoreHeaders;
    return withHeaders(NextResponse.next(), headers);
  }

  if (!isMigrationWikiEnabled()) return withHeaders(NextResponse.next(), noStoreHeaders);

  const suffixResult = suffixRewriter.rewrite(pathname);
  if (suffixResult !== false) {
    return withHeaders(NextResponse.rewrite(new URL(suffixResult, request.nextUrl)), noStoreHeaders);
  }

  if (isMarkdownPreferred(request)) {
    const preferredResult = docsRewriter.rewrite(pathname);
    if (preferredResult !== false) {
      const response = NextResponse.rewrite(new URL(preferredResult, request.nextUrl));
      response.headers.set('Vary', 'Accept');
      return withHeaders(response, noStoreHeaders);
    }
  }

  return withHeaders(NextResponse.next(), noStoreHeaders);
}

export const config = {
  matcher: [
    '/',
    '/posts/:path*',
    '/categories/:path*',
    '/tags/:path*',
    '/docs/:path*',
    '/sitemap.xml',
    '/robots.txt',
    '/generated/social-images/:path*',
  ],
};
