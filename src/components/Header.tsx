'use client';

import { Folders, Newspaper, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/posts', label: 'Blog', Icon: Newspaper },
    { href: '/categories', label: 'Categories', Icon: Folders },
    { href: '/tags', label: 'Tags', Icon: Tags },
  ];

  return (
    <div className='mb-4 text-center'>
      <div className='my-4'>
        <Link href='/'>
          <h1 className='text-4xl'>xlog</h1>
        </Link>
      </div>
      <div className='flex justify-between w-4/5 sm:w-1/2 xl:w-1/3 mx-auto text-xl'>
        {navItems.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className='flex'>
            <Icon className='my-auto mr-1' />
            {pathname === href ? (
              <span className='underline'>{label}</span>
            ) : (
              <span className='hover:underline'>{label}</span>
            )}
          </Link>
        ))}
      </div>
      <div className='border border-[#a89984] mt-4 mb-2 mx-3' />
    </div>
  );
};
