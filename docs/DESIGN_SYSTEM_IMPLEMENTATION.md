# Design System Implementation Guide

## Overview

This document outlines the design system extracted from the portfolio view and how it's being applied consistently across the entire application.

## Design System Components Created

### 1. Design Tokens (`frontend/lib/design-system.ts`)

A comprehensive design system file containing:
- **Colors**: Brand colors (maroon, khaki, beige), text colors, status colors, transparency variants
- **Typography**: Font sizes, weights, letter spacing, line heights
- **Spacing**: Section spacing, grid gaps, padding values
- **Shadows**: All shadow variants used in the portfolio
- **Border Radius**: Consistent radius values
- **Gradients**: All gradient patterns (card backgrounds, text, buttons, dividers)
- **Animations**: Framer Motion animation presets (fadeInUp, fadeInDown, hover effects, etc.)
- **Component Styles**: Pre-defined style classes for cards, headers, tables, etc.
- **Decorative Elements**: Circle patterns, overlays, pulse dots

### 2. Reusable UI Components

#### `StatCard` (`frontend/components/ui/stat-card.tsx`)
- Gradient stat cards matching portfolio style
- Supports icons, descriptions, footers
- Built-in animations and hover effects
- Pulse dot indicators

#### `SectionHeader` (`frontend/components/ui/section-header.tsx`)
- Consistent section headers with gradient dividers
- Badge support with variants
- Matches portfolio section header style

#### `PageHeader` (`frontend/components/ui/page-header.tsx`)
- Page-level headers with title, description, and badge
- Gradient text titles
- Animated badge component

#### `GradientCard` (`frontend/components/ui/gradient-card.tsx`)
- Reusable gradient cards for purchased/delivered items
- Icon containers with backdrop blur
- Consistent decorative elements

#### `InfoCard` (`frontend/components/ui/info-card.tsx`)
- Information cards with bullet lists
- Supports left/right hover animations
- Matches portfolio info card style

## Implementation Status

### ✅ Completed
1. **Design System** - All design tokens extracted and organized
2. **Reusable Components** - All core UI components created
3. **Payments View** - Fully updated to match portfolio style

### 🔄 In Progress
- Purchase View
- Profile View
- Deliveries View
- Analytics View
- Price Chart & Alerts

## Usage Examples

### Using StatCard
```tsx
import { StatCard } from '@/components/ui/stat-card';
import { CheckCircle2 } from 'lucide-react';

<StatCard
  title="Total Paid"
  value={formatCurrency(totalPaid)}
  description={`${count} payments`}
  icon={CheckCircle2}
  index={0}
  showPulseDot
  pulseDotColor="green"
/>
```

### Using PageHeader
```tsx
import { PageHeader } from '@/components/ui/page-header';
import { Package } from 'lucide-react';

<PageHeader
  title="Payment History"
  description="View and manage your payments"
  badge={{
    label: 'Total Payments',
    value: payments.length,
    icon: Package,
  }}
/>
```

### Using SectionHeader
```tsx
import { SectionHeader } from '@/components/ui/section-header';

<SectionHeader
  title="All Payments"
  badge={payments.length}
/>
```

### Using Design Tokens Directly
```tsx
import { componentStyles, gradients, colors } from '@/lib/design-system';

<Card className={componentStyles.statCard.base}>
  <div className={gradients.textPrimary}>Title</div>
</Card>
```

## Design Patterns

### Card Pattern
- Gradient background: `bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B]`
- White text
- Decorative circles (absolute positioned)
- Hover effects: scale, shadow, overlay
- Icon containers with backdrop blur

### Section Pattern
- Gradient divider dot: `h-1 w-12 bg-gradient-to-r from-[#681412] to-[#92422B]`
- Title: `text-xl font-bold text-[#681412] tracking-tight`
- Fade divider line
- Badge with brand colors

### Table Pattern
- Glassmorphism container: `bg-white/60 backdrop-blur-sm`
- Gradient header: `bg-gradient-to-r from-[#92422B]/10 via-[#92422B]/5 to-transparent`
- Staggered row animations
- Hover effects on rows

### Animation Pattern
- Initial: `{ opacity: 0, y: 30 }`
- Animate: `{ opacity: 1, y: 0 }`
- Transition: `{ type: "spring", stiffness: 100, delay: index * 0.1 }`
- Hover: `{ y: -8, scale: 1.02 }`

## Next Steps

1. Update remaining dashboard components to use the design system
2. Ensure all components follow the same spacing, typography, and color patterns
3. Test responsive design across all breakpoints
4. Verify accessibility (ARIA labels, keyboard navigation)
5. Document any component-specific variations

## Consistency Checklist

When updating components, ensure:
- ✅ Uses design system tokens
- ✅ Matches portfolio spacing (space-y-10 for sections)
- ✅ Uses gradient cards for stats
- ✅ Implements proper animations
- ✅ Follows typography scale
- ✅ Uses brand colors consistently
- ✅ Includes decorative elements where appropriate
- ✅ Responsive design (md:, lg: breakpoints)
- ✅ Proper loading states
- ✅ Empty states match portfolio style

