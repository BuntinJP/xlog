import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { tagsByPostCount, termPath } from '@/lib/blog';
import { listingMetadata } from '@/lib/seo';

const TagsPage = () => {
  return (
    <main>
      <h1 className="sr-only">Tags</h1>
      <div className="flex flex-wrap gap-2">
        {tagsByPostCount().map((tag) => (
          <Link
            href={termPath('/tags', tag.name)}
            key={tag.name}
            className="flex items-center rounded-lg bg-[#32302f] px-2 py-1 text-lg no-underline hover:underline sm:px-3 sm:text-xl"
          >
            <Tag size={18} className="mr-1" />
            <span className="mr-1 text-blue-400 hover:text-blue-300">{tag.name}</span>({tag.posts.length}
            件)
          </Link>
        ))}
      </div>
    </main>
  );
};

export default TagsPage;

export const metadata: Metadata = listingMetadata('Tags - xlog', 'Tags of xlog', '/tags');
