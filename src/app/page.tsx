import { DocsBody } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { Shippori_Mincho } from 'next/font/google';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { CategoriesList } from './_components/CategoriesList';
import { TagsList } from './_components/TagsList';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export default function HomePage() {
  const about = source.getPage([]);

  if (about === undefined) {
    notFound();
  }

  const MDX = about.data.body;

  return (
    <main className='sm:grid sm:grid-cols-4'>
      <div className='sm:col-span-3 pb-8 sm:pb-0 sm:pr-6'>
        <DocsBody
          className={`${shipporiMincho.className} text-[#fbf1c7] decoration-[#fbf1c7]`}
        >
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </div>
      <div>
        <CategoriesList />
        <TagsList />
      </div>
    </main>
  );
}

export const generateMetadata = () => {
  return {
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
