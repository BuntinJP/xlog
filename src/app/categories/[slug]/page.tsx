import { categoriesList, categoriesWithPosts } from '@/app/source';
import { PostsList } from '@/components/PostsList';
import { Folder } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const Page = ({ params }: { params: { slug: string } }) => {
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
        <Folder className='my-auto mr-2' size={30} />
        <span className='text-3xl'>{category}</span>
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

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const category = decodeURIComponent(params.slug);
  return {
    title: `${category} - xlog`,
    description: `${category} category page of xlog`,
  } satisfies Metadata;
};
