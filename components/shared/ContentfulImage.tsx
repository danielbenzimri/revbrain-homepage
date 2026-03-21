import Image from 'next/image';

interface ContentfulAsset {
  fields: {
    file: {
      url: string;
      details: {
        image: {
          width: number;
          height: number;
        };
      };
    };
    title?: string;
    description?: string;
  };
}

interface ContentfulImageProps {
  asset: ContentfulAsset;
  width?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Optimized image component for Contentful assets.
 * Uses Contentful Image API transforms for WebP + responsive sizes.
 * Falls back gracefully for alt text.
 */
export function ContentfulImage({
  asset,
  width = 800,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className,
}: ContentfulImageProps): React.ReactElement {
  const baseUrl = asset.fields.file.url;
  const src = baseUrl.startsWith('//') ? `https:${baseUrl}` : baseUrl;
  const alt = asset.fields.description || asset.fields.title || '';
  const imgWidth = asset.fields.file.details.image.width;
  const imgHeight = asset.fields.file.details.image.height;

  return (
    <Image
      src={`${src}?w=${width}&fm=webp&q=80`}
      width={imgWidth}
      height={imgHeight}
      sizes={sizes}
      priority={priority}
      alt={alt}
      className={className}
    />
  );
}
