import type { MetadataRoute } from 'next';
import {
  categoriesWithPosts,
  getHomePage,
  getPublishedPosts,
  latestUpdatedAt,
  tagsWithPosts,
  termPath,
} from '@/lib/blog';
import { siteUrl } from '@/lib/shared';

function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).href;
}

function timestamp(isoDate: string): string {
  return `${isoDate}T00:00:00+09:00`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const latest = latestUpdatedAt(posts);
  const homeUpdatedAt = getHomePage()?.data.updatedAt ?? latest;

  const fixedRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: timestamp(homeUpdatedAt) },
    { url: absoluteUrl('/posts'), lastModified: timestamp(latest) },
    { url: absoluteUrl('/categories'), lastModified: timestamp(latest) },
    { url: absoluteUrl('/tags'), lastModified: timestamp(latest) },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: timestamp(post.data.updatedAt),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoriesWithPosts.map((category) => ({
    url: absoluteUrl(termPath('/categories', category.name)),
    lastModified: timestamp(latestUpdatedAt(category.posts)),
  }));

  const tagRoutes: MetadataRoute.Sitemap = tagsWithPosts.map((tag) => ({
    url: absoluteUrl(termPath('/tags', tag.name)),
    lastModified: timestamp(latestUpdatedAt(tag.posts)),
  }));

  return [...fixedRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes].toSorted((left, right) =>
    left.url.localeCompare(right.url),
  );
}
