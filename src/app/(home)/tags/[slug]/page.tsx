import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/post-list';
import { decodeTermSegment, findTag, tagsWithPosts, termPath } from '@/lib/blog';
import { listingMetadata } from '@/lib/seo';

export default async function TagPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params;
  const name = decodeTermSegment(slug);
  const tag = name === undefined ? undefined : findTag(name);
  if (tag === undefined) notFound();

  return (
    <main>
      <h1 className="flex items-center text-2xl">
        <Tag className="mr-1" size={26} />
        {tag.name}
      </h1>
      <PostList posts={tag.posts} />
    </main>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return tagsWithPosts.map(({ name }) => ({ slug: name }));
}

export async function generateMetadata({ params }: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const name = decodeTermSegment(slug);
  const tag = name === undefined ? undefined : findTag(name);
  if (tag === undefined) notFound();

  return listingMetadata(
    `${tag.name} - xlog`,
    `${tag.name} tag page of xlog`,
    termPath('/tags', tag.name),
  );
}
