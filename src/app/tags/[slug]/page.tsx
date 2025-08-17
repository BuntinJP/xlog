import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostsList } from '@/components/PostList';
import { tagsList, tagsWithPosts } from '@/lib/source';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const tag = decodeURIComponent(params.slug);
  const posts = tagsWithPosts.find((t) => t.name === tag)?.posts ?? [];

  if (posts.length === 0) {
    notFound();
  }
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return (
    <div>
      <h1 className='flex'>
        <Tag className='my-auto mr-1' size={26} />
        <span className='text-2xl'>{tag}</span>
      </h1>
      <PostsList posts={sortedPosts} />
    </div>
  );
};

export default Page;

export const generateStaticParams = () => {
  return tagsList.map((tag) => ({
    slug: tag,
  }));
};

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const tag = decodeURIComponent(params.slug);
  const title = `${tag} - xlog`;
  const description = `${tag} tag page of xlog`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/tags/${tag}`,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `/tags/${tag}`,
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
