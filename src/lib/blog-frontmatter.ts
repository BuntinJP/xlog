import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const isoDateSchema = z.iso.date();
const termsSchema = z.array(z.string().trim().min(1)).default([]);

export const blogFrontmatterSchema = pageSchema
  .extend({
    description: z.string().trim().min(1),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    tags: termsSchema,
    categories: termsSchema,
    keywords: termsSchema,
    draft: z.boolean().default(false),
  })
  .superRefine((frontmatter, context) => {
    if (frontmatter.updatedAt !== undefined && frontmatter.updatedAt < frontmatter.publishedAt) {
      context.addIssue({
        code: 'custom',
        message: 'updatedAt must be on or after publishedAt',
        path: ['updatedAt'],
      });
    }
  });

export const parseBlogFrontmatter = (value: unknown, source: string) => {
  const parsed = blogFrontmatterSchema.safeParse(value);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid blog frontmatter in ${source}: ${issues}`);
  }
  return parsed.data;
};
