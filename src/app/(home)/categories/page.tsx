import type { Metadata } from 'next';
import Link from 'next/link';
import { categoriesForIndex, featuredCategories, termPath } from '@/lib/blog';
import type { TaxonomyEntry } from '@/lib/blog';
import { listingMetadata } from '@/lib/seo';

const CategoryLink = ({ category }: { category: TaxonomyEntry }) => {
  return (
    <div className="text-xl">
      ・
      <Link
        href={termPath('/categories', category.name)}
        className="text-blue-400 hover:text-blue-300 hover:underline"
      >
        {category.name}
      </Link>
    </div>
  );
};

const CategoryCount = ({ category }: { category: TaxonomyEntry }) => {
  return <div className="text-lg">({category.posts.length}件)</div>;
};

const CategoriesPage = () => {
  const categories = categoriesForIndex();
  const featured = categories.slice(0, featuredCategories.length);
  const others = categories.slice(featuredCategories.length);

  return (
    <main>
      <h1 className="sr-only">Categories</h1>
      <div className="flex gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            {featured.map((category) => (
              <CategoryLink key={category.name} category={category} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {others.map((category) => (
              <CategoryLink key={category.name} category={category} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            {featured.map((category) => (
              <CategoryCount key={category.name} category={category} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {others.map((category) => (
              <CategoryCount key={category.name} category={category} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoriesPage;

export const metadata: Metadata = listingMetadata(
  'Categories - xlog',
  'Categories of xlog',
  '/categories',
);
