import { DraftPostList, PostsList } from '@/components/PostsList';
import { getDraftPages, getProdPages } from '@/libs/source';
import type { Metadata } from 'next';

const Page = () => {
  const posts = getProdPages()
    // remove index page
    .filter((post) => post.slugs.length !== 0)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className='flex flex-col gap-1'>
        <DraftPostList posts={getDraftPages()} />
        <PostsList posts={posts} />
      </div>
    );
  }
  return <PostsList posts={posts} />;
};

export default Page;

export const generateMetadata = () => {
  const title = 'Posts - xlog';
  const description = 'Posts of xlog';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/posts',
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: '/posts',
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
