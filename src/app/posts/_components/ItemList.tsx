import type { LucideProps } from 'lucide-react';
import Link from 'next/link';

export const ItemList = ({
  name,
  basePath,
  Icon,
}: {
  name: string;
  basePath: string;
  Icon: React.FC<LucideProps>;
}) => {
  return (
    <Link
      href={`${basePath}/${name}`}
      className='bg-[#32302f] rounded-lg flex px-2 no-underline hover:underline text-md'
    >
      <span className='my-auto mr-1'>
        <Icon size={18} />
      </span>
      <span className='text-blue-400 hover:text-blue-300'>{name}</span>
    </Link>
  );
};
