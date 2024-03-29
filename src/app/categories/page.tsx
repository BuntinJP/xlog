import type { Metadata } from 'next';
import Link from 'next/link';
import {
  type categoriesWithPosts,
  myCategoriesWithPosts,
  withoutMyCategoriesWithPosts,
} from '../source';

type Category = (typeof categoriesWithPosts)[number];

const DisplayCategory = ({ category }: { category: Category }) => {
  return (
    <div className='text-xl'>
      ・
      <Link
        href={`/categories/${category.name}`}
        className='text-blue-400 hover:text-blue-300 hover:underline'
      >
        {category.name}
      </Link>
    </div>
  );
};

const DisplayNumOfPosts = ({ category }: { category: Category }) => {
  return <div className='text-lg'>({category.posts.length}件)</div>;
};

const Page = () => {
  const sortedWithoutMyCategoriesWithPosts = withoutMyCategoriesWithPosts.sort(
    (a, b) => b.posts.length - a.posts.length,
  );
  return (
    <div className='flex gap-5'>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          {myCategoriesWithPosts.map((category) => (
            <DisplayCategory key={category.name} category={category} />
          ))}
        </div>
        <div className='flex flex-col gap-1'>
          {sortedWithoutMyCategoriesWithPosts.map((category) => (
            <DisplayCategory key={category.name} category={category} />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          {myCategoriesWithPosts.map((category) => (
            <DisplayNumOfPosts key={category.name} category={category} />
          ))}
        </div>
        <div className='flex flex-col gap-1'>
          {sortedWithoutMyCategoriesWithPosts.map((category) => (
            <DisplayNumOfPosts key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

export const generateMetadata = () => {
  return {
    title: 'Categories - xlog',
    description: 'Categories of xlog',
  } satisfies Metadata;
};
