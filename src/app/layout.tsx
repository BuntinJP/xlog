import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
// oxlint-disable-next-line import/no-unassigned-import -- Next.js requires the root stylesheet as a side-effect import.
import './global.css';
import { Shippori_Mincho } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, rssPath, siteDescription, siteUrl } from '@/lib/shared';
import { BuyMeACoffee } from '@/components/blog/buy-me-a-coffee';
import { SiteFooter } from '@/components/blog/site-footer';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: appName,
  description: siteDescription,
  alternates: {
    types: {
      'application/rss+xml': rssPath,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: appName,
    title: appName,
    description: siteDescription,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: siteDescription,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className={shipporiMincho.className} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-fd-background text-fd-foreground">
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: 'dark',
            enableSystem: false,
            attribute: 'class',
          }}
          search={{ enabled: false }}
        >
          {children}
          <SiteFooter />
          <BuyMeACoffee />
        </RootProvider>
        {process.env.NODE_ENV === 'production' ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
