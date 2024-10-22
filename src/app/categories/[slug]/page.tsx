import { PostsList } from '@/components/PostsList';
import { categoriesList, categoriesWithPosts } from '@/libs/source';
import { Folder } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const category = decodeURIComponent(params.slug);
  const posts =
    categoriesWithPosts.find((t) => t.name === category)?.posts ?? [];

  if (posts.length === 0) {
    notFound();
  }

  const sortedPosts = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
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

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const category = decodeURIComponent(params.slug);
  return {
    title: `${category} - xlog`,
    description: `${category} category page of xlog`,
  } satisfies Metadata;
};
