import { Tag } from 'lucide-react';
import Link from 'next/link';

export const ItemList = ({ name, numOfPosts }: { name: string; numOfPosts: number }) => {
  return (
    <Link
      href={`/tags/${name}`}
      className='bg-[#32302f] rounded-lg flex px-2 sm:px-3 sm:py-1 no-underline hover:underline text-lg sm:text-xl'
    >
      <Tag size={18} className='my-auto mr-1' />
      <span className='text-blue-400 hover:text-blue-300 mr-1'>{name}</span>({numOfPosts.toString()}
      件)
    </Link>
  );
};
