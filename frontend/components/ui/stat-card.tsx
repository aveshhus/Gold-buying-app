'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { componentStyles, decorative, animations } from '@/lib/design-system';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  footer?: string;
  icon: LucideIcon;
  delay?: number;
  index?: number;
  showPulseDot?: boolean;
  pulseDotColor?: 'white' | 'green';
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  footer,
  icon: Icon,
  delay = 0,
  index = 0,
  showPulseDot = false,
  pulseDotColor = 'white',
  className = '',
}: StatCardProps) {
  const animationDelay = delay || animations.stagger(index, 0.1);

  return (
    <motion.div
      initial={animations.fadeInUp.initial}
      animate={animations.fadeInUp.animate}
      transition={{ ...animations.spring, delay: animationDelay }}
      whileHover={animations.hoverLift}
      className="cursor-pointer"
    >
      <Card className={`${componentStyles.statCard.base} ${componentStyles.statCard.hover} ${className} relative overflow-hidden mobile-card-shadow`}>
        {/* Decorative Elements */}
        <div className={decorative.overlayHover}></div>
        <div className={decorative.circleLarge}></div>
        <div className={decorative.circleSmall}></div>
        {showPulseDot && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className={pulseDotColor === 'green' ? decorative.pulseDotGreen : decorative.pulseDot}></div>
          </div>
        )}

        <CardHeader className="pb-3 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className={`${componentStyles.statCard.title} text-sm sm:text-base`}>
            <div className={componentStyles.statCard.iconContainer}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
          <motion.div
            className={`${componentStyles.statCard.value} text-xl sm:text-2xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.1 }}
          >
            {value}
          </motion.div>
          {description && (
            <p className={`${componentStyles.statCard.description} text-xs sm:text-sm`}>{description}</p>
          )}
          {footer && (
            <div className={componentStyles.statCard.divider}>
              <p className={`${componentStyles.statCard.footer} text-[10px] sm:text-xs`}>{footer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

