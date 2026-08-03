import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineCollections } from 'fumadocs-mdx/macro';
import { z } from 'zod';

const isoDateSchema = z.iso.date();
const termsSchema = z.array(z.string().trim().min(1)).default([]);

export const blogFrontmatterSchema = pageSchema
  .extend({
    description: z.string().trim().min(1),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema,
    tags: termsSchema,
    categories: termsSchema,
    keywords: termsSchema,
    draft: z.boolean().default(false),
  })
  .superRefine((frontmatter, context) => {
    if (frontmatter.updatedAt < frontmatter.publishedAt) {
      context.addIssue({
        code: 'custom',
        message: 'updatedAt must be on or after publishedAt',
        path: ['updatedAt'],
      });
    }
  });

const blogCollection = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogFrontmatterSchema,
  postprocess: {
    includeProcessedMarkdown: true,
  },
});

export const blogSource = loader({
  baseUrl: '/posts',
  source: blogCollection.toFumadocsSource(),
});

export type BlogPost = (typeof blogSource)['$inferPage'];
export type TaxonomyEntry = Readonly<{
  name: string;
  posts: readonly BlogPost[];
}>;

const featuredCategoryNames = ['工作', '備忘録'] as const;
const allPages = blogSource.getPages();

for (const page of allPages) {
  const parsed = blogFrontmatterSchema.safeParse(page.data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid blog frontmatter in ${page.path}: ${issues}`);
  }
}

function isPost(page: BlogPost): boolean {
  return page.slugs.length > 0;
}

function byPublishedDateDescending(left: BlogPost, right: BlogPost): number {
  return right.data.publishedAt.localeCompare(left.data.publishedAt);
}

function byTaxonomyName(left: TaxonomyEntry, right: TaxonomyEntry): number {
  return left.name.localeCompare(right.name);
}

export function getHomePage(): BlogPost | undefined {
  return blogSource.getPage([]);
}

export function getPublishedPosts(): readonly BlogPost[] {
  return allPages.filter((page) => isPost(page) && !page.data.draft).toSorted(byPublishedDateDescending);
}

export function getSinglePostSlug(post: BlogPost): string {
  const slug = post.slugs[0];
  if (slug === undefined || post.slugs.length !== 1) {
    throw new Error(`Blog posts must use exactly one URL segment: ${post.slugs.join('/')}`);
  }
  return slug;
}

export function getDraftPosts(): readonly BlogPost[] {
  return allPages.filter((page) => isPost(page) && page.data.draft).toSorted(byPublishedDateDescending);
}

export function getPublishedPost(slugs: string[]): BlogPost | undefined {
  const page = blogSource.getPage(slugs);
  if (page === undefined || !isPost(page) || page.data.draft) return undefined;
  return page;
}

export function getVisiblePost(slugs: string[]): BlogPost | undefined {
  const publishedPost = getPublishedPost(slugs);
  if (publishedPost !== undefined) return publishedPost;
  if (process.env.NODE_ENV === 'production') return undefined;

  const draft = blogSource.getPage(slugs);
  return draft !== undefined && isPost(draft) && draft.data.draft ? draft : undefined;
}

function createTaxonomy(field: 'categories' | 'tags'): readonly TaxonomyEntry[] {
  const grouped = new Map<string, BlogPost[]>();

  for (const post of getPublishedPosts()) {
    for (const name of post.data[field]) {
      const existing = grouped.get(name);
      if (existing === undefined) grouped.set(name, [post]);
      else existing.push(post);
    }
  }

  return Array.from(grouped, ([name, posts]) => ({
    name,
    posts: posts.toSorted(byPublishedDateDescending),
  })).toSorted(byTaxonomyName);
}

export const tagsWithPosts = createTaxonomy('tags');
export const categoriesWithPosts = createTaxonomy('categories');
export const tagNames = tagsWithPosts.map(({ name }) => name);
export const categoryNames = categoriesWithPosts.map(({ name }) => name);

export const featuredCategories = featuredCategoryNames
  .map((name) => categoriesWithPosts.find((entry) => entry.name === name))
  .filter((entry): entry is TaxonomyEntry => entry !== undefined);

export const otherCategories = categoriesWithPosts.filter(
  ({ name }) => !featuredCategoryNames.some((featuredName) => featuredName === name),
);

export function categoriesByPostCount(): readonly TaxonomyEntry[] {
  return [
    ...featuredCategories,
    ...otherCategories.toSorted(
      (left, right) => right.posts.length - left.posts.length || byTaxonomyName(left, right),
    ),
  ];
}

export function categoriesForIndex(): readonly TaxonomyEntry[] {
  return [
    ...featuredCategories.toSorted(byTaxonomyName),
    ...otherCategories.toSorted(
      (left, right) => right.posts.length - left.posts.length || byTaxonomyName(left, right),
    ),
  ];
}

export function tagsByPostCount(): readonly TaxonomyEntry[] {
  return tagsWithPosts.toSorted(
    (left, right) => right.posts.length - left.posts.length || byTaxonomyName(left, right),
  );
}

export function findCategory(name: string): TaxonomyEntry | undefined {
  return categoriesWithPosts.find((entry) => entry.name === name);
}

export function findTag(name: string): TaxonomyEntry | undefined {
  return tagsWithPosts.find((entry) => entry.name === name);
}

export function latestUpdatedAt(posts: readonly BlogPost[]): string {
  const latest = posts.map((post) => post.data.updatedAt).toSorted().at(-1);
  if (latest === undefined) throw new Error('latestUpdatedAt requires at least one published post');
  return latest;
}

export function formatJapaneseDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00+09:00`).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });
}

export function toRfc822Date(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00+09:00`).toUTCString();
}

export function termPath(basePath: '/categories' | '/tags', name: string): string {
  return `${basePath}/${encodeURIComponent(name)}`;
}

export function decodeTermSegment(segment: string): string | undefined {
  try {
    return decodeURIComponent(segment);
  } catch {
    return undefined;
  }
}
