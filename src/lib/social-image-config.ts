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
