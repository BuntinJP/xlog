import type { Metadata } from 'next';
import { DraftPostList, PostList } from '@/components/blog/post-list';
import { getDraftPosts, getPublishedPosts } from '@/lib/blog';
import { listingMetadata } from '@/lib/seo';

export default function PostsPage() {
  const published = getPublishedPosts();

  return (
    <main className="flex flex-col gap-1">
      <h1 className="sr-only">Posts</h1>
      {process.env.NODE_ENV === 'production' ? null : <DraftPostList posts={getDraftPosts()} />}
      <PostList posts={published} />
    </main>
  );
}

export const metadata: Metadata = listingMetadata('Posts - xlog', 'Posts of xlog', '/posts');
