import type { ImageProps } from 'fumadocs-core/framework';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type BlogImageProps = Omit<ComponentProps<'img'>, 'sizes' | 'src'> &
  Readonly<{
    priority?: boolean | undefined;
    sizes?: string | undefined;
    src?: ComponentProps<'img'>['src'] | ImageProps['src'] | undefined;
  }>;

const BlogImage = ({ className, priority, sizes, src, style, ...props }: BlogImageProps) => {
  const imageClassName = cn('mx-auto max-h-[420px] w-[min(80vw,700px)] object-contain', className);
  const imageStyle = { ...style, maxHeight: '420px' };

  // React's intrinsic img type admits Blob, while the Next/Fumadocs image boundary intentionally does not.
  if (src instanceof Blob) return null;

  return (
    <ImageZoom
      {...props}
      {...(src === undefined ? {} : { src })}
      {...(sizes === undefined ? {} : { sizes })}
      {...(priority === undefined ? {} : { priority })}
      className={imageClassName}
      style={imageStyle}
    />
  );
};

export const getMDXComponents = (components?: MDXComponents) => {
  return {
    ...defaultMdxComponents,
    img: BlogImage,
    ...components,
  } satisfies MDXComponents;
};

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
