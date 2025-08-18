import type { Metadata } from 'next';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center gap-6 mt-12'>
      <div className='text-4xl'>404</div>
      <div className='text-lg'>ページが見つかりません</div>
    </div>
  );
}

export const metadata: Metadata = {
  title: '404',
  description: 'ページが見つかりません',
};
