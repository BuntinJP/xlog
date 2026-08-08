import type { Metadata } from 'next';
import { appName, rssPath } from './shared';
import {
  siteSocialImagePath,
  socialImageContentType,
  socialImageSize,
} from './social-image-config';

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
      images: [
        {
          url: siteSocialImagePath,
          alt: 'xlog.systems',
          type: socialImageContentType,
          ...socialImageSize,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: siteSocialImagePath, alt: 'xlog.systems', ...socialImageSize }],
    },
    alternates: {
      canonical: path,
      types: {
        'application/rss+xml': rssPath,
      },
    },
  };
}
