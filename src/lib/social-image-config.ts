export const socialImageSize = {
  width: 1200,
  height: 630,
} as const;

export const socialImageContentType = 'image/png';
export const socialImageVersion = '2026-08-03-v1';

export const siteSocialImagePath = `/generated/social-images/site-${socialImageVersion}.png`;

export function articleSocialImagePath(slug: string, updatedAt: string): string {
  return `/generated/social-images/posts/${slug}/${updatedAt}-${socialImageVersion}.png`;
}

export function isVersionedSocialImagePathname(pathname: string): boolean {
  if (pathname === siteSocialImagePath) return true;

  const match = /^\/generated\/social-images\/posts\/([^/]+)\/(\d{4}-\d{2}-\d{2})-([^/]+)\.png$/.exec(
    pathname,
  );
  return (
    match?.[1] !== undefined &&
    match[2] !== undefined &&
    match[3] === socialImageVersion &&
    publishedPostSlugs.includes(match[1])
  );
}
import { publishedPostSlugs } from './migration-baseline';
