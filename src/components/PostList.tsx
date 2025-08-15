import Link from 'next/link';
import type { Posts } from '@/lib/source';

export const PostsList = ({ posts }: { posts: Posts }) => {
  let year = 0;
  let month = 0;
  return (
    <div className='flex flex-col gap-1'>
      {posts.map((post) => {
        let change = false;
        if (
          month !== post.data.date.getMonth() + 1 ||
          year !== post.data.date.getFullYear()
        ) {
          year = post.data.date.getFullYear();
          month = post.data.date.getMonth() + 1;
          change = true;
        }
        return (
          <div className='flex flex-col gap-1' key={post.url}>
            {change && (
              <div className='text-xl mt-4 mb-2'>
                {year}年{month}月
              </div>
            )}
            <div className='text-lg'>
              ・
              <Link
                href={post.url}
                className='text-blue-400 hover:text-blue-300 hover:underline'
              >
                <span className='text-blue-400 hover:text-blue-300'>
                  {post.data.title}
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DraftPostList = ({ posts }: { posts: Posts }) => {
  return (
    <div className='flex flex-col gap-1'>
      <div className='text-xl mt-4 mb-2'>Draft</div>
      {posts.map((post) => {
        return (
          <div className='flex flex-col gap-1' key={post.url}>
            <div className='text-lg'>
              ・
              <Link
                href={post.url}
                className='text-blue-400 hover:text-blue-300 hover:underline'
              >
                <span className='text-blue-400 hover:text-blue-300'>
                  {post.data.title}
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
