import React from 'react';
import { 
  UserCheck, 
  Home, 
  Building2, 
  Truck, 
  Coins, 
  Landmark, 
  Wheat, 
  CreditCard,
  LucideIcon
} from 'lucide-react';
import { SERVICE_ICONS_MAP } from '../utils/imageOptimizer';

export interface ServiceIconProps {
  categoryId: string;
  size?: number;
  className?: string;
  showBadge?: boolean;
}

const ICON_COMPONENTS: Record<string, LucideIcon> = {
  UserCheck,
  Home,
  Building2,
  Truck,
  Coins,
  Landmark,
  Wheat,
  CreditCard
};

/**
 * ServiceIcon: Optimized, accessible service icon with explicit width, height, and alt attributes
 * Designed to eliminate layout shift and improve Core Web Vitals.
 */
export const ServiceIcon: React.FC<ServiceIconProps> = ({
  categoryId,
  size = 48,
  className = '',
  showBadge = false
}) => {
  const config = SERVICE_ICONS_MAP[categoryId] || {
    id: categoryId,
    title: 'Loan Service',
    alt: `${categoryId} loan service icon in Basavakalyan`,
    width: size,
    height: size,
    accentColor: '#D9381E',
    badgeText: 'Verified',
    iconName: 'Building2'
  };

  const IconComp = ICON_COMPONENTS[config.iconName] || Building2;
  const innerIconSize = Math.round(size * 0.55);

  return (
    <div 
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-2xl transition-transform ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: `${config.accentColor}15`,
        border: `1.5px solid ${config.accentColor}30`
      }}
      role="img"
      aria-label={config.alt}
    >
      <IconComp 
        size={innerIconSize}
        color={config.accentColor}
        strokeWidth={2.2}
        className="transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
      {showBadge && (
        <span 
          className="absolute -bottom-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-xs whitespace-nowrap"
          style={{ backgroundColor: config.accentColor }}
        >
          {config.badgeText}
        </span>
      )}
    </div>
  );
};
