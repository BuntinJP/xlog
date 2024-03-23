import { CategoriesList } from './_components/CategoriesList';
import { Contact } from './_components/Contact';
import { TagsList } from './_components/TagsList';

export default function HomePage() {
  return (
    <main className='sm:grid sm:grid-cols-4'>
      <div className='sm:col-span-3'>
        <h1 className='mb-4 text-2xl'>Buntin-XLog Service</h1>
        <p>現在、記事整理中です。よろしく〜</p>
        <Contact />
      </div>
      <div>
        <CategoriesList />
        <TagsList />
      </div>
    </main>
  );
}
