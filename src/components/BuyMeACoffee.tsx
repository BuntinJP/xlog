import Image from 'next/image';
import Link from 'next/link';

export const BuyMeACoffee = () => {
  return (
    <Link
      href='https://www.buymeacoffee.com/buntin'
      target='_blank'
      className='fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-2 px-4 rounded-full'
    >
      <Image
        src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg'
        alt='Buy Me A Coffee'
        width={30}
        height={30}
      />
    </Link>
  );
};
