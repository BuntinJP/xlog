import type { MetadataRoute } from 'next';
import {
  categoriesWithPosts,
  getHomePage,
  getPublishedPosts,
  latestUpdatedAt,
  tagsWithPosts,
  termPath,
} from '@/lib/blog';
import { rssPath, siteUrl } from '@/lib/shared';

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
    { url: absoluteUrl('/'), lastModified: timestamp(homeUpdatedAt), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/posts'), lastModified: timestamp(latest), changeFrequency: 'weekly', priority: 0.9 },
    {
      url: absoluteUrl('/categories'),
      lastModified: timestamp(latest),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    { url: absoluteUrl('/tags'), lastModified: timestamp(latest), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl(rssPath), lastModified: timestamp(latest), changeFrequency: 'daily', priority: 0.6 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: timestamp(post.data.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoriesWithPosts.map((category) => ({
    url: absoluteUrl(termPath('/categories', category.name)),
    lastModified: timestamp(latestUpdatedAt(category.posts)),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tagsWithPosts.map((tag) => ({
    url: absoluteUrl(termPath('/tags', tag.name)),
    lastModified: timestamp(latestUpdatedAt(tag.posts)),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...fixedRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes].toSorted((left, right) =>
    left.url.localeCompare(right.url),
  );
}
