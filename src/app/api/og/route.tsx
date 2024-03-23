import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const shipporiMincho = fetch(
  new URL(
    './ShipporiMincho-Bold.ttf',
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
).then((res) => res.arrayBuffer());

export const GET = async (req: NextRequest) => {
  const title = req.nextUrl.searchParams.get('title');
  const description = req.nextUrl.searchParams.get('description');
  if (title === null && description === null) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          backgroundColor: '#282828',
        }}
      >
        <div
          style={{
            backgroundColor: '#282828',
            color: '#fbf1c7',
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            marginTop: '2rem',
            marginBottom: '2rem',
            marginLeft: '2rem',
            marginRight: '2rem',
            flexGrow: '1',
            borderRadius: '1rem',
            borderWidth: '1px',
            border: 'dashed',
          }}
        >
          <p
            style={{
              fontSize: 100,
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            xlog.systems
          </p>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'shipporiMincho', data: await shipporiMincho }],
      },
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#282828',
      }}
    >
      <div
        style={{
          backgroundColor: '#282828',
          color: '#fbf1c7',
          fontWeight: 600,
          display: 'flex',
          flexDirection: 'column',
          marginTop: '2rem',
          marginBottom: '2rem',
          marginLeft: '2rem',
          marginRight: '2rem',
          flexGrow: '1',
          borderRadius: '1rem',
          borderWidth: '1px',
          border: 'dashed',
        }}
      >
        <div
          style={{
            fontSize: 70,
            marginTop: 'auto',
            marginLeft: '4rem',
            marginRight: '4rem',
          }}
        >
          ブログのSSL証明書をより強固に自動更新したい
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 'auto',
            marginBottom: '0rem',
            marginLeft: '4rem',
            marginRight: '4rem',
          }}
        >
          SSL証明書をcertbotでcronするだけの脳死構成ではなく、ちゃんとCloudflareAPIを利用した堅牢な証明書自動更新環境を作成したい。
        </div>
        <p
          style={{
            fontSize: 40,
            alignSelf: 'flex-end',
            marginTop: '0rem',
            marginBottom: '1rem',
            marginLeft: '2rem',
            marginRight: '2rem',
          }}
        >
          xlog
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'shipporiMincho', data: await shipporiMincho }],
    },
  );
};
