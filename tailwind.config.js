/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pottery: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#e8dfd0',
          300: '#d9cab1',
          400: '#c4aa87',
          500: '#b08968',
          600: '#9d7a5d',
          700: '#83654f',
          800: '#6d5444',
          900: '#5a4639',
        }
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
