import type { Metadata } from 'next';
import Link from 'next/link';
import { categoriesWithPosts } from '../source';

const Page = () => {
  return (
    <div className='flex flex-col gap-1'>
      {categoriesWithPosts.map((category) => (
        <div key={category.name}>
          <Link
            href={`/categories/${category.name}`}
            className='hover:underline text-lg'
          >
            ・
            <span className='text-blue-400 hover:text-blue-300'>
              {category.name}
            </span>
            <span className='ml-2'>({category.posts.length}件)</span>
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
