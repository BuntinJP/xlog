import { Heading } from 'fumadocs-ui/components/heading';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    ...defaultComponents,
    // biome-ignore lint: apply any
    img: (props: any) => <ImageZoom {...props} />,
    a: (props) => (
      <a
        {...props}
        className='no-underline text-blue-400 hover:text-blue-300 [overflow-wrap:anywhere]'
      />
    ),
    strong: (props) => (
      <strong {...props} className='font-semibold text-[#fbf1c7]' />
    ),
    code: (props) => <code {...props} className='text-[#fbf1c7]' />,
    em: (props) => <em {...props} className='italic text-[#fbf1c7]' />,
    h1: (props) => (
      <Heading
        as='h1'
        {...props}
        className='text-[#fbf1c7] font-thin text-2xl sm:text-3xl'
      />
    ),
    h2: (props) => (
      <Heading
        as='h2'
        {...props}
        className='text-[#fbf1c7] font-thin text-xl sm:text-2xl'
      />
    ),
    h3: (props) => (
      <Heading
        as='h3'
        {...props}
        className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
      />
    ),
    h4: (props) => (
      <Heading
        as='h4'
        {...props}
        className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
      />
    ),
    h5: (props) => (
      <Heading
        as='h5'
        {...props}
        className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
      />
    ),
    h6: (props) => (
      <Heading
        as='h6'
        {...props}
        className='text-[#fbf1c7] font-thin text-lg sm:text-xl'
      />
    ),
    ...components,
  };
};
