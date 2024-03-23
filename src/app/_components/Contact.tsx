import Link from 'next/link';

export const Contact = () => {
  return (
    <div>
      <h2 className='text-2xl mt-4'>Contact</h2>
      <p>
        <Link
          href='https://twitter.com/LArchel_Liz'
          className='hover:underline text-lg m-0 p-1'
          target='_blank'
        >
          ・<span className='text-blue-400 hover:text-blue-300'>Twitter</span>
        </Link>
      </p>
      <p>
        <Link
          href='https://github.com/BuntinJP'
          className='hover:underline text-lg m-0 p-1'
          target='_blank'
        >
          ・<span className='text-blue-400 hover:text-blue-300'>GitHub</span>
        </Link>
      </p>
      <p>
        <Link
          href='mailto:mail@buntin.xyz'
          className='hover:underline text-lg m-0 p-1'
          target='_blank'
        >
          ・<span className='text-blue-400 hover:text-blue-300'>Email</span>
        </Link>
      </p>
    </div>
  );
};
