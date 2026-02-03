import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Blue palette - richer, higher contrast
        'blue-50': '#ECF2FF',
        'blue-100': '#D9E6FF',
        'blue-200': '#B3C6FF',
        'blue-300': '#8AA8FF',
        'blue-400': '#6687FF',
        'blue-500': '#3F63FF',
        'blue-600': '#2C4FFF',
        'blue-700': '#2139CC',
        'blue-800': '#1B2E99',
        'blue-900': '#132266',

        // Violet + Pink accents
        'purple-50': '#F1EDFF',
        'purple-100': '#E0D7FF',
        'purple-200': '#C5B5FF',
        'purple-400': '#9A7BFF',
        'purple-600': '#7C3AED',
        'pink-200': '#FFD1F1',
        'pink-400': '#FF8BD5',
        'pink-600': '#F43F9B',

        // Teal + Cyan accents
        'teal-200': '#A7F3E3',
        'teal-400': '#4DD7B7',
        'teal-600': '#16AFA0',
        'cyan-200': '#BEEBFF',
        'cyan-400': '#6ED0FF',
        'cyan-600': '#1DA7E8',

        // Brand colors (LIGHT ONLY)
        primary: '#2F80ED',
        secondary: '#ECF2FF',
        'medium-grey': '#3F63FF',
        'light-grey': '#ECF2FF',
        'accent-glow': '#B3C6FF',
      },
      backgroundColor: {
        default: '#FFFFFF',
        'light-bg': '#F5F7FA',
        'soft-blue': '#EAF2FF',
      },
      textColor: {
        default: '#111111',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #EAF2FF 0%, #D9E6FF 45%, #B3C6FF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFFFF 0%, #EAF2FF 50%, #D9E6FF 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #ECF2FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #B3C6FF 0%, #8AA8FF 50%, #6687FF 100%)',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(44, 79, 255, 0.1)',
        'soft-md': '0 4px 16px rgba(44, 79, 255, 0.16)',
        'soft-lg': '0 12px 24px rgba(124, 58, 237, 0.18)',
        'glow': '0 0 24px rgba(244, 63, 155, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.65' },
        },
        scrollReveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'scroll-reveal': 'scrollReveal 0.8s ease-out forwards',
      },
      animationDelay: {
        '0': '0ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '40px' }],
        '4xl': ['40px', { lineHeight: '48px' }],
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
