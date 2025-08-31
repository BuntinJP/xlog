import { Feed } from 'feed';
import { getProdPages } from '@/lib/source';

export const dynamic = 'force-static';

const escapeForXML = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const GET = () => {
  const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');

  const feed = new Feed({
    title: 'xlog',
    description: 'Buntin-BadCompany-Blog',
    id: baseUrl.href,
    copyright: 'xlog',
    link: baseUrl.href,
    feed: new URL('/api/rss.xml', baseUrl).href,
    language: 'ja',
    updated: new Date(),
    favicon: new URL('/favicon.ico', baseUrl).href,
  });

  const posts = getProdPages();

  for (const post of posts) {
    const imageParams = new URLSearchParams();
    imageParams.set('title', post.data.title);
    imageParams.set('description', post.data.description ?? '');

    feed.addItem({
      title: post.data.title,
      description: post.data.description,
      category: post.data.categories?.map((category) => {
        return {
          name: category,
        };
      }),
      link: new URL(post.url, baseUrl).href,
      image: {
        title: post.data.title,
        type: 'image/png',
        url: escapeForXML(new URL(`/api/og?${imageParams}`, baseUrl).href),
      },
      date: post.data.date,
      author: [
        {
          name: 'Buntin',
        },
      ],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
