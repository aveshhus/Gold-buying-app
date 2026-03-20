'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { componentStyles, decorative, animations } from '@/lib/design-system';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface GradientCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  delay?: number;
  index?: number;
  showPulseDot?: boolean;
  pulseDotColor?: 'white' | 'green';
  className?: string;
  onClick?: () => void;
}

export function GradientCard({
  title,
  value,
  description,
  icon: Icon,
  delay = 0,
  index = 0,
  showPulseDot = false,
  pulseDotColor = 'white',
  className = '',
  onClick,
}: GradientCardProps) {
  const animationDelay = delay || animations.stagger(index, 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={onClick ? 'cursor-pointer' : ''}
      onClick={onClick}
    >
      <Card className={`${componentStyles.statCard.base.replace('shadow-xl', 'shadow-lg')} ${componentStyles.statCard.hover} ${className}`}>
        {/* Decorative Elements */}
        <div className={decorative.overlayHover}></div>
        <div className={decorative.circleMedium}></div>
        <div className={decorative.circleTiny}></div>
        {showPulseDot && (
          <div className="absolute top-4 right-4">
            <div className={pulseDotColor === 'green' ? decorative.pulseDotGreen : decorative.pulseDot}></div>
          </div>
        )}

        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2">
            <motion.div
              className="text-2xl font-bold text-white tracking-tight"
              initial={animations.scaleIn.initial}
              animate={animations.scaleIn.animate}
              transition={{ delay: animationDelay + 0.2 }}
            >
              {value}
            </motion.div>
            {description && (
              <div className="text-xs text-white/85 font-semibold uppercase tracking-wide">
                {description}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

