import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { termPath } from '@/lib/blog';

export const TermBadge = ({
  name,
  basePath,
  icon: Icon,
}: {
  name: string;
  basePath: '/categories' | '/tags';
  icon: LucideIcon;
}) => {
  return (
    <Link
      href={termPath(basePath, name)}
      className="flex rounded-lg bg-[#32302f] px-2 text-base no-underline hover:underline"
    >
      <Icon size={18} className="my-auto mr-1 text-[#fbf1c7]" />
      <span className="text-blue-400 hover:text-blue-300">{name}</span>
    </Link>
  );
};
