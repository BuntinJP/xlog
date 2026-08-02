import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/shared';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/docs', '/llms.txt', '/llms-full.txt', '/llms.mdx/', '/og/docs/', '/api/search'],
    },
    host: siteUrl,
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
}
