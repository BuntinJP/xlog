import { tagsList, tagsWithPosts } from '@/app/source';
import { PostsList } from '@/components/PostsList';
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

  return <PostsList posts={sortedPosts} />;
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
