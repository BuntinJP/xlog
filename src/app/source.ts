import { loader } from 'fumadocs-core/source';
import { createMDXSource, defaultSchemas } from 'fumadocs-mdx';
import { z } from 'zod';
import { map } from '.map';

const frontmatterSchema = defaultSchemas.frontmatter.extend({
  date: z
    .string()
    .or(z.date())
    .transform((value, context) => {
      try {
        return new Date(value);
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date',
        });
        return z.NEVER;
      }
    }),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});

export const { getPage, getPages, pageTree } = loader({
  baseUrl: '/posts',
  source: createMDXSource(map, { schema: { frontmatter: frontmatterSchema } }),
});

const posts = getPages();

export type Posts = typeof posts;

const tags = new Set<string>();
for (const post of posts) {
  if (post.data.tags) {
    for (const tag of post.data.tags) {
      tags.add(tag);
    }
  }
}

export const tagsList = Array.from(tags).sort();

export const tagsWithPosts: {
  name: string;
  posts: Posts;
}[] = [];

for (const tag of tags) {
  const filteredPosts = posts.filter((post) => post.data.tags?.includes(tag));
  tagsWithPosts.push({ name: tag, posts: filteredPosts });
}
tagsWithPosts.sort((a, b) => a.name.localeCompare(b.name));

const categories = new Set<string>();

for (const post of posts) {
  if (post.data.categories) {
    for (const category of post.data.categories) {
      categories.add(category);
    }
  }
}

export const categoriesList = Array.from(categories).sort();

export const categoriesWithPosts: {
  name: string;
  posts: Posts;
}[] = [];

for (const category of categories) {
  const filteredPosts = posts.filter((post) =>
    post.data.categories?.includes(category),
  );
  categoriesWithPosts.push({ name: category, posts: filteredPosts });
}
categoriesWithPosts.sort((a, b) => a.name.localeCompare(b.name));
