'use client';

import { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';

interface HeritageFrameProps {
  children?: ReactNode;
  variant?: 'full' | 'top' | 'bottom' | 'sides' | 'overlay';
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  animated?: boolean;
}

/**
 * HeritageFrame Component
 * 
 * A decorative frame element inspired by traditional Indian architecture (Mughal/Rajasthani/Islamic motifs).
 * This elegant archway frame reflects the heritage and timelessness of India's past, evoking a sense
 * of tradition and grandeur that aligns with the jewelry brand's heritage.
 * 
 * It symbolizes the gateway to a world of exquisite craftsmanship and artistry, inviting customers
 * to explore the rich legacy and stories behind each piece of jewelry.
 * 
 * Based on the image: A continuous outline frame with a distinctive cusped/ogee archway at the top,
 * rendered in flat colors (light beige/orange-brown) against a deep reddish-brown background.
 */
export function HeritageFrame({
  children,
  variant = 'full',
  className = '',
  strokeColor = '#E79A66', // Light beige/orange-brown - flat color, no gradient
  strokeWidth = 2,
  animated = false, // Flat colors, no animation by default
}: HeritageFrameProps) {
  const frameId = useMemo(() => `heritage-frame-${Math.random().toString(36).substr(2, 9)}`, []);

  // SVG Path for the complete frame with cusped/ogee archway
  // The archway has multiple convex and concave curves (cusped/ogee shape)
  // Continuous outline: starts from bottom-left, goes up left side, curves into archway at top, down right side, across bottom
  const framePath = `
    M 0,100
    L 0,85
    Q 0,75 5,70
    Q 10,65 15,62
    Q 20,59 25,57
    Q 30,55 35,54
    Q 40,53 45,52.5
    Q 50,52 55,51.8
    Q 60,51.5 65,51.8
    Q 70,52 75,52.5
    Q 80,53 85,54
    Q 90,55 95,57
    Q 100,59 105,62
    Q 110,65 115,70
    Q 120,75 120,85
    L 120,100
    L 200,100
    L 200,85
    Q 200,75 195,70
    Q 190,65 185,62
    Q 180,59 175,57
    Q 170,55 165,54
    Q 160,53 155,52.5
    Q 150,52 145,51.8
    Q 140,51.5 135,51.8
    Q 130,52 125,52.5
    Q 120,53 115,54
    Q 110,55 105,57
    Q 100,59 95,62
    Q 90,65 85,70
    Q 80,75 80,85
    L 80,100
    Z
  `;

  // Alternative: More pronounced cusped archway with deeper curves
  const cuspedArchPath = `
    M 0,100
    L 0,80
    Q 0,70 3,65
    Q 6,60 10,57
    Q 14,54 18,52
    Q 22,50 26,49
    Q 30,48 34,47.5
    Q 38,47 42,46.8
    Q 46,46.5 50,46.3
    Q 54,46.1 58,46.3
    Q 62,46.5 66,46.8
    Q 70,47 74,47.5
    Q 78,48 82,49
    Q 86,50 90,52
    Q 94,54 97,57
    Q 100,60 103,65
    Q 106,70 110,75
    Q 114,80 118,82
    Q 122,84 126,85
    Q 130,86 134,86.5
    Q 138,87 142,87.2
    Q 146,87.4 150,87.2
    Q 154,87 158,86.5
    Q 162,86 166,85
    Q 170,84 174,82
    Q 178,80 182,75
    Q 186,70 189,65
    Q 192,60 195,57
    Q 198,54 200,52
    Q 200,50 200,48
    Q 200,46 198,45
    Q 196,44 194,43
    Q 192,42 190,41
    Q 188,40 186,39
    Q 184,38 182,37
    Q 180,36 178,35
    Q 176,34 174,33
    Q 172,32 170,31
    Q 168,30 166,29
    Q 164,28 162,27
    Q 160,26 158,25
    Q 156,24 154,23
    Q 152,22 150,21
    Q 148,20 146,19
    Q 144,18 142,17
    Q 140,16 138,15
    Q 136,14 134,13
    Q 132,12 130,11
    Q 128,10 126,9
    Q 124,8 122,7
    Q 120,6 118,5
    Q 116,4 114,3
    Q 112,2 110,1
    Q 108,0 106,0
    Q 104,0 102,1
    Q 100,2 98,3
    Q 96,4 94,5
    Q 92,6 90,7
    Q 88,8 86,9
    Q 84,10 82,11
    Q 80,12 78,13
    Q 76,14 74,15
    Q 72,16 70,17
    Q 68,18 66,19
    Q 64,20 62,21
    Q 60,22 58,23
    Q 56,24 54,25
    Q 52,26 50,27
    Q 48,28 46,29
    Q 44,30 42,31
    Q 40,32 38,33
    Q 36,34 34,35
    Q 32,36 30,37
    Q 28,38 26,39
    Q 24,40 22,41
    Q 20,42 18,43
    Q 16,44 14,45
    Q 12,46 10,48
    Q 8,50 6,52
    Q 4,54 3,57
    Q 2,60 1,65
    Q 0,70 0,80
    L 0,100
    Z
  `;

  // Complete continuous frame path matching the image description exactly
  // Rectangular base (straight horizontal line at bottom) with distinctive cusped/ogee archway at top
  // The archway has multiple convex and concave curves - classic Mughal/Rajasthani style
  // Path: Start bottom-left → up left side → cusped archway at top → down right side → across bottom (rectangular base)
  const continuousFramePath = `
    M 0,100
    L 0,85
    Q 0,75 3,70
    Q 6,65 10,62
    Q 14,59 18,57
    Q 22,55 26,54
    Q 30,53 34,52.5
    Q 38,52 42,51.8
    Q 46,51.5 50,51.5
    Q 54,51.5 58,51.8
    Q 62,52 66,52.5
    Q 70,53 74,54
    Q 78,55 82,57
    Q 86,59 90,62
    Q 94,65 97,70
    Q 100,75 100,85
    Q 100,75 103,70
    Q 106,65 110,62
    Q 114,59 118,57
    Q 122,55 126,54
    Q 130,53 134,52.5
    Q 138,52 142,51.8
    Q 146,51.5 150,51.5
    Q 154,51.5 158,51.8
    Q 162,52 166,52.5
    Q 170,53 174,54
    Q 178,55 182,57
    Q 186,59 190,62
    Q 194,65 197,70
    Q 200,75 200,85
    L 200,100
    Z
  `;

  const FrameSVG = () => (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${variant === 'overlay' ? 'z-0' : ''}`}
      preserveAspectRatio="none"
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Complete continuous frame outline with cusped archway */}
      {/* This creates a closed path: bottom-left → up left side → archway at top → down right side → across bottom */}
      {(variant === 'full' || variant === 'overlay') && (
        <path
          d={continuousFramePath}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: 'none'
          }}
        />
      )}
      
      {/* Top archway only */}
      {(variant === 'top') && (
        <path
          d="M 0,80 Q 0,60 8,50 Q 16,40 25,35 Q 35,30 45,28 Q 55,26 65,25 Q 75,24 85,23.5 Q 95,23 105,23.5 Q 115,24 125,25 Q 135,26 145,28 Q 155,30 165,35 Q 175,40 183,50 Q 191,60 200,80"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      
      {/* Bottom line only */}
      {(variant === 'bottom') && (
        <line
          x1="0"
          y1="100"
          x2="200"
          y2="100"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      )}
      
      {/* Side lines only */}
      {(variant === 'sides') && (
        <>
          <line
            x1="0"
            y1="100"
            x2="0"
            y2="80"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="200"
            y1="100"
            x2="200"
            y2="80"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );

  const containerClass = variant === 'overlay'
    ? `absolute inset-0 ${className}`
    : `
      relative
      ${variant === 'full' ? 'p-6' : variant === 'top' ? 'pt-8 px-6 pb-4' : variant === 'bottom' ? 'pb-8 px-6 pt-4' : 'px-6 py-4'}
      ${className}
    `;

  const frameWrapper = animated && variant !== 'overlay' ? motion.div : 'div';
  const Wrapper = frameWrapper as any;

  const wrapperProps = animated && variant !== 'overlay'
    ? {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: 'easeOut' },
      }
    : {};

  if (variant === 'overlay') {
    return <FrameSVG />;
  }

  return (
    <Wrapper {...wrapperProps} className={containerClass}>
      <FrameSVG />
      {children && <div className="relative z-10">{children}</div>}
    </Wrapper>
  );
}

/**
 * Compact HeritageFrame for smaller elements
 */
export function HeritageFrameCompact({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <HeritageFrame
      variant="top"
      strokeWidth={1.5}
      className={`${className} p-4`}
      animated={false}
    >
      {children}
    </HeritageFrame>
  );
}

/**
 * HeritageFrame for cards
 */
export function HeritageFrameCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <HeritageFrame
      variant="full"
      strokeWidth={2}
      className={`${className} rounded-lg`}
    >
      {children}
    </HeritageFrame>
  );
}

