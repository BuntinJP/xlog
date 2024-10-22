import { PostsList } from '@/components/PostsList';
import { getPages } from '@/libs/source';
import type { Metadata } from 'next';

const Page = () => {
  const posts = getPages()
    // remove index page
    .filter((post) => post.slugs.length !== 0)
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
