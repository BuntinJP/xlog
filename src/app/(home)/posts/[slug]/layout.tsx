import type { ReactNode } from 'react';
import { getDraftPosts, getPublishedPosts, getSinglePostSlug } from '@/lib/blog';

export default function PostLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}

export function generateStaticParams(): { slug: string }[] {
  const posts =
    process.env.NODE_ENV === 'production'
      ? getPublishedPosts()
      : [...getPublishedPosts(), ...getDraftPosts()];
  return posts.map((post) => ({ slug: getSinglePostSlug(post) }));
}
