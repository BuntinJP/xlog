import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { socialImageSize } from './social-image-config';

type SocialImageCopy = Readonly<{
  description?: string;
  title: string;
}>;

let fontData: Promise<Buffer> | undefined;

function loadFont(): Promise<Buffer> {
  fontData ??= readFile(join(process.cwd(), 'public', 'ShipporiMincho-Bold.ttf'));
  return fontData;
}

export async function renderSocialImage(copy: SocialImageCopy): Promise<ImageResponse> {
  const isArticle = copy.description !== undefined;

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
            justifyContent: isArticle ? 'flex-start' : 'center',
            fontSize: isArticle ? 68 : 100,
            lineHeight: 1.2,
          }}
        >
          {copy.title}
        </div>
        {copy.description === undefined ? null : (
          <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.35 }}>{copy.description}</div>
        )}
        {isArticle ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 40 }}>xlog</div>
        ) : null}
      </div>
    </div>,
    {
      ...socialImageSize,
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
