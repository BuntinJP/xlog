import { Folder } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/post-list';
import {
  categoriesWithPosts,
  decodeTermSegment,
  findCategory,
  termPath,
} from '@/lib/blog';
import { listingMetadata } from '@/lib/seo';

const CategoryPage = async ({ params }: PageProps<'/categories/[slug]'>) => {
  const { slug } = await params;
  const name = decodeTermSegment(slug);
  const category = name === undefined ? undefined : findCategory(name);
  if (category === undefined) notFound();

  return (
    <main>
      <h1 className="flex items-center text-2xl">
        <Folder className="mr-1" size={26} />
        {category.name}
      </h1>
      <PostList posts={category.posts} />
    </main>
  );
};

export default CategoryPage;

export const generateStaticParams = (): { slug: string }[] => {
  return categoriesWithPosts.map(({ name }) => ({ slug: name }));
};

export const generateMetadata = async ({
  params,
}: PageProps<'/categories/[slug]'>): Promise<Metadata> => {
  const { slug } = await params;
  const name = decodeTermSegment(slug);
  const category = name === undefined ? undefined : findCategory(name);
  if (category === undefined) notFound();

  return listingMetadata(
    `${category.name} - xlog`,
    `${category.name} category page of xlog`,
    termPath('/categories', category.name),
  );
};
