'use client';

import { motion } from 'framer-motion';
import { componentStyles, animations } from '@/lib/design-system';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    label: string;
    value: string | number;
    icon?: LucideIcon;
  };
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  badge,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`${componentStyles.pageHeader.container} ${className}`}>
      <div className={componentStyles.pageHeader.titleContainer}>
        <div className={componentStyles.pageHeader.titleRow}>
          <div className={componentStyles.pageHeader.dot}></div>
          <h2 className={componentStyles.pageHeader.title}>
            {title}
          </h2>
        </div>
        {description && (
          <p className={componentStyles.pageHeader.description}>
            {description}
          </p>
        )}
      </div>
      {badge && (
        <motion.div
          className={componentStyles.pageHeader.badge}
          whileHover={animations.hoverScale}
          whileTap={{ scale: 0.95 }}
        >
          {badge.icon && (
            <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
              <badge.icon className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-[100px]">
            <p className="text-xs text-white/80 font-medium leading-tight">{badge.label}</p>
            <p className="text-lg font-bold leading-tight mt-0.5">{badge.value}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

