/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2e9',
          100: '#cce6d3',
          200: '#99ccaa',
          300: '#66b380',
          400: '#339957',
          500: '#2E8B57', // Forest Green
          600: '#257045',
          700: '#1c5534',
          800: '#133a22',
          900: '#0a1f11',
        },
        secondary: {
          50: '#e6f7ff',
          100: '#ccefff',
          200: '#99dfff',
          300: '#66cfff',
          400: '#33bfff',
          500: '#00AEEF', // Sky Blue
          600: '#008bbf',
          700: '#00688f',
          800: '#004560',
          900: '#002230',
        },
        accent: {
          50: '#fff2e6',
          100: '#ffe6cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#FF6B35', // Sunset Orange
          600: '#cc562a',
          700: '#994020',
          800: '#662b15',
          900: '#33150a',
        },
        background: {
          DEFAULT: '#F9F9F9', // Off-White
        },
        text: {
          dark: '#333333', // Charcoal Gray
          light: '#AAAAAA', // Light Gray
        },
        success: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4CAF50', // Moss Green
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        badge: {
          sand: '#F4A460',
          ocean: '#1E90FF',
          stone: '#A9A9A9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        adventure: ['"Bungee"', 'cursive'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.5rem',
      },
      backgroundImage: {
        'gradient-nature': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}; 