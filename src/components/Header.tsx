'use client';

import { Folders, Newspaper, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className='mb-4 text-center'>
      <div className='my-4'>
        <Link href='/'>
          <h1 className='text-4xl'>xlog</h1>
        </Link>
      </div>
      <div className='flex justify-between w-4/5 sm:w-1/2 xl:w-1/3 mx-auto text-xl'>
        <Link href='/posts' className='flex'>
          <Newspaper className='my-auto mr-1' />
          {pathname === '/posts' ? (
            <span className='underline'>Blog</span>
          ) : (
            <span className='hover:underline'>Blog</span>
          )}
        </Link>
        <Link href='/categories' className='flex'>
          <Folders className='my-auto mr-1' />
          {pathname === '/categories' ? (
            <span className='underline'>Categories</span>
          ) : (
            <span className='hover:underline'>Categories</span>
          )}
        </Link>
        <Link href='/tags' className='flex'>
          <Tags className='my-auto mr-1' />
          {pathname === '/tags' ? (
            <span className='underline'>Tags</span>
          ) : (
            <span className='hover:underline'>Tags</span>
          )}
        </Link>
      </div>
      <div className='border border-[#a89984] mt-4 mb-2 mx-3' />
    </div>
  );
};
