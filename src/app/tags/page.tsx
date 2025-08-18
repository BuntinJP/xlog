import type { Metadata } from 'next';
import { tagsWithPosts } from '@/lib/source';
import { ItemList } from './_components/ItemList';

export default function Page() {
  return (
    <div className='flex gap-2 flex-wrap'>
      {tagsWithPosts
        .sort((a, b) => b.posts.length - a.posts.length)
        .map((tag) => (
          <ItemList name={tag.name} numOfPosts={tag.posts.length} key={tag.name} />
        ))}
    </div>
  );
}

export const generateMetadata = () => {
  const title = 'Tags - xlog';
  const description = 'Tags of xlog';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/tags',
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: '/tags',
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
