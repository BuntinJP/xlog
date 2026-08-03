import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Folder, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TermBadge } from '@/components/blog/term-badge';
import { getMDXComponents } from '@/components/mdx';
import {
  formatJapaneseDate,
  getDraftPosts,
  getPublishedPosts,
  getVisiblePost,
} from '@/lib/blog';
import { appName, rssPath } from '@/lib/shared';

function singleSlug(slugs: readonly string[]): string {
  const slug = slugs[0];
  if (slug === undefined || slugs.length !== 1) {
    throw new Error(`Blog posts must use exactly one URL segment: ${slugs.join('/')}`);
  }
  return slug;
}

export default async function PostPage({ params }: PageProps<'/posts/[slug]'>) {
  const { slug } = await params;
  const post = getVisiblePost([slug]);
  if (post === undefined) notFound();

  const MDX = post.data.body;
  const showUpdatedAt = post.data.updatedAt !== post.data.publishedAt;

  return (
    <main>
      <DocsBody className="blog-prose">
        <h1 className="mb-2 text-center text-3xl font-normal sm:text-4xl">{post.data.title}</h1>
        {post.data.draft ? (
          <p className="mx-auto mb-3 w-fit rounded bg-amber-500/20 px-3 py-1 text-amber-200">Draft</p>
        ) : null}
        <p className="flex flex-wrap items-center justify-center gap-x-4 text-lg">
          <span>
            投稿日:{' '}
            <time dateTime={post.data.publishedAt}>{formatJapaneseDate(post.data.publishedAt)}</time>
          </span>
          {showUpdatedAt ? (
            <span>
              最終更新日:{' '}
              <time dateTime={post.data.updatedAt}>{formatJapaneseDate(post.data.updatedAt)}</time>
            </span>
          ) : null}
        </p>
        <div className="flex flex-wrap gap-1">
          {post.data.categories.map((category) => (
            <TermBadge key={`category:${category}`} name={category} basePath="/categories" icon={Folder} />
          ))}
          {post.data.tags.map((tag) => (
            <TermBadge key={`tag:${tag}`} name={tag} basePath="/tags" icon={Tag} />
          ))}
        </div>
        <p className="my-4 text-center">{post.data.description}</p>
        <InlineTOC items={post.data.toc} className="mb-10" />
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </main>
  );
}

export function generateStaticParams(): { slug: string }[] {
  const posts =
    process.env.NODE_ENV === 'production'
      ? getPublishedPosts()
      : [...getPublishedPosts(), ...getDraftPosts()];
  return posts.map((post) => ({ slug: singleSlug(post.slugs) }));
}

export async function generateMetadata({ params }: PageProps<'/posts/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getVisiblePost([slug]);
  if (post === undefined) notFound();

  const publishedTime = `${post.data.publishedAt}T00:00:00+09:00`;
  const modifiedTime = `${post.data.updatedAt}T00:00:00+09:00`;

  return {
    title: post.data.title,
    description: post.data.description,
    ...(post.data.keywords.length > 0 ? { keywords: post.data.keywords } : {}),
    authors: [{ name: 'Buntin' }],
    openGraph: {
      type: 'article',
      locale: 'ja_JP',
      siteName: appName,
      title: post.data.title,
      description: post.data.description,
      url: post.url,
      publishedTime,
      modifiedTime,
      tags: [...post.data.tags, ...post.data.categories],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.data.title,
      description: post.data.description,
    },
    alternates: {
      canonical: post.url,
      types: {
        'application/rss+xml': rssPath,
      },
    },
  };
}
