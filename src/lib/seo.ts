import type { Metadata } from 'next';
import { appName, rssPath } from './shared';

export function ogImagePath(title: string, description: string): string {
  const params = new URLSearchParams();
  params.set('title', title);
  params.set('description', description);
  return `/api/og?${params.toString()}`;
}

export function listingMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: appName,
      locale: 'ja_JP',
      title,
      description,
      url: path,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: path,
      types: {
        'application/rss+xml': rssPath,
      },
    },
  };
}
