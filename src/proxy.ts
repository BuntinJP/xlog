import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isPublicCacheablePathname } from '@/generated/public-cache-paths';
import {
  noStoreHeaders,
  seoDocumentCacheHeaders,
  socialImageCacheHeaders,
  staticPageCacheHeaders,
} from '@/lib/cache-policy';
import { isCacheableSocialImagePathname } from '@/lib/social-image-cache';

function withHeaders(response: NextResponse, headers: Readonly<Record<string, string>>): NextResponse {
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  return response;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/generated/social-images/')) {
    const headers = isCacheableSocialImagePathname(pathname)
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

export const config = {
  matcher: [
    '/',
    '/posts/:path*',
    '/categories/:path*',
    '/tags/:path*',
    '/sitemap.xml',
    '/robots.txt',
    '/generated/social-images/:path*',
  ],
};
