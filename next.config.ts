import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

// Browser: 30分 / Cloudflare: 3.5日 / Vercel: 7日
const staticPageHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=1800, stale-while-revalidate=60',
  },
  {
    key: 'CDN-Cache-Control',
    value: 'public, s-maxage=302400, stale-while-revalidate=86400',
  },
  {
    key: 'Vercel-CDN-Cache-Control',
    value: 'public, s-maxage=604800, stale-while-revalidate=604800',
  },
];

const config: NextConfig = {
  allowedDevOrigins: ['localhost', '192.168.1.13'],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/((?!api/).*)',
        headers: staticPageHeaders,
      },
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=2592000, stale-while-revalidate=86400',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/rss.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=300',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
