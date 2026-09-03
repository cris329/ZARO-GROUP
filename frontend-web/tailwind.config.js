/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#d4a843',
          500: '#b8922e',
          600: '#9a7b1f',
          700: '#7c6416',
          800: '#5e4d10',
          900: '#3f340b',
        },
        charcoal: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#1a1a1a',
          900: '#0d0d0d',
          950: '#050505',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card-light': '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-dark': '0 4px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 168, 67, 0.15)',
        'gold': '0 4px 16px rgba(184, 146, 46, 0.3)',
      },
    },
  },
  plugins: [],
}
