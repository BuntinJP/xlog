import Image from 'next/image';
import Link from 'next/link';

export const BuyMeACoffee = () => {
  return (
    <Link
      href="https://www.buymeacoffee.com/buntin"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy Me a Coffee"
      className="fixed right-4 bottom-4 z-20 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-colors hover:bg-blue-700"
    >
      <Image
        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
        alt=""
        width={30}
        height={30}
      />
    </Link>
  );
};
