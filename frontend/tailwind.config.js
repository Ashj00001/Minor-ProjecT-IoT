/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#090e15',
          900: '#0f1722',
          850: '#131d2b',
          800: '#1a2638',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          950: '#022c22',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
