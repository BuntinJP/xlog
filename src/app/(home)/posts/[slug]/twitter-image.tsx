import { notFound } from 'next/navigation';
import { getPublishedPost } from '@/lib/blog';
import { renderSocialImage } from '@/lib/social-image';
import { socialImageContentType, socialImageSize } from '@/lib/social-image-config';

export const runtime = 'nodejs';
type ImageProps = PageProps<'/posts/[slug]'> & Readonly<{ id: Promise<string> }>;

export function generateImageMetadata({
  params,
}: Readonly<{ params: { slug: string } }>) {
  const post = getPublishedPost([params.slug]);
  if (post === undefined) return [];

  return [
    {
      id: post.data.updatedAt,
      alt: post.data.title,
      size: socialImageSize,
      contentType: socialImageContentType,
    },
  ];
}

export default async function TwitterImage({ params, id }: ImageProps) {
  const { slug } = await params;
  const post = getPublishedPost([slug]);
  if (post === undefined || (await id) !== post.data.updatedAt) notFound();

  return renderSocialImage({
    title: post.data.title,
    description: post.data.description,
  });
}
