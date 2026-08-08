import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoriesList, TagsList } from '@/components/blog/taxonomy-list';
import { getMDXComponents } from '@/components/mdx';
import { getHomePage } from '@/lib/blog';
import { rssPath } from '@/lib/shared';

export default function HomePage() {
  const about = getHomePage();
  if (about === undefined) notFound();

  const MDX = about.data.body;

  return (
    <main className="sm:grid sm:grid-cols-4">
      <div className="min-w-0 pb-8 sm:col-span-3 sm:pb-0 sm:pr-6">
        <DocsBody className="blog-prose">
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </div>
      <aside aria-label="Blog taxonomy">
        <CategoriesList />
        <TagsList />
      </aside>
    </main>
  );
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': rssPath,
    },
  },
};
