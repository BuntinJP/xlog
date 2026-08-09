import { generatedArticleSocialImagePaths } from '@/generated/social-image-paths';
import { siteSocialImagePath } from '@/lib/social-image-config';

const cacheableSocialImagePathnames = new Set<string>([
  siteSocialImagePath,
  ...generatedArticleSocialImagePaths,
]);

export const isCacheableSocialImagePathname = (pathname: string): boolean => {
  return cacheableSocialImagePathnames.has(pathname);
};
