'use client';

import { componentStyles } from '@/lib/design-system';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface SectionHeaderProps {
  title: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'info';
  className?: string;
}

export function SectionHeader({ 
  title, 
  badge, 
  badgeVariant = 'default',
  className = '' 
}: SectionHeaderProps) {
  const badgeStyles = {
    default: 'bg-[#92422B]/10 border-[#92422B]/20 text-[#681412]',
    success: 'bg-green-100 border-green-200 text-green-800',
    info: 'bg-blue-100 border-blue-200 text-blue-800',
  };

  return (
    <div className={`${componentStyles.sectionHeader.container} ${className} flex-col sm:flex-row sm:items-center gap-3 sm:gap-4`}>
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <div className={componentStyles.sectionHeader.divider}></div>
        <h3 className={`${componentStyles.sectionHeader.title} text-lg sm:text-xl`}>{title}</h3>
      </div>
      <div className={`${componentStyles.sectionHeader.fadeDivider} hidden sm:block flex-1`}></div>
      {badge && (
        <Badge className={`${componentStyles.sectionHeader.badge} ${badgeStyles[badgeVariant]} self-start sm:self-auto`}>
          <span className={componentStyles.sectionHeader.badgeText}>{badge}</span>
        </Badge>
      )}
    </div>
  );
}

