import { Heading } from 'fumadocs-ui/components/heading';
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
      <div className='sm:col-span-3 mb-8 sm:mb-0'>
        <DocsBody
          className={`${shipporiMincho.className} text-[#fbf1c7] decoration-[#fbf1c7]`}
        >
          <MDX
            components={{
              a: (props) => (
                <a
                  {...props}
                  className='no-underline text-blue-400 hover:text-blue-300 [overflow-wrap:anywhere]'
                />
              ),
              strong: (props) => (
                <strong {...props} className='font-semibold text-[#fbf1c7]' />
              ),
              code: (props) => <code {...props} className='text-[#fbf1c7]' />,
              em: (props) => (
                <em {...props} className='italic text-[#fbf1c7]' />
              ),
              h1: (props) => (
                <Heading
                  as='h1'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-2xl sm:text-3xl'
                />
              ),
              h2: (props) => (
                <Heading
                  as='h2'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-xl sm:text-2xl'
                />
              ),
              h3: (props) => (
                <Heading
                  as='h3'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
                />
              ),
              h4: (props) => (
                <Heading
                  as='h4'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
                />
              ),
              h5: (props) => (
                <Heading
                  as='h5'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
                />
              ),
              h6: (props) => (
                <Heading
                  as='h6'
                  {...props}
                  className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
                />
              ),
            }}
          />
        </DocsBody>
      </div>
      <div>
        <CategoriesList />
        <TagsList />
      </div>
    </main>
  );
}
