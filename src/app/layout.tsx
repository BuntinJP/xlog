import { BuyMeACoffee } from '@/components/BuyMeACoffee';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Shippori_Mincho } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';
import 'katex/dist/katex.css';

const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '400',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='ja' className={shipporiMincho.className}>
      {process.env.NODE_ENV === 'production' && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <body className='bg-[#282828] flex min-h-dvh flex-col'>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <div className='lg:grid lg:grid-cols-6'>
            <div className='hidden lg:block lg:col-span-1'>
              {/* ad here (pc only) */}
            </div>
            <div className='lg:col-span-4'>
              <Header />
              <div className='mx-6'>{children}</div>
              <div className='mt-12'>{/* ad here */}</div>
            </div>
            <div className='hidden lg:block lg:col-span-1'>
              {/* ad here (pc only) */}
            </div>
          </div>
          <Footer />
          <BuyMeACoffee />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: 'xlog',
  description: 'Buntin-BadCompany-Blog',
  openGraph: {
    title: 'xlog',
    description: 'Buntin-BadCompany-Blog',
    images: '/api/og',
    url: '/',
  },
  twitter: {
    title: 'xlog',
    description: 'Buntin-BadCompany-Blog',
    images: '/api/og',
  },
};
