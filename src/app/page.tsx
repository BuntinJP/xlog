import { Heading } from 'fumadocs-ui/components/heading';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { DocsBody } from 'fumadocs-ui/page';
import { Shippori_Mincho } from 'next/font/google';
import { notFound } from 'next/navigation';
import { CategoriesList } from './_components/CategoriesList';
import { TagsList } from './_components/TagsList';
import { getPage } from './source';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export default function HomePage() {
  const about = getPage([]);

  if (about === undefined) {
    notFound();
  }

  const MDX = about.data.exports.default;

  return (
    <main className='sm:grid sm:grid-cols-4'>
      <div className='sm:col-span-3 pb-8 sm:pb-0 sm:pr-6'>
        <DocsBody
          className={`${shipporiMincho.className} text-[#fbf1c7] decoration-[#fbf1c7]`}
        >
          <MDX />
        </DocsBody>
      </div>
      <div>
        <CategoriesList />
        <TagsList />
      </div>
    </main>
  );
}
