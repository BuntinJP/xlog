'use client';

import type { TOCItemType, TableOfContents } from 'fumadocs-core/server';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const Item = ({ item }: { item: TOCItemType }) => {
  let plClass: string;
  switch (item.depth) {
    case 1:
      plClass = 'pl-2';
      break;
    case 2:
      plClass = 'pl-6';
      break;
    case 3:
      plClass = 'pl-10';
      break;
    case 4:
      plClass = 'pl-14';
      break;
    case 5:
      plClass = 'pl-18';
      break;
    case 6:
      plClass = 'pl-22';
      break;
    default:
      plClass = 'pl-2';
  }
  return (
    <Link
      href={item.url}
      className={`rounded hover:bg-accent my-1 no-underline hover:underline text-[#fbf1c7] decoration-[#fbf1c7] w-full block ${plClass}`}
    >
      {item.title}
    </Link>
  );
};

export const Toc = ({
  toc,
  className,
}: { toc: TableOfContents; className?: string }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={className}>
      <button type='button' className='text-lg flex' onClick={handleOpen}>
        <span className='mr-1 my-auto'>
          {open ? (
            <Play className='transform rotate-90 transition-transform duration-300 ease-in-out' />
          ) : (
            <Play className='transition-transform duration-300 ease-in-out' />
          )}
        </span>
        目次
      </button>
      {open && (
        <div className='bg-[#32302f] border border-[#a89984] border-dashed rounded sm:inline-block sm:whitespace-nowrap sm:min-w-96 mr-auto px-1 py-1 my-3'>
          {toc.map((item) => (
            <p className='mx-1 my-0' key={item.url}>
              <Item key={item.url} item={item} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
