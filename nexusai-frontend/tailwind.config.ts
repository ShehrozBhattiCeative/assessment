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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1a6bb5',
          900: '#0f4c81',
          DEFAULT: '#0f4c81',
          dark: '#0a3560',
          light: '#1a6bb5',
        },
        accent: {
          DEFAULT: '#e8734a',
          light: '#f59371',
          dark: '#c05a35',
        },
        nexus: {
          bg: '#f8fafc',
          surface: '#f0f7ff',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-in': 'slideIn 0.6s ease forwards',
        'count-up': 'countUp 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        primary: '0 4px 14px 0 rgb(15 76 129 / 0.25)',
        accent: '0 4px 14px 0 rgb(232 115 74 / 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
