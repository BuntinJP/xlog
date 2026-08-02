import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { isMigrationWikiEnabled } from '@/lib/migration-wiki';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  if (!isMigrationWikiEnabled()) notFound();

  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
