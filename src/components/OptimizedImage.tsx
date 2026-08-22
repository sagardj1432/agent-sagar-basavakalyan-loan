import React, { useState } from 'react';
import { getWebpUrl, isUnsplashUrl, generateWebpSrcSet } from '../utils/imageOptimizer';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  webpSrc?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * High-Performance Image Optimization Component
 * - Serves next-gen WebP format automatically via <picture> element
 * - Strictly enforces width, height, and alt attributes to prevent CLS
 * - Optimizes LCP with fetchpriority="high" and loading="eager" for hero/priority images
 * - Uses native lazy loading & asynchronous decoding for below-the-fold images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  webpSrc,
  priority = false,
  className = '',
  sizes,
  fallbackSrc,
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive WebP source URL
  const resolvedWebpSrc = webpSrc || getWebpUrl(src);
  const webpSrcSet = isUnsplashUrl(src) ? generateWebpSrcSet(src) : undefined;
  const originalSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <picture className={`inline-block relative overflow-hidden ${containerClassName}`}>
      {/* WebP Next-Gen Source */}
      {!hasError && resolvedWebpSrc && (
        <source
          type="image/webp"
          srcSet={webpSrcSet || resolvedWebpSrc}
          sizes={sizes}
        />
      )}

      {/* Fallback image */}
      <img
        src={originalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore fetchpriority is supported in modern browsers
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-90'} ${className}`}
        {...rest}
      />
    </picture>
  );
};
