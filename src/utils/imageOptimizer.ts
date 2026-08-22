/**
 * Automatic Image Optimization & WebP URL Transformer Utility
 * Converts local assets and remote CDN/Unsplash URLs to WebP format,
 * generates responsive srcSet, and ensures Core Web Vitals compliance.
 */

// Helper to determine if a URL is an Unsplash image
export function isUnsplashUrl(url: string): boolean {
  return typeof url === 'string' && (url.includes('images.unsplash.com') || url.includes('unsplash.com'));
}

// Convert any image URL to an optimized WebP URL
export function getWebpUrl(src: string, width?: number, quality = 80): string {
  if (!src) return '';

  // If it's already a WebP image, return as is (with optional width query if supported)
  if (src.endsWith('.webp')) {
    return src;
  }

  // Handle Unsplash dynamic image service
  if (isUnsplashUrl(src)) {
    try {
      const url = new URL(src);
      url.searchParams.set('format', 'webp');
      url.searchParams.set('auto', 'format');
      url.searchParams.set('q', quality.toString());
      if (width) {
        url.searchParams.set('w', width.toString());
      }
      return url.toString();
    } catch {
      // Fallback query append
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}format=webp&auto=format&q=${quality}${width ? `&w=${width}` : ''}`;
    }
  }

  // Handle local bundled image imports with .jpg / .png extensions
  if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')) {
    const webpSrc = src.replace(/\.(jpe?g|png)(\?.*)?$/i, '.webp$2');
    return webpSrc;
  }

  return src;
}

// Generate responsive WebP srcSet for fluid responsive layouts
export function generateWebpSrcSet(src: string, widths: number[] = [320, 480, 640, 800, 1024, 1200]): string {
  if (!src) return '';
  
  if (isUnsplashUrl(src)) {
    return widths
      .map(w => `${getWebpUrl(src, w, 80)} ${w}w`)
      .join(', ');
  }

  // For local static imports, return primary webp
  return getWebpUrl(src);
}

// Service Icons mapping with WebP / SVG definitions & explicit sizes
export interface ServiceIconConfig {
  id: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  accentColor: string;
  badgeText: string;
  iconName: string;
}

export const SERVICE_ICONS_MAP: Record<string, ServiceIconConfig> = {
  'personal-loan': {
    id: 'personal-loan',
    title: 'Personal Loan',
    alt: 'Personal Loan service icon with instant cash and low rate indicator for Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#D9381E', // vermillion
    badgeText: 'Instant Cash',
    iconName: 'UserCheck'
  },
  'home-loan': {
    id: 'home-loan',
    title: 'Home Loan',
    alt: 'Home Loan service icon for house construction and PMAY subsidy in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#059669', // emerald
    badgeText: 'PMAY Subsidy',
    iconName: 'Home'
  },
  'business-loan': {
    id: 'business-loan',
    title: 'Business Loan',
    alt: 'Business Loan service icon for shopkeepers and MSME traders in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#2563EB', // blue
    badgeText: 'No Collateral',
    iconName: 'Building2'
  },
  'vehicle-loan': {
    id: 'vehicle-loan',
    title: 'Vehicle Loan',
    alt: 'Vehicle Loan service icon for tractor, car, and commercial vehicle finance in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#D97706', // amber
    badgeText: '90% Funding',
    iconName: 'Truck'
  },
  'gold-loan': {
    id: 'gold-loan',
    title: 'Gold Loan',
    alt: 'Gold Loan service icon for instant spot cash against gold ornaments in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#EAB308', // gold/yellow
    badgeText: '15 Min Cash',
    iconName: 'Coins'
  },
  'mortgage-loan': {
    id: 'mortgage-loan',
    title: 'Mortgage Loan',
    alt: 'Mortgage Loan Against Property (LAP) service icon in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#7C3AED', // purple
    badgeText: 'Up to ₹2 Cr',
    iconName: 'Landmark'
  },
  'agriculture-loan': {
    id: 'agriculture-loan',
    title: 'Agriculture Loan',
    alt: 'Agriculture and Kisan Credit Card loan service icon for farmers in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#16A34A', // green
    badgeText: 'Kisan Support',
    iconName: 'Wheat'
  },
  'credit-card': {
    id: 'credit-card',
    title: 'Credit Card',
    alt: 'Lifetime free Credit Card service icon with 50-day grace period in Basavakalyan',
    width: 64,
    height: 64,
    accentColor: '#E11D48', // rose
    badgeText: 'Lifetime Free',
    iconName: 'CreditCard'
  }
};
