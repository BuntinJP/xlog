import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { getPublishedPosts } from '@/lib/blog';
import { migrationNotFoundResponse, ogCacheHeaders } from '@/lib/cache-policy';

export const runtime = 'nodejs';

let fontData: Promise<Buffer> | undefined;

function loadFont(): Promise<Buffer> {
  fontData ??= readFile(join(process.cwd(), 'public', 'ShipporiMincho-Bold.ttf'));
  return fontData;
}

type OgCopy = Readonly<{
  description: string;
  isArticle: boolean;
  title: string;
}>;

function resolveOgCopy(request: NextRequest): OgCopy | undefined {
  const searchParams = request.nextUrl.searchParams;
  if (searchParams.size === 0) {
    return { description: '', isArticle: false, title: 'xlog.systems' };
  }

  const titles = searchParams.getAll('title');
  const descriptions = searchParams.getAll('description');
  if (searchParams.size !== 2 || titles.length !== 1 || descriptions.length !== 1) return undefined;

  const title = titles[0];
  const description = descriptions[0];
  if (title === undefined || description === undefined) return undefined;

  const post = getPublishedPosts().find(
    (candidate) => candidate.data.title === title && candidate.data.description === description,
  );
  if (post === undefined) return undefined;

  return {
    description: post.data.description,
    isArticle: true,
    title: post.data.title,
  };
}

export async function GET(request: NextRequest) {
  const copy = resolveOgCopy(request);
  if (copy === undefined) return migrationNotFoundResponse();

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#282828',
        padding: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          border: '1px dashed #fbf1c7',
          borderRadius: '1rem',
          color: '#fbf1c7',
          padding: '3rem 4rem 1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: copy.isArticle ? 'flex-start' : 'center',
            fontSize: copy.isArticle ? 68 : 100,
            lineHeight: 1.2,
          }}
        >
          {copy.title}
        </div>
        {copy.description.length > 0 ? (
          <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.35 }}>{copy.description}</div>
        ) : null}
        {copy.isArticle ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 40 }}>xlog</div>
        ) : null}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: ogCacheHeaders,
      fonts: [
        {
          name: 'Shippori Mincho',
          data: await loadFont(),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
