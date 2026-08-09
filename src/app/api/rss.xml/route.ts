import {
  getPublishedPosts,
  latestPostModifiedAt,
  postLastModifiedAt,
  toRfc822Date,
} from '@/lib/blog';
import { rssCacheHeaders } from '@/lib/cache-policy';
import { appName, rssPath, siteDescription, siteUrl } from '@/lib/shared';

export const dynamic = 'force-static';

const xmlEscape = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
};

const absoluteUrl = (path: string): string => {
  return new URL(path, siteUrl).href;
};

export const GET = () => {
  const posts = getPublishedPosts();
  const items = posts
    .map((post) => {
      const postUrl = absoluteUrl(post.url);
      const categories = post.data.categories
        .map((category) => `<category>${xmlEscape(category)}</category>`)
        .join('');

      return `<item>
  <title>${xmlEscape(post.data.title)}</title>
  <link>${xmlEscape(postUrl)}</link>
  <guid isPermaLink="true">${xmlEscape(postUrl)}</guid>
  <description>${xmlEscape(post.data.description)}</description>
  <dc:creator>Buntin</dc:creator>
  <pubDate>${toRfc822Date(post.data.publishedAt)}</pubDate>
  <dc:date>${postLastModifiedAt(post)}</dc:date>
  ${categories}
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${xmlEscape(appName)}</title>
  <link>${xmlEscape(siteUrl)}</link>
  <description>${xmlEscape(siteDescription)}</description>
  <language>ja</language>
  <lastBuildDate>${toRfc822Date(latestPostModifiedAt(posts))}</lastBuildDate>
  <atom:link href="${xmlEscape(absoluteUrl(rssPath))}" rel="self" type="application/rss+xml" />
  <image>
    <url>${xmlEscape(absoluteUrl('/favicon.ico'))}</url>
    <title>${xmlEscape(appName)}</title>
    <link>${xmlEscape(siteUrl)}</link>
  </image>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      ...rssCacheHeaders,
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
