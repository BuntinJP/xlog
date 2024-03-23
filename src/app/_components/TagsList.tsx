import { Tags } from 'lucide-react';
import { tagsList } from '../source';
import { List } from './List';

const Title = () => {
  return (
    <div className='flex'>
      <Tags className='my-auto mr-1' />
      Tags
    </div>
  );
};

export const TagsList = () => {
  return <List Title={Title} url='/tags' items={tagsList} />;
};
