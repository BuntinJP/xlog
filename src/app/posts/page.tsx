import { getPages } from '@/app/source';
import { PostsList } from '@/components/PostsList';
import type { Metadata } from 'next';

const Page = () => {
  const posts = getPages()
    .filter((node) => node.data.title !== 'Index')
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return <PostsList posts={posts} />;
};

export default Page;

export const generateMetadata = () => {
  return {
    title: 'Posts - xlog',
    description: 'Posts of xlog',
  } satisfies Metadata;
};
