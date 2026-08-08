import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/shared';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: siteUrl,
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
}
