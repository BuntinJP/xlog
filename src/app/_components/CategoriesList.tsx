import { Folders } from 'lucide-react';
import { myCategoriesList, withoutMyCategoriesList } from '@/lib/source';
import { List } from './List';

const Title = () => {
  return (
    <div className='flex'>
      <Folders className='my-auto mr-1' />
      Categories
    </div>
  );
};

export const CategoriesList = () => {
  return (
    <List
      Title={Title}
      url='/categories'
      items={myCategoriesList}
      anotherItems={withoutMyCategoriesList}
    />
  );
};
