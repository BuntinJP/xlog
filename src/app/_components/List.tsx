import Link from 'next/link';

export const List = ({
  Title,
  url,
  items,
  anotherItems = undefined,
}: {
  Title: React.FC;
  url: string;
  items: string[];
  anotherItems?: string[] | undefined;
}) => {
  return (
    <div>
      <div className='flex text-xl my-1'>
        <Link href={url} className='hover:text-[#d5c4a1] flex'>
          <Title />
        </Link>
      </div>
      <div className='border-2 border-[#fbf1c7] rounded px-3 py-3 my-2 text-lg flex flex-col gap-1'>
        {items.map((item) => (
          <Link
            href={`${url}/${item}`}
            key={item}
            className='mx-0 px-3 rounded hover:text-[#d5c4a1] hover:bg-accent'
          >
            {item}
          </Link>
        ))}
        {anotherItems !== undefined && (
          <div className='mt-4 flex flex-col gap-1'>
            {anotherItems.map((item) => (
              <Link
                href={`${url}/${item}`}
                key={item}
                className='mx-0 px-3 rounded hover:text-[#d5c4a1] hover:bg-accent'
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
