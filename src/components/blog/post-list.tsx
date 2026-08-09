import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

const monthKey = (post: BlogPost): string => {
  return post.data.publishedAt.slice(0, 7);
};

const monthLabel = (key: string): string => {
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (match?.[1] === undefined || match[2] === undefined) return key;
  return `${match[1]}年${Number(match[2])}月`;
};

export const PostList = ({ posts }: { posts: readonly BlogPost[] }) => {
  let previousMonth = '';

  return (
    <div className="flex flex-col gap-1">
      {posts.map((post) => {
        const currentMonth = monthKey(post);
        const showMonth = currentMonth !== previousMonth;
        previousMonth = currentMonth;

        return (
          <div className="flex flex-col gap-1" key={post.url}>
            {showMonth ? <h2 className="mt-4 mb-2 text-xl">{monthLabel(currentMonth)}</h2> : null}
            <div className="text-lg">
              ・
              <Link href={post.url} className="text-blue-400 hover:text-blue-300 hover:underline">
                {post.data.title}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DraftPostList = ({ posts }: { posts: readonly BlogPost[] }) => {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="draft-posts-title">
      <h2 id="draft-posts-title" className="mt-4 mb-2 text-xl">
        Draft
      </h2>
      <div className="flex flex-col gap-1">
        {posts.map((post) => (
          <div className="text-lg" key={post.url}>
            ・
            <Link href={post.url} className="text-blue-400 hover:text-blue-300 hover:underline">
              {post.data.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
