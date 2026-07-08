/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sharp Orange - primary action
        orange: {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffcda8',
          300: '#ffa970',
          400: '#ff7d3a',
          500: '#ff5500',
          600: '#e04a00',
          700: '#bc3d00',
          800: '#983200',
          900: '#7c2b00',
        },
        // Luxe Green - success states
        luxegreen: {
          50: '#e9f9f0',
          100: '#c9f0dc',
          200: '#94e1bd',
          300: '#5bcd97',
          400: '#35b778',
          500: '#27ae60',
          600: '#1f8d4e',
          700: '#1c7140',
          800: '#1a5a35',
          900: '#164a2d',
        },
        // Luxe White - cards
        luxewhite: {
          DEFAULT: '#fbfbfb',
          50: '#ffffff',
          100: '#f7f7f7',
          200: '#eeeeee',
          300: '#e2e2e2',
        },
        // Deep luxe dark backgrounds
        nocturne: '#0e2410',
        onyx: '#0b0b0b',
        ember: '#5c2100',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Playfair Display',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
      },
      boxShadow: {
        luxe: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.12)',
        'luxe-lg':
          '0 4px 8px -2px rgba(0,0,0,0.06), 0 24px 48px -12px rgba(0,0,0,0.25)',
        glow: '0 8px 32px -8px rgba(255,85,0,0.45)',
        'glow-green': '0 8px 32px -8px rgba(39,174,96,0.45)',
        glass: '0 8px 32px -8px rgba(0,0,0,0.5)',
      },
      backdropBlur: {
        xs: '2px',
        luxe: '24px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        'slide-in-right': 'slide-in-right 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
        'check-pop': 'check-pop 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
