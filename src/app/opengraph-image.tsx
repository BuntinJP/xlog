import { renderSocialImage } from '@/lib/social-image';
import { socialImageContentType, socialImageSize } from '@/lib/social-image-config';

export const runtime = 'nodejs';
export const alt = 'xlog.systems';
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpenGraphImage() {
  return renderSocialImage({ title: 'xlog.systems' });
}
