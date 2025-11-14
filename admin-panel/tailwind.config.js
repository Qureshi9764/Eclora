/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f3',
          100: '#fde6e8',
          200: '#fbd0d6',
          300: '#f7aab4',
          400: '#f27b8d',
          500: '#e84d67',
          600: '#d32f52',
          700: '#b22343',
          800: '#951f3f',
          900: '#7f1d3b',
          950: '#470b1c',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e9fe',
          200: '#e9d6fd',
          300: '#d7b5fb',
          400: '#bf89f7',
          500: '#B37BA4',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        pink: {
          light: '#FADADD',
          DEFAULT: '#FADADD',
        },
        neutral: {
          light: '#FFF9F8',
          DEFAULT: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

