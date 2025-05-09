/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2E8B57',
          600: '#257045',
        },
        secondary: {
          500: '#00AEEF',
          600: '#008bbf',
        },
        accent: {
          500: '#FF6B35',
          600: '#cc562a',
        },
        background: {
          DEFAULT: '#F9F9F9',
        },
        text: {
          dark: '#333333',
          light: '#AAAAAA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};