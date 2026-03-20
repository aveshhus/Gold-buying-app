'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { componentStyles, decorative, animations } from '@/lib/design-system';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface InfoCardProps {
  title: string;
  items: Array<{
    text: string;
  }>;
  icon: LucideIcon;
  delay?: number;
  hoverDirection?: 'left' | 'right';
  className?: string;
}

export function InfoCard({
  title,
  items,
  icon: Icon,
  delay = 0,
  hoverDirection = 'left',
  className = '',
}: InfoCardProps) {
  const hoverAnimation = hoverDirection === 'left' 
    ? { x: -5 } 
    : { x: 5 };

  return (
    <motion.div
      initial={hoverDirection === 'left' ? animations.fadeInLeft.initial : animations.fadeInRight.initial}
      animate={hoverDirection === 'left' ? animations.fadeInLeft.animate : animations.fadeInRight.animate}
      transition={{ ...animations.spring, delay }}
      whileHover={hoverAnimation}
    >
      <Card className={`${componentStyles.infoCard.base} ${className} relative overflow-hidden mobile-card-shadow`}>
        {/* Decorative Elements */}
        <div className={decorative.overlayHover}></div>
        <div className={decorative.circleMedium}></div>
        <div className={decorative.circleTiny}></div>
        
        <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 relative z-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={componentStyles.infoCard.iconContainer}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`${componentStyles.infoCard.title} text-sm sm:text-base`}>{title}</h3>
              <ul className={`${componentStyles.infoCard.text} text-xs sm:text-sm`}>
                {items.map((item, index) => (
                  <li key={index} className={componentStyles.infoCard.listItem}>
                    <div className={componentStyles.infoCard.bullet}></div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

