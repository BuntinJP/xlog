import type { ReactNode } from 'react';
import { getDraftPosts, getPublishedPosts, getSinglePostSlug } from '@/lib/blog';

const PostLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return children;
};

export default PostLayout;

export const generateStaticParams = (): { slug: string }[] => {
  const posts =
    process.env.NODE_ENV === 'production'
      ? getPublishedPosts()
      : [...getPublishedPosts(), ...getDraftPosts()];
  return posts.map((post) => ({ slug: getSinglePostSlug(post) }));
};
