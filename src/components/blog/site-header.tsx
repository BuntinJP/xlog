'use client';

import { Folders, Newspaper, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { href: '/posts', label: 'Posts', icon: Newspaper },
  { href: '/categories', label: 'Categories', icon: Folders },
  { href: '/tags', label: 'Tags', icon: Tags },
] as const;

const isActive = (pathname: string, href: string): boolean => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="mb-4 text-center">
      <div className="my-4">
        <Link href="/" className="text-[#fbf1c7] no-underline">
          <h1 className="text-4xl">xlog</h1>
        </Link>
      </div>
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex w-4/5 justify-between text-xl sm:w-1/2 xl:w-1/3 xl:min-w-80"
      >
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              href={href}
              key={href}
              aria-current={active ? 'page' : undefined}
              className="flex text-[#fbf1c7] no-underline hover:underline"
            >
              <Icon className="my-auto mr-1" aria-hidden="true" />
              <span className={active ? 'underline' : undefined}>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div aria-hidden="true" className="mx-3 mt-4 mb-2 border border-[#a89984]" />
    </header>
  );
};
