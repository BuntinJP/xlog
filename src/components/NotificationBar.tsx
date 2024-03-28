import { Suspense } from 'react';

const getMessage = async () => {
  const url = new URL('/message', process.env.MESSAGE_API_URL);

  try {
    const response = await fetch(url.toString(), { cache: 'no-cache' });
    const json: { message?: string } = await response.json();
    return json.message;
  } catch (error) {
    console.error(error);
    return;
  }
};

const Bar = async () => {
  const message = await getMessage();

  if (message === undefined) {
    return null;
  }

  return (
    <div className='bg-gradient-to-r from-yellow-200 via-yellow-50 to-yellow-100 w-full flex justify-center items-center'>
      <p className='text-gray-800 text-lg'>{message}</p>
    </div>
  );
};

export const NotificationBar = () => {
  return (
    <Suspense>
      <Bar />
    </Suspense>
  );
};
