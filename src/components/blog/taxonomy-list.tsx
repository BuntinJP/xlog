import { Folders, Tags } from 'lucide-react';
import Link from 'next/link';
import { featuredCategories, otherCategories, tagsWithPosts, termPath } from '@/lib/blog';

const TermLinks = ({
  title,
  basePath,
  terms,
}: {
  title: string;
  basePath: '/categories' | '/tags';
  terms: readonly string[];
}) => {
  const Icon = basePath === '/categories' ? Folders : Tags;

  return (
    <section>
      <Link href={basePath} className="my-1 flex text-xl hover:text-[#d5c4a1]">
        <Icon className="my-auto mr-1" />
        {title}
      </Link>
      <div className="my-2 flex flex-col gap-1 rounded border-2 border-[#fbf1c7] px-3 py-3 text-lg">
        {terms.map((term) => (
          <Link
            href={termPath(basePath, term)}
            key={term}
            className="rounded px-3 hover:bg-fd-accent hover:text-[#d5c4a1]"
          >
            {term}
          </Link>
        ))}
      </div>
    </section>
  );
};

export const CategoriesList = () => {
  return (
    <TermLinks
      title="Categories"
      basePath="/categories"
      terms={[
        ...featuredCategories.map(({ name }) => name),
        ...otherCategories.map(({ name }) => name).toSorted(),
      ]}
    />
  );
};

export const TagsList = () => {
  return (
    <TermLinks
      title="Tags"
      basePath="/tags"
      terms={tagsWithPosts.map(({ name }) => name).toSorted()}
    />
  );
};
