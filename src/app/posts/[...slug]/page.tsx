import { getPage, getPages } from '@/app/source';
import { Heading } from 'fumadocs-ui/components/heading';
import { DocsBody } from 'fumadocs-ui/page';
import { Folder, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { Shippori_Mincho } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ItemList } from '../_components/ItemList';
import { Toc } from '../_components/Toc';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

const Page = async ({
  params,
}: {
  params: { slug: string[] };
}) => {
  const post = getPage(params.slug);

  if (post === undefined) {
    notFound();
  }

  const date = new Date(post.data.date).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });

  const lastModified = post.data.exports.lastModified;
  let lastUpdateDate: string | undefined = undefined;
  if (lastModified !== undefined) {
    lastUpdateDate = new Date(lastModified).toLocaleDateString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }

  const MDX = post.data.exports.default;

  const categories = (post.data.categories ?? []).map((category) => ({
    name: category,
    basePath: '/categories',
    Icon: Folder,
  }));
  const tags = (post.data.tags ?? []).map((tag) => ({
    name: tag,
    basePath: '/tags',
    Icon: Tag,
  }));
  const items = [...categories, ...tags];

  const toc = post.data.exports.toc;

  return (
    <div>
      <DocsBody
        className={`${shipporiMincho.className} text-[#fbf1c7] decoration-[#fbf1c7]`}
      >
        <h1 className='text-center mb-auto text-[#fbf1c7] font-thin text-3xl sm:text-4xl'>
          {post.data.title}
        </h1>
        <p className='flex text-center justify-center items-center text-[#fbf1c7] text-lg'>
          <span className='mr-2'>投稿日:</span>
          {date}
          {lastUpdateDate !== undefined && lastUpdateDate !== date && (
            <span className='ml-4'>
              <span className='mr-2'>最終更新日:</span>
              {lastUpdateDate}
            </span>
          )}
        </p>
        <div className='flex gap-1 flex-wrap'>
          {items.map((item) => (
            <ItemList key={item.basePath + item.name} {...item} />
          ))}
        </div>
        <p className='text-center my-4 text-[#fbf1c7]'>
          {post.data.description}
        </p>
        <Toc toc={toc} className='mb-10' />
        <MDX
          components={{
            a: (props) => (
              <a
                {...props}
                className='underline text-[#fbf1c7] decoration-[#fbf1c7] [overflow-wrap:anywhere]'
              />
            ),
            strong: (props) => (
              <strong {...props} className='font-semibold text-[#fbf1c7]' />
            ),
            code: (props) => <code {...props} className='text-[#fbf1c7]' />,
            em: (props) => <em {...props} className='italic text-[#fbf1c7]' />,
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
  );
};

export default Page;

export const generateStaticParams = () => {
  return getPages().map((page) => {
    if (page.slugs.length === 0) {
      new Error('index page is not supported');
    }
    return {
      slug: page.slugs,
    };
  });
};

export const generateMetadata = ({
  params,
}: { params: { slug: string[] } }) => {
  const post = getPage(params.slug);
  if (post === undefined) return;

  const title = post.data.title;
  const description = post.data.description;
  const imageParams = new URLSearchParams();
  imageParams.set('title', title);
  imageParams.set('description', description ?? '');
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    ),
    title: title,
    description: description,
    keywords: post.data.keywords,
    openGraph: {
      title: title,
      description: description,
      images: `/api/og?${imageParams.toString()}`,
      url: post.url,
    },
    twitter: {
      title: title,
      description: description,
      images: `/api/og?${imageParams.toString()}`,
    },
  } satisfies Metadata;
};
