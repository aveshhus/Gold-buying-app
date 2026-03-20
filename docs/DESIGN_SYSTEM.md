# Design System Documentation
## Gold & Silver Purchase Platform

---

## 🎨 Design Tokens

### Colors

```typescript
// Primary Palette (Gold)
export const colors = {
  gold: {
    50: '#fffef7',
    100: '#fffceb',
    200: '#fff8d1',
    300: '#fff2a8',
    400: '#ffe875',
    500: '#ffd700', // Primary gold
    600: '#e6c200',
    700: '#cc9900',
    800: '#b38600',
    900: '#997300',
  },
  silver: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#6c757d',
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#0d1117',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
}
```

### Typography

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
```

### Spacing

```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
}
```

### Shadows

```typescript
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}
```

---

## 🧩 Component Specifications

### Button Variants
- **Primary**: Gold gradient, white text
- **Secondary**: Gray outline, gold text on hover
- **Ghost**: Transparent, text only
- **Danger**: Red background for destructive actions

### Card Components
- **Price Card**: Elevated shadow, gold accent border
- **Info Card**: Subtle background, icon + text
- **Stat Card**: Large number, trend indicator

### Form Components
- **Input**: Rounded corners, focus ring, error states
- **Select**: Custom dropdown with search
- **Checkbox/Radio**: Custom styled, accessible
- **Date Picker**: Calendar popup

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- Color contrast ratio: Minimum 4.5:1 (text), 3:1 (UI)
- Keyboard navigation: All interactive elements
- Screen reader support: ARIA labels, roles
- Focus indicators: Visible focus rings
- Error messages: Clear, descriptive, associated with inputs

---

## 📱 Responsive Breakpoints

```typescript
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

---

## 🎭 Animation Guidelines

### Timing Functions
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)`
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)`
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)`

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (standard transitions)
- **Slow**: 500ms (page transitions)

### Motion Principles
- Respect `prefers-reduced-motion`
- Use meaningful animations (not decorative)
- Maintain 60fps performance

---

*Design System v1.0*
