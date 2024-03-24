import { tagsList, tagsWithPosts } from '@/app/source';
import { PostsList } from '@/components/PostsList';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const Page = ({ params }: { params: { slug: string } }) => {
  const tag = decodeURIComponent(params.slug);
  const posts = tagsWithPosts.find((t) => t.name === tag)?.posts ?? [];

  if (posts.length === 0) {
    notFound();
  }
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

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

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const tag = decodeURIComponent(params.slug);
  return {
    title: `${tag} - xlog`,
    description: `${tag} tag page of xlog`,
  } satisfies Metadata;
};
