import type { Posts } from '@/app/source';
import Link from 'next/link';

export const PostsList = ({ posts }: { posts: Posts }) => {
  let year = 0;
  let month = 0;
  return (
    <div className='flex flex-col gap-1'>
      {posts.map((post) => {
        let change = false;
        if (
          month !== post.data.date.getMonth() + 1 &&
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
            <div>
              <Link href={post.url} className='hover:underline text-lg'>
                ・
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
