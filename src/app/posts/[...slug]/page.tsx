import { DocsBody } from 'fumadocs-ui/page';
import { Folder, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { Shippori_Mincho } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getProdPages, source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { ItemList } from '../_components/ItemList';
import { Toc } from '../_components/Toc';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const post = source.getPage(slug);

  if (post === undefined) {
    notFound();
  }

  const date = new Date(post.data.date).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });

  const lastModified = post.data.lastModified;
  let lastUpdateDate: string | undefined;
  if (lastModified !== undefined) {
    lastUpdateDate = new Date(lastModified).toLocaleDateString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }

  const MDX = post.data.body;

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

  const toc = post.data.toc;

  return (
    <div>
      <DocsBody className={`${shipporiMincho.className} text-[#fbf1c7] decoration-[#fbf1c7]`}>
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
        <p className='text-center my-4 text-[#fbf1c7]'>{post.data.description}</p>
        <Toc toc={toc} className='mb-10' />
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </div>
  );
}

export const generateStaticParams = () => {
  return getProdPages()
    .map((page) => {
      if (page.slugs.length === 0) {
        return undefined;
      }
      return {
        slug: page.slugs,
      };
    })
    .filter((params): params is { slug: string[] } => params !== undefined);
};

export const generateMetadata = async (props: { params: Promise<{ slug: string[] }> }) => {
  const params = await props.params;
  const post = source.getPage(params.slug);
  if (post === undefined) notFound();

  const title = post.data.title;
  const description = post.data.description;
  const imageParams = new URLSearchParams();
  imageParams.set('title', title);
  imageParams.set('description', description ?? '');
  return {
    title,
    description,
    keywords: post.data.keywords,
    openGraph: {
      title,
      description,
      images: `/api/og?${imageParams}`,
      url: post.url,
    },
    twitter: {
      title,
      description,
      images: `/api/og?${imageParams}`,
    },
    alternates: {
      canonical: post.url,
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
    },
  } satisfies Metadata;
};
