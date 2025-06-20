/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDF7E7',
          100: '#F9EDCF',
          200: '#F4E4B7',
          300: '#EFDA9F',
          400: '#EAD187',
          500: '#E5C76F',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Crimson Text', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};