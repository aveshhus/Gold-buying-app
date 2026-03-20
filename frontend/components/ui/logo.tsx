'use client';

import React from 'react';

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'simplified';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'primary', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-28 h-28',
    md: 'w-[128px] h-[128px]',
    lg: 'w-48 h-48',
  };

  const textSizes = {
    sm: { shree: 'text-xs', omji: 'text-lg', saraf: 'text-[8px]' },
    md: { shree: 'text-sm', omji: 'text-2xl', saraf: 'text-[10px]' },
    lg: { shree: 'text-base', omji: 'text-4xl', saraf: 'text-xs' },
  };

  if (variant === 'simplified') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
          {/* Heritage Frame - Simplified */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Arch outline */}
            <path
              d="M10 20 Q50 5 90 20 L90 100 Q50 115 10 100 Z"
              stroke="#E79A66"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Decorative dots */}
            <circle cx="20" cy="30" r="2" fill="#E79A66" />
            <circle cx="80" cy="30" r="2" fill="#E79A66" />
            <circle cx="50" cy="110" r="2" fill="#E79A66" />
          </svg>
          <div className="relative z-10 font-serif font-bold text-brand-maroon">OS</div>
        </div>
        <span className="font-serif text-brand-maroon text-sm">saraf</span>
      </div>
    );
  }

  if (variant === 'secondary') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-serif ${textSizes[size].shree} text-brand-maroon`}>shri</span>
        <span className={`font-sans font-bold ${textSizes[size].omji} text-brand-maroon relative`}>
          omji
          <span className="absolute -top-1 right-0 text-[0.6em]">💎</span>
        </span>
        <span className={`font-serif ${textSizes[size].saraf} text-brand-maroon`}>saraf</span>
      </div>
    );
  }

  // Primary Logo with Heritage Frame
  return (
    <div className={`${sizeClasses[size]} relative flex flex-col items-center justify-center ${className}`}>
      {/* Heritage Frame - Arch with decorative elements */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main arch outline - traditional Indian arch shape */}
        <path
          d="M20 30 Q60 12 100 30 L100 110 Q60 128 20 110 Z"
          stroke="#E79A66"
          strokeWidth="2"
          fill="none"
        />
        {/* Decorative dots on vertical sides */}
        <circle cx="30" cy="40" r="2.5" fill="#E79A66" />
        <circle cx="90" cy="40" r="2.5" fill="#E79A66" />
        <circle cx="60" cy="120" r="2.5" fill="#E79A66" />
        {/* Decorative circle at top peak */}
        <circle cx="60" cy="20" r="3" fill="#E79A66" />
      </svg>

      {/* Logo Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-2">
        {/* Shree - with horizontal lines and diamond */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="h-px w-3 bg-brand-beige"></div>
          <span className={`font-serif font-semibold ${textSizes[size].shree} text-brand-beige tracking-wide`}>
            Shree
          </span>
          <div className="h-px w-3 bg-brand-beige"></div>
          {/* Diamond icon */}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 0 L8 4 L4 8 L0 4 Z" stroke="#E79A66" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        
        {/* OMJI - Large, bold, connected letters */}
        <span className={`font-sans font-bold ${textSizes[size].omji} text-brand-beige leading-none mb-0.5 tracking-tight`}>
          OMJI
        </span>
        
        {/* saraf - Small, lowercase */}
        <span className={`font-serif ${textSizes[size].saraf} text-brand-beige lowercase tracking-wide`}>
          saraf
        </span>
      </div>
    </div>
  );
}

