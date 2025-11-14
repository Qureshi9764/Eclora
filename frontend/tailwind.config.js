/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FADADD',        // soft blush pink
        secondary: '#1C1C1C',      // deep charcoal
        accent: '#B37BA4',         // lavender blush
        background: '#FFF9F8',     // off-white
        text: '#2E2E2E',           // dark text
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

