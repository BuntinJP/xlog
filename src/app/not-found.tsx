import type { Metadata } from 'next';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <h1 className="text-5xl">404</h1>
      <p className="text-lg">ページが見つかりません</p>
      <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline">
        ホームへ戻る
      </Link>
    </main>
  );
}

export const metadata: Metadata = {
  title: '404',
  description: 'ページが見つかりません',
  robots: {
    index: false,
    follow: false,
  },
};
