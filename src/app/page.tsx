import { mdxComponents } from '@/libs/mdx-config';
import { getPage } from '@/libs/source';
import { DocsBody } from 'fumadocs-ui/page';
import { Shippori_Mincho } from 'next/font/google';
import { notFound } from 'next/navigation';
import { CategoriesList } from './_components/CategoriesList';
import { TagsList } from './_components/TagsList';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export default function HomePage() {
  const about = getPage([]);

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
          <MDX components={mdxComponents} />
        </DocsBody>
      </div>
      <div>
        <CategoriesList />
        <TagsList />
      </div>
    </main>
  );
}
