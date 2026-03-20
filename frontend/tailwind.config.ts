import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        grance: ['Grance', 'var(--font-grance)', 'Georgia', 'serif'],
        sans: ['Grance', 'var(--font-grance)', 'system-ui', 'sans-serif'],
        serif: ['Grance', 'var(--font-grance)', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Shree Omji Saraf Brand Colors (exact from brand guide)
        brand: {
          maroon: '#681412',      // Deep Maroon
          khaki: '#92422B',       // Pinkish Khaki
          beige: '#E79A66',       // Light Beige
          'light-beige': '#D5BAA7', // Light Pinkish Beige
        },
        primary: {
          DEFAULT: '#681412', // Brand Maroon
          50: '#f5e6e6',
          100: '#e8cccc',
          200: '#d9a8a8',
          300: '#c88484',
          400: '#b76060',
          500: '#681412', // Base maroon
          600: '#5a1110',
          700: '#4c0e0e',
          800: '#3e0b0c',
          900: '#30080a',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#92422B', // Brand Khaki
          50: '#f5ebe6',
          100: '#e8d4cc',
          200: '#d9b8a8',
          300: '#c89c84',
          400: '#b78060',
          500: '#92422B', // Base khaki
          600: '#7a3724',
          700: '#622c1d',
          800: '#4a2116',
          900: '#32160f',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#E79A66', // Brand Beige
          50: '#fdf5f0',
          100: '#fae8dc',
          200: '#f5d1b8',
          300: '#f0ba94',
          400: '#eba370',
          500: '#E79A66', // Base beige
          600: '#d18a55',
          700: '#b87544',
          800: '#9f6033',
          900: '#864b22',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
