import type { Metadata } from 'next';
import Link from 'next/link';
import { tagsWithPosts } from '../source';

const Page = () => {
  return (
    <div className='flex flex-col gap-1'>
      {tagsWithPosts.map((tag) => (
        <div key={tag.name}>
          <Link href={`/tags/${tag.name}`} className='hover:underline text-lg'>
            ・
            <span className='text-blue-400 hover:text-blue-300'>
              {tag.name}
            </span>
            <span className='ml-2'>({tag.posts.length}件)</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Page;

export const generateMetadata = () => {
  return {
    title: 'Tags - xlog',
    description: 'Tags of xlog',
  } satisfies Metadata;
};
