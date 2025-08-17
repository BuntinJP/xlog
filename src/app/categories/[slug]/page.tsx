import { Folder } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostsList } from '@/components/PostList';
import { categoriesList, categoriesWithPosts } from '@/lib/source';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const category = decodeURIComponent(params.slug);
  const posts = categoriesWithPosts.find((t) => t.name === category)?.posts ?? [];

  if (posts.length === 0) {
    notFound();
  }

  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return (
    <div>
      <h1 className='flex'>
        <Folder className='my-auto mr-1' size={26} />
        <span className='text-2xl'>{category}</span>
      </h1>
      <PostsList posts={sortedPosts} />
    </div>
  );
};

export default Page;

export const generateStaticParams = () => {
  return categoriesList.map((category) => ({
    slug: category,
  }));
};

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const category = decodeURIComponent(params.slug);
  const title = `${category} - xlog`;
  const description = `${category} tag page of xlog`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/categories/${category}`,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `/categories/${category}`,
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
